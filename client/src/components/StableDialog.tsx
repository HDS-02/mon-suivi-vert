import React, { ReactNode, useState, useEffect } from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StableDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
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
  const [isOpen, setIsOpen] = useState(open);
  
  // Synchroniser notre état local avec les props
  useEffect(() => {
    setIsOpen(open);
  }, [open]);
  
  // Fonction de mise à jour contrôlée pour éviter les fermetures accidentelles
  const handleOpenChange = (newOpen: boolean) => {
    // Si on tente de fermer avec un clic, ne rien faire
    if (isOpen && !newOpen) {
      return;
    }
    
    // Sinon, autoriser le changement et notifier le parent
    setIsOpen(newOpen);
    onOpenChange(newOpen);
  };

  // Empêcher toutes les formes de fermeture automatique
  const preventClose = (e: Event) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={handleOpenChange} modal={true}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay 
          className="fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
          onClick={(e: React.MouseEvent) => e.stopPropagation()}
        />
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <DialogPrimitive.Content
            className={cn(
              "fixed z-50 w-full max-w-md rounded-lg bg-white p-6 shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
              className
            )}
            onPointerDownOutside={preventClose}
            onInteractOutside={preventClose}
            onEscapeKeyDown={preventClose}
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
            onOpenAutoFocus={(e: Event) => e.preventDefault()}
          >
            {title && (
              <div className="mb-4 border-b pb-3">
                {typeof title === 'string' ? (
                  <DialogPrimitive.Title className="text-lg font-semibold">
                    {title}
                  </DialogPrimitive.Title>
                ) : (
                  title
                )}
                
                {description && (
                  typeof description === 'string' ? (
                    <DialogPrimitive.Description className="text-sm text-gray-500 mt-1">
                      {description}
                    </DialogPrimitive.Description>
                  ) : (
                    description
                  )
                )}
              </div>
            )}
            
            <div className="relative" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
              {children}
            </div>
            
            {showCloseButton && (
              <button 
                className="absolute top-3 right-3 rounded-full p-1 text-gray-500 opacity-70 hover:opacity-100 focus:outline-none focus:ring-1 focus:ring-primary"
                onClick={() => onOpenChange(false)}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Fermer</span>
              </button>
            )}
          </DialogPrimitive.Content>
        </div>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}