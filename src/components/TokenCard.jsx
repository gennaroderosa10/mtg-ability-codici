import { getTokenFrame, getTokenTextColor, mtgColors } from '../utils/storage.js'

/**
 * TokenCard - simula una mini-carta MTG
 *
 * Props:
 * - token: { name, type, colors[], power, toughness, abilities[], tapped, plusCounters, minusCounters }
 * - onTap: callback per tap singolo
 * - onLongPress: callback per long press (dettagli)
 * - showInteractions: bool
 */
function TokenCard({ token, onTap, onLongPress, showInteractions = true, isPreset = false }) {
  const frame = getTokenFrame(token.colors)
  const textColor = getTokenTextColor(token.colors)

  // Calcolo P/T finale considerando i segnalini
  const finalPower = (token.power || 0) + (token.plusCounters || 0) - (token.minusCounters || 0)
  const finalToughness = (token.toughness || 0) + (token.plusCounters || 0) - (token.minusCounters || 0)

  // Long press detection
  let pressTimer = null
  let didLongPress = false

  const handlePressStart = () => {
    didLongPress = false
    if (!onLongPress) return
    pressTimer = setTimeout(() => {
      didLongPress = true
      onLongPress(token)
      // Vibrazione feedback se supportato
      if (navigator.vibrate) navigator.vibrate(30)
    }, 500)
  }

  const handlePressEnd = (e) => {
    if (pressTimer) clearTimeout(pressTimer)
    if (didLongPress) {
      e.preventDefault()
      return
    }
    if (onTap) onTap(token)
  }

  const handlePressCancel = () => {
    if (pressTimer) clearTimeout(pressTimer)
  }

  return (
    <div
      className={
        'token-card' +
        (token.tapped ? ' is-tapped' : '') +
        (isPreset ? ' is-preset' : '')
      }
      style={{ background: frame, color: textColor }}
      onPointerDown={showInteractions ? handlePressStart : undefined}
      onPointerUp={showInteractions ? handlePressEnd : undefined}
      onPointerLeave={showInteractions ? handlePressCancel : undefined}
      onPointerCancel={showInteractions ? handlePressCancel : undefined}
      onContextMenu={showInteractions ? (e) => e.preventDefault() : undefined}
    >
      <div className="token-card-frame">
        {/* Riga superiore: nome + simboli colore */}
        <div className="token-card-top">
          <span className="token-card-name">{token.name}</span>
          <div className="token-card-colors">
            {(token.colors || []).map(c => (
              <span
                key={c}
                className="color-pip"
                title={mtgColors[c]?.label}
                style={{
                  background: mtgColors[c]?.hex,
                  color: mtgColors[c]?.textColor,
                }}
              >
                {c}
              </span>
            ))}
          </div>
        </div>

        {/* Tipo */}
        <div className="token-card-type">
          Pedina Creatura{token.type ? ` — ${token.type}` : ''}
        </div>

        {/* Abilità */}
        <div className="token-card-abilities">
          {(token.abilities || []).length === 0 ? (
            <span className="token-card-noability">—</span>
          ) : (
            token.abilities.map((a, i) => (
              <span key={i} className="token-card-ability">
                {a}
                {i < token.abilities.length - 1 ? ', ' : ''}
              </span>
            ))
          )}
        </div>

        {/* Segnalini visibili */}
        {(token.plusCounters > 0 || token.minusCounters > 0) && (
          <div className="token-card-counters">
            {token.plusCounters > 0 && (
              <span className="counter counter-plus">+{token.plusCounters}</span>
            )}
            {token.minusCounters > 0 && (
              <span className="counter counter-minus">−{token.minusCounters}</span>
            )}
          </div>
        )}

        {/* P/T in basso a destra */}
        <div className="token-card-pt">
          <span className="pt-value">
            {finalPower}/{finalToughness}
          </span>
        </div>

        {/* Indicatore tappato */}
        {token.tapped && <div className="token-tapped-indicator">⟲</div>}
      </div>
    </div>
  )
}

export default TokenCard
