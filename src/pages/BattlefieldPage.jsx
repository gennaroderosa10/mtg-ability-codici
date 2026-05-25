import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import TokenCard from '../components/TokenCard.jsx'
import { loadBattlefield, saveBattlefield, genId } from '../utils/storage.js'

function BattlefieldPage() {
  const navigate = useNavigate()
  const [tokens, setTokens] = useState([])
  const [detailToken, setDetailToken] = useState(null)
  const [confirmClear, setConfirmClear] = useState(false)

  useEffect(() => {
    setTokens(loadBattlefield())
  }, [])

  const update = (newTokens) => {
    setTokens(newTokens)
    saveBattlefield(newTokens)
  }

  // Tap singolo: TAP/STAP
  const handleTap = (token) => {
    update(tokens.map(t => t.id === token.id ? { ...t, tapped: !t.tapped } : t))
  }

  // Long press: apre dettagli
  const handleLongPress = (token) => {
    setDetailToken(token)
  }

  const addPlusCounter = (id) => {
    update(tokens.map(t => t.id === id ? { ...t, plusCounters: (t.plusCounters || 0) + 1 } : t))
    setDetailToken(d => d && d.id === id ? { ...d, plusCounters: (d.plusCounters || 0) + 1 } : d)
  }

  const removePlusCounter = (id) => {
    update(tokens.map(t => t.id === id ? { ...t, plusCounters: Math.max(0, (t.plusCounters || 0) - 1) } : t))
    setDetailToken(d => d && d.id === id ? { ...d, plusCounters: Math.max(0, (d.plusCounters || 0) - 1) } : d)
  }

  const addMinusCounter = (id) => {
    update(tokens.map(t => t.id === id ? { ...t, minusCounters: (t.minusCounters || 0) + 1 } : t))
    setDetailToken(d => d && d.id === id ? { ...d, minusCounters: (d.minusCounters || 0) + 1 } : d)
  }

  const removeMinusCounter = (id) => {
    update(tokens.map(t => t.id === id ? { ...t, minusCounters: Math.max(0, (t.minusCounters || 0) - 1) } : t))
    setDetailToken(d => d && d.id === id ? { ...d, minusCounters: Math.max(0, (d.minusCounters || 0) - 1) } : d)
  }

  const destroyToken = (id) => {
    update(tokens.filter(t => t.id !== id))
    setDetailToken(null)
  }

  const cloneToken = (token) => {
    const newToken = {
      ...token,
      id: genId(),
      tapped: false,
      plusCounters: 0,
      minusCounters: 0,
    }
    update([...tokens, newToken])
  }

  // Raggruppa per groupId (token creati insieme) o per signature (stesso token)
  const grouped = groupTokens(tokens)

  // Statistiche
  const totalTokens = tokens.length
  const tappedCount = tokens.filter(t => t.tapped).length

  const clearAll = () => {
    update([])
    setConfirmClear(false)
  }

  if (tokens.length === 0) {
    return (
      <div className="battlefield-page">
        <header className="page-header">
          <h2 className="page-title">Campo di Battaglia</h2>
          <p className="page-desc">I tuoi token in gioco.</p>
        </header>
        <div className="empty-state">
          <p className="empty-icon">⚔</p>
          <p>Il campo è vuoto.</p>
          <div className="empty-actions">
            <button type="button" className="btn-primary" onClick={() => navigate('/tokens/create')}>
              Crea un token
            </button>
            <button type="button" className="btn-secondary" onClick={() => navigate('/tokens/presets')}>
              Usa un preset
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="battlefield-page">
      <header className="page-header">
        <h2 className="page-title">Campo di Battaglia</h2>
        <p className="page-desc">
          <strong>{totalTokens}</strong> token in campo · <strong>{tappedCount}</strong> TAPpati ·
          <strong> {grouped.length}</strong> {grouped.length === 1 ? 'tipo' : 'tipi'}
        </p>
        <p className="bf-hint">💡 Tap per TAP/STAP · Tieni premuto per dettagli</p>
      </header>

      <div className="battlefield-actions">
        <button type="button" className="btn-secondary" onClick={() => navigate('/tokens/create')}>
          + Aggiungi token
        </button>
        <button type="button" className="btn-secondary" onClick={() => navigate('/tokens/presets')}>
          ⋆ Da preset
        </button>
        {confirmClear ? (
          <div className="confirm-clear">
            <span>Svuotare campo?</span>
            <button type="button" className="btn-danger-small" onClick={clearAll}>Sì</button>
            <button type="button" className="btn-ghost-small" onClick={() => setConfirmClear(false)}>No</button>
          </div>
        ) : (
          <button type="button" className="btn-ghost" onClick={() => setConfirmClear(true)}>
            🗑 Svuota
          </button>
        )}
      </div>

      <div className="battlefield-groups">
        {grouped.map(group => (
          <div key={group.signature} className="bf-group">
            <div className="bf-group-header">
              <h4 className="bf-group-title">
                {group.tokens[0].name}
                <span className="bf-group-count">× {group.tokens.length}</span>
              </h4>
              <div className="bf-group-actions">
                <button
                  type="button"
                  className="number-btn-small"
                  onClick={() => destroyToken(group.tokens[group.tokens.length - 1].id)}
                  aria-label="Rimuovi una copia"
                >−</button>
                <button
                  type="button"
                  className="number-btn-small"
                  onClick={() => cloneToken(group.tokens[0])}
                  aria-label="Aggiungi una copia"
                >+</button>
              </div>
            </div>
            <div className="bf-token-grid">
              {group.tokens.map(token => (
                <TokenCard
                  key={token.id}
                  token={token}
                  onTap={handleTap}
                  onLongPress={handleLongPress}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* MODAL DETTAGLIO */}
      {detailToken && (
        <div className="modal-overlay" onClick={() => setDetailToken(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button
              type="button"
              className="modal-close"
              onClick={() => setDetailToken(null)}
              aria-label="Chiudi"
            >✕</button>
            <h3 className="modal-title">{detailToken.name}</h3>
            <div className="modal-preview">
              <TokenCard token={detailToken} showInteractions={false} />
            </div>
            <div className="modal-info">
              <p><strong>Tipo:</strong> Pedina Creatura — {detailToken.type || '—'}</p>
              <p><strong>Colori:</strong> {(detailToken.colors || []).join(', ') || 'Incolore'}</p>
              <p><strong>P/T base:</strong> {detailToken.power}/{detailToken.toughness}</p>
              {(detailToken.abilities || []).length > 0 && (
                <p><strong>Abilità:</strong> {detailToken.abilities.join(', ')}</p>
              )}
              <p><strong>Stato:</strong> {detailToken.tapped ? 'TAPpato' : 'STAPpato'}</p>
            </div>

            <div className="modal-counters">
              <h4>Segnalini</h4>
              <div className="counter-control">
                <span className="counter-label counter-plus-label">+1/+1</span>
                <button type="button" className="number-btn" onClick={() => removePlusCounter(detailToken.id)}>−</button>
                <span className="counter-number">{detailToken.plusCounters || 0}</span>
                <button type="button" className="number-btn" onClick={() => addPlusCounter(detailToken.id)}>+</button>
              </div>
              <div className="counter-control">
                <span className="counter-label counter-minus-label">−1/−1</span>
                <button type="button" className="number-btn" onClick={() => removeMinusCounter(detailToken.id)}>−</button>
                <span className="counter-number">{detailToken.minusCounters || 0}</span>
                <button type="button" className="number-btn" onClick={() => addMinusCounter(detailToken.id)}>+</button>
              </div>
            </div>

            <div className="modal-actions">
              <button type="button" className="btn-secondary" onClick={() => handleTap(detailToken)}>
                {detailToken.tapped ? '↺ STAPpa' : '⟲ TAPpa'}
              </button>
              <button type="button" className="btn-secondary" onClick={() => cloneToken(detailToken)}>
                + Clona
              </button>
              <button type="button" className="btn-danger" onClick={() => destroyToken(detailToken.id)}>
                💀 Distruggi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Raggruppa token con stesse caratteristiche
function groupTokens(tokens) {
  const map = new Map()
  for (const t of tokens) {
    const sig = `${t.name}|${t.type}|${(t.colors || []).join('')}|${t.power}|${t.toughness}|${(t.abilities || []).join(',')}`
    if (!map.has(sig)) map.set(sig, { signature: sig, tokens: [] })
    map.get(sig).tokens.push(t)
  }
  return Array.from(map.values())
}

export default BattlefieldPage
