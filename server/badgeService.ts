import { Badge } from "@shared/schema";

// Liste des badges disponibles
const defaultBadges: Badge[] = [
  {
    id: "first-plant",
    name: "Premier pas vert",
    description: "Ajoutez votre première plante à l'application",
    icon: "local_florist",
    category: "collection",
    unlocked: false,
  },
  {
    id: "plant-collection-5",
    name: "Jardinier amateur",
    description: "Ajoutez 5 plantes à votre collection",
    icon: "spa",
    category: "collection",
    unlocked: false,
    progress: 0,
    maxProgress: 5,
  },
  {
    id: "plant-collection-10",
    name: "Jardinier passionné",
    description: "Ajoutez 10 plantes à votre collection",
    icon: "park",
    category: "collection",
    unlocked: false,
    progress: 0,
    maxProgress: 10,
  },
  {
    id: "first-analysis",
    name: "Analyste débutant",
    description: "Effectuez votre première analyse de plante",
    icon: "analytics",
    category: "analyse",
    unlocked: false,
  },
  {
    id: "analysis-5",
    name: "Analyste expérimenté",
    description: "Effectuez 5 analyses de plantes",
    icon: "bar_chart",
    category: "analyse",
    unlocked: false,
    progress: 0,
    maxProgress: 5,
  },
  {
    id: "tasks-completed-10",
    name: "Entretien régulier",
    description: "Complétez 10 tâches d'entretien",
    icon: "task_alt",
    category: "entretien",
    unlocked: false,
    progress: 0,
    maxProgress: 10,
  },
  {
    id: "tasks-completed-25",
    name: "Main verte",
    description: "Complétez 25 tâches d'entretien",
    icon: "eco",
    category: "entretien",
    unlocked: false,
    progress: 0,
    maxProgress: 25,
  },
  {
    id: "healthy-plants-5",
    name: "Gardien des plantes",
    description: "Maintenez 5 plantes en bonne santé simultanément",
    icon: "healing",
    category: "progression",
    unlocked: false,
    progress: 0,
    maxProgress: 5,
  },
  {
    id: "consecutive-login-7",
    name: "Jardinier assidu",
    description: "Connectez-vous 7 jours consécutifs",
    icon: "calendar_month",
    category: "progression",
    unlocked: false,
    progress: 0,
    maxProgress: 7,
  }
];

// Map pour stocker les badges par utilisateur
const userBadges = new Map<number, Badge[]>();

export class BadgeService {
  // Récupérer les badges d'un utilisateur
  public getBadgesByUserId(userId: number): Badge[] {
    if (!userBadges.has(userId)) {
      // Copie profonde pour éviter de modifier les badges par défaut
      userBadges.set(userId, JSON.parse(JSON.stringify(defaultBadges)));
    }
    return userBadges.get(userId) || [];
  }

  // Déverrouiller un badge
  public unlockBadge(userId: number, badgeId: string): Badge | null {
    const badges = this.getBadgesByUserId(userId);
    const badge = badges.find(b => b.id === badgeId);
    
    if (badge && !badge.unlocked) {
      badge.unlocked = true;
      badge.unlockedAt = new Date();
      return badge;
    }
    
    return null;
  }

  // Mettre à jour la progression d'un badge
  public updateBadgeProgress(userId: number, badgeId: string, progress: number): Badge | null {
    const badges = this.getBadgesByUserId(userId);
    const badge = badges.find(b => b.id === badgeId);
    
    if (badge && badge.maxProgress !== undefined) {
      badge.progress = progress;
      if (progress >= badge.maxProgress && !badge.unlocked) {
        badge.unlocked = true;
        badge.unlockedAt = new Date();
      }
      return badge;
    }
    
    return null;
  }

  // Vérifier et mettre à jour les badges liés à l'ajout de plantes
  public checkPlantCollectionBadges(userId: number, plantCount: number): Badge[] {
    const unlockedBadges: Badge[] = [];
    const badges = this.getBadgesByUserId(userId);
    
    // Premier plant
    if (plantCount >= 1) {
      const firstPlantBadge = badges.find(b => b.id === "first-plant");
      if (firstPlantBadge && !firstPlantBadge.unlocked) {
        firstPlantBadge.unlocked = true;
        firstPlantBadge.unlockedAt = new Date();
        unlockedBadges.push(firstPlantBadge);
      }
    }
    
    // 5 plantes
    const plantCollection5Badge = badges.find(b => b.id === "plant-collection-5");
    if (plantCollection5Badge) {
      plantCollection5Badge.progress = Math.min(plantCount, plantCollection5Badge.maxProgress || 5);
      if (plantCount >= 5 && !plantCollection5Badge.unlocked) {
        plantCollection5Badge.unlocked = true;
        plantCollection5Badge.unlockedAt = new Date();
        unlockedBadges.push(plantCollection5Badge);
      }
    }
    
    // 10 plantes
    const plantCollection10Badge = badges.find(b => b.id === "plant-collection-10");
    if (plantCollection10Badge) {
      plantCollection10Badge.progress = Math.min(plantCount, plantCollection10Badge.maxProgress || 10);
      if (plantCount >= 10 && !plantCollection10Badge.unlocked) {
        plantCollection10Badge.unlocked = true;
        plantCollection10Badge.unlockedAt = new Date();
        unlockedBadges.push(plantCollection10Badge);
      }
    }
    
    return unlockedBadges;
  }

  // Vérifier et mettre à jour les badges liés aux analyses
  public checkAnalysisBadges(userId: number, analysisCount: number): Badge[] {
    const unlockedBadges: Badge[] = [];
    const badges = this.getBadgesByUserId(userId);
    
    // Première analyse
    if (analysisCount >= 1) {
      const firstAnalysisBadge = badges.find(b => b.id === "first-analysis");
      if (firstAnalysisBadge && !firstAnalysisBadge.unlocked) {
        firstAnalysisBadge.unlocked = true;
        firstAnalysisBadge.unlockedAt = new Date();
        unlockedBadges.push(firstAnalysisBadge);
      }
    }
    
    // 5 analyses
    const analysis5Badge = badges.find(b => b.id === "analysis-5");
    if (analysis5Badge) {
      analysis5Badge.progress = Math.min(analysisCount, analysis5Badge.maxProgress || 5);
      if (analysisCount >= 5 && !analysis5Badge.unlocked) {
        analysis5Badge.unlocked = true;
        analysis5Badge.unlockedAt = new Date();
        unlockedBadges.push(analysis5Badge);
      }
    }
    
    return unlockedBadges;
  }

  // Vérifier et mettre à jour les badges liés aux tâches
  public checkTaskCompletionBadges(userId: number, taskCount: number): Badge[] {
    const unlockedBadges: Badge[] = [];
    const badges = this.getBadgesByUserId(userId);
    
    // 10 tâches
    const tasks10Badge = badges.find(b => b.id === "tasks-completed-10");
    if (tasks10Badge) {
      tasks10Badge.progress = Math.min(taskCount, tasks10Badge.maxProgress || 10);
      if (taskCount >= 10 && !tasks10Badge.unlocked) {
        tasks10Badge.unlocked = true;
        tasks10Badge.unlockedAt = new Date();
        unlockedBadges.push(tasks10Badge);
      }
    }
    
    // 25 tâches
    const tasks25Badge = badges.find(b => b.id === "tasks-completed-25");
    if (tasks25Badge) {
      tasks25Badge.progress = Math.min(taskCount, tasks25Badge.maxProgress || 25);
      if (taskCount >= 25 && !tasks25Badge.unlocked) {
        tasks25Badge.unlocked = true;
        tasks25Badge.unlockedAt = new Date();
        unlockedBadges.push(tasks25Badge);
      }
    }
    
    return unlockedBadges;
  }

  // Vérifier le badge de plantes en bonne santé
  public checkHealthyPlantsBadge(userId: number, healthyPlantsCount: number): Badge | null {
    const badges = this.getBadgesByUserId(userId);
    const healthyPlantsBadge = badges.find(b => b.id === "healthy-plants-5");
    
    if (healthyPlantsBadge) {
      healthyPlantsBadge.progress = Math.min(healthyPlantsCount, healthyPlantsBadge.maxProgress || 5);
      if (healthyPlantsCount >= 5 && !healthyPlantsBadge.unlocked) {
        healthyPlantsBadge.unlocked = true;
        healthyPlantsBadge.unlockedAt = new Date();
        return healthyPlantsBadge;
      }
    }
    
    return null;
  }

  // Mettre à jour le badge de connexion consécutive
  public updateConsecutiveLoginBadge(userId: number, days: number): Badge | null {
    const badges = this.getBadgesByUserId(userId);
    const consecutiveLoginBadge = badges.find(b => b.id === "consecutive-login-7");
    
    if (consecutiveLoginBadge) {
      consecutiveLoginBadge.progress = Math.min(days, consecutiveLoginBadge.maxProgress || 7);
      if (days >= 7 && !consecutiveLoginBadge.unlocked) {
        consecutiveLoginBadge.unlocked = true;
        consecutiveLoginBadge.unlockedAt = new Date();
        return consecutiveLoginBadge;
      }
    }
    
    return null;
  }
}

export const badgeService = new BadgeService();