# MTG Ability

App React + Vite con tutte le abilità di Magic: The Gathering (309 voci, 5 categorie ufficiali). Funziona offline come PWA.

## Struttura

- `dist/` — **cartella pronta per il deploy**, già buildata
- `src/` — sorgente React
- `public/` — asset statici (icone PWA)
- `netlify.toml` — config per Netlify (redirect SPA)

## Deploy rapido su Netlify (più semplice)

1. Apri [app.netlify.com/drop](https://app.netlify.com/drop)
2. Trascina la cartella **`dist/`** sulla pagina
3. Fatto! Ti dà l'URL pubblico

In alternativa, dal pannello del sito esistente: **Deploys → trascina `dist/`**.

## Modificare e rebuildare (richiede Node.js)

```bash
npm install
npm run dev        # sviluppo locale su http://localhost:5173
npm run build      # genera dist/ aggiornato
```

Per aggiungere o correggere abilità: modifica i file in `src/data/`.

## Note PWA

- Il service worker viene generato automaticamente da `vite-plugin-pwa`
- Funziona offline al 100% dopo il primo caricamento
- Per installare: apri l'URL su Chrome → menu → "Installa app"

## Categorie

- **Evergreen**: abilità presenti in (quasi) ogni set
- **Deciduous**: usate frequentemente ma non in ogni set
- **Keyword Abilities**: abilità chiave di set/blocchi specifici
- **Keyword Actions**: azioni di gioco
- **Ability Words**: parole-abilità in corsivo che raggruppano effetti
