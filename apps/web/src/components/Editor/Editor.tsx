import Block from "@/lib/Editor/Block";
import Editor from "@/lib/Editor/Editor";
import { useState, useRef, useEffect } from "react";
import type React from "react";
import BlockElement from "./BlockElement";
import { reorderBlocks } from "@/lib/utils";
import EditorSidebar from "./EditorSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { loadBlocksFile, saveBlocksFileDebounced } from "@/lib/testData";
import { GripVertical } from "lucide-react";
import { type DragRef, type Preview } from "@/types";
import DragDropElement from "./DragDropElement";
import { onHandlePointerDown } from "@/lib/Editor/DragDrop";

const editor = new Editor();

export default function EditorComponent() {
  const [blocks, setBlocks] = useState<Block[]>(editor.getBlocks());
  const inputRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [currentFilePath, setCurrentFilePath] = useState<string | null>(null);
  const containerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const draggingRef = useRef<DragRef | null>(null);
  const [dragging, setDragging] = useState(false);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [pointerY, setPointerY] = useState<number | null>(null);
  const [preview, setPreview] = useState<Preview | null>(null);

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
          {blocks.map((block, index) => {
            const showBefore = dragging && dragOverIndex === index;
            const isDraggingItem =
              dragging && draggingRef.current?.from === index;
            return (
              <div
                key={block.level}
                ref={(el) => {
                  containerRefs.current[index] = el;
                }}
                className="group relative"
              >
                {/* insert indicator */}
                {showBefore ? (
                  <div className="absolute -top-1 right-0 left-0 h-0.5 bg-sky-500" />
                ) : null}

                {/* drag handle */}
                <div
                  className="text-muted-foreground hover:text-foreground absolute top-1/2 -left-6 flex h-5 w-5 -translate-y-1/2 cursor-grab items-center justify-center opacity-0 transition-opacity select-none group-hover:opacity-100"
                  onPointerDown={(e) =>
                    onHandlePointerDown({
                      e,
                      index,
                      containerRefs,
                      draggingRef,
                      setDragging,
                      setDragOverIndex,
                      setPreview,
                      setPointerY,
                      inputRefs,
                      setBlocks,
                    })
                  }
                  title="Drag to reorder"
                >
                  <GripVertical size={14} />
                </div>

                <div className={isDraggingItem ? "invisible" : ""}>
                  <BlockElement
                    setBlocks={setBlocks}
                    blocks={blocks}
                    block={block}
                    currBlockType={block.type}
                    index={index}
                    inputRefs={inputRefs}
                    editor={editor}
                  />
                </div>
              </div>
            );
          })}
          {/* floating drag preview following cursor */}
          {dragging && preview && pointerY !== null ? (
            <div
              className="pointer-events-none fixed z-50"
              style={{
                left: `${preview.left}px`,
                top: `${pointerY - preview.offsetY}px`,
                width: `${preview.width}px`,
              }}
            >
              <div className="bg-background/80 rounded-md border shadow-sm backdrop-blur">
                <DragDropElement
                  blocks={blocks}
                  previewIndex={preview?.index}
                />
              </div>
            </div>
          ) : null}
          {/* end insertion indicator */}
          {dragging && dragOverIndex === blocks.length ? (
            <div className="mt-1 h-0.5 bg-sky-500" />
          ) : null}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
