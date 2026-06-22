import { useState, useEffect, useCallback } from "react";
import "./ProductCard.css";

/**
 * ProductCard — картка товару з lightbox
 *
 * Використання:
 * <ProductCard
 *   image="/images/products/dors-410.jpg"
 *   name="DORS 410"
 *   description="Вакуумний пакувальник банкнот..."
 *   price="12 500 грн"
 * />
 */

export function ImageLightbox({ image, name, onClose }) {
  const handleKey = useCallback((e) => {
    if (e.key === "Escape") onClose();
  }, [onClose]);

  useEffect(() => {
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [handleKey]);

  return (
    <div
      className="pc-lightbox-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="pc-lightbox-inner">
        <div className="pc-lightbox-header">
          <p className="pc-lightbox-title">{name}</p>
          <button className="pc-lightbox-close" onClick={onClose} aria-label="Закрити">
            ✕
          </button>
        </div>
        <div className="pc-lightbox-img-wrap">
          <img src={image} alt={name} />
        </div>
      </div>
    </div>
  );
}

export default function ProductCard({
  image,
  name,
  description,
  price,
  onOrderClick,
  onNameClick,
}) {
  const [lightboxOpen, setLightboxOpen] = useState(false);

  return (
    <>
      <div className="pc-card">
        <div
          className="pc-image-wrap"
          onClick={() => image && setLightboxOpen(true)}
          role="button"
          tabIndex={image ? 0 : -1}
          aria-label={image ? `Переглянути фото: ${name}` : undefined}
          onKeyDown={(e) => e.key === "Enter" && image && setLightboxOpen(true)}
        >
          {image ? (
            <img src={image} alt={name} />
          ) : (
            <span className="pc-no-image">📷</span>
          )}
          {image && <span className="pc-zoom-hint">Збільшити ↗</span>}
        </div>

        <div className="pc-body">
          <h3
            className={`pc-name${onNameClick ? " pc-name--link" : ""}`}
            onClick={onNameClick}
          >
            {name}
          </h3>
          {description && (
            <p className="pc-description">{description}</p>
          )}
          <div className="pc-footer">
            {price && <span className="pc-price">{price}</span>}
            <button
              type="button"
              className="pc-btn"
              onClick={(e) => {
                e.stopPropagation();
                onOrderClick?.();
              }}
            >
              Замовити консультацію
            </button>
          </div>
        </div>
      </div>

      {lightboxOpen && image && (
        <ImageLightbox
          image={image}
          name={name}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </>
  );
}
