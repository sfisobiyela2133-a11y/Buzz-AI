import React, { useState } from 'react';
import { SubscriptionTier, PlanDetails, PushNotification } from '../types/soccer';
import { SUBSCRIPTION_PLANS, INITIAL_NOTIFICATIONS } from '../data/mockSoccerData';
import { Crown, Bell, Check, Shield, Zap, Sparkles, MessageSquare, Smartphone, Volume2, Send } from 'lucide-react';

interface SubscriptionAndAlertsViewProps {
  currentTier: SubscriptionTier;
  onSelectTier: (tier: SubscriptionTier) => void;
  onTriggerTestPush: (notif: PushNotification) => void;
  unreadCount: number;
}

export const SubscriptionAndAlertsView: React.FC<SubscriptionAndAlertsViewProps> = ({
  currentTier,
  onSelectTier,
  onTriggerTestPush,
  unreadCount,
}) => {
  const [currency, setCurrency] = useState<'ZAR' | 'USD'>('ZAR');
  const [enablePush, setEnablePush] = useState(true);
  const [enableWhatsApp, setEnableWhatsApp] = useState(true);
  const [enableHighValue, setEnableHighValue] = useState(true);
  const [enableLineups, setEnableLineups] = useState(true);
  const [enablePslAlerts, setEnablePslAlerts] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [activeTab, setActiveTab] = useState<'plans' | 'notifications'>('plans');

  const handleTestAlert = () => {
    const testNotifs: PushNotification[] = [
      {
        id: 'test-' + Date.now(),
        title: '🇿🇦 Soweto Derby Odds Alert!',
        body: 'Hollywoodbets shifted Pirates Win to 2.30. Model detected an +8.4% edge against Chiefs.',
        timeAgo: 'Just now',
        category: 'psl_special',
        matchId: 'psl-derby-01',
        riskLevel: 'medium',
        isRead: false,
      },
      {
        id: 'test-' + Date.now(),
        title: '🔥 High-Risk Underdog Flagged (+16.5% EV)',
        body: 'Real Madrid vs Barcelona: High value model flagged Real Madrid Win & BTTS at 3.45 odds.',
        timeAgo: 'Just now',
        category: 'high_value_bet',
        matchId: 'laliga-clasico-05',
        riskLevel: 'high',
        isRead: false,
      },
      {
        id: 'test-' + Date.now(),
        title: '📋 Lineup Confirmed: Mamelodi Sundowns',
        body: 'Peter Shalulile and Ribeiro Costa confirmed starting against Stellenbosch FC.',
        timeAgo: 'Just now',
        category: 'lineup',
        matchId: 'psl-sundowns-02',
        riskLevel: 'low',
        isRead: false,
      },
    ];

    const randomNotif = testNotifs[Math.floor(Math.random() * testNotifs.length)];
    onTriggerTestPush(randomNotif);
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Top Segmented Tab Switcher */}
      <div className="grid grid-cols-2 p-1 bg-slate-900 rounded-xl border border-slate-800">
        <button
          onClick={() => setActiveTab('plans')}
          className={`py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'plans' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Crown className="w-3.5 h-3.5 text-amber-400" />
          <span>Subscription Plans</span>
        </button>
        <button
          onClick={() => setActiveTab('notifications')}
          className={`relative py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'notifications' ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Bell className="w-3.5 h-3.5 text-emerald-400" />
          <span>Push Notifications</span>
          {unreadCount > 0 && (
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
          )}
        </button>
      </div>

      {activeTab === 'plans' ? (
        <div className="space-y-4">
          {/* Header & Currency Toggle */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white">Premium Match Analytics</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Unlock high-risk value picks, South African PSL insider reports, and live odds shifts.
                </p>
              </div>
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
                <button
                  onClick={() => setCurrency('ZAR')}
                  className={`px-2 py-0.5 rounded font-mono font-medium ${currency === 'ZAR' ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-500'}`}
                >
                  ZAR (R)
                </button>
                <button
                  onClick={() => setCurrency('USD')}
                  className={`px-2 py-0.5 rounded font-mono font-medium ${currency === 'USD' ? 'bg-slate-800 text-white' : 'text-slate-500'}`}
                >
                  USD ($)
                </button>
              </div>
            </div>

            {/* Active Tier Notice */}
            <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-400">Your Current Active Plan:</span>
              <span className="font-semibold text-emerald-400 uppercase tracking-wider font-mono">
                {currentTier} Tier
              </span>
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="space-y-3">
            {SUBSCRIPTION_PLANS.map((plan) => {
              const isCurrent = currentTier === plan.id;
              const price = currency === 'ZAR' ? `R${plan.priceZAR}` : `$${plan.priceUSD}`;

              return (
                <div
                  key={plan.id}
                  className={`relative bg-slate-900/90 rounded-2xl p-4 border transition-all ${
                    isCurrent
                      ? 'border-emerald-500/60 shadow-lg shadow-emerald-950/40'
                      : plan.id === 'vip'
                      ? 'border-amber-500/40 bg-gradient-to-b from-amber-950/20 to-slate-900/90'
                      : 'border-slate-800'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-white">{plan.name}</h3>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                          {plan.badge}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        {plan.description}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xl font-extrabold text-white font-mono">{price}</span>
                      <span className="text-[10px] text-slate-500 block">/{plan.period}</span>
                    </div>
                  </div>

                  {/* Feature Checklist */}
                  <ul className="mt-3 pt-3 border-t border-slate-800/80 space-y-1.5 text-xs text-slate-300">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Action Button */}
                  <button
                    onClick={() => onSelectTier(plan.id)}
                    className={`mt-4 w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-slate-800 text-slate-300 border border-slate-700 cursor-default'
                        : plan.id === 'vip'
                        ? 'bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                        : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md shadow-emerald-500/20'
                    }`}
                  >
                    {isCurrent ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Current Active Plan</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Switch to {plan.name}</span>
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Real-Time Push Notifications Hub */
        <div className="space-y-4">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-white">Real-Time Push Alerts</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Instant mobile notifications for lineup releases, value odds drops, and match results.
                </p>
              </div>
              <button
                onClick={handleTestAlert}
                className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-sm transition-all shrink-0 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Test Push Now</span>
              </button>
            </div>

            {/* Notification Toggles */}
            <div className="space-y-2 pt-2 border-t border-slate-800/80">
              <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs cursor-pointer">
                <div>
                  <span className="font-semibold text-white block">Android Mobile Push Notifications</span>
                  <span className="text-[11px] text-slate-400">Display alerts on system tray and lock screen</span>
                </div>
                <input
                  type="checkbox"
                  checked={enablePush}
                  onChange={(e) => setEnablePush(e.target.checked)}
                  className="w-4 h-4 accent-emerald-500 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs cursor-pointer">
                <div>
                  <span className="font-semibold text-white block">WhatsApp Alerts (South African Punters)</span>
                  <span className="text-[11px] text-slate-400">Direct WhatsApp message when PSL value odds shift</span>
                </div>
                <input
                  type="checkbox"
                  checked={enableWhatsApp}
                  onChange={(e) => setEnableWhatsApp(e.target.checked)}
                  className="w-4 h-4 accent-emerald-500 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs cursor-pointer">
                <div>
                  <span className="font-semibold text-white block">High-Value Bets &gt; 10% Edge</span>
                  <span className="text-[11px] text-slate-400">High Risk & Medium Risk positive expected value alerts</span>
                </div>
                <input
                  type="checkbox"
                  checked={enableHighValue}
                  onChange={(e) => setEnableHighValue(e.target.checked)}
                  className="w-4 h-4 accent-emerald-500 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs cursor-pointer">
                <div>
                  <span className="font-semibold text-white block">🇿🇦 Local South African PSL Alerts</span>
                  <span className="text-[11px] text-slate-400">Derby previews, starting 11 announcements & pitch news</span>
                </div>
                <input
                  type="checkbox"
                  checked={enablePslAlerts}
                  onChange={(e) => setEnablePslAlerts(e.target.checked)}
                  className="w-4 h-4 accent-emerald-500 rounded"
                />
              </label>
            </div>
          </div>

          {/* Recent Received Notifications Feed */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-sm">
            <h3 className="text-xs font-bold text-white mb-2">Notification History</h3>
            <div className="space-y-2">
              {INITIAL_NOTIFICATIONS.map((notif) => (
                <div
                  key={notif.id}
                  className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white">{notif.title}</span>
                    <span className="text-[10px] text-slate-500">{notif.timeAgo}</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">{notif.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
