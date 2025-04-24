import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from '@tanstack/react-query';
import { FlowerIcon, TreePine, Sprout, Leaf, LayoutGrid } from 'lucide-react';

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

  // Fonction pour obtenir l'icône correspondante selon la catégorie
  const getCategoryIcon = (iconName: string, size = 24) => {
    switch (iconName) {
      case 'local_florist':
        return <FlowerIcon size={size} />;
      case 'forest':
        return <TreePine size={size} />;
      case 'sprout':
        return <Sprout size={size} />;
      case 'agriculture':
        return <Leaf size={size} />;
      default:
        return <LayoutGrid size={size} />;
    }
  };

  // Rendu du sélecteur de catégories
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-medium text-green-800 mb-4">Choisissez une catégorie</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Card 
            key={category.id}
            className={`cursor-pointer transition-all duration-300 overflow-hidden backdrop-blur-sm 
              ${selectedCategoryId === category.id 
                ? 'bg-green-50/80 border-green-300 shadow-lg shadow-green-100/50 scale-105' 
                : 'bg-white/60 border-green-100/60 hover:bg-green-50/40 hover:border-green-200 hover:shadow-md'
              }`}
            onClick={() => handleSelectCategory(category)}
          >
            <CardContent className="p-6 flex flex-col items-center justify-center min-h-[140px]">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-colors
                ${selectedCategoryId === category.id 
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-green-50 text-green-600'
                }`}>
                {getCategoryIcon(category.icon)}
              </div>
              <h4 className={`font-medium text-lg transition-colors
                ${selectedCategoryId === category.id 
                  ? 'text-green-900' 
                  : 'text-green-800'
                }`}>
                {category.name}
              </h4>
              <p className="text-sm text-green-600/80 text-center mt-2">{category.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}