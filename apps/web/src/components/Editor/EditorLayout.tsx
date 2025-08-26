import React from "react";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import EditorSidebar from "./EditorSidebar";

type Props = {
  currentPath: string | null;
  onOpenFile: (path: string) => void;
  children: React.ReactNode;
  sidebarWidth?: string; // e.g., "25rem"
  title?: string;
};

export default function EditorLayout({
  currentPath,
  onOpenFile,
  children,
  sidebarWidth = "16rem",
  title = "Editor",
}: Props) {
  const fileLabel = currentPath
    ? currentPath.split("/").pop()
    : "No file selected";

  return (
    <SidebarProvider
      className="h-full w-full"
      style={{ "--sidebar-width": sidebarWidth } as React.CSSProperties}
    >
      <EditorSidebar currentPath={currentPath} onOpenFile={onOpenFile} />
      <SidebarInset>
        {/* Top navbar inside the editor area */}
        <div className="flex h-12 items-center gap-2 border-b px-4 sm:px-6">
          <SidebarTrigger />
          <div className="text-muted-foreground text-sm">{title}</div>
          <Separator orientation="vertical" className="mx-2 h-6" />
          <div
            className="truncate text-sm font-medium"
            title={fileLabel || undefined}
          >
            {fileLabel}
          </div>
        </div>
        {/* Main content area */}
        <div className="flex-1 overflow-auto">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
