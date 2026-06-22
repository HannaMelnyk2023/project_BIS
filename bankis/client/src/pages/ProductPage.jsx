import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProducts, getSpecs } from "../services/api";
import Modal from "../components/Modal";
import { ImageLightbox } from "../components/ProductCard";
import "./ProductPage.css";

function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [productSpecs, setProductSpecs] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const products = await getProducts();
        const found = products.find((p) => Number(p.id) === Number(id));
        setProduct(found ?? null);

        try {
          const specs = await getSpecs();
          if (found) {
            setProductSpecs(
              specs.filter(
                (spec) => Number(spec.product_id) === Number(found.id),
              ),
            );
          } else {
            setProductSpecs([]);
          }
        } catch (specError) {
          console.error("Помилка завантаження характеристик:", specError);
          setProductSpecs([]);
        }
      } catch (error) {
        console.error("Помилка:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div className="loading">Завантаження...</div>;
  if (!product) return <div className="loading">Товар не знайдено</div>;

  return (
    <main className="product-page">
      <button
        className="product-page__back"
        onClick={() => navigate("/catalog")}
      >
        ← Назад до каталогу
      </button>

<div className="product-page__content">
  
  {/* новий блок-обгортка */}
  <div className="product-page__image-wrap">
    <div
      className={`product-page__image${product.image_url ? " product-page__image--zoomable" : ""}`}
      onClick={() => product.image_url && setLightboxOpen(true)}
      onKeyDown={(e) =>
        e.key === "Enter" && product.image_url && setLightboxOpen(true)
      }
      role={product.image_url ? "button" : undefined}
      tabIndex={product.image_url ? 0 : undefined}
      aria-label={
        product.image_url ? `Переглянути фото: ${product.name}` : undefined
      }
    >
      {product.image_url ? (
        <img src={product.image_url} alt={product.name} />
      ) : (
        <span>📷</span>
      )}
    </div>

    <button
      className="product-page__btn"
      onClick={() => setShowModal(true)}
    >
      Замовити консультацію
    </button>
  </div>

  <div className="product-page__info">
    <h1 className="product-page__title">{product.name}</h1>
    <p className="product-page__price">{product.price} грн</p>

    {product.description && (
      <div className="product-page__description">
        <h3>Опис</h3>
        <p>{product.description}</p>
      </div>
    )}

    {productSpecs.length > 0 && (
      <div className="product-page__specs">
        <h3>Характеристики</h3>
        <div className="product-page__specs-table-wrap">
          <table className="product-page__specs-table">
            <tbody>
              {productSpecs.map((spec, index) => (
                <tr key={`${spec.label}-${index}`}>
                  <th>{spec.label}</th>
                  <td>{spec.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )}
  </div>

</div>
      {lightboxOpen && product.image_url && (
        <ImageLightbox
          image={product.image_url}
          name={product.name}
          onClose={() => setLightboxOpen(false)}
        />
      )}

      {showModal && (
        <Modal product={product} onClose={() => setShowModal(false)} />
      )}
    </main>
  );
}

export default ProductPage;
