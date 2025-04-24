import express, { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertPlantSchema, insertTaskSchema, insertPlantAnalysisSchema, insertUserSchema } from "@shared/schema";
import { analyzePlantImage, getPlantInfoByName } from "./openai";
import multer from "multer";
import fs from "fs";
import path from "path";
import { nanoid } from "nanoid";
import { setupAuth } from "./auth";
import { badgeService } from "./badgeService";
import { plantDatabase, searchPlants, getPlantByName } from "./plantDatabase";
import { plantDiagnosticService } from "./plantDiagnosticService";

// Configure multer for in-memory file storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes
  setupAuth(app);

  // Serve uploaded files statically
  app.use('/uploads', express.static(uploadsDir));
  
  // USER ROUTES
  // Middleware pour vérifier si l'utilisateur est authentifié
  const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ message: "Non authentifié" });
  };

  // Route pour mettre à jour un utilisateur
  app.patch("/api/users/:id", isAuthenticated, async (req: Request, res: Response) => {
    try {
      // Vérifier que l'utilisateur ne modifie que son propre compte
      const userId = parseInt(req.params.id);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "ID d'utilisateur invalide" });
      }

      if (req.user?.id !== userId) {
        return res.status(403).json({ message: "Vous n'êtes pas autorisé à modifier ce compte" });
      }

      // Validation des données d'entrée - on accepte seulement username, firstName et email
      const userUpdateSchema = z.object({
        username: z.string().min(3).optional(),
        firstName: z.string().min(2).optional(),
        email: z.string().email().optional().or(z.literal("")),
      });

      const validatedData = userUpdateSchema.parse(req.body);
      
      // Mise à jour de l'utilisateur en base de données
      const updatedUser = await storage.updateUser(userId, validatedData);
      
      if (!updatedUser) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }

      // Retourne l'utilisateur mis à jour
      res.json(updatedUser);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Données invalides", errors: error.errors });
      }
      res.status(500).json({ message: error.message });
    }
  });

  // PLANTS ROUTES
  app.get("/api/plants", async (_req: Request, res: Response) => {
    try {
      const plants = await storage.getPlants();
      res.json(plants);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/plants/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "ID invalide" });
      }

      const plant = await storage.getPlant(id);
      if (!plant) {
        return res.status(404).json({ message: "Plante non trouvée" });
      }

      res.json(plant);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/plants", async (req: Request, res: Response) => {
    try {
      const validatedData = insertPlantSchema.parse(req.body);
      const plant = await storage.createPlant(validatedData);
      res.status(201).json(plant);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Données invalides", errors: error.errors });
      }
      res.status(500).json({ message: error.message });
    }
  });

  app.patch("/api/plants/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "ID invalide" });
      }

      // Partial validation of the request body
      const validatedData = insertPlantSchema.partial().parse(req.body);
      
      const updatedPlant = await storage.updatePlant(id, validatedData);
      if (!updatedPlant) {
        return res.status(404).json({ message: "Plante non trouvée" });
      }

      res.json(updatedPlant);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Données invalides", errors: error.errors });
      }
      res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/plants/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "ID invalide" });
      }

      const success = await storage.deletePlant(id);
      if (!success) {
        return res.status(404).json({ message: "Plante non trouvée" });
      }

      res.status(204).end();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // TASKS ROUTES
  app.get("/api/tasks", async (_req: Request, res: Response) => {
    try {
      const tasks = await storage.getTasks();
      res.json(tasks);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/tasks/pending", async (_req: Request, res: Response) => {
    try {
      const pendingTasks = await storage.getPendingTasks();
      res.json(pendingTasks);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/plants/:id/tasks", async (req: Request, res: Response) => {
    try {
      const plantId = parseInt(req.params.id);
      if (isNaN(plantId)) {
        return res.status(400).json({ message: "ID de plante invalide" });
      }

      const tasks = await storage.getTasksByPlantId(plantId);
      res.json(tasks);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/tasks", async (req: Request, res: Response) => {
    try {
      const validatedData = insertTaskSchema.parse(req.body);
      const task = await storage.createTask(validatedData);
      res.status(201).json(task);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Données invalides", errors: error.errors });
      }
      res.status(500).json({ message: error.message });
    }
  });

  app.patch("/api/tasks/:id/complete", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "ID invalide" });
      }

      const completedTask = await storage.completeTask(id);
      if (!completedTask) {
        return res.status(404).json({ message: "Tâche non trouvée" });
      }

      res.json(completedTask);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/tasks/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "ID invalide" });
      }

      const success = await storage.deleteTask(id);
      if (!success) {
        return res.status(404).json({ message: "Tâche non trouvée" });
      }

      res.status(204).end();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // PLANT ANALYSIS ROUTES
  app.get("/api/plants/:id/analyses", async (req: Request, res: Response) => {
    try {
      const plantId = parseInt(req.params.id);
      if (isNaN(plantId)) {
        return res.status(400).json({ message: "ID de plante invalide" });
      }

      const analyses = await storage.getPlantAnalyses(plantId);
      res.json(analyses);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/plants/:id/analysis/latest", async (req: Request, res: Response) => {
    try {
      const plantId = parseInt(req.params.id);
      if (isNaN(plantId)) {
        return res.status(400).json({ message: "ID de plante invalide" });
      }

      const analysis = await storage.getLatestPlantAnalysis(plantId);
      if (!analysis) {
        return res.status(404).json({ message: "Aucune analyse trouvée pour cette plante" });
      }

      res.json(analysis);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // ENDPOINT POUR OBTENIR DES INFORMATIONS SUR UNE PLANTE PAR SON NOM
  app.get("/api/plant-info", async (req: Request, res: Response) => {
    try {
      const plantName = req.query.name as string;
      
      if (!plantName) {
        return res.status(400).json({ message: "Le nom de la plante est requis" });
      }
      
      // Utiliser ChatGPT pour obtenir des informations détaillées sur la plante
      // avec repli automatique sur l'analyseur local en cas d'échec
      const plantInfo = await getPlantInfoByName(plantName);
      
      // Retourner les informations de la plante
      res.json(plantInfo);
    } catch (error: any) {
      console.error("Erreur lors de la recherche d'informations sur la plante:", error);
      res.status(500).json({ message: error.message });
    }
  });

  // AI IMAGE ANALYSIS ENDPOINT
  app.post("/api/analyze", upload.single("image"), async (req: Request, res: Response) => {
    try {
      const file = req.file;
      if (!file) {
        return res.status(400).json({ message: "Aucune image fournie" });
      }

      // Récupérer la description textuelle si fournie
      const description = req.body.description || '';

      // Save the uploaded file
      const fileExtension = file.originalname.split('.').pop() || 'jpg';
      const fileName = `${nanoid()}.${fileExtension}`;
      const filePath = path.join(uploadsDir, fileName);
      
      // Create directory if it doesn't exist
      fs.mkdirSync(path.dirname(filePath), { recursive: true });
      
      // Write the file
      fs.writeFileSync(filePath, file.buffer);
      
      // Convert image to base64 for AI analysis
      const base64Image = file.buffer.toString('base64');
      
      // Analyze image using OpenAI or fallback to local analyzer
      // Passer la description à l'analyseur pour améliorer la précision
      const analysisResult = await analyzePlantImage(base64Image, file.originalname, description);
      
      // Public URL path for the saved image
      const imagePath = `/uploads/${fileName}`;
      
      // Return the analysis results with the image path
      res.json({
        ...analysisResult,
        imagePath
      });
    } catch (error: any) {
      console.error("Error analyzing image:", error);
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/plants/:id/analyses", async (req: Request, res: Response) => {
    try {
      const plantId = parseInt(req.params.id);
      if (isNaN(plantId)) {
        return res.status(400).json({ message: "ID de plante invalide" });
      }

      const validatedData = insertPlantAnalysisSchema.parse({
        ...req.body,
        plantId
      });
      
      const analysis = await storage.createPlantAnalysis(validatedData);
      
      // Update plant status based on analysis
      await storage.updatePlant(plantId, { status: analysis.status });
      
      // Vérifier les badges d'analyse si l'utilisateur est authentifié
      let unlockedBadges = [];
      if (req.isAuthenticated() && req.user?.id) {
        const userId = req.user.id;
        const analysisCount = (await storage.getPlantAnalyses(plantId)).length;
        unlockedBadges = badgeService.checkAnalysisBadges(userId, analysisCount);
      }
      
      res.status(201).json({
        analysis,
        unlockedBadges: unlockedBadges.length > 0 ? unlockedBadges : undefined,
      });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Données invalides", errors: error.errors });
      }
      res.status(500).json({ message: error.message });
    }
  });
  
  // SOS ASSISTANCE PLANTE - Endpoint de diagnostic
  app.post("/api/plants/:id/sos-diagnostic", async (req: Request, res: Response) => {
    try {
      const plantId = parseInt(req.params.id);
      if (isNaN(plantId)) {
        return res.status(400).json({ message: "ID de plante invalide" });
      }
      
      // Récupérer les informations de la plante
      const plant = await storage.getPlant(plantId);
      if (!plant) {
        return res.status(404).json({ message: "Plante non trouvée" });
      }
      
      // Valider les données d'entrée avec Zod
      const diagnosticInputSchema = z.object({
        plantId: z.number(),
        plantName: z.string(),
        plantSpecies: z.string().optional(),
        lastWatering: z.string(),
        environment: z.object({
          directSunlight: z.boolean(),
          brightIndirect: z.boolean(),
          lowLight: z.boolean(),
        }),
        temperature: z.string(),
        symptoms: z.object({
          yellowLeaves: z.boolean(),
          brownSpots: z.boolean(),
          droppingLeaves: z.boolean(),
          dryLeaves: z.boolean(),
          moldOrFungus: z.boolean(),
          insects: z.boolean(),
          slowGrowth: z.boolean(),
          rootIssues: z.boolean(),
        }),
        additionalNotes: z.string().optional(),
      });
      
      const validatedData = diagnosticInputSchema.parse({
        ...req.body,
        plantId,
        plantName: plant.name,
        plantSpecies: plant.species,
      });
      
      // Générer le diagnostic en utilisant le service de diagnostic
      const diagnosticResult = plantDiagnosticService.generateDiagnosis(validatedData);
      
      // Si le diagnostic indique un problème grave, mettre à jour le statut de la plante
      if (diagnosticResult.status === "danger") {
        await storage.updatePlant(plantId, { status: "danger" });
      } else if (diagnosticResult.status === "warning" && plant.status === "healthy") {
        await storage.updatePlant(plantId, { status: "warning" });
      }
      
      // Créer une analyse à partir du diagnostic
      await storage.createPlantAnalysis({
        plantId,
        status: diagnosticResult.status,
        recommendations: diagnosticResult.diagnosis,
        healthIssues: req.body.additionalNotes || ""
      });
      
      // Vérifier et débloquer des badges si nécessaire
      let unlockedBadges = [];
      if (req.isAuthenticated() && req.user?.id) {
        const userId = req.user.id;
        const analysisCount = (await storage.getPlantAnalyses(plantId)).length;
        unlockedBadges = badgeService.checkAnalysisBadges(userId, analysisCount);
      }
      
      // Retourner le résultat du diagnostic
      res.json({
        diagnosis: diagnosticResult.diagnosis,
        status: diagnosticResult.status,
        actionRequired: diagnosticResult.actionRequired,
        unlockedBadges: unlockedBadges.length > 0 ? unlockedBadges : undefined
      });
    } catch (error: any) {
      console.error("Erreur lors du diagnostic SOS:", error);
      
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Données invalides pour le diagnostic", 
          errors: error.errors 
        });
      }
      
      res.status(500).json({ 
        message: "Une erreur est survenue lors du diagnostic",
        error: error.message
      });
    }
  });

  // RÉCUPÉRATION DE LA BASE DE DONNÉES DES PLANTES (pour l'ajout manuel)
  app.get("/api/plant-database", async (req: Request, res: Response) => {
    try {
      // Accepter à la fois 'q' et 'search' comme paramètres de recherche
      const query = (req.query.q || req.query.search) as string;
      
      console.log("API plant-database appelée avec requête:", query);
      
      if (query && query.trim().length > 0) {
        // Recherche de plantes selon le critère de recherche
        const results = searchPlants(query.trim());
        console.log(`Résultats trouvés: ${results.length} suggestions`);
        return res.json(results);
      }
      
      // Sans critère de recherche, retourne une partie de la base de données
      const defaultResults = plantDatabase.slice(0, 10); // Limiter à 10 résultats par défaut
      console.log(`Renvoi des 10 premiers résultats par défaut`);
      res.json(defaultResults);
    } catch (error: any) {
      console.error("Erreur lors de la recherche:", error);
      res.status(500).json({ message: error.message });
    }
  });
  
  // Récupération d'une plante spécifique de la base de données par nom
  app.get("/api/plant-database/:name", async (req: Request, res: Response) => {
    try {
      const name = req.params.name;
      const plant = getPlantByName(name);
      
      if (!plant) {
        return res.status(404).json({ message: "Plante non trouvée dans la base de données" });
      }
      
      res.json(plant);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // BADGES ROUTES
  app.get("/api/badges", isAuthenticated, async (req: Request, res: Response) => {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ message: "Utilisateur non authentifié" });
      }
      
      const badges = badgeService.getBadgesByUserId(req.user.id);
      res.json(badges);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Mettre à jour les badges liés aux plantes (après ajout/suppression de plante)
  app.post("/api/badges/update-plant-collection", isAuthenticated, async (req: Request, res: Response) => {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ message: "Utilisateur non authentifié" });
      }
      
      const userId = req.user.id;
      const plants = await storage.getPlantsByUserId(userId);
      const unlockedBadges = badgeService.checkPlantCollectionBadges(userId, plants.length);
      
      res.json({ unlockedBadges });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Mettre à jour les badges liés aux tâches complétées
  app.post("/api/badges/update-tasks", isAuthenticated, async (req: Request, res: Response) => {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ message: "Utilisateur non authentifié" });
      }
      
      const userId = req.user.id;
      const tasks = await storage.getTasks();
      const completedTasks = tasks.filter(task => task.completed).length;
      const unlockedBadges = badgeService.checkTaskCompletionBadges(userId, completedTasks);
      
      res.json({ unlockedBadges });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Enregistrer une connexion (pour le badge de connexion consécutive)
  app.post("/api/badges/login-streak", isAuthenticated, async (req: Request, res: Response) => {
    try {
      if (!req.user?.id) {
        return res.status(401).json({ message: "Utilisateur non authentifié" });
      }
      
      const daysStreak = req.body.daysStreak || 1;
      const userId = req.user.id;
      const updatedBadge = badgeService.updateConsecutiveLoginBadge(userId, daysStreak);
      
      res.json({ updatedBadge });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
