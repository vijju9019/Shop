import React, { createContext, useState, useContext, useCallback } from 'react';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto dismiss after 4 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 4000);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {/* Toast Render Area */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            toast={toast}
            onDismiss={() => dismissToast(toast.id)}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

const ToastItem = ({ toast, onDismiss }) => {
  const { message, type } = toast;

  const bgMap = {
    success: 'bg-discord-green/90 border-emerald-500/30 text-discord-darkest',
    error: 'bg-discord-red/90 border-rose-500/30 text-white',
    warning: 'bg-discord-yellow/90 border-amber-500/30 text-discord-darkest',
    info: 'bg-discord-blurple/90 border-indigo-500/30 text-white',
  };

  const iconMap = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️',
  };

  return (
    <div
      className={`pointer-events-auto flex items-center justify-between p-4 rounded-lg border shadow-lg backdrop-blur-md transition-all duration-300 transform translate-y-0 scale-100 animate-slide-in ${bgMap[type]}`}
    >
      <div className="flex items-center gap-3">
        <span className="text-xl">{iconMap[type]}</span>
        <p className="font-semibold text-sm leading-tight">{message}</p>
      </div>
      <button
        onClick={onDismiss}
        className="ml-4 text-sm font-bold opacity-60 hover:opacity-100 transition-opacity"
      >
        ✕
      </button>
    </div>
  );
};
