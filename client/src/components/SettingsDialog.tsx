import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { StableDialog } from "./StableDialog";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SettingsDialog({ open, onOpenChange }: SettingsDialogProps) {
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const { toast } = useToast();

  const handleSave = () => {
    // Sauvegarde des paramètres
    toast({
      title: "Paramètres sauvegardés",
      description: "Vos préférences ont été mises à jour",
    });
    onOpenChange(false);
  };

  return (
    <StableDialog
      open={open}
      onOpenChange={onOpenChange}
      title={
        <span className="flex items-center gap-2 text-primary-dark font-raleway text-xl">
          <span className="material-icons">settings</span>
          Paramètres
        </span>
      }
      description="Personnalisez votre expérience avec Mon Suivi Vert"
      className="sm:max-w-md glass-card backdrop-blur-sm border border-primary/20 shadow-xl"
      showCloseButton={true}
    >
      <div className="space-y-6 py-4">
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
    </StableDialog>
  );
}