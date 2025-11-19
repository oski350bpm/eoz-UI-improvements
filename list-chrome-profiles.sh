#!/bin/bash

# Skrypt do wyświetlenia listy dostępnych profili Chrome

CHROME_DATA_DIR="$HOME/Library/Application Support/Google/Chrome"

echo "📂 Dostępne profile Chrome:"
echo ""

if [ ! -d "$CHROME_DATA_DIR" ]; then
    echo "❌ Katalog Chrome nie istnieje: $CHROME_DATA_DIR"
    exit 1
fi

# Listuj profile
ls -1 "$CHROME_DATA_DIR" 2>/dev/null | grep -E "^Default$|^Profile [0-9]+$" | while read profile; do
    profile_path="$CHROME_DATA_DIR/$profile"
    extensions_path="$profile_path/Extensions"
    
    # Sprawdź czy Tampermonkey jest zainstalowany
    has_tampermonkey=""
    if [ -d "$extensions_path" ]; then
        if ls "$extensions_path"/*/manifest.json 2>/dev/null | xargs grep -l "Tampermonkey\|tampermonkey" 2>/dev/null > /dev/null; then
            has_tampermonkey=" ✅ (Tampermonkey)"
        fi
    fi
    
    echo "   - $profile$has_tampermonkey"
done

echo ""
echo "💡 Aby uruchomić Chrome z CDP i konkretnym profilem:"
echo "   ./start-chrome-cdp.sh 9222 \"Profile 1\""
















