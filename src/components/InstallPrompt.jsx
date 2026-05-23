import { useEffect, useState } from 'react'

function InstallPrompt() {
  const [deferred, setDeferred] = useState(null)
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem('mtg-install-dismissed')) return

    const handler = e => {
      e.preventDefault()
      setDeferred(e)
      setShow(true)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const install = async () => {
    if (!deferred) return
    deferred.prompt()
    await deferred.userChoice
    setDeferred(null)
    setShow(false)
  }

  const dismiss = () => {
    setShow(false)
    sessionStorage.setItem('mtg-install-dismissed', '1')
  }

  if (!show) return null

  return (
    <div className="install-banner">
      <span className="install-text">Installa l'app per accesso rapido e uso offline</span>
      <button type="button" className="install-btn" onClick={install}>Installa</button>
      <button type="button" className="install-close" onClick={dismiss} aria-label="Chiudi">✕</button>
    </div>
  )
}

export default InstallPrompt
