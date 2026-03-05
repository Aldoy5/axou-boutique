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
  const isLoaded = Store.isLoaded();
  const product = Store.getProduct(params.id);

  if (!isLoaded) {
    return `
      <div class="product-detail">
        <div class="container">
          <div class="loading-state" style="padding: var(--space-4xl) 0; text-align: center;">
            <div class="skeleton skeleton-img" style="max-width: 400px; height: 400px; margin: 0 auto var(--space-xl);"></div>
            <div class="skeleton skeleton-title" style="max-width: 300px; margin: 0 auto var(--space-md);"></div>
            <div class="skeleton skeleton-text" style="max-width: 200px; margin: 0 auto;"></div>
          </div>
        </div>
      </div>
    `;
  }

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
              
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-md);">
                <button class="btn btn-secondary" style="display: flex; align-items: center; justify-content: center; gap: var(--space-sm);" onclick="shareProduct('${product.id}')">
                  <span>📤</span> Partager
                </button>
                <button class="btn btn-secondary" style="display: flex; align-items: center; justify-content: center; gap: var(--space-sm); border-color: #25D366; color: #25D366;" onclick="shareOnWhatsApp('${product.id}')">
                  <span>📱</span> WhatsApp
                </button>
              </div>

              <button class="btn btn-sm" style="background: transparent; border: none; color: var(--color-text-dim); text-decoration: underline; font-size: 0.8rem; cursor: pointer;" onclick="copyProductLink('${product.id}')">
                Copier seulement le lien
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    ${relatedHTML}
  `;
}

function shareProduct(productId) {
  const product = Store.getProduct(productId);
  let baseUrl = window.location.origin + window.location.pathname;
  if (!baseUrl.endsWith('/')) baseUrl += '/';
  const url = baseUrl + '#/product/' + productId;
  const title = `Vérifie ce produit sur AXOU BOUTIQUE : ${product.name}`;
  const text = `${product.description.slice(0, 100)}...`;

  if (navigator.share) {
    navigator.share({
      title: title,
      text: text,
      url: url,
    }).catch(err => {
      console.log('User cancelled or error sharing:', err);
    });
  } else {
    // Fallback to copy link
    copyProductLink(productId);
  }
}

function shareOnWhatsApp(productId) {
  const product = Store.getProduct(productId);
  let baseUrl = window.location.origin + window.location.pathname;
  if (!baseUrl.endsWith('/')) baseUrl += '/';
  const url = baseUrl + '#/product/' + productId;

  const text = encodeURIComponent(`*${product.name}* sur AXOU BOUTIQUE\n\n${product.description.slice(0, 80)}...\n\nDécouvrez ici : ${url}`);
  window.open(`https://wa.me/?text=${text}`, '_blank');
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
