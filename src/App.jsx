import { useState } from 'react';
import './App.css';

const MAX_RACKS = 5;

function App() {
  // page: 'setup' | 'game'
  const [page, setPage] = useState('setup');

  const [players, setPlayers] = useState([
    { name: 'Player 1', scores: Array(MAX_RACKS).fill(0), selectedBall: '5-ball', pocketHistory: Array(MAX_RACKS).fill().map(() => []) },
    { name: 'Player 2', scores: Array(MAX_RACKS).fill(0), selectedBall: '5-ball', pocketHistory: Array(MAX_RACKS).fill().map(() => []) },
    { name: 'Player 3', scores: Array(MAX_RACKS).fill(0), selectedBall: '5-ball', pocketHistory: Array(MAX_RACKS).fill().map(() => []) },
  ]);

  // setup state: temporary list of player names (order matters)
  const [setupPlayers, setSetupPlayers] = useState(['Player 1', 'Player 2', 'Player 3']);
  const [rackNumber, setRackNumber] = useState(1);
  const [gameOver, setGameOver] = useState(false);

  const handleBallSelectionChange = (playerIndex, ball) => {
    const newPlayers = [...players];
    newPlayers[playerIndex].selectedBall = ball;
    setPlayers(newPlayers);
  };

  // Setup page helpers
  const setNumPlayers = (n) => {
    const newSetup = [...setupPlayers];
    while (newSetup.length < n) newSetup.push(`Player ${newSetup.length + 1}`);
    while (newSetup.length > n) newSetup.pop();
    setSetupPlayers(newSetup);
  };

  const handleSetupNameChange = (index, name) => {
    const s = [...setupPlayers];
    s[index] = name;
    setSetupPlayers(s);
  };

  const moveSetupPlayer = (index, dir) => {
    const s = [...setupPlayers];
    const swapIndex = index + dir;
    if (swapIndex < 0 || swapIndex >= s.length) return;
    [s[index], s[swapIndex]] = [s[swapIndex], s[index]];
    setSetupPlayers(s);
  };

  const startGame = () => {
    // initialize players state from setupPlayers
    const initial = setupPlayers.map(name => ({ name, scores: Array(MAX_RACKS).fill(0), selectedBall: '5-ball', pocketHistory: Array(MAX_RACKS).fill().map(() => []) }));
    setPlayers(initial);
    setRackNumber(1);
    setGameOver(false);
    setPage('game');
  };

  const backToSetup = () => {
    // populate setupPlayers from current players
    setSetupPlayers(players.map(p => p.name));
    setPage('setup');
  };

  const handleScore = (playerIndex, isSidePocket) => {
    if (gameOver) return;
    const selectedBall = players[playerIndex].selectedBall;
    const points = selectedBall === '5-ball' ? 1 : 2;
    const finalPoints = isSidePocket ? points * 2 : points;
    

    // clone players and pocketHistory arrays to avoid mutating state
    const newPlayers = players.map(p => ({ ...p, pocketHistory: p.pocketHistory ? p.pocketHistory.map(d => [...d]) : Array(MAX_RACKS).fill().map(() => []) }));
    const otherPlayers = newPlayers.filter((_, index) => index !== playerIndex);

    // Add points to the scoring player
    newPlayers[playerIndex].scores[rackNumber - 1] += finalPoints * otherPlayers.length;

    // append the two-letter code for this event (5S, 5C, 9S, 9C)
    const ballShort = selectedBall.startsWith('5') ? '5' : selectedBall.startsWith('9') ? '9' : selectedBall.charAt(0);
    const pocketShort = isSidePocket ? 'S' : 'C';
    const code = `${ballShort}${pocketShort}`;
    newPlayers[playerIndex].pocketHistory[rackNumber - 1].push(code);

    // Subtract points from other players
    otherPlayers.forEach(player => {
      player.scores[rackNumber - 1] -= finalPoints;
    });

    setPlayers(newPlayers);
  };

  const handleNewGame = () => {
  setPlayers(players.map(p => ({ ...p, scores: Array(MAX_RACKS).fill(0), selectedBall: '5-ball', pocketHistory: Array(MAX_RACKS).fill().map(() => []) })));
    setRackNumber(1);
    setGameOver(false);
  };

  const handleNextRack = () => {
    if (rackNumber + 1 > MAX_RACKS) {
      setGameOver(true);
    } else {
      setRackNumber(rackNumber + 1);
    }
  };

  const handlePlayerNameChange = (playerIndex, newName) => {
    const newPlayers = [...players];
    newPlayers[playerIndex].name = newName;
    setPlayers(newPlayers);
  };

  const totalScores = players.map(p => p.scores.reduce((a, b) => a + b, 0));

  if (page === 'setup') {
    return (
      <div className="app-container">
        <h1>5-9 Scorer — Setup</h1>
        <div className="setup-panel">
          <label>
            Number of players: 
            <select value={setupPlayers.length} onChange={(e) => setNumPlayers(Number(e.target.value))}>
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
              <option value={5}>5</option>
            </select>
          </label>

          <div className="setup-players">
            {setupPlayers.map((name, i) => (
              <div key={i} className="setup-player-row">
                <input value={name} onChange={(e) => handleSetupNameChange(i, e.target.value)} />
                <div className="setup-controls">
                  <button onClick={() => moveSetupPlayer(i, -1)} disabled={i === 0}>↑</button>
                  <button onClick={() => moveSetupPlayer(i, 1)} disabled={i === setupPlayers.length - 1}>↓</button>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 12 }}>
            <button onClick={startGame} className="next-rack-button">Start Game →</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <h1>5-9 Scorer</h1>
      <div style={{ marginBottom: 8 }}>
        <button onClick={backToSetup} className="reset-button">Back to Setup</button>
      </div>
      {gameOver ? (
        <div className="game-over-announcement">
          <h2>Game Over</h2>
          <button onClick={handleNewGame}>New Game</button>
        </div>
      ) : (
        <>
          <div className="main-content">
            <div className="scoreboard">
              <h3>Scoreboard</h3>
              <table>
                <thead>
                  <tr>
                    <th>Player</th>
                    {Array.from({ length: MAX_RACKS }, (_, i) => i + 1).map(rack => (
                      <th key={rack} className={rack === rackNumber ? 'current-rack' : ''}>Rack {rack}</th>
                    ))}
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {players.map((player, playerIndex) => (
                    <tr key={playerIndex}>
                      <td>{player.name}</td>
                      {player.scores.map((score, rackIndex) => {
                        const pocketArr = player.pocketHistory && player.pocketHistory[rackIndex] ? player.pocketHistory[rackIndex] : [];
                        return (
                          <td key={rackIndex} className={(rackIndex + 1 === rackNumber ? 'current-rack ' : '') + 'score-cell'}>
                            <div className="cell-top">{score}</div>
                            <div className="cell-bottom">
                              {pocketArr.map((d, i) => (
                                <span key={i} className="code-badge">{d}</span>
                              ))}
                            </div>
                          </td>
                        );
                      })}
                      <td>{totalScores[playerIndex]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="players-container">
              {players.map((player, index) => (
                <div key={index} className="player-card">
                  <input
                    type="text"
                    value={player.name}
                    onChange={(e) => handlePlayerNameChange(index, e.target.value)}
                    className="player-name-input"
                  />
                  <div className="ball-selection">
                    <label>
                      <input
                        type="radio"
                        value="5-ball"
                        checked={player.selectedBall === '5-ball'}
                        onChange={() => handleBallSelectionChange(index, '5-ball')}
                      />
                      5-ball
                    </label>
                    <label>
                      <input
                        type="radio"
                        value="9-ball"
                        checked={player.selectedBall === '9-ball'}
                        onChange={() => handleBallSelectionChange(index, '9-ball')}
                      />
                      9-ball
                    </label>
                  </div>
                  <div className="player-controls">
                    <button onClick={() => handleScore(index, false)}>Corner</button>
                    <button onClick={() => handleScore(index, true)}>Side</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button onClick={handleNextRack} className="next-rack-button">Next Rack</button>
          <button onClick={handleNewGame} className="reset-button">Reset Game</button>
        </>
      )}
    </div>
  );
}

export default App;
