import Block from "@/lib/Editor/Block";
import Editor from "@/lib/Editor/Editor";
import { useState, useRef, useEffect } from "react";
import type React from "react";
import BlockElement from "./BlockElement";
import { moveBlock, reorderBlocks } from "@/lib/utils";
import EditorSidebar from "./EditorSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { loadBlocksFile, saveBlocksFileDebounced } from "@/lib/testData";
import { GripVertical } from "lucide-react";
import { BlockType } from "@/types/editor";

const editor = new Editor();

export default function EditorComponent() {
  const [blocks, setBlocks] = useState<Block[]>(editor.getBlocks());
  const inputRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [currentFilePath, setCurrentFilePath] = useState<string | null>(null);
  const containerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const draggingRef = useRef<{
    from: number;
    over: number;
    rects: DOMRect[];
  } | null>(null);
  const [dragging, setDragging] = useState(false);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [pointerY, setPointerY] = useState<number | null>(null);
  const [preview, setPreview] = useState<{
    left: number;
    width: number;
    height: number;
    offsetY: number;
    index: number;
  } | null>(null);

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

  // DnD: compute target index by pointer Y against block mid-lines
  const computeTargetIndex = (clientY: number, rects: DOMRect[]) => {
    for (let i = 0; i < rects.length; i++) {
      const r = rects[i];
      const mid = r.top + r.height / 2;
      if (clientY < mid) return i;
    }
    return rects.length; // drop at end
  };

  const onHandlePointerDown = (
    e: React.PointerEvent<HTMLDivElement>,
    index: number,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    const rects = containerRefs.current.map((el) =>
      el ? el.getBoundingClientRect() : new DOMRect(),
    );
    const itemRect = containerRefs.current[index]?.getBoundingClientRect();
    draggingRef.current = { from: index, over: index, rects };
    setDragging(true);
    setDragOverIndex(index);
    if (itemRect) {
      setPreview({
        left: itemRect.left,
        width: itemRect.width,
        height: itemRect.height,
        offsetY: e.clientY - itemRect.top,
        index,
      });
      setPointerY(e.clientY);
    }

    const onMove = (ev: PointerEvent) => {
      const state = draggingRef.current;
      if (!state) return;
      const over = computeTargetIndex(ev.clientY, state.rects);
      if (over !== state.over) {
        draggingRef.current = { ...state, over };
        // use rAF to reduce layout thrash
        requestAnimationFrame(() => setDragOverIndex(over));
      }
      requestAnimationFrame(() => setPointerY(ev.clientY));
    };
    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      const state = draggingRef.current;
      draggingRef.current = null;
      setDragging(false);
      setPreview(null);
      setPointerY(null);
      if (!state) return;
      const { from, over } = state;
      setDragOverIndex(null);
      if (from === over) return;
      setBlocks((prev) => {
        const next = moveBlock(prev, from, over);
        // refocus the moved block at its new index
        const newIndex = over > from ? over - 1 : over;
        // schedule after DOM updates
        setTimeout(() => {
          const el = inputRefs.current[newIndex];
          if (el) el.focus();
        }, 0);
        return next as Block[];
      });
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

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
                  onPointerDown={(e) => onHandlePointerDown(e, index)}
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
                {(() => {
                  const b = blocks[preview.index];
                  const base = "px-2 py-1";
                  switch (b.type) {
                    case BlockType.TEXT:
                      return <div className={base}>{b.data.text}</div>;
                    case BlockType.BULLETPOINT:
                      return (
                        <div className={`${base} flex items-start gap-2`}>
                          <span className="select-none">-</span>
                          <div>{b.data.text}</div>
                        </div>
                      );
                    case BlockType.H1:
                      return (
                        <div className={`${base} text-6xl font-black`}>
                          {b.data.text}
                        </div>
                      );
                    case BlockType.H2:
                      return (
                        <div className={`${base} text-5xl font-extrabold`}>
                          {b.data.text}
                        </div>
                      );
                    case BlockType.H3:
                      return (
                        <div className={`${base} text-4xl font-extrabold`}>
                          {b.data.text}
                        </div>
                      );
                    case BlockType.H4:
                      return (
                        <div className={`${base} text-3xl font-bold`}>
                          {b.data.text}
                        </div>
                      );
                    case BlockType.H5:
                      return (
                        <div className={`${base} text-2xl font-semibold`}>
                          {b.data.text}
                        </div>
                      );
                    case BlockType.H6:
                      return (
                        <div className={`${base} text-xl font-semibold`}>
                          {b.data.text}
                        </div>
                      );
                    default:
                      return <div className={base}>{b.data.text}</div>;
                  }
                })()}
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
