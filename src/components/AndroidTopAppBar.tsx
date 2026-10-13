import React from 'react';
import { Target, Bell, Crown, Sparkles } from 'lucide-react';
import { SubscriptionTier } from '../types/soccer';
import { NavTabId } from './AndroidNavBar';

interface AndroidTopAppBarProps {
  activeTab: NavTabId;
  userTier: SubscriptionTier;
  unreadCount: number;
  onOpenNotifications: () => void;
  onOpenTierModal: () => void;
}

export const AndroidTopAppBar: React.FC<AndroidTopAppBarProps> = ({
  activeTab,
  userTier,
  unreadCount,
  onOpenNotifications,
  onOpenTierModal,
}) => {
  const getTabTitle = () => {
    switch (activeTab) {
      case 'predictions':
        return 'Upcoming Match Predictions';
      case 'results':
        return 'Match Accuracy & Feedback';
      case 'backtest':
        return 'Outcome Trial & Backtest Lab';
      case 'retrain':
        return 'AI Model Calibration';
      case 'vip':
        return 'VIP Analytics & Alerts';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 py-3 select-none">
      <div className="flex items-center justify-between gap-4 max-w-5xl mx-auto">
        {/* Brand & Context */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-slate-950 shadow-md shadow-emerald-500/20 shrink-0">
            <Target className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div className="min-w-0">
            <span className="text-sm font-extrabold tracking-tight text-white block leading-tight">
              ApexPitch
            </span>
            <span className="text-[11px] text-slate-400 block truncate leading-tight">
              {getTabTitle()}
            </span>
          </div>
        </div>

        {/* Right Action Affordances */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Active Tier Pill */}
          <button
            onClick={onOpenTierModal}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 border transition-all cursor-pointer ${
              userTier === 'vip'
                ? 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                : userTier === 'pro'
                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <Crown className="w-3 h-3 text-current" />
            <span>{userTier}</span>
          </button>

          {/* Push Notifications Bell */}
          <button
            onClick={onOpenNotifications}
            className="relative p-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Push Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-slate-950 text-[10px] font-bold flex items-center justify-center shadow-sm">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
