import { useState } from 'react'
import AbilityList from '../components/AbilityList.jsx'
import { allAbilities, categories } from '../data/index.js'

const filterOrder = ['all', 'evergreen', 'deciduous', 'keyword-ability', 'keyword-action', 'ability-word']

function AllAbilitiesPage() {
  const [filter, setFilter] = useState('all')

  const filtered = filter === 'all' ? allAbilities : allAbilities.filter(a => a.cat === filter)

  return (
    <div className="all-page">
      <header className="page-header">
        <h2 className="page-title">Tutte le abilità</h2>
        <p className="page-desc">Cerca in tutto il database, in italiano o inglese.</p>
      </header>

      <div className="cat-filter-bar" role="tablist">
        {filterOrder.map(key => (
          <button
            key={key}
            type="button"
            className={'cat-pill' + (filter === key ? ' active' : '')}
            onClick={() => setFilter(key)}
            style={{'--cat-color': categories[key].color}}
          >
            {categories[key].label}
          </button>
        ))}
      </div>

      <AbilityList abilities={filtered} showCategory />
    </div>
  )
}

export default AllAbilitiesPage
