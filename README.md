# eOZ UI Improvements — Userscripts (Global + Widok listy zleceń)

## Cel

- Wspólny `core` (CSS/JS utilsy) ładowany przez `@require`
- Osobne userscripty per widok + jeden globalny
- Auto‑aktualizacja przez `raw.githubusercontent.com` (publiczne repo: `oski350bpm/eoz-UI-improvements`)
- Globalnie: responsywne menu w headerze

## Struktura repo

- `core/eoz-core.js` — utilsy: `whenReady`, `waitFor`, `injectStyles`, `makeHeaderResponsive`
- `userscripts/eoz-global.user.js` — globalny skrypt (responsywne menu header)
- `userscripts/eoz-commission-list.user.js` — widok listy zleceń (ukrywanie kolumn, daty, dropdown akcji)
- `README.md`, `INSTALACJA.md`

## Userscripts — linki instalacyjne (Tampermonkey)

- Global: `https://raw.githubusercontent.com/oski350bpm/eoz-UI-improvements/main/userscripts/eoz-global.user.js`
- Lista zleceń: `https://raw.githubusercontent.com/oski350bpm/eoz-UI-improvements/main/userscripts/eoz-commission-list.user.js`

Po otwarciu linku w przeglądarce z Tampermonkey pojawi się ekran instalacji. Zatwierdź i zapisz.

## Co robi każdy skrypt?

- Global (`eoz-global.user.js`)
  - Dodaje responsywne menu (hamburger) do nagłówka serwisu EOZ
  - Działa na wszystkich podstronach: `https://eoz.iplyty.erozrys.pl/*`

- Lista zleceń (`eoz-commission-list.user.js`)
  - Ukrywa niepotrzebne kolumny (Kod klienta, Data rozpoczęcia)
  - Formatuje daty (wyświetla tylko datę)
  - Zastępuje małe ikonki dużym, dotykowym menu akcji (dropdown)
  - Działa na stronach:
    - `https://eoz.iplyty.erozrys.pl/index.php/pl/commission/show_list*`
    - `https://eoz.iplyty.erozrys.pl/commission/show_list*`

## Auto‑aktualizacja

Każdy userscript zawiera metadane `@updateURL` i `@downloadURL` wskazujące na plik w gałęzi `main`. Tampermonkey będzie sprawdzał aktualizacje automatycznie (lub ręcznie z dashboardu Tampermonkey).

## Core: API

- `whenReady(fn)` — uruchamia `fn` po `DOMContentLoaded` (lub od razu, jeśli DOM gotowy)
- `waitFor(selector, { timeout, interval, all, root })` — czeka aż element(y) pojawią się w DOM
- `injectStyles(css, { id })` — wstrzykuje style do `<head>` (z id do idempotentnych aktualizacji)
- `makeHeaderResponsive({ headerSelector, navSelector, burgerInsertSelector, breakpoint })` — dodaje hamburger i logikę otwierania/zamykania menu

## Wsparcie i bezpieczeństwo

- Skrypty działają tylko na hostach EOZ (wzorce `@match`)
- Nie modyfikują danych na serwerze, jedynie UI w przeglądarce
- Testowane na desktop/tablet; optymalizacja dla 1024px i mniej

## Historia wersji

- Global UI: `0.1.0` — pierwsza wersja (responsywny header)
- Commission List UI: `1.0.0` — migracja istniejących ulepszeń do osobnego userscriptu

---

Projekt dla zespołu produkcji eOZ. Jeśli masz już zainstalowany stary skrypt `eoz-ui-improvements.user.js`, zalecamy wyłączyć go i zainstalować nowy `eoz-commission-list.user.js`.
