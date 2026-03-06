/* ============================================
   AXOU BOUTIQUE — Store (Products & Cart)
   ============================================ */

const Store = (() => {
    const PRODUCTS_PATH = 'products';
    const CATEGORIES_PATH = 'categories';
    const SETTINGS_PATH = 'settings';
    const CART_KEY = 'axou_boutique_cart';

    let _products = [];
    let _categories = [];
    let _settings = {};
    let _user = null;
    let _cart = _loadCart();
    let _listeners = [];
    let _isLoaded = false;
    let _productsSynced = false;
    let _categoriesSynced = false;

    // --- Firebase Sync ---
    function _initFirebaseSync() {
        console.log("Initializing Firebase Sync...");

        // Safety timeout: force loaded state after 5 seconds if sync is slow
        setTimeout(() => {
            if (!_isLoaded) {
                console.warn("Sync timeout reached. Forcing loaded state.");
                _isLoaded = true;
                _notify();
            }
        }, 5000);

        // Auth Sync
        window.fbOnAuthStateChanged(window.fbAuth, (user) => {
            _user = user;
            console.log("Auth state changed:", _user ? "Logged in" : "Logged out");
            _notify();
        });

        // Products Sync
        const productsRef = window.fbRef(window.fbDB, PRODUCTS_PATH);
        window.fbOnValue(productsRef, (snapshot) => {
            console.log("Products received from Firebase");
            const data = snapshot.val();
            if (data) {
                _products = Object.keys(data).map(key => ({
                    ...data[key],
                    id: key
                }));
            } else {
                seedDatabase();
            }
            _productsSynced = true;
            _checkLoaded();
        });

        // Categories Sync
        const categoriesRef = window.fbRef(window.fbDB, CATEGORIES_PATH);
        window.fbOnValue(categoriesRef, (snapshot) => {
            console.log("Categories received from Firebase");
            const data = snapshot.val();
            if (data && Object.keys(data).length > 0) {
                _categories = Object.keys(data).map(key => ({
                    ...data[key],
                    id: key
                }));
            } else {
                console.warn("No categories found, seeding...");
                seedCategories();
            }
            _categoriesSynced = true;
            _checkLoaded();
        });
    }

    function _checkLoaded() {
        if (_productsSynced && _categoriesSynced) {
            _isLoaded = true;
            _notify();
        }
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

    async function seedCategories() {
        if (!window.fbDB || !window.fbSet || !window.fbRef) {
            console.error("Firebase not ready for seeding categories");
            return;
        }
        if (typeof CATEGORIES === 'undefined') {
            console.error("CATEGORIES data not found in data.js");
            return;
        }

        console.log("Seeding database with demo categories...");
        const promises = CATEGORIES.map(c => {
            const { id, ...data } = c;
            const categoryRef = window.fbRef(window.fbDB, `${CATEGORIES_PATH}/${id}`);
            return window.fbSet(categoryRef, data);
        });
        await Promise.all(promises);
        console.log("Categories seeded successfully");
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
            const product = _products.find(p => p.id === productId);
            if (!product) return false;

            const stock = parseInt(product.stock) || 0;

            if (stock <= 0) {
                showToast("Ce produit est en rupture de stock", "error");
                return false;
            }

            const existing = _cart.find(item => item.id === productId);
            const currentQty = existing ? existing.quantity : 0;

            if (currentQty + quantity > stock) {
                showToast(`Stock limité : seulement ${stock} disponible(s)`, "error");
                // On ajuste au maximum possible
                if (existing) {
                    existing.quantity = stock;
                } else {
                    _cart.push({ id: productId, quantity: stock });
                }
                _saveCart();
                _notify();
                return false;
            } else {
                if (existing) {
                    existing.quantity += quantity;
                } else {
                    _cart.push({ id: productId, quantity });
                }
                _saveCart();
                _notify();
                return true;
            }
        },

        updateCartQuantity(productId, quantity) {
            const product = _products.find(p => p.id === productId);
            if (!product) return;

            if (quantity > product.stock) {
                showToast(`Stock limité : seulement ${product.stock} disponible(s)`, "error");
                quantity = product.stock;
            }

            if (quantity <= 0) {
                _cart = _cart.filter(item => item.id !== productId);
            } else {
                const existing = _cart.find(item => item.id === productId);
                if (existing) existing.quantity = quantity;
            }
            _saveCart();
            _notify();
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
        searchProducts(query, category, sortBy, minPrice = 0, maxPrice = Infinity) {
            let results = [];

            if (category === 'featured') {
                results = _products.filter(p => p.featured);
            } else if (category && category !== 'all') {
                results = _products.filter(p => p.category === category);
            } else {
                results = [..._products];
            }

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

        // --- Categories ---
        getCategories() { return [..._categories]; },

        async addCategory(category) {
            const categoryRef = window.fbRef(window.fbDB, `${CATEGORIES_PATH}/${category.id}`);
            await window.fbSet(categoryRef, {
                name: category.name,
                description: category.description,
                icon: category.icon,
                image: category.image
            });
        },

        async deleteCategory(id) {
            const categoryRef = window.fbRef(window.fbDB, `${CATEGORIES_PATH}/${id}`);
            await window.fbRemove(categoryRef);
        },

        getCategoryLabel(catId) {
            const cat = _categories.find(c => c.id === catId);
            return cat ? cat.name : catId;
        },

        getCategoryIcon(catId) {
            const cat = _categories.find(c => c.id === catId);
            return cat ? cat.icon : '📦';
        },

        seedCategories,
    };
})();

// Global helpers (moved from pages/Home.js for global use)
function getCategoryLabel(catId) { return Store.getCategoryLabel(catId); }
function getCategoryIcon(catId) { return Store.getCategoryIcon(catId); }
function formatPrice(price) { return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA'; }
