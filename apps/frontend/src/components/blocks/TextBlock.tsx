import React, { useState, useRef, useEffect } from "react";

interface Props {
 handleKeyDown: (event: any) => void;
 inputRef: (el: any) => void;
 text: string;
}

export default function TextBlock({ handleKeyDown, inputRef, text }: Props) {
 const [showPopup, setShowPopup] = useState(false);
 const [isFocused, setIsFocused] = useState(false);
 const divRef = useRef<any>(null);

 useEffect(() => {
  const handleKeyPress = (event: KeyboardEvent) => {
   if (event.key === "/" && isFocused) {
    setShowPopup(true);
   }
  };

  const handleFocus = () => {
   setIsFocused(true);
  };

  const handleBlur = () => {
   setIsFocused(false);
   setShowPopup(false);
  };

  const divElement = divRef.current;
  if (divElement) {
   divElement.addEventListener("keypress", handleKeyPress);
   divElement.addEventListener("focus", handleFocus);
   divElement.addEventListener("blur", handleBlur);
  }

  return () => {
   if (divElement) {
    divElement.removeEventListener("keypress", handleKeyPress);
    divElement.removeEventListener("focus", handleFocus);
    divElement.removeEventListener("blur", handleBlur);
   }
  };
 }, [isFocused]);

 useEffect(() => {
  if (divRef.current) {
   divRef.current.innerText = text;
  }
 }, [text]);

 return (
  <div>
   <div
    onKeyDown={handleKeyDown}
    ref={(el: any) => {
     inputRef(el);
     divRef.current = el;
    }}
    suppressContentEditableWarning={true}
    contentEditable
   >
    {text}
   </div>
   {showPopup && (
    <div className="popup">
     <ul>
      <li>Block 1</li>
      <li>Block 2</li>
     </ul>
    </div>
   )}
  </div>
 );
}
