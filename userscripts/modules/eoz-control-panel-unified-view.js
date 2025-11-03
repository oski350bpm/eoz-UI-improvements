// EOZ Control Panel Unified View Module
// Client-side aggregation for machines/control_panel

(function() {
    'use strict';

    var VERSION = '0.1.0';

    if (!window.EOZ) {
        console.warn('[EOZ Unified Panel] Core not available');
        return;
    }

    if (!window.EOZ.Waiting) window.EOZ.Waiting = {};
    if (!window.EOZ.ControlPanelUnified) window.EOZ.ControlPanelUnified = {};
    window.EOZ.ControlPanelUnified.VERSION = VERSION;

    var MODULE_NAME = '[EOZ Unified Panel v' + VERSION + ']';
    var DAY_IN_MS = 24 * 60 * 60 * 1000;
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
        }
    };

    if (window.location.href.indexOf('/machines/control_panel') === -1) {
        return; // Not the target view
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
        var params = getSearchParams();
        if (!params) {
            return true;
        }

        var explicit = params.get('unified');
        if (explicit === 'false') {
            return false;
        }

        return true;
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

    function getReferenceDate() {
        var offset = getWeekOffset();
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
            '.eoz-unified-panel__week-info{font-weight:600;font-size:15px;color:#111827;display:flex;align-items:center;gap:10px}' +
            '.eoz-unified-panel__body{padding:20px;position:relative}' +
            '.eoz-unified-panel__tab-content{display:none;animation:fadeIn .18s ease-in-out}' +
            '.eoz-unified-panel__tab-content.is-active{display:block}' +
            '.eoz-unified-panel__placeholder{padding:18px 16px;border-radius:12px;background:rgba(37,99,235,0.06);border:1px dashed rgba(37,99,235,0.35);color:#1d4ed8;font-size:14px;line-height:1.45}' +
            '.eoz-unified-panel__legacy-table{background:#fff;border-radius:12px;box-shadow:0 4px 12px rgba(15,23,42,0.08);padding:8px}' +
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

        var weekInfo = document.createElement('div');
        weekInfo.className = 'eoz-unified-panel__week-info';
        toolbar.appendChild(weekInfo);
        state.elements.weekInfo = weekInfo;

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

        ensureTabContentPlaceholders();

        state.root = root;
        return root;
    }

    function applyUnifiedView() {
        var referenceDate = getReferenceDate();
        var weekRange = getWeekRange(referenceDate);
        var weekDates = getWeekDates(weekRange.monday);

        state.week.referenceDate = referenceDate;
        state.week.range = weekRange;
        state.week.dates = weekDates;
        state.activeTab = state.activeTab || getInitialTab();

        injectStyles();
        buildUnifiedPanel();
        setActiveTab(state.activeTab, false);
        updateWeekInfoDisplay(weekRange);

        console.info(MODULE_NAME, 'Unified view activation placeholder', {
            referenceDate: referenceDate,
            weekRange: weekRange,
            weekDates: weekDates
        });
        // Implementation will be added in subsequent tasks.
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

