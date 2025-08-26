import type { DragRef, Preview } from "@/types";
import type Block from "./Block";
import { moveBlock } from "../utils";

// DnD: compute target index by pointer Y against block mid-lines
const computeTargetIndex = (clientY: number, rects: DOMRect[]) => {
  for (let i = 0; i < rects.length; i++) {
    const r = rects[i];
    const mid = r.top + r.height / 2;
    if (clientY < mid) return i;
  }
  return rects.length; // drop at end
};

type onHandlePointerDown = {
  e: React.PointerEvent<HTMLDivElement>;
  index: number;
  containerRefs: React.RefObject<(HTMLDivElement | null)[]>;
  draggingRef: React.RefObject<DragRef | null>;
  setDragging: React.Dispatch<React.SetStateAction<boolean>>;
  setDragOverIndex: React.Dispatch<React.SetStateAction<number | null>>;
  setPreview: React.Dispatch<React.SetStateAction<Preview | null>>;
  setPointerY: React.Dispatch<React.SetStateAction<number | null>>;
  inputRefs: React.RefObject<(HTMLDivElement | null)[]>;
  setBlocks: React.Dispatch<React.SetStateAction<Block[]>>;
};
function onHandlePointerDown({
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
}: onHandlePointerDown) {
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
}

export { computeTargetIndex, onHandlePointerDown };
