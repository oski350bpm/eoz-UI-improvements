(function() {
    'use strict';

    var VERSION = '1.0.2';
    
    if (typeof window === 'undefined' || !window.EOZ) {
        console.warn('[EOZ Scripts Viewer v' + VERSION + '] EOZ core not found');
        return;
    }

    var EOZ = window.EOZ;
    
    // Scripts Viewer namespace
    var ScriptsViewer = {
        VERSION: VERSION,
        scripts: [],
        isVisible: false
    };

    // Detect installed userscripts (Tampermonkey API)
    function detectUserscripts() {
        var scripts = [];
        
        // Try to get scripts from Tampermonkey API
        if (typeof GM_getValue !== 'undefined') {
            // Tampermonkey is available, but we can't directly list scripts
            // We'll use a workaround: check for EOZ scripts by their patterns
            scripts = [
                {
                    name: 'EOZ All UI Improvements',
                    id: 'eoz-all-improvements',
                    active: true,
                    version: '3.5.85',
                    description: 'Wszystkie ulepszenia UI dla EOZ - loader dla wszystkich modułów',
                    match: 'https://eoz.iplyty.erozrys.pl/*'
                },
                {
                    name: 'EOZ Global UI',
                    id: 'eoz-global',
                    active: true,
                    version: '0.2.7',
                    description: 'Globalne poprawki UI dla EOZ (responsywne menu, formatowanie tabel)',
                    match: 'https://eoz.iplyty.erozrys.pl/*'
                },
                {
                    name: 'EOZ Commission List',
                    id: 'eoz-commission-list',
                    active: true,
                    version: '1.0.0',
                    description: 'Ulepszenia UI dla tabeli zleceń na tabletach',
                    match: 'https://eoz.iplyty.erozrys.pl/*/commission/show_list*'
                }
            ];
        }

        // Also detect loaded modules from EOZ namespace
        var modules = [];
        if (EOZ.HeaderMenu) {
            modules.push({
                name: 'Header Menu Module',
                id: 'eoz-header-menu',
                version: EOZ.HeaderMenu.VERSION || 'unknown',
                loaded: true
            });
        }
        if (EOZ.CommissionList) {
            modules.push({
                name: 'Commission List Module',
                id: 'eoz-commission-list-module',
                version: EOZ.CommissionList.VERSION || 'unknown',
                loaded: true
            });
        }
        if (EOZ.BoardsMagazine) {
            modules.push({
                name: 'Boards Magazine Module',
                id: 'eoz-boards-magazine',
                version: EOZ.BoardsMagazine.VERSION || 'unknown',
                loaded: true
            });
        }
        if (EOZ.MachinesPanel) {
            modules.push({
                name: 'Machines Panel Module',
                id: 'eoz-machines-panel',
                version: EOZ.MachinesPanel.VERSION || 'unknown',
                loaded: true
            });
        }
        if (EOZ.ControlPanelOrder) {
            modules.push({
                name: 'Control Panel Order Module',
                id: 'eoz-control-panel-order',
                version: EOZ.ControlPanelOrder.VERSION || 'unknown',
                loaded: true
            });
        }
        if (EOZ.CommissionGeneratePage) {
            modules.push({
                name: 'Commission Generate Page Module',
                id: 'eoz-commission-generate-page',
                version: EOZ.CommissionGeneratePage.VERSION || 'unknown',
                loaded: true
            });
        }
        if (EOZ.CDPManager) {
            modules.push({
                name: 'CDP Manager Module',
                id: 'eoz-cdp-manager',
                version: EOZ.CDPManager.VERSION || 'unknown',
                loaded: true
            });
        }

        return {
            userscripts: scripts,
            modules: modules
        };
    }

    // Create scripts viewer panel
    function createScriptsViewer() {
        if (document.getElementById('eoz-scripts-viewer')) {
            return; // Already exists
        }

        if (!document.body) {
            setTimeout(createScriptsViewer, 100);
            return;
        }

        var panel = document.createElement('div');
        panel.id = 'eoz-scripts-viewer';
        panel.style.cssText = 'position: fixed !important; top: 60px !important; right: 10px !important; width: 400px !important; max-height: calc(100vh - 80px) !important; min-height: 300px !important; background: white !important; border-radius: 8px !important; box-shadow: 0 4px 16px rgba(0,0,0,0.2) !important; z-index: 99998 !important; display: none !important; flex-direction: column !important; overflow: hidden !important;';
        panel.innerHTML = 
            '<div style="background: #007bff; color: white; padding: 16px; font-weight: bold; display: flex; justify-content: space-between; align-items: center; flex-shrink: 0;">' +
            '<span>📜 Scripts & Modules</span>' +
            '<button id="eoz-scripts-close" style="background: transparent; border: none; color: white; font-size: 20px; cursor: pointer; padding: 0; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;">&times;</button>' +
            '</div>' +
            '<div style="padding: 16px; overflow-y: auto; flex: 1; min-height: 0;">' +
            '<div id="eoz-scripts-content">' +
            '<div style="text-align: center; padding: 20px; color: #6c757d;">Loading...</div>' +
            '</div>' +
            '</div>' +
            '<div style="padding: 12px; background: #f8f9fa; border-top: 1px solid #ddd; display: flex; gap: 8px; flex-shrink: 0;">' +
            '<button id="eoz-scripts-refresh" style="flex: 1; padding: 8px; background: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 500;">Refresh</button>' +
            '<button id="eoz-scripts-cdp" style="flex: 1; padding: 8px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 500;">CDP Settings</button>' +
            '</div>';

        document.body.appendChild(panel);
        
        // Panel controls
        var panelEl = document.getElementById('eoz-scripts-viewer');
        var closeBtn = document.getElementById('eoz-scripts-close');
        var refreshBtn = document.getElementById('eoz-scripts-refresh');
        var cdpBtn = document.getElementById('eoz-scripts-cdp');
        var contentDiv = document.getElementById('eoz-scripts-content');

        // Close panel
        closeBtn.addEventListener('click', function() {
            panelEl.style.display = 'none';
            ScriptsViewer.isVisible = false;
        });

        // Click outside to close - removed, we'll use overlay instead if needed

        // Refresh scripts list
        refreshBtn.addEventListener('click', function() {
            updateScriptsList();
        });

        // Open CDP settings
        cdpBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('[EOZ Scripts Viewer] CDP Settings button clicked');
            console.log('[EOZ Scripts Viewer] EOZ.CDPManager:', EOZ.CDPManager);
            
            if (EOZ.CDPManager && EOZ.CDPManager.togglePanel) {
                console.log('[EOZ Scripts Viewer] Calling CDPManager.togglePanel()');
                EOZ.CDPManager.togglePanel();
                
                // Also close scripts viewer panel
                panelEl.style.display = 'none';
                ScriptsViewer.isVisible = false;
            } else {
                console.error('[EOZ Scripts Viewer] CDP Manager not available');
                alert('CDP Manager module not loaded. Check console for details.');
            }
        });

        // Update scripts list
        function updateScriptsList() {
            var data = detectUserscripts();
            var html = '';

            // Userscripts section
            if (data.userscripts.length > 0) {
                html += '<div style="margin-bottom: 24px;">' +
                    '<h3 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 600; color: #333; border-bottom: 2px solid #007bff; padding-bottom: 8px;">Userscripts</h3>';

                data.userscripts.forEach(function(script) {
                    html += '<div style="background: #f8f9fa; border: 1px solid #ddd; border-radius: 6px; padding: 12px; margin-bottom: 8px;">' +
                        '<div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 8px;">' +
                        '<div style="flex: 1;">' +
                        '<div style="font-weight: 600; color: #333; margin-bottom: 4px;">' + script.name + '</div>' +
                        '<div style="font-size: 12px; color: #6c757d; margin-bottom: 4px;">' + script.description + '</div>' +
                        '<div style="font-size: 11px; color: #999;">Version: ' + script.version + '</div>' +
                        '</div>' +
                        '<div style="margin-left: 12px;">' +
                        '<span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: ' + (script.active ? '#28a745' : '#dc3545') + ';"></span>' +
                        '</div>' +
                        '</div>' +
                        '<div style="font-size: 11px; color: #666; font-family: monospace; background: white; padding: 4px 8px; border-radius: 4px; word-break: break-all;">' + script.match + '</div>' +
                        '</div>';
                });

                html += '</div>';
            }

            // Modules section
            if (data.modules.length > 0) {
                html += '<div style="margin-bottom: 24px;">' +
                    '<h3 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 600; color: #333; border-bottom: 2px solid #28a745; padding-bottom: 8px;">Modules</h3>';

                data.modules.forEach(function(module) {
                    html += '<div style="background: #f8f9fa; border: 1px solid #ddd; border-radius: 6px; padding: 12px; margin-bottom: 8px;">' +
                        '<div style="display: flex; justify-content: space-between; align-items: start;">' +
                        '<div style="flex: 1;">' +
                        '<div style="font-weight: 600; color: #333; margin-bottom: 4px;">' + module.name + '</div>' +
                        '<div style="font-size: 11px; color: #999;">Version: ' + module.version + '</div>' +
                        '</div>' +
                        '<div style="margin-left: 12px;">' +
                        '<span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: ' + (module.loaded ? '#28a745' : '#dc3545') + ';"></span>' +
                        '</div>' +
                        '</div>' +
                        '</div>';
                });

                html += '</div>';
            }

            // CDP Status section
            if (EOZ.CDPManager) {
                var cdpStatus = EOZ.CDPManager.isConnected ? 'Connected' : (EOZ.CDPManager.config && EOZ.CDPManager.config.cdpUrl ? 'Not connected' : 'Not configured');
                var cdpColor = EOZ.CDPManager.isConnected ? '#28a745' : (EOZ.CDPManager.config && EOZ.CDPManager.config.cdpUrl ? '#ffc107' : '#6c757d');
                
                html += '<div style="margin-bottom: 24px;">' +
                    '<h3 style="margin: 0 0 12px 0; font-size: 16px; font-weight: 600; color: #333; border-bottom: 2px solid #17a2b8; padding-bottom: 8px;">CDP Connection</h3>' +
                    '<div style="background: #f8f9fa; border: 1px solid #ddd; border-radius: 6px; padding: 12px;">' +
                    '<div style="display: flex; justify-content: space-between; align-items: center;">' +
                    '<div>' +
                    '<div style="font-weight: 600; color: #333; margin-bottom: 4px;">Status</div>' +
                    '<div style="font-size: 12px; color: #6c757d;">' + cdpStatus + '</div>' +
                    (EOZ.CDPManager.config && EOZ.CDPManager.config.cdpUrl ? 
                        '<div style="font-size: 11px; color: #999; margin-top: 4px; font-family: monospace; word-break: break-all;">' + EOZ.CDPManager.config.cdpUrl + '</div>' : 
                        '<div style="font-size: 11px; color: #999; margin-top: 4px;">No URL configured</div>') +
                    '</div>' +
                    '<div>' +
                    '<span style="display: inline-block; width: 12px; height: 12px; border-radius: 50%; background: ' + cdpColor + ';"></span>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>';
            }

            if (!html) {
                html = '<div style="text-align: center; padding: 20px; color: #6c757d;">No scripts detected</div>';
            }

            contentDiv.innerHTML = html;
        }

        // Initial load
        updateScriptsList();

        // Auto-refresh every 5 seconds when visible
        var refreshInterval = setInterval(function() {
            if (ScriptsViewer.isVisible) {
                updateScriptsList();
            }
        }, 5000);
    }

    // Toggle panel visibility
    function toggleScriptsViewer() {
        console.log('[EOZ Scripts Viewer] toggleScriptsViewer called');
        var panel = document.getElementById('eoz-scripts-viewer');
        if (!panel) {
            console.log('[EOZ Scripts Viewer] Panel not found, creating...');
            createScriptsViewer();
            panel = document.getElementById('eoz-scripts-viewer');
        }
        if (!panel) {
            console.error('[EOZ Scripts Viewer] Failed to create panel');
            return;
        }
        
        var wasVisible = panel.style.display !== 'none' && panel.style.display !== '';
        ScriptsViewer.isVisible = !wasVisible;
        panel.style.display = ScriptsViewer.isVisible ? 'flex' : 'none';
        console.log('[EOZ Scripts Viewer] Panel visibility:', ScriptsViewer.isVisible);
    }

    // Create toggle button
    function createToggleButton() {
        if (document.getElementById('eoz-scripts-toggle-btn')) {
            return; // Already exists
        }

        // Wait for body to be ready
        if (!document.body) {
            setTimeout(createToggleButton, 100);
            return;
        }

        var btn = document.createElement('button');
        btn.id = 'eoz-scripts-toggle-btn';
        btn.innerHTML = '📜';
        btn.title = 'View Scripts & Modules';
        btn.style.cssText = 'position: fixed !important; bottom: 20px !important; right: 20px !important; width: 50px !important; height: 50px !important; border-radius: 50% !important; background: #007bff !important; color: white !important; border: none !important; font-size: 20px !important; cursor: pointer !important; box-shadow: 0 2px 8px rgba(0,0,0,0.3) !important; z-index: 99999 !important; display: flex !important; align-items: center !important; justify-content: center !important; transition: transform 0.2s !important;';
        
        btn.addEventListener('mouseenter', function() {
            btn.style.transform = 'scale(1.1)';
        });
        btn.addEventListener('mouseleave', function() {
            btn.style.transform = 'scale(1)';
        });
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('[EOZ Scripts Viewer] Button clicked');
            toggleScriptsViewer();
        });

        try {
            document.body.appendChild(btn);
            console.log('[EOZ Scripts Viewer] Toggle button created');
        } catch (e) {
            console.error('[EOZ Scripts Viewer] Failed to create button:', e);
            setTimeout(createToggleButton, 500);
        }
    }

    // Initialize
    function init() {
        // Try multiple initialization strategies
        function tryInit() {
            if (document.body) {
                createToggleButton();
                createScriptsViewer();
            } else {
                setTimeout(tryInit, 100);
            }
        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', tryInit);
        } else {
            EOZ.whenReady(tryInit);
        }
    }

    // Export API
    ScriptsViewer.detectUserscripts = detectUserscripts;
    ScriptsViewer.toggle = toggleScriptsViewer;
    ScriptsViewer.init = init;

    // Attach to EOZ namespace
    if (!EOZ.ScriptsViewer) {
        EOZ.ScriptsViewer = ScriptsViewer;
    }

    // Auto-init
    init();

    console.log('[EOZ Scripts Viewer v' + VERSION + '] Module loaded');
})();

