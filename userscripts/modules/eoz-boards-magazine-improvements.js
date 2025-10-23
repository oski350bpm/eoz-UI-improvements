// EOZ Boards/Veneers Magazine Improvements Module
// Applies on /machines/control_panel_*_magazine_2020

(function() {
    'use strict';

    var VERSION = '1.0.0';

    if (!window.EOZ) {
        console.warn('[EOZ Boards Magazine Module] Core not available');
        return;
    }

    var url = window.location.href;
    if (url.indexOf('control_panel_boards_magazine_2020') === -1 && url.indexOf('control_panel_veneers_magazine_2020') === -1) {
        return; // not this page
    }

    var styles = '' +
        '.eoz-dropdown-toggle{display:none}\n' +
        '.eoz-dropdown-label{width:100%!important;height:60px!important;background:#007bff!important;color:#fff!important;border:none!important;border-radius:8px!important;font-size:16px!important;font-weight:bold!important;cursor:pointer!important;display:flex!important;align-items:center!important;justify-content:center!important;gap:8px!important;transition:background-color .2s!important;padding:12px!important;box-shadow:0 2px 4px rgba(0,0,0,.1)!important;user-select:none!important}\n' +
        '.eoz-dropdown-label:hover{background:#0056b3!important}\n' +
        '.eoz-dropdown-label:active{background:#004085!important;transform:translateY(1px)!important}\n' +
        '.eoz-dropdown-menu{position:absolute!important;top:100%!important;right:0!important;left:auto!important;min-width:200px!important;max-width:280px!important;background:#fff!important;border:1px solid #ddd!important;border-radius:8px!important;box-shadow:0 4px 12px rgba(0,0,0,.15)!important;z-index:1000!important;display:none!important;flex-direction:column!important;overflow:hidden!important;margin-top:4px!important}\n' +
        '.eoz-dropdown-toggle:checked + .eoz-dropdown-label + .eoz-dropdown-menu{display:flex!important}\n' +
        '.eoz-dropdown-toggle:checked + .eoz-dropdown-label{background:#0056b3!important}\n' +
        '.eoz-dropdown-item{display:flex!important;align-items:center!important;gap:12px!important;padding:16px!important;text-decoration:none!important;color:#333!important;border-bottom:1px solid #eee!important;transition:background-color .2s!important;min-height:50px!important;font-size:14px!important}\n' +
        '.eoz-dropdown-item:last-child{border-bottom:none!important}\n' +
        '.eoz-dropdown-item:hover{background:#f8f9fa!important}\n' +
        '.eoz-dropdown-item i{font-size:18px!important;width:20px!important;text-align:center!important}\n' +
        '.eoz-dropdown-container{position:relative!important;width:100%!important}\n';

    window.EOZ.injectStyles(styles, { id: 'eoz-boards-magazine-module-css' });

    function run() {
        window.EOZ.waitFor('table tbody tr', { timeout: 10000 })
            .then(apply)
            .catch(function(){ console.warn('[EOZ Boards Magazine Module v' + VERSION + '] Table not found'); });
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

        transformActionButtons();
        console.log('[EOZ Boards Magazine Module v' + VERSION + '] Applied');
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
            menuItem.innerHTML = '<i class="' + (icon ? icon.className : '') + '"></i> ' + link.textContent.trim();
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

    if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', run, { once: true }); } else { run(); }
})();
