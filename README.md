# MTG Ability

App React + Vite con:
- **309 abilità di Magic: The Gathering** in 5 categorie ufficiali
- **Sezione Token** con 4 sotto-pagine: Token Comuni, Crea Token, Preset, Campo di Battaglia
- **Funziona offline** come PWA

## Struttura

- `dist/` — **cartella pronta per il deploy**, già buildata
- `src/` — sorgente React
- `public/` — asset statici (icone PWA)
- `netlify.toml` — config Netlify (redirect SPA)

## Deploy rapido su Netlify

1. Apri [app.netlify.com/drop](https://app.netlify.com/drop)
2. Trascina la cartella **`dist/`** sulla pagina
3. Pronto!

In alternativa: dashboard del tuo sito → **Deploys → trascina `dist/`**

## Modificare il progetto

```bash
npm install
npm run dev        # sviluppo locale su http://localhost:5173
npm run build      # genera dist/ aggiornato
```

## Sezione Token

- **Token Comuni**: Tesoro, Cibo, Indizio, Mappa, Sangue, Oro, Pietra del Potere, Incubatore, Ruolo, ecc.
- **Crea Token**: form completo con nome, tipo, colori, P/T, abilità (dalle 309 in database)
- **Preset**: token salvati per riutilizzo rapido
- **Campo di Battaglia**:
  - **Tap singolo** → TAP/STAP (ruota di 90°)
  - **Long press** (mezzo secondo) → modal con dettagli e gestione segnalini +1/+1, -1/-1
  - Raggruppamento automatico di token identici
  - Persistenza via localStorage (sopravvive a chiusura app)
