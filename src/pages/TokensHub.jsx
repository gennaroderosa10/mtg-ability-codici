import { Link } from 'react-router-dom'

const options = [
  {
    to: '/tokens/common',
    title: 'Token Comuni',
    desc: 'Tesoro, Cibo, Indizio, Mappa e tutti i token artefatto noti di Magic',
    icon: '◈',
    color: '#d4a574'
  },
  {
    to: '/tokens/create',
    title: 'Crea Token',
    desc: 'Crea il tuo token personalizzato con nome, colori, P/T e abilità',
    icon: '✦',
    color: '#7ab07a'
  },
  {
    to: '/tokens/presets',
    title: 'I Tuoi Preset',
    desc: 'I token che hai salvato per riutilizzarli rapidamente',
    icon: '⋆',
    color: '#9b7bc7'
  },
  {
    to: '/tokens/battlefield',
    title: 'Campo di Battaglia',
    desc: 'Visualizza e gestisci i token attivi durante la partita',
    icon: '⚔',
    color: '#c84a3a'
  },
]

function TokensHub() {
  return (
    <div className="tokens-hub">
      <header className="page-header">
        <h2 className="page-title">Token</h2>
        <p className="page-desc">
          Esplora i token artefatto noti, crea i tuoi token personalizzati e gestiscili sul campo di battaglia.
        </p>
      </header>

      <div className="hub-grid">
        {options.map(opt => (
          <Link
            key={opt.to}
            to={opt.to}
            className="hub-card"
            style={{ '--cat-color': opt.color }}
          >
            <div className="hub-card-icon" aria-hidden="true">{opt.icon}</div>
            <div className="hub-card-body">
              <h3 className="hub-card-title">{opt.title}</h3>
              <p className="hub-card-desc">{opt.desc}</p>
            </div>
            <div className="hub-card-arrow">→</div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default TokensHub
