import { useState, useRef } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { InsertPlant } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";

export default function AddPlantManually() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  // États pour les champs du formulaire
  const [name, setName] = useState("");
  const [species, setSpecies] = useState("");
  const [status, setStatus] = useState("healthy");
  const [light, setLight] = useState("");
  const [temperature, setTemperature] = useState("");
  const [wateringFrequency, setWateringFrequency] = useState(7);
  const [careNotes, setCareNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Gérer le changement de fichier d'image
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Gérer le glisser-déposer d'image
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name) {
      toast({
        title: "Erreur",
        description: "Veuillez entrer un nom pour votre plante",
        variant: "destructive",
      });
      return;
    }
    
    setIsSaving(true);
    
    try {
      let imagePath = "";

      // Si une image est sélectionnée, l'uploader d'abord
      if (selectedImage) {
        const formData = new FormData();
        formData.append("image", selectedImage);
        
        // Ajouter la description de la plante pour améliorer l'analyse
        const description = `${name} ${species}`.trim();
        if (description) {
          formData.append("description", description);
        }
        
        const analyzeResponse = await fetch("/api/analyze", {
          method: "POST",
          body: formData,
        });
        
        if (!analyzeResponse.ok) {
          throw new Error("Erreur lors de l'upload de l'image");
        }
        
        const analyzeResult = await analyzeResponse.json();
        imagePath = analyzeResult.imagePath;
      }
      
      const plantData: InsertPlant = {
        name,
        species,
        status: status as any,
        image: imagePath, // Chemin de l'image uploadée
        wateringFrequency: parseInt(wateringFrequency.toString()),
        light,
        temperature,
        careNotes,
      };
      
      const plantResponse = await apiRequest("POST", "/api/plants", plantData);
      const plant = await plantResponse.json();
      
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ["/api/plants"] });
      
      toast({
        title: "Plante ajoutée",
        description: "La plante a été ajoutée à votre collection",
      });
      
      // Ajout d'un court délai pour s'assurer que les données sont bien invalidées
      setTimeout(() => {
        navigate(`/plants`);
      }, 100);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la sauvegarde",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <div>
      <div className="mb-6">
        <button 
          className="flex items-center text-primary mb-4"
          onClick={() => navigate("/analyze")}
        >
          <span className="material-icons mr-1">arrow_back</span>
          Retour
        </button>
        <h2 className="text-xl font-raleway font-semibold">Ajouter une plante manuellement</h2>
        <p className="text-gray-600">Entrez les informations de votre plante</p>
      </div>
      
      <Card className="bg-white rounded-lg shadow-md mb-6">
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              {/* Section d'upload d'image */}
              <div>
                <Label>Photo de la plante</Label>
                <div 
                  className="mt-1 border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center text-center"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  {imagePreview ? (
                    <div className="relative w-full max-w-md mb-2">
                      <img 
                        src={imagePreview} 
                        alt="Aperçu de la plante" 
                        className="w-full h-48 object-contain rounded-lg" 
                      />
                      <button 
                        type="button"
                        className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md"
                        onClick={() => {
                          setSelectedImage(null);
                          setImagePreview(null);
                        }}
                      >
                        <span className="material-icons text-gray-600">close</span>
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="material-icons text-gray-400 text-3xl mb-2">add_photo_alternate</span>
                      <p className="text-sm text-gray-500 mb-2">Glissez-déposez une photo ici ou</p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <span className="material-icons mr-1 text-sm">upload</span>
                        Choisir une image
                      </Button>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                      />
                    </>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="name">Nom de la plante *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Ficus Lyrata"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="species">Espèce (optionnel)</Label>
                <Input
                  id="species"
                  value={species}
                  onChange={(e) => setSpecies(e.target.value)}
                  placeholder="Ex: Ficus lyrata"
                />
              </div>
              
              <div>
                <Label htmlFor="status">État de santé</Label>
                <Select
                  value={status}
                  onValueChange={(value) => setStatus(value)}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Sélectionnez l'état de santé" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="healthy">Bonne santé</SelectItem>
                    <SelectItem value="warning">Attention requise</SelectItem>
                    <SelectItem value="danger">Besoin d'aide</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="watering">Fréquence d'arrosage (jours)</Label>
                <Input
                  id="watering"
                  type="number"
                  min={1}
                  max={30}
                  value={wateringFrequency}
                  onChange={(e) => setWateringFrequency(parseInt(e.target.value))}
                />
              </div>
              
              <div>
                <Label htmlFor="light">Besoin en lumière</Label>
                <Input
                  id="light"
                  value={light}
                  onChange={(e) => setLight(e.target.value)}
                  placeholder="Ex: Lumière indirecte"
                />
              </div>
              
              <div>
                <Label htmlFor="temperature">Température idéale</Label>
                <Input
                  id="temperature"
                  value={temperature}
                  onChange={(e) => setTemperature(e.target.value)}
                  placeholder="Ex: 18-24°C"
                />
              </div>
              
              <div>
                <Label htmlFor="notes">Notes d'entretien</Label>
                <Textarea
                  id="notes"
                  value={careNotes}
                  onChange={(e) => setCareNotes(e.target.value)}
                  placeholder="Entrez des détails sur l'entretien de votre plante..."
                  rows={4}
                />
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button
                type="submit"
                className="bg-primary text-white"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <span className="material-icons animate-spin mr-2">refresh</span>
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <span className="material-icons mr-2">add</span>
                    Ajouter à ma collection
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}