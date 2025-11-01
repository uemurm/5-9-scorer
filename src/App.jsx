import { useState, useEffect } from 'react';
import './App.css';

function App() {
  // page: 'setup' | 'game'
  const [page, setPage] = useState('setup');
  const [maxRacks, setMaxRacks] = useState(5);

  // Define available balls and their base point values
  const BALLS = [
    { id: '3-ball', label: '3-ball', basePoints: 1 },
    { id: '5-ball', label: '5-ball', basePoints: 1 },
    { id: '7-ball', label: '7-ball', basePoints: 1 },
    { id: '9-ball', label: '9-ball', basePoints: 2 },
  ];

  // Preset sets that cycle on tap: 5-9 -> 5-7-9 -> 3-5-7-9
  const PRESETS = [
    ['5-ball', '9-ball'],
    ['5-ball', '7-ball', '9-ball'],
    ['3-ball', '5-ball', '7-ball', '9-ball'],
  ];

  const arraysEqual = (a = [], b = []) => a.length === b.length && a.every((v, i) => v === b[i]);

  // Choose a representative ball from a set for scoring (pick the highest-numbered ball)
  const getRepresentativeBall = (ballSet = []) => {
    if (!ballSet || ballSet.length === 0) return '5-ball';
    const nums = ballSet.map(s => parseInt(s, 10));
    const max = Math.max(...nums);
    return ballSet.find(s => parseInt(s, 10) === max) || ballSet[0];
  };

  const [players, setPlayers] = useState([
    { name: 'Player 1', scores: Array(5).fill(0), selectedBallSet: ['5-ball', '9-ball'], pocketHistory: Array(5).fill().map(() => []) },
    { name: 'Player 2', scores: Array(5).fill(0), selectedBallSet: ['5-ball', '9-ball'], pocketHistory: Array(5).fill().map(() => []) },
    { name: 'Player 3', scores: Array(5).fill(0), selectedBallSet: ['5-ball', '9-ball'], pocketHistory: Array(5).fill().map(() => []) },
  ]);

  // Score page: currently active player for scoring and selected scoring ball
  const [activePlayerIndex, setActivePlayerIndex] = useState(0);
  const [activeScoringBall, setActiveScoringBall] = useState(() => getRepresentativeBall(['5-ball','9-ball']));

  // Keep activeScoringBall in sync whenever the active player or their preset changes
  useEffect(() => {
    const set = players[activePlayerIndex]?.selectedBallSet || ['5-ball','9-ball'];
    setActiveScoringBall(getRepresentativeBall(set));
  }, [activePlayerIndex, players]);

  // setup state: temporary list of players with names and selected balls (order matters)
  const [setupPlayers, setSetupPlayers] = useState([
    { name: 'Player 1', selectedBallSet: ['5-ball', '9-ball'] },
    { name: 'Player 2', selectedBallSet: ['5-ball', '9-ball'] },
    { name: 'Player 3', selectedBallSet: ['5-ball', '9-ball'] },
  ]);
  const [rackNumber, setRackNumber] = useState(1);
  const [gameOver, setGameOver] = useState(false);

  // Note: in-game cycling of presets is intentionally disabled — presets are changed on Setup page only.

  // Setup page helpers
  const setNumPlayers = (n) => {
    const newSetup = setupPlayers.slice(0, n);
    while (newSetup.length < n) {
      newSetup.push({ 
        name: `Player ${newSetup.length + 1}`, 
        selectedBallSet: ['5-ball', '9-ball'] 
      });
    }
    while (newSetup.length > n) newSetup.pop();
    setSetupPlayers(newSetup);
  };

  const handleSetupNameChange = (index, name) => {
    const s = [...setupPlayers];
    s[index].name = name;
    setSetupPlayers(s);
  };

  const handleSetupCyclePreset = (index) => {
    const s = [...setupPlayers];
    const current = s[index].selectedBallSet || ['5-ball', '9-ball'];
    const idx = PRESETS.findIndex(p => arraysEqual(p, current));
    const next = PRESETS[(idx + 1) % PRESETS.length];
    s[index].selectedBallSet = next;
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
    const initial = setupPlayers.map(p => ({ 
      name: p.name, 
      scores: Array(maxRacks).fill(0), 
      selectedBallSet: p.selectedBallSet || ['5-ball', '9-ball'], 
      pocketHistory: Array(maxRacks).fill().map(() => []) 
    }));
    setPlayers(initial);
    setRackNumber(1);
    setGameOver(false);
    setPage('game');
  };

  const backToSetup = () => {
    // populate setupPlayers from current players
    setSetupPlayers(players.map(p => ({ name: p.name, selectedBallSet: p.selectedBallSet || ['5-ball', '9-ball'] })));
    setPage('setup');
  };

  const handleScore = (playerIndex, isSidePocket, scoringBall) => {
    if (gameOver) return;
    // If a specific scoringBall was provided (from the Score page radio), use it; otherwise derive representative
    const ballToUse = scoringBall || getRepresentativeBall(players[playerIndex].selectedBallSet || ['5-ball','9-ball']);
    const points = BALLS.find(b => b.id === ballToUse)?.basePoints || 1;
    const finalPoints = isSidePocket ? points * 2 : points;
    

    // clone players and pocketHistory arrays to avoid mutating state
    const newPlayers = players.map(p => ({ ...p, pocketHistory: p.pocketHistory ? p.pocketHistory.map(d => [...d]) : Array(maxRacks).fill().map(() => []) }));
    const otherPlayers = newPlayers.filter((_, index) => index !== playerIndex);

    // Add points to the scoring player
    newPlayers[playerIndex].scores[rackNumber - 1] += finalPoints * otherPlayers.length;

    // append the two-letter code for this event (3S, 3C, 5S, 5C, 7S, 7C, 9S, 9C)
  const ballShort = ballToUse.charAt(0);
    const pocketShort = isSidePocket ? 'S' : 'C';
    const code = `${ballShort}${pocketShort}`;
    newPlayers[playerIndex].pocketHistory[rackNumber - 1].push(code);

    // Subtract points from other players
    otherPlayers.forEach(player => {
      player.scores[rackNumber - 1] -= finalPoints;
    });

    setPlayers(newPlayers);

    // After scoring: if the ball used wasn't 9-ball, advance the activeScoringBall to the next larger ball in that player's preset (if any)
    if (ballToUse !== '9-ball') {
      const set = players[playerIndex].selectedBallSet || ['5-ball','9-ball'];
      const idx = set.indexOf(ballToUse);
      if (idx >= 0 && idx < set.length - 1) {
        const next = set[idx + 1];
        setActiveScoringBall(next);
      }
      // if not found or already last, leave as-is
    }
  };

  const handleNewGame = () => {
  // Reset only scores and pocket history. Keep player names and their selected presets from Setup.
  setPlayers(players.map(p => ({ ...p, scores: Array(maxRacks).fill(0), pocketHistory: Array(maxRacks).fill().map(() => []) })));
    setRackNumber(1);
    setGameOver(false);
  };

  const handleNextRack = () => {
    if (rackNumber + 1 > maxRacks) {
      setGameOver(true);
    } else {
      setRackNumber(rackNumber + 1);
    }
  };

  // Player names are editable on the Setup page; Score page no longer contains editable player-card elements.

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
          <label style={{ marginLeft: '16px' }}>
            Number of racks: 
            <select value={maxRacks} onChange={(e) => setMaxRacks(Number(e.target.value))}>
              {Array.from({ length: 8 }, (_, i) => i + 3).map(num => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </label>

          <div className="setup-players">
            {setupPlayers.map((player, i) => (
              <div key={i} className="setup-player-row">
                <input 
                  value={player.name} 
                  onChange={(e) => handleSetupNameChange(i, e.target.value)} 
                  placeholder="Player name"
                />
                <button className="preset-button" onClick={() => handleSetupCyclePreset(i)}>
                  {(player.selectedBallSet || ['5-ball','9-ball']).map(b => b.charAt(0)).join('-')}
                </button>
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
      <button onClick={backToSetup} className="reset-button" style={{left: 16, top: 16, right: 'auto', bottom: 'auto', position: 'absolute'}}>Back to Setup</button>
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
                    {Array.from({ length: maxRacks }, (_, i) => i + 1).map(rack => (
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
              <div className="scoring-panel">
                {/* 水平方向に3要素を並べる */}
                <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', width: '100%', gap: '24px', justifyContent: 'center'}}>
                  <label style={{margin: 0, display: 'flex', alignItems: 'center', gap: '8px', minWidth: '120px'}}>
                    Player:
                    <select value={activePlayerIndex} onChange={(e) => setActivePlayerIndex(Number(e.target.value))}>
                      {players.map((p, i) => (
                        <option key={i} value={i}>{p.name}</option>
                      ))}
                    </select>
                  </label>
                  <div className="ball-selection" style={{display: 'flex', gap: '8px', alignItems: 'center', padding: '0 12px', borderLeft: '1px solid #eee', borderRight: '1px solid #eee'}}>
                    {(players[activePlayerIndex]?.selectedBallSet || ['5-ball','9-ball']).map(b => (
                      <label key={b} className={`badge-radio ${activeScoringBall === b ? 'selected' : ''}`}>
                        <input
                          type="radio"
                          name="scoringBall"
                          value={b}
                          checked={activeScoringBall === b}
                          onChange={() => setActiveScoringBall(b)}
                        />
                        <span className="badge-text">{b.charAt(0)}</span>
                      </label>
                    ))}
                  </div>
                  <div className="player-controls" style={{display: 'flex', gap: '12px', alignItems: 'center'}}>
                    <button onClick={() => handleScore(activePlayerIndex, false, activeScoringBall)}>Corner</button>
                    <button onClick={() => handleScore(activePlayerIndex, true, activeScoringBall)}>Side</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <button onClick={handleNextRack} className="next-rack-button">Next Rack</button>
          <button onClick={handleNewGame} className="reset-button" style={{right: 24, bottom: 24, left: 'auto', top: 'auto', position: 'fixed'}}>Reset Game</button>
        </>
      )}
    </div>
  );
}

export default App;
