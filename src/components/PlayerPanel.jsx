import { useState, useRef } from 'react'
import { playerColors } from '../utils/lifecounter.js'

/**
 * PlayerPanel - pannello segnapunti di un singolo giocatore
 * Props:
 *  - player: oggetto player
 *  - isRotated: bool (180°)
 *  - onLifeChange(delta)
 *  - onOpenDetail()
 */
function PlayerPanel({ player, isRotated, onLifeChange, onOpenDetail }) {
  const color = playerColors.find(c => c.id === player.colorId) || playerColors[0]
  const [recentChange, setRecentChange] = useState(0)
  const changeTimerRef = useRef(null)
  const longPressTimerRef = useRef(null)
  const isLongPressRef = useRef(false)

  const applyChange = (delta) => {
    onLifeChange(delta)
    setRecentChange(prev => prev + delta)
    if (changeTimerRef.current) clearTimeout(changeTimerRef.current)
    changeTimerRef.current = setTimeout(() => setRecentChange(0), 2500)
  }

  const handlePressStart = (delta) => (e) => {
    e.preventDefault()
    isLongPressRef.current = false
    longPressTimerRef.current = setTimeout(() => {
      isLongPressRef.current = true
      applyChange(delta * 5)
      if (navigator.vibrate) navigator.vibrate(30)
    }, 500)
  }

  const handlePressEnd = (delta) => (e) => {
    e.preventDefault()
    if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current)
    if (!isLongPressRef.current) {
      applyChange(delta)
    }
  }

  const handlePressCancel = () => {
    if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current)
  }

  return (
    <div
      className={'player-panel' + (isRotated ? ' is-rotated' : '')}
      style={{
        backgroundColor: color.bg,
        borderColor: color.border,
        color: color.text,
      }}
    >
      {/* Header con nome e bottone dettagli */}
      <div className="player-panel-header">
        <span className="player-name">{player.name}</span>
        <button
          type="button"
          className="player-detail-btn"
          onClick={onOpenDetail}
          style={{ color: color.text, borderColor: color.border }}
          aria-label="Apri dettagli"
        >⋯</button>
      </div>

      {/* Zona tap per cambio vita */}
      <div className="player-life-zone">
        <button
          type="button"
          className="life-tap-zone life-tap-minus"
          onPointerDown={handlePressStart(-1)}
          onPointerUp={handlePressEnd(-1)}
          onPointerLeave={handlePressCancel}
          onPointerCancel={handlePressCancel}
          onContextMenu={(e) => e.preventDefault()}
          aria-label="Diminuisci vita"
        >
          <span className="life-tap-icon">−</span>
        </button>

        <div className="life-display">
          <span className="life-value">{player.life}</span>
          {recentChange !== 0 && (
            <span className={'life-recent ' + (recentChange > 0 ? 'positive' : 'negative')}>
              {recentChange > 0 ? '+' : ''}{recentChange}
            </span>
          )}
        </div>

        <button
          type="button"
          className="life-tap-zone life-tap-plus"
          onPointerDown={handlePressStart(1)}
          onPointerUp={handlePressEnd(1)}
          onPointerLeave={handlePressCancel}
          onPointerCancel={handlePressCancel}
          onContextMenu={(e) => e.preventDefault()}
          aria-label="Aumenta vita"
        >
          <span className="life-tap-icon">+</span>
        </button>
      </div>

      {/* Contatori in fondo */}
      <div className="player-counters">
        {player.poison > 0 && (
          <span className="mini-counter mini-counter-poison" title="Veleno">
            ☠ {player.poison}
          </span>
        )}
        {player.energy > 0 && (
          <span className="mini-counter mini-counter-energy" title="Energia">
            ⚡ {player.energy}
          </span>
        )}
        {player.experience > 0 && (
          <span className="mini-counter mini-counter-exp" title="Esperienza">
            ⭐ {player.experience}
          </span>
        )}
        {player.ringTemptation > 0 && (
          <span className="mini-counter mini-counter-ring" title="L'Anello tenta">
            ⚪ {player.ringTemptation}
          </span>
        )}
        {player.monarch && (
          <span className="mini-counter mini-counter-monarch" title="Monarca">👑</span>
        )}
        {player.initiative && (
          <span className="mini-counter mini-counter-initiative" title="Iniziativa">⚡I</span>
        )}
        {player.cityBlessed && (
          <span className="mini-counter mini-counter-city" title="Città dei Benedetti">✦</span>
        )}
      </div>
    </div>
  )
}

export default PlayerPanel
