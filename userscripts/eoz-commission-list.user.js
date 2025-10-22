// ==UserScript==
// @name         EOZ Commission List UI
// @namespace    https://github.com/oski350bpm/eoz-UI-improvements
// @version      1.0.1
// @description  Ulepszenia UI dla listy zleceń w EOZ (produkcyjny widok)
// @match        https://eoz.iplyty.erozrys.pl/index.php/pl/commission/show_list*
// @match        https://eoz.iplyty.erozrys.pl/commission/show_list*
// @updateURL    https://raw.githubusercontent.com/oski350bpm/eoz-UI-improvements/main/userscripts/eoz-commission-list.user.js
// @downloadURL  https://raw.githubusercontent.com/oski350bpm/eoz-UI-improvements/main/userscripts/eoz-commission-list.user.js
// @require      https://raw.githubusercontent.com/oski350bpm/eoz-UI-improvements/main/core/eoz-core.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    if (!window.EOZ) {
        console.warn('EOZ Commission List UI: core not loaded');
        return;
    }

    var styles = '' +
        '/* Hide unnecessary columns for production workers */\n' +
        '.eoz-hidden-column {\n' +
        '    display: none !important;\n' +
        '}\n' +
        '/* Format date column - simplified */\n' +
        '.eoz-date-cell {\n' +
        '}\n' +
        '/* CSS-only dropdown using checkbox hack */\n' +
        '.eoz-dropdown-toggle {\n' +
        '    display: none;\n' +
        '}\n' +
        '.eoz-dropdown-label {\n' +
        '    width: 100% !important;\n' +
        '    height: 60px !important;\n' +
        '    background: #007bff !important;\n' +
        '    color: white !important;\n' +
        '    border: none !important;\n' +
        '    border-radius: 8px !important;\n' +
        '    font-size: 16px !important;\n' +
        '    font-weight: bold !important;\n' +
        '    cursor: pointer !important;\n' +
        '    display: flex !important;\n' +
        '    align-items: center !important;\n' +
        '    justify-content: center !important;\n' +
        '    gap: 8px !important;\n' +
        '    transition: background-color 0.2s !important;\n' +
        '    padding: 12px !important;\n' +
        '    box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;\n' +
        '    user-select: none !important;\n' +
        '    -webkit-user-select: none !important;\n' +
        '}\n' +
        '.eoz-dropdown-label:hover {\n' +
        '    background: #0056b3 !important;\n' +
        '}\n' +
        '.eoz-dropdown-label:active {\n' +
        '    background: #004085 !important;\n' +
        '    transform: translateY(1px) !important;\n' +
        '}\n' +
        '/* Dropdown menu - hidden by default */\n' +
        '.eoz-dropdown-menu {\n' +
        '    position: absolute !important;\n' +
        '    top: 100% !important;\n' +
        '    left: 0 !important;\n' +
        '    right: 0 !important;\n' +
        '    background: white !important;\n' +
        '    border: 1px solid #ddd !important;\n' +
        '    border-radius: 8px !important;\n' +
        '    box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;\n' +
        '    z-index: 1000 !important;\n' +
        '    display: none !important;\n' +
        '    flex-direction: column !important;\n' +
        '    overflow: hidden !important;\n' +
        '    margin-top: 4px !important;\n' +
        '}\n' +
        '/* Show menu when checkbox is checked */\n' +
        '.eoz-dropdown-toggle:checked + .eoz-dropdown-label + .eoz-dropdown-menu {\n' +
        '    display: flex !important;\n' +
        '}\n' +
        '/* Change label appearance when open */\n' +
        '.eoz-dropdown-toggle:checked + .eoz-dropdown-label {\n' +
        '    background: #0056b3 !important;\n' +
        '}\n' +
        '.eoz-dropdown-item {\n' +
        '    display: flex !important;\n' +
        '    align-items: center !important;\n' +
        '    gap: 12px !important;\n' +
        '    padding: 16px !important;\n' +
        '    text-decoration: none !important;\n' +
        '    color: #333 !important;\n' +
        '    border-bottom: 1px solid #eee !important;\n' +
        '    transition: background-color 0.2s !important;\n' +
        '    min-height: 50px !important;\n' +
        '    font-size: 14px !important;\n' +
        '}\n' +
        '.eoz-dropdown-item:last-child {\n' +
        '    border-bottom: none !important;\n' +
        '}\n' +
        '.eoz-dropdown-item:hover {\n' +
        '    background: #f8f9fa !important;\n' +
        '}\n' +
        '.eoz-dropdown-item i {\n' +
        '    font-size: 18px !important;\n' +
        '    width: 20px !important;\n' +
        '    text-align: center !important;\n' +
        '}\n' +
        '/* Action button colors */\n' +
        '.eoz-dropdown-item[data-action="info"] i { color: #17a2b8 !important; }\n' +
        '.eoz-dropdown-item[data-action="notes"] i { color: #ffc107 !important; }\n' +
        '.eoz-dropdown-item[data-action="times"] i { color: #28a745 !important; }\n' +
        '.eoz-dropdown-item[data-action="status"] i { color: #6f42c1 !important; }\n' +
        '.eoz-dropdown-item[data-action="details"] i { color: #007bff !important; }\n' +
        '.eoz-dropdown-item[data-action="delete"] i { color: #dc3545 !important; }\n' +
        '.eoz-dropdown-item[data-action="archive"] i { color: #6c757d !important; }\n' +
        '.eoz-dropdown-item[data-action="print"] i { color: #fd7e14 !important; }\n' +
        '/* Container for dropdown */\n' +
        '.eoz-dropdown-container {\n' +
        '    position: relative !important;\n' +
        '    width: 100% !important;\n' +
        '}\n' +
        '/* Tablet optimizations */\n' +
        '@media (max-width: 1024px) {\n' +
        '    .eoz-dropdown-label {\n' +
        '        height: 70px !important;\n' +
        '        font-size: 18px !important;\n' +
        '    }\n' +
        '    .eoz-dropdown-item {\n' +
        '        min-height: 60px !important;\n' +
        '        font-size: 16px !important;\n' +
        '        padding: 20px !important;\n' +
        '    }\n' +
        '    .eoz-dropdown-item i {\n' +
        '        font-size: 20px !important;\n' +
        '    }\n' +
        '}\n';

    window.EOZ.injectStyles(styles, { id: 'eoz-commission-list-css' });

    function findColumnIndex(headerText) {
        var headers = document.querySelectorAll('th.heading-cell.column-names-cell');
        for (var i = 0; i < headers.length; i++) {
            var header = headers[i];
            var text = (header.textContent || '').trim();
            if (text.indexOf(headerText) !== -1) {
                return i;
            }
        }
        return -1;
    }

    function hideColumns() {
        var clientCodeIndex = findColumnIndex('Kod klienta');
        var startDateIndex = findColumnIndex('Data rozpoczęcia');

        if (clientCodeIndex !== -1) {
            var headers = document.querySelectorAll('th.heading-cell.column-names-cell');
            if (headers[clientCodeIndex]) {
                headers[clientCodeIndex].classList.add('eoz-hidden-column');
            }
            var searchCells = document.querySelectorAll('th.heading-cell.heading-options-cell.search-cell');
            if (searchCells[clientCodeIndex]) {
                searchCells[clientCodeIndex].classList.add('eoz-hidden-column');
            }
            var rows = document.querySelectorAll('tbody tr.body-row');
            rows.forEach(function(row) {
                var cells = row.querySelectorAll('td.body-cell');
                if (cells[clientCodeIndex]) {
                    cells[clientCodeIndex].classList.add('eoz-hidden-column');
                }
            });
        }

        if (startDateIndex !== -1) {
            var headers2 = document.querySelectorAll('th.heading-cell.column-names-cell');
            if (headers2[startDateIndex]) {
                headers2[startDateIndex].classList.add('eoz-hidden-column');
            }
            var searchCells2 = document.querySelectorAll('th.heading-cell.heading-options-cell.search-cell');
            if (searchCells2[startDateIndex]) {
                searchCells2[startDateIndex].classList.add('eoz-hidden-column');
            }
            var rows2 = document.querySelectorAll('tbody tr.body-row');
            rows2.forEach(function(row) {
                var cells2 = row.querySelectorAll('td.body-cell');
                if (cells2[startDateIndex]) {
                    cells2[startDateIndex].classList.add('eoz-hidden-column');
                }
            });
        }
    }

    function formatDates() {
        var plannedDateIndex = findColumnIndex('Planowana data zakończenia zlecenia');
        if (plannedDateIndex !== -1) {
            var rows = document.querySelectorAll('tbody tr.body-row');
            rows.forEach(function(row) {
                var cells = row.querySelectorAll('td.body-cell');
                if (cells[plannedDateIndex]) {
                    var cell = cells[plannedDateIndex];
                    var fullDate = (cell.textContent || '').trim();
                    if (fullDate && fullDate.length >= 10) {
                        var dateOnly = fullDate.substring(0, 10);
                        cell.textContent = dateOnly;
                        cell.classList.add('eoz-date-cell');
                    }
                }
            });
        }
    }

    function createDropdownMenu(actionsCell, rowIndex) {
        var container = document.createElement('div');
        container.className = 'eoz-dropdown-container';

        var checkboxId = 'eoz-dropdown-' + rowIndex;

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
            { icon: 'fa-comment', text: 'Info wysyłki', action: 'info', class: 'show_erorys_notes_or_send_info' },
            { icon: 'fa-comments', text: 'Uwagi', action: 'notes', class: 'open-modal' },
            { icon: 'fa-clock', text: 'Czasy pracy', action: 'times', class: '' },
            { icon: 'fa-cog', text: 'Zarządzaj statusem', action: 'status', class: '' },
            { icon: 'fa-search', text: 'Szczegóły', action: 'details', class: '' },
            { icon: 'fa-trash', text: 'Usuń', action: 'delete', class: '' },
            { icon: 'fa-save', text: 'Archiwizuj', action: 'archive', class: '' },
            { icon: 'fa-print', text: 'Drukuj', action: 'print', class: '' }
        ];

        actions.forEach(function(actionData) {
            var hrefPart = (actionData.action === 'info') ? 'send_info' :
                (actionData.action === 'notes') ? 'notes' :
                (actionData.action === 'times') ? 'working_times' :
                (actionData.action === 'status') ? 'manage_status' :
                (actionData.action === 'details') ? 'show_details' :
                (actionData.action === 'delete') ? 'delete' :
                (actionData.action === 'archive') ? 'archive' :
                (actionData.action === 'print') ? 'generate_page' : '';
            var originalLink = actionsCell.querySelector('a[href*="' + hrefPart + '"]');
            if (originalLink) {
                var menuItem = document.createElement('a');
                menuItem.className = 'eoz-dropdown-item ' + (actionData.class || '');
                menuItem.href = originalLink.href;
                if (originalLink.target) menuItem.target = originalLink.target;
                menuItem.setAttribute('data-action', actionData.action);
                menuItem.innerHTML = '<i class="fas ' + actionData.icon + '"></i> ' + actionData.text;
                if (originalLink.onclick) {
                    menuItem.onclick = originalLink.onclick;
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
        var actionCells = document.querySelectorAll('td.body-cell.body-options-cell');
        actionCells.forEach(function(cell, index) {
            var originalContent = cell.innerHTML;
            cell.innerHTML = '';
            cell.innerHTML = originalContent;
            var dropdown = createDropdownMenu(cell, index);
            cell.innerHTML = '';
            cell.appendChild(dropdown);
        });
    }

    function initialize() {
        console.log('EOZ Commission List UI: Initializing...');
        window.EOZ.waitFor('table.dynamic-table tbody tr.body-row', { timeout: 10000 })
            .then(function() {
                console.log('EOZ Commission List UI: Table found, applying improvements...');
                hideColumns();
                formatDates();
                transformActionButtons();
                console.log('EOZ Commission List UI: Applied successfully!');
            })
            .catch(function() {
                console.warn('EOZ Commission List UI: Table not found in time');
            });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize, { once: true });
    } else {
        initialize();
    }
})();
