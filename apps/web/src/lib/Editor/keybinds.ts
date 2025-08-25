import { BlockType } from "@/types/editor";
import { getCaretPosition, sanitize, setCaretPosition } from "../utils";
import type Block from "./Block";
import { headerTypes, validSytax } from "@/constants";

type Inputs = {
  currentInputText: string;
  inputRefs: React.RefObject<(HTMLDivElement | null)[]>;
  index: number;
  blocks: Block[];
  setBlocks: any;
  currLevel: number;
  editor: any;
  event?: any;
};

// TODO: move into editor class

export function onEnter({
  currentInputText,
  inputRefs,
  index,
  blocks,
  setBlocks,
  currLevel,
  editor,
}: Inputs) {
  const cursorPosition = getCaretPosition(inputRefs.current[index]);
  const currentType = blocks[currLevel]?.type;
  const newBlockType =
    currentType === BlockType.BULLETPOINT
      ? BlockType.BULLETPOINT
      : BlockType.TEXT;

  if (currentInputText && cursorPosition == 0) {
    blocks[currLevel].data.text = "";
    editor.addBlock(
      blocks,
      setBlocks,
      newBlockType,
      sanitize(currentInputText) as string,
      currLevel,
    );
  } else if (cursorPosition != 0) {
    // TODO: split string on enter
    const inputFirstHalf =
      cursorPosition != 0
        ? currentInputText?.slice(0, cursorPosition)
        : (currentInputText as string);

    const inputSecondHalf =
      cursorPosition != 0
        ? currentInputText?.slice(cursorPosition)
        : (currentInputText as string);

    console.log("cursorPosition", cursorPosition);

    console.log("input halfs", inputFirstHalf, inputSecondHalf);

    blocks[currLevel].data.text = inputFirstHalf as string;

    editor.addBlock(
      blocks,
      setBlocks,
      newBlockType,
      inputSecondHalf as string,
      currLevel,
    );
  } else {
    editor.addBlock(blocks, setBlocks, newBlockType, "", currLevel);
  }
  setTimeout(() => {
    inputRefs?.current[currLevel + 1]?.focus();
  }, 0);
}

// TODO: preverse the cursor position

export function onDelete({
  currentInputText,
  inputRefs,
  index,
  blocks,
  setBlocks,
  editor,
  currLevel,
  event,
}: Inputs) {
  const text = sanitize(currentInputText) as string;
  const cursorPosition = getCaretPosition(inputRefs.current[index]);
  const prevRef = inputRefs.current[currLevel - 1];
  const prevBlockLength = prevRef?.innerText.length ?? 0;

  if (currLevel === 0) {
    return;
  }

  // If at start of a bulletpoint, convert to normal text block (same level)
  if (
    cursorPosition === 0 &&
    blocks[currLevel]?.type === BlockType.BULLETPOINT
  ) {
    event.preventDefault();
    editor.changeBlockType(setBlocks, currLevel, BlockType.TEXT, text);
    setTimeout(() => {
      inputRefs?.current[currLevel]?.focus();
      setCaretPosition(inputRefs.current[currLevel], 0);
    }, 0);
    return;
  }

  // deleting an empty current block -> remove block
  if (cursorPosition === 0 && text === "") {
    event.preventDefault();
    editor.deleteBlock(blocks, setBlocks, currLevel);
    setTimeout(() => {
      inputRefs?.current[currLevel - 1]?.focus();
    }, 0);
    return;
  }

  // merging current non-empty text into previous block
  if (cursorPosition === 0 && text !== "") {
    // prevent browser from performing its default backspace merge/delete
    event.preventDefault();

    // merge immutably: prevText + current text
    const prevText = (blocks[currLevel - 1]?.data?.text as string) ?? "";
    const mergedPrevText = prevText + text;

    // create a new blocks array where previous block has merged text
    const newBlocks = blocks.map((b, i) =>
      i === currLevel - 1
        ? { ...b, data: { ...b.data, text: mergedPrevText } }
        : b,
    );

    // delete current block (editor.deleteBlock will recompute levels and call setBlocks)
    editor.deleteBlock(newBlocks, setBlocks, currLevel);

    // focus previous and restore caret at end of previous (use timeout to let React apply updates)
    setTimeout(() => {
      inputRefs?.current[currLevel - 1]?.focus();
      setCaretPosition(inputRefs.current[currLevel - 1], prevBlockLength);
    }, 0);
  }
}

export function onHeader({
  editor,
  currentInputText,
  blocks,
  setBlocks,
  currLevel,
}: Inputs) {
  const text = sanitize(currentInputText) as string;
  const match = text.match(/^(#{1,6})\s?/);
  const hashCount: number = match?.[1]?.length ?? 0;

  const newType = headerTypes[hashCount] || BlockType.H1;
  if (newType) {
    const newText = text.replace(/^(#{1,6})\s?/, "");
    blocks[currLevel].data.text = newText;
    editor.changeBlockType(setBlocks, currLevel, newType);
    setBlocks([...blocks]);
  }
}

export function onSpace({
  editor,
  currentInputText,
  inputRefs,
  setBlocks,
  currLevel,
  event,
}: Inputs) {
  // Determine syntax token (at the very start) and remainder using regex
  const raw = currentInputText ?? "";
  const match = raw.match(/^\s*(#{1,6}|-)\s*/);
  if (!match) {
    // not a recognized syntax, let the browser insert the space normally
    return;
  }
  const syntax = match[1];
  const removedPrefixLen = match[0].length; // exact number of chars removed from start
  const remainder = raw.slice(removedPrefixLen);

  if (!validSytax.includes(syntax)) {
    return;
  }

  // stop the normal space from being inserted; we'll rewrite the text
  event?.preventDefault?.();

  // Map syntax to a block type
  let targetType: BlockType | undefined;
  if (syntax === "-") {
    targetType = BlockType.BULLETPOINT;
  } else if (/^#{1,6}$/.test(syntax)) {
    const hashCount = syntax.length; // 1..6
    targetType = headerTypes[hashCount - 1] || BlockType.H1;
  } else {
    return;
  }

  // Compute caret position before we mutate DOM/state
  const oldRef = inputRefs?.current?.[currLevel] ?? null;
  const prevCaret = getCaretPosition(oldRef);

  const sanitized = sanitize(remainder) as string;

  // Apply type and set text to the remainder (syntax removed)
  editor.changeBlockType(setBlocks, currLevel, targetType, sanitized);

  // Immediately reflect the change in the contentEditable and restore caret
  // so the UI updates without needing another keypress
  setTimeout(() => {
    const newRef = inputRefs?.current?.[currLevel] ?? null;
    if (!newRef) return;
    newRef.focus();
    // update visible text now to avoid flicker/stale token
    if (newRef.innerText !== sanitized) newRef.innerText = sanitized;
    // place caret accounting for removed syntax + optional space
    const newCaret = Math.max(
      0,
      Math.min(prevCaret - removedPrefixLen, sanitized.length),
    );
    setCaretPosition(newRef, newCaret);
  }, 0);
}
