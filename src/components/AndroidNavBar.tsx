import React from 'react';
import { Target, CheckCircle2, FlaskConical, Sliders, Crown, Bell } from 'lucide-react';

export type NavTabId = 'predictions' | 'results' | 'backtest' | 'retrain' | 'vip';

interface AndroidNavBarProps {
  activeTab: NavTabId;
  onTabChange: (tab: NavTabId) => void;
  unratedMatchesCount: number;
  unreadNotifsCount: number;
}

export const AndroidNavBar: React.FC<AndroidNavBarProps> = ({
  activeTab,
  onTabChange,
  unratedMatchesCount,
  unreadNotifsCount,
}) => {
  const tabs = [
    {
      id: 'predictions' as NavTabId,
      label: 'Predictions',
      icon: Target,
      badge: null,
    },
    {
      id: 'results' as NavTabId,
      label: 'Feedback',
      icon: CheckCircle2,
      badge: unratedMatchesCount > 0 ? unratedMatchesCount : null,
      badgeColor: 'bg-emerald-500 text-slate-950',
    },
    {
      id: 'backtest' as NavTabId,
      label: 'Trial Lab',
      icon: FlaskConical,
      badge: null,
    },
    {
      id: 'retrain' as NavTabId,
      label: 'Model Tuning',
      icon: Sliders,
      badge: null,
    },
    {
      id: 'vip' as NavTabId,
      label: 'VIP & Alerts',
      icon: Crown,
      badge: unreadNotifsCount > 0 ? unreadNotifsCount : null,
      badgeColor: 'bg-amber-500 text-slate-950',
    },
  ];

  return (
    <nav className="w-full bg-slate-950/95 backdrop-blur-md border-t border-slate-800/80 px-2 pt-1 pb-3 select-none z-30">
      <div className="grid grid-cols-5 items-center max-w-lg mx-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex flex-col items-center justify-center min-h-[48px] py-1 transition-colors rounded-xl cursor-pointer ${
                isActive
                  ? 'text-emerald-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 font-normal'
              }`}
            >
              <div
                className={`relative px-3 py-1 rounded-full transition-all duration-200 ${
                  isActive ? 'bg-emerald-500/15' : 'bg-transparent'
                }`}
              >
                <Icon
                  className={`w-5 h-5 transition-transform duration-150 ${
                    isActive ? 'scale-110 text-emerald-400 stroke-[2.2]' : 'text-slate-400 stroke-[1.8]'
                  }`}
                />
                {tab.badge !== null && (
                  <span
                    className={`absolute -top-1 -right-1 text-[10px] font-bold px-1.5 min-w-[16px] h-4 rounded-full flex items-center justify-center shadow-sm ${
                      tab.badgeColor || 'bg-amber-500 text-slate-950'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] tracking-tight mt-0.5 truncate max-w-[68px]">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
      {/* Android home gesture pill */}
      <div className="w-28 h-1 bg-slate-700/60 rounded-full mx-auto mt-2"></div>
    </nav>
  );
};
