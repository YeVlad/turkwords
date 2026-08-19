import { supabase } from "./supabase";

import { HashRouter, Routes, Route } from "react-router-dom";

import { useEffect, useState } from "react";
import "./App.css";

import Home from "./pages/Home";
import TableOfWords from "./pages/TableOfWords";
import RedactWords from "./pages/RedactWords";
import CheckGame from "./pages/CheckGame";

function App() {
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWords() {
      const { data, error } = await supabase
        .from("words")
        .select("*")
        .order("word", { ascending: true });

      if (error) {
        console.error("Помилка завантаження:", error);
        setLoading(false);
        return;
      }

      setWords(data);
      setLoading(false);
    }

    loadWords();
  }, []);

  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tableofwords" element={<TableOfWords words={words} />} />
        <Route
          path="/redactwords"
          element={<RedactWords words={words} setWords={setWords} />}
        />
        <Route
          path="/checkgame"
          element={<CheckGame words={words} loading={loading} />}
        />
      </Routes>
    </HashRouter>
  );
}

export default App;
