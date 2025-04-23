export default function Header() {
  return (
    <header className="bg-primary text-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-xl font-raleway font-bold">Mon Suivi Vert</h1>
        <div className="flex space-x-2">
          <button className="p-2 rounded-full hover:bg-secondary transition-colors">
            <span className="material-icons">notifications</span>
          </button>
          <button className="p-2 rounded-full hover:bg-secondary transition-colors">
            <span className="material-icons">settings</span>
          </button>
        </div>
      </div>
    </header>
  );
}
