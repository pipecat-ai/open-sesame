import { ServiceInfo, ServiceModel, WorkspaceModel } from "@/lib/sesameApi";
import { getApiClient } from "@/lib/sesameApiClient";

export async function getAvailableServices() {
  const apiClient = await getApiClient();
  const response =
    await apiClient.api.getSupportedServicesApiServicesSupportedGet();
  const json = await response.json();
  if (!response.ok) {
    throw new Error(
      `Error fetching available services: ${response.status} ${response.statusText}`,
    );
  }
  return json as ServiceInfo[];
}

export async function getServices() {
  const apiClient = await getApiClient();
  const response = await apiClient.api.getServicesApiServicesGet();
  const json = await response.json();
  if (!response.ok) {
    throw new Error(
      `Error fetching services: ${response.status} ${response.statusText}`,
    );
  }
  return json as ServiceModel[];
}

interface ServiceConfig {
  apiKey: string;
  provider: string;
  workspaceId?: string;
}

export async function syncWorkspaceServices(
  workspace: WorkspaceModel,
  apiKeys: Record<string, string>,
) {
  const apiClient = await getApiClient();
  const services = await getServices();

  const map: Record<string, ServiceConfig> = {};
  Object.entries(serviceProviderTypeMap).forEach(([provider, type]) => {
    if (!apiKeys) return;
    if (provider in apiKeys) {
      map[type] = {
        apiKey: apiKeys[provider],
        provider,
        workspaceId: workspace.workspace_id,
      };
    }
  });

  for (const [serviceType, config] of Object.entries(map)) {
    const providerServices = services.filter(
      (s) => s.service_provider === config.provider,
    );

    // Service with this API key already registered
    if (providerServices.some((s) => s.api_key === config.apiKey)) continue;

    const wsService = providerServices.find(
      (s) => s.workspace_id === config.workspaceId,
    );
    // Service for this workspace exists and need to be updated
    if (wsService) {
      await apiClient.api.updateServiceApiServicesServiceIdPut(
        wsService.service_id,
        {
          api_key: config.apiKey,
        },
      );
      continue;
    }

    // Service doesn't exist: Create now
    await apiClient.api.createServiceApiServicesPost({
      api_key: config.apiKey,
      service_type: serviceType,
      service_provider: config.provider,
      title: config.provider,
      workspace_id: config.workspaceId,
    });
  }
}

export const serviceProviderTypeMap = {
  cartesia: "tts",
  daily: "transport",
  deepgram: "stt",
  elevenlabs: "tts",
  groq: "llm",
  openai: "llm",
  together: "llm",
};
