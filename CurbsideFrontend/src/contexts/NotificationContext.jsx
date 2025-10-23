import { createContext, useContext, useState, useCallback } from 'react';

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [showPanel, setShowPanel] = useState(false);

  const addNotification = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random();
    const notification = { 
      id, 
      message, 
      type,
      timestamp: new Date(),
      read: false
    };
    
    setNotifications(prev => [notification, ...prev]);
  }, []);

  const markAsRead = useCallback((id) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const clearNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const togglePanel = useCallback(() => {
    setShowPanel(prev => !prev);
  }, []);

  const closePanel = useCallback(() => {
    setShowPanel(false);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider 
      value={{ 
        notifications,
        unreadCount,
        showPanel,
        addNotification,
        markAsRead,
        markAllAsRead,
        clearNotification,
        clearAll,
        togglePanel,
        closePanel
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
