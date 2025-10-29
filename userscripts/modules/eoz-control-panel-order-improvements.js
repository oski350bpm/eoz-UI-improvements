// EOZ Control Panel Order Improvements Module
// Applies on /machines/control_panel_order (work-in-progress view)

(function() {
    'use strict';

    var VERSION = '1.0.1';

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
                        if (plate) {
                            if (platesMap[plate]) {
                                platesMap[plate] += sumPlates;
                            } else {
                                platesMap[plate] = sumPlates;
                            }
                        }
                    }
                }

                for (var plateName in platesMap) {
                    if (platesMap.hasOwnProperty(plateName)) {
                        platesInfo.push({ plate: plateName, sumPlates: platesMap[plateName] });
                        totalPlates += platesMap[plateName];
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
        
        console.log('[EOZ Control Panel Order v' + VERSION + '] Header info added', {
            orderNumber: orderNumber,
            platesInfo: platesInfo,
            totalPlates: totalPlates
        });
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

    function apply() {
        addHeaderInfo();
        addEndOperationConfirmation();
        console.log('[EOZ Control Panel Order Module v' + VERSION + '] Applied');
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

