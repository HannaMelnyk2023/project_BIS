import { useState } from "react";
import axios from "axios";
import "./Modal.css";

function Modal({ product, onClose }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [comment, setComment] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await axios.post("https://bankis.kiev.ua/api/contact", {
        name,
        phone,
        comment,
        product: product?.name,
      });
      setSent(true);
    } catch (error) {
      console.error("Помилка:", error);
      alert("Помилка відправки. Спробуйте ще раз.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="modal__overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal__close" onClick={onClose}>
          ✕
        </button>
        <h2 className="modal__title">Замовити консультацію</h2>
        <p className="modal__product">
          {/* {product?.image_url && (
            <div className="modal__image">
              <img src={product.image_url} alt={product.name} />
            </div>
          )} */}
          Товар: <strong>{product?.name}</strong>
        </p>

        {sent ? (
          <div className="modal__success">
            <p>✅ Дякуємо! Ми зв'яжемось з вами найближчим часом.</p>
            <button className="form__btn" onClick={onClose}>
              Закрити
            </button>
          </div>
        ) : (
          <form className="form" onSubmit={handleSubmit}>
            <input
              className="form__input"
              type="text"
              placeholder="Ваше ім'я"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              className="form__input"
              type="tel"
              placeholder="Телефон"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
            <textarea
              className="form__textarea"
              placeholder="Коментар"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            ></textarea>
            <button className="form__btn" type="submit" disabled={sending}>
              {sending ? "Відправляємо..." : "Відправити"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Modal;
