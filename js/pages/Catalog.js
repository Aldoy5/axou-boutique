/* ============================================
   AXOU BOUTIQUE — Catalog Page
   ============================================ */

let catalogState = {
  category: 'all',
  search: '',
  sort: 'default',
};

function renderCatalog(params) {
  // Synchronise la catégorie depuis l'URL si présente
  if (params && params.category) {
    catalogState.category = params.category;
  }

  const products = Store.searchProducts(catalogState.search, catalogState.category, catalogState.sort);

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

  const productsHTML = products.length > 0
    ? products.map(p => renderProductCard(p)).join('')
    : `<div class="no-results">
        <div class="no-results-icon">🔍</div>
        <p>Aucun produit trouvé</p>
      </div>`;

  return `
    <div class="catalog-page">
      <div class="container">
        <h1>Notre Catalogue</h1>
        <p class="catalog-subtitle">Découvrez l'ensemble de nos produits premium</p>

        <div class="catalog-toolbar">
          <div class="catalog-filters">
            ${filtersHTML}
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
