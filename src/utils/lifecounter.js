// Storage e configurazione Segnapunti
const KEY = 'mtg-game-state'
const DICE_HISTORY_KEY = 'mtg-dice-history'

export function loadGame() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

export function saveGame(state) {
  try {
    if (state) localStorage.setItem(KEY, JSON.stringify(state))
    else localStorage.removeItem(KEY)
  } catch (e) { console.error('saveGame:', e) }
}

export function loadDiceHistory() {
  try {
    const raw = localStorage.getItem(DICE_HISTORY_KEY)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

export function saveDiceHistory(history) {
  try {
    localStorage.setItem(DICE_HISTORY_KEY, JSON.stringify(history.slice(-30)))
  } catch {}
}

// Colori giocatore (richiamano i colori MTG)
export const playerColors = [
  { id: 'red',    name: 'Rosso',    bg: '#7a2820', border: '#c84a3a', text: '#fce5d8' },
  { id: 'blue',   name: 'Blu',      bg: '#1a3a5a', border: '#4a8dc8', text: '#d5e8f7' },
  { id: 'green',  name: 'Verde',    bg: '#1f4a2a', border: '#5aa86e', text: '#dceadc' },
  { id: 'white',  name: 'Bianco',   bg: '#4a4030', border: '#d4c490', text: '#f5ecd6' },
  { id: 'black',  name: 'Nero',     bg: '#2a2620', border: '#7a6a5a', text: '#cabfa8' },
  { id: 'purple', name: 'Viola',    bg: '#3a285a', border: '#9b7bc7', text: '#e5d8f0' },
  { id: 'orange', name: 'Arancio',  bg: '#7a4a20', border: '#e8a865', text: '#fae6d0' },
  { id: 'teal',   name: 'Verde acqua', bg: '#1f4a4a', border: '#5aaaaa', text: '#dcecec' },
]

export function getPlayerColor(idx) {
  return playerColors[idx % playerColors.length]
}

// Crea un nuovo giocatore con valori di default
export function createPlayer(idx, startingLife = 20) {
  const color = getPlayerColor(idx)
  return {
    id: `p${idx}_${Date.now()}`,
    name: `Giocatore ${idx + 1}`,
    life: startingLife,
    colorId: color.id,
    poison: 0,
    energy: 0,
    experience: 0,
    cmdDamage: {},     // { playerId: number }
    customCounters: [], // [{ id, label, value }]
    ringTemptation: 0,  // 0-4 (l'Anello tenta)
    monarch: false,
    initiative: false,
    cityBlessed: false,
    dayNight: null,     // null | 'day' | 'night'
    history: [],        // [{ ts, change, newValue }]
  }
}

// Crea nuovo stato partita
export function createNewGame(numPlayers, startingLife) {
  const players = []
  for (let i = 0; i < numPlayers; i++) {
    players.push(createPlayer(i, startingLife))
  }
  return {
    startedAt: Date.now(),
    startingLife,
    numPlayers,
    players,
    activePlayerIdx: 0,
    turn: 1,
  }
}

export function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}

// Layout calculator per N giocatori
export function getLayout(n) {
  // ritorna { rows, cols, rotateTop } per la griglia
  switch (n) {
    case 2: return { rows: 2, cols: 1, rotateTop: true }
    case 3: return { rows: 3, cols: 1, rotateTop: false }
    case 4: return { rows: 2, cols: 2, rotateTop: true }
    case 5: return { rows: 3, cols: 2, rotateTop: false }
    case 6: return { rows: 3, cols: 2, rotateTop: false }
    case 7: return { rows: 4, cols: 2, rotateTop: false }
    case 8: return { rows: 4, cols: 2, rotateTop: false }
    default: return { rows: n, cols: 1, rotateTop: false }
  }
}
