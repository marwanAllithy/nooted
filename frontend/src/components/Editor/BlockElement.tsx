import Block from "@/lib/Editor/Block";
import React, { useEffect, useState } from "react";
import { autoCompleteTerms } from "@/constants";
import { BlockType } from "@/types/editor";
import {
  TextBlock,
  Header1,
  Header2,
  Header3,
  // Header4,
  // Header5,
  // Header6,
} from "../blocks";
import { getCaretPosition } from "@/lib/utils";

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
    const currentInputText = inputRefs.current[index]?.innerText;
    console.log(event.key, currLevel);

    switch (event.key) {
      case "Enter":
        event.preventDefault();

        const cursorPosition = getCaretPosition(inputRefs.current[index]);

        if (currentInputText && cursorPosition == 0) {
          blocks[currLevel].data.text = "";
          editor.addBlock(
            blocks,
            setBlocks,
            BlockType.TEXT,
            currentInputText as string,
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
          setShowAutoComplete(false);
          // change the current block

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
        <TextBlock
          handleKeyDown={handleKeyDown}
          block={block}
          inputRefs={inputRefs}
          index={index}
          showAutoComplete={showAutoComplete}
          filteredTerms={filteredTerms}
        />
      );
    case BlockType.H1:
      return (
        <Header1
          handleKeyDown={handleKeyDown}
          block={block}
          inputRefs={inputRefs}
          index={index}
          showAutoComplete={showAutoComplete}
          filteredTerms={filteredTerms}
        />
      );
    case BlockType.H2:
      return (
        <Header2
          handleKeyDown={handleKeyDown}
          block={block}
          inputRefs={inputRefs}
          index={index}
          showAutoComplete={showAutoComplete}
          filteredTerms={filteredTerms}
        />
      );
    case BlockType.H3:
      return (
        <Header3
          handleKeyDown={handleKeyDown}
          block={block}
          inputRefs={inputRefs}
          index={index}
          showAutoComplete={showAutoComplete}
          filteredTerms={filteredTerms}
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
