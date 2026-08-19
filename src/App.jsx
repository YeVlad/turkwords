import { supabase } from "./supabase";

import { HashRouter, Routes, Route } from "react-router-dom";

import { useEffect, useState } from "react";
import "./App.css";

import Home from "./pages/Home";
import TableOfWords from "./pages/TableOfWords";
import RedactWords from "./pages/RedactWords";

function App() {
  const [words, setWords] = useState([]);

  useEffect(() => {
    async function loadWords() {
      console.log("Починаємо завантаження слів");

      const { data, error } = await supabase
        .from("words")
        .select("*")
        .order("word", { ascending: true });

      console.log("DATA:", data);
      console.log("ERROR:", error);

      if (error) {
        console.error("Помилка завантаження:", error);
        return;
      }

      setWords(data);
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
      </Routes>
    </HashRouter>
  );
}

export default App;
