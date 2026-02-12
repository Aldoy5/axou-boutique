/* ============================================
   AXOU BOUTIQUE — Simple Hash Router
   ============================================ */

const Router = (() => {
    const routes = {};
    let currentRoute = null;

    function register(path, handler) {
        routes[path] = handler;
    }

    function navigate(path) {
        window.location.hash = path;
    }

    function _resolve() {
        const hash = window.location.hash.slice(1) || '/';
        let matched = null;
        let params = {};

        // Try exact match first
        if (routes[hash]) {
            matched = routes[hash];
        } else {
            // Try parameterized routes like /product/:id
            for (const [pattern, handler] of Object.entries(routes)) {
                const patternParts = pattern.split('/');
                const hashParts = hash.split('/');

                if (patternParts.length !== hashParts.length) continue;

                let isMatch = true;
                const tempParams = {};

                for (let i = 0; i < patternParts.length; i++) {
                    if (patternParts[i].startsWith(':')) {
                        tempParams[patternParts[i].slice(1)] = decodeURIComponent(hashParts[i]);
                    } else if (patternParts[i] !== hashParts[i]) {
                        isMatch = false;
                        break;
                    }
                }

                if (isMatch) {
                    matched = handler;
                    params = tempParams;
                    break;
                }
            }
        }

        if (matched) {
            currentRoute = hash;
            matched(params);
        } else {
            // Default to home
            if (routes['/']) routes['/']({});
        }

        // Scroll to top on navigate
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function init() {
        window.addEventListener('hashchange', _resolve);
        // Initial resolve
        _resolve();
    }

    function getCurrentRoute() {
        return currentRoute || window.location.hash.slice(1) || '/';
    }

    return { register, navigate, init, getCurrentRoute };
})();
