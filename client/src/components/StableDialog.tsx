import React, { ReactNode } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StableDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
  title?: string;
  description?: string;
  className?: string;
  showCloseButton?: boolean;
}

export function StableDialog({
  open,
  onOpenChange,
  children,
  title,
  description,
  className,
  showCloseButton = false
}: StableDialogProps) {
  // Empêcher la fermeture lors des clics sur le contenu
  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  // Empêcher complètement toutes les méthodes de fermeture automatique
  const preventClose = (e: Event) => {
    e.preventDefault();
  };

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange} modal={true}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay 
          className="fixed inset-0 z-50 bg-black/80 transition-opacity animate-in fade-in" 
          onClick={handleContentClick}
        />
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <DialogPrimitive.Content
            className={cn(
              "fixed z-50 w-full max-w-md rounded-lg bg-white p-6 shadow-lg animate-in fade-in-90 slide-in-from-bottom-10 sm:zoom-in-90 sm:slide-in-from-bottom-0",
              className
            )}
            onPointerDownOutside={preventClose}
            onInteractOutside={preventClose}
            onEscapeKeyDown={preventClose}
            onClick={handleContentClick}
          >
            {title && (
              <div className="mb-4 border-b pb-3">
                <DialogPrimitive.Title className="text-lg font-semibold">
                  {title}
                </DialogPrimitive.Title>
                {description && (
                  <DialogPrimitive.Description className="text-sm text-gray-500 mt-1">
                    {description}
                  </DialogPrimitive.Description>
                )}
              </div>
            )}
            
            {children}
            
            {showCloseButton && (
              <DialogPrimitive.Close 
                className="absolute top-3 right-3 rounded-full p-1 text-gray-500 opacity-70 hover:opacity-100 focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Fermer</span>
              </DialogPrimitive.Close>
            )}
          </DialogPrimitive.Content>
        </div>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}