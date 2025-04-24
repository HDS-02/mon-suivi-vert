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
    // Plantes existantes
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
    
    // Nouvelles plantes d'intérieur
    const newPlants: InsertPlant[] = [
      {
        name: "Vase d'argent",
        species: "Aechmea fasciata",
        status: "healthy",
        image: "",
        wateringFrequency: 7,
        light: "Indirecte brillante",
        temperature: "18-24°C",
        careNotes: "Versez l'eau au centre du rosette. Tolère l'oubli d'arrosage. Préfère une lumière vive sans soleil direct.",
      },
      {
        name: "Capillaire",
        species: "Adiantum raddianum",
        status: "healthy",
        image: "",
        wateringFrequency: 3,
        light: "Indirecte",
        temperature: "18-24°C",
        careNotes: "Maintenez le substrat constamment humide. Placez dans un endroit lumineux sans soleil direct. Vaporisez régulièrement pour maintenir une bonne humidité.",
      },
      {
        name: "Aglaonéma",
        species: "Aglaonema commutatum",
        status: "healthy",
        image: "",
        wateringFrequency: 7,
        light: "Faible à modérée",
        temperature: "18-27°C",
        careNotes: "Arrosez quand le dessus du terreau est sec. Tolère la faible luminosité. Idéale pour les espaces avec peu de lumière naturelle.",
      },
      {
        name: "Oreille d'éléphant",
        species: "Alocasia amazonica",
        status: "healthy",
        image: "",
        wateringFrequency: 5,
        light: "Indirecte brillante",
        temperature: "18-30°C",
        careNotes: "Maintenez le substrat légèrement humide. Placez dans un endroit lumineux sans soleil direct. Apprécie l'humidité ambiante élevée.",
      },
      {
        name: "Anthurium",
        species: "Anthurium andraeanum",
        status: "healthy",
        image: "",
        wateringFrequency: 7,
        light: "Indirecte brillante",
        temperature: "18-27°C",
        careNotes: "Laissez sécher légèrement entre les arrosages. Apprécie une lumière vive sans soleil direct. Vaporisez le feuillage régulièrement.",
      },
      {
        name: "Pin de Norfolk",
        species: "Araucaria heterophylla",
        status: "healthy",
        image: "",
        wateringFrequency: 7,
        light: "Indirecte brillante",
        temperature: "13-24°C",
        careNotes: "Arrosez modérément, laissez sécher entre les arrosages. Évitez le soleil direct qui peut brûler les branches. Préfère les températures fraîches.",
      },
      {
        name: "Plante de fer",
        species: "Aspidistra elatior",
        status: "healthy",
        image: "",
        wateringFrequency: 10,
        light: "Faible à modérée",
        temperature: "10-24°C",
        careNotes: "Extrêmement résistante, supporte la négligence. Tolère très bien l'ombre. Arrosez sobrement, laissez sécher entre les arrosages.",
      },
      {
        name: "Fougère nid d'oiseau",
        species: "Asplenium nidus",
        status: "healthy",
        image: "",
        wateringFrequency: 5,
        light: "Indirecte",
        temperature: "18-27°C",
        careNotes: "Maintenez le substrat constamment humide. Apprécie l'humidité ambiante. Ne laissez jamais sécher complètement.",
      },
      {
        name: "Pied d'éléphant",
        species: "Beaucarnea recurvata",
        status: "healthy",
        image: "",
        wateringFrequency: 14,
        light: "Directe",
        temperature: "15-30°C",
        careNotes: "Extrêmement résistante à la sécheresse. Arrosez peu et laissez sécher entre les arrosages. Tolère le soleil direct.",
      },
      {
        name: "Bégonia royal",
        species: "Begonia rex",
        status: "healthy",
        image: "",
        wateringFrequency: 7,
        light: "Indirecte",
        temperature: "18-24°C",
        careNotes: "Arrosez quand la surface du terreau est sèche. Évitez de mouiller les feuilles. Apprécie l'humidité ambiante sans arrosage direct.",
      },
      {
        name: "Caladium",
        species: "Caladium bicolor",
        status: "healthy",
        image: "",
        wateringFrequency: 3,
        light: "Indirecte",
        temperature: "18-30°C",
        careNotes: "Maintenez le substrat humide. Apprécie la chaleur et l'humidité. Évitez les courants d'air froid.",
      },
      {
        name: "Plante paon",
        species: "Calathea makoyana",
        status: "healthy",
        image: "",
        wateringFrequency: 5,
        light: "Indirecte faible",
        temperature: "18-24°C",
        careNotes: "Maintenez le substrat légèrement humide. Sensible au chlore, utilisez de l'eau filtrée. Apprécie l'humidité ambiante élevée.",
      },
      {
        name: "Palmier nain",
        species: "Chamaedorea elegans",
        status: "healthy",
        image: "",
        wateringFrequency: 7,
        light: "Indirecte",
        temperature: "18-24°C",
        careNotes: "Arrosez quand le dessus du terreau est sec. Tolère l'ombre. Vaporisez régulièrement pour prévenir les araignées rouges.",
      },
      {
        name: "Plante araignée",
        species: "Chlorophytum comosum",
        status: "healthy",
        image: "",
        wateringFrequency: 7,
        light: "Indirecte à directe",
        temperature: "13-27°C",
        careNotes: "Arrosez quand le terreau est sec. Très résistante et facile à entretenir. Produit des plantules faciles à propager.",
      },
      {
        name: "Vigne d'intérieur",
        species: "Cissus rhombifolia",
        status: "healthy",
        image: "",
        wateringFrequency: 7,
        light: "Indirecte brillante",
        temperature: "15-27°C",
        careNotes: "Arrosez quand la surface du terreau est sèche. Offrez un support pour grimper. Apprécie l'humidité ambiante.",
      },
      {
        name: "Clivia",
        species: "Clivia miniata",
        status: "healthy",
        image: "",
        wateringFrequency: 10,
        light: "Indirecte",
        temperature: "15-24°C",
        careNotes: "Laissez sécher entre les arrosages. Période de repos en hiver nécessaire pour la floraison. Réduisez l'arrosage en hiver.",
      },
      {
        name: "Croton",
        species: "Codiaeum variegatum",
        status: "healthy",
        image: "",
        wateringFrequency: 5,
        light: "Directe",
        temperature: "18-30°C",
        careNotes: "Maintenez le substrat légèrement humide. Les couleurs sont plus vives avec plus de lumière. Vaporisez régulièrement.",
      },
      {
        name: "Plante de jade",
        species: "Crassula ovata",
        status: "healthy",
        image: "",
        wateringFrequency: 14,
        light: "Directe",
        temperature: "15-24°C",
        careNotes: "Arrosez rarement, laissez sécher complètement entre les arrosages. Placez en plein soleil. Très facile à entretenir.",
      },
      {
        name: "Cyclamen",
        species: "Cyclamen persicum",
        status: "healthy",
        image: "",
        wateringFrequency: 5,
        light: "Indirecte brillante",
        temperature: "10-18°C",
        careNotes: "Arrosez par le bas pour éviter de mouiller le collet. Préfère les températures fraîches. Entre en dormance l'été.",
      },
      {
        name: "Dieffenbachia",
        species: "Dieffenbachia seguine",
        status: "healthy",
        image: "",
        wateringFrequency: 7,
        light: "Indirecte",
        temperature: "18-27°C",
        careNotes: "Arrosez quand la surface du terreau est sèche. Attention, toutes les parties sont toxiques si ingérées. Tolère l'ombre.",
      },
      {
        name: "Dragonnier",
        species: "Dracaena fragrans",
        status: "healthy",
        image: "",
        wateringFrequency: 10,
        light: "Indirecte",
        temperature: "18-24°C",
        careNotes: "Laissez sécher entre les arrosages. Tolère une large gamme de conditions. Sensible au fluor, utilisez de l'eau filtrée.",
      },
      {
        name: "Pothos",
        species: "Epipremnum aureum",
        status: "healthy",
        image: "",
        wateringFrequency: 7,
        light: "Faible à brillante",
        temperature: "15-30°C",
        careNotes: "Arrosez quand le terreau est sec. Extrêmement adaptable et facile à cultiver. Peut être taillé pour encourager la ramification.",
      },
      {
        name: "Figuier pleureur",
        species: "Ficus benjamina",
        status: "healthy",
        image: "",
        wateringFrequency: 7,
        light: "Indirecte brillante",
        temperature: "18-24°C",
        careNotes: "Arrosez quand la surface du terreau est sèche. N'aime pas être déplacé. Sensible aux courants d'air.",
      },
      {
        name: "Caoutchouc",
        species: "Ficus elastica",
        status: "healthy",
        image: "",
        wateringFrequency: 10,
        light: "Indirecte brillante",
        temperature: "18-30°C",
        careNotes: "Laissez sécher entre les arrosages. Essuyez les feuilles régulièrement pour enlever la poussière. Peut atteindre plusieurs mètres.",
      },
      {
        name: "Plante mosaïque",
        species: "Fittonia albivenis",
        status: "healthy",
        image: "",
        wateringFrequency: 3,
        light: "Indirecte faible",
        temperature: "18-27°C",
        careNotes: "Maintenez le substrat constamment humide. Apprécie l'humidité ambiante élevée. Parfaite pour terrariums.",
      },
      {
        name: "Lierre",
        species: "Hedera helix",
        status: "healthy",
        image: "",
        wateringFrequency: 7,
        light: "Indirecte",
        temperature: "10-21°C",
        careNotes: "Arrosez modérément, laissez sécher entre les arrosages. Préfère les températures fraîches. Vaporisez régulièrement.",
      },
      {
        name: "Fleur de porcelaine",
        species: "Hoya carnosa",
        status: "healthy",
        image: "",
        wateringFrequency: 10,
        light: "Indirecte brillante",
        temperature: "18-24°C",
        careNotes: "Laissez sécher entre les arrosages. Ne coupez pas les tiges florales après la floraison. Apprécie d'être à l'étroit dans son pot.",
      },
      {
        name: "Kalanchoé",
        species: "Kalanchoe blossfeldiana",
        status: "healthy",
        image: "",
        wateringFrequency: 10,
        light: "Directe",
        temperature: "15-24°C",
        careNotes: "Arrosez uniquement quand le substrat est sec. Supporte bien la sécheresse. Nécessite des jours courts pour fleurir.",
      },
      {
        name: "Plante qui prie",
        species: "Maranta leuconeura",
        status: "healthy",
        image: "",
        wateringFrequency: 5,
        light: "Indirecte faible",
        temperature: "18-24°C",
        careNotes: "Maintenez le substrat légèrement humide. Sensible au chlore, utilisez de l'eau filtrée. Feuilles qui se replient la nuit.",
      },
      {
        name: "Plante à trous",
        species: "Monstera deliciosa",
        status: "healthy",
        image: "",
        wateringFrequency: 7,
        light: "Indirecte brillante",
        temperature: "18-30°C",
        careNotes: "Arrosez quand le terreau commence à sécher. Apprécie un tuteur pour grimper. Les feuilles développent des trous avec l'âge.",
      },
      {
        name: "Fougère de Boston",
        species: "Nephrolepis exaltata",
        status: "healthy",
        image: "",
        wateringFrequency: 3,
        light: "Indirecte",
        temperature: "18-24°C",
        careNotes: "Maintenez le substrat constamment humide. Vaporisez régulièrement. Ne laissez jamais sécher complètement.",
      },
      {
        name: "Peperomia",
        species: "Peperomia obtusifolia",
        status: "healthy",
        image: "",
        wateringFrequency: 7,
        light: "Indirecte",
        temperature: "18-24°C",
        careNotes: "Arrosez quand la surface du terreau est sèche. Feuilles succulentes qui stockent l'eau. Idéal pour petits espaces.",
      },
      {
        name: "Philodendron",
        species: "Philodendron scandens",
        status: "healthy",
        image: "",
        wateringFrequency: 7,
        light: "Indirecte",
        temperature: "18-27°C",
        careNotes: "Arrosez quand la surface du terreau est sèche. Très facile à cultiver. Peut grimper ou retomber selon vos préférences.",
      },
      {
        name: "Plante à monnaie chinoise",
        species: "Pilea peperomioides",
        status: "healthy",
        image: "",
        wateringFrequency: 7,
        light: "Indirecte brillante",
        temperature: "15-24°C",
        careNotes: "Arrosez quand le terreau commence à sécher. Tournez régulièrement pour une croissance uniforme. Produit facilement des rejets.",
      },
      {
        name: "Langue de belle-mère",
        species: "Sansevieria trifasciata",
        status: "healthy",
        image: "",
        wateringFrequency: 14,
        light: "Faible à directe",
        temperature: "15-30°C",
        careNotes: "Arrosez très peu, laissez sécher complètement entre les arrosages. Extrêmement résistante, presque indestructible. Purifie l'air.",
      },
      {
        name: "Fleur de lune",
        species: "Spathiphyllum wallisii",
        status: "healthy",
        image: "",
        wateringFrequency: 7,
        light: "Indirecte faible",
        temperature: "18-27°C",
        careNotes: "Maintenez le substrat légèrement humide. S'affaisse quand elle a besoin d'eau. Fleurit même avec peu de lumière.",
      },
      {
        name: "Oiseau de paradis",
        species: "Strelitzia reginae",
        status: "healthy",
        image: "",
        wateringFrequency: 7,
        light: "Directe",
        temperature: "18-30°C",
        careNotes: "Arrosez quand la surface du terreau est sèche. Nécessite beaucoup de lumière pour fleurir. Plante imposante et spectaculaire.",
      },
      {
        name: "Syngonium",
        species: "Syngonium podophyllum",
        status: "healthy",
        image: "",
        wateringFrequency: 7,
        light: "Indirecte",
        temperature: "18-27°C",
        careNotes: "Arrosez quand la surface du terreau est sèche. Les feuilles changent de forme avec l'âge. Peut grimper avec un support.",
      },
      {
        name: "Misère",
        species: "Tradescantia zebrina",
        status: "healthy",
        image: "",
        wateringFrequency: 5,
        light: "Indirecte brillante",
        temperature: "15-27°C",
        careNotes: "Maintenez le substrat légèrement humide. Croissance rapide et facile à propager. Couleurs plus vives avec plus de lumière.",
      },
      {
        name: "Yucca",
        species: "Yucca elephantipes",
        status: "healthy",
        image: "",
        wateringFrequency: 14,
        light: "Directe",
        temperature: "15-30°C",
        careNotes: "Arrosez très peu, laissez sécher complètement entre les arrosages. Très résistant à la sécheresse. Préfère le plein soleil.",
      },
      {
        name: "Plante ZZ",
        species: "Zamioculcas zamiifolia",
        status: "healthy",
        image: "",
        wateringFrequency: 14,
        light: "Faible à brillante",
        temperature: "15-30°C",
        careNotes: "Arrosez très peu, laissez sécher complètement entre les arrosages. Extrêmement résistante à la négligence. Tolère très bien l'ombre.",
      },
    ];
    
    // Créer les plantes de base pour la démo
    const ficus = this.createPlant(ficusPlant);
    const orchidee = this.createPlant(orchideePlant);
    const aloe = this.createPlant(aloePlant);
    const basilic = this.createPlant(basilicPlant);
    
    // Ajouter toutes les nouvelles plantes
    for (const plant of newPlants) {
      this.createPlant(plant);
    }
    
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
