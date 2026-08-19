import { Link } from "react-router-dom";

function Home() {
  return (
    <div>
      <h1>Home</h1>

      <Link to="/tableofwords">Таблиця слів</Link>

      <br />

      <Link to="/redactwords">Редагування слів</Link>
    </div>
  );
}

export default Home;
