import './Service.css'

function Service() {
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
        <form className="form">
          <input className="form__input" type="text" placeholder="Ваше ім'я" />
          <input className="form__input" type="tel" placeholder="Телефон" />
          <textarea className="form__textarea" placeholder="Опишіть проблему або запитання"></textarea>
          <button className="form__btn" type="submit">Відправити</button>
        </form>
      </section>
    </main>
  )
}

export default Service;