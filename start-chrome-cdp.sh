#!/bin/bash

# Skrypt do uruchomienia Chrome z CDP (Chrome DevTools Protocol)
# Port domyślny: 9222
# Użycie: ./start-chrome-cdp.sh [PORT] [PROFILE_NAME]
# Przykład: ./start-chrome-cdp.sh 9222 "Profile 1"

PORT=${1:-9222}
PROFILE_NAME=${2:-"Default"}

CHROME_DATA_DIR="$HOME/Library/Application Support/Google/Chrome"
PROFILE_DIR="$CHROME_DATA_DIR/$PROFILE_NAME"

echo "🚀 Uruchamianie Chrome z CDP na porcie $PORT..."
echo "👤 Profil: $PROFILE_NAME"

# Sprawdź czy profil istnieje
if [ ! -d "$PROFILE_DIR" ]; then
    echo "⚠️  Profil '$PROFILE_NAME' nie istnieje w: $CHROME_DATA_DIR"
    echo ""
    echo "📂 Dostępne profile:"
    ls -1 "$CHROME_DATA_DIR" 2>/dev/null | grep -E "^Default$|^Profile [0-9]+$" | while read profile; do
        echo "   - $profile"
    done
    echo ""
    echo "💡 Użyj: ./start-chrome-cdp.sh $PORT \"Profile 1\""
    exit 1
fi

# Zamknij wszystkie okna Chrome (opcjonalne)
# pkill -f "Google Chrome"

# Uruchom Chrome z flagą remote-debugging-port i konkretnym profilem
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome \
    --remote-debugging-port=$PORT \
    --user-data-dir="$CHROME_DATA_DIR" \
    --profile-directory="$PROFILE_NAME" &

echo "✅ Chrome uruchomiony z CDP na porcie $PORT"
echo "👤 Profil: $PROFILE_NAME"
echo "📋 URL do sprawdzenia: http://127.0.0.1:$PORT/json"
echo "🔗 WebSocket URL będzie dostępny w odpowiedzi JSON"

