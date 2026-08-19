import { Link } from "react-router-dom";

function TableOfWords({ words }) {
  return (
    <div>
      <Link to="/">На головну</Link>
      <h1>Таблиця</h1>

      {words.map((word) => (
        <div key={word.id}>
          {word.word} — {word.translation} — {word.tag}
        </div>
      ))}
    </div>
  );
}

export default TableOfWords;
