import OpenAI from "openai";
import { PlantAnalyzer } from "./plantAnalyzer";

// The newest OpenAI model is "gpt-4o" which was released May 13, 2024.
// Do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || "", 
  timeout: 60000, // Augmenter le timeout à 60 secondes
  maxRetries: 3 // Essayer jusqu'à 3 fois en cas d'erreur temporaire
});

// Nouvel analyseur de plantes basé sur des règles (ne nécessite pas d'API)
const plantAnalyzer = new PlantAnalyzer();

export async function analyzePlantImage(base64Image: string, fileName?: string): Promise<any> {
  try {
    // Si aucune clé API OpenAI n'est définie, utiliser l'analyseur local
    if (!process.env.OPENAI_API_KEY) {
      console.log("Clé API OpenAI non trouvée, utilisation de l'analyseur local");
      // Si un nom de fichier est fourni, analyser l'image en fonction du nom de fichier
      if (fileName) {
        return plantAnalyzer.analyzeImage(fileName);
      }
      // Sinon, retourner une analyse générique
      return plantAnalyzer.analyzeByDescription("plante d'intérieur générique");
    }

    const prompt = `
    Analyse cette image d'une plante en détail et fournis-moi les informations suivantes en français dans un format JSON :
    - Le nom probable de la plante (si identifiable)
    - L'espèce scientifique (si identifiable)
    - L'état de santé de la plante (choisir parmi: "healthy", "warning", "danger")
    - Les problèmes de santé visibles (maladies, carences, parasites, etc.) s'il y en a
    - Des recommandations spécifiques pour améliorer ou maintenir la santé de la plante
    - Des instructions d'entretien concernant:
      - L'arrosage
      - L'exposition à la lumière
      - La température idéale
      - D'autres conseils pertinents

    Retourne tes résultats en français, dans un format JSON structuré et facilement analysable.
    `;

    try {
      console.log("Démarrage de l'analyse d'image avec OpenAI...");
      
      // Vérification de la taille de l'image
      const imageSize = Math.ceil(base64Image.length / (4/3)); // Taille approximative en octets
      console.log(`Taille de l'image: ${(imageSize / (1024 * 1024)).toFixed(2)} MB`);
      
      if (imageSize > 20 * 1024 * 1024) { // Plus de 20 MB
        throw new Error("L'image est trop volumineuse. Veuillez utiliser une image de moins de 20 MB.");
      }

      const visionResponse = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: prompt
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`
                }
              }
            ],
          },
        ],
        response_format: { type: "json_object" },
        max_tokens: 800,
      });

      console.log("Analyse OpenAI réussie");
      
      const content = visionResponse.choices[0].message.content;
      if (!content) {
        throw new Error("Aucun contenu reçu de l'API OpenAI");
      }

      // Vérifier que le contenu est un JSON valide
      try {
        const parsedContent = JSON.parse(content);
        return parsedContent;
      } catch (parseError) {
        console.error("Erreur lors du parsing JSON:", content);
        throw new Error("Le format de réponse reçu n'est pas un JSON valide");
      }
    } catch (apiError: any) {
      console.error("Erreur API OpenAI:", apiError);
      
      // Différents types d'erreurs OpenAI possibles
      if (apiError.status === 429 || 
          (apiError.error && apiError.error.code === 'rate_limit_exceeded') ||
          apiError.message?.includes("rate_limit") || 
          apiError.message?.includes("quota") || 
          apiError.message?.includes("capacity") ||
          apiError.message?.includes("exceeded")) {
        
        console.error("Limite d'API OpenAI dépassée:", apiError.message);
        
        // Utiliser l'analyseur local en cas d'erreur d'API OpenAI
        console.log("Utilisation de l'analyseur local comme solution de repli");
        if (fileName) {
          return plantAnalyzer.analyzeImage(fileName);
        } else {
          return plantAnalyzer.analyzeByDescription("plante d'intérieur générique");
        }
      } else if (apiError.status === 400 || apiError.message?.includes("bad request")) {
        // Erreur de requête malformée
        throw new Error("Erreur de requête: format d'image non pris en charge ou requête incorrecte");
      } else if (apiError.status === 401 || apiError.message?.includes("invalid api key")) {
        // Erreur d'authentification
        throw new Error("Erreur d'authentification API: vérifiez votre clé API OpenAI");
      } else {
        // Toute autre erreur API
        throw new Error(`Erreur d'API OpenAI: ${apiError.message || "Erreur inconnue"}`);
      }
    }
  } catch (error: any) {
    console.error("Erreur globale lors de l'analyse d'image:", error);
    
    // En cas d'erreur globale, utiliser l'analyseur local comme dernier recours
    console.log("Erreur d'analyse, utilisation de l'analyseur local comme solution de dernier recours");
    try {
      if (fileName) {
        return plantAnalyzer.analyzeImage(fileName);
      } else {
        return plantAnalyzer.analyzeByDescription("plante d'intérieur générique");
      }
    } catch (fallbackError) {
      console.error("Échec de l'analyseur local:", fallbackError);
      throw new Error(`Erreur lors de l'analyse de l'image: ${error.message}`);
    }
  }
}
