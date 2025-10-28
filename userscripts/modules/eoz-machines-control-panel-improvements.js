// EOZ Machines Control Panel Improvements Module
// Applies on /machines/control_panel

(function() {
    'use strict';

    var VERSION = '1.0.3';

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

    var styles = '' +
        'table{width:100%!important;table-layout:auto!important}\n' +
        'table thead th, table tbody td{white-space:normal!important;word-break:break-word!important;overflow-wrap:anywhere!important}\n' +
        'table thead th, table tbody td{padding:6px 8px!important;font-size:13px!important}\n' +
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

    function createDropdownFromActionsCell(actionsCell, uniqueId){
        var container = document.createElement('div');
        container.className = 'eoz-dropdown-container';
        var checkboxId = 'eoz-dropdown-mach-' + uniqueId;
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

    function transformActionButtons(){
        var actionCells = document.querySelectorAll('table tbody tr td:last-child');
        actionCells.forEach(function(cell, index){
            if (cell.querySelectorAll('a').length === 0) return;
            var original = cell.innerHTML; cell.innerHTML = ''; cell.innerHTML = original;
            var dropdown = createDropdownFromActionsCell(cell, index); cell.innerHTML = ''; cell.appendChild(dropdown);
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
            var playLink = actionsCell ? actionsCell.querySelector('a[href*="/machines/control_panel?"]') : null;
            if (!playLink) {
                // fallback: first link in actions
                playLink = actionsCell ? actionsCell.querySelector('a') : null;
            }
            var td = document.createElement('td');
            if (playLink) {
                var btn = playLink.cloneNode(true);
                btn.className = 'eoz-realizacja-btn';
                var icon = btn.querySelector('i');
                btn.innerHTML = icon ? icon.outerHTML : '<i class="fas fa-play"></i>';
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

            var tdKl = document.createElement('td');
            var tdWew = document.createElement('td');
            // Uwagi klienta (send_info)
            if (notesClientLink) {
                var link1 = notesClientLink.cloneNode(true);
                var i1 = link1.querySelector('i');
                link1.innerHTML = i1 ? i1.outerHTML : '<i class="fas fa-comment"></i>';
                tdKl.appendChild(link1);
            } else if (orderId) {
                var a1 = document.createElement('a');
                a1.href = 'https://eoz.iplyty.erozrys.pl/index.php/pl/commission/get_erozrys_order_send_info/' + orderId;
                a1.innerHTML = '<i class="fas fa-comment"></i>';
                tdKl.appendChild(a1);
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
            if (playLink) {
                var btn = playLink.cloneNode(true);
                btn.className = 'eoz-realizacja-btn';
                var icon = btn.querySelector('i'); var iconHTML = icon ? icon.outerHTML : '<i class="fas fa-play"></i>';
                btn.innerHTML = iconHTML;
                actions.appendChild(btn);
            }
            if (notesLink) {
                var nbtn = notesLink.cloneNode(true);
                var nicon = nbtn.querySelector('i'); var nhtml = nicon ? nicon.outerHTML : '<i class="fas fa-comments"></i>';
                nbtn.innerHTML = nhtml + '<span>Uwagi</span>';
                nbtn.classList.add('eoz-realizacja-btn');
                nbtn.style.background = '#ffc107'; nbtn.style.color = '#000';
                actions.appendChild(nbtn);
            }

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

    function apply() {
        // Add class to body to scope CSS to this page only
        document.body.classList.add('machines-panel');
        
        hideColumnsDesktop();
        renumberLp();
        insertNotesColumns();
        insertRealizationColumn();
        transformActionButtons();
        buildMobileLayout();
        console.log('[EOZ Machines Panel Module v' + VERSION + '] Applied');
    }

    if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', waitAndRun, { once: true }); } else { waitAndRun(); }
})();


