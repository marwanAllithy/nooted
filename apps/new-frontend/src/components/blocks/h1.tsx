type Props = {
 inputRef: (el: HTMLInputElement | null) => void;
 handleKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
 text: string;
};

export default function Header1({ handleKeyDown, inputRef, text }: Props) {
 return (
  <h1
   onKeyDown={handleKeyDown}
   ref={inputRef}
   suppressContentEditableWarning={true}
   contentEditable
  >
   {text}
  </h1>
 );
}
