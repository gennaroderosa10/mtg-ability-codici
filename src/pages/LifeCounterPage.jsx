import { useState, useEffect, useRef } from 'react'
import NewGameSetup from '../components/NewGameSetup.jsx'
import PlayerPanel from '../components/PlayerPanel.jsx'
import PlayerDetailModal from '../components/PlayerDetailModal.jsx'
import DiceRollerModal from '../components/DiceRollerModal.jsx'
import { loadGame, saveGame, createNewGame, getLayout } from '../utils/lifecounter.js'

function LifeCounterPage() {
  const [game, setGame] = useState(null)
  const [showSetup, setShowSetup] = useState(false)
  const [resumeDialog, setResumeDialog] = useState(false)
  const [detailFor, setDetailFor] = useState(null)
  const [showDice, setShowDice] = useState(false)
  const [confirmReset, setConfirmReset] = useState(false)
  const initialized = useRef(false)

  // Init: controlla se c'è una partita salvata
  useEffect(() => {
    if (initialized.current) return
    initialized.current = true
    const saved = loadGame()
    if (saved && saved.players && saved.players.length > 0) {
      setResumeDialog(true)
      setGame(saved)
    } else {
      setShowSetup(true)
    }
  }, [])

  // Salva ogni modifica
  useEffect(() => {
    if (game) saveGame(game)
  }, [game])

  const handleStartNew = (numPlayers, startingLife) => {
    const newGame = createNewGame(numPlayers, startingLife)
    setGame(newGame)
    setShowSetup(false)
    setResumeDialog(false)
  }

  const handleResume = () => setResumeDialog(false)

  const handleNewFromResume = () => {
    setResumeDialog(false)
    setShowSetup(true)
  }

  const handleLifeChange = (playerId, delta) => {
    setGame(g => {
      if (!g) return g
      const players = g.players.map(p => {
        if (p.id !== playerId) return p
        const newLife = p.life + delta
        const historyEntry = { ts: Date.now(), change: delta, newValue: newLife }
        const newHistory = [...(p.history || []), historyEntry].slice(-50)
        return { ...p, life: newLife, history: newHistory }
      })
      return { ...g, players }
    })
  }

  const handlePlayerUpdate = (updated) => {
    setGame(g => ({
      ...g,
      players: g.players.map(p => p.id === updated.id ? updated : p)
    }))
    // Aggiorna anche il detailFor se è lo stesso giocatore
    if (detailFor && detailFor.id === updated.id) {
      setDetailFor(updated)
    }
  }

  const handleReset = () => {
    if (!game) return
    const newGame = createNewGame(game.numPlayers, game.startingLife)
    setGame(newGame)
    setConfirmReset(false)
  }

  if (showSetup || !game) {
    return (
      <div className="lifecounter-page">
        <NewGameSetup
          onStart={handleStartNew}
          onCancel={() => setShowSetup(false)}
          hasOldGame={!!game}
        />
      </div>
    )
  }

  const layout = getLayout(game.numPlayers)

  return (
    <div className="lifecounter-page lifecounter-active">
      {/* Modal "Riprendi partita?" */}
      {resumeDialog && (
        <div className="modal-overlay">
          <div className="modal-content modal-small">
            <h3 className="modal-title">Partita in corso</h3>
            <p className="modal-text">
              C'è una partita salvata con <strong>{game.numPlayers} giocatori</strong>.
              Vuoi riprenderla o iniziarne una nuova?
            </p>
            <div className="modal-actions">
              <button type="button" className="btn-primary" onClick={handleResume}>
                ▶ Riprendi
              </button>
              <button type="button" className="btn-secondary" onClick={handleNewFromResume}>
                + Nuova partita
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Barra superiore strumenti */}
      <div className="lc-toolbar">
        <button type="button" className="lc-tool-btn" onClick={() => setShowDice(true)}>
          🎲 Dadi
        </button>
        {confirmReset ? (
          <div className="confirm-clear">
            <span>Nuova partita?</span>
            <button type="button" className="btn-danger-small" onClick={handleReset}>Sì</button>
            <button type="button" className="btn-ghost-small" onClick={() => setConfirmReset(false)}>No</button>
          </div>
        ) : (
          <button type="button" className="lc-tool-btn" onClick={() => setConfirmReset(true)}>
            ↻ Nuova partita
          </button>
        )}
      </div>

      {/* Griglia giocatori */}
      <div
        className="lc-grid"
        style={{
          gridTemplateColumns: `repeat(${layout.cols}, 1fr)`,
          gridTemplateRows: `repeat(${layout.rows}, 1fr)`,
        }}
      >
        {game.players.map((player, idx) => {
          // Rotazione: il primo è capovolto se layout lo prevede
          const isRotated = layout.rotateTop && idx === 0
          return (
            <PlayerPanel
              key={player.id}
              player={player}
              isRotated={isRotated}
              onLifeChange={(delta) => handleLifeChange(player.id, delta)}
              onOpenDetail={() => setDetailFor(player)}
            />
          )
        })}
      </div>

      {/* Modal dettagli giocatore */}
      {detailFor && (
        <PlayerDetailModal
          player={detailFor}
          allPlayers={game.players}
          onClose={() => setDetailFor(null)}
          onUpdate={handlePlayerUpdate}
        />
      )}

      {/* Modal dadi */}
      {showDice && <DiceRollerModal onClose={() => setShowDice(false)} />}
    </div>
  )
}

export default LifeCounterPage
