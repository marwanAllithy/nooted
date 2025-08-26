import Block from "@/lib/Editor/Block";
import React from "react";
import { BlockType } from "@/types";
import { InputTextBlock } from "../blocks";
import handleKeyDown from "@/lib/Editor/keypress";
import { getCaretPosition, setCaretPosition } from "@/lib/utils";

type Props = {
  blocks: Block[];
  block: Block;
  setBlocks: any;
  index: number;
  inputRefs: React.RefObject<(HTMLDivElement | null)[]>;
  editor: any;
  currBlockType: BlockType;
};

export default function BlockElement({
  setBlocks,
  blocks,
  block,
  currBlockType,
  index,
  inputRefs,
  editor,
}: Props) {
  const onKeyDown = (
    event: React.KeyboardEvent<HTMLDivElement>,
    currLevel: number,
  ) => {
    handleKeyDown({
      blocks,
      setBlocks,
      event,
      currLevel,
      inputRefs,
      index,
      editor,
    });
  };

  const onInputChange = (text: string) => {
    const el = inputRefs.current[index];
    const caret = getCaretPosition(el as HTMLDivElement);
    setBlocks((prev: Block[]) =>
      prev.map((b, i) =>
        i === index ? { ...b, data: { ...b.data, text } } : b,
      ),
    );
    // Restore focus and caret after the re-render
    setTimeout(() => {
      const target = inputRefs.current[index] as HTMLDivElement | null;
      if (!target) return;

      const isFocused = document.activeElement === target;
      if (!isFocused) {
        target.focus();
        const len = (target.innerText || "").length;
        setCaretPosition(target as HTMLDivElement, Math.min(caret, len));
      }
    }, 0);
  };

  // TODO: add change block feature
  switch (currBlockType) {
    case BlockType.TEXT:
      return (
        <InputTextBlock
          handleKeyDown={onKeyDown}
          block={block}
          inputRefs={inputRefs}
          index={index}
          blockType={currBlockType}
          onInputChange={onInputChange}
          className=""
        />
      );
    case BlockType.BULLETPOINT:
      return (
        <div className="flex items-start gap-2">
          <span className="select-none">-</span>
          <InputTextBlock
            handleKeyDown={onKeyDown}
            block={block}
            inputRefs={inputRefs}
            index={index}
            blockType={currBlockType}
            onInputChange={onInputChange}
            className=""
          />
        </div>
      );
    case BlockType.H1:
      return (
        <InputTextBlock
          handleKeyDown={onKeyDown}
          block={block}
          inputRefs={inputRefs}
          index={index}
          blockType={currBlockType}
          onInputChange={onInputChange}
          className="p-2 text-6xl font-black"
        />
      );
    case BlockType.H2:
      return (
        <InputTextBlock
          handleKeyDown={onKeyDown}
          block={block}
          inputRefs={inputRefs}
          index={index}
          blockType={currBlockType}
          onInputChange={onInputChange}
          className="p-2 text-5xl font-extrabold"
        />
      );
    case BlockType.H3:
      return (
        <InputTextBlock
          handleKeyDown={onKeyDown}
          block={block}
          inputRefs={inputRefs}
          index={index}
          blockType={currBlockType}
          onInputChange={onInputChange}
          className="p-2 text-4xl font-extrabold"
        />
      );
    case BlockType.H4:
      return (
        <InputTextBlock
          handleKeyDown={onKeyDown}
          block={block}
          inputRefs={inputRefs}
          index={index}
          blockType={currBlockType}
          onInputChange={onInputChange}
          className="p-2 text-3xl font-bold"
        />
      );
    case BlockType.H5:
      return (
        <InputTextBlock
          handleKeyDown={onKeyDown}
          block={block}
          inputRefs={inputRefs}
          index={index}
          blockType={currBlockType}
          onInputChange={onInputChange}
          className="p-2 text-2xl font-semibold"
        />
      );
    case BlockType.H6:
      return (
        <InputTextBlock
          handleKeyDown={onKeyDown}
          block={block}
          inputRefs={inputRefs}
          index={index}
          blockType={currBlockType}
          onInputChange={onInputChange}
          className="p-2 text-xl font-semibold"
        />
      );
  }
}
