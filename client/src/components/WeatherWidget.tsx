import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface WeatherData {
  temperature: number;
  humidity: number;
  description: string;
  icon: string;
  recommendations: string[];
  location: string;
  forecast?: {
    temperature: number;
    humidity: number;
    description: string;
    icon: string;
  };
}

// Données météo simulées pour le mode hors ligne ou quand l'API n'est pas disponible
const mockWeatherData: WeatherData = {
  temperature: 22,
  humidity: 65,
  description: "Partiellement nuageux",
  icon: "partly_cloudy",
  location: "Paris, France",
  recommendations: [
    "Température idéale pour la plupart des plantes d'intérieur",
    "Humidité adéquate, vos plantes devraient être confortables",
    "Aucune action spécifique nécessaire aujourd'hui"
  ],
  forecast: {
    temperature: 24,
    humidity: 60,
    description: "Ensoleillé",
    icon: "clear_day"
  }
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

  // État pour la géolocalisation persistante
  useEffect(() => {
    // Vérifier si nous avons déjà des coordonnées en localStorage
    const savedLocation = localStorage.getItem('userLocation');
    const ONE_WEEK_MS = 7 * 24 * 60 * 60 * 1000; // Une semaine en millisecondes
    
    const fetchWeatherData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Récupération de la position géographique de l'utilisateur avec durée de cache plus longue
        const getLocation = () => {
          return new Promise<GeolocationPosition>((resolve, reject) => {
            if (!navigator.geolocation) {
              reject(new Error("La géolocalisation n'est pas prise en charge par votre navigateur"));
              return;
            }
            
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              enableHighAccuracy: false, // Précision standard pour économiser la batterie
              timeout: 10000, // 10 secondes de timeout
              maximumAge: ONE_WEEK_MS // Utiliser les données pendant une semaine
            });
          });
        };
        
        // Localisation par défaut
        let location = "Paris, France";
        
        // Utiliser les données sauvegardées si disponibles et pas trop anciennes
        if (savedLocation) {
          try {
            const parsedLocation = JSON.parse(savedLocation);
            const savedTime = parsedLocation.timestamp || 0;
            const isExpired = Date.now() - savedTime > ONE_WEEK_MS;
            
            if (!isExpired) {
              // Utiliser la localisation en cache
              location = parsedLocation.name;
              console.log("Utilisation de la localisation en cache:", location);
            } else {
              // Les données sont trop anciennes, on essaie d'obtenir de nouvelles données
              throw new Error("Les données de localisation sont expirées");
            }
          } catch (e) {
            console.log("Mise à jour des données de localisation...");
            
            // Fonction pour déterminer la ville approximative basée sur les coordonnées
            const getNearestCity = (lat: number, lon: number): string => {
              // Coordonnées approximatives de quelques villes françaises
              const cities = [
                { name: "Paris", lat: 48.86, lon: 2.35 },
                { name: "Lyon", lat: 45.75, lon: 4.85 },
                { name: "Marseille", lat: 43.30, lon: 5.37 },
                { name: "Lille", lat: 50.63, lon: 3.07 },
                { name: "Bordeaux", lat: 44.84, lon: -0.58 },
                { name: "Toulouse", lat: 43.60, lon: 1.44 },
                { name: "Strasbourg", lat: 48.58, lon: 7.75 },
                { name: "Nice", lat: 43.70, lon: 7.27 },
                { name: "Nantes", lat: 47.22, lon: -1.55 },
                { name: "Rennes", lat: 48.11, lon: -1.68 },
                { name: "Montpellier", lat: 43.61, lon: 3.87 },
                { name: "Grenoble", lat: 45.19, lon: 5.72 },
                { name: "Dijon", lat: 47.32, lon: 5.04 },
              ];
              
              // Calculer la distance par rapport à chaque ville
              const cityWithDistance = cities.map(city => {
                const latDiff = city.lat - lat;
                const lonDiff = city.lon - lon;
                const distance = Math.sqrt(latDiff * latDiff + lonDiff * lonDiff);
                return { ...city, distance };
              });
              
              // Trouver la ville la plus proche
              const nearestCity = cityWithDistance.reduce((prev, curr) => 
                prev.distance < curr.distance ? prev : curr
              );
              
              return `${nearestCity.name}, France`;
            };
            
            try {
              // Essayer d'obtenir la position actuelle
              const position = await getLocation();
              const coords = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
              };
              
              location = getNearestCity(coords.latitude, coords.longitude);
              
              // Sauvegarder la localisation avec une durée de vie plus longue
              localStorage.setItem('userLocation', JSON.stringify({
                coords,
                name: location,
                timestamp: Date.now()
              }));
              
              console.log("Localisation mise à jour:", location);
            } catch (locError) {
              console.log("Impossible d'obtenir la position, utilisation de Paris par défaut");
              // On continue avec la localisation par défaut
            }
          }
        } else {
          // Aucune donnée en cache, utilisation d'une ville par défaut pour éviter trop de demandes d'autorisation
          console.log("Première utilisation, localisation par défaut");
          
          // Sauvegarder la localisation par défaut pour éviter de demander systématiquement
          localStorage.setItem('userLocation', JSON.stringify({
            coords: { latitude: 48.86, longitude: 2.35 },
            name: location,
            timestamp: Date.now()
          }));
        }
        
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
        
        // Calcul température et humidité pour aujourd'hui
        const temperature = Math.floor(baseTemp + (Math.random() * tempVariation));
        const humidity = Math.floor(Math.random() * 30) + 50;    // 50-80%
        
        // Détermination de l'icône et la description pour aujourd'hui
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
        
        // Calcul des prévisions pour demain (légèrement différent d'aujourd'hui)
        // Variation de température de +/- 3 degrés par rapport à aujourd'hui
        const temperatureVariation = Math.floor(Math.random() * 7) - 3; // -3 à +3 degrés
        const forecastTemperature = temperature + temperatureVariation;
        
        // Variation d'humidité de +/- 10%
        const humidityVariation = Math.floor(Math.random() * 21) - 10; // -10% à +10%
        const forecastHumidity = Math.max(40, Math.min(90, humidity + humidityVariation));
        
        // Description et icône pour demain
        let forecastIcon = icon;
        let forecastDescription = description;
        
        // 30% de chances que le temps change
        if (Math.random() < 0.3) {
          // Changement de temps
          const weatherTypes = [
            { icon: "clear_day", description: "Ensoleillé" },
            { icon: "partly_cloudy", description: "Partiellement nuageux" },
            { icon: "cloudy", description: "Nuageux" },
            { icon: "rainy", description: "Pluvieux" }
          ];
          
          // Choisir un nouveau type de temps différent de l'actuel
          const availableTypes = weatherTypes.filter(type => type.icon !== icon);
          const newWeather = availableTypes[Math.floor(Math.random() * availableTypes.length)];
          
          forecastIcon = newWeather.icon;
          forecastDescription = newWeather.description;
        }
        
        // Court délai pour simuler une requête API et améliorer l'expérience utilisateur
        setTimeout(() => {
          setWeatherData({
            temperature,
            humidity,
            icon,
            description,
            location,
            recommendations: [],
            forecast: {
              temperature: forecastTemperature,
              humidity: forecastHumidity,
              icon: forecastIcon,
              description: forecastDescription
            }
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
            
            <div className="text-center text-gray-600 mb-1 font-medium">{weatherData.description}</div>
            
            <div className="flex items-center justify-center mb-4">
              <div className="bg-blue-50 px-3 py-1 rounded-full flex items-center">
                <span className="material-icons text-blue-500 text-sm mr-1">location_on</span>
                <span className="text-sm text-blue-600 font-medium">{weatherData.location}</span>
              </div>
            </div>
            
            {/* Prévisions pour demain */}
            {weatherData.forecast && (
              <div className="mt-4 mb-4 border-t border-b border-blue-100 py-4">
                <h4 className="font-medium mb-3 text-blue-700 flex items-center justify-center">
                  <span className="material-icons mr-2 text-sm">calendar_today</span>
                  Prévisions pour demain
                </h4>
                <div className="flex items-center justify-center gap-6">
                  <div className="flex flex-col items-center">
                    <span className="material-icons text-3xl text-blue-400">
                      {getWeatherIcon(weatherData.forecast.icon)}
                    </span>
                    <span className="text-sm text-gray-600 mt-1">{weatherData.forecast.description}</span>
                  </div>
                  <div className="flex gap-4">
                    <div className="text-center">
                      <div className="text-xs text-gray-500">Temp.</div>
                      <div className="text-lg font-medium">{weatherData.forecast.temperature}°C</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs text-gray-500">Hum.</div>
                      <div className="text-lg font-medium">{weatherData.forecast.humidity}%</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-3 bg-blue-50/50 p-4 rounded-lg">
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