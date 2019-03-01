import React, { useState } from 'react'
import numeral from 'numeral'
import md5 from 'md5'
import gold from './gold.png'
import silver from './silver.png'
import bronze from './bronze.png'
import goldRibbon from './gold-ribbon.png'
import silverRibbon from './silver-ribbon.png'
import bronzeRibbon from './bronze-ribbon.png'
import proofDrgPoRep from './proof-DrgPoRep.svg'
import proofZigzag from './proof-Zigzag.svg'
import proofUnknown from './proof-Unknown.svg'

const Avatar = ({ name, className = 'mr3 v-mid', size = 60 }) => {
  return (
    <img
      src={`https://github.com/${name}.png?size=${size}`}
      className={className}
      style={{ width: size / 2, height: size / 2 }}
      alt={`${name} avatar`}
      onError={e => { e.target.src = `https://www.gravatar.com/avatar/${md5(name)}?d=retro&s=${size}` }} />
  )
}

const ReplTime = ({ time }) => {
  return (
    <span className='dib f5 fr bg-snow black pa2 br3 lh-solid tr courier ml4'>{time}</span>
  )
}

const Entry = ({ name, time }) => {
  return (
    <div className='flex'>
      <Avatar name={name} />
      <span className='fw5 montserrat white truncate flex-auto' title={name}>{name}</span>
      <ReplTime time={numeral(time).format('0.000e+0')} />
    </div>
  )
}

const Medal = ({ type }) => {
  const srcs = { gold, goldRibbon, silver, silverRibbon, bronze, bronzeRibbon }
  const style = ['gold', 'silver', 'bronze'].includes(type)
    ? { width: 45, top: '0.5rem', right: '8rem' }
    : { width: 45, top: -3, right: '8rem' }
  return (
    <img src={srcs[type]} alt={type} className='absolute dn db-m db-l' style={style} />
  )
}

const ProofIcon = ({ typ, className }) => {
  let src = proofUnknown
  if (typ === 'DrgPoRep') {
    src = proofDrgPoRep
  } else if (typ === 'Zigzag') {
    src = proofZigzag
  }
  return <img src={src} alt='icon by Eliricon from the Noun Project' width='50' height='50' className={className} />
}

const ProofDesc = {
  DrgPoRep: 'Depth Robust Graph Proof-of-Replication',
  Zigzag: 'Specialized Layered Depth Robust Graph Proof-of-Replication'
}

const Header = ({ params }) => {
  return (
    <div className='pl4'>
      <h2 className='montserrat fw2 mv3' title={ProofDesc[params.typ] || ''}>
        <span className='dib w5'>
          <ProofIcon className='mr2 v-mid' typ={params.typ} />
          <span className='v-mid mr5'>{params.typ}</span>
        </span>
        <span className='dib v-mid' style={{ lineHeight: '50px' }}>{numeral(params.size).format('0,0')} <small className='gray'>bytes</small></span>
      </h2>
      <ul className='montserrat f6 fw2 list mv3 pl0'>
        <li className='dib-ns mr3'><span className='gray mr2'>Challenges</span> {params.challenge_count}</li>
        <li className='dib-ns mr3'><span className='gray mr2'>VDE</span> {params.vde}</li>
        <li className='dib-ns mr3'><span className='gray mr2'>Degree</span> {params.degree}</li>
        <li className='dib-ns mr3'><span className='gray mr2'>Expansion degree</span> {params.expansion_degree}</li>
        <li className='dib-ns mr3'><span className='gray mr2'>Layers</span> {params.layers}</li>
      </ul>
    </div>
  )
}

const CollapsedLeaderboard = ({ entries, onExpand }) => {
  const top3 = entries.slice(0, 3)
  const rest = entries.slice(3)
  return (
    <div className='mb4 pv1 ph1 br3 shadow-3' style={{ backgroundColor: '#1E2135' }}>
      <Header params={top3[0].params} />
      <div className='pr4 fr' style={{ marginTop: '-2.25rem' }}>
        <div className='f7 f6-m f6-l mt1 montserrat fw2 gray'>Time / byte (ms)</div>
      </div>
      <ol className='ma0 lh-copy mw7 mb3 pl3 center db gray' style={{ listStyleType: 'decimal' }}>
        {top3.slice(0, 1).map(({ id, prover, perByteTime, params }) => (
          <li
            key={id}
            className='tl f4 mh3 pa3 b--gold b--solid bw1 br3 br--top relative shadow-1'
            style={{ backgroundColor: 'rgba(255, 183, 0, 0.75)' }}>
            <Medal type='gold' />
            <Entry name={prover} time={perByteTime} />
          </li>
        ))}
        {top3.slice(1, 2).map(({ id, prover, perByteTime, params }) => (
          <li
            key={id}
            className='tl f4 mh3 pa3 b--silver b--solid bw1 relative shadow-1'
            style={{ backgroundColor: 'rgba(153, 153, 153, 0.75)' }}>
            <Medal type='silver' />
            <Entry name={prover} time={perByteTime} />
          </li>
        ))}
        {top3.slice(2, 3).map(({ id, prover, perByteTime, params }) => (
          <li
            key={id}
            className='tl f4 mh3 pa3 b--solid bw1 br3 br--bottom relative shadow-1'
            style={{ borderColor: '#cd7f32', backgroundColor: 'rgba(205, 127, 50, 0.75)' }}>
            <Medal type='bronze' />
            <Entry name={prover} time={perByteTime} />
          </li>
        ))}
      </ol>
      {rest.length ? (
        <div className='tc mb3'>
          <button type='button' className='montserrat f6 fw2 gray bw0 br3 ph3 pv2 bg-black-10 hover-bg-black-30 pointer' onClick={onExpand}>Show {rest.length} more</button>
        </div>
      ) : null}
    </div>
  )
}

const ExpandedLeaderboard = ({ entries, onCollapse }) => {
  return (
    <div className='mb4 pv1 ph1 br3' style={{ backgroundColor: '#1E2135' }}>
      <Header params={entries[0].params} />
      <div className='pr4 fr' style={{ marginTop: '-2.25rem' }}>
        <div className='f7 f6-m f6-l mt1 montserrat fw2 gray'>Time / byte (ms)</div>
      </div>
      <ol className='ma0 lh-copy mw7 mb3 pl3 center db gray' style={{ listStyleType: 'decimal' }}>
        {entries.slice(0, 1).map(({ id, prover, perByteTime, params }) => (
          <li
            key={id}
            className='tl f4 mh3 pa3 b--gold b--solid bw1 br3 relative shadow-1'
            style={{ backgroundColor: 'rgba(255, 183, 0, 0.75)' }}>
            <Medal type='goldRibbon' />
            <Entry name={prover} time={perByteTime} />
          </li>
        ))}
        {entries.slice(1, 2).map(({ id, prover, perByteTime, params }) => (
          <li
            key={id}
            className='tl f4 mt4 mh3 pa3 b--silver b--solid bw1 br3 relative shadow-1'
            style={{ backgroundColor: 'rgba(153, 153, 153, 0.75)' }}>
            <Medal type='silverRibbon' />
            <Entry name={prover} time={perByteTime} />
          </li>
        ))}
        {entries.slice(2, 3).map(({ id, prover, perByteTime, params }) => (
          <li
            key={id}
            className='tl f4 mt4 mh3 mb4 pa3 b--solid bw1 br3 relative shadow-1'
            style={{ borderColor: '#cd7f32', backgroundColor: 'rgba(205, 127, 50, 0.75)' }}>
            <Medal type='bronzeRibbon' />
            <Entry name={prover} time={perByteTime} />
          </li>
        ))}
        {entries.slice(3).map(({ id, prover, perByteTime, params }) => (
          <li key={id} className='tl mt3 mh3 ph3 f4'>
            <Entry name={prover} time={perByteTime} />
          </li>
        ))}
      </ol>
      <div className='tc mb3'>
        <button type='button' className='montserrat f6 fw2 gray bw0 br3 ph3 pv2 bg-black-10 hover-bg-black-30 pointer' onClick={onCollapse}>Minimise</button>
      </div>
    </div>
  )
}

const Leaderboard = ({ entries }) => {
  const [ expanded, setExpanded ] = useState(false)
  return expanded
    ? <ExpandedLeaderboard entries={entries} onCollapse={() => setExpanded(false)} />
    : <CollapsedLeaderboard entries={entries} onExpand={() => setExpanded(true)} />
}

export default Leaderboard
