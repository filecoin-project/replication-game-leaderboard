/* eslint-env browser */

import React, { Fragment } from 'react'

const Instructions = ({ onShowLeaderboard }) => {
  return (
    <Fragment>
      <div className='mw7 center pb3 montserrat gray f6 fw2 lh-copy'>
        <h2 className='f4 fw2 mv3 white ttu'><span role='img' aria-label='icon for introduction'>📖</span> Introduction</h2>
        <h3 className='f5 fw2 mt4 mb3 white'>What is this game?</h3>
        <p>The Replication Game is a competition where participants compete to outperform the default implementation of Proof-of-Replication. To participate in the game, you can run the current replication algorithm (or your own implementation) and post your proof on our server.</p>

        <h3 className='f5 fw2 mt4 mb3 white'>What is Proof-of-Replication?</h3>
        <p>Proof of Replication is the proof that:</p>
        <ol>
          <li>the Filecoin Storage Market is secure: it ensures that miners cannot lie about storing users' data</li>
          <li> the Filecoin Blockchain is secure: it ensures that miners cannot lie about the amount of storage they have (remember, miners win blocks based on their storage power!).</li>
        </ol>
        <p>In Filecoin, we use the Proof of Replication inside "Sealing" during mining.</p>

        <h3 className='f5 fw2 mt4 mb3 white'>How does Proof of Replication work?</h3>
        <p>The intuition behind Proof of Replication is the following: the data from the Filecoin market is encoded via a slow sequential computation that cannot be parallelized.</p>

        <h3 className='f5 fw2 mt4 mb3 white'>How can I climb up in the leaderboard?</h3>
        <p>There are some strategies to replicate "faster", some are practical (software and hardware optimizations), some are believe to be impractical or impossible (get ready to win a price and be remembered in the history of cryptography if you do so!)</p>

        <ul>
          <li><i>Practical attempts:</i> Implement a faster replication algorithm with better usage of memory, optimize some parts of the algorithm (e.g. Pedersen, Blake2s) in hardware (e.g. FPGA, GPU, ASICs), performing attacks on Depth Robust Graphs (the best known attacks are here).</li>
          <li><i>Impractical attempts:</i> Find special datasets that allow for faster replication, break the sequentiality assumption, generate the proof storing less data, break Pedersen hashes.</li>
        </ul>

        <hr className='black-20 b--solid mv4' />

        <h2 className='f4 fw2 mv3 white ttu'><span role='img' aria-label='icon for play the game'>🕹</span> Play the Game</h2>

        <p>Make sure you have all required dependencies installed:</p>

        <ul>
          <li><a href='https://git-scm.com' className='gray hover-white'>Git</a></li>
          <li><a href='https://www.rust-lang.org/tools/install' className='gray hover-white'>rustup</a></li>
          <li>Rust nightly (usually <code>rustup install nightly</code>)</li>
          <li><a href='https://www.postgresql.org' className='gray hover-white'>PostgreSQL</a></li>
          <li>Clang and libclang</li>
          <li><a href='https://stedolan.github.io/jq/download/' className='gray hover-white'>jq</a> (optional) - prettify json output on the command-line, for viewing the leaderboard</li>
        </ul>

        <p>Clone the project with git:</p>

        <pre className='pa3 bg-black-30 br2 overflow-x-scroll'>git clone https://github.com/filecoin-project/replication-game.git</pre>

        <p>From the replication-game/ directory, compile the game binary:</p>

        <pre className='pa3 bg-black-30 br2 overflow-x-scroll'>cargo +nightly build --release --bin replication-game</pre>

        <h3 className='f5 fw2 mt4 mb3 white'>Play the game from the command line</h3>

        <p>There are two ways to play:</p>
        <ul>
          <li><b>Method 1:</b> Run the `play` helper script</li>
          <li><b>Method 2:</b> Run each individual command</li>
        </ul>

        <h3 className='f5 fw2 mt4 mb3 white'>Method 1: Run the `play` helper script</h3>

        <p>From the replication-game/ directory, run the `play` helper script in `bin/`, specifying:</p>

        <ul>
          <li><code>NAME</code>: your player name</li>
          <li><code>SIZE</code>: the size in KB of the data you want to replicate</li>
          <li><code>TYPE</code>: the type of algorithm you want to run (current options are `zigzag` and `drgporep`)</li>
        </ul>

        <pre className='pa3 bg-black-30 br2 overflow-x-scroll'>bin/play NAME SIZE TYPE</pre>

        <p>The <code>play</code> script will retrieve the seed from the game server, replicate the data, generate a proof, and then post that proof to the game server. The script runs each of the commands in **Method 2**, but wraps them in an easy-to-use shell script.</p>

        <h3 className='f5 fw2 mt4 mb3 white'>Method 2: Run each individual command</h3>

        <p>Set your player name:</p>

        <pre className='pa3 bg-black-30 br2 overflow-x-scroll'>export REPL_GAME_ID="ReadyPlayerOne"</pre>

        <p>Get the seed from our server:</p>

        <pre className='pa3 bg-black-30 br2 overflow-x-scroll'>{`curl https://replication-game.herokuapp.com/api/seed > seed.json
export REPL_GAME_SEED=$(cat seed.json| jq -r '.seed')
export REPL_GAME_TIMESTAMP=$(cat seed.json| jq -r '.timestamp')`}</pre>

        <p>Play the game:</p>

        <pre className='pa3 bg-black-30 br2 overflow-x-scroll'>{`./target/release/replication-game \\
    --prover $REPL_GAME_ID \\
    --seed $REPL_GAME_SEED \\
    --timestamp $REPL_GAME_TIMESTAMP \\
    --size 1048576 \\
    zigzag > proof.json`}</pre>

        <p>Send your proof:</p>

        <pre className='pa3 bg-black-30 br2 overflow-x-scroll'>curl -X POST -H "Content-Type: application/json" -d @./proof.json https://replication-game.herokuapp.com/api/proof</pre>

        <p>Finally:</p>

        <p><button onClick={onShowLeaderboard} className='montserrat f6 fw2 gray bw0 br4 ph3 pv2 bg-white-10 hover-bg-white-30 pointer'>Check your place on the leaderboards!</button></p>

        <hr className='black-20 b--solid mv4' />

        <h2 className='f4 fw2 mt4 mb3 white ttu'>FAQ</h2>

        <blockquote className='ml0 mt4 white'>What parameters should I be using for the replication?</blockquote>

        <p>Our leaderboard will track the parameters you will be using, feel free to experiment with many. We are targeting powers of two, in particular: <code>1GiB</code> (<code>--size 1048576</code>), <code>16GiB</code> (<code>--size 16777216</code>), <code>1TB</code> (<code>--size 1073741824</code>)</p>

        <blockquote className='ml0 mt4 white'>How do I know what the parameters mean?</blockquote>

        <p>Run this command to find out:</p>

        <pre className='pa3 bg-black-30 br2 overflow-x-scroll'>./target/debug/replication-game --help</pre>

        <blockquote className='ml0 mt4 white'>What do I win if I am first?</blockquote>

        <p>So far, we have no bounty set up for this, but we are planning on doing so. If you beat the replication game (and you can prove it by being in the leaderboard), reach out to <a href='mailto:filecoin-research@protocol.ai' className='gray hover-white'>filecoin-research@protocol.ai</a>.</p>
      </div>
    </Fragment>
  )
}

export default Instructions
