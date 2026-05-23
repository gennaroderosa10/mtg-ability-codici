import { useEffect, useState } from 'react'

function OfflineIndicator() {
  const [online, setOnline] = useState(navigator.onLine)
  const [visible, setVisible] = useState(!navigator.onLine)

  useEffect(() => {
    const handleOnline = () => {
      setOnline(true)
      setVisible(true)
      setTimeout(() => setVisible(false), 2500)
    }
    const handleOffline = () => {
      setOnline(false)
      setVisible(true)
    }
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  if (!visible) return null

  return (
    <div className={'offline-indicator ' + (online ? 'is-online' : 'is-offline')}>
      {online ? 'Online ✓' : 'Modalità offline'}
    </div>
  )
}

export default OfflineIndicator
