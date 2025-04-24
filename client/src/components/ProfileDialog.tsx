import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Schéma de validation pour le formulaire de profil
const profileFormSchema = z.object({
  username: z.string().min(3, { message: "Le nom d'utilisateur doit contenir au moins 3 caractères" }),
  firstName: z.string().min(2, { message: "Le prénom doit contenir au moins 2 caractères" }).optional(),
  email: z.string().email({ message: "Format d'email invalide" }).optional().or(z.literal("")),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface ProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ProfileDialog({ open, onOpenChange }: ProfileDialogProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Formulaire de mise à jour du profil
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: "",
      firstName: "",
      email: "",
    },
  });
  
  // Mise à jour du formulaire quand l'utilisateur est chargé
  useEffect(() => {
    if (user) {
      profileForm.reset({
        username: user.username || "",
        firstName: user.firstName || "",
        email: user.email || "",
      });
    }
  }, [user, profileForm]);
  
  // Pour afficher les infos du formulaire dans la console (débogage)
  useEffect(() => {
    if (user) {
      console.log("Données utilisateur chargées:", user);
    }
  }, [user]);

  // Gestionnaire de soumission du formulaire de profil
  const onSubmitProfileForm = async (data: ProfileFormValues) => {
    try {
      // Appel API pour mettre à jour le profil
      if (user?.id) {
        await apiRequest("PATCH", `/api/users/${user.id}`, data);
        
        // Invalider le cache pour forcer le rechargement des données utilisateur
        queryClient.invalidateQueries({ queryKey: ["/api/user"] });
        
        toast({
          title: "Profil mis à jour",
          description: "Vos informations ont été mises à jour avec succès",
        });
        
        onOpenChange(false);
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour votre profil. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal={true}>
      <DialogContent 
        className="sm:max-w-md glass-card backdrop-blur-sm border border-gray-100/80 shadow-lg" 
        onPointerDownOutside={(e) => {
          // Empêcher la fermeture lors d'un clic à l'extérieur
          e.preventDefault();
        }}
        onEscapeKeyDown={(e) => {
          // Empêcher la fermeture lors de l'appui sur Echap
          e.preventDefault();
        }}
        onInteractOutside={(e) => {
          // Empêcher toute interaction extérieure qui pourrait fermer la modale
          e.preventDefault();
        }}
      >
        <DialogHeader className="pb-4 border-b border-gray-100/50">
          <DialogTitle className="text-primary-dark font-raleway text-xl">
            <span className="flex items-center gap-2">
              <span className="material-icons">account_circle</span>
              Mon Profil
            </span>
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Gérez vos informations personnelles
          </DialogDescription>
        </DialogHeader>

        <Form {...profileForm}>
          <form onSubmit={profileForm.handleSubmit(onSubmitProfileForm)} className="space-y-4 py-2">
            <FormField
              control={profileForm.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom d'utilisateur</FormLabel>
                  <FormControl>
                    <Input placeholder="Votre nom d'utilisateur" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={profileForm.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prénom</FormLabel>
                  <FormControl>
                    <Input placeholder="Votre prénom" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={profileForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email (optionnel)</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Votre email" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-between mt-6">
              <Button
                variant="outline"
                type="button"
                onClick={() => onOpenChange(false)}
                className="border-primary/20 text-primary hover:bg-primary/5"
              >
                <span className="material-icons mr-2 text-sm">close</span>
                Annuler
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-primary to-primary-light text-white shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200"
                disabled={profileForm.formState.isSubmitting}
              >
                <span className="material-icons mr-2 text-sm">{profileForm.formState.isSubmitting ? "pending" : "save"}</span>
                {profileForm.formState.isSubmitting ? "Enregistrement..." : "Enregistrer"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}