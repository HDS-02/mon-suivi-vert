import { useState } from "react";
import { Link, useLocation } from "wouter";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";

// Schéma de validation pour le formulaire de connexion
const loginSchema = z.object({
  username: z.string().min(3, "Le nom d'utilisateur doit comporter au moins 3 caractères"),
  password: z.string().min(6, "Le mot de passe doit comporter au moins 6 caractères"),
});

// Schéma de validation pour le formulaire d'inscription
const registerSchema = z.object({
  username: z.string().min(3, "Le nom d'utilisateur doit comporter au moins 3 caractères"),
  password: z.string().min(6, "Le mot de passe doit comporter au moins 6 caractères"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  
  // Récupérer les fonctions d'authentification
  const { user, loginMutation, registerMutation } = useAuth();
  
  // Si l'utilisateur est déjà connecté, rediriger vers la page d'accueil
  if (user) {
    navigate("/");
    return null;
  }
  
  // Formulaire de connexion
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  
  // Formulaire d'inscription
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
  });
  
  // Gérer la soumission du formulaire de connexion
  const onLoginSubmit = (data: LoginFormValues) => {
    loginMutation.mutate(data, {
      onSuccess: () => {
        toast({
          title: "Connexion réussie",
          description: "Vous êtes maintenant connecté",
        });
        navigate("/");
      }
    });
  };
  
  // Gérer la soumission du formulaire d'inscription
  const onRegisterSubmit = (data: RegisterFormValues) => {
    const { confirmPassword, ...userData } = data;
    registerMutation.mutate(userData, {
      onSuccess: () => {
        toast({
          title: "Inscription réussie",
          description: "Votre compte a été créé avec succès",
        });
        navigate("/");
      }
    });
  };
  
  return (
    <div className="min-h-screen flex flex-col md:flex-row items-center justify-center p-4 md:p-0">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-raleway font-bold text-primary">Mon Suivi Vert</h1>
          <p className="text-gray-600 mt-2">Gérez et prenez soin de vos plantes</p>
        </div>
        
        <Tabs 
          defaultValue="login" 
          value={activeTab} 
          onValueChange={(value) => setActiveTab(value as "login" | "register")}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login">Connexion</TabsTrigger>
            <TabsTrigger value="register">Inscription</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Connexion</CardTitle>
                <CardDescription>
                  Connectez-vous à votre compte pour accéder à votre jardin virtuel
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                    <FormField
                      control={loginForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nom d'utilisateur</FormLabel>
                          <FormControl>
                            <Input placeholder="Votre nom d'utilisateur" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mot de passe</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Votre mot de passe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="submit" 
                      className="w-full bg-primary text-white"
                      disabled={loginMutation.isPending}
                    >
                      {loginMutation.isPending ? "Connexion en cours..." : "Se connecter"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button 
                  variant="link" 
                  onClick={() => setActiveTab("register")}
                >
                  Vous n'avez pas de compte ? Inscrivez-vous
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle>Inscription</CardTitle>
                <CardDescription>
                  Créez un compte pour commencer à suivre vos plantes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                    <FormField
                      control={registerForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nom d'utilisateur</FormLabel>
                          <FormControl>
                            <Input placeholder="Choisissez un nom d'utilisateur" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Mot de passe</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Créez un mot de passe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirmer le mot de passe</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Répétez votre mot de passe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button 
                      type="submit" 
                      className="w-full bg-primary text-white"
                      disabled={registerMutation.isPending}
                    >
                      {registerMutation.isPending ? "Inscription en cours..." : "S'inscrire"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button 
                  variant="link" 
                  onClick={() => setActiveTab("login")}
                >
                  Déjà un compte ? Connectez-vous
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      
      <div className="hidden md:block md:w-1/2 p-6">
        <div className="max-w-lg mx-auto">
          <h2 className="text-2xl font-raleway font-semibold mb-4">Prenez soin de vos plantes avec Mon Suivi Vert</h2>
          <ul className="space-y-4">
            <li className="flex items-start">
              <span className="material-icons text-primary mr-2">eco</span>
              <span>Analysez vos plantes avec l'IA pour identifier les problèmes de santé</span>
            </li>
            <li className="flex items-start">
              <span className="material-icons text-primary mr-2">calendar_today</span>
              <span>Recevez des rappels d'arrosage et d'entretien</span>
            </li>
            <li className="flex items-start">
              <span className="material-icons text-primary mr-2">trending_up</span>
              <span>Suivez l'évolution de vos plantes dans le temps</span>
            </li>
            <li className="flex items-start">
              <span className="material-icons text-primary mr-2">tips_and_updates</span>
              <span>Obtenez des conseils personnalisés pour chaque plante</span>
            </li>
          </ul>
          <div className="mt-6 bg-primary/10 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Vous saviez que...</h3>
            <p className="text-sm text-gray-600">Les plantes d'intérieur peuvent améliorer la qualité de l'air, réduire le stress et augmenter la productivité. Avec Mon Suivi Vert, vous pouvez facilement maintenir vos plantes en parfaite santé !</p>
          </div>
        </div>
      </div>
    </div>
  );
}