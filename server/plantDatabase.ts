/**
 * Base de données de plantes d'intérieur disponibles pour l'ajout manuel
 */

interface PlantEntry {
  name: string;
  species: string;
  wateringFrequency: number;
  light: string;
  temperature: string;
  careNotes: string;
}

export const plantDatabase: PlantEntry[] = [
  {
    name: "Vase d'argent",
    species: "Aechmea fasciata",
    wateringFrequency: 7,
    light: "Indirecte brillante",
    temperature: "18-24°C",
    careNotes: "Versez l'eau au centre du rosette. Tolère l'oubli d'arrosage. Préfère une lumière vive sans soleil direct.",
  },
  {
    name: "Capillaire",
    species: "Adiantum raddianum",
    wateringFrequency: 3,
    light: "Indirecte",
    temperature: "18-24°C",
    careNotes: "Maintenez le substrat constamment humide. Placez dans un endroit lumineux sans soleil direct. Vaporisez régulièrement pour maintenir une bonne humidité.",
  },
  {
    name: "Aglaonéma",
    species: "Aglaonema commutatum",
    wateringFrequency: 7,
    light: "Faible à modérée",
    temperature: "18-27°C",
    careNotes: "Arrosez quand le dessus du terreau est sec. Tolère la faible luminosité. Idéale pour les espaces avec peu de lumière naturelle.",
  },
  {
    name: "Oreille d'éléphant",
    species: "Alocasia amazonica",
    wateringFrequency: 5,
    light: "Indirecte brillante",
    temperature: "18-30°C",
    careNotes: "Maintenez le substrat légèrement humide. Placez dans un endroit lumineux sans soleil direct. Apprécie l'humidité ambiante élevée.",
  },
  {
    name: "Anthurium",
    species: "Anthurium andraeanum",
    wateringFrequency: 7,
    light: "Indirecte brillante",
    temperature: "18-27°C",
    careNotes: "Laissez sécher légèrement entre les arrosages. Apprécie une lumière vive sans soleil direct. Vaporisez le feuillage régulièrement.",
  },
  {
    name: "Pin de Norfolk",
    species: "Araucaria heterophylla",
    wateringFrequency: 7,
    light: "Indirecte brillante",
    temperature: "13-24°C",
    careNotes: "Arrosez modérément, laissez sécher entre les arrosages. Évitez le soleil direct qui peut brûler les branches. Préfère les températures fraîches.",
  },
  {
    name: "Plante de fer",
    species: "Aspidistra elatior",
    wateringFrequency: 10,
    light: "Faible à modérée",
    temperature: "10-24°C",
    careNotes: "Extrêmement résistante, supporte la négligence. Tolère très bien l'ombre. Arrosez sobrement, laissez sécher entre les arrosages.",
  },
  {
    name: "Fougère nid d'oiseau",
    species: "Asplenium nidus",
    wateringFrequency: 5,
    light: "Indirecte",
    temperature: "18-27°C",
    careNotes: "Maintenez le substrat constamment humide. Apprécie l'humidité ambiante. Ne laissez jamais sécher complètement.",
  },
  {
    name: "Pied d'éléphant",
    species: "Beaucarnea recurvata",
    wateringFrequency: 14,
    light: "Directe",
    temperature: "15-30°C",
    careNotes: "Extrêmement résistante à la sécheresse. Arrosez peu et laissez sécher entre les arrosages. Tolère le soleil direct.",
  },
  {
    name: "Bégonia royal",
    species: "Begonia rex",
    wateringFrequency: 7,
    light: "Indirecte",
    temperature: "18-24°C",
    careNotes: "Arrosez quand la surface du terreau est sèche. Évitez de mouiller les feuilles. Apprécie l'humidité ambiante sans arrosage direct.",
  },
  {
    name: "Caladium",
    species: "Caladium bicolor",
    wateringFrequency: 3,
    light: "Indirecte",
    temperature: "18-30°C",
    careNotes: "Maintenez le substrat humide. Apprécie la chaleur et l'humidité. Évitez les courants d'air froid.",
  },
  {
    name: "Plante paon",
    species: "Calathea makoyana",
    wateringFrequency: 5,
    light: "Indirecte faible",
    temperature: "18-24°C",
    careNotes: "Maintenez le substrat légèrement humide. Sensible au chlore, utilisez de l'eau filtrée. Apprécie l'humidité ambiante élevée.",
  },
  {
    name: "Palmier nain",
    species: "Chamaedorea elegans",
    wateringFrequency: 7,
    light: "Indirecte",
    temperature: "18-24°C",
    careNotes: "Arrosez quand le dessus du terreau est sec. Tolère l'ombre. Vaporisez régulièrement pour prévenir les araignées rouges.",
  },
  {
    name: "Plante araignée",
    species: "Chlorophytum comosum",
    wateringFrequency: 7,
    light: "Indirecte à directe",
    temperature: "13-27°C",
    careNotes: "Arrosez quand le terreau est sec. Très résistante et facile à entretenir. Produit des plantules faciles à propager.",
  },
  {
    name: "Vigne d'intérieur",
    species: "Cissus rhombifolia",
    wateringFrequency: 7,
    light: "Indirecte brillante",
    temperature: "15-27°C",
    careNotes: "Arrosez quand la surface du terreau est sèche. Offrez un support pour grimper. Apprécie l'humidité ambiante.",
  },
  {
    name: "Clivia",
    species: "Clivia miniata",
    wateringFrequency: 10,
    light: "Indirecte",
    temperature: "15-24°C",
    careNotes: "Laissez sécher entre les arrosages. Période de repos en hiver nécessaire pour la floraison. Réduisez l'arrosage en hiver.",
  },
  {
    name: "Croton",
    species: "Codiaeum variegatum",
    wateringFrequency: 5,
    light: "Directe",
    temperature: "18-30°C",
    careNotes: "Maintenez le substrat légèrement humide. Les couleurs sont plus vives avec plus de lumière. Vaporisez régulièrement.",
  },
  {
    name: "Plante de jade",
    species: "Crassula ovata",
    wateringFrequency: 14,
    light: "Directe",
    temperature: "15-24°C",
    careNotes: "Arrosez rarement, laissez sécher complètement entre les arrosages. Placez en plein soleil. Très facile à entretenir.",
  },
  {
    name: "Cyclamen",
    species: "Cyclamen persicum",
    wateringFrequency: 5,
    light: "Indirecte brillante",
    temperature: "10-18°C",
    careNotes: "Arrosez par le bas pour éviter de mouiller le collet. Préfère les températures fraîches. Entre en dormance l'été.",
  },
  {
    name: "Dieffenbachia",
    species: "Dieffenbachia seguine",
    wateringFrequency: 7,
    light: "Indirecte",
    temperature: "18-27°C",
    careNotes: "Arrosez quand la surface du terreau est sèche. Attention, toutes les parties sont toxiques si ingérées. Tolère l'ombre.",
  },
  {
    name: "Dragonnier",
    species: "Dracaena fragrans",
    wateringFrequency: 10,
    light: "Indirecte",
    temperature: "18-24°C",
    careNotes: "Laissez sécher entre les arrosages. Tolère une large gamme de conditions. Sensible au fluor, utilisez de l'eau filtrée.",
  },
  {
    name: "Pothos",
    species: "Epipremnum aureum",
    wateringFrequency: 7,
    light: "Faible à brillante",
    temperature: "15-30°C",
    careNotes: "Arrosez quand le terreau est sec. Extrêmement adaptable et facile à cultiver. Peut être taillé pour encourager la ramification.",
  },
  {
    name: "Figuier pleureur",
    species: "Ficus benjamina",
    wateringFrequency: 7,
    light: "Indirecte brillante",
    temperature: "18-24°C",
    careNotes: "Arrosez quand la surface du terreau est sèche. N'aime pas être déplacé. Sensible aux courants d'air.",
  },
  {
    name: "Caoutchouc",
    species: "Ficus elastica",
    wateringFrequency: 10,
    light: "Indirecte brillante",
    temperature: "18-30°C",
    careNotes: "Laissez sécher entre les arrosages. Essuyez les feuilles régulièrement pour enlever la poussière. Peut atteindre plusieurs mètres.",
  },
  {
    name: "Plante mosaïque",
    species: "Fittonia albivenis",
    wateringFrequency: 3,
    light: "Indirecte faible",
    temperature: "18-27°C",
    careNotes: "Maintenez le substrat constamment humide. Apprécie l'humidité ambiante élevée. Parfaite pour terrariums.",
  },
  {
    name: "Lierre",
    species: "Hedera helix",
    wateringFrequency: 7,
    light: "Indirecte",
    temperature: "10-21°C",
    careNotes: "Arrosez modérément, laissez sécher entre les arrosages. Préfère les températures fraîches. Vaporisez régulièrement.",
  },
  {
    name: "Fleur de porcelaine",
    species: "Hoya carnosa",
    wateringFrequency: 10,
    light: "Indirecte brillante",
    temperature: "18-24°C",
    careNotes: "Laissez sécher entre les arrosages. Ne coupez pas les tiges florales après la floraison. Apprécie d'être à l'étroit dans son pot.",
  },
  {
    name: "Kalanchoé",
    species: "Kalanchoe blossfeldiana",
    wateringFrequency: 10,
    light: "Directe",
    temperature: "15-24°C",
    careNotes: "Arrosez uniquement quand le substrat est sec. Supporte bien la sécheresse. Nécessite des jours courts pour fleurir.",
  },
  {
    name: "Plante qui prie",
    species: "Maranta leuconeura",
    wateringFrequency: 5,
    light: "Indirecte faible",
    temperature: "18-24°C",
    careNotes: "Maintenez le substrat légèrement humide. Sensible au chlore, utilisez de l'eau filtrée. Feuilles qui se replient la nuit.",
  },
  {
    name: "Plante à trous",
    species: "Monstera deliciosa",
    wateringFrequency: 7,
    light: "Indirecte brillante",
    temperature: "18-30°C",
    careNotes: "Arrosez quand le terreau commence à sécher. Apprécie un tuteur pour grimper. Les feuilles développent des trous avec l'âge.",
  },
  {
    name: "Fougère de Boston",
    species: "Nephrolepis exaltata",
    wateringFrequency: 3,
    light: "Indirecte",
    temperature: "18-24°C",
    careNotes: "Maintenez le substrat constamment humide. Vaporisez régulièrement. Ne laissez jamais sécher complètement.",
  },
  {
    name: "Peperomia",
    species: "Peperomia obtusifolia",
    wateringFrequency: 7,
    light: "Indirecte",
    temperature: "18-24°C",
    careNotes: "Arrosez quand la surface du terreau est sèche. Feuilles succulentes qui stockent l'eau. Idéal pour petits espaces.",
  },
  {
    name: "Philodendron",
    species: "Philodendron scandens",
    wateringFrequency: 7,
    light: "Indirecte",
    temperature: "18-27°C",
    careNotes: "Arrosez quand la surface du terreau est sèche. Très facile à cultiver. Peut grimper ou retomber selon vos préférences.",
  },
  {
    name: "Plante à monnaie chinoise",
    species: "Pilea peperomioides",
    wateringFrequency: 7,
    light: "Indirecte brillante",
    temperature: "15-24°C",
    careNotes: "Arrosez quand le terreau commence à sécher. Tournez régulièrement pour une croissance uniforme. Produit facilement des rejets.",
  },
  {
    name: "Langue de belle-mère",
    species: "Sansevieria trifasciata",
    wateringFrequency: 14,
    light: "Faible à directe",
    temperature: "15-30°C",
    careNotes: "Arrosez très peu, laissez sécher complètement entre les arrosages. Extrêmement résistante, presque indestructible. Purifie l'air.",
  },
  {
    name: "Fleur de lune",
    species: "Spathiphyllum wallisii",
    wateringFrequency: 7,
    light: "Indirecte faible",
    temperature: "18-27°C",
    careNotes: "Maintenez le substrat légèrement humide. S'affaisse quand elle a besoin d'eau. Fleurit même avec peu de lumière.",
  },
  {
    name: "Oiseau de paradis",
    species: "Strelitzia reginae",
    wateringFrequency: 7,
    light: "Directe",
    temperature: "18-30°C",
    careNotes: "Arrosez quand la surface du terreau est sèche. Nécessite beaucoup de lumière pour fleurir. Plante imposante et spectaculaire.",
  },
  {
    name: "Syngonium",
    species: "Syngonium podophyllum",
    wateringFrequency: 7,
    light: "Indirecte",
    temperature: "18-27°C",
    careNotes: "Arrosez quand la surface du terreau est sèche. Les feuilles changent de forme avec l'âge. Peut grimper avec un support.",
  },
  {
    name: "Misère",
    species: "Tradescantia zebrina",
    wateringFrequency: 5,
    light: "Indirecte brillante",
    temperature: "15-27°C",
    careNotes: "Maintenez le substrat légèrement humide. Croissance rapide et facile à propager. Couleurs plus vives avec plus de lumière.",
  },
  {
    name: "Yucca",
    species: "Yucca elephantipes",
    wateringFrequency: 14,
    light: "Directe",
    temperature: "15-30°C",
    careNotes: "Arrosez très peu, laissez sécher complètement entre les arrosages. Très résistant à la sécheresse. Préfère le plein soleil.",
  },
  {
    name: "Plante ZZ",
    species: "Zamioculcas zamiifolia",
    wateringFrequency: 14,
    light: "Faible à brillante",
    temperature: "15-30°C",
    careNotes: "Arrosez très peu, laissez sécher complètement entre les arrosages. Extrêmement résistante à la négligence. Tolère très bien l'ombre.",
  },
];

export function searchPlants(query: string): PlantEntry[] {
  const normalizedQuery = query.toLowerCase().trim();
  if (!normalizedQuery) return [];
  
  return plantDatabase.filter(plant => 
    plant.name.toLowerCase().includes(normalizedQuery) ||
    plant.species.toLowerCase().includes(normalizedQuery)
  );
}

export function getPlantByName(name: string): PlantEntry | undefined {
  const normalizedName = name.toLowerCase().trim();
  return plantDatabase.find(plant => 
    plant.name.toLowerCase() === normalizedName ||
    plant.species.toLowerCase() === normalizedName
  );
}