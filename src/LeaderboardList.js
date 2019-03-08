/* eslint-env browser */

import React, { Component, Fragment } from 'react'
import Leaderboard from './Leaderboard'

const API_URL = process.env.REACT_APP_API_URL || 'leaderboard.json'
const REFRESH_INTERVAL = process.env.REACT_APP_REFRESH_INTERVAL || 10 * 1000

// These are the param sets for leaderboards that should be shown at the top
const TOP_BOARD_PARAM_IDS = [
  -6035303110978460000, // Zigzag 10MB
  -3754677902270980600, // DrgPoRep 10MB
  8939453956850745000, // Zigzag 1GB
  8586938920904822000 // DrgPoRep 1GB
]

function processBoardData (data) {
  data = data.map(d => ({ ...d, secondsPerMBTime: d.repl_time / (d.params.size / (1024 * 1024)) }))

  // Group leaderboard by params ID - { id: [entries] }
  const groups = data.reduce((groups, d) => {
    groups[d.params.id] = (groups[d.params.id] || []).concat(d)
    return groups
  }, {})

  // [[leaderboard], [leaderboard]]
  return Object.values(groups)
    .filter(l => l.length > 1) // Not really a leaderboard if only 1 person...
    .sort((a, b) => { // Sort by "top" boards then popular boards
      const aIndex = TOP_BOARD_PARAM_IDS.indexOf(a[0].params.id)
      const bIndex = TOP_BOARD_PARAM_IDS.indexOf(b[0].params.id)
      if (aIndex > -1 && bIndex > -1) return aIndex - bIndex
      if (aIndex > -1) return -1
      if (bIndex > -1) return 1
      return b.length - a.length
    })
    .map(board => board.sort((a, b) => a.secondsPerMBTime - b.secondsPerMBTime))
}

class LeaderboardList extends Component {
  state = { expanded: false }

  componentDidMount () {
    const refresh = async () => {
      try {
        const res = await fetch(API_URL)
        if (!res.ok) throw new Error(`unexpected status ${res.status}`)
        this.setState({ boardData: await res.json() })
      } catch (err) {
        console.error('failed to fetch leaderboard data', err)
      } finally {
        this._refreshTimeoutId = setTimeout(refresh, REFRESH_INTERVAL)
      }
    }
    refresh()
  }

  componentWillUnmount () {
    clearTimeout(this._refreshTimeoutId)
  }

  render () {
    const { boardData, expanded } = this.state

    if (!boardData) {
      return (
        <div className='mw7 center pb2'>
          <p>Loading...</p>
        </div>
      )
    }

    const all = processBoardData(boardData)
    const top = all.slice(0, TOP_BOARD_PARAM_IDS.length)
    const rest = all.slice(TOP_BOARD_PARAM_IDS.length)

    const onExpand = () => this.setState({ expanded: true })
    const onCollapse = () => this.setState({ expanded: false })

    return (
      <Fragment>
        <div className='mw7 center pb2 cf'>
          <h2 className='f4 f3-m f3-l mv3 pl4-m pl4-l tc tl-m tl-l montserrat fw2 ttu fl-m fl-l'>Leaderboards</h2>
        </div>
        <div className='mw7 center pb2'>
          {top.map(l => <Leaderboard key={l[0].params.id} entries={l} />)}
        </div>
        {rest.length ? (
          <div className='flex items-center mt4 mb5 ph3'>
            <div className='flex-auto'><hr className={`black-${expanded ? '20' : '10'} b--solid`} /></div>
            <div className='flex-none mh3'>
              <button
                type='button'
                className='montserrat f6 fw2 gray bw0 br3 ph3 pv2 bg-black-10 hover-bg-black-30 pointer'
                onClick={expanded ? onCollapse : onExpand}>
                {expanded ? 'Hide other leaderboards' : 'Show all leaderboards' }
              </button>
            </div>
            <div className='flex-auto'><hr className={`black-${expanded ? '20' : '10'} b--solid`} /></div>
          </div>
        ) : null}
        {rest.length && expanded ? (
          <div className='mw7 center pb2 cf'>
            {rest.map(l => <Leaderboard key={l[0].params.id} entries={l} />)}
          </div>
        ) : null}
      </Fragment>
    )
  }
}

export default LeaderboardList
