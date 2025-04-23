import { useState } from "react";
import { Calendar as CalendarUI } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { fr } from "date-fns/locale";
import useTasks from "@/hooks/useTasks";
import { Task } from "@shared/schema";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";

export default function Calendar() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { data: tasks, isLoading } = useTasks();
  const { toast } = useToast();

  function formatDate(date: Date | string | undefined): string {
    if (!date) return "";
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric"
    });
  }

  const getTasksForDate = (date: Date | undefined) => {
    if (!date || !tasks) return [];
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      return (
        taskDate.getDate() === date.getDate() &&
        taskDate.getMonth() === date.getMonth() &&
        taskDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const tasksForSelectedDate = date ? getTasksForDate(date) : [];

  const getDotColorForDate = (date: Date) => {
    if (!tasks) return null;
    
    const tasksOnDate = getTasksForDate(date);
    if (tasksOnDate.length === 0) return null;
    
    const hasDangerTask = tasksOnDate.some(task => task.type === "water" && !task.completed);
    if (hasDangerTask) return "bg-alert";
    
    return "bg-primary";
  };
  
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
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de compléter la tâche",
        variant: "destructive",
      });
    }
  };

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
      <div className="mb-6">
        <button 
          className="flex items-center text-primary mb-4"
          onClick={() => history.back()}
        >
          <span className="material-icons mr-1">arrow_back</span>
          Retour
        </button>
        <h2 className="text-xl font-raleway font-semibold">Calendrier d'entretien</h2>
        <p className="text-gray-600">Suivez les tâches d'entretien de vos plantes</p>
      </div>

      <Card className="bg-white rounded-lg shadow-md mb-6">
        <CardContent className="p-4">
          <CalendarUI
            mode="single"
            selected={date}
            onSelect={setDate}
            locale={fr}
            modifiers={{
              booked: (date) => {
                return getTasksForDate(date).length > 0;
              },
            }}
            modifiersStyles={{
              booked: {
                fontWeight: "bold"
              }
            }}
            components={{
              DayContent: (props) => {
                const color = getDotColorForDate(props.date);
                return (
                  <div className="relative w-full h-full flex items-center justify-center">
                    <div className="absolute w-full h-full flex items-center justify-center">
                      {props.children}
                    </div>
                    {color && (
                      <div className="absolute bottom-1">
                        <div className={`h-1 w-1 rounded-full ${color}`} />
                      </div>
                    )}
                  </div>
                );
              },
            }}
          />
        </CardContent>
      </Card>

      <div className="mb-4 flex justify-between items-center">
        <h3 className="text-lg font-semibold font-raleway">
          Tâches du {date ? formatDate(date) : ""}
        </h3>
        <Button className="bg-primary text-white text-sm">
          <span className="material-icons mr-2 text-sm">add</span>
          Nouvelle tâche
        </Button>
      </div>

      <Card className="bg-white rounded-lg shadow-md">
        <CardContent className="p-4">
          {isLoading ? (
            <div className="py-8 text-center text-gray-500">
              Chargement des tâches...
            </div>
          ) : tasksForSelectedDate.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {tasksForSelectedDate.map((task: Task) => (
                <div key={task.id} className="py-3 flex items-center">
                  <div className={`w-10 h-10 ${getTaskTypeBackground(task.type)} rounded-full flex items-center justify-center mr-4`}>
                    {getTaskIcon(task.type)}
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center">
                      <h4 className="font-medium">{task.description}</h4>
                      {task.completed && (
                        <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">
                          Terminé
                        </span>
                      )}
                    </div>
                    <Link href={`/plants/${task.plantId}`}>
                      <a className="text-sm text-primary">
                        Voir la plante
                      </a>
                    </Link>
                  </div>
                  {!task.completed && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="ml-2 p-2 rounded-full hover:bg-gray-100"
                      onClick={() => completeTask(task.id)}
                    >
                      <span className="material-icons text-gray-400">check_circle_outline</span>
                    </Button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-gray-500">
              <p className="mb-2">Aucune tâche pour cette date</p>
              <p className="text-sm">Sélectionnez une autre date ou ajoutez une nouvelle tâche</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
