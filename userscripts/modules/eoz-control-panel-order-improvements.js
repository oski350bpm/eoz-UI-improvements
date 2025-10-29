// EOZ Control Panel Order Improvements Module
// Applies on /machines/control_panel_order (work-in-progress view)

(function() {
    'use strict';

    var VERSION = '1.0.0';

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

    function addStartOperationConfirmation() {
        // Add confirmation popup for start operation buttons
        var startButtons = document.querySelectorAll('a.btn.btn-success.start[href*="start_operation_block"]');
        startButtons.forEach(function(button) {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Extract block ID from href
                var href = button.getAttribute('href');
                var blockIdMatch = href.match(/start_operation_block\/(\d+)/);
                var blockId = blockIdMatch ? blockIdMatch[1] : '';
                
                // Show confirmation modal
                if (window.jQuery && window.jQuery.fn.modal) {
                    showStartConfirmationModal(blockId, href);
                } else {
                    // Fallback to browser confirm
                    if (confirm('Czy na pewno chcesz rozpocząć operację na tym zleceniu?')) {
                        window.location.href = href;
                    }
                }
            });
        });
    }

    function showStartConfirmationModal(blockId, originalHref) {
        // Create confirmation modal
        var modalId = 'eoz-start-confirmation-modal';
        var existingModal = document.getElementById(modalId);
        if (existingModal) {
            existingModal.remove();
        }
        
        var modalHTML = '' +
            '<div class="modal fade" id="' + modalId + '" tabindex="-1" role="dialog" aria-labelledby="' + modalId + '-label" aria-hidden="true">' +
            '  <div class="modal-dialog" role="document">' +
            '    <div class="modal-content">' +
            '      <div class="modal-header">' +
            '        <h4 class="modal-title" id="' + modalId + '-label">Potwierdzenie rozpoczęcia operacji</h4>' +
            '        <button type="button" class="close" data-dismiss="modal" aria-label="Close">' +
            '          <span aria-hidden="true">&times;</span>' +
            '        </button>' +
            '      </div>' +
            '      <div class="modal-body">' +
            '        <p>Czy na pewno chcesz rozpocząć operację na tym zleceniu?</p>' +
            '        <p class="text-muted">ID bloku: ' + blockId + '</p>' +
            '      </div>' +
            '      <div class="modal-footer">' +
            '        <button type="button" class="btn btn-secondary" data-dismiss="modal">Anuluj</button>' +
            '        <button type="button" class="btn btn-success" id="eoz-confirm-start">Rozpocznij operację</button>' +
            '      </div>' +
            '    </div>' +
            '  </div>' +
            '</div>';
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        var modal = document.getElementById(modalId);
        var confirmBtn = document.getElementById('eoz-confirm-start');
        
        confirmBtn.addEventListener('click', function() {
            window.location.href = originalHref;
        });
        
        // Show modal
        window.jQuery(modal).modal('show');
    }

    function apply() {
        addStartOperationConfirmation();
        console.log('[EOZ Control Panel Order Module v' + VERSION + '] Applied');
    }

    function waitAndRun() {
        window.EOZ.waitFor('body', { timeout: 5000 })
            .then(apply)
            .catch(function(){ 
                console.warn('[EOZ Control Panel Order v' + VERSION + '] Page not ready, applying anyway');
                apply();
            });
    }

    if (document.readyState === 'loading') { 
        document.addEventListener('DOMContentLoaded', waitAndRun, { once: true }); 
    } else { 
        waitAndRun(); 
    }
})();

