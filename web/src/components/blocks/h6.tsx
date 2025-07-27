type Props = {
 inputRef: (el: HTMLInputElement | null) => void;
 handleKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
 text: string;
};

export default function Header6({ handleKeyDown, inputRef, text }: Props) {
 return (
  <h6
   onKeyDown={handleKeyDown}
   ref={inputRef}
   suppressContentEditableWarning={true}
   contentEditable
  >
   {text}
  </h6>
 );
}
