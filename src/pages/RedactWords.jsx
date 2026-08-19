import { supabase } from "../supabase";

import { Link } from "react-router-dom";

import { useState } from "react";

function RedactWords({ words, setWords }) {
  const [word, setWord] = useState("");
  const [translation, setTranslation] = useState("");
  const [tag, setTag] = useState("Дієслово");

  const sortedWords = [...words].sort((a, b) => a.word.localeCompare(b.word));

  const tags = [
    "Дієслово",
    "Прикметник",
    "Прислівник",
    "Займенник",
    "Службове",
    "Питальне",
    "Люди",
    "Час",
    "Їжа",
    "Будинок",
    "Вулиця",
    "Природа",
    "Інше",
  ];

  async function addWord() {
    if (!word.trim() || !translation.trim()) {
      return;
    }

    const { data, error } = await supabase
      .from("words")
      .insert([
        {
          word: word.trim(),
          translation: translation.trim(),
          tag: tag,
        },
      ])
      .select();

    if (error) {
      console.error("Помилка додавання:", error);
      return;
    }

    console.log("Додано:", data);

    setWords([...words, data[0]]);

    setWord("");
    setTranslation("");
    setTag("Дієслово");
  }

  async function deleteWord(id) {
    const { error } = await supabase.from("words").delete().eq("id", id);

    if (error) {
      console.error("Помилка видалення:", error);
      return;
    }

    setWords(words.filter((item) => item.id !== id));
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
          <button onClick={() => deleteWord(item.id)}>Видалити</button>
        </div>
      ))}
    </div>
  );
}

export default RedactWords;
