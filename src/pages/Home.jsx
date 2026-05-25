import { Link } from 'react-router-dom'
import { categories, stats } from '../data/index.js'

const order = ['evergreen', 'deciduous', 'keyword-ability', 'keyword-action', 'ability-word']

function Home() {
  return (
    <div className="home-page">
      <section className="hero">
        <h1 className="hero-title">Esplora le abilità</h1>
        <p className="hero-text">
          Tutte le keyword abilities, keyword actions e ability words ufficiali di Magic: The Gathering,
          con nome inglese, nome italiano e spiegazione dell'effetto.
        </p>
        <p className="hero-stat">
          <strong>{stats.total}</strong> abilità · <strong>5</strong> categorie
        </p>
      </section>

      <section className="cat-grid">
        {order.map(key => {
          const c = categories[key]
          return (
            <Link key={key} to={`/category/${key}`} className="cat-card" style={{'--cat-color': c.color}}>
              <h3 className="cat-card-title">{c.label}</h3>
              <p className="cat-card-desc">{c.desc}</p>
              <p className="cat-card-count">{stats.byCat[key]} abilità →</p>
            </Link>
          )
        })}
        <Link to="/all" className="cat-card cat-card-all">
          <h3 className="cat-card-title">Tutte le abilità</h3>
          <p className="cat-card-desc">Sfoglia e cerca nell'intero database con ricerca bilingue</p>
          <p className="cat-card-count">{stats.total} abilità →</p>
        </Link>
      </section>

      <section className="features-row">
        <Link to="/tokens" className="feature-card">
          <div className="feature-card-icon">⚔</div>
          <div className="feature-card-body">
            <h3 className="feature-card-title">Sezione Token</h3>
            <p className="feature-card-desc">
              Esplora i token artefatto comuni, crea i tuoi token personalizzati
              e gestiscili sul campo di battaglia virtuale.
            </p>
          </div>
          <span className="feature-card-arrow">→</span>
        </Link>

        <Link to="/segnapunti" className="feature-card feature-card-life">
          <div className="feature-card-icon">❤</div>
          <div className="feature-card-body">
            <h3 className="feature-card-title">Segnapunti</h3>
            <p className="feature-card-desc">
              Conta i punti vita di 2-8 giocatori con tutti i contatori MTG:
              veleno, energia, Commander damage, esperienza, l'Anello, monarca e altro.
            </p>
          </div>
          <span className="feature-card-arrow">→</span>
        </Link>
      </section>

      <section className="legend">
        <h4 className="legend-title">Come usare l'app</h4>
        <ul className="legend-list">
          <li>Usa la barra di ricerca per trovare un'abilità in inglese o italiano</li>
          <li>Filtra per categoria nella navigazione</li>
          <li>Nella sezione <strong>Token</strong> crei pedine personalizzate per le partite</li>
          <li>Nel <strong>Segnapunti</strong> gestisci punti vita e tutti i contatori MTG</li>
          <li>L'app funziona offline una volta installata</li>
        </ul>
      </section>
    </div>
  )
}

export default Home
