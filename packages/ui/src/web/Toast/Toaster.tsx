import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from './Toast';
import { useToast } from './useToast';

/**
 * Toaster Component - Web
 *
 * Toast notification container. Add once to root of application.
 * Use `useToast` hook to show notifications.
 *
 * @example
 * ```tsx
 * // In App.tsx
 * import { Toaster } from '@tower/ui/web';
 *
 * export function App() {
 *   return (
 *     <>
 *       <YourApp />
 *       <Toaster />
 *     </>
 *   );
 * }
 *
 * // In any component
 * import { useToast } from '@tower/ui/web';
 *
 * function MyComponent() {
 *   const { toast } = useToast();
 *
 *   return (
 *     <button
 *       onClick={() => {
 *         toast({
 *           title: "Equipment installed",
 *           description: "Alpha Radio installed successfully",
 *           variant: "success",
 *         });
 *       }}
 *     >
 *       Install Equipment
 *     </button>
 *   );
 * }
 * ```
 */
export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast key={id} {...props}>
            <div className="grid gap-1">
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
