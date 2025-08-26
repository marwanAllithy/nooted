import React, { useEffect, useRef } from "react";
import type Block from "@/lib/Editor/Block";
// import { Card } from "../ui/card";
import type { BlockType } from "@/types";
import { cn, getCaretPosition, setCaretPosition } from "@/lib/utils";

interface Props {
  block: Block;
  index: number;
  inputRefs: React.RefObject<(HTMLDivElement | null)[]>;
  handleKeyDown: any;
  blockType: BlockType;
  className?: string;
  //   blockType: BlockType;
}

export default function InputTextBlock({
  block,
  inputRefs,
  handleKeyDown,
  index,
  // blockType,
  className = "",
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

  // update only when text actually differs; save & restore caret
  useEffect(() => {
    if (!ref.current) return;
    if (ref.current.innerText === block.data.text) return;
    const caret = getCaretPosition(ref.current);
    ref.current.innerText = block.data.text;
    // clamp caret to new text length
    setCaretPosition(ref.current, Math.min(caret, block.data.text.length));
  }, [block.data.text]);

  return (
    <div className="relative">
      <div
        key={block?.level}
        ref={(el) => {
          ref.current = el;
          inputRefs.current[index] = el;
        }}
        contentEditable
        suppressContentEditableWarning={true}
        onKeyDown={(e) => handleKeyDown(e, block.level)}
        className={cn(
          "border-none ring-0 outline-none focus:ring-0 focus:outline-none",
          className,
        )}
      />
    </div>
  );
}
