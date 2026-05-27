import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { MatchContext } from '../context/MatchContext';
import playingImage from '../assets/playing.jpg';

const ScoreSettings = () => {
  const [team1, setTeam1] = useState('');
  const [team2, setTeam2] = useState('');
  const [tossWinner, setTossWinner] = useState('team1');
  const [opted, setOpted] = useState('bat');
  const [overs, setOvers] = useState(20);
  const navigate = useNavigate();
  const { startMatchSession } = useContext(MatchContext);

  const handleStartMatch = async () => {
    const t1 = team1.trim() || 'Team 1';
    const t2 = team2.trim() || 'Team 2';
    const tossWinnerName = tossWinner === 'team1' ? t1 : t2;
    const battingFirst = opted === 'bat' ? tossWinnerName : tossWinnerName === t1 ? t2 : t1;

    const matchDetails = {
      team1: t1,
      team2: t2,
      tossWinner: tossWinnerName,
      battingFirst,
      overs: Number(overs),
    };

    await startMatchSession(matchDetails);
    navigate('/playing11');
  };

  return (
    <div
      className="min-h-screen bg-slate-950 text-slate-100"
      style={{
        backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.88), rgba(15, 23, 42, 0.88)), url(${playingImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="mx-auto flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-xl rounded-[2rem] border border-white/10 bg-slate-950/90 p-8 shadow-2xl shadow-slate-950/40 backdrop-blur-xl">
          <div className="mb-8 text-center">
            <p className="text-sm uppercase tracking-[0.45em] text-brand-orange">Match Setup</p>
            <h1 className="mt-4 text-3xl font-bold text-white">Start a New Match</h1>
          </div>

          <div className="space-y-6">
            <div>
              <label className="mb-3 block text-sm font-semibold text-slate-200">Teams</label>
              <input
                type="text"
                value={team1}
                onChange={(e) => setTeam1(e.target.value)}
                placeholder="Team 1"
                className="w-full rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-slate-100 outline-none transition focus:border-brand-orange"
              />
              <input
                type="text"
                value={team2}
                onChange={(e) => setTeam2(e.target.value)}
                placeholder="Team 2"
                className="mt-4 w-full rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-slate-100 outline-none transition focus:border-brand-orange"
              />
            </div>

            <div>
              <p className="mb-3 text-sm font-semibold text-slate-200">Toss won by?</p>
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 rounded-full border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-slate-100 transition hover:border-brand-orange">
                  <input
                    type="radio"
                    name="toss"
                    value="team1"
                    checked={tossWinner === 'team1'}
                    onChange={(e) => setTossWinner(e.target.value)}
                    className="h-4 w-4 accent-brand-orange"
                  />
                  {team1 || 'Team 1'}
                </label>
                <label className="flex items-center gap-2 rounded-full border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-slate-100 transition hover:border-brand-orange">
                  <input
                    type="radio"
                    name="toss"
                    value="team2"
                    checked={tossWinner === 'team2'}
                    onChange={(e) => setTossWinner(e.target.value)}
                    className="h-4 w-4 accent-brand-orange"
                  />
                  {team2 || 'Team 2'}
                </label>
              </div>
            </div>

            <div>
              <p className="mb-3 text-sm font-semibold text-slate-200">Opted to?</p>
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 rounded-full border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-slate-100 transition hover:border-brand-orange">
                  <input
                    type="radio"
                    name="option"
                    value="bat"
                    checked={opted === 'bat'}
                    onChange={(e) => setOpted(e.target.value)}
                    className="h-4 w-4 accent-brand-orange"
                  />
                  Bat
                </label>
                <label className="flex items-center gap-2 rounded-full border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-slate-100 transition hover:border-brand-orange">
                  <input
                    type="radio"
                    name="option"
                    value="bowl"
                    checked={opted === 'bowl'}
                    onChange={(e) => setOpted(e.target.value)}
                    className="h-4 w-4 accent-brand-orange"
                  />
                  Bowl
                </label>
              </div>
            </div>

            <div>
              <label className="mb-3 block text-sm font-semibold text-slate-200">Overs</label>
              <input
                type="number"
                value={overs}
                onChange={(e) => setOvers(e.target.value)}
                className="w-full rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-slate-100 outline-none transition focus:border-brand-orange"
              />
            </div>

            <button
              onClick={handleStartMatch}
              className="w-full rounded-full bg-brand-orange px-6 py-3 text-base font-semibold text-slate-950 transition hover:bg-orange-500"
            >
              Start Match
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScoreSettings;
