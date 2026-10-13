import React from 'react';
import { PushNotification } from '../types/soccer';
import { Bell, X, ExternalLink } from 'lucide-react';

interface AndroidPushToastProps {
  notification: PushNotification | null;
  onDismiss: () => void;
  onAction?: (notif: PushNotification) => void;
}

export const AndroidPushToast: React.FC<AndroidPushToastProps> = ({
  notification,
  onDismiss,
  onAction,
}) => {
  if (!notification) return null;

  return (
    <div className="fixed top-2 left-2 right-2 sm:max-w-md sm:mx-auto z-50 animate-slide-down">
      <div className="bg-slate-900/95 border border-slate-700/80 rounded-2xl p-3 shadow-2xl backdrop-blur-md text-white">
        <div className="flex items-start justify-between gap-2">
          {/* Notification Header */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Bell className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-300">ApexPitch Alert</span>
              <span className="text-[10px] text-slate-500 ml-1.5">· {notification.timeAgo}</span>
            </div>
          </div>

          <button
            onClick={onDismiss}
            className="text-slate-400 hover:text-white p-1 rounded-full cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Content */}
        <div className="mt-2 pl-8 pr-1">
          <h4 className="text-xs font-bold text-white">{notification.title}</h4>
          <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">{notification.body}</p>

          <div className="flex items-center justify-end gap-2 mt-2 pt-1 border-t border-slate-800">
            <button
              onClick={onDismiss}
              className="px-2.5 py-1 text-[11px] text-slate-400 hover:text-slate-200"
            >
              Dismiss
            </button>
            {onAction && notification.matchId && (
              <button
                onClick={() => onAction(notification)}
                className="px-3 py-1 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-[11px] rounded-lg flex items-center gap-1 shadow-sm"
              >
                <span>View Pick</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
