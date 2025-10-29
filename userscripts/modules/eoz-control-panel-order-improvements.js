// EOZ Control Panel Order Improvements Module
// Applies on /machines/control_panel_order (work-in-progress view)

(function() {
    'use strict';

    var VERSION = '1.2.1';

    // Expose version to global EOZ object
    if (!window.EOZ) window.EOZ = {};
    if (!window.EOZ.ControlPanelOrder) window.EOZ.ControlPanelOrder = {};
    window.EOZ.ControlPanelOrder.VERSION = VERSION;

    if (!window.EOZ) {
        console.warn('[EOZ Control Panel Order Module] Core not available');
        return;
    }

    if (window.location.href.indexOf('/machines/control_panel_order') === -1) {
        return; // not this page
    }

    function addHeaderInfo() {
        // Find breadcrumb and add order info below it
        var breadcrumb = document.querySelector('.breadcrumb');
        if (!breadcrumb) {
            console.warn('[EOZ Control Panel Order v' + VERSION + '] Breadcrumb not found');
            return;
        }

        // Get order number from URL
        var orderNumber = new URLSearchParams(window.location.search).get('number2') || '';

        // Find plates table and extract info
        var allTables = document.querySelectorAll('table');
        var platesTable = null;
        var platesInfo = [];
        var totalPlates = 0;

        for (var i = 0; i < allTables.length; i++) {
            var table = allTables[i];
            var headers = table.querySelectorAll('thead th');
            var hasPlateColumn = false;
            for (var j = 0; j < headers.length; j++) {
                if (headers[j].textContent.indexOf('Płyta') !== -1 || headers[j].textContent.indexOf('Suma płyt') !== -1) {
                    hasPlateColumn = true;
                    break;
                }
            }
            if (hasPlateColumn) {
                platesTable = table;
                var rows = table.querySelectorAll('tbody tr');
                var platesMap = {};

                for (var k = 0; k < rows.length; k++) {
                    var cells = rows[k].querySelectorAll('td');
                    if (cells.length >= 7) {
                        var plate = (cells[2] && cells[2].textContent) ? cells[2].textContent.trim() : '';
                        var sumPlates = parseInt((cells[6] && cells[6].textContent) ? cells[6].textContent.trim() : '0') || 0;
                        if (plate && !platesInfo.find(function(p) { return p.plate === plate; })) {
                            platesInfo.push({ plate: plate, sumPlates: sumPlates });
                            totalPlates = sumPlates; // Take value, don't sum (one plate per order)
                        }
                    }
                }
                break;
            }
        }

        // Create info container
        var existingInfo = document.getElementById('eoz-order-header-info');
        if (existingInfo) {
            existingInfo.remove();
        }

        var infoHTML = '<div id="eoz-order-header-info" style="margin-top: 10px; padding: 10px; background-color: #f8f9fa; border-radius: 4px;">';
        
        if (orderNumber) {
            infoHTML += '<div style="font-weight: bold; margin-bottom: 5px;">NR zlecenia: <span style="color: #007bff;">' + orderNumber + '</span></div>';
        }
        
        if (platesInfo.length > 0) {
            var platesText = platesInfo.map(function(p) { return p.plate; }).join(', ');
            infoHTML += '<div style="margin-bottom: 5px;">Płyta: <span style="color: #333;">' + platesText + '</span></div>';
        }
        
        if (totalPlates > 0) {
            infoHTML += '<div>Suma płyt: <span style="color: #28a745; font-weight: bold;">' + totalPlates + '</span></div>';
        }
        
        infoHTML += '</div>';

        // Insert after breadcrumb
        breadcrumb.insertAdjacentHTML('afterend', infoHTML);
        
    }

    function addEndOperationConfirmation() {
        // Add confirmation popup for end operation button
        var endButtons = document.querySelectorAll('a.btn-danger.end_operation_button');
        endButtons.forEach(function(button) {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                var href = button.getAttribute('href');
                
                // Show confirmation modal
                if (window.jQuery && window.jQuery.fn.modal) {
                    showEndOperationConfirmationModal(href);
                } else {
                    // Fallback to browser confirm
                    if (confirm('Czy na pewno chcesz zakończyć operację?\n\nUWAGA: Operacji nie można cofnąć!')) {
                        window.location.href = href;
                    }
                }
            });
        });
    }

    function showEndOperationConfirmationModal(originalHref) {
        // Create confirmation modal
        var modalId = 'eoz-end-operation-confirmation-modal';
        var existingModal = document.getElementById(modalId);
        if (existingModal) {
            existingModal.remove();
        }
        
        var modalHTML = '' +
            '<div class="modal fade" id="' + modalId + '" tabindex="-1" role="dialog" aria-labelledby="' + modalId + '-label" aria-hidden="true">' +
            '  <div class="modal-dialog" role="document">' +
            '    <div class="modal-content">' +
            '      <div class="modal-header" style="background-color: #dc3545; color: white;">' +
            '        <h4 class="modal-title" id="' + modalId + '-label" style="color: white;">Potwierdzenie zakończenia operacji</h4>' +
            '        <button type="button" class="close" data-dismiss="modal" aria-label="Close" style="color: white;">' +
            '          <span aria-hidden="true">&times;</span>' +
            '        </button>' +
            '      </div>' +
            '      <div class="modal-body">' +
            '        <p><strong>Czy na pewno chcesz zakończyć pracę nad zleceniem?</strong></p>' +
            '        <div class="alert alert-danger" role="alert">' +
            '          <strong>UWAGA:</strong> Operacji nie można cofnąć!' +
            '        </div>' +
            '      </div>' +
            '      <div class="modal-footer">' +
            '        <button type="button" class="btn btn-secondary" data-dismiss="modal">Anuluj</button>' +
            '        <button type="button" class="btn btn-danger" id="eoz-confirm-end">Zakończ operację</button>' +
            '      </div>' +
            '    </div>' +
            '  </div>' +
            '</div>';
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        var modal = document.getElementById(modalId);
        var confirmBtn = document.getElementById('eoz-confirm-end');
        
        confirmBtn.addEventListener('click', function() {
            window.location.href = originalHref;
        });
        
        // Show modal
        window.jQuery(modal).modal('show');
    }

    function logTableStructure(table, label) {
        if (!table) {
            console.log('[EOZ Table Debug] ' + label + ': Table is null');
            return;
        }
        
        var structure = {
            label: label,
            hasThead: !!table.querySelector('thead'),
            hasTbody: !!table.querySelector('tbody'),
            headers: [],
            rows: []
        };
        
        // Log headers
        var thead = table.querySelector('thead');
        if (thead) {
            var headerCells = thead.querySelectorAll('th');
            for (var i = 0; i < headerCells.length; i++) {
                structure.headers.push({
                    index: i,
                    text: headerCells[i].textContent.trim(),
                    html: headerCells[i].outerHTML.substring(0, 100)
                });
            }
        }
        
        // Log rows
        var tbody = table.querySelector('tbody');
        if (tbody) {
            var rows = tbody.querySelectorAll('tr');
            for (var j = 0; j < rows.length; j++) {
                var row = rows[j];
                var cells = row.querySelectorAll('td');
                var rowData = {
                    rowIndex: j,
                    cells: []
                };
                
                for (var k = 0; k < cells.length; k++) {
                    var cell = cells[k];
                    var link = cell.querySelector('a');
                    rowData.cells.push({
                        cellIndex: k,
                        text: cell.textContent.trim(),
                        hasLink: !!link,
                        linkHref: link ? link.href : null,
                        linkHTML: link ? link.outerHTML : null,
                        cellHTML: cell.outerHTML.substring(0, 150)
                    });
                }
                
                structure.rows.push(rowData);
            }
        }
        
        console.log('[EOZ Table Debug] ' + label + ':', JSON.stringify(structure, null, 2));
    }

    function removeFirstTable() {
        // Find first table (with plates info)
        var allTables = document.querySelectorAll('table');
        var firstTable = null;
        
        for (var i = 0; i < allTables.length; i++) {
            var headers = allTables[i].querySelectorAll('thead th');
            var hasPlateColumn = false;
            for (var j = 0; j < headers.length; j++) {
                if (headers[j].textContent.indexOf('Płyta') !== -1) {
                    hasPlateColumn = true;
                    break;
                }
            }
            if (hasPlateColumn) {
                firstTable = allTables[i];
                break;
            }
        }
        
        if (!firstTable) {
            console.warn('[EOZ Control Panel Order v' + VERSION + '] First table not found');
            return null;
        }
        
        // Log first table structure BEFORE modification
        logTableStructure(firstTable, 'FIRST TABLE (before removal)');
        
        // Check for link in second table (in tabpanels) - this might be the actual link we need
        var tabPanels = document.querySelectorAll('[role="tabpanel"]');
        var linkInfo = null;
        
        // Try to find link in second table first (this is probably where the real link is)
        // Also check for check-double buttons in Opcje column - they have the link we need
        for (var p = 0; p < tabPanels.length; p++) {
            var panel = tabPanels[p];
            var table = panel.querySelector('table');
            if (table && table.querySelector('tbody')) {
                var firstRow = table.querySelector('tbody tr');
                if (firstRow) {
                    var firstCell = firstRow.querySelector('td:first-child');
                    if (firstCell) {
                        var link = firstCell.querySelector('a');
                        if (link) {
                            linkInfo = {
                                href: link.href,
                                text: link.textContent.trim(),
                                html: link.outerHTML,
                                source: 'second-table-panel-' + (panel.id || p)
                            };
                            break;
                        }
                    }
                    
                    // If no link in first cell, check Opcje column for check-double button
                    // This link can be used to construct links for first column
                    var allCells = firstRow.querySelectorAll('td');
                    for (var cellIdx = 0; cellIdx < allCells.length; cellIdx++) {
                        var cell = allCells[cellIdx];
                        var checkDoubleBtn = cell.querySelector('a.tippy');
                        if (checkDoubleBtn) {
                            var icon = checkDoubleBtn.querySelector('i');
                            if (icon && icon.className.indexOf('fa-check-double') !== -1) {
                                // Extract parameters from check-double button href
                                // Format: .../control_panel_set_suborder_elements_status_done_by_form/ORDER_CODE?number2=X&block_id=Y&code=Z
                                var href = checkDoubleBtn.href;
                                var firstCellText = firstCell ? firstCell.textContent.trim() : '';
                                
                                // Parse URL
                                var urlParts = href.split('?');
                                var baseUrl = urlParts[0];
                                var paramsStr = urlParts[1] || '';
                                var params = new URLSearchParams(paramsStr);
                                
                                // Get number2 and block_id from params
                                var number2 = params.get('number2') || '';
                                var blockId = params.get('block_id') || '';
                                
                                // Construct link for first column element
                                // Use control_panel_set_element_status_done_by_form for single elements
                                // Format: .../control_panel_set_element_status_done_by_form/ELEMENT_CODE?number2=ORDER_CODE&block_id=BLOCK_ID&code=ELEMENT_CODE
                                var elementCode = firstCellText;
                                var elementLinkBase = baseUrl.replace('control_panel_set_suborder_elements_status_done_by_form', 'control_panel_set_element_status_done_by_form');
                                var elementLink = elementLinkBase.replace(/\/[^\/]+\?/, '/' + elementCode + '?');
                                
                                // Construct full href with correct code parameter
                                var newParams = new URLSearchParams();
                                newParams.set('number2', number2);
                                newParams.set('block_id', blockId);
                                newParams.set('code', elementCode);
                                
                                linkInfo = {
                                    href: elementLinkBase.split('/').slice(0, -1).join('/') + '/' + elementCode + '?' + newParams.toString(),
                                    text: firstCellText,
                                    html: null,
                                    source: 'from-check-double-button',
                                    template: true, // Indicates we need to replace code for each row
                                    baseUrl: elementLinkBase.split('/').slice(0, -1).join('/'),
                                    number2: number2,
                                    blockId: blockId
                                };
                                break;
                            }
                        }
                        if (linkInfo) break;
                    }
                    if (linkInfo) break;
                }
            }
        }
        
        // If no link in second table, try first table
        if (!linkInfo) {
            var firstRow = firstTable.querySelector('tbody tr');
            if (firstRow) {
                var firstCell = firstRow.querySelector('td:first-child');
                if (firstCell) {
                    var link = firstCell.querySelector('a');
                    if (link) {
                        linkInfo = {
                            href: link.href,
                            text: link.textContent.trim(),
                            html: link.outerHTML,
                            source: 'first-table'
                        };
                    } else {
                        // If no link, use text but don't create invalid link
                        linkInfo = {
                            href: null,
                            text: firstCell.textContent.trim(),
                            html: null,
                            source: 'first-table-no-link'
                        };
                    }
                }
            }
        }
        
        // Log link info for debugging
        if (linkInfo) {
            console.log('[EOZ Link Debug] Final linkInfo:', JSON.stringify(linkInfo, null, 2));
        } else {
            console.warn('[EOZ Link Debug] No link found in any table!');
        }
        
        // Save headers from first table before removal
        var savedHeaders = null;
        var thead = firstTable.querySelector('thead');
        if (thead) {
            savedHeaders = thead.cloneNode(true);
        }
        
        // Remove first table
        firstTable.parentElement.removeChild(firstTable);
        
        return {
            linkInfo: linkInfo,
            headers: savedHeaders
        };
    }

    function reorganizeTables(data) {
        var linkInfo = data && data.linkInfo ? data.linkInfo : null;
        var savedHeaders = data && data.headers ? data.headers : null;
        
        // Find tabs container
        var tabList = document.querySelector('[role="tablist"]');
        var tabPanels = document.querySelectorAll('[role="tabpanel"]');
        
        if (!tabList || tabPanels.length === 0) {
            console.warn('[EOZ Control Panel Order v' + VERSION + '] Tabs not found');
            return;
        }
        
        var container = tabList.parentElement;
        
        // Get original tabs BEFORE removing tabList
        var originalTabs = document.querySelectorAll('[role="tab"]');
        
        // Log all panels BEFORE modification
        for (var pi = 0; pi < tabPanels.length; pi++) {
            var panel = tabPanels[pi];
            var table = panel.querySelector('table');
            if (table) {
                logTableStructure(table, 'PANEL ' + pi + ' (' + (panel.id || 'no-id') + ') - BEFORE');
            }
        }
        
        // Remove tabs
        tabList.parentElement.removeChild(tabList);
        
        // Process each tabpanel - remove tabpanel wrapper and show all tables
        var tablesHTML = [];
        var headers = null;
        
        for (var i = 0; i < tabPanels.length; i++) {
            var panel = tabPanels[i];
            var table = panel.querySelector('table');
            
            if (!table) {
                continue;
            }
            
            // Get title from original tab
            var tabTitle = '';
            if (originalTabs[i]) {
                tabTitle = originalTabs[i].textContent.trim();
            }
            
            // Process table: remove columns and add link to first column
            var thead = table.querySelector('thead');
            var tbody = table.querySelector('tbody');
            
            if (!tbody) {
                continue;
            }
            
            // Find columns to remove - check both thead (if exists) and first data row
            var indicesToRemove = [];
            
            // If table has thead, use headers to find column indices
            if (thead) {
                var headerCells = thead.querySelectorAll('th');
                for (var hIdx = 0; hIdx < headerCells.length; hIdx++) {
                    var headerText = headerCells[hIdx].textContent.trim();
                    if (headerText === 'Usłojenie' || headerText === 'Obrazek' || headerText === 'Info' || headerText === 'Zlecenie') {
                        indicesToRemove.push(hIdx);
                    }
                }
            }
            
            // Also check first data row to verify/find columns (if no thead or didn't find all in thead)
            var firstDataRow = tbody.querySelector('tr:not(:empty)') || tbody.querySelector('tr');
            if (firstDataRow) {
                // If we found columns from thead, verify they're correct by checking data
                // If we didn't find from thead, find from data
                if (indicesToRemove.length === 0) {
                    // If no thead or didn't find columns in headers, use data row
                    var sampleCells = firstDataRow.querySelectorAll('td');
                
                // Find Usłojenie (index 9), Obrazek (index 10), and Info/Zlecenie (last column)
                if (sampleCells.length > 10) {
                    // Check if cell at index 9 looks like Usłojenie (contains "Nie" or "Tak")
                    var cell9Text = sampleCells[9] ? sampleCells[9].textContent.trim() : '';
                    var cell10Text = sampleCells[10] ? sampleCells[10].textContent.trim() : '';
                    
                    // If cell 9 has "Nie" or "Tak", it's likely Usłojenie
                    if (cell9Text === 'Nie' || cell9Text === 'Tak') {
                        indicesToRemove.push(9); // Usłojenie
                    }
                    // If cell 10 is empty or looks like image column, it's Obrazek
                    if (cell10Text === '' || (sampleCells[10] && sampleCells[10].querySelector('img'))) {
                        indicesToRemove.push(10); // Obrazek
                    }
                    
                    // Check last column for "Info" or "Zlecenie"
                    var lastIndex = sampleCells.length - 1;
                    var lastCell = sampleCells[lastIndex];
                    if (lastCell) {
                        var lastCellText = lastCell.textContent.trim();
                        var hasButtons = lastCell.querySelector('a.tippy');
                        if (!hasButtons && (lastCellText === '' || lastCellText.toLowerCase().indexOf('info') !== -1 || lastCellText.toLowerCase().indexOf('zlecenie') !== -1)) {
                            indicesToRemove.push(lastIndex);
                        }
                    }
                }
            }
            
            // Now process rows
            var rows = tbody.querySelectorAll('tr');
            for (var j = 0; j < rows.length; j++) {
                var row = rows[j];
                var cells = row.querySelectorAll('td');
                
                // Add link to first cell if linkInfo exists and has valid href and first cell doesn't have link
                if (linkInfo && linkInfo.href && cells[0] && !cells[0].querySelector('a')) {
                    var cellText = cells[0].textContent.trim();
                    var link = document.createElement('a');
                    
                    // If linkInfo has template flag, construct href for this specific row
                    if (linkInfo.template && linkInfo.baseUrl && linkInfo.number2 && linkInfo.blockId) {
                        // Construct link for this specific element code
                        var newParams = new URLSearchParams();
                        newParams.set('number2', linkInfo.number2);
                        newParams.set('block_id', linkInfo.blockId);
                        newParams.set('code', cellText);
                        link.href = linkInfo.baseUrl + '/' + cellText + '?' + newParams.toString();
                    } else if (linkInfo.template) {
                        // Fallback: try to replace code in existing href
                        link.href = linkInfo.href.replace(/code=[^&]+/, 'code=' + cellText);
                    } else {
                        link.href = linkInfo.href;
                    }
                    
                    link.textContent = cellText;
                    cells[0].textContent = '';
                    cells[0].appendChild(link);
                }
                
                // Format numbers in Przód, Tył, Lewo, Prawo columns (remove .00)
                // These are typically at indices 5, 6, 7, 8 (after Numer, Nazwa, Ilość, Długość, Szerokość)
                // But we need to check dynamically since structure may vary
                for (var numIdx = 0; numIdx < cells.length; numIdx++) {
                    var cell = cells[numIdx];
                    if (cell) {
                        var cellText = cell.textContent.trim();
                        // Check if it's a number ending with .00 (like "1.00", "0.00", may have spaces)
                        // Match pattern: optional spaces, digits, .00, optional spaces
                        var match = cellText.match(/^\s*(\d+)\.00\s*$/);
                        if (match) {
                            var numValue = parseInt(match[1], 10);
                            if (!isNaN(numValue)) {
                                cell.textContent = numValue.toString();
                            }
                        }
                    }
                }
                
                // Remove data cells in reverse order (to maintain indices)
                indicesToRemove.sort(function(a, b) { return b - a; }).forEach(function(idx) {
                    if (cells[idx]) {
                        cells[idx].parentElement.removeChild(cells[idx]);
                    }
                });
                
                // Remove buttons from Opcje column (fa-check and fa-check-double)
                // Opcje column is typically the second-to-last (before Info), but after removing Usłojenie and Obrazek
                // it should be around position 11 (if starting from 0: 0-8 are data, 9 was Usłojenie, 10 was Obrazek, 11 is Opcje, 12 is Info)
                // After removal: Opcje should be at index 11-2 = 9 (if both removed) or we find it by looking for buttons
                var allCells = row.querySelectorAll('td');
                // Find the cell that contains check buttons - this is the Opcje column
                for (var m = 0; m < allCells.length; m++) {
                    var cell = allCells[m];
                    var checkButtons = cell.querySelectorAll('a.tippy');
                    if (checkButtons.length > 0) {
                        // This is likely the Opcje column - remove fa-check and fa-check-double buttons
                        // Collect buttons to remove first (to avoid modifying NodeList while iterating)
                        var buttonsToRemove = [];
                        for (var n = 0; n < checkButtons.length; n++) {
                            var icon = checkButtons[n].querySelector('i');
                            if (icon) {
                                var iconClasses = icon.className || '';
                                var hasCheck = iconClasses.indexOf('fa-check') !== -1;
                                var hasCheckDouble = iconClasses.indexOf('fa-check-double') !== -1;
                                // Collect buttons to remove
                                if (hasCheck || hasCheckDouble) {
                                    buttonsToRemove.push(checkButtons[n]);
                                }
                            }
                        }
                        // Now remove collected buttons
                        for (var r = 0; r < buttonsToRemove.length; r++) {
                            var button = buttonsToRemove[r];
                            if (button && button.parentElement) {
                                button.parentElement.removeChild(button);
                            } else if (button && button.parentNode) {
                                button.parentNode.removeChild(button);
                            } else if (button && button.remove) {
                                button.remove();
                            }
                        }
                        break; // Found Opcje column, no need to continue
                    }
                }
            }
            
            // Remove thead headers (we don't want headers - panels should display without them)
            // But first remove columns from thead if exists
            if (thead) {
                var headerCells = thead.querySelectorAll('th');
                // Remove header cells in reverse order
                indicesToRemove.sort(function(a, b) { return b - a; }).forEach(function(idx) {
                    if (headerCells[idx]) {
                        headerCells[idx].parentElement.removeChild(headerCells[idx]);
                    }
                });
                // Then remove entire thead
                table.removeChild(thead);
            }
            
            // Check if table has data rows (skip empty tables)
            var dataRows = tbody.querySelectorAll('tr');
            var hasDataRows = false;
            for (var dr = 0; dr < dataRows.length; dr++) {
                var rowCells = dataRows[dr].querySelectorAll('td');
                if (rowCells.length > 0) {
                    hasDataRows = true;
                    break;
                }
            }
            
            // Skip empty tables (don't display them)
            if (!hasDataRows) {
                continue;
            }
            
            // Clone table with title (after processing rows)
            var tableClone = table.cloneNode(true);
            var titleDiv = document.createElement('div');
            titleDiv.className = 'eoz-table-title';
            titleDiv.style.cssText = 'font-weight: bold; font-size: 16px; margin: 20px 0 10px 0; padding: 10px; background-color: #f8f9fa; border-radius: 4px;';
            titleDiv.textContent = tabTitle;
            
            var tableWrapper = document.createElement('div');
            tableWrapper.className = 'eoz-table-wrapper';
            tableWrapper.appendChild(titleDiv);
            tableWrapper.appendChild(tableClone);
            
            var wrapperHTML = tableWrapper.outerHTML;
            tablesHTML.push(wrapperHTML);
        }
        
        // Insert all tables one after another
        if (tablesHTML.length > 0) {
            var newContainer = document.createElement('div');
            newContainer.className = 'eoz-all-tables';
            newContainer.innerHTML = tablesHTML.join('');
            
            if (container) {
                container.appendChild(newContainer);
                
                // Log structure of inserted tables AFTER modification
                var insertedTables = newContainer.querySelectorAll('table');
                for (var ti = 0; ti < insertedTables.length; ti++) {
                    logTableStructure(insertedTables[ti], 'FINAL TABLE ' + ti + ' (after insertion)');
                }
            }
        }
        
        // Remove original tabpanels
        for (var p = 0; p < tabPanels.length; p++) {
            if (tabPanels[p].parentElement) {
                tabPanels[p].parentElement.removeChild(tabPanels[p]);
            }
        }
    }

    function findCheckDoubleHref() {
        // Find check-double button href from any table
        var checkDoubleButtons = document.querySelectorAll('a.tippy');
        
        for (var i = 0; i < checkDoubleButtons.length; i++) {
            var icon = checkDoubleButtons[i].querySelector('i');
            if (icon && icon.className.indexOf('fa-check-double') !== -1) {
                return checkDoubleButtons[i].href;
            }
        }
        
        return null;
    }

    function addCheckDoubleButton(checkDoubleHref) {
        if (!checkDoubleHref) {
            console.warn('[EOZ Control Panel Order v' + VERSION + '] Check-double button href not provided');
            return;
        }
        
        // Find end operation button
        var endButton = document.querySelector('a.btn-danger.end_operation_button');
        if (!endButton) {
            console.warn('[EOZ Control Panel Order v' + VERSION + '] End operation button not found');
            return;
        }
        
        // Create new check-double button
        var newButton = document.createElement('a');
        newButton.href = checkDoubleHref;
        newButton.className = 'btn btn-success end_operation_button eoz-check-double-btn';
        newButton.style.cssText = 'margin-left: 10px;';
        newButton.innerHTML = '<i class="fa fa-check-double"></i> Zakończ wszystkie';
        
        // Add click handler with confirmation
        newButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (window.jQuery && window.jQuery.fn.modal) {
                showCheckDoubleConfirmationModal(checkDoubleHref);
            } else {
                if (confirm('Czy na pewno chcesz zakończyć wszystkie elementy?\n\nUWAGA: Operacji nie można cofnąć!')) {
                    window.location.href = checkDoubleHref;
                }
            }
        });
        
        // Insert after end button
        endButton.parentElement.insertBefore(newButton, endButton.nextSibling);
    }

    function showCheckDoubleConfirmationModal(originalHref) {
        var modalId = 'eoz-check-double-confirmation-modal';
        var existingModal = document.getElementById(modalId);
        if (existingModal) {
            existingModal.remove();
        }
        
        var modalHTML = '' +
            '<div class="modal fade" id="' + modalId + '" tabindex="-1" role="dialog" aria-labelledby="' + modalId + '-label" aria-hidden="true">' +
            '  <div class="modal-dialog" role="document">' +
            '    <div class="modal-content">' +
            '      <div class="modal-header" style="background-color: #28a745; color: white;">' +
            '        <h4 class="modal-title" id="' + modalId + '-label" style="color: white;">Potwierdzenie zakończenia wszystkich elementów</h4>' +
            '        <button type="button" class="close" data-dismiss="modal" aria-label="Close" style="color: white;">' +
            '          <span aria-hidden="true">&times;</span>' +
            '        </button>' +
            '      </div>' +
            '      <div class="modal-body">' +
            '        <p><strong>Czy na pewno chcesz zakończyć wszystkie elementy?</strong></p>' +
            '        <div class="alert alert-warning" role="alert">' +
            '          <strong>UWAGA:</strong> Operacji nie można cofnąć!' +
            '        </div>' +
            '      </div>' +
            '      <div class="modal-footer">' +
            '        <button type="button" class="btn btn-secondary" data-dismiss="modal">Anuluj</button>' +
            '        <button type="button" class="btn btn-success" id="eoz-confirm-check-double">Zakończ wszystkie</button>' +
            '      </div>' +
            '    </div>' +
            '  </div>' +
            '</div>';
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        var modal = document.getElementById(modalId);
        var confirmBtn = document.getElementById('eoz-confirm-check-double');
        
        confirmBtn.addEventListener('click', function() {
            window.location.href = originalHref;
        });
        
        window.jQuery(modal).modal('show');
    }

    function getMachineId() {
        // Try to get machine ID from end operation button URL
        var endButton = document.querySelector('a.btn-danger.end_operation_button');
        if (endButton && endButton.href) {
            var match = endButton.href.match(/end_operation_2020\/(\d+)\//);
            if (match) {
                return parseInt(match[1], 10);
            }
        }
        return null;
    }

    function isOkleiniarkaMachine() {
        // Check if current machine is Okleiniarka by text content
        var machineText = document.body.innerText || document.body.textContent || '';
        return machineText.indexOf('Okleiniarka') !== -1;
    }

    function apply() {
        // Get machine ID
        var machineId = getMachineId();
        
        addHeaderInfo();
        
        // Find check-double href before removing tables
        var checkDoubleHref = findCheckDoubleHref();
        
        // Reorganize tables: remove first, reorganize second
        var tableData = removeFirstTable();
        if (tableData) {
            reorganizeTables(tableData);
        } else {
            // If no first table found, still reorganize tables (for machines with different structure)
            reorganizeTables({ linkInfo: null, headers: null });
        }
        
        // Hide check-double button for Okleiniarka machine (detect by text, not ID)
        var isOkleiniarka = isOkleiniarkaMachine();
        if (isOkleiniarka) {
            // Don't add the button for Okleiniarka
            // Also hide it if it was already added
            var checkDoubleBtn = document.querySelector('.eoz-check-double-btn, a.btn-success.eoz-check-double-btn');
            if (checkDoubleBtn) {
                checkDoubleBtn.style.display = 'none';
            }
        } else {
            // Add check-double button for other machines
            addCheckDoubleButton(checkDoubleHref);
        }
        
        addEndOperationConfirmation();
    }

    function waitAndRun() {
        // Wait for breadcrumb and table to be ready
        window.EOZ.waitFor('.breadcrumb', { timeout: 5000 })
            .then(function() {
                // Wait a bit more for table to populate
                setTimeout(function() {
                    apply();
                }, 500);
            })
            .catch(function(){ 
                console.warn('[EOZ Control Panel Order v' + VERSION + '] Page not ready, applying anyway');
                setTimeout(function() {
                    apply();
                }, 1000);
            });
    }

    if (document.readyState === 'loading') { 
        document.addEventListener('DOMContentLoaded', waitAndRun, { once: true }); 
    } else { 
        waitAndRun(); 
    }
})();

