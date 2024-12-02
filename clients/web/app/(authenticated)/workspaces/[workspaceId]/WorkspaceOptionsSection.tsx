import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { BotProfile } from "@/lib/sesameApi";
import { EyeIcon, SpeechIcon } from "lucide-react";
import { WorkspaceFormConfig } from "./ConfigurationForm";
import ConfigurationGroup from "./ConfigurationGroup";
import ConfigurationItem from "./ConfigurationItem";

interface Props {
  formState: WorkspaceFormConfig;
  setFormState: React.Dispatch<React.SetStateAction<WorkspaceFormConfig>>;
}

export default function WorkspaceOptionsSection({
  formState,
  setFormState,
}: Props) {
  const { name } = formState.workspaceOptions;

  const handleBotProfileChange = (profile: BotProfile) => {
    setFormState((fs) => ({
      ...fs,
      workspaceOptions: {
        ...fs.workspaceOptions,
        botProfile: profile,
      },
    }));
  };

  return (
    <ConfigurationGroup label="Workspace Options">
      {/* Workspace Name */}
      <ConfigurationItem>
        <Label className="text-base font-semibold" htmlFor="workspace-title">
          Name
        </Label>
        <div>
          <Input
            required
            autoComplete="off"
            id="workspace-title"
            name="workspace-title"
            type="text"
            value={name}
            onChange={(e) =>
              setFormState((state) => ({
                ...state,
                workspaceOptions: {
                  ...state.workspaceOptions,
                  name: e.target.value,
                },
              }))
            }
          />
        </div>
      </ConfigurationItem>

      {/* Bot Profile */}
      <ConfigurationItem>
        <Label className="text-base font-semibold" htmlFor="bot-profile">
          Bot Profile
        </Label>
        <ToggleGroup
          type="single"
          variant="outline"
          className="justify-start"
          value={formState.workspaceOptions.botProfile}
          onValueChange={handleBotProfileChange}
        >
          <ToggleGroupItem className="gap-1" value="voice">
            <SpeechIcon size={16} />
            Voice
          </ToggleGroupItem>
          <ToggleGroupItem className="gap-1" value="vision">
            <EyeIcon size={16} />
            Vision
          </ToggleGroupItem>
        </ToggleGroup>
      </ConfigurationItem>
    </ConfigurationGroup>
  );
}
