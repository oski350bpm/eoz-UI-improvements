// EOZ Boards/Veneers Magazine Improvements Module
// Applies on /machines/control_panel_*_magazine_2020

(function() {
    'use strict';

    var VERSION = '1.1.0';

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
        'td:last-child{width:1%!important;white-space:nowrap!important}\n' +
        '@media (max-width:1200px){.eoz-hide-1200{display:none!important}}\n' +
        '@media (max-width:1024px){.eoz-hide-1024{display:none!important}}\n' +
        '@media (max-width:960px){\n' +
        '  table thead{display:none!important}\n' +
        '  table tbody tr td{display:none!important}\n' +
        '  table tbody tr td.eoz-mobile-cell{display:table-cell!important;padding:8px!important}\n' +
        '  .eoz-mobile-grid{display:grid;grid-template-columns:36px 90px 1fr 90px 120px;gap:8px;align-items:start}\n' +
        '  .eoz-m-col1{display:flex;align-items:flex-start;justify-content:center;font-weight:bold}\n' +
        '  .eoz-m-col2{font-weight:bold}\n' +
        '  .eoz-m-col3 div,.eoz-m-col4 div,.eoz-m-col5 div{margin-bottom:6px;font-size:13px}\n' +
        '  .eoz-m-label{color:#666;margin-right:4px}\n' +
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

    function applyResponsiveColumns(){
        var opisIdx = findHeaderIndex('Opis');
        var uwagiIdx = findHeaderIndex('Uwagi');
        if (window.innerWidth <= 1200) hideColumnByIndex(opisIdx, 'eoz-hide-1200');
        if (window.innerWidth <= 1024) hideColumnByIndex(uwagiIdx, 'eoz-hide-1024');
    }

    function apply() {
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

        applyResponsiveColumns();
        window.addEventListener('resize', applyResponsiveColumns);
        
        // Build dropdowns first so we can reuse them in mobile grid
        transformActionButtons();
        
        // Build mobile grid cell per row
        buildMobileLayout();

        console.log('[EOZ Boards Magazine Module v' + VERSION + '] Applied');
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

    function buildMobileLayout(){
        var idxKlient = findHeaderIndex('Klient');
        var idxZlecenie = findHeaderIndex('Zlecenie');
        var idxNazwa = findHeaderIndex('Nazwa zamówienia');
        var idxOkleina = findHeaderIndex('Nazwa okleiny');
        var idxWymiar = findHeaderIndex('Wymiar');
        var idxIlosc = findHeaderIndex('Ilość');
        var idxPrzygot = findHeaderIndex('Przygotowane');
        var idxOpis = findHeaderIndex('Opis');
        var idxUwagi = findHeaderIndex('Uwagi');
        var rows = document.querySelectorAll('table tbody tr');
        rows.forEach(function(row, rIndex){
            if (row.querySelector('td.eoz-mobile-cell')) return; // already built
            var cells = row.querySelectorAll('td');
            if (!cells || cells.length === 0) return;

            var col1Lp = (rIndex + 1).toString();
            var col2Zlec = idxZlecenie >=0 && cells[idxZlecenie] ? (cells[idxZlecenie].textContent||'').trim() : '';
            var klient = idxKlient>=0 && cells[idxKlient] ? (cells[idxKlient].textContent||'').trim() : '';
            var nazwa = idxNazwa>=0 && cells[idxNazwa] ? (cells[idxNazwa].textContent||'').trim() : '';
            var okleina = idxOkleina>=0 && cells[idxOkleina] ? (cells[idxOkleina].textContent||'').trim() : '';
            var wymiar = idxWymiar>=0 && cells[idxWymiar] ? (cells[idxWymiar].textContent||'').trim() : '';
            var ilosc = idxIlosc>=0 && cells[idxIlosc] ? (cells[idxIlosc].textContent||'').trim() : '';
            var przygotowane = (function(){
                if (idxPrzygot>=0 && cells[idxPrzygot]){
                    var checked = cells[idxPrzygot].querySelector('input[type="radio"][checked]');
                    if (checked) { var labelEl = checked.nextSibling; return (labelEl && labelEl.textContent||'Tak').trim(); }
                    // fallback text search
                    var t = (cells[idxPrzygot].textContent||'').trim();
                    if (t.indexOf('Tak')!==-1 && t.indexOf('Nie')!==-1){ return t.indexOf('Tak')<t.indexOf('Nie') ? 'Tak' : 'Nie'; }
                    return t || '—';
                }
                return '';
            })();
            var opis = idxOpis>=0 && cells[idxOpis] ? (cells[idxOpis].textContent||'').trim() : '';
            var uwagi = idxUwagi>=0 && cells[idxUwagi] ? cells[idxUwagi].innerHTML : '';

            var mobileCell = document.createElement('td');
            mobileCell.className = 'eoz-mobile-cell';
            mobileCell.colSpan = cells.length;

            var grid = document.createElement('div');
            grid.className = 'eoz-mobile-grid';

            var col1 = document.createElement('div'); col1.className = 'eoz-m-col1'; col1.textContent = col1Lp;
            var col2 = document.createElement('div'); col2.className = 'eoz-m-col2'; col2.textContent = col2Zlec;

            var col3 = document.createElement('div'); col3.className = 'eoz-m-col3';
            col3.innerHTML = '<div><span class="eoz-m-label">Klient:</span>' + (klient||'—') + '</div>' +
                              '<div><span class="eoz-m-label">Nazwa zamówienia:</span>' + (nazwa||'—') + '</div>' +
                              '<div><span class="eoz-m-label">Płyta:</span>' + (okleina||'—') + '</div>' +
                              '<div><span class="eoz-m-label">Wymiar:</span>' + (wymiar||'—') + '</div>';

            var col4 = document.createElement('div'); col4.className = 'eoz-m-col4';
            col4.innerHTML = '<div><span class="eoz-m-label">Ilość:</span>' + (ilosc||'—') + '</div>' +
                             '<div><span class="eoz-m-label">Przygotowane:</span>' + (przygotowane||'—') + '</div>';

            var col5 = document.createElement('div'); col5.className = 'eoz-m-col5';
            col5.innerHTML = '<div><span class="eoz-m-label">Uwagi klienta:</span>' + (opis||'—') + '</div>' +
                             '<div><span class="eoz-m-label">Uwagi:</span>' + (uwagi||'') + '</div>';

            // Actions: clone dropdown container from last cell if exists
            var lastCell = cells[cells.length-1];
            var dropdown = lastCell ? lastCell.querySelector('.eoz-dropdown-container') : null;
            var actionsWrap = document.createElement('div');
            actionsWrap.className = 'eoz-m-actions';
            if (dropdown) {
                actionsWrap.appendChild(dropdown.cloneNode(true));
            } else {
                // fallback: build minimal button
                actionsWrap.innerHTML = '<a class="eoz-dropdown-label" href="#">Akcje</a>';
            }
            col5.appendChild(actionsWrap);

            grid.appendChild(col1);
            grid.appendChild(col2);
            grid.appendChild(col3);
            grid.appendChild(col4);
            grid.appendChild(col5);

            row.appendChild(mobileCell);
            mobileCell.appendChild(grid);
        });
    }

    if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', run, { once: true }); } else { run(); }
})();
