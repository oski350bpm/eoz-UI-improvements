// ==UserScript==
// @name         eOZ UI Improvements - Tablet Production View
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Ulepszenia UI dla tabeli zleceń na tabletach - ukrywa niepotrzebne kolumny, formatuje daty i tworzy dotykowe przyciski akcji
// @author       Production Team
// @match        https://eoz.iplyty.erozrys.pl/index.php/pl/commission/show_list*
// @match        https://eoz.iplyty.erozrys.pl/commission/show_list*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // CSS Styles for UI improvements
    const styles = `
        /* Hide unnecessary columns for production workers */
        .eoz-hidden-column {
            display: none !important;
        }
        
        /* Format date column - simplified */
        .eoz-date-cell {
            /* Date will be replaced directly in JavaScript */
        }
        
        /* CSS-only dropdown using checkbox hack */
        .eoz-dropdown-toggle {
            display: none;
        }
        
        .eoz-dropdown-label {
            width: 100% !important;
            height: 60px !important;
            background: #007bff !important;
            color: white !important;
            border: none !important;
            border-radius: 8px !important;
            font-size: 16px !important;
            font-weight: bold !important;
            cursor: pointer !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            gap: 8px !important;
            transition: background-color 0.2s !important;
            padding: 12px !important;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1) !important;
            user-select: none !important;
            -webkit-user-select: none !important;
        }
        
        .eoz-dropdown-label:hover {
            background: #0056b3 !important;
        }
        
        .eoz-dropdown-label:active {
            background: #004085 !important;
            transform: translateY(1px) !important;
        }
        
        /* Dropdown menu - hidden by default */
        .eoz-dropdown-menu {
            position: absolute !important;
            top: 100% !important;
            left: 0 !important;
            right: 0 !important;
            background: white !important;
            border: 1px solid #ddd !important;
            border-radius: 8px !important;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
            z-index: 1000 !important;
            display: none !important;
            flex-direction: column !important;
            overflow: hidden !important;
            margin-top: 4px !important;
        }
        
        /* Show menu when checkbox is checked */
        .eoz-dropdown-toggle:checked + .eoz-dropdown-label + .eoz-dropdown-menu {
            display: flex !important;
        }
        
        /* Change label appearance when open */
        .eoz-dropdown-toggle:checked + .eoz-dropdown-label {
            background: #0056b3 !important;
        }
        
        .eoz-dropdown-item {
            display: flex !important;
            align-items: center !important;
            gap: 12px !important;
            padding: 16px !important;
            text-decoration: none !important;
            color: #333 !important;
            border-bottom: 1px solid #eee !important;
            transition: background-color 0.2s !important;
            min-height: 50px !important;
            font-size: 14px !important;
        }
        
        .eoz-dropdown-item:last-child {
            border-bottom: none !important;
        }
        
        .eoz-dropdown-item:hover {
            background: #f8f9fa !important;
        }
        
        .eoz-dropdown-item i {
            font-size: 18px !important;
            width: 20px !important;
            text-align: center !important;
        }
        
        /* Action button colors */
        .eoz-dropdown-item[data-action="info"] i { color: #17a2b8 !important; }
        .eoz-dropdown-item[data-action="notes"] i { color: #ffc107 !important; }
        .eoz-dropdown-item[data-action="times"] i { color: #28a745 !important; }
        .eoz-dropdown-item[data-action="status"] i { color: #6f42c1 !important; }
        .eoz-dropdown-item[data-action="details"] i { color: #007bff !important; }
        .eoz-dropdown-item[data-action="delete"] i { color: #dc3545 !important; }
        .eoz-dropdown-item[data-action="archive"] i { color: #6c757d !important; }
        .eoz-dropdown-item[data-action="print"] i { color: #fd7e14 !important; }
        
        /* Container for dropdown */
        .eoz-dropdown-container {
            position: relative !important;
            width: 100% !important;
        }
        
        /* Tablet optimizations */
        @media (max-width: 1024px) {
            .eoz-dropdown-label {
                height: 70px !important;
                font-size: 18px !important;
            }
            
            .eoz-dropdown-item {
                min-height: 60px !important;
                font-size: 16px !important;
                padding: 20px !important;
            }
            
            .eoz-dropdown-item i {
                font-size: 20px !important;
            }
        }
    `;

    // Inject CSS styles
    function injectStyles() {
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    // Find column index by header text
    function findColumnIndex(headerText) {
        const headers = document.querySelectorAll('th.heading-cell.column-names-cell');
        for (let i = 0; i < headers.length; i++) {
            const header = headers[i];
            const text = header.textContent.trim();
            if (text.includes(headerText)) {
                return i;
            }
        }
        return -1;
    }

    // Hide unnecessary columns
    function hideColumns() {
        const clientCodeIndex = findColumnIndex('Kod klienta');
        const startDateIndex = findColumnIndex('Data rozpoczęcia');
        
        // Hide client code column
        if (clientCodeIndex !== -1) {
            // Hide header
            const headers = document.querySelectorAll('th.heading-cell.column-names-cell');
            if (headers[clientCodeIndex]) {
                headers[clientCodeIndex].classList.add('eoz-hidden-column');
            }
            
            // Hide search cell
            const searchCells = document.querySelectorAll('th.heading-cell.heading-options-cell.search-cell');
            if (searchCells[clientCodeIndex]) {
                searchCells[clientCodeIndex].classList.add('eoz-hidden-column');
            }
            
            // Hide data cells
            const rows = document.querySelectorAll('tbody tr.body-row');
            rows.forEach(row => {
                const cells = row.querySelectorAll('td.body-cell');
                if (cells[clientCodeIndex]) {
                    cells[clientCodeIndex].classList.add('eoz-hidden-column');
                }
            });
        }
        
        // Hide start date column
        if (startDateIndex !== -1) {
            // Hide header
            const headers = document.querySelectorAll('th.heading-cell.column-names-cell');
            if (headers[startDateIndex]) {
                headers[startDateIndex].classList.add('eoz-hidden-column');
            }
            
            // Hide search cell
            const searchCells = document.querySelectorAll('th.heading-cell.heading-options-cell.search-cell');
            if (searchCells[startDateIndex]) {
                searchCells[startDateIndex].classList.add('eoz-hidden-column');
            }
            
            // Hide data cells
            const rows = document.querySelectorAll('tbody tr.body-row');
            rows.forEach(row => {
                const cells = row.querySelectorAll('td.body-cell');
                if (cells[startDateIndex]) {
                    cells[startDateIndex].classList.add('eoz-hidden-column');
                }
            });
        }
    }

    // Format date cells to show only date (hide time)
    function formatDates() {
        const plannedDateIndex = findColumnIndex('Planowana data zakończenia zlecenia');
        
        if (plannedDateIndex !== -1) {
            const rows = document.querySelectorAll('tbody tr.body-row');
            rows.forEach(row => {
                const cells = row.querySelectorAll('td.body-cell');
                if (cells[plannedDateIndex]) {
                    const cell = cells[plannedDateIndex];
                    const fullDate = cell.textContent.trim();
                    
                    // Extract only date part (first 10 characters) and replace content
                    if (fullDate && fullDate.length >= 10) {
                        const dateOnly = fullDate.substring(0, 10);
                        cell.textContent = dateOnly; // Directly replace the content
                        cell.classList.add('eoz-date-cell');
                    }
                }
            });
        }
    }

    // Create dropdown menu for action buttons (CSS-only with checkbox)
    function createDropdownMenu(actionsCell, rowIndex) {
        const container = document.createElement('div');
        container.className = 'eoz-dropdown-container';
        
        // Create unique ID for this dropdown
        const checkboxId = `eoz-dropdown-${rowIndex}`;
        
        // Create checkbox (hidden)
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'eoz-dropdown-toggle';
        checkbox.id = checkboxId;
        
        // Create label (acts as button)
        const label = document.createElement('label');
        label.className = 'eoz-dropdown-label';
        label.htmlFor = checkboxId;
        label.innerHTML = '<i class="fas fa-cog"></i> Akcje';
        
        const menu = document.createElement('div');
        menu.className = 'eoz-dropdown-menu';
        
        // Define action items
        const actions = [
            { icon: 'fa-comment', text: 'Info wysyłki', action: 'info', class: 'show_erorys_notes_or_send_info' },
            { icon: 'fa-comments', text: 'Uwagi', action: 'notes', class: 'open-modal' },
            { icon: 'fa-clock', text: 'Czasy pracy', action: 'times', class: '' },
            { icon: 'fa-cog', text: 'Zarządzaj statusem', action: 'status', class: '' },
            { icon: 'fa-search', text: 'Szczegóły', action: 'details', class: '' },
            { icon: 'fa-trash', text: 'Usuń', action: 'delete', class: '' },
            { icon: 'fa-save', text: 'Archiwizuj', action: 'archive', class: '' },
            { icon: 'fa-print', text: 'Drukuj', action: 'print', class: '' }
        ];
        
        // Create menu items
        actions.forEach(actionData => {
            const originalLink = actionsCell.querySelector(`a[href*="${actionData.action === 'info' ? 'send_info' : 
                actionData.action === 'notes' ? 'notes' : 
                actionData.action === 'times' ? 'working_times' :
                actionData.action === 'status' ? 'manage_status' :
                actionData.action === 'details' ? 'show_details' :
                actionData.action === 'delete' ? 'delete' :
                actionData.action === 'archive' ? 'archive' :
                actionData.action === 'print' ? 'generate_page' : ''}"]`);
            
            if (originalLink) {
                const menuItem = document.createElement('a');
                menuItem.className = `eoz-dropdown-item ${actionData.class}`;
                menuItem.href = originalLink.href;
                menuItem.target = originalLink.target;
                menuItem.setAttribute('data-action', actionData.action);
                menuItem.innerHTML = `<i class="fas ${actionData.icon}"></i> ${actionData.text}`;
                
                // Preserve original click handlers
                if (originalLink.onclick) {
                    menuItem.onclick = originalLink.onclick;
                }
                
                menu.appendChild(menuItem);
            }
        });
        
        // Add elements in correct order for CSS sibling selector
        container.appendChild(checkbox);
        container.appendChild(label);
        container.appendChild(menu);
        
        // Close dropdown when clicking menu item (uncheck checkbox)
        menu.addEventListener('click', () => {
            checkbox.checked = false;
        });
        
        return container;
    }

    // Transform action buttons to dropdown
    function transformActionButtons() {
        const actionCells = document.querySelectorAll('td.body-cell.body-options-cell');
        
        actionCells.forEach((cell, index) => {
            // Store original content before clearing
            const originalContent = cell.innerHTML;
            
            // Clear existing content
            cell.innerHTML = '';
            
            // Restore original links temporarily for createDropdownMenu to find them
            cell.innerHTML = originalContent;
            
            // Create dropdown with unique index
            const dropdown = createDropdownMenu(cell, index);
            
            // Now clear and add dropdown
            cell.innerHTML = '';
            cell.appendChild(dropdown);
        });
    }

    // Main initialization function
    function initialize() {
        console.log('eOZ UI Improvements: Initializing...');
        
        // Wait for table to be fully loaded
        const checkTable = setInterval(() => {
            const table = document.querySelector('table.dynamic-table');
            if (table && table.querySelector('tbody tr.body-row')) {
                clearInterval(checkTable);
                
                console.log('eOZ UI Improvements: Table found, applying improvements...');
                
                // Apply all improvements
                hideColumns();
                formatDates();
                transformActionButtons();
                
                console.log('eOZ UI Improvements: Applied successfully!');
            }
        }, 100);
        
        // Clear interval after 10 seconds to prevent infinite checking
        setTimeout(() => {
            clearInterval(checkTable);
        }, 10000);
    }

    // Start the script
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            injectStyles();
            initialize();
        });
    } else {
        injectStyles();
        initialize();
    }

})();
