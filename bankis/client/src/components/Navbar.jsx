import { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="header">
      <div className="header__top">
        <Link
          to="/"
          className="header__logo-link"
          aria-label="BIS - на головну"
          onClick={closeMenu}
        >
          <div className="header__logo">
            <img
              className="logo__image"
              src="/images/bis-logo.jpg"
              alt="BIS — Банкінтерсервіс"
            />
          </div>
        </Link>
        <button
          type="button"
          className="nav__burger"
          aria-label={menuOpen ? "Закрити меню" : "Відкрити меню"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>
      <nav className={`nav${menuOpen ? " nav--open" : ""}`}>
        <Link to="/" className="nav__link" onClick={closeMenu}>
          Головна
        </Link>
        <Link to="/catalog" className="nav__link" onClick={closeMenu}>
          Каталог
        </Link>
        <Link to="/service" className="nav__link" onClick={closeMenu}>
          Сервіс
        </Link>
      </nav>
    </header>
  );
}
export default Navbar