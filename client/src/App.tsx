import { Switch, Route, Router } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import Analyze from "@/pages/Analyze";
import PlantDetail from "@/pages/PlantDetail";
import MyPlants from "@/pages/MyPlants";
import Calendar from "@/pages/Calendar";

function AppRoutes() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/analyze" component={Analyze} />
        <Route path="/plants" component={MyPlants} />
        <Route path="/plants/:id" component={PlantDetail} />
        <Route path="/calendar" component={Calendar} />
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router>
          <Toaster />
          <AppRoutes />
        </Router>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
