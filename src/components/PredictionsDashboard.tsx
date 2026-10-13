import React, { useState } from 'react';
import { Match, RiskLevel, LeagueId, SubscriptionTier } from '../types/soccer';
import { LEAGUES } from '../data/mockSoccerData';
import { Search, Flame, ShieldAlert, Award, ChevronRight, Lock, ExternalLink, Calendar, MapPin, Sparkles } from 'lucide-react';

interface PredictionsDashboardProps {
  matches: Match[];
  userTier: SubscriptionTier;
  onSelectMatch: (match: Match) => void;
  onUpgradeTier: () => void;
  onNavigateToFeedback: () => void;
}

export const PredictionsDashboard: React.FC<PredictionsDashboardProps> = ({
  matches,
  userTier,
  onSelectMatch,
  onUpgradeTier,
  onNavigateToFeedback,
}) => {
  const [selectedLeague, setSelectedLeague] = useState<LeagueId | 'all'>('all');
  const [selectedRisk, setSelectedRisk] = useState<RiskLevel | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMatches = matches.filter((m) => {
    if (selectedLeague !== 'all' && m.leagueId !== selectedLeague) return false;
    if (selectedRisk !== 'all' && m.prediction.riskLevel !== selectedRisk) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchText = `${m.homeTeam.name} ${m.awayTeam.name} ${m.venue} ${m.leagueName} ${m.prediction.pick}`.toLowerCase();
      if (!matchText.includes(q)) return false;
    }
    return true;
  });

  const getRiskBadge = (risk: RiskLevel) => {
    switch (risk) {
      case 'low':
        return {
          label: 'Low Risk',
          textClass: 'text-emerald-400',
          bgClass: 'bg-emerald-500/10 border-emerald-500/30',
          dotClass: 'bg-emerald-400',
        };
      case 'medium':
        return {
          label: 'Medium Risk',
          textClass: 'text-amber-400',
          bgClass: 'bg-amber-500/10 border-amber-500/30',
          dotClass: 'bg-amber-400',
        };
      case 'high':
        return {
          label: 'High Risk / +EV',
          textClass: 'text-rose-400',
          bgClass: 'bg-rose-500/10 border-rose-500/30',
          dotClass: 'bg-rose-400',
        };
    }
  };

  const isLocked = (match: Match) => {
    if (userTier === 'vip') return false;
    if (userTier === 'pro') {
      return match.prediction.riskLevel === 'high' || match.isVipOnly;
    }
    // Free tier can only see 1 Low Risk pick without lock
    return match.prediction.riskLevel !== 'low' || match.isVipOnly;
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Editorial Hero Banner featuring real generated stadium imagery */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-md">
        <img
          src="/src/assets/images/psl_stadium_atmosphere_1791917568719.jpg"
          alt="South African soccer match day"
          className="w-full h-36 sm:h-44 object-cover brightness-[0.65]"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent flex flex-col justify-end p-4">
          <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold mb-1">
            <span>🇿🇦 Soweto Derby & International Leagues</span>
            <span>·</span>
            <span>AI Odds Engine</span>
          </div>
          <h1 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
            Predictive Match Intelligence
          </h1>
          <p className="text-xs text-slate-300 max-w-md line-clamp-2 mt-0.5">
            Calibrated probabilistic models across South African Betway PSL, Premier League, Champions League, and La Liga.
          </p>
        </div>
      </div>

      {/* Quick Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search teams (Sundowns, Pirates, Arsenal) or markets..."
          className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
        />
      </div>

      {/* Risk Filter Segmented Control */}
      <div>
        <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5 px-0.5">
          <span className="font-medium text-slate-300">Model Risk Level</span>
          <span className="text-[11px] text-slate-400">Filtered by probability threshold</span>
        </div>
        <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-900 rounded-xl border border-slate-800">
          <button
            onClick={() => setSelectedRisk('all')}
            className={`py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              selectedRisk === 'all'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Tiers
          </button>
          <button
            onClick={() => setSelectedRisk('low')}
            className={`py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1 ${
              selectedRisk === 'low'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>Low Risk</span>
          </button>
          <button
            onClick={() => setSelectedRisk('medium')}
            className={`py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1 ${
              selectedRisk === 'medium'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            <span>Medium</span>
          </button>
          <button
            onClick={() => setSelectedRisk('high')}
            className={`py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1 ${
              selectedRisk === 'high'
                ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
            <span>High Risk</span>
          </button>
        </div>
      </div>

      {/* League Selection Horizontal Scroller */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setSelectedLeague('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
            selectedLeague === 'all'
              ? 'bg-slate-800 text-white border border-slate-700'
              : 'bg-slate-900/70 text-slate-400 hover:text-slate-200 border border-slate-800'
          }`}
        >
          All Competitions
        </button>
        {LEAGUES.map((league) => (
          <button
            key={league.id}
            onClick={() => setSelectedLeague(league.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 cursor-pointer ${
              selectedLeague === league.id
                ? 'bg-slate-800 text-white border border-slate-700'
                : 'bg-slate-900/70 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <span>{league.flag}</span>
            <span>{league.name}</span>
          </button>
        ))}
      </div>

      {/* Match Cards List */}
      <div className="space-y-3">
        {filteredMatches.length === 0 ? (
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 text-center text-slate-400">
            <p className="text-sm font-medium">No matches found matching these criteria.</p>
            <button
              onClick={() => {
                setSelectedLeague('all');
                setSelectedRisk('all');
                setSearchQuery('');
              }}
              className="mt-2 text-xs text-emerald-400 underline cursor-pointer"
            >
              Clear filters
            </button>
          </div>
        ) : (
          filteredMatches.map((match) => {
            const riskInfo = getRiskBadge(match.prediction.riskLevel);
            const locked = isLocked(match);

            return (
              <div
                key={match.id}
                onClick={() => (locked ? onUpgradeTier() : onSelectMatch(match))}
                className="group relative bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 transition-all shadow-sm cursor-pointer"
              >
                {/* Card Top Strip */}
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2.5">
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-slate-300">{match.leagueName}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1 text-[11px] text-slate-400">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      {match.venue}
                    </span>
                  </div>
                  <div className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border flex items-center gap-1 ${riskInfo.bgClass} ${riskInfo.textClass}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${riskInfo.dotClass}`}></span>
                    <span>{riskInfo.label}</span>
                  </div>
                </div>

                {/* Teams Row */}
                <div className="flex items-center justify-between py-2 border-y border-slate-800/60">
                  {/* Home Team */}
                  <div className="flex items-center gap-2.5 flex-1 min-w-0">
                    <span className="text-xl shrink-0">{match.homeTeam.logo}</span>
                    <div className="min-w-0">
                      <span className="text-sm font-bold text-white block truncate">{match.homeTeam.name}</span>
                      <div className="flex items-center gap-1 text-[10px] text-slate-400">
                        <span>Rank #{match.homeTeam.position}</span>
                        <span>·</span>
                        <span className="font-mono text-emerald-400">{match.homeTeam.form.join('')}</span>
                      </div>
                    </div>
                  </div>

                  {/* VS and Kickoff Time */}
                  <div className="px-3 text-center shrink-0">
                    <span className="text-xs font-mono font-bold text-slate-400 block">VS</span>
                    <span className="text-[10px] text-slate-500 whitespace-nowrap">
                      {new Date(match.kickoffTime).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </span>
                  </div>

                  {/* Away Team */}
                  <div className="flex items-center justify-end gap-2.5 flex-1 min-w-0 text-right">
                    <div className="min-w-0">
                      <span className="text-sm font-bold text-white block truncate">{match.awayTeam.name}</span>
                      <div className="flex items-center justify-end gap-1 text-[10px] text-slate-400">
                        <span className="font-mono text-emerald-400">{match.awayTeam.form.join('')}</span>
                        <span>·</span>
                        <span>Rank #{match.awayTeam.position}</span>
                      </div>
                    </div>
                    <span className="text-xl shrink-0">{match.awayTeam.logo}</span>
                  </div>
                </div>

                {/* Prediction Strip */}
                {locked ? (
                  <div className="mt-3 p-3 bg-slate-950/90 rounded-xl border border-amber-500/30 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-amber-400 shrink-0" />
                      <div>
                        <span className="text-xs font-bold text-amber-300 block">
                          Premium {riskInfo.label} Algorithm
                        </span>
                        <span className="text-[11px] text-slate-400">
                          Upgrade to Pro or VIP to unlock deep +EV probabilities & live bookmaker odds edge.
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onUpgradeTier();
                      }}
                      className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg shrink-0 shadow-sm transition-all"
                    >
                      Unlock
                    </button>
                  </div>
                ) : (
                  <div className="mt-3 pt-1">
                    <div className="bg-slate-950/70 rounded-xl p-2.5 border border-slate-800 flex items-start justify-between gap-3">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-medium uppercase tracking-wider">
                          Recommended Market
                        </span>
                        <span className="text-xs font-bold text-emerald-300 block mt-0.5">
                          {match.prediction.pick}
                        </span>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                          <span>Confidence: <strong className="text-emerald-400 font-mono">{match.prediction.confidence}%</strong></span>
                          <span>·</span>
                          <span>Best Odds: <strong className="text-white font-mono">{match.prediction.recommendedOdds.toFixed(2)}</strong></span>
                          <span>·</span>
                          <span>Model Edge: <strong className="text-amber-400 font-mono">+{match.prediction.modelExpectedValue}%</strong></span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-[10px] text-slate-400 block font-medium">Kelly Stake</span>
                        <span className="text-xs font-mono font-bold text-white bg-slate-900 px-2 py-0.5 rounded border border-slate-800 block mt-0.5">
                          {match.prediction.kellyStakeUnits} Units
                        </span>
                      </div>
                    </div>

                    {/* Bookmaker Odds Comparative Strip */}
                    <div className="grid grid-cols-4 gap-1.5 mt-2 text-center text-[10px]">
                      {match.odds.map((odd) => (
                        <div key={odd.bookmaker} className="bg-slate-950/40 p-1 rounded-lg border border-slate-800/60">
                          <span className="text-slate-400 block font-medium truncate">{odd.bookmaker}</span>
                          <span className="font-mono text-slate-200 font-semibold">{odd.homeWin.toFixed(2)} / {odd.awayWin.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between mt-2.5 text-[11px] text-slate-400">
                      <span className="truncate max-w-[240px] text-slate-400">
                        💡 {match.prediction.rationale[0]}
                      </span>
                      <span className="text-emerald-400 font-medium group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-0.5 shrink-0">
                        Full Analysis <ChevronRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
