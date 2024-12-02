import equal from "fast-deep-equal";
import { defaultModel, getLLMModel, LLMProvider } from "./llm";
import {
  BotProfile,
  MessageCreateModel,
  WorkspaceModel,
  WorkspaceWithConversations,
} from "./sesameApi";
import { getApiClient } from "./sesameApiClient";
import { defaultVoice, InteractionMode, TTSService } from "./voice";

export async function getWorkspaces() {
  const apiClient = await getApiClient();
  const response =
    await apiClient.api.getRecentConversationsWithWorkspaceApiConversationsGet();
  const json = await response.json();
  if (!response.ok) {
    throw new Error(
      `Error fetching workspaces: ${response.status} ${response.statusText}`,
    );
  }
  return (json as WorkspaceWithConversations[])
    .map((ws) => {
      const cleanedUp = structuredClone(ws);
      delete cleanedUp.config.api_keys;
      return cleanedUp;
    })
    .sort(
      (a, b) =>
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
    );
}

export async function getWorkspace(id: string) {
  try {
    const workspaces = await getWorkspaces();
    return workspaces.find((ws) => ws.workspace_id === id);
  } catch (e) {
    console.error(e);
    return null;
  }
}

export interface WorkspaceStructuredData {
  apiKeys: Record<string, string>;
  botProfile: BotProfile;
  llm: {
    apiKey?: string;
    service: LLMProvider;
    model: {
      label: string;
      value: string;
    };
    messages: MessageCreateModel[];
    run_on_config: boolean;
  };
  tts: {
    apiKey?: string;
    service: TTSService;
    voice: string;
    model: string;
    language: string;
    interactionMode: InteractionMode;
  };
}

const defaultTextFilter = {
  filter_code: false,
  filter_tables: false,
};

export const defaultWorkspace: Omit<
  WorkspaceModel,
  "created_at" | "updated_at"
> = {
  workspace_id: "new",
  title: "",
  config: {
    services: {
      llm: defaultModel.service,
      tts: defaultVoice.ttsProvider,
      stt: "deepgram",
    },
    default_llm_context: [
      {
        content: {
          role: "system",
          content:
            "You are Sesame, a friendly assistant. Keep your responses brief, when possible or not requested differently. Avoid bold and italic text formatting (**bold** and *italic*) in your responses.",
        },
        extra_metadata: null,
      },
    ],
    config: [
      {
        service: "vad",
        options: [
          {
            name: "params",
            value: {
              stop_secs: 0.3,
            },
          },
        ],
      },
      {
        service: "tts",
        options: [
          {
            name: "voice",
            value: defaultVoice.voiceId,
          },
          {
            name: "model",
            value: defaultVoice.ttsModel,
          },
          {
            name: "language",
            value: defaultVoice.languages[0],
          },
          {
            name: "text_filter",
            value: defaultTextFilter,
          },
        ],
      },
      {
        service: "llm",
        options: [
          {
            name: "model",
            value: defaultModel.model,
          },
          {
            name: "run_on_config",
            value: false,
          },
        ],
      },
      {
        service: "stt",
        options: [
          {
            name: "model",
            value: defaultVoice.sttModel,
          },
          {
            name: "language",
            value: defaultVoice.languages[0],
          },
        ],
      },
    ],
  },
};

export function getWorkspaceStructuredData(
  workspaceConfig: WorkspaceModel["config"],
  fallbackToDefault = true,
): WorkspaceStructuredData {
  const defaults = fallbackToDefault
    ? getWorkspaceStructuredData(defaultWorkspace.config, false)
    : null;

  const llmConfig = workspaceConfig?.config?.find((c) => c.service === "llm");
  const llmModel = llmConfig?.options?.find((o) => o.name === "model");
  const llmMessages = workspaceConfig?.default_llm_context ?? [];
  const llmRunOnConfig = llmConfig?.options?.find(
    (o) => o.name === "run_on_config",
  );

  const model = getLLMModel(llmModel?.value);

  const ttsConfig = workspaceConfig?.config?.find((c) => c.service === "tts");
  const ttsVoice = ttsConfig?.options?.find((o) => o.name === "voice");
  const ttsModel = ttsConfig?.options?.find((o) => o.name === "model");
  const ttsLanguage = ttsConfig?.options?.find((o) => o.name === "language");
  const ttsTextFilter = ttsConfig?.options?.find(
    (o) => o.name === "text_filter",
  );

  const interactionMode: InteractionMode = equal(
    ttsTextFilter?.value,
    defaultTextFilter,
  )
    ? "conversational"
    : "informational";

  return {
    apiKeys: workspaceConfig?.api_keys ?? {},
    botProfile: workspaceConfig?.bot_profile ?? "voice",
    llm: {
      apiKey:
        workspaceConfig?.api_keys?.[workspaceConfig?.services?.llm as string],
      messages: llmMessages ?? defaults?.llm?.messages,
      model: {
        label: model?.label ?? llmModel?.value ?? defaults?.llm?.model?.label,
        value: llmModel?.value ?? defaults?.llm?.model?.value,
      },
      run_on_config: llmRunOnConfig?.value ?? defaults?.llm?.run_on_config,
      service: (workspaceConfig?.services?.llm ??
        defaults?.llm?.service) as LLMProvider,
    },
    tts: {
      apiKey:
        workspaceConfig?.api_keys?.[workspaceConfig?.services?.tts as string],
      service: (workspaceConfig?.services?.tts ??
        defaults?.tts?.service) as TTSService,
      language: ttsLanguage?.value ?? defaults?.tts?.language,
      model: ttsModel?.value ?? defaults?.tts?.model,
      voice: ttsVoice?.value ?? defaults?.tts?.voice,
      interactionMode,
    },
  };
}
