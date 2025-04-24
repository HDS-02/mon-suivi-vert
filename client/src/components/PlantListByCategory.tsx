import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { PlantCategory } from './PlantCategorySelect';
import { Input } from './ui/input';

// Interface pour les plantes dans la base de données
export interface PlantEntry {
  name: string;
  species: string;
  category: string;
  wateringFrequency: number;
  light: string;
  temperature: string;
  careNotes: string;
}

interface PlantListByCategoryProps {
  category: PlantCategory;
  onSelectPlant: (plant: PlantEntry) => void;
  onGoBack: () => void;
}

export default function PlantListByCategory({ 
  category, 
  onSelectPlant, 
  onGoBack 
}: PlantListByCategoryProps) {
  const [searchTerm, setSearchTerm] = useState('');

  // Récupérer les plantes pour la catégorie sélectionnée
  const { data: plants, isLoading, error } = useQuery<PlantEntry[]>({
    queryKey: [`/api/plant-database/category/${category.id}`],
  });

  // Filtrer les plantes en fonction du terme de recherche
  const filteredPlants = plants?.filter(plant => 
    plant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    plant.species.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">{category.name}</h3>
          <Button variant="outline" size="sm" onClick={onGoBack}>
            <span className="material-icons mr-1 text-sm">arrow_back</span>
            Retour
          </Button>
        </div>
        
        <Input 
          placeholder="Rechercher une plante..." 
          className="mb-4" 
          disabled 
        />
        
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="w-full">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <Skeleton className="h-5 w-32 mb-2" />
                    <Skeleton className="h-4 w-48" />
                  </div>
                  <Skeleton className="h-9 w-20" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">{category.name}</h3>
          <Button variant="outline" size="sm" onClick={onGoBack}>
            <span className="material-icons mr-1 text-sm">arrow_back</span>
            Retour
          </Button>
        </div>
        <div className="text-red-500">
          Erreur lors du chargement des plantes
        </div>
      </div>
    );
  }

  if (!plants || plants.length === 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">{category.name}</h3>
          <Button variant="outline" size="sm" onClick={onGoBack}>
            <span className="material-icons mr-1 text-sm">arrow_back</span>
            Retour
          </Button>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-md p-4 text-amber-700">
          Aucune plante n'est disponible dans cette catégorie.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">{category.name}</h3>
        <Button variant="outline" size="sm" onClick={onGoBack}>
          <span className="material-icons mr-1 text-sm">arrow_back</span>
          Retour
        </Button>
      </div>
      
      <Input 
        placeholder="Rechercher une plante..." 
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-4"
      />
      
      {filteredPlants && filteredPlants.length > 0 ? (
        <div className="space-y-2">
          {filteredPlants.map((plant) => (
            <Card 
              key={plant.name} 
              className="w-full hover:shadow-md transition-shadow cursor-pointer"
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">{plant.name}</h4>
                    <p className="text-sm text-gray-500">{plant.species}</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onSelectPlant(plant)}
                  >
                    Sélectionner
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="bg-amber-50 border border-amber-200 rounded-md p-4 text-amber-700">
          Aucune plante ne correspond à votre recherche.
        </div>
      )}
    </div>
  );
}