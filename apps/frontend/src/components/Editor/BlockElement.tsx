import Block from "@/lib/Editor/Block";
import { BlockType } from "@/types/editor";
import React, { useState } from "react";
import { autoCompleteTerms } from "@/constants";
import { TextBlock } from "../blocks";

type Props = {
  blocks: Block[];
  block: Block;
  setBlocks: any;
  index: number;
  inputRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
  editor: any;
  blockType: BlockType;
};

export default function BlockElement({
  blocks,
  block,
  blockType,
  setBlocks,
  index,
  inputRefs,
  editor,
}: Props) {
  const [showAutoComplete, setShowAutoComplete] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTerms, setFilteredTerms] = useState<any>([]);

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLDivElement>,
    currLevel: number
  ) => {
    console.log(event.key, currLevel);
    switch (event.key) {
      case "Enter":
        event.preventDefault();
        setShowAutoComplete(false);
        editor.addBlock(blocks, setBlocks, BlockType.TEXT, "", currLevel);
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
        console.log(inputRefs.current[index]?.innerText);
        break;
      default:
        // TODO: bug here will only be fixed ones the saving system is in place.
        console.log("split", inputRefs.current[index]?.innerText.split("/"));
        setSearchTerm(
          inputRefs.current[index]?.innerText.split("/")[1] as string
        );

        if (showAutoComplete) {
          setFilteredTerms(
            autoCompleteTerms
              .filter((item) =>
                item.title.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .slice(0, 3)
          );
        }

        break;
    }
  };

  // TODO: add change block feature
  switch (block?.type) {
    case blockType.TEXT:
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
      break;

    default:
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
      break;
  }
}
