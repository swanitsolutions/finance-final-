import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X, LogOut } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

export interface CenterModalConfig {
  type?: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  buttonText?: string;
  secondaryButtonText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
  autoCloseMs?: number;
}

interface NotificationContextType {
  showToast: (toast: Omit<Toast, 'id'>) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
  showCenterModal: (config: CenterModalConfig) => void;
  closeCenterModal: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [centerModal, setCenterModal] = useState<CenterModalConfig | null>(null);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    ({ type, title, message, duration = 4000 }: Omit<Toast, 'id'>) => {
      const id = `toast-${Date.now()}-${Math.random()}`;
      setToasts((prev) => [...prev, { id, type, title, message, duration }]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  const showCenterModal = useCallback((config: CenterModalConfig) => {
    setCenterModal(config);
    if (config.autoCloseMs && config.autoCloseMs > 0) {
      setTimeout(() => {
        setCenterModal((curr) => {
          if (curr && curr.title === config.title) {
            if (config.onConfirm) {
              config.onConfirm();
            }
            return null;
          }
          return curr;
        });
      }, config.autoCloseMs);
    }
  }, []);

  const closeCenterModal = useCallback(() => {
    setCenterModal(null);
  }, []);

  const success = useCallback((title: string, message?: string) => {
    showToast({ type: 'success', title, message });
  }, [showToast]);

  const error = useCallback((title: string, message?: string) => {
    showToast({ type: 'error', title, message });
  }, [showToast]);

  const warning = useCallback((title: string, message?: string) => {
    showToast({ type: 'warning', title, message });
  }, [showToast]);

  const info = useCallback((title: string, message?: string) => {
    showToast({ type: 'info', title, message });
  }, [showToast]);

  return (
    <NotificationContext.Provider
      value={{ showToast, success, error, warning, info, showCenterModal, closeCenterModal }}
    >
      {children}

      {/* Centered Popup Dialog for Sign-In and Registration confirmation */}
      {centerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            role="dialog"
            aria-modal="true"
            className="bg-white rounded-3xl max-w-sm w-full p-7 text-center shadow-2xl border border-[#DFE5E9] animate-in zoom-in-95 duration-200 relative"
          >
            <div
              className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-sm ${
                centerModal.title.toLowerCase().includes('sign out') || centerModal.title.toLowerCase().includes('logout')
                  ? 'bg-[#FCEBED] text-[#C9414D]'
                  : centerModal.type === 'error'
                  ? 'bg-[#FCEBED] text-[#C9414D]'
                  : centerModal.type === 'warning'
                  ? 'bg-[#FFF4D9] text-[#C28A20]'
                  : 'bg-[#E6F4EE] text-[#218568]'
              }`}
            >
              {centerModal.title.toLowerCase().includes('sign out') || centerModal.title.toLowerCase().includes('logout') ? (
                <LogOut className="w-8 h-8" />
              ) : centerModal.type === 'error' ? (
                <AlertCircle className="w-9 h-9" />
              ) : centerModal.type === 'warning' ? (
                <AlertTriangle className="w-9 h-9" />
              ) : (
                <CheckCircle2 className="w-9 h-9" />
              )}
            </div>

            <h3 className="text-xl font-bold text-[#172B3A]">{centerModal.title}</h3>
            <p className="text-xs text-[#536473] mt-2.5 leading-relaxed px-1">
              {centerModal.message}
            </p>

            <div className="mt-6">
              {centerModal.secondaryButtonText ? (
                <div className="flex flex-col sm:flex-row gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      const onCancel = centerModal.onCancel;
                      setCenterModal(null);
                      if (onCancel) onCancel();
                    }}
                    className="flex-1 py-2.5 px-4 bg-white hover:bg-[#F3F5F6] border border-[#DFE5E9] text-[#172B3A] rounded-xl text-xs font-semibold transition-colors cursor-pointer shadow-2xs"
                  >
                    {centerModal.secondaryButtonText}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const cb = centerModal.onConfirm;
                      setCenterModal(null);
                      if (cb) cb();
                    }}
                    className="flex-1 py-2.5 px-4 bg-[#C9414D] hover:bg-[#A32D37] text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>{centerModal.buttonText || 'Sign Out'}</span>
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    const cb = centerModal.onConfirm;
                    setCenterModal(null);
                    if (cb) cb();
                  }}
                  className="w-full py-2.5 px-4 bg-[#612536] hover:bg-[#4C1C2B] text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>{centerModal.buttonText || 'Continue'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Toast container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="status"
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg transition-all animate-in fade-in slide-in-from-bottom-3 duration-200 ${
              toast.type === 'success'
                ? 'bg-[#E7F7F0] border-[#159A78]/30 text-[#0f5c49]'
                : toast.type === 'error'
                ? 'bg-[#FFF0F1] border-[#DC5263]/30 text-[#9b2130]'
                : toast.type === 'warning'
                ? 'bg-[#FFF5DF] border-[#E7A23B]/30 text-[#8c5609]'
                : 'bg-[#F4F8FC] border-[#2588D8]/30 text-[#12365A]'
            }`}
          >
            <div className="shrink-0 mt-0.5">
              {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-[#159A78]" />}
              {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-[#DC5263]" />}
              {toast.type === 'warning' && <AlertTriangle className="w-5 h-5 text-[#E7A23B]" />}
              {toast.type === 'info' && <Info className="w-5 h-5 text-[#2588D8]" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold">{toast.title}</p>
              {toast.message && <p className="text-xs mt-0.5 opacity-90 leading-relaxed">{toast.message}</p>}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 text-gray-400 hover:text-gray-700 p-0.5 rounded transition-colors"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
