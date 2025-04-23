import { useQuery } from "@tanstack/react-query";
import { Task } from "@shared/schema";

export default function useTasks() {
  return useQuery<Task[]>({
    queryKey: ["/api/tasks"],
  });
}
