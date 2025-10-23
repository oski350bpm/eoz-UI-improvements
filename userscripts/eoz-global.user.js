// ==UserScript==
// @name         EOZ Global UI
// @namespace    https://github.com/oski350bpm/eoz-UI-improvements
// @version      0.2.1
// @description  Globalne poprawki UI dla EOZ (responsywne menu w headerze)
// @match        https://eoz.iplyty.erozrys.pl/*
// @updateURL    https://raw.githubusercontent.com/oski350bpm/eoz-UI-improvements/main/userscripts/eoz-global.user.js
// @downloadURL  https://raw.githubusercontent.com/oski350bpm/eoz-UI-improvements/main/userscripts/eoz-global.user.js
// @require      https://raw.githubusercontent.com/oski350bpm/eoz-UI-improvements/main/core/eoz-core.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var VERSION = '0.2.1';

    if (!window.EOZ) {
        console.warn('[EOZ Global UI v' + VERSION + '] core not loaded');
        return;
    }

    var responsiveCSS = '' +
        '/* EOZ Header Responsive */\n' +
        '@media (max-width: 767px) {\n' +
        '  .list-group.list-group-horizontal { flex-wrap: nowrap !important; overflow-x: hidden !important; }\n' +
        '  .list-group.list-group-horizontal > li:not(.eoz-keep-mobile) { display: none !important; }\n' +
        '}\n' +
        '@media (min-width: 768px) and (max-width: 1023px) {\n' +
        '  .list-group.list-group-horizontal { flex-wrap: wrap !important; }\n' +
        '  .list-group.list-group-horizontal > li.eoz-hide-tablet { display: none !important; }\n' +
        '}\n' +
        '@media (min-width: 1024px) {\n' +
        '  #eoz-burger-menu { display: none !important; }\n' +
        '}\n' +
        '#eoz-burger-menu {\n' +
        '  position: fixed; top: 10px; right: 10px; z-index: 10000;\n' +
        '  width: 50px; height: 50px; border-radius: 50%; background: #007bff;\n' +
        '  border: none; cursor: pointer; display: flex; align-items: center; justify-content: center;\n' +
        '  box-shadow: 0 2px 8px rgba(0,0,0,0.3);\n' +
        '}\n' +
        '#eoz-burger-menu span { display: block; width: 24px; height: 2px; background: white; position: relative; }\n' +
        '#eoz-burger-menu span::before, #eoz-burger-menu span::after {\n' +
        '  content: ""; display: block; width: 24px; height: 2px; background: white; position: absolute; left: 0;\n' +
        '}\n' +
        '#eoz-burger-menu span::before { top: -8px; }\n' +
        '#eoz-burger-menu span::after { top: 8px; }\n' +
        '#eoz-burger-menu.open span { background: transparent; }\n' +
        '#eoz-burger-menu.open span::before { transform: rotate(45deg); top: 0; }\n' +
        '#eoz-burger-menu.open span::after { transform: rotate(-45deg); top: 0; }\n' +
        '#eoz-mobile-menu {\n' +
        '  position: fixed; top: 0; right: -100%; width: 80%; max-width: 300px; height: 100vh;\n' +
        '  background: white; box-shadow: -2px 0 8px rgba(0,0,0,0.3); z-index: 9999;\n' +
        '  transition: right 0.3s ease; overflow-y: auto; padding: 70px 20px 20px;\n' +
        '}\n' +
        '#eoz-mobile-menu.open { right: 0; }\n' +
        '#eoz-mobile-menu a { display: block; padding: 15px; text-decoration: none; color: #333; border-bottom: 1px solid #eee; }\n' +
        '#eoz-mobile-menu a:hover { background: #f5f5f5; }\n' +
        '#eoz-menu-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 9998; display: none; }\n' +
        '#eoz-menu-overlay.open { display: block; }\n';

    window.EOZ.injectStyles(responsiveCSS, { id: 'eoz-global-responsive-css' });

    window.EOZ.whenReady(function() {
        try {
            var mainMenu = document.querySelector('ul.list-group.list-group-horizontal');
            if (!mainMenu) return;

            var menuItems = Array.from(mainMenu.querySelectorAll('li.list-group-item'));
            if (menuItems.length === 0) return;

            // Oznacz elementy do pokazania/ukrycia
            var keepOnTablet = ['Moje zlecenia', 'Wszystkie zlecenia', 'Maszyny', 'Wyloguj się'];
            menuItems.forEach(function(item) {
                var text = item.textContent.trim();
                var isImportant = keepOnTablet.some(function(k) { return text.indexOf(k) !== -1; });
                if (!isImportant) {
                    item.classList.add('eoz-hide-tablet');
                }
                // Na mobile wszystko ukryte (poza hamburgerem)
            });

            // Stwórz hamburger menu
            if (document.getElementById('eoz-burger-menu')) return; // już istnieje

            var burger = document.createElement('button');
            burger.id = 'eoz-burger-menu';
            burger.innerHTML = '<span></span>';
            burger.setAttribute('aria-label', 'Menu');

            var mobileMenu = document.createElement('div');
            mobileMenu.id = 'eoz-mobile-menu';

            var overlay = document.createElement('div');
            overlay.id = 'eoz-menu-overlay';

            // Dodaj wszystkie linki do mobile menu
            menuItems.forEach(function(item) {
                var link = item.querySelector('a');
                if (link) {
                    var clone = link.cloneNode(true);
                    mobileMenu.appendChild(clone);
                }
            });

            function toggleMenu() {
                burger.classList.toggle('open');
                mobileMenu.classList.toggle('open');
                overlay.classList.toggle('open');
            }

            function closeMenu() {
                burger.classList.remove('open');
                mobileMenu.classList.remove('open');
                overlay.classList.remove('open');
            }

            burger.addEventListener('click', toggleMenu);
            overlay.addEventListener('click', closeMenu);
            mobileMenu.addEventListener('click', closeMenu);

            document.body.appendChild(burger);
            document.body.appendChild(mobileMenu);
            document.body.appendChild(overlay);

            console.log('[EOZ Global UI v' + VERSION + '] Responsive header applied');
        } catch (e) {
            console.debug('[EOZ Global UI v' + VERSION + '] header setup failed', e);
        }
    });
})();
