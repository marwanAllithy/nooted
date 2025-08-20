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

  if (currentInputText && cursorPosition == 0) {
    blocks[currLevel].data.text = "";
    editor.addBlock(
      blocks,
      setBlocks,
      BlockType.TEXT,
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
      BlockType.TEXT,
      inputSecondHalf as string,
      currLevel,
    );
  } else {
    editor.addBlock(blocks, setBlocks, BlockType.TEXT, "", currLevel);
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
  blocks,
  index,
  setBlocks,
  currLevel,
}: Inputs) {
  const splitText = currentInputText.split(" ");
  const syntax = sanitize(splitText[0]);

  console.log("1", splitText, syntax, splitText.length);

  let text: string = "";

  setTimeout(() => {
    if (splitText.length) {
      splitText.shift();
      text = splitText.join(" ");
    } else {
      text = " ";
    }
  }, 0);

  if (validSytax.includes(syntax)) {
    console.log("2", splitText, syntax, text, splitText.length);

    setTimeout(() => {
      if (text) {
        blocks[index].data.text = text;
        currentInputText = text;
      } else {
        blocks[index].data.text = "";
        currentInputText = "";
      }
    }, 0);

    switch (syntax) {
      case "#":
        editor.changeBlockType(setBlocks, currLevel, BlockType.H1, "");
        break;

      default:
    }
    console.log("3", splitText, syntax, text, splitText.length);
  }
}
