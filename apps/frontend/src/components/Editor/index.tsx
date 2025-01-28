import React, { useEffect, useRef } from "react";
import EditorJS from "@editorjs/editorjs";
import dynamic from "next/dynamic";

const EditorComponent: React.FC = () => {
 const editorRef = useRef<EditorJS | null>(null);

 useEffect(() => {
  if (!editorRef.current) {
   editorRef.current = new EditorJS({
    holder: "editorjs",
    tools: {
     header: {
      class: require("@editorjs/header"),
      inlineToolbar: true,
     },
     list: {
      class: require("@editorjs/list"),
      inlineToolbar: true,
     },
     // Add more tools as needed
    },
    onReady: () => {
     console.log("Editor.js is ready to work!");
    },
    onChange: () => {
     console.log("Content changed!");
    },
   });
  }

  return () => {
   if (editorRef.current) {
    // editorRef.current.destroy();
    editorRef.current = null;
   }
  };
 }, []);

 return (
  <div id="editorjs" style={{ border: "1px solid #ccc", padding: "10px" }} />
 );
};

export default dynamic(() => Promise.resolve(EditorComponent), { ssr: false });
