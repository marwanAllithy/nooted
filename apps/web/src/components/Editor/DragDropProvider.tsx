import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import type Block from "@/lib/Editor/Block";
import { onHandlePointerDown as rawOnHandlePointerDown } from "@/lib/Editor/DragDrop";
import type { Preview, DragRef } from "@/types";

type Ctx = {
  containerRefs: React.RefObject<(HTMLDivElement | null)[]>;
  dragging: boolean;
  draggingFrom: number | null;
  dragOverIndex: number | null;
  pointerY: number | null;
  preview: Preview | null;
  onHandlePointerDown: (
    index: number,
  ) => (e: React.PointerEvent<HTMLDivElement>) => void;
};

const DragDropContext = createContext<Ctx | null>(null);

type Props = {
  children: React.ReactNode;
  inputRefs: React.RefObject<(HTMLDivElement | null)[]>;
  setBlocks: React.Dispatch<React.SetStateAction<Block[]>>;
};

export function DragDropProvider({ children, inputRefs, setBlocks }: Props) {
  const containerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const draggingRef = useRef<DragRef | null>(null);
  const [dragging, setDragging] = useState(false);
  const [draggingFrom, setDraggingFrom] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [pointerY, setPointerY] = useState<number | null>(null);
  const [preview, setPreview] = useState<Preview | null>(null);

  const onHandlePointerDown = useCallback(
    (index: number) => (e: React.PointerEvent<HTMLDivElement>) => (
      setDraggingFrom(index),
      rawOnHandlePointerDown({
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
    ),
    [inputRefs, setBlocks],
  );

  // Reset draggingFrom when drag ends
  React.useEffect(() => {
    if (!dragging) setDraggingFrom(null);
  }, [dragging]);

  const value = useMemo<Ctx>(
    () => ({
      containerRefs,
      dragging,
      draggingFrom,
      dragOverIndex,
      pointerY,
      preview,
      onHandlePointerDown,
    }),
    [
      dragging,
      draggingFrom,
      dragOverIndex,
      pointerY,
      preview,
      onHandlePointerDown,
    ],
  );

  return (
    <DragDropContext.Provider value={value}>
      {children}
    </DragDropContext.Provider>
  );
}

export function useDragDrop() {
  const ctx = useContext(DragDropContext);
  if (!ctx) throw new Error("useDragDrop must be used within DragDropProvider");
  return ctx;
}
