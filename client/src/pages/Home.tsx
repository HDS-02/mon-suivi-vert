import { Link } from "wouter";
import usePlants from "@/hooks/usePlants";
import useTasks from "@/hooks/useTasks";
import { Plant, Task } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import WeatherWidget from "@/components/WeatherWidget";

export default function Home() {
  const { data: plants, isLoading: plantsLoading } = usePlants();
  const { data: tasks, isLoading: tasksLoading } = useTasks();
  const { toast } = useToast();
  const { user } = useAuth();

  const completeTask = async (taskId: number) => {
    try {
      await fetch(`/api/tasks/${taskId}/complete`, {
        method: "PATCH",
        credentials: "include",
      });
      
      toast({
        title: "Tâche complétée",
        description: "La tâche a été marquée comme terminée.",
      });
      
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      queryClient.invalidateQueries({ queryKey: ["/api/tasks/pending"] });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de compléter la tâche",
        variant: "destructive",
      });
    }
  };

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

  function getTaskIcon(type: string) {
    switch (type) {
      case "water":
        return <span className="material-icons text-primary">opacity</span>;
      case "light":
        return <span className="material-icons text-info">wb_sunny</span>;
      case "fertilize":
        return <span className="material-icons text-green-500">spa</span>;
      case "repot":
        return <span className="material-icons text-amber-700">yard</span>;
      default:
        return <span className="material-icons text-gray-500">eco</span>;
    }
  }

  function getTaskTypeBackground(type: string) {
    switch (type) {
      case "water":
        return "bg-primary-light/10";
      case "light":
        return "bg-info/10";
      case "fertilize":
        return "bg-green-500/10";
      case "repot":
        return "bg-amber-700/10";
      default:
        return "bg-gray-100";
    }
  }

  return (
    <div>
      {/* WELCOME SECTION */}
      <section className="mb-8">
        <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
          <div className="mr-4">
            <span className="material-icons text-primary text-4xl">eco</span>
          </div>
          <div>
            <h2 className="text-xl font-raleway font-semibold mb-1">
              Bonjour {user?.firstName || "Jardinier"} !
            </h2>
            <p className="text-gray-600">
              Votre collection contient{" "}
              <span className="font-semibold text-primary">
                {!plantsLoading ? plants?.length || 0 : "..."} plantes
              </span>{" "}
              {!tasksLoading && tasks && tasks.filter(t => !t.completed).length > 0 && (
                <>dont <span className="font-semibold text-primary">{tasks.filter(t => !t.completed).length}</span> à entretenir aujourd'hui</>
              )}
              .
            </p>
          </div>
        </div>
      </section>

      {/* QUICK ACTIONS AND WEATHER */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-2">
          <h2 className="text-lg font-raleway font-semibold mb-4">Actions rapides</h2>
          <div className="grid grid-cols-2 gap-4">
            <Link href="/analyze">
              <Button variant="ghost" className="bg-white rounded-lg shadow-sm p-4 h-auto hover:shadow-md transition-shadow flex flex-col items-center w-full">
                <span className="material-icons text-primary mb-2">add_a_photo</span>
                <span className="text-sm font-medium">Analyser une plante</span>
              </Button>
            </Link>
            <Link href="/plants">
              <Button variant="ghost" className="bg-white rounded-lg shadow-sm p-4 h-auto hover:shadow-md transition-shadow flex flex-col items-center w-full">
                <span className="material-icons text-primary mb-2">format_list_bulleted</span>
                <span className="text-sm font-medium">Mes plantes</span>
              </Button>
            </Link>
            <Link href="/calendar">
              <Button variant="ghost" className="bg-white rounded-lg shadow-sm p-4 h-auto hover:shadow-md transition-shadow flex flex-col items-center w-full">
                <span className="material-icons text-primary mb-2">calendar_today</span>
                <span className="text-sm font-medium">Calendrier</span>
              </Button>
            </Link>
            <Link href="/tips">
              <Button variant="ghost" className="bg-white rounded-lg shadow-sm p-4 h-auto hover:shadow-md transition-shadow flex flex-col items-center w-full">
                <span className="material-icons text-primary mb-2">tips_and_updates</span>
                <span className="text-sm font-medium">Conseils</span>
              </Button>
            </Link>
          </div>
        </div>
        <div>
          <WeatherWidget />
        </div>
      </div>

      {/* TODAY'S TASKS */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-raleway font-semibold">Tâches du jour</h2>
          <Link href="/calendar">
            <a className="text-primary text-sm font-medium flex items-center">
              Voir tout
              <span className="material-icons text-sm ml-1">chevron_right</span>
            </a>
          </Link>
        </div>
        <Card className="bg-white rounded-lg shadow-md divide-y divide-gray-100">
          {tasksLoading ? (
            <div className="p-6 text-center">Chargement des tâches...</div>
          ) : tasks && tasks.filter(t => !t.completed).length > 0 ? (
            tasks
              .filter((task: Task) => !task.completed)
              .map((task: Task) => (
                <div key={task.id} className="p-4 flex items-center">
                  <div className={`w-10 h-10 ${getTaskTypeBackground(task.type)} rounded-full flex items-center justify-center mr-4`}>
                    {getTaskIcon(task.type)}
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-medium">{task.description}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(task.dueDate || Date.now()).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                  <button 
                    className="ml-2 p-2 rounded-full hover:bg-gray-100"
                    onClick={() => completeTask(task.id)}
                  >
                    <span className="material-icons text-gray-400">check_circle_outline</span>
                  </button>
                </div>
              ))
          ) : (
            <div className="p-6 text-center text-gray-500">
              Aucune tâche pour aujourd'hui
            </div>
          )}
        </Card>
      </section>

      {/* MY PLANTS */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-raleway font-semibold">Mes plantes</h2>
          <Link href="/plants">
            <a className="text-primary text-sm font-medium flex items-center">
              Voir toutes
              <span className="material-icons text-sm ml-1">chevron_right</span>
            </a>
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {plantsLoading ? (
            <div className="col-span-full text-center p-4">Chargement des plantes...</div>
          ) : plants && plants.length > 0 ? (
            plants.slice(0, 4).map((plant: Plant) => (
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
            ))
          ) : (
            <div className="col-span-full bg-white rounded-lg p-6 text-center">
              <p className="text-gray-500 mb-4">Vous n'avez pas encore de plantes</p>
              <Link href="/analyze">
                <Button className="bg-primary text-white hover:bg-primary-light">
                  Ajouter une plante
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
