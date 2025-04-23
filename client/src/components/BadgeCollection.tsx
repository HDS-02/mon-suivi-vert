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

  // Composant pour afficher un badge individuel
  const BadgeItem = ({ badge }: { badge: BadgeType }) => (
    <div 
      className={`p-4 rounded-lg shadow-sm flex flex-col items-center text-center
        ${badge.unlocked 
          ? "bg-primary/10 border border-primary/20" 
          : "bg-gray-100 border border-gray-200 opacity-70"
        }`}
    >
      <div className="mb-2 w-12 h-12 flex items-center justify-center rounded-full bg-white shadow-sm">
        <span className={`material-icons text-2xl ${badge.unlocked ? "text-primary" : "text-gray-400"}`}>
          {badge.icon}
        </span>
      </div>
      <h3 className="text-sm font-medium mb-1">{badge.name}</h3>
      <p className="text-xs text-gray-500 mb-2">{badge.description}</p>
      
      {badge.progress !== undefined && badge.maxProgress !== undefined && (
        <div className="w-full mt-auto">
          <div className="text-xs text-gray-500 mb-1 flex justify-between">
            <span>{badge.progress}/{badge.maxProgress}</span>
            <span>{Math.round((badge.progress / badge.maxProgress) * 100)}%</span>
          </div>
          <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary"
              style={{ width: `${(badge.progress / badge.maxProgress) * 100}%` }}
            ></div>
          </div>
        </div>
      )}
      
      {badge.unlocked && badge.unlockedAt && (
        <div className="mt-2 text-xs text-gray-400">
          Débloqué le {new Date(badge.unlockedAt).toLocaleDateString("fr-FR")}
        </div>
      )}
    </div>
  );

  // Placeholder pour les badges en cours de chargement
  const BadgeSkeleton = () => (
    <div className="p-4 rounded-lg shadow-sm bg-gray-50 flex flex-col items-center">
      <Skeleton className="mb-2 w-12 h-12 rounded-full" />
      <Skeleton className="w-2/3 h-4 mb-1" />
      <Skeleton className="w-full h-3 mb-3" />
      <Skeleton className="w-full h-1 mb-2" />
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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-raleway font-semibold">Mes Badges</h2>
        <div className="text-sm text-gray-500">
          {!isBadgesLoading && badges && (
            <>{getUnlockedBadges().length} débloqué(s) sur {badges.length}</>
          )}
        </div>
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