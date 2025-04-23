import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface NotificationsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Exemple de données de notifications
const notifications = [
  {
    id: 1,
    type: "water",
    title: "Arrosage nécessaire",
    plant: "Ficus Lyrata",
    date: new Date(Date.now() - 24 * 60 * 60 * 1000),
    read: false,
  },
  {
    id: 2,
    type: "alert",
    title: "Problème détecté",
    plant: "Orchidée",
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    read: true,
  },
  {
    id: 3,
    type: "fertilize",
    title: "Temps de fertiliser",
    plant: "Basilic",
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    read: false,
  },
];

export default function NotificationsDialog({ open, onOpenChange }: NotificationsDialogProps) {
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

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "water":
        return <span className="material-icons text-primary">opacity</span>;
      case "alert":
        return <span className="material-icons text-alert">warning</span>;
      case "fertilize":
        return <span className="material-icons text-green-500">spa</span>;
      default:
        return <span className="material-icons text-gray-500">notifications</span>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Notifications</DialogTitle>
          <DialogDescription>
            Restez informé des besoins de vos plantes
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[400px] py-2">
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
                  className={`p-3 rounded-lg ${notification.read ? 'bg-white' : 'bg-primary-light/10'} hover:bg-gray-100 transition-colors cursor-pointer`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1">{getNotificationIcon(notification.type)}</div>
                    <div className="flex-grow">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium text-sm">{notification.title}</h4>
                        <span className="text-xs text-gray-500">{formatDate(notification.date)}</span>
                      </div>
                      <p className="text-sm text-gray-600">Plante: {notification.plant}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}