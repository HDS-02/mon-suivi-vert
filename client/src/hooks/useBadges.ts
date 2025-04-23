import { useQuery, useMutation } from "@tanstack/react-query";
import { Badge } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";

interface BadgesResponse {
  unlockedBadges?: Badge[];
  updatedBadge?: Badge;
}

export default function useBadges() {
  const { toast } = useToast();
  const { user } = useAuth();

  // Récupérer tous les badges
  const {
    data: badges,
    isLoading: isBadgesLoading,
    error: badgesError,
  } = useQuery<Badge[]>({
    queryKey: ["/api/badges"],
    enabled: !!user, // Activer uniquement si l'utilisateur est connecté
  });

  // Mise à jour des badges liés à la collection de plantes
  const updatePlantCollectionBadges = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/badges/update-plant-collection", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour des badges");
      }
      
      return response.json() as Promise<BadgesResponse>;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/badges"] });
      
      if (data.unlockedBadges && data.unlockedBadges.length > 0) {
        // Afficher une notification pour chaque badge débloqué
        data.unlockedBadges.forEach((badge) => {
          toast({
            title: "🏆 Nouveau badge débloqué !",
            description: `${badge.name} - ${badge.description}`,
            variant: "success",
          });
        });
      }
    },
  });

  // Mise à jour des badges liés aux tâches
  const updateTaskBadges = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/badges/update-tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      
      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour des badges de tâches");
      }
      
      return response.json() as Promise<BadgesResponse>;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/badges"] });
      
      if (data.unlockedBadges && data.unlockedBadges.length > 0) {
        // Afficher une notification pour chaque badge débloqué
        data.unlockedBadges.forEach((badge) => {
          toast({
            title: "🏆 Nouveau badge débloqué !",
            description: `${badge.name} - ${badge.description}`,
            variant: "success",
          });
        });
      }
    },
  });

  // Mise à jour du badge de connexion consécutive
  const updateLoginStreak = useMutation({
    mutationFn: async (daysStreak: number) => {
      const response = await fetch("/api/badges/login-streak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ daysStreak }),
      });
      
      if (!response.ok) {
        throw new Error("Erreur lors de la mise à jour du badge de connexion");
      }
      
      return response.json() as Promise<BadgesResponse>;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/badges"] });
      
      if (data.updatedBadge && data.updatedBadge.unlocked) {
        toast({
          title: "🏆 Nouveau badge débloqué !",
          description: `${data.updatedBadge.name} - ${data.updatedBadge.description}`,
          variant: "success",
        });
      }
    },
  });

  // Filtrer les badges par catégorie
  const getBadgesByCategory = (category: string) => {
    return badges?.filter((badge) => badge.category === category) || [];
  };

  // Obtenir les badges débloqués
  const getUnlockedBadges = () => {
    return badges?.filter((badge) => badge.unlocked) || [];
  };

  // Obtenir les badges en cours
  const getInProgressBadges = () => {
    return badges?.filter((badge) => !badge.unlocked && badge.progress !== undefined && badge.progress > 0) || [];
  };

  return {
    badges,
    isBadgesLoading,
    badgesError,
    updatePlantCollectionBadges,
    updateTaskBadges,
    updateLoginStreak,
    getBadgesByCategory,
    getUnlockedBadges,
    getInProgressBadges,
  };
}