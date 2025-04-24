import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
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

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const [activeTab, setActiveTab] = useState<string>("preferences");
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
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
  }, [user]);
  
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
      await apiRequest("PATCH", `/api/users/${user?.id}`, data);
      
      // Invalider le cache pour forcer le rechargement des données utilisateur
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      
      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été mises à jour avec succès",
      });
      
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour votre profil. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };

  const handleSave = () => {
    // Sauvegarde des paramètres
    toast({
      title: "Paramètres sauvegardés",
      description: "Vos préférences ont été mises à jour",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md glass-card backdrop-blur-sm border border-gray-100/80 shadow-lg">
        <DialogHeader className="pb-4 border-b border-gray-100/50">
          <DialogTitle className="text-primary-dark font-raleway text-xl">Paramètres</DialogTitle>
          <DialogDescription className="text-gray-600">
            Personnalisez votre expérience avec Mon Suivi Vert
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4 bg-primary/5 p-1 rounded-lg">
            <TabsTrigger value="preferences" className="flex items-center gap-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary-light data-[state=active]:text-white">
              <span className="material-icons text-sm">settings</span>
              Préférences
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary-light data-[state=active]:text-white">
              <span className="material-icons text-sm">person</span>
              Profil
            </TabsTrigger>
          </TabsList>

          {/* Onglet préférences */}
          <TabsContent value="preferences">
            <div className="space-y-6 py-2">
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Apparence</h3>
                <div className="flex items-center justify-between">
                  <Label htmlFor="dark-mode" className="flex items-center gap-2">
                    <span className="material-icons text-gray-500">dark_mode</span>
                    Mode sombre
                  </Label>
                  <Switch
                    id="dark-mode"
                    checked={darkMode}
                    onCheckedChange={setDarkMode}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium">Notifications</h3>
                <div className="flex items-center justify-between">
                  <Label htmlFor="app-notif" className="flex items-center gap-2">
                    <span className="material-icons text-gray-500">notifications</span>
                    Notifications de l'application
                  </Label>
                  <Switch
                    id="app-notif"
                    checked={notifications}
                    onCheckedChange={setNotifications}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="email-notif" className="flex items-center gap-2">
                    <span className="material-icons text-gray-500">email</span>
                    Notifications par email
                  </Label>
                  <Switch
                    id="email-notif"
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium">À propos</h3>
                <p className="text-sm text-gray-500">
                  Mon Suivi Vert v1.0.0<br />
                  Une application d'analyse et de suivi de santé des plantes
                </p>
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="border-primary/20 text-primary hover:bg-primary/5"
              >
                <span className="material-icons mr-2 text-sm">close</span>
                Annuler
              </Button>
              <Button
                className="bg-gradient-to-r from-primary to-primary-light text-white shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200"
                onClick={handleSave}
              >
                <span className="material-icons mr-2 text-sm">save</span>
                Enregistrer
              </Button>
            </div>
          </TabsContent>

          {/* Onglet profil */}
          <TabsContent value="profile">
            <Form {...profileForm}>
              <form onSubmit={profileForm.handleSubmit(onSubmitProfileForm)} className="space-y-4">
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
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}