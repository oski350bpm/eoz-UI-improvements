# Instrukcja Instalacji — eOZ UI Improvements (Tampermonkey)

## Wymagania
- Przeglądarka z rozszerzeniem Tampermonkey (Firefox, Chrome, Kiwi)

## Instalacja (kliknij i zatwierdź w Tampermonkey)
- Global: `https://raw.githubusercontent.com/oski350bpm/eoz-UI-improvements/main/userscripts/eoz-global.user.js`
- Lista zleceń: `https://raw.githubusercontent.com/oski350bpm/eoz-UI-improvements/main/userscripts/eoz-commission-list.user.js`

Po wejściu w link przeglądarka z Tampermonkey otworzy ekran instalacyjny — wybierz „Install”.

## Weryfikacja działania
1. Wejdź na dowolną stronę EOZ — w nagłówku powinien pojawić się przycisk hamburgera (globalny skrypt)
2. Wejdź na listę zleceń (`/commission/show_list`) — kolumny ukryte, daty skrócone, menu akcji jako duży dropdown

## Auto‑aktualizacje
- Skrypty mają ustawione `@updateURL` i `@downloadURL` do gałęzi `main`
- Tampermonkey sprawdza aktualizacje automatycznie (lub ręcznie — Tampermonkey Dashboard → „Check for updates”)
- Po aktualizacji odśwież stronę EOZ (F5)

## Rozwiązywanie problemów
- Upewnij się, że Tampermonkey jest włączony i skrypty są aktywne
- Sprawdź, czy jesteś na właściwym adresie URL (wzorce `@match`)
- Odśwież stronę (F5)
- Otwórz konsolę (F12) i sprawdź komunikaty `EOZ ...`

## Migracja ze starego skryptu
- Jeżeli masz zainstalowany `eoz-ui-improvements.user.js`, wyłącz go w Tampermonkey
- Zainstaluj nowe skrypty z linków powyżej

---
Ostatnia aktualizacja: 2025-10-22
