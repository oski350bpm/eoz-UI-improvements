// EOZ Boards/Veneers Magazine Improvements Module
// Applies on /machines/control_panel_boards_magazine_2020 and control_panel_veneers_magazine_2020

(function() {
    'use strict';

    var VERSION = '2.9.6';
    
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
        '.datepicker table, .datepicker-dropdown table{width:auto!important;table-layout:auto!important}\n' +
        '.datepicker table thead th, .datepicker table tbody td, .datepicker-dropdown table thead th, .datepicker-dropdown table tbody td{white-space:normal!important;word-break:normal!important;overflow-wrap:normal!important;padding:8px!important}\n' +
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
        '  .switch-field input[type="radio"]:checked+label{background:#f06521!important;box-shadow:inset 0 0 0 9999px #f06521!important;color:#fff!important;font-weight:bold!important;border:1px solid #f06521!important}\n' +
        '  table tbody td .switch-field input[type="radio"]:checked+label{background:#f06521!important;box-shadow:inset 0 0 0 9999px #f06521!important;color:#fff!important;font-weight:bold!important;border:1px solid #f06521!important}\n' +
        '  table.table tbody td .switch-field input[type="radio"]:checked+label{background:#f06521!important;box-shadow:inset 0 0 0 9999px #f06521!important;color:#fff!important;font-weight:bold!important;border:1px solid #f06521!important}\n' +
        '}\n' +
        '@media (max-width:960px){\n' +
        '  table thead{display:none!important}\n' +
        '  table tbody tr td:not(.eoz-mobile-cell):not([colspan]){display:none!important}\n' +
        '  table tbody tr td.eoz-mobile-cell{display:table-cell!important;padding:8px!important}\n' +
        '  .datepicker table thead, .datepicker-dropdown table thead{display:table-header-group!important}\n' +
        '  .datepicker table tbody, .datepicker-dropdown table tbody{display:table-row-group!important}\n' +
        '  .datepicker table tbody tr td, .datepicker-dropdown table tbody tr td{display:table-cell!important}\n' +
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
        '  .eoz-m-lp-badge{display:none;color:#666;font-size:11px;line-height:1;margin-bottom:2px}\n' +
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
        '  .eoz-m-details{grid-template-columns:1fr 140px;grid-template-rows:auto auto}\n' +
        '  .eoz-m-col2{grid-column:1;grid-row:1;font-weight:bold;color:#007bff;align-content:center}\n' +
        '  .eoz-m-col3{grid-column:1;grid-row:2;align-content:center}\n' +
        '  .eoz-m-col4{grid-column:2;grid-row:1 / 3;display:flex;flex-direction:column;gap:8px}\n' +
        '  .eoz-m-col5{grid-column:1 / 3;grid-row:3;display:grid;grid-template-columns:repeat(3, 1fr);gap:8px}\n' +
        '}\n' +
        '@media (max-width:500px){\n' +
        '  .eoz-m-details{grid-template-columns:1fr;grid-template-rows:auto auto auto}\n' +
        '  .eoz-m-col3{order:1}\n' +
        '  .eoz-m-col4{order:2;display:flex;flex-direction:column;gap:8px}\n' +
        '  .eoz-m-col5{order:3}\n' +
        '}\n' +
        '.eoz-search-filter-container{width:100%!important;margin-bottom:16px!important;padding:12px!important;background:#f8f9fa!important;border-radius:8px!important;box-shadow:0 2px 4px rgba(0,0,0,.1)!important}\n' +
        '.eoz-search-input{width:100%!important;padding:12px 16px!important;font-size:16px!important;border:2px solid #ddd!important;border-radius:8px!important;box-sizing:border-box!important;transition:border-color .2s!important}\n' +
        '.eoz-search-input:focus{outline:none!important;border-color:#007bff!important}\n' +
        '.eoz-filter-row{display:flex!important;gap:12px!important;margin-top:12px!important;flex-wrap:wrap!important}\n' +
        '.eoz-filter-group{flex:1!important;min-width:150px!important}\n' +
        '.eoz-filter-label{display:block!important;margin-bottom:6px!important;font-size:13px!important;font-weight:600!important;color:#333!important}\n' +
        '.eoz-filter-select{width:100%!important;padding:10px 12px!important;font-size:14px!important;border:2px solid #ddd!important;border-radius:6px!important;box-sizing:border-box!important;background:#fff!important;cursor:pointer!important;transition:border-color .2s!important}\n' +
        '.eoz-filter-select:focus{outline:none!important;border-color:#007bff!important}\n' +
        '.eoz-filter-dropdown{position:relative!important;width:100%!important}\n' +
        '.eoz-filter-dropdown-btn{width:100%!important;padding:12px 16px!important;font-size:14px!important;border:2px solid #ddd!important;border-radius:6px!important;box-sizing:border-box!important;background:#fff!important;cursor:pointer!important;transition:border-color .2s!important;text-align:left!important;min-height:48px!important;display:flex!important;align-items:center!important;justify-content:space-between!important}\n' +
        '.eoz-filter-dropdown-btn:focus,.eoz-filter-dropdown-btn.open{outline:none!important;border-color:#007bff!important}\n' +
        '.eoz-filter-dropdown-btn::after{content:"▼"!important;font-size:12px!important;margin-left:8px!important}\n' +
        '.eoz-filter-dropdown-menu{display:none!important;position:absolute!important;top:100%!important;left:0!important;right:0!important;background:#fff!important;border:2px solid #007bff!important;border-radius:6px!important;box-shadow:0 4px 12px rgba(0,0,0,0.15)!important;z-index:1000!important;max-height:300px!important;overflow-y:auto!important;margin-top:4px!important}\n' +
        '.eoz-filter-dropdown-menu.open{display:block!important}\n' +
        '.eoz-filter-dropdown-item{display:flex!important;align-items:center!important;padding:14px 16px!important;cursor:pointer!important;transition:background-color .2s!important;min-height:48px!important;gap:12px!important;border-bottom:1px solid #f0f0f0!important}\n' +
        '.eoz-filter-dropdown-item:last-child{border-bottom:none!important}\n' +
        '.eoz-filter-dropdown-item:hover{background-color:#f8f9fa!important}\n' +
        '.eoz-filter-dropdown-item input[type="checkbox"]{width:20px!important;height:20px!important;margin:0!important;cursor:pointer!important;flex-shrink:0!important}\n' +
        '.eoz-filter-dropdown-item label{margin:0!important;cursor:pointer!important;flex:1!important;font-size:14px!important;user-select:none!important}\n' +
        '.eoz-filter-dropdown-counter{background:#007bff!important;color:#fff!important;border-radius:12px!important;padding:2px 8px!important;font-size:11px!important;font-weight:600!important;margin-left:auto!important;min-width:20px!important;text-align:center!important}\n' +
        '.eoz-highlight{background-color:#fff3cd!important;padding:2px 4px!important;border-radius:3px!important;font-weight:600!important}\n' +
        '.eoz-filter-reset-btn{padding:10px 20px!important;font-size:14px!important;background:#6c757d!important;color:#fff!important;border:none!important;border-radius:6px!important;cursor:pointer!important;transition:background-color .2s!important;margin-top:auto!important;align-self:flex-end!important}\n' +
        '.eoz-filter-reset-btn:hover{background:#5a6268!important}\n';

    window.EOZ.injectStyles(styles, { id: 'eoz-boards-magazine-module-css' });

    // Search and filter functionality
    var searchFilterState = {
        searchText: '',
        preparedFilter: [],
        clientFilter: [],
        materialFilter: []
    };
    
    var filterSelects = {
        preparedSelect: null,
        clientSelect: null,
        materialSelect: null
    };
    
    var filterDropdowns = {
        prepared: null,
        client: null,
        material: null
    };
    
    function createFilterDropdown(labelText, id, options, onChange) {
        var group = document.createElement('div');
        group.className = 'eoz-filter-group';
        
        var label = document.createElement('label');
        label.className = 'eoz-filter-label';
        label.textContent = labelText;
        
        var dropdown = document.createElement('div');
        dropdown.className = 'eoz-filter-dropdown';
        
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'eoz-filter-dropdown-btn';
        btn.setAttribute('data-filter-id', id);
        
        var btnText = document.createElement('span');
        btnText.textContent = 'Wybierz...';
        btn.appendChild(btnText);
        
        var counter = document.createElement('span');
        counter.className = 'eoz-filter-dropdown-counter';
        counter.style.display = 'none';
        btn.appendChild(counter);
        
        var menu = document.createElement('div');
        menu.className = 'eoz-filter-dropdown-menu';
        
        function updateButtonText() {
            var selected = [];
            var checkboxes = menu.querySelectorAll('input[type="checkbox"]:checked');
            checkboxes.forEach(function(cb) {
                selected.push(cb.value);
            });
            
            if (selected.length === 0) {
                btnText.textContent = 'Wybierz...';
                counter.style.display = 'none';
            } else if (selected.length === 1) {
                var option = menu.querySelector('input[value="' + selected[0] + '"]');
                if (option) {
                    var labelEl = option.parentElement.querySelector('label');
                    btnText.textContent = labelEl ? labelEl.textContent : selected[0];
                }
                counter.style.display = 'none';
            } else {
                btnText.textContent = 'Wybrano ' + selected.length;
                counter.textContent = selected.length;
                counter.style.display = 'inline-block';
            }
        }
        
        function populateOptions(newOptions) {
            menu.innerHTML = '';
            newOptions.forEach(function(option) {
                var item = document.createElement('div');
                item.className = 'eoz-filter-dropdown-item';
                
                var checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.value = option.value;
                checkbox.id = id + '-' + option.value.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '');
                
                var labelEl = document.createElement('label');
                labelEl.htmlFor = checkbox.id;
                labelEl.textContent = option.text;
                
                item.appendChild(checkbox);
                item.appendChild(labelEl);
                
                // Make entire item clickable
                item.addEventListener('click', function(e) {
                    if (e.target !== checkbox && e.target !== labelEl) {
                        checkbox.checked = !checkbox.checked;
                        checkbox.dispatchEvent(new Event('change', { bubbles: true }));
                    }
                });
                
                checkbox.addEventListener('change', function() {
                    updateButtonText();
                    if (onChange) {
                        var selected = [];
                        menu.querySelectorAll('input[type="checkbox"]:checked').forEach(function(cb) {
                            selected.push(cb.value);
                        });
                        onChange(selected);
                    }
                });
                
                menu.appendChild(item);
            });
            updateButtonText();
        }
        
        // Toggle dropdown
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            var isOpen = menu.classList.contains('open');
            
            // Close all other dropdowns
            document.querySelectorAll('.eoz-filter-dropdown-menu.open').forEach(function(m) {
                if (m !== menu) m.classList.remove('open');
                m.parentElement.querySelector('.eoz-filter-dropdown-btn').classList.remove('open');
            });
            
            if (isOpen) {
                menu.classList.remove('open');
                btn.classList.remove('open');
            } else {
                menu.classList.add('open');
                btn.classList.add('open');
            }
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!dropdown.contains(e.target)) {
                menu.classList.remove('open');
                btn.classList.remove('open');
            }
        });
        
        dropdown.appendChild(btn);
        dropdown.appendChild(menu);
        
        group.appendChild(label);
        group.appendChild(dropdown);
        
        // Store reference for updates
        if (id === 'prepared') {
            filterDropdowns.prepared = { group: group, dropdown: dropdown, btn: btn, menu: menu, populate: populateOptions, update: updateButtonText };
        } else if (id === 'client') {
            filterDropdowns.client = { group: group, dropdown: dropdown, btn: btn, menu: menu, populate: populateOptions, update: updateButtonText };
        } else if (id === 'material') {
            filterDropdowns.material = { group: group, dropdown: dropdown, btn: btn, menu: menu, populate: populateOptions, update: updateButtonText };
        }
        
        // Populate initial options if provided
        if (options && options.length > 0) {
            populateOptions(options);
        }
        
        return group;
    }

    function extractRowData(row) {
        var parts = {};
        
        // Check if we have mobile cell (for veneers grouped view or mobile layout)
        var mobileCell = row.querySelector('.eoz-mobile-cell');
        if (mobileCell) {
            // Extract from mobile cell - it has all the data
            var text = mobileCell.textContent || '';
            var lines = text.split(/\s*(?=Klient:|Nazwa zamówienia:|Płyta:|Okleina:|Wymiar:|Ilość:|Przygotowane:|Wprowadź)/);
            
            lines.forEach(function(line) {
                if (line.indexOf('Klient:') === 0) {
                    parts.client = line.replace(/^Klient:\s*/, '').trim().split(/\s*(?=Nazwa zamówienia:|Płyta:|Okleina:)/)[0];
                } else if (line.indexOf('Nazwa zamówienia:') === 0) {
                    parts.orderName = line.replace(/^Nazwa zamówienia:\s*/, '').trim().split(/\s*(?=Płyta:|Okleina:)/)[0];
                } else if (line.indexOf('Płyta:') === 0) {
                    var plateText = line.replace(/^Płyta:\s*/, '').trim();
                    var plateMatch = plateText.match(/^([^0-9]*\d+[^x]*|[A-Z]+[^x]*)/);
                    if (plateMatch) {
                        parts.plate = plateMatch[1].trim();
                    } else {
                        parts.plate = plateText.split(/\s*(?=Wymiar:)/)[0].trim();
                    }
                } else if (line.indexOf('Okleina:') === 0) {
                    var plateText = line.replace(/^Okleina:\s*/, '').trim();
                    var plateMatch = plateText.match(/^([^0-9]*\d+[^x]*|[A-Z]+[^x]*)/);
                    if (plateMatch) {
                        parts.plate = plateMatch[1].trim();
                    } else {
                        parts.plate = plateText.split(/\s*(?=Wymiar:)/)[0].trim();
                    }
                }
            });
        } else {
            // For sub-rows (veneers grouped view), try to get data from previous row
            var cells = row.querySelectorAll('td');
            var isSubRow = cells.length < 6;
            
            // If this looks like a sub-row (few cells), check previous row for data
            var prevRowData = null;
            if (isSubRow) {
                var prevRow = row.previousElementSibling;
                if (prevRow && prevRow.tagName === 'TR') {
                    var prevMobileCell = prevRow.querySelector('.eoz-mobile-cell');
                    if (prevMobileCell) {
                        // Extract basic data from previous row's mobile cell
                        var prevText = prevMobileCell.textContent || '';
                        var prevLines = prevText.split(/\s*(?=Klient:|Nazwa zamówienia:|Płyta:|Okleina:|Wymiar:|Ilość:|Przygotowane:|Wprowadź)/);
                        prevLines.forEach(function(line) {
                            if (line.indexOf('Klient:') === 0 && !parts.client) {
                                parts.client = line.replace(/^Klient:\s*/, '').trim().split(/\s*(?=Nazwa zamówienia:|Płyta:|Okleina:)/)[0];
                            } else if (line.indexOf('Nazwa zamówienia:') === 0 && !parts.orderName) {
                                parts.orderName = line.replace(/^Nazwa zamówienia:\s*/, '').trim().split(/\s*(?=Płyta:|Okleina:)/)[0];
                            }
                        });
                        
                        // Also try to get order code from previous row
                        var prevLink = prevRow.querySelector('a[href*="/commission/show_details/"]');
                        if (prevLink && !parts.orderCode) {
                            var match = prevLink.href.match(/show_details\/(\d+)/);
                            if (match) parts.orderCode = match[1];
                        }
                    } else {
                        // Try to get from desktop cells with rowspan
                        var prevCells = prevRow.querySelectorAll('td');
                        prevCells.forEach(function(cell) {
                            var rowspan = cell.getAttribute('rowspan');
                            if (rowspan && parseInt(rowspan) > 1) {
                                var cellText = (cell.textContent || '').trim();
                                // Check if this is client (long text, no special chars)
                                if (!parts.client && cellText && cellText.length > 5 && 
                                    cellText.indexOf('_') === -1 && cellText.indexOf('/') === -1 &&
                                    !cell.querySelector('a[href*="show_details"]') &&
                                    !cell.querySelector('.switch-field')) {
                                    parts.client = cellText;
                                }
                                // Check if this is order name (contains link to show_details)
                                if (!parts.orderName) {
                                    var orderLink = cell.querySelector('a[href*="show_details"]');
                                    if (orderLink) {
                                        parts.orderName = cellText.replace(/\s+/g, ' ').trim();
                                        var match = orderLink.href.match(/show_details\/(\d+)/);
                                        if (match) parts.orderCode = match[1];
                                    }
                                }
                            }
                        });
                    }
                }
            }
            
            // Try to extract from desktop view (separate cells)
            if (cells.length >= 6 || (!isSubRow && cells.length > 0)) {
                // Desktop view - data in separate cells
                // Find cells by their content patterns
                for (var i = 0; i < cells.length; i++) {
                    var cell = cells[i];
                    var cellText = (cell.textContent || '').trim();
                    
                    // Skip cells with rowspan in grouped view (they're in previous row)
                    if (cell.hasAttribute('rowspan') && parseInt(cell.getAttribute('rowspan')) > 1) {
                        continue;
                    }
                    
                    // Check for client name (usually in cell with text like "J & J Dawid Janowski")
                    if (!parts.client && cellText && !cellText.match(/^\d+$/) && !cellText.match(/szt/) && 
                        !cell.querySelector('.switch-field') && !cell.querySelector('a[href*="show_details"]') &&
                        cellText.length > 5 && cellText.indexOf('_') === -1 && cellText.indexOf('/') === -1) {
                        // This might be client - check if it's not a link cell
                        if (!cell.querySelector('a[href*="commission"]')) {
                            parts.client = cellText;
                        }
                    }
                    
                    // Check for order name (usually contains underscores)
                    if (!parts.orderName && cellText && (cellText.indexOf('_') !== -1 || cellText.match(/^[A-Z]+/))) {
                        var orderLink = cell.querySelector('a[href*="show_details"]');
                        if (orderLink && cellText.length > 5) {
                            parts.orderName = cellText.replace(/\s+/g, ' ').trim();
                        }
                    }
                    
                    // Check for plate/material/veneer (contains material codes like D4033, W1100, U141, H3395, etc.)
                    if (!parts.plate && cellText && (cellText.match(/^[A-Z]\d+/) || cellText.match(/^\d+\s+[A-Z]/) || cellText.match(/^[A-Z][A-Z0-9\s]+\d+/))) {
                        // For veneers, extract full name including thickness (e.g., "H3395 ST12 DĄB CORBRIDGE NATURALNY 1mm")
                        // Try to extract up to "Wymiar:" or dimensions pattern
                        var plateMatch = cellText.match(/^([A-Z]\d+[^x]*|[A-Z]+[^x]*|[A-Z][A-Z0-9\s]+(?:\s+\d+mm)?)/);
                        if (plateMatch) {
                            parts.plate = plateMatch[1].trim();
                        } else {
                            // Fallback: take everything before dimension pattern
                            parts.plate = cellText.split(/\s*(?=\d+x\d+)/)[0].trim();
                        }
                    }
                }
            }
        }
        
        // Fallback: extract from full row text if still missing data
        if (!parts.client || !parts.orderName || !parts.plate) {
            var text = row.textContent || '';
            
            // Support both "Płyta:" (boards) and "Okleina:" (veneers)
            var lines = text.split(/\s*(?=Klient:|Nazwa zamówienia:|Płyta:|Okleina:|Wymiar:|Ilość:|Przygotowane:|Wprowadź)/);
            
            lines.forEach(function(line) {
                if (line.indexOf('Klient:') === 0) {
                    parts.client = line.replace(/^Klient:\s*/, '').trim().split(/\s*(?=Nazwa zamówienia:|Płyta:|Okleina:)/)[0];
                } else if (line.indexOf('Nazwa zamówienia:') === 0) {
                    parts.orderName = line.replace(/^Nazwa zamówienia:\s*/, '').trim().split(/\s*(?=Płyta:|Okleina:)/)[0];
                } else if (line.indexOf('Płyta:') === 0 && !parts.plate) {
                    var plateText = line.replace(/^Płyta:\s*/, '').trim();
                    // Extract just the plate name (before Wymiar:)
                    var plateMatch = plateText.match(/^([^0-9]*\d+[^x]*|[A-Z]+[^x]*)/);
                    if (plateMatch) {
                        parts.plate = plateMatch[1].trim();
                    } else {
                        parts.plate = plateText.split(/\s*(?=Wymiar:)/)[0].trim();
                    }
                } else if (line.indexOf('Okleina:') === 0 && !parts.plate) {
                    var plateText = line.replace(/^Okleina:\s*/, '').trim();
                    // Extract just the veneer name (before Wymiar:)
                    var plateMatch = plateText.match(/^([^0-9]*\d+[^x]*|[A-Z]+[^x]*)/);
                    if (plateMatch) {
                        parts.plate = plateMatch[1].trim();
                    } else {
                        parts.plate = plateText.split(/\s*(?=Wymiar:)/)[0].trim();
                    }
                }
            });
        }
        
        // Extract order code from links (if not already extracted from previous row)
        if (!parts.orderCode) {
            var link = row.querySelector('a[href*="/commission/show_details/"]');
            if (link) {
                var match = link.href.match(/show_details\/(\d+)/);
                if (match) parts.orderCode = match[1];
            }
        }
        var orderCode = parts.orderCode || '';
        
        // Check prepared status
        var preparedRadio = row.querySelector('input[type="radio"][value="1"]');
        var notPreparedRadio = row.querySelector('input[type="radio"][value="0"]');
        var prepared = null;
        if (preparedRadio && preparedRadio.checked) {
            prepared = 'Tak';
        } else if (notPreparedRadio && notPreparedRadio.checked) {
            prepared = 'Nie';
        }
        
        return {
            row: row,
            client: parts.client || '',
            orderName: parts.orderName || '',
            plate: parts.plate || '',
            orderCode: orderCode || '',
            prepared: prepared,
            fullText: (row.textContent || '').toLowerCase(),
            originalText: row.textContent || ''
        };
    }

    function normalizeSearchText(text) {
        // Remove accents and convert to lowercase for fuzzy matching
        return (text || '').toLowerCase()
            .replace(/[ąćęłńóśźż]/g, function(char) {
                var map = {
                    'ą': 'a', 'ć': 'c', 'ę': 'e', 'ł': 'l', 'ń': 'n',
                    'ó': 'o', 'ś': 's', 'ź': 'z', 'ż': 'z'
                };
                return map[char] || char;
            });
    }

    function fuzzyMatch(searchText, targetText) {
        if (!searchText) return true;
        searchText = normalizeSearchText(searchText);
        targetText = normalizeSearchText(targetText);
        
        // Simple substring match (allows partial matches like "160" matching "u160")
        return targetText.indexOf(searchText) !== -1;
    }

    function highlightText(text, searchText) {
        if (!searchText || !text) return text;
        
        var normalizedSearch = normalizeSearchText(searchText);
        var normalizedText = normalizeSearchText(text);
        
        if (normalizedText.indexOf(normalizedSearch) === -1) return text;
        
        // Find all matches in the normalized text and map them back to original text
        // Use character-by-character matching to handle case-insensitive matching properly
        var result = '';
        var textChars = text.split('');
        var normalizedChars = normalizedText.split('');
        var searchChars = normalizedSearch.split('');
        
        var i = 0;
        while (i < textChars.length) {
            // Check if we can match the search text starting at position i
            var canMatch = true;
            for (var j = 0; j < searchChars.length; j++) {
                if (i + j >= normalizedChars.length || normalizedChars[i + j] !== searchChars[j]) {
                    canMatch = false;
                    break;
                }
            }
            
            if (canMatch) {
                // Add highlighted match
                var matchText = '';
                for (var k = 0; k < searchChars.length; k++) {
                    matchText += textChars[i + k];
                }
                result += '<span class="eoz-highlight">' + matchText + '</span>';
                i += searchChars.length;
            } else {
                // Add regular character
                result += textChars[i];
                i++;
            }
        }
        
        return result;
    }

    function applySearchAndFilter() {
        var tbody = document.querySelector('table tbody');
        if (!tbody) return;
        
        var rows = Array.from(tbody.querySelectorAll('tr'));
        var visibleCount = 0;
        
        // Check if we're in veneers grouped view
        var isVeneersGrouped = document.body.hasAttribute('data-veneer') && 
                              rows.length > 0 && 
                              rows[0].querySelector('.eoz-mobile-cell');
        
        rows.forEach(function(row) {
            // Skip sub-rows in veneers grouped view (they don't have mobile cell)
            if (isVeneersGrouped) {
                var hasMobileCell = row.querySelector('.eoz-mobile-cell');
                if (!hasMobileCell) {
                    // Check if this is a sub-row (no rowspan cells)
                    var hasRowspan = false;
                    row.querySelectorAll('td').forEach(function(td) {
                        if (td.hasAttribute('rowspan')) hasRowspan = true;
                    });
                    // Skip sub-rows without rowspan (they're additional veneers)
                    if (!hasRowspan) {
                        row.style.display = 'none';
                        return;
                    }
                }
            }
            
            var rowData = extractRowData(row);
            var matches = true;
            
            // Apply search filter
            if (searchFilterState.searchText) {
                var searchMatches = 
                    fuzzyMatch(searchFilterState.searchText, rowData.client) ||
                    fuzzyMatch(searchFilterState.searchText, rowData.orderName) ||
                    fuzzyMatch(searchFilterState.searchText, rowData.plate) ||
                    fuzzyMatch(searchFilterState.searchText, rowData.orderCode);
                
                if (!searchMatches) {
                    matches = false;
                } else if (searchFilterState.searchText) {
                    // Highlight matching text
                    highlightRowData(row, rowData, searchFilterState.searchText);
                }
            }
            
            // Apply prepared filter (multiselect)
            if (matches && searchFilterState.preparedFilter && searchFilterState.preparedFilter.length > 0) {
                if (searchFilterState.preparedFilter.indexOf(rowData.prepared) === -1) {
                    matches = false;
                }
            }
            
            // Apply client filter (multiselect)
            if (matches && searchFilterState.clientFilter && searchFilterState.clientFilter.length > 0) {
                var clientMatches = false;
                for (var i = 0; i < searchFilterState.clientFilter.length; i++) {
                    if (normalizeSearchText(rowData.client) === normalizeSearchText(searchFilterState.clientFilter[i])) {
                        clientMatches = true;
                        break;
                    }
                }
                if (!clientMatches) {
                    matches = false;
                }
            }
            
            // Apply material filter (multiselect)
            if (matches && searchFilterState.materialFilter && searchFilterState.materialFilter.length > 0) {
                var materialMatches = false;
                for (var j = 0; j < searchFilterState.materialFilter.length; j++) {
                    if (normalizeSearchText(rowData.plate) === normalizeSearchText(searchFilterState.materialFilter[j])) {
                        materialMatches = true;
                        break;
                    }
                }
                if (!materialMatches) {
                    matches = false;
                }
            }
            
            // Show/hide row
            if (matches) {
                row.style.display = '';
                visibleCount++;
                // Remove highlights if no search text
                if (!searchFilterState.searchText) {
                    removeHighlights(row);
                }
            } else {
                row.style.display = 'none';
                removeHighlights(row);
            }
        });
        
        // Update filter options after filtering (delayed to avoid recursion)
        // Only update if filter dropdown elements are initialized
        if (filterDropdowns.client && filterDropdowns.material) {
            setTimeout(function() {
                updateFilterOptions();
            }, 100);
        }
    }

    function highlightRowData(row, rowData, searchText) {
        if (!searchText) return;
        
        // Remove existing highlights first
        removeHighlights(row);
        
        // Highlight text in the row - we'll search for text nodes and highlight them
        var walker = document.createTreeWalker(
            row,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: function(node) {
                    // Skip if parent is script, style, or already has highlight
                    var parent = node.parentNode;
                    if (!parent) return NodeFilter.FILTER_REJECT;
                    if (parent.tagName === 'SCRIPT' || parent.tagName === 'STYLE') return NodeFilter.FILTER_REJECT;
                    if (parent.classList && parent.classList.contains('eoz-highlight')) return NodeFilter.FILTER_REJECT;
                    return NodeFilter.FILTER_ACCEPT;
                }
            },
            false
        );
        
        var nodesToReplace = [];
        var node;
        while (node = walker.nextNode()) {
            var text = node.textContent;
            if (!text || text.trim().length === 0) continue;
            
            var normalizedText = normalizeSearchText(text);
            var normalizedSearch = normalizeSearchText(searchText);
            
            if (normalizedText.indexOf(normalizedSearch) !== -1) {
                nodesToReplace.push({
                    node: node,
                    text: text
                });
            }
        }
        
        nodesToReplace.forEach(function(item) {
            var node = item.node;
            var text = item.text;
            var parent = node.parentNode;
            
            if (parent && parent.tagName !== 'SCRIPT' && parent.tagName !== 'STYLE') {
                var highlighted = highlightText(text, searchText);
                if (highlighted !== text && highlighted.indexOf('<span') !== -1) {
                    // Create document fragment to replace
                    var temp = document.createElement('div');
                    temp.innerHTML = highlighted;
                    
                    // Replace node with fragment contents
                    while (temp.firstChild) {
                        parent.insertBefore(temp.firstChild, node);
                    }
                    parent.removeChild(node);
                }
            }
        });
    }

    function removeHighlights(row) {
        var highlights = row.querySelectorAll('.eoz-highlight');
        highlights.forEach(function(highlight) {
            var parent = highlight.parentNode;
            if (parent) {
                parent.replaceChild(document.createTextNode(highlight.textContent), highlight);
                parent.normalize();
            }
        });
    }

    function createSearchAndFilterUI() {
        var table = document.querySelector('table');
        if (!table) return null;
        
        var container = document.createElement('div');
        container.className = 'eoz-search-filter-container';
        
        // Search input
        var searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.className = 'eoz-search-input';
        searchInput.placeholder = 'Szukaj: Klient, nazwa zamówienia, płyta, numer zlecenia...';
        searchInput.addEventListener('input', eozDebounce(function(event) {
            searchFilterState.searchText = event.target.value;
            applySearchAndFilter();
        }, 300));
        
        // Filter row
        var filterRow = document.createElement('div');
        filterRow.className = 'eoz-filter-row';
        
        // Prepared filter (dropdown with checkboxes)
        var preparedGroup = createFilterDropdown('Przygotowane:', 'prepared', [
            { value: 'Tak', text: 'Tak' },
            { value: 'Nie', text: 'Nie' }
        ], function(selected) {
            searchFilterState.preparedFilter = selected;
            applySearchAndFilter();
            setTimeout(function() {
                updateFilterOptions();
            }, 50);
        });
        
        // Client filter (dropdown with checkboxes)
        var clientGroup = createFilterDropdown('Klient:', 'client', [], function(selected) {
            searchFilterState.clientFilter = selected;
            applySearchAndFilter();
            setTimeout(function() {
                updateFilterOptions();
            }, 50);
        });
        
        // Material filter (dropdown with checkboxes)
        var materialGroup = createFilterDropdown('Materiał:', 'material', [], function(selected) {
            searchFilterState.materialFilter = selected;
            applySearchAndFilter();
            setTimeout(function() {
                updateFilterOptions();
            }, 50);
        });
        
        // Reset button
        var resetBtn = document.createElement('button');
        resetBtn.type = 'button';
        resetBtn.className = 'eoz-filter-reset-btn';
        resetBtn.textContent = 'Wyczyść filtry';
        resetBtn.addEventListener('click', function() {
            searchFilterState.searchText = '';
            searchFilterState.preparedFilter = [];
            searchFilterState.clientFilter = [];
            searchFilterState.materialFilter = [];
            searchInput.value = '';
            // Clear all checkboxes
            if (filterDropdowns.prepared) {
                filterDropdowns.prepared.menu.querySelectorAll('input[type="checkbox"]').forEach(function(cb) {
                    cb.checked = false;
                });
                filterDropdowns.prepared.update();
            }
            if (filterDropdowns.client) {
                filterDropdowns.client.menu.querySelectorAll('input[type="checkbox"]').forEach(function(cb) {
                    cb.checked = false;
                });
                filterDropdowns.client.update();
            }
            if (filterDropdowns.material) {
                filterDropdowns.material.menu.querySelectorAll('input[type="checkbox"]').forEach(function(cb) {
                    cb.checked = false;
                });
                filterDropdowns.material.update();
            }
            applySearchAndFilter();
            // Update filter options after a delay
            setTimeout(function() {
                updateFilterOptions();
            }, 50);
        });
        
        filterRow.appendChild(preparedGroup);
        filterRow.appendChild(clientGroup);
        filterRow.appendChild(materialGroup);
        filterRow.appendChild(resetBtn);
        
        container.appendChild(searchInput);
        container.appendChild(filterRow);
        
        // Populate filter options
        setTimeout(function() {
            populateFilterOptions();
        }, 500);
        
        return container;
    }

    function updateFilterOptions() {
        if (!filterDropdowns.client || !filterDropdowns.material) return;
        
        var tbody = document.querySelector('table tbody');
        if (!tbody) return;
        
        var rows = Array.from(tbody.querySelectorAll('tr'));
        var clients = new Set();
        var materials = new Set();
        
        // Get all rows and filter them based on current filters (except the filter being updated)
        rows.forEach(function(row) {
            var rowData = extractRowData(row);
            var matches = true;
            
            // Apply search filter
            if (matches && searchFilterState.searchText) {
                var searchMatches = 
                    fuzzyMatch(searchFilterState.searchText, rowData.client) ||
                    fuzzyMatch(searchFilterState.searchText, rowData.orderName) ||
                    fuzzyMatch(searchFilterState.searchText, rowData.plate) ||
                    fuzzyMatch(searchFilterState.searchText, rowData.orderCode);
                if (!searchMatches) matches = false;
            }
            
            // Apply prepared filter (for both client and material lists)
            if (matches && searchFilterState.preparedFilter && searchFilterState.preparedFilter.length > 0) {
                if (searchFilterState.preparedFilter.indexOf(rowData.prepared) === -1) {
                    matches = false;
                }
            }
            
            // For client list: apply material filter (so we show only clients that have selected materials)
            if (matches && searchFilterState.materialFilter && searchFilterState.materialFilter.length > 0) {
                var materialMatches = false;
                for (var j = 0; j < searchFilterState.materialFilter.length; j++) {
                    if (normalizeSearchText(rowData.plate) === normalizeSearchText(searchFilterState.materialFilter[j])) {
                        materialMatches = true;
                        break;
                    }
                }
                if (!materialMatches) matches = false;
            }
            
            if (matches) {
                if (rowData.client) clients.add(rowData.client);
            }
        });
        
        // Now build materials set with client filter applied (but not material filter)
        rows.forEach(function(row) {
            var rowData = extractRowData(row);
            var matches = true;
            
            // Apply search filter
            if (matches && searchFilterState.searchText) {
                var searchMatches = 
                    fuzzyMatch(searchFilterState.searchText, rowData.client) ||
                    fuzzyMatch(searchFilterState.searchText, rowData.orderName) ||
                    fuzzyMatch(searchFilterState.searchText, rowData.plate) ||
                    fuzzyMatch(searchFilterState.searchText, rowData.orderCode);
                if (!searchMatches) matches = false;
            }
            
            // Apply prepared filter
            if (matches && searchFilterState.preparedFilter && searchFilterState.preparedFilter.length > 0) {
                if (searchFilterState.preparedFilter.indexOf(rowData.prepared) === -1) {
                    matches = false;
                }
            }
            
            // Apply client filter (for material list)
            if (matches && searchFilterState.clientFilter && searchFilterState.clientFilter.length > 0) {
                var clientMatches = false;
                for (var i = 0; i < searchFilterState.clientFilter.length; i++) {
                    if (normalizeSearchText(rowData.client) === normalizeSearchText(searchFilterState.clientFilter[i])) {
                        clientMatches = true;
                        break;
                    }
                }
                if (!clientMatches) matches = false;
            }
            
            if (matches) {
                if (rowData.plate) materials.add(rowData.plate);
            }
        });
        
        // Get currently selected values before updating
        var selectedClients = [];
        if (filterDropdowns.client) {
            filterDropdowns.client.menu.querySelectorAll('input[type="checkbox"]:checked').forEach(function(cb) {
                selectedClients.push(cb.value);
            });
        }
        
        var selectedMaterials = [];
        if (filterDropdowns.material) {
            filterDropdowns.material.menu.querySelectorAll('input[type="checkbox"]:checked').forEach(function(cb) {
                selectedMaterials.push(cb.value);
            });
        }
        
        // Update client filter options
        if (filterDropdowns.client) {
            var clientOptions = Array.from(clients).sort().map(function(client) {
                return { value: client, text: client };
            });
            filterDropdowns.client.populate(clientOptions);
            // Restore selected values
            selectedClients.forEach(function(value) {
                var checkbox = filterDropdowns.client.menu.querySelector('input[value="' + value.replace(/"/g, '&quot;') + '"]');
                if (checkbox) checkbox.checked = true;
            });
            filterDropdowns.client.update();
        }
        
        // Update material filter options
        if (filterDropdowns.material) {
            var materialOptions = Array.from(materials).sort().map(function(material) {
                return { value: material, text: material };
            });
            filterDropdowns.material.populate(materialOptions);
            // Restore selected values
            selectedMaterials.forEach(function(value) {
                var checkbox = filterDropdowns.material.menu.querySelector('input[value="' + value.replace(/"/g, '&quot;') + '"]');
                if (checkbox) checkbox.checked = true;
            });
            filterDropdowns.material.update();
        }
    }

    function populateFilterOptions() {
        if (!filterDropdowns.client || !filterDropdowns.material) return;
        
        var tbody = document.querySelector('table tbody');
        if (!tbody) return;
        
        var rows = Array.from(tbody.querySelectorAll('tr'));
        var clients = new Set();
        var materials = new Set();
        
        rows.forEach(function(row) {
            var rowData = extractRowData(row);
            if (rowData.client) clients.add(rowData.client);
            if (rowData.plate) materials.add(rowData.plate);
        });
        
        // Populate client filter
        var clientOptions = Array.from(clients).sort().map(function(client) {
            return { value: client, text: client };
        });
        filterDropdowns.client.populate(clientOptions);
        
        // Populate material filter
        var materialOptions = Array.from(materials).sort().map(function(material) {
            return { value: material, text: material };
        });
        filterDropdowns.material.populate(materialOptions);
    }

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

    function findHeaderIndexAny(possibleHeaders){
        if (!possibleHeaders || !possibleHeaders.length) return -1;
        for (var i = 0; i < possibleHeaders.length; i++){
            var idx = findHeaderIndex(possibleHeaders[i]);
            if (idx >= 0) return idx;
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
                th.setAttribute('data-column', className);
                var rows = document.querySelectorAll('table tbody tr');
                rows.forEach(function(row){
                    var cells = row.querySelectorAll('td');
                    if (cells[index]) {
                        cells[index].classList.add(className);
                        cells[index].setAttribute('data-column', className);
                    }
                });
            }
        });
    }

    function applyCommentsTableFormatting() {
        var commentsTable = document.querySelector('table.table.table-borderd.table-condensed.table-md');
        
        if (!commentsTable) {
            return;
        }
        
        var tbody = commentsTable.querySelector('tbody');
        if (!tbody) return;
        
        var rows = Array.from(tbody.querySelectorAll('tr'));
        
        // Create new rows array to replace existing tbody content
        var newRows = [];
        
        rows.forEach(function(row, index) {
            var cells = row.querySelectorAll('td');
            
            if (cells.length === 3) {
                // This is a data row (Data dodania, Tytuł, Dodał)
                var dataText = cells[0].innerHTML; // Data dodania (preserve HTML like <b>)
                var titleText = cells[1].textContent.trim(); // Tytuł
                var authorText = cells[2].textContent.trim(); // Dodał
                
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
    }

    function fixButtonText() {
        // Fix "nie wydanych" to "niewydanych" in button text (boards)
        var button = document.querySelector('#btn-zestawienie-zlecen-niewykonanych');
        if (button) {
            var originalText = button.textContent;
            button.textContent = originalText.replace('nie wydanych', 'niewydanych');
        }
        
        // Fix "nie wydanych" to "niewydanych" in veneers
        var veneersButton = document.querySelector('#btn-zestawienie-zlecen-historia');
        if (veneersButton) {
            var originalText = veneersButton.textContent;
            veneersButton.textContent = originalText.replace('nie wydanych', 'niewydanych');
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

    function debugRadioButtons(){ /* disabled */ }

    function apply() {
        // Debug radio buttons state BEFORE any modifications
        debugRadioButtons('BEFORE_LOAD');
        
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
        
        debugTablesSnapshot('BEFORE_TRANSFORM', { isVeneers: isVeneers, isGrouped: isVeneersGrouped });

        // Header and row modifications
        if (!isVeneersGrouped) {
            // For non-grouped views: Change first header to Lp. and add row numbers
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

            // Row numbers — skip empty/info rows (single cell with colspan)
            var bodyRows = document.querySelectorAll('table tbody tr');
            var lpCounter = 0;
            bodyRows.forEach(function(row){
                var tds = row.querySelectorAll('td');
                if (!tds || tds.length === 0) return;
                if (tds.length === 1 && tds[0].hasAttribute('colspan')) return; // skip info row
                lpCounter++;
                var firstCell = row.querySelector('td:first-child');
                if (firstCell) {
                    firstCell.textContent = lpCounter.toString();
                    firstCell.style.fontWeight = 'bold';
                    firstCell.style.textAlign = 'center';
                }
            });
        } else {
            // For veneers grouped view (/3): Change first header to Lp. and add custom LP numbers
            var headerRow = document.querySelector('table thead tr');
            if (headerRow) {
                var firstHeaderCell = headerRow.querySelector('th:first-child');
                if (firstHeaderCell) {
                    firstHeaderCell.textContent = 'Lp.';
                    var link = firstHeaderCell.querySelector('a');
                    if (link) link.remove();
                }
            }

            // Add custom LP numbers for grouped view (only for main rows with rowspan)
            var bodyRows = document.querySelectorAll('table tbody tr');
            var lpCounter = 0;
            bodyRows.forEach(function(row){
                var cells = row.querySelectorAll('td');
                if (!cells || cells.length === 0) return;
                
                // Check if this is a main row (has rowspan)
                var hasRowspan = false;
                cells.forEach(function(cell){
                    if (cell.hasAttribute('rowspan')) hasRowspan = true;
                });
                
                if (hasRowspan) {
                    lpCounter++;
                    var firstCell = row.querySelector('td:first-child');
                    if (firstCell) {
                        firstCell.textContent = lpCounter.toString();
                        firstCell.style.fontWeight = 'bold';
                        firstCell.style.textAlign = 'center';
                    }
                }
            });
        }
        
        // For veneers: tag and potentially hide columns using CSS (works for all veneers views including /3)
        if (isVeneers) {
            tagColumnByHeader('Data', 'data');
            tagColumnByHeader('Lp', 'lp');
        }

        // Desktop snapshot (before any replacements) – clear, value-focused
        debugDesktopSnapshot('DESKTOP_BEFORE', { isVeneers: isVeneers, isGrouped: isVeneersGrouped });

        // Pre-map veneer names early (in case przestawianie kolumn nadpisze teksty)
        if (isVeneers) {
            try { replaceVeneerCodesWithNames(isVeneersGrouped); } catch(_) {}
        }

        // Fix grouped view switches: if main row has empty Przygotowane cell, copy from first sub-row
        // (Grouped view retains original switches per veneer row)

        // Desktop: reorder columns to align with Machines Panel layout (non-grouped only)
        if (!isVeneersGrouped && window.innerWidth > 960) {
            try { reorderColumnsDesktop(isVeneers); } catch(_) {}
        }

        // If veneers, replace code in "Nazwa okleiny" with full name from commission page
        if (isVeneers) {
            try { replaceVeneerCodesWithNames(isVeneersGrouped); } catch(_) {}
            // Schedule additional passes to catch async DOM updates
            setTimeout(function(){ try { replaceVeneerCodesWithNames(isVeneersGrouped); } catch(_) {} }, 0);
            setTimeout(function(){ try { replaceVeneerCodesWithNames(isVeneersGrouped); } catch(_) {} }, 250);
        }

        // Build dropdowns first so we can reuse them in mobile grid
        transformActionButtons();
        
        // Debug radio buttons state BEFORE building mobile layout
        debugRadioButtons('BEFORE_MOBILE_BUILD');
        
        // Build mobile grid cell per row
        if (isVeneersGrouped) {
            buildMobileLayoutVeneersGrouped();
        } else {
            buildMobileLayout();
        }

        // Debug radio buttons state AFTER building mobile layout
        debugRadioButtons('AFTER_MOBILE_BUILD');
        debugTablesSnapshot('AFTER_MOBILE_BUILD', { isVeneers: isVeneers, isGrouped: isVeneersGrouped });
        debugMobileSnapshot('MOBILE_AFTER', { isVeneers: isVeneers, isGrouped: isVeneersGrouped });

        normalizeRadioButtons();
        observeRadioMutations();
        installGlobalRadioSync();

        // Post-render ensure switches for grouped view (retry and observe DOM changes)
        // Keep original switch layout for grouped view (sub-rows only)

        // Debug radio buttons state
        debugRadioButtons('AFTER_LOAD');

        console.log('[EOZ Boards Magazine Module v' + VERSION + '] Applied');
        
        // Add search and filter UI
        try {
            var searchFilterUI = createSearchAndFilterUI();
            if (searchFilterUI) {
                var table = document.querySelector('table');
                if (table && table.parentNode) {
                    table.parentNode.insertBefore(searchFilterUI, table);
                }
            }
        } catch (e) {
            console.error('[EOZ Boards Magazine Module] Error creating search/filter UI:', e);
        }
        
        // Watch for dynamically loaded comments tables
        watchForCommentsTable();
    }

    function debugTablesSnapshot(phase, meta){
        try {
            var table = document.querySelector('table');
            if (!table) { console.warn('[EOZ Mag Debug]', phase, 'no table'); return; }
            var headers = Array.from(table.querySelectorAll('thead th')).map(function(th){ return (th.textContent||'').trim(); });

            var tbodyRows = Array.from(table.querySelectorAll('tbody tr'));
            var diag = [];
            tbodyRows.forEach(function(tr, idx){
                var isInfo = !!tr.querySelector('th[colspan]');
                var tds = Array.from(tr.querySelectorAll('td'));
                var hasRowspan = tds.some(function(td){ return td.hasAttribute('rowspan'); });
                var isSubRowCandidate = !isInfo && !hasRowspan && tds.length > 0 && tds.length <= 4; // /3 sub-rows
                var codeCell = null;
                // try to infer veneer code cell
                for (var i=0;i<tds.length;i++){
                    var td = tds[i];
                    if (td.getAttribute && td.getAttribute('title')) { codeCell = td; break; }
                }
                if (!codeCell && tds.length){ codeCell = tds[0]; }
                var title = codeCell ? (codeCell.getAttribute('title')||'') : '';
                var text = codeCell ? (codeCell.textContent||'').trim() : '';
                var radioCell = tds.find(function(td){ return !!td.querySelector('.switch-field'); });
                var link = tr.querySelector('a[href*="/commission/show_details/"]') || tr.querySelector('a[href*="/commission/generate_page/"]');
                diag.push({
                    idx: idx+1,
                    infoRow: isInfo,
                    mainRow: hasRowspan,
                    subRow: isSubRowCandidate,
                    cells: tds.length,
                    code_title: title,
                    code_text: text,
                    hasSwitch: !!radioCell,
                    link: link ? link.href.split('/').slice(-1)[0] : ''
                });
            });

            console.groupCollapsed('[EOZ Mag Debug]', phase, meta||{});
            console.log('headers:', headers);
            console.table(diag.slice(0, 30));
            console.groupEnd();
        } catch (e) {
            console.error('[EOZ Mag Debug] error', e);
        }
    }

    function debugDesktopSnapshot(label, meta){
        try {
            var idxKlient = findHeaderIndexAny(['Klient']);
            var idxZlecenie = findHeaderIndexAny(['Zlecenie']);
            var idxNazwa = findHeaderIndexAny(['Nazwa zamówienia']);
            var idxOkleina = findHeaderIndexAny(['Nazwa okleiny','Okleina']);
            var idxWymiar = findHeaderIndexAny(['Wymiar']);
            var idxIlosc = findHeaderIndexAny(['Ilość']);
            var idxPrzygot = findHeaderIndexAny(['Przygotowane']);
            var rows = Array.from(document.querySelectorAll('table tbody tr'));
            var out = [];
            rows.forEach(function(tr, i){
                var info = !!tr.querySelector('th[colspan]');
                if (info) return;
                var tds = tr.querySelectorAll('td');
                if (!tds || !tds.length) return;
                function val(idx){ return (idx>=0 && tds[idx]) ? (tds[idx].textContent||'').trim() : ''; }
                var link = tr.querySelector('a[href*="/commission/show_details/"]');
                out.push({
                    row: i+1,
                    klient: val(idxKlient),
                    zlecenie: (idxZlecenie>=0 && tds[idxZlecenie] && tds[idxZlecenie].textContent||'').trim(),
                    nazwa: val(idxNazwa),
                    okleina_text: val(idxOkleina),
                    okleina_title: (idxOkleina>=0 && tds[idxOkleina] ? (tds[idxOkleina].getAttribute('title')||'') : ''),
                    wymiar: val(idxWymiar),
                    ilosc: val(idxIlosc),
                    hasSwitch: !!(idxPrzygot>=0 && tds[idxPrzygot] && tds[idxPrzygot].querySelector && tds[idxPrzygot].querySelector('.switch-field')),
                    link: link ? link.href.split('/').slice(-1)[0] : ''
                });
            });
            console.groupCollapsed('[EOZ Mag Desktop]', label, meta||{});
            console.table(out.slice(0,30));
            console.groupEnd();
        } catch(e){ console.error('[EOZ Mag Desktop] error', e); }
    }

    function debugMobileSnapshot(label, meta){
        try {
            var mobiles = Array.from(document.querySelectorAll('td.eoz-mobile-cell'));
            var out = mobiles.map(function(td, i){
                function pick(lbl){
                    var el = Array.from(td.querySelectorAll('.eoz-m-label')).find(function(s){ return (s.textContent||'').toLowerCase().indexOf(lbl) !== -1; });
                    if (!el) return '';
                    var container = el.parentElement;
                    var text = (container.textContent||'').replace(/^[^:]+:\s*/,'').trim();
                    return text;
                }
                var zlec = td.querySelector('.eoz-m-zlecenie a');
                return {
                    row: i+1,
                    zlecenie: zlec ? (zlec.textContent||'').trim() : '',
                    klient: pick('klient'),
                    nazwa: pick('nazwa zam'),
                    okleina: pick('okleina'),
                    wymiar: pick('wymiar'),
                    ilosc: pick('ilość')
                };
            });
            console.groupCollapsed('[EOZ Mag Mobile]', label, meta||{});
            console.table(out.slice(0,30));
            console.groupEnd();
        } catch(e){ console.error('[EOZ Mag Mobile] error', e); }
    }

    function reorderColumnsDesktop(isVeneers){
        var headerRow = document.querySelector('table thead tr');
        if (!headerRow) return;
        var headers = Array.from(headerRow.querySelectorAll('th'));
        if (headers.length === 0) return;

        // Build desired order similar to Machines Panel
        // Common
        var idxLp0 = 0; // after earlier step first column is LP.
        var idxZlec = findHeaderIndex('Zlecenie');
        var idxKlient = findHeaderIndex('Klient');
        var idxNazwa = findHeaderIndex('Nazwa zamówienia');
        var idxIlosc = findHeaderIndex('Ilość');
        var idxPrzygot = findHeaderIndex('Przygotowane');
        var idxOpis = isVeneers ? findHeaderIndex('Opis') : findHeaderIndexAny(['Uwagi klienta','Opis']);
        var idxUwagi = findHeaderIndexAny(['Uwagi','Uwagi wewnętrzne']);
        var idxOpcje = findHeaderIndex('Opcje');

        var materialIndexes = [];
        if (isVeneers){
            materialIndexes = [ findHeaderIndex('Nazwa okleiny'), findHeaderIndex('Wymiar') ];
        } else {
            materialIndexes = [ findHeaderIndex('Płyta i wymiar') ];
        }

        // Compose final order, filter out -1
        var order = [ idxLp0, idxZlec, idxKlient, idxNazwa ]
            .concat(materialIndexes)
            .concat([ idxIlosc, idxPrzygot, idxOpis, idxUwagi, idxOpcje ])
            .filter(function(i){ return typeof i === 'number' && i >= 0; });

        // If order seems invalid, bail
        if (order.length < 4) return;

        // Reorder header
        var ths = Array.from(headerRow.children);
        var fragH = document.createDocumentFragment();
        order.forEach(function(i){ if (ths[i]) fragH.appendChild(ths[i]); });
        headerRow.appendChild(fragH);

        // Reorder every row
        var rows = document.querySelectorAll('table tbody tr');
        rows.forEach(function(row){
            var tds = Array.from(row.children);
            if (!tds || tds.length === 0) return;
            // Skip info rows
            if (tds.length === 1 && tds[0].hasAttribute('colspan')) return;
            var frag = document.createDocumentFragment();
            order.forEach(function(i){ if (tds[i]) frag.appendChild(tds[i]); });
            row.appendChild(frag);
        });
    }

    function normalizeGroupedSwitches(){}

    // Cache for commission -> veneer map { code -> fullName }
    var veneerMapCache = {};

    function extractCommissionIdFromRow(row){
        if (!row) return null;
        // Look for links in this row first (Opcje or Zlecenie)
        var link = row.querySelector('a[href*="/commission/generate_page/"]') ||
                   row.querySelector('a[href*="/commission/show_details/"]');
        if (link && link.href){
            var m = link.href.match(/\/(generate_page|show_details)\/(\d+)/);
            if (m) return m[2];
        }
        return null;
    }

    function fetchVeneersMapForCommission(commissionId){
        return new Promise(function(resolve, reject){
            if (!commissionId) { reject(new Error('No commissionId')); return; }
            if (veneerMapCache[commissionId]) { resolve(veneerMapCache[commissionId]); return; }
            var xhr = new XMLHttpRequest();
            xhr.open('GET', '/index.php/pl/commission/generate_page/' + commissionId, true);
            xhr.onload = function(){
                if (xhr.status !== 200) { reject(new Error('HTTP '+xhr.status)); return; }
                try {
                    var parser = new DOMParser();
                    var doc = parser.parseFromString(xhr.responseText, 'text/html');
                    var map = {};
                    // Find the "Okleiny" table: header text and subsequent table
                    var h2s = Array.from(doc.querySelectorAll('h2'));
                    var veneersHeader = h2s.find(function(h){ return (h.textContent||'').trim().toLowerCase() === 'okleiny'; });
                    var table = veneersHeader ? veneersHeader.nextElementSibling : null;
                    if (!table || table.tagName !== 'TABLE') {
                        // fallback: any table with headings containing "Nazwa okleiny"
                        table = Array.from(doc.querySelectorAll('table')).find(function(t){
                            var ths = Array.from(t.querySelectorAll('thead th'));
                            return ths.some(function(th){ return (th.textContent||'').trim().toLowerCase().indexOf('nazwa okleiny') !== -1; });
                        });
                    }
                    if (table){
                        var rows = Array.from(table.querySelectorAll('tbody tr'));
                        rows.forEach(function(tr){
                            var tds = tr.querySelectorAll('td');
                            if (tds.length >= 2){
                                var code = (tds[0].textContent||'').trim();
                                var name = (tds[1].textContent||'').trim();
                                if (code && name) { map[code] = name; }
                            }
                        });
                    }
                    veneerMapCache[commissionId] = map;
                    resolve(map);
                } catch(e){ reject(e); }
            };
            xhr.onerror = function(){ reject(new Error('Network error')); };
            xhr.send();
        });
    }

    function fetchOrderName(commissionId){
        return new Promise(function(resolve){
            if (!commissionId) { resolve(''); return; }
            var xhr = new XMLHttpRequest();
            xhr.open('GET', '/index.php/pl/commission/show_details/' + commissionId, true);
            xhr.onload = function(){
                try {
                    var txt = xhr.responseText || '';
                    // Try simple regex near label "Nazwa zamówienia"
                    var m = txt.match(/Nazwa\s+zam\w*?\s*:<\/[^>]+>\s*([^<\n]+)/i);
                    if (m && m[1]) { resolve(m[1].trim()); return; }
                } catch(_) {}
                resolve('');
            };
            xhr.onerror = function(){ resolve(''); };
            xhr.send();
        });
    }

    function replaceVeneerCodesWithNames(isGrouped){
        // Support both headers used across views
        var idxNazwaOkleiny = findHeaderIndex('Nazwa okleiny');
        if (idxNazwaOkleiny < 0) {
            idxNazwaOkleiny = findHeaderIndex('Okleina');
        }
        if (idxNazwaOkleiny < 0) return;
        var rows = Array.from(document.querySelectorAll('table tbody tr'));
        if (rows.length === 0) return;

        var pending = [];
        var currentCommissionId = null;

        rows.forEach(function(row){
            var cells = row.querySelectorAll('td');
            if (!cells || cells.length === 0) return;

            // Grouped sub-rows have fewer cells and no links; keep last main-row commission id
            var commissionIdInRow = extractCommissionIdFromRow(row);
            if (commissionIdInRow) currentCommissionId = commissionIdInRow;
            var commissionId = currentCommissionId || commissionIdInRow;

            // Pick target cell with veneer code
            var targetCell = null;
            if (isGrouped) {
                // In grouped view, sub-rows contain only veneer columns: Okleina | Wymiar | Ilość | Przygotowane
                // Main rows keep full structure, so idxNazwaOkleiny applies there; sub-rows use index 0
                var hasRowspan = false;
                cells.forEach(function(c){ if (c.hasAttribute('rowspan')) hasRowspan = true; });
                if (hasRowspan) {
                    targetCell = cells[idxNazwaOkleiny] || null;
                } else {
                    // sub-row
                    targetCell = cells[0] || null;
                }
            } else {
                // Non-grouped view
                targetCell = cells[idxNazwaOkleiny] || null;
                if (!targetCell && cells.length <= 4) {
                    targetCell = cells[0] || null;
                }
            }
            if (!targetCell) return;

            // Prefer code from title attribute if present; fallback to trimmed text (first token)
            var titleCode = (targetCell.getAttribute && targetCell.getAttribute('title')) || '';
            var cellText = (targetCell.textContent||'').trim();
            var code = titleCode || (cellText.split(/\s+/)[0] || '');
            if (!code || !commissionId) return;

            pending.push(
                fetchVeneersMapForCommission(commissionId).then(function(map){
                    var name = map && map[code];
                    if (!name) return;
                    // Replace visible text with full name; keep code as title for reference
                    targetCell.textContent = name;
                    targetCell.setAttribute('title', code);

                    // Also update our custom mobile layouts if already rendered for this row
                    try {
                        var mobileCell = row.querySelector('td.eoz-mobile-cell');
                        if (mobileCell) {
                            // Replace any element that has exact text equal to the code
                            var nodes = mobileCell.querySelectorAll('*');
                            nodes.forEach(function(el){
                                if (el.childNodes && el.childNodes.length === 1 && el.childNodes[0].nodeType === 3) {
                                    var t = (el.textContent||'').trim();
                                    if (t === code) {
                                        el.textContent = name;
                                        el.setAttribute('title', code);
                                    }
                                }
                            });
                            // Additionally, in non-grouped view the okleina is within .eoz-m-col3 after label
                            var col3 = mobileCell.querySelector('.eoz-m-col3');
                            if (col3 && col3.innerHTML.indexOf('Okleina:') !== -1) {
                                col3.innerHTML = col3.innerHTML.replace('>'+code+'<', '>'+name+'<');
                            }
                        }
                    } catch(_) {}
                }).catch(function(){ /* ignore row-level errors */ })
            );
        });

        // Best-effort; no need to await in UI thread
        Promise.allSettled(pending).then(function(){ /* noop */ });
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
        // Header indices for veneers /3: Data | Klient | Zlecenie | Lp | Okleina | Wymiar | Ilość | Przygotowane | Opis | Uwagi | Opcje
        var idxData = findHeaderIndex('Data');
        var idxKlient = findHeaderIndex('Klient');
        var idxZlecenie = findHeaderIndex('Zlecenie');
        var idxLp = findHeaderIndex('Lp');
        var idxOkleina = findHeaderIndex('Okleina');
        var idxWymiar = findHeaderIndex('Wymiar');
        var idxIlosc = findHeaderIndex('Ilość');
        var idxPrzygot = findHeaderIndex('Przygotowane');
        var idxOpis = findHeaderIndexAny(['Opis','Uwagi klienta']);
        var idxUwagi = findHeaderIndexAny(['Uwagi','Uwagi wewnętrzne']);
        
        var rows = document.querySelectorAll('table tbody tr');
        var orderCount = 0;
        
        if (rows.length === 0) {
            return;
        }
        
        rows.forEach(function(row, rIndex){
            if (row.querySelector('td.eoz-mobile-cell')) return; // already built
            var cells = row.querySelectorAll('td');
            if (!cells || cells.length === 0) return;
            
            // Skip grouping rows (date headers with colspan)
            var firstCell = row.querySelector('th[colspan], td[colspan]');
            if (firstCell && parseInt(firstCell.getAttribute('colspan')) > 1) {
                return;
            }
            
            // Detect main row (with rowspan) vs sub-row (additional veneers)
            var hasRowspan = false;
            cells.forEach(function(cell){
                if (cell.hasAttribute('rowspan')) hasRowspan = true;
            });
            
            if (!hasRowspan) {
                // This is a sub-row (additional veneer) - skip it, we'll handle it with the main row
                return;
            }
            
            // This is a main row - collect all veneers for this order
            orderCount++;
            
            var data = orderCount.toString();
            var klient = cells[idxKlient] ? (cells[idxKlient].textContent||'').trim() : '';
            
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
            
            // First veneer from main row - use innerHTML for mobile
            var veneer1 = {
                okleina: cells[idxOkleina] ? (cells[idxOkleina].textContent||'').trim() : '',
                wymiar: cells[idxWymiar] ? (cells[idxWymiar].textContent||'').trim() : '',
                ilosc: cells[idxIlosc] ? (cells[idxIlosc].textContent||'').trim() : '',
                przygotowaneHTML: cells[idxPrzygot] ? cells[idxPrzygot].innerHTML : ''
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
                var radioCell = null;
                for (var rc=0; rc<nextCells.length; rc++){
                    if (nextCells[rc].querySelector && nextCells[rc].querySelector('.switch-field')) { radioCell = nextCells[rc]; break; }
                }
                var veneerSub = {
                    okleina: nextCells[0] ? (nextCells[0].textContent||'').trim() : '',
                    wymiar: nextCells[1] ? (nextCells[1].textContent||'').trim() : '',
                    ilosc: nextCells[2] ? (nextCells[2].textContent||'').trim() : '',
                    przygotowaneHTML: radioCell ? radioCell.innerHTML : (nextCells[3] ? nextCells[3].innerHTML : '')
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
            grid.className = 'eoz-mobile-grid eoz-mp-grid';

            // Header: Data + Zlecenie
            var header = document.createElement('div');
            header.className = 'eoz-m-header eoz-mp-header';
            
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
            // Add inline LP to this cell
            var lpInline = document.createElement('span');
            lpInline.textContent = 'LP. ' + data + ' ';
            col2.insertBefore(lpInline, col2.firstChild);

            var col3 = document.createElement('div'); 
            col3.className = 'eoz-m-col3';
            col3.innerHTML = '<div><span class="eoz-m-label">Klient:</span><br>' + (klient||'—') + '</div>' +
                              '<div><span class="eoz-m-label">Nazwa zamówienia:</span><br>—</div>';

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
                
                // Add okleina, wymiar, ilosc
                var okleinaDiv = document.createElement('div');
                okleinaDiv.style.fontWeight = 'bold';
                okleinaDiv.textContent = veneer.okleina || '—';
                veneerItem.appendChild(okleinaDiv);
                
                var wymiarDiv = document.createElement('div');
                wymiarDiv.innerHTML = '<span class="eoz-m-label">Wymiar:</span> ' + (veneer.wymiar || '—');
                veneerItem.appendChild(wymiarDiv);
                
                var iloscDiv = document.createElement('div');
                iloscDiv.innerHTML = '<span class="eoz-m-label">Ilość:</span> ' + (veneer.ilosc || '—');
                veneerItem.appendChild(iloscDiv);
                
                // Add przygotowane with innerHTML and fix duplicate IDs
                var przygDiv = document.createElement('div');
                przygDiv.style.marginTop = '4px';
                przygDiv.innerHTML = '<span class="eoz-m-label">Przygotowane:</span><br>' + veneer.przygotowaneHTML;
                
                // Fix duplicate radio button IDs and names by adding -mobile-v suffix
                var mobileRadios = przygDiv.querySelectorAll('input[type="radio"]');
                mobileRadios.forEach(function(radio){
                    if (radio.id) {
                        var oldId = radio.id;
                        radio.id = oldId + '-mobile-v' + idx;
                        // Update corresponding label
                        var label = przygDiv.querySelector('label[for="' + oldId + '"]');
                        if (label) {
                            label.setAttribute('for', radio.id);
                        }
                    }
                    if (radio.name) {
                        radio.name = radio.name + '-mobile-v' + idx;
                    }
                });
                
                veneerItem.appendChild(przygDiv);
                
                veneersDiv.appendChild(veneerItem);
            });
            
            col4.appendChild(veneersDiv);

            var col5 = document.createElement('div'); 
            col5.className = 'eoz-m-col5 eoz-mp-actions';
            
            // Actions dropdown
            var lastCell = cells[cells.length-1];
            if (lastCell) {
                var originalLinks = lastCell.querySelectorAll('a');
                if (originalLinks.length > 0) {
                    var actionsWrapper = document.createElement('div');
                    actionsWrapper.className = 'eoz-m-col5-item';
                    var actionsBtn = createActionDropdown(originalLinks, 'mobile-veneers-' + orderCount);
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

            // Async enrichments for grouped view: order name and veneer names mapping
            try {
                var commissionId = (zlecenieLink && zlecenieLink.match(/(\d+)$/)) ? zlecenieLink.match(/(\d+)$/)[1] : null;
                if (commissionId) {
                    fetchOrderName(commissionId).then(function(name){
                        if (name) {
                            var nameRow = col3.querySelectorAll('div')[1];
                            if (nameRow) nameRow.innerHTML = '<span class="eoz-m-label">Nazwa zamówienia:</span><br>' + name;
                        }
                    });
                    fetchVeneersMapForCommission(commissionId).then(function(map){
                        if (!map) return;
                        // Replace displayed veneer codes
                        var bolds = veneersDiv.querySelectorAll('div[style*="font-weight: bold"]');
                        bolds.forEach(function(b){
                            var code = (b.textContent||'').trim().split(/\s+/)[0];
                            if (map[code]) { b.textContent = map[code]; }
                        });
                    });
                }
            } catch(_) {}
        });
    }

    function buildMobileLayout(){

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
            // Veneers: skip sub-rows that only contain veneer lines (usually 4 cells, no details link)
            if (isVeneers && !isGroupedView) {
                var looksLikeSubRow = cells.length <= 4 && !row.querySelector('a[href*="/commission/show_details/"]');
                if (looksLikeSubRow) return;
            }
            
            // Skip rows that only have a single cell with colspan (empty/separator rows)
            if (cells.length === 1) {
                if (cells[0].hasAttribute('colspan')) {
                    var colspanValue = parseInt(cells[0].getAttribute('colspan'));
                    if (colspanValue > 1) {
                        return;
                    }
                }
                // Skip grouping rows (e.g., date headers in veneers /3 view)
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
            
            // Przygotowane: use innerHTML for mobile (doesn't affect desktop radio buttons)
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
            lpDiv.className = 'eoz-m-lp eoz-mp-lp';
            lpDiv.textContent = 'Lp. ' + col1Lp;
            
            var zlecenieDiv = document.createElement('div');
            zlecenieDiv.className = 'eoz-m-zlecenie eoz-mp-zlec';
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
            details.className = 'eoz-m-details eoz-mp-details';

            var col3 = document.createElement('div'); col3.className = 'eoz-m-col3 eoz-mp-info';
            col3.innerHTML = '<div><span class="eoz-m-label">Klient:</span><br>' + (klient||'—') + '</div>' +
                              '<div><span class="eoz-m-label">Nazwa zamówienia:</span><br>' + (nazwa||'—') + '</div>' +
                              '<div><span class="eoz-m-label">' + materialLabel + ':</span><br>' + (plyta||'—') + '</div>' +
                              '<div><span class="eoz-m-label">Wymiar:</span><br>' + (wymiar||'—') + '</div>';

            // Clone edit button from original cell (don't remove from original!)
            var editButton = null;
            
            if (przygotowaneCell){
                // Find and clone the edit button (don't modify original cell)
                var originalEditBtn = przygotowaneCell.querySelector('a.change-amount-manual');
                if (originalEditBtn) {
                    editButton = originalEditBtn.cloneNode(true);
                    // Copy onclick handler if it exists
                    if (originalEditBtn.onclick) {
                        editButton.onclick = originalEditBtn.onclick;
                    }
                }
            }
            
            var col4 = document.createElement('div'); 
            col4.className = 'eoz-m-col4 eoz-mp-info';
            
            // Row 1: Ilość
            var iloscRow = document.createElement('div');
            iloscRow.innerHTML = '<span class="eoz-m-label">Ilość:</span><br>' + (ilosc||'—');
            col4.appendChild(iloscRow);
            
            // Row 2: Przygotowane (radio buttons) - use innerHTML and fix duplicate IDs
            var przygotowaneRow = document.createElement('div');
            przygotowaneRow.style.marginTop = '8px';
            przygotowaneRow.innerHTML = '<span class="eoz-m-label">Przygotowane:</span><br>' + przygotowaneHTML;
            
            // Fix duplicate radio button IDs and names by adding -mobile suffix
            var mobileRadios = przygotowaneRow.querySelectorAll('input[type="radio"]');
            mobileRadios.forEach(function(radio){
                if (radio.id) {
                    var oldId = radio.id;
                    radio.id = oldId + '-mobile';
                    // Update corresponding label
                    var label = przygotowaneRow.querySelector('label[for="' + oldId + '"]');
                    if (label) {
                        label.setAttribute('for', radio.id);
                    }
                }
                if (radio.name) {
                    radio.name = radio.name + '-mobile';
                }
            });

            // Remove inline edit button copied inside przygotowaneHTML to avoid duplicates
            var inlineEditBtn = przygotowaneRow.querySelector('a.change-amount-manual');
            if (inlineEditBtn) {
                inlineEditBtn.parentElement && inlineEditBtn.parentElement.removeChild(inlineEditBtn);
            }
            
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

            var col5 = document.createElement('div'); col5.className = 'eoz-m-col5 eoz-mp-actions';
            
            // 1. Actions dropdown (first)
            var lastCell = cells[cells.length-1];
            if (lastCell) {
                var originalLinks = lastCell.querySelectorAll('a');
                if (originalLinks.length > 0) {
                    var actionsWrapper = document.createElement('div');
                    actionsWrapper.className = 'eoz-m-col5-item';
                    var actionsBtn = createActionDropdown(originalLinks, 'mobile-mag-' + rIndex);
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

            // Prepare col1 and col2 ONLY for tablet view (501–960px). On small mobile, LP should appear only in header.
            grid.appendChild(header);
            if (window.innerWidth >= 501 && window.innerWidth <= 960) {
                var col2 = document.createElement('div'); 
                col2.className = 'eoz-m-col2';
                // LP removed from separate column; optionally prepend badge inside the same cell as order number if needed
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
                details.appendChild(col2);
            }
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
        
        menu.addEventListener('click', function(e){ e.stopPropagation(); checkbox.checked = false; });
        btn.addEventListener('click', function(e){ e.stopPropagation(); });
        container.addEventListener('click', function(e){ e.stopPropagation(); });
        return container;
    }

    if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', run, { once: true }); } else { run(); }
})();
