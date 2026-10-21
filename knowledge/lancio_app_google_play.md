# Lancio dell'app su Google Play

Stato e decisioni sul lancio di **Pizza Perfetta a Casa** su Google Play, dall'11 al 21 ottobre 2026.
Riassunto della sessione di lavoro con Claude, da usare come contesto per Horacle.

## Dati dell'app

- **Nome:** Pizza Perfetta a Casa
- **Pacchetto:** `app.netlify.pizza_perfetta_a_casa.twa` (app TWA costruita sul sito Netlify)
- **Account sviluppatore:** account personale Google Play Console, intestato a Davide Paba
- **Sezioni dell'app:** Corso pizza, Ricette, Calcolatore (con la biga), Video (Premium), Lezioni, Preferiti, Community
- **Grafiche dello Store:** 4 immagini 9:16 da 1080×1920 su sfondo arancione: «Pizza da pizzeria nel forno di casa», «Dosi al grammo», «Il corso del pizzaiolo», «Ricette passo passo» (`play_ricette.jpg` e le altre `play_*.jpg`, salvate sul computer di Davide)

## Cronologia

| Data | Evento |
|---|---|
| 2 ottobre | Test chiuso avviato anche tramite Testers Community (programma da 16 giorni) |
| 11 ottobre | Google Play: 12 tester per 9 giorni di fila; 8 installazioni effettive |
| 14 ottobre | Google Play: 12 tester per 12 giorni. Testers Community: 15 tester su 15, giorno 12 di 16, 2 report pronti |
| 16 ottobre circa | Raggiunti i 14 giorni richiesti da Google |
| 18 ottobre | Inviata la richiesta di accesso alla produzione: «1 invio in revisione», «Modifiche in fase di revisione» |
| 21 ottobre | Ancora in revisione. Ultimi 28 giorni: 10 acquisizioni, 7 prime aperture, 8 dispositivi attivi mensili (-20%) |

## Prossimi passi

1. **Attendere la risposta di Google.** Di solito arriva entro circa 7 giorni, quindi intorno al 25 ottobre. Controllare anche lo spam.
2. **Durante la revisione non modificare nulla** in Play Console (release, scheda dello Store), perché la revisione potrebbe ripartire.
3. **Se approvata:** pubblicare la release in Produzione (seconda revisione, di solito da poche ore a pochi giorni). Poi mettere il link di Google Play al primo posto nella bio di entrambi i profili Instagram e pubblicare il post o Reel di lancio.
4. **Se rifiutata:** rileggere l'email di Google e riscrivere le risposte sul test chiuso con esempi concreti, usando i 2 report di Testers Community (feedback ricevuti e modifiche fatte).

## Instagram

### Profili

| | @pizza_perfetta_a_casa | @pizza_perfetta_a_casa2 |
|---|---|---|
| Lingua | Italiano | Tedesco (Leipzig) |
| Follower (14 ottobre) | 770 | 277 |
| Visualizzazioni ultimi 30 giorni | 53.602 | 12.899 |
| Metricool | Brand `pizza_perfetta_a_casa` (id 6891914) | Brand `pizza_perfetta_a_casa2` (id 7285585) |
| vidIQ | Collegato, pubblicazione Reel attiva | Non collegato |
| Storie in evidenza sull'app | Sì («ricette in app», «calcolatore…») | Manca: aggiungere un'evidenza «App» |

### Contenuti preparati

**Storia teaser** (da pubblicare durante la revisione):
- 🇮🇹 «CI SIAMO QUASI! La mia app è in revisione. Presto su Google Play»
- 🇩🇪 «FAST GESCHAFFT! Meine App wird geprüft. Bald im Play Store»
- Video di circa 6,5 secondi in 9:16: primo piano della margherita (clip Google Flow, rallentata e ritagliata), poi dissolvenza sullo screenshot vero della home dell'app, con l'avatar rotondo di Davide in basso a sinistra.
- Va segnalata con l'etichetta «Contenuto IA» di Instagram.
- Stato al 21 ottobre: video consegnati a Davide, **non ancora pubblicati**. Per farli programmare da Claude servono i file su Google Drive con link pubblico.

**Post di lancio** (dopo l'approvazione):
- 🇮🇹 «Ci siamo! «Pizza Perfetta a Casa» è su Google Play 🍕 Impasti, calcolatore e ricette da pizzaiolo, gratis. Link in bio 👉»
- 🇩🇪 «Endlich da! Meine App «Pizza Perfetta a Casa» ist im Google Play Store 🍕 Teigrechner & Rezepte vom Pizzaiolo – kostenlos. Link in Bio 👉»
- Domanda ancora aperta: l'app ha una versione in tedesco? Se no, il post tedesco deve dirlo chiaramente.

### Attenzione al piano dei 30 giorni

Il piano `knowledge/piano_30_giorni.md` vieta reel sull'app fino al 28 ottobre. Le storie teaser non sono reel, quindi rispettano la regola. Il **Reel di lancio** però va pubblicato dopo il 28 ottobre, oppure va deciso in modo esplicito di fare un'eccezione.

## Video con l'IA: cosa abbiamo imparato

- **Google Flow funziona in Germania**, ma la funzione **Avatar** (video con il proprio volto e la propria voce) non è disponibile nello Spazio Economico Europeo. Non è un problema dell'account, e aggirare il blocco con una VPN viola i termini di Google. Per l'avatar si continua a usare **HeyGen**.
- **Primo video Flow** (pizza nel forno, 16:9), voto 7/10: luce bella e appetitosa, ma statico, orizzontale, con una mano che compare e sparisce e una maculatura del cornicione troppo regolare, «a pois».
- **Secondo video Flow** (pizzaiolo e forno, 9:16), voto 6/10: formato giusto e chiusura in primo piano molto bella, ma ci sono la **carta forno sotto la pizza** (errore evidente per un pubblico di esperti), una pizza già cotta che rientra in forno, un telefono con un'app generica e due pale diverse.
- **Regola:** i contenuti con il volto di Davide rendono più dei video generati. I video Flow vanno usati solo come sfondo o come brevi inserti, sempre etichettati come IA.
- **Prompt consigliato per Flow:** «Vertical 9:16. A pizzaiolo slides a wooden peel into a wood-fired oven and pulls out a Neapolitan margherita, irregular leopard-spotted charred crust, bubbling mozzarella, fresh basil, sparks and flames, slow motion, warm light, crackling fire sound»

## Limiti tecnici emersi

- Metricool e vidIQ pubblicano solo media raggiungibili da un URL pubblico. Il modo più semplice è caricare il file su Google Drive con «Chiunque abbia il link».
- Le storie programmate tramite Metricool non mostrano la didascalia, quindi il testo va scritto dentro il video. Sticker «Notifica» e link si aggiungono solo dall'app di Instagram.
