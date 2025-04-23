import { Separator } from "@/components/ui/separator";
import BadgeCollection from "@/components/BadgeCollection";
import { useAuth } from "@/hooks/use-auth";
import useBadges from "@/hooks/useBadges";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Badges() {
  const { user } = useAuth();
  const { updatePlantCollectionBadges, updateTaskBadges } = useBadges();
  const { toast } = useToast();

  // Simuler une vérification de badges au chargement de la page
  useEffect(() => {
    if (user) {
      // Ceci est simplement pour la démonstration, en production nous aurions
      // des vérifications de badges à des moments spécifiques (ajout de plante, tâche complétée, etc.)
      const checkBadges = async () => {
        try {
          await updatePlantCollectionBadges.mutateAsync();
          await updateTaskBadges.mutateAsync();
        } catch (error) {
          // Ignorer les erreurs silencieusement
        }
      };
      
      checkBadges();
    }
  }, [user, updatePlantCollectionBadges, updateTaskBadges]);

  // Fonction de démonstration pour simuler l'obtention d'un badge
  const simulateUnlockBadge = () => {
    toast({
      title: "🏆 Nouveau badge débloqué !",
      description: "Premier pas vert - Ajoutez votre première plante à l'application",
      variant: "success",
    });
  };

  return (
    <div>
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Mes Réalisations</h1>
          
          {/* Bouton de simulation - ne serait pas présent en production */}
          <Button
            variant="outline"
            onClick={simulateUnlockBadge}
            className="hidden" // Caché pour l'instant
          >
            <span className="material-icons mr-2">emoji_events</span>
            Simuler badge
          </Button>
        </div>
        
        <p className="text-muted-foreground">
          Suivez votre progression et déverrouillez des badges en prenant soin de vos plantes.
        </p>
      </section>

      <Separator className="my-6" />

      <BadgeCollection />

      <Separator className="my-6" />

      <section className="space-y-4">
        <h2 className="text-lg font-medium">Comment obtenir des badges</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center mb-3">
              <span className="material-icons text-primary mr-2">format_list_bulleted</span>
              <h3 className="font-medium">Collection de plantes</h3>
            </div>
            <p className="text-sm text-gray-600">
              Ajoutez des plantes à votre collection pour débloquer des badges.
              Plus votre jardin virtuel s'agrandit, plus vous progressez !
            </p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center mb-3">
              <span className="material-icons text-primary mr-2">task_alt</span>
              <h3 className="font-medium">Entretien régulier</h3>
            </div>
            <p className="text-sm text-gray-600">
              Complétez les tâches d'entretien pour débloquer des badges.
              Un bon jardinier prend soin de ses plantes !
            </p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center mb-3">
              <span className="material-icons text-primary mr-2">analytics</span>
              <h3 className="font-medium">Analyses</h3>
            </div>
            <p className="text-sm text-gray-600">
              Analysez vos plantes pour mieux comprendre leurs besoins.
              Chaque analyse vous rapproche d'un nouveau badge !
            </p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="flex items-center mb-3">
              <span className="material-icons text-primary mr-2">calendar_month</span>
              <h3 className="font-medium">Fidélité</h3>
            </div>
            <p className="text-sm text-gray-600">
              Connectez-vous régulièrement à l'application pour suivre vos plantes.
              La constance est récompensée !
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}