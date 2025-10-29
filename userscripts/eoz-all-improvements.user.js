// ==UserScript==
// @name         EOZ All UI Improvements
// @namespace    https://github.com/oski350bpm/eoz-UI-improvements
// @version      3.5.33
// @description  Wszystkie ulepszenia UI dla EOZ - loader dla wszystkich modułów (Boards + Veneers)
// @match        https://eoz.iplyty.erozrys.pl/*
// @updateURL    https://raw.githubusercontent.com/oski350bpm/eoz-UI-improvements/main/userscripts/eoz-all-improvements.user.js?v=1761741878
// @downloadURL  https://raw.githubusercontent.com/oski350bpm/eoz-UI-improvements/main/userscripts/eoz-all-improvements.user.js?v=1761741878
// @require      https://raw.githubusercontent.com/oski350bpm/eoz-UI-improvements/main/core/eoz-core.js?v=2.4.5
// @require      https://raw.githubusercontent.com/oski350bpm/eoz-UI-improvements/main/userscripts/modules/eoz-header-menu.js?v=2.2.7
// @require      https://raw.githubusercontent.com/oski350bpm/eoz-UI-improvements/main/userscripts/modules/eoz-control-panel-order-improvements.js?v=1.1.2
// @require      https://raw.githubusercontent.com/oski350bpm/eoz-UI-improvements/main/userscripts/modules/eoz-commission-list-improvements.js?v=2.0.3
// @require      https://raw.githubusercontent.com/oski350bpm/eoz-UI-improvements/main/userscripts/modules/eoz-boards-magazine-improvements.js?v=2.7.3
// @require      https://raw.githubusercontent.com/oski350bpm/eoz-UI-improvements/main/userscripts/modules/eoz-machines-control-panel-improvements.js?v=1.1.7
// @require      https://raw.githubusercontent.com/oski350bpm/eoz-UI-improvements/main/userscripts/modules/eoz-commission-generate-page-improvements.js?v=1.0.2
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var VERSION = '3.5.33';
    
    if (!window.EOZ) {
        console.error('[EOZ All UI v' + VERSION + '] Core not loaded!');
        return;
    }

    console.log('[EOZ All UI v' + VERSION + '] All modules loaded successfully');
    console.log('[EOZ All UI v' + VERSION + '] URL: ' + window.location.href);
    
    // Log module versions if available
    if (window.EOZ.HeaderMenu && window.EOZ.HeaderMenu.VERSION) {
        console.log('[EOZ All UI v' + VERSION + '] Header Menu Module v' + window.EOZ.HeaderMenu.VERSION);
    }
    if (window.EOZ.CommissionList && window.EOZ.CommissionList.VERSION) {
        console.log('[EOZ All UI v' + VERSION + '] Commission List Module v' + window.EOZ.CommissionList.VERSION);
    }
    if (window.EOZ.BoardsMagazine && window.EOZ.BoardsMagazine.VERSION) {
        console.log('[EOZ All UI v' + VERSION + '] Boards/Veneers Magazine Module v' + window.EOZ.BoardsMagazine.VERSION);
    }
    if (window.EOZ.CommissionGeneratePage && window.EOZ.CommissionGeneratePage.VERSION) {
        console.log('[EOZ All UI v' + VERSION + '] Commission Generate Page Module v' + window.EOZ.CommissionGeneratePage.VERSION);
    }
    if (window.EOZ.MachinesPanel && window.EOZ.MachinesPanel.VERSION) {
        console.log('[EOZ All UI v' + VERSION + '] Machines Panel Module v' + window.EOZ.MachinesPanel.VERSION);
    }
    if (window.EOZ.ControlPanelOrder && window.EOZ.ControlPanelOrder.VERSION) {
        console.log('[EOZ All UI v' + VERSION + '] Control Panel Order Module v' + window.EOZ.ControlPanelOrder.VERSION);
    }
})();
