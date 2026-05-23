import { categories } from '../data/index.js'

function AbilityCard({ ability, color, showCategory }) {
  const catData = categories[ability.cat]
  const cardColor = color || catData?.color || '#d4a574'

  return (
    <article className="ability-card" style={{'--cat-color': cardColor}}>
      <header className="ability-card-header">
        <h3 className="ability-name-en">{ability.en}</h3>
        <span className="ability-name-it">{ability.it}</span>
      </header>
      <p className="ability-desc">{ability.desc}</p>
      {showCategory && catData && (
        <span className="ability-cat-tag">{catData.label}</span>
      )}
    </article>
  )
}

export default AbilityCard
