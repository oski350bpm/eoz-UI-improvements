(function() {
    'use strict';

    var VERSION = '0.2.4';

    if (!window.EOZ) {
        console.warn('[EOZ Gantt Buffer Module] Core helpers not available');
        return;
    }

    if (!window.EOZ.GanttBuffer) {
        window.EOZ.GanttBuffer = {};
    }

    var STORAGE_KEYS = {
        debug: 'eoz-gantt-buffer-debug'
    };

    var GanttBuffer = window.EOZ.GanttBuffer;
    GanttBuffer.VERSION = VERSION;

    var state = {
        panel: null,
        status: null,
        buttons: new Map(),
        scheduling: false,
        ganttObserver: null,
        bufferObserver: null,
        debugEnabled: false,
        debugLogs: [],
        debugLogEl: null,
        debugToggleEl: null,
        ajaxHooked: false,
        interactionsHooked: false,
        dialog: null
    };

    try {
        if (window.localStorage && window.localStorage.getItem(STORAGE_KEYS.debug) === '1') {
            state.debugEnabled = true;
        }
    } catch (_) {
        // ignore storage issues
    }

    var SELECTORS = {
        bufferHeading: 'h4',
        bufferTable: 'h4 + table',
        ganttContainer: '#gantt',
        skipMagazine: '#skip_magazine'
    };

    function injectStyles() {
        if (document.getElementById('eoz-gantt-buffer-css')) return;
        var css = '' +
            '#eoz-gantt-buffer-panel{margin:12px 0;padding:12px 16px;border:1px solid #dbe2ef;border-radius:8px;background:#f7f9fc;display:flex;flex-wrap:wrap;gap:12px;align-items:center}' +
            '#eoz-gantt-buffer-panel h3{margin:0;font-size:16px;font-weight:600;color:#1f2a44}' +
            '#eoz-gantt-buffer-status{flex:1 1 100%;font-size:13px;color:#1f2a44}' +
            '#eoz-gantt-buffer-status[data-type="error"]{color:#b00020}' +
            '.eoz-gantt-buffer-row-btn{margin-left:6px}' +
            '.eoz-gantt-buffer-disabled{pointer-events:none;opacity:0.6}' +
            '.eoz-gantt-buffer-meta{font-size:12px;color:#6c788f}' +
            '.eoz-gantt-buffer-actions{display:flex;align-items:center;gap:8px}' +
            '#eoz-gantt-debug-log{flex:1 1 100%;max-height:180px;overflow:auto;background:#fff;border:1px solid #dbe2ef;border-radius:6px;padding:8px;margin-top:8px;font-size:12px;display:none;white-space:pre-wrap}' +
            '#eoz-gantt-buffer-dialog{position:fixed;inset:0;background:rgba(0,0,0,0.45);display:none;align-items:center;justify-content:center;z-index:99999}' +
            '#eoz-gantt-buffer-dialog.eoz-visible{display:flex}' +
            '.eoz-gantt-dialog-card{background:#fff;border-radius:10px;padding:20px 24px;max-width:360px;width:90%;box-shadow:0 10px 35px rgba(23,43,77,0.25);display:flex;flex-direction:column;gap:16px}' +
            '.eoz-gantt-dialog-card h4{margin:0;font-size:18px;font-weight:600;color:#1f2a44}' +
            '.eoz-gantt-dialog-card label{font-size:13px;font-weight:500;color:#1f2a44}' +
            '.eoz-gantt-dialog-card input[type="date"]{width:100%;padding:10px 12px;border-radius:6px;border:1px solid #c5c9d3;font-size:14px}' +
            '.eoz-gantt-dialog-actions{display:flex;justify-content:flex-end;gap:8px}' +
            '.eoz-gantt-dialog-actions button{padding:8px 14px;border-radius:6px;border:none;font-size:14px;cursor:pointer}' +
            '.eoz-gantt-dialog-actions button.eoz-primary{background:#007bff;color:#fff}' +
            '.eoz-gantt-dialog-actions button.eoz-secondary{background:#e9ecef;color:#1f2a44}' +
            '@media (max-width: 768px){#eoz-gantt-buffer-panel{flex-direction:column;align-items:flex-start}}';

        window.EOZ.injectStyles(css, { id: 'eoz-gantt-buffer-css' });
    }

    function findBufferSection() {
        var headings = Array.from(document.querySelectorAll(SELECTORS.bufferHeading));
        var heading = headings.find(function(h) {
            return (h.textContent || '').trim().indexOf('Lista zleceń w buforze') !== -1;
        });
        if (!heading) return null;
        var sibling = heading.nextElementSibling;
        while (sibling && sibling.tagName !== 'TABLE') {
            sibling = sibling.nextElementSibling;
        }
        if (!sibling || sibling.tagName !== 'TABLE') return null;
        var table = sibling;
        return { heading: heading, table: table };
    }

    function ensurePanel() {
        if (state.panel && !document.contains(state.panel)) {
            state.panel = null;
            state.status = null;
        }

        if (state.panel) return state.panel;
        var section = findBufferSection();
        if (!section) return null;

        injectStyles();

        var panel = document.createElement('div');
        panel.id = 'eoz-gantt-buffer-panel';
        panel.innerHTML = '' +
            '<h3>Automatyczne planowanie bufora</h3>' +
            '<div class="eoz-gantt-buffer-meta">Wybierz zlecenie z bufora i przypisz je do pierwszego wolnego slotu magazynu płyt.</div>' +
            '<div class="eoz-gantt-buffer-actions">' +
                '<label><input type="checkbox" id="eoz-gantt-debug-toggle"> Loguj debug</label>' +
                '<button type="button" class="btn btn-xs btn-default" id="eoz-gantt-debug-clear">Wyczyść logi</button>' +
            '</div>' +
            '<div id="eoz-gantt-buffer-status"></div>' +
            '<pre id="eoz-gantt-debug-log"></pre>';

        section.heading.parentNode.insertBefore(panel, section.table);

        state.panel = panel;
        state.status = panel.querySelector('#eoz-gantt-buffer-status');
        state.debugLogEl = panel.querySelector('#eoz-gantt-debug-log');
        state.debugToggleEl = panel.querySelector('#eoz-gantt-debug-toggle');
        var clearBtn = panel.querySelector('#eoz-gantt-debug-clear');
        if (state.debugToggleEl) {
            state.debugToggleEl.checked = state.debugEnabled;
            state.debugToggleEl.addEventListener('change', function() {
                setDebugEnabled(state.debugToggleEl.checked);
            });
        }
        if (clearBtn) {
            clearBtn.addEventListener('click', function() {
                clearDebugLog();
            });
        }
        setDebugEnabled(state.debugEnabled);
        refreshDebugLog();
        setupGlobalInteractionHooks();
        console.info('[EOZ Gantt Buffer v' + VERSION + '] panel zainicjowany');
        updateStatus('Gotowe. Przyciski Auto dodane do tabeli zleceń bufora.');
        return panel;
    }

    function updateStatus(message, type) {
        if (!state.status) return;
        state.status.textContent = message || '';
        if (type) {
            state.status.setAttribute('data-type', type);
        } else {
            state.status.removeAttribute('data-type');
        }
    }

    function setDebugEnabled(enabled) {
        var wasEnabled = state.debugEnabled;
        state.debugEnabled = !!enabled;
        if (state.debugLogEl) {
            state.debugLogEl.style.display = state.debugEnabled && state.debugLogs.length ? 'block' : 'none';
        }
        if (state.debugEnabled !== wasEnabled) {
            logDebug('Tryb debug ' + (state.debugEnabled ? 'włączony' : 'wyłączony'));
            try {
                if (window.localStorage) {
                    if (state.debugEnabled) {
                        window.localStorage.setItem(STORAGE_KEYS.debug, '1');
                    } else {
                        window.localStorage.removeItem(STORAGE_KEYS.debug);
                    }
                }
            } catch (_) {
                // ignore
            }
        }
    }

    function clearDebugLog() {
        state.debugLogs = [];
        if (state.debugLogEl) {
            state.debugLogEl.textContent = '';
            state.debugLogEl.style.display = state.debugEnabled ? 'block' : 'none';
        }
    }

    function refreshDebugLog() {
        if (!state.debugLogEl) return;
        if (!state.debugEnabled || !state.debugLogs.length) {
            state.debugLogEl.textContent = '';
            state.debugLogEl.style.display = state.debugEnabled ? 'block' : 'none';
            return;
        }
        var text = state.debugLogs.map(function(entry) {
            return '[' + entry.time + '] ' + entry.message + (entry.data ? ' ' + entry.data : '');
        }).join('\n');
        state.debugLogEl.textContent = text;
        state.debugLogEl.style.display = 'block';
    }

    function logDebug(message, payload) {
        var timestamp = new Date();
        var timeLabel = timestamp.toISOString().replace('T', ' ').replace('Z', '');
        var dataString = '';
        if (payload !== undefined) {
            try {
                dataString = JSON.stringify(payload);
            } catch (_) {
                dataString = String(payload);
            }
        }
        state.debugLogs.push({ time: timeLabel, message: message, data: dataString });
        if (state.debugLogs.length > 300) {
            state.debugLogs.splice(0, state.debugLogs.length - 300);
        }
        if (state.debugEnabled) {
            console.info('[EOZ Gantt Buffer][debug]', message, payload || '');
        }
        refreshDebugLog();
    }

    function setupGlobalInteractionHooks() {
        if (state.interactionsHooked) return;
        state.interactionsHooked = true;
        document.addEventListener('change', function(event) {
            var target = event.target;
            if (!target) return;
            if (target.id === 'skip_magazine' || target.id === 'collapse_tables' || target.id === 'date' || target.matches('input[name="action"]') || target.id === 'block_days') {
                setTimeout(function() {
                    enhanceBufferTable();
                    observeBuffer();
                }, 120);
            }
        }, true);
    }

    function setupAjaxDebugHook() {
        if (state.ajaxHooked) return;
        if (!window.jQuery || !window.jQuery.fn || !window.jQuery(document)) {
            setTimeout(setupAjaxDebugHook, 300);
            return;
        }
        state.ajaxHooked = true;
        var $doc = window.jQuery(document);
        $doc.on('ajaxSend.eozGanttBuffer', function(evt, xhr, settings) {
            if (!settings || !settings.url) return;
            if (settings.url.indexOf('calendar_gantt_block_action') !== -1) {
                xhr.__eozStart = Date.now();
                logDebug('AJAX wywołany', { url: settings.url, data: settings.data });
            }
        });
        $doc.on('ajaxComplete.eozGanttBuffer', function(evt, xhr, settings) {
            if (!settings || !settings.url) return;
            if (settings.url.indexOf('calendar_gantt_block_action') !== -1) {
                var duration = xhr.__eozStart ? (Date.now() - xhr.__eozStart) : undefined;
                var snippet = '';
                try {
                    snippet = xhr.responseText ? xhr.responseText.slice(0, 400) : '';
                } catch (_) {
                    snippet = '';
                }
                logDebug('AJAX odpowiedź', { url: settings.url, status: xhr.status, duration: duration, response: snippet });
            }
        });
    }

    function ensureDialog() {
        if (state.dialog && state.dialog.overlay && document.contains(state.dialog.overlay)) {
            return state.dialog;
        }
        var overlay = document.createElement('div');
        overlay.id = 'eoz-gantt-buffer-dialog';
        overlay.innerHTML = '' +
            '<div class="eoz-gantt-dialog-card" role="dialog" aria-modal="true" aria-labelledby="eoz-gantt-dialog-title">' +
                '<h4 id="eoz-gantt-dialog-title">Planowanie z bufora</h4>' +
                '<div>' +
                    '<label for="eoz-gantt-dialog-date">Data rozpoczęcia produkcji</label>' +
                    '<input type="date" id="eoz-gantt-dialog-date" autocomplete="off">' +
                '</div>' +
                '<div class="eoz-gantt-dialog-actions">' +
                    '<button type="button" class="eoz-secondary" data-action="cancel">Anuluj</button>' +
                    '<button type="button" class="eoz-primary" data-action="confirm">Zaplanuj</button>' +
                '</div>' +
            '</div>';
        document.body.appendChild(overlay);

        var dateInput = overlay.querySelector('#eoz-gantt-dialog-date');
        var confirmBtn = overlay.querySelector('[data-action="confirm"]');
        var cancelBtn = overlay.querySelector('[data-action="cancel"]');

        state.dialog = {
            overlay: overlay,
            dateInput: dateInput,
            confirmBtn: confirmBtn,
            cancelBtn: cancelBtn
        };
        return state.dialog;
    }

    function openSchedulingDialog(orderId) {
        var dialog = ensureDialog();
        return new Promise(function(resolve) {
            var overlay = dialog.overlay;
            var dateInput = dialog.dateInput;
            var confirmBtn = dialog.confirmBtn;
            var cancelBtn = dialog.cancelBtn;

            function close(result) {
                overlay.classList.remove('eoz-visible');
                confirmBtn.removeEventListener('click', onConfirm);
                cancelBtn.removeEventListener('click', onCancel);
                overlay.removeEventListener('click', onOverlayClick);
                document.removeEventListener('keydown', onKeyDown, true);
                resolve(result);
            }

            function onConfirm() {
                close({ date: dateInput.value });
            }

            function onCancel() {
                close(null);
            }

            function onOverlayClick(evt) {
                if (evt.target === overlay) {
                    close(null);
                }
            }

            function onKeyDown(evt) {
                if (evt.key === 'Escape') {
                    evt.preventDefault();
                    close(null);
                } else if (evt.key === 'Enter') {
                    evt.preventDefault();
                    onConfirm();
                }
            }

            var defaultDate = getSelectedDateSafe();
            if (defaultDate) {
                dateInput.value = defaultDate;
            } else {
                dateInput.value = '';
            }

            overlay.classList.add('eoz-visible');
            dateInput.focus({ preventScroll: true });

            confirmBtn.addEventListener('click', onConfirm);
            cancelBtn.addEventListener('click', onCancel);
            overlay.addEventListener('click', onOverlayClick);
            document.addEventListener('keydown', onKeyDown, true);
        });
    }

    function enhanceBufferTable() {
        var section = findBufferSection();
        if (!section) return;
        ensurePanel();

        var rows = Array.from(section.table.querySelectorAll('tbody tr'));
        var seenOrderIds = new Set();
        rows.forEach(function(row) {
            var checkbox = row.querySelector('input.checkboxes_buffor');
            var plusButton = row.querySelector('button[id^="order_add_from_buffor_"]');
            if (!checkbox || !plusButton) return;

            var orderId = checkbox.value;
            if (!orderId) return;
            seenOrderIds.add(orderId);

            var existingBtn = state.buttons.get(orderId);
            if (existingBtn && existingBtn.isConnected) {
                return;
            }

            var autoBtn = document.createElement('button');
            autoBtn.type = 'button';
            autoBtn.className = 'btn btn-xs btn-primary eoz-gantt-buffer-row-btn';
            autoBtn.textContent = 'Auto';
            autoBtn.dataset.orderId = orderId;
            autoBtn.addEventListener('click', onAutoButtonClick);

            plusButton.parentNode.insertBefore(autoBtn, plusButton.nextSibling);
            state.buttons.set(orderId, autoBtn);
        });

        Array.from(state.buttons.keys()).forEach(function(orderId) {
            if (!seenOrderIds.has(orderId)) {
                state.buttons.delete(orderId);
            }
        });
    }

    function onAutoButtonClick(evt) {
        var button = evt.currentTarget;
        var orderId = button && button.dataset ? button.dataset.orderId : null;
        if (!orderId) return;

        disableButton(button);
        updateStatus('Wybierz datę dla zlecenia #' + orderId + '...', null);

        openSchedulingDialog(orderId).then(function(selection) {
            if (!selection || !selection.date) {
                updateStatus('Planowanie zlecenia #' + orderId + ' zostało anulowane.', 'error');
                return null;
            }
            updateStatus('Planowanie zlecenia #' + orderId + '...', null);
            logDebug('Rozpoczęcie planowania', { orderId: orderId, date: selection.date });
            if (typeof GanttBuffer.scheduleOrder !== 'function') {
                throw new Error('Brak funkcji planowania w module.');
            }
            return GanttBuffer.scheduleOrder(orderId, { dateOverride: selection.date });
        }).then(function(result) {
            if (!result) return;
            if (result.message) {
                updateStatus(result.message, 'success');
            }
        }).catch(function(error) {
            if (!error) return;
            var msg = (error && error.message) ? error.message : 'Nie udało się zaplanować zlecenia #' + orderId;
            console.error('[EOZ Gantt Buffer] scheduleOrder error', error);
            updateStatus(msg, 'error');
            logDebug('Błąd planowania', { orderId: orderId, error: error && error.message ? error.message : String(error) });
        }).finally(function() {
            enableButton(button);
        });
    }

    function disableButton(btn) {
        if (!btn) return;
        btn.classList.add('eoz-gantt-buffer-disabled');
    }

    function enableButton(btn) {
        if (!btn) return;
        btn.classList.remove('eoz-gantt-buffer-disabled');
    }

    function notifyGanttUpdate() {
        var gantt = document.querySelector(SELECTORS.ganttContainer);
        if (!gantt) return;
        var current = parseInt(gantt.getAttribute('data-eoz-gantt-mutation') || '0', 10) || 0;
        var next = current + 1;
        gantt.setAttribute('data-eoz-gantt-mutation', String(next));
        try {
            window.dispatchEvent(new CustomEvent('eoz:gantt-updated', { detail: { count: next } }));
        } catch (_) {
            // fallback for environments without CustomEvent constructor support
            try {
                var evt = document.createEvent('CustomEvent');
                evt.initCustomEvent('eoz:gantt-updated', true, true, { count: next });
                window.dispatchEvent(evt);
            } catch (err) {
                // give up silently
            }
        }
    }

    function observeGantt() {
        var gantt = document.querySelector(SELECTORS.ganttContainer);
        if (!gantt) return;

        if (!gantt.hasAttribute('data-eoz-gantt-mutation')) {
            gantt.setAttribute('data-eoz-gantt-mutation', '0');
        }

        if (state.ganttObserver && state.ganttObserver.target === gantt) {
            return;
        }

        if (state.ganttObserver && state.ganttObserver.observer) {
            state.ganttObserver.observer.disconnect();
        }

        var observer = new MutationObserver(function() {
            notifyGanttUpdate();
            enhanceBufferTable();
            observeBuffer();
        });

        observer.observe(gantt, { childList: true, subtree: true });
        state.ganttObserver = { observer: observer, target: gantt };
    }

    function observeBuffer() {
        var section = findBufferSection();
        if (!section) return;
        if (!section.table.tBodies || !section.table.tBodies.length) return;
        var tbody = section.table.tBodies[0];

        if (state.bufferObserver && state.bufferObserver.target === tbody) {
            return;
        }

        if (state.bufferObserver && state.bufferObserver.observer) {
            state.bufferObserver.observer.disconnect();
        }

        var observer = new MutationObserver(function() {
            enhanceBufferTable();
        });
        observer.observe(tbody, { childList: true, subtree: true });
        state.bufferObserver = { observer: observer, target: tbody };
    }

    function waitForNextGanttUpdate(timeoutMs) {
        var gantt = document.querySelector(SELECTORS.ganttContainer);
        if (!gantt) return Promise.reject(new Error('Nie znaleziono kontenera Gantt'));

        var baseline = parseInt(gantt.getAttribute('data-eoz-gantt-mutation') || '0', 10) || 0;

        return new Promise(function(resolve, reject) {
            var timeout = typeof timeoutMs === 'number' ? timeoutMs : 15000;
            var timer = setTimeout(function() {
                cleanup();
                reject(new Error('Przekroczono czas oczekiwania na odświeżenie harmonogramu'));
            }, timeout);

            function handler(event) {
                var detail = event && event.detail;
                var count = detail && typeof detail.count === 'number' ? detail.count : baseline + 1;
                if (count <= baseline) return;
                cleanup();
                resolve();
            }

            function cleanup() {
                clearTimeout(timer);
                window.removeEventListener('eoz:gantt-updated', handler);
            }

            window.addEventListener('eoz:gantt-updated', handler);
        });
    }

    function waitForGanttReady() {
        return window.EOZ.waitFor('#gantt td.cell_minute', { timeout: 15000 });
    }

    function setSkipMagazineVisible() {
        var checkbox = document.querySelector(SELECTORS.skipMagazine);
        if (!checkbox) {
            return Promise.resolve({ changed: false });
        }

        if (!checkbox.checked) {
            return Promise.resolve({ changed: false });
        }

        var wait = waitForNextGanttUpdate();
        checkbox.click();
        logDebug('Ukryj magazyny odznaczony na czas planowania');
        return wait
            .then(function() {
                return { changed: true, checkbox: checkbox };
            });
    }

    function restoreSkipMagazine(info) {
        if (!info || !info.changed || !info.checkbox) return Promise.resolve();
        var wait = waitForNextGanttUpdate();
        info.checkbox.click();
        logDebug('Przywrócono stan checkboxa magazynu');
        return wait.catch(function() { /* ignore */ });
    }

    function changeCalendarDateIfNeeded(targetDate) {
        var desired = normalizeDateInput(targetDate);
        if (!desired) return Promise.resolve();
        var input = document.querySelector('#date');
        if (!input) {
            return Promise.reject(new Error('Nie znaleziono pola daty harmonogramu.'));
        }
        if (input.value === desired) {
            return Promise.resolve();
        }
        var wait = waitForNextGanttUpdate();
        input.value = desired;
        input.dispatchEvent(new Event('change', { bubbles: true }));
        logDebug('Zmieniono datę harmonogramu', { date: desired });
        return wait;
    }

    function parseSlotTimestamp(slot) {
        if (!slot) return NaN;
        var parts = slot.split(' ');
        if (parts.length < 2) return NaN;
        var datePart = parts[0];
        var timePart = parts[1].split(':');
        var hour = parseInt(timePart[0], 10);
        var minute = parseInt(timePart[1], 10) || 0;
        var base = new Date(datePart + 'T00:00:00');
        if (isNaN(base.getTime())) return NaN;
        base.setHours(hour);
        base.setMinutes(minute);
        base.setSeconds(0, 0);
        return base.getTime();
    }

    function getSelectedDate() {
        var input = document.querySelector('#date');
        if (!input || !input.value) {
            throw new Error('Nie znaleziono pola daty harmonogramu.');
        }
        return input.value.trim();
    }

    function getSelectedDateSafe() {
        try {
            return getSelectedDate();
        } catch (_) {
            var input = document.querySelector('#date');
            return (input && input.value) ? input.value.trim() : '';
        }
    }

    function normalizeDateInput(value) {
        if (!value) return '';
        return value.trim();
    }

    function findFirstFreeSlot(dateStr, machineType) {
        var type = machineType || 'boards_magazine';
        var prefix = dateStr + ' ';
        var cells = Array.from(document.querySelectorAll('td.cell_minute[data-machine-type="' + type + '"]'));
        if (!cells.length) {
            return null;
        }

        var candidates = cells.filter(function(td) {
            var dataDate = td.dataset.date || '';
            return dataDate.indexOf(prefix) === 0 && !td.querySelector('.block_cell');
        });

        candidates.sort(function(a, b) {
            return parseSlotTimestamp(a.dataset.date) - parseSlotTimestamp(b.dataset.date);
        });

        var freeCell = candidates[0];

        if (!freeCell) return null;

        return {
            cell: freeCell,
            machineId: freeCell.dataset.machineId,
            date: freeCell.dataset.date
        };
    }

    function formatSlotHuman(dateTimeStr) {
        if (!dateTimeStr) return '';
        var parts = dateTimeStr.split(' ');
        if (parts.length < 2) return dateTimeStr;
        var timeParts = parts[1].split(':');
        var hours = timeParts[0].padStart(2, '0');
        var minutes = (timeParts[1] || '0').padStart(2, '0');
        return parts[0] + ' ' + hours + ':' + minutes;
    }

    function scheduleOrder(orderId, options) {
        options = options || {};
        var overrideDate = normalizeDateInput(options.dateOverride);
        if (overrideDate && !/^\d{4}-\d{2}-\d{2}$/.test(overrideDate)) {
            return Promise.reject(new Error('Nieprawidłowa data planowania: ' + overrideDate));
        }
        if (state.scheduling) {
            return Promise.reject(new Error('Inna operacja planowania jest w toku. Poczekaj na zakończenie.'));
        }

        if (typeof window.order_add_from_buffor_action !== 'function') {
            return Promise.reject(new Error('Brak funkcji systemowej order_add_from_buffor_action.')); 
        }

        state.scheduling = true;
        var targetDate = overrideDate;
        var skipInfo;

        return Promise.resolve()
            .then(function() {
                if (overrideDate) {
                    return changeCalendarDateIfNeeded(overrideDate).then(function() {
                        targetDate = overrideDate;
                    });
                }
            })
            .then(function() {
                return waitForGanttReady();
            })
            .then(function() {
                if (!targetDate) {
                    targetDate = getSelectedDateSafe();
                }
                if (!targetDate) {
                    throw new Error('Nie można ustalić docelowej daty harmonogramu.');
                }
                logDebug('Docelowa data harmonogramu', { orderId: orderId, date: targetDate });
                return setSkipMagazineVisible();
            })
            .then(function(result) {
                skipInfo = result;
                return waitForGanttReady();
            })
            .then(function() {
                var slot = findFirstFreeSlot(targetDate, 'boards_magazine');
                if (!slot) {
                    throw new Error('Brak wolnego slotu magazynu płyt dla daty ' + targetDate + '.');
                }

                var waitRefresh = waitForNextGanttUpdate();
                logDebug('Wybrany slot', { orderId: orderId, slotDate: slot.date, machineId: slot.machineId });
                window.order_add_from_buffor_action(orderId, slot.date, slot.machineId);
                logDebug('Wywołano order_add_from_buffor_action', { orderId: orderId, slot: slot.date, machineId: slot.machineId });

                return waitRefresh.then(function() {
                    logDebug('Gantt odświeżony po planowaniu', { orderId: orderId });
                    return {
                        message: 'Zlecenie #' + orderId + ' zaplanowano na ' + formatSlotHuman(slot.date) + ' (magazyn płyt).'
                    };
                });
            })
            .finally(function() {
                return restoreSkipMagazine(skipInfo);
            })
            .finally(function() {
                state.scheduling = false;
            });
    }

    function init() {
        ensurePanel();
        enhanceBufferTable();
        observeGantt();
        observeBuffer();
        setupAjaxDebugHook();
    }

    GanttBuffer.scheduleOrder = scheduleOrder;
    GanttBuffer._debugState = state;

    window.EOZ.whenReady(function() {
        console.info('[EOZ Gantt Buffer v' + VERSION + '] init start');
        init();
    });
})();

