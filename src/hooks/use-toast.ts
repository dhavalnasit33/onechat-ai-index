export type ToastVariant = "default" | "destructive";

export type ToastOptions = {
  title: string;
  description?: string;
  variant?: ToastVariant | string;
  duration?: number; // ms, optional
};

export const toast = ({ title, description, variant = "default", duration = 3000 }: ToastOptions) => {
  if (typeof window === "undefined") {
    // Server: no-op or log
    // eslint-disable-next-line no-console
    console.log("toast:", { title, description, variant });
    return;
  }

  // Dispatch a CustomEvent that UI components can listen to and show a toast.
  const event = new CustomEvent("onechat:toast", {
    detail: { title, description, variant, duration },
  });
  window.dispatchEvent(event);
};

export default toast;
