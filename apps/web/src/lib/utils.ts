import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type Block from "./Editor/Block";

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

export function setCaretPosition(
  editableDiv: HTMLDivElement | null,
  position: number,
) {
  if (!editableDiv) return;
  editableDiv.focus();

  const selection = window.getSelection();
  if (!selection) return;

  let charIndex = 0;
  let nodeStack: ChildNode[] = [editableDiv];
  let node: ChildNode | undefined,
    found = false;
  let range = document.createRange();

  while (!found && nodeStack.length > 0) {
    node = nodeStack.pop();
    if (!node) break;

    if (node.nodeType === Node.TEXT_NODE) {
      const nextCharIndex = charIndex + (node.textContent?.length ?? 0);
      if (position <= nextCharIndex) {
        range.setStart(node, position - charIndex);
        range.collapse(true);
        found = true;
        break;
      }
      charIndex = nextCharIndex;
    } else {
      // Push children in reverse order so they are processed left-to-right
      let children = Array.from(node.childNodes);
      for (let i = children.length - 1; i >= 0; i--) {
        nodeStack.push(children[i]);
      }
    }
  }

  if (!found) {
    // If position is at the end, set at the end of the div
    range.selectNodeContents(editableDiv);
    range.collapse(false);
  }

  selection.removeAllRanges();
  selection.addRange(range);
}

type ReorderBlocksType = { setBlocks: any; blocks: Block[] };

export function reorderBlocks({ setBlocks, blocks }: ReorderBlocksType) {
  blocks.map((block: Block, index: number) => {
    block.level = index;
  });

  setBlocks(blocks);
}

export function moveBlock(blocks: Block[], from: number, to: number): Block[] {
  const n = blocks.length;
  const safeFrom = Math.max(0, Math.min(from, n - 1));
  const safeTo = Math.max(0, Math.min(to, n)); // allow n (append)
  if (safeFrom === safeTo || n <= 1)
    return blocks.slice().map((b, i) => ({ ...b, level: i }));
  const next = blocks.slice();
  const [moved] = next.splice(safeFrom, 1);
  next.splice(safeTo, 0, moved);
  return next.map((b, i) => ({ ...b, level: i }));
}
