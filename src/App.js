/* eslint-env browser */

import React, { useState } from 'react'
import logo from './filecoin-logo.svg'
import Instructions from './Instructions'
import LeaderboardList from './LeaderboardList'

const Header = ({ showInstructions, onShowInstructions, onShowLeaderboard }) => (
  <header className='bg-black-30 pb4 ph3'>
    <div className='mw7 center relative'>
      <button
        className='fr montserrat f6 fw2 gray bw0 br4 ph3 pv2 bg-white-10 hover-bg-white-30 pointer absolute right-0 top-1'
        onClick={showInstructions ? onShowLeaderboard : onShowInstructions}>
        {showInstructions ? '⬅ Back to leaderboards' : 'How to play?'}
      </button>
      <h1 className='ma0 pt5 pb4 fw2 f1 montserrat tc'>
        <img src={logo} alt='fil' width='80' className='db dib-l center mb3 mb0-l ml0-l mr4-l v-mid' />
        <span className='v-mid'>Replication Game</span>
      </h1>
      {showInstructions ? null : (
        <p className='montserrat f6 fw2 gray pl4-ns lh-copy'>
          The Replication Game is a competition where participants compete to out perform the default implementation of Proof-of-Replication. To participate in the game, you can run the current replication algorithm (or your own implementation) and post your proof on our server.
        </p>
      )}
    </div>
  </header>
)

const App = () => {
  const [ showInstructions, setShowInstructions ] = useState(false)
  const onShowInstructions = () => setShowInstructions(true)
  const onShowLeaderboard = () => setShowInstructions(false)

  return (
    <div className='sans-serif white'>
      <Header showInstructions={showInstructions} onShowInstructions={onShowInstructions} onShowLeaderboard={onShowLeaderboard} />
      <main className='pt4 ph3'>
        {showInstructions ? <Instructions onShowLeaderboard={onShowLeaderboard} /> : <LeaderboardList />}
      </main>
    </div>
  )
}

export default App
