# Load Testing Practice mit k6

Dieses Repository enthält Beispiel-Lasttests mit [Grafana k6](https://k6.io/).  
Ziel: einheitliche Testskripte, die sich leicht anpassen lassen, um erste Last- und Performancetests zu üben – z. B. gegen öffentliche Websites wie Wikipedia oder später gegen KDS.

---

## Features

- **open_only**  
  Öffnet die Startseite (z. B. Wikipedia) mit definierten Virtual Users (VUs).

- **open_and_search**  
  Öffnet zusätzlich eine Such-API und validiert JSON-Responses.

- **Flexible Steuerung** per Environment-Variablen:  
  `FLOW`, `BASE_URL`, `SEARCH_URL`, `VUS`, `DURATION`, `THINK_TIME_SEC`

- **Automatische Ergebnis-Summaries** im Verzeichnis `out/`

---

## Setup

### Voraussetzungen
- macOS/Linux mit [Homebrew](https://brew.sh/) oder Windows WSL
- k6 installiert:
  ```bash
  brew install k6
  ```
- Repository klonen:
  ```bash
  git clone git@github.com:HakanOezt/perf-k6-practice.git
  cd perf-k6-practice
  ```

---

## Nutzung

### Nur Seite öffnen
```bash
FLOW=open_only \
BASE_URL="https://www.wikipedia.org/" \
VUS=10 DURATION=1m THINK_TIME_SEC=1 \
bash scripts/run_k6.sh
```

### Seite + Suche
```bash
FLOW=open_and_search \
BASE_URL="https://www.wikipedia.org/" \
SEARCH_URL="https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=KION&format=json" \
VUS=15 DURATION=1m THINK_TIME_SEC=1 \
bash scripts/run_k6.sh
```

---

## Beispiel-Ergebnisse

### open_only (10 VUs, 1 min)
- **p95 Latenz:** ~139 ms
- **Fehler:** 0.00 %
- **RPS:** ~9/s

### open_and_search (15 VUs, 1 min)
- **p95 Latenz:** ~321 ms
- **Fehler:** 0.00 %
- **RPS:** ~12.6/s

Artefakte:
- `out/20250824-195600-open_only.summary.json`
- `out/20250824-202323-open_and_search.summary.json`

---

## 📊 Bewertungskriterien (Daumenregel)

| Metrik | Sehr gut ✅ | Gut 👍 | Normal ⚠️ | Schlecht ❌ |
|--------|-------------|--------|-----------|------------|
| **p95 Antwortzeit** | < 300 ms | < 500 ms | < 1000 ms | > 1000 ms |
| **Fehlerquote (`http_req_failed`)** | < 0.1 % | < 1 % | < 5 % | > 5 % |
| **Durchsatz (RPS)** | linear skaliert mit VUs | leicht abweichend | deutlich abweichend | kollabiert |
| **Iteration Duration** | stabil ±10 % | leicht schwankend | schwankend ±30 % | stark schwankend / Ausreißer |

Referenzen:
- k6 Best Practices
- Eigene Non-Functional Requirements (z. B. KDS/DiSA: **Online <2 s, Offline <1 s** für UI-Reaktionen)

---

## 📂 Struktur

```
.
├── scripts/
│   ├── run_k6.sh                  # zentraler Runner (FLOW gesteuert)
│   ├── run_k6_open_only.sh        # direkter Run für open_only
│   └── run_k6_open_and_search.sh  # direkter Run für open_and_search
├── tests/performance/k6/
│   ├── kds_open_only.js
│   └── kds_open_and_search.js
├── docs/
│   ├── REPORT_TEMPLATE.md
│   └── RUNBOOK.md
└── out/                           # Ergebnisdateien (ignored)
```

---

# 📑 Dokumentation der Testläufe

## 🧪 Beispiel-Läufe

### Run: open_only – 2025-08-24
| Metrik                 | Ergebnis | Bewertung     |
|-------------------------|----------|---------------|
| VUs                     | 10       |               |
| Dauer                   | 1m       |               |
| Requests gesamt         | 550      |               |
| Fehlerquote             | 0.00 %   | ✅ Sehr gut    |
| p95 Antwortzeit         | 138 ms   | ✅ Sehr gut    |
| p99 Antwortzeit         | 141 ms   | ✅ Sehr gut    |
| Max Antwortzeit         | 141 ms   | ✅ Sehr gut    |
| Iterations              | 550      |               |
| RPS (Durchsatz)         | ~9/s     |               |
| Daten empfangen         | 51 MB    |               |
| Daten gesendet          | 167 kB   |               |

---

### Run: open_and_search – 2025-08-24
| Metrik                 | Ergebnis | Bewertung     |
|-------------------------|----------|---------------|
| VUs                     | 15       |               |
| Dauer                   | 1m       |               |
| Requests gesamt         | 780      |               |
| Fehlerquote             | 0.00 %   | ✅ Sehr gut    |
| p95 Antwortzeit         | 321 ms   | 👍 Gut         |
| p99 Antwortzeit         | 411 ms   | 👍 Gut         |
| Max Antwortzeit         | 475 ms   | 👍 Gut         |
| Iterations              | 390      |               |
| RPS (Durchsatz)         | ~12.6/s  |               |
| Daten empfangen         | 38 MB    |               |
| Daten gesendet          | 169 kB   |               |

---

## Bewertungskriterien (Legende)

- ✅ **Sehr gut**: p95 < 300 ms, Fehler < 0.1 %, lineares RPS
- 👍 **Gut**: p95 < 500 ms, Fehler < 1 %
- ⚠️ **Normal**: p95 < 1000 ms, Fehler < 5 %
- ❌ **Schlecht**: p95 > 1000 ms, Fehler > 5 %, RPS kollabiert

---

## Visualisierung (optional)

Zur Veranschaulichung kannst du Ergebnisse auch grafisch darstellen:

```bash
# Beispiel: summary.json filtern
cat out/20250824-195600-open_only.summary.json | jq '.metrics.http_req_duration'
```

Oder Screenshots/Grafiken in `docs/` ablegen und hier einbinden:


---

## Workflow zur Dokumentation

1. Testlauf starten
2. Ergebnis in `out/*.summary.json` speichern
3. Werte (p95, Fehlerquote, RPS etc.) in Tabelle übertragen
4. Bewertung anhand der Kriterien eintragen
5. Optional: Grafik erzeugen und im Repo ablegen
6. README oder `docs/RUNBOOK.md` aktualisieren
