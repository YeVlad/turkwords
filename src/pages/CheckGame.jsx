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

function CheckGame({ words = [], loading }) {
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

  // Категорії
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
    "Вирази",
    "Привітання",
    "Інше",
  ];

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

    setSelectedAnswer(null);

    setGameStarted(true);
  }

  function handleAnswer(answer) {
    // Не дозволяємо натискати кілька разів
    if (selectedAnswer !== null) {
      return;
    }

    setSelectedAnswer(answer);

    const currentWord = gameWords[currentIndex];

    const correctAnswer =
      direction === "tr-ua" ? currentWord.translation : currentWord.word;

    if (answer === correctAnswer) {
      setCorrectAnswers((prev) => prev + 1);
    } else {
      setWrongAnswers((prev) => [...prev, currentWord]);
    }

    // Через 2 секунди наступне питання
    setTimeout(() => {
      setCurrentIndex((prev) => prev + 1);
    }, 500);
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
        {" "}
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
      <div>
        <Link to="/">На головну</Link>
        <h1>Гру завершено!</h1>
        <h2>Правильно: {correctAnswers}</h2>
        <h2>Неправильно: {total - correctAnswers}</h2>
        <h2>Результат: {percentage}%</h2>
        {wrongAnswers.length > 0 && (
          <div>
            <h2>Помилки:</h2>

            {wrongAnswers.map((word) => (
              <div key={word.id}>
                {word.word} — {word.translation}
              </div>
            ))}
          </div>
        )}
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
      <div className="buttons_options">
        {options.map((option) => {
          const isCorrect = option === correctAnswer;

          const isSelected = option === selectedAnswer;

          let className = "";

          if (selectedAnswer !== null) {
            if (isCorrect) {
              className = "correct";
            } else if (isSelected) {
              className = "wrong";
            }
          }

          return (
            <button
              key={option}
              className={`${className} button_option`}
              onClick={() => handleAnswer(option)}
              disabled={selectedAnswer !== null}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default CheckGame;
