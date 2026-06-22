import { useState, useEffect } from "react";
import { getCategories, getProducts } from "../services/api";
import Modal from "../components/Modal";
import ProductCard from "../components/ProductCard";
import "./Catalog.css";
import { useNavigate, useSearchParams } from "react-router-dom";

function Catalog() {
const navigate = useNavigate();
const [searchParams] = useSearchParams();  // ← спочатку це

const [categories, setCategories] = useState([]);
const [products, setProducts] = useState([]);
const [activeCategory, setActiveCategory] = useState(  // ← потім це
  searchParams.get("category") ? Number(searchParams.get("category")) : null,
);
const [loading, setLoading] = useState(true);
const [selectedProduct, setSelectedProduct] = useState(null);
 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cats, prods] = await Promise.all([
          getCategories(),
          getProducts(),
        ]);
        setCategories(cats);
        setProducts(prods);
      } catch (error) {
        console.error("Помилка:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filtered = activeCategory
    ? products.filter((p) => p.category_id === activeCategory)
    : products;

  if (loading) return <div className="loading">Завантаження...</div>;

  return (
    <main className="catalog">
      <h1 className="catalog__title">Каталог продукції</h1>

      <div className="catalog__layout">
        <aside className="catalog__sidebar">
          <p
            className={`sidebar__item ${activeCategory === null ? "active" : ""}`}
            onClick={() => setActiveCategory(null)}
          >
            Всі товари
          </p>
          {categories.map((cat) => (
            <p
              key={cat.id}
              className={`sidebar__item ${activeCategory === cat.id ? "active" : ""}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.name}
            </p>
          ))}
        </aside>

        <div className="catalog__products">
          {filtered.map((product) => (
            <ProductCard
              key={product.id}
              image={product.image_url}
              name={product.name}
              description={product.short_description || product.description}
              price={`${product.price} грн`}
              onNameClick={() => navigate(`/product/${product.id}`)}
              onOrderClick={() => setSelectedProduct(product)}
            />
          ))}
        </div>
      </div>

      {selectedProduct && (
        <Modal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </main>
  );
}

export default Catalog;
