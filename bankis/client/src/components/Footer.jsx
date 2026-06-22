import './Footer.css'

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__content">
        <div className="footer__info">
          <span className="footer__logo">BIS</span>
          <p>Банківське обладнання. Продаж. Ремонт. Сервіс.</p>
        </div>
        <div className="footer__contacts">
          <p>📍 м. Київ, пр-т Перемоги 65, БЦ "КАМЕТ", оф. 307</p>
          <p>📞 (044) 59-277-59</p>
          <p>✉️ office@bankis.kiev.ua</p>
        </div>
      </div>
      <div className="footer__bottom">
        <p>© 2026 BIS. Всі права захищені.</p>
      </div>
    </footer>
  )
}

export default Footer