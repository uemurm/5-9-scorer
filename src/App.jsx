import { useState, useEffect } from 'react';
import './App.css';

const TARGET_SCORE = 7;

function App() {
  const [players, setPlayers] = useState([
    { name: 'Player 1', score: 0 },
    { name: 'Player 2', score: 0 },
  ]);
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    // Check for a winner whenever scores change
    players.forEach(player => {
      if (player.score >= TARGET_SCORE) {
        setWinner(player.name);
      }
    });
  }, [players]);

  const handleScore = (playerIndex, points) => {
    if (winner) return; // Stop scoring if there is already a winner

    const newPlayers = [...players];
    newPlayers[playerIndex].score += points;
    setPlayers(newPlayers);
  };

  const handleReset = () => {
    setPlayers(players.map(p => ({ ...p, score: 0 })));
    setWinner(null);
  };

  const handlePlayerNameChange = (playerIndex, newName) => {
    const newPlayers = [...players];
    newPlayers[playerIndex].name = newName;
    setPlayers(newPlayers);
  };


  return (
    <div className="app-container">
      <h1>5-9 Scorer</h1>
      {winner ? (
        <div className="winner-announcement">
          <h2>{winner} Wins!</h2>
          <button onClick={handleReset}>New Game</button>
        </div>
      ) : (
        <>
          <div className="players-container">
            {players.map((player, index) => (
              <div key={index} className="player-card">
                <input
                  type="text"
                  value={player.name}
                  onChange={(e) => handlePlayerNameChange(index, e.target.value)}
                  className="player-name-input"
                />
                <div className="player-score">{player.score}</div>
                <div className="player-controls">
                  <button onClick={() => handleScore(index, 1)}>+1 pt (9-ball)</button>
                  <button onClick={() => handleScore(index, 2)}>+2 pts (5-ball)</button>
                </div>
              </div>
            ))}
          </div>
          <button onClick={handleReset} className="reset-button">Reset Game</button>
        </>
      )}
    </div>
  );
}

export default App;