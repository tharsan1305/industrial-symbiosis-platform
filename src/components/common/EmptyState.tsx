import React, { ReactNode } from 'react';
import { LucideIcon, Layers, AlertCircle, X } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = Layers,
  title,
  description,
  action,
}) => {
  return (
    <div className="py-12 px-4 text-center max-w-md mx-auto">
      <div className="w-14 h-14 mx-auto rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center text-stone-500 mb-4">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-base font-bold text-stone-900 dark:text-white">{title}</h3>
      <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="mt-5 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-sm font-semibold transition cursor-pointer"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDestructive = false,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
      <div className="bg-white dark:bg-stone-900 rounded-xl max-w-md w-full p-6 shadow-2xl border border-stone-200 dark:border-stone-800">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-bold text-stone-900 dark:text-white">{title}</h3>
          <button onClick={onCancel} className="text-stone-400 hover:text-stone-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="mt-2 text-sm text-stone-600 dark:text-stone-300">{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-semibold text-white rounded-lg transition ${
              isDestructive
                ? 'bg-rose-600 hover:bg-rose-700'
                : 'bg-emerald-700 hover:bg-emerald-800'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export class ErrorBoundary extends React.Component<
  { children: ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: any) {
    console.error('App Error caught by boundary:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-white dark:bg-stone-900 p-8 rounded-xl border border-rose-200 shadow-lg text-center">
            <AlertCircle className="w-12 h-12 text-rose-600 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-stone-900 dark:text-white">Something went wrong</h2>
            <p className="mt-2 text-sm text-stone-600 dark:text-stone-400">
              {this.state.error?.message || 'An unexpected error occurred in this view.'}
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.reload();
              }}
              className="mt-6 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-sm font-semibold transition"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
