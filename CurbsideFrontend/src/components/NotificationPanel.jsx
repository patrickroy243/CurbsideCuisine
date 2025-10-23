import { CheckCircle, XCircle, AlertCircle, Info, X, Trash2, CheckCheck } from 'lucide-react';
import { useNotification } from '../contexts/NotificationContext';

const NotificationPanel = () => {
  const { 
    notifications, 
    unreadCount, 
    showPanel, 
    markAsRead, 
    markAllAsRead,
    clearNotification, 
    clearAll,
    closePanel 
  } = useNotification();

  if (!showPanel) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-600" />;
      default:
        return <Info className="w-5 h-5 text-gray-600" />;
    }
  };

  const getTimeAgo = (timestamp) => {
    const seconds = Math.floor((new Date() - new Date(timestamp)) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 z-40"
        onClick={closePanel}
      />
      
      {/* Panel */}
      <div className="fixed top-16 right-4 w-96 max-w-[calc(100vw-2rem)] max-h-[600px] bg-white rounded-xl shadow-2xl border-2 border-sky-200 z-50 flex flex-col overflow-hidden animate-slideDown">
        <style>{`
          @keyframes slideDown {
            from {
              opacity: 0;
              transform: translateY(-20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-slideDown {
            animation: slideDown 0.3s ease-out;
          }
        `}</style>
        
        {/* Header */}
        <div className="p-4 border-b-2 border-sky-100 bg-gradient-to-r from-sky-50 to-blue-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-bold text-gray-900">Notifications</h3>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 text-xs font-bold text-white bg-gradient-to-r from-red-500 to-pink-600 rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
            <button
              onClick={closePanel}
              className="p-1 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          
          {/* Action buttons */}
          {notifications.length > 0 && (
            <div className="flex items-center space-x-2 mt-3">
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="flex items-center space-x-1 px-3 py-1.5 text-xs font-semibold text-sky-600 hover:text-sky-700 hover:bg-sky-100 rounded-lg transition-colors"
                >
                  <CheckCheck className="w-4 h-4" />
                  <span>Mark all read</span>
                </button>
              )}
              <button
                onClick={clearAll}
                className="flex items-center space-x-1 px-3 py-1.5 text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear all</span>
              </button>
            </div>
          )}
        </div>

        {/* Notifications list */}
        <div className="flex-1 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center px-4">
              <div className="w-16 h-16 bg-gradient-to-br from-sky-100 to-blue-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-sky-600" />
              </div>
              <p className="text-gray-600 font-medium">No notifications</p>
              <p className="text-sm text-gray-500 mt-1">You're all caught up!</p>
            </div>
          ) : (
            <div className="divide-y divide-sky-100">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`
                    p-4 hover:bg-gradient-to-r hover:from-sky-50 hover:to-blue-50 
                    transition-colors cursor-pointer
                    ${!notification.read ? 'bg-sky-50/50' : 'bg-white'}
                  `}
                  onClick={() => !notification.read && markAsRead(notification.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${!notification.read ? 'font-semibold' : 'font-medium'} text-gray-900 break-words`}>
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-xs text-gray-500">
                          {getTimeAgo(notification.timestamp)}
                        </p>
                        {!notification.read && (
                          <span className="w-2 h-2 bg-gradient-to-r from-red-500 to-pink-600 rounded-full"></span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        clearNotification(notification.id);
                      }}
                      className="flex-shrink-0 p-1 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      <X className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default NotificationPanel;
