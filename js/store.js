/* ============================================
   AXOU BOUTIQUE — Store (Products & Cart)
   ============================================ */

const Store = (() => {
    const PRODUCTS_PATH = 'products';
    const CART_KEY = 'axou_boutique_cart';

    let _products = [];
    let _cart = _loadCart();
    let _listeners = [];
    let _isLoaded = false;

    // --- Firebase Sync ---
    function _initFirebaseSync() {
        const productsRef = window.fbRef(window.fbDB, PRODUCTS_PATH);
        window.fbOnValue(productsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                // Convert object to array if needed (Firebase stores lists as objects with keys)
                _products = Object.keys(data).map(key => ({
                    ...data[key],
                    id: key // Use Firebase key as ID
                }));
            } else {
                // Initial seeding if database is empty
                seedDatabase();
            }
            _isLoaded = true;
            _notify();
        });
    }

    async function seedDatabase() {
        console.log("Seeding database with demo products...");
        const promises = DEMO_PRODUCTS.map(p => {
            const { id, ...data } = p;
            const productsRef = window.fbRef(window.fbDB, PRODUCTS_PATH);
            return window.fbPush(productsRef, data);
        });
        await Promise.all(promises);
    }

    // Initialize sync
    if (window.fbDB) {
        _initFirebaseSync();
    } else {
        // Fallback for local dev without firebase initialized yet
        console.warn("Firebase not ready, waiting...");
        window.addEventListener('load', _initFirebaseSync);
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

        isLoaded() { return _isLoaded; },

        seedDatabase,

        // --- Products ---
        getProducts() { return [..._products]; },

        getProduct(id) { return _products.find(p => p.id === id); },

        getFeatured() { return _products.filter(p => p.featured); },

        getByCategory(cat) {
            if (!cat || cat === 'all') return [..._products];
            return _products.filter(p => p.category === cat);
        },

        async addProduct(product) {
            const productsRef = window.fbRef(window.fbDB, PRODUCTS_PATH);
            const newProductRef = window.fbPush(productsRef);
            await window.fbSet(newProductRef, {
                ...product,
                featured: product.featured || false
            });
            return newProductRef.key;
        },

        async updateProduct(id, updates) {
            const productRef = window.fbRef(window.fbDB, `${PRODUCTS_PATH}/${id}`);
            await window.fbUpdate(productRef, updates);
        },

        async deleteProduct(id) {
            const productRef = window.fbRef(window.fbDB, `${PRODUCTS_PATH}/${id}`);
            await window.fbRemove(productRef);

            // Also remove from cart locally
            _cart = _cart.filter(item => item.id !== id);
            _saveCart();
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
