# Sito dell'app Pizza Perfetta a Casa

Copia dei file pubblicati su Netlify (progetto `pizza-perfetta-a-casa`, sito
https://pizza-perfetta-a-casa.netlify.app). L'app Android `app.netlify.pizza_perfetta_a_casa.twa`
(creata con PWABuilder) apre questo sito a schermo pieno.

- `index.html`: tutta l'app (login con Netlify Identity, dati con Firebase).
- `manifest.json`, `service-worker.js`, `icon-*.png`: dati dell'app per PWABuilder e uso offline.
- `assetlinks.json` + `_redirects`: certificato Digital Asset Links servito su
  `/.well-known/assetlinks.json`. Netlify Drop scarta le cartelle che iniziano con il punto,
  per questo il file sta nella radice e `_redirects` lo rende raggiungibile all'indirizzo giusto.

Per pubblicare: zip di questi tre file (senza LEGGIMI.md), trascinato nella pagina Deploys di Netlify.
