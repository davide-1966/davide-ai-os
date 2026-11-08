# Funzioni Netlify dell'app Pizza Perfetta a Casa

Codice server del sito `pizza-perfetta-a-casa` (pubblicato l'8/11/2026). Il sito statico è in `../app_sito`.

## Funzioni (`netlify/functions/`)
- `play-verify.mts` – riceve dall'app Android il token di un acquisto Google Play, lo verifica con Google
  (abbonamento `premium_mensile`), conferma l'acquisto e dà il ruolo `premium` all'account Netlify Identity.
- `play-sync.mts` – ogni giorno alle 04:00 UTC ricontrolla gli abbonamenti Google Play: toglie il Premium a chi
  è scaduto, lo rimette a chi ha rinnovato. Tocca solo il Premium arrivato da Google Play.
- `admin-api.mts` – API del pannello `/admin`: utenti (lista, invito, elimina, Premium sì/no) e community
  Firestore (post, commenti, elimina, blocca). Solo per gli amministratori (email in `ADMIN_EMAILS`,
  di base davidepaba66@gmail.com, oppure ruolo `admin`).

`netlify/lib/` contiene gli aiuti comuni: `play.mts` (token Google, API Google Play) e `firestore.mts` (Firestore via REST).

## Variabili d'ambiente su Netlify (mai nel repository)
- `GOOGLE_SA_EMAIL` – email dell'account di servizio `play-verifica@pizza-perfetta-community.iam.gserviceaccount.com`
- `GOOGLE_SA_PRIVATE_KEY` – chiave dell'account di servizio (anche il file JSON intero va bene). Segreta.
- `ADMIN_EMAILS` – facoltativa, email amministratori separate da virgola.

L'account di servizio ha in Play Console i permessi "Visualizzazione dati finanziari" e "Gestione ordini e
abbonamenti", e in Google Cloud il ruolo "Cloud Datastore User" (per la community).

## Pubblicare
Le funzioni NON passano dal trascinamento dello zip su Netlify (Netlify Drop pubblica solo file statici:
caricando solo `app_sito` le funzioni verrebbero tolte). Pubblicare da questa cartella con la Netlify CLI
o con lo strumento Netlify di Claude: `netlify.toml` usa `../app_sito` come sito e `netlify/functions` come funzioni.
