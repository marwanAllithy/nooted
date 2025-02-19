import React from "react";

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
    word.title.toLowerCase().includes(term.toLowerCase())
  );

  return (
    <div className="absolute bg-white border border-gray-300 rounded shadow-md">
      {filteredWords.map((word) => (
        <div
          key={word.title}
          className="p-2 cursor-pointer hover:bg-gray-100"
          onClick={() => onSelect(word.title)}
        >
          <strong>{word.title}</strong> - {word.description}
        </div>
      ))}
    </div>
  );
}