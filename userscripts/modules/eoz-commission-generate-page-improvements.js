// EOZ Commission Generate Page Improvements Module
// Applies on /commission/generate_page/[ID]

(function() {
    'use strict';

    var VERSION = '1.0.6';
    
    // Expose version to global EOZ object
    if (!window.EOZ) window.EOZ = {};
    if (!window.EOZ.CommissionGeneratePage) window.EOZ.CommissionGeneratePage = {};
    window.EOZ.CommissionGeneratePage.VERSION = VERSION;

    if (!window.EOZ) {
        console.warn('[EOZ Commission Generate Page Module] Core not available');
        return;
    }

    // Check if we're on the generate_page route
    var match = window.location.href.match(/\/commission\/generate_page\/(\d+)/);
    if (!match) {
        return; // not this page
    }

    var commissionId = match[1];

    var styles = '' +
        '.eoz-generate-page-hidden-column{display:none!important}\n' +
        '.eoz-generate-page-lp-column{font-weight:bold!important;text-align:center!important;width:50px!important}\n' +
        '.eoz-generate-page-barcode-img{height:60px!important;width:250px!important;object-fit:fill!important}\n' +
        // Ukryj wszystkie obrazki kodów kreskowych (uniwersalne selektory)
        'img.heading-img[src*="dynamic_barcode"]{display:none!important}\n' +
        'img.smallsmall-img[src*="dynamic_barcode"]{display:none!important}\n' +
        'img.sub-image[src*="dynamic_barcode"]{display:none!important}\n' +
        // Style dla H1 - numer zlecenia i nazwa
        'h1.eoz-commission-header .eoz-commission-number{font-size:10em!important;display:block!important;line-height:1!important}\n' +
        'h1.eoz-commission-header .eoz-commission-name{font-size:6em!important;display:block!important;line-height:1.2!important;margin-top:0.2em!important}\n' +
        // Style dla paragrafu z klientem
        'p.eoz-commission-client{font-size:2em!important}\n';

    window.EOZ.injectStyles(styles, { id: 'eoz-commission-generate-page-module-css' });

    /**
     * Pobiera nazwę zlecenia z widoku show_details
     */
    function fetchCommissionName(commissionId) {
        return new Promise(function(resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', '/index.php/pl/commission/show_details/' + commissionId, true);
            xhr.onload = function() {
                if (xhr.status === 200) {
                    try {
                        var parser = new DOMParser();
                        var doc = parser.parseFromString(xhr.responseText, 'text/html');
                        
                        // Szukamy nazwy zlecenia - na podstawie analizy struktury z show_details
                        // Nazwa jest w elemencie DIV po nagłówku H3 "Podgląd zlecenia nr: XXX"
                        var h3 = doc.querySelector('h3');
                        if (h3 && h3.textContent && h3.textContent.indexOf('Podgląd zlecenia') !== -1) {
                            var nextElement = h3.nextElementSibling;
                            if (nextElement) {
                                var nameText = nextElement.textContent || '';
                                nameText = nameText.trim();
                                if (nameText) {
                                    resolve(nameText);
                                    return;
                                }
                            }
                        }
                        
                        // Fallback: szukamy w całym dokumencie
                        var bodyText = doc.body.innerText || '';
                        var nameMatch = bodyText.match(/Podgląd zlecenia nr:[^\n]+\n\s*([^\n]+)/);
                        if (nameMatch && nameMatch[1]) {
                            resolve(nameMatch[1].trim());
                            return;
                        }
                        
                        reject(new Error('Commission name not found'));
                    } catch (e) {
                        reject(e);
                    }
                } else {
                    reject(new Error('Failed to fetch commission details: ' + xhr.status));
                }
            };
            xhr.onerror = function() {
                reject(new Error('Network error while fetching commission details'));
            };
            xhr.send();
        });
    }

    /**
     * Formatuje H1 - usuwa "Zlecenie produkcyjne nr ", zostawia tylko numer i nazwę z odpowiednimi stylami
     */
    function formatH1(commissionName) {
        var h1 = document.querySelector('h1');
        if (!h1) {
            console.warn('[EOZ Commission Generate Page Module] H1 not found');
            return;
        }
        
        var currentHTML = h1.innerHTML || '';
        var currentText = h1.textContent || '';
        
        // Wyciągnij numer zlecenia - szukamy po "Zlecenie produkcyjne nr " i wyciągamy to co jest przed <br> lub końcem
        var numberMatch = currentHTML.match(/Zlecenie produkcyjne nr\s+([^<\n\r]+)/i) || 
                         currentText.match(/Zlecenie produkcyjne nr\s+([^\n\r]+)/i);
        
        var commissionNumber = '';
        var existingName = '';
        
        if (numberMatch && numberMatch[1]) {
            var fullMatch = numberMatch[1].trim();
            // Jeśli jest <br> w HTML, podziel na części
            if (currentHTML.indexOf('<br>') !== -1) {
                var parts = currentHTML.split('<br>');
                if (parts.length >= 2) {
                    // Pierwsza część to "Zlecenie produkcyjne nr XXXX", wyciągnij tylko numer
                    var firstPart = parts[0];
                    var numMatch = firstPart.match(/Zlecenie produkcyjne nr\s+([^\s<]+)/i);
                    commissionNumber = numMatch ? numMatch[1].trim() : '';
                    // Druga część to nazwa
                    existingName = parts[1].trim();
                }
            } else {
                // Jeśli nie ma <br>, spróbuj wyciągnąć numer z tekstu
                var numMatch = fullMatch.match(/^([^\s]+)/);
                commissionNumber = numMatch ? numMatch[1] : fullMatch;
            }
        }
        
        // Jeśli nadal nie ma numeru, spróbuj znaleźć go inaczej
        if (!commissionNumber) {
            // Szukaj wzorca "nr 3892_1" lub podobnego
            var altMatch = currentHTML.match(/nr\s+([0-9_]+)/i) || currentText.match(/nr\s+([0-9_]+)/i);
            commissionNumber = altMatch ? altMatch[1] : commissionId;
        }
        
        // Użyj nazwy z parametru lub z istniejącego HTML
        var nameToAdd = commissionName || existingName;
        
        // Formatuj H1: numer zlecenia (10em) + nazwa (6em)
        h1.className = (h1.className || '') + ' eoz-commission-header';
        h1.innerHTML = '<span class="eoz-commission-number">' + commissionNumber + '</span>' +
                      (nameToAdd ? '<span class="eoz-commission-name">' + nameToAdd + '</span>' : '');
        
        console.log('[EOZ Commission Generate Page Module] H1 formatted - Number: ' + commissionNumber + ', Name: ' + nameToAdd);
    }
    
    /**
     * Formatuje paragraf z klientem - rozmiar 2em
     */
    function formatClientParagraph() {
        var paragraphs = Array.from(document.querySelectorAll('p'));
        var clientPara = paragraphs.find(function(p) {
            var text = p.textContent || '';
            return text.includes('Klient:') || text.indexOf('Klient:') === 0;
        });
        
        if (!clientPara) {
            console.warn('[EOZ Commission Generate Page Module] Client paragraph not found');
            return;
        }
        
        // Dodaj klasę do paragrafu
        clientPara.className = (clientPara.className || '') + ' eoz-commission-client';
        
        console.log('[EOZ Commission Generate Page Module] Client paragraph formatted');
    }

    /**
     * Znajduje indeks kolumny w tabeli procesu produkcyjnego
     */
    function findColumnIndex(table, headerText) {
        var headers = table.querySelectorAll('thead tr:first-child th, thead tr:first-child td');
        for (var i = 0; i < headers.length; i++) {
            var text = (headers[i].textContent || '').trim();
            if (text.indexOf(headerText) !== -1) {
                return i;
            }
        }
        return -1;
    }

    /**
     * Modyfikuje tabelę procesu produkcyjnego:
     * - Dodaje kolumnę LP jako pierwszą
     * - Zostawia tylko kolumny: LP, Maszyna, Pracownik
     * - Ukrywa pozostałe kolumny
     */
    function modifyProductionProcessTable() {
        // Znajdź sekcję "Proces produkcyjny:"
        var heading = Array.from(document.querySelectorAll('h2')).find(function(h2) {
            return (h2.textContent || '').trim().indexOf('Proces produkcyjny') !== -1;
        });
        
        if (!heading) {
            console.warn('[EOZ Commission Generate Page Module] Production process heading not found');
            return;
        }
        
        // Znajdź tabelę zaraz po nagłówku
        var table = heading.nextElementSibling;
        while (table && table.tagName !== 'TABLE') {
            table = table.nextElementSibling;
        }
        
        if (!table) {
            console.warn('[EOZ Commission Generate Page Module] Production process table not found');
            return;
        }
        
        // Znajdź wszystkie wiersze (pierwszy to nagłówki)
        var allRows = Array.from(table.querySelectorAll('tr'));
        if (allRows.length === 0) {
            console.warn('[EOZ Commission Generate Page Module] No rows found in table');
            return;
        }
        
        var headerRow = allRows[0];
        var dataRows = allRows.slice(1); // Wszystkie poza pierwszym
        
        // Znajdź indeksy kolumn w nagłówku
        var headerCells = Array.from(headerRow.querySelectorAll('th, td'));
        var machineIndex = -1;
        var workerIndex = -1;
        var hasLpColumn = false;
        
        headerCells.forEach(function(cell, index) {
            var text = (cell.textContent || '').trim();
            if (text === 'LP' || text === 'Lp' || text === 'Lp.') {
                hasLpColumn = true;
            } else if (text.indexOf('Maszyna') !== -1) {
                machineIndex = index;
            } else if (text.indexOf('Pracownik') !== -1) {
                workerIndex = index;
            }
        });
        
        if (machineIndex === -1 || workerIndex === -1) {
            console.warn('[EOZ Commission Generate Page Module] Required columns not found. Machine:', machineIndex, 'Worker:', workerIndex);
            return;
        }
        
        // Dodaj kolumnę LP jeśli nie istnieje
        if (!hasLpColumn) {
            // Dodaj nagłówek LP (użyj tego samego tagu co inne nagłówki)
            var headerTag = headerRow.querySelector('th') ? 'th' : 'td';
            var lpHeader = document.createElement(headerTag);
            lpHeader.textContent = 'LP';
            lpHeader.className = 'eoz-generate-page-lp-column';
            headerRow.insertBefore(lpHeader, headerRow.children[0]);
            
            // Zaktualizuj indeksy (dodaliśmy jedną kolumnę na początku)
            machineIndex += 1;
            workerIndex += 1;
            
            // Dodaj komórki LP do wszystkich wierszy danych
            dataRows.forEach(function(row, rowIndex) {
                var lpCell = document.createElement('td');
                lpCell.textContent = (rowIndex + 1) + '.';
                lpCell.className = 'eoz-generate-page-lp-column';
                
                var firstCell = row.querySelector('td');
                if (firstCell) {
                    row.insertBefore(lpCell, firstCell);
                } else {
                    row.appendChild(lpCell);
                }
            });
        }
        
        // Ukryj niepotrzebne kolumny (wszystkie oprócz LP, Maszyna, Pracownik)
        // Pobierz zaktualizowane nagłówki (po dodaniu LP)
        var updatedHeaderCells = Array.from(headerRow.querySelectorAll('th, td'));
        updatedHeaderCells.forEach(function(header, index) {
            var headerText = (header.textContent || '').trim();
            var isLp = headerText === 'LP' || headerText === 'Lp' || headerText === 'Lp.';
            var isMachine = headerText.indexOf('Maszyna') !== -1;
            var isWorker = headerText.indexOf('Pracownik') !== -1;
            
            var shouldKeep = isLp || isMachine || isWorker;
            
            if (!shouldKeep) {
                // Ukryj nagłówek
                header.classList.add('eoz-generate-page-hidden-column');
                
                // Ukryj odpowiednie komórki w wierszach danych
                dataRows.forEach(function(row) {
                    var cells = Array.from(row.querySelectorAll('td'));
                    if (cells[index]) {
                        cells[index].classList.add('eoz-generate-page-hidden-column');
                    }
                });
            }
        });
        
        console.log('[EOZ Commission Generate Page Module] Production process table modified');
    }

    /**
     * Ustawia jednakowe rozmiary dla wszystkich kodów kreskowych
     */
    function normalizeBarcodeImages() {
        // Znajdź wszystkie obrazki - prawdopodobnie wszystkie są kodami kreskowymi
        var images = document.querySelectorAll('img');
        var barcodeCount = 0;
        
        images.forEach(function(img) {
            // Sprawdź czy obrazek jest widoczny i ma rozmiar (pomijamy ukryte/dekoracyjne)
            if (img.offsetWidth > 0 || img.offsetHeight > 0) {
                // Dodaj klasę CSS do wszystkich widocznych obrazków (zakładamy że to kody kreskowe)
                img.classList.add('eoz-generate-page-barcode-img');
                barcodeCount++;
            }
        });
        
        if (barcodeCount > 0) {
            console.log('[EOZ Commission Generate Page Module] Normalized ' + barcodeCount + ' barcode image(s)');
        }
    }

    /**
     * Usuwa określone obrazki kodów kreskowych z widoku
     */
    function removeSpecificBarcodeImages() {
        var removedCount = 0;
        
        // Usuń wszystkie obrazki heading-img z kodami kreskowymi (uniwersalne)
        var headingImgs = document.querySelectorAll('img.heading-img[src*="dynamic_barcode"]');
        headingImgs.forEach(function(headingImg) {
            headingImg.style.display = 'none';
            headingImg.remove();
            removedCount++;
        });
        if (headingImgs.length > 0) {
            console.log('[EOZ Commission Generate Page Module] Removed ' + headingImgs.length + ' heading-img barcode(s)');
        }
        
        // Usuń wszystkie obrazki smallsmall-img z kodami kreskowymi (uniwersalne)
        var smallImgs = document.querySelectorAll('img.smallsmall-img[src*="dynamic_barcode"]');
        smallImgs.forEach(function(smallImg) {
            smallImg.style.display = 'none';
            smallImg.remove();
            removedCount++;
        });
        if (smallImgs.length > 0) {
            console.log('[EOZ Commission Generate Page Module] Removed ' + smallImgs.length + ' smallsmall-img barcode(s)');
        }
        
        // Usuń wszystkie obrazki sub-image z kodami kreskowymi (uniwersalne)
        var subImgs = document.querySelectorAll('img.sub-image[src*="dynamic_barcode"]');
        subImgs.forEach(function(subImg) {
            subImg.style.display = 'none';
            subImg.remove();
            removedCount++;
        });
        if (subImgs.length > 0) {
            console.log('[EOZ Commission Generate Page Module] Removed ' + subImgs.length + ' sub-image barcode(s)');
        }
        
        if (removedCount > 0) {
            console.log('[EOZ Commission Generate Page Module] Removed ' + removedCount + ' barcode image(s) total');
        }
    }

    /**
     * Dodaje podział strony A4 - lista formatek na drugiej stronie jeśli nie zmieści się na pierwszej
     */
    function addPageBreakForFormatsList() {
        // Znajdź nagłówek "Lista formatek"
        var listaFormatHeading = Array.from(document.querySelectorAll('h2')).find(function(h2) {
            return (h2.textContent || '').trim() === 'Lista formatek';
        });
        
        if (!listaFormatHeading) {
            console.warn('[EOZ Commission Generate Page Module] "Lista formatek" heading not found');
            return;
        }
        
        // Znajdź tabelę listy formatek
        var table = listaFormatHeading.nextElementSibling;
        while (table && table.tagName !== 'TABLE') {
            table = table.nextElementSibling;
        }
        
        if (!table) {
            console.warn('[EOZ Commission Generate Page Module] Formats list table not found');
            return;
        }
        
        // Dodaj klasę do nagłówka
        listaFormatHeading.classList.add('eoz-generate-page-format-list-heading');
        table.classList.add('eoz-generate-page-format-list-table');
        
        // Funkcja sprawdzająca czy tabela zmieści się na pierwszej stronie
        function checkTableHeight() {
            // W trybie drukowania A4: wysokość strony ~29.7cm (około 1120px przy 96dpi)
            // Marginesy: około 2cm góra/dół = 4cm razem
            // Dostępna wysokość: ~25.7cm = około 970px
            // Sprawdzamy przybliżoną wysokość sekcji przed "Lista formatek"
            var estimatedAvailableHeight = 970; // px w trybie drukowania
            
            // Znajdź wszystkie sekcje przed "Lista formatek"
            var allHeadings = Array.from(document.querySelectorAll('h1, h2'));
            var listaIndex = allHeadings.findIndex(function(h) { return h === listaFormatHeading; });
            var sectionsBefore = allHeadings.slice(0, listaIndex);
            
            // Szacunkowa wysokość sekcji przed (bardzo przybliżona)
            var estimatedBeforeHeight = sectionsBefore.length * 150; // każda sekcja ~150px
            
            // Sprawdź wysokość tabeli
            var tableHeight = table.offsetHeight || table.scrollHeight;
            
            // Jeśli tabela + sekcje przed > dostępna wysokość, użyj page-break
            var needsPageBreak = (estimatedBeforeHeight + tableHeight) > estimatedAvailableHeight;
            
            return needsPageBreak;
        }
        
        // Sprawdź wysokość przy załadowaniu strony
        var needsBreak = checkTableHeight();
        
        // Dodaj style CSS dla podziału strony (działa w trybie drukowania)
        var pageBreakStyles = '' +
            '@media print {\n' +
            '  /* Jeśli tabela nie zmieści się, użyj page-break-before */\n' +
            '  .eoz-generate-page-format-list-heading.eoz-needs-pagebreak {\n' +
            '    page-break-before: always !important;\n' +
            '    break-before: page !important;\n' +
            '  }\n' +
            '  /* Jeśli tabela się zmieści, pozwól na naturalny flow */\n' +
            '  .eoz-generate-page-format-list-heading:not(.eoz-needs-pagebreak) {\n' +
            '    page-break-before: auto !important;\n' +
            '    break-before: auto !important;\n' +
            '  }\n' +
            '  /* Unikaj łamania tabeli */\n' +
            '  .eoz-generate-page-format-list-table {\n' +
            '    page-break-inside: avoid !important;\n' +
            '    break-inside: avoid !important;\n' +
            '  }\n' +
            '}\n';
        
        window.EOZ.injectStyles(pageBreakStyles, { id: 'eoz-generate-page-format-list-pagebreak-css' });
        
        // Jeśli potrzebny page-break, dodaj klasę
        if (needsBreak) {
            listaFormatHeading.classList.add('eoz-needs-pagebreak');
            console.log('[EOZ Commission Generate Page Module] Formats list will start on new page (table too large)');
        } else {
            console.log('[EOZ Commission Generate Page Module] Formats list will print on first page (table fits)');
        }
        
        // Sprawdź ponownie po załadowaniu obrazów (które mogą zmienić wysokość)
        window.addEventListener('load', function() {
            var needsBreakAfterLoad = checkTableHeight();
            if (needsBreakAfterLoad && !listaFormatHeading.classList.contains('eoz-needs-pagebreak')) {
                listaFormatHeading.classList.add('eoz-needs-pagebreak');
                console.log('[EOZ Commission Generate Page Module] Updated: Formats list needs new page after images loaded');
            } else if (!needsBreakAfterLoad && listaFormatHeading.classList.contains('eoz-needs-pagebreak')) {
                listaFormatHeading.classList.remove('eoz-needs-pagebreak');
                console.log('[EOZ Commission Generate Page Module] Updated: Formats list fits on first page after images loaded');
            }
        });
    }

    /**
     * Główna funkcja aplikująca modyfikacje
     */
    function apply() {
        // Pobierz nazwę zlecenia i formatuj H1
        fetchCommissionName(commissionId)
            .then(function(commissionName) {
                formatH1(commissionName);
                console.log('[EOZ Commission Generate Page Module] Commission name fetched and H1 formatted');
            })
            .catch(function(error) {
                console.warn('[EOZ Commission Generate Page Module] Failed to fetch commission name:', error);
                // Formatuj H1 nawet jeśli nie udało się pobrać nazwy
                formatH1('');
            });
        
        // Formatuj paragraf z klientem
        formatClientParagraph();
        
        // Zmodyfikuj tabelę procesu produkcyjnego
        modifyProductionProcessTable();
        
        // Usuń określone obrazki kodów kreskowych
        removeSpecificBarcodeImages();
        
        // Ustaw jednakowe rozmiary kodów kreskowych (po usunięciu niektórych)
        normalizeBarcodeImages();
        
        // Dodaj podział strony A4 dla listy formatek
        addPageBreakForFormatsList();
        
        console.log('[EOZ Commission Generate Page Module v' + VERSION + '] Applied');
    }

    // Uruchom moduł
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', apply, { once: true });
    } else {
        apply();
    }
})();

