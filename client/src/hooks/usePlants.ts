import { useQuery } from "@tanstack/react-query";
import { Plant } from "@shared/schema";

export default function usePlants() {
  return useQuery<Plant[]>({
    queryKey: ["/api/plants"],
  });
}
