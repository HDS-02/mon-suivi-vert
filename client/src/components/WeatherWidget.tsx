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
        
        // Simulation de données météo pour une expérience utilisateur fiable
        // Dans une version de production, une API météo serait utilisée
        
        // Date actuelle
        const now = new Date();
        const month = now.getMonth(); // 0-11
        
        // Températures ajustées selon la saison
        let baseTemp;
        let tempVariation;
        
        // Estimation saisonnière
        if (month >= 11 || month <= 1) {         // Hiver (Dec-Fév)
          baseTemp = 5;
          tempVariation = 7;
        } else if (month >= 2 && month <= 4) {   // Printemps (Mar-Mai)
          baseTemp = 15;
          tempVariation = 8;
        } else if (month >= 5 && month <= 8) {   // Été (Juin-Sep)
          baseTemp = 23;
          tempVariation = 7;
        } else {                                 // Automne (Oct-Nov)
          baseTemp = 12;
          tempVariation = 6;
        }
        
        // Calcul température et humidité
        const temperature = Math.floor(baseTemp + (Math.random() * tempVariation));
        const humidity = Math.floor(Math.random() * 30) + 50;    // 50-80%
        
        // Détermination de l'icône et la description
        let icon = "partly_cloudy";
        let description = "Partiellement nuageux";
        
        if (temperature > 25) {
          icon = "clear_day";
          description = "Ensoleillé";
        } else if (temperature < 10) {
          if (Math.random() > 0.5) {
            icon = "cloudy";
            description = "Nuageux";
          } else {
            icon = "rainy";
            description = "Pluvieux";
          }
        }
        
        // Court délai pour simuler une requête API et améliorer l'expérience utilisateur
        setTimeout(() => {
          setWeatherData({
            temperature,
            humidity,
            icon,
            description,
            recommendations: []
          });
          setLoading(false);
        }, 1000);
        
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
      <Card className="bg-white/80 backdrop-blur-sm border-gray-100 rounded-xl shadow-md">
        <CardContent className="pt-6">
          <div className="text-center text-destructive">
            <div className="bg-red-50 rounded-full inline-block p-3">
              <span className="material-icons text-3xl text-red-500">error_outline</span>
            </div>
            <p className="mt-2">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-gray-100 rounded-xl shadow-md overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500/90 to-blue-400/90 text-white p-4">
        <h3 className="text-lg font-semibold flex items-center">
          <span className="material-icons mr-2">wb_sunny</span>
          Météo et conseils d'entretien
        </h3>
      </div>
      <CardContent className="pt-6">
        {loading ? (
          <div className="space-y-4 py-4">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-blue-100 animate-pulse flex items-center justify-center">
                <span className="material-icons text-blue-300 text-2xl">wb_cloudy</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-center">
                <Skeleton className="h-5 w-[80px] bg-blue-50" />
              </div>
              <div className="flex justify-center">
                <Skeleton className="h-4 w-[120px] bg-blue-50" />
              </div>
            </div>
            <div className="pt-4 space-y-2">
              <Skeleton className="h-4 w-full bg-gray-50" />
              <Skeleton className="h-4 w-5/6 bg-gray-50" />
              <Skeleton className="h-4 w-4/5 bg-gray-50" />
            </div>
          </div>
        ) : weatherData ? (
          <div>
            <div className="flex items-center justify-center mb-6">
              <div className="bg-gradient-to-br from-blue-500/10 to-blue-400/10 p-4 rounded-full shadow-inner">
                <span className="material-icons text-5xl text-blue-500">
                  {getWeatherIcon(weatherData.icon)}
                </span>
              </div>
            </div>
            
            <div className="flex justify-between mb-4">
              <div className="text-center">
                <div className="text-gray-500 text-sm mb-1">Température</div>
                <div className="text-2xl font-medium">{weatherData.temperature}°C</div>
              </div>
              <div className="text-center">
                <div className="text-gray-500 text-sm mb-1">Humidité</div>
                <div className="text-2xl font-medium">{weatherData.humidity}%</div>
              </div>
            </div>
            
            <div className="text-center text-gray-600 mb-4 font-medium">{weatherData.description}</div>
            
            <div className="mt-6 bg-blue-50/50 p-4 rounded-lg">
              <h4 className="font-medium mb-3 text-blue-700 flex items-center">
                <span className="material-icons mr-2 text-sm">tips_and_updates</span>
                Conseils d'entretien
              </h4>
              <ul className="space-y-2">
                {weatherData.recommendations.map((recommendation, index) => (
                  <li key={index} className="flex items-start">
                    <span className="material-icons text-green-500 mr-2 text-sm">eco</span>
                    <span className="text-sm text-gray-700">{recommendation}</span>
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