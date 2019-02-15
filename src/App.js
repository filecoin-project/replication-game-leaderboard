import React, { Component } from 'react'
import numeral from 'numeral'
import logo from './filecoin-logo.svg'
import gold from './gold.png'
import silver from './silver.png'
import bronze from './bronze.png'

const API_URL = process.env.REACT_APP_API_URL || '/leaderboard.json'
const REFRESH_INTERVAL = process.env.REACT_APP_REFRESH_INTERVAL || 10 * 1000

const Header = () => (
  <header className="mw7 center pl5">
    <h1 className='ma0 pv4 fw2 f1 montserrat'>
      <img src={logo} alt='fil' width='80' className='db dib-l mb3 mb0-l mr4 v-mid'/>
      <span className='v-mid'>Replication challenge</span>
    </h1>
  </header>
)

const Avatar = ({name, className = 'ml2 mr4 v-mid', size = 60}) => {
  return (
    <img src={`https://github.com/${name}.png?size=${size}`} className={className} style={{width: size/2, height: size/2}} alt={`${name} avatar`} />
  )
}

const ReplTime = ({time}) => {
  return (
    <span className='dib f5 fr bg-snow black pa2 br3 lh-solid tr courier'>{time}</span>
  )
}

const Entry = ({name, time}) => {
  return (
    <React.Fragment>
      <Avatar name={name} />
      <span className='fw5 montserrat white truncate'>{name}</span>
      <ReplTime time={numeral(time).format('0.000e+0')} />
    </React.Fragment>
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
      .map(d => ({ ...d, perByteTime: (d.repl_time * 1000) / d.params.size }))
      .sort((a, b) => a.perByteTime - b.perByteTime)
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
          <div className='mw7 center tr pb2'>
            <span className='f5 pr2 mr2'>Time / byte (ms)</span>
          </div>
          <ol className='ma0 lh-copy mw7 mb5 center db gray' style={{listStyleType: 'decimal'}}>
          {data.slice(0,1).map(({ id, prover, perByteTime, params }) => (
            <li
              key={id}
              className='tl f4 pa3 b--gold b--solid bw1 br3 relative shadow-1'
              style={{ backgroundColor: 'rgba(255, 183, 0, 0.75)' }}
              title={formatParams(params)}>
              <Medal type='gold' />
              <Entry name={prover} time={perByteTime} />
            </li>
          ))}
          {data.slice(1,2).map(({ id, prover, perByteTime, params }) => (
            <li
              key={id}
              className='tl f4 mt4 pa3 b--silver b--solid bw1 br3 relative shadow-1'
              style={{ backgroundColor: 'rgba(153, 153, 153, 0.75)' }}
              title={formatParams(params)}>
              <Medal type='silver' />
              <Entry name={prover} time={perByteTime} />
            </li>
          ))}
          {data.slice(2,3).map(({ id, prover, perByteTime, params }) => (
            <li
              key={id}
              className='tl f4 mt4 mb4 pa3 b--solid bw1 br3 relative shadow-1'
              style={{ borderColor: '#cd7f32', backgroundColor: 'rgba(205, 127, 50, 0.75)' }}
              title={formatParams(params)}>
              <Medal type='bronze' />
              <Entry name={prover} time={perByteTime} />
            </li>
          ))}
          {data.slice(3).map(({ id, prover, perByteTime, params }) => (
            <li
              key={id}
              className='tl mt3 ph3 f4'
              title={formatParams(params)}>
              <Entry name={prover} time={perByteTime} />
            </li>
          ))}
          </ol>
        </main>
      </div>
    );
  }
}

export default App;
