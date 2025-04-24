import { useEffect } from "react";
import { StableDialog } from "./StableDialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import useNotifications from "@/hooks/useNotifications";
import useTasks from "@/hooks/useTasks";

interface NotificationsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function NotificationsDialog({ open, onOpenChange }: NotificationsDialogProps) {
  const {
    notifications,
    markAsRead,
    markAllAsRead,
    clearNotifications,
    removeNotification,
    requestPermission,
    permission,
  } = useNotifications();
  
  const tasksQuery = useTasks();
  const tasks = tasksQuery.data || [];
  const isTasksLoading = tasksQuery.isLoading;

  // Vérifier les notifications de tâches lorsque le dialogue s'ouvre
  useEffect(() => {
    if (open && tasks.length > 0 && !isTasksLoading) {
      // Ici, nous utiliserions createTaskNotifications, mais comme c'est un prototype,
      // nous ne voulons pas générer de notifications à chaque ouverture du dialogue
    }
  }, [open, tasks, isTasksLoading]);

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 3600 * 24));
    
    if (diffInDays === 0) {
      return "Aujourd'hui";
    } else if (diffInDays === 1) {
      return "Hier";
    } else if (diffInDays < 7) {
      return `Il y a ${diffInDays} jours`;
    } else {
      return date.toLocaleDateString("fr-FR");
    }
  };

  const getNotificationIcon = (type: 'info' | 'warning' | 'success') => {
    switch (type) {
      case "info":
        return <span className="material-icons text-primary">info</span>;
      case "warning":
        return <span className="material-icons text-orange-500">warning</span>;
      case "success":
        return <span className="material-icons text-green-500">check_circle</span>;
      default:
        return <span className="material-icons text-gray-500">notifications</span>;
    }
  };

  const handleRequestPermission = async () => {
    const granted = await requestPermission();
    if (granted) {
      // Afficher un message de succès ou créer des notifications tests
    }
  };

  return (
    <StableDialog
      open={open}
      onOpenChange={onOpenChange}
      title={
        <span className="flex items-center gap-2 text-primary-dark font-raleway text-xl">
          <span className="material-icons">notifications</span>
          Notifications
        </span>
      }
      description="Restez informé des besoins de vos plantes"
      className="sm:max-w-md glass-card backdrop-blur-sm border border-primary/20 shadow-xl"
      showCloseButton={true}
    >
      {permission !== 'granted' && (
        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md text-sm">
          <div className="flex items-start gap-2">
            <span className="material-icons text-yellow-500 text-lg mt-0.5">notifications_active</span>
            <div>
              <p className="text-yellow-800 mb-2">Activez les notifications pour ne jamais manquer un rappel d'entretien.</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRequestPermission}
                className="text-xs py-1 h-auto"
              >
                Activer les notifications
              </Button>
            </div>
          </div>
        </div>
      )}

      <ScrollArea className="h-[300px] py-2">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-52 text-center text-gray-500">
            <span className="material-icons text-3xl mb-2">notifications_none</span>
            <p>Aucune notification pour le moment</p>
          </div>
        ) : (
          <div className="space-y-2">
            {notifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`p-3 rounded-lg ${notification.read ? 'bg-white' : 'bg-primary/5'} hover:bg-gray-100 transition-colors cursor-pointer`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1">{getNotificationIcon(notification.type)}</div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium text-sm">{notification.title}</h4>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-500">{formatDate(notification.date)}</span>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            removeNotification(notification.id);
                          }}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <span className="material-icons text-sm">close</span>
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{notification.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      <div className="mt-2 flex justify-between items-center pt-3 border-t border-gray-100">
        <div className="text-xs text-gray-500">
          {notifications.length > 0 && (
            <>{notifications.filter(n => !n.read).length} non lu(s)</>
          )}
        </div>
        <div className="flex gap-2">
          {notifications.length > 0 && (
            <>
              <Button variant="outline" size="sm" onClick={markAllAsRead}>
                Tout marquer comme lu
              </Button>
              <Button variant="ghost" size="sm" onClick={clearNotifications}>
                Effacer tout
              </Button>
            </>
          )}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onOpenChange(false)}
            className="border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600"
          >
            <span className="material-icons text-sm mr-1">close</span>
            Fermer
          </Button>
        </div>
      </div>
    </StableDialog>
  );
}