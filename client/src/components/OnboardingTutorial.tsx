import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';
import { useLocalStorage } from '@/hooks/use-local-storage';

interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  icon: string;
  illustration: string;
  color: string;
  position?: 'center' | 'left' | 'right';
}

const steps: OnboardingStep[] = [
  {
    id: 1,
    title: "Bienvenue sur Mon Suivi Vert !",
    description: "Suivez la santé de vos plantes et obtenez des conseils personnalisés pour les aider à s'épanouir.",
    icon: "eco",
    illustration: "🌱",
    color: "from-green-400 to-emerald-600",
    position: "center"
  },
  {
    id: 2,
    title: "Ajoutez vos plantes",
    description: "Créez votre collection personnelle en ajoutant vos plantes avec leur nom, espèce et photo.",
    icon: "add_circle",
    illustration: "🪴",
    color: "from-blue-400 to-indigo-600",
    position: "left"
  },
  {
    id: 3,
    title: "Suivez leur entretien",
    description: "Recevez des rappels personnalisés pour l'arrosage et autres soins en fonction de chaque espèce.",
    icon: "water_drop",
    illustration: "💧",
    color: "from-cyan-400 to-sky-600",
    position: "right"
  },
  {
    id: 4,
    title: "Besoin d'aide ?",
    description: "Utilisez le bouton SOS pour diagnostiquer les problèmes de vos plantes et obtenir des conseils immédiats.",
    icon: "emergency",
    illustration: "🔍",
    color: "from-orange-400 to-red-600",
    position: "left"
  },
  {
    id: 5,
    title: "Débloquez des badges",
    description: "Collectionnez des badges en prenant soin de vos plantes et en utilisant les fonctionnalités de l'application.",
    icon: "emoji_events",
    illustration: "🏆",
    color: "from-yellow-400 to-amber-600",
    position: "right"
  }
];

export default function OnboardingTutorial() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const { toast } = useToast();
  const [hasSeenOnboarding, setHasSeenOnboarding] = useLocalStorage('hasSeenOnboarding', false);

  useEffect(() => {
    // Afficher l'onboarding après un court délai seulement s'il n'a pas déjà été vu
    if (!hasSeenOnboarding) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [hasSeenOnboarding]);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeOnboarding = () => {
    setIsVisible(false);
    setHasSeenOnboarding(true);
    toast({
      title: "Tutoriel terminé !",
      description: "Vous êtes prêt à commencer votre aventure végétale.",
    });
  };

  const skipTutorial = () => {
    setIsVisible(false);
    setHasSeenOnboarding(true);
  };

  // Si l'utilisateur a déjà vu l'onboarding, ne rien afficher
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="relative max-w-md w-full mx-auto rounded-xl overflow-hidden shadow-xl bg-white"
        >
          {/* Barre de progression */}
          <div className="w-full h-1 bg-gray-200">
            <div 
              className="h-full bg-primary" 
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>

          {/* En-tête coloré avec illustration */}
          <div className={`bg-gradient-to-r ${steps[currentStep].color} p-6 text-white relative overflow-hidden`}>
            <div className="relative z-10">
              <span className="material-icons text-2xl mb-2">{steps[currentStep].icon}</span>
              <h2 className="text-xl font-bold mb-1">{steps[currentStep].title}</h2>
              <p className="text-white/90">{steps[currentStep].description}</p>
            </div>
            
            {/* Illustration animée */}
            <motion.div 
              className="absolute text-6xl"
              style={{
                [steps[currentStep].position === 'left' ? 'left' : 'right']: steps[currentStep].position === 'center' ? '50%' : '1rem',
                top: steps[currentStep].position === 'center' ? '50%' : 'auto',
                bottom: steps[currentStep].position !== 'center' ? '1rem' : 'auto',
                opacity: 0.25,
                transform: steps[currentStep].position === 'center' ? 'translate(-50%, -50%)' : 'none',
              }}
              animate={{ 
                y: [0, -10, 0],
                rotate: [0, 5, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {steps[currentStep].illustration}
            </motion.div>
          </div>

          {/* Navigation */}
          <div className="p-4 flex justify-between items-center">
            <div>
              {currentStep > 0 ? (
                <Button variant="ghost" onClick={prevStep}>
                  <span className="material-icons mr-1">arrow_back</span>
                  Précédent
                </Button>
              ) : (
                <Button variant="ghost" onClick={skipTutorial}>
                  Passer
                </Button>
              )}
            </div>
            <div className="text-sm text-gray-500">
              {currentStep + 1} / {steps.length}
            </div>
            <Button onClick={nextStep}>
              {currentStep < steps.length - 1 ? (
                <>
                  Suivant
                  <span className="material-icons ml-1">arrow_forward</span>
                </>
              ) : (
                'Terminer'
              )}
            </Button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}