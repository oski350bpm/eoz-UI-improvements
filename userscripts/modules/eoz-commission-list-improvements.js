// EOZ Commission List Improvements Module
// Applies on /commission/show_list*

(function() {
    'use strict';

    var VERSION = '2.6.0';
    
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
        '}\n' +
        '/* Machine colors - yellow to orange scale */\n' +
        '.eoz-row-machine-magazyn-plyt{background-color:rgba(255,253,231,0.15)!important}\n' +
        '.eoz-row-machine-magazyn-oklein{background-color:rgba(255,249,196,0.15)!important}\n' +
        '.eoz-row-machine-pila-panelowa{background-color:rgba(255,245,157,0.15)!important}\n' +
        '.eoz-row-machine-okleiniarka{background-color:rgba(255,241,118,0.15)!important}\n' +
        '.eoz-row-machine-centrum-wiertarskie{background-color:rgba(255,238,88,0.15)!important}\n' +
        '.eoz-row-machine-cnc{background-color:rgba(255,235,59,0.15)!important}\n' +
        '.eoz-row-machine-prace-dodatkowe{background-color:rgba(255,193,7,0.15)!important}\n' +
        '.eoz-row-machine-kompletacja{background-color:rgba(255,152,0,0.15)!important}\n' +
        '.eoz-row-production{border-left:3px solid #FFC107}\n' +
        '.eoz-machine-badge{padding:2px 8px;border-radius:4px;font-size:11px;font-weight:600;display:inline-block;margin-top:4px}\n' +
        '.eoz-status-machine{font-size:12px;color:#666;margin-top:4px}\n' +
        '.eoz-status-expandable{position:relative}\n' +
        '.eoz-status-toggle{cursor:pointer;display:inline-flex;align-items:center;gap:4px;margin-left:4px;color:#007bff;font-size:11px}\n' +
        '.eoz-status-toggle:hover{text-decoration:underline}\n' +
        '.eoz-status-toggle::after{content:"▼";font-size:9px;transition:transform 0.2s}\n' +
        '.eoz-status-toggle.expanded::after{transform:rotate(180deg)}\n' +
        '.eoz-process-panel{display:none;margin-top:8px;padding:10px;background:#f8f9fa;border:1px solid #ddd;border-radius:4px;max-width:300px}\n' +
        '.eoz-process-panel.expanded{display:block}\n' +
        '.eoz-process-stage-vertical{display:flex;align-items:center;gap:8px;padding:6px 0;font-size:12px;border-bottom:1px solid #e0e0e0}\n' +
        '.eoz-process-stage-vertical:last-child{border-bottom:none}\n' +
        '.eoz-process-stage-vertical.completed{color:#9E9E9E}\n' +
        '.eoz-process-stage-vertical.completed::before{content:"✓";color:#4CAF50;font-weight:bold;width:18px;text-align:center}\n' +
        '.eoz-process-stage-vertical.current{font-weight:bold;color:#FF9800}\n' +
        '.eoz-process-stage-vertical.current::before{content:"→";color:#FF9800;font-weight:bold;width:18px;text-align:center}\n' +
        '.eoz-process-stage-vertical.pending{opacity:0.5;color:#999}\n' +
        '.eoz-process-stage-vertical.pending::before{content:"○";color:#ccc;width:18px;text-align:center}\n' +
        '.eoz-process-stage.pending::before{content:"○";margin-right:4px}\n' +
        '.eoz-process-separator{color:#ccc;margin:0 4px}\n' +
        '.eoz-search-highlight{background-color:#ffeb3b;color:#000;padding:1px 2px;border-radius:2px;font-weight:600}\n' +
        '.eoz-status-cell-content{display:flex;flex-direction:column;gap:4px;align-items:flex-start}\n' +
        '.eoz-status-main{display:flex;align-items:center;gap:6px;flex-wrap:wrap}\n' +
        '.eoz-status-text{font-weight:500;color:#333}\n' +
        '.eoz-machine-badge-new{padding:3px 10px;border-radius:6px;font-size:11px;font-weight:600;white-space:nowrap;box-shadow:0 1px 2px rgba(0,0,0,0.1)}\n' +
        '.eoz-status-toggle-new{display:inline-flex;align-items:center;gap:3px;margin-top:2px;color:#007bff;font-size:10px;text-decoration:none;cursor:pointer;user-select:none}\n' +
        '.eoz-status-toggle-new:hover{color:#0056b3;text-decoration:underline}\n' +
        '.eoz-status-toggle-new::after{content:"▼";font-size:8px;transition:transform 0.2s;display:inline-block}\n' +
        '.eoz-status-toggle-new.expanded::after{transform:rotate(180deg)}\n' +
        '.eoz-search-filter-container{margin-bottom:16px;padding:16px;background:#fff;border:1px solid #ddd;border-radius:8px;box-shadow:0 2px 4px rgba(0,0,0,0.1)}\n' +
        '.eoz-search-input{width:100%;padding:10px;border:1px solid #ddd;border-radius:4px;font-size:14px;margin-bottom:12px}\n' +
        '/* Hide original table filters */\n' +
        'tbody tr:first-child td input[type="text"],\n' +
        'tbody tr:first-child td input[type="search"],\n' +
        'tbody tr:first-child td select,\n' +
        'tbody tr:first-child:has(input):has(select){display:none!important}\n' +
        'tbody tr:first-child:has(input):has(select){height:0!important;padding:0!important;margin:0!important;overflow:hidden!important;border:none!important;visibility:hidden!important}\n'\n' +
        '.eoz-filter-row{display:flex;gap:12px;flex-wrap:wrap;align-items:flex-end}\n' +
        '.eoz-filter-group{flex:1;min-width:150px}\n' +
        '.eoz-filter-label{display:block;font-size:12px;font-weight:600;color:#666;margin-bottom:4px}\n' +
        '.eoz-filter-dropdown{position:relative}\n' +
        '.eoz-filter-dropdown-btn{width:100%;padding:8px 12px;background:#fff;border:1px solid #ddd;border-radius:4px;cursor:pointer;display:flex;justify-content:space-between;align-items:center;font-size:14px}\n' +
        '.eoz-filter-dropdown-btn:hover{background:#f8f9fa}\n' +
        '.eoz-filter-dropdown-btn.open{border-color:#007bff}\n' +
        '.eoz-filter-dropdown-counter{background:#007bff;color:#fff;border-radius:50%;width:18px;height:18px;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:bold;margin-left:8px}\n' +
        '.eoz-filter-dropdown-menu{position:absolute;top:100%;left:0;right:0;background:#fff;border:1px solid #ddd;border-radius:4px;box-shadow:0 4px 12px rgba(0,0,0,0.15);z-index:1000;max-height:300px;overflow-y:auto;display:none;margin-top:4px}\n' +
        '.eoz-filter-dropdown-menu.open{display:block}\n' +
        '.eoz-filter-dropdown-item{padding:8px 12px;display:flex;align-items:center;gap:8px;cursor:pointer;transition:background-color 0.2s}\n' +
        '.eoz-filter-dropdown-item:hover{background:#f8f9fa}\n' +
        '.eoz-filter-dropdown-item input[type="checkbox"]{margin:0}\n' +
        '.eoz-filter-reset-btn{padding:8px 16px;background:#6c757d;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:14px;white-space:nowrap}\n' +
        '.eoz-filter-reset-btn:hover{background:#5a6268}\n' +
        '.eoz-highlight{background-color:#ffeb3b;padding:1px 2px;border-radius:2px}\n' +
        '@media (max-width:768px){\n' +
        '  .eoz-filter-row{flex-direction:column}\n' +
        '  .eoz-filter-group{min-width:100%}\n' +
        '  .eoz-process-bar{flex-direction:column;align-items:flex-start}\n' +
        '  .eoz-process-stage{font-size:11px;padding:3px 6px}\n' +
        '}\n';

    window.EOZ.injectStyles(styles, { id: 'eoz-commission-list-module-css' });

    // Machine color mapping (yellow to orange scale)
    var MACHINE_COLORS = {
        'Magazyn płyt': { color: '#FFFDE7', normalized: 'magazyn-plyt' },
        'Magazyn oklein': { color: '#FFF9C4', normalized: 'magazyn-oklein' },
        'Piła panelowa': { color: '#FFF59D', normalized: 'pila-panelowa' },
        'Okleiniarka': { color: '#FFF176', normalized: 'okleiniarka' },
        'Centrum wiertarskie': { color: '#FFEE58', normalized: 'centrum-wiertarskie' },
        'Centrum wiertarskie (CX-100)': { color: '#FFEE58', normalized: 'centrum-wiertarskie' },
        'CNC': { color: '#FFEB3B', normalized: 'cnc' },
        'Prace dodatkowe': { color: '#FFC107', normalized: 'prace-dodatkowe' },
        'Kompletacja': { color: '#FF9800', normalized: 'kompletacja' }
    };

    // All production machines in order
    var PRODUCTION_MACHINES = [
        'Magazyn płyt',
        'Magazyn oklein',
        'Piła panelowa',
        'Okleiniarka',
        'Centrum wiertarskie',
        'CNC',
        'Prace dodatkowe',
        'Kompletacja'
    ];

    // Cache for commission machine data
    var commissionMachineCache = new Map();
    var MAX_CACHE_SIZE = 200;

    // Debounce utility
    function debounce(func, wait) {
        var timeout;
        return function() {
            var context = this;
            var args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(function() {
                func.apply(context, args);
            }, wait);
        };
    }

    // Normalize machine name
    function normalizeMachineName(machineName) {
        if (!machineName) return '';
        // Remove (CX-100) etc
        var normalized = machineName.replace(/\s*\([^)]*\)\s*/g, '').trim();
        return normalized;
    }

    // Get machine color
    function getMachineColor(machineName) {
        if (!machineName) return null;
        var normalized = normalizeMachineName(machineName);
        for (var key in MACHINE_COLORS) {
            var normalizedKey = normalizeMachineName(key);
            if (normalizedKey.toLowerCase() === normalized.toLowerCase()) {
                return MACHINE_COLORS[key];
            }
        }
        return null;
    }

    // Fetch commission machine data from show_details page
    function fetchCommissionMachineData(commissionId) {
        if (!commissionId) return Promise.resolve(null);
        
        // Check cache first
        if (commissionMachineCache.has(commissionId)) {
            return Promise.resolve(commissionMachineCache.get(commissionId));
        }

        return new Promise(function(resolve, reject) {
            var xhr = new XMLHttpRequest();
            // Try different URL patterns
            var baseUrl = window.location.origin;
            var url = baseUrl + '/index.php/pl/commission/show_details/' + commissionId;
            xhr.open('GET', url, true);
            xhr.onload = function() {
                if (xhr.status === 200) {
                    try {
                        var parser = new DOMParser();
                        var doc = parser.parseFromString(xhr.responseText, 'text/html');
                        
                        // Debug: log if parsing fails
                        var parseError = doc.querySelector('parsererror');
                        if (parseError) {
                            console.warn('[EOZ Commission List] XML parse error for commission', commissionId);
                            resolve(null);
                            return;
                        }
                        
                        // Find "Ścieżka produkcyjna zlecenia" heading (actual heading on page)
                        var headings = doc.querySelectorAll('h2, h3');
                        var processHeading = null;
                        for (var i = 0; i < headings.length; i++) {
                            var text = (headings[i].textContent || '').trim();
                            if (text.indexOf('Ścieżka produkcyjna') !== -1 || text.indexOf('Proces produkcyjny') !== -1) {
                                processHeading = headings[i];
                                break;
                            }
                        }
                        
                        if (!processHeading) {
                            console.debug('[EOZ Commission List] Process heading not found for commission', commissionId);
                            resolve(null);
                            return;
                        }
                        
                        // Find table after heading - search in all tables that come after heading
                        var table = null;
                        var allTables = doc.querySelectorAll('table');
                        
                        // Find first table that comes after the heading in document order
                        for (var t = 0; t < allTables.length; t++) {
                            var tbl = allTables[t];
                            // Check if table comes after heading (using compareDocumentPosition)
                            // 4 = DOCUMENT_POSITION_FOLLOWING
                            if (processHeading.compareDocumentPosition(tbl) === 4) {
                                // Check if table has thead with Maszyna column (it's likely the production table)
                                var thead = tbl.querySelector('thead');
                                if (thead) {
                                    var headers = thead.querySelectorAll('th, td');
                                    for (var h = 0; h < headers.length; h++) {
                                        if (headers[h].textContent.indexOf('Maszyna') !== -1) {
                                            table = tbl;
                                            break;
                                        }
                                    }
                                    if (table) break;
                                }
                            }
                        }
                        
                        // Fallback: if no table found, try nextElementSibling approach
                        if (!table) {
                            var next = processHeading.nextElementSibling;
                            var steps = 0;
                            while (next && next.tagName !== 'TABLE' && steps < 10) {
                                next = next.nextElementSibling;
                                steps++;
                            }
                            if (next && next.tagName === 'TABLE') {
                                table = next;
                            }
                        }
                        
                        if (!table) {
                            console.debug('[EOZ Commission List] Process table not found for commission', commissionId, 'Heading:', processHeading.textContent.trim());
                            resolve(null);
                            return;
                        }
                        
                        // Parse table rows
                        var rows = table.querySelectorAll('tbody tr');
                        var machines = [];
                        var currentMachine = null;
                        var allMachines = [];
                        
                        // Find column indices - actual structure: Gniazdo, Maszyna, Pracownik, Data rozpoczęcia, Data zakończenia, Status na maszynie, Liczba braków
                        var headers = table.querySelectorAll('thead tr th, thead tr td');
                        if (headers.length === 0) {
                            // Try first row of tbody as headers
                            var firstRow = table.querySelector('tbody tr');
                            if (firstRow) {
                                headers = firstRow.querySelectorAll('td, th');
                            }
                        }
                        
                        var machineIndex = -1;
                        var workerIndex = -1;
                        var statusIndex = -1;
                        for (var k = 0; k < headers.length; k++) {
                            var headerText = (headers[k].textContent || '').trim();
                            if (headerText.indexOf('Maszyna') !== -1 && machineIndex === -1) {
                                machineIndex = k;
                            }
                            if ((headerText.indexOf('Pracownik') !== -1 || headerText.indexOf('Operator') !== -1) && workerIndex === -1) {
                                workerIndex = k;
                            }
                            if ((headerText.indexOf('Status na maszynie') !== -1 || headerText.indexOf('Status') !== -1) && statusIndex === -1) {
                                statusIndex = k;
                            }
                            // Early exit if all found
                            if (machineIndex !== -1 && workerIndex !== -1 && statusIndex !== -1) break;
                        }
                        
                        // Debug: log if machine column not found
                        if (machineIndex === -1) {
                            console.debug('[EOZ Commission List] Machine column not found for commission', commissionId, 'Headers:', Array.from(headers).map(function(h) { return h.textContent; }));
                        }
                        
                        // Skip header row if first row in tbody is actually a header row
                        // Check if first row has same cell count as thead and contains "Gniazdo" in first cell
                        var startRow = 0;
                        if (rows.length > 0 && headers.length > 0) {
                            var firstRowCells = rows[0].querySelectorAll('td, th');
                            var firstCellText = firstRowCells[0] ? (firstRowCells[0].textContent || '').trim() : '';
                            // Only skip if first cell is exactly "Gniazdo" (header cell) AND has same number of cells as header
                            // Don't skip if first cell is "Magazyn płyt" or any other machine name
                            if (firstCellText === 'Gniazdo' && firstRowCells.length === headers.length) {
                                startRow = 1;
                            }
                        }
                        
                        for (var j = startRow; j < rows.length; j++) {
                            var row = rows[j];
                            var cells = row.querySelectorAll('td');
                            
                            if (machineIndex >= 0 && cells[machineIndex]) {
                                var machineName = (cells[machineIndex].textContent || '').trim();
                                if (machineName) {
                                    var normalized = normalizeMachineName(machineName);
                                    allMachines.push({
                                        name: machineName,
                                        normalized: normalized
                                    });
                                    
                                    // Check if this stage is completed (has worker OR status is "Gotowe")
                                    var isCompleted = false;
                                    
                                    // First check status column (most reliable)
                                    if (statusIndex >= 0 && cells[statusIndex]) {
                                        var status = (cells[statusIndex].textContent || '').trim();
                                        status = status.toLowerCase();
                                        isCompleted = status === 'gotowe' || status.indexOf('gotowe') !== -1;
                                    }
                                    
                                    // Also check worker column if status doesn't indicate completion
                                    if (!isCompleted && workerIndex >= 0 && cells[workerIndex]) {
                                        var worker = (cells[workerIndex].textContent || '').trim();
                                        isCompleted = !!worker && worker.length > 0;
                                    }
                                    
                                    // Debug log for Magazyn płyt
                                    if (machineName.indexOf('Magazyn płyt') !== -1) {
                                        console.debug('[EOZ Commission List] Magazyn płyt status check:', {
                                            commissionId: commissionId,
                                            machineName: machineName,
                                            status: statusIndex >= 0 && cells[statusIndex] ? (cells[statusIndex].textContent || '').trim() : 'N/A',
                                            worker: workerIndex >= 0 && cells[workerIndex] ? (cells[workerIndex].textContent || '').trim() : 'N/A',
                                            isCompleted: isCompleted,
                                            statusIndex: statusIndex,
                                            workerIndex: workerIndex
                                        });
                                    }
                                    
                                    // Set currentMachine to first incomplete machine
                                    // This is important for "Oczekujące" orders where first machine might not be completed
                                    if (!isCompleted && !currentMachine) {
                                        currentMachine = normalized;
                                    }
                                    
                                    machines.push({
                                        name: machineName,
                                        normalized: normalized,
                                        completed: isCompleted
                                    });
                                }
                            }
                        }
                        
                        var result = {
                            currentMachine: currentMachine,
                            machines: machines,
                            allMachines: allMachines
                        };
                        
                        // Cache result (LRU eviction - remove oldest 10% if cache is full)
                        if (commissionMachineCache.size >= MAX_CACHE_SIZE) {
                            var keysToRemove = Math.floor(MAX_CACHE_SIZE * 0.1); // Remove 10%
                            var iterator = commissionMachineCache.keys();
                            for (var c = 0; c < keysToRemove && c < commissionMachineCache.size; c++) {
                                var key = iterator.next().value;
                                commissionMachineCache.delete(key);
                            }
                        }
                        commissionMachineCache.set(commissionId, result);
                        
                        resolve(result);
                    } catch (e) {
                        console.warn('[EOZ Commission List] Error parsing commission details:', e);
                        resolve(null);
                    }
                } else {
                    resolve(null);
                }
            };
            xhr.onerror = function() {
                console.debug('[EOZ Commission List] XHR error for commission', commissionId, 'URL:', url);
                resolve(null);
            };
            
            xhr.ontimeout = function() {
                console.debug('[EOZ Commission List] XHR timeout for commission', commissionId);
                resolve(null);
            };
            
            xhr.timeout = 10000; // 10 second timeout
            xhr.send();
        });
    }

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

    // Extract commission ID from row
    function getCommissionIdFromRow(row) {
        // Actual format from page: /index.php/pl/commission/show_details/312
        var link = row.querySelector('a[href*="show_details"]');
        
        if (link && link.href) {
            // Match pattern: show_details/312 or show_details/312?
            var match = link.href.match(/show_details[\/_](\d+)/);
            if (match && match[1]) {
                return match[1];
            }
        }
        
        return null;
    }

    // Enhance status column with machine info
    function enhanceStatusColumn() {
        var statusIndex = findColumnIndex('Status');
        if (statusIndex === -1) {
            console.warn('[EOZ Commission List] Status column not found');
            return;
        }

        var rows = document.querySelectorAll('tbody tr.body-row');
        console.log('[EOZ Commission List] Enhancing status for', rows.length, 'rows');
        
        rows.forEach(function(row) {
            var cells = row.querySelectorAll('td.body-cell');
            if (!cells[statusIndex]) return;

            var statusCell = cells[statusIndex];
            var commissionId = getCommissionIdFromRow(row);
            
            if (!commissionId) return;

            // Store original status text (only once)
            var originalStatus = statusCell.getAttribute('data-original-status');
            if (!originalStatus) {
                originalStatus = statusCell.textContent.trim();
                statusCell.setAttribute('data-original-status', originalStatus);
            }

            // Skip if already enhanced
            if (statusCell.querySelector('.eoz-machine-badge')) {
                return;
            }

            // Fetch machine data asynchronously
            fetchCommissionMachineData(commissionId).then(function(data) {
                // Check if cell still exists in DOM
                if (!statusCell || !statusCell.parentNode) return;
                
                if (!data) {
                    console.debug('[EOZ Commission List] No data returned for commission', commissionId);
                    return;
                }
                
                if (!data.currentMachine) {
                    console.debug('[EOZ Commission List] No current machine for commission', commissionId, 'Data:', data);
                    // Keep original status if no machine data
                    return;
                }

                var machineInfo = getMachineColor(data.currentMachine);
                if (!machineInfo) return;

                // Get original machine name (not normalized)
                var originalMachineName = data.machines && data.machines.length > 0 ? 
                    (function() {
                        for (var i = 0; i < data.machines.length; i++) {
                            var m = data.machines[i];
                            if (normalizeMachineName(m.name || m.normalized) === data.currentMachine) {
                                return m.name || data.currentMachine;
                            }
                        }
                        return data.currentMachine;
                    })() : data.currentMachine;

                // Create enhanced status display with better structure
                var contentWrapper = document.createElement('div');
                contentWrapper.className = 'eoz-status-cell-content';
                
                // Main status row
                var statusMain = document.createElement('div');
                statusMain.className = 'eoz-status-main';
                
                var statusText = document.createElement('span');
                statusText.className = 'eoz-status-text';
                statusText.textContent = originalStatus;
                
                var badge = document.createElement('span');
                badge.className = 'eoz-machine-badge-new';
                badge.textContent = originalMachineName;
                badge.style.backgroundColor = machineInfo.color;
                badge.style.color = '#333';
                
                statusMain.appendChild(statusText);
                statusMain.appendChild(badge);
                contentWrapper.appendChild(statusMain);
                
                // Add expandable process panel for all commissions with machine data
                if (data.machines && data.machines.length > 0) {
                    var toggle = document.createElement('span');
                    toggle.className = 'eoz-status-toggle-new';
                    toggle.textContent = 'Proces';
                    toggle.setAttribute('data-commission-id', commissionId);
                    
                    var panel = document.createElement('div');
                    panel.className = 'eoz-process-panel';
                    panel.setAttribute('data-commission-id', commissionId);
                    
                    // Add process stages - use actual machines from data, not PRODUCTION_MACHINES
                    // This ensures we only show machines that actually exist in the commission
                    data.machines.forEach(function(machineData, index) {
                        var stageDiv = document.createElement('div');
                        stageDiv.className = 'eoz-process-stage-vertical';
                        
                        var machineName = machineData.name || machineData.normalized || '';
                        var machineNorm = normalizeMachineName(machineName);
                        var currentMachineNorm = data.currentMachine ? normalizeMachineName(data.currentMachine) : '';
                        
                        // Determine stage state
                        if (machineData.completed) {
                            stageDiv.classList.add('completed');
                        } else if (machineNorm === currentMachineNorm) {
                            stageDiv.classList.add('current');
                        } else {
                            stageDiv.classList.add('pending');
                        }
                        
                        stageDiv.textContent = machineName;
                        panel.appendChild(stageDiv);
                    });
                    
                    toggle.addEventListener('click', function(e) {
                        e.stopPropagation();
                        var isExpanded = panel.classList.contains('expanded');
                        if (isExpanded) {
                            panel.classList.remove('expanded');
                            toggle.classList.remove('expanded');
                        } else {
                            panel.classList.add('expanded');
                            toggle.classList.add('expanded');
                        }
                    });
                    
                    contentWrapper.appendChild(toggle);
                    
                    var expandableWrapper = document.createElement('div');
                    expandableWrapper.className = 'eoz-status-expandable';
                    expandableWrapper.appendChild(contentWrapper);
                    expandableWrapper.appendChild(panel);
                    
                    statusCell.innerHTML = '';
                    statusCell.appendChild(expandableWrapper);
                } else {
                    statusCell.innerHTML = '';
                    statusCell.appendChild(contentWrapper);
                }
            }).catch(function(error) {
                // Silently handle errors
                console.debug('[EOZ Commission List] Error enhancing status:', error);
            });
        });
    }

    // Apply row coloring based on machine
    function applyRowColoring() {
        var rows = document.querySelectorAll('tbody tr.body-row');
        console.log('[EOZ Commission List] Applying row coloring for', rows.length, 'rows');
        var batch = [];
        var batchSize = 10;

        rows.forEach(function(row, index) {
            var commissionId = getCommissionIdFromRow(row);
            if (!commissionId) return;

            batch.push({ row: row, id: commissionId });

            if (batch.length >= batchSize || index === rows.length - 1) {
                // Process batch
                var promises = batch.map(function(item) {
                    return fetchCommissionMachineData(item.id).then(function(data) {
                        return { row: item.row, data: data };
                    });
                });

                Promise.all(promises).then(function(results) {
                    results.forEach(function(result) {
                        // Check if row still exists in DOM
                        if (!result.row || !result.row.parentNode) return;
                        
                        if (!result.data || !result.data.currentMachine) return;

                        var machineInfo = getMachineColor(result.data.currentMachine);
                        if (!machineInfo) return;

                        // Remove existing machine classes (better regex for hyphenated names)
                        var classList = result.row.className.split(/\s+/).filter(function(cls) {
                            return cls && cls.indexOf('eoz-row-machine-') !== 0 && cls !== 'eoz-row-production';
                        });
                        result.row.className = classList.join(' ') + ' eoz-row-machine-' + machineInfo.normalized + ' eoz-row-production';
                        
                        // Store machine data in row for filtering (use original name, not normalized)
                        var originalName = null;
                        if (result.data.machines && result.data.machines.length > 0) {
                            for (var n = 0; n < result.data.machines.length; n++) {
                                var m = result.data.machines[n];
                                if (normalizeMachineName(m.name || m.normalized) === result.data.currentMachine) {
                                    originalName = m;
                                    break;
                                }
                            }
                        }
                        result.row.setAttribute('data-current-machine', originalName ? (originalName.name || result.data.currentMachine) : result.data.currentMachine);
                        
                        // Re-apply filter if machine filter is active
                        if (searchFilterState.machineFilter && searchFilterState.machineFilter.length > 0) {
                            setTimeout(function() {
                                applySearchAndFilter();
                            }, 100);
                        }
                    });
                }).catch(function(error) {
                    // Silently handle errors - don't break the UI
                    console.debug('[EOZ Commission List] Error in batch processing:', error);
                });

                batch = [];
            }
        });
    }

    // Removed addProductionProcessBars - now using expandable status column with vertical process display

    // Search and filter state
    var searchFilterState = {
        searchText: '',
        statusFilter: [],
        clientFilter: [],
        machineFilter: []
    };

    var filterDropdowns = {};

    // Normalize text for search
    function normalizeSearchText(text) {
        return (text || '').toLowerCase()
            .replace(/[ąćęłńóśźż]/g, function(char) {
                var map = {
                    'ą': 'a', 'ć': 'c', 'ę': 'e', 'ł': 'l', 'ń': 'n',
                    'ó': 'o', 'ś': 's', 'ź': 'z', 'ż': 'z'
                };
                return map[char] || char;
            });
    }

    // Fuzzy match
    function fuzzyMatch(searchText, targetText) {
        if (!searchText) return true;
        searchText = normalizeSearchText(searchText);
        targetText = normalizeSearchText(targetText);
        return targetText.indexOf(searchText) !== -1;
    }

    // Highlight search text in row
    function highlightSearchText(row, searchText) {
        // Remove existing highlights first
        removeHighlights(row);
        
        var cells = row.querySelectorAll('td.body-cell');
        var searchLower = normalizeSearchText(searchText);
        
        cells.forEach(function(cell) {
            // Skip status cell (has complex structure) and action cells
            if (cell.classList.contains('body-options-cell')) return;
            if (cell.querySelector('.eoz-machine-badge')) return;
            
            var cellText = cell.textContent || '';
            var cellTextNormalized = normalizeSearchText(cellText);
            
            if (cellTextNormalized.indexOf(searchLower) !== -1) {
                // Find all matches and highlight them
                var highlighted = cellText.replace(new RegExp('(' + escapeRegex(searchText) + ')', 'gi'), function(match) {
                    return '<mark class="eoz-search-highlight">' + match + '</mark>';
                });
                
                // Only update if we actually added highlights (avoid infinite loops)
                if (highlighted !== cellText && highlighted.indexOf('<mark') !== -1) {
                    var originalHTML = cell.innerHTML;
                    cell.innerHTML = highlighted;
                    // Store original to restore later
                    if (!cell.hasAttribute('data-original-html')) {
                        cell.setAttribute('data-original-html', originalHTML);
                    }
                }
            }
        });
    }
    
    // Remove search highlights from row
    function removeHighlights(row) {
        var cells = row.querySelectorAll('td.body-cell');
        cells.forEach(function(cell) {
            var highlights = cell.querySelectorAll('mark.eoz-search-highlight');
            if (highlights.length > 0) {
                var originalHTML = cell.getAttribute('data-original-html');
                if (originalHTML) {
                    cell.innerHTML = originalHTML;
                    cell.removeAttribute('data-original-html');
                } else {
                    // Fallback: just unwrap highlights
                    highlights.forEach(function(mark) {
                        var parent = mark.parentNode;
                        while (mark.firstChild) {
                            parent.insertBefore(mark.firstChild, mark);
                        }
                        parent.removeChild(mark);
                    });
                }
            }
        });
    }
    
    // Escape regex special characters
    function escapeRegex(text) {
        return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    // Extract row data for filtering
    function extractRowDataForFilter(row) {
        var cells = row.querySelectorAll('td.body-cell');
        var headers = document.querySelectorAll('th.heading-cell.column-names-cell');
        var headerNames = [];
        headers.forEach(function(th) { headerNames.push((th.textContent || '').trim()); });

        // Use findColumnIndex to get proper indices (handles partial matches)
        var idxKod = findColumnIndex('Kod');
        var idxNazwa = findColumnIndex('Nazwa zlecenia');
        var idxStatus = findColumnIndex('Status');
        var idxKlient = findColumnIndex('Kod klienta');
        var idxMaterialy = findColumnIndex('Materiały');

        var kod = idxKod >= 0 && cells[idxKod] ? (cells[idxKod].textContent || '').trim() : '';
        var nazwa = idxNazwa >= 0 && cells[idxNazwa] ? (cells[idxNazwa].textContent || '').trim() : '';
        var materialy = idxMaterialy >= 0 && cells[idxMaterialy] ? (cells[idxMaterialy].textContent || '').trim() : '';
        
        // For status - try to get original status first (before enhancement)
        var status = '';
        if (idxStatus >= 0 && cells[idxStatus]) {
            var statusCell = cells[idxStatus];
            // Check if status was enhanced - get original
            var originalStatus = statusCell.getAttribute('data-original-status');
            if (originalStatus) {
                status = originalStatus;
            } else {
                // Get current text, but remove badge if exists
                var statusText = statusCell.textContent || '';
                // If badge exists, status is first line before badge
                var badge = statusCell.querySelector('.eoz-machine-badge');
                if (badge) {
                    status = statusText.split(badge.textContent)[0].trim();
                } else {
                    status = statusText.trim();
                }
            }
        }
        
        var klient = idxKlient >= 0 && cells[idxKlient] ? (cells[idxKlient].textContent || '').trim() : '';
        var machine = row.getAttribute('data-current-machine') || '';

        return {
            kod: kod,
            nazwa: nazwa,
            materialy: materialy,
            status: status,
            klient: klient,
            machine: machine,
            fullText: (row.textContent || '').toLowerCase()
        };
    }

    // Update filter dropdown options based on currently visible rows
    function updateFilterOptionsFromVisibleRows() {
        var visibleRows = document.querySelectorAll('tbody tr.body-row:not([style*="display: none"])');
        var visibleClients = new Set();
        var visibleStatuses = new Set();
        var visibleMachines = new Set();
        
        visibleRows.forEach(function(row) {
            var rowData = extractRowDataForFilter(row);
            
            if (rowData.klient) {
                visibleClients.add(rowData.klient);
            }
            
            if (rowData.status) {
                visibleStatuses.add(rowData.status);
            }
            
            if (rowData.machine) {
                visibleMachines.add(rowData.machine);
            }
        });
        
        // Update client dropdown
        if (filterDropdowns.client) {
            var clientOptions = Array.from(visibleClients).sort().map(function(client) {
                return { value: client, text: client };
            });
            filterDropdowns.client.populate(clientOptions);
        }
        
        // Update status dropdown
        if (filterDropdowns.status) {
            var statusOptions = Array.from(visibleStatuses).sort().map(function(status) {
                return { value: status, text: status };
            });
            filterDropdowns.status.populate(statusOptions);
        }
        
        // Update machine dropdown
        if (filterDropdowns.machine) {
            var machineOptions = Array.from(visibleMachines).sort().map(function(machine) {
                return { value: machine, text: machine };
            });
            // Always include "Po kompletacji" if it exists
            var hasPoKompletacji = Array.from(visibleMachines).some(function(m) {
                return m === 'Po kompletacji' || m.indexOf('Po kompletacji') !== -1;
            });
            if (!hasPoKompletacji && visibleRows.length > 0) {
                // Check if any visible row has status "Zakończone" or no machine
                var hasCompleted = false;
                for (var i = 0; i < visibleRows.length; i++) {
                    var rd = extractRowDataForFilter(visibleRows[i]);
                    if (!rd.machine || (rd.status && rd.status.toLowerCase().indexOf('zakończone') !== -1)) {
                        hasCompleted = true;
                        break;
                    }
                }
                if (hasCompleted) {
                    machineOptions.push({ value: 'Po kompletacji', text: 'Po kompletacji' });
                }
            }
            filterDropdowns.machine.populate(machineOptions);
        }
    }

    // Apply search and filter
    function applySearchAndFilter() {
        var rows = document.querySelectorAll('tbody tr.body-row');
        var visibleCount = 0;

        rows.forEach(function(row) {
            // Skip process rows
            if (row.classList.contains('eoz-process-row')) {
                row.style.display = '';
                return;
            }

            var rowData = extractRowDataForFilter(row);
            var matches = true;

            // Apply search filter with highlighting
            if (searchFilterState.searchText) {
                var searchMatches =
                    fuzzyMatch(searchFilterState.searchText, rowData.kod) ||
                    fuzzyMatch(searchFilterState.searchText, rowData.nazwa) ||
                    fuzzyMatch(searchFilterState.searchText, rowData.materialy) ||
                    fuzzyMatch(searchFilterState.searchText, rowData.klient);
                if (!searchMatches) {
                    matches = false;
                    removeHighlights(row);
                } else {
                    // Highlight matching text
                    highlightSearchText(row, searchFilterState.searchText);
                }
            } else {
                // Remove highlights when search is cleared
                removeHighlights(row);
            }

            // Apply status filter
            if (matches && searchFilterState.statusFilter.length > 0) {
                var statusMatches = false;
                var statusLower = rowData.status.toLowerCase();
                for (var i = 0; i < searchFilterState.statusFilter.length; i++) {
                    var filterStatus = searchFilterState.statusFilter[i].toLowerCase();
                    if (statusLower.indexOf(filterStatus) !== -1) {
                        statusMatches = true;
                        break;
                    }
                }
                if (!statusMatches) matches = false;
            }

            // Apply client filter
            if (matches && searchFilterState.clientFilter.length > 0) {
                var clientMatches = false;
                for (var j = 0; j < searchFilterState.clientFilter.length; j++) {
                    if (normalizeSearchText(rowData.klient) === normalizeSearchText(searchFilterState.clientFilter[j])) {
                        clientMatches = true;
                        break;
                    }
                }
                if (!clientMatches) matches = false;
            }

            // Apply machine filter
            if (matches && searchFilterState.machineFilter.length > 0) {
                var machineMatches = false;
                for (var k = 0; k < searchFilterState.machineFilter.length; k++) {
                        var filterMachine = searchFilterState.machineFilter[k];
                        if (filterMachine === 'Po kompletacji') {
                            // For "Po kompletacji" - check if row has no current machine or is beyond completion
                            if (!rowData.machine || rowData.status && rowData.status.toLowerCase().indexOf('zakończone') !== -1) {
                                machineMatches = true;
                                break;
                            }
                        } else {
                            var filterMachineNorm = normalizeMachineName(filterMachine);
                            var rowMachineNorm = normalizeMachineName(rowData.machine);
                            if (normalizeSearchText(filterMachineNorm) === normalizeSearchText(rowMachineNorm)) {
                                machineMatches = true;
                                break;
                            }
                        }
                }
                if (!machineMatches) matches = false;
            }

            // Show/hide row
            if (matches) {
                row.style.display = '';
                visibleCount++;
                // Show process row if exists
                var processRow = row.nextElementSibling;
                if (processRow && processRow.classList.contains('eoz-process-row')) {
                    processRow.style.display = '';
                }
            } else {
                row.style.display = 'none';
                // Hide process row if exists
                var processRow2 = row.nextElementSibling;
                if (processRow2 && processRow2.classList.contains('eoz-process-row')) {
                    processRow2.style.display = 'none';
                }
            }
        });
    }

    // Create filter dropdown (similar to boards-magazine)
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

        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            var isOpen = menu.classList.contains('open');

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

        filterDropdowns[id] = { group: group, dropdown: dropdown, btn: btn, menu: menu, populate: populateOptions, update: updateButtonText };

        if (options && options.length > 0) {
            populateOptions(options);
        }

        return group;
    }

    // Create search and filter UI
    function createSearchAndFilterUI() {
        var table = document.querySelector('table.dynamic-table');
        if (!table) return null;

        var container = document.createElement('div');
        container.className = 'eoz-search-filter-container';

        // Search input
        var searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.className = 'eoz-search-input';
        searchInput.placeholder = 'Szukaj: kod zlecenia, nazwa, klient...';
        searchInput.addEventListener('input', debounce(function(event) {
            searchFilterState.searchText = event.target.value;
            applySearchAndFilter();
            // Update filter options based on visible rows
            updateFilterOptionsFromVisibleRows();
        }, 300));

        // Filter row
        var filterRow = document.createElement('div');
        filterRow.className = 'eoz-filter-row';

        // Status filter - will be populated dynamically
        var statusGroup = createFilterDropdown('Status:', 'status', [], function(selected) {
            searchFilterState.statusFilter = selected;
            applySearchAndFilter();
            updateFilterOptionsFromVisibleRows();
        });

        // Client filter - will be populated dynamically
        var clientGroup = createFilterDropdown('Klient:', 'client', [], function(selected) {
            searchFilterState.clientFilter = selected;
            applySearchAndFilter();
            updateFilterOptionsFromVisibleRows();
        });

        // Machine filter - will be populated dynamically
        var machineGroup = createFilterDropdown('Maszyna/Etap:', 'machine', [], function(selected) {
            searchFilterState.machineFilter = selected;
            applySearchAndFilter();
            updateFilterOptionsFromVisibleRows();
        });

        // Reset button
        var resetBtn = document.createElement('button');
        resetBtn.type = 'button';
        resetBtn.className = 'eoz-filter-reset-btn';
        resetBtn.textContent = 'Wyczyść filtry';
        resetBtn.addEventListener('click', function() {
            searchFilterState.searchText = '';
            searchFilterState.statusFilter = [];
            searchFilterState.clientFilter = [];
            searchFilterState.machineFilter = [];
            searchInput.value = '';

            Object.keys(filterDropdowns).forEach(function(key) {
                var dropdown = filterDropdowns[key];
                if (dropdown && dropdown.menu) {
                    dropdown.menu.querySelectorAll('input[type="checkbox"]').forEach(function(cb) {
                        cb.checked = false;
                    });
                    dropdown.update();
                }
            });

            applySearchAndFilter();
        });

        filterRow.appendChild(statusGroup);
        filterRow.appendChild(clientGroup);
        filterRow.appendChild(machineGroup);
        filterRow.appendChild(resetBtn);

        container.appendChild(searchInput);
        container.appendChild(filterRow);

        // Populate initial filter options from all rows
        setTimeout(function() {
            updateFilterOptionsFromVisibleRows();
        }, 500);
        
        // Also hide original filter row if it exists
        setTimeout(function() {
            var firstRow = document.querySelector('tbody tr:first-child');
            if (firstRow) {
                var hasInputs = firstRow.querySelectorAll('input, select').length > 0;
                if (hasInputs) {
                    firstRow.style.display = 'none';
                }
            }
        }, 100);

        return container;
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
            var lpDiv = document.createElement('div');
            lpDiv.className = 'eoz-cl-lp';
            lpDiv.textContent = 'Lp. ' + lp;
            var kodDiv = document.createElement('div');
            kodDiv.className = 'eoz-cl-kod';
            kodDiv.textContent = kod;
            header.appendChild(lpDiv);
            header.appendChild(kodDiv);
            
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
            // Safe HTML creation using textContent (XSS protection)
            function createLabeledDiv(label, value) {
                var div = document.createElement('div');
                var labelSpan = document.createElement('span');
                labelSpan.className = 'eoz-cl-label';
                labelSpan.textContent = label;
                div.appendChild(labelSpan);
                var text = document.createTextNode(value);
                div.appendChild(text);
                return div;
            }
            
            infoCol.appendChild(createLabeledDiv('Klient:', kodKlienta));
            infoCol.appendChild(createLabeledDiv('Nazwa zlecenia:', nazwa));
            infoCol.appendChild(createLabeledDiv('Materiały:', materialy));
            infoCol.appendChild(createLabeledDiv('Ilość płyt:', ilosc));
            infoCol.appendChild(createLabeledDiv('Planowana data:', dataZakonczenia));
            
            var statusCol = document.createElement('div');
            statusCol.className = 'eoz-cl-status-col';
            var statusDiv = document.createElement('div');
            statusDiv.className = 'eoz-cl-status';
            statusDiv.textContent = status;
            statusCol.appendChild(statusDiv);
            
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
                
                // Add search and filter UI
                var searchFilterUI = createSearchAndFilterUI();
                if (searchFilterUI) {
                    var table = document.querySelector('table.dynamic-table');
                    if (table && table.parentNode) {
                        table.parentNode.insertBefore(searchFilterUI, table);
                    }
                }
                
                // Enhance status column and apply row coloring
                enhanceStatusColumn();
                applyRowColoring();
                
                // Re-run filtering after machine data is loaded (for machine filter)
                setTimeout(function() {
                    if (searchFilterState.machineFilter && searchFilterState.machineFilter.length > 0) {
                        applySearchAndFilter();
                    }
                }, 2000);
                
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
