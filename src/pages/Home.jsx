import { Link } from "react-router-dom";

function Home() {
  return (
    <div>
      <h1>Home</h1>

      <Link className="menu_button" to="/tableofwords">Таблиця слів</Link>

      <br />

      <Link className="menu_button" to="/redactwords">Редагування слів</Link>

      <br />

      <Link className="menu_button" to="/checkgame">CheckGame</Link>
    </div>
  );
}

export default Home;
