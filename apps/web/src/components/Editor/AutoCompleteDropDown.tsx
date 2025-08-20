// TODO: depricated

type Props = {
  autoCompleteWords: { title: string; description: string }[];
  term: string;
  onSelect: (word: string) => void;
};

export default function AutoCompleteDropDown({
  autoCompleteWords,
  term,
  onSelect,
}: Props) {
  const filteredWords = autoCompleteWords.filter((word) =>
    word.title.toLowerCase().includes(term.toLowerCase()),
  );

  return (
    <div className="absolute rounded border border-gray-300 bg-white shadow-md">
      {filteredWords.map((word) => (
        <div
          key={word.title}
          className="cursor-pointer p-2 hover:bg-gray-100"
          onClick={() => onSelect(word.title)}
        >
          <strong>{word.title}</strong> - {word.description}
        </div>
      ))}
    </div>
  );
}
