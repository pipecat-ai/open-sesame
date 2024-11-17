from pipecat.processors.aggregators.llm_response import LLMUserContextAggregator
from pipecat.processors.frameworks.rtvi import (
    RTVIConfig,
    RTVIProcessor,
    RTVIServiceConfig,
    RTVIServiceOptionConfig,
)

from bots.rtvi_actions import register_rtvi_actions
from bots.rtvi_services import register_rtvi_services
from bots.types import BotConfig


async def create_rtvi_processor(
    bot_config: BotConfig,
    user_aggregator: LLMUserContextAggregator,
) -> RTVIProcessor:
    config = bot_config.config

    #
    # RTVI default config
    #
    default_config = RTVIConfig(
        config=[
            RTVIServiceConfig(
                service="llm",
                options=[RTVIServiceOptionConfig(name="model", value="llama3-70b-8192")],
            ),
            RTVIServiceConfig(
                service="tts",
                options=[
                    RTVIServiceOptionConfig(
                        name="voice", value="79a125e8-cd45-4c13-8a67-188112f4dd22"
                    )  # English Lady (Cartesia)
                ],
            ),
        ]
    )

    #
    # RTVI processor
    #

    config = RTVIConfig(config=config) if config else default_config

    rtvi = RTVIProcessor(config=config)

    await register_rtvi_services(rtvi, user_aggregator)
    await register_rtvi_actions(rtvi, user_aggregator)

    return rtvi
