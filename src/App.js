/* eslint-env browser */

import React, { Component } from 'react'
import logo from './filecoin-logo.svg'
import LeaderboardList from './LeaderboardList'

const Header = () => (
  <header className='mw7 center'>
    <h1 className='ma0 pv4 fw2 f1 montserrat tc'>
      <img src={logo} alt='fil' width='80' className='db dib-l center mb3 mb0-l ml0-l mr4-l v-mid' />
      <span className='v-mid'>Replication Game</span>
    </h1>
  </header>
)

class App extends Component {
  state = {}

  render () {
    return (
      <div className='sans-serif white'>
        <Header />
        <main>
          <LeaderboardList />
        </main>
      </div>
    )
  }
}

export default App
