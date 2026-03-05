/* ============================================
   AXOU BOUTIQUE — Product Detail Page
   ============================================ */

let detailQuantity = 1;

function getSocialMetrics(productId) {
  // Simple stable hash based on productId
  let hash = 0;
  for (let i = 0; i < productId.length; i++) {
    hash = ((hash << 5) - hash) + productId.charCodeAt(i);
    hash |= 0;
  }
  hash = Math.abs(hash);

  const now = new Date();
  const hour = now.getHours();
  const day = now.getDate();

  // Stable but varying numbers
  const views = (hash % 150) + (hour * 12) + 40;
  const sales = (hash % 25) + (day % 10) + 12;

  return { views, sales };
}

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
            
            <div class="product-stock-status" style="margin-bottom: var(--space-md); font-size: 0.9rem;">
              ${product.stock > 0
      ? `<span style="color: #4CAF50;">● En stock (${product.stock} disponibles)</span>`
      : `<span style="color: var(--color-danger);">● Rupture de stock</span>`}
            </div>
            
            <div class="product-social-metrics">
              <div class="metric">
                <span class="metric-icon">👁️</span>
                <span class="metric-text"><strong>${getSocialMetrics(product.id).views}</strong> personnes consultent ce produit</span>
              </div>
              <div class="metric">
                <span class="metric-icon">🛍️</span>
                <span class="metric-text"><strong>${getSocialMetrics(product.id).sales}</strong> achats réalisés ces derniers jours</span>
              </div>
            </div>

            <p class="product-detail-description">${product.description}</p>
            
            <div class="product-detail-quantity">
              <span style="color: var(--color-text-muted); font-size: 0.9rem;">Quantité :</span>
              <div class="quantity-control">
                <button class="quantity-btn" onclick="changeDetailQty(-1, ${product.stock})">−</button>
                <div class="quantity-value" id="detail-qty">${detailQuantity}</div>
                <button class="quantity-btn" onclick="changeDetailQty(1, ${product.stock})">+</button>
              </div>
            </div>

            <div class="product-detail-actions" style="display: flex; flex-direction: column; gap: var(--space-md);">
              <button class="btn btn-primary btn-lg" style="width: 100%;" onclick="addDetailToCart('${product.id}')" ${product.stock <= 0 ? 'disabled' : ''}>
                ${product.stock > 0 ? `🛒 Ajouter au panier — ${formatPrice(product.price * detailQuantity)}` : 'Rupture de stock'}
              </button>
              
              <button class="btn btn-secondary" style="width: 100%; display: flex; align-items: center; justify-content: center; gap: var(--space-sm);" onclick="copyProductLink('${product.id}')">
                <span>🔗</span> Partager ce produit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    ${relatedHTML}
  `;
}

function copyProductLink(productId) {
  // Use a more robust way to build the link
  // window.location.origin + window.location.pathname handles cases where the site is in a subfolder
  let baseUrl = window.location.origin + window.location.pathname;
  if (!baseUrl.endsWith('/')) baseUrl += '/';
  const url = baseUrl + '#/product/' + productId;

  navigator.clipboard.writeText(url).then(() => {
    showToast('Lien de partage copié dans le presse-papier !', 'success');
  }).catch(err => {
    console.error('Erreur lors de la copie :', err);
    showToast('Erreur lors de la copie du lien', 'error');
  });
}

function changeDetailQty(delta, maxStock) {
  const newQty = detailQuantity + delta;
  if (newQty >= 1 && newQty <= maxStock) {
    detailQuantity = newQty;
    App.refresh();
  } else if (newQty > maxStock) {
    showToast(`Désolé, seulement ${maxStock} en stock`, 'error');
  }
}

function addDetailToCart(productId) {
  const success = Store.addToCart(productId, detailQuantity);
  if (success) {
    showToast(`${detailQuantity} article(s) ajouté(s) au panier !`, 'success', true);
    detailQuantity = 1;
    App.refresh();
  }
}
