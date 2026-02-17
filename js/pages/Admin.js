/* ============================================
   AXOU BOUTIQUE — Admin Page
   ============================================ */

let adminEditId = null;
let adminImageBase64 = null;
// isAdminAuthenticated is now handled by Store.isAdminLoggedIn()
// ADMIN_PASSWORD is now handled by Store (Firebase)

function renderAdmin() {
  if (!Store.isAdminLoggedIn()) {
    return renderAdminLogin();
  }

  const products = Store.getProducts();
  const editProduct = adminEditId ? Store.getProduct(adminEditId) : null;

  const productListHTML = products.map(p => `
    <div class="admin-product-item">
      <img class="admin-product-thumb" src="${p.image}" alt="${p.name}"
           onerror="this.style.background='var(--color-surface)'; this.src=''">
      <div class="admin-product-info">
        <div class="admin-product-name">${p.name}</div>
        <div class="admin-product-meta">
          ${getCategoryLabel(p.category)} · ${formatPrice(p.price)}
          <br>
          <span style="color: ${p.stock <= 2 ? 'var(--color-danger)' : 'var(--color-text-dim)'}; font-weight: 500;">
            Stock : ${p.stock || 0}
          </span>
        </div>
      </div>
      <div class="admin-product-actions">
        <button class="btn btn-secondary btn-sm" onclick="editAdminProduct('${p.id}')">✏️</button>
        <button class="btn btn-danger btn-sm" onclick="deleteAdminProduct('${p.id}')">🗑️</button>
      </div>
    </div>
  `).join('');

  return `
    <div class="admin-page">
      <div class="container">
        <h1>Administration</h1>

        <div class="admin-layout">
          <div class="admin-form-card">
            <h2>${adminEditId ? '✏️ Modifier le produit' : '➕ Ajouter un produit'}</h2>
            <form class="admin-form" onsubmit="event.preventDefault(); saveAdminProduct();">
              <div class="form-group">
                <label>Nom du produit</label>
                <input class="form-input" type="text" id="admin-name" placeholder="Nom du produit"
                       value="${editProduct ? editProduct.name : ''}" required>
              </div>

              <div class="form-group">
                <label>Description</label>
                <textarea class="form-input" id="admin-desc" placeholder="Description du produit" 
                          rows="3" style="resize: vertical;" required>${editProduct ? editProduct.description : ''}</textarea>
              </div>

              <div class="form-group">
                <label>Prix (FCFA)</label>
                <input class="form-input" type="number" id="admin-price" placeholder="Ex: 15000" min="0"
                       value="${editProduct ? editProduct.price : ''}" required>
              </div>

              <div class="form-group">
                <label>Stock disponible</label>
                <input class="form-input" type="number" id="admin-stock" placeholder="Ex: 10" min="0"
                       value="${editProduct ? (editProduct.stock !== undefined ? editProduct.stock : 10) : 10}" required>
              </div>

              <div class="form-group">
                <label>Catégorie</label>
                <select class="form-select" id="admin-category" required>
                  <option value="">Sélectionner...</option>
                  <option value="beaute" ${editProduct?.category === 'beaute' ? 'selected' : ''}>Beauté</option>
                  <option value="chaines" ${editProduct?.category === 'chaines' ? 'selected' : ''}>Chaînes & Bijoux</option>
                  <option value="pyjamas" ${editProduct?.category === 'pyjamas' ? 'selected' : ''}>Pyjamas</option>
                </select>
              </div>

              <div class="form-group">
                <label>Image du produit</label>
                <div style="display: flex; flex-direction: column; gap: var(--space-sm);">
                  <input class="form-input" type="file" id="admin-file-input" accept="image/*" onchange="handleAdminImageUpload(this)">
                  <div style="text-align: center; color: var(--color-text-dim); font-size: 0.8rem;">— OU —</div>
                  <input class="form-input" type="url" id="admin-image-url" placeholder="URL de l'image (ex: https://...)"
                         value="${editProduct && !editProduct.image?.startsWith('data:') ? editProduct.image : ''}">
                </div>
                <div id="admin-image-preview-container" style="margin-top: var(--space-md); text-align: center; ${editProduct?.image ? '' : 'display: none;'}">
                  <p style="font-size: 0.8rem; color: var(--color-text-dim); margin-bottom: var(--space-xs);">Aperçu :</p>
                  <img id="admin-image-preview" src="${editProduct?.image || ''}" 
                       style="max-width: 100%; max-height: 150px; border-radius: var(--radius-sm); border: 1px solid var(--color-border);">
                </div>
              </div>

              <div class="form-group">
                <label style="display: flex; align-items: center; gap: var(--space-sm); cursor: pointer;">
                  <input type="checkbox" id="admin-featured" ${editProduct?.featured ? 'checked' : ''}>
                  Produit vedette
                </label>
              </div>

              <button class="btn btn-primary" type="submit" style="width: 100%;">
                ${adminEditId ? 'Mettre à jour' : 'Ajouter le produit'}
              </button>
              ${adminEditId ? `
                <button class="btn btn-secondary" type="button" style="width: 100%;" onclick="cancelEdit()">
                  Annuler
                </button>
              ` : ''}
              <button class="btn btn-secondary" type="button" style="width: 100%; margin-top: var(--space-xl); border-color: var(--color-danger); color: var(--color-danger);" onclick="Store.logout()">
                Déconnexion
              </button>
            </form>
          </div>

          <div class="admin-products-list">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-lg);">
              <h2>Produits existants (${products.length})</h2>
              <button class="btn btn-secondary btn-sm" onclick="seedDefaultProducts()">
                📥 Importer défauts
              </button>
            </div>
            ${productListHTML.length > 0 ? productListHTML : '<p style="color: var(--color-text-dim);">Aucun produit</p>'}

            <div class="admin-settings-card" style="margin-top: var(--space-4xl); padding-top: var(--space-2xl); border-top: 1px solid var(--color-border);">
              <h2>⚙️ Paramètres de sécurité</h2>
              <div class="glass-card" style="padding: var(--space-xl); background: rgba(255,255,255,0.02);">
                <form onsubmit="event.preventDefault(); updateAdminPassword();">
                  <div class="form-group">
                    <label>Nouveau mot de passe admin</label>
                    <input class="form-input" type="password" id="new-admin-pass" placeholder="Entrez le nouveau mot de passe" required>
                  </div>
                  <button class="btn btn-secondary" type="submit" style="margin-top: var(--space-md);">
                    Mettre à jour le mot de passe
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

function saveAdminProduct() {
  const name = document.getElementById('admin-name').value.trim();
  const description = document.getElementById('admin-desc').value.trim();
  const price = parseInt(document.getElementById('admin-price').value) || 0;
  const stock = parseInt(document.getElementById('admin-stock').value) || 0;
  const category = document.getElementById('admin-category').value;
  const imageUrl = document.getElementById('admin-image-url').value.trim();
  const featured = document.getElementById('admin-featured').checked;

  const image = adminImageBase64 || imageUrl;

  if (!name || !description || price === undefined || stock === undefined || !category || !image) {
    showToast('Veuillez remplir tous les champs obligatoires');
    return;
  }

  const productData = { name, description, price, stock, category, image, featured };

  if (adminEditId) {
    Store.updateProduct(adminEditId, productData).then(() => {
      showToast('Produit mis à jour avec succès !');
      adminEditId = null;
      adminImageBase64 = null;
      App.refresh();
    });
  } else {
    Store.addProduct(productData).then(() => {
      showToast('Produit ajouté avec succès !');
      adminImageBase64 = null;
      App.refresh();
    });
  }
}

function editAdminProduct(id) {
  adminEditId = id;
  adminImageBase64 = null;
  App.refresh();
  // Scroll to form
  setTimeout(() => {
    document.querySelector('.admin-form-card')?.scrollIntoView({ behavior: 'smooth' });
  }, 100);
}

function deleteAdminProduct(id) {
  if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
    Store.deleteProduct(id).then(() => {
      if (adminEditId === id) adminEditId = null;
      showToast('Produit supprimé');
      App.refresh();
    });
  }
}

function seedDefaultProducts() {
  if (confirm('Voulez-vous importer les produits par défaut ? Cela ajoutera des copies des produits initiaux.')) {
    showToast('Importation en cours...');
    Store.seedDatabase().then(() => {
      showToast('Produits par défaut importés !');
    }).catch(err => {
      console.error(err);
      showToast('Erreur lors de l\'importation', 'error');
    });
  }
}

function updateAdminPassword() {
  const newPass = document.getElementById('new-admin-pass').value.trim();
  if (newPass.length < 6) {
    showToast('Le mot de passe doit faire au moins 6 caractères', 'error');
    return;
  }

  if (confirm('Êtes-vous sûr de vouloir changer VOTRE mot de passe de connexion ?')) {
    showToast('Mise à jour...', 'success');
    Store.updateMyPassword(newPass)
      .then(() => {
        showToast('Mot de passe mis à jour avec succès !');
        document.getElementById('new-admin-pass').value = '';
      })
      .catch(err => {
        console.error(err);
        if (err.code === 'auth/requires-recent-login') {
          showToast('Sécurité : Veuillez vous déconnecter et vous reconnecter pour changer de mot de passe', 'error');
        } else {
          showToast('Erreur : ' + err.message, 'error');
        }
      });
  }
}

function cancelEdit() {
  adminEditId = null;
  adminImageBase64 = null;
  App.refresh();
}

function handleAdminImageUpload(input) {
  const file = input.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      adminImageBase64 = e.target.result;
      const preview = document.getElementById('admin-image-preview');
      const container = document.getElementById('admin-image-preview-container');
      if (preview && container) {
        preview.src = adminImageBase64;
        container.style.display = 'block';
      }
    };
    reader.readAsDataURL(file);
  }
}

function renderAdminLogin() {
  return `
    <div class="admin-page">
      <div class="container" style="max-width: 400px; padding-top: var(--space-4xl);">
        <div class="glass-card" style="padding: var(--space-2xl);">
          <h2 style="font-family: var(--font-display); margin-bottom: var(--space-xl); text-align: center;">Accès Admin</h2>
          <div class="form-group">
            <label>Email Admin</label>
            <input class="form-input" type="email" id="admin-email-input" placeholder="alexachie14@gmail.com" value="alexachie14@gmail.com">
          </div>
          <div class="form-group">
            <label>Mot de passe</label>
            <input class="form-input" type="password" id="admin-pass-input" placeholder="Entrez votre mot de passe">
          </div>
          <button class="btn btn-primary" style="width: 100%; margin-top: var(--space-lg);" onclick="adminLogin()">
            Se connecter
          </button>
        </div>
      </div>
    </div>
  `;
}

function adminLogin() {
  const email = document.getElementById('admin-email-input').value.trim();
  const pass = document.getElementById('admin-pass-input').value;

  if (!email || !pass) {
    showToast('Veuillez remplir tous les champs', 'error');
    return;
  }

  showToast('Connexion en cours...', 'success');

  Store.login(email, pass)
    .then(() => {
      showToast('Connexion réussie !');
      // Redirection automatique via l'abonnement au Store dans app.js
    })
    .catch(err => {
      console.error(err);
      showToast('Erreur : ' + err.message, 'error');
    });
}

function adminLogout() {
  Store.logout();
}
