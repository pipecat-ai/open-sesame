from enum import Enum
from typing import Any, Dict, List, Mapping, Optional

from common.errors import InvalidServiceTypeError, UnsupportedServiceError
from pipecat.services.ai_services import AIService
from pipecat.utils.text.markdown_text_filter import MarkdownTextFilter
from pydantic import BaseModel


class ServiceDefinition(BaseModel):
    class_path: str
    service_type: str
    requires_api_key: bool
    optional_params: List[str]
    required_params: List[str]
    default_params: Dict[str, Any]

    model_config = {
        "arbitrary_types_allowed": True,
        "extra": "forbid",
    }


class ServiceInfo(BaseModel):
    service_name: str
    service_type: str
    requires_api_key: bool
    optional_params: List[str]
    required_params: List[str]


class ServiceType(Enum):
    """Enum representing different types of AI services."""

    ServiceSTT = "stt"  # Speech to Text
    ServiceLLM = "llm"  # Language Models
    ServiceTTS = "tts"  # Text to Speech
    ServiceTransport = "transport"  # Transport


class ServiceFactory:
    """A factory class for creating and managing AI services."""

    _services: Dict[tuple[str, ServiceType], ServiceDefinition] = {}

    @classmethod
    def register_service(
        cls,
        service_class: str,
        service_name: str,
        service_type: ServiceType,
        requires_api_key: bool = True,
        default_params: Optional[Dict[str, Any]] = None,
        optional_params: Optional[List[str]] = None,
        required_params: Optional[List[str]] = None,
    ) -> None:
        """
        Register a new service with the factory.

        Args:
            service_class: String of module / class to instantiate for this service (lazy loaded)
            service_name: String identifier for the service
            service_type: Type of service (STT, LLM, TTS)
            requires_api_key: Whether this service requires an API key
            default_params: Default parameters to use when constructing this service
            optional_params: List of optional parameters this service accepts
            required_params: List of required parameters for service initialization
        """
        service_key = (service_name, service_type)
        if service_key in cls._services:
            raise ValueError(
                f"Service '{service_name}' of type {service_type.value} is already registered"
            )

        cls._services[service_key] = ServiceDefinition(
            class_path=service_class,
            service_type=service_type.value,
            requires_api_key=requires_api_key,
            optional_params=optional_params or [],
            required_params=required_params or [],
            default_params=default_params or {},
        )

    @classmethod
    def get_service(
        cls,
        service_name: str,
        service_type: ServiceType,
        api_key: str,
        service_options: Optional[Mapping[str, Mapping[str, Any]]] = None,
    ) -> AIService:
        """
        Create and return an instance of the requested service.
        """
        service_key = (service_name, service_type)
        if service_key not in cls._services:
            raise ValueError(
                f"Service '{service_name}' of type {service_type.value} is not registered"
            )

        service_info = cls._services[service_key]

        # Start with default params
        kwargs = service_info.default_params.copy()

        # Handle API key
        if service_info.requires_api_key:
            if not api_key:
                raise ValueError(f"API key required for service '{service_name}'")
            kwargs["api_key"] = api_key

        # Check required parameters
        for param in service_info.required_params:
            if (service_options is None or param not in service_options) and param not in kwargs:
                raise ValueError(
                    f"Required parameter '{param}' missing for service '{service_name}'"
                )
            if service_options and param in service_options:
                kwargs[param] = service_options[param]

        # Add optional parameters if provided
        for param in service_info.optional_params:
            if service_options and param in service_options:
                kwargs[param] = service_options[param]

        # Add any additional provided parameters that aren't in optional or required lists
        if service_options:
            for key, value in service_options.items():
                if key not in kwargs and key != "api_key":
                    kwargs[key] = value

        # Instantiate the service
        module_name, class_name = service_info.class_path.rsplit(":", 1)
        module = __import__(module_name, fromlist=[class_name])
        service_class = getattr(module, class_name)

        return service_class(**kwargs)

    @classmethod
    def get_service_defintion(
        cls, service_type: ServiceType, service_name: str
    ) -> ServiceDefinition:
        service_key = (service_name, service_type)
        if service_key not in cls._services:
            raise ValueError(f"Service '{service_name}' of type {service_type} is not registered")
        return cls._services[service_key]

    @classmethod
    def get_available_services(
        cls, service_type: Optional[ServiceType] = None
    ) -> List[ServiceInfo]:
        """Get a list of all registered services, optionally filtered by type."""
        services = (
            (name, type_, service_dict)
            for (name, type_), service_dict in cls._services.items()
            if not service_type or type_ == service_type
        )

        return [
            ServiceInfo(
                service_name=name,
                service_type=type_.value,
                requires_api_key=service.requires_api_key,
                optional_params=service.optional_params,
                required_params=service.required_params,
            )
            for name, type_, service in services
        ]

    @classmethod
    def get_service_info(cls) -> Dict[str, List[str]]:
        """Get a structured view of all registered services grouped by type."""
        return {
            service_type.value: sorted(
                name for name, type_ in cls._services.keys() if type_ == service_type
            )
            for service_type in ServiceType
        }

    def __str__(self) -> str:
        """Return a formatted string showing all available services by type."""
        info = self.get_service_info()
        lines = ["Available Services:"]
        for service_type, services in info.items():
            lines.append(f"\n{service_type}:")
            for service in sorted(services):
                lines.append(f"  - {service}")
        return "\n".join(lines)

    @classmethod
    def validate_service_map(cls, services: dict[str, str]) -> bool:
        for service_type_key, service_name in services.items():
            try:
                service_type = ServiceType(service_type_key)
                services_of_type = services_of_type = [
                    name for (name, s_type) in cls._services.keys() if s_type == service_type
                ]
                if service_name not in services_of_type:
                    raise UnsupportedServiceError(service_name, str(service_type), services_of_type)
            except ValueError:
                valid_types = [t.value for t in ServiceType]
                raise InvalidServiceTypeError(str(service_type), valid_types)

        return True


# Transport services
ServiceFactory.register_service(
    "pipecat.transports.services.daily:DailyTransport",
    "daily",
    ServiceType.ServiceTransport,
    default_params={"api_url": "https://api.daily.co/v1"},
)

# STT services
ServiceFactory.register_service(
    "pipecat.services.deepgram:DeepgramSTTService",
    "deepgram",
    ServiceType.ServiceSTT,
    optional_params=["model"],
    default_params={"model": "nova-2-general"},
)

# LLM services
ServiceFactory.register_service(
    "pipecat.services.openai:OpenAILLMService",
    "custom_llm",
    ServiceType.ServiceLLM,
    optional_params=["base_url"],
    required_params=["model"],
)


ServiceFactory.register_service(
    "pipecat.services.openai:OpenAILLMService",
    "openai",
    ServiceType.ServiceLLM,
    optional_params=["model"],
)

ServiceFactory.register_service(
    "pipecat.services.google:GoogleLLMService",
    "google",
    ServiceType.ServiceLLM,
    optional_params=["model"],
    default_params={"model": "gemini-1.5-flash-latest"},
)

ServiceFactory.register_service(
    "pipecat.services.anthropic:AnthropicLLMService",
    "anthropic",
    ServiceType.ServiceLLM,
    optional_params=["model"],
)

ServiceFactory.register_service(
    "pipecat.services.together:TogetherLLMService",
    "together",
    ServiceType.ServiceLLM,
    optional_params=["model"],
)

ServiceFactory.register_service(
    "pipecat.services.openai:OpenAILLMService",
    "groq",
    ServiceType.ServiceLLM,
    default_params={"base_url": "https://api.groq.com/openai/v1"},
    optional_params=["model"],
)

# TTS services
ServiceFactory.register_service(
    "pipecat.services.cartesia:CartesiaTTSService",
    "cartesia",
    ServiceType.ServiceTTS,
    optional_params=["voice_id"],
    default_params={
        "voice_id": "79a125e8-cd45-4c13-8a67-188112f4dd22",
        "text_filter": MarkdownTextFilter(),
    },
)

ServiceFactory.register_service(
    "pipecat.services.elevenlabs:ElevenLabsTTSService",
    "elevenlabs",
    ServiceType.ServiceTTS,
    optional_params=["voice_id"],
    default_params={
        "voice_id": "pFZP5JQG7iQjIQuC4Bku",
        "text_filter": MarkdownTextFilter(),
    },
)

ServiceFactory.register_service(
    "pipecat.services.playht:PlayHTTTSService",
    "playht",
    ServiceType.ServiceTTS,
    required_params=["user_id"],
    optional_params=["voice_id"],
    default_params={
        "voice_id": "s3://voice-cloning-zero-shot/820da3d2-3a3b-42e7-844d-e68db835a206/sarah/manifest.json",
        "text_filter": MarkdownTextFilter(),
    },
)

"""
ServiceFactory.register_service(
    "pipecat.services.azure:AzureTTSService",
    "azure",
    ServiceType.ServiceTTS,
    optional_params=["voice_id"],
    default_params={
        "voice_id": "en-US-SaraNeural",
        "text_filter": MarkdownTextFilter(),
    },
)
"""

ServiceFactory.register_service(
    "pipecat.services.openai:OpenAITTSService",
    "openai",
    ServiceType.ServiceTTS,
    optional_params=["sample_rate"],
    default_params={
        "voice_id": "nova",
        "text_filter": MarkdownTextFilter(),
    },
)
