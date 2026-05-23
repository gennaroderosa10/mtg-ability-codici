import { useState, useMemo } from 'react'
import AbilityCard from './AbilityCard.jsx'
import { categories } from '../data/index.js'

function normalize(str) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

function AbilityList({ abilities, categoryColor, showCategory }) {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    if (!query.trim()) return abilities
    const q = normalize(query.trim())
    return abilities.filter(a =>
      normalize(a.en).includes(q) ||
      normalize(a.it).includes(q) ||
      normalize(a.desc).includes(q)
    )
  }, [abilities, query])

  return (
    <div className="ability-list-wrap">
      <div className="search-wrap">
        <div className="search-box">
          <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="search"
            className="search-input"
            placeholder="Cerca in italiano o inglese..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck="false"
          />
          {query && (
            <button type="button" className="search-clear" onClick={() => setQuery('')} aria-label="Pulisci">✕</button>
          )}
        </div>
        <p className="result-count">{filtered.length} {filtered.length === 1 ? 'risultato' : 'risultati'}</p>
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <p className="empty-icon">✦</p>
          <p>Nessuna abilità trovata per "{query}"</p>
        </div>
      ) : (
        <div className="ability-grid">
          {filtered.map(a => (
            <AbilityCard
              key={a.en + a.cat}
              ability={a}
              color={categoryColor || categories[a.cat]?.color}
              showCategory={showCategory}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default AbilityList
