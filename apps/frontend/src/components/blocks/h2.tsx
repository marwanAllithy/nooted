import React from "react";
import type Block from "@/lib/Editor/Block";
import { Card } from "../ui/card";

interface Props {
  //   blocks: Block[];
  //   setBlocks: any;
  //   blockType: BlockType;
  block: Block;
  index: number;
  inputRefs: React.MutableRefObject<(HTMLDivElement | null)[]>;
  handleKeyDown: any;
  showAutoComplete: boolean;
  filteredTerms: any;
}

export default function Header2({
  block,
  inputRefs,
  handleKeyDown,
  index,
  showAutoComplete,
  filteredTerms,
}: Props) {
  return (
    <div className="relative">
      <h2
        key={block?.level}
        ref={(el) => {
          inputRefs.current[index] = el;
        }}
        contentEditable
        suppressContentEditableWarning={true}
        onKeyDown={(e) => handleKeyDown(e, block.level)}
      >
        {block.data.text}
      </h2>
      {showAutoComplete && (
        <Card className="absolute top-6 p-6">
          {filteredTerms.map(
            (terms: { title: string; description: string }) => (
              <div className="p-2">
                <h4>{terms.title}</h4>
                <p>{terms.description}</p>
              </div>
            ),
          )}
        </Card>
      )}
    </div>
  );
}
