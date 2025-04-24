import { useLocation, Link } from "wouter";

export default function BottomNavigation() {
  const [location] = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/70 backdrop-blur-md shadow-lg border-t border-gray-200 z-10">
      <div className="flex justify-around">
        <Link href="/">
          <div className={`py-3 px-4 flex flex-col items-center ${location === "/" ? "text-primary" : "text-gray-500"}`}>
            <span className="material-icons text-current">home</span>
            <span className="text-xs mt-1">Accueil</span>
          </div>
        </Link>
        <Link href="/analyze">
          <div className={`py-3 px-4 flex flex-col items-center ${location === "/analyze" ? "text-primary" : "text-gray-500"}`}>
            <span className="material-icons text-current">search</span>
            <span className="text-xs mt-1">Analyser</span>
          </div>
        </Link>
        <Link href="/plants">
          <div className={`py-3 px-4 flex flex-col items-center ${location === "/plants" ? "text-primary" : "text-gray-500"}`}>
            <span className="material-icons text-current">format_list_bulleted</span>
            <span className="text-xs mt-1">Mes plantes</span>
          </div>
        </Link>
        <Link href="/badges">
          <div className={`py-3 px-4 flex flex-col items-center ${location === "/badges" ? "text-primary" : "text-gray-500"}`}>
            <span className="material-icons text-current">emoji_events</span>
            <span className="text-xs mt-1">Badges</span>
          </div>
        </Link>
        <Link href="/calendar">
          <div className={`py-3 px-4 flex flex-col items-center ${location === "/calendar" ? "text-primary" : "text-gray-500"}`}>
            <span className="material-icons text-current">calendar_today</span>
            <span className="text-xs mt-1">Calendrier</span>
          </div>
        </Link>
      </div>
    </nav>
  );
}
