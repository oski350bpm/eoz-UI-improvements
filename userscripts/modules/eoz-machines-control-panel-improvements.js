// EOZ Machines Control Panel Improvements Module
// Applies on /machines/control_panel

(function() {
    'use strict';

    var VERSION = '1.1.16';

    // Expose version to global EOZ object
    if (!window.EOZ) window.EOZ = {};
    if (!window.EOZ.MachinesPanel) window.EOZ.MachinesPanel = {};
    window.EOZ.MachinesPanel.VERSION = VERSION;

    if (!window.EOZ) {
        console.warn('[EOZ Machines Panel Module] Core not available');
        return;
    }

    if (window.location.href.indexOf('/machines/control_panel') === -1) {
        return; // not this page
    }
    
    // Skip loading for control_panel_order (work-in-progress view)
    // This view has its own dedicated module
    if (window.location.href.indexOf('control_panel_order') !== -1) {
        return; // skip for order work view - handled by separate module
    }
    
    // Skip loading for magazine machines (boards and veneers magazines)
    // These have their own specialized modules and don't need the general machines module
    if (window.location.href.indexOf('control_panel_boards_magazine_2020') !== -1 ||
        window.location.href.indexOf('control_panel_veneers_magazine_2020') !== -1) {
        return; // skip for magazine views
    }

    var styles = '' +
        'table{width:100%!important;table-layout:auto!important}\n' +
        'table thead th, table tbody td{white-space:normal!important;word-break:break-word!important;overflow-wrap:anywhere!important}\n' +
        'table thead th, table tbody td{padding:6px 8px!important;font-size:13px!important}\n' +
        '.datepicker table, .datepicker-dropdown table{width:auto!important;table-layout:auto!important}\n' +
        '.datepicker table thead th, .datepicker table tbody td, .datepicker-dropdown table thead th, .datepicker-dropdown table tbody td{white-space:normal!important;word-break:normal!important;overflow-wrap:normal!important;padding:8px!important}\n' +
        '.eoz-hidden-column{display:none!important}\n' +
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
        '.eoz-realizacja-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;background:#28a745;color:#fff!important;border:0;border-radius:8px;padding:10px 16px;text-decoration:none!important;font-weight:700;min-height:40px}\n' +
        '.eoz-realizacja-btn:hover{background:#218838}\n' +
        '@media (min-width:961px){td.eoz-mobile-cell{display:none!important}}\n' +
        '@media (max-width:960px){\n' +
        '  .machines-panel table thead{display:none!important}\n' +
        '  .machines-panel table tbody tr td:not(.eoz-mobile-cell):not([colspan]){display:none!important}\n' +
        '  .machines-panel table tbody tr td.eoz-mobile-cell{display:table-cell!important;padding:8px!important}\n' +
        '  .datepicker table thead, .datepicker-dropdown table thead{display:table-header-group!important}\n' +
        '  .datepicker table tbody, .datepicker-dropdown table tbody{display:table-row-group!important}\n' +
        '  .datepicker table tbody tr td, .datepicker-dropdown table tbody tr td{display:table-cell!important}\n' +
        '  .eoz-mp-grid{display:grid;grid-template-columns:1fr;gap:8px;align-items:start}\n' +
        '  .eoz-mp-header{display:flex;flex-direction:column;gap:4px;margin-bottom:8px;padding-bottom:8px;border-bottom:1px solid #e0e0e0}\n' +
        '  .eoz-mp-lp{font-size:12px;color:#666}\n' +
        '  .eoz-mp-zlec{font-size:16px;font-weight:bold}\n' +
        '  .eoz-mp-details{display:grid;grid-template-columns:1fr;gap:8px}\n' +
        '  .eoz-mp-label{color:#666;margin-right:4px;font-weight:600}\n' +
        '  .eoz-mp-actions{margin-top:4px;display:grid;grid-template-columns:1fr;gap:8px}\n' +
        '}\n' +
        '@media (min-width:501px) and (max-width:960px){\n' +
        '  .eoz-mp-header{display:none}\n' +
        '  .eoz-mp-details{grid-template-columns:60px 1fr 140px;grid-template-rows:auto auto}\n' +
        '  .eoz-mp-lp-col{grid-column:1;grid-row:1;font-weight:bold;display:flex;align-items:center;justify-content:center}\n' +
        '  .eoz-mp-zlec-col{grid-column:2;grid-row:1;display:flex;align-items:center;font-weight:bold}\n' +
        '  .eoz-mp-info{grid-column:2;grid-row:2}\n' +
        '  .eoz-mp-actions{grid-column:3;grid-row:1 / 3;align-self:center}\n' +
        '}\n';

    window.EOZ.injectStyles(styles, { id: 'eoz-machines-panel-module-css' });

    function createModal() {
        // Create modal HTML structure
        var modalHTML = '' +
            '<div class="modal fade" id="eoz-uwagi-modal" tabindex="-1" role="dialog" aria-labelledby="eoz-uwagi-modal-label" aria-hidden="true">' +
            '  <div class="modal-dialog mw-100 w-75" role="document">' +
            '    <div class="modal-content">' +
            '      <div class="modal-header">' +
            '        <h4 class="modal-title" id="eoz-uwagi-modal-label">Uwagi</h4>' +
            '        <button type="button" class="close" data-dismiss="modal" aria-label="Close">' +
            '          <span aria-hidden="true">&times;</span>' +
            '        </button>' +
            '      </div>' +
            '      <div class="modal-body" id="eoz-uwagi-modal-body">' +
            '        <div class="text-center"><i class="fa fa-spinner fa-spin"></i> Ładowanie...</div>' +
            '      </div>' +
            '      <div class="modal-footer">' +
            '        <button type="button" class="btn btn-info" data-dismiss="modal">Zamknij</button>' +
            '      </div>' +
            '    </div>' +
            '  </div>' +
            '</div>';
        
        // Add modal to body if it doesn't exist
        if (!document.getElementById('eoz-uwagi-modal')) {
            document.body.insertAdjacentHTML('beforeend', modalHTML);
        }

        // Ensure close behavior works even without Bootstrap
        var ensureCloseHandlers = function() {
            var modal = document.getElementById('eoz-uwagi-modal');
            if (!modal) return;

            function closeUwagiModal() {
                if (window.jQuery && window.jQuery.fn.modal) {
                    window.jQuery(modal).modal('hide');
                    return;
                }
                modal.classList.remove('show');
                modal.style.display = 'none';
                document.body.classList.remove('modal-open');
                // Remove any backdrop that might have been added elsewhere
                var backdrops = document.querySelectorAll('.modal-backdrop');
                backdrops.forEach(function(b){ if (b && b.parentNode) b.parentNode.removeChild(b); });
            }

            var closeButtons = modal.querySelectorAll('[data-dismiss="modal"], .modal .close');
            closeButtons.forEach(function(btn){
                btn.addEventListener('click', function(e){
                    e.preventDefault();
                    closeUwagiModal();
                }, { capture: true });
            });

            // Optional: close on backdrop click for fallback
            modal.addEventListener('click', function(e){
                if (!modal.classList.contains('show')) return;
                var dialog = modal.querySelector('.modal-dialog');
                if (dialog && !dialog.contains(e.target)) {
                    closeUwagiModal();
                }
            }, { capture: true });
        };

        ensureCloseHandlers();
    }

    function checkClientNotesExists(orderId, callback) {
        // Check if client notes exist by making a lightweight request
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'https://eoz.iplyty.erozrys.pl/index.php/pl/commission/get_erozrys_order_send_info/' + orderId, true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    // Check if response contains actual content (not empty or error message)
                    var responseText = xhr.responseText.trim();
                    var hasContent = responseText.length > 0 && 
                                     responseText.indexOf('Brak') === -1 && 
                                     responseText.indexOf('brak') === -1 &&
                                     responseText.indexOf('<div') !== -1;
                    callback(hasContent);
                } else {
                    callback(false);
                }
            }
        };
        xhr.send();
    }

    function showUwagiModal(orderId) {
        createModal();
        
        // Show modal
        var modal = document.getElementById('eoz-uwagi-modal');
        var modalBody = document.getElementById('eoz-uwagi-modal-body');
        
        // Reset content
        modalBody.innerHTML = '<div class="text-center"><i class="fa fa-spinner fa-spin"></i> Ładowanie...</div>';
        
        // Show modal using Bootstrap
        if (window.jQuery && window.jQuery.fn.modal) {
            window.jQuery(modal).modal('show');
        } else {
            // Fallback if jQuery not available
            modal.style.display = 'block';
            modal.classList.add('show');
            document.body.classList.add('modal-open');
        }
        
        // Load content via AJAX
        var xhr = new XMLHttpRequest();
        xhr.open('GET', 'https://eoz.iplyty.erozrys.pl/index.php/pl/commission/get_erozrys_order_send_info/' + orderId, true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    modalBody.innerHTML = xhr.responseText;
                } else {
                    modalBody.innerHTML = '<div class="alert alert-danger">Błąd ładowania uwag. Spróbuj ponownie.</div>';
                }
            }
        };
        xhr.send();
    }

    function waitAndRun() {
        window.EOZ.waitFor('table tbody tr', { timeout: 10000 })
            .then(apply)
            .catch(function(){ console.warn('[EOZ Machines Panel v' + VERSION + '] Table not found'); });
    }

    function findHeaderIndex(headerText) {
        var headers = document.querySelectorAll('table thead th');
        for (var i = 0; i < headers.length; i++) {
            var text = (headers[i].textContent || '').trim();
            if (text.indexOf(headerText) !== -1 || text === headerText) return i;
        }
        return -1;
    }

    function hideColumnsDesktop() {
        // Hide Termin and Status to match target structure
        var idxTermin = findHeaderIndex('Termin');
        var idxStatus = findHeaderIndex('Status');
        [idxTermin, idxStatus].forEach(function(idx){
            if (idx < 0) return;
            var headers = document.querySelectorAll('table thead th');
            if (headers[idx]) headers[idx].classList.add('eoz-hidden-column');
            var rows = document.querySelectorAll('table tbody tr');
            rows.forEach(function(row){
                var cells = row.querySelectorAll('td');
                if (cells[idx]) cells[idx].classList.add('eoz-hidden-column');
            });
        });
    }

    var ICON_LABELS = {
        'fa-search': 'Szczegóły',
        'fa-print': 'Drukuj',
        'fa-cog': 'Zarządzaj statusem',
        'fa-save': 'Archiwizuj',
        'fa-trash': 'Usuń',
        'fa-trash-alt': 'Usuń',
        'fa-file-export': 'Eksport',
        'fa-comments': 'Uwagi',
        'fa-comment': 'Uwagi'
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
        if (href.indexOf('working_times') !== -1) return 'Czasy pracy';
        if (href.indexOf('get_erozrys_order_notes') !== -1) return 'Uwagi';
        return 'Akcja';
    }

    function createDropdownFromActionsCell(actionsCell, uniqueId, originalLinks){
        var container = document.createElement('div');
        container.className = 'eoz-dropdown-container';
        var checkboxId = 'eoz-dropdown-mach-' + uniqueId;
        var checkbox = document.createElement('input'); checkbox.type = 'checkbox'; checkbox.className = 'eoz-dropdown-toggle'; checkbox.id = checkboxId;
        var label = document.createElement('label'); label.className = 'eoz-dropdown-label'; label.htmlFor = checkboxId; label.innerHTML = '<i class="fas fa-cog"></i> Akcje';
        var menu = document.createElement('div'); menu.className = 'eoz-dropdown-menu';

        var links = originalLinks || actionsCell.querySelectorAll('a');
        Array.prototype.forEach.call(links, function(link){
            var menuItem = document.createElement('a');
            menuItem.className = 'eoz-dropdown-item';
            menuItem.href = link.href; if (link.target) menuItem.target = link.target;
            var icon = link.querySelector('i');
            var titleText = labelFromLink(link);
            menuItem.innerHTML = '<i class="' + (icon ? icon.className : '') + '"></i> ' + titleText;
            menuItem.title = titleText;
            // Delegate to original link to preserve any bound handlers (confirm/popups)
            menuItem.addEventListener('click', function(e){
                e.preventDefault();
                try {
                    var clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true, view: window });
                    link.dispatchEvent(clickEvent);
                } catch(_) {
                    window.location.href = link.href;
                }
            });
            menu.appendChild(menuItem);
        });

        container.appendChild(checkbox); container.appendChild(label); container.appendChild(menu);
        menu.addEventListener('click', function(){ checkbox.checked = false; });
        return container;
    }

    function transformActionButtons(){
        var actionCells = document.querySelectorAll('table tbody tr td:last-child');
        actionCells.forEach(function(cell, index){
            if (cell.querySelectorAll('a').length === 0) return;
            // Preserve original links in a hidden container to retain bound handlers
            var originalLinks = Array.from(cell.querySelectorAll('a'));
            var hidden = document.createElement('div');
            hidden.className = 'eoz-original-actions';
            hidden.style.display = 'none';
            originalLinks.forEach(function(a){ hidden.appendChild(a); });
            // Build dropdown referencing the preserved originals
            var dropdown = createDropdownFromActionsCell(cell, index, hidden.querySelectorAll('a'));
            // Replace cell content with dropdown + hidden originals
            cell.innerHTML = '';
            cell.appendChild(dropdown);
            cell.appendChild(hidden);
        });
    }

    function insertRealizationColumn(){
        // Insert header
        var headerRow = document.querySelector('table thead tr');
        if (!headerRow) return;
        var headers = headerRow.querySelectorAll('th');
        var idxOpcje = -1;
        headers.forEach(function(th, i){ if ((th.textContent||'').trim().toLowerCase() === 'opcje') idxOpcje = i; });
        var thReal = document.createElement('th');
        thReal.textContent = 'Realizacja';
        if (idxOpcje >= 0) {
            headerRow.insertBefore(thReal, headers[idxOpcje]);
        } else {
            headerRow.appendChild(thReal);
        }

        // Insert cells per row
        var rows = document.querySelectorAll('table tbody tr');
        rows.forEach(function(row){
            var cells = row.querySelectorAll('td');
            if (!cells || cells.length === 0) return;
            var actionsCell = row.querySelector('td:last-child');
            // Prefer original preserved link to keep bound handlers
            var playLink = row.querySelector('.eoz-original-actions a[href*="/machines/control_panel?"]') || (actionsCell ? actionsCell.querySelector('a[href*="/machines/control_panel?"]') : null);
            if (!playLink) {
                // fallback: first link in actions
                playLink = row.querySelector('.eoz-original-actions a') || (actionsCell ? actionsCell.querySelector('a') : null);
            }
            var td = document.createElement('td');
            if (playLink) {
                var btn = document.createElement('a');
                btn.href = '#';
                btn.className = 'eoz-realizacja-btn';
                var icon = playLink.querySelector('i');
                btn.innerHTML = icon ? icon.outerHTML : '<i class="fas fa-play"></i>';
                btn.addEventListener('click', function(e){
                    e.preventDefault();
                    try {
                        var clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true, view: window });
                        playLink.dispatchEvent(clickEvent);
                    } catch(_) {
                        window.location.href = playLink.href;
                    }
                });
                td.appendChild(btn);
            } else {
                td.textContent = '';
            }

            if (idxOpcje >= 0) {
                row.insertBefore(td, cells[idxOpcje]);
            } else {
                row.appendChild(td);
            }
        });
    }

    function insertNotesColumns(){
        var headerRow = document.querySelector('table thead tr');
        if (!headerRow) return;
        var headers = headerRow.querySelectorAll('th');
        var idxOpcje = -1;
        var idxRealPrev = -1;
        headers.forEach(function(th, i){
            var t = (th.textContent||'').trim().toLowerCase();
            if (t === 'opcje') idxOpcje = i;
            if (t === 'realizacja') idxRealPrev = i; // if already inserted
        });

        // Insert in order: Uwagi klienta, Uwagi wewnętrzne, Realizacja, Opcje
        // Here we add two before Realizacja if present; else before Opcje
        var insertBeforeIndex = idxRealPrev >= 0 ? idxRealPrev : idxOpcje;
        var thUwagiKl = document.createElement('th'); thUwagiKl.textContent = 'Uwagi klienta';
        var thUwagiWew = document.createElement('th'); thUwagiWew.textContent = 'Uwagi wewnętrzne';
        if (insertBeforeIndex >= 0) {
            headerRow.insertBefore(thUwagiKl, headerRow.children[insertBeforeIndex]);
            headerRow.insertBefore(thUwagiWew, headerRow.children[insertBeforeIndex]);
        } else {
            headerRow.appendChild(thUwagiKl);
            headerRow.appendChild(thUwagiWew);
        }

        // Rows
        var rows = document.querySelectorAll('table tbody tr');
        rows.forEach(function(row){
            var cells = row.querySelectorAll('td');
            if (!cells || cells.length === 0) return;
            var actionsCell = row.querySelector('td:last-child');
            // Determine order id from Zlecenie cell
            var idxZlec = findHeaderIndex('Zlecenie');
            var orderId = '';
            if (idxZlec >= 0 && cells[idxZlec]) {
                var zlecA = cells[idxZlec].querySelector('a');
                orderId = zlecA ? (zlecA.textContent||'').trim() : (cells[idxZlec].textContent||'').trim();
            }

            // Links for client/internal notes
            var notesClientLink = actionsCell ? actionsCell.querySelector('a[href*="get_erozrys_order_send_info"]') : null;
            var notesInternalLink = actionsCell ? actionsCell.querySelector('a[href*="get_erozrys_order_notes"]') : null;

            // Prefer extracting numeric ID from link hrefs when available (most reliable)
            function extractIdFromHref(href) {
                if (!href) return null;
                // Match trailing id with optional underscore part: e.g., 3857 or 3857_1
                var m = href.match(/\/(\d+(?:_\d+)?)(?:$|[?#])/);
                return m ? m[1] : null;
            }
            var extractedId = null;
            if (notesClientLink) extractedId = extractIdFromHref(notesClientLink.getAttribute('href'));
            if (!extractedId && notesInternalLink) extractedId = extractIdFromHref(notesInternalLink.getAttribute('href'));
            if (extractedId) orderId = extractedId;

            // Fallback: transform Zlecenie like "3857/1" to "3857_1"
            if (!extractedId && orderId) {
                var transformed = orderId.replace(/\s+/g, '').replace('/', '_');
                // Keep only digits and underscores in ID (defensive)
                transformed = (transformed.match(/\d+(?:_\d+)?/) || [''])[0];
                if (transformed) orderId = transformed;
            }

            var tdKl = document.createElement('td');
            var tdWew = document.createElement('td');
            // Uwagi klienta (send_info)
            // Check if client notes exist - if link exists in actions, use solid icon, otherwise async check
            var hasClientNotes = !!notesClientLink;
            var clientIconClass = hasClientNotes ? 'fa fa-2x fa-comment' : 'far fa-2x fa-comment';
            
            if (notesClientLink || orderId) {
                var link1 = notesClientLink ? notesClientLink.cloneNode(true) : document.createElement('a');
                link1.innerHTML = '<i class="tableoptions ' + clientIconClass + '"></i>';
                link1.href = '#'; // Prevent default navigation
                // Capture the current row's orderId and link element to avoid var/closure issues
                (function(capturedOrderId, capturedLink, presetHasClientNotes){
                    capturedLink.addEventListener('click', function(e){
                        e.preventDefault();
                        showUwagiModal(capturedOrderId);
                        return false;
                    }, true);

                    // Asynchronously check if notes actually exist and update icon (only if not already indicated by action link)
                    if (capturedOrderId && !presetHasClientNotes) {
                        checkClientNotesExists(capturedOrderId, function(hasNotes) {
                            var icon = capturedLink.querySelector('i');
                            if (icon) {
                                icon.className = hasNotes ? 'tableoptions fa fa-2x fa-comment' : 'tableoptions far fa-2x fa-comment';
                            }
                        });
                    }
                })(orderId, link1, hasClientNotes);

                tdKl.appendChild(link1);
            }

            // Uwagi wewnętrzne (notes)
            if (notesInternalLink) {
                var link2 = notesInternalLink.cloneNode(true);
                var i2 = link2.querySelector('i');
                link2.innerHTML = i2 ? i2.outerHTML : '<i class="fas fa-comments"></i>';
                tdWew.appendChild(link2);
            } else if (orderId) {
                var a2 = document.createElement('a');
                a2.href = 'https://eoz.iplyty.erozrys.pl/index.php/pl/commission/get_erozrys_order_notes/' + orderId;
                a2.innerHTML = '<i class="fas fa-comments"></i>';
                tdWew.appendChild(a2);
            }

            if (insertBeforeIndex >= 0) {
                row.insertBefore(tdKl, row.children[insertBeforeIndex]);
                row.insertBefore(tdWew, row.children[insertBeforeIndex]);
            } else {
                row.appendChild(tdKl);
                row.appendChild(tdWew);
            }
        });
    }

    function renumberLp(){
        var headerRow = document.querySelector('table thead tr');
        if (headerRow) {
            var firstHeaderCell = headerRow.querySelector('th:first-child');
            if (firstHeaderCell) firstHeaderCell.textContent = 'Lp.';
        }
        var bodyRows = document.querySelectorAll('table tbody tr');
        bodyRows.forEach(function(row, index){
            var firstCell = row.querySelector('td:first-child');
            if (firstCell) {
                firstCell.textContent = (index + 1).toString();
                firstCell.style.fontWeight = 'bold';
                firstCell.style.textAlign = 'center';
            }
        });
    }

    function buildMobileLayout(){
        var idxZlec = findHeaderIndex('Zlecenie');
        var idxMat = findHeaderIndex('Materiały');
        var idxIlosc = findHeaderIndex('Ilość');
        var idxKlient = findHeaderIndex('Klient');
        var idxNazwa = findHeaderIndex('Nazwa zamówienia');
        var idxOstMasz = findHeaderIndex('Ostatnia maszyna');

        var rows = document.querySelectorAll('table tbody tr');
        rows.forEach(function(row, rIndex){
            if (row.querySelector('td.eoz-mobile-cell')) return; // already built
            var cells = row.querySelectorAll('td');
            if (!cells || cells.length === 0) return;

            function getCell(idx){ return idx >= 0 && idx < cells.length ? cells[idx] : null; }

            var zlecCell = getCell(idxZlec);
            var zlecText = '';
            var zlecLink = '';
            if (zlecCell){
                var a = zlecCell.querySelector('a');
                if (a) { zlecLink = a.href; zlecText = (a.textContent||'').trim(); }
                else { zlecText = (zlecCell.textContent||'').trim(); }
            }
            var mat = getCell(idxMat) ? (getCell(idxMat).textContent||'').trim() : '';
            var ilosc = getCell(idxIlosc) ? (getCell(idxIlosc).textContent||'').trim() : '';
            var klient = getCell(idxKlient) ? (getCell(idxKlient).textContent||'').trim() : '';
            var nazwa = getCell(idxNazwa) ? (getCell(idxNazwa).textContent||'').trim() : '';
            var ostMasz = getCell(idxOstMasz) ? (getCell(idxOstMasz).textContent||'').trim() : '';

            // Extract actions
            var actionsCell = row.querySelector('td:last-child');
            var playLink = actionsCell ? actionsCell.querySelector('a[href*="/machines/control_panel?"]') : null;
            if (!playLink) playLink = actionsCell ? actionsCell.querySelector('a') : null;
            var notesLink = actionsCell ? actionsCell.querySelector('a[href*="get_erozrys_order_notes"]') : null;
            var allActionLinks = actionsCell ? Array.from(actionsCell.querySelectorAll('a')) : [];

            var mobileCell = document.createElement('td');
            mobileCell.className = 'eoz-mobile-cell';
            mobileCell.colSpan = cells.length + 1; // account for added Realizacja

            var grid = document.createElement('div');
            grid.className = 'eoz-mp-grid';

            // Header
            var header = document.createElement('div'); header.className = 'eoz-mp-header';
            var lpDiv = document.createElement('div'); lpDiv.className = 'eoz-mp-lp'; lpDiv.textContent = 'Lp. ' + (rIndex + 1);
            var zlecDiv = document.createElement('div'); zlecDiv.className = 'eoz-mp-zlec';
            if (zlecLink) { var l = document.createElement('a'); l.href = zlecLink; l.textContent = zlecText; l.style.color = '#007bff'; l.style.textDecoration = 'none'; zlecDiv.appendChild(l); }
            else { zlecDiv.textContent = zlecText; }
            header.appendChild(lpDiv); header.appendChild(zlecDiv);

            // Details
            var details = document.createElement('div'); details.className = 'eoz-mp-details';
            var lpCol = document.createElement('div'); lpCol.className = 'eoz-mp-lp-col'; lpCol.textContent = (rIndex + 1).toString();
            var zlecCol = document.createElement('div'); zlecCol.className = 'eoz-mp-zlec-col';
            if (zlecLink) { var l2 = document.createElement('a'); l2.href = zlecLink; l2.textContent = zlecText; l2.style.color = '#007bff'; l2.style.textDecoration = 'none'; zlecCol.appendChild(l2); } else { zlecCol.textContent = zlecText; }
            var infoCol = document.createElement('div'); infoCol.className = 'eoz-mp-info';
            infoCol.innerHTML = '<div><span class="eoz-mp-label">Materiały:</span>' + (mat||'—') + '</div>' +
                                '<div><span class="eoz-mp-label">Ilość:</span>' + (ilosc||'—') + '</div>' +
                                '<div><span class="eoz-mp-label">Klient:</span>' + (klient||'—') + '</div>' +
                                '<div><span class="eoz-mp-label">Nazwa zamówienia:</span>' + (nazwa||'—') + '</div>' +
                                '<div><span class="eoz-mp-label">Ostatnia maszyna:</span>' + (ostMasz||'—') + '</div>';

            var actions = document.createElement('div'); actions.className = 'eoz-mp-actions';
            // Primary play button
            if (playLink) {
                var btn = document.createElement('a');
                btn.href = '#';
                btn.className = 'eoz-realizacja-btn';
                var icon = playLink.querySelector('i'); var iconHTML = icon ? icon.outerHTML : '<i class="fas fa-play"></i>';
                btn.innerHTML = iconHTML;
                btn.addEventListener('click', function(e){
                    e.preventDefault();
                    try {
                        var clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true, view: window });
                        playLink.dispatchEvent(clickEvent);
                    } catch(_) {
                        window.location.href = playLink.href;
                    }
                });
                actions.appendChild(btn);
            }
            // Dropdown with all actions – ensure unique IDs for mobile and stop propagation
            var transformedDropdown = actionsCell && actionsCell.querySelector('.eoz-dropdown-container');
            var wrapper = document.createElement('div');
            wrapper.className = 'eoz-mp-actions-dropdown';
            if (transformedDropdown) {
                var cloned = transformedDropdown.cloneNode(true);
                try {
                    var input = cloned.querySelector('input.eoz-dropdown-toggle');
                    var label = cloned.querySelector('label.eoz-dropdown-label');
                    var newId = 'eoz-dropdown-mp-' + rIndex;
                    if (input) input.id = newId;
                    if (label) label.htmlFor = newId;
                    var menu = cloned.querySelector('.eoz-dropdown-menu');
                    if (menu) menu.addEventListener('click', function(e){ e.stopPropagation(); if (input) input.checked = false; });
                    if (label) label.addEventListener('click', function(e){ e.stopPropagation(); });
                    cloned.addEventListener('click', function(e){ e.stopPropagation(); });
                } catch(_) {}
                wrapper.appendChild(cloned);
            } else if (allActionLinks && allActionLinks.length) {
                var dropdown = createDropdownFromActionsCell(actionsCell, 'mp-' + rIndex);
                try {
                    var input2 = dropdown.querySelector('input.eoz-dropdown-toggle');
                    var label2 = dropdown.querySelector('label.eoz-dropdown-label');
                    var newId2 = 'eoz-dropdown-mp-' + rIndex;
                    if (input2) input2.id = newId2;
                    if (label2) label2.htmlFor = newId2;
                    var menu2 = dropdown.querySelector('.eoz-dropdown-menu');
                    if (menu2) menu2.addEventListener('click', function(e){ e.stopPropagation(); if (input2) input2.checked = false; });
                    if (label2) label2.addEventListener('click', function(e){ e.stopPropagation(); });
                    dropdown.addEventListener('click', function(e){ e.stopPropagation(); });
                } catch(_) {}
                wrapper.appendChild(dropdown);
            }
            if (wrapper.childNodes.length) actions.appendChild(wrapper);

            grid.appendChild(header);
            details.appendChild(lpCol);
            details.appendChild(zlecCol);
            details.appendChild(infoCol);
            details.appendChild(actions);
            grid.appendChild(details);

            mobileCell.appendChild(grid);
            row.appendChild(mobileCell);
        });
    }

    function debugTableStructure(){
        try {
            var table = document.querySelector('table');
            if (!table) { console.warn('[EOZ Machines Panel Debug] No table found'); return; }
            var headers = Array.from(table.querySelectorAll('thead th')).map(function(th){ return (th.textContent||'').trim(); });
            var bodyRows = Array.from(table.querySelectorAll('tbody tr'));
            var rows = bodyRows.map(function(tr, idx){
                var cells = Array.from(tr.querySelectorAll('td'));
                var data = cells.map(function(td){ return (td.textContent||'').trim(); });
                return {
                    index: idx+1,
                    cellsCount: cells.length,
                    hasMobileCell: !!tr.querySelector('td.eoz-mobile-cell'),
                    data: data
                };
            });
            var mobileBlocks = Array.from(table.querySelectorAll('td.eoz-mobile-cell .eoz-mp-grid')).slice(0, 10).map(function(g){ return g.outerHTML; });
            console.groupCollapsed('[EOZ Machines Panel Debug] Table snapshot');
            console.log('headers:', headers);
            console.log('rows:', rows);
            console.log('mobileBlocks(<=10):', mobileBlocks);
            console.groupEnd();
        } catch (e) {
            console.error('[EOZ Machines Panel Debug] Error while logging structure', e);
        }
    }


    function modifyScannerBehavior() {
        // Debug: initial detection
        var scannerDiv = document.getElementById('scanner_div');
        var scannerInput = (scannerDiv ? scannerDiv.querySelector('input.scanner') : null) || document.querySelector('input.scanner');
        console.log('[EOZ Machines Panel v' + VERSION + '] Scanner detection:', {
            hasScannerDiv: !!scannerDiv,
            hasScannerInputInDiv: !!(scannerDiv && scannerDiv.querySelector && scannerDiv.querySelector('input.scanner')),
            hasScannerInputGlobal: !!document.querySelector('input.scanner')
        });
        if (!scannerInput) {
            console.warn('[EOZ Machines Panel v' + VERSION + '] Scanner input not found. Aborting custom redirect setup.');
            return;
        }

        // Remove existing event listeners by cloning the input
        var oldId = scannerInput.id;
        var oldName = scannerInput.name;
        var newInput = scannerInput.cloneNode(true);
        scannerInput.parentNode.replaceChild(newInput, scannerInput);
        console.log('[EOZ Machines Panel v' + VERSION + '] Scanner input cloned & replaced', { id: oldId, name: oldName });

        function buildSafeUrl(orderCode) {
            // Get operation_date from the actual form field (same as original system)
            var operationDateInput = document.querySelector('input[name="operation_date"]');
            var operationDate = operationDateInput ? operationDateInput.value : null;
            
            if (!operationDate) {
                // Fallback to today's date if not found
                var today = new Date();
                var year = today.getFullYear();
                var month = String(today.getMonth() + 1).padStart(2, '0');
                var day = String(today.getDate()).padStart(2, '0');
                operationDate = year + '-' + month + '-' + day;
            }
            
            // Get block_id from existing play button URLs (same as play buttons)
            var playButtons = document.querySelectorAll('a[href*="control_panel?"]');
            var blockId = null;
            for (var i = 0; i < playButtons.length; i++) {
                var href = playButtons[i].href;
                var match = href.match(/block_id=(\d+)/);
                if (match) {
                    blockId = match[1];
                    break;
                }
            }
            
            // Fallback block_id if not found
            if (!blockId) {
                blockId = '3250';
            }
            
            var url = 'https://eoz.iplyty.erozrys.pl/index.php/pl/machines/control_panel?' +
                'number2=' + encodeURIComponent(orderCode) +
                '&operation_date=' + operationDate +
                '&block_id=' + blockId +
                '&start=0';
            
            return { url: url, operationDate: operationDate, blockId: blockId };
        }

        // Add new keypress handler
        newInput.addEventListener('keypress', function(e) {
            console.log('[EOZ Machines Panel v' + VERSION + '] keypress', { key: e.key, code: e.code, value: newInput.value });
            if (e.key === 'Enter') {
                e.preventDefault();
                var orderCode = newInput.value.trim();
                console.log('[EOZ Machines Panel v' + VERSION + '] Enter pressed', { orderCode: orderCode });
                if (!orderCode) {
                    console.warn('[EOZ Machines Panel v' + VERSION + '] Empty order code, ignoring');
                    return;
                }
                var built = buildSafeUrl(orderCode);
                console.log('[EOZ Machines Panel v' + VERSION + '] Redirecting (keypress) to', built);
                window.location.href = built.url;
            }
        }, true);

        // Also handle form submission if there's a form - INTERCEPT SUBMIT BUT KEEP FORM VISIBLE
        var form = newInput.closest && newInput.closest('form');
        if (form) {
            console.log('[EOZ Machines Panel v' + VERSION + '] Scanner form detected. Installing submit handler (form stays visible)');
            
            // Intercept form submission but keep form visible
            form.addEventListener('submit', function(e) {
                console.log('[EOZ Machines Panel v' + VERSION + '] form.submit intercepted', { value: newInput.value });
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                var orderCode = newInput.value.trim();
                if (!orderCode) {
                    console.warn('[EOZ Machines Panel v' + VERSION + '] Empty order code on submit, ignoring');
                    return false;
                }
                var built = buildSafeUrl(orderCode);
                console.log('[EOZ Machines Panel v' + VERSION + '] Redirecting (submit) to', built);
                window.location.href = built.url;
                return false;
            }, true);
            
            console.log('[EOZ Machines Panel v' + VERSION + '] Form submit handler installed');
            
        } else {
            console.log('[EOZ Machines Panel v' + VERSION + '] Scanner form not found. Relying on keypress Enter handler');
        }

        // Global debug listeners to trace native behavior
        document.addEventListener('keypress', function(e){
            var tgt = e.target && e.target.id ? ('#' + e.target.id) : (e.target && e.target.name ? ('[name="' + e.target.name + '"]') : (e.target && e.target.tagName));
            if (e.target === newInput) {
                console.log('[EOZ Machines Panel v' + VERSION + '] document keypress (from scanner)', { key: e.key, code: e.code, target: tgt });
            }
        }, true);

        console.log('[EOZ Machines Panel v' + VERSION + '] Custom scanner redirect initialized');
    }

    function logDatepickerInfo() {
        var datepicker = document.querySelector('.datepicker');
        if (!datepicker) {
            console.log('[EOZ Datepicker Debug] Calendar not found');
            return;
        }

        var table = datepicker.querySelector('table');
        if (!table) {
            console.log('[EOZ Datepicker Debug] Calendar table not found');
            return;
        }

        var containerClasses = Array.from(datepicker.classList);
        var tableClasses = Array.from(table.classList);
        var computed = window.getComputedStyle(table);
        var thead = table.querySelector('thead');
        var tbody = table.querySelector('tbody');
        var firstRow = tbody ? tbody.querySelector('tr') : null;
        var firstCell = firstRow ? firstRow.querySelector('td') : null;
        var allCells = table.querySelectorAll('td');
        var allRows = table.querySelectorAll('tr');

        // Get all CSS rules affecting datepicker
        var datepickerStyles = [];
        var datepickerTableStyles = [];
        var datepickerCellStyles = [];
        try {
            var sheets = document.styleSheets;
            for (var i = 0; i < sheets.length; i++) {
                try {
                    var rules = sheets[i].cssRules || sheets[i].rules;
                    for (var j = 0; j < rules.length; j++) {
                        var rule = rules[j];
                        if (rule.selectorText) {
                            if (rule.selectorText.includes('.datepicker') && !rule.selectorText.includes('table')) {
                                datepickerStyles.push(rule.selectorText + ' -> ' + rule.style.cssText);
                            }
                            if (rule.selectorText.includes('.datepicker table') || rule.selectorText.includes('.datepicker-dropdown table')) {
                                datepickerTableStyles.push(rule.selectorText + ' -> ' + rule.style.cssText);
                            }
                            if (rule.selectorText.includes('.datepicker td') || rule.selectorText.includes('.datepicker-dropdown td')) {
                                datepickerCellStyles.push(rule.selectorText + ' -> ' + rule.style.cssText);
                            }
                            // Check for media queries
                            if (rule.media && rule.media.mediaText) {
                                var mediaText = rule.media.mediaText;
                                if (mediaText.includes('960')) {
                                    var mediaRules = rule.cssRules || [];
                                    for (var k = 0; k < mediaRules.length; k++) {
                                        var mediaRule = mediaRules[k];
                                        if (mediaRule.selectorText && (mediaRule.selectorText.includes('.datepicker') || mediaRule.selectorText.includes('table'))) {
                                            datepickerStyles.push('@media(' + mediaText + ') ' + mediaRule.selectorText + ' -> ' + mediaRule.style.cssText);
                                        }
                                    }
                                }
                            }
                        }
                    }
                } catch (e) {
                    // Cross-origin stylesheet, skip
                }
            }
        } catch (e) {
            console.log('[EOZ Datepicker Debug] Error reading stylesheets:', e);
        }

        var cellComputed = firstCell ? window.getComputedStyle(firstCell) : null;
        var rowComputed = firstRow ? window.getComputedStyle(firstRow) : null;

        var info = {
            container: {
                classes: containerClasses,
                id: datepicker.id || '(none)',
                parentClasses: datepicker.parentElement ? Array.from(datepicker.parentElement.classList) : [],
                computedStyle: {
                    display: window.getComputedStyle(datepicker).display,
                    position: window.getComputedStyle(datepicker).position
                }
            },
            table: {
                classes: tableClasses,
                display: computed.display,
                width: computed.width,
                tableLayout: computed.tableLayout,
                flexDirection: computed.flexDirection,
                gridTemplateColumns: computed.gridTemplateColumns,
                borderCollapse: computed.borderCollapse,
                borderSpacing: computed.borderSpacing
            },
            structure: {
                theadDisplay: thead ? window.getComputedStyle(thead).display : null,
                tbodyDisplay: tbody ? window.getComputedStyle(tbody).display : null,
                firstRowDisplay: firstRow ? window.getComputedStyle(firstRow).display : null,
                firstRowFlexDirection: rowComputed ? rowComputed.flexDirection : null,
                firstCellDisplay: firstCell ? window.getComputedStyle(firstCell).display : null,
                firstCellWidth: cellComputed ? cellComputed.width : null,
                firstCellPadding: cellComputed ? cellComputed.padding : null,
                firstCellFlexDirection: cellComputed ? cellComputed.flexDirection : null,
                totalRows: allRows.length,
                totalCells: allCells.length,
                cellsPerRow: firstRow ? firstRow.querySelectorAll('td').length : null
            },
            mediaQuery: {
                windowWidth: window.innerWidth,
                isMobile: window.innerWidth <= 960
            },
            cssRules: {
                datepickerContainer: datepickerStyles,
                datepickerTable: datepickerTableStyles,
                datepickerCells: datepickerCellStyles
            }
        };

        console.log('[EOZ Datepicker Debug] Calendar parameters:', info);
        console.log('[EOZ Datepicker Debug] First cell computed styles:', cellComputed ? {
            display: cellComputed.display,
            width: cellComputed.width,
            padding: cellComputed.padding,
            flexDirection: cellComputed.flexDirection,
            gridTemplateColumns: cellComputed.gridTemplateColumns,
            whiteSpace: cellComputed.whiteSpace,
            wordBreak: cellComputed.wordBreak,
            overflowWrap: cellComputed.overflowWrap
        } : 'No cell found');
    }

    function setupDatepickerObserver() {
        // Log when datepicker appears
        var observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(function(node) {
                        if (node.nodeType === 1 && node.classList && node.classList.contains('datepicker')) {
                            setTimeout(function() {
                                logDatepickerInfo();
                            }, 100);
                        }
                    });
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Also check if datepicker already exists
        if (document.querySelector('.datepicker')) {
            setTimeout(function() {
                logDatepickerInfo();
            }, 100);
        }

        // Log when date input is clicked (calendar might open)
        var dateInput = document.querySelector('input[name="operation_date"]');
        if (dateInput) {
            dateInput.addEventListener('click', function() {
                setTimeout(function() {
                    logDatepickerInfo();
                }, 200);
            });
            dateInput.addEventListener('focus', function() {
                setTimeout(function() {
                    logDatepickerInfo();
                }, 200);
            });
        }
    }

    function installStartOperationGuard() {
        // One global capture-phase listener to guard start operation across UI (including delegated clicks)
        if (document.body.getAttribute('data-eoz-start-guard-installed') === '1') return;
        document.body.setAttribute('data-eoz-start-guard-installed', '1');

        document.addEventListener('click', function(e){
            var target = e.target;
            if (!target) return;
            var link = target.closest && target.closest('a');
            if (!link) return;
            var href = link.getAttribute('href') || '';
            var isStartBtn = link.classList.contains('start') || /start_operation_block\//.test(href);
            if (!isStartBtn) return;

            // Skip if already confirmed in this interaction
            if (link.getAttribute('data-eoz-confirmed') === '1') return;

            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();

            var proceed = window.confirm('Czy na pewno chcesz rozpocząć operację na tej maszynie?');
            if (proceed) {
                link.setAttribute('data-eoz-confirmed', '1');
                try {
                    // Navigate explicitly to avoid blocked native handlers
                    window.location.href = href;
                } catch(_) {
                    window.location.assign(href);
                }
            }
        }, true);
    }

    function apply() {
        // Add class to body to scope CSS to this page only
        document.body.classList.add('machines-panel');
        
        hideColumnsDesktop();
        renumberLp();
        insertNotesColumns();
        insertRealizationColumn();
        transformActionButtons();
        buildMobileLayout();
        debugTableStructure();
        modifyScannerBehavior();
        setupDatepickerObserver();
        installStartOperationGuard();
        console.log('[EOZ Machines Panel Module v' + VERSION + '] Applied');
    }

    if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', waitAndRun, { once: true }); } else { waitAndRun(); }
})();


