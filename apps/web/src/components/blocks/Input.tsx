import React, { useEffect, useRef } from "react";
import type Block from "@/lib/Editor/Block";
// import { Card } from "../ui/card";
import type { BlockType } from "@/types";
import { cn } from "@/lib/utils";

interface Props {
  block: Block;
  index: number;
  inputRefs: React.RefObject<(HTMLDivElement | null)[]>;
  handleKeyDown: any;
  blockType: BlockType;
  className?: string;
  onInputChange: (text: string) => void;
  //   blockType: BlockType;
}

export default function InputTextBlock({
  block,
  inputRefs,
  handleKeyDown,
  index,
  // blockType,
  className = "",
  onInputChange,
}: Props) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const mounted = useRef(false);

  // set initial innerText once
  useEffect(() => {
    if (!mounted.current && ref.current) {
      if (ref.current.innerText !== block.data.text) {
        ref.current.innerText = block.data.text;
      }
      mounted.current = true;
    }
  }, []);

  // Avoid overwriting DOM while typing; rely on key handler updates.

  return (
    <div className="relative">
      <div
        ref={(el) => {
          ref.current = el;
          inputRefs.current[index] = el;
        }}
        contentEditable
        suppressContentEditableWarning={true}
        onKeyDown={(e) => handleKeyDown(e, block.level)}
        onInput={() => onInputChange(ref.current?.innerText ?? "")}
        className={cn(
          "border-none ring-0 outline-none focus:ring-0 focus:outline-none",
          className,
        )}
      />
    </div>
  );
}
