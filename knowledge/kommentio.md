# Kommentio – ricerca 9/11/2026 (Horacle cloud, da fonti web; developers.facebook.com non raggiungibile dal cloud)

Obiettivo (Davide 9/11): C = risparmiare ManyChat + prodotto da vendere con Pasquale.

## Cosa serve (da verificare sul pannello Meta con Horacle locale)
- API: "Instagram API with Instagram Login". Permessi: instagram_business_manage_comments (commenti), instagram_business_manage_messages (DM).
- **Uso personale (solo i 2 account di Davide)**: basta lo Standard Access, senza revisione Meta (accesso standard per account che si possiedono/gestiscono).
  DA VERIFICARE: secondo una guida di terzi i webhook dei commenti funzionano solo con app in modalità Live e accesso avanzato per il permesso commenti.
  Se è vero, anche l'uso personale richiede revisione + verifica aziendale.
- **Prodotto da vendere (account di altri)**: serve Advanced Access → revisione dell'app (App Review) + **verifica dell'azienda** (senza verifica niente Advanced Access) + almeno 1 chiamata API riuscita prima di chiederlo + informativa privacy e istruzioni di cancellazione dati.
- Tempi stimati da guide di terzi (non garantiti da Meta): revisione 2–6 settimane, verifica aziendale 1–2 settimane.

## Prossimo passo
1. Horacle locale (Chrome): creare app "Kommentio" (caso d'uso messaggi e contenuti Instagram), modalità sviluppo, e leggere nel pannello cosa permette lo Standard Access per webhook commenti + DM.
2. Decidere con Pasquale chi intesta la verifica aziendale (Davide o società).
3. ManyChat resta acceso finché Kommentio non è provato un mese in parallelo.

Fonti: developers.facebook.com/documentation/instagram-platform/app-review ; .../instagram-api-with-instagram-login/business-login ; tryadeli.com (permessi e commenti) ; blotato.com (prezzi/DM).
