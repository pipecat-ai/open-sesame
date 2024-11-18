"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import emitter from "@/lib/eventEmitter";
import { LLMModel } from "@/lib/llm";
import { Menu, Settings2 } from "lucide-react";
import React, { useState } from "react";

interface NavbarProps {
  currentModelValue: string;
  models: LLMModel[];
}

const Navbar: React.FC<NavbarProps> = ({ currentModelValue, models }) => {
  const handleSidebarToggle = () => {
    emitter.emit("toggleSidebar");
  };

  const handleSettingsToggle = () => {
    emitter.emit("toggleSettings");
  };

  const [selectedModel, setSelectedModel] = useState(currentModelValue);

  const currentModel = models.find(m => m.model === selectedModel);

  return (
    <div className="bg-background flex items-center justify-between p-4 sticky top-0 z-10">
      {/* Sidebar Toggle Button */}
      <button
        className="p-2 rounded-md hover:bg-secondary focus:outline-none lg:hidden"
        onClick={handleSidebarToggle}
      >
        <Menu className="w-6 h-6" />
      </button>

      <Select value={selectedModel} onValueChange={(v) => {
        setSelectedModel(v);
        emitter.emit("changeLlmModel", v);
      }}>
        <SelectTrigger className="font-semibold max-w-fit">
          <SelectValue>{currentModel?.label}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {models.map((m) => (
            <SelectItem key={m.model} value={m.model}>{m.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Settings Icon */}
      <button
        className="p-2 rounded-md hover:bg-secondary focus:outline-none ms-auto"
        onClick={handleSettingsToggle}
      >
        <Settings2 className="w-6 h-6" />
      </button>
    </div>
  );
};

export default Navbar;
