// ==UserScript==
// @name         EOZ All UI Improvements
// @namespace    https://github.com/oski350bpm/eoz-UI-improvements
// @version      2.0.6
// @description  Wszystkie ulepszenia UI dla EOZ - loader dla wszystkich modułów
// @match        https://eoz.iplyty.erozrys.pl/*
// @updateURL    https://raw.githubusercontent.com/oski350bpm/eoz-UI-improvements/main/userscripts/eoz-all-improvements.user.js
// @downloadURL  https://raw.githubusercontent.com/oski350bpm/eoz-UI-improvements/main/userscripts/eoz-all-improvements.user.js
// @require      https://raw.githubusercontent.com/oski350bpm/eoz-UI-improvements/main/core/eoz-core.js
// @require      https://raw.githubusercontent.com/oski350bpm/eoz-UI-improvements/main/userscripts/modules/eoz-header-menu.js
// @require      https://raw.githubusercontent.com/oski350bpm/eoz-UI-improvements/main/userscripts/modules/eoz-commission-list-improvements.js
// @require      https://raw.githubusercontent.com/oski350bpm/eoz-UI-improvements/main/userscripts/modules/eoz-boards-magazine-improvements.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    var VERSION = '2.0.6';
    
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
        console.log('[EOZ All UI v' + VERSION + '] Boards Magazine Module v' + window.EOZ.BoardsMagazine.VERSION);
    }
})();
