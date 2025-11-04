# Analiza różnic między widokiem /1 a /3

## Data analizy: 2025-11-04

### 1. STRUKTURA NAGŁÓWKÓW

#### Widok /1 (12 kolumn):
```
0.  Lp          ← DUPLIKACJA!
1.  Lp.
2.  Zlecenie
3.  Klient
4.  Nazwa zamówienia
5.  Nazwa okleiny    ← BŁĘDNA NAZWA!
6.  Wymiar
7.  Ilość
8.  Przygotowane
9.  Opis
10. Uwagi
11. Opcje
```

#### Widok /3 (11 kolumn):
```
0.  Lp.
1.  Klient
2.  Zlecenie
3.  Lp             ← Wewnętrzny LP zlecenia
4.  Okleina        ← POPRAWNA NAZWA!
5.  Wymiar
6.  Ilość
7.  Przygotowane
8.  Opis
9.  Uwagi
10. Opcje
```

### 2. GŁÓWNE PROBLEMY W /1

#### Problem 1: Duplikacja kolumny Lp
- W /1 występują DWA nagłówki "Lp" (index 0 i 1)
- W /3 jest tylko jeden "Lp." (index 0) plus wewnętrzny "Lp" (index 3)

#### Problem 2: Nazwa kolumny okleiny
- ❌ /1: "Nazwa okleiny"
- ✅ /3: "Okleina"

#### Problem 3: Kolejność kolumn
- /1: Zlecenie → Klient → Nazwa zamówienia
- /3: Klient → Zlecenie

#### Problem 4: Brak wrappera .switch-field dla radio w Desktop
```html
<!-- /3 (POPRAWNE) -->
<div class="switch-field">
    <input type="radio" id="first-radio-yes-198" ...>
    <label for="first-radio-yes-198">Tak</label>
    <input type="radio" id="first-radio-no-198" ...>
    <label for="first-radio-no-198">Nie</label>
</div>

<!-- /1 PO AGREGACJI (BŁĘDNE - brak .switch-field) -->
<div class="eoz-ven-item">
    <input type="radio" id="first-radio-yes-198" ...>
    <label for="first-radio-yes-198">Tak</label>
    <input type="radio" id="first-radio-no-198" ...>
    <label for="first-radio-no-198">Nie</label>
</div>
```

**KONSEKWENCJA**: Brak stylów CSS dla radio buttonów w /1!
- `.switch-field` ma specjalne style (toggle switches)
- Bez `.switch-field` radio buttons wyglądają jak standardowe radio (brzydko)

### 3. GŁÓWNE ZADANIA DO NAPRAWY

#### Zadanie 1: Naprawić strukturę nagłówków w /1
- Usunąć duplikację "Lp"
- Zmienić "Nazwa okleiny" → "Okleina"
- Opcjonalnie: dostosować kolejność kolumn do /3

#### Zadanie 2: Naprawić wrapper .switch-field w agregacji Desktop
W funkcji `aggregateVeneersDesktopNonGrouped()`:
- Zamiast przenosić zawartość bezpośrednio do `.eoz-ven-item`
- Należy przenieść cały `.switch-field` wrapper
- Lub stworzyć nowy `.switch-field` wrapper wokół przeniesionych radio

#### Zadanie 3: Zweryfikować mobile layout
- Mobile layout używa `buildMobileLayoutVeneersGrouped()`
- Sprawdzić czy poprawnie obsługuje radio z obu formatów

### 4. SZCZEGÓŁY TECHNICZNE

#### Oryginalny HTML w /1 (przed agregacją):
```html
<td class="body-cell">
    <div class="switch-field">
        <input type="radio" id="..." name="..." value="1">
        <label for="...">Tak</label>
        <input type="radio" id="..." name="..." value="0" checked>
        <label for="...">Nie</label>
    </div>
</td>
```

#### Po agregacji w /1 (BŁĄD):
```html
<td class="body-cell">
    <div class="eoz-ven-list eoz-ven-list-przygot">
        <div class="eoz-ven-item">
            <!-- Brak .switch-field! -->
            <input type="radio" ...>
            <label>Tak</label>
            <input type="radio" ...>
            <label>Nie</label>
        </div>
    </div>
</td>
```

#### Oczekiwane (JAK W /3):
```html
<td class="body-cell">
    <div class="eoz-ven-list eoz-ven-list-przygot">
        <div class="eoz-ven-item">
            <div class="switch-field">
                <input type="radio" ...>
                <label>Tak</label>
                <input type="radio" ...>
                <label>Nie</label>
            </div>
        </div>
    </div>
</td>
```

### 5. PRIORYTET NAPRAW

1. **KRYTYCZNE**: Naprawić `.switch-field` wrapper w Desktop (brak stylingu)
2. **WYSOKIE**: Zmienić "Nazwa okleiny" → "Okleina"
3. **ŚREDNIE**: Usunąć duplikację "Lp"
4. **NISKIE**: Dostosować kolejność kolumn (opcjonalne)

