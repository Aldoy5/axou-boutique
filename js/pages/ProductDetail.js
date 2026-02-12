/* ============================================
   AXOU BOUTIQUE — Product Detail Page
   ============================================ */

let detailQuantity = 1;

function renderProductDetail(params) {
  const product = Store.getProduct(params.id);

  if (!product) {
    return `
      <div class="product-detail">
        <div class="container">
          <div class="no-results">
            <div class="no-results-icon">😕</div>
            <p>Produit introuvable</p>
            <button class="btn btn-primary" onclick="Router.navigate('/catalog')" style="margin-top: var(--space-lg);">
              Retour au catalogue
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // Get related products (same category, different id)
  const related = Store.getByCategory(product.category)
    .filter(p => p.id !== product.id)
    .slice(0, 3);

  const relatedHTML = related.length > 0
    ? `<section class="section">
        <div class="container">
          <h2 class="section-title">Vous aimerez aussi</h2>
          <p class="section-subtitle">Produits similaires de la même catégorie</p>
          <div class="products-grid">
            ${related.map(p => renderProductCard(p)).join('')}
          </div>
        </div>
      </section>`
    : '';

  return `
    <div class="product-detail">
      <div class="container">
        <a class="back-link" onclick="Router.navigate('/catalog')">← Retour au catalogue</a>
        
        <div class="product-detail-layout">
          <img class="product-detail-image" src="${product.image}" alt="${product.name}"
               onerror="this.src=''; this.style.background='var(--color-surface)'; this.style.display='flex'; this.alt='${getCategoryIcon(product.category)}'">
          
          <div class="product-detail-info">
            <div class="product-detail-category">${getCategoryLabel(product.category)}</div>
            <h1>${product.name}</h1>
            <div class="product-detail-price">${formatPrice(product.price)}</div>
            <p class="product-detail-description">${product.description}</p>
            
            <div class="product-detail-quantity">
              <span style="color: var(--color-text-muted); font-size: 0.9rem;">Quantité :</span>
              <div class="quantity-control">
                <button class="quantity-btn" onclick="changeDetailQty(-1)">−</button>
                <div class="quantity-value" id="detail-qty">${detailQuantity}</div>
                <button class="quantity-btn" onclick="changeDetailQty(1)">+</button>
              </div>
            </div>

            <button class="btn btn-primary btn-lg" style="width: 100%;" onclick="addDetailToCart('${product.id}')">
              🛒 Ajouter au panier — ${formatPrice(product.price * detailQuantity)}
            </button>
          </div>
        </div>
      </div>
    </div>
    ${relatedHTML}
  `;
}

function changeDetailQty(delta) {
  detailQuantity = Math.max(1, detailQuantity + delta);
  App.refresh();
}

function addDetailToCart(productId) {
  Store.addToCart(productId, detailQuantity);
  showToast(`${detailQuantity} article(s) ajouté(s) au panier !`);
  detailQuantity = 1;
  App.refresh();
}
