import { abilities } from './abilities-part1.js'
import { abilitiesPart2 } from './abilities-part2.js'

// Unisce e rimuove duplicati basandosi sul nome inglese (mantenendo la prima occorrenza
// nelle parti con priorità: evergreen > deciduous > altri)
const seen = new Map()
const combined = [...abilities, ...abilitiesPart2]

for (const ab of combined) {
  const key = ab.en.toLowerCase().replace(/\s*\[.*?\]\s*/g, '').replace(/\s*\(.*?\)\s*/g, '').replace(/\s+n\s*$/i, '').trim()
  if (!seen.has(key)) {
    seen.set(key, ab)
  }
}

export const allAbilities = Array.from(seen.values()).sort((a, b) => a.en.localeCompare(b.en))

export const categories = {
  all: { label: 'Tutte', color: '#d4a574', desc: 'Tutte le abilità del database' },
  evergreen: { label: 'Evergreen', color: '#7ab07a', desc: 'Abilità presenti in (quasi) ogni set di Magic' },
  deciduous: { label: 'Deciduous', color: '#d4a574', desc: 'Abilità usate frequentemente ma non in ogni set' },
  'keyword-ability': { label: 'Keyword Abilities', color: '#6a9bd4', desc: 'Abilità chiave specifiche di set o blocchi' },
  'keyword-action': { label: 'Keyword Actions', color: '#c84a3a', desc: 'Azioni di gioco che il giocatore esegue' },
  'ability-word': { label: 'Ability Words', color: '#9b7bc7', desc: 'Parole-abilità in corsivo che raggruppano effetti simili' },
}

export const stats = {
  total: allAbilities.length,
  byCat: Object.keys(categories).reduce((acc, key) => {
    if (key === 'all') return acc
    acc[key] = allAbilities.filter(a => a.cat === key).length
    return acc
  }, {}),
}
