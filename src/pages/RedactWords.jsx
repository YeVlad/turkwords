import { Link } from "react-router-dom";

import { useState } from "react";

function RedactWords({ words, setWords }) {
  const [word, setWord] = useState("");
  const [translation, setTranslation] = useState("");
  const [tag, setTag] = useState("Дієслово");

  const sortedWords = [...words].sort((a, b) => a.word.localeCompare(b.word));

  const tags = ["Дієслово", "Тварь"];

  function addWord() {
    if (!word.trim() || !translation.trim()) {
      return;
    }

    const newWord = {
      id: Date.now(),
      word: word.trim(),
      translation: translation.trim(),
      tag: tag,
    };

    setWords([...words, newWord]);

    setWord("");
    setTranslation("");
    setTag("Дієслово");
  }

  return (
    <div>
      <Link to="/">На головну</Link>
      <h1>Редагування слів</h1>

      <input
        type="text"
        placeholder="Оригінал"
        value={word}
        onChange={(e) => setWord(e.target.value)}
      />

      <input
        type="text"
        placeholder="Переклад"
        value={translation}
        onChange={(e) => setTranslation(e.target.value)}
      />

      <select value={tag} onChange={(e) => setTag(e.target.value)}>
        {tags.map((tag) => (
          <option key={tag} value={tag}>
            {tag}
          </option>
        ))}
      </select>

      <button onClick={addWord}>Додати</button>

      <hr />

      {sortedWords.map((item) => (
        <div key={item.id}>
          {item.word} — {item.translation} — {item.tag}
          <button
            onClick={() =>
              setWords(words.filter((word) => word.id !== item.id))
            }
          >
            Видалити
          </button>
        </div>
      ))}
    </div>
  );
}

export default RedactWords;
