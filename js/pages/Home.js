/* ============================================
   AXOU BOUTIQUE — Home Page
   ============================================ */

function renderHome() {
  const isLoaded = Store.isLoaded();
  const featured = Store.getFeatured();
  const categories = Store.getCategories();

  if (!isLoaded) {
    return `
      <section class="hero hero-skeleton">
        <div class="container">
          <div class="skeleton skeleton-title" style="max-width: 500px; height: 3rem; margin-bottom: 2rem;"></div>
          <div class="skeleton skeleton-text" style="max-width: 400px; height: 1.2rem; margin-bottom: 1rem;"></div>
          <div class="skeleton skeleton-text" style="max-width: 350px; height: 1.2rem; margin-bottom: 2.5rem;"></div>
          <div style="display: flex; gap: 1rem;">
             <div class="skeleton skeleton-btn" style="width: 180px; height: 48px;"></div>
             <div class="skeleton skeleton-btn" style="width: 180px; height: 48px;"></div>
          </div>
        </div>
      </section>
      <!-- Featured Products Skeleton (NOW FIRST) -->
      <section class="section">
        <div class="container">
          <div class="skeleton skeleton-title" style="max-width: 200px; height: 2rem; margin: 0 auto 3rem;"></div>
          <div class="products-grid">
            <div class="product-card skeleton" style="height: 400px; border:none; background:none;"></div>
            <div class="product-card skeleton" style="height: 400px; border:none; background:none;"></div>
            <div class="product-card skeleton" style="height: 400px; border:none; background:none;"></div>
            <div class="product-card skeleton" style="height: 400px; border:none; background:none;"></div>
          </div>
        </div>
      </section>
      <!-- Categories Skeleton (NOW SECOND) -->
      <section class="section">
        <div class="container">
          <div class="skeleton skeleton-title" style="max-width: 250px; height: 2rem; margin: 0 auto 3rem;"></div>
          <div class="categories-grid">
            <div class="skeleton category-card-skeleton" style="height: 380px;"></div>
            <div class="skeleton category-card-skeleton" style="height: 380px;"></div>
            <div class="skeleton category-card-skeleton" style="height: 380px;"></div>
          </div>
        </div>
      </section>
    `;
  }

  const categoriesHTML = categories.map(cat => `
    <div class="category-card" onclick="Router.navigate('/catalog/${cat.id}')">
      <div class="category-card-bg img-loading" style="background-image: url('${cat.image}')" 
           onload="this.classList.replace('img-loading', 'img-loaded')"></div>
      <div class="category-card-overlay"></div>
      <div class="category-card-content">
        <h3>${cat.icon} ${cat.name}</h3>
        <p>${cat.description}</p>
        <span class="category-card-link">Découvrir la collection →</span>
      </div>
      <!-- Hidden image to trigger category load -->
      <img src="${cat.image}" style="display:none;" onload="this.previousElementSibling.previousElementSibling.previousElementSibling.classList.replace('img-loading', 'img-loaded')">
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
            <button class="btn btn-secondary btn-lg" onclick="Router.navigate('/catalog/featured')">
              Nos Bestsellers
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Products Section (NOW FIRST) -->
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

    <!-- Categories Section (NOW SECOND) -->
    <section class="section">
      <div class="container">
        <h2 class="section-title">Nos Catégories</h2>
        <p class="section-subtitle">Explorez nos collections soigneusement curatées</p>
        <div class="categories-grid">
          ${categoriesHTML}
        </div>
      </div>
    </section>
  `;
}

function renderProductCard(product) {
  return `
    <div class="product-card" onclick="Router.navigate('/product/${product.id}')">
      <div class="product-card-image-wrapper img-loading">
        <img class="product-card-image" src="${product.image}" alt="${product.name}" 
             style="opacity: 0;"
             onload="this.style.opacity='1'; this.parentElement.classList.remove('img-loading'); this.classList.add('img-loaded')"
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
