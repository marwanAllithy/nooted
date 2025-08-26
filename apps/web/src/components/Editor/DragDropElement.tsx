import type Block from "@/lib/Editor/Block";
import { BlockType } from "@/types";

type Props = {
  blocks: Block[];
  previewIndex: number;
};

export default function DragDropElement({ blocks, previewIndex }: Props) {
  const b = blocks[previewIndex];
  const base = "px-2 py-1";
  switch (b.type) {
    case BlockType.TEXT:
      return <div className={base}>{b.data.text}</div>;
    case BlockType.BULLETPOINT:
      return (
        <div className={`${base} flex items-start gap-2`}>
          <span className="select-none">-</span>
          <div>{b.data.text}</div>
        </div>
      );
    case BlockType.H1:
      return <div className={`${base} text-6xl font-black`}>{b.data.text}</div>;
    case BlockType.H2:
      return (
        <div className={`${base} text-5xl font-extrabold`}>{b.data.text}</div>
      );
    case BlockType.H3:
      return (
        <div className={`${base} text-4xl font-extrabold`}>{b.data.text}</div>
      );
    case BlockType.H4:
      return <div className={`${base} text-3xl font-bold`}>{b.data.text}</div>;
    case BlockType.H5:
      return (
        <div className={`${base} text-2xl font-semibold`}>{b.data.text}</div>
      );
    case BlockType.H6:
      return (
        <div className={`${base} text-xl font-semibold`}>{b.data.text}</div>
      );
    default:
      return <div className={base}>{b.data.text}</div>;
  }
}
