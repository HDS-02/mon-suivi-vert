import { ReactNode } from "react";
import Header from "./Header";
import BottomNavigation from "./BottomNavigation";
import OnboardingTutorial from "./OnboardingTutorial";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-neutral">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-6 mb-16">
        {children}
      </main>
      
      {/* ADD PLANT FLOATING BUTTON */}
      <div className="fixed right-4 bottom-20 z-10">
        <a href="/analyze" className="w-14 h-14 bg-primary rounded-full shadow-lg flex items-center justify-center text-white hover:bg-secondary transition-colors">
          <span className="material-icons">add</span>
        </a>
      </div>
      
      <BottomNavigation />
      <OnboardingTutorial />
    </div>
  );
}
