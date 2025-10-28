// EOZ Header Menu Module
// Responsive header menu with hamburger for mobile/tablet

(function() {
    'use strict';

    var VERSION = '2.2.7';
    
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
        '@media (min-width: 1024px) { #eoz-burger-menu, #eoz-burger-menu-item { display: none !important; } .list-group.list-group-horizontal > li.eoz-hide-tablet { display: inline-block !important; } }\n' +
        '@media (max-width: 767px) { #eoz-burger-menu-item { display: none !important; } #eoz-burger-menu.eoz-floating { display: flex !important; position: fixed; top: 0; right: 10px; z-index: 10000; width: 50px; height: 50px; border-radius: 50%; background: #007bff; margin-top: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.3); } }\n' +
        '@media (min-width: 768px) and (max-width: 1023px) { #eoz-burger-menu-item { display: inline-block !important; } #eoz-burger-menu.eoz-floating { display: none !important; } }\n' +
        '#eoz-burger-menu-item { padding: 8px 15px; border: none; background: transparent; margin: 0; }\n' +
        '#eoz-burger-menu-item .eoz-burger-wrapper { display: flex; align-items: center; justify-content: center; width: 64px; height: 64px; background: #007bff; border-radius: 50%; }\n' +
        '#eoz-burger-menu { border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; padding: 0; background: transparent; width: 100%; height: 100%; }\n' +
        '#eoz-burger-menu span { display: block; width: 32px; height: 3px; background: white; position: relative; }\n' +
        '#eoz-burger-menu span::before, #eoz-burger-menu span::after { content: ""; display: block; width: 32px; height: 3px; background: white; position: absolute; left: 0; }\n' +
        '#eoz-burger-menu span::before { top: -10px; }\n' +
        '#eoz-burger-menu span::after { top: 10px; }\n' +
        '#eoz-burger-menu.open span { background: transparent; }\n' +
        '#eoz-burger-menu.open span::before { transform: rotate(45deg); top: 0; }\n' +
        '#eoz-burger-menu.open span::after { transform: rotate(-45deg); top: 0; }\n' +
        '#eoz-mobile-menu { position: fixed; top: 0; right: -100%; width: 280px; max-width: 85%; height: 100vh; background: white; box-shadow: -2px 0 8px rgba(0,0,0,0.3); z-index: 9999; transition: right 0.3s ease; overflow-y: auto; padding: 60px 0 20px; }\n' +
        '#eoz-mobile-menu.open { right: 0; }\n' +
        '#eoz-mobile-menu .eoz-menu-item { display: flex; align-items: center; gap: 12px; padding: 12px 20px; text-decoration: none; color: #333; border-bottom: 1px solid #f0f0f0; transition: background 0.2s; }\n' +
        '#eoz-mobile-menu .eoz-menu-item:hover { background: #f8f9fa; }\n' +
        '#eoz-mobile-menu .eoz-menu-item i { font-size: 18px; width: 20px; text-align: left; }\n' +
        '#eoz-mobile-menu.open .eoz-menu-item i { background: #007bff; color: #fff; border-radius: 6px; padding: 6px; width: 28px; height: 28px; text-align: center; display: inline-flex; align-items: center; justify-content: center; }\n' +
        '#eoz-mobile-menu .eoz-menu-item i.fa-stack { width: auto; }\n' +
        '#eoz-mobile-menu .eoz-menu-item .eoz-menu-text { flex: 1; font-size: 15px; }\n' +
        '#eoz-menu-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 9998; display: none; }\n' +
        '#eoz-menu-overlay.open { display: block; }\n' +
        '@media (min-width: 768px) and (max-width: 1023px) { #eoz-mobile-menu .eoz-menu-item:not(.eoz-tablet-only) { display: none; } }\n';

    window.EOZ.injectStyles(globalStyles, { id: 'eoz-header-menu-css' });

    window.EOZ.whenReady(function() {
        setupHeaderMenu();
        setupTouchDropdowns();
        addWorkToDoItem();
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

        // Create burger button wrapped in list item for tablet view
        var burgerLi = document.createElement('li');
        burgerLi.id = 'eoz-burger-menu-item';
        burgerLi.className = 'list-group-item';
        
        var burgerWrapper = document.createElement('div');
        burgerWrapper.className = 'eoz-burger-wrapper';
        
        var burger = document.createElement('button');
        burger.id = 'eoz-burger-menu';
        burger.innerHTML = '<span></span>';
        
        burgerWrapper.appendChild(burger);
        burgerLi.appendChild(burgerWrapper);
        
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

        overlay.addEventListener('click', function() {
            burger.classList.remove('open');
            mobileMenu.classList.remove('open');
            overlay.classList.remove('open');
        });

        // Append burger based on whether menu exists
        var menuContainer = document.querySelector('.list-group.list-group-horizontal');
        if (menuContainer) {
            // Find logout button and insert before it (search more broadly)
            var logoutItem = null;
            var allItems = menuContainer.querySelectorAll('li');
            for (var i = 0; i < allItems.length; i++) {
                var item = allItems[i];
                var link = item.querySelector('a');
                var text = item.textContent.trim().toLowerCase();
                if (link) {
                    var href = link.getAttribute('href') || '';
                    if (href.indexOf('logout') !== -1 || text.indexOf('wyloguj') !== -1 || text.indexOf('logout') !== -1) {
                        logoutItem = item;
                        break;
                    }
                }
            }
            
            if (logoutItem) {
                menuContainer.insertBefore(burgerLi, logoutItem);
                console.log('[EOZ Header Menu v' + VERSION + '] Burger inserted before logout');
            } else {
                menuContainer.appendChild(burgerLi);
                console.log('[EOZ Header Menu v' + VERSION + '] Burger appended at end (no logout found)');
            }
        }
        
        // Always create floating button for mobile (no menu)
        var floatingBurger = burger.cloneNode(true);
        floatingBurger.id = 'eoz-burger-menu';
        floatingBurger.className = 'eoz-floating';
        
        // Connect both burgers to same functionality
        [burger, floatingBurger].forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                burger.classList.toggle('open');
                floatingBurger.classList.toggle('open');
                mobileMenu.classList.toggle('open');
                overlay.classList.toggle('open');
            });
        });
        
        document.body.appendChild(floatingBurger);
        document.body.appendChild(mobileMenu);
        document.body.appendChild(overlay);
        
        console.log('[EOZ Header Menu v' + VERSION + '] Applied');
    }

    // Enable touch-friendly dropdowns in the top header menu
    function setupTouchDropdowns() {
        try {
            var isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (window.matchMedia && window.matchMedia('(pointer: coarse)').matches);
            if (!isTouch) return;

            // Ensure dropdowns can be toggled by tap, not just hover
            var header = document.querySelector('ul.list-group.list-group-horizontal');
            if (!header) return;

            // Close any open dropdowns
            function closeAll() {
                header.querySelectorAll('li.list-group-item.dropdown.eoz-open').forEach(function(li) {
                    li.classList.remove('eoz-open');
                    var menu = li.querySelector('.dropdown-menu');
                    if (menu) menu.style.display = '';
                });
            }

            // Toggle handler for anchors inside dropdown items
            header.querySelectorAll('li.list-group-item.dropdown > a').forEach(function(anchor) {
                anchor.addEventListener('click', function(ev) {
                    var li = anchor.closest('li.list-group-item.dropdown');
                    if (!li) return;
                    var menu = li.querySelector('.dropdown-menu');
                    if (!menu) return;

                    // First tap: open menu and prevent navigation
                    if (!li.classList.contains('eoz-open')) {
                        ev.preventDefault();
                        ev.stopPropagation();
                        closeAll();
                        li.classList.add('eoz-open');
                        menu.style.display = 'block';
                        return false;
                    }
                    // Second tap will follow the link (allow default)
                });
            });

            // Tapping a menu item should close the menu
            header.querySelectorAll('li.list-group-item.dropdown .dropdown-menu').forEach(function(menu) {
                menu.addEventListener('click', function() { closeAll(); });
            });

            // Click outside to close
            document.addEventListener('click', function(ev) {
                var target = ev.target;
                if (!header.contains(target)) closeAll();
            });

            // Basic CSS aid: show menu when .eoz-open
            var css = '' +
                'ul.list-group.list-group-horizontal li.list-group-item.dropdown.eoz-open > .dropdown-menu{display:block !important;}\n';
            window.EOZ.injectStyles(css, { id: 'eoz-header-menu-touch-dropdown' });
        } catch (e) {
            console.debug('[EOZ Header Menu v' + VERSION + '] touch dropdown setup failed', e);
        }
    }

    // Add 'Do wykonania' as the first entry in the 'Moje zlecenia' dropdown
    function addWorkToDoItem() {
        try {
            var menu = document.querySelector('ul.list-group.list-group-horizontal');
            if (!menu) return;

            // Find the LI containing 'Moje zlecenia'
            var moje = null;
            var items = menu.querySelectorAll('li.list-group-item.dropdown');
            items.forEach(function(li){
                var a = li.querySelector('a');
                if (!a) return;
                var txt = (a.textContent||'').trim();
                if (txt.indexOf('Moje zlecenia') !== -1) {
                    moje = li;
                }
            });
            if (!moje) return;

            var dropdown = moje.querySelector('ul.dropdown-menu');
            if (!dropdown) return;

            // If already exists, do nothing
            var exists = Array.from(dropdown.querySelectorAll('a')).some(function(a){ return (a.textContent||'').trim().toLowerCase() === 'do wykonania'; });
            if (exists) return;

            var li = document.createElement('li');
            var a = document.createElement('a');
            a.href = 'https://eoz.iplyty.erozrys.pl/index.php/pl/machines/control_panel';
            a.innerHTML = '<i class="fa fa-list-ul"></i> Do wykonania';
            li.appendChild(a);
            dropdown.insertBefore(li, dropdown.firstChild);
        } catch (e) {
            console.debug('[EOZ Header Menu] addWorkToDoItem failed', e);
        }
    }
})();
