import { useState, useEffect, useMemo } from "react";
import { tacticoolWeapons as weaponsData, weaponCategories } from "@/data/tacticool-weapons";
import { Weapon } from "@shared/schema";

export default function WeaponStats() {
  const [currentCategory, setCurrentCategory] = useState("Assault Rifle");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [isImageLoading, setIsImageLoading] = useState(false);

  const filteredWeapons = useMemo(() => {
    const categoryWeapons = weaponsData[currentCategory] || [];
    if (!searchTerm.trim()) return categoryWeapons;
    
    return categoryWeapons.filter(weapon =>
      weapon.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [currentCategory, searchTerm]);

  const currentWeapon = filteredWeapons[currentIndex];

  useEffect(() => {
    setCurrentIndex(0);
  }, [currentCategory, searchTerm]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          navigateWeapon(-1);
          break;
        case "ArrowRight":
          e.preventDefault();
          navigateWeapon(1);
          break;
        case "Escape":
          setSearchTerm("");
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, filteredWeapons.length]);

  const navigateWeapon = (direction: number) => {
    if (filteredWeapons.length === 0) return;
    
    let newIndex = currentIndex + direction;
    if (newIndex < 0) newIndex = filteredWeapons.length - 1;
    if (newIndex >= filteredWeapons.length) newIndex = 0;
    
    setCurrentIndex(newIndex);
  };

  const selectCategory = (category: string) => {
    setCurrentCategory(category);
    setSearchTerm("");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const renderStars = (count: number) => {
    return Array.from({ length: Math.min(count, 7) }, (_, i) => (
      <i key={i} className="fas fa-star text-yellow-400 text-lg mr-1" />
    ));
  };

  const renderWeaponIndicators = () => {
    return Array.from({ length: Math.min(filteredWeapons.length, 10) }, (_, i) => (
      <div
        key={i}
        className={`w-2 h-2 rounded-full transition-colors duration-200 ${
          i === currentIndex ? "bg-tacticool-accent" : "bg-white/30"
        }`}
      />
    ));
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{
        backgroundImage: "linear-gradient(rgba(26, 58, 74, 0.6), rgba(26, 58, 74, 0.7)), url('/BG.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="w-full max-w-[1200px] rounded-3xl bg-tacticool-dark/90 backdrop-blur-md p-6 flex flex-col shadow-2xl border border-tacticool-teal/30" style={{ height: "795px" }}>
        
        {/* Header */}
        <header className="flex justify-between items-center mb-6 px-4">
          <img
            alt="TACTICOOL main logo in white rectangular border"
            className="object-contain"
            height="66"
            src="/logo.png"
            style={{ width: "349px" }}
            width="349"
          />
          <div className="text-white text-xs font-light bg-tacticool-teal/30 px-3 py-1 rounded-full">
            PT/ENG
          </div>
        </header>
        
        <h1 className="text-white text-4xl sm:text-5xl font-light text-center mb-6 px-4">
          Max Weapon Stats
        </h1>
        
        <main className="flex flex-col lg:flex-row gap-6 px-4 flex-1 overflow-hidden">
          
          {/* Category Sidebar */}
          <section className="rounded-3xl flex flex-col items-center py-6 w-full lg:w-[300px] bg-tacticool-teal/60 backdrop-blur-sm">
            <h2 className="text-white text-lg font-semibold mb-1 tracking-wide">
              <i className="fas fa-list-ul mr-2"></i>CATEGORIES
            </h2>
            <p className="text-white text-[10px] font-light mb-6 text-center px-4">
              Please select the weapon category
            </p>
            <nav className="flex flex-col space-y-3 w-[200px] custom-scrollbar overflow-y-auto max-h-[600px] px-2">
              {weaponCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => selectCategory(category.id)}
                  className={`category-btn text-white text-sm font-light py-2 px-4 rounded-r-md rounded-l-full text-left flex items-center space-x-2 transition-all duration-300 hover:transform hover:translate-x-1 hover:shadow-lg ${
                    currentCategory === category.id
                      ? "bg-tacticool-accent shadow-tacticool-accent/30"
                      : "bg-tacticool-gray hover:bg-tacticool-gray/80"
                  }`}
                  type="button"
                >
                  <i className={`${category.icon} text-xs`}></i>
                  <span>{category.label}</span>
                </button>
              ))}
            </nav>
          </section>
          
          {/* Weapon Details */}
          <section className="rounded-3xl flex flex-col flex-1 p-4 relative bg-tacticool-teal shadow-lg" style={{ maxWidth: "795px", height: "530px" }}>
            
            {/* Weapon Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h2 className="text-white font-light text-3xl flex items-center">
                <i className="fas fa-crosshairs mr-3 text-tacticool-accent"></i>
                <span>{currentCategory}</span>
              </h2>
              <form 
                className="flex items-center w-full sm:w-auto" 
                role="search" 
                onSubmit={handleSearch}
              >
                <input
                  aria-label="Search by name"
                  className="text-sm font-light px-3 py-2 rounded-l-md border-0 focus:outline-none focus:ring-2 focus:ring-tacticool-accent bg-white/90 w-full sm:w-auto"
                  placeholder="Search by Name"
                  type="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button
                  className="bg-tacticool-accent text-white text-sm font-light px-4 py-2 rounded-r-md hover:bg-tacticool-accent/80 transition flex items-center"
                  type="submit"
                >
                  <i className="fas fa-search mr-1"></i>
                  Search
                </button>
              </form>
            </div>
            
            {/* Weapon Display */}
            <div className="bg-tacticool-dark/50 rounded-2xl p-4 mb-2 flex-1 overflow-hidden">
              {filteredWeapons.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-white text-xl mb-2">Nenhuma arma encontrada</p>
                  <p className="text-white/60">Tente outro termo de pesquisa</p>
                </div>
              ) : (
                <div className="flex flex-col lg:flex-row items-center justify-center gap-4 h-full">
                  
                  {/* Navigation and Image */}
                  <div className="flex items-center gap-6">
                    <button
                      aria-label="Previous weapon"
                      className="nav-btn text-tacticool-accent text-4xl font-light hover:text-white transition-all duration-200 hover:scale-110"
                      type="button"
                      onClick={() => navigateWeapon(-1)}
                      disabled={filteredWeapons.length <= 1}
                    >
                      <i className="fas fa-chevron-left"></i>
                    </button>
                    
                    <div className="weapon-image-container bg-tacticool-gray/30 rounded-xl p-3 relative min-h-[180px] flex items-center justify-center">
                      {isImageLoading && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="loading-spinner border-2 border-white/30 border-t-tacticool-accent rounded-full w-6 h-6 animate-spin"></div>
                        </div>
                      )}
                      {currentWeapon && (
                        <img
                          alt={`${currentWeapon.name} weapon image`}
                          className={`rounded-md max-w-[280px] max-h-[160px] object-contain transition-opacity duration-300 ${
                            isImageLoading ? "opacity-0" : "opacity-100"
                          }`}
                          height="160"
                          src={currentWeapon.image}
                          width="280"
                          onLoad={() => setIsImageLoading(false)}
                          onLoadStart={() => setIsImageLoading(true)}
                          onError={(e) => {
                            setIsImageLoading(false);
                            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300";
                          }}
                        />
                      )}
                    </div>
                    
                    <button
                      aria-label="Next weapon"
                      className="nav-btn text-tacticool-accent text-4xl font-light hover:text-white transition-all duration-200 hover:scale-110"
                      type="button"
                      onClick={() => navigateWeapon(1)}
                      disabled={filteredWeapons.length <= 1}
                    >
                      <i className="fas fa-chevron-right"></i>
                    </button>
                  </div>
                  
                  {/* Weapon Stats */}
                  {currentWeapon && (
                    <div className="max-w-[400px] text-white font-light leading-tight">
                      <p className="text-xs font-bold uppercase tracking-widest mb-1 text-tacticool-accent">
                        {currentWeapon.primary}
                      </p>
                      <p className="text-yellow-400 text-3xl font-black mb-1">
                        {currentWeapon.name}
                      </p>
                      <p className="text-white text-sm font-semibold mb-1">
                        Raridade: {currentWeapon.rarity}
                      </p>
                      <div className="flex mb-2">
                        {renderStars(currentWeapon.stars)}
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs uppercase tracking-widest font-light text-tacticool-accent">
                          STATS
                        </span>
                        <span className="text-xs uppercase tracking-widest font-light text-tacticool-accent">
                          MÁXIMA
                        </span>
                      </div>
                      <ul className="space-y-0.5">
                        {currentWeapon.stats.map((stat, index) => (
                          <li 
                            key={index}
                            className="stat-item flex items-center justify-between bg-tacticool-gray/30 rounded-lg px-2 py-0.5 opacity-0 transform translate-y-2 animate-fadeInUp"
                            style={{ animationDelay: `${(index + 1) * 0.1}s`, animationFillMode: 'forwards' }}
                          >
                            <div className="flex items-center space-x-2">
                              <i className={`${stat.icon} text-tacticool-accent w-3 text-xs`}></i>
                              <span className="text-xs">{stat.label}</span>
                            </div>
                            <span className="font-bold text-yellow-400 text-xs">{stat.value}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {/* Weapon Counter */}
            {filteredWeapons.length > 0 && (
              <div className="flex justify-center items-center space-x-4 mt-4">
                <span className="text-white text-sm">
                  Weapon {currentIndex + 1} of {filteredWeapons.length}
                </span>
                <div className="flex space-x-1">
                  {renderWeaponIndicators()}
                </div>
              </div>
            )}
          </section>
        </main>
        
        {/* Footer */}
        <footer className="flex flex-col sm:flex-row justify-between items-center mt-8 px-4 text-white text-xs font-light gap-4">
          <p className="max-w-[600px] text-center sm:text-left">
            Hey, if you enjoy the tools I create, please consider supporting me so I can continue developing new features and improvements. Thank you!
          </p>
          <div className="flex items-center space-x-4">
            <a
              aria-label="TikTok link"
              className="text-yellow-400 text-2xl hover:text-yellow-300 transition transform hover:scale-110"
              href="#"
            >
              <i className="fab fa-tiktok"></i>
            </a>
            <a
              aria-label="Telegram link"
              className="text-yellow-400 text-2xl hover:text-yellow-300 transition transform hover:scale-110"
              href="#"
            >
              <i className="fab fa-telegram-plane"></i>
            </a>
            <a
              aria-label="GitHub link"
              className="text-yellow-400 text-2xl hover:text-yellow-300 transition transform hover:scale-110"
              href="#"
            >
              <i className="fab fa-github"></i>
            </a>
            <img
              alt="Black and yellow stylized icon of a person with a headset"
              className="object-contain"
              height="54"
              src="/code.png"
              style={{ width: "209px" }}
              width="209"
            />
          </div>
        </footer>
      </div>
    </div>
  );
}
