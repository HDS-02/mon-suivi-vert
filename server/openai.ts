import OpenAI from "openai";

// The newest OpenAI model is "gpt-4o" which was released May 13, 2024.
// Do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "" });

export async function analyzePlantImage(base64Image: string): Promise<any> {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("API key not found. Please set OPENAI_API_KEY environment variable.");
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

    const content = visionResponse.choices[0].message.content;
    if (!content) {
      throw new Error("No response content from OpenAI");
    }

    return JSON.parse(content);
  } catch (error: any) {
    console.error("Error analyzing plant image:", error.message);
    throw new Error(`Erreur lors de l'analyse de l'image: ${error.message}`);
  }
}
