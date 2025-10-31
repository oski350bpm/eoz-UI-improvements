(function() {
    'use strict';

    var VERSION = '1.0.4';
    
    if (typeof window === 'undefined' || !window.EOZ) {
        console.warn('[EOZ CDP Manager v' + VERSION + '] EOZ core not found');
        return;
    }

    var EOZ = window.EOZ;
    
    // CDP Manager namespace
    var CDPManager = {
        VERSION: VERSION,
        connectionUrl: null,
        wsConnection: null,
        isConnected: false,
        config: {
            cdpUrl: null,
            autoConnect: false,
            reconnectInterval: 5000
        }
    };

    // Load configuration from localStorage
    function loadConfig() {
        try {
            var saved = localStorage.getItem('eoz_cdp_config');
            if (saved) {
                var parsed = JSON.parse(saved);
                CDPManager.config = Object.assign({}, CDPManager.config, parsed);
                CDPManager.connectionUrl = CDPManager.config.cdpUrl;
            }
        } catch (e) {
            console.debug('[EOZ CDP Manager] Failed to load config:', e);
        }
    }

    // Save configuration to localStorage
    function saveConfig() {
        try {
            localStorage.setItem('eoz_cdp_config', JSON.stringify(CDPManager.config));
        } catch (e) {
            console.debug('[EOZ CDP Manager] Failed to save config:', e);
        }
    }

    // Auto-detect CDP WebSocket URL from port
    function detectCDPUrl(port) {
        port = port || 9222;
        
        // First, try to get browser target from /json/version
        return fetch('http://127.0.0.1:' + port + '/json/version')
            .then(function(response) {
                if (!response.ok) {
                    throw new Error('CDP endpoint not available on port ' + port);
                }
                return response.json();
            })
            .then(function(versionData) {
                // If /json/version has webSocketDebuggerUrl, use it (this is the browser target)
                if (versionData && versionData.webSocketDebuggerUrl) {
                    console.log('[EOZ CDP Manager] Using browser target from /json/version:', versionData.webSocketDebuggerUrl);
                    return versionData.webSocketDebuggerUrl;
                }
                
                // Otherwise, try /json for page targets
                return fetch('http://127.0.0.1:' + port + '/json')
                    .then(function(response) {
                        if (!response.ok) {
                            throw new Error('Cannot fetch targets list');
                        }
                        return response.json();
                    })
                    .then(function(targets) {
                        if (!targets || targets.length === 0) {
                            throw new Error('No targets available. Open at least one tab in Chrome.');
                        }
                        
                        // For Cursor, prefer page targets from actual web pages
                        var preferredTarget = targets.find(function(t) {
                            return t.type === 'page' && 
                                   t.webSocketDebuggerUrl && 
                                   !t.url.startsWith('chrome://') && 
                                   !t.url.startsWith('chrome-extension://');
                        });
                        
                        var pageTarget = preferredTarget || targets.find(function(t) {
                            return t.type === 'page' && t.webSocketDebuggerUrl;
                        });
                        
                        if (pageTarget && pageTarget.webSocketDebuggerUrl) {
                            console.log('[EOZ CDP Manager] Selected page target:', pageTarget.title || pageTarget.type, pageTarget.webSocketDebuggerUrl);
                            return pageTarget.webSocketDebuggerUrl;
                        }
                        
                        throw new Error('No valid WebSocket URL found in targets');
                    });
            })
            .catch(function(err) {
                console.error('[EOZ CDP Manager] Auto-detect failed:', err);
                throw err;
            });
    }

    // Test CDP connection via WebSocket
    function testConnection(url) {
        return new Promise(function(resolve, reject) {
            if (!url || !url.trim()) {
                reject(new Error('CDP URL is required'));
                return;
            }

            var ws = new WebSocket(url);
            var timeout = setTimeout(function() {
                ws.close();
                reject(new Error('Connection timeout'));
            }, 3000);

            ws.onopen = function() {
                clearTimeout(timeout);
                ws.close();
                resolve(true);
            };

            ws.onerror = function(err) {
                clearTimeout(timeout);
                reject(new Error('Connection failed: ' + (err.message || 'Unknown error')));
            };
        });
    }

    // Connect to CDP (via external proxy/server)
    function connectToCDP(url) {
        if (CDPManager.wsConnection && CDPManager.wsConnection.readyState === WebSocket.OPEN) {
            console.log('[EOZ CDP Manager] Already connected');
            return Promise.resolve(true);
        }

        CDPManager.connectionUrl = url || CDPManager.config.cdpUrl;
        if (!CDPManager.connectionUrl) {
            return Promise.reject(new Error('CDP URL not configured'));
        }

        return testConnection(CDPManager.connectionUrl).then(function() {
            // Here you would establish actual CDP connection through a proxy/server
            // For now, we just mark as "ready"
            CDPManager.isConnected = true;
            CDPManager.config.cdpUrl = CDPManager.connectionUrl;
            saveConfig();
            console.log('[EOZ CDP Manager] Connection ready:', CDPManager.connectionUrl);
            updateUI();
            return true;
        }).catch(function(err) {
            CDPManager.isConnected = false;
            updateUI();
            throw err;
        });
    }

    // Disconnect from CDP
    function disconnectFromCDP() {
        if (CDPManager.wsConnection) {
            try {
                CDPManager.wsConnection.close();
            } catch (e) {
                console.debug('[EOZ CDP Manager] Error closing connection:', e);
            }
            CDPManager.wsConnection = null;
        }
        CDPManager.isConnected = false;
        updateUI();
        console.log('[EOZ CDP Manager] Disconnected');
    }

    // Create CDP configuration panel
    function createCDPPanel() {
        if (document.getElementById('eoz-cdp-panel')) {
            return; // Already exists
        }

        if (!document.body) {
            setTimeout(createCDPPanel, 100);
            return;
        }

        var panel = document.createElement('div');
        panel.id = 'eoz-cdp-panel';
        panel.style.cssText = 'position: fixed !important; top: 60px !important; right: 10px !important; width: 350px !important; max-height: calc(100vh - 80px) !important; min-height: 300px !important; background: white !important; border-radius: 8px !important; box-shadow: 0 4px 16px rgba(0,0,0,0.2) !important; z-index: 99997 !important; display: none !important; flex-direction: column !important; overflow: hidden !important;';
        panel.innerHTML =
            '<div style="background: #007bff; color: white; padding: 16px; font-weight: bold; display: flex; justify-content: space-between; align-items: center; flex-shrink: 0;">' +
            '<span>🔧 CDP Connection</span>' +
            '<button id="eoz-cdp-close" style="background: transparent; border: none; color: white; font-size: 20px; cursor: pointer; padding: 0; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;">&times;</button>' +
            '</div>' +
            '<div style="padding: 16px; overflow-y: auto; flex: 1; min-height: 0;">' +
            '<div style="background: #e7f3ff; border: 1px solid #b3d9ff; border-radius: 6px; padding: 12px; margin-bottom: 16px; font-size: 12px; color: #004085;">' +
            '<strong>📋 Instrukcja:</strong><br>' +
            '1. Uruchom przeglądarkę z flagą:<br>' +
            '<code style="background: white; padding: 2px 4px; border-radius: 2px; font-size: 11px;">--remote-debugging-port=9222</code><br>' +
            '2. Kliknij "Auto-detect" lub wpisz URL WebSocket<br>' +
            '3. Testuj i zapisz konfigurację<br>' +
            '4. W Cursorze: Settings → Browser → CDP Connection → wklej URL' +
            '</div>' +
            '<div style="margin-bottom: 16px;">' +
            '<label style="display: block; margin-bottom: 8px; font-weight: 500; color: #333;">Connection Type:</label>' +
            '<select id="eoz-cdp-type" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px;">' +
            '<option value="cdp">CDP Connection</option>' +
            '<option value="proxy">Proxy Server</option>' +
            '</select>' +
            '</div>' +
            '<div style="margin-bottom: 16px;">' +
            '<label style="display: block; margin-bottom: 8px; font-weight: 500; color: #333;">CDP Connection URL:</label>' +
            '<div style="display: flex; gap: 4px; margin-bottom: 4px;">' +
            '<input type="text" id="eoz-cdp-url" placeholder="e.g., ws://127.0.0.1:9222/devtools/browser/..." style="flex: 1; padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; font-family: monospace;">' +
            '<button id="eoz-cdp-detect" style="padding: 8px 12px; background: #17a2b8; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 500; white-space: nowrap;" title="Auto-detect CDP URL">Auto-detect</button>' +
            '</div>' +
            '<input type="number" id="eoz-cdp-port" placeholder="Port (default: 9222)" value="9222" style="width: 100%; padding: 6px; border: 1px solid #ddd; border-radius: 4px; font-size: 12px; margin-top: 4px;">' +
            '</div>' +
            '<div style="margin-bottom: 16px;">' +
            '<label style="display: flex; align-items: center; cursor: pointer;">' +
            '<input type="checkbox" id="eoz-cdp-auto" style="margin-right: 8px;">' +
            '<span>Auto-connect on page load</span>' +
            '</label>' +
            '</div>' +
            '<div id="eoz-cdp-status" style="padding: 12px; border-radius: 4px; margin-bottom: 16px; background: #f8f9fa; border: 1px solid #ddd;">' +
            '<div style="display: flex; align-items: center; gap: 8px;">' +
            '<span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #6c757d;"></span>' +
            '<span>Status: <strong>Not configured</strong></span>' +
            '</div>' +
            '</div>' +
            '<div style="display: flex; gap: 8px; flex-shrink: 0;">' +
            '<button id="eoz-cdp-test" style="flex: 1; padding: 10px; background: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 500;">Test Connection</button>' +
            '<button id="eoz-cdp-save" style="flex: 1; padding: 10px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 500;">Save</button>' +
            '</div>';

        document.body.appendChild(panel);
        
        // Panel controls
        var panelEl = document.getElementById('eoz-cdp-panel');
        var closeBtn = document.getElementById('eoz-cdp-close');
        var urlInput = document.getElementById('eoz-cdp-url');
        var portInput = document.getElementById('eoz-cdp-port');
        var detectBtn = document.getElementById('eoz-cdp-detect');
        var typeSelect = document.getElementById('eoz-cdp-type');
        var autoCheckbox = document.getElementById('eoz-cdp-auto');
        var testBtn = document.getElementById('eoz-cdp-test');
        var saveBtn = document.getElementById('eoz-cdp-save');
        var statusDiv = document.getElementById('eoz-cdp-status');

        // Load saved config
        loadConfig();
        if (CDPManager.config.cdpUrl) {
            urlInput.value = CDPManager.config.cdpUrl;
        }
        if (CDPManager.config.autoConnect) {
            autoCheckbox.checked = true;
        }

        // Close panel
        closeBtn.addEventListener('click', function() {
            panelEl.style.display = 'none';
        });

        // Click outside to close - removed, we'll use overlay instead if needed

        // Auto-detect CDP URL
        detectBtn.addEventListener('click', function() {
            var port = parseInt(portInput.value) || 9222;
            detectBtn.disabled = true;
            detectBtn.textContent = 'Detecting...';
            statusDiv.innerHTML = '<div style="display: flex; align-items: center; gap: 8px;"><span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #ffc107;"></span><span>Status: <strong>Detecting CDP...</strong></span></div>';

            detectCDPUrl(port).then(function(url) {
                urlInput.value = url;
                detectBtn.disabled = false;
                detectBtn.textContent = 'Auto-detect';
                statusDiv.innerHTML = '<div style="display: flex; align-items: center; gap: 8px;"><span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #28a745;"></span><span>Status: <strong>CDP URL detected!</strong></span></div>';
            }).catch(function(err) {
                detectBtn.disabled = false;
                detectBtn.textContent = 'Auto-detect';
                statusDiv.innerHTML = '<div style="display: flex; align-items: center; gap: 8px;"><span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #dc3545;"></span><span>Status: <strong>Detection failed: ' + err.message + '</strong></span></div>';
                console.warn('[EOZ CDP Manager] Auto-detect failed:', err);
            });
        });

        // Test connection
        testBtn.addEventListener('click', function() {
            var url = urlInput.value.trim();
            if (!url) {
                alert('Please enter CDP URL');
                return;
            }

            testBtn.disabled = true;
            testBtn.textContent = 'Testing...';
            statusDiv.innerHTML = '<div style="display: flex; align-items: center; gap: 8px;"><span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #ffc107;"></span><span>Status: <strong>Testing...</strong></span></div>';

            testConnection(url).then(function() {
                testBtn.disabled = false;
                testBtn.textContent = 'Test Connection';
                statusDiv.innerHTML = '<div style="display: flex; align-items: center; gap: 8px;"><span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #28a745;"></span><span>Status: <strong>Ready</strong></span></div>';
                CDPManager.isConnected = true;
            }).catch(function(err) {
                testBtn.disabled = false;
                testBtn.textContent = 'Test Connection';
                statusDiv.innerHTML = '<div style="display: flex; align-items: center; gap: 8px;"><span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: #dc3545;"></span><span>Status: <strong>Error: ' + err.message + '</strong></span></div>';
                CDPManager.isConnected = false;
            });
        });

        // Save configuration
        saveBtn.addEventListener('click', function() {
            var url = urlInput.value.trim();
            CDPManager.config.cdpUrl = url || null;
            CDPManager.config.autoConnect = autoCheckbox.checked;
            saveConfig();
            
            if (CDPManager.config.autoConnect && url) {
                connectToCDP(url).catch(function(err) {
                    console.warn('[EOZ CDP Manager] Auto-connect failed:', err);
                });
            } else {
                updateUI();
            }
            
            alert('Configuration saved!');
        });

        // Update UI function
        window.eozUpdateCDPUI = function() {
            updateUI();
        };

        function updateUI() {
            var status = CDPManager.isConnected ? 'Ready' : (CDPManager.config.cdpUrl ? 'Not connected' : 'Not configured');
            var statusColor = CDPManager.isConnected ? '#28a745' : (CDPManager.config.cdpUrl ? '#ffc107' : '#6c757d');
            statusDiv.innerHTML = '<div style="display: flex; align-items: center; gap: 8px;">' +
                '<span style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; background: ' + statusColor + ';"></span>' +
                '<span>Status: <strong>' + status + '</strong></span>' +
                (CDPManager.config.cdpUrl ? '<br><small style="color: #6c757d; margin-top: 4px; display: block;">URL: ' + CDPManager.config.cdpUrl + '</small>' : '') +
                '</div>';
        }

        updateUI();
    }

    // Toggle panel visibility
    function toggleCDPPanel() {
        console.log('[EOZ CDP Manager] togglePanel called');
        var panel = document.getElementById('eoz-cdp-panel');
        if (!panel) {
            console.log('[EOZ CDP Manager] Panel not found, creating...');
            createCDPPanel();
            panel = document.getElementById('eoz-cdp-panel');
        }
        if (!panel) {
            console.error('[EOZ CDP Manager] Failed to create panel');
            return;
        }
        
        // Get current display value, accounting for !important styles
        var currentDisplay = window.getComputedStyle(panel).display;
        var isVisible = currentDisplay !== 'none' && currentDisplay !== '';
        
        console.log('[EOZ CDP Manager] Current display:', currentDisplay, 'isVisible:', isVisible);
        
        // Toggle visibility
        if (isVisible) {
            panel.style.setProperty('display', 'none', 'important');
            console.log('[EOZ CDP Manager] Panel hidden');
        } else {
            panel.style.setProperty('display', 'flex', 'important');
            console.log('[EOZ CDP Manager] Panel shown');
        }
    }

    // Initialize
    function init() {
        loadConfig();
        
        // Create panel when DOM is ready
        EOZ.whenReady(function() {
            createCDPPanel();
            
            // Auto-connect if configured
            if (CDPManager.config.autoConnect && CDPManager.config.cdpUrl) {
                connectToCDP().catch(function(err) {
                    console.debug('[EOZ CDP Manager] Auto-connect failed:', err);
                });
            }
        });
    }

    // Export API
    CDPManager.loadConfig = loadConfig;
    CDPManager.saveConfig = saveConfig;
    CDPManager.detectCDPUrl = detectCDPUrl;
    CDPManager.testConnection = testConnection;
    CDPManager.connect = connectToCDP;
    CDPManager.disconnect = disconnectFromCDP;
    CDPManager.togglePanel = toggleCDPPanel;
    CDPManager.init = init;

    // Attach to EOZ namespace
    if (!EOZ.CDPManager) {
        EOZ.CDPManager = CDPManager;
    }

    // Auto-init
    init();

    console.log('[EOZ CDP Manager v' + VERSION + '] Module loaded');
})();

