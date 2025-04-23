import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface WeatherData {
  temperature: number;
  humidity: number;
  description: string;
  icon: string;
  recommendations: string[];
}

// Données météo simulées pour le mode hors ligne ou quand l'API n'est pas disponible
const mockWeatherData: WeatherData = {
  temperature: 22,
  humidity: 65,
  description: "Partiellement nuageux",
  icon: "partly_cloudy",
  recommendations: [
    "Température idéale pour la plupart des plantes d'intérieur",
    "Humidité adéquate, vos plantes devraient être confortables",
    "Aucune action spécifique nécessaire aujourd'hui"
  ]
};

// Convertir l'icône météo en icône material
function getWeatherIcon(iconCode: string): string {
  const iconMap: Record<string, string> = {
    "clear_day": "wb_sunny",
    "clear_night": "nights_stay",
    "cloudy": "cloud",
    "partly_cloudy": "cloud_queue",
    "rainy": "water_drop",
    "thunderstorm": "thunderstorm",
    "snowy": "ac_unit",
    "foggy": "cloud",
    "windy": "air"
  };

  return iconMap[iconCode] || "help_outline";
}

// Générer des recommandations basées sur les conditions météo
function generateRecommendations(temperature: number, humidity: number): string[] {
  const recommendations: string[] = [];

  // Recommandations basées sur la température
  if (temperature > 30) {
    recommendations.push("Température élevée : arrosez vos plantes plus fréquemment");
    recommendations.push("Éloignez les plantes sensibles des fenêtres exposées au soleil");
  } else if (temperature < 10) {
    recommendations.push("Température basse : évitez d'arroser excessivement");
    recommendations.push("Éloignez les plantes tropicales des sources d'air froid");
  } else {
    recommendations.push("Température idéale pour la plupart des plantes d'intérieur");
  }

  // Recommandations basées sur l'humidité
  if (humidity < 40) {
    recommendations.push("Humidité basse : vaporisez vos plantes ou utilisez un humidificateur");
  } else if (humidity > 80) {
    recommendations.push("Humidité élevée : réduisez la fréquence d'arrosage");
    recommendations.push("Vérifiez les signes de moisissure sur les plantes sensibles");
  } else {
    recommendations.push("Niveau d'humidité favorable pour vos plantes");
  }

  return recommendations;
}

export default function WeatherWidget() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        setLoading(true);
        
        // Mode hors ligne pour développement - utiliser des données simulées
        // Dans une version réelle, nous utiliserions une API météo
        // comme OpenWeatherMap ou WeatherAPI
        setTimeout(() => {
          // Simulation d'une requête API
          setWeatherData({
            ...mockWeatherData,
            temperature: Math.floor(Math.random() * 10) + 18, // 18-28°C
            humidity: Math.floor(Math.random() * 30) + 50,    // 50-80%
          });
          setLoading(false);
        }, 1500);
        
      } catch (err) {
        console.error("Erreur lors de la récupération des données météo:", err);
        setError("Impossible de récupérer les données météo");
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, []);

  // Générer des recommandations basées sur les données météo
  useEffect(() => {
    if (weatherData) {
      const recommendations = generateRecommendations(
        weatherData.temperature,
        weatherData.humidity
      );
      setWeatherData(prev => prev ? { ...prev, recommendations } : null);
    }
  }, [weatherData?.temperature, weatherData?.humidity]);

  if (error) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="pt-6">
          <div className="text-center text-destructive">
            <span className="material-icons text-3xl">error_outline</span>
            <p className="mt-2">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border overflow-hidden">
      <CardContent className="pt-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <span className="material-icons mr-2">wb_sunny</span>
          Météo et conseils d'entretien
        </h3>
        
        {loading ? (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-4 w-[150px]" />
              </div>
            </div>
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        ) : weatherData ? (
          <div>
            <div className="flex items-center mb-4">
              <span className="material-icons text-4xl text-primary mr-3">
                {getWeatherIcon(weatherData.icon)}
              </span>
              <div>
                <div className="text-xl font-medium">
                  {weatherData.temperature}°C
                </div>
                <div className="text-muted-foreground">
                  Humidité: {weatherData.humidity}%
                </div>
              </div>
            </div>
            
            <div className="text-muted-foreground mb-2">{weatherData.description}</div>
            
            <div className="mt-4">
              <h4 className="font-medium mb-2">Conseils d'entretien:</h4>
              <ul className="space-y-1">
                {weatherData.recommendations.map((recommendation, index) => (
                  <li key={index} className="flex items-start">
                    <span className="material-icons text-primary mr-2 text-sm">eco</span>
                    <span className="text-sm">{recommendation}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}