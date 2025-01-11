type Props = {
 inputRef: (el: HTMLInputElement | null) => void;
 handleKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
 text: string;
};

export default function Header5({ handleKeyDown, inputRef, text }: Props) {
 return (
  <h5
   onKeyDown={handleKeyDown}
   ref={inputRef}
   suppressContentEditableWarning={true}
   contentEditable
  >
   {text}
  </h5>
 );
}
