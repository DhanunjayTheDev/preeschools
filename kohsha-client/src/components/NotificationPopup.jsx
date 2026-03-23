import { useEffect, useState } from 'react';

const NOTIFICATION_TYPE_META = {
  ANNOUNCEMENT: { icon: '📢', color: 'bg-blue-500', textColor: 'text-blue-600' },
  FEE: { icon: '💳', color: 'bg-yellow-500', textColor: 'text-yellow-600' },
  ACTIVITY: { icon: '📝', color: 'bg-purple-500', textColor: 'text-purple-600' },
  ENQUIRY: { icon: '❓', color: 'bg-orange-500', textColor: 'text-orange-600' },
  SYSTEM: { icon: '⚙️', color: 'bg-gray-500', textColor: 'text-gray-600' },
};

export default function NotificationPopup({ notification, onClose, autoCloseDelay = null, shouldAutoClose = false }) {
  const [isVisible, setIsVisible] = useState(true);
  const meta = NOTIFICATION_TYPE_META[notification.type] || NOTIFICATION_TYPE_META.SYSTEM;

  useEffect(() => {
    console.log('🎨 NotificationPopup rendered:', {
      title: notification.title,
      type: notification.type,
      shouldAutoClose,
      autoCloseDelay,
      visible: isVisible,
    });
  }, [notification, isVisible, autoCloseDelay, shouldAutoClose]);

  useEffect(() => {
    // Only auto-close if explicitly enabled and delay is provided
    if (!shouldAutoClose || !autoCloseDelay) return;
    const timer = setTimeout(() => {
      console.log('⏱️ NotificationPopup auto-closing:', notification.title);
      setIsVisible(false);
      onClose?.();
    }, autoCloseDelay);
    return () => clearTimeout(timer);
  }, [autoCloseDelay, onClose, notification.title, shouldAutoClose]);

  if (!isVisible) return null;

  return (
    <div
      className="fixed bottom-6 right-6 animate-slide-up pointer-events-auto px-4 sm:px-0"
      style={{ zIndex: 9999 }}
      onClick={() => {
        setIsVisible(false);
        onClose?.();
      }}
    >
      <div className={`${meta.color} rounded-lg shadow-2xl overflow-hidden w-full sm:w-96`}>
        {/* Header with close button */}
        <div className="flex items-start justify-between p-4 bg-gradient-to-r from-transparent to-black/10">
          <div className="flex items-start gap-3 flex-1">
            <span className="text-2xl flex-shrink-0">{meta.icon}</span>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-white text-sm truncate">
                {notification.title}
              </h3>
              <p className="text-white/80 text-xs mt-1 line-clamp-2">
                {notification.message}
              </p>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsVisible(false);
              onClose?.();
            }}
            className="ml-2 flex-shrink-0 text-white/60 hover:text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-white/20">
          <div
            className="h-full bg-white transition-all"
            style={{
              animation: `shrink ${autoCloseDelay}ms linear forwards`,
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes slide-up {
          from {
            transform: translateY(400px) translateX(0);
            opacity: 0;
          }
          to {
            transform: translateY(0) translateX(0);
            opacity: 1;
          }
        }
        @keyframes shrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
        .animate-slide-up {
          animation: slide-up 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}
