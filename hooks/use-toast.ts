import { useState, useCallback } from "react";

export interface Toast {
  id: string;
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
  duration?: number;
}

interface ToastState {
  toasts: Toast[];
}

const TOAST_REMOVE_DELAY = 5000;

let toastCount = 0;

function generateId() {
  toastCount = (toastCount + 1) % Number.MAX_SAFE_INTEGER;
  return toastCount.toString();
}

const toastState: ToastState = {
  toasts: [],
};

const listeners: Array<(state: ToastState) => void> = [];

function dispatch(action: { type: string; toast?: Toast; toastId?: string }) {
  switch (action.type) {
    case "ADD_TOAST":
      if (action.toast) {
        toastState.toasts = [action.toast, ...toastState.toasts];
      }
      break;
    case "UPDATE_TOAST":
      if (action.toast) {
        toastState.toasts = toastState.toasts.map((t) =>
          t.id === action.toast!.id ? { ...t, ...action.toast } : t
        );
      }
      break;
    case "DISMISS_TOAST":
      if (action.toastId) {
        toastState.toasts = toastState.toasts.filter(
          (t) => t.id !== action.toastId
        );
      } else {
        toastState.toasts = [];
      }
      break;
    case "REMOVE_TOAST":
      if (action.toastId) {
        toastState.toasts = toastState.toasts.filter(
          (t) => t.id !== action.toastId
        );
      }
      break;
  }

  listeners.forEach((listener) => {
    listener(toastState);
  });
}

function toast({
  title,
  description,
  variant = "default",
  duration = TOAST_REMOVE_DELAY,
  ...props
}: Omit<Toast, "id">) {
  const id = generateId();

  const newToast: Toast = {
    id,
    title,
    description,
    variant,
    duration,
    ...props,
  };

  dispatch({
    type: "ADD_TOAST",
    toast: newToast,
  });

  setTimeout(() => dismiss(id), duration);

  return {
    id,
    dismiss: () => dismiss(id),
    update: (props: Partial<Toast>) =>
      dispatch({
        type: "UPDATE_TOAST",
        toast: { ...newToast, ...props },
      }),
  };
}

function dismiss(toastId?: string) {
  dispatch({ type: "DISMISS_TOAST", toastId });
}

export function useToast() {
  const [state, setState] = useState<ToastState>(toastState);

  const subscribe = useCallback((listener: (state: ToastState) => void) => {
    listeners.push(listener);
    return () => {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, []);

  useState(() => {
    const unsubscribe = subscribe(setState);
    return unsubscribe;
  });

  return {
    ...state,
    toast,
    dismiss,
  };
}
