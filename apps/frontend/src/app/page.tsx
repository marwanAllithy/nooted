"use client";

import Image, { type ImageProps } from "next/image";
import Editor from "@/components/editor";
import EditorComponent from "@/components/editor/Editor";

type Props = Omit<ImageProps, "src"> & {
 srcLight: string;
 srcDark: string;
};

export default function Home() {
 return (
  <div className="h-screen p-10">
   {/* <Editor /> */}
   <EditorComponent/>
  </div>
 );
}
