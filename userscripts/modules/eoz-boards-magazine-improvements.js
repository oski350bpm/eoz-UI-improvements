// EOZ Boards/Veneers Magazine Improvements Module
// Applies on /machines/control_panel_boards_magazine_2020 and control_panel_veneers_magazine_2020

(function() {
    'use strict';

    var VERSION = '2.4.3';
    
    // Expose version to global EOZ object
    if (!window.EOZ) window.EOZ = {};
    if (!window.EOZ.BoardsMagazine) window.EOZ.BoardsMagazine = {};
    window.EOZ.BoardsMagazine.VERSION = VERSION;

    if (!window.EOZ) {
        console.warn('[EOZ Boards Magazine Module] Core not available');
        return;
    }

    var url = window.location.href;
    if (url.indexOf('control_panel_boards_magazine_2020') === -1 && url.indexOf('control_panel_veneers_magazine_2020') === -1) {
        return; // not this page
    }

    var styles = '' +
        'table{width:100%!important;table-layout:auto!important}\n' +
        'table thead th, table tbody td{white-space:normal!important;word-break:break-word!important;overflow-wrap:anywhere!important}\n' +
        'table thead th, table tbody td{padding:6px 8px!important;font-size:13px!important}\n' +
        'body:not([data-veneer]) #btn-zestawienie-materialow, body:not([data-veneer]) #btn-zestawienie-zlecen-historia{display:none!important}\n' +
        'body[data-veneer] #btn-zestawienie-zlecen-podsumowanie{display:none!important}\n' +
        '.select2-container{width:100%!important}\n' +
        '.eoz-dropdown-toggle{display:none}\n' +
        '.eoz-dropdown-label{width:100%!important;height:48px!important;background:#007bff!important;color:#fff!important;border:none!important;border-radius:8px!important;font-size:14px!important;font-weight:bold!important;cursor:pointer!important;display:flex!important;align-items:center!important;justify-content:center!important;gap:8px!important;transition:background-color .2s!important;padding:10px!important;box-shadow:0 2px 4px rgba(0,0,0,.1)!important;user-select:none!important}\n' +
        '.eoz-dropdown-label:hover{background:#0056b3!important}\n' +
        '.eoz-dropdown-label:active{background:#004085!important;transform:translateY(1px)!important}\n' +
        '.eoz-dropdown-menu{position:absolute!important;top:100%!important;right:0!important;left:auto!important;min-width:220px!important;max-width:300px!important;background:#fff!important;border:1px solid #ddd!important;border-radius:8px!important;box-shadow:0 4px 12px rgba(0,0,0,.15)!important;z-index:1000!important;display:none!important;flex-direction:column!important;overflow:hidden!important;margin-top:4px!important}\n' +
        '.eoz-dropdown-toggle:checked + .eoz-dropdown-label + .eoz-dropdown-menu{display:flex!important}\n' +
        '.eoz-dropdown-toggle:checked + .eoz-dropdown-label{background:#0056b3!important}\n' +
        '.eoz-dropdown-item{display:flex!important;align-items:center!important;gap:10px!important;padding:14px!important;text-decoration:none!important;color:#333!important;border-bottom:1px solid #eee!important;transition:background-color .2s!important;min-height:44px!important;font-size:14px!important}\n' +
        '.eoz-dropdown-item:last-child{border-bottom:none!important}\n' +
        '.eoz-dropdown-item:hover{background:#f8f9fa!important}\n' +
        '.eoz-dropdown-item i{font-size:18px!important;width:20px!important;text-align:center!important}\n' +
        '.eoz-dropdown-container{position:relative!important;width:100%!important}\n' +
        '.switch-field .btn-group-toggle,label.switch-field-label{display:inline-flex!important}\n' +
        '.switch-field label{background:#e4e4e4!important;color:rgba(0,0,0,.6)!important;font-size:14px!important;line-height:1!important;text-align:center!important;padding:8px 16px!important;margin-right:-1px!important;border:1px solid rgba(0,0,0,.2)!important;box-shadow:inset 0 1px 3px rgba(0,0,0,.3)!important,0 1px rgba(255,255,255,.1)!important;transition:all .2s ease-in-out!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;min-width:60px!important}\n' +
        '.switch-field label:first-of-type{border-radius:4px 0 0 4px!important}\n' +
        '.switch-field label:last-of-type{border-radius:0 4px 4px 0!important}\n' +
        '.switch-field input[type="radio"]:checked+label{background:#f06521!important;color:#fff!important;border:1px solid #f06521!important;box-shadow:none!important;font-weight:600!important}\n' +
        '@media (max-width:1200px){.eoz-hide-1200{display:none!important}}\n' +
        '@media (max-width:1024px){.eoz-hide-1024{display:none!important}}\n' +
        'body[data-veneer] table thead th[data-column="lp"],body[data-veneer] table tbody td[data-column="lp"]{display:none!important}\n' +
        'body[data-veneer] table thead th[data-column="data"],body[data-veneer] table tbody td[data-column="data"]{display:none!important}\n' +
        'body[data-veneer] .switch-field label{cursor:pointer!important}\n' +
        '@media (min-width:961px){\n' +
        '  table tbody tr td.eoz-mobile-cell{display:none!important}\n' +
        '  .switch-field input[type="radio"]:checked+label{background:#f06521!important;box-shadow:inset 0 0 0 9999px #f06521!important;color:#fff!important;font-weight:bold!important}\n' +
        '  table tbody td .switch-field input[type="radio"]:checked+label{background:#f06521!important;box-shadow:inset 0 0 0 9999px #f06521!important;color:#fff!important;font-weight:bold!important}\n' +
        '}\n' +
        '@media (max-width:960px){\n' +
        '  table thead{display:none!important}\n' +
        '  table tbody tr td:not(.eoz-mobile-cell):not([colspan]){display:none!important}\n' +
        '  table tbody tr td.eoz-mobile-cell{display:table-cell!important;padding:8px!important}\n' +
        '  table tbody tr td[colspan]{display:table-cell!important;padding:8px!important;background:#f8f9fa!important;border-top:1px solid #dee2e6!important}\n' +
        '  table.table.table-borderd.table-condensed.table-md thead{display:none!important}\n' +
        '  table.table.table-borderd.table-condensed.table-md tbody tr.eoz-comment-row-1 td{display:table-cell!important;padding:8px!important;border:1px solid #dee2e6!important}\n' +
        '  table.table.table-borderd.table-condensed.table-md tbody tr.eoz-comment-row-1 td.eoz-comment-data{width:50%!important;font-weight:bold!important;color:#333!important}\n' +
        '  table.table.table-borderd.table-condensed.table-md tbody tr.eoz-comment-row-1 td.eoz-comment-author{width:50%!important;font-weight:bold!important;color:#666!important;text-align:right!important}\n' +
        '  table.table.table-borderd.table-condensed.table-md tbody tr.eoz-comment-row-2 td{display:table-cell!important;width:100%!important;padding:8px!important;border:1px solid #dee2e6!important;background:#f8f9fa!important}\n' +
        '  table.table.table-borderd.table-condensed.table-md tbody tr.eoz-comment-row-2 td.eoz-comment-title{font-style:italic!important;color:#555!important}\n' +
        '  table.table.table-borderd.table-condensed.table-md tbody tr td[colspan="3"]{display:table-cell!important;width:100%!important;padding:8px!important;border:1px solid #dee2e6!important;background:#fff!important}\n' +
        '  .eoz-mobile-grid{display:grid;grid-template-columns:1fr;gap:8px;align-items:start}\n' +
        '  .eoz-m-header{display:flex;flex-direction:column;gap:4px;margin-bottom:8px;padding-bottom:8px;border-bottom:1px solid #e0e0e0}\n' +
        '  .eoz-m-lp{font-size:12px;color:#666}\n' +
        '  .eoz-m-zlecenie{font-size:16px;font-weight:bold}\n' +
        '  .eoz-m-details{display:grid;grid-template-columns:1fr 100px 140px;gap:8px}\n' +
        '  .eoz-m-col1{display:flex;align-items:flex-start;justify-content:center;font-weight:bold}\n' +
        '  .eoz-m-col2{font-weight:bold}\n' +
        '  .eoz-m-col3 div,.eoz-m-col4 div,.eoz-m-col5 div{margin-bottom:6px;font-size:13px}\n' +
        '  .eoz-m-label{color:#666;margin-right:4px}\n' +
        '  .eoz-m-notes-wrapper{display:flex;flex-direction:column;gap:8px}\n' +
        '  .eoz-m-note-btn{display:flex;align-items:center;justify-content:center;gap:8px;padding:10px 16px;background:#fff!important;border:2px solid #007bff!important;border-radius:8px;color:#007bff!important;text-decoration:none!important;font-size:14px;font-weight:600;transition:all .2s;min-height:44px}\n' +
        '  .eoz-m-note-btn:hover{background:#f0f7ff!important;border-color:#0056b3!important}\n' +
        '  .eoz-m-note-btn i{font-size:20px;margin:0}\n' +
        '  .eoz-m-col5-actions{margin-top:8px}\n' +
        '  .switch-field input[type="radio"]:checked+label.tippy{background:#f06521!important;box-shadow:inset 0 0 0 9999px #f06521!important;color:#fff!important;font-weight:bold!important}\n' +
        '  table tbody td .switch-field input[type="radio"]:checked+label{background:#f06521!important;box-shadow:inset 0 0 0 9999px #f06521!important;color:#fff!important;font-weight:bold!important}\n' +
        '  .eoz-mobile-cell .switch-field input[type="radio"]:checked+label{background:#f06521!important;box-shadow:inset 0 0 0 9999px #f06521!important;color:#fff!important;font-weight:bold!important}\n' +
        '}\n' +
        '@media (min-width:501px) and (max-width:960px){\n' +
        '  .eoz-m-header{display:none}\n' +
        '  .eoz-m-details{grid-template-columns:90px 1fr 140px;grid-template-rows:auto auto}\n' +
        '  .eoz-m-col2{grid-column:1;grid-row:1;font-weight:bold;color:#007bff}\n' +
        '  .eoz-m-col3{grid-column:2;grid-row:1}\n' +
        '  .eoz-m-col4{grid-column:3;grid-row:1;display:flex;flex-direction:column;gap:8px}\n' +
        '  .eoz-m-col5{grid-column:1 / 4;grid-row:2;display:grid;grid-template-columns:repeat(3, 1fr);gap:8px}\n' +
        '}\n' +
        '@media (max-width:500px){\n' +
        '  .eoz-m-details{grid-template-columns:1fr;grid-template-rows:auto auto auto}\n' +
        '  .eoz-m-col3{order:1}\n' +
        '  .eoz-m-col4{order:2;display:flex;flex-direction:column;gap:8px}\n' +
        '  .eoz-m-col5{order:3}\n' +
        '}\n';

    window.EOZ.injectStyles(styles, { id: 'eoz-boards-magazine-module-css' });

    function run() {
        window.EOZ.waitFor('table tbody tr', { timeout: 10000 })
            .then(apply)
            .catch(function(){ console.warn('[EOZ Boards Magazine Module v' + VERSION + '] Table not found'); });
    }

    function findHeaderIndex(headerText) {
        var headers = document.querySelectorAll('table thead th');
        for (var i=0;i<headers.length;i++){
            if ((headers[i].textContent||'').trim() === headerText) return i;
        }
        return -1;
    }

    function hideColumnByIndex(idx, cls){
        if (idx < 0) return;
        var headers = document.querySelectorAll('table thead th');
        if (headers[idx]) headers[idx].classList.add(cls);
        var rows = document.querySelectorAll('table tbody tr');
        rows.forEach(function(row){ var tds = row.querySelectorAll('td'); if (tds[idx]) tds[idx].classList.add(cls); });
    }

    function tagColumnByHeader(headerText, className){
        if (!headerText || !className) return;
        var headers = Array.from(document.querySelectorAll('table thead th'));
        headers.forEach(function(th, index){
            if ((th.textContent || '').trim().toLowerCase() === headerText.toLowerCase()){
                th.classList.add(className);
                var rows = document.querySelectorAll('table tbody tr');
                rows.forEach(function(row){
                    var cells = row.querySelectorAll('td');
                    if (cells[index]) cells[index].classList.add(className);
                });
            }
        });
    }

    function applyCommentsTableFormatting() {
        var commentsTable = document.querySelector('table.table.table-borderd.table-condensed.table-md');
        console.log('[EOZ Boards Magazine Module] Looking for comments table:', commentsTable);
        
        if (!commentsTable) {
            console.log('[EOZ Boards Magazine Module] Comments table not found');
            return;
        }
        
        var tbody = commentsTable.querySelector('tbody');
        if (!tbody) return;
        
        var rows = Array.from(tbody.querySelectorAll('tr'));
        console.log('[EOZ Boards Magazine Module] Found', rows.length, 'rows in comments table');
        
        // Create new rows array to replace existing tbody content
        var newRows = [];
        
        rows.forEach(function(row, index) {
            var cells = row.querySelectorAll('td');
            console.log('[EOZ Boards Magazine Module] Row', index, 'has', cells.length, 'cells');
            
            if (cells.length === 3) {
                // This is a data row (Data dodania, Tytuł, Dodał)
                var dataText = cells[0].innerHTML; // Data dodania (preserve HTML like <b>)
                var titleText = cells[1].textContent.trim(); // Tytuł
                var authorText = cells[2].textContent.trim(); // Dodał
                
                console.log('[EOZ Boards Magazine Module] Processing row', index, ':', 
                    cells[0].textContent.trim(), '|', titleText, '|', authorText);
                
                // Create first row: Data | Autor
                var row1 = document.createElement('tr');
                row1.className = 'eoz-comment-row-1';
                
                var dataCell = document.createElement('td');
                dataCell.className = 'eoz-comment-data';
                dataCell.innerHTML = dataText;
                
                var authorCell = document.createElement('td');
                authorCell.className = 'eoz-comment-author';
                authorCell.textContent = authorText;
                
                row1.appendChild(dataCell);
                row1.appendChild(authorCell);
                
                // Create second row: Tytuł with colspan
                var row2 = document.createElement('tr');
                row2.className = 'eoz-comment-row-2';
                
                var titleCell = document.createElement('td');
                titleCell.className = 'eoz-comment-title';
                titleCell.setAttribute('colspan', '2');
                titleCell.innerHTML = '<strong>Tytuł:</strong> ' + titleText;
                
                row2.appendChild(titleCell);
                
                newRows.push(row1);
                newRows.push(row2);
            } else if (cells.length === 1 && cells[0].hasAttribute('colspan')) {
                // This is a content row with colspan (keep as is)
                newRows.push(row.cloneNode(true));
            }
        });
        
        // Replace tbody content with new rows
        tbody.innerHTML = '';
        newRows.forEach(function(row) {
            tbody.appendChild(row);
        });
        
        console.log('[EOZ Boards Magazine Module] Comments table formatting applied -', newRows.length, 'new rows created');
    }

    function fixButtonText() {
        // Fix "nie wydanych" to "niewydanych" in button text (boards)
        var button = document.querySelector('#btn-zestawienie-zlecen-niewykonanych');
        if (button) {
            var originalText = button.textContent;
            button.textContent = originalText.replace('nie wydanych', 'niewydanych');
            console.log('[EOZ Boards Magazine Module] Fixed button text:', originalText, '->', button.textContent);
        }
        
        // Fix "nie wydanych" to "niewydanych" in veneers
        var veneersButton = document.querySelector('#btn-zestawienie-zlecen-historia');
        if (veneersButton) {
            var originalText = veneersButton.textContent;
            veneersButton.textContent = originalText.replace('nie wydanych', 'niewydanych');
            console.log('[EOZ Boards Magazine Module] Fixed veneers button text:', originalText, '->', veneersButton.textContent);
        }
    }

    function normalizeRadioButtons(root){
        // No longer needed - CSS handles everything automatically
        // Keeping function for compatibility but making it a no-op
    }

    function updateAllRadioGroups(){
        // No longer needed - CSS handles everything automatically
        // Keeping function for compatibility but making it a no-op
    }

    function updateRadioGroupVisualState(group){
        // No longer needed - CSS handles everything automatically
        // Keeping function for compatibility but making it a no-op
    }

    function updateRadioVisualState(event){
        // No longer needed - CSS handles everything automatically
        // Keeping function for compatibility but making it a no-op
    }

    function observeRadioMutations(){
        // No longer needed - CSS handles everything automatically
        // Keeping function for compatibility but making it a no-op
    }

    // Debounce utility
    function eozDebounce(fn, wait){
        var timeoutId;
        return function(){
            clearTimeout(timeoutId);
            var args = arguments;
            timeoutId = setTimeout(function(){ fn.apply(null, args); }, wait);
        };
    }

    function installGlobalRadioSync(){
        // No longer needed - CSS handles everything automatically
        // Keeping function for compatibility but making it a no-op
    }

    function apply() {
        // Set data attribute to distinguish veneers from boards
        var isVeneers = window.location.href.indexOf('control_panel_veneers_magazine_2020') !== -1;
        var isVeneersGrouped = isVeneers && window.location.href.indexOf('/3') !== -1;
        
        if (isVeneers) {
            document.body.setAttribute('data-veneer', 'true');
        }
        
        // Apply special formatting for comments table
        applyCommentsTableFormatting();
        
        // Fix button text grammar
        fixButtonText();
        
        // Skip header and row modifications for veneers /3 (grouped view)
        if (!isVeneersGrouped) {
            // Change first header to Lp.
            var headerRow = document.querySelector('table thead tr');
            if (headerRow) {
                var firstHeaderCell = headerRow.querySelector('th:first-child');
                if (firstHeaderCell) {
                    firstHeaderCell.textContent = 'Lp.';
                    var link = firstHeaderCell.querySelector('a');
                    if (link) link.remove();
                }
            }

            // Try hide 5th column (Lp 1/1)
            var allHeaders = document.querySelectorAll('table thead tr th');
            var lpColumnIndex = -1;
            allHeaders.forEach(function(th, index){ if (th.textContent.trim() === 'Lp' && index > 0) lpColumnIndex = index; });
            if (lpColumnIndex !== -1) {
                if (allHeaders[lpColumnIndex]) allHeaders[lpColumnIndex].style.display = 'none';
                var rows = document.querySelectorAll('table tbody tr');
                rows.forEach(function(row){ var cells = row.querySelectorAll('td'); if (cells[lpColumnIndex]) cells[lpColumnIndex].style.display = 'none'; });
            }

            // Row numbers
            var bodyRows = document.querySelectorAll('table tbody tr');
            bodyRows.forEach(function(row, index){ var firstCell = row.querySelector('td:first-child'); if (firstCell) { firstCell.textContent = (index + 1).toString(); firstCell.style.fontWeight = 'bold'; firstCell.style.textAlign = 'center'; } });
        }

        // Build dropdowns first so we can reuse them in mobile grid
        transformActionButtons();
        
        // Build mobile grid cell per row
        if (isVeneersGrouped) {
            buildMobileLayoutVeneersGrouped();
        } else {
            buildMobileLayout();
        }

        if (isVeneers) {
            tagColumnByHeader('Data', 'time-slot');
            tagColumnByHeader('Lp', 'lp-desktop');
        }

        normalizeRadioButtons();
        observeRadioMutations();
        installGlobalRadioSync();

        console.log('[EOZ Boards Magazine Module v' + VERSION + '] Applied');
        
        // Watch for dynamically loaded comments tables
        watchForCommentsTable();
    }
    
    function watchForCommentsTable() {
        // Use MutationObserver to watch for dynamically added tables
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(function(node) {
                        if (node.nodeType === 1) { // Element node
                            // Check if the added node or its children contain our target table
                            var commentsTable = node.querySelector ? 
                                node.querySelector('table.table.table-borderd.table-condensed.table-md') : null;
                            
                            if (commentsTable || (node.tagName === 'TABLE' && 
                                node.classList.contains('table') && 
                                node.classList.contains('table-borderd') && 
                                node.classList.contains('table-condensed') && 
                                node.classList.contains('table-md'))) {
                                
                                console.log('[EOZ Boards Magazine Module] Comments table detected dynamically, applying formatting');
                                setTimeout(applyCommentsTableFormatting, 100); // Small delay to ensure DOM is ready
                            }
                        }
                    });
                }
            });
        });
        
        // Start observing
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        console.log('[EOZ Boards Magazine Module] Started watching for dynamic comments tables');
    }

    var ICON_LABELS = {
        'fa-search': 'Szczegóły',
        'fa-print': 'Drukuj',
        'fa-cog': 'Zarządzaj statusem',
        'fa-save': 'Archiwizuj',
        'fa-trash': 'Usuń',
        'fa-trash-alt': 'Usuń',
        'fa-file-export': 'Eksport'
    };

    function labelFromLink(link){
        var text = (link.textContent||'').trim();
        if (text) return text;
        var icon = link.querySelector('i');
        if (icon){
            var cls = icon.className;
            for (var key in ICON_LABELS){ if (cls.indexOf(key) !== -1) return ICON_LABELS[key]; }
        }
        var href = link.getAttribute('href') || '';
        if (href.indexOf('show_details') !== -1) return 'Szczegóły';
        if (href.indexOf('generate_page') !== -1) return 'Drukuj';
        if (href.indexOf('manage_status') !== -1) return 'Zarządzaj statusem';
        if (href.indexOf('archive') !== -1) return 'Archiwizuj';
        if (href.indexOf('delete') !== -1) return 'Usuń';
        return 'Akcja';
    }

    function createDropdownMenu(actionsCell, rowIndex) {
        var container = document.createElement('div');
        container.className = 'eoz-dropdown-container';
        var checkboxId = 'eoz-dropdown-mag-' + rowIndex;
        var checkbox = document.createElement('input'); checkbox.type = 'checkbox'; checkbox.className = 'eoz-dropdown-toggle'; checkbox.id = checkboxId;
        var label = document.createElement('label'); label.className = 'eoz-dropdown-label'; label.htmlFor = checkboxId; label.innerHTML = '<i class="fas fa-cog"></i> Akcje';
        var menu = document.createElement('div'); menu.className = 'eoz-dropdown-menu';

        var links = actionsCell.querySelectorAll('a');
        links.forEach(function(link){
            var menuItem = document.createElement('a');
            menuItem.className = 'eoz-dropdown-item';
            menuItem.href = link.href; if (link.target) menuItem.target = link.target;
            var icon = link.querySelector('i');
            var titleText = labelFromLink(link);
            menuItem.innerHTML = '<i class="' + (icon ? icon.className : '') + '"></i> ' + titleText;
            menuItem.title = titleText;
            if (link.onclick) menuItem.onclick = link.onclick;
            menu.appendChild(menuItem);
        });

        container.appendChild(checkbox); container.appendChild(label); container.appendChild(menu);
        menu.addEventListener('click', function(){ checkbox.checked = false; });
        return container;
    }

    function transformActionButtons() {
        var actionCells = document.querySelectorAll('table tbody tr td:last-child');
        actionCells.forEach(function(cell, index){
            if (cell.querySelectorAll('a').length === 0) return;
            var original = cell.innerHTML; cell.innerHTML = ''; cell.innerHTML = original;
            var dropdown = createDropdownMenu(cell, index); cell.innerHTML = ''; cell.appendChild(dropdown);
        });
    }

    function buildMobileLayoutVeneersGrouped(){
        console.log('[EOZ Boards Magazine Module] Building mobile layout for veneers grouped view (/3)');
        console.log('[EOZ Boards Magazine Module] DEBUG: Starting buildMobileLayoutVeneersGrouped');
        
        var allHeaders = document.querySelectorAll('table thead th');
        var headerNames = [];
        allHeaders.forEach(function(th){ headerNames.push((th.textContent||'').trim()); });
        console.log('[EOZ Boards Magazine Module] Headers found:', headerNames.join(', '));
        
        // Header indices for veneers /3: Data | Klient | Zlecenie | Okleina | Wymiar | Ilość | Przygotowane | Opis | Uwagi | Opcje
        var idxData = findHeaderIndex('Data');
        var idxKlient = findHeaderIndex('Klient');
        var idxZlecenie = findHeaderIndex('Zlecenie');
        var idxOkleina = findHeaderIndex('Okleina');
        var idxWymiar = findHeaderIndex('Wymiar');
        var idxIlosc = findHeaderIndex('Ilość');
        var idxPrzygot = findHeaderIndex('Przygotowane');
        var idxOpis = findHeaderIndex('Opis');
        var idxUwagi = findHeaderIndex('Uwagi');
        
        console.log('[EOZ Boards Magazine Module] DEBUG: Column indices:', {
            idxData, idxKlient, idxZlecenie, idxOkleina, idxWymiar, idxIlosc, idxPrzygot, idxOpis, idxUwagi
        });
        
        var rows = document.querySelectorAll('table tbody tr');
        var orderCount = 0;
        
        console.log('[EOZ Boards Magazine Module] DEBUG: Found', rows.length, 'rows');
        
        if (rows.length === 0) {
            console.log('[EOZ Boards Magazine Module] DEBUG: No rows found! Table may not be loaded yet.');
            return;
        }
        
        rows.forEach(function(row, rIndex){
            if (row.querySelector('td.eoz-mobile-cell')) return; // already built
            var cells = row.querySelectorAll('td');
            if (!cells || cells.length === 0) return;
            
            console.log('[EOZ Boards Magazine Module] DEBUG: Processing row', rIndex, 'with', cells.length, 'cells');
            
            // Skip grouping rows (date headers with colspan)
            var firstCell = row.querySelector('th[colspan], td[colspan]');
            if (firstCell && parseInt(firstCell.getAttribute('colspan')) > 1) {
                console.log('[EOZ Boards Magazine Module] Skipping grouping header row', rIndex);
                return;
            }
            
            // Detect main row (with rowspan) vs sub-row (additional veneers)
            var hasRowspan = false;
            cells.forEach(function(cell){
                if (cell.hasAttribute('rowspan')) hasRowspan = true;
            });
            
            if (!hasRowspan) {
                // This is a sub-row (additional veneer) - skip it, we'll handle it with the main row
                console.log('[EOZ Boards Magazine Module] Skipping sub-row', rIndex);
                return;
            }
            
            // This is a main row - collect all veneers for this order
            orderCount++;
            
            console.log('[EOZ Boards Magazine Module] DEBUG: Processing main row', rIndex, 'orderCount:', orderCount);
            
            var data = orderCount.toString();
            console.log('[EOZ Boards Magazine Module] DEBUG: data (LP) =', data);
            
            var klient = cells[idxKlient] ? (cells[idxKlient].textContent||'').trim() : '';
            console.log('[EOZ Boards Magazine Module] DEBUG: klient =', klient);
            
            var zlecenieLink = '';
            var zlecenie = '';
            var zlecenieCell = cells[idxZlecenie];
            if (zlecenieCell) {
                var link = zlecenieCell.querySelector('a');
                if (link) {
                    zlecenieLink = link.href;
                    zlecenie = (link.textContent||'').trim();
                } else {
                    zlecenie = (zlecenieCell.textContent||'').trim();
                }
            }
            
            
            // Collect veneers from this row and following sub-rows
            var veneers = [];
            
            // First veneer from main row
            var veneer1 = {
                okleina: cells[idxOkleina] ? (cells[idxOkleina].textContent||'').trim() : '',
                wymiar: cells[idxWymiar] ? (cells[idxWymiar].textContent||'').trim() : '',
                ilosc: cells[idxIlosc] ? (cells[idxIlosc].textContent||'').trim() : '',
                przygotowane: cells[idxPrzygot] ? cells[idxPrzygot].innerHTML : ''
            };
            veneers.push(veneer1);
            
            // Check next rows for additional veneers (sub-rows)
            var nextRowIndex = rIndex + 1;
            while (nextRowIndex < rows.length) {
                var nextRow = rows[nextRowIndex];
                var nextCells = nextRow.querySelectorAll('td');
                
                // Check if this is a sub-row (no rowspan, only 4 cells)
                var hasRowspanNext = false;
                nextCells.forEach(function(cell){
                    if (cell.hasAttribute('rowspan')) hasRowspanNext = true;
                });
                
                if (hasRowspanNext || nextCells.length < 4) {
                    // This is a new main row or grouping header, stop collecting
                    break;
                }
                
                // This is a sub-row - cells are: Okleina | Wymiar | Ilość | Przygotowane
                var veneerSub = {
                    okleina: nextCells[0] ? (nextCells[0].textContent||'').trim() : '',
                    wymiar: nextCells[1] ? (nextCells[1].textContent||'').trim() : '',
                    ilosc: nextCells[2] ? (nextCells[2].textContent||'').trim() : '',
                    przygotowane: nextCells[3] ? nextCells[3].innerHTML : ''
                };
                veneers.push(veneerSub);
                nextRowIndex++;
            }
            
            // Get Opis, Uwagi, Opcje from main row
            var opisOriginalLink = null;
            var opisCell = cells[idxOpis];
            if (opisCell) {
                var linkEl = opisCell.querySelector('a');
                if (linkEl) {
                    opisOriginalLink = linkEl.cloneNode(true);
                }
            }
            
            var uwagiOriginalLink = null;
            var uwagiCell = cells[idxUwagi];
            if (uwagiCell) {
                var linkEl2 = uwagiCell.querySelector('a');
                if (linkEl2) {
                    uwagiOriginalLink = linkEl2.cloneNode(true);
                }
            }
            
            // Build mobile cell
            var mobileCell = document.createElement('td');
            mobileCell.className = 'eoz-mobile-cell';
            mobileCell.colSpan = cells.length;

            var grid = document.createElement('div');
            grid.className = 'eoz-mobile-grid';

            // Header: Data + Zlecenie
            var header = document.createElement('div');
            header.className = 'eoz-m-header';
            
            var dataDiv = document.createElement('div');
            dataDiv.className = 'eoz-m-lp';
            dataDiv.textContent = data;
            
            var zlecenieDiv = document.createElement('div');
            zlecenieDiv.className = 'eoz-m-zlecenie';
            if (zlecenieLink) {
                var linkEl = document.createElement('a');
                linkEl.href = zlecenieLink;
                linkEl.textContent = zlecenie;
                linkEl.style.color = '#007bff';
                linkEl.style.textDecoration = 'none';
                zlecenieDiv.appendChild(linkEl);
            } else {
                zlecenieDiv.textContent = zlecenie;
            }
            
            header.appendChild(dataDiv);
            header.appendChild(zlecenieDiv);
            
            // Details
            var details = document.createElement('div');
            details.className = 'eoz-m-details';

            var col2 = document.createElement('div'); 
            col2.className = 'eoz-m-col2';
            if (zlecenieLink) {
                var linkEl = document.createElement('a');
                linkEl.href = zlecenieLink;
                linkEl.textContent = zlecenie;
                linkEl.style.color = '#007bff';
                linkEl.style.textDecoration = 'none';
                col2.appendChild(linkEl);
            } else {
                col2.textContent = zlecenie;
            }

            var col3 = document.createElement('div'); 
            col3.className = 'eoz-m-col3';
            col3.innerHTML = '<div><span class="eoz-m-label">Klient:</span><br>' + (klient||'—') + '</div>';

            var col4 = document.createElement('div'); 
            col4.className = 'eoz-m-col4';
            
            // Veneers list
            var veneersDiv = document.createElement('div');
            veneersDiv.innerHTML = '<span class="eoz-m-label">Okleiny:</span>';
            
            veneers.forEach(function(veneer, idx){
                var veneerItem = document.createElement('div');
                veneerItem.style.marginTop = idx > 0 ? '12px' : '8px';
                veneerItem.style.padding = '8px';
                veneerItem.style.background = '#f8f9fa';
                veneerItem.style.borderRadius = '4px';
                veneerItem.innerHTML = '<div style="font-weight: bold;">' + (veneer.okleina||'—') + '</div>' +
                                        '<div><span class="eoz-m-label">Wymiar:</span> ' + (veneer.wymiar||'—') + '</div>' +
                                        '<div><span class="eoz-m-label">Ilość:</span> ' + (veneer.ilosc||'—') + '</div>' +
                                        '<div style="margin-top: 4px;"><span class="eoz-m-label">Przygotowane:</span><br>' + veneer.przygotowane + '</div>';
                veneersDiv.appendChild(veneerItem);
            });
            
            col4.appendChild(veneersDiv);

            var col5 = document.createElement('div'); 
            col5.className = 'eoz-m-col5';
            
            // Actions dropdown
            var lastCell = cells[cells.length-1];
            if (lastCell) {
                var originalLinks = lastCell.querySelectorAll('a');
                if (originalLinks.length > 0) {
                    var actionsWrapper = document.createElement('div');
                    actionsWrapper.className = 'eoz-m-col5-item';
                    var actionsBtn = createActionDropdown(originalLinks, 'akcje-veneers-' + orderCount);
                    actionsWrapper.appendChild(actionsBtn);
                    col5.appendChild(actionsWrapper);
                }
            }
            
            // Opis button
            if (opisOriginalLink) {
                var opisWrapper = document.createElement('div');
                opisWrapper.className = 'eoz-m-col5-item';
                opisOriginalLink.classList.add('eoz-m-note-btn');
                var opisIcon = opisOriginalLink.querySelector('i');
                var iconHTML = opisIcon ? opisIcon.outerHTML : '<i class="fas fa-comment"></i>';
                opisOriginalLink.innerHTML = iconHTML + '<span>Opis</span>';
                opisWrapper.appendChild(opisOriginalLink);
                col5.appendChild(opisWrapper);
            }
            
            // Uwagi button
            if (uwagiOriginalLink) {
                var uwagiWrapper = document.createElement('div');
                uwagiWrapper.className = 'eoz-m-col5-item';
                uwagiOriginalLink.classList.add('eoz-m-note-btn');
                var uwagiIcon = uwagiOriginalLink.querySelector('i');
                var iconHTML2 = uwagiIcon ? uwagiIcon.outerHTML : '<i class="far fa-comments"></i>';
                uwagiOriginalLink.innerHTML = iconHTML2 + '<span>Uwagi</span>';
                uwagiWrapper.appendChild(uwagiOriginalLink);
                col5.appendChild(uwagiWrapper);
            }

            grid.appendChild(header);
            details.appendChild(col2);
            details.appendChild(col3);
            details.appendChild(col4);
            details.appendChild(col5);
            grid.appendChild(details);

            mobileCell.appendChild(grid);
            row.appendChild(mobileCell);
        });
        
        console.log('[EOZ Boards Magazine Module] Veneers grouped mobile layout built:', orderCount, 'orders');
        
        if (orderCount === 0) {
            console.log('[EOZ Boards Magazine Module] DEBUG: No orders processed! Check if rows have rowspan attributes.');
        }
    }

    function buildMobileLayout(){
        var allHeaders = document.querySelectorAll('table thead th');
        var headerNames = [];
        allHeaders.forEach(function(th){ headerNames.push((th.textContent||'').trim()); });
        console.log('[EOZ Boards Magazine Module] Headers found:', headerNames.join(', '));

        // Check if this is boards or veneers view
        var isVeneers = window.location.href.indexOf('control_panel_veneers_magazine_2020') !== -1;
        
        // Check if this is the /3 view (grouped by date in veneers)
        var isGroupedView = isVeneers && window.location.href.indexOf('/3') !== -1;
        
        var idxKlient = findHeaderIndex('Klient');
        var idxZlecenie = findHeaderIndex('Zlecenie');
        var idxNazwa = findHeaderIndex('Nazwa zamówienia');
        
        // In /3 view, data rows start from Zlecenie column (missing Data and Klient)
        var columnOffset = isGroupedView ? 2 : 0;
        
        var idxPlytaWymiar = -1;
        var idxNazwaOkleiny = -1;
        var idxWymiar = -1;
        
        if (isVeneers) {
            // Veneers has separate columns
            idxNazwaOkleiny = findHeaderIndex('Nazwa okleiny');
            idxWymiar = findHeaderIndex('Wymiar');
        } else {
            // Boards has combined column
            idxPlytaWymiar = findHeaderIndex('Płyta i wymiar');
        }
        
        var idxIlosc = findHeaderIndex('Ilość');
        var idxPrzygot = findHeaderIndex('Przygotowane');
        var idxOpis = isVeneers ? findHeaderIndex('Opis') : findHeaderIndex('Uwagi klienta');
        var idxUwagi = findHeaderIndex('Uwagi');
        
        var rows = document.querySelectorAll('table tbody tr');
        rows.forEach(function(row, rIndex){
            if (row.querySelector('td.eoz-mobile-cell')) return; // already built
            var cells = row.querySelectorAll('td');
            if (!cells || cells.length === 0) return;
            
            // Skip rows that only have a single cell with colspan (empty/separator rows)
            if (cells.length === 1) {
                if (cells[0].hasAttribute('colspan')) {
                    var colspanValue = parseInt(cells[0].getAttribute('colspan'));
                    if (colspanValue > 1) {
                        console.log('[EOZ Boards Magazine Module] Skipping separator row', rIndex);
                        return;
                    }
                }
                // Skip grouping rows (e.g., date headers in veneers /3 view)
                // These have only 1 cell without colspan
                console.log('[EOZ Boards Magazine Module] Skipping grouping row', rIndex, ':', (cells[0].textContent || '').trim());
                return;
            }

            var col1Lp = (rIndex + 1).toString();
            
            // Helper function to get cell with offset correction
            function getCell(headerIndex) {
                if (headerIndex < 0) return null;
                var actualIndex = headerIndex - columnOffset;
                return actualIndex >= 0 && actualIndex < cells.length ? cells[actualIndex] : null;
            }
            
            // Zlecenie: preserve original link
            var col2Zlec = '';
            var zlecenieLink = '';
            var zlecenieCell = getCell(idxZlecenie);
            if (zlecenieCell) {
                var link = zlecenieCell.querySelector('a');
                if (link) {
                    zlecenieLink = link.href;
                    col2Zlec = (link.textContent||'').trim();
                } else {
                    col2Zlec = (zlecenieCell.textContent||'').trim();
                }
            }
            
            var klientCell = getCell(idxKlient);
            var klient = klientCell ? (klientCell.textContent||'').trim() : '';
            var nazwaCell = getCell(idxNazwa);
            var nazwa = nazwaCell ? (nazwaCell.textContent||'').trim() : '';
            
            // Material and dimensions handling (different for boards vs veneers)
            var materialLabel = isVeneers ? 'Okleina' : 'Płyta';
            var plyta = '—';
            var wymiar = '—';
            
            if (isVeneers) {
                // Veneers: separate columns
                var nazwaOkleinyCell = getCell(idxNazwaOkleiny);
                if (nazwaOkleinyCell) {
                    plyta = (nazwaOkleinyCell.textContent||'').trim();
                }
                var wymiarCell = getCell(idxWymiar);
                if (wymiarCell) {
                    wymiar = (wymiarCell.textContent||'').trim();
                }
            } else {
                // Boards: combined column, split by newline
                var plytaWymiarCell = getCell(idxPlytaWymiar);
                if (plytaWymiarCell) {
                    var plytaWymiarText = (plytaWymiarCell.textContent||'').trim();
                    var lines = plytaWymiarText.split('\n');
                    if (lines.length >= 2) {
                        plyta = lines[0].trim();
                        wymiar = lines[1].trim();
                    } else if (lines.length === 1) {
                        plyta = lines[0].trim();
                    }
                }
            }
            
            var iloscCell = getCell(idxIlosc);
            var ilosc = iloscCell ? (iloscCell.textContent||'').trim() : '';
            
            // Przygotowane: keep original HTML with radio buttons and edit button
            var przygotowaneHTML = '';
            var przygotowaneCell = getCell(idxPrzygot);
            if (przygotowaneCell){
                przygotowaneHTML = przygotowaneCell.innerHTML;
            }
            
            // Clone original link elements for Uwagi klienta and Uwagi to preserve event handlers
            var opisOriginalLink = null;
            var opisCell = getCell(idxOpis);
            if (opisCell) {
                var linkEl = opisCell.querySelector('a');
                if (linkEl) {
                    opisOriginalLink = linkEl.cloneNode(true);
                }
            }
            
            var uwagiOriginalLink = null;
            var uwagiCell = getCell(idxUwagi);
            if (uwagiCell) {
                var linkEl2 = uwagiCell.querySelector('a');
                if (linkEl2) {
                    uwagiOriginalLink = linkEl2.cloneNode(true);
                }
            }

            var mobileCell = document.createElement('td');
            mobileCell.className = 'eoz-mobile-cell';
            mobileCell.colSpan = cells.length;

            var grid = document.createElement('div');
            grid.className = 'eoz-mobile-grid';

            // Header: Lp + Zlecenie in one column
            var header = document.createElement('div');
            header.className = 'eoz-m-header';
            
            var lpDiv = document.createElement('div');
            lpDiv.className = 'eoz-m-lp';
            lpDiv.textContent = 'Lp. ' + col1Lp;
            
            var zlecenieDiv = document.createElement('div');
            zlecenieDiv.className = 'eoz-m-zlecenie';
            if (zlecenieLink) {
                var link = document.createElement('a');
                link.href = zlecenieLink;
                link.textContent = col2Zlec;
                link.style.color = '#007bff';
                link.style.textDecoration = 'none';
                zlecenieDiv.appendChild(link);
            } else {
                zlecenieDiv.textContent = col2Zlec;
            }
            
            header.appendChild(lpDiv);
            header.appendChild(zlecenieDiv);
            
            // Details grid: col3, col4, col5
            var details = document.createElement('div');
            details.className = 'eoz-m-details';

            var col3 = document.createElement('div'); col3.className = 'eoz-m-col3';
            col3.innerHTML = '<div><span class="eoz-m-label">Klient:</span><br>' + (klient||'—') + '</div>' +
                              '<div><span class="eoz-m-label">Nazwa zamówienia:</span><br>' + (nazwa||'—') + '</div>' +
                              '<div><span class="eoz-m-label">' + materialLabel + ':</span><br>' + (plyta||'—') + '</div>' +
                              '<div><span class="eoz-m-label">Wymiar:</span><br>' + (wymiar||'—') + '</div>';

            // Extract edit button and clean HTML from Przygotowane cell
            var editButton = null;
            var cleanPrzygotowaneHTML = przygotowaneHTML;
            
            if (przygotowaneCell){
                // Find the original edit button in the original cell (to preserve event handlers)
                var originalEditBtn = przygotowaneCell.querySelector('a.change-amount-manual');
                if (originalEditBtn) {
                    // Extract (move) the original button to preserve jQuery events
                    editButton = originalEditBtn;
                    originalEditBtn.remove(); // Remove from original location
                }
                
                // Get cleaned HTML without edit button
                cleanPrzygotowaneHTML = przygotowaneCell.innerHTML;
            }
            
            var col4 = document.createElement('div'); 
            col4.className = 'eoz-m-col4';
            
            // Row 1: Ilość
            var iloscRow = document.createElement('div');
            iloscRow.innerHTML = '<span class="eoz-m-label">Ilość:</span><br>' + (ilosc||'—');
            col4.appendChild(iloscRow);
            
            // Row 2: Przygotowane (radio buttons)
            var przygotowaneRow = document.createElement('div');
            przygotowaneRow.style.marginTop = '8px';
            przygotowaneRow.innerHTML = '<span class="eoz-m-label">Przygotowane:</span><br>' + cleanPrzygotowaneHTML;
            col4.appendChild(przygotowaneRow);
            
            // Row 3: Edit button with label
            if (editButton) {
                var editRow = document.createElement('div');
                editRow.style.marginTop = '8px';
                editRow.innerHTML = '<span class="eoz-m-label">Wprowadź dostępną ilość:</span>';
                
                var buttonWrapper = document.createElement('div');
                buttonWrapper.style.marginTop = '4px';
                buttonWrapper.appendChild(editButton);
                
                editRow.appendChild(document.createElement('br'));
                editRow.appendChild(buttonWrapper);
                col4.appendChild(editRow);
            }

            var col5 = document.createElement('div'); col5.className = 'eoz-m-col5';
            
            // 1. Actions dropdown (first)
            var lastCell = cells[cells.length-1];
            if (lastCell) {
                var originalLinks = lastCell.querySelectorAll('a');
                if (originalLinks.length > 0) {
                    var actionsWrapper = document.createElement('div');
                    actionsWrapper.className = 'eoz-m-col5-item';
                    var actionsBtn = createActionDropdown(originalLinks, 'akcje-' + rIndex);
                    actionsWrapper.appendChild(actionsBtn);
                    col5.appendChild(actionsWrapper);
                }
            }
            
            // 2. Uwagi klienta button (second) - use original cloned link
            if (opisOriginalLink) {
                var opisWrapper = document.createElement('div');
                opisWrapper.className = 'eoz-m-col5-item';
                
                // Add button styling classes while preserving original classes
                opisOriginalLink.classList.add('eoz-m-note-btn');
                
                // Get original icon
                var opisIcon = opisOriginalLink.querySelector('i');
                var iconHTML = opisIcon ? opisIcon.outerHTML : '<i class="fas fa-comment"></i>';
                
                // Add text label
                opisOriginalLink.innerHTML = iconHTML + '<span>Uwagi klienta</span>';
                
                opisWrapper.appendChild(opisOriginalLink);
                col5.appendChild(opisWrapper);
            }
            
            // 3. Uwagi button (third) - use original cloned link
            if (uwagiOriginalLink) {
                var uwagiWrapper = document.createElement('div');
                uwagiWrapper.className = 'eoz-m-col5-item';
                
                // Add button styling classes while preserving original classes
                uwagiOriginalLink.classList.add('eoz-m-note-btn');
                
                // Get original icon
                var uwagiIcon = uwagiOriginalLink.querySelector('i');
                var iconHTML2 = uwagiIcon ? uwagiIcon.outerHTML : '<i class="far fa-comments"></i>';
                
                // Add text label
                uwagiOriginalLink.innerHTML = iconHTML2 + '<span>Uwagi</span>';
                
                uwagiWrapper.appendChild(uwagiOriginalLink);
                col5.appendChild(uwagiWrapper);
            }

            // Prepare col1 and col2 for tablet view
            var col1 = document.createElement('div'); 
            col1.className = 'eoz-m-col1'; 
            col1.textContent = col1Lp;
            
            var col2 = document.createElement('div'); 
            col2.className = 'eoz-m-col2';
            if (zlecenieLink) {
                var link = document.createElement('a');
                link.href = zlecenieLink;
                link.textContent = col2Zlec;
                link.style.color = '#007bff';
                link.style.textDecoration = 'none';
                col2.appendChild(link);
            } else {
                col2.textContent = col2Zlec;
            }

            grid.appendChild(header);
            details.appendChild(col1);
            details.appendChild(col2);
            details.appendChild(col3);
            details.appendChild(col4);
            details.appendChild(col5);
            grid.appendChild(details);

            row.appendChild(mobileCell);
            mobileCell.appendChild(grid);
        });
    }
    
    function createActionDropdown(originalLinks, uniqueId){
        var container = document.createElement('div');
        container.className = 'eoz-dropdown-container';
        
        var checkboxId = 'eoz-dropdown-' + uniqueId;
        var checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'eoz-dropdown-toggle';
        checkbox.id = checkboxId;
        
        var btn = document.createElement('label');
        btn.className = 'eoz-dropdown-label';
        btn.htmlFor = checkboxId;
        btn.style.height = '40px';
        btn.style.fontSize = '13px';
        btn.innerHTML = '<i class="fas fa-cog"></i> Akcje';
        
        var menu = document.createElement('div');
        menu.className = 'eoz-dropdown-menu';
        
        originalLinks.forEach(function(link){
            var menuItem = document.createElement('a');
            menuItem.className = 'eoz-dropdown-item';
            menuItem.href = link.href;
            if (link.target) menuItem.target = link.target;
            
            var icon = link.querySelector('i');
            var titleText = labelFromLink(link);
            menuItem.innerHTML = '<i class="' + (icon ? icon.className : '') + '"></i> ' + titleText;
            menuItem.title = titleText;
            if (link.onclick) menuItem.onclick = link.onclick;
            menu.appendChild(menuItem);
        });
        
        container.appendChild(checkbox);
        container.appendChild(btn);
        container.appendChild(menu);
        
        menu.addEventListener('click', function(){ checkbox.checked = false; });
        return container;
    }

    if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', run, { once: true }); } else { run(); }
})();
