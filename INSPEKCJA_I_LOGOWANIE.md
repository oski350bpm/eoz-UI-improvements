## Instrukcja logowania i samodzielnej inspekcji elementów (EOZ)

Dokument to wewnętrzna instrukcja dla asysty przy pracy nad UI EOZ. Obejmuje logowanie, przełączanie stanowisk, kluczowe widoki, inspekcję DOM, sieci i parametry URL używane w krytycznych akcjach (skaner, play, start).

### Logowanie do panelu
- Wejdź na `https://eoz.iplyty.erozrys.pl/index.php/pl/login`
- Dane dostępu: login `admin`, hasło `admin1`
- Po zalogowaniu trafisz zwykle na `Aktualne zlecenia`.

### Wybór stanowiska (logowanie na maszynę)
- Przejdź do wyboru stanowiska: `https://eoz.iplyty.erozrys.pl/index.php/pl/machine_select`
- Dostępne opcje (przyciskowe): m.in. „Magazyn płyt”, „Magazyn oklein”, „Piła panelowa”, „Okleiniarka”, „CNC”, itd.
- Kliknięcie „Piła panelowa” przekierowuje do: `https://eoz.iplyty.erozrys.pl/index.php/pl/machines/control_panel`
- Po poprawnym wyborze zobaczysz alert „Poprawnie zalogowano na maszynę”.

### Kluczowe widoki i różnice
- `machines/control_panel` – widok „Moje zlecenia” dla zalogowanej maszyny (np. Piła panelowa). Zawiera tabelę zleceń, skaner, datę cięcia i akcje (w tym play i uwagi).
- Widoki magazynowe (np. `control_panel_boards_magazine_2020`, `control_panel_veneers_magazine_2020`) – mają własne moduły i nie powinny ładować modułu panelu maszyn.

### Narzędzia deweloperskie (DevTools)
- Otwórz: macOS `Cmd+Opt+I`, Windows `Ctrl+Shift+I`
- Zakładki: Elements (DOM/CSS), Console (logi), Network (żądania), Sources (skrypty)

#### Elements – jak lokalizować elementy i selektory
- Użyj „Select element” i wskaż:
  - Skaner: zwykle `input.scanner` lub `input[name="scan_order_code"]`
  - Data cięcia: `input[name="operation_date"]`
  - Przyciski „play”: linki w kolumnie akcji z `href` zawierającym `control_panel?number2=...&operation_date=...&block_id=...&start=0`
- PPM na elemencie → Copy → Copy selector/JS path aby szybko odwołać się w konsoli.

#### Console – jak diagnozować zachowanie
- Wpisz `console.clear()` aby wyczyścić.
- Filtruj logi po prefiksie: `EOZ` (np. `[EOZ Machines Panel v...]`).
- Szybkie komendy:
  - Sprawdź skaner: `document.querySelector('input.scanner')`
  - Wartość daty: `document.querySelector('input[name="operation_date"]').value`
  - `block_id` z „play”:
    ```js
    Array.from(document.querySelectorAll('a[href*="control_panel?"]'))
      .map(a => a.href.match(/block_id=(\d+)/)?.[1])
      .find(Boolean)
    ```

#### Network – jak śledzić redirecty i parametry
- Zaznacz „Preserve log”.
- Wpisz kod w skanerze i zatwierdź Enter.
- Filtruj po `control_panel?`.
- Oczekiwane adresy:
  - Oryginalny (systemowy, niebezpieczny do startu automatycznego):
    `.../machines/control_panel?scan_order_code=KOD&operation_date=YYYY-MM-DD&operation_date_option=`
  - Bezpieczny (jak przycisk play – nasz redirect):
    `.../machines/control_panel?number2=KOD&operation_date=YYYY-MM-DD&block_id=NNNN&start=0`

### Parametry krytyczne i skąd je pobierać
- `number2` – kod zlecenia wpisany/skanowany.
- `operation_date` – z `input[name="operation_date"]` w widoku panelu maszyny.
- `block_id` – pobieramy z istniejących linków „play” w tabeli (parsujemy `href`).
- `start=0` – wymusza bezpieczny widok (bez auto-startu operacji).

### Potwierdzenie startu operacji
- Przycisk „Rozpocznij operację” (`a.btn.btn-success.start`) powinien wyświetlać popup potwierdzenia.
- W razie potrzeby w Elements sprawdź, czy przycisk istnieje na stronie i czy nie znika wskutek statusu „wykonane”.

### Uwagi i modale
- „Uwagi klienta”: ikona `tableoptions fa fa-2x fa-comment` otwiera modal z AJAX:
  `commission/get_erozrys_order_send_info/{orderId}`
- „Uwagi wewnętrzne”: oryginalny modal z:
  `commission/get_erozrys_order_notes/{orderId}`
- Sprawdzisz je w Network (Status 200, treść w Response) i Console (logi EOZ przy otwieraniu modala).

### Responsywność i dropdowny
- Toggle device toolbar: macOS `Cmd+Shift+M`, Windows `Ctrl+Shift+M`.
- Sprawdź siatkę mobilną tabeli oraz działanie dropdown „Opcje”.
- Na dotyku dropdowny mają działać na tap (nie hover).

### Tampermonkey i cache
- Główny loader: `userscripts/eoz-all-improvements.user.js` z `@require` do modułów.
- Po aktualizacji zawsze podbijamy wersję i query `?v=TIMESTAMP` w `@require`, `@updateURL`, `@downloadURL`.
- Twardy reload strony po zmianach (`Cmd+Shift+R` / `Ctrl+F5`).
- W konsoli powinny pojawić się wersje, np.: `[EOZ All UI vX.Y.Z]`, `[EOZ Machines Panel Module vA.B.C]`.

### Checklista szybkiej diagnostyki skanera
1) W konsoli: „Scanner detection … hasScannerInputGlobal: true”.
2) „Scanner input cloned & replaced” – upewnia brak starych handlerów.
3) Formularz pozostaje widoczny; submit jest przechwycony (log: „Form submit handler installed”).
4) Network: redirect zawiera `number2`, `operation_date` z pola oraz `block_id` z „play” i `start=0`.
5) Jeśli brakuje `start` lub zły `block_id`, pobierz je ponownie z linków „play”.

### Najczęstsze pułapki
- „Nie znaleziono zlecenia…” – kod nie istnieje; zachowanie prawidłowe.
- Brak przycisku „start” na widoku – etap zlecenia mógł być już wykonany lub parametry (szczególnie `operation_date`/`block_id`) są nieprawidłowe.
- Zmiany nie wczytują się – wymuś nowy `?v=TIMESTAMP` i twardy reload.


