import asyncio
from typing import Any, AsyncGenerator, Tuple, cast

from bots.context_storage import PersistentContextStorage
from bots.http.frame_serializer import BotFrameSerializer
from bots.rtvi import create_rtvi_processor
from bots.types import BotConfig, BotParams
from common.models import Service
from common.service_factory import ServiceFactory, ServiceType
from fastapi import HTTPException, status
from openai._types import NOT_GIVEN
from pipecat.pipeline.pipeline import Pipeline
from pipecat.pipeline.runner import PipelineRunner
from pipecat.pipeline.task import PipelineTask
from pipecat.processors.async_generator import AsyncGeneratorProcessor
from pipecat.processors.frameworks.rtvi import (
    RTVIActionRun,
    RTVIBotLLMProcessor,
    RTVIMessage,
    RTVIProcessor,
)
from pipecat.services.ai_services import LLMService, OpenAILLMContext
from sqlalchemy.ext.asyncio import AsyncSession


async def http_bot_pipeline(
    params: BotParams,
    config: BotConfig,
    services: dict[str, Service],
    messages,
    db: AsyncSession,
    language_code: str = "english",
) -> Tuple[AsyncGenerator[Any, None], Any]:
    if "llm" not in services:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Service `llm` not available in provided services.",
        )

    try:
        llm = cast(
            LLMService,
            ServiceFactory.get_service(
                str(services["llm"].service_provider),
                ServiceType.ServiceLLM,
                str(services["llm"].api_key),
                getattr(services["llm"], "options"),
            ),
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating LLM service: {e}",
        )

    tools = NOT_GIVEN
    context = OpenAILLMContext(messages, tools)
    context_aggregator = llm.create_context_aggregator(
        context, assistant_expect_stripped_words=False
    )
    user_aggregator = context_aggregator.user()
    assistant_aggregator = context_aggregator.assistant()

    context_storage = PersistentContextStorage(
        db=db, conversation_id=params.conversation_id, context=context, language_code=language_code
    )

    async_generator = AsyncGeneratorProcessor(serializer=BotFrameSerializer())

    #
    # RTVI
    #

    rtvi = await create_rtvi_processor(config, user_aggregator)

    #
    # Processing
    #

    # This will send `bot-llm-*` messages.
    rtvi_bot_llm = RTVIBotLLMProcessor()

    processors = [
        rtvi,
        user_aggregator,
        context_storage.create_processor(),
        llm,
        rtvi_bot_llm,
        async_generator,
        assistant_aggregator,
        context_storage.create_processor(exit_on_endframe=True),
    ]

    pipeline = Pipeline(processors)

    runner = PipelineRunner(handle_sigint=False)

    task = PipelineTask(pipeline)

    runner_task = asyncio.create_task(runner.run(task))

    @rtvi.event_handler("on_bot_started")
    async def on_bot_started(rtvi: RTVIProcessor):
        # Handle RTVI messages. Usually (mostly always) we want to push frames, but
        # since `rtvi` is the first element of the pipeline it's OK to call
        # `handle_message()` directly.
        for message in params.actions:
            await rtvi.handle_message(message)

        # This is a single turn, so we just push an action to stop the running
        # pipeline task.
        action = RTVIActionRun(service="system", action="end")
        message = RTVIMessage(type="action", id="END", data=action.model_dump())
        await rtvi.handle_message(message)

    return (async_generator.generator(), runner_task)
