import { toast } from 'sonner'

enum ToastType {
  Success = 'success',
  Error = 'error',
  Warning = 'warning',
  Info = 'info',
}

type ToastProps = {
  message: string
  duration?: number
}

const toastStyle = {
  [ToastType.Success]: {
    '--normal-bg':
      'color-mix(in oklab, light-dark(var(--color-green-600), var(--color-green-400)) 10%, var(--background))',
    '--normal-text': 'light-dark(var(--color-green-600), var(--color-green-400))',
    '--normal-border': 'light-dark(var(--color-green-600), var(--color-green-400))',
  },
  [ToastType.Error]: {
    '--normal-bg': 'color-mix(in oklab, var(--destructive) 10%, var(--background))',
    '--normal-text': 'var(--destructive)',
    '--normal-border': 'var(--destructive)',
  },
  [ToastType.Warning]: {
    '--normal-bg':
      'color-mix(in oklab, light-dark(var(--color-amber-600), var(--color-amber-400)) 10%, var(--background))',
    '--normal-text': 'light-dark(var(--color-amber-600), var(--color-amber-400))',
    '--normal-border': 'light-dark(var(--color-amber-600), var(--color-amber-400))',
  },
  [ToastType.Info]: {
    '--normal-bg':
      'color-mix(in oklab, light-dark(var(--color-sky-600), var(--color-sky-400)) 10%, var(--background))',
    '--normal-text': 'light-dark(var(--color-sky-600), var(--color-sky-400))',
    '--normal-border': 'light-dark(var(--color-sky-600), var(--color-sky-400))',
  },
}

export const toastSuccess = ({ message, duration = 3000 }: ToastProps) => {
  toast.success(message, {
    duration,
    style: toastStyle[ToastType.Success] as React.CSSProperties,
    position: 'top-right',
  })
}

export const toastError = ({ message, duration = 3000 }: ToastProps) => {
  toast.error(message, {
    duration,
    style: toastStyle[ToastType.Error] as React.CSSProperties,
    position: 'top-right',
  })
}

export const toastWarning = ({ message, duration = 3000 }: ToastProps) => {
  toast.warning(message, {
    duration,
    style: toastStyle[ToastType.Warning] as React.CSSProperties,
    position: 'top-right',
  })
}

export const toastInfo = ({ message, duration = 3000 }: ToastProps) => {
  toast.info(message, {
    duration,
    style: toastStyle[ToastType.Info] as React.CSSProperties,
    position: 'top-right',
  })
}
