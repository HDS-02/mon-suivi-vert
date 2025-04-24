import OpenAI from "openai";
import { PlantAnalyzer } from "./plantAnalyzer";
import { PlantAnalysisResponse } from "@shared/schema";

// The newest OpenAI model is "gpt-4o" which was released May 13, 2024.
// Do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || "", 
  timeout: 60000, // Augmenter le timeout à 60 secondes
  maxRetries: 3 // Essayer jusqu'à 3 fois en cas d'erreur temporaire
});

// Nouvel analyseur de plantes basé sur des règles (ne nécessite pas d'API)
const plantAnalyzer = new PlantAnalyzer();

/**
 * Utilise l'API OpenAI pour obtenir des informations détaillées sur une plante à partir de son nom
 * @param plantName Nom de la plante
 * @returns Informations détaillées sur la plante
 */
export async function getPlantInfoByName(plantName: string): Promise<PlantAnalysisResponse> {
  // Si aucune clé API OpenAI n'est définie ou si le nom est trop court, utiliser l'analyseur local
  if (!process.env.OPENAI_API_KEY || !plantName || plantName.trim().length < 3) {
    console.log("Clé API OpenAI non trouvée ou nom trop court, utilisation de l'analyseur local");
    return plantAnalyzer.analyzeByDescription(plantName);
  }

  try {
    console.log(`Recherche d'informations sur la plante "${plantName}" avec ChatGPT...`);

    const prompt = `
    Analyse le nom de plante suivant et fournis-moi des informations détaillées en français dans un format JSON:
    "${plantName}"

    Retourne les informations suivantes:
    - Le nom commun complet de la plante en français
    - L'espèce scientifique exacte si identifiable
    - Des instructions d'entretien précises:
      - Fréquence et méthode d'arrosage
      - Besoins en lumière (intensité et durée)
      - Plage de température idéale
      - Conseils supplémentaires d'entretien
    - État de santé typique et problèmes courants (choisir parmi: "healthy", "warning", "danger")
    - Des recommandations spécifiques pour bien entretenir cette plante

    Même si le nom fourni est vague ou générique, essaie de donner des informations utiles et pertinentes.
    Indique clairement si tu n'es pas certain de l'identification.
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: "Tu es un expert botaniste spécialisé dans les plantes d'intérieur et d'extérieur." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
      max_tokens: 800,
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("Aucune réponse reçue de ChatGPT");
    }

    // Analyser la réponse JSON
    try {
      const parsedContent = JSON.parse(content);
      
      // Transformer la réponse au format PlantAnalysisResponse
      const plantInfo: PlantAnalysisResponse = {
        plantName: parsedContent.nom || plantName,
        species: parsedContent.espece || parsedContent.espèce || parsedContent.especeScientifique || undefined,
        status: parsedContent.etat || parsedContent.état || "healthy",
        healthIssues: parsedContent.problemes || parsedContent.problèmes || parsedContent.problemesCommuns || [],
        recommendations: Array.isArray(parsedContent.recommandations) ? 
          parsedContent.recommandations : 
          [parsedContent.recommandations].filter(Boolean),
        careInstructions: {
          watering: parsedContent.entretien?.arrosage || parsedContent.arrosage || "Arrosage modéré",
          light: parsedContent.entretien?.lumiere || parsedContent.entretien?.lumière || parsedContent.lumiere || parsedContent.lumière || "Lumière indirecte",
          temperature: parsedContent.entretien?.temperature || parsedContent.temperature || parsedContent.température || "18-24°C",
          additional: Array.isArray(parsedContent.entretien?.conseils) ? 
            parsedContent.entretien.conseils : 
            parsedContent.conseils ? 
              [parsedContent.conseils].filter(Boolean) : 
              ["Vérifiez régulièrement l'état des feuilles"]
        }
      };

      console.log("Recherche avec ChatGPT réussie");
      return plantInfo;

    } catch (parseError) {
      console.error("Erreur lors du parsing de la réponse JSON:", content);
      throw new Error("Le format de réponse reçu n'est pas un JSON valide");
    }
  } catch (error: any) {
    console.error("Erreur lors de la recherche avec ChatGPT:", error.message || "Erreur inconnue");
    
    // Utiliser l'analyseur local comme solution de repli
    console.log("Utilisation de l'analyseur local comme solution de remplacement");
    return plantAnalyzer.analyzeByDescription(plantName);
  }
}

export async function analyzePlantImage(base64Image: string, fileName?: string, description?: string): Promise<any> {
  // Si aucune clé API OpenAI n'est définie, utiliser l'analyseur local
  if (!process.env.OPENAI_API_KEY) {
    console.log("Clé API OpenAI non trouvée, utilisation de l'analyseur local");
    
    // Si un nom de fichier est fourni, analyser l'image en fonction du nom de fichier et de la description
    if (fileName) {
      return plantAnalyzer.analyzeImage(fileName, description);
    }
    // Sinon, tenter d'utiliser la description si disponible
    if (description) {
      return plantAnalyzer.analyzeByDescription(description);
    }
    // Si aucune information n'est disponible, retourner une analyse générique
    return plantAnalyzer.analyzeByDescription("plante d'intérieur générique");
  }

  // Prompt pour l'API OpenAI
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
  } catch (error: any) {
    // Gérer toutes les erreurs (API, parsing, etc.)
    console.error("Erreur lors de l'analyse avec OpenAI:", error.message || "Erreur inconnue");
    
    // Utiliser l'analyseur local comme solution de repli
    console.log("Utilisation de l'analyseur local comme solution de remplacement");
    
    // Tenter d'utiliser l'analyseur local
    try {
      // Si nous avons un nom de fichier, utilisons-le pour l'analyse avec la description si disponible
      if (fileName) {
        const localAnalysis = plantAnalyzer.analyzeImage(fileName, description);
        console.log("Analyse locale réussie !");
        return localAnalysis;
      } 
      // Si nous avons une description, utilisons-la
      else if (description) {
        const localAnalysis = plantAnalyzer.analyzeByDescription(description);
        console.log("Analyse basée sur la description réussie !");
        return localAnalysis;
      }
      // Sinon, utilisons des termes génériques pour l'analyse
      else {
        const terms = ["plante d'intérieur", "plante verte", "plante ornementale", "plante domestique"];
        const randomTerm = terms[Math.floor(Math.random() * terms.length)];
        const localAnalysis = plantAnalyzer.analyzeByDescription(randomTerm);
        console.log("Analyse générique locale réussie !");
        return localAnalysis;
      }
    } catch (localError) {
      // En dernier recours, utiliser l'analyse générique
      console.error("Erreur avec l'analyseur local:", localError);
      return plantAnalyzer.getGenericAnalysis();
    }
  }
}