import { 
  plants, Plant, InsertPlant, 
  tasks, Task, InsertTask,
  plantAnalyses, PlantAnalysis, InsertPlantAnalysis,
  users, User, InsertUser
} from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

export interface IStorage {
  // User CRUD methods
  getUsers(): Promise<User[]>;
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;
  deleteUser(id: number): Promise<boolean>;

  // Plant CRUD methods
  getPlants(): Promise<Plant[]>;
  getPlantsByUserId(userId: number): Promise<Plant[]>;
  getPlant(id: number): Promise<Plant | undefined>;
  createPlant(plant: InsertPlant): Promise<Plant>;
  updatePlant(id: number, plant: Partial<Plant>): Promise<Plant | undefined>;
  deletePlant(id: number): Promise<boolean>;
  
  // Task CRUD methods
  getTasks(): Promise<Task[]>;
  getTasksByPlantId(plantId: number): Promise<Task[]>;
  getPendingTasks(): Promise<Task[]>;
  createTask(task: InsertTask): Promise<Task>;
  updateTask(id: number, task: Partial<Task>): Promise<Task | undefined>;
  completeTask(id: number): Promise<Task | undefined>;
  deleteTask(id: number): Promise<boolean>;
  
  // Plant Analysis CRUD methods
  getPlantAnalyses(plantId: number): Promise<PlantAnalysis[]>;
  getLatestPlantAnalysis(plantId: number): Promise<PlantAnalysis | undefined>;
  createPlantAnalysis(analysis: InsertPlantAnalysis): Promise<PlantAnalysis>;
  
  // Session store
  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private plants: Map<number, Plant>;
  private tasks: Map<number, Task>;
  private plantAnalyses: Map<number, PlantAnalysis>;
  private userIdCounter: number;
  private plantIdCounter: number;
  private taskIdCounter: number;
  private analysisIdCounter: number;
  public sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.plants = new Map();
    this.tasks = new Map();
    this.plantAnalyses = new Map();
    
    this.userIdCounter = 1;
    this.plantIdCounter = 1;
    this.taskIdCounter = 1;
    this.analysisIdCounter = 1;
    
    // Create session store
    const MemoryStore = createMemoryStore(session);
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // 24h
    });
    
    // Initialize with sample data
    this.initSampleData();
  }
  
  // User CRUD methods
  async getUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values())
      .find(user => user.username === username);
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const createdAt = new Date();
    const newUser: User = { ...user, id, createdAt };
    this.users.set(id, newUser);
    return newUser;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async deleteUser(id: number): Promise<boolean> {
    return this.users.delete(id);
  }
  
  async getPlantsByUserId(userId: number): Promise<Plant[]> {
    return Array.from(this.plants.values())
      .filter(plant => plant.userId === userId);
  }

  private initSampleData() {
    // Sample plants
    const ficusPlant: InsertPlant = {
      name: "Ficus Lyrata",
      species: "Ficus lyrata",
      status: "healthy",
      image: "/ficus.jpg",
      wateringFrequency: 7,
      light: "Indirecte",
      temperature: "18-24°C",
      careNotes: "Arrosez lorsque les 2-3 premiers cm du terreau sont secs. Placez dans un endroit lumineux mais sans soleil direct. Essuyez régulièrement les feuilles pour enlever la poussière.",
    };
    
    const orchideePlant: InsertPlant = {
      name: "Orchidée",
      species: "Phalaenopsis",
      status: "warning",
      image: "/orchidee.jpg",
      wateringFrequency: 10,
      light: "Indirecte",
      temperature: "18-25°C",
      careNotes: "Arrosez uniquement lorsque le substrat est complètement sec. Placez dans un endroit lumineux sans soleil direct. Vaporisez les racines aériennes.",
    };
    
    const aloePlant: InsertPlant = {
      name: "Aloe Vera",
      species: "Aloe barbadensis miller",
      status: "healthy",
      image: "/aloe.jpg",
      wateringFrequency: 14,
      light: "Directe",
      temperature: "20-29°C",
      careNotes: "Arrosez uniquement lorsque le terreau est complètement sec. Peut supporter le soleil direct. Idéal pour les endroits ensoleillés.",
    };
    
    const basilicPlant: InsertPlant = {
      name: "Basilic",
      species: "Ocimum basilicum",
      status: "danger",
      image: "/basilic.jpg",
      wateringFrequency: 3,
      light: "Directe",
      temperature: "18-30°C",
      careNotes: "Arrosez régulièrement pour garder le sol humide. Préfère une exposition ensoleillée. Récoltez les feuilles régulièrement pour stimuler la croissance.",
    };
    
    const ficus = this.createPlant(ficusPlant);
    const orchidee = this.createPlant(orchideePlant);
    const aloe = this.createPlant(aloePlant);
    const basilic = this.createPlant(basilicPlant);
    
    // Sample tasks
    this.createTask({
      plantId: ficus.id,
      type: "water",
      description: "Il n'a pas été arrosé depuis 5 jours",
      dueDate: new Date(),
      completed: false
    });
    
    this.createTask({
      plantId: orchidee.id,
      type: "light",
      description: "Placer dans un endroit plus lumineux",
      dueDate: new Date(),
      completed: false
    });
    
    this.createTask({
      plantId: basilic.id,
      type: "water",
      description: "Besoin d'eau urgent",
      dueDate: new Date(),
      completed: false
    });
    
    // Sample analyses
    this.createPlantAnalysis({
      plantId: ficus.id,
      status: "healthy",
      image: "/ficus-analyse.jpg",
      aiAnalysis: {
        plantName: "Ficus Lyrata",
        status: "healthy",
        recommendations: ["Continuer l'entretien actuel", "Nettoyer les feuilles régulièrement"]
      },
      healthIssues: "",
      recommendations: "La plante est en parfaite santé."
    });
  }

  // Plant CRUD methods
  async getPlants(): Promise<Plant[]> {
    return Array.from(this.plants.values());
  }

  async getPlant(id: number): Promise<Plant | undefined> {
    return this.plants.get(id);
  }

  async createPlant(plant: InsertPlant): Promise<Plant> {
    const id = this.plantIdCounter++;
    const dateAdded = new Date();
    const newPlant: Plant = { ...plant, id, dateAdded };
    this.plants.set(id, newPlant);
    return newPlant;
  }

  async updatePlant(id: number, updates: Partial<Plant>): Promise<Plant | undefined> {
    const plant = this.plants.get(id);
    if (!plant) return undefined;
    
    const updatedPlant = { ...plant, ...updates };
    this.plants.set(id, updatedPlant);
    return updatedPlant;
  }

  async deletePlant(id: number): Promise<boolean> {
    return this.plants.delete(id);
  }
  
  // Task CRUD methods
  async getTasks(): Promise<Task[]> {
    return Array.from(this.tasks.values());
  }

  async getTasksByPlantId(plantId: number): Promise<Task[]> {
    return Array.from(this.tasks.values())
      .filter(task => task.plantId === plantId);
  }
  
  async getPendingTasks(): Promise<Task[]> {
    return Array.from(this.tasks.values())
      .filter(task => !task.completed);
  }

  async createTask(task: InsertTask): Promise<Task> {
    const id = this.taskIdCounter++;
    const newTask: Task = { ...task, id };
    this.tasks.set(id, newTask);
    return newTask;
  }

  async updateTask(id: number, updates: Partial<Task>): Promise<Task | undefined> {
    const task = this.tasks.get(id);
    if (!task) return undefined;
    
    const updatedTask = { ...task, ...updates };
    this.tasks.set(id, updatedTask);
    return updatedTask;
  }
  
  async completeTask(id: number): Promise<Task | undefined> {
    const task = this.tasks.get(id);
    if (!task) return undefined;
    
    const updatedTask = { 
      ...task, 
      completed: true, 
      dateCompleted: new Date() 
    };
    this.tasks.set(id, updatedTask);
    return updatedTask;
  }

  async deleteTask(id: number): Promise<boolean> {
    return this.tasks.delete(id);
  }
  
  // Plant Analysis CRUD methods
  async getPlantAnalyses(plantId: number): Promise<PlantAnalysis[]> {
    return Array.from(this.plantAnalyses.values())
      .filter(analysis => analysis.plantId === plantId)
      .sort((a, b) => {
        // Sort by date descending (newest first)
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
  }
  
  async getLatestPlantAnalysis(plantId: number): Promise<PlantAnalysis | undefined> {
    const analyses = await this.getPlantAnalyses(plantId);
    return analyses.length > 0 ? analyses[0] : undefined;
  }

  async createPlantAnalysis(analysis: InsertPlantAnalysis): Promise<PlantAnalysis> {
    const id = this.analysisIdCounter++;
    const date = new Date();
    const newAnalysis: PlantAnalysis = { ...analysis, id, date };
    this.plantAnalyses.set(id, newAnalysis);
    return newAnalysis;
  }
}

export const storage = new MemStorage();
