// EOZ Commission List Improvements Module
// Applies on /commission/show_list*

(function() {
    'use strict';

    var VERSION = '2.0.7';
    
    // Expose version to global EOZ object
    if (!window.EOZ) window.EOZ = {};
    if (!window.EOZ.CommissionList) window.EOZ.CommissionList = {};
    window.EOZ.CommissionList.VERSION = VERSION;

    if (!window.EOZ) {
        console.warn('[EOZ Commission List Module] Core not available');
        return;
    }

    if (window.location.href.indexOf('/commission/show_list') === -1) {
        return; // not this page
    }

    var styles = '' +
        '.eoz-hidden-column{display:none!important}\n' +
        '.eoz-dropdown-toggle{display:none}\n' +
        '.eoz-dropdown-label{width:100%!important;height:60px!important;background:#007bff!important;color:#fff!important;border:none!important;border-radius:8px!important;font-size:16px!important;font-weight:bold!important;cursor:pointer!important;display:flex!important;align-items:center!important;justify-content:center!important;gap:8px!important;transition:background-color .2s!important;padding:12px!important;box-shadow:0 2px 4px rgba(0,0,0,.1)!important;user-select:none!important}\n' +
        '.eoz-dropdown-label:hover{background:#0056b3!important}\n' +
        '.eoz-dropdown-label:active{background:#004085!important;transform:translateY(1px)!important}\n' +
        '.eoz-dropdown-menu{position:absolute!important;top:100%!important;right:0!important;left:auto!important;background:#fff!important;border:1px solid #ddd!important;border-radius:8px!important;box-shadow:0 4px 12px rgba(0,0,0,.15)!important;z-index:9999!important;display:none!important;flex-direction:column!important;overflow:hidden!important;margin-top:4px!important}\n' +
        '.eoz-dropdown-container.eoz-dropup .eoz-dropdown-menu{top:auto!important;bottom:100%!important;margin-top:0!important;margin-bottom:4px!important}\n' +
        '.eoz-dropdown-toggle:checked + .eoz-dropdown-label + .eoz-dropdown-menu{display:flex!important}\n' +
        '.eoz-dropdown-toggle:checked + .eoz-dropdown-label{background:#0056b3!important}\n' +
        '.eoz-dropdown-item{display:flex!important;align-items:center!important;gap:12px!important;padding:16px!important;text-decoration:none!important;color:#333!important;border-bottom:1px solid #eee!important;transition:background-color .2s!important;min-height:50px!important;font-size:14px!important}\n' +
        '.eoz-dropdown-item:last-child{border-bottom:none!important}\n' +
        '.eoz-dropdown-item:hover{background:#f8f9fa!important}\n' +
        '.eoz-dropdown-item i{font-size:18px!important;width:20px!important;text-align:center!important}\n' +
        '.eoz-dropdown-container{position:relative!important;width:100%!important}\n' +
        '@media (max-width:1024px){.eoz-dropdown-label{height:70px!important;font-size:18px!important}.eoz-dropdown-item{min-height:60px!important;font-size:16px!important;padding:20px!important}.eoz-dropdown-item i{font-size:20px!important}}\n' +
        '@media (min-width:961px){table.dynamic-table tbody tr.body-row td.eoz-mobile-cell{display:none!important}}\n' +
        '@media (max-width:960px){\n' +
        '  table.dynamic-table thead{display:none!important}\n' +
        '  table.dynamic-table tbody tr.body-row td.body-cell:not(.eoz-mobile-cell){display:none!important}\n' +
        '  table.dynamic-table tbody tr.body-row td.eoz-mobile-cell{display:table-cell!important;padding:8px!important}\n' +
        '  .eoz-cl-grid{display:grid;grid-template-columns:1fr;gap:8px;align-items:start}\n' +
        '  .eoz-cl-header{display:flex;flex-direction:column;gap:4px;margin-bottom:8px;padding-bottom:8px;border-bottom:1px solid #e0e0e0}\n' +
        '  .eoz-cl-lp{font-size:12px;color:#666}\n' +
        '  .eoz-cl-kod{font-size:16px;font-weight:bold}\n' +
        '  .eoz-cl-details{display:grid;grid-template-columns:1fr;gap:8px}\n' +
        '  .eoz-cl-details div{margin-bottom:6px;font-size:13px}\n' +
        '  .eoz-cl-label{color:#666;margin-right:4px;font-weight:600}\n' +
        '  .eoz-cl-status{padding:8px;background:#f8f9fa;border-radius:4px;text-align:center;font-weight:600}\n' +
        '  .eoz-cl-actions{margin-top:8px}\n' +
        '}\n' +
        '@media (min-width:501px) and (max-width:960px){\n' +
        '  .eoz-cl-header{display:none}\n' +
        '  .eoz-cl-details{grid-template-columns:40px 100px 1fr 120px 150px;grid-template-rows:auto}\n' +
        '  .eoz-cl-lp-col{grid-column:1;grid-row:1;font-weight:bold;display:flex;align-items:center;justify-content:center}\n' +
        '  .eoz-cl-kod-col{grid-column:2;grid-row:1;font-weight:bold;display:flex;align-items:center}\n' +
        '  .eoz-cl-info{grid-column:3;grid-row:1}\n' +
        '  .eoz-cl-status-col{grid-column:4;grid-row:1;display:flex;align-items:center}\n' +
        '  .eoz-cl-actions{grid-column:5;grid-row:1;margin-top:0;display:flex;align-items:center}\n' +
        '}\n' +
        '@media (max-width:500px){\n' +
        '  .eoz-cl-details{grid-template-columns:1fr;grid-template-rows:auto auto auto auto}\n' +
        '}\n';

    window.EOZ.injectStyles(styles, { id: 'eoz-commission-list-module-css' });

    function findColumnIndex(headerText) {
        var headers = document.querySelectorAll('th.heading-cell.column-names-cell');
        for (var i = 0; i < headers.length; i++) {
            var text = (headers[i].textContent || '').trim();
            if (text.indexOf(headerText) !== -1) return i;
        }
        return -1;
    }

    function hideColumns() {
        var isDesktop = window.innerWidth >= 961;
        var clientCodeIndex = findColumnIndex('Kod klienta');
        var startDateIndex = findColumnIndex('Data rozpoczęcia');
        if (!isDesktop && clientCodeIndex !== -1) {
            var headers = document.querySelectorAll('th.heading-cell.column-names-cell');
            if (headers[clientCodeIndex]) headers[clientCodeIndex].classList.add('eoz-hidden-column');
            var searchCells = document.querySelectorAll('th.heading-cell.heading-options-cell.search-cell');
            if (searchCells[clientCodeIndex]) searchCells[clientCodeIndex].classList.add('eoz-hidden-column');
            var rows = document.querySelectorAll('tbody tr.body-row');
            rows.forEach(function(row){
                var cells = row.querySelectorAll('td.body-cell');
                if (cells[clientCodeIndex]) cells[clientCodeIndex].classList.add('eoz-hidden-column');
            });
        }
        if (startDateIndex !== -1) {
            var headers2 = document.querySelectorAll('th.heading-cell.column-names-cell');
            if (headers2[startDateIndex]) headers2[startDateIndex].classList.add('eoz-hidden-column');
            var searchCells2 = document.querySelectorAll('th.heading-cell.heading-options-cell.search-cell');
            if (searchCells2[startDateIndex]) searchCells2[startDateIndex].classList.add('eoz-hidden-column');
            var rows2 = document.querySelectorAll('tbody tr.body-row');
            rows2.forEach(function(row){
                var cells2 = row.querySelectorAll('td.body-cell');
                if (cells2[startDateIndex]) cells2[startDateIndex].classList.add('eoz-hidden-column');
            });
        }
    }

    function formatDates() {
        var plannedDateIndex = findColumnIndex('Planowana data zakończenia zlecenia');
        if (plannedDateIndex !== -1) {
            var rows = document.querySelectorAll('tbody tr.body-row');
            rows.forEach(function(row){
                var cells = row.querySelectorAll('td.body-cell');
                if (cells[plannedDateIndex]) {
                    var cell = cells[plannedDateIndex];
                    var fullDate = (cell.textContent || '').trim();
                    if (fullDate && fullDate.length >= 10) {
                        cell.textContent = fullDate.substring(0,10);
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
            { icon: 'fa-comment', text: 'Info wysyłki', action: 'info', part: 'send_info' },
            { icon: 'fa-comments', text: 'Uwagi', action: 'notes', part: 'notes' },
            { icon: 'fa-clock', text: 'Czasy pracy', action: 'times', part: 'working_times' },
            { icon: 'fa-cog', text: 'Zarządzaj statusem', action: 'status', part: 'manage_status' },
            { icon: 'fa-search', text: 'Szczegóły', action: 'details', part: 'show_details' },
            { icon: 'fa-trash', text: 'Usuń', action: 'delete', part: 'delete' },
            { icon: 'fa-save', text: 'Archiwizuj', action: 'archive', part: 'archive' },
            { icon: 'fa-print', text: 'Drukuj', action: 'print', part: 'generate_page' }
        ];

        actions.forEach(function(a){
            var originalLink = actionsCell.querySelector('a[href*="' + a.part + '"]');
            if (originalLink) {
                var menuItem = document.createElement('a');
                menuItem.className = 'eoz-dropdown-item';
                menuItem.href = originalLink.href;
                if (originalLink.target) menuItem.target = originalLink.target;
                menuItem.setAttribute('data-action', a.action);
                menuItem.innerHTML = '<i class="fas ' + a.icon + '"></i> ' + a.text;
                
                // For navigation links (generate_page, show_details), don't add click handler
                // Let the browser handle navigation naturally - prevents logout issues
                var isNavigationLink = a.action === 'print' || a.action === 'details';
                
                if (!isNavigationLink) {
                    // For action links (delete, archive, etc.) that may have confirm dialogs
                    // Preserve original onclick handler if exists
                    if (originalLink.onclick) {
                        menuItem.onclick = originalLink.onclick;
                    }
                }
                
                menu.appendChild(menuItem);
            }
        });

        container.appendChild(checkbox);
        container.appendChild(label);
        container.appendChild(menu);
        
        // Close dropdown when clicking a menu item (but don't interfere with link navigation)
        menu.addEventListener('click', function(e){
            // Check if click was on a link - if so, don't prevent default, just close dropdown
            var clickedLink = e.target.closest && e.target.closest('a');
            if (clickedLink) {
                // Let the link navigate normally - just close dropdown
                checkbox.checked = false;
                return; // Don't prevent default - allow navigation
            }
            // If clicking on menu background, close dropdown
            checkbox.checked = false;
        });
        
        // Ensure only a single dropdown is open at a time
        label.addEventListener('click', function(){
            var all = document.querySelectorAll('.eoz-dropdown-toggle');
            all.forEach(function(cb){ if (cb !== checkbox) cb.checked = false; });
            // Decide drop direction: if not enough space below, open upwards
            setTimeout(function(){
                var rect = container.getBoundingClientRect();
                var spaceBelow = window.innerHeight - rect.bottom;
                if (spaceBelow < 220) { // approx menu height
                    container.classList.add('eoz-dropup');
                } else {
                    container.classList.remove('eoz-dropup');
                }
            }, 0);
        });
        return container;
    }

    function transformActionButtons() {
        var actionCells = document.querySelectorAll('td.body-cell.body-options-cell');
        actionCells.forEach(function(cell, index){
            var original = cell.innerHTML;
            cell.innerHTML = '';
            cell.innerHTML = original;
            var dropdown = createDropdownMenu(cell, index);
            cell.innerHTML = '';
            cell.appendChild(dropdown);
        });
    }

    function buildMobileLayout() {
        var headers = document.querySelectorAll('th.heading-cell.column-names-cell');
        var headerNames = [];
        headers.forEach(function(th){ headerNames.push((th.textContent||'').trim()); });
        
        var idxLp = headerNames.indexOf('Lp');
        var idxKod = headerNames.indexOf('Kod');
        var idxKodKlienta = headerNames.indexOf('Kod klienta');
        var idxMaterialy = headerNames.indexOf('Materiały');
        var idxIlosc = headerNames.indexOf('Ilość płyt');
        var idxNazwa = headerNames.indexOf('Nazwa zlecenia');
        var idxDataZakonczenia = headerNames.indexOf('Planowana data zakończenia zlecenia');
        var idxStatus = headerNames.indexOf('Status');
        
        var rows = document.querySelectorAll('tbody tr.body-row');
        rows.forEach(function(row, rIndex){
            if (row.querySelector('td.eoz-mobile-cell')) return; // already built
            
            var cells = row.querySelectorAll('td.body-cell');
            if (!cells || cells.length === 0) return;
            
            var lp = idxLp>=0 && cells[idxLp] ? (cells[idxLp].textContent||'').trim() : (rIndex+1).toString();
            var kod = idxKod>=0 && cells[idxKod] ? (cells[idxKod].textContent||'').trim() : '—';
            var kodKlienta = idxKodKlienta>=0 && cells[idxKodKlienta] ? (cells[idxKodKlienta].textContent||'').trim() : '—';
            var materialy = idxMaterialy>=0 && cells[idxMaterialy] ? (cells[idxMaterialy].textContent||'').trim() : '—';
            var ilosc = idxIlosc>=0 && cells[idxIlosc] ? (cells[idxIlosc].textContent||'').trim() : '—';
            var nazwa = idxNazwa>=0 && cells[idxNazwa] ? (cells[idxNazwa].textContent||'').trim() : '—';
            var dataZakonczenia = idxDataZakonczenia>=0 && cells[idxDataZakonczenia] ? (cells[idxDataZakonczenia].textContent||'').trim().substring(0,10) : '—';
            var status = idxStatus>=0 && cells[idxStatus] ? (cells[idxStatus].textContent||'').trim() : '—';
            
            // Find actions cell and extract (move) the dropdown to preserve event handlers
            var actionsCell = row.querySelector('td.body-cell.body-options-cell');
            var actionsDropdown = null;
            if (actionsCell) {
                var existingDropdown = actionsCell.querySelector('.eoz-dropdown-container');
                if (existingDropdown) {
                    // Clone and give unique checkbox id for mobile to avoid id collisions
                    actionsDropdown = existingDropdown.cloneNode(true);
                    var cb = actionsDropdown.querySelector('input.eoz-dropdown-toggle');
                    var lbl = actionsDropdown.querySelector('label.eoz-dropdown-label');
                    var mnu = actionsDropdown.querySelector('.eoz-dropdown-menu');
                    var newId = 'eoz-dropdown-mobile-' + rIndex;
                    if (cb) cb.id = newId;
                    if (lbl) lbl.htmlFor = newId;
                    if (mnu && cb) {
                        mnu.addEventListener('click', function(){ cb.checked = false; });
                    }
                }
            }
            
            var mobileCell = document.createElement('td');
            mobileCell.className = 'eoz-mobile-cell body-cell';
            mobileCell.colSpan = cells.length;
            
            var grid = document.createElement('div');
            grid.className = 'eoz-cl-grid';
            
            // Header: Lp + Kod (mobile only)
            var header = document.createElement('div');
            header.className = 'eoz-cl-header';
            header.innerHTML = '<div class="eoz-cl-lp">Lp. ' + lp + '</div>' +
                               '<div class="eoz-cl-kod">' + kod + '</div>';
            
            // Details grid
            var details = document.createElement('div');
            details.className = 'eoz-cl-details';
            
            // For tablet: create separate columns
            var lpCol = document.createElement('div');
            lpCol.className = 'eoz-cl-lp-col';
            lpCol.textContent = lp;
            
            var kodCol = document.createElement('div');
            kodCol.className = 'eoz-cl-kod-col';
            kodCol.textContent = kod;
            
            var infoCol = document.createElement('div');
            infoCol.className = 'eoz-cl-info';
            infoCol.innerHTML = '<div><span class="eoz-cl-label">Klient:</span>' + kodKlienta + '</div>' +
                                '<div><span class="eoz-cl-label">Nazwa zlecenia:</span>' + nazwa + '</div>' +
                                '<div><span class="eoz-cl-label">Materiały:</span>' + materialy + '</div>' +
                                '<div><span class="eoz-cl-label">Ilość płyt:</span>' + ilosc + '</div>' +
                                '<div><span class="eoz-cl-label">Planowana data:</span>' + dataZakonczenia + '</div>';
            
            var statusCol = document.createElement('div');
            statusCol.className = 'eoz-cl-status-col';
            statusCol.innerHTML = '<div class="eoz-cl-status">' + status + '</div>';
            
            var actionsCol = document.createElement('div');
            actionsCol.className = 'eoz-cl-actions';
            if (actionsDropdown) {
                actionsCol.appendChild(actionsDropdown);
            }
            
            grid.appendChild(header);
            details.appendChild(lpCol);
            details.appendChild(kodCol);
            details.appendChild(infoCol);
            details.appendChild(statusCol);
            details.appendChild(actionsCol);
            grid.appendChild(details);
            
            mobileCell.appendChild(grid);
            row.appendChild(mobileCell);
        });
    }

    function run() {
        window.EOZ.waitFor('table.dynamic-table tbody tr.body-row', { timeout: 10000 })
            .then(function(){
                hideColumns();
                formatDates();
                transformActionButtons();
                buildMobileLayout();
                console.log('[EOZ Commission List Module v' + VERSION + '] Applied');
            })
            .catch(function(){ console.warn('[EOZ Commission List Module v' + VERSION + '] Table not found'); });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', run, { once: true });
    } else {
        run();
    }
})();
