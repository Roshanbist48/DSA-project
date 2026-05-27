import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { MatchContext } from '../context/MatchContext';
import playingImage from '../assets/playing.jpg';

const Summary = () => {
  const { match } = useContext(MatchContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!match) {
      alert('No match data found!');
      navigate('/score');
    }
  }, [match, navigate]);

  if (!match) return <div className="min-h-screen bg-slate-950" />;

  const mergeSortBatsmen = (arr) => {
    if (arr.length <= 1) return arr;
    const mid = Math.floor(arr.length / 2);
    const left = mergeSortBatsmen(arr.slice(0, mid));
    const right = mergeSortBatsmen(arr.slice(mid));
    const result = [];
    while (left.length && right.length) {
      if (left[0].battingStats.runs >= right[0].battingStats.runs) {
        result.push(left.shift());
      } else {
        result.push(right.shift());
      }
    }
    return [...result, ...left, ...right];
  };

  const getTopPerformers = () => {
    const sortedBatsmen = mergeSortBatsmen(match.players.filter((p) => p.battingStats.runs > 0)).slice(0, 3);
    const sortedBowlers = [...match.players]
      .filter((p) => p.bowlingStats.wickets > 0)
      .sort((a, b) => b.bowlingStats.wickets - a.bowlingStats.wickets)
      .slice(0, 3);
    return { sortedBatsmen, sortedBowlers };
  };

  const { sortedBatsmen, sortedBowlers } = getTopPerformers();

  const firstInningsBatting = match.players.filter((p) => p.team === match.battingFirst && p.battingStats.balls > 0);
  const firstInningsBowling = match.players.filter((p) => p.team !== match.battingFirst && p.bowlingStats.balls > 0);
  const secondInningsBatting = match.players.filter((p) => p.team !== match.battingFirst && p.battingStats.balls > 0);
  const secondInningsBowling = match.players.filter((p) => p.team === match.battingFirst && p.bowlingStats.balls > 0);

  let resultString = 'Match Drawn!';
  if (match.score.runs > match.firstInningsScore.runs) {
    resultString = `${match.battingFirst === match.team1 ? match.team2 : match.team1} won by ${10 - match.score.wickets} wickets`;
  } else if (match.score.runs < match.firstInningsScore.runs) {
    resultString = `${match.battingFirst} won by ${match.firstInningsScore.runs - match.score.runs} runs`;
  }

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
        <div className="rounded-[2rem] border border-white/10 bg-slate-950/95 p-8 shadow-2xl shadow-slate-950/40 backdrop-blur-xl">
          <div className="mb-10 text-center">
            <h2 className="text-4xl font-bold text-white">Match Summary</h2>
          </div>

          <div className="space-y-10">
            <section className="rounded-3xl border border-white/10 bg-slate-900/70 p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-lg font-semibold text-brand-orange">{match.battingFirst}</div>
                <div className="text-lg text-white">{match.firstInningsScore.runs}/{match.firstInningsScore.wickets} ({match.firstInningsScore.overs}.{match.firstInningsScore.balls})</div>
              </div>
              <div className="mt-6 grid gap-6 lg:grid-cols-2">
                <table className="min-w-full table-auto rounded-3xl border border-white/10 bg-slate-950/80 text-left text-sm text-slate-100">
                  <thead>
                    <tr className="border-b border-white/10 text-slate-300">
                      <th className="px-4 py-3">Player</th>
                      <th className="px-4 py-3">Runs</th>
                      <th className="px-4 py-3">Balls</th>
                    </tr>
                  </thead>
                  <tbody>
                    {firstInningsBatting.map((p, i) => (
                      <tr key={i} className="border-b border-white/10">
                        <td className="px-4 py-3">{p.name}{p.battingStats.dismissal ? ' †' : ''}</td>
                        <td className="px-4 py-3">{p.battingStats.runs}</td>
                        <td className="px-4 py-3">{p.battingStats.balls}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <table className="min-w-full table-auto rounded-3xl border border-white/10 bg-slate-950/80 text-left text-sm text-slate-100">
                  <thead>
                    <tr className="border-b border-white/10 text-slate-300">
                      <th className="px-4 py-3">Bowler</th>
                      <th className="px-4 py-3">W</th>
                      <th className="px-4 py-3">R</th>
                      <th className="px-4 py-3">O</th>
                    </tr>
                  </thead>
                  <tbody>
                    {firstInningsBowling.map((p, i) => (
                      <tr key={i} className="border-b border-white/10">
                        <td className="px-4 py-3">{p.name}</td>
                        <td className="px-4 py-3">{p.bowlingStats.wickets}</td>
                        <td className="px-4 py-3">{p.bowlingStats.runs}</td>
                        <td className="px-4 py-3">{Math.floor(p.bowlingStats.balls / 6)}.{p.bowlingStats.balls % 6}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="rounded-3xl border border-white/10 bg-slate-900/70 p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-lg font-semibold text-brand-orange">{match.battingFirst === match.team1 ? match.team2 : match.team1}</div>
                <div className="text-lg text-white">{match.score.runs}/{match.score.wickets} ({match.score.overs}.{match.score.balls})</div>
              </div>
              <div className="mt-6 grid gap-6 lg:grid-cols-2">
                <table className="min-w-full table-auto rounded-3xl border border-white/10 bg-slate-950/80 text-left text-sm text-slate-100">
                  <thead>
                    <tr className="border-b border-white/10 text-slate-300">
                      <th className="px-4 py-3">Player</th>
                      <th className="px-4 py-3">Runs</th>
                      <th className="px-4 py-3">Balls</th>
                    </tr>
                  </thead>
                  <tbody>
                    {secondInningsBatting.map((p, i) => (
                      <tr key={i} className="border-b border-white/10">
                        <td className="px-4 py-3">{p.name}{p.battingStats.dismissal ? ' †' : ''}</td>
                        <td className="px-4 py-3">{p.battingStats.runs}</td>
                        <td className="px-4 py-3">{p.battingStats.balls}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <table className="min-w-full table-auto rounded-3xl border border-white/10 bg-slate-950/80 text-left text-sm text-slate-100">
                  <thead>
                    <tr className="border-b border-white/10 text-slate-300">
                      <th className="px-4 py-3">Bowler</th>
                      <th className="px-4 py-3">W</th>
                      <th className="px-4 py-3">R</th>
                      <th className="px-4 py-3">O</th>
                    </tr>
                  </thead>
                  <tbody>
                    {secondInningsBowling.map((p, i) => (
                      <tr key={i} className="border-b border-white/10">
                        <td className="px-4 py-3">{p.name}</td>
                        <td className="px-4 py-3">{p.bowlingStats.wickets}</td>
                        <td className="px-4 py-3">{p.bowlingStats.runs}</td>
                        <td className="px-4 py-3">{Math.floor(p.bowlingStats.balls / 6)}.{p.bowlingStats.balls % 6}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <div className="rounded-3xl border border-brand-orange/20 bg-slate-950/80 p-6 text-center text-brand-orange">
              {resultString}
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-6 text-center">
                <h3 className="mb-4 text-xl font-semibold text-white">Top Batsmen</h3>
                <table className="min-w-full table-auto text-sm text-slate-100">
                  <thead>
                    <tr className="border-b border-white/10 text-slate-300">
                      <th className="px-4 py-3">Player</th>
                      <th className="px-4 py-3">Runs</th>
                      <th className="px-4 py-3">SR</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedBatsmen.map((p, i) => (
                      <tr key={i} className="border-b border-white/10">
                        <td className="px-4 py-3">{p.name}</td>
                        <td className="px-4 py-3">{p.battingStats.runs}</td>
                        <td className="px-4 py-3">{((p.battingStats.runs / p.battingStats.balls) * 100 || 0).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-6 text-center">
                <h3 className="mb-4 text-xl font-semibold text-white">Top Bowlers</h3>
                <table className="min-w-full table-auto text-sm text-slate-100">
                  <thead>
                    <tr className="border-b border-white/10 text-slate-300">
                      <th className="px-4 py-3">Player</th>
                      <th className="px-4 py-3">Wkts</th>
                      <th className="px-4 py-3">Eco</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedBowlers.map((p, i) => {
                      const totalOvers = Math.floor(p.bowlingStats.balls / 6) + (p.bowlingStats.balls % 6) / 6;
                      const economy = totalOvers > 0 ? (p.bowlingStats.runs / totalOvers).toFixed(2) : '0.00';
                      return (
                        <tr key={i} className="border-b border-white/10">
                          <td className="px-4 py-3">{p.name}</td>
                          <td className="px-4 py-3">{p.bowlingStats.wickets}</td>
                          <td className="px-4 py-3">{economy}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <button
              onClick={() => navigate('/sheet')}
              className="mx-auto mt-6 rounded-full bg-brand-orange px-8 py-3 text-base font-semibold text-slate-950 transition hover:bg-orange-500"
            >
              Back to Score Sheet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Summary;
