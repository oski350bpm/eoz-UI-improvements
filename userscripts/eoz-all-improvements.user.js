// ==UserScript==
// @name         EOZ All UI Improvements
// @namespace    https://github.com/oski350bpm/eoz-UI-improvements
// @version      3.11.41
// @description  Wszystkie ulepszenia UI dla EOZ - loader dla wszystkich modułów (Boards + Veneers + CDP Manager + Scripts Viewer)
// @match        https://eoz.iplyty.erozrys.pl/*
// @updateURL    https://raw.githubusercontent.com/oski350bpm/eoz-UI-improvements/main/userscripts/eoz-all-improvements.user.js
// @downloadURL  https://raw.githubusercontent.com/oski350bpm/eoz-UI-improvements/main/userscripts/eoz-all-improvements.user.js
// @require      https://raw.githubusercontent.com/oski350bpm/eoz-UI-improvements/main/core/eoz-core.js
// @require      https://raw.githubusercontent.com/oski350bpm/eoz-UI-improvements/main/userscripts/modules/eoz-header-menu.js
// @require      https://raw.githubusercontent.com/oski350bpm/eoz-UI-improvements/main/userscripts/modules/eoz-control-panel-order-improvements.js
// @require      https://raw.githubusercontent.com/oski350bpm/eoz-UI-improvements/main/userscripts/modules/eoz-commission-list-improvements.js
// @require      https://raw.githubusercontent.com/oski350bpm/eoz-UI-improvements/main/userscripts/modules/eoz-boards-magazine-improvements.js
// @require      https://raw.githubusercontent.com/oski350bpm/eoz-UI-improvements/main/userscripts/modules/eoz-machines-control-panel-improvements.js
// DISABLED: Unified view module temporarily disabled - @require removed
// @require      https://raw.githubusercontent.com/oski350bpm/eoz-UI-improvements/main/userscripts/modules/eoz-commission-generate-page-improvements.js
// @require      https://raw.githubusercontent.com/oski350bpm/eoz-UI-improvements/main/userscripts/modules/eoz-cdp-manager.js
// @require      https://raw.githubusercontent.com/oski350bpm/eoz-UI-improvements/main/userscripts/modules/eoz-scripts-viewer.js
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function() {
    'use strict';

    var VERSION = '3.11.41';
    
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
    if (window.EOZ.CDPManager && window.EOZ.CDPManager.VERSION) {
        console.log('[EOZ All UI v' + VERSION + '] CDP Manager Module v' + window.EOZ.CDPManager.VERSION);
    }
    if (window.EOZ.ScriptsViewer && window.EOZ.ScriptsViewer.VERSION) {
        console.log('[EOZ All UI v' + VERSION + '] Scripts Viewer Module v' + window.EOZ.ScriptsViewer.VERSION);
    }
    // DISABLED: Unified view module temporarily disabled
    // if (window.EOZ.ControlPanelUnified && window.EOZ.ControlPanelUnified.VERSION) {
    //     console.log('[EOZ All UI v' + VERSION + '] Control Panel Unified Module v' + window.EOZ.ControlPanelUnified.VERSION);
    // }
})();
