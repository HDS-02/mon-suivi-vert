import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { StableDialog } from "./StableDialog";
import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

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
      className="sm:max-w-md border border-primary/20 shadow-xl bg-white"
      showCloseButton={true}
    >
      <div className="pb-2">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-gradient-to-r from-primary/5 to-primary/10 p-3 rounded-lg mb-6"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
              <span className="material-icons text-primary">settings_suggest</span>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-700">Personnalisez votre application</h3>
              <p className="text-xs text-gray-500">Les préférences sont sauvegardées automatiquement</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="mb-5"
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="material-icons text-primary text-lg">palette</span>
            <h3 className="text-base font-medium text-gray-700">Apparence</h3>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between">
              <Label htmlFor="dark-mode" className="flex items-center gap-2 cursor-pointer">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                  <span className="material-icons text-gray-600">dark_mode</span>
                </div>
                <div>
                  <span className="block text-sm font-medium">Mode sombre</span>
                  <span className="block text-xs text-gray-500">Réduire la luminosité de l'écran</span>
                </div>
              </Label>
              <Switch
                id="dark-mode"
                checked={darkMode}
                onCheckedChange={setDarkMode}
                className="data-[state=checked]:bg-primary"
              />
            </div>
          </div>
        </motion.div>
        
        <Separator className="my-4" />
        
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="mb-5"
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="material-icons text-primary text-lg">notifications</span>
            <h3 className="text-base font-medium text-gray-700">Notifications</h3>
          </div>
          <div className="space-y-3">
            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between">
                <Label htmlFor="app-notif" className="flex items-center gap-2 cursor-pointer">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <span className="material-icons text-gray-600">notifications_active</span>
                  </div>
                  <div>
                    <span className="block text-sm font-medium">Notifications de l'application</span>
                    <span className="block text-xs text-gray-500">Rappels d'entretien dans l'application</span>
                  </div>
                </Label>
                <Switch
                  id="app-notif"
                  checked={notifications}
                  onCheckedChange={setNotifications}
                  className="data-[state=checked]:bg-primary"
                />
              </div>
            </div>
            
            <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between">
                <Label htmlFor="email-notif" className="flex items-center gap-2 cursor-pointer">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <span className="material-icons text-gray-600">email</span>
                  </div>
                  <div>
                    <span className="block text-sm font-medium">Notifications par email</span>
                    <span className="block text-xs text-gray-500">Recevez les rappels par email</span>
                  </div>
                </Label>
                <Switch
                  id="email-notif"
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                  className="data-[state=checked]:bg-primary"
                />
              </div>
            </div>
          </div>
        </motion.div>
        
        <Separator className="my-4" />
        
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="material-icons text-primary text-lg">info</span>
            <h3 className="text-base font-medium text-gray-700">À propos</h3>
          </div>
          <div className="bg-white/60 backdrop-blur-sm rounded-lg p-4 border border-gray-100 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <h4 className="font-medium">Mon Suivi Vert</h4>
              <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                v1.0.0
              </Badge>
            </div>
            <p className="text-sm text-gray-500 mb-2">
              Une application d'analyse et de suivi de santé des plantes.
            </p>
            <p className="text-xs text-gray-400">
              © 2025 Mon Suivi Vert. Tous droits réservés.
            </p>
          </div>
        </motion.div>
      </div>
      
      <Separator className="my-4" />
      
      <div className="flex justify-end gap-3 pt-2">
        <Button
          variant="outline"
          onClick={() => onOpenChange(false)}
          className="rounded-full border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
        >
          <span className="material-icons mr-1 text-sm">close</span>
          Fermer
        </Button>
        <Button
          className="rounded-full bg-gradient-to-r from-primary to-primary-light text-white shadow-md hover:shadow-lg hover:translate-y-[-2px] transition-all duration-200"
          onClick={handleSave}
        >
          <span className="material-icons mr-1 text-sm">save</span>
          Enregistrer
        </Button>
      </div>
    </StableDialog>
  );
}