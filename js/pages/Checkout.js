/* ============================================
   AXOU BOUTIQUE — Checkout Page
   ============================================ */

let checkoutState = {
  phone: '',
  email: '',
  name: '',
  address: '',
  errors: {},
  submitted: false,
};

function renderCheckout() {
  const cart = Store.getCart();
  const total = Store.getCartTotal();

  if (cart.length === 0 && !checkoutState.submitted) {
    Router.navigate('/cart');
    return '<div class="checkout-page"><div class="container"><p>Redirection...</p></div></div>';
  }

  if (checkoutState.submitted) {
    return renderConfirmation();
  }

  const orderItemsHTML = cart.map(item => {
    const product = Store.getProduct(item.id);
    if (!product) return '';
    return `
      <div class="cart-summary-row">
        <span>${product.name} × ${item.quantity}</span>
        <span>${formatPrice(product.price * item.quantity)}</span>
      </div>
    `;
  }).join('');

  return `
    <div class="checkout-page">
      <div class="container">
        <a class="back-link" onclick="Router.navigate('/cart')">← Retour au panier</a>
        <h1>Finaliser la commande</h1>
        
        <div class="checkout-layout">
          <div class="checkout-form">
            <div class="form-group">
              <label>Nom complet</label>
              <input class="form-input ${checkoutState.errors.name ? 'error' : ''}" 
                     type="text" id="checkout-name" placeholder="Votre nom complet"
                     value="${checkoutState.name}"
                     oninput="checkoutState.name = this.value">
              ${checkoutState.errors.name ? `<span class="form-error">${checkoutState.errors.name}</span>` : ''}
            </div>

            <div class="form-group">
              <label>Numéro de téléphone <span class="required">*</span></label>
              <input class="form-input ${checkoutState.errors.phone ? 'error' : ''}" 
                     type="tel" id="checkout-phone" placeholder="+225 XX XX XX XX XX"
                     value="${checkoutState.phone}"
                     oninput="checkoutState.phone = this.value">
              ${checkoutState.errors.phone ? `<span class="form-error">${checkoutState.errors.phone}</span>` : ''}
            </div>

            <div class="form-group">
              <label>Adresse e-mail <span style="color: var(--color-text-dim);">(optionnel)</span></label>
              <input class="form-input ${checkoutState.errors.email ? 'error' : ''}" 
                     type="email" id="checkout-email" placeholder="votre@email.com"
                     value="${checkoutState.email}"
                     oninput="checkoutState.email = this.value">
              ${checkoutState.errors.email ? `<span class="form-error">${checkoutState.errors.email}</span>` : ''}
            </div>

            <div class="form-group">
              <label>Adresse de livraison</label>
              <input class="form-input" 
                     type="text" id="checkout-address" placeholder="Votre adresse de livraison"
                     value="${checkoutState.address}"
                     oninput="checkoutState.address = this.value">
            </div>

            <button class="btn btn-primary btn-lg" style="width: 100%; margin-top: var(--space-md);" onclick="submitCheckout()">
              Confirmer la commande — ${formatPrice(total)}
            </button>
          </div>

          <div class="cart-summary">
            <h3>Votre commande</h3>
            ${orderItemsHTML}
            <div class="cart-summary-row">
              <span>Livraison</span>
              <span style="color: var(--color-success);">Gratuite</span>
            </div>
            <div class="cart-summary-total">
              <span>Total</span>
              <span class="total-price">${formatPrice(total)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function validateCheckout() {
  const errors = {};

  if (!checkoutState.phone.trim()) {
    errors.phone = 'Le numéro de téléphone est obligatoire';
  } else if (checkoutState.phone.replace(/\s/g, '').length < 8) {
    errors.phone = 'Numéro de téléphone invalide';
  }

  if (checkoutState.email.trim() && !checkoutState.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    errors.email = 'Adresse e-mail invalide';
  }

  checkoutState.errors = errors;
  return Object.keys(errors).length === 0;
}

function submitCheckout() {
  if (!validateCheckout()) {
    App.refresh();
    return;
  }

  const total = Store.getCartTotal();
  const transactionId = Math.floor(Math.random() * 100000000).toString();

  // Direct Order Processing (Payment step removed)
  showToast("Commande en cours de validation...");

  const cart = Store.getCart();
  const finalTotal = Store.getCartTotal();
  let message = `🛒 *Nouvelle Commande — AXOU BOUTIQUE*\n\n`;
  message += `🆔 Commande: ${transactionId}\n`;
  message += `👤 Nom: ${checkoutState.name || 'Non renseigné'}\n`;
  message += `📞 Tél: ${checkoutState.phone}\n`;
  if (checkoutState.email) message += `📧 Email: ${checkoutState.email}\n`;
  if (checkoutState.address) message += `📍 Adresse: ${checkoutState.address}\n`;
  message += `\n📦 *Articles:*\n`;

  cart.forEach(item => {
    const product = Store.getProduct(item.id);
    if (product) {
      message += `  • ${product.name} × ${item.quantity} — ${formatPrice(product.price * item.quantity)}\n`;
    }
  });

  message += `\n💰 *Total: ${formatPrice(finalTotal)}*`;

  const phoneNum = '2250767503829';
  const whatsappUrl = `https://wa.me/${phoneNum}?text=${encodeURIComponent(message)}`;

  checkoutState.submitted = true;
  Store.clearCart();
  window.open(whatsappUrl, '_blank');
  App.refresh();
}

function renderConfirmation() {
  return `
    <div class="checkout-page">
      <div class="container">
        <div class="confirmation">
          <div class="confirmation-icon">🎉</div>
          <h2>Commande Confirmée !</h2>
          <p>Merci pour votre commande. Votre paiement a été reçu avec succès.</p>
          <div style="display: flex; gap: var(--space-md); justify-content: center; flex-wrap: wrap;">
            <button class="btn btn-primary btn-lg" onclick="resetCheckout(); Router.navigate('/')">
              Retour à l'accueil
            </button>
            <button class="btn btn-secondary btn-lg" onclick="resetCheckout(); Router.navigate('/catalog')">
              Continuer les achats
            </button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function resetCheckout() {
  checkoutState = { phone: '', email: '', name: '', address: '', errors: {}, submitted: false };
}
