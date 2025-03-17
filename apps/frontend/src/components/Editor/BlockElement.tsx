import Block from "@/lib/Editor/Block";
import { BlockType } from "@/types/editor";
import React, { useState } from "react";
import { autoCompleteTerms } from "@/constants";

type Props = {
  blocks: Block[];
  block: Block;
  setBlocks: any;
  index: number;
  inputRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
  editor: any;
};

export default function BlockElement({
  blocks,
  block,
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
        // console.log("Search term: ", searchTerm);
        // TODO: look for the search term that is written right after the / then look for it using our arrays to find the respective block type
        // Handle popup logic here
        break;
      default:
        console.log("split", inputRefs.current[index]?.innerText.split("/"));
        setSearchTerm(
          inputRefs.current[index]?.innerText.split("/")[1] as string
        );

        if (showAutoComplete) {
          console.log("Search Term: ", autoCompleteTerms);
          setFilteredTerms(
            autoCompleteTerms.filter((item) =>
              item.title.toLowerCase().includes(autoCompleteTerms.toLowerCase())
            )
          );
          // setFilteredTerms(filteredItems);
        }


        break;
    }
  };

  return (
    <>
      <div
        className="prose relative "
        key={block?.level}
        ref={(el) => {
          inputRefs.current[index] = el;
        }}
        contentEditable
        suppressContentEditableWarning={true}
        onKeyDown={(e) => handleKeyDown(e, block.level)}
      >
        {block.data.text}
      </div>
      {showAutoComplete &&
        filteredTerms.map((terms: { title: string; description: string }) => (
          <div>
            <h4>{terms.title}</h4>
            <p>{terms.description}</p>
          </div>
        ))}
    </>
  );
}
