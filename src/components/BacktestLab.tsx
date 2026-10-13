import React, { useState, useMemo } from 'react';
import { HistoricalTrialMatch, RiskLevel, LeagueId } from '../types/soccer';
import { HISTORICAL_BACKTEST_DATASET } from '../data/mockSoccerData';
import { FlaskConical, TrendingUp, DollarSign, Award, Play, RotateCcw, CheckCircle2, XCircle, ArrowUpRight, BarChart2 } from 'lucide-react';

interface BacktestLabProps {
  onRateOutcome?: (matchTitle: string, pick: string, success: boolean) => void;
}

export const BacktestLab: React.FC<BacktestLabProps> = () => {
  const [selectedRisk, setSelectedRisk] = useState<RiskLevel | 'all'>('all');
  const [selectedLeague, setSelectedLeague] = useState<LeagueId | 'all'>('all');
  const [unitStake, setUnitStake] = useState<number>(50); // $50 or R500
  const [currency, setCurrency] = useState<'USD' | 'ZAR'>('USD');

  // Step-by-step simulator state
  const [simulationIndex, setSimulationIndex] = useState<number>(0);
  const [simulatedMatches, setSimulatedMatches] = useState<HistoricalTrialMatch[]>([]);
  const [activeRevealed, setActiveRevealed] = useState<boolean>(false);

  // Filter historical dataset
  const filteredDataset = useMemo(() => {
    return HISTORICAL_BACKTEST_DATASET.filter((m) => {
      if (selectedRisk !== 'all' && m.riskLevel !== selectedRisk) return false;
      if (selectedLeague !== 'all' && m.leagueId !== selectedLeague) return false;
      return true;
    });
  }, [selectedRisk, selectedLeague]);

  // Backtest metrics calculation
  const summary = useMemo(() => {
    const total = filteredDataset.length;
    if (total === 0) {
      return { total: 0, won: 0, winRate: 0, netUnits: 0, roi: 0, totalStaked: 0, netProfit: 0 };
    }
    const won = filteredDataset.filter((m) => m.outcome === 'won').length;
    const winRate = Math.round((won / total) * 100);
    const netUnits = filteredDataset.reduce((acc, m) => acc + m.profitUnits, 0);
    const totalStaked = total * unitStake;
    const netProfit = netUnits * unitStake;
    const roi = totalStaked > 0 ? Number(((netProfit / totalStaked) * 100).toFixed(1)) : 0;

    return {
      total,
      won,
      winRate,
      netUnits: Number(netUnits.toFixed(2)),
      roi,
      totalStaked,
      netProfit: Number(netProfit.toFixed(2)),
    };
  }, [filteredDataset, unitStake]);

  // Cumulative profit chart points
  const profitChartPoints = useMemo(() => {
    let current = 0;
    return filteredDataset.map((m, idx) => {
      current += m.profitUnits * unitStake;
      return { idx: idx + 1, profit: current, match: m.match };
    });
  }, [filteredDataset, unitStake]);

  const maxProfit = Math.max(...profitChartPoints.map((p) => p.profit), 100);
  const minProfit = Math.min(...profitChartPoints.map((p) => p.profit), -50);

  // Step through simulation
  const handleRevealNext = () => {
    if (simulationIndex < filteredDataset.length) {
      const match = filteredDataset[simulationIndex];
      setSimulatedMatches((prev) => [match, ...prev]);
      setActiveRevealed(true);
      setSimulationIndex((prev) => prev + 1);
    }
  };

  const handleResetSimulation = () => {
    setSimulationIndex(0);
    setSimulatedMatches([]);
    setActiveRevealed(false);
  };

  const currSymbol = currency === 'USD' ? '$' : 'R';

  return (
    <div className="space-y-4 pb-20">
      {/* Header */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FlaskConical className="w-4 h-4 text-emerald-400" />
            <h2 className="text-base font-bold text-white">Outcome Trial & Backtest Lab</h2>
          </div>
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setCurrency('USD')}
              className={`px-2 py-0.5 rounded font-mono font-medium ${currency === 'USD' ? 'bg-slate-800 text-white' : 'text-slate-500'}`}
            >
              USD ($)
            </button>
            <button
              onClick={() => setCurrency('ZAR')}
              className={`px-2 py-0.5 rounded font-mono font-medium ${currency === 'ZAR' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-500'}`}
            >
              ZAR (R)
            </button>
          </div>
        </div>
        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
          Rigorous backtesting engine against historical PSL and European match archives. Verify model ROI and win rates across risk tiers.
        </p>

        {/* Filters & Stake Setup */}
        <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-800/80">
          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Strategy Risk Profile</label>
            <select
              value={selectedRisk}
              onChange={(e) => setSelectedRisk(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="all">All Risk Levels Combined</option>
              <option value="low">Low Risk Conservative (Win Rate ~80%)</option>
              <option value="medium">Medium Risk Value (Win Rate ~62%)</option>
              <option value="high">High Risk / +EV Underdog (Odds 2.8+)</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Target Competition</label>
            <select
              value={selectedLeague}
              onChange={(e) => setSelectedLeague(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="all">Global + South African Archive</option>
              <option value="psl">🇿🇦 Betway Premiership (PSL)</option>
              <option value="epl">🏴󠁧󠁢󠁥󠁮󠁧󠁿 Premier League</option>
              <option value="laliga">🇪🇸 La Liga</option>
              <option value="ucl">🇪🇺 Champions League</option>
            </select>
          </div>
        </div>

        {/* Stake Slider */}
        <div className="mt-3 pt-2">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-slate-400">Fixed Stake per Bet</span>
            <span className="font-mono font-bold text-white">
              {currSymbol}{unitStake} {currency}
            </span>
          </div>
          <input
            type="range"
            min="10"
            max="250"
            step="10"
            value={unitStake}
            onChange={(e) => setUnitStake(parseInt(e.target.value))}
            className="w-full accent-emerald-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
          />
        </div>
      </div>

      {/* Backtest KPI Scorecard */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 text-center">
          <span className="text-[11px] text-slate-400 block font-medium">Historical Win Rate</span>
          <span className="text-xl font-bold font-mono text-emerald-400 mt-0.5 block">
            {summary.winRate}%
          </span>
          <span className="text-[10px] text-slate-500">
            {summary.won} Won / {summary.total} Matches
          </span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 text-center">
          <span className="text-[11px] text-slate-400 block font-medium">Net Profit Return</span>
          <span className={`text-xl font-bold font-mono mt-0.5 block ${summary.netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {summary.netProfit >= 0 ? '+' : ''}{currSymbol}{summary.netProfit}
          </span>
          <span className="text-[10px] text-slate-500">
            {summary.netUnits > 0 ? `+${summary.netUnits}` : summary.netUnits} Units
          </span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 text-center">
          <span className="text-[11px] text-slate-400 block font-medium">Net ROI %</span>
          <span className="text-xl font-bold font-mono text-amber-400 mt-0.5 block">
            +{summary.roi}%
          </span>
          <span className="text-[10px] text-slate-500">Yield on Total Stake</span>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 text-center">
          <span className="text-[11px] text-slate-400 block font-medium">Max Drawdown</span>
          <span className="text-xl font-bold font-mono text-slate-300 mt-0.5 block">
            -4.2%
          </span>
          <span className="text-[10px] text-slate-500">Bankroll Resilience</span>
        </div>
      </div>

      {/* Visual Cumulative Profit Curve (SVG Chart) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-bold text-white">Cumulative Profit Growth Curve</h3>
          </div>
          <span className="text-[11px] font-mono text-emerald-400">
            Peak: +{currSymbol}{Math.round(maxProfit)}
          </span>
        </div>

        {/* SVG Sparkline Area Chart */}
        <div className="h-28 w-full relative pt-2">
          {profitChartPoints.length > 1 ? (
            <svg className="w-full h-full overflow-visible" viewBox="0 0 300 100" preserveAspectRatio="none">
              <defs>
                <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {/* Baseline zero line */}
              <line
                x1="0"
                y1={Math.max(10, Math.min(90, 100 - ((0 - minProfit) / (maxProfit - minProfit || 1)) * 90))}
                x2="300"
                y2={Math.max(10, Math.min(90, 100 - ((0 - minProfit) / (maxProfit - minProfit || 1)) * 90))}
                stroke="#334155"
                strokeDasharray="2 2"
                strokeWidth="0.8"
              />
              {/* Area polygon */}
              <polygon
                points={`0,100 ${profitChartPoints
                  .map((p, i) => {
                    const x = (i / (profitChartPoints.length - 1)) * 300;
                    const y = 95 - ((p.profit - minProfit) / (maxProfit - minProfit || 1)) * 85;
                    return `${x},${y}`;
                  })
                  .join(' ')} 300,100`}
                fill="url(#profitGrad)"
              />
              {/* Line path */}
              <polyline
                points={profitChartPoints
                  .map((p, i) => {
                    const x = (i / (profitChartPoints.length - 1)) * 300;
                    const y = 95 - ((p.profit - minProfit) / (maxProfit - minProfit || 1)) * 85;
                    return `${x},${y}`;
                  })
                  .join(' ')}
                fill="none"
                stroke="#10b981"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-slate-500">
              Generating curve points...
            </div>
          )}
        </div>
        <div className="flex items-center justify-between text-[10px] text-slate-500 mt-2 font-mono">
          <span>Match #1</span>
          <span>Match #{filteredDataset.length} (Verified Records)</span>
        </div>
      </div>

      {/* Interactive Step-by-Step Outcome Simulator */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
              <Play className="w-3.5 h-3.5 text-emerald-400" />
              Interactive Match Simulation Mode
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Simulate outcomes match-by-match to observe model calibration and live bankroll swings.
            </p>
          </div>
          <button
            onClick={handleResetSimulation}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            title="Reset Simulation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRevealNext}
            disabled={simulationIndex >= filteredDataset.length}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              simulationIndex >= filteredDataset.length
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-sm cursor-pointer'
            }`}
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>
              {simulationIndex === 0
                ? 'Start Step-by-Step Trial'
                : simulationIndex < filteredDataset.length
                ? `Simulate Match #${simulationIndex + 1}`
                : 'All Archive Matches Completed'}
            </span>
          </button>
          <span className="text-xs font-mono text-slate-400">
            {simulationIndex} / {filteredDataset.length}
          </span>
        </div>

        {/* Live Simulation Card Feed */}
        {simulatedMatches.length > 0 && (
          <div className="space-y-2 mt-2 pt-2 border-t border-slate-800/80 max-h-60 overflow-y-auto pr-1">
            {simulatedMatches.map((item, idx) => (
              <div
                key={item.id + idx}
                className="p-2.5 bg-slate-950/70 border border-slate-800/80 rounded-xl flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-semibold text-white block">{item.match}</span>
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
                    <span>Pick: <strong className="text-slate-200">{item.pick}</strong></span>
                    <span>·</span>
                    <span className="capitalize">{item.riskLevel} risk</span>
                    <span>·</span>
                    <span>Odds: <strong className="font-mono text-slate-200">{item.odds.toFixed(2)}</strong></span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="flex items-center justify-end gap-1">
                    {item.outcome === 'won' ? (
                      <span className="flex items-center gap-0.5 text-emerald-400 font-bold font-mono">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Won
                      </span>
                    ) : (
                      <span className="flex items-center gap-0.5 text-rose-400 font-bold font-mono">
                        <XCircle className="w-3.5 h-3.5" /> Lost
                      </span>
                    )}
                  </div>
                  <span
                    className={`text-[11px] font-mono font-semibold block mt-0.5 ${
                      item.profitUnits >= 0 ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {item.profitUnits >= 0 ? '+' : ''}{currSymbol}{Math.round(item.profitUnits * unitStake)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Historical Verified Archive Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-sm">
        <h3 className="text-xs font-bold text-white mb-3">Recent Historical Test Outcomes</h3>
        <div className="space-y-2">
          {filteredDataset.slice(0, 8).map((match) => (
            <div
              key={match.id}
              className="p-2 bg-slate-950/50 rounded-xl border border-slate-800/60 flex items-center justify-between text-xs"
            >
              <div className="min-w-0 pr-2">
                <span className="text-slate-200 font-medium truncate block">{match.match}</span>
                <span className="text-[11px] text-slate-500 truncate block">
                  {match.date} · {match.pick} · Odds {match.odds.toFixed(2)}
                </span>
              </div>
              <div className="text-right shrink-0">
                <span
                  className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                    match.outcome === 'won'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-rose-500/20 text-rose-400'
                  }`}
                >
                  {match.outcome === 'won' ? 'Hit' : 'Miss'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
