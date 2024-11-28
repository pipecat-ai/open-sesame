"use client";

import PageRefresher from "@/components/PageRefresher";
import PageTransitionLink from "@/components/PageTransitionLink";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ToastAction } from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";
import emitter from "@/lib/eventEmitter";
import { LLMMessageRole, LLMProvider } from "@/lib/llm";
import {
  BotProfile,
  MessageCreateModel,
  ServiceInfo,
  ServiceModel,
  WorkspaceModel,
} from "@/lib/sesameApi";
import { InteractionMode, TTSService, voiceOptions } from "@/lib/voice";
import { getWorkspaceStructuredData } from "@/lib/workspaces";
import equal from "fast-deep-equal";
import { ArrowRightIcon, LoaderCircle, SaveIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useCallback, useMemo, useState } from "react";
import ConfigurationSection from "./ConfigurationSection";
import VoiceSettingsSection from "./VoiceSettingsSection";
import WorkspaceOptionsSection from "./WorkspaceOptionsSection";

interface Props {
  availableServices: ServiceInfo[];
  services: ServiceModel[];
  workspace: Pick<WorkspaceModel, "config" | "title" | "workspace_id">;
}

export interface WorkspaceFormConfig {
  configuration: {
    model: {
      llmProvider: LLMProvider;
      selectedModel: string;
    };
    prompt: Array<{
      content: {
        role: LLMMessageRole;
        content: string;
      };
      extra_metadata?: MessageCreateModel["extra_metadata"];
    }>;
    run_on_config: boolean;
  };
  voiceSettings: {
    mainLanguage: string;
    defaultVoice: {
      ttsProvider: TTSService;
      selectedVoice: string;
    };
    interactionMode: InteractionMode;
  };
  workspaceOptions: {
    botProfile: BotProfile;
    name: string;
  };
}

export default function ConfigurationForm({
  availableServices,
  services,
  workspace,
}: Props) {
  const { push } = useRouter();
  const { toast } = useToast();
  const structuredData = getWorkspaceStructuredData(workspace.config);
  const [isSaving, setIsSaving] = useState(false);

  const defaultState = useMemo<WorkspaceFormConfig>(
    () => ({
      apiKeys: Object.entries(structuredData.apiKeys).map(([service, key]) => ({
        apiKey: key,
        service,
      })),
      configuration: {
        model: {
          llmProvider: structuredData.llm.service,
          selectedModel: structuredData.llm.model.value,
        },
        prompt:
          Array.isArray(structuredData.llm.messages) &&
          structuredData.llm.messages.length > 0
            ? structuredData.llm.messages
            : [
                {
                  content: {
                    role: "system",
                    content: "",
                  },
                  extra_metadata: null,
                },
              ],
        run_on_config: structuredData.llm.run_on_config,
      },
      voiceSettings: {
        mainLanguage: structuredData.tts.language,
        defaultVoice: {
          ttsProvider: structuredData.tts.service,
          selectedVoice: structuredData.tts.voice,
        },
        interactionMode: structuredData.tts.interactionMode,
      },
      workspaceOptions: {
        botProfile: structuredData.botProfile,
        name: workspace.title,
      },
    }),
    [structuredData, workspace],
  );

  const [formState, setFormState] = useState<WorkspaceFormConfig>(defaultState);

  const hasLocalChanges = !equal(defaultState, formState);

  const handlePageRefresh = useCallback(() => {
    if (!hasLocalChanges || workspace.workspace_id === "new") return;
    toast({
      duration: 60000,
      title: "Workspace configuration changed",
      description:
        "This workspace's configuration has changed and there are unsaved changes.",
      action: (
        <ToastAction
          altText="Refresh data"
          onClick={() => {
            window.location.reload();
          }}
        >
          Refresh data
        </ToastAction>
      ),
    });
  }, [hasLocalChanges, toast, workspace.workspace_id]);

  const handleSubmit = async (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();

    setIsSaving(true);

    const voice = voiceOptions.find(
      (v) => v.voiceId === formState.voiceSettings.defaultVoice.selectedVoice,
    );

    const updatedWorkspace: Pick<
      WorkspaceModel,
      "config" | "title" | "workspace_id"
    > = {
      workspace_id: workspace.workspace_id,
      config: {
        bot_profile: formState.workspaceOptions.botProfile,
        default_llm_context: formState.configuration.prompt,
        services: {
          llm: formState.configuration.model.llmProvider,
          tts: formState.voiceSettings.defaultVoice.ttsProvider,
          stt: "deepgram",
          transport: "daily",
        },
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
                value: formState.voiceSettings.defaultVoice.selectedVoice,
              },
              {
                name: "model",
                value: voice?.ttsModel,
              },
              {
                name: "language",
                value: formState.voiceSettings.mainLanguage,
              },
              {
                name: "text_filter",
                value: {
                  filter_code:
                    formState.voiceSettings.interactionMode === "informational",
                  filter_tables:
                    formState.voiceSettings.interactionMode === "informational",
                },
              },
            ],
          },
          {
            service: "llm",
            options: [
              {
                name: "model",
                value: formState.configuration.model.selectedModel,
              },
              {
                name: "run_on_config",
                value: formState.configuration.run_on_config,
              },
            ],
          },
          {
            service: "stt",
            options: [
              {
                name: "model",
                value: voice?.sttModel ?? "nova-2-conversationalai",
              },
              {
                name: "language",
                value: formState.voiceSettings.mainLanguage,
              },
            ],
          },
        ],
      },
      title: formState.workspaceOptions.name,
    };

    const isNewWorkspace = workspace.workspace_id === "new";

    try {
      const response = await fetch(
        isNewWorkspace ? "/api/create-workspace" : "/api/update-workspace",
        {
          method: isNewWorkspace ? "POST" : "PUT",
          body: JSON.stringify(updatedWorkspace),
        },
      );
      if (response.ok) {
        const json = await response.json();
        toast({
          title: isNewWorkspace
            ? "Workspace created"
            : "Workspace configuration saved",
        });
        emitter.emit("showPageTransitionLoader");
        push(
          isNewWorkspace
            ? `/${json.workspace_id}`
            : `/workspaces/${workspace.workspace_id}`,
        );
      } else {
        throw new Error(
          `${response.status}: ${
            response.statusText
          } - ${await response.text()}`,
        );
      }
    } catch (e: unknown) {
      toast({
        duration: 60000,
        variant: "destructive",
        title: "Could not save workspace configuration",
        description: (e as Error).toString(),
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form
      className="animate-appear p-4 flex flex-col gap-6"
      onSubmit={handleSubmit}
    >
      {workspace.workspace_id !== "new" && (
        <>
          <PageTransitionLink href={`/${workspace.workspace_id}`}>
            <Button className="group gap-1 w-full" variant="secondary">
              <span>Go to Workspace</span>
              <ArrowRightIcon
                className="transition-transform group-hover:translate-x-1 group-focus-visible:translate-x-1"
                size={16}
              />
            </Button>
          </PageTransitionLink>
          <Separator />
        </>
      )}
      <WorkspaceOptionsSection
        formState={formState}
        setFormState={setFormState}
      />
      <ConfigurationSection
        availableServices={availableServices}
        services={services.filter((s) => s.service_type === "llm")}
        formState={formState}
        setFormState={setFormState}
        workspace={workspace as WorkspaceModel}
      />
      <VoiceSettingsSection
        availableServices={availableServices}
        services={services.filter((s) => s.service_type === "tts")}
        formState={formState}
        setFormState={setFormState}
        workspace={workspace as WorkspaceModel}
      />
      <div className="flex lg:justify-end">
        <Button
          className="flex-grow lg:flex-grow-0 gap-2 items-center"
          disabled={isSaving}
          type="submit"
        >
          {isSaving ? (
            <LoaderCircle size={16} className="animate-spin" />
          ) : (
            <SaveIcon size={16} />
          )}
          <span>Save</span>
        </Button>
      </div>

      {/* Danger Zone */}
      {workspace.workspace_id !== "new" && (
        <>
          <Separator />
          <section className="flex flex-col gap-2">
            <h3 className="text-lg font-semibold text-destructive">
              Danger zone
            </h3>
            <Button
              onClick={() =>
                emitter.emit("deleteWorkspace", workspace as WorkspaceModel)
              }
              type="button"
              variant="destructive"
            >
              Delete workspace
            </Button>
          </section>
        </>
      )}

      <PageRefresher onRefresh={handlePageRefresh} />
    </form>
  );
}
