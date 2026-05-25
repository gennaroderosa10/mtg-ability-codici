import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { allAbilities } from '../data/index.js'
import { mtgColors, loadBattlefield, saveBattlefield, loadPresets, savePresets, genId } from '../utils/storage.js'
import TokenCard from '../components/TokenCard.jsx'

function normalize(s) {
  return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

const colorOrder = ['W', 'U', 'B', 'R', 'G', 'C']

function CreateTokenPage() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [type, setType] = useState('')
  const [colors, setColors] = useState([])
  const [power, setPower] = useState(1)
  const [toughness, setToughness] = useState(1)
  const [selectedAbilities, setSelectedAbilities] = useState([])
  const [quantity, setQuantity] = useState(1)
  const [abilitySearch, setAbilitySearch] = useState('')
  const [showAbilityPicker, setShowAbilityPicker] = useState(false)
  const [feedback, setFeedback] = useState('')

  const toggleColor = (c) => {
    setColors(prev => {
      if (c === 'C') return ['C']
      const next = prev.filter(x => x !== 'C')
      return next.includes(c) ? next.filter(x => x !== c) : [...next, c]
    })
  }

  const toggleAbility = (en) => {
    setSelectedAbilities(prev =>
      prev.includes(en) ? prev.filter(a => a !== en) : [...prev, en]
    )
  }

  const filteredAbilities = useMemo(() => {
    if (!abilitySearch.trim()) return allAbilities.slice(0, 30)
    const q = normalize(abilitySearch.trim())
    return allAbilities.filter(a =>
      normalize(a.en).includes(q) || normalize(a.it).includes(q)
    ).slice(0, 50)
  }, [abilitySearch])

  const preview = {
    name: name || 'Pedina',
    type: type || 'Senza Tipo',
    colors: colors.length ? colors : ['C'],
    power: Number(power) || 0,
    toughness: Number(toughness) || 0,
    abilities: selectedAbilities,
  }

  const adjustPower = (delta) => setPower(p => Math.max(0, Number(p) + delta))
  const adjustToughness = (delta) => setToughness(t => Math.max(0, Number(t) + delta))
  const adjustQuantity = (delta) => setQuantity(q => Math.max(1, Math.min(20, Number(q) + delta)))

  const reset = () => {
    setName(''); setType(''); setColors([])
    setPower(1); setToughness(1); setSelectedAbilities([])
    setQuantity(1); setAbilitySearch('')
  }

  const addToBattlefield = () => {
    const battlefield = loadBattlefield()
    const groupId = genId()
    const baseToken = {
      groupId,
      name: preview.name,
      type: preview.type,
      colors: preview.colors,
      power: preview.power,
      toughness: preview.toughness,
      abilities: preview.abilities,
    }
    const newTokens = []
    for (let i = 0; i < quantity; i++) {
      newTokens.push({
        ...baseToken,
        id: genId(),
        tapped: false,
        plusCounters: 0,
        minusCounters: 0,
      })
    }
    saveBattlefield([...battlefield, ...newTokens])
    setFeedback(`✓ ${quantity} ${quantity === 1 ? 'token aggiunto' : 'token aggiunti'} al campo`)
    setTimeout(() => setFeedback(''), 2500)
  }

  const saveAsPreset = () => {
    const presets = loadPresets()
    const newPreset = {
      id: genId(),
      name: preview.name,
      type: preview.type,
      colors: preview.colors,
      power: preview.power,
      toughness: preview.toughness,
      abilities: preview.abilities,
      defaultQuantity: quantity,
      createdAt: Date.now(),
    }
    savePresets([...presets, newPreset])
    setFeedback('✓ Salvato come preset')
    setTimeout(() => setFeedback(''), 2500)
  }

  return (
    <div className="create-token-page">
      <header className="page-header">
        <h2 className="page-title">Crea Token</h2>
        <p className="page-desc">Componi il tuo token personalizzato.</p>
      </header>

      <div className="create-layout">
        {/* FORM */}
        <div className="create-form">
          {/* Nome */}
          <div className="form-row">
            <label className="form-label">Nome</label>
            <input
              type="text"
              className="form-input"
              placeholder="es. Soldato, Zombie, Drago..."
              value={name}
              onChange={e => setName(e.target.value)}
              maxLength={40}
            />
          </div>

          {/* Tipo */}
          <div className="form-row">
            <label className="form-label">Tipo creatura</label>
            <input
              type="text"
              className="form-input"
              placeholder="es. Soldato Umano, Zombie..."
              value={type}
              onChange={e => setType(e.target.value)}
              maxLength={40}
            />
          </div>

          {/* Colori */}
          <div className="form-row">
            <label className="form-label">Colori</label>
            <div className="color-picker">
              {colorOrder.map(c => {
                const meta = mtgColors[c]
                const active = colors.includes(c)
                return (
                  <button
                    key={c}
                    type="button"
                    className={'color-pick-btn' + (active ? ' active' : '')}
                    onClick={() => toggleColor(c)}
                    style={{
                      background: active ? meta.hex : 'transparent',
                      color: active ? meta.textColor : 'var(--text-dim)',
                      borderColor: meta.hex,
                    }}
                    aria-label={meta.label}
                  >
                    <span className="color-pick-symbol">{c}</span>
                    <span className="color-pick-label">{meta.label}</span>
                  </button>
                )
              })}
            </div>
            <p className="form-hint">Se selezioni 2+ colori, il token sarà multicolore.</p>
          </div>

          {/* P/T */}
          <div className="form-row form-row-double">
            <div>
              <label className="form-label">Forza</label>
              <div className="number-input">
                <button type="button" className="number-btn" onClick={() => adjustPower(-1)}>−</button>
                <input
                  type="number"
                  className="form-input number-field"
                  value={power}
                  onChange={e => setPower(e.target.value)}
                  min="0"
                  max="99"
                />
                <button type="button" className="number-btn" onClick={() => adjustPower(1)}>+</button>
              </div>
            </div>
            <div>
              <label className="form-label">Costituzione</label>
              <div className="number-input">
                <button type="button" className="number-btn" onClick={() => adjustToughness(-1)}>−</button>
                <input
                  type="number"
                  className="form-input number-field"
                  value={toughness}
                  onChange={e => setToughness(e.target.value)}
                  min="0"
                  max="99"
                />
                <button type="button" className="number-btn" onClick={() => adjustToughness(1)}>+</button>
              </div>
            </div>
          </div>

          {/* Abilità */}
          <div className="form-row">
            <label className="form-label">
              Abilità ({selectedAbilities.length} selezionate)
            </label>
            {selectedAbilities.length > 0 && (
              <div className="selected-abilities">
                {selectedAbilities.map(a => (
                  <span key={a} className="ability-chip">
                    {a}
                    <button
                      type="button"
                      className="chip-remove"
                      onClick={() => toggleAbility(a)}
                      aria-label="Rimuovi"
                    >✕</button>
                  </span>
                ))}
              </div>
            )}
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setShowAbilityPicker(!showAbilityPicker)}
            >
              {showAbilityPicker ? '▲ Chiudi elenco abilità' : '▼ Aggiungi abilità'}
            </button>

            {showAbilityPicker && (
              <div className="ability-picker">
                <input
                  type="search"
                  className="form-input"
                  placeholder="Cerca abilità (italiano o inglese)..."
                  value={abilitySearch}
                  onChange={e => setAbilitySearch(e.target.value)}
                />
                <div className="ability-picker-list">
                  {filteredAbilities.map(a => (
                    <button
                      key={a.en}
                      type="button"
                      className={
                        'ability-picker-item' +
                        (selectedAbilities.includes(a.en) ? ' selected' : '')
                      }
                      onClick={() => toggleAbility(a.en)}
                    >
                      <span className="apl-en">{a.en}</span>
                      <span className="apl-it">{a.it}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quantità */}
          <div className="form-row">
            <label className="form-label">Quantità da creare</label>
            <div className="number-input">
              <button type="button" className="number-btn" onClick={() => adjustQuantity(-1)}>−</button>
              <input
                type="number"
                className="form-input number-field"
                value={quantity}
                onChange={e => setQuantity(e.target.value)}
                min="1"
                max="20"
              />
              <button type="button" className="number-btn" onClick={() => adjustQuantity(1)}>+</button>
            </div>
          </div>

          {/* Azioni */}
          <div className="form-actions">
            <button type="button" className="btn-primary" onClick={addToBattlefield}>
              ⚔ Metti in campo
            </button>
            <button type="button" className="btn-secondary" onClick={saveAsPreset}>
              ⋆ Salva preset
            </button>
            <button type="button" className="btn-ghost" onClick={reset}>
              Reset
            </button>
            <button
              type="button"
              className="btn-ghost"
              onClick={() => navigate('/tokens/battlefield')}
            >
              Vai al campo →
            </button>
          </div>

          {feedback && <div className="form-feedback">{feedback}</div>}
        </div>

        {/* PREVIEW */}
        <div className="create-preview">
          <h4 className="preview-title">Anteprima</h4>
          <div className="preview-wrap">
            <TokenCard token={preview} showInteractions={false} />
          </div>
          <p className="preview-hint">
            {quantity > 1 && `× ${quantity} copie verranno create`}
          </p>
        </div>
      </div>
    </div>
  )
}

export default CreateTokenPage
