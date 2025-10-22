(function() {
    'use strict';

    const globalObj = typeof window !== 'undefined' ? window : self;
    const EOZ = globalObj.EOZ || (globalObj.EOZ = {});

    function whenReady(callback) {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', callback, { once: true });
        } else {
            callback();
        }
    }

    function waitFor(selector, options) {
        const opts = options || {};
        const timeoutMs = typeof opts.timeout === 'number' ? opts.timeout : 10000;
        const intervalMs = typeof opts.interval === 'number' ? opts.interval : 100;
        const all = !!opts.all;
        const root = opts.root || document;

        return new Promise(function(resolve, reject) {
            var start = Date.now();
            var timer = setInterval(function() {
                var found = all ? root.querySelectorAll(selector) : root.querySelector(selector);
                var ready = all ? (found && found.length > 0) : !!found;
                if (ready) {
                    clearInterval(timer);
                    clearTimeout(timeoutId);
                    resolve(found);
                } else if (Date.now() - start >= timeoutMs) {
                    clearInterval(timer);
                    clearTimeout(timeoutId);
                    reject(new Error('waitFor timeout: ' + selector));
                }
            }, intervalMs);

            var timeoutId = setTimeout(function() {
                clearInterval(timer);
                reject(new Error('waitFor timeout: ' + selector));
            }, timeoutMs + 50);
        });
    }

    function injectStyles(cssText, opts) {
        var options = opts || {};
        var id = options.id;
        if (id) {
            var existing = document.getElementById(id);
            if (existing) {
                existing.textContent = cssText;
                return existing;
            }
        }
        var styleEl = document.createElement('style');
        if (id) styleEl.id = id;
        styleEl.textContent = cssText;
        document.head.appendChild(styleEl);
        return styleEl;
    }

    function makeHeaderResponsive(options) {
        var opts = options || {};
        var breakpoint = typeof opts.breakpoint === 'number' ? opts.breakpoint : 1024;

        function firstExisting(selectors) {
            if (!selectors) return null;
            var list = Array.isArray(selectors) ? selectors : String(selectors).split(',');
            for (var i = 0; i < list.length; i++) {
                var sel = (list[i] || '').trim();
                if (!sel) continue;
                var el = document.querySelector(sel);
                if (el) return el;
            }
            return null;
        }

        var header = opts.container || firstExisting(opts.headerSelector || ['header', '.navbar', '#header', '.header']);
        var nav = opts.nav || firstExisting(opts.navSelector || ['nav', '.navbar-nav', '.menu', '.nav', '.main-menu']);
        var insert = opts.burgerInsert || firstExisting(opts.burgerInsertSelector || ['header', '.navbar', '#header', '.header']);

        if (!header || !nav || !insert) {
            return; // nothing to do
        }

        if (header.querySelector('#eoz-burger')) {
            return; // already initialized
        }

        var css = '' +
            '/* EOZ responsive header */\n' +
            '@media (max-width: ' + breakpoint + 'px) {\n' +
            '  .eoz-nav-hidden { display: none !important; }\n' +
            '  .eoz-burger { display: inline-flex !important; }\n' +
            '}\n' +
            '@media (min-width: ' + (breakpoint + 1) + 'px) {\n' +
            '  .eoz-burger { display: none !important; }\n' +
            '}\n' +
            '.eoz-burger {\n' +
            '  align-items: center; justify-content: center;\n' +
            '  width: 40px; height: 40px; cursor: pointer;\n' +
            '  background: transparent; border: none; padding: 0; margin-left: 8px;\n' +
            '}\n' +
            '.eoz-burger span, .eoz-burger::before, .eoz-burger::after {\n' +
            '  content: ""; display: block; width: 24px; height: 2px; background: currentColor; margin: 4px 0;\n' +
            '}\n' +
            '.eoz-header-open .eoz-nav-hidden { display: block !important; }\n' +
            '.eoz-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.3); z-index: 9998; display: none; }\n' +
            '.eoz-header-open .eoz-overlay { display: block; }\n';

        injectStyles(css, { id: 'eoz-core-header-css' });

        nav.classList.add('eoz-nav-hidden');

        var burger = document.createElement('button');
        burger.id = 'eoz-burger';
        burger.className = 'eoz-burger';
        burger.type = 'button';
        burger.setAttribute('aria-label', 'Menu');
        burger.setAttribute('aria-expanded', 'false');
        burger.setAttribute('aria-controls', nav.id || 'eoz-nav');
        if (!nav.id) nav.id = 'eoz-nav';

        var overlay = document.createElement('div');
        overlay.className = 'eoz-overlay';

        function closeMenu() {
            header.classList.remove('eoz-header-open');
            burger.setAttribute('aria-expanded', 'false');
        }

        function openMenu() {
            header.classList.add('eoz-header-open');
            burger.setAttribute('aria-expanded', 'true');
        }

        burger.addEventListener('click', function(evt) {
            evt.stopPropagation();
            if (header.classList.contains('eoz-header-open')) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        overlay.addEventListener('click', closeMenu);
        document.addEventListener('keydown', function(e) {
            if (e && e.key === 'Escape') closeMenu();
        });

        insert.appendChild(burger);
        document.body.appendChild(overlay);

        window.addEventListener('resize', function() {
            if (window.innerWidth > breakpoint) {
                closeMenu();
            }
        });
    }

    if (!EOZ.whenReady) EOZ.whenReady = whenReady;
    if (!EOZ.waitFor) EOZ.waitFor = waitFor;
    if (!EOZ.injectStyles) EOZ.injectStyles = injectStyles;
    if (!EOZ.makeHeaderResponsive) EOZ.makeHeaderResponsive = makeHeaderResponsive;
})();
