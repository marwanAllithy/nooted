export enum BlockType {
  TEXT = "text",
  IMAGE = "image",
  CALENDER = "calender",
  H1 = "h1",
  H2 = "h2",
  H3 = "h3",
  H4 = "h4",
  H5 = "h5",
  H6 = "h6",
  BULLETPOINT = "bulletpoint",
  NUMBEREDLIST = "numberedlist",
  DIVIDER = "divider",
  TABLE = "table",
  EMBED = "embed",
}

export type Preview = {
  left: number;
  width: number;
  height: number;
  offsetY: number;
  index: number;
};

export type DragRef = {
  from: number;
  over: number;
  rects: DOMRect[];
};
