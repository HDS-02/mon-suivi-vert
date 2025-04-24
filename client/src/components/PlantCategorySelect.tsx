import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from '@tanstack/react-query';
import { FlowerIcon, TreePine, Sprout, Leaf, Flower2, SunMedium, Grid } from 'lucide-react';

// Interface pour les catégories de plantes
export interface PlantCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
}

interface PlantCategorySelectProps {
  onSelectCategory: (category: PlantCategory) => void;
}

export default function PlantCategorySelect({ onSelectCategory }: PlantCategorySelectProps) {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);

  // Requête pour récupérer les catégories de plantes
  const { data: categories, isLoading, error } = useQuery<PlantCategory[]>({
    queryKey: ['/api/plant-categories'],
  });

  // Gérer la sélection d'une catégorie
  const handleSelectCategory = (category: PlantCategory) => {
    setSelectedCategoryId(category.id);
    onSelectCategory(category);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h3 className="text-xl font-medium text-green-800 mb-4">Choisissez une catégorie</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="bg-white/60 backdrop-blur-sm border-green-100/60 transition-all overflow-hidden">
              <CardContent className="p-6 flex flex-col items-center justify-center min-h-[140px]">
                <Skeleton className="h-12 w-12 rounded-full mb-3" />
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-36 mt-1" />
                <Skeleton className="h-4 w-24 mt-1" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h3 className="text-xl font-medium text-green-800 mb-4">Choisissez une catégorie</h3>
        <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-md p-6 text-red-600 flex items-center justify-center">
          <p className="text-center">
            Une erreur est survenue lors du chargement des catégories.<br />
            Veuillez actualiser la page pour réessayer.
          </p>
        </div>
      </div>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <div className="space-y-6">
        <h3 className="text-xl font-medium text-green-800 mb-4">Choisissez une catégorie</h3>
        <div className="bg-amber-50/80 backdrop-blur-sm border border-amber-200 rounded-md p-6 text-amber-700 flex items-center justify-center">
          <p className="text-center">
            Aucune catégorie de plantes n'est actuellement disponible.<br />
            Veuillez réessayer ultérieurement.
          </p>
        </div>
      </div>
    );
  }

  // Ajout d'un effet de hover animé avec CSS
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .category-card {
        position: relative;
        overflow: hidden;
        transform: translateY(0);
        transition: all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
      }
      
      .category-card::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: radial-gradient(circle at var(--x, 50%) var(--y, 50%), rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0) 60%);
        opacity: 0;
        transition: opacity 0.3s ease;
        z-index: 0;
        pointer-events: none;
      }
      
      .category-card:hover::before {
        opacity: 1;
      }
      
      .category-card.selected {
        transform: translateY(-5px);
        box-shadow: 0 10px 25px -5px rgba(0, 128, 0, 0.1), 0 8px 10px -6px rgba(0, 128, 0, 0.05);
      }
      
      .category-card.selected::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 40%;
        height: 3px;
        background: linear-gradient(90deg, rgba(0, 200, 50, 0), rgba(0, 200, 50, 0.8), rgba(0, 200, 50, 0));
        border-radius: 3px;
      }
      
      .category-icon {
        z-index: 1;
        position: relative;
        transition: all 0.3s ease;
      }
      
      .category-card:hover .category-icon {
        transform: scale(1.1);
      }
      
      .category-name {
        position: relative;
        z-index: 1;
        transition: all 0.3s ease;
      }
      
      .category-card:hover .category-name {
        transform: translateY(-2px);
      }
      
      .bg-grid-pattern {
        background-image: linear-gradient(rgba(0, 0, 0, 0.05) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(0, 0, 0, 0.05) 1px, transparent 1px);
        background-size: 20px 20px;
      }
    `;
    document.head.appendChild(style);

    // Ajouter un gestionnaire d'événements pour l'effet de lueur au survol
    const handleMouseMove = (e: MouseEvent) => {
      const cards = document.querySelectorAll('.category-card');
      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        (card as HTMLElement).style.setProperty('--x', `${x}%`);
        (card as HTMLElement).style.setProperty('--y', `${y}%`);
      });
    };

    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (style.parentNode) {
        style.parentNode.removeChild(style);
      }
    };
  }, []);

  // Obtenir l'icône et la couleur de fond thématique selon la catégorie
  const getCategoryIcon = (iconName: string, size = 28) => {
    switch (iconName) {
      case 'local_florist':
        return {
          icon: <Flower2 size={size} />,
          gradient: 'from-pink-200 via-pink-300 to-pink-100',
          shadowColor: 'pink',
          iconColor: 'text-pink-700'
        };
      case 'forest':
        return {
          icon: <TreePine size={size} />,
          gradient: 'from-green-100 via-green-300 to-green-100',
          shadowColor: 'green',
          iconColor: 'text-green-700'
        };
      case 'sprout':
        return {
          icon: <Sprout size={size} />,
          gradient: 'from-emerald-100 via-emerald-200 to-emerald-100',
          shadowColor: 'emerald',
          iconColor: 'text-emerald-700'
        };
      case 'agriculture':
        return {
          icon: <Leaf size={size} />,
          gradient: 'from-amber-100 via-amber-200 to-amber-100',
          shadowColor: 'amber',
          iconColor: 'text-amber-700'
        };
      default:
        return {
          icon: <SunMedium size={size} />,
          gradient: 'from-blue-100 via-blue-200 to-blue-100',
          shadowColor: 'blue',
          iconColor: 'text-blue-700'
        };
    }
  };

  // Rendu du sélecteur de catégories
  return (
    <div className="space-y-8">
      <h3 className="text-2xl font-semibold text-green-800 mb-6 tracking-tight">Choisissez une catégorie de plantes</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((category) => {
          const { icon, gradient, shadowColor, iconColor } = getCategoryIcon(category.icon);
          const isSelected = selectedCategoryId === category.id;
          
          return (
            <div 
              key={category.id}
              className={`category-card rounded-xl overflow-hidden cursor-pointer ${isSelected ? 'selected' : ''}`}
              onClick={() => handleSelectCategory(category)}
            >
              <div className={`relative h-full backdrop-blur-md rounded-xl transition-all duration-300 ${isSelected 
                ? isSelected && shadowColor === 'pink' ? 'bg-gradient-to-br from-pink-50/90 to-white/80 border-2 border-pink-200' 
                : isSelected && shadowColor === 'green' ? 'bg-gradient-to-br from-green-50/90 to-white/80 border-2 border-green-200'
                : isSelected && shadowColor === 'emerald' ? 'bg-gradient-to-br from-emerald-50/90 to-white/80 border-2 border-emerald-200'
                : isSelected && shadowColor === 'amber' ? 'bg-gradient-to-br from-amber-50/90 to-white/80 border-2 border-amber-200'
                : 'bg-gradient-to-br from-blue-50/90 to-white/80 border-2 border-blue-200'
                : 'bg-white/70 hover:bg-white/80 border border-gray-100'
              }`}>
                <div className="absolute inset-0 opacity-30 bg-grid-pattern pointer-events-none"></div>
                
                <div className="p-6 z-10 relative flex flex-col items-center justify-center min-h-[180px]">
                  <div className={`category-icon w-16 h-16 mb-5 rounded-full flex items-center justify-center bg-gradient-to-br ${gradient} shadow-lg`}>
                    <div className={`${iconColor}`}>
                      {icon}
                    </div>
                  </div>
                  
                  <h4 className={`category-name font-semibold text-xl mb-2 ${
                    isSelected && shadowColor === 'pink' ? 'text-pink-800' :
                    isSelected && shadowColor === 'green' ? 'text-green-800' :
                    isSelected && shadowColor === 'emerald' ? 'text-emerald-800' :
                    isSelected && shadowColor === 'amber' ? 'text-amber-800' :
                    isSelected && shadowColor === 'blue' ? 'text-blue-800' :
                    'text-gray-800'
                  }`}>
                    {category.name}
                  </h4>
                  
                  <p className="text-sm text-gray-600 text-center max-w-[90%]">
                    {category.description}
                  </p>
                  
                  {isSelected && (
                    <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-transparent via-green-400 to-transparent rounded-full"></div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}