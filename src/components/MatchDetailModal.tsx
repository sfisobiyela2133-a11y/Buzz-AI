import React from 'react';
import { Match, RiskLevel } from '../types/soccer';
import { X, Calendar, MapPin, Shield, Zap, TrendingUp, AlertTriangle, CheckCircle2, Bookmark, Share2 } from 'lucide-react';

interface MatchDetailModalProps {
  match: Match | null;
  onClose: () => void;
  onBookmark?: (matchId: string) => void;
}

export const MatchDetailModal: React.FC<MatchDetailModalProps> = ({
  match,
  onClose,
  onBookmark,
}) => {
  if (!match) return null;

  const { homeTeam, awayTeam, prediction, odds, headToHead } = match;

  const riskLabel =
    prediction.riskLevel === 'low'
      ? 'Low Risk (Conservative)'
      : prediction.riskLevel === 'medium'
      ? 'Medium Risk (Balanced)'
      : 'High Risk (High Value / Underdog)';

  const riskColor =
    prediction.riskLevel === 'low'
      ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
      : prediction.riskLevel === 'medium'
      ? 'text-amber-400 bg-amber-500/10 border-amber-500/30'
      : 'text-rose-400 bg-rose-500/10 border-rose-500/30';

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl shadow-2xl text-slate-100 flex flex-col">
        {/* Mobile Drag Handle */}
        <div className="w-12 h-1.5 bg-slate-700/80 rounded-full mx-auto my-3 sm:hidden"></div>

        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {match.leagueName}
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-slate-500" />
              {match.city}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-5">
          {/* Match Scoreboard Lockup */}
          <div className="bg-slate-950/80 rounded-2xl p-4 border border-slate-800/90 text-center">
            <div className="grid grid-cols-3 items-center">
              {/* Home Team */}
              <div className="text-center">
                <span className="text-3xl block mb-1">{homeTeam.logo}</span>
                <span className="text-sm font-bold text-white block truncate">{homeTeam.name}</span>
                <span className="text-[11px] text-slate-400">Rank #{homeTeam.position}</span>
                <div className="flex items-center justify-center gap-0.5 mt-1 font-mono text-[10px]">
                  {homeTeam.form.map((f, i) => (
                    <span
                      key={i}
                      className={`w-4 h-4 rounded flex items-center justify-center ${
                        f === 'W' ? 'bg-emerald-500/20 text-emerald-400' : f === 'D' ? 'bg-slate-800 text-slate-300' : 'bg-rose-500/20 text-rose-400'
                      }`}
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>

              {/* VS Info */}
              <div>
                <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest block">VS</span>
                <span className="text-[11px] text-slate-400 block mt-1">
                  {new Date(match.kickoffTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <span className="text-[10px] text-emerald-400 font-semibold block mt-0.5">
                  {match.venue}
                </span>
              </div>

              {/* Away Team */}
              <div className="text-center">
                <span className="text-3xl block mb-1">{awayTeam.logo}</span>
                <span className="text-sm font-bold text-white block truncate">{awayTeam.name}</span>
                <span className="text-[11px] text-slate-400">Rank #{awayTeam.position}</span>
                <div className="flex items-center justify-center gap-0.5 mt-1 font-mono text-[10px]">
                  {awayTeam.form.map((f, i) => (
                    <span
                      key={i}
                      className={`w-4 h-4 rounded flex items-center justify-center ${
                        f === 'W' ? 'bg-emerald-500/20 text-emerald-400' : f === 'D' ? 'bg-slate-800 text-slate-300' : 'bg-rose-500/20 text-rose-400'
                      }`}
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Core Prediction Box */}
          <div className="bg-slate-950/90 rounded-2xl p-4 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className={`text-[11px] font-bold uppercase px-2.5 py-0.5 rounded-full border ${riskColor}`}>
                {riskLabel}
              </span>
              <span className="text-xs font-mono text-emerald-400 font-bold">
                +{prediction.modelExpectedValue}% Expected Value (+EV)
              </span>
            </div>

            <div>
              <span className="text-[11px] text-slate-400 block font-medium">Model Recommendation</span>
              <h3 className="text-base font-extrabold text-white mt-0.5">
                {prediction.pick}
              </h3>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80 text-center">
              <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Probability</span>
                <span className="text-sm font-bold text-emerald-400 font-mono">{prediction.confidence}%</span>
              </div>
              <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Recommended Odds</span>
                <span className="text-sm font-bold text-white font-mono">{prediction.recommendedOdds.toFixed(2)}</span>
              </div>
              <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Kelly Stake</span>
                <span className="text-sm font-bold text-amber-400 font-mono">{prediction.kellyStakeUnits} Units</span>
              </div>
            </div>
          </div>

          {/* Statistical Modeling & Expected Goals (xG) Comparison */}
          <div className="bg-slate-950/70 rounded-2xl p-4 border border-slate-800 space-y-3">
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
              Poisson & Expected Goals (xG) Comparison
            </h4>

            {/* xG Bar */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300">{homeTeam.shortName}: <strong className="font-mono text-emerald-400">{homeTeam.avgExpectedGoals} xG</strong></span>
                <span className="text-slate-400 text-[11px]">Avg Shot Quality / 90</span>
                <span className="text-slate-300"><strong className="font-mono text-emerald-400">{awayTeam.avgExpectedGoals} xG</strong> :{awayTeam.shortName}</span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-800 flex overflow-hidden">
                <div
                  className="bg-emerald-500 h-full"
                  style={{ width: `${(homeTeam.avgExpectedGoals / (homeTeam.avgExpectedGoals + awayTeam.avgExpectedGoals)) * 100}%` }}
                ></div>
                <div
                  className="bg-cyan-500 h-full"
                  style={{ width: `${(awayTeam.avgExpectedGoals / (homeTeam.avgExpectedGoals + awayTeam.avgExpectedGoals)) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Attack & Defense Ratings */}
            <div className="grid grid-cols-2 gap-2 text-xs pt-1">
              <div className="bg-slate-900/50 p-2 rounded-xl border border-slate-800/80">
                <span className="text-[10px] text-slate-400 block">{homeTeam.shortName} Profile</span>
                <div className="flex items-center justify-between mt-1">
                  <span>Attack: <strong className="font-mono text-white">{homeTeam.attackRating}</strong></span>
                  <span>Defense: <strong className="font-mono text-white">{homeTeam.defenseRating}</strong></span>
                </div>
              </div>
              <div className="bg-slate-900/50 p-2 rounded-xl border border-slate-800/80">
                <span className="text-[10px] text-slate-400 block">{awayTeam.shortName} Profile</span>
                <div className="flex items-center justify-between mt-1">
                  <span>Attack: <strong className="font-mono text-white">{awayTeam.attackRating}</strong></span>
                  <span>Defense: <strong className="font-mono text-white">{awayTeam.defenseRating}</strong></span>
                </div>
              </div>
            </div>
          </div>

          {/* Bookmaker Odds Comparison */}
          <div className="bg-slate-950/70 rounded-2xl p-4 border border-slate-800 space-y-2">
            <h4 className="text-xs font-bold text-white">Live Bookmaker Odds Board</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-slate-500 border-b border-slate-800 text-[11px]">
                    <th className="pb-1.5 font-medium">Bookmaker</th>
                    <th className="pb-1.5 font-medium text-center">1 (Home)</th>
                    <th className="pb-1.5 font-medium text-center">X (Draw)</th>
                    <th className="pb-1.5 font-medium text-center">2 (Away)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {odds.map((o) => (
                    <tr key={o.bookmaker} className="hover:bg-slate-900/50">
                      <td className="py-2 text-slate-300 font-sans font-medium">{o.bookmaker}</td>
                      <td className="py-2 text-center text-white">{o.homeWin.toFixed(2)}</td>
                      <td className="py-2 text-center text-white">{o.draw.toFixed(2)}</td>
                      <td className="py-2 text-center text-white">{o.awayWin.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tactical Rationale */}
          <div className="bg-slate-950/70 rounded-2xl p-4 border border-slate-800 space-y-2 text-xs">
            <h4 className="text-xs font-bold text-white">Statistical Model Rationale</h4>
            <ul className="space-y-1.5 text-slate-300 list-disc list-inside">
              {prediction.rationale.map((point, idx) => (
                <li key={idx} className="leading-relaxed">
                  {point}
                </li>
              ))}
            </ul>

            <div className="pt-2 border-t border-slate-800 space-y-1 text-[11px] text-slate-400">
              <p><strong>Tactical Edge:</strong> {prediction.keyFactors.tacticalAdvantage}</p>
              <p><strong>Team News:</strong> {prediction.keyFactors.injuryImpact}</p>
              <p><strong>Pitch / Altitude:</strong> {prediction.keyFactors.weatherOrPitch}</p>
            </div>
          </div>
        </div>

        {/* Modal Bottom CTA */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-between gap-3 bg-slate-950">
          <button
            onClick={() => onBookmark && onBookmark(match.id)}
            className="p-2.5 rounded-xl border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
            title="Bookmark match"
          >
            <Bookmark className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all text-center"
          >
            Close Sheet
          </button>
        </div>
      </div>
    </div>
  );
};
