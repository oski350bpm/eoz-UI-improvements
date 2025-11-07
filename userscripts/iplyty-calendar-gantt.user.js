// ==UserScript==
// @name         EOZ Gantt Buffer Overlay
// @namespace    https://github.com/oski350bpm/eoz-UI-improvements
// @version      1.0.1
// @description  Ułatwia planowanie zleceń z bufora na widoku Harmonogramu stanowisk (Gantt)
// @match        https://iplyty.erozrys.pl/pl/new_machine/calendar_gantt*
// @match        https://eoz.iplyty.erozrys.pl/pl/new_machine/calendar_gantt*
// @match        https://eoz.iplyty.erozrys.pl/index.php/pl/new_machine/calendar_gantt*
// @updateURL    https://raw.githubusercontent.com/oski350bpm/eoz-UI-improvements/main/userscripts/iplyty-calendar-gantt.user.js
// @downloadURL  https://raw.githubusercontent.com/oski350bpm/eoz-UI-improvements/main/userscripts/iplyty-calendar-gantt.user.js
// @require      https://raw.githubusercontent.com/oski350bpm/eoz-UI-improvements/main/core/eoz-core.js
// @require      https://raw.githubusercontent.com/oski350bpm/eoz-UI-improvements/main/userscripts/modules/iplyty-gantt-buffer.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const VERSION = '1.0.0';

    if (!window.EOZ) {
        console.warn('[EOZ Gantt Buffer Overlay v' + VERSION + '] core not loaded');
        return;
    }

    console.info('[EOZ Gantt Buffer Overlay v' + VERSION + '] Loader initialized');
})();

