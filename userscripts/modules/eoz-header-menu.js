// EOZ Header Menu Module
// Responsive header menu with hamburger for mobile/tablet

(function() {
    'use strict';

    var VERSION = '2.1.0';
    
    // Expose version to global EOZ object
    if (!window.EOZ) window.EOZ = {};
    if (!window.EOZ.HeaderMenu) window.EOZ.HeaderMenu = {};
    window.EOZ.HeaderMenu.VERSION = VERSION;

    if (!window.EOZ) {
        console.error('[EOZ Header Menu] Core not available');
        return;
    }

    var globalStyles = '' +
        '/* EOZ Global Layout Fixes */\n' +
        'form#filter.formo-bootstrap { width: 100% !important; }\n' +
        '@media (min-width: 576px) { .container, .container-sm { max-width: none !important; } }\n' +
        '\n' +
        '/* EOZ Header Responsive */\n' +
        '@media (max-width: 767px) { .list-group.list-group-horizontal { flex-wrap: nowrap !important; overflow-x: hidden !important; } .list-group.list-group-horizontal > li:not(.eoz-keep-mobile) { display: none !important; } }\n' +
        '@media (min-width: 768px) and (max-width: 1023px) { .list-group.list-group-horizontal > li.eoz-hide-tablet { display: none !important; } }\n' +
        '@media (min-width: 1024px) { #eoz-burger-menu { display: none !important; } .list-group.list-group-horizontal > li.eoz-hide-tablet { display: inline-block !important; } }\n' +
        '#eoz-burger-menu { position: fixed; top: 0; right: 10px; z-index: 10000; width: 50px; height: 50px; border-radius: 50%; background: #007bff; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(0,0,0,0.3); margin-top: 10px; }\n' +
        '#eoz-burger-menu span { display: block; width: 24px; height: 2px; background: white; position: relative; }\n' +
        '#eoz-burger-menu span::before, #eoz-burger-menu span::after { content: ""; display: block; width: 24px; height: 2px; background: white; position: absolute; left: 0; }\n' +
        '#eoz-burger-menu span::before { top: -8px; }\n' +
        '#eoz-burger-menu span::after { top: 8px; }\n' +
        '#eoz-burger-menu.open span { background: transparent; }\n' +
        '#eoz-burger-menu.open span::before { transform: rotate(45deg); top: 0; }\n' +
        '#eoz-burger-menu.open span::after { transform: rotate(-45deg); top: 0; }\n' +
        '#eoz-mobile-menu { position: fixed; top: 0; right: -100%; width: 280px; max-width: 85%; height: 100vh; background: white; box-shadow: -2px 0 8px rgba(0,0,0,0.3); z-index: 9999; transition: right 0.3s ease; overflow-y: auto; padding: 60px 0 20px; }\n' +
        '#eoz-mobile-menu.open { right: 0; }\n' +
        '#eoz-mobile-menu .eoz-menu-item { display: flex; align-items: center; gap: 12px; padding: 12px 20px; text-decoration: none; color: #333; border-bottom: 1px solid #f0f0f0; transition: background 0.2s; }\n' +
        '#eoz-mobile-menu .eoz-menu-item:hover { background: #f8f9fa; }\n' +
        '#eoz-mobile-menu .eoz-menu-item i { font-size: 18px; width: 20px; text-align: left; }\n' +
        '#eoz-mobile-menu .eoz-menu-item i.fa-stack { width: auto; }\n' +
        '#eoz-mobile-menu .eoz-menu-item .eoz-menu-text { flex: 1; font-size: 15px; }\n' +
        '#eoz-menu-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 9998; display: none; }\n' +
        '#eoz-menu-overlay.open { display: block; }\n' +
        '@media (min-width: 768px) and (max-width: 1023px) { #eoz-mobile-menu .eoz-menu-item:not(.eoz-tablet-only) { display: none; } }\n';

    window.EOZ.injectStyles(globalStyles, { id: 'eoz-header-menu-css' });

    window.EOZ.whenReady(function() {
        setupHeaderMenu();
    });

    function setupHeaderMenu() {
        var mainMenu = document.querySelector('ul.list-group.list-group-horizontal');
        if (!mainMenu) return;

        var menuItems = Array.from(mainMenu.querySelectorAll('li.list-group-item'));
        if (menuItems.length === 0) return;

        var keepOnTablet = ['Moje zlecenia', 'Wszystkie zlecenia', 'Maszyny', 'Zmiana stanowiska', 'Wyloguj się'];
        menuItems.forEach(function(item) {
            var text = item.textContent.trim();
            var isImportant = keepOnTablet.some(function(k) { return text.indexOf(k) !== -1; });
            if (!isImportant) item.classList.add('eoz-hide-tablet');
        });

        if (document.getElementById('eoz-burger-menu')) return;

        var burger = document.createElement('button');
        burger.id = 'eoz-burger-menu';
        burger.innerHTML = '<span></span>';
        
        var mobileMenu = document.createElement('div');
        mobileMenu.id = 'eoz-mobile-menu';
        
        var overlay = document.createElement('div');
        overlay.id = 'eoz-menu-overlay';

        menuItems.forEach(function(item) {
            var link = item.querySelector('a');
            if (!link) return;
            
            var menuItem = document.createElement('a');
            menuItem.href = link.href;
            menuItem.className = 'eoz-menu-item';
            if (item.classList.contains('eoz-hide-tablet')) menuItem.classList.add('eoz-tablet-only');
            
            // Extract icon and text properly
            var icon = '';
            var textContent = '';
            
            // Look for fa-stack (icon with background circle)
            var stackEl = link.querySelector('.fa-stack');
            if (stackEl) {
                // Extract the foreground icon (not the circle)
                var foregroundIcon = stackEl.querySelector('.fa-stack-1x');
                if (foregroundIcon) {
                    // Clone and remove fa-stack classes
                    var iconClasses = foregroundIcon.className.replace(/fa-stack-1x/g, '').trim();
                    icon = '<i class="' + iconClasses + '"></i>';
                }
            } else {
                // Look for regular FontAwesome icons
                var iconEl = link.querySelector('i[class*="fa-"]');
                if (iconEl) {
                    icon = '<i class="' + iconEl.className + '"></i>';
                }
            }
            
            // Extract text content
            var text = link.querySelector('p, paragraph');
            if (text) {
                textContent = text.textContent.trim();
            } else {
                // Remove icon text and get clean text
                var clone = link.cloneNode(true);
                var icons = clone.querySelectorAll('i');
                icons.forEach(function(i) { i.remove(); });
                textContent = clone.textContent.trim();
            }
            
            menuItem.innerHTML = icon + '<span class="eoz-menu-text">' + textContent + '</span>';
            
            mobileMenu.appendChild(menuItem);
        });

        burger.addEventListener('click', function() {
            burger.classList.toggle('open');
            mobileMenu.classList.toggle('open');
            overlay.classList.toggle('open');
        });

        overlay.addEventListener('click', function() {
            burger.classList.remove('open');
            mobileMenu.classList.remove('open');
            overlay.classList.remove('open');
        });

        document.body.appendChild(burger);
        document.body.appendChild(mobileMenu);
        document.body.appendChild(overlay);
        
        console.log('[EOZ Header Menu v' + VERSION + '] Applied');
    }
})();
