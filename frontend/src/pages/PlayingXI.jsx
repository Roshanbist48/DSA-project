import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MatchContext } from '../context/MatchContext';
import playingImage from '../assets/playing.jpg';

const PlayingXI = () => {
  const { match, updateMatchState } = useContext(MatchContext);
  const navigate = useNavigate();

  const [team1Players, setTeam1Players] = useState(Array(11).fill({ name: '', role: 'bat' }));
  const [team2Players, setTeam2Players] = useState(Array(11).fill({ name: '', role: 'bat' }));

  useEffect(() => {
    if (!match) {
      alert('No match details found. Redirecting to score page.');
      navigate('/score');
    }
  }, [match, navigate]);

  const handlePlayerChange = (team, index, field, value) => {
    if (team === 'team1') {
      const newPlayers = [...team1Players];
      newPlayers[index] = { ...newPlayers[index], [field]: value };
      setTeam1Players(newPlayers);
    } else {
      const newPlayers = [...team2Players];
      newPlayers[index] = { ...newPlayers[index], [field]: value };
      setTeam2Players(newPlayers);
    }
  };

  const handleSubmitPlayers = async () => {
    if (team1Players.some((p) => !p.name.trim()) || team2Players.some((p) => !p.name.trim())) {
      alert('Please fill in all player names');
      return;
    }

    const formatPlayer = (p, teamName) => ({
      ...p,
      team: teamName,
      battingStats: { runs: 0, balls: 0, fours: 0, sixes: 0, dismissal: '' },
      bowlingStats: { runs: 0, balls: 0, overs: 0, wickets: 0, maidens: 0 },
    });

    const formattedTeam1 = team1Players.map((p) => formatPlayer(p, match.team1));
    const formattedTeam2 = team2Players.map((p) => formatPlayer(p, match.team2));

    const updatedMatch = {
      ...match,
      team1Players: formattedTeam1,
      team2Players: formattedTeam2,
      players: [...formattedTeam1, ...formattedTeam2],
    };

    await updateMatchState(updatedMatch);
    navigate('/sheet');
  };

  if (!match) return <div className="min-h-screen bg-slate-950" />;

  return (
    <div
      className="min-h-screen bg-slate-950 text-slate-100"
      style={{
        backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.92), rgba(15, 23, 42, 0.92)), url(${playingImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-white/10 bg-slate-950/90 p-8 shadow-2xl shadow-slate-950/40 backdrop-blur-xl">
          <div className="mb-10 text-center">
            <p className="text-sm uppercase tracking-[0.35em] text-brand-orange">Playing XI</p>
            <h1 className="mt-4 text-4xl font-bold text-white">Set Your Lineup</h1>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6">
              <h2 className="mb-4 text-xl font-semibold text-white">{match.team1}</h2>
              <div className="space-y-3">
                {team1Players.map((player, index) => (
                  <div key={`t1-${index}`} className="flex flex-col gap-3 rounded-3xl border border-white/10 bg-slate-950/70 p-4 sm:flex-row sm:items-center">
                    <input
                      type="text"
                      placeholder={`Player ${index + 1}`}
                      value={player.name}
                      onChange={(e) => handlePlayerChange('team1', index, 'name', e.target.value)}
                      className="flex-1 rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-slate-100 outline-none transition focus:border-brand-orange"
                    />
                    <select
                      value={player.role}
                      onChange={(e) => handlePlayerChange('team1', index, 'role', e.target.value)}
                      className="w-full rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-slate-100 outline-none transition focus:border-brand-orange sm:w-40"
                    >
                      <option value="bat">Bat</option>
                      <option value="bowl">Bowl</option>
                      <option value="allrounder">Allrounder</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-6">
              <h2 className="mb-4 text-xl font-semibold text-white">{match.team2}</h2>
              <div className="space-y-3">
                {team2Players.map((player, index) => (
                  <div key={`t2-${index}`} className="flex flex-col gap-3 rounded-3xl border border-white/10 bg-slate-950/70 p-4 sm:flex-row sm:items-center">
                    <input
                      type="text"
                      placeholder={`Player ${index + 1}`}
                      value={player.name}
                      onChange={(e) => handlePlayerChange('team2', index, 'name', e.target.value)}
                      className="flex-1 rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-slate-100 outline-none transition focus:border-brand-orange"
                    />
                    <select
                      value={player.role}
                      onChange={(e) => handlePlayerChange('team2', index, 'role', e.target.value)}
                      className="w-full rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-slate-100 outline-none transition focus:border-brand-orange sm:w-40"
                    >
                      <option value="bat">Bat</option>
                      <option value="bowl">Bowl</option>
                      <option value="allrounder">Allrounder</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <button
            onClick={handleSubmitPlayers}
            className="mt-10 w-full rounded-full bg-brand-orange px-6 py-4 text-lg font-semibold text-slate-950 transition hover:bg-orange-500"
          >
            Submit Players
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlayingXI;
