import React from "react";
import type Block from "@/lib/Editor/Block";
import { Card } from "../ui/card";
import type { BlockType } from "@/types/editor";
import { cn } from "@/lib/utils";

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
  blockType: BlockType;
  className?: string;
}

export default function InputTextBlock({
  block,
  inputRefs,
  handleKeyDown,
  index,
  showAutoComplete,
  filteredTerms,
  blockType,
  className = "",
}: Props) {
  return (
    <div className="relative">
      <div
        key={block?.level}
        ref={(el) => {
          inputRefs.current[index] = el;
        }}
        contentEditable
        suppressContentEditableWarning={true}
        onKeyDown={(e) => handleKeyDown(e, block.level)}
        className={cn(
          "border-none ring-0 outline-none focus:ring-0 focus:outline-none",
          className,
        )}
        style={{
          fontFamily:
            'ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI Variable Display", "Segoe UI", Helvetica, "Apple Color Emoji", Arial, sans-serif, "Segoe UI Emoji", "Segoe UI Symbol"',
        }}
        data-content-editable-leaf="true"
      >
        {block.data.text}
      </div>
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
