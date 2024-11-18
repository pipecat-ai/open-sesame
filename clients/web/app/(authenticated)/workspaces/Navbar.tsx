"use client";

import emitter from "@/lib/eventEmitter";
import { Menu } from "lucide-react"; // Importing Lucide icons
import React from "react";

interface NavbarProps {}

const Navbar: React.FC<NavbarProps> = () => {
  const handleSidebarToggle = () => {
    emitter.emit("toggleSidebar");
  };

  return (
    <div className="bg-background flex items-center justify-between p-4 sticky top-0 z-10">
      {/* Sidebar Toggle Button */}
      <button
        className="p-2 rounded-md hover:bg-secondary focus:outline-none lg:hidden"
        onClick={handleSidebarToggle}
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Workspace Title */}
      <h1 className="text-lg font-semibold lg:hidden">Workspaces</h1>

      <span />
    </div>
  );
};

export default Navbar;
