import { useParams, Link } from 'react-router-dom'
import { useMemo } from 'react'
import AbilityList from '../components/AbilityList.jsx'
import { allAbilities, categories } from '../data/index.js'

function CategoryPage() {
  const { cat } = useParams()
  const category = categories[cat]
  const filtered = useMemo(() => allAbilities.filter(a => a.cat === cat), [cat])

  if (!category) {
    return (
      <div className="error-page">
        <h2>Categoria non trovata</h2>
        <Link to="/" className="back-link">← Torna alla home</Link>
      </div>
    )
  }

  return (
    <div className="category-page">
      <header className="page-header" style={{'--cat-color': category.color}}>
        <h2 className="page-title">{category.label}</h2>
        <p className="page-desc">{category.desc}</p>
        <p className="page-count">{filtered.length} abilità</p>
      </header>

      <AbilityList abilities={filtered} categoryColor={category.color} />
    </div>
  )
}

export default CategoryPage
