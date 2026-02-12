/* ============================================
   AXOU BOUTIQUE — Main App Controller
   ============================================ */

const App = (() => {
    const appDiv = document.getElementById('app');
    let currentPage = null;
    let currentParams = {};

    function render() {
        // Save focus and selection
        const activeId = document.activeElement ? document.activeElement.id : null;
        const selectionStart = document.activeElement ? document.activeElement.selectionStart : null;
        const selectionEnd = document.activeElement ? document.activeElement.selectionEnd : null;

        let pageContent = '';

        switch (currentPage) {
            case 'home':
                pageContent = renderHome();
                break;
            case 'catalog':
                pageContent = renderCatalog(currentParams);
                break;
            case 'product':
                pageContent = renderProductDetail(currentParams);
                break;
            case 'cart':
                pageContent = renderCart();
                break;
            case 'checkout':
                pageContent = renderCheckout();
                break;
            case 'admin':
                pageContent = renderAdmin();
                break;
            default:
                pageContent = renderHome();
        }

        appDiv.innerHTML = `
      ${renderNavbar()}
      <main>
        ${pageContent}
      </main>
      ${currentPage !== 'checkout' || !checkoutState.submitted ? renderFooter() : ''}
    `;

        // Restore focus and selection
        if (activeId) {
            const el = document.getElementById(activeId);
            if (el) {
                el.focus();
                if (selectionStart !== null && selectionEnd !== null && (el.type === 'text' || el.type === 'search' || el.type === 'tel' || el.type === 'email' || el.tagName === 'TEXTAREA')) {
                    el.setSelectionRange(selectionStart, selectionEnd);
                }
            }
        }
    }

    function refresh() {
        render();
    }

    function showPage(page, params = {}) {
        currentPage = page;
        currentParams = params;
        render();
    }

    // --- Setup Routes ---
    Router.register('/', () => showPage('home'));
    Router.register('/catalog', () => showPage('catalog', { category: 'all' }));
    Router.register('/catalog/:category', (params) => showPage('catalog', params));
    Router.register('/product/:id', (params) => showPage('product', params));
    Router.register('/cart', () => showPage('cart'));
    Router.register('/checkout', () => showPage('checkout'));
    Router.register('/admin', () => showPage('admin'));

    // --- Init ---
    function init() {
        initNavbarScroll();
        Router.init();
    }

    // Start app when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    return { refresh, showPage };
})();

// --- Toast Helper ---
function showToast(message, type = 'success') {
    // Remove existing toasts
    document.querySelectorAll('.toast').forEach(t => t.remove());

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `<span>${type === 'success' ? '✅' : '⚠️'}</span> ${message}`;
    document.body.appendChild(toast);

    setTimeout(() => toast.remove(), 3000);
}
