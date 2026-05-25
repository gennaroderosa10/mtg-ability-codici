import { NavLink, useLocation } from 'react-router-dom'

const items = [
  {
    to: '/',
    label: 'Abilità',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
    matchPaths: ['/', '/category', '/all'],
  },
  {
    to: '/tokens',
    label: 'Token',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14.5 17.5L3 6V3h3l11.5 11.5" />
        <path d="M13 19l6-6" />
        <path d="M16 16l4 4" />
        <path d="M19 21l2-2" />
      </svg>
    ),
    matchPaths: ['/tokens'],
  },
  {
    to: '/segnapunti',
    label: 'Segnapunti',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
    matchPaths: ['/segnapunti'],
  },
]

function BottomNav() {
  const location = useLocation()

  const isActive = (matchPaths) => {
    return matchPaths.some(p => {
      if (p === '/') return location.pathname === '/'
      return location.pathname.startsWith(p)
    })
  }

  return (
    <nav className="bottom-nav" aria-label="Navigazione principale">
      {items.map(item => (
        <NavLink
          key={item.to}
          to={item.to}
          className={'bottom-nav-item' + (isActive(item.matchPaths) ? ' active' : '')}
          end={item.to === '/'}
        >
          <span className="bottom-nav-icon">{item.icon}</span>
          <span className="bottom-nav-label">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}

export default BottomNav
