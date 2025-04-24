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
    <div className="organic-bg min-h-screen pb-24">
      <div className="gradient-header bg-gradient-to-br from-primary/90 to-primary-light/90 text-white px-4 pt-6 pb-8 mb-6 shadow-md">
        <button 
          onClick={() => window.history.back()}
          className="flex items-center text-white/90 mb-4 hover:text-white transition-colors"
        >
          <span className="material-icons mr-1">arrow_back</span>
          Retour
        </button>
        <h2 className="text-2xl font-raleway font-semibold">Mes plantes</h2>
        <p className="text-white/80 mt-1">Gérez votre collection de plantes</p>
      </div>

      <div className="mb-6 px-4">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-primary">
            <span className="material-icons">search</span>
          </span>
          <input
            type="text"
            placeholder="Rechercher une plante..."
            className="w-full pl-10 py-3 rounded-lg glass-card backdrop-blur-sm shadow-sm border border-gray-100/50 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center p-12">
          <div className="glass-card backdrop-blur-sm p-8 rounded-xl shadow-lg border border-gray-100/80 text-center">
            <div className="animate-pulse flex flex-col items-center">
              <div className="rounded-full bg-primary/20 h-14 w-14 flex items-center justify-center mb-4">
                <span className="material-icons text-primary/40 text-3xl">eco</span>
              </div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2.5"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      ) : plants && plants.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4">
          {plants.map((plant: Plant) => (
            <Link 
              key={plant.id}
              href={`/plants/${plant.id}`}
              className="glass-card backdrop-blur-sm rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer transform hover:scale-[1.02] duration-200 border border-gray-100/50"
            >
                <div className="h-36 bg-gray-100/50 relative">
                  {plant.image ? (
                    <img 
                      src={plant.image} 
                      alt={plant.name} 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary-light/5">
                      <span className="material-icons text-primary text-4xl">eco</span>
                    </div>
                  )}
                  <div className="absolute bottom-2 right-2 glass-card backdrop-blur-sm rounded-full p-1.5 shadow-sm">
                    {getPlantStatusIcon(plant.status)}
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-primary-dark mb-1">{plant.name}</h3>
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full ${getPlantStatusColor(plant.status)} mr-2`}></div>
                    <span className="text-xs text-gray-600">{getPlantStatusText(plant.status)}</span>
                  </div>
                </div>
            </Link>
          ))}
          
          <Link
            href="/add-plant"
            className="glass-card backdrop-blur-sm rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border-2 border-dashed border-primary/30 flex flex-col items-center justify-center h-[180px] cursor-pointer bg-primary/5 transform hover:scale-[1.02] hover:bg-primary/10 duration-200"
          >
            <div className="bg-gradient-to-br from-primary to-primary-light text-white rounded-full p-3 shadow-md mb-3">
              <span className="material-icons text-2xl">add</span>
            </div>
            <span className="text-sm font-medium text-primary-dark">Ajouter une plante</span>
          </Link>
        </div>
      ) : (
        <div className="glass-card backdrop-blur-sm mx-4 p-8 text-center rounded-xl shadow-lg border border-gray-100/80">
          <div className="mb-4 bg-gradient-to-br from-primary/10 to-primary-light/10 rounded-full p-4 inline-block">
            <span className="material-icons text-primary text-4xl">eco</span>
          </div>
          <h3 className="text-xl font-raleway font-medium mb-2 text-primary-dark">Aucune plante</h3>
          <p className="text-gray-600 mb-6">Ajoutez votre première plante pour commencer à suivre sa santé</p>
          <Link
            href="/add-plant"
            className="bg-gradient-to-r from-primary to-primary-light text-white px-6 py-3 rounded-full inline-flex items-center shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200"
          >
            <span className="material-icons mr-2">add_circle</span>
            Ajouter une plante
          </Link>
        </div>
      )}
    </div>
  );
}
