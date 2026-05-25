// Gestione persistenza localStorage per Token Generator

const KEYS = {
  battlefield: 'mtg-battlefield',
  presets: 'mtg-presets',
}

export function loadBattlefield() {
  try {
    const raw = localStorage.getItem(KEYS.battlefield)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveBattlefield(tokens) {
  try {
    localStorage.setItem(KEYS.battlefield, JSON.stringify(tokens))
  } catch (e) {
    console.error('Save battlefield failed:', e)
  }
}

export function loadPresets() {
  try {
    const raw = localStorage.getItem(KEYS.presets)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function savePresets(presets) {
  try {
    localStorage.setItem(KEYS.presets, JSON.stringify(presets))
  } catch (e) {
    console.error('Save presets failed:', e)
  }
}

export function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}

// Colori MTG con simbolo e codice colore per gradient
export const mtgColors = {
  W: { label: 'Bianco', symbol: 'W', hex: '#f8e7b9', textColor: '#1a1a1a' },
  U: { label: 'Blu', symbol: 'U', hex: '#aae0fa', textColor: '#0a3a5a' },
  B: { label: 'Nero', symbol: 'B', hex: '#3a3633', textColor: '#e8e0d0' },
  R: { label: 'Rosso', symbol: 'R', hex: '#f9aa8f', textColor: '#5a1a0a' },
  G: { label: 'Verde', symbol: 'G', hex: '#9bd3ae', textColor: '#0a3a1a' },
  C: { label: 'Incolore', symbol: 'C', hex: '#cac5c0', textColor: '#3a3a3a' },
}

// Restituisce gradient o colore solido in base ai colori del token
export function getTokenFrame(colors) {
  if (!colors || colors.length === 0) return mtgColors.C.hex
  if (colors.length === 1) return mtgColors[colors[0]].hex
  // Multicolore (2+ colori): cornice oro
  if (colors.length >= 2) {
    const stops = colors.map((c, i) => {
      const pct = (i / (colors.length - 1)) * 100
      return `${mtgColors[c].hex} ${pct}%`
    }).join(', ')
    return `linear-gradient(135deg, ${stops})`
  }
}

// Calcola colore testo leggibile sulla cornice
export function getTokenTextColor(colors) {
  if (!colors || colors.length === 0) return mtgColors.C.textColor
  if (colors.length === 1) return mtgColors[colors[0]].textColor
  return '#2a1a0a' // multicolore: sempre scuro
}
