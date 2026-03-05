/* ============================================
   AXOU BOUTIQUE — Home Page
   ============================================ */

function renderHome() {
  const featured = Store.getFeatured();
  const categories = Store.getCategories();

  const categoriesHTML = categories.map(cat => `
    <div class="category-card" onclick="Router.navigate('/catalog/${cat.id}')">
      <div class="category-card-bg" style="background-image: url('${cat.image}')"></div>
      <div class="category-card-overlay"></div>
      <div class="category-card-content">
        <h3>${cat.icon} ${cat.name}</h3>
        <p>${cat.description}</p>
      </div>
    </div>
  `).join('');

  const featuredHTML = featured.map(product => renderProductCard(product)).join('');

  return `
    <!-- Hero Section -->
    <section class="hero">
      <div class="container">
        <div class="hero-content">
          <div class="hero-badge">✨ Nouvelle Collection</div>
          <h1>L'Élégance <br><span class="highlight">Redéfinie</span></h1>
          <p>Découvrez notre sélection exclusive de produits de haute qualité. Chaque pièce est soigneusement choisie pour vous offrir le meilleur de l'élégance et du confort.</p>
          <div class="hero-buttons">
            <button class="btn btn-primary btn-lg" onclick="Router.navigate('/catalog')">
              Explorer la Collection
            </button>
            <button class="btn btn-secondary btn-lg" onclick="Router.navigate('/catalog/beaute')">
              Nos Bestsellers
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Categories Section -->
    <section class="section">
      <div class="container">
        <h2 class="section-title">Nos Catégories</h2>
        <p class="section-subtitle">Explorez nos collections soigneusement curatées</p>
        <div class="categories-grid">
          ${categoriesHTML}
        </div>
      </div>
    </section>

    <!-- Featured Products Section -->
    <section class="section featured-section">
      <div class="container">
        <h2 class="section-title">Produits Vedettes</h2>
        <p class="section-subtitle">Nos coups de cœur, sélectionnés pour vous</p>
        <div class="products-grid">
          ${featuredHTML}
        </div>
        <div style="text-align: center; margin-top: var(--space-2xl);">
          <button class="btn btn-secondary btn-lg" onclick="Router.navigate('/catalog')">
            Voir tout le catalogue →
          </button>
        </div>
      </div>
    </section>
  `;
}

function renderProductCard(product) {
  return `
    <div class="product-card" onclick="Router.navigate('/product/${product.id}')">
      <div class="product-card-image-wrapper">
        <img class="product-card-image" src="${product.image}" alt="${product.name}" 
             onerror="this.parentElement.innerHTML='<div class=\\'img-placeholder\\'>${getCategoryIcon(product.category)}</div>'">
        ${product.featured ? '<span class="product-card-badge">Vedette</span>' : ''}
        ${product.stock <= 0 ? '<span class="product-card-badge" style="background: var(--color-danger); right: auto; left: var(--space-sm);">Rupture</span>' : ''}
      </div>
      <div class="product-card-body">
        <div class="product-card-category">${getCategoryLabel(product.category)}</div>
        <h3 class="product-card-name">${product.name}</h3>
        <div class="product-card-actions">
          <span class="product-card-price">${formatPrice(product.price)}</span>
          ${product.stock > 0
      ? `<button class="btn btn-primary btn-sm" onclick="event.stopPropagation(); addToCartQuick('${product.id}')">🛒 Ajouter</button>`
      : `<button class="btn btn-secondary btn-sm" disabled style="opacity: 0.5; padding: 0.5rem 0.75rem;">Épuisé</button>`
    }
        </div>
      </div>
    </div>
  `;
}

function addToCartQuick(productId) {
  const success = Store.addToCart(productId, 1);
  if (success) {
    showToast('Produit ajouté au panier !', 'success', true);
    App.refresh();
  }
}
