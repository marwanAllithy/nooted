"use client";

import EditorComponent from "@/components/Editor";
import Image, { type ImageProps } from "next/image";

type Props = Omit<ImageProps, "src"> & {
 srcLight: string;
 srcDark: string;
};

export default function Home() {
 return (
  <div className="h-screen p-10">
   {/* <Editor /> */}
   <EditorComponent />
  </div>
 );
}
