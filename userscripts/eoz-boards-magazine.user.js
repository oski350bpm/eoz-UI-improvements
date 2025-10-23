// ==UserScript==
// @name         EOZ Boards Magazine UI
// @namespace    https://github.com/oski350bpm/eoz-UI-improvements
// @version      1.0.0
// @description  Ulepszenia UI dla magazynu oklein/płyt w EOZ
// @match        https://eoz.iplyty.erozrys.pl/index.php/pl/machines/control_panel_boards_magazine_2020*
// @match        https://eoz.iplyty.erozrys.pl/index.php/pl/machines/control_panel_veneers_magazine_2020*
// @updateURL    https://raw.githubusercontent.com/oski350bpm/eoz-UI-improvements/main/userscripts/eoz-boards-magazine.user.js
// @downloadURL  https://raw.githubusercontent.com/oski350bpm/eoz-UI-improvements/main/userscripts/eoz-boards-magazine.user.js
// @require      https://raw.githubusercontent.com/oski350bpm/eoz-UI-improvements/main/core/eoz-core.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var VERSION = '1.0.0';

    if (!window.EOZ) {
        console.warn('[EOZ Boards Magazine UI v' + VERSION + '] core not loaded');
        return;
    }

    var styles = '' +
        '/* Dropdown styles - same as commission list */\n' +
        '.eoz-dropdown-toggle { display: none; }\n' +
        '.eoz-dropdown-label {\n' +
        '    width: 100% !important; height: 60px !important;\n' +
        '    background: #007bff !important; color: white !important;\n' +
        '    border: none !important; border-radius: 8px !important;\n' +
        '    font-size: 16px !important; font-weight: bold !important;\n' +
        '    cursor: pointer !important; display: flex !important;\n' +
        '    align-items: center !important; justify-content: center !important;\n' +
        '    gap: 8px !important; transition: background-color 0.2s !important;\n' +
        '    padding: 12px !important; box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;\n' +
        '    user-select: none !important;\n' +
        '}\n' +
        '.eoz-dropdown-label:hover { background: #0056b3 !important; }\n' +
        '.eoz-dropdown-label:active { background: #004085 !important; transform: translateY(1px) !important; }\n' +
        '.eoz-dropdown-menu {\n' +
        '    position: absolute !important; top: 100% !important;\n' +
        '    left: 0 !important; right: 0 !important;\n' +
        '    background: white !important; border: 1px solid #ddd !important;\n' +
        '    border-radius: 8px !important; box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;\n' +
        '    z-index: 1000 !important; display: none !important;\n' +
        '    flex-direction: column !important; overflow: hidden !important; margin-top: 4px !important;\n' +
        '}\n' +
        '.eoz-dropdown-toggle:checked + .eoz-dropdown-label + .eoz-dropdown-menu { display: flex !important; }\n' +
        '.eoz-dropdown-toggle:checked + .eoz-dropdown-label { background: #0056b3 !important; }\n' +
        '.eoz-dropdown-item {\n' +
        '    display: flex !important; align-items: center !important; gap: 12px !important;\n' +
        '    padding: 16px !important; text-decoration: none !important; color: #333 !important;\n' +
        '    border-bottom: 1px solid #eee !important; transition: background-color 0.2s !important;\n' +
        '    min-height: 50px !important; font-size: 14px !important;\n' +
        '}\n' +
        '.eoz-dropdown-item:last-child { border-bottom: none !important; }\n' +
        '.eoz-dropdown-item:hover { background: #f8f9fa !important; }\n' +
        '.eoz-dropdown-item i { font-size: 18px !important; width: 20px !important; text-align: center !important; }\n' +
        '.eoz-dropdown-item[data-action="details"] i { color: #007bff !important; }\n' +
        '.eoz-dropdown-item[data-action="print"] i { color: #fd7e14 !important; }\n' +
        '.eoz-dropdown-item[data-action="status"] i { color: #6f42c1 !important; }\n' +
        '.eoz-dropdown-item[data-action="archive"] i { color: #6c757d !important; }\n' +
        '.eoz-dropdown-item[data-action="delete"] i { color: #dc3545 !important; }\n' +
        '.eoz-dropdown-item[data-action="view"] i { color: #17a2b8 !important; }\n' +
        '.eoz-dropdown-container { position: relative !important; width: 100% !important; }\n' +
        '@media (max-width: 1024px) {\n' +
        '    .eoz-dropdown-label { height: 70px !important; font-size: 18px !important; }\n' +
        '    .eoz-dropdown-item { min-height: 60px !important; font-size: 16px !important; padding: 20px !important; }\n' +
        '    .eoz-dropdown-item i { font-size: 20px !important; }\n' +
        '}\n';

    window.EOZ.injectStyles(styles, { id: 'eoz-boards-magazine-css' });

    function initialize() {
        console.log('[EOZ Boards Magazine UI v' + VERSION + '] Initializing...');
        
        window.EOZ.waitFor('table tbody tr', { timeout: 10000 })
            .then(function() {
                console.log('[EOZ Boards Magazine UI v' + VERSION + '] Table found, applying improvements...');
                
                // 1. Zamień pierwszą kolumnę (▲ sortowanie) na Lp.
                var headerRow = document.querySelector('table thead tr');
                if (headerRow) {
                    var firstHeaderCell = headerRow.querySelector('th:first-child');
                    if (firstHeaderCell) {
                        firstHeaderCell.textContent = 'Lp.';
                        firstHeaderCell.querySelector('a')?.remove(); // Usuń link sortowania
                    }
                }
                
                // 2. Usuń 5tą kolumnę (Lp z "1/1")
                var allHeaders = document.querySelectorAll('table thead tr th');
                var lpColumnIndex = -1;
                allHeaders.forEach(function(th, index) {
                    if (th.textContent.trim() === 'Lp' && index > 0) {
                        lpColumnIndex = index;
                    }
                });
                
                if (lpColumnIndex !== -1) {
                    // Ukryj nagłówek
                    if (allHeaders[lpColumnIndex]) {
                        allHeaders[lpColumnIndex].style.display = 'none';
                    }
                    
                    // Ukryj komórki w wierszach
                    var rows = document.querySelectorAll('table tbody tr');
                    rows.forEach(function(row) {
                        var cells = row.querySelectorAll('td');
                        if (cells[lpColumnIndex]) {
                            cells[lpColumnIndex].style.display = 'none';
                        }
                    });
                }
                
                // 3. Dodaj numery wierszy do pierwszej kolumny
                var bodyRows = document.querySelectorAll('table tbody tr');
                bodyRows.forEach(function(row, index) {
                    var firstCell = row.querySelector('td:first-child');
                    if (firstCell) {
                        firstCell.textContent = (index + 1).toString();
                        firstCell.style.fontWeight = 'bold';
                        firstCell.style.textAlign = 'center';
                    }
                });
                
                // 4. Przekształć opcje w dropdown
                transformActionButtons();
                
                console.log('[EOZ Boards Magazine UI v' + VERSION + '] Applied successfully!');
            })
            .catch(function() {
                console.warn('[EOZ Boards Magazine UI v' + VERSION + '] Table not found in time');
            });
    }

    function createDropdownMenu(actionsCell, rowIndex) {
        var container = document.createElement('div');
        container.className = 'eoz-dropdown-container';
        
        var checkboxId = 'eoz-dropdown-mag-' + rowIndex;
        
        var checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'eoz-dropdown-toggle';
        checkbox.id = checkboxId;
        
        var label = document.createElement('label');
        label.className = 'eoz-dropdown-label';
        label.htmlFor = checkboxId;
        label.innerHTML = '<i class="fas fa-cog"></i> Akcje';
        
        var menu = document.createElement('div');
        menu.className = 'eoz-dropdown-menu';
        
        var actions = [
            { icon: 'fa-search', text: 'Szczegóły', action: 'details', urlPart: 'show_details' },
            { icon: 'fa-print', text: 'Drukuj', action: 'print', urlPart: 'generate_page' },
            { icon: 'fa-cog', text: 'Zarządzaj statusem', action: 'status', urlPart: 'manage_status' },
            { icon: 'fa-save', text: 'Archiwizuj', action: 'archive', urlPart: 'archive' },
            { icon: 'fa-trash', text: 'Usuń', action: 'delete', urlPart: 'delete' },
            { icon: 'fa-eye', text: 'Widok', action: 'view', urlPart: '#' }
        ];
        
        var links = actionsCell.querySelectorAll('a');
        actions.forEach(function(actionData) {
            var matchingLink = null;
            links.forEach(function(link) {
                if (link.href.indexOf(actionData.urlPart) !== -1) {
                    matchingLink = link;
                }
            });
            
            if (matchingLink) {
                var menuItem = document.createElement('a');
                menuItem.className = 'eoz-dropdown-item';
                menuItem.href = matchingLink.href;
                if (matchingLink.target) menuItem.target = matchingLink.target;
                menuItem.setAttribute('data-action', actionData.action);
                menuItem.innerHTML = '<i class="fas ' + actionData.icon + '"></i> ' + actionData.text;
                
                if (matchingLink.onclick) {
                    menuItem.onclick = matchingLink.onclick;
                }
                
                menu.appendChild(menuItem);
            }
        });
        
        container.appendChild(checkbox);
        container.appendChild(label);
        container.appendChild(menu);
        
        menu.addEventListener('click', function() {
            checkbox.checked = false;
        });
        
        return container;
    }

    function transformActionButtons() {
        var actionCells = document.querySelectorAll('table tbody tr td:last-child');
        
        actionCells.forEach(function(cell, index) {
            // Sprawdź czy ma linki (opcje)
            if (cell.querySelectorAll('a').length > 0) {
                var originalContent = cell.innerHTML;
                cell.innerHTML = '';
                cell.innerHTML = originalContent;
                var dropdown = createDropdownMenu(cell, index);
                cell.innerHTML = '';
                cell.appendChild(dropdown);
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize, { once: true });
    } else {
        initialize();
    }
})();

