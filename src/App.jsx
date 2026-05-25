import { Routes, Route, NavLink } from 'react-router-dom'
import Home from './pages/Home.jsx'
import CategoryPage from './pages/CategoryPage.jsx'
import AllAbilitiesPage from './pages/AllAbilitiesPage.jsx'
import TokensHub from './pages/TokensHub.jsx'
import CommonTokensPage from './pages/CommonTokensPage.jsx'
import CreateTokenPage from './pages/CreateTokenPage.jsx'
import PresetsPage from './pages/PresetsPage.jsx'
import BattlefieldPage from './pages/BattlefieldPage.jsx'
import LifeCounterPage from './pages/LifeCounterPage.jsx'
import OfflineIndicator from './components/OfflineIndicator.jsx'
import InstallPrompt from './components/InstallPrompt.jsx'
import BottomNav from './components/BottomNav.jsx'

function App() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="container">
          <NavLink to="/" className="brand">
            <span className="brand-mark">✦</span>
            <span className="brand-text">The Emeritus Glossary</span>
            <span className="brand-mark">✦</span>
          </NavLink>
          <p className="brand-subtitle">Glossario MTG · Token · Segnapunti</p>
        </div>
      </header>

      <nav className="app-nav app-nav-top">
        <div className="container nav-scroll">
          <NavLink to="/" end className="nav-link">Home</NavLink>
          <NavLink to="/category/evergreen" className="nav-link">Evergreen</NavLink>
          <NavLink to="/category/deciduous" className="nav-link">Deciduous</NavLink>
          <NavLink to="/category/keyword-ability" className="nav-link">Keyword Abilities</NavLink>
          <NavLink to="/category/keyword-action" className="nav-link">Keyword Actions</NavLink>
          <NavLink to="/category/ability-word" className="nav-link">Ability Words</NavLink>
          <NavLink to="/all" className="nav-link">Tutte</NavLink>
          <NavLink to="/tokens" className="nav-link nav-link-special">Token</NavLink>
          <NavLink to="/segnapunti" className="nav-link nav-link-special">Segnapunti</NavLink>
        </div>
      </nav>

      <main className="app-main">
        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/category/:cat" element={<CategoryPage />} />
            <Route path="/all" element={<AllAbilitiesPage />} />
            <Route path="/tokens" element={<TokensHub />} />
            <Route path="/tokens/common" element={<CommonTokensPage />} />
            <Route path="/tokens/create" element={<CreateTokenPage />} />
            <Route path="/tokens/presets" element={<PresetsPage />} />
            <Route path="/tokens/battlefield" element={<BattlefieldPage />} />
            <Route path="/segnapunti" element={<LifeCounterPage />} />
          </Routes>
        </div>
      </main>

      <footer className="app-footer">
        <div className="container">
          <p>✦ ✦ ✦</p>
          <p className="footer-text">The Emeritus Glossary · funziona offline · dati non ufficiali</p>
        </div>
      </footer>

      <BottomNav />
      <OfflineIndicator />
      <InstallPrompt />
    </div>
  )
}

export default App
