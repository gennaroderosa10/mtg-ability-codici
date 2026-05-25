# The Emeritus Glossary

App React + Vite con:
- **309 abilità di Magic: The Gathering** in 5 categorie ufficiali
- **Sezione Token**: Token Comuni, Crea Token, Preset, Campo di Battaglia
- **Segnapunti completo**: 2-8 giocatori, vita/veleno/energia/Cmd damage/esperienza, dadi, tracker
- **Funziona offline** come PWA
- **Bottom Nav** su mobile/tablet con scorciatoie

## Struttura

- `dist/` — cartella pronta per il deploy
- `src/` — sorgente React
- `public/` — asset statici (icone PWA)
- `netlify.toml` — config Netlify

## Sviluppo

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # genera dist/
```

## Funzionalità Segnapunti

- Da 2 a 8 giocatori
- Preset vita: 20 / 30 / 40 / Personalizzato
- Layout dinamico (in partite a 2, il primo giocatore è capovolto)
- Tap sinistra = -1, tap destra = +1
- Long press = ±5
- Cronologia cambi vita
- Contatori: Veleno, Energia, Esperienza, Commander damage (per giocatore)
- Tracker: l'Anello tenta, Monarca, Iniziativa, Città dei Benedetti, Giorno/Notte
- Segnalini personalizzati liberi
- Colori pannello selezionabili
- Dadi d4/d6/d8/d10/d12/d20/d100 + lancio moneta
- Persistenza completa: chiudi e riapri, ti chiede se riprendere la partita

## Deploy

Il sito si aggiorna automaticamente via Git push se collegato a Netlify.
