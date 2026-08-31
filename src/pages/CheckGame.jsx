import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function shuffleArray(array) {
  const shuffled = [...array];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

function CheckGame({ words = [], loading, allTags }) {
  // Налаштування гри
  const [category, setCategory] = useState("Усі");
  const [direction, setDirection] = useState("tr-ua");
  const [questionCount, setQuestionCount] = useState(10);

  // Стан гри
  const [gameStarted, setGameStarted] = useState(false);
  const [gameWords, setGameWords] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [options, setOptions] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  // Результат
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState([]);
  const [answerResults, setAnswerResults] = useState([]);

  // Категорії
  const tags = allTags;

  const categories = ["Усі", ...tags];

  // Фільтруємо слова за категорією
  const availableWords =
    category === "Усі" ? words : words.filter((word) => word.tag === category);

  // Максимальна кількість питань
  const maxQuestions = Math.min(50, availableWords.length);

  // Створюємо 6 варіантів відповіді
  useEffect(() => {
    if (!gameStarted) {
      return;
    }

    if (gameWords.length === 0) {
      return;
    }

    if (currentIndex >= gameWords.length) {
      return;
    }

    const currentWord = gameWords[currentIndex];

    // Правильна відповідь
    const correctAnswer =
      direction === "tr-ua" ? currentWord.translation : currentWord.word;

    // Беремо слова з тієї ж категорії
    const categoryWords =
      category === "Усі"
        ? words
        : words.filter((word) => word.tag === category);

    // Отримуємо неправильні відповіді
    const wrongAnswers = categoryWords
      .filter((word) => word.id !== currentWord.id)
      .map((word) => (direction === "tr-ua" ? word.translation : word.word));

    // Прибираємо дублікати
    const uniqueWrongAnswers = [...new Set(wrongAnswers)];

    // Перемішуємо неправильні відповіді
    const shuffledWrongAnswers = shuffleArray(uniqueWrongAnswers);

    // Беремо максимум 5 неправильних
    const selectedWrongAnswers = shuffledWrongAnswers.slice(0, 5);

    // 1 правильна + 5 неправильних
    const allOptions = [correctAnswer, ...selectedWrongAnswers];

    // Правильно перемішуємо всі варіанти
    const shuffledOptions = shuffleArray(allOptions);

    setOptions(shuffledOptions);
    setSelectedAnswer(null);
  }, [currentIndex, gameWords, words, direction, category, gameStarted]);

  function startGame() {
    if (availableWords.length < 6) {
      return;
    }

    // Випадково перемішуємо слова для самої гри
    const shuffledWords = shuffleArray(availableWords);

    // Вибираємо потрібну кількість
    const selectedWords = shuffledWords.slice(
      0,
      Math.min(questionCount, availableWords.length),
    );

    setGameWords(selectedWords);
    setCurrentIndex(0);

    setCorrectAnswers(0);
    setWrongAnswers([]);
    setAnswerResults([]);

    setSelectedAnswer(null);

    setGameStarted(true);
  }

  function handleAnswer(answer) {
    if (selectedAnswer !== null) {
      return;
    }

    setSelectedAnswer(answer);

    const currentWord = gameWords[currentIndex];

    const correctAnswer =
      direction === "tr-ua" ? currentWord.translation : currentWord.word;

    const isCorrect = answer === correctAnswer;

    if (isCorrect) {
      setCorrectAnswers((prev) => prev + 1);
    } else {
      setWrongAnswers((prev) => [...prev, currentWord]);
    }

    setAnswerResults((prev) => [
      ...prev,
      {
        word: currentWord,
        userAnswer: answer,
        correctAnswer: correctAnswer,
        isCorrect: isCorrect,
      },
    ]);

    setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
    }, 1000);
  }

  // Завантаження
  if (loading) {
    return <h2>Завантаження слів...</h2>;
  }

  // Мінімум 6 слів
  if (words.length < 6) {
    return <h2>Для гри потрібно мінімум 6 слів.</h2>;
  }

  // =========================
  // НАЛАШТУВАННЯ ГРИ
  // =========================

  if (!gameStarted) {
    return (
      <div>
        <Link to="/">На головну</Link>
        <h1>Перевірка слів</h1>
        <h3>Категорія</h3>
        <select
          className="inputstyle"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <h3>Напрямок</h3>
        <select
          className="inputstyle"
          value={direction}
          onChange={(e) => setDirection(e.target.value)}
        >
          <option value="tr-ua">🇹🇷 Турецька → 🇺🇦 Українська</option>

          <option value="ua-tr">🇺🇦 Українська → 🇹🇷 Турецька</option>
        </select>
        <h3>Кількість слів</h3>
        <select
          className="inputstyle"
          value={questionCount}
          onChange={(e) => setQuestionCount(Number(e.target.value))}
        >
          <option value={5} disabled={availableWords.length < 6}>
            5
          </option>

          <option value={10} disabled={availableWords.length < 10}>
            10
          </option>

          <option value={20} disabled={availableWords.length < 20}>
            20
          </option>

          <option value={50} disabled={availableWords.length < 50}>
            50
          </option>
        </select>
        <p>Доступно слів: {availableWords.length}</p>
        {availableWords.length < 6 && (
          <p>У цій категорії недостатньо слів. Потрібно мінімум 6.</p>
        )}
        <button
          className="bigsmash"
          onClick={startGame}
          disabled={availableWords.length < 6}
        >
          Почати гру
        </button>
      </div>
    );
  }

  // =========================
  // КІНЕЦЬ ГРИ
  // =========================

  if (currentIndex >= gameWords.length) {
    const total = gameWords.length;

    const percentage = Math.round((correctAnswers / total) * 100);

    return (
      <div className="game_result">
        <Link className="back_button" to="/">
          На головну
        </Link>

        <h1>Гру завершено!</h1>

        <div className="score">
          <div>
            <span>Правильно</span>
            <strong className="score_correct">{correctAnswers}</strong>
          </div>

          <div>
            <span>Неправильно</span>
            <strong className="score_wrong">{total - correctAnswers}</strong>
          </div>

          <div>
            <span>Результат</span>
            <strong>{percentage}%</strong>
          </div>
        </div>

        <h2>Результати</h2>

        <div className="answer_results">
          {answerResults.map((result, index) => (
            <div
              key={result.word.id}
              className={
                result.isCorrect
                  ? "result_item result_correct"
                  : "result_item result_wrong"
              }
            >
              <div className="result_number">{index + 1}</div>

              <div className="result_content">
                <strong>
                  {direction === "tr-ua"
                    ? result.word.word
                    : result.word.translation}
                </strong>

                <span>Твоя відповідь: {result.userAnswer}</span>

                {!result.isCorrect && (
                  <span>Правильна відповідь: {result.correctAnswer}</span>
                )}
              </div>

              <div className="result_icon">{result.isCorrect ? "✓" : "✕"}</div>
            </div>
          ))}
        </div>

        <button
          className="bigsmash"
          onClick={() => {
            setGameStarted(false);
            setCurrentIndex(0);
            setSelectedAnswer(null);
          }}
        >
          Зіграти ще раз
        </button>
      </div>
    );
  }
  // =========================
  // ПОТОЧНЕ ПИТАННЯ
  // =========================

  const currentWord = gameWords[currentIndex];

  const question =
    direction === "tr-ua" ? currentWord.word : currentWord.translation;

  const correctAnswer =
    direction === "tr-ua" ? currentWord.translation : currentWord.word;

  return (
    <div>
      <h1>Вибери правильну відповідь</h1>

      <p>
        {currentIndex + 1} / {gameWords.length}
      </p>

      <h2>{question}</h2>
      <div className="select_answer">
        <select
          className={
            selectedAnswer === null
              ? ""
              : selectedAnswer === correctAnswer
                ? "correct"
                : "wrong"
          }
          value={selectedAnswer ?? ""}
          onChange={(e) => handleAnswer(e.target.value)}
          disabled={selectedAnswer !== null}
        >
          <option value="" disabled>
            Вибери відповідь...
          </option>

          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default CheckGame;
