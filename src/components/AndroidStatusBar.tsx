import React, { useState, useEffect } from 'react';
import { Wifi, BatteryMedium, Signal, Bell, Smartphone, Monitor } from 'lucide-react';

interface AndroidStatusBarProps {
  unreadNotifsCount: number;
  isAndroidFrame: boolean;
  onToggleFrame: () => void;
}

export const AndroidStatusBar: React.FC<AndroidStatusBarProps> = ({
  unreadNotifsCount,
  isAndroidFrame,
  onToggleFrame,
}) => {
  const [time, setTime] = useState('11:54');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-slate-950 text-slate-300 select-none border-b border-slate-900">
      {/* Top utility switcher bar for testing between Android phone frame and Full viewport */}
      <div className="hidden sm:flex items-center justify-between px-3 py-1 bg-slate-900/80 text-[11px] border-b border-slate-800 text-slate-400">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
          <span className="font-medium text-slate-300">Android 15 (Material You) Viewport</span>
          <span className="text-slate-500">·</span>
          <span>Johannesburg / Global Feed</span>
        </div>
        <button
          onClick={onToggleFrame}
          className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer text-xs font-medium"
          title="Toggle between Android phone frame and wide screen"
        >
          {isAndroidFrame ? (
            <>
              <Monitor className="w-3.5 h-3.5 text-emerald-400" />
              <span>Switch to Wide View</span>
            </>
          ) : (
            <>
              <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
              <span>Switch to Android Frame</span>
            </>
          )}
        </button>
      </div>

      {/* Android System Status Bar */}
      <div className="flex items-center justify-between px-4 py-1.5 text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-200">{time}</span>
          {unreadNotifsCount > 0 && (
            <div className="flex items-center gap-1 text-[11px] text-amber-400 font-sans">
              <Bell className="w-3 h-3" />
              <span>{unreadNotifsCount}</span>
            </div>
          )}
          <span className="text-[10px] text-emerald-400 font-medium">5G+</span>
        </div>

        {/* Center Punch-hole Camera Mock (visible on Android frame mode) */}
        {isAndroidFrame && (
          <div className="w-3.5 h-3.5 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-slate-950"></div>
          </div>
        )}

        <div className="flex items-center gap-2 text-slate-400">
          <Signal className="w-3.5 h-3.5 text-slate-300" />
          <Wifi className="w-3.5 h-3.5 text-slate-300" />
          <div className="flex items-center gap-1">
            <span className="text-[10px] tabular-nums font-sans">92%</span>
            <BatteryMedium className="w-4 h-4 text-emerald-400" />
          </div>
        </div>
      </div>
    </div>
  );
};
