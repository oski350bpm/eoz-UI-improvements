(function() {
    'use strict';

    var VERSION = '0.2.3';

    if (!window.EOZ) {
        console.warn('[EOZ Gantt Buffer Module] Core helpers not available');
        return;
    }

    if (!window.EOZ.GanttBuffer) {
        window.EOZ.GanttBuffer = {};
    }

    var GanttBuffer = window.EOZ.GanttBuffer;
    GanttBuffer.VERSION = VERSION;

    var state = {
        panel: null,
        status: null,
        observers: [],
        buttons: new Map(),
        scheduling: false
    };

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
            '<div class="eoz-gantt-buffer-meta">Data z formularza powyżej zostanie użyta do wyszukania pierwszego wolnego slotu w magazynie płyt.</div>' +
            '<div id="eoz-gantt-buffer-status"></div>';

        section.heading.parentNode.insertBefore(panel, section.table);

        state.panel = panel;
        state.status = panel.querySelector('#eoz-gantt-buffer-status');
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

    function enhanceBufferTable() {
        var section = findBufferSection();
        if (!section) return;
        ensurePanel();

        var rows = Array.from(section.table.querySelectorAll('tbody tr'));
        rows.forEach(function(row) {
            var checkbox = row.querySelector('input.checkboxes_buffor');
            var plusButton = row.querySelector('button[id^="order_add_from_buffor_"]');
            if (!checkbox || !plusButton) return;

            var orderId = checkbox.value;
            if (!orderId) return;

            if (state.buttons.has(orderId)) return;

            var autoBtn = document.createElement('button');
            autoBtn.type = 'button';
            autoBtn.className = 'btn btn-xs btn-primary eoz-gantt-buffer-row-btn';
            autoBtn.textContent = 'Auto';
            autoBtn.dataset.orderId = orderId;
            autoBtn.addEventListener('click', onAutoButtonClick);

            plusButton.parentNode.insertBefore(autoBtn, plusButton.nextSibling);
            state.buttons.set(orderId, autoBtn);
        });
    }

    function onAutoButtonClick(evt) {
        var button = evt.currentTarget;
        var orderId = button && button.dataset ? button.dataset.orderId : null;
        if (!orderId) return;

        disableButton(button);
        updateStatus('Przygotowanie automatycznego planowania dla zlecenia #' + orderId + '...', null);

        if (typeof GanttBuffer.scheduleOrder === 'function') {
            Promise.resolve()
                .then(function() {
                    console.info('[EOZ Gantt Buffer v' + VERSION + '] Auto dla #' + orderId);
                    return GanttBuffer.scheduleOrder(orderId);
                })
                .then(function(result) {
                    if (result && result.message) {
                        updateStatus(result.message, 'success');
                    } else {
                        updateStatus('Operacja zainicjowana dla zlecenia #' + orderId + '. Sprawdź harmonogram.', 'success');
                    }
                })
                .catch(function(error) {
                    var msg = (error && error.message) ? error.message : 'Nie udało się zaplanować zlecenia #' + orderId;
                    console.error('[EOZ Gantt Buffer] scheduleOrder error', error);
                    updateStatus(msg, 'error');
                })
                .finally(function() {
                    enableButton(button);
                    state.scheduling = false;
                });
        } else {
            console.warn('[EOZ Gantt Buffer] scheduleOrder(orderId) is not implemented yet');
            updateStatus('Funkcja automatyczna jest w trakcie implementacji.', 'error');
            enableButton(button);
        }
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

        var observer = new MutationObserver(function() {
            notifyGanttUpdate();
            enhanceBufferTable();
        });

        observer.observe(gantt, { childList: true, subtree: true });
        state.observers.push(observer);
    }

    function observeBuffer() {
        var section = findBufferSection();
        if (!section) return;
        if (!section.table.tBodies || !section.table.tBodies.length) return;
        var tbody = section.table.tBodies[0];

        var observer = new MutationObserver(function() {
            enhanceBufferTable();
        });
        observer.observe(tbody, { childList: true, subtree: true });
        state.observers.push(observer);
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
        return wait
            .then(function() {
                return { changed: true, checkbox: checkbox };
            });
    }

    function restoreSkipMagazine(info) {
        if (!info || !info.changed || !info.checkbox) return Promise.resolve();
        var wait = waitForNextGanttUpdate();
        info.checkbox.click();
        return wait.catch(function() { /* ignore */ });
    }

    function getSelectedDate() {
        var input = document.querySelector('#date');
        if (!input || !input.value) {
            throw new Error('Nie znaleziono pola daty harmonogramu.');
        }
        return input.value.trim();
    }

    function findFirstFreeSlot(dateStr, machineType) {
        var type = machineType || 'boards_magazine';
        var prefix = dateStr + ' ';
        var cells = Array.from(document.querySelectorAll('td.cell_minute[data-machine-type="' + type + '"]'));
        if (!cells.length) {
            return null;
        }

        var freeCell = cells.find(function(td) {
            var dataDate = td.dataset.date || '';
            return dataDate.indexOf(prefix) === 0 && !td.querySelector('.block_cell');
        });

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

    function scheduleOrder(orderId) {
        if (state.scheduling) {
            return Promise.reject(new Error('Inna operacja planowania jest w toku. Poczekaj na zakończenie.'));
        }

        if (typeof window.order_add_from_buffor_action !== 'function') {
            return Promise.reject(new Error('Brak funkcji systemowej order_add_from_buffor_action.')); 
        }

        state.scheduling = true;
        var selectedDate;
        try {
            selectedDate = getSelectedDate();
        } catch (err) {
            state.scheduling = false;
            return Promise.reject(err);
        }

        var skipInfo;

        return Promise.resolve()
            .then(function() {
                return setSkipMagazineVisible();
            })
            .then(function(result) {
                skipInfo = result;
                return waitForGanttReady();
            })
            .then(function() {
                var slot = findFirstFreeSlot(selectedDate, 'boards_magazine');
                if (!slot) {
                    throw new Error('Brak wolnego slotu magazynu płyt dla daty ' + selectedDate + '.');
                }

                var waitRefresh = waitForNextGanttUpdate();
                window.order_add_from_buffor_action(orderId, slot.date, slot.machineId);

                return waitRefresh.then(function() {
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
    }

    GanttBuffer.scheduleOrder = scheduleOrder;
    GanttBuffer._debugState = state;

        window.EOZ.whenReady(function() {
            console.info('[EOZ Gantt Buffer v' + VERSION + '] init start');
            init();
        });
})();

