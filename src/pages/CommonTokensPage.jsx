import { useState, useMemo } from 'react'
import { commonTokens } from '../data/tokens.js'

function normalize(s) {
  return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

function CommonTokensPage() {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    if (!query.trim()) return commonTokens
    const q = normalize(query.trim())
    return commonTokens.filter(t =>
      normalize(t.en).includes(q) ||
      normalize(t.it).includes(q) ||
      normalize(t.effect).includes(q)
    )
  }, [query])

  return (
    <div className="common-tokens-page">
      <header className="page-header">
        <h2 className="page-title">Token Comuni</h2>
        <p className="page-desc">
          Token artefatto generati da effetti di gioco, ordinati per popolarità.
        </p>
      </header>

      <div className="search-wrap">
        <div className="search-box">
          <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="search"
            className="search-input"
            placeholder="Cerca un token..."
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
          {query && (
            <button type="button" className="search-clear" onClick={() => setQuery('')}>✕</button>
          )}
        </div>
        <p className="result-count">{filtered.length} {filtered.length === 1 ? 'token' : 'token'}</p>
      </div>

      <div className="ability-grid">
        {filtered.map(t => (
          <article key={t.en} className="ability-card token-info-card">
            <header className="ability-card-header">
              <h3 className="ability-name-en">{t.en}</h3>
              <span className="ability-name-it">{t.it}</span>
            </header>
            {t.cost && t.cost !== '—' && (
              <p className="token-cost"><strong>Costo:</strong> {t.cost}</p>
            )}
            <p className="ability-desc"><strong>Effetto:</strong> {t.effect}</p>
            <p className="token-flavor">{t.flavor}</p>
            <p className="token-set">📅 {t.firstSet}</p>
          </article>
        ))}
      </div>
    </div>
  )
}

export default CommonTokensPage
