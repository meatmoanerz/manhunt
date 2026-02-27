# MANHUNT — Buildplan & Design System
**Version 1.0 — 2025**

---

## DEL 1: DETALJERAD BUILDPLAN

> Varje delmoment är märkt med **prioritet** (P1 = kritisk MVP, P2 = fas 2, P3 = fas 3+) och **fas**.

---

### MODUL 0: Projektstruktur & Foundation
*Byggs först. Allt annat beror på detta.*

| # | Delmoment | Prioritet | Kommentar |
|---|-----------|-----------|-----------|
| 0.1 | Initiera Expo + React Native projekt | P1 | `npx create-expo-app manhunt --template` |
| 0.2 | Konfigurera TypeScript | P1 | Strikt läge från dag 1 |
| 0.3 | Sätt upp mappstruktur (`/screens`, `/components`, `/hooks`, `/store`, `/services`, `/theme`) | P1 | |
| 0.4 | Installera och konfigurera Firebase (Firestore, Auth, Storage, Functions) | P1 | |
| 0.5 | Aktivera Firestore offline persistence | P1 | `enablePersistence()` |
| 0.6 | Konfigurera Expo Router (filbaserad navigation) | P1 | |
| 0.7 | Sätt upp global state (Zustand eller Redux Toolkit) | P1 | |
| 0.8 | Implementera designsystem och tema-tokens (se Del 2) | P1 | Gör detta tidigt – allt byggs ovanpå |
| 0.9 | Konfigurera EAS Build (Expo Application Services) | P1 | För TestFlight/intern testning |
| 0.10 | Konfigurera Firestore Security Rules (bas) | P1 | |

---

### MODUL 1: Autentisering & Session
*Spelare måste kunna identifiera sig och ansluta till ett spel.*

| # | Delmoment | Prioritet | Kommentar |
|---|-----------|-----------|-----------|
| 1.1 | Firebase Anonymous Authentication | P1 | Ingen registrering krävs för att spela |
| 1.2 | Persistent lokal spelarprofil (namn, avatar-färg) | P1 | Sparas i AsyncStorage |
| 1.3 | Skapa spelsession i Firestore | P1 | Generera sessionId + 6-siffrig kod |
| 1.4 | Generera QR-kod för session | P1 | `expo-barcode-scanner` eller `react-native-qrcode-svg` |
| 1.5 | Anslut till session via sessionskod (manuellt) | P1 | |
| 1.6 | Anslut via QR-kodsskanning | P1 | |
| 1.7 | Realtids-lobby (alla spelare visas live via Firestore-lyssnare) | P1 | |

---

### MODUL 2: Lobby & Regelkonfiguration
*Spelledaren sätter upp spelet.*

| # | Delmoment | Prioritet | Kommentar |
|---|-----------|-----------|-----------|
| 2.1 | Laguppdelning UI (drag/tryck spelare till lag) | P1 | |
| 2.2 | Konfigurera försprång (minuter, slider) | P1 | |
| 2.3 | Bygg ledtrådsschema-editor | P1 | Drag-and-drop sekvens + intervall-inmatning |
| 2.4 | Förhandsgranskning av ledtrådsschema som tidslinje | P1 | Beräkna och visa exakta tider |
| 2.5 | Konfigurera geofence-väntetid | P1 | |
| 2.6 | Toggle: Strafftid vid fence-brott (AV/PÅ) | P1 | |
| 2.7 | Valfri maximal speltid | P1 | |
| 2.8 | Spectator-roll (spelledaren kan tilldela) | P2 | |
| 2.9 | Spelledarens "Starta spel"-knapp med bekräftelse | P1 | |
| 2.10 | Regelsammanfattning visas för alla innan start | P1 | |

---

### MODUL 3: Spelstart & Försprång
*Övergången från lobby till aktivt spel.*

| # | Delmoment | Prioritet | Kommentar |
|---|-----------|-----------|-----------|
| 3.1 | Försprångs-nedräkning visas för jagande | P1 | Stor countdown-timer |
| 3.2 | "Spring iväg!"-skärm för jagade | P1 | |
| 3.3 | Bakgrundslocation-aktivering (Expo Location) | P1 | Kräver permissions-flöde |
| 3.4 | Permissions-flöde: Location (alltid), Kamera, Notiser | P1 | Tydliga förklaringar varför varje permission behövs |
| 3.5 | Spara spelstart-tidsstämpel i Firestore | P1 | Alla timers beräknas relativt detta |

---

### MODUL 4: Timer-motor (Firebase Cloud Functions)
*Hjärtat i spelet. Kör server-side, aldrig på klient.*

| # | Delmoment | Prioritet | Kommentar |
|---|-----------|-----------|-----------|
| 4.1 | Cloud Function: Beräkna ledtrådsschema vid spelstart | P1 | Loopar sekvensen, skapar array av `{type, triggerAt}` |
| 4.2 | Cloud Function: Schemalägg Pub/Sub-triggers för varje ledtråd | P1 | `firebase-functions/scheduler` eller Cloud Tasks |
| 4.3 | Cloud Function: 5-minuters varning (push + Firestore-uppdatering) | P1 | |
| 4.4 | Cloud Function: 1-minuts varning | P1 | |
| 4.5 | Cloud Function: Trigga ledtrådsflöde (sätt `currentClue` i Firestore) | P1 | Klienten lyssnar på detta fält |
| 4.6 | Cloud Function: Räkna strafftid vid sen inlämning | P1 | Beräknas när klienten rapporterar "skickat" |
| 4.7 | Cloud Function: Geofence-timeout (starta väntetimer i Firestore) | P1 | |
| 4.8 | Cloud Function: Avsluta spel automatiskt vid maximal speltid | P1 | |

---

### MODUL 5: Ledtrådsflöde (Jagade-sidan)
*Vad de jagade ser och gör när det är dags för en ledtråd.*

| # | Delmoment | Prioritet | Kommentar |
|---|-----------|-----------|-----------|
| 5.1 | In-app 10-sekunders nedräkning med visuell + auditiv feedback | P1 | Stor, dramatisk UI-komponent |
| 5.2 | Push-notis vid 5 min kvar | P1 | `expo-notifications` |
| 5.3 | Push-notis vid 1 min kvar | P1 | |
| 5.4 | Ledtrådstyp: PIN – automatisk GPS-hämtning och skickning | P1 | Ingen användarinteraktion |
| 5.5 | Ledtrådstyp: FOTO – öppna kamera, ta bild med fram + bak | P1 | 30-sekunders fönster |
| 5.6 | Ledtrådstyp: VIDEO – öppna kamera för videoinspelning (max 15 sek) | P1 | |
| 5.7 | Strafftids-räknare: tickar upp från sekund 11 | P1 | Visuell feedback i realtid |
| 5.8 | Uppladdning av foto/video till Firebase Storage | P1 | Komprimera innan uppladdning |
| 5.9 | Bekräftelse-UI när ledtråd skickats | P1 | |
| 5.10 | Historik: jagade kan se alla sina skickade ledtrådar | P1 | |

---

### MODUL 6: Geofence-logik
*De jagade måste stanna kvar efter att ha skickat en ledtråd.*

| # | Delmoment | Prioritet | Kommentar |
|---|-----------|-----------|-----------|
| 6.1 | Aktivera Expo Location geofencing vid ledtråd-skickning | P1 | 10 m radie |
| 6.2 | Väntetimer UI (nedräkning synlig för jagade) | P1 | Inkl. strafftid |
| 6.3 | Fence-brott detektion (>10 sek utanför) | P1 | |
| 6.4 | Notis till jagande vid fence-brott | P1 | "De jagade har lämnat zonen!" |
| 6.5 | Lägg till strafftid på väntetimer när fence-brott sker (om aktiverat) | P1 | |
| 6.6 | Visuell karta som visar geofence-zonen | P1 | |
| 6.7 | "Du är fri att springa!" - notis och UI när väntetid är klar | P1 | |

---

### MODUL 7: Jagande-sidan (Ledtråds-feed)
*Vad de jagande ser.*

| # | Delmoment | Prioritet | Kommentar |
|---|-----------|-----------|-----------|
| 7.1 | Realtids-feed av inkommande ledtrådar | P1 | Firestore-lyssnare |
| 7.2 | Visa PIN-ledtråd som marknål på karta | P1 | |
| 7.3 | Visa FOTO-ledtråd (fullskärm + thumbnail) | P1 | |
| 7.4 | Visa VIDEO-ledtråd (inbyggd videospelare) | P1 | |
| 7.5 | Notis vid ny ledtråd | P1 | |
| 7.6 | Notis vid fence-brott | P1 | |
| 7.7 | Historik: alla mottagna ledtrådar med tidsstämplar | P1 | |
| 7.8 | Karta med alla PIN-ledtrådar markerade | P1 | |

---

### MODUL 8: Realtids-tracking
*Spelares positioner spelas in kontinuerligt.*

| # | Delmoment | Prioritet | Kommentar |
|---|-----------|-----------|-----------|
| 8.1 | Bakgrunds-GPS-tracking (Expo Location, `watchPositionAsync`) | P1 | Var 5:e sek |
| 8.2 | Skriv GPS-punkt till Firestore (`tracking/{playerId}/positions`) | P1 | |
| 8.3 | Low battery-läge: reducera frekvens till var 30:e sek vid <20% batteri | P2 | |
| 8.4 | Batteri-nivå-monitor | P2 | `expo-battery` |

---

### MODUL 9: Chattfunktioner
*Kommunikation under spelet.*

| # | Delmoment | Prioritet | Kommentar |
|---|-----------|-----------|-----------|
| 9.1 | Lagchatt UI (meddelanden, inputfält) | P1 | |
| 9.2 | Lagchatt Firestore-integration (realtid) | P1 | |
| 9.3 | Cross-team chatt UI | P1 | |
| 9.4 | Cross-team chatt Firestore-integration | P1 | |
| 9.5 | Notis vid nytt meddelande (tyst notis under gameplay) | P1 | |
| 9.6 | Olicentierade-meddelanderäknare (badge) | P1 | |

---

### MODUL 10: Spelets Avslut
*Fångst-flödet och avslutning.*

| # | Delmoment | Prioritet | Kommentar |
|---|-----------|-----------|-----------|
| 10.1 | "Fångade"-knapp för jagade | P1 | |
| 10.2 | Bekräftelse-popup för jagande (Ja/Nej) | P1 | |
| 10.3 | Avsluta session i Firestore (sätt status = "completed") | P1 | |
| 10.4 | Push-notis till alla: "Spelet är slut!" | P1 | |
| 10.5 | Automatiskt avslut via Cloud Function (maximal speltid) | P1 | |
| 10.6 | Resultatskärm (vinnare, total tid, nyckelstatistik) | P1 | |

---

### MODUL 11: SOS-funktion
*Säkerhetskritisk. Byggs i MVP.*

| # | Delmoment | Prioritet | Kommentar |
|---|-----------|-----------|-----------|
| 11.1 | SOS-knapp (alltid synlig, skyddad mot oavsiktligt tryck) | P1 | Kräver 2-stegs-bekräftelse |
| 11.2 | SOS triggar: avsluta session, dela GPS till alla, push-notis | P1 | |

---

### MODUL 12: Replay & Statistik
*Post-game upplevelsen. Fas 2.*

| # | Delmoment | Prioritet | Kommentar |
|---|-----------|-----------|-----------|
| 12.1 | Hämta all tracking-data för session från Firestore | P2 | |
| 12.2 | Animera lagrörelser på karta med tidsslider | P2 | |
| 12.3 | Visa ledtrådar på kartan vid rätt tidpunkt | P2 | |
| 12.4 | Statistikkort: distans, strafftid, närmaste avstånd | P2 | |
| 12.5 | Dela replay som video (screen capture + export) | P3 | |

---

### MODUL 13: Spectator-läge
*Fas 2.*

| # | Delmoment | Prioritet | Kommentar |
|---|-----------|-----------|-----------|
| 13.1 | Spectator-roll i Firestore + UI | P2 | |
| 13.2 | Spectator livekarta (båda lagets positioner) | P2 | |
| 13.3 | Spectator ledtråds-feed | P2 | |
| 13.4 | Spectator kan ej interagera med spelet | P2 | Firestore Rules |

---

### MODUL 14: Spelarprofil & Historik
*Fas 3.*

| # | Delmoment | Prioritet | Kommentar |
|---|-----------|-----------|-----------|
| 14.1 | Användarprofil (namn, statistik aggregerad) | P3 | |
| 14.2 | Spelarhistorik (lista av spel med länk till replay) | P3 | |
| 14.3 | Achievements / prestationsmärken | P3 | |

---

### MODUL 15: Övriga Features
*Fas 2-3.*

| # | Delmoment | Prioritet | Kommentar |
|---|-----------|-----------|-----------|
| 15.1 | Offline-kart-nedladdning | P3 | `react-native-maps` offline tiles |
| 15.2 | Low battery-läge (fullt implementerat) | P2 | |
| 15.3 | Onboarding-flöde (walkthrough vid första start) | P2 | |

---

## BYGGNADSORDNING (rekommenderad sekvens)

```
Vecka 1-2:   Modul 0 (foundation) + Modul 1 (auth/session)
Vecka 3-4:   Modul 2 (lobby) + Modul 3 (spelstart) + Modul 11 (SOS)
Vecka 5-6:   Modul 4 (timer-motor) + Modul 5 (ledtrådsflöde jagade)
Vecka 7-8:   Modul 6 (geofence) + Modul 7 (jagande-feed) + Modul 8 (tracking)
Vecka 9-10:  Modul 9 (chatt) + Modul 10 (avslut) → MVP KLAR för test
Vecka 11-12: Modul 12 (replay) + Modul 13 (spectator) + polish
Vecka 13-14: Modul 14-15 + public launch prep
```

---
---

## DEL 2: DESIGN SYSTEM — MANHUNT

### 2.1 Stilriktning: Neo-Brutalism

Neo-brutalism för Manhunt innebär:
- **Tjocka, svarta kanter** på alla interaktiva element
- **Offset-skuggor** (solid, inte gaussian blur) – skuggorna "pekar" i en riktning
- **Råa, ofiltrerade typsnitt** – bold, condensed, karaktärsstarka
- **Hög kontrast** – svart på vitt, eller neon på svart
- **Asymmetriska detaljer** – element är inte perfekt centrerade, de har "karaktär"
- **Synliga states** – hover, press och active states är överdrivna, taktila
- **Ingen rundad mjukhet** – border-radius är antingen 0 eller mycket liten (max 4px)

---

### 2.2 Färgpalett

#### Primära Färger

| Namn | Hex | Användning |
|------|-----|-----------|
| `hunt-black` | `#0A0A0A` | Primär text, borders, bakgrund (dark) |
| `hunt-white` | `#F5F0E8` | Bakgrundsfärg (varm off-white, inte ren #FFF) |
| `hunt-yellow` | `#FFE040` | Primär accent – CTA-knappar, aktiva states, highlights |
| `hunt-red` | `#FF2D2D` | Fara, strafftid, SOS, varningar |
| `hunt-green` | `#00E676` | Lyckad handling, "fri att springa", positiv feedback |

#### Sekundära Färger

| Namn | Hex | Användning |
|------|-----|-----------|
| `hunt-gray-100` | `#F0EBE0` | Kortbakgrunder, subtila ytor |
| `hunt-gray-300` | `#C8C0B0` | Disabled states, subtil text |
| `hunt-gray-600` | `#6B6560` | Sekundär text, labels |
| `hunt-gray-900` | `#1A1714` | Mörkare svart-nyans för djup |
| `hunt-blue` | `#1A6BFF` | Information, PIN-markörer på karta |
| `hunt-orange` | `#FF6B00` | Timer-varningar (5 min, 1 min) |

#### Systemfärger (semantiska)

```
success:  #00E676  (hunt-green)
danger:   #FF2D2D  (hunt-red)
warning:  #FF6B00  (hunt-orange)
info:     #1A6BFF  (hunt-blue)
primary:  #FFE040  (hunt-yellow)
```

---

### 2.3 Typografi

#### Typsnittval (Neo-Brutalist)

| Roll | Typsnitt | Vikt | Källa |
|------|---------|------|-------|
| **Display / Headlines** | `Barlow Condensed` | 800 (ExtraBold) | Google Fonts |
| **UI / Body** | `Space Mono` | 400 / 700 | Google Fonts |
| **Siffror / Timers** | `Barlow Condensed` | 900 (Black) | Google Fonts |

*Motivering: Barlow Condensed ger militär/action-känsla som passar temat. Space Mono är monospaced och teknisk – perfekt för en brutalist design och gör timers och koder extremt läsbara.*

#### Typsnittsskala

```
xs:   11px / 14px line-height  – mikro-labels, badges
sm:   13px / 18px              – sekundär text, timestamps
base: 16px / 22px              – body text, chatmeddelanden
lg:   18px / 24px              – kortrubriker, knappar
xl:   24px / 28px              – sidrubriker
2xl:  32px / 36px              – stora rubriker
3xl:  48px / 52px              – countdown-timer
4xl:  72px / 76px              – "FÅNGADE!" - dramatiska moments
5xl:  96px / 96px              – försprångs-nedräkning
```

---

### 2.4 Spacing & Grid

```
Bas-enhet: 4px

space-1:  4px    – mikro-gap
space-2:  8px    – kompakt inre padding
space-3:  12px   – standard inre padding
space-4:  16px   – standard yttre margin
space-5:  20px   – medium gap
space-6:  24px   – sektionsgap
space-8:  32px   – storsektionsgap
space-10: 40px   – skärm-padding
space-12: 48px   – hero-spacing

Screen-padding: 20px horisontellt (space-5)
```

---

### 2.5 Borders & Skuggor (Neo-Brutalist Signatur)

```
Border:
  width:  2px (standard), 3px (knappar), 4px (hero-kort)
  color:  #0A0A0A (hunt-black)
  radius: 0px (standard), 4px (max – mycket sparsamt)

Offset Shadow (Neo-Brutalist):
  shadow-sm:  3px 3px 0px #0A0A0A
  shadow-md:  5px 5px 0px #0A0A0A
  shadow-lg:  8px 8px 0px #0A0A0A
  shadow-xl:  12px 12px 0px #0A0A0A

Colored Shadows (för accent-element):
  shadow-yellow:  5px 5px 0px #FFE040
  shadow-red:     5px 5px 0px #FF2D2D
  shadow-green:   5px 5px 0px #00E676

Press State (knapptryck):
  → Flytta elementet 3-5px ned-höger (matcha skuggstorleken)
  → Minska eller ta bort skuggan
  → Ger taktil "ner-tryck"-känsla
```

---

### 2.6 Komponentbibliotek

#### Knappar

```
Primär (CTA):
  Bakgrund:     #FFE040 (hunt-yellow)
  Text:         #0A0A0A, Barlow Condensed 800, uppercase
  Border:       3px solid #0A0A0A
  Shadow:       5px 5px 0px #0A0A0A
  Pressed:      translateX(3px) translateY(3px), shadow 2px 2px

Sekundär:
  Bakgrund:     #F5F0E8 (hunt-white)
  Text:         #0A0A0A, Barlow Condensed 700
  Border:       3px solid #0A0A0A
  Shadow:       5px 5px 0px #0A0A0A

Fara (SOS, Strafftid):
  Bakgrund:     #FF2D2D (hunt-red)
  Text:         #F5F0E8, Barlow Condensed 800
  Border:       3px solid #0A0A0A
  Shadow:       5px 5px 0px #0A0A0A

Ghost:
  Bakgrund:     transparent
  Text:         #0A0A0A
  Border:       2px solid #0A0A0A
  Shadow:       ingen
```

#### Kort (Cards)

```
Standard:
  Bakgrund:     #F5F0E8
  Border:       3px solid #0A0A0A
  Shadow:       6px 6px 0px #0A0A0A
  Padding:      16px
  Radius:       0px

Aktiv/Highlight (t.ex. aktiv ledtråd):
  Bakgrund:     #FFE040
  Border:       3px solid #0A0A0A
  Shadow:       6px 6px 0px #0A0A0A

Fara (strafftid, fence-brott):
  Bakgrund:     #FF2D2D
  Text:         #F5F0E8
  Border:       3px solid #0A0A0A
  Shadow:       6px 6px 0px #0A0A0A
```

#### Input-fält

```
Bakgrund:   #F5F0E8
Border:     3px solid #0A0A0A
Shadow:     4px 4px 0px #0A0A0A (inåt-känsla)
Focused:    Border #FFE040 + shadow 4px 4px 0px #FFE040
Font:       Space Mono 400
Placeholder: #C8C0B0
```

#### Timer-komponent

```
Container:
  Bakgrund:     #0A0A0A
  Border:       4px solid #FFE040
  Shadow:       8px 8px 0px #FFE040

Siffror:
  Font:         Barlow Condensed 900
  Storlek:      72-96px beroende på kontext
  Färg:         #FFE040

Varning (<5 min):
  Siffror → #FF6B00

Kritisk (<1 min):
  Siffror → #FF2D2D
  Container pulserar (animation)

10-sek nedräkning:
  Fullskärm takeover
  Enorm siffra centrerad
  Bakgrund blinkar svart/rött
```

#### Statusindikator (Lag-badges)

```
Jagade:
  Bakgrund:   #FF2D2D
  Text:       #F5F0E8 "JAGADE"
  Border:     2px solid #0A0A0A

Jagande:
  Bakgrund:   #1A6BFF
  Text:       #F5F0E8 "JAGANDE"
  Border:     2px solid #0A0A0A

Spectator:
  Bakgrund:   #C8C0B0
  Text:       #0A0A0A "SPECTATOR"
  Border:     2px solid #0A0A0A
```

---

### 2.7 Animationer & Micro-interactions

```
Transition-standard:   150ms ease-out
Transition-spring:     200ms cubic-bezier(0.34, 1.56, 0.64, 1) [lätt overshoot]

Knapp-press:
  → scale(0.97) + translateY(3px) + minska shadow
  → 100ms duration

Ny ledtråd inkommer:
  → Kort "flash" i gult (#FFE040) på bakgrund
  → Kortkomponent "stampar" in från höger med spring-animation
  → Push-notis-ljud

10-sek nedräkning:
  → Bakgrunden blinkar svart/rött var 1:e sekund
  → Siffran skakar (shake-animation) sista 3 sekunderna
  → Vibration (haptic feedback) var sekund

Geofence-breach:
  → Röd puls-animation sprider sig från kartmarkören
  → Skärmen får röd border som pulserar

Strafftid-räknare:
  → Siffror "tickar" upp, varje steg är en liten bounce
  → Röd bakgrund intensifieras med strafftid

Fångad-bekräftelse:
  → Stor "FÅNGAD" text stampar in
  → Konfetti-animation (gul/svart)
```

---

### 2.8 Skärm-layout Principer

```
Navigation:
  → Bottom tab bar (max 3 tabs under aktivt spel)
  → Tabs: [Ledtrådar] [Karta] [Chatt]
  → SOS-knapp alltid synlig – top-right corner, röd, 2-stegs

Dark Mode:
  → Bakgrund: #0A0A0A
  → Kort: #1A1714
  → Text: #F5F0E8
  → Borders: #F5F0E8 (vit i dark mode)
  → Shadows: 5px 5px 0px #F5F0E8 (vit shadow i dark mode)
  → Accent: #FFE040 (oförändrad)

Maps:
  → Custom map-stil: muted, desaturated (matcha appen)
  → Markörer är neo-brutalistiska: fyrkantiga, tjock border
  → Jagade lag: röd markör (#FF2D2D)
  → Jagande lag: blå markör (#1A6BFF)
  → Geofence: gul (#FFE040) streckad ring
  → Hotspots (framtid): svart fyrkant med gul border
```

---

### 2.9 Ikonografi

```
Stil: Outline-ikoner, 2px stroke, skarpa hörn (ingen rounding)
Rekommenderat bibliotek: Phosphor Icons (har "bold" variant som matchar neo-brutalism)
Storlek: 24px (standard), 32px (knappar), 48px (hero-states)

Nyckelikoner:
  📍 Pin-ledtråd: MapPin (filled)
  📷 Foto: Camera
  🎥 Video: VideoCamera
  ⏱  Timer: Timer
  🚨 SOS: SirenError (röd, alltid)
  💬 Chatt: Chat
  🏃 Jagade: PersonSimpleRun
  🔍 Jagande: MagnifyingGlass
  ⚠️ Strafftid: Warning (röd)
  ✅ Bekräftad: CheckCircle (grön)
```

---

### 2.10 React Native Implementation – Token-fil

```typescript
// theme/tokens.ts

export const colors = {
  // Core
  black:    '#0A0A0A',
  white:    '#F5F0E8',
  
  // Primary
  yellow:   '#FFE040',
  red:      '#FF2D2D',
  green:    '#00E676',
  blue:     '#1A6BFF',
  orange:   '#FF6B00',
  
  // Grays
  gray100:  '#F0EBE0',
  gray300:  '#C8C0B0',
  gray600:  '#6B6560',
  gray900:  '#1A1714',
  
  // Semantic
  primary:  '#FFE040',
  danger:   '#FF2D2D',
  success:  '#00E676',
  warning:  '#FF6B00',
  info:     '#1A6BFF',
} as const;

export const typography = {
  display:  { fontFamily: 'BarlowCondensed_800ExtraBold' },
  displayBold: { fontFamily: 'BarlowCondensed_900Black' },
  body:     { fontFamily: 'SpaceMono_400Regular' },
  bodyBold: { fontFamily: 'SpaceMono_700Bold' },
} as const;

export const shadows = {
  sm:     { shadowOffset: { width: 3, height: 3 }, shadowColor: '#0A0A0A', shadowOpacity: 1, shadowRadius: 0, elevation: 3 },
  md:     { shadowOffset: { width: 5, height: 5 }, shadowColor: '#0A0A0A', shadowOpacity: 1, shadowRadius: 0, elevation: 5 },
  lg:     { shadowOffset: { width: 8, height: 8 }, shadowColor: '#0A0A0A', shadowOpacity: 1, shadowRadius: 0, elevation: 8 },
  yellow: { shadowOffset: { width: 5, height: 5 }, shadowColor: '#FFE040', shadowOpacity: 1, shadowRadius: 0, elevation: 5 },
  red:    { shadowOffset: { width: 5, height: 5 }, shadowColor: '#FF2D2D', shadowOpacity: 1, shadowRadius: 0, elevation: 5 },
} as const;

export const borders = {
  sm: { borderWidth: 2, borderColor: '#0A0A0A' },
  md: { borderWidth: 3, borderColor: '#0A0A0A' },
  lg: { borderWidth: 4, borderColor: '#0A0A0A' },
} as const;

export const spacing = {
  1: 4, 2: 8, 3: 12, 4: 16,
  5: 20, 6: 24, 8: 32, 10: 40,
  12: 48,
} as const;

export const radius = {
  none: 0,
  sm: 4,    // Mycket sparsamt
} as const;
```

---

*Manhunt Design System v1.0 — Neo-Brutalism*
