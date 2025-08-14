import Block from "@/lib/Editor/Block";
import React, { useEffect } from "react";
import { BlockType } from "@/types/editor";
import { InputTextBlock } from "../blocks";
import handleKeyDown from "@/lib/Editor/keypress";

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

  useEffect(() => {
    setBlocks(blocks);
  }, [block, blocks, setBlocks, inputRefs]);

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
          className=""
        />
      );
    case BlockType.H1:
      return (
        <InputTextBlock
          handleKeyDown={onKeyDown}
          block={block}
          inputRefs={inputRefs}
          index={index}
          blockType={currBlockType}
          className="p-2 text-6xl font-extrabold"
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
          className="p-2 text-5xl font-bold"
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
          className="p-2 text-4xl font-extrabold"
        />
      );
  }
}
