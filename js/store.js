/* ============================================
   AXOU BOUTIQUE — Store (Products & Cart)
   ============================================ */

const Store = (() => {
    const PRODUCTS_KEY = 'axou_boutique_products';
    const CART_KEY = 'axou_boutique_cart';

    // Initialize products from localStorage or demo data
    function _initProducts() {
        const stored = localStorage.getItem(PRODUCTS_KEY);
        if (stored) {
            try { return JSON.parse(stored); } catch (e) { /* fall through */ }
        }
        localStorage.setItem(PRODUCTS_KEY, JSON.stringify(DEMO_PRODUCTS));
        return [...DEMO_PRODUCTS];
    }

    let _products = _initProducts();
    let _cart = _loadCart();
    let _listeners = [];

    function _saveProducts() {
        localStorage.setItem(PRODUCTS_KEY, JSON.stringify(_products));
        _notify();
    }

    function _loadCart() {
        const stored = localStorage.getItem(CART_KEY);
        if (stored) {
            try { return JSON.parse(stored); } catch (e) { /* fall through */ }
        }
        return [];
    }

    function _saveCart() {
        localStorage.setItem(CART_KEY, JSON.stringify(_cart));
        _notify();
    }

    function _notify() {
        _listeners.forEach(fn => fn());
    }

    return {
        subscribe(fn) {
            _listeners.push(fn);
            return () => { _listeners = _listeners.filter(l => l !== fn); };
        },

        // --- Products ---
        getProducts() { return [..._products]; },

        getProduct(id) { return _products.find(p => p.id === id); },

        getFeatured() { return _products.filter(p => p.featured); },

        getByCategory(cat) {
            if (!cat || cat === 'all') return [..._products];
            return _products.filter(p => p.category === cat);
        },

        addProduct(product) {
            const newProduct = {
                ...product,
                id: 'product-' + Date.now(),
                featured: product.featured || false,
            };
            _products.push(newProduct);
            _saveProducts();
            return newProduct;
        },

        updateProduct(id, updates) {
            const idx = _products.findIndex(p => p.id === id);
            if (idx !== -1) {
                _products[idx] = { ..._products[idx], ...updates };
                _saveProducts();
            }
        },

        deleteProduct(id) {
            _products = _products.filter(p => p.id !== id);
            // Also remove from cart
            _cart = _cart.filter(item => item.id !== id);
            _saveCart();
            _saveProducts();
        },

        // --- Cart ---
        getCart() { return [..._cart]; },

        getCartCount() {
            return _cart.reduce((sum, item) => sum + item.quantity, 0);
        },

        getCartTotal() {
            return _cart.reduce((sum, item) => {
                const product = _products.find(p => p.id === item.id);
                return sum + (product ? product.price * item.quantity : 0);
            }, 0);
        },

        addToCart(productId, quantity = 1) {
            const existing = _cart.find(item => item.id === productId);
            if (existing) {
                existing.quantity += quantity;
            } else {
                _cart.push({ id: productId, quantity });
            }
            _saveCart();
        },

        updateCartQuantity(productId, quantity) {
            if (quantity <= 0) {
                _cart = _cart.filter(item => item.id !== productId);
            } else {
                const existing = _cart.find(item => item.id === productId);
                if (existing) existing.quantity = quantity;
            }
            _saveCart();
        },

        removeFromCart(productId) {
            _cart = _cart.filter(item => item.id !== productId);
            _saveCart();
        },

        clearCart() {
            _cart = [];
            _saveCart();
        },

        // --- Search & Filter ---
        searchProducts(query, category, sortBy) {
            let results = category && category !== 'all'
                ? _products.filter(p => p.category === category)
                : [..._products];

            if (query) {
                const q = query.toLowerCase();
                results = results.filter(p =>
                    p.name.toLowerCase().includes(q) ||
                    p.description.toLowerCase().includes(q)
                );
            }

            if (sortBy === 'price-asc') {
                results.sort((a, b) => a.price - b.price);
            } else if (sortBy === 'price-desc') {
                results.sort((a, b) => b.price - a.price);
            } else if (sortBy === 'name') {
                results.sort((a, b) => a.name.localeCompare(b.name));
            }

            return results;
        },
    };
})();
