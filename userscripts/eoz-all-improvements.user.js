// ==UserScript==
// @name         EOZ All UI Improvements
// @namespace    https://github.com/oski350bpm/eoz-UI-improvements
// @version      2.0.0
// @description  Wszystkie ulepszenia UI dla EOZ w jednym skrypcie
// @match        https://eoz.iplyty.erozrys.pl/*
// @updateURL    https://raw.githubusercontent.com/oski350bpm/eoz-UI-improvements/main/userscripts/eoz-all-improvements.user.js
// @downloadURL  https://raw.githubusercontent.com/oski350bpm/eoz-UI-improvements/main/userscripts/eoz-all-improvements.user.js
// @require      https://raw.githubusercontent.com/oski350bpm/eoz-UI-improvements/main/core/eoz-core.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var VERSION = '2.0.0';
    var currentPage = window.location.href;

    if (!window.EOZ) {
        console.warn('[EOZ All UI v' + VERSION + '] core not loaded');
        return;
    }

    console.log('[EOZ All UI v' + VERSION + '] Initializing...');

    // Inject global styles with fixed dropdown alignment
    var globalStyles = 'th.heading-cell.column-names-cell{white-space:normal!important;line-height:1.3!important;padding:8px!important}.eoz-dropdown-menu{position:absolute!important;top:100%!important;right:0!important;left:auto!important;min-width:200px!important;max-width:280px!important;background:#fff!important;border:1px solid #ddd!important;border-radius:8px!important;box-shadow:0 4px 12px rgba(0,0,0,.15)!important;z-index:1000!important;display:none!important;flex-direction:column!important;overflow:hidden!important;margin-top:4px!important}';
    
    window.EOZ.injectStyles(globalStyles, { id: 'eoz-all-dropdown-fix' });

    window.EOZ.whenReady(function() {
        setupHeaderMenu();
        
        if (currentPage.indexOf('/commission/show_list') !== -1) {
            setupCommissionList();
        }
        
        if (currentPage.indexOf('control_panel_boards_magazine') !== -1 || 
            currentPage.indexOf('control_panel_veneers_magazine') !== -1) {
            setupBoardsMagazine();
        }
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
            
            var text = link.querySelector('p, paragraph');
            var textContent = text ? text.textContent.trim() : link.textContent.trim();
            menuItem.innerHTML = '<span class="eoz-menu-text">' + textContent + '</span>';
            
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
        
        console.log('[EOZ All UI v' + VERSION + '] Header menu applied');
    }

    function setupCommissionList() {
        window.EOZ.waitFor('table.dynamic-table tbody tr.body-row', { timeout: 10000 })
            .then(function() {
                transformCommissionActionButtons();
                console.log('[EOZ All UI v' + VERSION + '] Commission list applied');
            })
            .catch(function() {
                console.warn('[EOZ All UI v' + VERSION + '] Commission list not found');
            });
    }

    function transformCommissionActionButtons() {
        var actionCells = document.querySelectorAll('td.body-cell.body-options-cell');
        actionCells.forEach(function(cell, index) {
            if (cell.querySelectorAll('a').length === 0) return;
            
            var originalContent = cell.innerHTML;
            cell.innerHTML = '';
            cell.innerHTML = originalContent;
            
            var container = document.createElement('div');
            container.className = 'eoz-dropdown-container';
            
            var checkboxId = 'eoz-dropdown-' + index;
            var checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'eoz-dropdown-toggle';
            checkbox.id = checkboxId;
            checkbox.style.display = 'none';
            
            var label = document.createElement('label');
            label.className = 'eoz-dropdown-label';
            label.htmlFor = checkboxId;
            label.innerHTML = '<i class="fas fa-cog"></i> Akcje';
            label.style.width = '100%';
            label.style.height = '60px';
            label.style.background = '#007bff';
            label.style.color = 'white';
            label.style.border = 'none';
            label.style.borderRadius = '8px';
            label.style.fontSize = '16px';
            label.style.fontWeight = 'bold';
            label.style.cursor = 'pointer';
            label.style.display = 'flex';
            label.style.alignItems = 'center';
            label.style.justifyContent = 'center';
            label.style.gap = '8px';
            label.style.padding = '12px';
            
            var menu = document.createElement('div');
            menu.className = 'eoz-dropdown-menu';
            
            var links = cell.querySelectorAll('a');
            links.forEach(function(link) {
                var menuItem = document.createElement('a');
                menuItem.href = link.href;
                menuItem.className = 'eoz-dropdown-item';
                menuItem.style.display = 'flex';
                menuItem.style.alignItems = 'center';
                menuItem.style.padding = '16px';
                menuItem.style.textDecoration = 'none';
                menuItem.style.color = '#333';
                menuItem.style.borderBottom = '1px solid #eee';
                menuItem.innerHTML = '<i class="' + (link.querySelector('i') ? link.querySelector('i').className : '') + '" style="font-size:18px; width:20px; text-align:center; margin-right:8px;"></i> ' + link.textContent.trim();
                
                menu.appendChild(menuItem);
            });
            
            checkbox.addEventListener('change', function() {
                if (!checkbox.checked) {
                    menu.style.display = 'none';
                }
            });
            
            menu.addEventListener('click', function() {
                checkbox.checked = false;
                menu.style.display = 'none';
            });
            
            label.addEventListener('click', function() {
                checkbox.checked = !checkbox.checked;
                menu.style.display = checkbox.checked ? 'flex' : 'none';
            });
            
            container.appendChild(checkbox);
            container.appendChild(label);
            container.appendChild(menu);
            container.style.position = 'relative';
            container.style.width = '100%';
            
            cell.innerHTML = '';
            cell.appendChild(container);
        });
    }

    function setupBoardsMagazine() {
        window.EOZ.waitFor('table tbody tr', { timeout: 10000 })
            .then(function() {
                var headerRow = document.querySelector('table thead tr');
                if (headerRow) {
                    var firstHeaderCell = headerRow.querySelector('th:first-child');
                    if (firstHeaderCell) {
                        firstHeaderCell.textContent = 'Lp.';
                    }
                }

                var bodyRows = document.querySelectorAll('table tbody tr');
                bodyRows.forEach(function(row, index) {
                    var firstCell = row.querySelector('td:first-child');
                    if (firstCell) {
                        firstCell.textContent = (index + 1).toString();
                    }
                });

                transformBoardsMagazineActionButtons();
                console.log('[EOZ All UI v' + VERSION + '] Boards magazine applied');
            })
            .catch(function() {
                console.warn('[EOZ All UI v' + VERSION + '] Boards magazine not found');
            });
    }

    function transformBoardsMagazineActionButtons() {
        var actionCells = document.querySelectorAll('table tbody tr td:last-child');
        actionCells.forEach(function(cell, index) {
            if (cell.querySelectorAll('a').length === 0) return;
            
            var container = document.createElement('div');
            container.className = 'eoz-dropdown-container';
            container.style.position = 'relative';
            container.style.width = '100%';
            
            var checkboxId = 'eoz-dropdown-mag-' + index;
            var checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'eoz-dropdown-toggle';
            checkbox.id = checkboxId;
            checkbox.style.display = 'none';
            
            var label = document.createElement('label');
            label.className = 'eoz-dropdown-label';
            label.htmlFor = checkboxId;
            label.innerHTML = '<i class="fas fa-cog"></i> Akcje';
            
            var menu = document.createElement('div');
            menu.className = 'eoz-dropdown-menu';
            
            var links = cell.querySelectorAll('a');
            links.forEach(function(link) {
                var menuItem = document.createElement('a');
                menuItem.href = link.href;
                menuItem.className = 'eoz-dropdown-item';
                menuItem.style.display = 'flex';
                menuItem.style.alignItems = 'center';
                menuItem.style.padding = '16px';
                menuItem.style.textDecoration = 'none';
                menuItem.style.color = '#333';
                menuItem.style.borderBottom = '1px solid #eee';
                menuItem.innerHTML = '<i class="' + (link.querySelector('i') ? link.querySelector('i').className : '') + '" style="font-size:18px; width:20px; text-align:center; margin-right:8px;"></i> ' + link.textContent.trim();
                
                menu.appendChild(menuItem);
            });
            
            label.addEventListener('click', function() {
                checkbox.checked = !checkbox.checked;
                menu.style.display = checkbox.checked ? 'flex' : 'none';
            });
            
            menu.addEventListener('click', function() {
                checkbox.checked = false;
                menu.style.display = 'none';
            });
            
            container.appendChild(checkbox);
            container.appendChild(label);
            container.appendChild(menu);
            
            cell.innerHTML = '';
            cell.appendChild(container);
        });
    }
})();
