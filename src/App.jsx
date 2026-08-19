import { BrowserRouter, Routes, Route } from "react-router-dom";

import { useState } from "react";
import "./App.css";
import wordsData from "./words";

import Home from "./pages/Home";
import TableOfWords from "./pages/TableOfWords";
import RedactWords from "./pages/RedactWords";

function App() {
  const [words, setWords] = useState(wordsData);

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
