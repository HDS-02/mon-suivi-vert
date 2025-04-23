import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertPlantSchema, Plant } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

// Components
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Validation schema
const editPlantSchema = insertPlantSchema.extend({
  id: z.number().optional(),
});

type EditPlantFormValues = z.infer<typeof editPlantSchema>;

interface EditPlantDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plant?: Plant;
  onDelete?: () => void;
}

export default function EditPlantDialog({ open, onOpenChange, plant, onDelete }: EditPlantDialogProps) {
  const { toast } = useToast();
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  
  const form = useForm<EditPlantFormValues>({
    resolver: zodResolver(editPlantSchema),
    defaultValues: {
      name: plant?.name || "",
      species: plant?.species || "",
      status: plant?.status || "healthy",
      light: plant?.light || "",
      temperature: plant?.temperature || "",
      wateringFrequency: plant?.wateringFrequency || 7,
      careNotes: plant?.careNotes || "",
      image: plant?.image || "",
    },
  });
  
  // Update form values when plant changes
  useEffect(() => {
    if (plant) {
      form.reset({
        name: plant.name || "",
        species: plant.species || "",
        status: plant.status || "healthy",
        light: plant.light || "",
        temperature: plant.temperature || "",
        wateringFrequency: plant.wateringFrequency || 7,
        careNotes: plant.careNotes || "",
        image: plant.image || "",
      });
    }
  }, [plant, form.reset]);

  const onSubmit = async (data: EditPlantFormValues) => {
    try {
      if (plant?.id) {
        // Update existing plant
        await apiRequest("PATCH", `/api/plants/${plant.id}`, data);
        toast({
          title: "Plante mise à jour",
          description: "Les informations de la plante ont été mises à jour avec succès.",
        });
        
        // Refresh data
        queryClient.invalidateQueries({ queryKey: ["/api/plants"] });
        queryClient.invalidateQueries({ queryKey: [`/api/plants/${plant.id}`] });
      } else {
        // Create new plant
        await apiRequest("POST", "/api/plants", data);
        toast({
          title: "Plante créée",
          description: "La nouvelle plante a été ajoutée à votre collection.",
        });
        
        // Refresh data
        queryClient.invalidateQueries({ queryKey: ["/api/plants"] });
      }
      
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement de la plante.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    if (!plant?.id) return;
    
    try {
      await apiRequest("DELETE", `/api/plants/${plant.id}`);
      
      toast({
        title: "Plante supprimée",
        description: "La plante a été supprimée de votre collection.",
      });
      
      // Refresh data
      queryClient.invalidateQueries({ queryKey: ["/api/plants"] });
      
      if (onDelete) onDelete();
      onOpenChange(false);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la suppression de la plante.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{plant ? "Modifier la plante" : "Ajouter une plante"}</DialogTitle>
            <DialogDescription>
              {plant 
                ? "Modifiez les informations de votre plante" 
                : "Ajoutez une nouvelle plante à votre collection"}
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nom de la plante</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Ficus Lyrata" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="species"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Espèce</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Ficus lyrata" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>État de santé</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez l'état de santé" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="healthy">Bonne santé</SelectItem>
                        <SelectItem value="warning">Attention requise</SelectItem>
                        <SelectItem value="danger">Besoin d'aide</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="wateringFrequency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fréquence d'arrosage (jours)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min={1} 
                          max={60} 
                          {...field}
                          onChange={(e) => {
                            const value = parseInt(e.target.value);
                            if (!isNaN(value)) field.onChange(value);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="light"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Exposition à la lumière</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Indirecte brillante" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="temperature"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Température</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: 18-24°C" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="careNotes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes d'entretien</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Entrez vos notes d'entretien spécifiques ici..."
                        className="h-20"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="flex sm:justify-between pt-4">
                <div className="flex space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                  >
                    Annuler
                  </Button>
                  {plant && (
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => setIsDeleteConfirmOpen(true)}
                    >
                      Supprimer
                    </Button>
                  )}
                </div>
                <Button type="submit" className="bg-primary text-white">
                  {plant ? "Enregistrer les modifications" : "Ajouter la plante"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Confirmation dialog for delete */}
      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmer la suppression</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer cette plante ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-between">
            <Button
              variant="outline"
              onClick={() => setIsDeleteConfirmOpen(false)}
            >
              Annuler
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
            >
              Supprimer définitivement
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}