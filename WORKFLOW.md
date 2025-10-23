# Workflow deweloperski — eOZ UI Improvements

## Struktura projektu

```
.
├── core/
│   └── eoz-core.js          # Wspólne utility (whenReady, waitFor, injectStyles, makeHeaderResponsive)
├── userscripts/
│   ├── eoz-global.user.js           # Globalny skrypt (responsywne menu header)
│   └── eoz-commission-list.user.js  # Widok listy zleceń
├── README.md
├── INSTALACJA.md
└── WORKFLOW.md              # Ten plik
```

## Proces deweloperski

### 1. Praca lokalna
- Edytuj pliki w `/Users/lendz/eoz - UI improvements/`
- Testuj lokalnie w przeglądarce (zainstaluj z plików lokalnych w Tampermonkey)

### 2. Wersjonowanie (WAŻNE!)
Przed commitem **zawsze zwiększ** `@version` w plikach, które zmieniłeś:

**Dla zmian w core (`core/eoz-core.js`):**
- Zwiększ wersję w **obu** userscriptach (global + commission-list)
- Core nie ma własnego `@version`, więc userscripty muszą być zaktualizowane

**Dla zmian w userscriptach:**
- Zwiększ `@version` tylko w zmienionym pliku

**Schemat wersji (semver):**
- `X.Y.Z` — MAJOR.MINOR.PATCH
- Patch (`0.1.0` → `0.1.1`) — bugfixy, drobne poprawki
- Minor (`0.1.9` → `0.2.0`) — nowe funkcje (backward compatible)
- Major (`0.9.0` → `1.0.0`) — breaking changes

### 3. Commit i push na GitHub

Po zakończonym etapie deweloperskim (na Twoje żądanie):

```bash
cd "/Users/lendz/eoz - UI improvements"

# Sprawdź status
git status

# Dodaj zmienione pliki
git add -A

# Commit z opisem zmian
git commit -m "feat: [opis zmian] - bump v X.Y.Z"

# Wypchnij na GitHub
git push origin main
```

**Przykłady commitów:**
```bash
git commit -m "feat: Add responsive header menu - bump v0.2.0"
git commit -m "fix: Remove Object.freeze error - bump v0.1.1"
git commit -m "refactor: Optimize waitFor timeout - bump v1.0.2"
```

### 4. Aktualizacja na urządzeniach końcowych

Po pushu na GitHub:
1. Otwórz Tampermonkey Dashboard na urządzeniu
2. **Utilities** → **Check for userscript updates**
3. Zatwierdź aktualizację
4. Odśwież stronę EOZ

**LUB automatycznie:** Tampermonkey sprawdza aktualizacje co 24h (domyślnie)

## Linki instalacyjne (dla nowych urządzeń)

- Global: https://raw.githubusercontent.com/oski350bpm/eoz-UI-improvements/main/userscripts/eoz-global.user.js
- Lista zleceń: https://raw.githubusercontent.com/oski350bpm/eoz-UI-improvements/main/userscripts/eoz-commission-list.user.js

## Checklist przed pushem

- [ ] Zwiększyłem `@version` w zmienionych plikach
- [ ] Przetestowałem lokalnie w przeglądarce
- [ ] Uruchomiłem `git status` i sprawdziłem, które pliki są zmienione
- [ ] Commit message opisuje zmianę i zawiera numer wersji
- [ ] `git push` zakończył się sukcesem

## Dobre praktyki

1. **Jeden feature = jeden commit** (lub logicznie podzielone commity)
2. **Zawsze testuj lokalnie** przed pushem na GitHub
3. **Wersjonuj konsekwentnie** — userscripty używają `@updateURL` i Tampermonkey porównuje `@version`
4. **Core jest shared** — zmiany w core wymagają bump wersji wszystkich userscriptów, które go używają
5. **Komunikuj się z użytkownikami** — jeśli breaking change, napisz w INSTALACJA.md

## Rozwiązywanie problemów

**Problem:** Tampermonkey nie widzi aktualizacji
- Sprawdź czy `@version` została zwiększona
- Sprawdź czy `git push` się udał (zobacz commit history na GitHub)
- Ręcznie usuń cache Tampermonkey i przeinstaluj skrypt z raw URL

**Problem:** Błąd w userscripcie po aktualizacji
- Wróć do poprzedniej wersji w git: `git revert HEAD`
- Napraw błąd lokalnie
- Zwiększ wersję patch (np. `1.0.2` → `1.0.3`)
- Push ponownie

---

*Workflow utworzony: 2025-10-23*

