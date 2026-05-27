import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { MatchContext } from '../context/MatchContext';
import playingImage from '../assets/playing.jpg';

const ScoreSheet = () => {
  const { match, updateMatchState } = useContext(MatchContext);
  const navigate = useNavigate();

  const [currentInnings, setCurrentInnings] = useState(1);
  const [striker, setStriker] = useState(null);
  const [nonStriker, setNonStriker] = useState(null);
  const [currentBowler, setCurrentBowler] = useState(null);
  const [availableBatsmen, setAvailableBatsmen] = useState([]);
  const [availableBowlers, setAvailableBowlers] = useState([]);
  const [isMatchStarted, setIsMatchStarted] = useState(false);
  const [partnerships, setPartnerships] = useState([]);
  const [actionHistory, setActionHistory] = useState([]);
  const [extrasState, setExtrasState] = useState({
    wide: false,
    noBall: false,
    byes: false,
    legByes: false,
    wicket: false,
  });
  const [showPartnershipModal, setShowPartnershipModal] = useState(false);

  useEffect(() => {
    if (!match) {
      alert('No match found! Start a new match.');
      navigate('/score');
      return;
    }
    loadMatchDetails();
  }, [match?.battingFirst, match?.players]);

  const loadMatchDetails = () => {
    if (!match) return;
    const batsmen = match.players.filter((p) => p.team === match.battingFirst && !p.battingStats.dismissal);
    const bowlers = match.players.filter((p) => p.team !== match.battingFirst);
    setAvailableBatsmen(batsmen);
    setAvailableBowlers(bowlers);
  };

  const updatePlayersInMatch = (s, ns, b, newMatchProps) => {
    const updatedPlayers = match.players.map((p) => {
      if (s && p.name === s.name) return s;
      if (ns && p.name === ns.name) return ns;
      if (b && p.name === b.name) return b;
      return p;
    });

    return {
      ...match,
      players: updatedPlayers,
      ...newMatchProps,
    };
  };

  const handleScoreUpdate = async (runs) => {
    if (!isMatchStarted) return alert('Start the match first!');
    if (!striker || !nonStriker || !currentBowler) return alert('Select players first!');

    setActionHistory((prev) => [
      ...prev,
      {
        match: JSON.parse(JSON.stringify(match)),
        striker: JSON.parse(JSON.stringify(striker)),
        nonStriker: JSON.parse(JSON.stringify(nonStriker)),
        currentBowler: JSON.parse(JSON.stringify(currentBowler)),
        currentInnings,
        partnerships: JSON.parse(JSON.stringify(partnerships)),
      },
    ]);

    const isWide = extrasState.wide;
    const isNoBall = extrasState.noBall;
    const isByes = extrasState.byes;
    const isLegByes = extrasState.legByes;
    const isWicket = extrasState.wicket;

    let runsToAdd = runs;
    let ballsBowled = 1;
    let extras = 0;
    const updatedMatch = { ...match, extras: { ...match.extras }, score: { ...match.score } };

    if (isWide || isNoBall) {
      extras = runs + 1;
      ballsBowled = 0;
      if (isWide) updatedMatch.extras.wide += extras;
      if (isNoBall) updatedMatch.extras.noBall += extras;
    } else if (isByes || isLegByes) {
      extras = runs;
      runsToAdd = 0;
      if (isByes) updatedMatch.extras.byes += extras;
      if (isLegByes) updatedMatch.extras.legByes += extras;
    }

    let updatedStriker = { ...striker };
    let updatedNonStriker = { ...nonStriker };
    let updatedBowler = { ...currentBowler };

    if (!isWide && !isNoBall) {
      updatedMatch.score.balls += ballsBowled;
      updatedBowler.bowlingStats.runs += runsToAdd + extras;
      updatedBowler.bowlingStats.balls += ballsBowled;

      if (updatedMatch.score.balls >= 6) {
        updatedMatch.score.overs += 1;
        updatedMatch.score.balls = 0;
        alert('Over completed! Select new bowler.');
        [updatedStriker, updatedNonStriker] = [updatedNonStriker, updatedStriker];
      }
    }

    if (!isWide && !isNoBall && !isByes && !isLegByes) {
      updatedStriker.battingStats.runs += runsToAdd;
      updatedStriker.battingStats.balls += ballsBowled;
      if (runsToAdd === 4) updatedStriker.battingStats.fours += 1;
      if (runsToAdd === 6) updatedStriker.battingStats.sixes += 1;
    }

    if (isWide || isNoBall) {
      updatedBowler.bowlingStats.runs += runsToAdd + extras;
      updatedBowler.bowlingStats.balls += ballsBowled;
    }

    if (updatedBowler.bowlingStats.balls >= 6) {
      updatedBowler.bowlingStats.overs += Math.floor(updatedBowler.bowlingStats.balls / 6);
      updatedBowler.bowlingStats.balls = updatedBowler.bowlingStats.balls % 6;
    }

    updatedMatch.score.runs += runsToAdd + extras;

    if (isWicket && !isWide && !isNoBall) {
      updatedMatch.score.wickets += 1;
      updatedStriker.battingStats.dismissal = 'Out';
      updatedBowler.bowlingStats.wickets += 1;
      const newAvailable = availableBatsmen.filter((b) => b.name !== updatedStriker.name);
      setAvailableBatsmen(newAvailable);
      if (newAvailable.length > 0) {
        const availableNames = newAvailable.map((p, i) => `${i}: ${p.name}`).join('\n');
        const selection = prompt(`Select new batsman:\n${availableNames}`);
        const index = parseInt(selection, 10);
        if (!Number.isNaN(index) && index >= 0 && index < newAvailable.length) {
          updatedStriker = { ...newAvailable[index] };
        } else {
          alert('Invalid selection! Auto-selecting next batsman.');
          updatedStriker = { ...newAvailable[0] };
        }
      } else {
        alert('No more batsmen available!');
      }
    } else if ((runsToAdd % 2 !== 0) || isWide || isNoBall) {
      [updatedStriker, updatedNonStriker] = [updatedNonStriker, updatedStriker];
    }

    if (ballsBowled === 1 && !isWide && !isNoBall && updatedMatch.score.balls === 0) {
      setCurrentBowler(null);
    } else {
      setCurrentBowler(updatedBowler);
    }

    setStriker(updatedStriker);
    setNonStriker(updatedNonStriker);
    setExtrasState({ wide: false, noBall: false, byes: false, legByes: false, wicket: false });

    const newMatchObj = updatePlayersInMatch(updatedStriker, updatedNonStriker, updatedBowler, updatedMatch);
    updatePartnershipsData(updatedStriker, updatedNonStriker);
    await updateMatchState(newMatchObj);
    checkInningsEnd(newMatchObj);
  };

  const updatePartnershipsData = (s, ns) => {
    if (!s || !ns) return;
    setPartnerships((prev) => {
      const existing = prev.find(
        (p) =>
          (p.batsmen[0] === s.name && p.batsmen[1] === ns.name) ||
          (p.batsmen[0] === ns.name && p.batsmen[1] === s.name),
      );
      if (existing) {
        return prev.map((p) =>
          p === existing
            ? { ...p, runs: s.battingStats.runs + ns.battingStats.runs, balls: s.battingStats.balls + ns.battingStats.balls }
            : p,
        );
      }
      return [...prev, { batsmen: [s.name, ns.name], runs: s.battingStats.runs + ns.battingStats.runs, balls: s.battingStats.balls + ns.battingStats.balls }];
    });
  };

  const checkInningsEnd = (currentMatchObj) => {
    const isAllOut = currentMatchObj.score.wickets >= 10;
    const isOversCompleted = currentMatchObj.score.overs >= currentMatchObj.totalOvers;
    if (isAllOut || isOversCompleted) {
      if (currentInnings === 1) {
        const targetObj = {
          runs: currentMatchObj.score.runs,
          wickets: currentMatchObj.score.wickets,
          overs: currentMatchObj.score.overs,
          balls: currentMatchObj.score.balls,
        };
        alert(`First innings ended! Target: ${targetObj.runs + 1}`);
        const nextMatchObj = {
          ...currentMatchObj,
          firstInningsScore: targetObj,
          battingFirst: currentMatchObj.battingFirst === currentMatchObj.team1 ? currentMatchObj.team2 : currentMatchObj.team1,
          score: { runs: 0, wickets: 0, overs: 0, balls: 0 },
        };
        setCurrentInnings(2);
        setPartnerships([]);
        setStriker(null);
        setNonStriker(null);
        setCurrentBowler(null);
        setIsMatchStarted(false);
        updateMatchState(nextMatchObj);
      } else {
        endMatch(currentMatchObj);
      }
    } else if (currentInnings === 2 && currentMatchObj.score.runs > currentMatchObj.firstInningsScore.runs) {
      endMatch(currentMatchObj);
    }
  };

  const endMatch = (finalMatchObj) => {
    updateMatchState(finalMatchObj).then(() => {
      navigate('/summary');
    });
  };

  const undoLastAction = async () => {
    if (actionHistory.length === 0) return alert('Nothing to undo!');
    const prevState = actionHistory[actionHistory.length - 1];
    setCurrentInnings(prevState.currentInnings);
    setStriker(prevState.striker);
    setNonStriker(prevState.nonStriker);
    setCurrentBowler(prevState.currentBowler);
    setPartnerships(prevState.partnerships);
    setActionHistory((prev) => prev.slice(0, -1));
    await updateMatchState(prevState.match);
  };

  const handleCustomRuns = () => {
    const runs = parseInt(prompt('Enter custom runs:'), 10) || 0;
    handleScoreUpdate(runs);
  };

  if (!match) return <div className="min-h-screen bg-slate-950" />;

  const crr = match.score.overs + match.score.balls / 6 > 0 ? (match.score.runs / (match.score.overs + match.score.balls / 6)).toFixed(2) : '0.00';

  return (
    <div
      className="min-h-screen bg-slate-950 text-slate-100"
      style={{
        backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.9)), url(${playingImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-white/10 bg-slate-950/95 p-6 shadow-2xl shadow-slate-950/40 backdrop-blur-xl">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-2xl font-bold text-white">{match.team1} vs {match.team2}</h2>
            <button
              type="button"
              onClick={() => navigate('/summary')}
              className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:bg-brand-orange hover:text-slate-950"
            >
              📋 Summary
            </button>
          </div>

          <div className="mt-8 rounded-3xl border border-white/10 bg-slate-900/80 p-6">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="text-sm uppercase tracking-[0.35em] text-brand-orange">{currentInnings === 1 ? 'First Innings' : 'Second Innings'}</div>
                {currentInnings === 2 && match.firstInningsScore.runs > 0 && (
                  <p className="mt-2 text-slate-300">
                    Target: <span className="font-semibold text-white">{match.firstInningsScore.runs + 1}</span> — Need <span className="font-semibold text-white">{match.firstInningsScore.runs + 1 - match.score.runs}</span> runs
                  </p>
                )}
              </div>
              <div className="rounded-3xl bg-slate-950/90 px-6 py-4 text-center text-white shadow-lg shadow-black/20">
                <p className="text-sm uppercase tracking-[0.35em] text-slate-400">Score</p>
                <p className="mt-2 text-3xl font-bold text-brand-orange">{match.score.runs}/{match.score.wickets}</p>
                <p className="mt-1 text-sm text-slate-300">({match.score.overs}.{match.score.balls})</p>
                <p className="mt-2 text-sm text-slate-300">CRR: {crr}</p>
              </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              <div className="space-y-4 rounded-3xl border border-white/10 bg-slate-950/80 p-5">
                <h3 className="text-lg font-semibold text-white">Select Striker</h3>
                <select
                  value={striker?.name || ''}
                  onChange={(e) => setStriker(availableBatsmen.find((b) => b.name === e.target.value))}
                  className="w-full rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-slate-100 outline-none focus:border-brand-orange"
                >
                  <option value="">Select Striker</option>
                  {availableBatsmen.map((b) => (
                    <option key={`s-${b.name}`} value={b.name}>{b.name}</option>
                  ))}
                </select>
                <select
                  value={nonStriker?.name || ''}
                  onChange={(e) => setNonStriker(availableBatsmen.find((b) => b.name === e.target.value))}
                  className="w-full rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-slate-100 outline-none focus:border-brand-orange"
                >
                  <option value="">Select Non-Striker</option>
                  {availableBatsmen.map((b) => (
                    <option key={`ns-${b.name}`} value={b.name}>{b.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-4 rounded-3xl border border-white/10 bg-slate-950/80 p-5">
                <h3 className="text-lg font-semibold text-white">Select Bowler</h3>
                <select
                  value={currentBowler?.name || ''}
                  onChange={(e) => setCurrentBowler(availableBowlers.find((b) => b.name === e.target.value))}
                  className="w-full rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-slate-100 outline-none focus:border-brand-orange"
                >
                  <option value="">Select Bowler</option>
                  {availableBowlers.map((b) => (
                    <option key={`bw-${b.name}`} value={b.name}>{b.name}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => setIsMatchStarted(true)}
                disabled={isMatchStarted}
                className="mt-2 rounded-full bg-brand-orange px-6 py-4 text-sm font-semibold text-slate-950 transition hover:bg-orange-500 disabled:cursor-not-allowed disabled:bg-slate-700"
              >
                {isMatchStarted ? 'Match In Progress' : 'Start Match'}
              </button>
            </div>
          </div>

          <div className="mt-8 overflow-hidden rounded-3xl border border-white/10 bg-slate-950/80 p-4">
            <table className="min-w-full divide-y divide-white/10 text-left text-sm text-slate-100">
              <thead className="bg-slate-900/80 text-slate-300">
                <tr>
                  <th className="px-4 py-3">Batsman</th>
                  <th className="px-4 py-3">Run</th>
                  <th className="px-4 py-3">Ball</th>
                  <th className="px-4 py-3">4s</th>
                  <th className="px-4 py-3">6s</th>
                  <th className="px-4 py-3">SR</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {[striker, nonStriker].map((player, idx) => (
                  <tr key={idx}>
                    <td className="px-4 py-3">{player ? `${player.name}${idx === 0 ? '*' : ''}` : ''}</td>
                    <td className="px-4 py-3">{player?.battingStats.runs || 0}</td>
                    <td className="px-4 py-3">{player?.battingStats.balls || 0}</td>
                    <td className="px-4 py-3">{player?.battingStats.fours || 0}</td>
                    <td className="px-4 py-3">{player?.battingStats.sixes || 0}</td>
                    <td className="px-4 py-3">{player ? ((player.battingStats.runs / player.battingStats.balls) * 100).toFixed(2) || '0.00' : '0.00'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 overflow-hidden rounded-3xl border border-white/10 bg-slate-950/80 p-4">
            <table className="min-w-full divide-y divide-white/10 text-left text-sm text-slate-100">
              <thead className="bg-slate-900/80 text-slate-300">
                <tr>
                  <th className="px-4 py-3">Bowler</th>
                  <th className="px-4 py-3">Over</th>
                  <th className="px-4 py-3">Maiden</th>
                  <th className="px-4 py-3">Run</th>
                  <th className="px-4 py-3">Wicket</th>
                  <th className="px-4 py-3">ER</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                <tr>
                  <td className="px-4 py-3">{currentBowler?.name || ''}</td>
                  <td className="px-4 py-3">{currentBowler ? `${currentBowler.bowlingStats.overs}.${currentBowler.bowlingStats.balls}` : 0}</td>
                  <td className="px-4 py-3">{currentBowler?.bowlingStats.maidens || 0}</td>
                  <td className="px-4 py-3">{currentBowler?.bowlingStats.runs || 0}</td>
                  <td className="px-4 py-3">{currentBowler?.bowlingStats.wickets || 0}</td>
                  <td className="px-4 py-3">
                    {currentBowler ? (currentBowler.bowlingStats.runs / ((currentBowler.bowlingStats.overs * 6 + currentBowler.bowlingStats.balls) / 6) || 0).toFixed(2) : '0.00'}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-5">
              <h3 className="mb-4 text-lg font-semibold text-white">Extras</h3>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  ['Wide', match.extras.wide],
                  ['No Ball', match.extras.noBall],
                  ['Byes', match.extras.byes],
                  ['Leg Byes', match.extras.legByes],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between rounded-3xl bg-slate-900/80 px-4 py-3 text-sm text-slate-200">
                    <span>{label}</span>
                    <span className="font-semibold text-white">{value}</span>
                  </div>
                ))}
                <div className="col-span-full rounded-3xl bg-brand-orange/15 px-4 py-3 text-sm font-semibold text-brand-orange">
                  Total: {match.extras.wide + match.extras.noBall + match.extras.byes + match.extras.legByes}
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-5">
              <h3 className="mb-4 text-lg font-semibold text-white">Extras Controls</h3>
              <div className="grid gap-3">
                {[
                  ['wide', 'Wide'],
                  ['noBall', 'No Ball'],
                  ['byes', 'Byes'],
                  ['legByes', 'Leg Byes'],
                  ['wicket', 'Wicket'],
                ].map(([key, label]) => (
                  <label key={key} className="flex cursor-pointer items-center gap-3 rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-sm text-slate-200 transition hover:border-brand-orange">
                    <input
                      type="checkbox"
                      checked={extrasState[key]}
                      onChange={(e) => setExtrasState({ ...extrasState, [key]: e.target.checked })}
                      className="h-4 w-4 accent-brand-orange"
                    />
                    {label}
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <button
              onClick={undoLastAction}
              className="rounded-full bg-slate-800 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              Undo
            </button>
            <button
              onClick={() => setShowPartnershipModal(true)}
              className="rounded-full bg-brand-orange px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-orange-500"
            >
              Show Partnerships
            </button>
          </div>

          <div className="mt-6 grid grid-cols-7 gap-2">
            {[0, 1, 2, 3, 4, 5, 6].map((runs) => (
              <button
                key={runs}
                type="button"
                onClick={() => handleScoreUpdate(runs)}
                className="rounded-2xl bg-slate-800 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
              >
                {runs}
              </button>
            ))}
            <button
              type="button"
              onClick={handleCustomRuns}
              className="rounded-2xl bg-brand-orange px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-orange-500"
            >
              +
            </button>
          </div>

          {showPartnershipModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 px-4 py-8">
              <div className="w-full max-w-2xl rounded-[2rem] border border-white/10 bg-slate-900/95 p-8 shadow-2xl shadow-slate-950/50">
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white">Partnerships</h3>
                  <button
                    type="button"
                    onClick={() => setShowPartnershipModal(false)}
                    className="rounded-full bg-white/10 px-4 py-2 text-sm text-slate-100 transition hover:bg-white/20"
                  >
                    Close
                  </button>
                </div>
                <div className="space-y-3">
                  {partnerships.length > 0 ? (
                    partnerships.map((p, i) => (
                      <div key={i} className="rounded-3xl bg-slate-950/80 px-4 py-3 text-slate-200">
                        {i + 1}. {p.batsmen.join(' & ')}: {p.runs} runs ({p.balls} balls)
                      </div>
                    ))
                  ) : (
                    <p className="text-slate-400">No partnerships recorded yet.</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScoreSheet;
