import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import TokenCard from '../components/TokenCard.jsx'
import { loadPresets, savePresets, loadBattlefield, saveBattlefield, genId } from '../utils/storage.js'

function PresetsPage() {
  const navigate = useNavigate()
  const [presets, setPresets] = useState([])
  const [feedback, setFeedback] = useState('')
  const [confirmingDelete, setConfirmingDelete] = useState(null)

  useEffect(() => {
    setPresets(loadPresets())
  }, [])

  const deletePreset = (id) => {
    const next = presets.filter(p => p.id !== id)
    setPresets(next)
    savePresets(next)
    setConfirmingDelete(null)
    setFeedback('✓ Preset eliminato')
    setTimeout(() => setFeedback(''), 2000)
  }

  const useThisPreset = (preset, quantity) => {
    const battlefield = loadBattlefield()
    const groupId = genId()
    const newTokens = []
    for (let i = 0; i < quantity; i++) {
      newTokens.push({
        id: genId(),
        groupId,
        name: preset.name,
        type: preset.type,
        colors: preset.colors,
        power: preset.power,
        toughness: preset.toughness,
        abilities: preset.abilities,
        tapped: false,
        plusCounters: 0,
        minusCounters: 0,
      })
    }
    saveBattlefield([...battlefield, ...newTokens])
    setFeedback(`✓ ${quantity} ${quantity === 1 ? 'token aggiunto' : 'token aggiunti'} al campo`)
    setTimeout(() => setFeedback(''), 2000)
  }

  if (presets.length === 0) {
    return (
      <div className="presets-page">
        <header className="page-header">
          <h2 className="page-title">I Tuoi Preset</h2>
          <p className="page-desc">Token salvati per essere riutilizzati rapidamente.</p>
        </header>
        <div className="empty-state">
          <p className="empty-icon">⋆</p>
          <p>Non hai ancora preset salvati.</p>
          <button
            type="button"
            className="btn-primary"
            onClick={() => navigate('/tokens/create')}
            style={{ marginTop: 16 }}
          >
            Crea il tuo primo token
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="presets-page">
      <header className="page-header">
        <h2 className="page-title">I Tuoi Preset</h2>
        <p className="page-desc">{presets.length} {presets.length === 1 ? 'preset salvato' : 'preset salvati'}.</p>
      </header>

      {feedback && <div className="banner-feedback">{feedback}</div>}

      <div className="presets-grid">
        {presets.map(preset => (
          <div key={preset.id} className="preset-item">
            <div className="preset-card-wrap">
              <TokenCard token={preset} showInteractions={false} isPreset />
            </div>
            <div className="preset-controls">
              <PresetQuantityControl
                defaultQuantity={preset.defaultQuantity || 1}
                onUse={(q) => useThisPreset(preset, q)}
              />
              {confirmingDelete === preset.id ? (
                <div className="confirm-delete">
                  <span className="confirm-text">Eliminare?</span>
                  <button
                    type="button"
                    className="btn-danger-small"
                    onClick={() => deletePreset(preset.id)}
                  >Sì</button>
                  <button
                    type="button"
                    className="btn-ghost-small"
                    onClick={() => setConfirmingDelete(null)}
                  >No</button>
                </div>
              ) : (
                <button
                  type="button"
                  className="btn-ghost-small"
                  onClick={() => setConfirmingDelete(preset.id)}
                >🗑 Elimina</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function PresetQuantityControl({ defaultQuantity, onUse }) {
  const [qty, setQty] = useState(defaultQuantity)
  return (
    <div className="preset-qty-row">
      <div className="number-input number-input-compact">
        <button type="button" className="number-btn" onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
        <span className="number-display">{qty}</span>
        <button type="button" className="number-btn" onClick={() => setQty(q => Math.min(20, q + 1))}>+</button>
      </div>
      <button type="button" className="btn-primary-small" onClick={() => onUse(qty)}>
        ⚔ In campo
      </button>
    </div>
  )
}

export default PresetsPage
