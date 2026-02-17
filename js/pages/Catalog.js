/* ============================================
   AXOU BOUTIQUE — Catalog Page
   ============================================ */

let catalogState = {
  category: 'all',
  search: '',
  sort: 'default',
  minPrice: 0,
  maxPrice: Infinity
};

function renderCatalog(params) {
  if (params && params.category) {
    catalogState.category = params.category;
  }

  const isLoaded = Store.isLoaded();
  const products = isLoaded
    ? Store.searchProducts(catalogState.search, catalogState.category, catalogState.sort, catalogState.minPrice, catalogState.maxPrice)
    : [];

  const filterButtons = [
    { id: 'all', label: 'Tous' },
    ...CATEGORIES.map(c => ({ id: c.id, label: c.name }))
  ];

  const filtersHTML = filterButtons.map(f => `
    <button class="filter-btn ${catalogState.category === f.id ? 'active' : ''}"
            onclick="setCatalogFilter('${f.id}')">
      ${f.label}
    </button>
  `).join('');

  let productsHTML = '';

  if (!isLoaded) {
    // Show 6 skeletons
    productsHTML = Array(6).fill(0).map(() => `
      <div class="product-card">
        <div class="skeleton skeleton-img"></div>
        <div class="skeleton skeleton-title"></div>
        <div class="skeleton skeleton-text"></div>
      </div>
    `).join('');
  } else if (products.length > 0) {
    productsHTML = products.map(p => renderProductCard(p)).join('');
  } else {
    productsHTML = `
      <div class="no-results">
        <div class="no-results-icon">🔍</div>
        <p>Aucun produit trouvé</p>
      </div>`;
  }

  return `
    <div class="catalog-page">
      <div class="container">
        <h1>Notre Catalogue ${!isLoaded ? '<span style="font-size: 1rem; color: var(--color-accent);">Chargement...</span>' : ''}</h1>
        <p class="catalog-subtitle">Découvrez l'ensemble de nos produits premium</p>

        <div class="catalog-toolbar">
          <div class="catalog-filters">
            ${filtersHTML}
          </div>
          
          <div class="price-filters-row" style="margin-bottom: var(--space-lg); display: flex; gap: var(--space-md); align-items: center; flex-wrap: wrap;">
            <span style="font-size: 0.9rem; font-weight: 500;">Prix :</span>
            <button class="filter-btn ${catalogState.maxPrice === Infinity ? 'active' : ''}" onclick="setPriceFilter(0, Infinity)">Tous</button>
            <button class="filter-btn ${catalogState.maxPrice === 10000 ? 'active' : ''}" onclick="setPriceFilter(0, 10000)">- 10 000 FCFA</button>
            <button class="filter-btn ${catalogState.minPrice === 10000 && catalogState.maxPrice === 30000 ? 'active' : ''}" onclick="setPriceFilter(10000, 30000)">10k - 30k</button>
            <button class="filter-btn ${catalogState.minPrice === 30000 ? 'active' : ''}" onclick="setPriceFilter(30000, Infinity)">30 000+ FCFA</button>
          </div>

          <div style="display: flex; gap: var(--space-md); flex-wrap: wrap;">
            <div class="search-box">
              <span class="search-icon">🔍</span>
              <input type="text" id="catalog-search" placeholder="Rechercher un produit..." 
                     value="${catalogState.search}"
                     oninput="setCatalogSearch(this.value)">
            </div>
            <select class="sort-select" onchange="setCatalogSort(this.value)">
              <option value="default" ${catalogState.sort === 'default' ? 'selected' : ''}>Trier par</option>
              <option value="price-asc" ${catalogState.sort === 'price-asc' ? 'selected' : ''}>Prix croissant</option>
              <option value="price-desc" ${catalogState.sort === 'price-desc' ? 'selected' : ''}>Prix décroissant</option>
              <option value="name" ${catalogState.sort === 'name' ? 'selected' : ''}>Nom A-Z</option>
            </select>
          </div>
        </div>

        <div class="products-grid">
          ${productsHTML}
        </div>
      </div>
    </div>
  `;
}

function setPriceFilter(min, max) {
  catalogState.minPrice = min;
  catalogState.maxPrice = max;
  App.refresh();
}

function setCatalogFilter(category) {
  // Utilise le routeur pour changer de catégorie via l'URL
  Router.navigate('/catalog/' + category);
}

function setCatalogSearch(query) {
  catalogState.search = query;
  App.refresh();
}

function setCatalogSort(sort) {
  catalogState.sort = sort;
  App.refresh();
}
