import { onDelete, onEnter, onHeader, onSpace } from "./keybinds";
import { getCaretPosition } from "../utils";
import type Block from "./Block";
import type React from "react";

type HandleKeydownProps = {
  event: React.KeyboardEvent<HTMLDivElement>;
  currLevel: number;
  blocks: Block[];
  setBlocks: React.Dispatch<React.SetStateAction<Block[]>>;
  inputRefs: React.RefObject<(HTMLDivElement | null)[]>;
  index: number;
  editor: any;
};

export default function handleKeyDown({
  blocks,
  setBlocks,
  event,
  currLevel,
  inputRefs,
  index,
  editor,
}: HandleKeydownProps) {
  const currentInputText = inputRefs.current[index]?.innerText as string;
  const currCursorPosition = getCaretPosition(inputRefs.current[index]);

  const prevBlockLength = blocks[currLevel - 1]?.data.text.length;
  const nextBlockLength = blocks[currLevel + 1]?.data.text.length;

  const inputs = {
    editor,
    currentInputText,
    inputRefs,
    index,
    blocks,
    setBlocks,
    currLevel,
  };
  console.log(event.key, currLevel);
  switch (event.key) {
    case "Enter":
      event.preventDefault();
      onEnter({
        ...inputs,
      });
      break;

    case "ArrowUp":
      event.preventDefault();
      editor.moveFocusUp(
        currLevel,
        inputRefs,
        prevBlockLength,
        currCursorPosition,
      );
      break;

    case "ArrowDown":
      event.preventDefault();
      editor.moveFocusDown(
        currLevel,
        inputRefs,
        nextBlockLength,
        currCursorPosition,
      );
      break;

    case "Backspace":
      onDelete({
        ...inputs,
        event,
      });
      break;

    case "#":
      console.log("onHeader");
      onHeader({
        ...inputs,
      });
      break;

    case " ":
      // event.preventDefault();
      onSpace({
        ...inputs,
        event,
      });
      break;

    default:
      // update the changed block immutably immediately (no redundant timeouts)
      const updatedBlocks = blocks.map((b, i) =>
        i === currLevel
          ? { ...b, data: { ...b.data, text: currentInputText } }
          : b,
      );
      setBlocks(updatedBlocks);
      break;
  }
}
