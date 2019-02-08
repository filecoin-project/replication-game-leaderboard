import React, { Component } from 'react';
import logo from './filecoin-logo.svg';
import data from './leaderboard.json'
import gold from './gold.png'
import silver from './silver.png'
import bronze from './bronze.png'

const Avatar = ({name, className = 'ml2 mr4 v-mid', size = 80}) => {
  return (
    <img src={`https://github.com/${name}.png?size=80`} className={className} style={{width: size/2, height: size/2}} alt={`${name} avatar`} />
  )
}

const ReplTime = ({time}) => {
  return (
    <span className='dib f4 fr bg-snow black b pa2 br3 lh-solid w3 tc sans-serif truncate'>{time}</span>
  )
}

const Entry = ({name, time}) => {
  return (
    <React.Fragment>
      <Avatar name={name} />
      <span className='fw6 montserrat truncate'>{name}</span>
      <ReplTime time={time} />
    </React.Fragment>
  )
}

class App extends Component {
  render() {
    return (
      <div className="sans-serif white">
        <header className="mw7 center pl5">
          <h1 className='ma0 pv4 fw2 f1 montserrat'>
            <img src={logo} alt='fil' width='40' className='db dib-l mb3 mb0-l mr4 v-bottom'/>
            <span>Replication challenge</span>
          </h1>
        </header>
        <main>
          <div className='mw7 center tr pb2'>
            <span className='pr4 mr2'>Time</span>
          </div>
          <ol className='ma0 lh-copy mw7 center db' style={{listStyleType: 'decimal'}}>
          {data.slice(0,1).map(({prover, repl_time}) => (
            <li className='tl f4 pa3 bg-gold white br2 relative'>
              <img src={gold} alt='winner' className='absolute' style={{ width: 45, top: -1, right: '7rem' }}/>
              <Entry name={prover} time={repl_time} />
            </li>
          ))}
          {data.slice(1,2).map(({prover, repl_time}) => (
            <li className='tl f4 mt4 pa3 bg-silver white br2 relative'>
              <img src={silver} alt='second' className='absolute' style={{ width: 45, top: -1, right: '7rem' }} />
              <Entry name={prover} time={repl_time} />
            </li>
          ))}
          {data.slice(2,3).map(({prover, repl_time}) => (
            <li className='tl f4 mt4 mb4 pa3 br2 white relative' style={{background: '#cd7f32'}}>
              <img src={bronze} alt='third' className='absolute' style={{ width: 45, top: -1, right: '7rem' }} />
              <Entry name={prover} time={repl_time} />
            </li>
          ))}
          {data.slice(3,9).map(({prover, repl_time}) => (
            <li className='tl mt3 ph3 f4'>
              <Entry name={prover} time={repl_time} />
            </li>
          ))}
          </ol>
        </main>
      </div>
    );
  }
}

export default App;
