/* ============================================
   AXOU BOUTIQUE — Footer Component
   ============================================ */

function renderFooter() {
  return `
    <footer class="site-footer">
      <div class="container">
        <div class="footer-grid">
          <div>
            <div class="footer-brand">AXOU BOUTIQUE</div>
            <p class="footer-desc">
              Votre destination premium pour des produits de beauté, bijoux élégants et pyjamas de luxe. 
              Qualité et style, à portée de main.
            </p>
          </div>
          <div>
            <div class="footer-title">Navigation</div>
            <div class="footer-links">
              <a onclick="Router.navigate('/')">Accueil</a>
              <a onclick="Router.navigate('/catalog')">Catalogue</a>
              <a onclick="Router.navigate('/cart')">Panier</a>
            </div>
          </div>
          <div>
            <div class="footer-title">Catégories</div>
            <div class="footer-links">
              ${CATEGORIES.map(cat => `
                <a onclick="Router.navigate('/catalog/${cat.id}')">${cat.name}</a>
              `).join('')}
            </div>
          </div>
          <div>
            <div class="footer-title">Contact</div>
            <div class="footer-links">
              <a href="#">WhatsApp</a>
              <a href="#">Instagram</a>
              <a href="#">Email</a>
            </div>
          </div>
        </div>
        <div class="footer-bottom">
          &copy; ${new Date().getFullYear()} AXOU BOUTIQUE <span style="cursor: pointer; opacity: 0.5;" onclick="Router.navigate('/admin')">—</span> Tous droits réservés
        </div>
      </div>
    </footer>
  `;
}
