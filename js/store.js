/* ============================================
   AXOU BOUTIQUE — Store (Products & Cart)
   ============================================ */

const Store = (() => {
    const PRODUCTS_PATH = 'products';
    const SETTINGS_PATH = 'settings';
    const CART_KEY = 'axou_boutique_cart';

    let _products = [];
    let _settings = {};
    let _user = null;
    let _cart = _loadCart();
    let _listeners = [];
    let _isLoaded = false;

    // --- Firebase Sync ---
    function _initFirebaseSync() {
        // Auth Sync
        window.fbOnAuthStateChanged(window.fbAuth, (user) => {
            _user = user;
            console.log("Auth state changed:", _user ? "Logged in" : "Logged out");
            _notify();
        });

        // Products Sync
        const productsRef = window.fbRef(window.fbDB, PRODUCTS_PATH);
        window.fbOnValue(productsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                _products = Object.keys(data).map(key => ({
                    ...data[key],
                    id: key
                }));
            } else {
                seedDatabase();
            }
            _checkLoaded();
        });

        // Settings Sync (Supprimé car géré par Firebase Auth)
        _checkLoaded();
    }

    function _checkLoaded() {
        // Simple check to consider loaded once we have products (even empty list)
        // and settings are initialized
        _isLoaded = true;
        _notify();
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

        // --- Auth ---
        isAdminLoggedIn() {
            return !!_user;
        },

        async login(email, password) {
            return await window.fbSignIn(window.fbAuth, email, password);
        },

        async logout() {
            return await window.fbSignOut(window.fbAuth);
        },

        async updateMyPassword(newPassword) {
            if (!_user) throw new Error("Non connecté");
            return await window.fbUpdatePassword(_user, newPassword);
        },

        // --- Cloudinary ---
        async uploadImageToCloudinary(file, uploadPreset = 'axou_preset') {
            const cloudName = 'dhrzst5ge';
            const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', uploadPreset);

            try {
                const response = await fetch(url, {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error.error?.message || "Erreur lors de l'upload vers Cloudinary");
                }

                const data = await response.json();
                // Return optimized URL (auto format, auto quality)
                return data.secure_url.replace('/upload/', '/upload/f_auto,q_auto/');
            } catch (err) {
                console.error("Cloudinary Upload Error:", err);
                throw err;
            }
        },

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

        isLoaded() { return _isLoaded; },

        // --- Search & Filter ---
        searchProducts(query, category, sortBy, minPrice = 0, maxPrice = Infinity) {
            let results = category && category !== 'all'
                ? _products.filter(p => p.category === category)
                : [..._products];

            if (minPrice > 0 || maxPrice < Infinity) {
                results = results.filter(p => p.price >= minPrice && p.price <= maxPrice);
            }

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
