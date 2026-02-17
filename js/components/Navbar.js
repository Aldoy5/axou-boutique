/* ============================================
   AXOU BOUTIQUE — Navbar Component
   ============================================ */

function renderNavbar() {
  const cartCount = Store.getCartCount();
  const currentRoute = Router.getCurrentRoute();

  const isActive = (path) => {
    if (path === '/' && (currentRoute === '/' || currentRoute === '')) return 'active';
    if (path !== '/' && currentRoute.startsWith(path)) return 'active';
    return '';
  };

  return `
    <nav class="navbar" id="main-navbar">
      <div class="container">
        <div class="nav-logo" onclick="handleLogoClick()">AXOU BOUTIQUE</div>
        <div class="nav-links" id="nav-links">
          <a class="nav-link ${isActive('/')}" onclick="Router.navigate('/')">Accueil</a>
          <a class="nav-link ${isActive('/catalog')}" onclick="Router.navigate('/catalog')">Catalogue</a>
          <a class="nav-link ${isActive('/cart')}" onclick="Router.navigate('/cart')">Panier</a>
          <div class="nav-cart" onclick="Router.navigate('/cart')">
            <span class="nav-cart-icon">🛒</span>
            ${cartCount > 0 ? `<span class="nav-cart-badge">${cartCount}</span>` : ''}
          </div>
        </div>
        <div class="nav-hamburger" id="nav-hamburger" onclick="toggleMobileMenu()">
          <span></span><span></span><span></span>
        </div>
      </div>
      <div class="nav-overlay" id="nav-overlay" onclick="toggleMobileMenu()"></div>
    </nav>
  `;
}

let logoClickCount = 0;
let logoClickTimeout = null;

function handleLogoClick() {
  logoClickCount++;
  clearTimeout(logoClickTimeout);

  if (logoClickCount === 3) {
    logoClickCount = 0;
    Router.navigate('/admin');
  } else {
    logoClickTimeout = setTimeout(() => {
      if (logoClickCount === 1) Router.navigate('/');
      logoClickCount = 0;
    }, 300);
  }
}

function toggleMobileMenu() {
  const links = document.getElementById('nav-links');
  const overlay = document.getElementById('nav-overlay');
  links.classList.toggle('open');
  overlay.classList.toggle('open');
}

// Navbar scroll effect
function initNavbarScroll() {
  window.addEventListener('scroll', () => {
    const navbar = document.getElementById('main-navbar');
    if (navbar) {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }
  });
}
