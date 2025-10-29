// EOZ Commission Generate Page Improvements Module
// Applies on /commission/generate_page/[ID]

(function() {
    'use strict';

    var VERSION = '1.0.2';
    
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
        '.eoz-generate-page-barcode-img{height:60px!important;width:250px!important;object-fit:fill!important}\n';

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
     * Dodaje nazwę zlecenia do H1
     */
    function addCommissionNameToH1(commissionName) {
        var h1 = document.querySelector('h1');
        if (!h1) {
            console.warn('[EOZ Commission Generate Page Module] H1 not found');
            return;
        }
        
        var currentText = h1.textContent || '';
        // Sprawdzamy czy nazwa już nie jest dodana (żeby nie duplikować)
        if (currentText.indexOf(commissionName) === -1) {
            // Używamy innerHTML aby <br> było renderowane, a nie textContent
            h1.innerHTML = currentText.trim() + '<br>' + commissionName;
            console.log('[EOZ Commission Generate Page Module] Commission name added to H1: ' + commissionName);
        }
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
     * Główna funkcja aplikująca modyfikacje
     */
    function apply() {
        // Pobierz nazwę zlecenia
        fetchCommissionName(commissionId)
            .then(function(commissionName) {
                addCommissionNameToH1(commissionName);
                console.log('[EOZ Commission Generate Page Module] Commission name fetched successfully');
            })
            .catch(function(error) {
                console.warn('[EOZ Commission Generate Page Module] Failed to fetch commission name:', error);
            });
        
        // Zmodyfikuj tabelę procesu produkcyjnego
        modifyProductionProcessTable();
        
        // Ustaw jednakowe rozmiary kodów kreskowych
        normalizeBarcodeImages();
        
        console.log('[EOZ Commission Generate Page Module v' + VERSION + '] Applied');
    }

    // Uruchom moduł
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', apply, { once: true });
    } else {
        apply();
    }
})();

