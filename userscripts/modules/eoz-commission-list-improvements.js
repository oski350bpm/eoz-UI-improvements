// EOZ Commission List Improvements Module
// Applies on /commission/show_list*

(function() {
    'use strict';

    var VERSION = '1.0.3';
    
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
        '.eoz-dropdown-menu{position:absolute!important;top:100%!important;right:0!important;left:auto!important;background:#fff!important;border:1px solid #ddd!important;border-radius:8px!important;box-shadow:0 4px 12px rgba(0,0,0,.15)!important;z-index:1000!important;display:none!important;flex-direction:column!important;overflow:hidden!important;margin-top:4px!important}\n' +
        '.eoz-dropdown-toggle:checked + .eoz-dropdown-label + .eoz-dropdown-menu{display:flex!important}\n' +
        '.eoz-dropdown-toggle:checked + .eoz-dropdown-label{background:#0056b3!important}\n' +
        '.eoz-dropdown-item{display:flex!important;align-items:center!important;gap:12px!important;padding:16px!important;text-decoration:none!important;color:#333!important;border-bottom:1px solid #eee!important;transition:background-color .2s!important;min-height:50px!important;font-size:14px!important}\n' +
        '.eoz-dropdown-item:last-child{border-bottom:none!important}\n' +
        '.eoz-dropdown-item:hover{background:#f8f9fa!important}\n' +
        '.eoz-dropdown-item i{font-size:18px!important;width:20px!important;text-align:center!important}\n' +
        '.eoz-dropdown-container{position:relative!important;width:100%!important}\n' +
        '@media (max-width:1024px){.eoz-dropdown-label{height:70px!important;font-size:18px!important}.eoz-dropdown-item{min-height:60px!important;font-size:16px!important;padding:20px!important}.eoz-dropdown-item i{font-size:20px!important}}\n';

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
        var clientCodeIndex = findColumnIndex('Kod klienta');
        var startDateIndex = findColumnIndex('Data rozpoczęcia');
        if (clientCodeIndex !== -1) {
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
                if (originalLink.onclick) menuItem.onclick = originalLink.onclick;
                menu.appendChild(menuItem);
            }
        });

        container.appendChild(checkbox);
        container.appendChild(label);
        container.appendChild(menu);
        menu.addEventListener('click', function(){ checkbox.checked = false; });
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

    function run() {
        window.EOZ.waitFor('table.dynamic-table tbody tr.body-row', { timeout: 10000 })
            .then(function(){
                hideColumns();
                formatDates();
                transformActionButtons();
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
