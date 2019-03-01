import React, { Component } from 'react'
import logo from './filecoin-logo.svg'
import gold from './gold.png'
import silver from './silver.png'
import bronze from './bronze.png'

const API_URL = process.env.REACT_APP_API_URL || '/leaderboard.json'
const REFRESH_INTERVAL = process.env.REACT_APP_REFRESH_INTERVAL || 10 * 1000

const Header = () => (
  <header className="mw7 center">
    <h1 className='ma0 pv4 fw2 f1 montserrat tc'>
      <img src={logo} alt='fil' width='80' className='db dib-l center mb3 mb0-l ml0-l mr4-l v-mid'/>
      <span className='v-mid'>Replication Game</span>
    </h1>
  </header>
)

const Avatar = ({name, className = 'mr3 v-mid', size = 60}) => {
  return (
    <img src={`https://github.com/${name}.png?size=${size}`} className={className} style={{width: size/2, height: size/2}} alt={`${name} avatar`} />
  )
}

const ReplTime = ({time}) => {
  return (
    <span className='dib f5 fr bg-snow black pa2 br3 lh-solid tr courier ml4'>{time}</span>
  )
}

const Entry = ({name, time}) => {
  return (
    <div className='flex'>
      <Avatar name={name} />
      <span className='fw5 montserrat white truncate flex-auto' title={name}>{name}</span>
      <ReplTime time={time.toFixed(3)} />
    </div>
  )
}

const Medal = ({ type }) => {
  const srcs = { gold, silver, bronze }
  return (
    <img src={srcs[type]} alt={type} className='absolute dn db-m db-l' style={{ width: 45, top: -3, right: '8rem' }} />
  )
}

function formatParams ({ typ, challenge_count, vde, degree, expansion_degree, layers }) {
  return [
    `Type: ${typ}`,
    `Challenges: ${challenge_count}`,
    `VDE: ${vde}`,
    `Degree: ${degree}`,
    `Expansion degree: ${expansion_degree}`,
    `Layers: ${layers}`
  ].join(', ')
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

  render() {
    const { leaderboardData } = this.state

    if (!leaderboardData) {
      return (
        <div className="sans-serif white">
          <Header />
          <main className='tc'>
            <p>Loading...</p>
          </main>
        </div>
      )
    }

    const data = leaderboardData
      .map(d => ({ ...d, secondsPerMBTime: d.repl_time / (d.params.size / 1e+6) }))
      .sort((a, b) => a.secondsPerMBTime - b.secondsPerMBTime)
      .reduce((deduped, d) => {
        const exists = deduped.some(dd => {
          return dd.prover === d.prover &&
            dd.repl_time === d.repl_time &&
            dd.params.size === d.params.size
        })
        return exists ? deduped : deduped.concat(d)
      }, [])

    return (
      <div className="sans-serif white">
        <Header />
        <main>
          <div className='mw7 pl3 center pb2 cf'>
            <h2 className='f4 f3-m f3-l mv3 pl4-m pl4-l tc tl-m tl-l montserrat fw2 ttu fl-m fl-l'>Leaderboard</h2>
            <div className='f4 f3-m f3-l mv3 pr4 fr'>
              <div className='f6 f5-m f5-l mt1 montserrat fw2' title='microseconds per byte'>Repl time <small >(s/MB)</small></div>
            </div>
          </div>
          <ol className='ma0 lh-copy mw7 mb5 pl3 center db gray' style={{listStyleType: 'decimal'}}>
          {data.slice(0,1).map(({ id, prover, secondsPerMBTime, params }) => (
            <li
              key={id}
              className='tl f4 mh3 pa3 b--gold b--solid bw1 br3 relative shadow-1'
              style={{ backgroundColor: 'rgba(255, 183, 0, 0.75)' }}
              title={formatParams(params)}>
              <Medal type='gold' />
              <Entry name={prover} time={secondsPerMBTime} />
            </li>
          ))}
          {data.slice(1,2).map(({ id, prover, secondsPerMBTime, params }) => (
            <li
              key={id}
              className='tl f4 mt4 mh3 pa3 b--silver b--solid bw1 br3 relative shadow-1'
              style={{ backgroundColor: 'rgba(153, 153, 153, 0.75)' }}
              title={formatParams(params)}>
              <Medal type='silver' />
              <Entry name={prover} time={secondsPerMBTime} />
            </li>
          ))}
          {data.slice(2,3).map(({ id, prover, secondsPerMBTime, params }) => (
            <li
              key={id}
              className='tl f4 mt4 mh3 mb4 pa3 b--solid bw1 br3 relative shadow-1'
              style={{ borderColor: '#cd7f32', backgroundColor: 'rgba(205, 127, 50, 0.75)' }}
              title={formatParams(params)}>
              <Medal type='bronze' />
              <Entry name={prover} time={secondsPerMBTime} />
            </li>
          ))}
          {data.slice(3).map(({ id, prover, secondsPerMBTime, params }) => (
            <li
              key={id}
              className='tl mt3 mh3 ph3 f4'
              title={formatParams(params)}>
              <Entry name={prover} time={secondsPerMBTime} />
            </li>
          ))}
          </ol>
        </main>
      </div>
    );
  }
}

export default App;
