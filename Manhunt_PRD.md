# MANHUNT
## Product Requirements Document
**Version 1.0 — 2025**
*Ett realtids jaktspel för iOS och Android*
*Inspirerat av JLC:s "På Rymmen"*

---

## Innehållsförteckning

1. [Executive Summary](#1-executive-summary)
2. [Produktvision och Målgrupp](#2-produktvision-och-målgrupp)
3. [Rekommenderad Tech Stack](#3-rekommenderad-tech-stack)
4. [Spelflöde – Översikt](#4-spelflöde--översikt)
5. [Lobby och Speluppsättning](#5-lobby-och-speluppsättning)
6. [Ledtrådsschema](#6-ledtrådsschema)
7. [Ledtrådstyper](#7-ledtrådstyper)
8. [Geofence och Strafftid](#8-geofence-och-strafftid)
9. [Chattfunktioner](#9-chattfunktioner)
10. [Spelets Avslut](#10-spelets-avslut)
11. [Realtids-tracking och Replay](#11-realtids-tracking-och-replay)
12. [Spectator-läge](#12-spectator-läge)
13. [Spelarhistorik och Stats](#13-spelarhistorik-och-stats)
14. [Övriga Funktioner](#14-övriga-funktioner)
15. [Datamodell (Firestore)](#15-datamodell-firestore)
16. [Rollout-schema](#16-rollout-schema)
17. [Bygg i Framtiden – Hotspot-systemet](#17-bygg-i-framtiden--hotspot-systemet)
18. [Monetisering](#18-monetisering)
19. [Icke-funktionella Krav](#19-icke-funktionella-krav)
20. [Framgångsmått (KPI:er)](#20-framgångsmått-kpier)
21. [Öppna Frågor](#21-öppna-frågor)

---

## 1. Executive Summary

Manhunt är en mobil realtidsapp för iOS och Android som gör det möjligt för grupper att spela ett organiserat jaktspel inspirerat av det populära TV- och YouTube-formatet. Ett lag försöker fly och hålla sig gömda, medan ett annat lag jaktar dem med hjälp av ledtrådar som de jagade är tvungna att skicka med jämna mellanrum.

Appen hanterar hela spelupplevelsen: lobby och laguppdelning, regelkonfiguration, automatiska timers, insamling och distribution av ledtrådar (plats-pin, foto, video), strafftidslogik, geofencing, realtids-tracking, chatt och en fullständig replay av spelet när det är över.

> **Primärt mål:** Att skapa den mest engagerande och enkla digitala plattformen för att spela På Rymmen-inspirerade jaktspel – med ambitionen att nå en bred publik via ett samarbete med JLC och deras YouTube-kanal.

---

## 2. Produktvision och Målgrupp

### 2.1 Vision

Manhunt ska vara så enkelt att sätta upp att man kan köra ett spel med kompisar inom 5 minuter. Appen ska kännas levande och spännande under spelets gång, och efter spelet ge alla spelarna en rolig upplevelse när de ser hela jakten spelas upp på en karta.

### 2.2 Målgrupp

- Vängrupper (18–35 år) som letar efter kreativa aktiviteter utomhus
- Företag och team som söker aktiviteter för event och konferenser
- Content creators och YouTube-kanaler (primärt JLC) som vill gamifiera sina videos
- Konferenser i nya städer som vill kombinera nätverkande med stadsutforskning

### 2.3 Unik Värdeproposition

Till skillnad från generella "tag"-appar erbjuder Manhunt ett fullt konfigurerat regelmotorsystem med automatiska timers, strafftidslogik, geofencing och en komplett inspelning av spelet. Appen är byggd för att funka live på YouTube och sociala medier.

---

## 3. Rekommenderad Tech Stack

| Komponent | Lösning | Motivering |
|-----------|---------|------------|
| Ramverk (mobil) | React Native + Expo SDK | En kodbas för iOS & Android. Inbyggt stöd för kamera, location, notiser och bakgrundsprocesser. |
| Backend & Realtid | Firebase (Firestore) | Realtidssynkronisering med inbyggt offline-stöd. Data buffras lokalt vid avbrott och synkas automatiskt. |
| Serverlogik | Firebase Cloud Functions | All timer- och spellogik körs server-side. Ingen enskild enhet styr spelet. |
| Media-lagring | Firebase Storage | Hanterar uppladdning av bilder och video. |
| Autentisering | Firebase Authentication | Anonym inloggning via session-kod (likt Kahoot). |
| Location & Geofencing | Expo Location | Bakgrundsspårning och inbyggt geofencing-API. |
| Push Notifications | Expo Notifications | Larmnotiser: 5 min, 1 min, 10 sek nedräkning. |
| Kartor & Replay | React Native Maps | Google Maps / Apple Maps med animerad replay-funktion. |

### 3.1 Offline-hantering

Firestore SDK har inbyggd offline-persistens. När en spelare tappar internet:

- Alla Firestore-lyssnare fortsätter fungera mot lokal cache
- Skrivoperationer (t.ex. en ledtråd) köas och synkas när connection återkommer
- Timers körs på Firebase Cloud Functions, inte på enheten – spelaren missar aldrig en händelse
- Vid återanslutning synkas spelaren automatiskt till korrekt spelstate

---

## 4. Spelflöde – Översikt

| Fas | Namn | Beskrivning |
|-----|------|-------------|
| 1 | Lobby | Spelledaren skapar session. Spelare ansluter via QR-kod eller session-kod. Laguppdelning. |
| 2 | Regelkonfiguration | Spelledaren konfigurerar försprång, ledtrådsschema, väntetid i geofence, strafftidsinställningar m.m. |
| 3 | Försprång | De jagade får sitt försprång. Nedräkning visas för de jagande. |
| 4 | Aktiv jakt | Automatiska timers skickar notiser. Jagade skickar ledtrådar och väntar i geofence. Jagande tar emot ledtrådar. |
| 5 | Avslut | De jagade trycker på "Fångade". De jagande bekräftar. Spelet avslutas. |
| 6 | Replay & Statistik | Alla spelare ser hela jakten animerat på kartan med tidsstämplar och statistik. |

---

## 5. Lobby och Speluppsättning

### 5.1 Skapa Session

- Spelledaren skapar en ny session i appen
- En unik 6-siffrig spelkod genereras (likt Kahoot) samt en QR-kod
- Spelledaren delar koden/QR-koden med alla deltagare
- Spelare ansluter genom att skanna QR-koden eller ange koden manuellt
- Alla anslutna spelare visas i lobbyn i realtid

### 5.2 Laguppdelning

- Spelledaren tilldelar spelare till "Jagade" respektive "Jagande" laget
- Minsta antal spelare: 2 (en per lag)
- Inget maxantal – obegränsat antal spelare per lag
- Spelledaren kan byta spelare mellan lag fram till spelet startar

### 5.3 Regelkonfiguration

| Inställning | Beskrivning | Default |
|-------------|-------------|---------|
| Försprång | Minuter de jagade får springa iväg innan de jagande startar | 10 min |
| Ledtrådsschema | Välj typer (Pin, Foto, Video), ordning och intervall i minuter | 30 min intervall |
| Geofence-väntetid | Hur länge jagade måste stanna kvar i geofencen efter ledtråd | 5 min |
| Strafftid vid fence-brott | Om strafftid läggs på vid fence-brott. Notis skickas alltid om >10 sek utanför | AV |
| Strafftid sen ledtråd | Aktiveras alltid. +10 sek per sek försenat efter 10 sek-gränsen. 30 sek = +5 min | PÅ (alltid) |
| Maximal speltid | Valfri tidsgräns. Spelet avslutas automatiskt vid timeout | Ingen |

---

## 6. Ledtrådsschema

### 6.1 Hur Schemat Fungerar

Spelledaren konfigurerar ett ledtrådsschema bestående av:

1. En ordnad sekvens av ledtrådstyper (t.ex. `Pin → Foto → Pin → Video`)
2. Ett intervall i minuter mellan varje ledtråd (t.ex. 30 min)

Appen räknar automatiskt ut exakt när varje ledtråd ska skickas baserat på spelstartens tidsstämpel. Sekvensen loopar tills spelet är slut.

**Exempel – Default-schema:**
```
Sekvens:   Pin → Foto → Pin → Video (loopar)
Intervall: 30 minuter

Resultat:
  30 min  → Pin
  60 min  → Foto
  90 min  → Pin
  120 min → Video
  150 min → Pin
  180 min → Foto
  ...
```

### 6.2 Konfigurationsmöjligheter

- Lägg till/ta bort ledtrådstyper ur sekvensen
- Ändra ordningen på ledtrådstyper via drag-and-drop
- Ställ in intervallet (1–120 minuter, default 30 min)
- Förhandsgranska det beräknade schemat som en tidslinje innan spelet startar

### 6.3 Serverlogik för Timers

Alla timers exekveras via **Firebase Cloud Functions**, inte på klientenheterna. När en timer går ut:

1. Cloud Function skickar push-notis till alla jagades enheter
2. Notisen triggar relevant ledtrådsflöde (se sektion 7)
3. Resultatet sparas i Firestore och synkas till jagandenas enheter i realtid

---

## 7. Ledtrådstyper

### 7.1 Pin (Plats-delning)

- Appen hämtar automatiskt enhetens nuvarande GPS-koordinater
- Ingen bekräftelse eller aktiv handling krävs av de jagade
- Platsen sparas i Firestore och visas omedelbart på de jagandes karta
- Tidsstämpel och platsmarker läggs till i sessionens ledtrådshistorik

### 7.2 Foto

- Push-notis skickas till de jagade med ett larm
- Kameran öppnas automatiskt i appen
- Både fram- och bakkameran aktiveras – appen tar ett foto med respektive kamera
- De jagade har **30 sekunder** på sig att ta och skicka foton

**Strafftidslogik:**

| Tid efter timern | Strafftid |
|-----------------|-----------|
| 0–10 sek | Ingen strafftid |
| 11 sek | +10 sek |
| 12 sek | +20 sek |
| ... per sekund | +10 sek/sek |
| 30 sek (eller mer) | +5 minuter (fast) |

- Foton laddas upp till Firebase Storage och visas i jagandenas ledtrådsflöde

### 7.3 Video

- Samma flöde som Foto, men med videoinspelning istället för stillbild
- Maximal videolängd: 15 sekunder
- Samma strafftidslogik som Foto gäller
- Video komprimeras på enheten innan uppladdning

### 7.4 Varningssystem (alla ledtrådstyper)

| Tidpunkt | Vad som händer |
|----------|----------------|
| 5 minuter kvar | Push-notis: "Ledtråd om 5 minuter!" |
| 1 minut kvar | Push-notis med starkare larm: "Ledtråd om 1 minut!" |
| 10 sekunder kvar | In-app nedräkning med visuell och auditiv feedback |
| 0 sekunder | Ledtrådsflödet triggas automatiskt |

---

## 8. Geofence och Strafftid

### 8.1 Geofence-logik

Efter att en ledtråd har skickats måste de jagade stanna kvar inom en **10-meters radie** från den plats där ledtråden skickades.

- Geofencen aktiveras omedelbart när ledtråden har skickats
- Väntetiden räknas ner i realtid på de jagades skärm
- Om fence-brott sker i mer än 10 sekunder: omedelbar push-notis till de jagande
- De jagande får **inte** se de jagades exakta position vid fence-brott – bara att brottet skett
- När väntetiden (inkl. ev. strafftid) är över är de jagade fria att springa igen

### 8.2 Strafftidsberäkning – Exempel

```
Standard väntetid i geofence: 5 minuter
Jagade skickade foto 16 sekunder för sent
  → 16 sek - 10 sek gräns = 6 sek för sent
  → 6 × 10 sek = 60 sek strafftid

Total väntetid i geofence: 5 min + 1 min = 6 minuter
```

### 8.3 Fence-brott Strafftid (konfigurerbart)

Om inställningen är aktiv läggs varje sekund utanför geofencen till som strafftid i väntetiden. Strafftiden adderas alltid till geofence-väntetiden, aldrig till nästa ledtråds-timer.

---

## 9. Chattfunktioner

### 9.1 Två Separata Chattrum

| Chattrum | Beskrivning |
|----------|-------------|
| Lagchatt (intern) | Privat chatt inom laget. Syns inte av motståndarlaget. |
| Cross-team chatt | Båda lagen kan kommunicera. Används för att bekräfta fångst, regler m.m. |

### 9.2 Teknisk Implementation

- Realtidschatt via Firestore
- Offline-meddelanden köas och synkas vid återanslutning
- Push-notis vid nya meddelanden (tyst notis under aktiv gameplay)
- Chatthistorik sparas per spelsession och visas i replay-vyn

---

## 10. Spelets Avslut

### 10.1 Manuellt Avslut (Fångst)

1. De jagande och jagade möts och kommer överens om att fångsten är giltig (fysiskt nära, samma rum, ej glas emellan etc.)
2. De jagade trycker på **"Fångade"** i appen
3. De jagande får en popup: *"Bekräfta fångst?"* med Ja/Nej
4. Vid **Ja**: spelet avslutas omedelbart för alla spelare
5. Vid **Nej**: spelet fortsätter och de jagade informeras

### 10.2 Automatiskt Avslut

- Om spelledaren har ställt in en maximal speltid och den uppnås avslutas spelet automatiskt
- Alla spelare får en push-notis: *"Spelet är slut! De jagade klarade sig!"*

---

## 11. Realtids-tracking och Replay

### 11.1 Inspelning Under Spelet

Under hela spelets gång spelar appen in:

- GPS-position för varje spelare var 5:e sekund (reduceras i low battery-läge)
- Tidsstämplar för alla händelser: ledtrådar, fence-brott, chat, strafftid, larmnotiser
- Vilka ledtrådar som skickades när, och GPS-position vid tillfället

### 11.2 Post-game Replay

- Animerad karta med båda lagets rörelser
- Tidsslider som låter spelaren hoppa till vilken punkt som helst i spelet
- Ledtrådar visas på kartan vid rätt tidpunkt med ikoner
- Fence-perioder markeras tydligt
- Statistikkort: total distans, snabbaste rörelse, närmaste avstånd mellan lagen

### 11.3 Statistik per Spelsession

- Speltid (total, per fas)
- Antal ledtrådar skickade
- Total strafftid
- Total distans för båda lagen
- Närmaste avstånd jagande kom till jagade under spelet
- Fence-brott: antal och total tid utanför

---

## 12. Spectator-läge

- Spectators ansluter via samma QR/sessionskod som spelare
- Spelledaren markerar dem som "Spectators" i lobbyn
- Spectators ser en livekarta med båda lagets positioner i realtid
- Spectators ser alla ledtrådar när de skickas
- Spectators kan **inte** skicka meddelanden eller påverka spelet
- Perfekt för livestream – streamern kan visa kartan utan att röja positionen för spelarna

> **För JLC och content creators:** Spectator-läget är designat så att en kameraman eller producer kan följa spelet live på en skärm och koordinera filmning utan att röja spelet för deltagarna.

---

## 13. Spelarhistorik och Stats

Varje spelare har en personlig profilsida med statistik över tid:

- Totalt antal spel (som jagad vs jagande)
- Vinstprocent i respektive roll
- Total distans sprungen i alla spel
- Rekord: längsta spel, mest strafftid, snabbast fångad
- Spelhistorik med datum, resultat och länk till replay

---

## 14. Övriga Funktioner

### 14.1 Low Battery-läge

- Aktiveras automatiskt när batterinivån understiger 20%
- GPS-uppdateringsfrekvens minskas från var 5:e sek till var 30:e sek
- Kamerabilder komprimeras hårdare
- Video begränsas till max 10 sek
- Spelaren notifieras när low battery-läge aktiveras

### 14.2 SOS-knapp

- En alltid synlig SOS-knapp i appens navigationsmeny
- Vid tryck: spelet avslutas omedelbart för alla spelare
- Alla spelare får omedelbart den nödlägestryckandes exakta GPS-koordinater
- Push-notis skickas: *"SOS aktiverat av [namn] – kontakta omedelbart!"*

### 14.3 Offline-kartor

- Spelare kan ladda ner kartdata för ett specifikt område före spelet startar
- Kartorna fungerar utan internet under spelet
- Speldata synkas fortfarande via Firestore när internet finns

---

## 15. Datamodell (Firestore)

```
sessions/
  {sessionId}/
    metadata:         spelledare, status, startid, regler, konfiguration, lag-lista
    players/
      {playerId}:     namn, lag, nuvarande GPS-position, batterinivå
    clues/
      {clueId}:       typ (pin/foto/video), tidsstämpel, GPS, media-URL, strafftid
    tracking/
      {playerId}/
        positions:    array av {lat, lng, timestamp} för replay
    chat/
      team-{lagId}:   meddelandeström med avsändare och tidsstämpel
      cross-team:     cross-team chatt
    events:           fence-brott, SOS, strafftid, spel start/slut

users/
  {userId}:           profildata, statistik, spelarhistorik
```

---

## 16. Rollout-schema

### Fas 1: MVP (Månad 1–3)
*Mål: Ett fungerande spel stabilt nog för ett JLC-test*

- [ ] Lobby med QR-kod/sessionskod och laguppdelning
- [ ] Grundläggande regelkonfiguration (försprång, intervall, ordning)
- [ ] Ledtrådstyper: Pin, Foto, Video med strafftidslogik
- [ ] Automatiska timers via Firebase Cloud Functions
- [ ] Geofence med väntetid och notis vid fence-brott
- [ ] Cross-team chatt och lagchatt
- [ ] Grundläggande realtids-tracking
- [ ] Manuellt avslut (Fångade / Bekräfta)
- [ ] Offline-stöd via Firestore-cache

### Fas 2: Upplevelse & Polish (Månad 4–5)

- [ ] Replay-funktion med animerad karta
- [ ] Statistikkort per spel
- [ ] Spectator-läge
- [ ] SOS-knapp
- [ ] Low battery-läge
- [ ] Notis-finjustering och alarm-ljud
- [ ] Onboarding-flöde för nya användare

### Fas 3: Social & Stats (Månad 6–8)

- [ ] Spelarprofiler med historik och statistik
- [ ] Replay-delning (exportera som video)
- [ ] Offline-kartor
- [ ] Prestationsmärken och achievements
- [ ] App Store / Google Play-lansering (public)

### Fas 4: Monetisering & Expansion (Månad 9+)

- [ ] Hotspot-systemet (se sektion 17)
- [ ] Samarbeten med verksamheter och företag
- [ ] Premium-läge med exklusiva speltyper
- [ ] API för eventarrangörer

---

## 17. Bygg i Framtiden – Hotspot-systemet

> **Status:** Framtida funktion. Ingår inte i MVP. Dokumenteras här som planeringsunderlag.

### 17.1 Konceptbeskrivning

Spelledaren kan välja ett antal "hotspots" – fördefinierade platser på kartan. Om ett lag tar sig dit och fullföljder aktiviteten där får de en perk (fördel i spelet).

### 17.2 Spelmekanik

- Båda lagen kan besöka hotspots
- En hotspot kan bara användas én gång per lag
- Aktiviteten bekräftas med bildbevis i appen
- De jagande ser vilka hotspots som ännu inte besökts – ger dem förhållningspunkter att röra sig mot
- De jagade kan använda hotspots strategiskt för att få perkar som hjälper dem fly

### 17.3 Partnerskap och Monetisering

- Verksamheter (barer, restauranger, aktiviteter) kan betala för att bli en hotspot
- Spelarna måste genomföra en specifik aktivitet: köpa en produkt, delta i en upplevelse etc.
- Bevis sker via bildbevis i appen
- Perfekt för konferenser: spelarna utforskar stadens bästa ställen medan de spelar
- Potentiell revenue-modell: CPC (kostnad per besök/aktivering) eller fast avgift per event

### 17.4 Teknisk Implementation (Framtida)

- Hotspots lagras som geo-punkter i Firestore
- Geofencing vid hotspot-radius (ca 20 meter) triggar aktiveringsflöde
- Bildbevis laddas upp och valideras (ev. manuellt av spelledaren)
- Perkar implementeras som spellogik-modifierare

---

## 18. Monetisering

### 18.1 Freemium-modell (rekommenderad bas)

Den lägsta tröskel för användaren ger störst spridning, vilket är kritiskt för ett spel som kräver att flera personer laddar ner appen. Grundspelet ska alltid vara gratis.

| Nivå | Pris | Innehåll |
|------|------|----------|
| Gratis | 0 kr | Fullt spel upp till 6 spelare, 1 spelsession sparad i historik |
| Manhunt Pro | ~59 kr/mån eller ~399 kr/år | Obegränsade spelare, obegränsad historik, avancerad statistik, replay-export, anpassade regler, inga annonser |

### 18.2 In-app Köp (engångsprodukter)

- **Session-pack:** Köp 10 extra sparade replays för en engångssumma
- **Anpassade teman:** Annat utseende på kartan och UI (mörkt läge, militär-tema, neon etc.)
- **Ljud-pack:** Anpassade larm-ljud och nedräkningsljud

### 18.3 Eventlicenser (B2B)

Den starkaste intäktsströmmen på sikt. Företag och eventarrangörer betalar för ett premium event-läge:

- Obegränsat antal spelare per session
- Spelledaren kan köra flera simultana spel under samma event (t.ex. en konferens)
- Branded event-sida med företagslogga
- CSV-export av spelarstatistik och rörelsemönster
- Dedikerad support

**Prismodell:** Fast pris per event (t.ex. 500–2000 kr beroende på antal spelare) eller månadsabonnemang för återkommande eventbolag.

### 18.4 Hotspot-partnerskap (Fas 4)

När hotspot-systemet är byggt öppnar det för en annonsmodell som är inbäddad i spelet på ett naturligt sätt:

- Verksamheter betalar för att bli en hotspot i ett specifikt geografiskt område
- Modell 1: Fast pris per hotspot per månad
- Modell 2: CPA (cost per activation) – betalar per spelare som fullföljde aktiviteten
- Spelledare/eventarrangörer kan välja sponsored hotspots för att finansiera sitt event

**Varför detta fungerar:** Spelarna besöker platsen frivilligt som en del av spelet. Det är native advertising på riktigt – inte en banner, utan en upplevelse.

### 18.5 Creator-program (JLC och liknande)

Om JLC eller andra creators använder Manhunt i sin content:

- Creators får en personlig referral-länk/kod
- Varje nedladdning via deras kod ger dem en andel av Pro-intäkter från de användarna
- Manhunt får gratis marknadsföring via organisk content

**Potentiellt:** Branded "JLC Edition"-läge med deras logga och ljud-pack, licensierat mot en engångssumma eller revenue share.

### 18.6 Annonsering (lågprioriterat alternativ)

Annonser i ett spel som Manhunt är känsligt – de stör upplevelsen. Om det ändå implementeras:

- Annons visas **endast** i lobby-skärmen medan man väntar på att spelet ska starta
- Aldrig under aktivt spel
- Försvinner i Pro-versionen

---

## 19. Icke-funktionella Krav

| Krav | Detalj |
|------|--------|
| Prestanda | Responsiv även på äldre enheter (iPhone X / Android mid-range). GPS-uppdateringar max 1 sek fördröjning. |
| Batteri | Optimerad bakgrunds-tracking. Low battery-läge vid <20% batteri. |
| Offline-stöd | Fullt funktionellt vid tillfälliga internet-avbrott. Alla händelser synkas vid återanslutning. |
| Skalbarhet | Firebase-stacken hanterar obegränsat antal simultana sessioner. |
| Säkerhet | Sessiondata är privat per session. Firestore Security Rules enforcar åtkomstkontroll. |
| Integritet | GPS-tracking och media lagras enbart under aktiv spelsession. Spelaren kan radera sin data. |
| Tillgänglighet | Stöd för stora textstorlekar och hög kontrast-läge. |
| Plattformar | iOS 15+ och Android 10+. |

---

## 20. Framgångsmått (KPI:er)

| Mått | Definition | Mål |
|------|------------|-----|
| Session-färdigställanderate | % av påbörjade spel som avslutas korrekt | >85% |
| Tid till första spel | Från app-öppning till spelstart | <5 min |
| Crash-rate | Kraschehändelser per 1000 sessioner | <1 |
| Notis-leveransrate | % av timer-notiser som levereras i tid | >98% |
| Offline recovery | % av offline-avbrott utan dataförlust | >99% |
| Replay-engagemang | % av avslutade spel där minst en spelare tittar på replay | >60% |
| Pro-konvertering | % av aktiva gratis-användare som uppgraderar till Pro | >5% |

---

## 21. Öppna Frågor

- Vilken perk-mekanism ska användas för hotspots? *(bestäms senare)*
- Ska spectators se båda lagets position i realtid, eller med fördröjning?
- Ska GPS-positionen visas exakt vid Pin-ledtråd, eller avrundad till närmaste 50 meter?
- Hur länge ska spelsessioner och replay-data sparas på servern?
- Ska appen stödja fler språk vid lansering, eller enbart svenska/engelska?
- Behöver appen GDPR-compliance för GPS-data om den lanseras i Europa?

---

*Manhunt PRD v1.0 — Konfidentiellt*
