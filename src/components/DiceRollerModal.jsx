import { useState } from 'react'
import { loadDiceHistory, saveDiceHistory } from '../utils/lifecounter.js'

const DICE = [4, 6, 8, 10, 12, 20, 100]

function DiceRollerModal({ onClose }) {
  const [result, setResult] = useState(null)
  const [history, setHistory] = useState(loadDiceHistory())
  const [rolling, setRolling] = useState(false)

  const roll = (sides) => {
    setRolling(true)
    setResult(null)
    setTimeout(() => {
      const value = Math.floor(Math.random() * sides) + 1
      const entry = { kind: 'dice', sides, value, ts: Date.now() }
      setResult(entry)
      const newHistory = [...history, entry]
      setHistory(newHistory)
      saveDiceHistory(newHistory)
      setRolling(false)
      if (navigator.vibrate) navigator.vibrate(20)
    }, 600)
  }

  const flipCoin = () => {
    setRolling(true)
    setResult(null)
    setTimeout(() => {
      const isHeads = Math.random() < 0.5
      const entry = { kind: 'coin', value: isHeads ? 'Testa' : 'Croce', ts: Date.now() }
      setResult(entry)
      const newHistory = [...history, entry]
      setHistory(newHistory)
      saveDiceHistory(newHistory)
      setRolling(false)
      if (navigator.vibrate) navigator.vibrate(20)
    }, 600)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-large" onClick={e => e.stopPropagation()}>
        <button type="button" className="modal-close" onClick={onClose}>✕</button>
        <h3 className="modal-title">🎲 Dadi e moneta</h3>

        {/* Risultato grande */}
        <div className={'dice-result' + (rolling ? ' rolling' : '')}>
          {rolling ? (
            <span className="dice-result-rolling">...</span>
          ) : result ? (
            <>
              <div className="dice-result-value">
                {result.kind === 'coin' ? (result.value === 'Testa' ? '👑' : '⚔') : result.value}
              </div>
              <div className="dice-result-label">
                {result.kind === 'coin' ? result.value : `d${result.sides}`}
              </div>
            </>
          ) : (
            <span className="dice-result-empty">Premi un dado</span>
          )}
        </div>

        {/* Bottoni dadi */}
        <div className="dice-grid">
          {DICE.map(s => (
            <button
              key={s}
              type="button"
              className="dice-btn"
              onClick={() => roll(s)}
              disabled={rolling}
            >
              <span className="dice-btn-shape">◆</span>
              <span className="dice-btn-label">d{s}</span>
            </button>
          ))}
          <button
            type="button"
            className="dice-btn dice-btn-coin"
            onClick={flipCoin}
            disabled={rolling}
          >
            <span className="dice-btn-shape">●</span>
            <span className="dice-btn-label">Moneta</span>
          </button>
        </div>

        {/* Cronologia */}
        {history.length > 0 && (
          <>
            <h4 className="modal-section-title">Cronologia recente</h4>
            <ul className="dice-history">
              {[...history].reverse().slice(0, 10).map((h, i) => (
                <li key={i} className="dice-history-item">
                  <span className="dice-history-source">
                    {h.kind === 'coin' ? '🪙 moneta' : `d${h.sides}`}
                  </span>
                  <span className="dice-history-value">{h.value}</span>
                </li>
              ))}
            </ul>
            <button
              type="button"
              className="btn-ghost-small"
              onClick={() => { saveDiceHistory([]); setHistory([]) }}
            >Pulisci cronologia</button>
          </>
        )}
      </div>
    </div>
  )
}

export default DiceRollerModal
