// ==UserScript==
// @name         EOZ Global UI
// @namespace    https://github.com/oski350bpm/eoz-UI-improvements
// @version      0.1.1
// @description  Globalne poprawki UI dla EOZ (responsywne menu w headerze)
// @match        https://eoz.iplyty.erozrys.pl/*
// @updateURL    https://raw.githubusercontent.com/oski350bpm/eoz-UI-improvements/main/userscripts/eoz-global.user.js
// @downloadURL  https://raw.githubusercontent.com/oski350bpm/eoz-UI-improvements/main/userscripts/eoz-global.user.js
// @require      https://raw.githubusercontent.com/oski350bpm/eoz-UI-improvements/main/core/eoz-core.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    if (!window.EOZ) {
        console.warn('EOZ Global UI: core not loaded');
        return;
    }

    window.EOZ.whenReady(function() {
        try {
            window.EOZ.makeHeaderResponsive({
                headerSelector: 'header, .navbar, #header, .header',
                navSelector: 'nav, .navbar-nav, .menu, .nav, .main-menu',
                burgerInsertSelector: 'header, .navbar, #header, .header',
                breakpoint: 1024
            });
        } catch (e) {
            console.debug('EOZ Global UI: header setup failed', e);
        }
    });
})();
