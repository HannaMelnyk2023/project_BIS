import { useState } from 'react'
import axios from 'axios'
import './Service.css'

const API_URL = import.meta.env.VITE_API_URL || '/api'

function Service() {
  const [form, setForm] = useState({ name: '', phone: '', comment: '' })
  const [status, setStatus] = useState(null)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post(`${API_URL}/contact`, {
        name: form.name,
        phone: form.phone,
        comment: form.comment,
        product: 'Сервісний центр'
      })
      setStatus('success')
      setForm({ name: '', phone: '', comment: '' })
    } catch {
      setStatus('error')
    }
  }

  return (
    <main className="service">
      <h1 className="service__title">Сервісний центр</h1>

      <section className="service__about">
        <p>Сервісний центр займається гарантійним та післягарантійним
        обслуговуванням, та гарантійним ремонтом лічильників банкнот і монет,
        пакувальників банкнот, детекторів валют найвідоміших світових виробників.</p>
        <p><strong>Фахівці центра</strong> — висококваліфікований персонал,
        який навчався у фірмових навчальних центрах та у представників виробників.</p>
      </section>

      <section className="service__types">
        <h2>Сервісний центр пропонує виконання робіт за договором:</h2>
        <div className="service__cards">
          <div className="service__card">
            <h3>Разовий договір</h3>
            <p>Виконання робіт на разовій основі за потребою.</p>
          </div>
          <div className="service__card">
            <h3>Договір "за викликом"</h3>
            <p>Підписується довгостроковий договір, але роботи виконуються
            лише у випадку необхідності.</p>
          </div>
          <div className="service__card">
            <h3>Періодичне технічне обслуговування</h3>
            <p>Договір на регулярне технічне обслуговування обладнання.</p>
          </div>
        </div>
      </section>

      <section className="service__highlight">
        <p>Усі роботи виконуються у найкоротший термін з високою якістю
        та наданням гарантії на надані послуги.</p>
      </section>

      <section className="service__form">
        <h2>Замовити консультацію</h2>
        {status === 'success' && <p className="form__success">Дякуємо! Ми зв'яжемося з вами.</p>}
        {status === 'error' && <p className="form__error">Помилка відправки. Спробуйте ще раз.</p>}
        <form className="form" onSubmit={handleSubmit}>
          <input className="form__input" type="text" name="name" placeholder="Ваше ім'я" value={form.name} onChange={handleChange} required />
          <input className="form__input" type="tel" name="phone" placeholder="Телефон" value={form.phone} onChange={handleChange} required />
          <textarea className="form__textarea" name="comment" placeholder="Опишіть проблему або запитання" value={form.comment} onChange={handleChange}></textarea>
          <button className="form__btn" type="submit">Відправити</button>
        </form>
      </section>
    </main>
  )
}

export default Service