/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Match, UserMatchFeedback, ModelParameters, SubscriptionTier, PushNotification } from './types/soccer';
import { UPCOMING_MATCHES, PAST_FINISHED_MATCHES, INITIAL_USER_FEEDBACK, INITIAL_MODEL_PARAMS, INITIAL_NOTIFICATIONS } from './data/mockSoccerData';
import { AndroidStatusBar } from './components/AndroidStatusBar';
import { AndroidTopAppBar } from './components/AndroidTopAppBar';
import { AndroidNavBar, NavTabId } from './components/AndroidNavBar';
import { PredictionsDashboard } from './components/PredictionsDashboard';
import { PastMatchesFeedbackView } from './components/PastMatchesFeedbackView';
import { BacktestLab } from './components/BacktestLab';
import { ModelCalibrationView } from './components/ModelCalibrationView';
import { SubscriptionAndAlertsView } from './components/SubscriptionAndAlertsView';
import { MatchDetailModal } from './components/MatchDetailModal';
import { AndroidPushToast } from './components/AndroidPushToast';

export default function App() {
  // Navigation & Frame Mode
  const [activeTab, setActiveTab] = useState<NavTabId>('predictions');
  const [isAndroidFrame, setIsAndroidFrame] = useState<boolean>(true);

  // App Data & Model State
  const [matches] = useState<Match[]>(UPCOMING_MATCHES);
  const [pastMatches, setPastMatches] = useState<Match[]>(PAST_FINISHED_MATCHES);
  const [userTier, setUserTier] = useState<SubscriptionTier>('vip'); // Default to VIP so user can try all features immediately
  const [modelParams, setModelParams] = useState<ModelParameters>(() => {
    const saved = localStorage.getItem('apexpitch_model_params');
    return saved ? JSON.parse(saved) : INITIAL_MODEL_PARAMS;
  });

  // User Feedback Data (stored in localStorage)
  const [userFeedbacks, setUserFeedbacks] = useState<UserMatchFeedback[]>(() => {
    const saved = localStorage.getItem('apexpitch_user_feedback');
    return saved ? JSON.parse(saved) : INITIAL_USER_FEEDBACK;
  });

  // Notifications State
  const [notifications, setNotifications] = useState<PushNotification[]>(INITIAL_NOTIFICATIONS);
  const [activePushToast, setActivePushToast] = useState<PushNotification | null>(null);

  // Modals
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('apexpitch_user_feedback', JSON.stringify(userFeedbacks));
  }, [userFeedbacks]);

  useEffect(() => {
    localStorage.setItem('apexpitch_model_params', JSON.stringify(modelParams));
  }, [modelParams]);

  // Handle User Feedback Submission
  const handleSubmitFeedback = (newFb: Omit<UserMatchFeedback, 'id' | 'createdAt' | 'appliedToModel'>) => {
    const feedbackEntry: UserMatchFeedback = {
      ...newFb,
      id: 'fb-' + Date.now(),
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      appliedToModel: true,
    };

    // Replace if existing for this match, or append
    setUserFeedbacks((prev) => {
      const filtered = prev.filter((item) => item.matchId !== newFb.matchId);
      return [feedbackEntry, ...filtered];
    });

    // Dynamically adjust model parameters based on user feedback
    const isAccurate = newFb.userRating === 'accurate';
    const isPartial = newFb.userRating === 'partial';

    setModelParams((prev) => {
      const newCount = prev.feedbackCount + 1;
      // Slight recalibration of weights based on user feedback
      let newPslDampener = prev.pslDefensiveDampener;
      if (newFb.feedbackTags.some((t) => t.toLowerCase().includes('psl') || t.toLowerCase().includes('tempo'))) {
        newPslDampener = Number((prev.pslDefensiveDampener - 0.01).toFixed(2));
      }

      const accDelta = isAccurate ? 0.3 : isPartial ? 0.1 : -0.4;
      const newAccuracy = Number((prev.overallAccuracyRate + accDelta).toFixed(1));

      return {
        ...prev,
        feedbackCount: newCount,
        pslDefensiveDampener: Math.max(0.75, Math.min(1.0, newPslDampener)),
        overallAccuracyRate: Math.max(70, Math.min(92, newAccuracy)),
        lastRetrainedAt: 'Just now (Live Feedback Calibration)',
      };
    });

    // Trigger Android Push Toast alert confirming feedback ingestion
    setActivePushToast({
      id: 'toast-' + Date.now(),
      title: '⭐ Feedback Applied to Model',
      body: `Rating for ${newFb.matchTitle} registered. Hyperparameters calibrated across leagues.`,
      timeAgo: 'Just now',
      category: 'feedback_request',
      isRead: false,
    });
  };

  // Push notification dispatcher
  const handleTriggerPush = (notif: PushNotification) => {
    setNotifications((prev) => [notif, ...prev]);
    setActivePushToast(notif);
  };

  const unratedMatchesCount = pastMatches.filter(
    (m) => !userFeedbacks.some((fb) => fb.matchId === m.id)
  ).length;

  const unreadNotifsCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-start antialiased selection:bg-emerald-500 selection:text-slate-950 font-sans">
      {/* Real-Time Slide-Down Push Toast */}
      <AndroidPushToast
        notification={activePushToast}
        onDismiss={() => setActivePushToast(null)}
        onAction={(notif) => {
          setActivePushToast(null);
          if (notif.matchId) {
            const m = matches.find((match) => match.id === notif.matchId);
            if (m) setSelectedMatch(m);
          }
        }}
      />

      {/* Main Container Wrapper: Android Mobile Mockup Frame or Wide Canvas */}
      <div
        className={`w-full transition-all duration-300 flex flex-col ${
          isAndroidFrame
            ? 'max-w-[430px] my-0 sm:my-4 sm:rounded-[36px] sm:border-[6px] sm:border-slate-800 shadow-2xl sm:overflow-hidden bg-slate-950 ring-1 ring-slate-800'
            : 'max-w-5xl px-0 sm:px-4'
        }`}
      >
        {/* Android System Status Bar with Time, Wi-Fi, 5G, and Frame Switcher */}
        <AndroidStatusBar
          unreadNotifsCount={unreadNotifsCount}
          isAndroidFrame={isAndroidFrame}
          onToggleFrame={() => setIsAndroidFrame(!isAndroidFrame)}
        />

        {/* Android App Top Header */}
        <AndroidTopAppBar
          activeTab={activeTab}
          userTier={userTier}
          unreadCount={unreadNotifsCount}
          onOpenNotifications={() => setActiveTab('vip')}
          onOpenTierModal={() => setActiveTab('vip')}
        />

        {/* Tab Content Viewport */}
        <main className="flex-1 p-3 sm:p-4 min-h-[calc(100vh-140px)]">
          {activeTab === 'predictions' && (
            <PredictionsDashboard
              matches={matches}
              userTier={userTier}
              onSelectMatch={(m) => setSelectedMatch(m)}
              onUpgradeTier={() => setActiveTab('vip')}
              onNavigateToFeedback={() => setActiveTab('results')}
            />
          )}

          {activeTab === 'results' && (
            <PastMatchesFeedbackView
              matches={pastMatches}
              userFeedbacks={userFeedbacks}
              onSubmitFeedback={handleSubmitFeedback}
              onNavigateToRetrain={() => setActiveTab('retrain')}
            />
          )}

          {activeTab === 'backtest' && (
            <BacktestLab />
          )}

          {activeTab === 'retrain' && (
            <ModelCalibrationView
              modelParams={modelParams}
              userFeedbacks={userFeedbacks}
              onUpdateParams={(updated) => setModelParams(updated)}
            />
          )}

          {activeTab === 'vip' && (
            <SubscriptionAndAlertsView
              currentTier={userTier}
              onSelectTier={(tier) => {
                setUserTier(tier);
                setActivePushToast({
                  id: 'tier-' + Date.now(),
                  title: `Plan Switched to ${tier.toUpperCase()}`,
                  body: `You now have full access to ${tier === 'vip' ? 'all Low, Medium & High Risk VIP +EV picks' : 'analytics'}.`,
                  timeAgo: 'Just now',
                  category: 'high_value_bet',
                  isRead: false,
                });
              }}
              onTriggerTestPush={handleTriggerPush}
              unreadCount={unreadNotifsCount}
            />
          )}
        </main>

        {/* Android Bottom Navigation Bar */}
        <div className="sticky bottom-0 z-30">
          <AndroidNavBar
            activeTab={activeTab}
            onTabChange={(tab) => setActiveTab(tab)}
            unratedMatchesCount={unratedMatchesCount}
            unreadNotifsCount={unreadNotifsCount}
          />
        </div>
      </div>

      {/* Match Detailed Modal */}
      <MatchDetailModal
        match={selectedMatch}
        onClose={() => setSelectedMatch(null)}
        onBookmark={(matchId) => {
          setActivePushToast({
            id: 'bookmark-' + Date.now(),
            title: 'Match Added to Watchlist',
            body: 'You will receive real-time push alerts 30 minutes before kickoff.',
            timeAgo: 'Just now',
            category: 'lineup',
            isRead: false,
          });
        }}
      />
    </div>
  );
}
