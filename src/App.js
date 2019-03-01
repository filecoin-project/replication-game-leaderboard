/* eslint-env browser */

import React, { Component } from 'react'
import logo from './filecoin-logo.svg'
import Leaderboard from './Leaderboard'

const API_URL = process.env.REACT_APP_API_URL || 'leaderboard.json'
const REFRESH_INTERVAL = process.env.REACT_APP_REFRESH_INTERVAL || 10 * 1000

const Header = () => (
  <header className='mw7 center'>
    <h1 className='ma0 pv4 fw2 f1 montserrat tc'>
      <img src={logo} alt='fil' width='80' className='db dib-l center mb3 mb0-l ml0-l mr4-l v-mid' />
      <span className='v-mid'>Replication Game</span>
    </h1>
  </header>
)

function processLeaderboardData (data) {
  // Group leaderboard by params ID - { id: [entries] }
  const groups = data.reduce((groups, d) => {
    groups[d.params.id] = (groups[d.params.id] || []).concat(d)
    return groups
  }, {})

  // [[leaderboard], [leaderboard]]
  return Object.values(groups)
    .filter(l => l.length > 1) // Not really a leaderboard if only 1 person...
    .sort((a, b) => b.length - a.length)
    .map(board => board.sort((a, b) => a.repl_time - b.repl_time))
}

class App extends Component {
  state = {}

  componentDidMount () {
    const refresh = async () => {
      try {
        const res = await fetch(API_URL)
        if (!res.ok) throw new Error(`unexpected status ${res.status}`)
        this.setState({ leaderboardData: await res.json() })
      } catch (err) {
        console.error('failed to fetch leaderboard data', err)
      } finally {
        setTimeout(refresh, REFRESH_INTERVAL)
      }
    }
    refresh()
  }

  render () {
    const { leaderboardData } = this.state

    if (!leaderboardData) {
      return (
        <div className='sans-serif white'>
          <Header />
          <main className='tc'>
            <p>Loading...</p>
          </main>
        </div>
      )
    }

    const leaderboards = processLeaderboardData(leaderboardData)

    return (
      <div className='sans-serif white'>
        <Header />
        <main>
          <div className='mw7 pl3 center pb2 cf'>
            <h2 className='f4 f3-m f3-l mv3 pl4-m pl4-l tc tl-m tl-l montserrat fw2 ttu fl-m fl-l'>Leaderboards</h2>
          </div>
          <div className='mw7 pl3 center pb2 cf'>
            {leaderboards.map(l => <Leaderboard entries={l} />)}
          </div>
        </main>
      </div>
    )
  }
}

export default App
