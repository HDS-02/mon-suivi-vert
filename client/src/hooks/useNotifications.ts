import { useState, useEffect } from 'react';
import { Task } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success';
  date: Date;
  read: boolean;
  taskId?: number;
}

export default function useNotifications() {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [permission, setPermission] = useState<NotificationPermission>('default');

  // Demander la permission pour les notifications lors du premier chargement
  useEffect(() => {
    if (Notification && 'permission' in Notification) {
      setPermission(Notification.permission);
    }
  }, []);

  // Demander l'autorisation pour les notifications du navigateur
  const requestPermission = async () => {
    if (!('Notification' in window)) {
      // Les notifications ne sont pas supportées par le navigateur
      console.log('Ce navigateur ne supporte pas les notifications.');
      return false;
    }

    if (Notification.permission === 'granted') {
      setPermission('granted');
      return true;
    }

    if (Notification.permission !== 'denied') {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result === 'granted';
    }

    return false;
  };

  // Ajouter une notification
  const addNotification = (notification: Omit<Notification, 'id' | 'date' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substring(2),
      date: new Date(),
      read: false,
    };

    setNotifications(prev => [newNotification, ...prev]);

    // Afficher un toast
    toast({
      title: notification.title,
      description: notification.message,
      variant: notification.type === 'warning' ? 'destructive' : 'default',
    });

    // Envoyer une notification du navigateur si autorisé
    if (permission === 'granted') {
      try {
        new Notification(notification.title, {
          body: notification.message,
          icon: '/favicon.ico',
        });
      } catch (error) {
        console.error('Erreur lors de l\'envoi de la notification:', error);
      }
    }

    return newNotification;
  };

  // Créer des notifications pour les tâches dues aujourd'hui
  const createTaskNotifications = (tasks: Task[]) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const dueTasks = tasks.filter(task => {
      if (task.completed) return false;
      if (!task.dueDate) return false;

      const dueDate = new Date(task.dueDate);
      dueDate.setHours(0, 0, 0, 0);

      return dueDate.getTime() === today.getTime();
    });

    for (const task of dueTasks) {
      // Vérifier si une notification existe déjà pour cette tâche
      const existingNotif = notifications.find(n => n.taskId === task.id);
      if (!existingNotif) {
        addNotification({
          title: 'Rappel d\'entretien',
          message: `N'oubliez pas : ${task.description}`,
          type: 'info',
          taskId: task.id,
        });
      }
    }
  };

  // Marquer une notification comme lue
  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  // Marquer toutes les notifications comme lues
  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  // Supprimer une notification
  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  // Supprimer toutes les notifications
  const clearNotifications = () => {
    setNotifications([]);
  };

  // Obtenir les notifications non lues
  const getUnreadNotifications = () => {
    return notifications.filter(notification => !notification.read);
  };

  return {
    notifications,
    unreadCount: getUnreadNotifications().length,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearNotifications,
    requestPermission,
    permission,
    createTaskNotifications,
  };
}