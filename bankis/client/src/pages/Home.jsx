import { useNavigate } from "react-router-dom";
import "./Home.css";

const categories = [
  {
    id: 1,
    name: "Лічильники банкнот",
    image: "/images/categories/lichelniki-banknot.jpg",
  },
  {
    id: 2,
    name: "Детектори банкнот",
    image: "/images/categories/detektory-banknot.jpg",
  },
  {
    id: 3,
    name: "Сортувальники банкнот",
    image: "/images/categories/sortuvalnyky-banknot.jpg",
  },
  {
    id: 4,
    name: "Лічильники монет",
    image: "/images/categories/lichelniki-monet.jpg",
  },
  {
    id: 5,
    name: "Пакувальники банкнот",
    image: "/images/categories/pakuvalnyky-banknot.jpg",
  },
  {
    id: 6,
    name: "Витратні матеріали",
    image: "/images/categories/vytratni-materialy.jpg",
  },
];

function Home() {
  const navigate = useNavigate();

  return (
    <main>
      <section className="hero">
        <h1 className="hero__title">Банківське обладнання</h1>
        <p className="hero__subtitle">Продаж. Ремонт. Сервіс.</p>
        <button className="hero__btn" onClick={() => navigate("/catalog")}>
          Переглянути каталог
        </button>
      </section>

      <section className="categories">
        <h2 className="categories__title">Каталог продукції</h2>
        <div className="categories__grid">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="category__card"
              onClick={() => navigate(`/catalog?category=${cat.id}`)}
            >
              <img src={cat.image} alt={cat.name} className="category__img" />
              <p className="category__name">{cat.name}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export default Home;
