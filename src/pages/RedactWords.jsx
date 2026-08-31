import { supabase } from "../supabase";

import { Link } from "react-router-dom";

import { useState } from "react";

function RedactWords({ words, setWords, allTags }) {
  const [word, setWord] = useState("");
  const [translation, setTranslation] = useState("");
  const [tag, setTag] = useState("Дієслово");

  const sortedWords = [...words].sort((a, b) => a.word.localeCompare(b.word));

  const tags = allTags;

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
      <div className="menu">
        <h1>Редагування слів</h1>

        <input
          className="inputstyle"
          type="text"
          placeholder="Оригінал"
          value={word}
          onChange={(e) => setWord(e.target.value)}
        />

        <input
          className="inputstyle"
          type="text"
          placeholder="Переклад"
          value={translation}
          onChange={(e) => setTranslation(e.target.value)}
        />

        <select
          className="inputstyle"
          value={tag}
          onChange={(e) => setTag(e.target.value)}
        >
          {tags.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>

        <button className="bigsmash" onClick={addWord}>
          Додати
        </button>
      </div>
      <hr />
      <div className="deleteitems">
        {sortedWords.map((item) => (
          <div key={item.id}>
            {item.word} — {item.translation} — {item.tag}
            <button onClick={() => deleteWord(item.id)}>Видалити</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RedactWords;
