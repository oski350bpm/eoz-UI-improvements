// EOZ Control Panel Unified View Module
// Client-side aggregation for machines/control_panel
// TEMPORARILY DISABLED

(function() {
    'use strict';

    var VERSION = '0.2.1';

    // MODULE DISABLED - early return
    return;

    if (!window.EOZ) {
        console.warn('[EOZ Unified Panel] Core not available');
        return;
    }

    if (!window.EOZ.Waiting) window.EOZ.Waiting = {};
    if (!window.EOZ.ControlPanelUnified) window.EOZ.ControlPanelUnified = {};
    window.EOZ.ControlPanelUnified.VERSION = VERSION;

    var MODULE_NAME = '[EOZ Unified Panel v' + VERSION + ']';
    var DAY_IN_MS = 24 * 60 * 60 * 1000;
    var FETCH_TIMEOUT_MS = 10000;
    var SESSION_CACHE_PREFIX = 'eoz-unified-html-';
    var WEEKDAY_SHORT = ['Nd', 'Pon', 'Wt', 'Sr', 'Czw', 'Pt', 'Sob'];

    var TABS = {
        TODO: { key: 'todo', label: 'Do wykonania' },
        DONE: { key: 'done', label: 'Zakończone' }
    };

    var state = {
        activeTab: null,
        root: null,
        tabButtons: {},
        contentContainers: {},
        elements: {},
        legacy: null,
        week: {
            referenceDate: null,
            range: null,
            dates: []
        },
        tables: {
            todo: null,
            todoBody: null,
            done: null,
            doneBody: null
        },
        data: {
            todo: null,
            done: null
        }
    };

    var htmlCache = Object.create(null);
    var notFinishedHtmlCache = null;

    function readSessionCache(key) {
        try {
            return window.sessionStorage.getItem(SESSION_CACHE_PREFIX + key);
        } catch (error) {
            console.warn(MODULE_NAME, 'Unable to read session cache', error);
            return null;
        }
    }

    function writeSessionCache(key, value) {
        try {
            window.sessionStorage.setItem(SESSION_CACHE_PREFIX + key, value);
        } catch (error) {
            console.warn(MODULE_NAME, 'Unable to write session cache', error);
        }
    }

    if (window.location.href.indexOf('control_panel_not_finished') !== -1) {
        try {
            var redirectTarget = new URL(window.location.href);
            redirectTarget.pathname = redirectTarget.pathname.replace('control_panel_not_finished', 'control_panel');
            redirectTarget.searchParams.set('tab', 'todo');
            redirectTarget.searchParams.set('unified', 'true');
            if (!redirectTarget.searchParams.has('week_offset')) {
                redirectTarget.searchParams.set('week_offset', '0');
            }
            window.location.replace(redirectTarget.pathname + '?' + redirectTarget.searchParams.toString());
        } catch (redirectError) {
            console.warn(MODULE_NAME, 'Redirect fallback triggered', redirectError);
            var fallbackUrl = window.location.href.replace('control_panel_not_finished', 'control_panel');
            if (fallbackUrl.indexOf('?') === -1) {
                fallbackUrl += '?';
            } else {
                fallbackUrl += '&';
            }
            fallbackUrl += 'tab=todo&unified=true&week_offset=0';
            window.location.replace(fallbackUrl);
        }
        return;
    }

    var url = window.location.href;
    if (url.indexOf('/machines/control_panel') === -1) {
        return; // Not the target view
    }
    
    // Skip magazine views - they have their own modules
    if (url.indexOf('control_panel_boards_magazine_2020') !== -1 ||
        url.indexOf('control_panel_veneers_magazine_2020') !== -1) {
        return; // Skip magazine views
    }

    function getSearchParams() {
        try {
            return new URLSearchParams(window.location.search);
        } catch (e) {
            console.warn(MODULE_NAME, 'URLSearchParams not available, falling back to manual parsing');
            return null;
        }
    }

    function shouldActivateUnifiedView() {
        // MODULE DISABLED - always return false
        return false;
        
        var params = getSearchParams();
        if (!params) {
            return false; // Changed: default to false instead of true
        }

        var explicit = params.get('unified');
        if (explicit === 'false') {
            return false;
        }
        
        // Only activate if explicitly set to 'true'
        if (explicit === 'true') {
            return true;
        }

        return false; // Changed: default to false instead of true
    }

    function getWeekOffset() {
        var params = getSearchParams();
        if (!params) {
            return 0;
        }

        var offsetValue = parseInt(params.get('week_offset'), 10);
        if (Number.isNaN(offsetValue)) {
            return 0;
        }

        if (offsetValue < -52 || offsetValue > 52) {
            console.warn(MODULE_NAME, 'Week offset out of supported range (-52..52):', offsetValue);
            return 0;
        }

        return offsetValue;
    }

    function getMonday(date) {
        var day = date.getDay();
        var diff = day === 0 ? -6 : 1 - day; // Adjust Sunday (0) to previous Monday
        var monday = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        monday.setDate(monday.getDate() + diff);
        monday.setHours(0, 0, 0, 0);
        return monday;
    }

    function addDays(baseDate, days) {
        var result = new Date(baseDate.getTime() + days * DAY_IN_MS);
        result.setHours(0, 0, 0, 0);
        return result;
    }

    function getWeekRange(referenceDate) {
        var monday = getMonday(referenceDate);
        var friday = addDays(monday, 4);
        return {
            monday: monday,
            friday: friday
        };
    }

    function getWeekDates(monday) {
        var dates = [];
        for (var i = 0; i < 5; i++) {
            dates.push(addDays(monday, i));
        }
        return dates;
    }

    function getReferenceDate(explicitOffset) {
        var offset = typeof explicitOffset === 'number' ? explicitOffset : getWeekOffset();
        var today = new Date();
        today.setHours(0, 0, 0, 0);
        if (offset === 0) {
            return today;
        }

        return addDays(today, offset * 7);
    }

    function injectStyles() {
        if (document.getElementById('eoz-unified-panel-styles')) {
            return;
        }

        var styles = '' +
            '.eoz-unified-panel{background:#fff;border:1px solid #dee2e6;border-radius:14px;box-shadow:0 8px 24px rgba(15,23,42,0.08);margin-bottom:24px;overflow:hidden}' +
            '.eoz-unified-panel__toolbar{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px;padding:16px 20px;border-bottom:1px solid #e5e7eb;background:linear-gradient(135deg,rgba(248,250,252,0.95),rgba(236,239,244,0.95))}' +
            '.eoz-unified-panel__tabs{display:flex;gap:8px;flex-wrap:wrap}' +
            '.eoz-unified-panel__tab-btn{position:relative;display:inline-flex;align-items:center;gap:8px;padding:10px 18px;border-radius:999px;border:1px solid transparent;background:rgba(15,23,42,0.04);color:#1f2937;font-weight:600;font-size:14px;cursor:pointer;transition:all .2s ease}' +
            '.eoz-unified-panel__tab-btn:hover{background:rgba(37,99,235,0.12);color:#1d4ed8}' +
            '.eoz-unified-panel__tab-btn.is-active{background:#1d4ed8;color:#fff;border-color:#1d4ed8;box-shadow:0 10px 18px rgba(29,78,216,0.22)}' +
            '.eoz-unified-panel__tab-btn.is-active:after{content:"";position:absolute;bottom:-11px;left:50%;transform:translateX(-50%);width:14px;height:14px;background:#1d4ed8;border-radius:4px 4px 0 0}' +
            '.eoz-unified-panel__week-controls{display:flex;gap:12px;flex-wrap:wrap;align-items:center;justify-content:flex-end}' +
            '.eoz-unified-panel__week-info{font-weight:600;font-size:15px;color:#111827;display:inline-flex;align-items:center;gap:10px}' +
            '.eoz-unified-panel__week-nav{display:flex;gap:8px;align-items:center}' +
            '.eoz-unified-panel__week-btn{display:inline-flex;align-items:center;gap:8px;padding:8px 14px;border-radius:999px;border:1px solid rgba(29,78,216,0.35);background:#fff;color:#1d4ed8;font-weight:600;font-size:13px;cursor:pointer;transition:all .2s ease}' +
            '.eoz-unified-panel__week-btn:hover{background:rgba(29,78,216,0.12)}' +
            '.eoz-unified-panel__week-btn:disabled{opacity:0.5;cursor:not-allowed;background:rgba(15,23,42,0.06);color:#64748b;border-color:transparent}' +
            '.eoz-unified-panel__body{padding:20px;position:relative}' +
            '.eoz-unified-panel__tab-content{display:none;animation:fadeIn .18s ease-in-out}' +
            '.eoz-unified-panel__tab-content.is-active{display:block}' +
            '.eoz-unified-panel__placeholder{padding:18px 16px;border-radius:12px;background:rgba(37,99,235,0.06);border:1px dashed rgba(37,99,235,0.35);color:#1d4ed8;font-size:14px;line-height:1.45}' +
            '.eoz-unified-panel__legacy-table{background:#fff;border-radius:12px;box-shadow:0 4px 12px rgba(15,23,42,0.08);padding:8px}' +
            '.eoz-unified-date-pill{display:inline-flex;align-items:center;margin-left:8px;padding:2px 10px;border-radius:999px;background:rgba(29,78,216,0.15);color:#1d4ed8;font-size:11px;font-weight:700;letter-spacing:.03em;text-transform:uppercase}' +
            '.eoz-unified-panel__info-cell{padding:18px;border-radius:12px;background:rgba(148,163,184,0.18);font-weight:600;color:#1f2937;text-align:center}' +
            '/* Hide stock calendar controls when unified view is active */' +
            'body:has(.eoz-unified-panel) .day-input,' +
            'body:has(.eoz-unified-panel) input[name="operation_date"],' +
            'body:has(.eoz-unified-panel) label:has(+ input[name="operation_date"]),' +
            'body:has(.eoz-unified-panel) label input[name="operation_date"],' +
            'body:has(.eoz-unified-panel) label:has(input[name="operation_date"]),' +
            'body:has(.eoz-unified-panel) div:has(input[name="operation_date"]){display:none!important}' +
            '@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}';

        var styleEl = document.createElement('style');
        styleEl.id = 'eoz-unified-panel-styles';
        styleEl.textContent = styles;
        document.head.appendChild(styleEl);
    }

    function waitForPanel() {
        return window.EOZ.waitFor('table tbody tr', { timeout: 10000 })
            .catch(function(error) {
                console.warn(MODULE_NAME, 'Table wait failed', error);
            });
    }

    function createTabButton(tab) {
        var button = document.createElement('button');
        button.type = 'button';
        button.className = 'eoz-unified-panel__tab-btn';
        button.setAttribute('data-tab', tab.key);
        button.textContent = tab.label;
        button.addEventListener('click', function() {
            setActiveTab(tab.key, true);
        });
        return button;
    }

    function createPlaceholder(message) {
        var placeholder = document.createElement('div');
        placeholder.className = 'eoz-unified-panel__placeholder';
        placeholder.textContent = message;
        return placeholder;
    }

    function ensureTabContentPlaceholders() {
        var doneContainer = state.contentContainers[TABS.DONE.key];
        if (doneContainer && !doneContainer.hasChildNodes()) {
            doneContainer.appendChild(createPlaceholder('Brak danych – widok zakończonych zostanie wypełniony po pobraniu zleceń tygodnia.'));
        }
    }

    function updateUrlParams(params) {
        try {
            var url = new URL(window.location.href);
            Object.keys(params).forEach(function(key) {
                var value = params[key];
                if (value === null || value === undefined || value === '') {
                    url.searchParams.delete(key);
                } else {
                    url.searchParams.set(key, value);
                }
            });

            var newSearch = url.searchParams.toString();
            var relativeUrl = url.pathname + (newSearch ? '?' + newSearch : '') + url.hash;
            window.history.replaceState({}, '', relativeUrl);
        } catch (error) {
            console.warn(MODULE_NAME, 'Failed to update URL parameters', error);
        }
    }

    function setActiveTab(tabKey, updateUrl) {
        if (!state.contentContainers[tabKey]) {
            console.warn(MODULE_NAME, 'Attempted to activate unknown tab', tabKey);
            return;
        }

        state.activeTab = tabKey;

        Object.keys(state.tabButtons).forEach(function(key) {
            var button = state.tabButtons[key];
            if (!button) return;
            if (key === tabKey) {
                button.classList.add('is-active');
                button.setAttribute('aria-selected', 'true');
                button.setAttribute('tabindex', '0');
            } else {
                button.classList.remove('is-active');
                button.setAttribute('aria-selected', 'false');
                button.setAttribute('tabindex', '-1');
            }
        });

        Object.keys(state.contentContainers).forEach(function(key) {
            var content = state.contentContainers[key];
            if (!content) return;
            if (key === tabKey) {
                content.classList.add('is-active');
            } else {
                content.classList.remove('is-active');
            }
        });

        if (updateUrl) {
            var params = { tab: tabKey === TABS.TODO.key ? null : tabKey };
            updateUrlParams(params);
        }
    }

    function getInitialTab() {
        var params = getSearchParams();
        if (!params) {
            return TABS.TODO.key;
        }

        var requested = params.get('tab');
        if (!requested) {
            return TABS.TODO.key;
        }

        if (requested === TABS.DONE.key) {
            return TABS.DONE.key;
        }

        return TABS.TODO.key;
    }

    function formatDisplayDate(date, includeYear) {
        var weekday = WEEKDAY_SHORT[date.getDay()] || '';
        var day = String(date.getDate()).padStart(2, '0');
        var month = String(date.getMonth() + 1).padStart(2, '0');
        var parts = [weekday, day + '.' + month];
        if (includeYear) {
            parts.push(String(date.getFullYear()));
        }
        return parts.join(' ');
    }

    function updateWeekInfoDisplay(range) {
        var weekInfoEl = state.elements.weekInfo;
        if (!weekInfoEl || !range) {
            return;
        }

        var label = formatDisplayDate(range.monday, false) + ' – ' + formatDisplayDate(range.friday, true);
        weekInfoEl.textContent = label;
    }

    function formatIsoDate(date) {
        var year = date.getFullYear();
        var month = String(date.getMonth() + 1).padStart(2, '0');
        var day = String(date.getDate()).padStart(2, '0');
        return year + '-' + month + '-' + day;
    }

    function parseIsoDate(isoString) {
        if (!isoString) return null;
        var parts = isoString.split('-');
        if (parts.length !== 3) return null;
        var year = parseInt(parts[0], 10);
        var month = parseInt(parts[1], 10) - 1;
        var day = parseInt(parts[2], 10);
        if (Number.isNaN(year) || Number.isNaN(month) || Number.isNaN(day)) {
            return null;
        }
        var date = new Date(year, month, day);
        date.setHours(0, 0, 0, 0);
        return date;
    }

    function createDatePill(isoDate) {
        var date = parseIsoDate(isoDate);
        var pill = document.createElement('span');
        pill.className = 'eoz-unified-date-pill';
        if (!date) {
            pill.textContent = isoDate || '';
            return pill;
        }

        var day = String(date.getDate()).padStart(2, '0');
        var month = String(date.getMonth() + 1).padStart(2, '0');
        pill.textContent = day + '.' + month;
        return pill;
    }

    function buildControlPanelUrl(operationDate) {
        try {
            var url = new URL(window.location.href);
            url.searchParams.set('operation_date', operationDate);
            url.searchParams.delete('operation_date_option');
            url.searchParams.delete('week_offset');
            url.searchParams.delete('tab');
            url.searchParams.delete('unified');
            return url.origin + url.pathname + '?' + url.searchParams.toString();
        } catch (error) {
            console.warn(MODULE_NAME, 'Failed to construct control panel URL', error);
            return window.location.href;
        }
    }

    function buildNotFinishedUrl() {
        var url = new URL(window.location.href);
        url.search = '';
        url.pathname = url.pathname.replace('control_panel', 'control_panel_not_finished');
        return url.origin + url.pathname;
    }

    function fetchHtml(url) {
        return new Promise(function(resolve, reject) {
            var resolved = false;
            var timer = setTimeout(function() {
                if (resolved) return;
                resolved = true;
                reject(new Error('Request timeout after ' + FETCH_TIMEOUT_MS + 'ms for ' + url));
            }, FETCH_TIMEOUT_MS);

            function finalize(success, value) {
                if (resolved) return;
                resolved = true;
                clearTimeout(timer);
                if (success) {
                    resolve(value);
                } else {
                    reject(value);
                }
            }

            if (typeof GM_xmlhttpRequest === 'function') {
                try {
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: url,
                        onload: function(response) {
                            if (response.status >= 200 && response.status < 300) {
                                finalize(true, response.responseText);
                            } else {
                                finalize(false, new Error('HTTP ' + response.status + ' while fetching ' + url));
                            }
                        },
                        onerror: function() {
                            finalize(false, new Error('Network error while fetching ' + url));
                        }
                    });
                } catch (gmError) {
                    finalize(false, gmError);
                }
            } else {
                fetch(url, { credentials: 'include' })
                    .then(function(response) {
                        if (!response.ok) {
                            throw new Error('HTTP ' + response.status + ' while fetching ' + url);
                        }
                        return response.text();
                    })
                    .then(function(text) { finalize(true, text); })
                    .catch(function(error) { finalize(false, error); });
            }
        });
    }

    function fetchHtmlWithRetry(url, retries) {
        return fetchHtml(url).catch(function(error) {
            if (retries > 0) {
                console.warn(MODULE_NAME, 'Retrying request', url, 'retries left:', retries, error);
                return fetchHtmlWithRetry(url, retries - 1);
            }
            throw error;
        });
    }

    function getColumnCount(table) {
        var thead = table ? table.querySelector('thead') : null;
        if (!thead) {
            return 1;
        }
        var headers = thead.querySelectorAll('th');
        return headers.length || 1;
    }

    function parseOrderRowsFromHtml(html, meta) {
        var parser = new DOMParser();
        var doc = parser.parseFromString(html, 'text/html');
        var table = doc.querySelector('.dynamic-table-container table');
        if (!table) {
            console.warn(MODULE_NAME, 'Table not found in HTML response for', meta.operationDate, 'Trying alternative selectors...');
            table = doc.querySelector('table');
            if (!table) {
                console.warn(MODULE_NAME, 'No table found at all in HTML response for', meta.operationDate);
                return [];
            }
        }

        var thead = table.querySelector('thead');
        var headers = thead ? Array.from(thead.querySelectorAll('th')) : [];
        var statusIndex = headers.findIndex(function(th) {
            return (th.textContent || '').trim().toLowerCase().indexOf('status') !== -1;
        });
        var numberIndex = headers.findIndex(function(th) {
            return (th.textContent || '').trim().toLowerCase().indexOf('zlecen') !== -1;
        });
        var bodyRows = table.querySelectorAll('tbody tr');
        var results = [];
        var targetColumns = meta.targetColumns || headers.length || 1;

        bodyRows.forEach(function(row) {
            var cells = row.querySelectorAll('td');
            if (!cells.length) {
                return;
            }

            if (cells.length === 1) {
                var text = (cells[0].textContent || '').trim().toLowerCase();
                if (text.indexOf('brak rekord') !== -1 || text.indexOf('brak zleceń') !== -1) {
                    return;
                }
            }

            var statusText = statusIndex !== -1 && cells[statusIndex] ? (cells[statusIndex].textContent || '').trim() : '';
            var orderNumber = numberIndex !== -1 && cells[numberIndex] ? (cells[numberIndex].textContent || '').trim() : '';
            var imported = document.importNode(row, true);

            var importedCells = imported.querySelectorAll('td');
            if (importedCells.length < targetColumns) {
                var deficit = targetColumns - importedCells.length;
                for (var i = 0; i < deficit; i++) {
                    imported.appendChild(document.createElement('td'));
                }
            } else if (importedCells.length > targetColumns) {
                for (var j = importedCells.length - 1; j >= targetColumns; j--) {
                    imported.removeChild(importedCells[j]);
                }
            }

            imported.dataset.operationDate = meta.operationDate;
            imported.dataset.source = meta.source;
            if (statusText) imported.dataset.statusRaw = statusText;
            if (orderNumber) imported.dataset.orderNumber = orderNumber;

            results.push({
                node: imported,
                status: statusText,
                orderNumber: orderNumber,
                operationDate: meta.operationDate,
                source: meta.source
            });
        });

        console.info(MODULE_NAME, 'Parsed', results.length, 'rows from HTML for date', meta.operationDate);
        return results;
    }

    function fetchDayOrders(date) {
        var iso = typeof date === 'string' ? date : formatIsoDate(date);
        var targetColumns = state.tables.todo ? getColumnCount(state.tables.todo) : 13;
        
        if (htmlCache[iso]) {
            return Promise.resolve(parseOrderRowsFromHtml(htmlCache[iso], {
                operationDate: iso,
                source: 'week',
                targetColumns: targetColumns
            }));
        }

        var sessionHtml = readSessionCache(iso);
        if (sessionHtml) {
            htmlCache[iso] = sessionHtml;
            return Promise.resolve(parseOrderRowsFromHtml(sessionHtml, {
                operationDate: iso,
                source: 'week',
                targetColumns: targetColumns
            }));
        }

        var url = buildControlPanelUrl(iso);
        console.info(MODULE_NAME, 'Fetching orders for date:', iso, 'URL:', url);
        return fetchHtmlWithRetry(url, 1).then(function(html) {
            console.info(MODULE_NAME, 'Received HTML response for', iso, 'length:', html.length);
            htmlCache[iso] = html;
            writeSessionCache(iso, html);
            return parseOrderRowsFromHtml(html, {
                operationDate: iso,
                source: 'week',
                targetColumns: targetColumns
            });
        }).catch(function(error) {
            console.error(MODULE_NAME, 'Error fetching orders for', iso, error);
            throw error;
        });
    }

    function fetchUnfinishedOrders() {
        var url = buildNotFinishedUrl();
        var targetColumns = state.tables.todo ? getColumnCount(state.tables.todo) : 13;
        
        if (notFinishedHtmlCache) {
            return Promise.resolve(parseOrderRowsFromHtml(notFinishedHtmlCache, {
                operationDate: 'unfinished',
                source: 'unfinished',
                targetColumns: targetColumns
            }));
        }

        var sessionHtml = readSessionCache('unfinished');
        if (sessionHtml) {
            notFinishedHtmlCache = sessionHtml;
            return Promise.resolve(parseOrderRowsFromHtml(sessionHtml, {
                operationDate: 'unfinished',
                source: 'unfinished',
                targetColumns: targetColumns
            }));
        }

        console.info(MODULE_NAME, 'Fetching unfinished orders, URL:', url);
        return fetchHtmlWithRetry(url, 1).then(function(html) {
            console.info(MODULE_NAME, 'Received HTML response for unfinished orders, length:', html.length);
            notFinishedHtmlCache = html;
            writeSessionCache('unfinished', html);
            return parseOrderRowsFromHtml(html, {
                operationDate: 'unfinished',
                source: 'unfinished',
                targetColumns: targetColumns
            });
        }).catch(function(error) {
            console.error(MODULE_NAME, 'Error fetching unfinished orders', error);
            throw error;
        });
    }

    function loadTodoDataset(weekDates) {
        var todayIso = formatIsoDate(new Date());
        var weekPromises = weekDates.map(function(date) {
            var dateIso = formatIsoDate(date);
            if (dateIso === todayIso && state.initialTodayRows && state.initialTodayRows.length > 0) {
                console.info(MODULE_NAME, 'Using initial rows for today', dateIso, state.initialTodayRows.length);
                return Promise.resolve(state.initialTodayRows);
            }
            return fetchDayOrders(date).catch(function(error) {
                console.warn(MODULE_NAME, 'Failed to fetch orders for date', date, error);
                return [];
            });
        });

        return Promise.all([
            Promise.all(weekPromises).then(function(results) {
                var allWeekRows = [].concat.apply([], results);
                console.info(MODULE_NAME, 'Aggregated week rows:', allWeekRows.length);
                return allWeekRows;
            }),
            fetchUnfinishedOrders().catch(function(error) {
                console.warn(MODULE_NAME, 'Failed to fetch unfinished orders', error);
                return [];
            })
        ]).then(function(tuple) {
            var result = {
                weekRows: tuple[0],
                unfinishedRows: tuple[1]
            };
            console.info(MODULE_NAME, 'Todo dataset loaded:', {
                weekRows: result.weekRows.length,
                unfinishedRows: result.unfinishedRows.length
            });
            return result;
        });
    }

    function loadDoneDataset(weekDates) {
        var weekRange = state.week.range;
        var weekPromises = weekDates.map(function(date) {
            return fetchDayOrders(date).catch(function(error) {
                console.warn(MODULE_NAME, 'Failed to fetch orders for date', date, error);
                return [];
            });
        });

        return Promise.all(weekPromises).then(function(results) {
            var allRows = [].concat.apply([], results);
            return allRows.filter(function(row) {
                var statusMatch = (row.status || '').toLowerCase().indexOf('zako') !== -1;
                if (!statusMatch) {
                    return false;
                }
                if (!weekRange) {
                    return true;
                }
                var rowDate = row.operationDate;
                return isDateInWeekRange(rowDate, weekRange);
            });
        });
    }

    function renderInfoRow(tableBody, table, message) {
        if (!tableBody) return;
        tableBody.innerHTML = '';
        var row = document.createElement('tr');
        var cell = document.createElement('td');
        cell.className = 'eoz-unified-panel__info-cell';
        cell.colSpan = getColumnCount(table || state.tables.todo);
        cell.textContent = message;
        row.appendChild(cell);
        tableBody.appendChild(row);
    }

    function initializeRowButtons(row) {
        if (!row || !row.nodeType) {
            return;
        }

        var cells = row.querySelectorAll('td');
        if (!cells.length) {
            return;
        }

        // Find order ID from Zlecenie cell (usually second cell)
        var orderId = null;
        var orderNumber = row.dataset.orderNumber || '';
        
        // Try to extract from links in the row
        var orderLink = row.querySelector('a[href*="/machines/control_panel?"]');
        if (orderLink) {
            var hrefMatch = orderLink.href.match(/number2=([^&]+)/);
            if (hrefMatch) {
                orderId = hrefMatch[1];
            }
        }

        // If no orderId found, try to parse from orderNumber
        if (!orderId && orderNumber) {
            var transformed = orderNumber.replace(/\s+/g, '').replace('/', '_');
            var match = transformed.match(/\d+(?:_\d+)?/);
            if (match) {
                orderId = match[0];
            }
        }

        // Find columns for notes - look for existing cells or headers
        var headerRow = row.closest('table') ? row.closest('table').querySelector('thead tr') : null;
        var headers = headerRow ? Array.from(headerRow.querySelectorAll('th')) : [];
        
        var notesKlIndex = -1;
        var notesWewIndex = -1;
        var realizationIndex = -1;
        headers.forEach(function(th, i) {
            var text = (th.textContent || '').trim();
            if (text.indexOf('Uwagi klienta') !== -1) notesKlIndex = i;
            if (text.indexOf('Uwagi wewnętrzne') !== -1) notesWewIndex = i;
            if (text.indexOf('Realizacja') !== -1) realizationIndex = i;
        });

        // Reinitialize client notes button if column exists
        if (notesKlIndex >= 0 && cells[notesKlIndex]) {
            var notesKlCell = cells[notesKlIndex];
            var notesKlLink = notesKlCell.querySelector('a');
            
            if (orderId) {
                if (!notesKlLink) {
                    // Create new link if doesn't exist
                    notesKlLink = document.createElement('a');
                    notesKlLink.href = '#';
                    notesKlLink.innerHTML = '<i class="tableoptions far fa-2x fa-comment"></i>';
                    notesKlCell.innerHTML = '';
                    notesKlCell.appendChild(notesKlLink);
                } else {
                    // Remove old listeners by cloning
                    var newLink = notesKlLink.cloneNode(true);
                    notesKlCell.innerHTML = '';
                    notesKlCell.appendChild(newLink);
                    notesKlLink = newLink;
                }
                
                // Check if icon exists - solid = has notes, outline = no notes
                var icon = notesKlLink.querySelector('i');
                var hasClientNotes = icon && icon.className.indexOf('fa fa-') !== -1 && icon.className.indexOf('far fa-') === -1;
                
                notesKlLink.href = '#';
                notesKlLink.addEventListener('click', function(e) {
                    e.preventDefault();
                    if (window.EOZ && window.EOZ.MachinesPanel && typeof window.EOZ.MachinesPanel.showUwagiModal === 'function') {
                        window.EOZ.MachinesPanel.showUwagiModal(orderId);
                    } else {
                        showUwagiModal(orderId);
                    }
                    return false;
                }, true);

                // Async check if notes exist if not already indicated
                if (!hasClientNotes) {
                    checkClientNotesExists(orderId, function(hasNotes) {
                        var icon = notesKlLink.querySelector('i');
                        if (icon) {
                            icon.className = hasNotes ? 'tableoptions fa fa-2x fa-comment' : 'tableoptions far fa-2x fa-comment';
                        }
                    });
                }
            }
        }

        // Reinitialize internal notes button if column exists
        if (notesWewIndex >= 0 && cells[notesWewIndex]) {
            var notesWewCell = cells[notesWewIndex];
            var notesWewLink = notesWewCell.querySelector('a');
            
            if (orderId) {
                if (!notesWewLink) {
                    notesWewLink = document.createElement('a');
                    notesWewLink.href = 'https://eoz.iplyty.erozrys.pl/index.php/pl/commission/get_erozrys_order_notes/' + orderId;
                    notesWewLink.innerHTML = '<i class="fas fa-comments"></i>';
                    notesWewCell.innerHTML = '';
                    notesWewCell.appendChild(notesWewLink);
                } else {
                    // Clone to remove old listeners
                    var newLink = notesWewLink.cloneNode(true);
                    var originalHref = notesWewLink.href || ('https://eoz.iplyty.erozrys.pl/index.php/pl/commission/get_erozrys_order_notes/' + orderId);
                    notesWewCell.innerHTML = '';
                    notesWewCell.appendChild(newLink);
                    newLink.href = originalHref;
                    notesWewLink = newLink;
                }
            }
        }

        // Reinitialize play/realization button if column exists
        if (realizationIndex >= 0 && cells[realizationIndex]) {
            var realizationCell = cells[realizationIndex];
            var realizationBtn = realizationCell.querySelector('a.eoz-realizacja-btn, a[href*="/machines/control_panel?"]');
            
            if (orderLink && orderId) {
                if (!realizationBtn) {
                    var btn = document.createElement('a');
                    btn.href = '#';
                    btn.className = 'eoz-realizacja-btn';
                    var playIcon = orderLink.querySelector('i');
                    btn.innerHTML = playIcon ? playIcon.outerHTML : '<i class="fas fa-play"></i>';
                    realizationCell.innerHTML = '';
                    realizationCell.appendChild(btn);
                    realizationBtn = btn;
                } else {
                    // Clone to remove old listeners
                    var newBtn = realizationBtn.cloneNode(true);
                    realizationCell.innerHTML = '';
                    realizationCell.appendChild(newBtn);
                    realizationBtn = newBtn;
                }
                
                realizationBtn.href = '#';
                realizationBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    var clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true, view: window });
                    orderLink.dispatchEvent(clickEvent);
                    return false;
                }, true);
            }
        }
    }

    function checkClientNotesExists(orderId, callback) {
        var xhr = new XMLHttpRequest();
        var url = 'https://eoz.iplyty.erozrys.pl/index.php/pl/commission/get_erozrys_order_send_info/' + orderId;
        xhr.open('GET', url, true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    var responseText = (xhr.responseText || '').trim();
                    var textOnly = responseText.replace(/<[^>]*>/g, '').trim();
                    var hasContent = textOnly.length > 0 && !/\bbrak\b/i.test(textOnly);
                    callback(hasContent);
                } else {
                    callback(false);
                }
            }
        };
        xhr.send();
    }

    function showUwagiModal(orderId) {
        if (!orderId) return;
        
        var modalId = 'eoz-uwagi-modal';
        var existingModal = document.getElementById(modalId);
        if (!existingModal) {
            var modalHTML = '' +
                '<div class="modal fade" id="' + modalId + '" tabindex="-1" role="dialog">' +
                '  <div class="modal-dialog" role="document">' +
                '    <div class="modal-content">' +
                '      <div class="modal-header">' +
                '        <h4 class="modal-title">Uwagi klienta</h4>' +
                '        <button type="button" class="close" data-dismiss="modal">&times;</button>' +
                '      </div>' +
                '      <div class="modal-body" id="eoz-uwagi-modal-body"></div>' +
                '      <div class="modal-footer">' +
                '        <button type="button" class="btn btn-secondary" data-dismiss="modal">Zamknij</button>' +
                '      </div>' +
                '    </div>' +
                '  </div>' +
                '</div>';
            document.body.insertAdjacentHTML('beforeend', modalHTML);
            existingModal = document.getElementById(modalId);
        }
        
        var modalBody = document.getElementById('eoz-uwagi-modal-body');
        modalBody.innerHTML = '<div class="text-center"><i class="fa fa-spinner fa-spin"></i> Ładowanie...</div>';
        
        if (window.jQuery && window.jQuery.fn.modal) {
            window.jQuery(existingModal).modal('show');
        } else {
            existingModal.style.display = 'block';
            existingModal.classList.add('show');
            document.body.classList.add('modal-open');
        }
        
        var xhr = new XMLHttpRequest();
        var url = 'https://eoz.iplyty.erozrys.pl/index.php/pl/commission/get_erozrys_order_send_info/' + orderId;
        xhr.open('GET', url, true);
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

    function decorateRow(rowData, index) {
        var row = rowData.node;
        var cells = row.querySelectorAll('td');
        if (cells.length) {
            cells[0].textContent = String(index + 1);
        }

        if (cells.length > 1 && !cells[1].querySelector('.eoz-unified-date-pill') && rowData.operationDate && rowData.operationDate !== 'unfinished') {
            cells[1].appendChild(createDatePill(rowData.operationDate));
        }

        // Initialize buttons after row is added to DOM
        setTimeout(function() {
            initializeRowButtons(row);
        }, 0);

        return row;
    }

    function isDateInWeekRange(dateIso, weekRange) {
        if (!weekRange || !dateIso) {
            return false;
        }
        var date = parseIsoDate(dateIso);
        if (!date) {
            return false;
        }
        var mondayTime = weekRange.monday.getTime();
        var fridayTime = weekRange.friday.getTime();
        var dateTime = date.getTime();
        return dateTime >= mondayTime && dateTime <= fridayTime;
    }

    function sortTodoRows(data) {
        var seenOrders = Object.create(null);
        var sorted = [];
        var weekRange = state.week.range;

        var unfinished = (data.unfinishedRows || []).slice();
        unfinished.forEach(function(row) {
            if (row.orderNumber) {
                var unfinishedKey = row.orderNumber.toLowerCase();
                if (seenOrders[unfinishedKey]) {
                    return;
                }
                seenOrders[unfinishedKey] = true;
            }
            sorted.push(row);
        });

        var weekRows = (data.weekRows || []).slice();
        
        weekRows = weekRows.filter(function(row) {
            if (!weekRange) {
                return true;
            }
            var rowDate = row.operationDate;
            if (rowDate === 'unfinished') {
                return true;
            }
            return isDateInWeekRange(rowDate, weekRange);
        });
        
        weekRows.sort(function(a, b) {
            var dateA = parseIsoDate(a.operationDate) || new Date(0);
            var dateB = parseIsoDate(b.operationDate) || new Date(0);
            if (dateA.getTime() !== dateB.getTime()) {
                return dateA - dateB;
            }
            var orderA = (a.orderNumber || '').toLowerCase();
            var orderB = (b.orderNumber || '').toLowerCase();
            if (orderA < orderB) return -1;
            if (orderA > orderB) return 1;
            return 0;
        });

        weekRows.forEach(function(row) {
            var key = row.orderNumber ? row.orderNumber.toLowerCase() : null;
            if (key && seenOrders[key]) {
                return;
            }
            if (key) {
                seenOrders[key] = true;
            }
            sorted.push(row);
        });

        return sorted;
    }

    function renderTodoTab(data) {
        var body = state.tables.todoBody;
        if (!body || !state.tables.todo) {
            return;
        }

        var combined = sortTodoRows(data);
        if (!combined.length) {
            renderInfoRow(body, state.tables.todo, 'Brak zleceń do wykonania w wybranym tygodniu.');
            return;
        }

        body.innerHTML = '';
        combined.forEach(function(rowData, index) {
            body.appendChild(decorateRow(rowData, index));
        });

        data.sortedRows = combined;
    }

    function renderDoneTab(rows) {
        var body = state.tables.doneBody;
        if (!body || !state.tables.done) {
            return;
        }

        if (!rows.length) {
            renderInfoRow(body, state.tables.done, 'Brak zakończonych zleceń w wybranym tygodniu.');
            return;
        }

        body.innerHTML = '';
        rows.forEach(function(rowData, index) {
            body.appendChild(decorateRow(rowData, index));
        });
    }

    function showLoadingState() {
        var loadingMessage = 'Ładowanie danych tygodnia...';
        if (state.tables.todoBody) {
            renderInfoRow(state.tables.todoBody, state.tables.todo, loadingMessage);
        }
        if (state.tables.doneBody) {
            renderInfoRow(state.tables.doneBody, state.tables.done, loadingMessage);
        }
    }

    function showErrorState(error) {
        var message = 'Nie udało się pobrać danych tygodnia. Odśwież stronę lub spróbuj ponownie.';
        console.error(MODULE_NAME, 'Data loading error', error);
        if (state.tables.todoBody) {
            renderInfoRow(state.tables.todoBody, state.tables.todo, message);
        }
        if (state.tables.doneBody) {
            renderInfoRow(state.tables.doneBody, state.tables.done, message);
        }
    }

    function loadAndRenderData() {
        if (!state.week || !state.week.dates || !state.week.dates.length) {
            console.warn(MODULE_NAME, 'Week dates not available, skipping data load');
            return;
        }

        updateWeekNavButtons();
        showLoadingState();

        console.info(MODULE_NAME, 'Loading data for week dates:', state.week.dates.map(formatIsoDate));
        Promise.all([
            loadTodoDataset(state.week.dates),
            loadDoneDataset(state.week.dates)
        ])
            .then(function(results) {
                var todoData = results[0];
                var doneRows = results[1];

                console.info(MODULE_NAME, 'Data loaded - Todo:', {
                    weekRows: (todoData.weekRows || []).length,
                    unfinishedRows: (todoData.unfinishedRows || []).length
                }, 'Done:', doneRows.length);

                state.data.todo = todoData;
                state.data.done = doneRows;

                renderTodoTab(todoData);
                renderDoneTab(doneRows);
            })
            .catch(function(error) {
                console.error(MODULE_NAME, 'Error in loadAndRenderData', error);
                showErrorState(error);
            });
    }

    function updateWeekNavButtons() {
        var prev = state.elements.prevWeekBtn;
        var next = state.elements.nextWeekBtn;
        var offset = state.week.offset || 0;
        if (prev) {
            prev.disabled = offset <= -52;
        }
        if (next) {
            next.disabled = offset >= 52;
        }
    }

    function setWeekOffset(newOffset) {
        if (!Number.isInteger(newOffset)) {
            newOffset = 0;
        }

        if (newOffset < -52) newOffset = -52;
        if (newOffset > 52) newOffset = 52;

        state.week.offset = newOffset;
        state.week.referenceDate = getReferenceDate(newOffset);
        state.week.range = getWeekRange(state.week.referenceDate);
        state.week.dates = getWeekDates(state.week.range.monday);

        updateWeekInfoDisplay(state.week.range);
        updateWeekNavButtons();
        updateUrlParams({ week_offset: newOffset === 0 ? null : newOffset });

        // Clear cache for dates that are no longer in the current week
        var currentWeekIsos = state.week.dates.map(formatIsoDate);
        Object.keys(htmlCache).forEach(function(cachedDate) {
            if (currentWeekIsos.indexOf(cachedDate) === -1 && cachedDate !== 'unfinished') {
                delete htmlCache[cachedDate];
            }
        });

        // Reset cached DOM nodes to avoid attaching the same elements twice
        state.data.todo = null;
        state.data.done = null;
        state.initialTodayRows = null;
        loadAndRenderData();
    }

    function changeWeek(delta) {
        var current = state.week.offset || 0;
        setWeekOffset(current + delta);
    }

    function buildUnifiedPanel() {
        if (state.root) {
            return state.root;
        }

        var legacyContainer = document.querySelector('.dynamic-table-container');
        if (!legacyContainer) {
            console.warn(MODULE_NAME, 'Legacy table container not found');
            return null;
        }

        var root = document.createElement('section');
        root.className = 'eoz-unified-panel';

        var toolbar = document.createElement('div');
        toolbar.className = 'eoz-unified-panel__toolbar';
        root.appendChild(toolbar);

        var tabsWrapper = document.createElement('div');
        tabsWrapper.className = 'eoz-unified-panel__tabs';
        tabsWrapper.setAttribute('role', 'tablist');
        toolbar.appendChild(tabsWrapper);

        var weekControls = document.createElement('div');
        weekControls.className = 'eoz-unified-panel__week-controls';
        toolbar.appendChild(weekControls);

        var weekInfo = document.createElement('div');
        weekInfo.className = 'eoz-unified-panel__week-info';
        weekControls.appendChild(weekInfo);
        state.elements.weekInfo = weekInfo;

        var weekNav = document.createElement('div');
        weekNav.className = 'eoz-unified-panel__week-nav';
        weekControls.appendChild(weekNav);
        state.elements.weekNav = weekNav;

        var prevBtn = document.createElement('button');
        prevBtn.type = 'button';
        prevBtn.className = 'eoz-unified-panel__week-btn';
        prevBtn.textContent = '< Poprzedni tydzień';
        prevBtn.addEventListener('click', function() { changeWeek(-1); });
        weekNav.appendChild(prevBtn);
        state.elements.prevWeekBtn = prevBtn;

        var nextBtn = document.createElement('button');
        nextBtn.type = 'button';
        nextBtn.className = 'eoz-unified-panel__week-btn';
        nextBtn.textContent = 'Następny tydzień >';
        nextBtn.addEventListener('click', function() { changeWeek(1); });
        weekNav.appendChild(nextBtn);
        state.elements.nextWeekBtn = nextBtn;

        var body = document.createElement('div');
        body.className = 'eoz-unified-panel__body';
        root.appendChild(body);

        Object.keys(TABS).forEach(function(key) {
            var tab = TABS[key];
            var button = createTabButton(tab);
            tabsWrapper.appendChild(button);
            state.tabButtons[tab.key] = button;

            var content = document.createElement('div');
            content.className = 'eoz-unified-panel__tab-content';
            content.setAttribute('role', 'tabpanel');
            content.setAttribute('data-tab', tab.key);
            body.appendChild(content);
            state.contentContainers[tab.key] = content;
        });

        var legacyParent = legacyContainer.parentNode;
        state.legacy = {
            container: legacyContainer,
            parent: legacyParent
        };

        legacyContainer.classList.add('eoz-unified-panel__legacy-table');
        legacyParent.insertBefore(root, legacyContainer);
        state.contentContainers[TABS.TODO.key].appendChild(legacyContainer);

        var legacyTable = legacyContainer.querySelector('table');
        if (legacyTable) {
            var legacyBody = legacyTable.querySelector('tbody');
            state.tables.todo = legacyTable;
            state.tables.todoBody = legacyBody || null;

            console.info(MODULE_NAME, 'Found legacy table, columns:', getColumnCount(legacyTable), 'existing rows:', legacyBody ? legacyBody.querySelectorAll('tr').length : 0);

            if (legacyBody) {
                var existingRows = legacyBody.querySelectorAll('tr');
                console.info(MODULE_NAME, 'Found', existingRows.length, 'existing rows in legacy table');
                
                var initialTodayRows = [];
                if (existingRows.length > 0) {
                    var todayIso = formatIsoDate(new Date());
                    var headers = legacyTable.querySelector('thead');
                    var headerCells = headers ? headers.querySelectorAll('th') : [];
                    var statusIndex = -1;
                    var numberIndex = 1;
                    for (var hi = 0; hi < headerCells.length; hi++) {
                        var headerText = (headerCells[hi].textContent || '').trim().toLowerCase();
                        if (headerText.indexOf('status') !== -1) {
                            statusIndex = hi;
                        }
                        if (headerText.indexOf('zlecen') !== -1) {
                            numberIndex = hi;
                        }
                    }
                    
                    Array.from(existingRows).forEach(function(row) {
                        var cells = row.querySelectorAll('td');
                        if (!cells.length || cells.length === 1) {
                            var text = (cells[0].textContent || '').trim().toLowerCase();
                            if (text.indexOf('brak') !== -1 || text.indexOf('filtruj') !== -1 || text.indexOf('wyczyść') !== -1) {
                                return;
                            }
                        }
                        
                        var statusText = statusIndex !== -1 && cells[statusIndex] ? (cells[statusIndex].textContent || '').trim() : '';
                        var orderNumber = cells[numberIndex] ? (cells[numberIndex].textContent || '').trim() : '';
                        
                        var imported = document.importNode(row, true);
                        imported.dataset.operationDate = todayIso;
                        imported.dataset.source = 'initial';
                        if (statusText) imported.dataset.statusRaw = statusText;
                        if (orderNumber) imported.dataset.orderNumber = orderNumber;
                        
                        initialTodayRows.push({
                            node: imported,
                            status: statusText,
                            orderNumber: orderNumber,
                            operationDate: todayIso,
                            source: 'initial'
                        });
                    });
                    
                    if (initialTodayRows.length > 0) {
                        console.info(MODULE_NAME, 'Preserved', initialTodayRows.length, 'existing data rows for today', todayIso);
                        state.initialTodayRows = initialTodayRows;
                    }
                }
                
                legacyBody.innerHTML = '';
            }

            var doneTable = legacyTable.cloneNode(true);
            var doneBody = doneTable.querySelector('tbody');
            if (doneBody) {
                doneBody.innerHTML = '';
            }

            state.contentContainers[TABS.DONE.key].innerHTML = '';
            state.contentContainers[TABS.DONE.key].appendChild(doneTable);
            state.tables.done = doneTable;
            state.tables.doneBody = doneBody || null;
            
            console.info(MODULE_NAME, 'Tables initialized:', {
                todo: !!state.tables.todo,
                todoBody: !!state.tables.todoBody,
                done: !!state.tables.done,
                doneBody: !!state.tables.doneBody
            });
        } else {
            console.warn(MODULE_NAME, 'Legacy table not found in container');
            ensureTabContentPlaceholders();
        }

        state.root = root;
        return root;
    }

    function applyUnifiedView() {
        var offset = getWeekOffset();
        var referenceDate = getReferenceDate(offset);
        var weekRange = getWeekRange(referenceDate);
        var weekDates = getWeekDates(weekRange.monday);

        state.week.offset = offset;
        state.week.referenceDate = referenceDate;
        state.week.range = weekRange;
        state.week.dates = weekDates;
        state.activeTab = state.activeTab || getInitialTab();

        injectStyles();
        var panelBuilt = buildUnifiedPanel();
        if (!panelBuilt) {
            console.error(MODULE_NAME, 'Failed to build unified panel');
            return;
        }
        setActiveTab(state.activeTab, false);
        updateWeekInfoDisplay(weekRange);
        setupDateChangeListener();
        
        console.info(MODULE_NAME, 'Unified view activated', {
            referenceDate: referenceDate,
            weekRange: weekRange,
            weekDates: weekDates.map(formatIsoDate),
            hasTables: {
                todo: !!state.tables.todo,
                todoBody: !!state.tables.todoBody,
                done: !!state.tables.done,
                doneBody: !!state.tables.doneBody
            }
        });
        
        loadAndRenderData();
        // Implementation will be added in subsequent tasks.
    }

    function setupDateChangeListener() {
        var dateInput = document.querySelector('input[name="operation_date"]');
        if (!dateInput) {
            console.warn(MODULE_NAME, 'Date input not found for change listener');
            return;
        }

        var lastKnownDate = dateInput.value;
        var checkDateChange = function() {
            var currentDate = dateInput.value;
            if (currentDate === lastKnownDate) {
                return;
            }
            lastKnownDate = currentDate;

            var selectedDate = parseIsoDate(currentDate);
            if (!selectedDate) {
                console.warn(MODULE_NAME, 'Invalid date format:', currentDate);
                return;
            }

            var weekRange = state.week.range;
            if (!weekRange) {
                return;
            }

            var mondayTime = weekRange.monday.getTime();
            var fridayTime = weekRange.friday.getTime();
            var selectedTime = selectedDate.getTime();

            if (selectedTime < mondayTime || selectedTime > fridayTime) {
                console.info(MODULE_NAME, 'Selected date', currentDate, 'is outside current week range, adjusting week');
                var daysFromMonday = getMondayOffset(selectedDate);
                var newOffset = Math.floor(daysFromMonday / 7);
                setWeekOffset(newOffset);
            } else {
                console.info(MODULE_NAME, 'Selected date', currentDate, 'is within current week, reloading data');
                state.data.todo = null;
                state.data.done = null;
                state.initialTodayRows = null;
                loadAndRenderData();
            }
        };

        dateInput.addEventListener('change', checkDateChange);
        dateInput.addEventListener('blur', checkDateChange);

        var observer = new MutationObserver(function() {
            checkDateChange();
        });
        observer.observe(dateInput, {
            attributes: true,
            attributeFilter: ['value']
        });
    }

    function getMondayOffset(date) {
        var day = date.getDay();
        var diff = date.getDate() - day + (day === 0 ? -6 : 1);
        var monday = new Date(date);
        monday.setDate(diff);
        monday.setHours(0, 0, 0, 0);
        var today = new Date();
        today.setHours(0, 0, 0, 0);
        var referenceMonday = getWeekRange(today).monday;
        referenceMonday.setHours(0, 0, 0, 0);
        var weeksDiff = Math.floor((monday.getTime() - referenceMonday.getTime()) / (1000 * 60 * 60 * 24 * 7));
        return weeksDiff;
    }

    function init() {
        if (!shouldActivateUnifiedView()) {
            console.info(MODULE_NAME, 'Unified view disabled via URL parameter');
            return;
        }

        waitForPanel().then(function() {
            applyUnifiedView();
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init, { once: true });
    } else {
        init();
    }
})();

