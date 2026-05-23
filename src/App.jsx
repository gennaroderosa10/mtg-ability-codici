import { Routes, Route, NavLink } from 'react-router-dom'
import Home from './pages/Home.jsx'
import CategoryPage from './pages/CategoryPage.jsx'
import AllAbilitiesPage from './pages/AllAbilitiesPage.jsx'
import OfflineIndicator from './components/OfflineIndicator.jsx'
import InstallPrompt from './components/InstallPrompt.jsx'

function App() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="container">
          <NavLink to="/" className="brand">
            <span className="brand-mark">✦</span>
            <span className="brand-text">MTG Ability</span>
            <span className="brand-mark">✦</span>
          </NavLink>
          <p className="brand-subtitle">Glossario completo delle abilità</p>
        </div>
      </header>

      <nav className="app-nav">
        <div className="container nav-scroll">
          <NavLink to="/" end className="nav-link">Home</NavLink>
          <NavLink to="/category/evergreen" className="nav-link">Evergreen</NavLink>
          <NavLink to="/category/deciduous" className="nav-link">Deciduous</NavLink>
          <NavLink to="/category/keyword-ability" className="nav-link">Keyword Abilities</NavLink>
          <NavLink to="/category/keyword-action" className="nav-link">Keyword Actions</NavLink>
          <NavLink to="/category/ability-word" className="nav-link">Ability Words</NavLink>
          <NavLink to="/all" className="nav-link">Tutte</NavLink>
        </div>
      </nav>

      <main className="app-main">
        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/category/:cat" element={<CategoryPage />} />
            <Route path="/all" element={<AllAbilitiesPage />} />
          </Routes>
        </div>
      </main>

      <footer className="app-footer">
        <div className="container">
          <p>✦ ✦ ✦</p>
          <p className="footer-text">MTG Ability · uso offline · dati non ufficiali</p>
        </div>
      </footer>

      <OfflineIndicator />
      <InstallPrompt />
    </div>
  )
}

export default App
