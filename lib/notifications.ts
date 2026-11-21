import { toast } from "react-toastify";

const toastOptions = { autoClose: 3800, closeOnClick: false } as const;

export const notify = {
  success: (message: string) => toast.success(message, { ...toastOptions, toastId: message }),
  error: (message: string) => toast.error(message, { ...toastOptions, toastId: message }),
  warning: (message: string) => toast.warning(message, { ...toastOptions, toastId: message }),
  info: (message: string) => toast.info(message, { ...toastOptions, toastId: message }),
};
