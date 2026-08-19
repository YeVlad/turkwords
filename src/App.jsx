import { supabase } from "./supabase";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import { useEffect, useState } from "react";
import "./App.css";

import Home from "./pages/Home";
import TableOfWords from "./pages/TableOfWords";
import RedactWords from "./pages/RedactWords";

function App() {
  const [words, setWords] = useState([]);

  useEffect(() => {
    async function loadWords() {
      const { data, error } = await supabase
        .from("words")
        .select("*")
        .order("word", { ascending: true });

      if (error) {
        console.error("Помилка завантаження:", error);
        return;
      }

      setWords(data);
    }

    loadWords();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tableofwords" element={<TableOfWords words={words} />} />
        <Route
          path="/redactwords"
          element={<RedactWords words={words} setWords={setWords} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
