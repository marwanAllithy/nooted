import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function sanitize(str: string) {
  return str.replace(/[\n\r]+$/g, "").replace(/^\s+|\s+$/g, "");
}

export function getCaretPosition(editableDiv: HTMLDivElement | null): number {
  if (!editableDiv) return 0;
  let caretPos = 0;
  const sel = window.getSelection();
  if (!sel || sel.rangeCount === 0) return caretPos;

  const range = sel.getRangeAt(0);

  // Ensure the selection is inside the editable div
  if (editableDiv.contains(range.commonAncestorContainer)) {
    const preCaretRange = range.cloneRange();
    preCaretRange.selectNodeContents(editableDiv);
    preCaretRange.setEnd(range.startContainer, range.startOffset);
    caretPos = preCaretRange.toString().length;
  }

  return caretPos;
}
