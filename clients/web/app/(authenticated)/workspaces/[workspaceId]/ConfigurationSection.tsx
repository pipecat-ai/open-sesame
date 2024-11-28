import AddServiceModal from "@/app/(authenticated)/workspaces/services/AddServiceModal";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getLLMModelsByService, LLMMessageRole, LLMProvider } from "@/lib/llm";
import { ServiceInfo, ServiceModel, WorkspaceModel } from "@/lib/sesameApi";
import { PlusIcon, PlusSquareIcon, TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Fragment, useState } from "react";
import { WorkspaceFormConfig } from "./ConfigurationForm";
import ConfigurationGroup from "./ConfigurationGroup";
import ConfigurationItem from "./ConfigurationItem";

interface Props {
  availableServices: ServiceInfo[];
  services: ServiceModel[];
  formState: WorkspaceFormConfig;
  setFormState: React.Dispatch<React.SetStateAction<WorkspaceFormConfig>>;
  workspace: WorkspaceModel;
}

export default function ConfigurationSection({
  availableServices,
  services,
  formState,
  setFormState,
  workspace,
}: Props) {
  const { model, prompt } = formState.configuration;
  const { refresh } = useRouter();
  const [addService, setAddService] = useState(false);

  // Handle provider selection
  const handleProviderChange = (provider: LLMProvider) => {
    if (!provider) return;
    const models = getLLMModelsByService(provider);
    setFormState((state) => ({
      ...state,
      configuration: {
        ...state.configuration,
        model: {
          llmProvider: provider,
          selectedModel: models?.[0]?.model ?? "",
        },
      },
    }));
  };

  const validModels = getLLMModelsByService(model.llmProvider);

  // Handle model selection based on provider
  const handleModelChange = (model: string) => {
    if (validModels.every((m) => m.model !== model)) return;

    setFormState((state) => ({
      ...state,
      configuration: {
        ...state.configuration,
        model: {
          ...state.configuration.model,
          selectedModel: model,
        },
      },
    }));
  };

  return (
    <ConfigurationGroup label="Configuration">
      {addService && (
        <AddServiceModal
          initialType="llm"
          initialWorkspaceId={workspace.workspace_id}
          onClose={() => setAddService(false)}
          onSaved={() => {
            refresh();
            setAddService(false)
          }}
          services={availableServices}
          workspaces={[workspace]}
        />
      )}
      {/* LLM Provider */}
      <fieldset>
        <ConfigurationItem align="start">
          <legend className="text-base font-semibold">LLM Provider</legend>

          <ToggleGroup
            type="single"
            variant="outline"
            className="justify-start flex-wrap"
            value={model.llmProvider}
            onValueChange={handleProviderChange}
          >
            {services.map((s) => (
              <ToggleGroupItem
                key={s.service_id}
                id={s.service_id}
                value={s.service_provider!}
                aria-label={s.title}
                className="text-nowrap"
              >
                {s.title}
              </ToggleGroupItem>
            ))}
            <ToggleGroupItem className="gap-1" onClick={() => setAddService(true)} value="">
              <PlusIcon size={16} />
              Add
            </ToggleGroupItem>
          </ToggleGroup>
        </ConfigurationItem>
      </fieldset>

      {/* Model */}
      <ConfigurationItem border>
        <Label className="text-base font-semibold" htmlFor="model">
          Model
        </Label>
        <div>
          <Select value={model.selectedModel} onValueChange={handleModelChange}>
            <SelectTrigger disabled={!validModels.length} id="model">
              <SelectValue placeholder="Model" />
            </SelectTrigger>
            <SelectContent>
              {validModels.map((m) => (
                <SelectItem key={m.model} value={m.model}>
                  {m.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </ConfigurationItem>

      {/* Prompt Configuration */}
      <ConfigurationItem align="start" border>
        <h4 className="text-base font-semibold">Prompt Configuration</h4>
        <div className="flex flex-col gap-2">
          {prompt.map((message, index) => (
            <Fragment key={index}>
              {index > 0 && <Separator className="my-2" />}
              <div className="relative flex flex-col gap-2">
                <Label
                  className="font-semibold"
                  htmlFor={`prompt-role-${index}`}
                >
                  Role
                </Label>
                <Select
                  value={message.content.role}
                  onValueChange={(role: string) => {
                    const updatedPrompt = [...prompt];
                    updatedPrompt[index].content.role = role as LLMMessageRole;
                    setFormState((state) => ({
                      ...state,
                      configuration: {
                        ...state.configuration,
                        prompt: updatedPrompt,
                      },
                    }));
                  }}
                >
                  <SelectTrigger className="w-48" id={`prompt-role-${index}`}>
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="system">System</SelectItem>
                    <SelectItem value="user">User</SelectItem>
                    <SelectItem value="assistant">Assistant</SelectItem>
                  </SelectContent>
                </Select>

                <Label
                  className="font-semibold"
                  htmlFor={`prompt-message-${index}`}
                >
                  Message
                </Label>
                <Textarea
                  id={`prompt-message-${index}`}
                  rows={5}
                  value={message.content.content}
                  onChange={(e) => {
                    const updatedPrompt = [...prompt];
                    updatedPrompt[index].content.content = e.target.value;
                    setFormState((state) => ({
                      ...state,
                      configuration: {
                        ...state.configuration,
                        prompt: updatedPrompt,
                      },
                    }));
                  }}
                />
                {prompt.length > 1 && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          className="absolute top-0 right-0"
                          size="icon"
                          variant="destructive"
                          type="button"
                          onClick={() => {
                            const updatedPrompt = prompt.filter(
                              (_, i) => i !== index
                            );
                            setFormState((state) => ({
                              ...state,
                              configuration: {
                                ...state.configuration,
                                prompt: updatedPrompt,
                              },
                            }));
                          }}
                        >
                          <TrashIcon size={16} />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent
                        className="bg-popover text-popover-foreground"
                        align="center"
                        side="left"
                      >
                        <span>Remove</span>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
            </Fragment>
          ))}
          <Button
            className="gap-2 items-center"
            variant="secondary"
            type="button"
            onClick={() => {
              setFormState((state) => ({
                ...state,
                configuration: {
                  ...state.configuration,
                  prompt: [
                    ...prompt,
                    { content: { role: "system", content: "" } },
                  ],
                },
              }));
            }}
          >
            <PlusSquareIcon size={16} />
            <span>Add context message</span>
          </Button>
        </div>
      </ConfigurationItem>
    </ConfigurationGroup>
  );
}
