type Props = {
 inputRef: (el: HTMLInputElement | null) => void;
 handleKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
 text: string;
 handleBlockChange: any;
 
};

export default function TextBlock({
 handleKeyDown,
 inputRef,
 text,
 handleBlockChange,
}: Props) {
 return (
  <div
   onKeyDown={handleKeyDown}
   ref={inputRef}
   suppressContentEditableWarning={true}
   contentEditable
  >
   {text}
  </div>
 );
}
