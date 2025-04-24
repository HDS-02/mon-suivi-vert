import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from '@tanstack/react-query';

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
      <div className="space-y-4">
        <h3 className="text-lg font-medium mb-2">Choisissez une catégorie</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="cursor-pointer border-2 border-transparent hover:border-primary/20 transition-all">
              <CardContent className="p-4 flex flex-col items-center justify-center min-h-[100px]">
                <Skeleton className="h-8 w-8 rounded-full mb-3" />
                <Skeleton className="h-5 w-28" />
                <Skeleton className="h-4 w-36 mt-2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">Erreur lors du chargement des catégories</div>;
  }

  if (!categories || categories.length === 0) {
    return <div>Aucune catégorie disponible</div>;
  }

  // Rendu du sélecteur de catégories
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium mb-2">Choisissez une catégorie</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {categories.map((category) => (
          <Card 
            key={category.id}
            className={`cursor-pointer border-2 transition-all ${
              selectedCategoryId === category.id 
                ? 'border-primary shadow-md' 
                : 'border-transparent hover:border-primary/20'
            }`}
            onClick={() => handleSelectCategory(category)}
          >
            <CardContent className="p-4 flex flex-col items-center justify-center min-h-[100px]">
              <span className="material-icons text-2xl text-primary mb-2">{category.icon}</span>
              <h4 className="font-medium">{category.name}</h4>
              <p className="text-sm text-gray-500 text-center mt-1">{category.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}