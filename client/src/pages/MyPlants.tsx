import { Link } from "wouter";
import usePlants from "@/hooks/usePlants";
import { Plant } from "@shared/schema";

export default function MyPlants() {
  const { data: plants, isLoading } = usePlants();

  function getPlantStatusIcon(status: string) {
    switch (status) {
      case "healthy":
        return <span className="material-icons text-sm text-green-500">favorite</span>;
      case "warning":
        return <span className="material-icons text-sm text-yellow-500">warning</span>;
      case "danger":
        return <span className="material-icons text-sm text-alert">warning</span>;
      default:
        return <span className="material-icons text-sm text-gray-500">help_outline</span>;
    }
  }

  function getPlantStatusText(status: string) {
    switch (status) {
      case "healthy":
        return "Bonne santé";
      case "warning":
        return "Attention requise";
      case "danger":
        return "Besoin d'aide";
      default:
        return "État inconnu";
    }
  }

  function getPlantStatusColor(status: string) {
    switch (status) {
      case "healthy":
        return "bg-green-500";
      case "warning":
        return "bg-yellow-500";
      case "danger":
        return "bg-alert";
      default:
        return "bg-gray-500";
    }
  }

  return (
    <div>
      <div className="mb-6">
        <button 
          className="flex items-center text-primary mb-4"
          onClick={() => history.back()}
        >
          <span className="material-icons mr-1">arrow_back</span>
          Retour
        </button>
        <h2 className="text-xl font-raleway font-semibold">Mes plantes</h2>
        <p className="text-gray-600">Gérez votre collection de plantes</p>
      </div>

      <div className="mb-4">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
            <span className="material-icons">search</span>
          </span>
          <input
            type="text"
            placeholder="Rechercher une plante..."
            className="w-full pl-10 py-2 border rounded-lg"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <p>Chargement des plantes...</p>
        </div>
      ) : plants && plants.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {plants.map((plant: Plant) => (
            <Link key={plant.id} href={`/plants/${plant.id}`}>
              <a className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-32 bg-gray-200 relative">
                  {plant.image ? (
                    <img 
                      src={plant.image} 
                      alt={plant.name} 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary/10">
                      <span className="material-icons text-primary text-4xl">eco</span>
                    </div>
                  )}
                  <div className="absolute bottom-2 right-2 bg-white rounded-full p-1 shadow">
                    {getPlantStatusIcon(plant.status)}
                  </div>
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-sm mb-1">{plant.name}</h3>
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full ${getPlantStatusColor(plant.status)} mr-2`}></div>
                    <span className="text-xs text-gray-500">{getPlantStatusText(plant.status)}</span>
                  </div>
                </div>
              </a>
            </Link>
          ))}
          
          <Link href="/analyze">
            <a className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border-2 border-dashed border-gray-300 flex flex-col items-center justify-center h-[120px]">
              <span className="material-icons text-primary text-3xl mb-2">add</span>
              <span className="text-sm font-medium text-gray-700">Ajouter une plante</span>
            </a>
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg p-8 text-center">
          <div className="mb-4">
            <span className="material-icons text-gray-400 text-5xl">eco</span>
          </div>
          <h3 className="text-lg font-medium mb-2">Aucune plante</h3>
          <p className="text-gray-500 mb-4">Commencez à ajouter des plantes à votre collection pour les suivre</p>
          <Link href="/analyze">
            <a className="bg-primary text-white px-4 py-2 rounded-lg inline-flex items-center">
              <span className="material-icons mr-2">add</span>
              Ajouter une plante
            </a>
          </Link>
        </div>
      )}
    </div>
  );
}
