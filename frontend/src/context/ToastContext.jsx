import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success', duration = 4000) => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toastSuccess = (msg) => addToast(msg, 'success');
  const toastError = (msg) => addToast(msg, 'error');
  const toastInfo = (msg) => addToast(msg, 'info');
  const toastWarning = (msg) => addToast(msg, 'warning');

  return (
    <ToastContext.Provider value={{ addToast, removeToast, toastSuccess, toastError, toastInfo, toastWarning }}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none px-4">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-lg border backdrop-blur-md ${
                t.type === 'success'
                  ? 'bg-emerald-50/95 border-emerald-300 text-emerald-900 dark:bg-emerald-950/90 dark:border-emerald-700 dark:text-emerald-100'
                  : t.type === 'error'
                  ? 'bg-rose-50/95 border-rose-300 text-rose-900 dark:bg-rose-950/90 dark:border-rose-700 dark:text-rose-100'
                  : t.type === 'warning'
                  ? 'bg-amber-50/95 border-amber-300 text-amber-900 dark:bg-amber-950/90 dark:border-amber-700 dark:text-amber-100'
                  : 'bg-slate-50/95 border-slate-300 text-slate-900 dark:bg-slate-900/90 dark:border-slate-700 dark:text-slate-100'
              }`}
            >
              <div className="shrink-0 mt-0.5">
                {t.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />}
                {t.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />}
                {t.type === 'warning' && <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />}
                {t.type === 'info' && <Info className="w-5 h-5 text-blue-600 dark:text-blue-400" />}
              </div>
              <div className="flex-1 text-sm font-medium leading-relaxed">{t.message}</div>
              <button
                onClick={() => removeToast(t.id)}
                className="shrink-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
