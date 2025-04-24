import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import useBadges from "@/hooks/useBadges";
import { Badge as BadgeType } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";
import { Card } from "@/components/ui/card";

export default function BadgeCollection() {
  const { user } = useAuth();
  const {
    badges,
    isBadgesLoading,
    getBadgesByCategory,
    getUnlockedBadges,
    getInProgressBadges,
  } = useBadges();
  const [activeTab, setActiveTab] = useState("tous");

  // Mettre à jour les données des badges au chargement du composant
  useEffect(() => {
    if (user) {
      // En production, nous aurions des fonctions pour vérifier les badges
      // à chaque action de l'utilisateur (ajout de plante, tâche complétée, etc.)
    }
  }, [user]);

  // Filtrer les badges selon l'onglet actif
  const getFilteredBadges = () => {
    switch (activeTab) {
      case "debloqués":
        return getUnlockedBadges();
      case "en-cours":
        return getInProgressBadges();
      case "entretien":
        return getBadgesByCategory("entretien");
      case "analyse":
        return getBadgesByCategory("analyse");
      case "collection":
        return getBadgesByCategory("collection");
      case "progression":
        return getBadgesByCategory("progression");
      default:
        return badges || [];
    }
  };

  // Composant pour afficher un badge individuel avec des effets visuels améliorés
  const BadgeItem = ({ badge }: { badge: BadgeType }) => {
    const [isHovered, setIsHovered] = useState(false);
    
    // Calculer le pourcentage de progression
    const progressPercent = badge.progress !== undefined && badge.maxProgress !== undefined
      ? Math.round((badge.progress / badge.maxProgress) * 100)
      : 0;
    
    // Déterminer les classes et styles en fonction de l'état du badge
    const getBadgeStyle = () => {
      if (badge.unlocked) {
        return {
          container: `relative p-5 rounded-xl shadow-md flex flex-col items-center text-center 
                      transition-all duration-300 cursor-pointer transform
                      ${isHovered ? "scale-[1.03] shadow-lg" : ""}
                      bg-gradient-to-br from-primary-light/20 to-primary/30 
                      border border-primary/30`,
          icon: "mb-3 w-16 h-16 flex items-center justify-center rounded-full bg-white shadow-md",
          iconColor: `text-3xl ${getBadgeIconColor()}`,
          title: "font-raleway text-base font-semibold mb-1 text-gray-800",
          description: "text-xs text-gray-600 mb-3"
        };
      } else {
        return {
          container: `relative p-5 rounded-xl shadow-sm flex flex-col items-center text-center 
                      transition-all duration-300
                      bg-gray-100/80 backdrop-blur-sm border border-gray-200`,
          icon: "mb-3 w-16 h-16 flex items-center justify-center rounded-full bg-white/80 shadow-sm",
          iconColor: "text-3xl text-gray-400",
          title: "font-raleway text-base font-medium mb-1 text-gray-600",
          description: "text-xs text-gray-500 mb-3"
        };
      }
    };
    
    // Déterminer la couleur de l'icône en fonction de la catégorie
    function getBadgeIconColor() {
      switch (badge.category) {
        case "collection": return "text-emerald-500";
        case "entretien": return "text-blue-500";
        case "analyse": return "text-purple-500";
        case "progression": return "text-amber-500";
        default: return "text-primary";
      }
    }
    
    const styles = getBadgeStyle();
    
    return (
      <div 
        className={styles.container}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Badge bloqué/débloqué indicator */}
        {badge.unlocked && (
          <div className="absolute -top-1 -right-1 w-7 h-7 bg-green-500 rounded-full flex items-center justify-center shadow-md">
            <span className="material-icons text-white text-sm">check</span>
          </div>
        )}
        
        {/* Icon container */}
        <div className={styles.icon}>
          <span className={`material-icons ${styles.iconColor}`}>
            {badge.icon}
          </span>
        </div>
        
        {/* Badge title and description */}
        <h3 className={styles.title}>{badge.name}</h3>
        <p className={styles.description}>{badge.description}</p>
        
        {/* Progress bar for badges in progress */}
        {badge.progress !== undefined && badge.maxProgress !== undefined && (
          <div className="w-full mt-auto">
            <div className="text-xs font-medium mb-1 flex justify-between">
              <span className={badge.unlocked ? "text-primary" : "text-gray-500"}>
                {badge.progress}/{badge.maxProgress}
              </span>
              <span className={badge.unlocked ? "text-primary" : "text-gray-500"}>
                {progressPercent}%
              </span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-500 ${badge.unlocked ? 'bg-gradient-to-r from-primary to-primary-light' : 'bg-primary/40'}`}
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
        )}
        
        {/* Date d'obtention pour les badges débloqués */}
        {badge.unlocked && badge.unlockedAt && (
          <div className="mt-3 py-1 px-2 rounded-full bg-white/60 text-xs text-gray-500">
            Débloqué le {new Date(badge.unlockedAt).toLocaleDateString("fr-FR")}
          </div>
        )}
      </div>
    );
  };

  // Placeholder amélioré pour les badges en cours de chargement
  const BadgeSkeleton = () => (
    <div className="p-5 rounded-xl shadow-md bg-gray-50/80 backdrop-blur-sm border border-gray-100 flex flex-col items-center">
      <Skeleton className="mb-3 w-16 h-16 rounded-full" />
      <Skeleton className="w-3/4 h-5 mb-1" />
      <Skeleton className="w-full h-3 mb-3" />
      <Skeleton className="w-full h-2 mb-1" />
      <Skeleton className="w-1/2 h-6 rounded-full mt-3" />
    </div>
  );

  // Si l'utilisateur n'est pas connecté, afficher un message
  if (!user) {
    return (
      <Card className="p-6 text-center">
        <p className="text-gray-600">Connectez-vous pour voir vos badges.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête avec résumé des badges */}
      <div className="bg-gradient-to-br from-primary-light/20 to-primary/30 rounded-xl p-4 shadow-md backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-raleway font-semibold text-gray-800 mb-1">Mes Badges</h2>
            <p className="text-gray-600 text-sm">
              {!isBadgesLoading && badges ? (
                <>Suivez votre progression et déverrouillez des récompenses</>
              ) : (
                <>Chargement des badges...</>
              )}
            </p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm px-3 py-2 rounded-full shadow-sm flex items-center">
            <span className="material-icons text-primary mr-2">emoji_events</span>
            <span className="font-medium">
              {!isBadgesLoading && badges ? (
                <>{getUnlockedBadges().length} / {badges.length} débloqués</>
              ) : (
                <>Chargement...</>
              )}
            </span>
          </div>
        </div>
        
        {/* Statistiques des badges par catégorie */}
        {!isBadgesLoading && badges && badges.length > 0 && (
          <div className="grid grid-cols-4 gap-2 mt-3">
            {['collection', 'entretien', 'analyse', 'progression'].map((category) => {
              const categoryBadges = getBadgesByCategory(category as any);
              const unlockedCount = categoryBadges.filter(b => b.unlocked).length;
              const totalCount = categoryBadges.length;
              
              return (
                <div key={category} className="bg-white/40 backdrop-blur-sm rounded-lg p-2 text-center">
                  <span className="material-icons text-sm mb-1" style={{
                    color: category === 'collection' ? '#10b981' :
                           category === 'entretien' ? '#3b82f6' :
                           category === 'analyse' ? '#8b5cf6' :
                           '#f59e0b'
                  }}>
                    {category === 'collection' ? 'eco' :
                     category === 'entretien' ? 'water_drop' :
                     category === 'analyse' ? 'search' :
                     'trending_up'}
                  </span>
                  <div className="text-xs font-medium">{unlockedCount}/{totalCount}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      <Tabs defaultValue="tous" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="tous">Tous</TabsTrigger>
          <TabsTrigger value="debloqués">Débloqués</TabsTrigger>
          <TabsTrigger value="en-cours">En cours</TabsTrigger>
          <TabsTrigger value="collection">Collection</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeTab} className="space-y-4">
          {isBadgesLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array(8).fill(0).map((_, i) => (
                <BadgeSkeleton key={i} />
              ))}
            </div>
          ) : (
            <>
              {getFilteredBadges().length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {getFilteredBadges().map((badge) => (
                    <BadgeItem key={badge.id} badge={badge} />
                  ))}
                </div>
              ) : (
                <div className="text-center p-8 bg-gray-50 rounded-lg">
                  <span className="material-icons text-4xl text-gray-300 mb-2">
                    emoji_events
                  </span>
                  <p className="text-gray-500">
                    {activeTab === "debloqués"
                      ? "Vous n'avez pas encore débloqué de badges"
                      : activeTab === "en-cours"
                      ? "Aucun badge en cours de progression"
                      : "Aucun badge dans cette catégorie"}
                  </p>
                </div>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}