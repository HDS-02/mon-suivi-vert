import { useState } from "react";
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
    // Ici, nous simulons la sauvegarde des paramètres
    toast({
      title: "Paramètres sauvegardés",
      description: "Vos préférences ont été mises à jour",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Paramètres</DialogTitle>
          <DialogDescription>
            Personnalisez votre expérience avec Mon Suivi Vert
          </DialogDescription>
        </DialogHeader>

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

        <DialogFooter className="sm:justify-between">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Annuler
          </Button>
          <Button
            className="bg-primary text-white"
            onClick={handleSave}
          >
            Enregistrer
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}