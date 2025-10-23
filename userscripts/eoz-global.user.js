// ==UserScript==
// @name         EOZ Global UI
// @namespace    https://github.com/oski350bpm/eoz-UI-improvements
// @version      0.2.4
// @description  Globalne poprawki UI dla EOZ (responsywne menu, formatowanie tabel)
// @match        https://eoz.iplyty.erozrys.pl/*
// @updateURL    https://raw.githubusercontent.com/oski350bpm/eoz-UI-improvements/main/userscripts/eoz-global.user.js
// @downloadURL  https://raw.githubusercontent.com/oski350bpm/eoz-UI-improvements/main/userscripts/eoz-global.user.js
// @require      https://raw.githubusercontent.com/oski350bpm/eoz-UI-improvements/main/core/eoz-core.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var VERSION = '0.2.4';

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
        '  .list-group.list-group-horizontal > li.eoz-hide-tablet { display: none !important; }\n' +
        '}\n' +
        '@media (min-width: 1024px) {\n' +
        '  #eoz-burger-menu { display: none !important; }\n' +
        '  .list-group.list-group-horizontal > li.eoz-hide-tablet { display: inline-block !important; }\n' +
        '}\n' +
        '#eoz-burger-menu {\n' +
        '  position: fixed; top: 0; right: 10px; z-index: 10000;\n' +
        '  width: 50px; height: 50px; border-radius: 50%; background: #007bff;\n' +
        '  border: none; cursor: pointer; display: flex; align-items: center; justify-content: center;\n' +
        '  box-shadow: 0 2px 8px rgba(0,0,0,0.3); margin-top: 10px;\n' +
        '}\n' +
        '/* EOZ Table Improvements */\n' +
        'th.heading-cell.column-names-cell { white-space: normal !important; line-height: 1.3 !important; padding: 8px !important; }\n' +
        'td.body-cell input[type="checkbox"], th.heading-cell input[type="checkbox"] {\n' +
        '  float: left !important; margin-right: 8px !important; margin-top: 2px !important;\n' +
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
        '  position: fixed; top: 0; right: -100%; width: 280px; max-width: 85%; height: 100vh;\n' +
        '  background: white; box-shadow: -2px 0 8px rgba(0,0,0,0.3); z-index: 9999;\n' +
        '  transition: right 0.3s ease; overflow-y: auto; padding: 60px 0 20px;\n' +
        '}\n' +
        '#eoz-mobile-menu.open { right: 0; }\n' +
        '#eoz-mobile-menu .eoz-menu-item {\n' +
        '  display: flex; align-items: center; gap: 12px; padding: 12px 20px;\n' +
        '  text-decoration: none; color: #333; border-bottom: 1px solid #f0f0f0;\n' +
        '  transition: background 0.2s;\n' +
        '}\n' +
        '#eoz-mobile-menu .eoz-menu-item:hover { background: #f8f9fa; }\n' +
        '#eoz-mobile-menu .eoz-menu-item .eoz-icon-wrapper { width: 40px; height: 40px; background: #007bff; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }\n' +
        '#eoz-mobile-menu .eoz-menu-item .eoz-icon-wrapper i { color: white; font-size: 18px; }\n' +
        '#eoz-mobile-menu .eoz-menu-item .eoz-menu-text { flex: 1; font-size: 15px; }\n' +
        '#eoz-menu-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 9998; display: none; }\n' +
        '#eoz-menu-overlay.open { display: block; }\n';

    window.EOZ.injectStyles(responsiveCSS, { id: 'eoz-global-responsive-css' });

    window.EOZ.whenReady(function() {
        try {
            var mainMenu = document.querySelector('ul.list-group.list-group-horizontal');
            if (!mainMenu) return;

            var menuItems = Array.from(mainMenu.querySelectorAll('li.list-group-item'));
            if (menuItems.length === 0) return;

            // Oznacz elementy do pokazania/ukrycia na tablecie
            var keepOnTablet = ['Moje zlecenia', 'Wszystkie zlecenia', 'Maszyny', 'Zmiana stanowiska', 'Wyloguj się'];
            menuItems.forEach(function(item) {
                var text = item.textContent.trim();
                var isImportant = keepOnTablet.some(function(k) { return text.indexOf(k) !== -1; });
                if (!isImportant) {
                    item.classList.add('eoz-hide-tablet');
                }
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

            // Funkcja do wyciągania ikon i tekstu (bez dropdownów)
            function extractMenuData(item) {
                var link = item.querySelector('a');
                if (!link) return null;
                
                // EOZ używa fa-stack (2 ikony nałożone): koło + ikona
                // Bierzemy drugą ikonę (fa-stack-1x) lub pierwszą jeśli tylko jedna
                var icons = link.querySelectorAll('i');
                var mainIcon = null;
                
                if (icons.length >= 2) {
                    // fa-stack: druga ikona to właściwa (fa-stack-1x fa-inverse)
                    mainIcon = icons[1];
                } else if (icons.length === 1) {
                    mainIcon = icons[0];
                }
                
                var iconClass = mainIcon ? mainIcon.className.replace(/fa-stack-\w+|fa-inverse/g, '').trim() : '';
                
                var text = link.querySelector('p, paragraph');
                var textContent = text ? text.textContent.trim() : link.textContent.trim();
                
                return {
                    href: link.href,
                    icon: iconClass,
                    text: textContent,
                    isHidden: item.classList.contains('eoz-hide-tablet')
                };
            }

            // Dodaj do mobile menu
            menuItems.forEach(function(item) {
                var data = extractMenuData(item);
                if (!data) return;
                
                // Na mobile: wszystkie
                // Na tablet: tylko ukryte (eoz-hide-tablet)
                var menuItem = document.createElement('a');
                menuItem.href = data.href;
                menuItem.className = 'eoz-menu-item';
                if (data.isHidden) menuItem.classList.add('eoz-tablet-only');
                
                var iconWrapper = '<div class="eoz-icon-wrapper"><i class="' + data.icon + '"></i></div>';
                var textSpan = '<span class="eoz-menu-text">' + data.text + '</span>';
                menuItem.innerHTML = iconWrapper + textSpan;
                
                mobileMenu.appendChild(menuItem);
            });

            // CSS dla tablet-only
            var tabletOnlyCSS = '@media (min-width: 768px) and (max-width: 1023px) { #eoz-mobile-menu .eoz-menu-item:not(.eoz-tablet-only) { display: none; } }';
            window.EOZ.injectStyles(tabletOnlyCSS, { id: 'eoz-tablet-menu-filter' });

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

        // Fix table checkbox layout
        try {
            var checkboxCells = document.querySelectorAll('td.body-cell input[type="checkbox"], th.heading-cell input[type="checkbox"]');
            checkboxCells.forEach(function(checkbox) {
                var parent = checkbox.parentElement;
                if (parent && parent.tagName === 'TD' || parent.tagName === 'TH') {
                    // Checkbox już ma właściwy CSS float: left
                }
            });
            console.log('[EOZ Global UI v' + VERSION + '] Table improvements applied');
        } catch (e) {
            console.debug('[EOZ Global UI v' + VERSION + '] table improvements failed', e);
        }
    });
})();
