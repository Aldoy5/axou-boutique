/* ============================================
   AXOU BOUTIQUE — Cart Page
   ============================================ */

function renderCart() {
  const cart = Store.getCart();
  const total = Store.getCartTotal();
  const cartCount = Store.getCartCount();

  if (cart.length === 0) {
    return `
      <div class="cart-page">
        <div class="container">
          <h1>Votre Panier</h1>
          <div class="cart-empty">
            <div class="cart-empty-icon">🛒</div>
            <h2>Votre panier est vide</h2>
            <p>Explorez notre catalogue et trouvez des produits qui vous plaisent !</p>
            <button class="btn btn-primary btn-lg" onclick="Router.navigate('/catalog')">
              Découvrir nos produits
            </button>
          </div>
        </div>
      </div>
    `;
  }

  const itemsHTML = cart.map(item => {
    const product = Store.getProduct(item.id);
    if (!product) return '';

    return `
      <div class="cart-item">
        <img class="cart-item-image" src="${product.image}" alt="${product.name}"
             onerror="this.style.background='var(--color-surface)'; this.src=''">
        <div class="cart-item-info">
          <div class="cart-item-name">${product.name}</div>
          <div class="cart-item-price">${formatPrice(product.price)}</div>
          <div class="product-detail-quantity" style="margin-top: var(--space-sm); margin-bottom: 0;">
            <div class="quantity-control">
              <button class="quantity-btn" onclick="updateCartQty('${item.id}', ${item.quantity - 1})">−</button>
              <div class="quantity-value">${item.quantity}</div>
              <button class="quantity-btn" onclick="updateCartQty('${item.id}', ${item.quantity + 1})">+</button>
            </div>
          </div>
        </div>
        <div class="cart-item-actions">
          <button class="cart-item-remove" onclick="removeCartItem('${item.id}')" title="Supprimer">✕</button>
          <span style="font-weight: 600; color: var(--color-accent);">${formatPrice(product.price * item.quantity)}</span>
        </div>
      </div>
    `;
  }).join('');

  return `
    <div class="cart-page">
      <div class="container">
        <h1>Votre Panier <span style="color: var(--color-text-dim); font-size: 1rem; font-family: var(--font-body);">(${cartCount} article${cartCount > 1 ? 's' : ''})</span></h1>
        
        <div class="cart-layout">
          <div class="cart-items">
            ${itemsHTML}
          </div>
          
          <div class="cart-summary">
            <h3>Récapitulatif</h3>
            <div class="cart-summary-row">
              <span>Sous-total</span>
              <span>${formatPrice(total)}</span>
            </div>
            <div class="cart-summary-row">
              <span>Livraison</span>
              <span style="color: var(--color-success);">Gratuite</span>
            </div>
            <div class="cart-summary-total">
              <span>Total</span>
              <span class="total-price">${formatPrice(total)}</span>
            </div>
            <button class="btn btn-primary btn-lg" style="width: 100%;" onclick="Router.navigate('/checkout')">
              Valider la commande →
            </button>
            <button class="btn btn-secondary btn-sm" style="width: 100%; margin-top: var(--space-md);" onclick="Router.navigate('/catalog')">
              Continuer les achats
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function updateCartQty(productId, qty) {
  Store.updateCartQuantity(productId, qty);
  App.refresh();
}

function removeCartItem(productId) {
  Store.removeFromCart(productId);
  showToast('Article retiré du panier');
  App.refresh();
}
