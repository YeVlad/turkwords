import { Link } from "react-router-dom";
import { useState } from "react";

function TableOfWords({ words, allTags }) {
  const [selectedTag, setSelectedTag] = useState("Усі");

  const filteredWords =
    selectedTag === "Усі"
      ? words
      : words.filter((word) => word.tag === selectedTag);

  const sortedWords = [...filteredWords].sort((a, b) =>
    a.word.localeCompare(b.word, undefined, { sensitivity: "base" }),
  );

  return (
    <div className="words_table">
      <Link to="/" className="back_button">
        На головну
      </Link>

      <h1>Таблиця</h1>

      <div className="tag_filter">
        <label htmlFor="tag_select">Фільтр за тегом:</label>

        <select
          id="tag_select"
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
        >
          <option value="Усі">Усі</option>

          {allTags.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
      </div>

      <div className="words_list">
        {sortedWords.map((word) => (
          <div className="word_item" key={word.id}>
            <div className="word_content">
              <strong>{word.word}</strong>
              <span>{word.translation}</span>
            </div>

            <span className="word_tag">{word.tag}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TableOfWords;
