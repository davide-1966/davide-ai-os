# Idea futura: programma anti-spreco per pizzerie e cucine (Davide, 20/10)

Stato: in attesa — dopo il lancio di Pizza Perfetta a Casa su Google Play (Pareto).

- Prodotto da vendere a titolari di pizzerie e ristoranti.
- Nome: KüchenKompass (approvato da Davide il 20/10; da verificare marchio DPMA prima di investire). Controllo di TUTTO ciò che si usa (bestand, einkauf, verbrauch, abfall), cucina e pizzeria.
- Nucleo: previsione di quante palline/porzioni preparare (storico serate, giorno, meteo, eventi) + lista di preparazione + registro di cosa si butta.
- Concorrenti noti (grandi, costosi, per mense/hotel): Winnow, Leanpath, Orbisk; gestione magazzino: Apicbase, MarketMan.
- Vantaggio di Davide: 20 anni di esperienza, sa quanto impasto serve; contatti con pizzerie a Lipsia.
- Rischi: vendere ad aziende richiede tempo; i titolari non amano inserire dati ogni giorno.
- Primo passo (gratis): parlare con 5–10 titolari: quanto buttate a settimana? pagereste 20–30 €/mese?

## Struttura proposta (20/10)
1. MVP = web app (come Pizza Perfetta a Casa, Netlify), 3 funzioni: chiusura serata in 30 s (vendute/avanzate/buttate) → previsione di domani (media stesso giorno ultime settimane ± meteo) → lista di preparazione stampabile/da telefono. Report settimanale "hai risparmiato X €".
2. Prezzo test: 1 mese gratis, poi 19–29 €/mese per locale.
3. Contatto: in Germania le email pubblicitarie non richieste, anche ad aziende, sono di norma vietate (UWG §7) → prima contatto personale/telefono/visita, poi email solo a chi dice sì.
4. Pilota con 3 pizzerie di Lipsia per 4 settimane, misurando lo spreco prima/dopo.

## Cuore del prodotto: confronto teorico/reale (Davide, 22/10)
Davide vuole che il programma calcoli le perdite incrociando acquisti, vendite e magazzino:
- Ricette standard (distinta base): quanti grammi di ogni ingrediente per piatto (es. margherita = 100 g mozzarella).
- Acquisti: dalle bolle/fatture dei fornitori (quantità e prezzo).
- Vendite: piatti venduti (a mano o export dalla cassa/Kassensystem).
- Scarti registrati con motivo.
- Inventario: conteggio reale periodico (es. ogni lunedì).
Calcolo: rimanenza teorica = inizio + acquisti − (venduto × ricetta) − scarti registrati. Perdita non spiegata = teorica − reale. % perdita = perdita / consumo teorico. Valore in € al mese (prezzo d'acquisto). 
Obiettivo: mostrare al titolare quanti € perde al mese → giustifica il costo dell'app (ROI).
