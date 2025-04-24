import { useState } from "react";
import NotificationsDialog from "./NotificationsDialog";
import SettingsDialog from "./SettingsDialog";
import logoSimple from "../assets/logo-simple.svg";

export default function Header() {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <header className="bg-primary/80 backdrop-blur-md text-white shadow-lg sticky top-0 z-20">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center bg-white/10 rounded-lg px-4 py-1">
          <img src={logoSimple} alt="Logo Mon Suivi Vert" className="h-10 w-10 mr-2" />
          <h1 className="text-xl font-raleway font-bold text-white">Mon Suivi Vert</h1>
        </div>
        <div className="flex space-x-2">
          <button 
            className="p-2 rounded-full hover:bg-white/20 active:bg-white/30 transition-all duration-200 ease-in-out"
            onClick={() => setNotificationsOpen(true)}
          >
            <span className="material-icons">notifications</span>
          </button>
          <button 
            className="p-2 rounded-full hover:bg-white/20 active:bg-white/30 transition-all duration-200 ease-in-out"
            onClick={() => setSettingsOpen(true)}
          >
            <span className="material-icons">settings</span>
          </button>
        </div>
      </div>

      {/* Dialogues */}
      <NotificationsDialog 
        open={notificationsOpen} 
        onOpenChange={setNotificationsOpen} 
      />
      
      <SettingsDialog 
        open={settingsOpen} 
        onOpenChange={setSettingsOpen} 
      />
    </header>
  );
}