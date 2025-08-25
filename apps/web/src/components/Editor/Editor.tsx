import Block from "@/lib/Editor/Block";
import Editor from "@/lib/Editor/Editor";
import { useState, useRef, useEffect } from "react";
import type React from "react";
import BlockElement from "./BlockElement";
import { reorderBlocks } from "@/lib/utils";
import EditorSidebar from "./EditorSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { loadBlocksFile, saveBlocksFileDebounced } from "@/lib/testData";

const editor = new Editor();

export default function EditorComponent() {
  const [blocks, setBlocks] = useState<Block[]>(editor.getBlocks());
  const inputRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [currentFilePath, setCurrentFilePath] = useState<string | null>(null);

  useEffect(() => {
    if (inputRefs.current.length !== blocks.length) {
      inputRefs.current = Array(blocks.length)
        .fill(null)
        .map((_, i) => inputRefs.current[i] || null);
    }
  }, [blocks, setBlocks, editor]);

  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
    // setBlocks(blocks);
    reorderBlocks({ setBlocks, blocks });
  }, []);

  // Load blocks from a selected test file
  useEffect(() => {
    if (!currentFilePath) return;
    (async () => {
      try {
        const data = await loadBlocksFile(currentFilePath);
        // Normalize levels and ensure ids
        const normalized = data.blocks.map((b, i) => ({
          ...b,
          level: i,
          id: typeof b.id === "number" ? b.id : i,
        }));
        setBlocks(normalized as Block[]);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [currentFilePath]);

  // Debounce-save blocks back to the selected JSON
  useEffect(() => {
    if (!currentFilePath) return;
    saveBlocksFileDebounced(currentFilePath, { blocks });
  }, [blocks, currentFilePath]);

  return (
    <SidebarProvider
      className="h-full w-full"
      style={
        {
          "--sidebar-width": "25rem", // ~400px
        } as React.CSSProperties
      }
    >
      <EditorSidebar
        currentPath={currentFilePath}
        onOpenFile={setCurrentFilePath}
      />
      <SidebarInset>
        <div id="editor" className="p-6">
          {blocks.map((block, index) => (
            <BlockElement
              key={block.level}
              setBlocks={setBlocks}
              blocks={blocks}
              block={block}
              currBlockType={block.type}
              index={index}
              inputRefs={inputRefs}
              editor={editor}
            />
          ))}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
