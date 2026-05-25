import { useState } from 'react'

const PRESETS = [
  { value: 20, label: '20', sublabel: 'Standard / Modern' },
  { value: 40, label: '40', sublabel: 'Commander' },
  { value: 30, label: '30', sublabel: 'Brawl' },
]

function NewGameSetup({ onStart, onCancel, hasOldGame }) {
  const [numPlayers, setNumPlayers] = useState(2)
  const [lifePreset, setLifePreset] = useState(20)
  const [customLife, setCustomLife] = useState(20)
  const [useCustom, setUseCustom] = useState(false)

  const handleStart = () => {
    const life = useCustom ? Math.max(1, Number(customLife) || 20) : lifePreset
    onStart(numPlayers, life)
  }

  return (
    <div className="newgame-setup">
      <header className="page-header">
        <h2 className="page-title">Nuova Partita</h2>
        <p className="page-desc">Configura la partita e premi Inizia.</p>
      </header>

      <div className="setup-section">
        <label className="form-label">Numero di giocatori</label>
        <div className="player-count-grid">
          {[2,3,4,5,6,7,8].map(n => (
            <button
              key={n}
              type="button"
              className={'count-btn' + (numPlayers === n ? ' active' : '')}
              onClick={() => setNumPlayers(n)}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      <div className="setup-section">
        <label className="form-label">Punti vita iniziali</label>
        <div className="life-preset-grid">
          {PRESETS.map(p => (
            <button
              key={p.value}
              type="button"
              className={'life-preset' + (!useCustom && lifePreset === p.value ? ' active' : '')}
              onClick={() => { setUseCustom(false); setLifePreset(p.value) }}
            >
              <span className="life-preset-value">{p.label}</span>
              <span className="life-preset-label">{p.sublabel}</span>
            </button>
          ))}
          <button
            type="button"
            className={'life-preset life-preset-custom' + (useCustom ? ' active' : '')}
            onClick={() => setUseCustom(true)}
          >
            <span className="life-preset-value">
              {useCustom ? customLife : '?'}
            </span>
            <span className="life-preset-label">Personalizzato</span>
          </button>
        </div>

        {useCustom && (
          <div className="custom-life-input">
            <button type="button" className="number-btn" onClick={() => setCustomLife(v => Math.max(1, Number(v) - 1))}>−</button>
            <input
              type="number"
              className="form-input number-field number-field-large"
              value={customLife}
              onChange={e => setCustomLife(e.target.value)}
              min="1"
              max="999"
            />
            <button type="button" className="number-btn" onClick={() => setCustomLife(v => Math.min(999, Number(v) + 1))}>+</button>
          </div>
        )}
      </div>

      <div className="setup-actions">
        <button type="button" className="btn-primary btn-large" onClick={handleStart}>
          ⚔ Inizia partita
        </button>
        {hasOldGame && (
          <button type="button" className="btn-ghost" onClick={onCancel}>
            ← Torna alla partita in corso
          </button>
        )}
      </div>
    </div>
  )
}

export default NewGameSetup
