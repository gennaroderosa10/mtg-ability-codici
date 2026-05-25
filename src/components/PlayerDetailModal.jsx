import { useState } from 'react'
import { playerColors } from '../utils/lifecounter.js'

function PlayerDetailModal({ player, allPlayers, onClose, onUpdate }) {
  const [tab, setTab] = useState('counters')
  const [newCounterLabel, setNewCounterLabel] = useState('')

  if (!player) return null

  const change = (patch) => {
    onUpdate({ ...player, ...patch })
  }

  const changeCounter = (key, delta) => {
    change({ [key]: Math.max(0, (player[key] || 0) + delta) })
  }

  const changeCmdDmg = (fromId, delta) => {
    const next = { ...(player.cmdDamage || {}) }
    next[fromId] = Math.max(0, (next[fromId] || 0) + delta)
    if (next[fromId] === 0) delete next[fromId]
    change({ cmdDamage: next })
  }

  const addCustomCounter = () => {
    if (!newCounterLabel.trim()) return
    const next = [...(player.customCounters || []), {
      id: Date.now().toString(36),
      label: newCounterLabel.trim().slice(0, 20),
      value: 0,
    }]
    change({ customCounters: next })
    setNewCounterLabel('')
  }

  const updateCustomCounter = (id, delta) => {
    const next = (player.customCounters || []).map(c =>
      c.id === id ? { ...c, value: Math.max(0, c.value + delta) } : c
    )
    change({ customCounters: next })
  }

  const removeCustomCounter = (id) => {
    change({ customCounters: (player.customCounters || []).filter(c => c.id !== id) })
  }

  const changeRing = (delta) => {
    change({ ringTemptation: Math.max(0, Math.min(4, (player.ringTemptation || 0) + delta)) })
  }

  const renameP = (newName) => {
    change({ name: newName.slice(0, 30) || `Giocatore` })
  }

  const setColor = (colorId) => change({ colorId })

  const totalCmdDmg = Object.values(player.cmdDamage || {}).reduce((a, b) => a + b, 0)
  const otherPlayers = allPlayers.filter(p => p.id !== player.id)

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-large" onClick={e => e.stopPropagation()}>
        <button type="button" className="modal-close" onClick={onClose}>✕</button>

        {/* Nome modificabile */}
        <input
          type="text"
          className="modal-player-name"
          value={player.name}
          onChange={e => renameP(e.target.value)}
          maxLength={30}
        />

        {/* Tabs */}
        <div className="modal-tabs">
          <button
            type="button"
            className={'modal-tab' + (tab === 'counters' ? ' active' : '')}
            onClick={() => setTab('counters')}
          >Contatori</button>
          <button
            type="button"
            className={'modal-tab' + (tab === 'cmddmg' ? ' active' : '')}
            onClick={() => setTab('cmddmg')}
          >Cmd Dmg{totalCmdDmg ? ` (${totalCmdDmg})` : ''}</button>
          <button
            type="button"
            className={'modal-tab' + (tab === 'tracker' ? ' active' : '')}
            onClick={() => setTab('tracker')}
          >Tracker</button>
          <button
            type="button"
            className={'modal-tab' + (tab === 'history' ? ' active' : '')}
            onClick={() => setTab('history')}
          >Cronologia</button>
          <button
            type="button"
            className={'modal-tab' + (tab === 'options' ? ' active' : '')}
            onClick={() => setTab('options')}
          >Opzioni</button>
        </div>

        {/* Tab: Contatori */}
        {tab === 'counters' && (
          <div className="modal-tab-content">
            <CounterRow
              icon="☠"
              label="Veleno"
              value={player.poison}
              max={10}
              onMinus={() => changeCounter('poison', -1)}
              onPlus={() => changeCounter('poison', 1)}
              warning={player.poison >= 10 ? 'Eliminato per veleno!' : null}
            />
            <CounterRow
              icon="⚡"
              label="Energia"
              value={player.energy}
              onMinus={() => changeCounter('energy', -1)}
              onPlus={() => changeCounter('energy', 1)}
            />
            <CounterRow
              icon="⭐"
              label="Esperienza"
              value={player.experience}
              onMinus={() => changeCounter('experience', -1)}
              onPlus={() => changeCounter('experience', 1)}
            />

            <h4 className="modal-section-title">Segnalini personalizzati</h4>
            {(player.customCounters || []).map(c => (
              <div key={c.id} className="custom-counter-row">
                <span className="custom-counter-label">{c.label}</span>
                <div className="counter-controls">
                  <button type="button" className="number-btn" onClick={() => updateCustomCounter(c.id, -1)}>−</button>
                  <span className="counter-number">{c.value}</span>
                  <button type="button" className="number-btn" onClick={() => updateCustomCounter(c.id, 1)}>+</button>
                  <button type="button" className="btn-ghost-small" onClick={() => removeCustomCounter(c.id)}>🗑</button>
                </div>
              </div>
            ))}

            <div className="add-counter-row">
              <input
                type="text"
                className="form-input"
                placeholder="Nome nuovo segnalino..."
                value={newCounterLabel}
                onChange={e => setNewCounterLabel(e.target.value)}
                maxLength={20}
              />
              <button type="button" className="btn-secondary btn-small" onClick={addCustomCounter}>
                + Aggiungi
              </button>
            </div>
          </div>
        )}

        {/* Tab: Commander Damage */}
        {tab === 'cmddmg' && (
          <div className="modal-tab-content">
            <p className="modal-help">
              Danno da combattimento ricevuto da ogni Commander avversario. A 21 da un singolo
              giocatore, sei eliminato.
            </p>
            {otherPlayers.length === 0 ? (
              <p className="empty-state-small">Nessun avversario.</p>
            ) : (
              otherPlayers.map(other => {
                const dmg = (player.cmdDamage || {})[other.id] || 0
                const otherColor = playerColors.find(c => c.id === other.colorId) || playerColors[0]
                return (
                  <div key={other.id} className="cmd-dmg-row">
                    <div className="cmd-dmg-info">
                      <span
                        className="cmd-dmg-swatch"
                        style={{ background: otherColor.bg, borderColor: otherColor.border }}
                      />
                      <span className="cmd-dmg-name">{other.name}</span>
                    </div>
                    <div className="counter-controls">
                      <button type="button" className="number-btn" onClick={() => changeCmdDmg(other.id, -1)}>−</button>
                      <span className={'counter-number' + (dmg >= 21 ? ' counter-danger' : '')}>{dmg}</span>
                      <button type="button" className="number-btn" onClick={() => changeCmdDmg(other.id, 1)}>+</button>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        )}

        {/* Tab: Tracker (Ring, Monarca, etc) */}
        {tab === 'tracker' && (
          <div className="modal-tab-content">
            <div className="tracker-row">
              <div className="tracker-info">
                <h5>⚪ L'Anello ti tenta</h5>
                <p className="tracker-desc">Livello tentazione (0-4). Sblocca abilità a ogni livello.</p>
              </div>
              <div className="counter-controls">
                <button type="button" className="number-btn" onClick={() => changeRing(-1)}>−</button>
                <span className="counter-number">{player.ringTemptation || 0}/4</span>
                <button type="button" className="number-btn" onClick={() => changeRing(1)}>+</button>
              </div>
            </div>

            <ToggleRow
              icon="👑"
              label="Monarca"
              desc="Sei tu il Monarca. Peschi una carta a fine turno."
              value={!!player.monarch}
              onToggle={() => change({ monarch: !player.monarch })}
            />

            <ToggleRow
              icon="⚡"
              label="Iniziativa"
              desc="Hai l'iniziativa. Avventurati nei Nove Inferi a fine turno."
              value={!!player.initiative}
              onToggle={() => change({ initiative: !player.initiative })}
            />

            <ToggleRow
              icon="✦"
              label="Città dei Benedetti"
              desc="Controlli 10+ permanenti. Effetto attivo per il resto della partita."
              value={!!player.cityBlessed}
              onToggle={() => change({ cityBlessed: !player.cityBlessed })}
            />

            <div className="tracker-row">
              <div className="tracker-info">
                <h5>☀ ☾ Giorno / Notte</h5>
                <p className="tracker-desc">Stato giorno/notte (Innistrad Midnight Hunt).</p>
              </div>
              <div className="daynight-toggle">
                <button
                  type="button"
                  className={'daynight-btn' + (player.dayNight === 'day' ? ' active' : '')}
                  onClick={() => change({ dayNight: player.dayNight === 'day' ? null : 'day' })}
                >☀ Giorno</button>
                <button
                  type="button"
                  className={'daynight-btn' + (player.dayNight === 'night' ? ' active' : '')}
                  onClick={() => change({ dayNight: player.dayNight === 'night' ? null : 'night' })}
                >☾ Notte</button>
              </div>
            </div>
          </div>
        )}

        {/* Tab: Cronologia */}
        {tab === 'history' && (
          <div className="modal-tab-content">
            <p className="modal-help">Ultime modifiche ai punti vita (più recenti in alto)</p>
            {(player.history || []).length === 0 ? (
              <p className="empty-state-small">Nessuna modifica registrata.</p>
            ) : (
              <ul className="history-list">
                {[...(player.history || [])].reverse().slice(0, 30).map((h, idx) => (
                  <li key={idx} className="history-item">
                    <span className={'history-change ' + (h.change > 0 ? 'positive' : 'negative')}>
                      {h.change > 0 ? '+' : ''}{h.change}
                    </span>
                    <span className="history-arrow">→</span>
                    <span className="history-value">{h.newValue}</span>
                    <span className="history-time">{formatTime(h.ts)}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* Tab: Opzioni */}
        {tab === 'options' && (
          <div className="modal-tab-content">
            <h4 className="modal-section-title">Colore pannello</h4>
            <div className="color-swatches">
              {playerColors.map(c => (
                <button
                  key={c.id}
                  type="button"
                  className={'color-swatch' + (player.colorId === c.id ? ' active' : '')}
                  style={{ background: c.bg, borderColor: c.border }}
                  onClick={() => setColor(c.id)}
                  title={c.name}
                  aria-label={c.name}
                />
              ))}
            </div>

            <h4 className="modal-section-title">Azioni</h4>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                if (confirm('Resettare i contatori di questo giocatore?')) {
                  change({
                    poison: 0, energy: 0, experience: 0,
                    cmdDamage: {}, customCounters: [],
                    ringTemptation: 0, monarch: false,
                    initiative: false, cityBlessed: false, dayNight: null,
                  })
                }
              }}
            >Reset contatori</button>
          </div>
        )}
      </div>
    </div>
  )
}

function CounterRow({ icon, label, value, onMinus, onPlus, warning, max }) {
  return (
    <div className="counter-row">
      <div className="counter-row-info">
        <span className="counter-row-icon">{icon}</span>
        <span className="counter-row-label">{label}</span>
        {warning && <span className="counter-warning">⚠ {warning}</span>}
      </div>
      <div className="counter-controls">
        <button type="button" className="number-btn" onClick={onMinus}>−</button>
        <span className={'counter-number' + (max && value >= max ? ' counter-danger' : '')}>
          {value}{max ? `/${max}` : ''}
        </span>
        <button type="button" className="number-btn" onClick={onPlus}>+</button>
      </div>
    </div>
  )
}

function ToggleRow({ icon, label, desc, value, onToggle }) {
  return (
    <div className="tracker-row">
      <div className="tracker-info">
        <h5>{icon} {label}</h5>
        <p className="tracker-desc">{desc}</p>
      </div>
      <button
        type="button"
        className={'toggle-btn' + (value ? ' active' : '')}
        onClick={onToggle}
      >
        {value ? 'ON' : 'OFF'}
      </button>
    </div>
  )
}

function formatTime(ts) {
  const d = new Date(ts)
  const now = new Date()
  const diff = (now - d) / 1000
  if (diff < 60) return 'ora'
  if (diff < 3600) return `${Math.floor(diff / 60)}m fa`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h fa`
  return d.toLocaleDateString('it-IT')
}

export default PlayerDetailModal
