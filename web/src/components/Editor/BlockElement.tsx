import Block from "@/lib/Editor/Block";
import React, { useEffect, useState } from "react";
import { autoCompleteTerms } from "@/constants";
import { BlockType } from "@/types/editor";
import { InputTextBlock } from "../blocks";
import { onDelete, onEnter } from "@/lib/Editor/keypress";

type Props = {
  blocks: Block[];
  block: Block;
  setBlocks: any;
  index: number;
  inputRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
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
  const [showAutoComplete, setShowAutoComplete] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTerms, setFilteredTerms] = useState<any>([]);

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLDivElement>,
    currLevel: number,
  ) => {
    const currentInputText = inputRefs.current[index]?.innerText as string;
    console.log(event.key, currLevel);

    switch (event.key) {
      case "Enter":
        event.preventDefault();
        onEnter({
          currentInputText,
          inputRefs,
          index,
          blocks,
          setBlocks,
          currLevel,
          editor,
          setShowAutoComplete,
        });
        // setBlocks(blocks);
        break;

      case "ArrowUp":
        setShowAutoComplete(false);
        editor.moveFocusUp(currLevel, inputRefs);
        break;

      case "ArrowDown":
        setShowAutoComplete(false);
        editor.moveFocusDown(currLevel, inputRefs);
        break;

      case "/":
        setShowAutoComplete(true);
        console.log(currentInputText);
        break;

      case "Backspace":
        event.preventDefault();
        onDelete({
          currentInputText,
          inputRefs,
          index,
          blocks,
          setBlocks,
          currLevel,
          editor,
        });
        break;
      default:
        // save edits
        blocks[currLevel].data.text = currentInputText as string;
        setBlocks(blocks);

        // TODO: bug here will only be fixed ones the saving system is in place.
        setSearchTerm(currentInputText?.split("/")[1] as string);

        if (showAutoComplete) {
          setFilteredTerms(
            autoCompleteTerms
              .filter((item) =>
                item.title.toLowerCase().includes(searchTerm.toLowerCase()),
              )
              .slice(0, 3),
          );
        }

        break;
    }
  };

  useEffect(() => {
    setBlocks(blocks);
  }, [block, blocks, setBlocks, inputRefs]);

  // TODO: add change block feature
  switch (currBlockType) {
    case BlockType.TEXT:
      return (
        <InputTextBlock
          handleKeyDown={handleKeyDown}
          block={block}
          inputRefs={inputRefs}
          index={index}
          showAutoComplete={showAutoComplete}
          filteredTerms={filteredTerms}
          blockType={currBlockType}
          className=""
        />
      );
    case BlockType.H1:
      return (
        <InputTextBlock
          handleKeyDown={handleKeyDown}
          block={block}
          inputRefs={inputRefs}
          index={index}
          showAutoComplete={showAutoComplete}
          filteredTerms={filteredTerms}
          blockType={currBlockType}
          className="p-2 text-6xl font-extrabold"
        />
      );
    case BlockType.H2:
      return (
        <InputTextBlock
          handleKeyDown={handleKeyDown}
          block={block}
          inputRefs={inputRefs}
          index={index}
          showAutoComplete={showAutoComplete}
          filteredTerms={filteredTerms}
          blockType={currBlockType}
          className="p-2 text-5xl font-bold"
        />
      );
    case BlockType.H3:
      return (
        <InputTextBlock
          handleKeyDown={handleKeyDown}
          block={block}
          inputRefs={inputRefs}
          index={index}
          showAutoComplete={showAutoComplete}
          filteredTerms={filteredTerms}
          blockType={currBlockType}
          className="p-2 text-4xl font-extrabold"
        />
      );

    // default:
    //   return (
    //     <TextBlock
    //       handleKeyDown={handleKeyDown}
    //       block={block}
    //       inputRefs={inputRefs}
    //       index={index}
    //       showAutoComplete={showAutoComplete}
    //       filteredTerms={filteredTerms}
    //     />
    //   );
    // break;
  }
}
