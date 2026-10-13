import React, { useState } from 'react';
import { Match, UserMatchFeedback, RiskLevel } from '../types/soccer';
import { CheckCircle2, Star, ThumbsUp, ThumbsDown, MessageSquare, Sparkles, Filter, AlertCircle, ArrowUpRight } from 'lucide-react';

interface PastMatchesFeedbackViewProps {
  matches: Match[];
  userFeedbacks: UserMatchFeedback[];
  onSubmitFeedback: (feedback: Omit<UserMatchFeedback, 'id' | 'createdAt' | 'appliedToModel'>) => void;
  onNavigateToRetrain: () => void;
}

export const PastMatchesFeedbackView: React.FC<PastMatchesFeedbackViewProps> = ({
  matches,
  userFeedbacks,
  onSubmitFeedback,
  onNavigateToRetrain,
}) => {
  const [filter, setFilter] = useState<'all' | 'unrated' | 'rated' | 'psl'>('all');
  const [activeFeedbackMatchId, setActiveFeedbackMatchId] = useState<string | null>(null);

  // Quick form state for the expanded feedback drawer/card
  const [ratingType, setRatingType] = useState<'accurate' | 'partial' | 'inaccurate'>('accurate');
  const [score, setScore] = useState<number>(5);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [comment, setComment] = useState('');
  const [submittedToast, setSubmittedToast] = useState<string | null>(null);

  const availableTags = [
    'Spot-on xG model',
    'High value odds',
    'Great PSL tactical read',
    'Underdog value spotted',
    'Red card altered match',
    'Defensive tempo tighter',
    'Surprise lineup change',
  ];

  const getFeedbackForMatch = (matchId: string) => {
    return userFeedbacks.find((fb) => fb.matchId === matchId);
  };

  const filteredMatches = matches.filter((m) => {
    const fb = getFeedbackForMatch(m.id);
    if (filter === 'unrated') return !fb;
    if (filter === 'rated') return !!fb;
    if (filter === 'psl') return m.leagueId === 'psl';
    return true;
  });

  const handleQuickRate = (match: Match, quickRating: 'accurate' | 'partial' | 'inaccurate') => {
    const starMap = { accurate: 5, partial: 3, inaccurate: 1 };
    onSubmitFeedback({
      matchId: match.id,
      matchTitle: `${match.homeTeam.name} vs ${match.awayTeam.name}`,
      predictionPick: match.prediction.pick,
      riskLevel: match.prediction.riskLevel,
      actualResult: `${match.score?.home ?? 0} - ${match.score?.away ?? 0} (${match.actualOutcomeWon ? 'Prediction Won' : 'Prediction Lost'})`,
      predictionSuccess: !!match.actualOutcomeWon,
      userRating: quickRating,
      numericScore: starMap[quickRating],
      feedbackTags: [quickRating === 'accurate' ? 'Spot-on model' : 'Tactical divergence'],
      comment: quickRating === 'accurate' ? 'Quick 1-tap rating: Model verified.' : 'Quick 1-tap rating: Divergence noted.',
    });

    setSubmittedToast(`Feedback recorded for ${match.homeTeam.shortName} vs ${match.awayTeam.shortName}!`);
    setTimeout(() => setSubmittedToast(null), 3500);
  };

  const handleDetailedSubmit = (match: Match) => {
    onSubmitFeedback({
      matchId: match.id,
      matchTitle: `${match.homeTeam.name} vs ${match.awayTeam.name}`,
      predictionPick: match.prediction.pick,
      riskLevel: match.prediction.riskLevel,
      actualResult: `${match.score?.home ?? 0} - ${match.score?.away ?? 0} (${match.actualOutcomeWon ? 'Prediction Won' : 'Prediction Lost'})`,
      predictionSuccess: !!match.actualOutcomeWon,
      userRating: ratingType,
      numericScore: score,
      feedbackTags: selectedTags,
      comment: comment.trim() || undefined,
    });

    setActiveFeedbackMatchId(null);
    setSelectedTags([]);
    setComment('');
    setSubmittedToast(`Thank you! Model calibrated with your detailed feedback.`);
    setTimeout(() => setSubmittedToast(null), 3500);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const ratedCount = userFeedbacks.length;
  const accurateCount = userFeedbacks.filter((f) => f.userRating === 'accurate').length;
  const agreementRate = ratedCount > 0 ? Math.round((accurateCount / ratedCount) * 100) : 85;

  return (
    <div className="space-y-4 pb-20">
      {/* Toast popup */}
      {submittedToast && (
        <div className="p-3 bg-emerald-950/90 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center justify-between shadow-lg shadow-emerald-950/50 animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{submittedToast}</span>
          </div>
          <button
            onClick={onNavigateToRetrain}
            className="text-emerald-300 hover:text-white underline text-[11px] font-medium flex items-center gap-0.5 ml-2"
          >
            See Model Tuning
            <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Header & Retraining Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-sm">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white">Prediction Accuracy Feedback</h2>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                Self-Tuning AI
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Rate recent finished matches in 1 tap. Every rating adjusts the model weights (xG vs form, PSL defense dampener, home advantage).
            </p>
          </div>
          <button
            onClick={onNavigateToRetrain}
            className="shrink-0 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tune Model</span>
          </button>
        </div>

        {/* Feedback Statistics Strip */}
        <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-800/80 text-center">
          <div className="bg-slate-950/50 rounded-xl p-2 border border-slate-800/60">
            <span className="text-[11px] text-slate-400 block">Total Ratings</span>
            <span className="text-base font-bold text-white font-mono">{428 + ratedCount}</span>
          </div>
          <div className="bg-slate-950/50 rounded-xl p-2 border border-slate-800/60">
            <span className="text-[11px] text-slate-400 block">Agreement Rate</span>
            <span className="text-base font-bold text-emerald-400 font-mono">{agreementRate}%</span>
          </div>
          <div className="bg-slate-950/50 rounded-xl p-2 border border-slate-800/60">
            <span className="text-[11px] text-slate-400 block">Your Rated</span>
            <span className="text-base font-bold text-amber-400 font-mono">{ratedCount}</span>
          </div>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
            filter === 'all'
              ? 'bg-slate-800 text-white border border-slate-700'
              : 'text-slate-400 hover:text-slate-200 bg-slate-900/60'
          }`}
        >
          All Matches ({matches.length})
        </button>
        <button
          onClick={() => setFilter('unrated')}
          className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
            filter === 'unrated'
              ? 'bg-slate-800 text-white border border-slate-700'
              : 'text-slate-400 hover:text-slate-200 bg-slate-900/60'
          }`}
        >
          Awaiting Rating ({matches.filter((m) => !getFeedbackForMatch(m.id)).length})
        </button>
        <button
          onClick={() => setFilter('rated')}
          className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
            filter === 'rated'
              ? 'bg-slate-800 text-white border border-slate-700'
              : 'text-slate-400 hover:text-slate-200 bg-slate-900/60'
          }`}
        >
          Rated by You ({userFeedbacks.length})
        </button>
        <button
          onClick={() => setFilter('psl')}
          className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
            filter === 'psl'
              ? 'bg-slate-800 text-white border border-slate-700'
              : 'text-slate-400 hover:text-slate-200 bg-slate-900/60'
          }`}
        >
          🇿🇦 Betway PSL ({matches.filter((m) => m.leagueId === 'psl').length})
        </button>
      </div>

      {/* Finished Match Cards with Unobtrusive Feedback Mechanism */}
      <div className="space-y-3">
        {filteredMatches.length === 0 ? (
          <div className="bg-slate-900/50 border border-slate-800/80 rounded-2xl p-6 text-center text-slate-400">
            <p className="text-sm">No matches in this filter category.</p>
          </div>
        ) : (
          filteredMatches.map((match) => {
            const existingFeedback = getFeedbackForMatch(match.id);
            const isEditing = activeFeedbackMatchId === match.id;

            return (
              <div
                key={match.id}
                className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 transition-all shadow-sm"
              >
                {/* Match Header */}
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium text-slate-300">{match.leagueName}</span>
                    <span>·</span>
                    <span>{match.venue}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                      FT: {match.score?.home} - {match.score?.away}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        match.actualOutcomeWon
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                      }`}
                    >
                      {match.actualOutcomeWon ? 'Prediction Won' : 'Prediction Lost'}
                    </span>
                  </div>
                </div>

                {/* Team Names & Scores */}
                <div className="flex items-center justify-between py-2 border-y border-slate-800/60 my-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{match.homeTeam.logo}</span>
                    <span className="text-sm font-semibold text-white">{match.homeTeam.name}</span>
                  </div>
                  <div className="text-base font-bold font-mono text-white px-3 py-0.5 bg-slate-950 rounded-lg border border-slate-800">
                    {match.score?.home} - {match.score?.away}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white">{match.awayTeam.name}</span>
                    <span className="text-lg">{match.awayTeam.logo}</span>
                  </div>
                </div>

                {/* Model Prediction Details */}
                <div className="bg-slate-950/60 rounded-xl p-2.5 my-2.5 border border-slate-800/70 flex items-start justify-between gap-3 text-xs">
                  <div>
                    <span className="text-[10px] uppercase text-slate-400 block font-medium">Model Recommendation</span>
                    <span className="font-semibold text-slate-100">{match.prediction.pick}</span>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                      <span>Odds: <strong className="text-slate-200 font-mono">{match.prediction.recommendedOdds.toFixed(2)}</strong></span>
                      <span>·</span>
                      <span>Risk: <strong className="capitalize text-slate-200">{match.prediction.riskLevel}</strong></span>
                      <span>·</span>
                      <span>Confidence: <strong className="text-emerald-400 font-mono">{match.prediction.confidence}%</strong></span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-slate-400 block">Expected Value</span>
                    <span className="text-xs font-bold text-emerald-400 font-mono">+{match.prediction.modelExpectedValue}%</span>
                  </div>
                </div>

                {/* Feedback Row: Simple & Unobtrusive 1-Tap Rating */}
                {existingFeedback && !isEditing ? (
                  <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center text-amber-400">
                        {Array.from({ length: existingFeedback.numericScore }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                        ))}
                      </div>
                      <span className="text-xs font-medium text-slate-300 capitalize">
                        {existingFeedback.userRating === 'accurate' ? '🎯 Spot On' : existingFeedback.userRating === 'partial' ? '⚖️ Partial' : '❌ Inaccurate'}
                      </span>
                      <span className="text-[11px] text-slate-500">· Model calibrated</span>
                    </div>
                    <button
                      onClick={() => {
                        setActiveFeedbackMatchId(match.id);
                        setRatingType(existingFeedback.userRating);
                        setScore(existingFeedback.numericScore);
                        setSelectedTags(existingFeedback.feedbackTags);
                        setComment(existingFeedback.comment || '');
                      }}
                      className="text-xs text-slate-400 hover:text-emerald-400 underline"
                    >
                      Edit Feedback
                    </button>
                  </div>
                ) : (
                  <div className="mt-3 pt-2.5 border-t border-slate-800/80">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                        Was this prediction accurate?
                      </span>
                      <button
                        onClick={() => {
                          if (isEditing) {
                            setActiveFeedbackMatchId(null);
                          } else {
                            setActiveFeedbackMatchId(match.id);
                            setRatingType(match.actualOutcomeWon ? 'accurate' : 'inaccurate');
                            setScore(match.actualOutcomeWon ? 5 : 2);
                          }
                        }}
                        className="text-[11px] text-emerald-400 hover:text-emerald-300 font-medium"
                      >
                        {isEditing ? 'Cancel' : '+ Add Note & Tags'}
                      </button>
                    </div>

                    {/* Quick 1-Tap Rate Buttons (Unobtrusive) */}
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => handleQuickRate(match, 'accurate')}
                        className="py-2 px-2 rounded-xl bg-slate-950 hover:bg-emerald-950/50 hover:border-emerald-500/40 border border-slate-800 text-xs font-medium text-slate-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer group"
                      >
                        <ThumbsUp className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
                        <span>🎯 Spot On</span>
                      </button>
                      <button
                        onClick={() => handleQuickRate(match, 'partial')}
                        className="py-2 px-2 rounded-xl bg-slate-950 hover:bg-amber-950/50 hover:border-amber-500/40 border border-slate-800 text-xs font-medium text-slate-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer group"
                      >
                        <span>⚖️ Partial</span>
                      </button>
                      <button
                        onClick={() => handleQuickRate(match, 'inaccurate')}
                        className="py-2 px-2 rounded-xl bg-slate-950 hover:bg-rose-950/50 hover:border-rose-500/40 border border-slate-800 text-xs font-medium text-slate-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer group"
                      >
                        <ThumbsDown className="w-3.5 h-3.5 text-rose-400 group-hover:scale-110 transition-transform" />
                        <span>❌ Inaccurate</span>
                      </button>
                    </div>

                    {/* Optional Expanded Drawer for Detailed Feedback */}
                    {isEditing && (
                      <div className="mt-3 p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-3 animate-fade-in">
                        {/* Rating Stars */}
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-400">Accuracy Score:</span>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((starVal) => (
                              <button
                                key={starVal}
                                type="button"
                                onClick={() => setScore(starVal)}
                                className="p-1 text-slate-600 hover:text-amber-400 transition-colors"
                              >
                                <Star
                                  className={`w-5 h-5 ${
                                    starVal <= score ? 'fill-amber-400 text-amber-400' : 'text-slate-600'
                                  }`}
                                />
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Quick tags */}
                        <div>
                          <span className="text-[11px] text-slate-400 block mb-1.5">Model Factor Tags (Tap to select):</span>
                          <div className="flex flex-wrap gap-1.5">
                            {availableTags.map((tag) => {
                              const isSelected = selectedTags.includes(tag);
                              return (
                                <button
                                  key={tag}
                                  type="button"
                                  onClick={() => toggleTag(tag)}
                                  className={`px-2 py-1 rounded-lg text-[11px] transition-colors ${
                                    isSelected
                                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                                      : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
                                  }`}
                                >
                                  {tag}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Note Input */}
                        <div>
                          <input
                            type="text"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Optional note: e.g. Coach changed tactics early in 2nd half..."
                            className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                          />
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => setActiveFeedbackMatchId(null)}
                            className="px-3 py-1 text-xs text-slate-400 hover:text-white"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDetailedSubmit(match)}
                            className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-semibold rounded-lg shadow-sm"
                          >
                            Save & Retrain Model
                          </button>
                        </div>
                      </div>
                    )}
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
