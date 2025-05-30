
import { useState } from "react";
import { Search, Mic, Camera, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const shortcuts = [
    { name: "YOUTUBE", icon: "🎥", url: "https://youtube.com", color: "bg-red-600" },
    { name: "chat gpt", icon: "🤖", url: "https://chat.openai.com", color: "bg-green-600" },
    { name: "facebook", icon: "📘", url: "https://facebook.com", color: "bg-blue-600" },
    { name: "Islamic Browser", icon: "🕌", url: "/islamic-browser", color: "bg-emerald-600" },
    { name: "Code With H...", icon: "💻", url: "#", color: "bg-gray-600" },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.open(`https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`, '_blank');
    } else {
      toast({
        title: "Please enter a search query",
        description: "Type something to search for",
      });
    }
  };

  const handleLuckySearch = () => {
    if (searchQuery.trim()) {
      window.open(`https://www.google.com/search?q=${encodeURIComponent(searchQuery)}&btnI=1`, '_blank');
    } else {
      toast({
        title: "I'm Feeling Lucky",
        description: "Enter a search term first!",
      });
    }
  };

  const handleVoiceSearch = () => {
    toast({
      title: "Voice Search",
      description: "Voice search feature would be activated here",
    });
  };

  const handleImageSearch = () => {
    toast({
      title: "Image Search",
      description: "Image search feature would be activated here",
    });
  };

  const handleShortcutClick = (shortcut: typeof shortcuts[0]) => {
    if (shortcut.url.startsWith('/')) {
      // Internal route
      window.location.href = shortcut.url;
    } else if (shortcut.url !== "#") {
      window.open(shortcut.url, '_blank');
    } else {
      toast({
        title: shortcut.name,
        description: "This shortcut would open the respective app/website",
      });
    }
  };

  const handleAddShortcut = () => {
    toast({
      title: "Add Shortcut",
      description: "Feature to add new shortcuts would be implemented here",
    });
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center p-4">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
            Gmail
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
            Images
          </Button>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="icon" className="text-gray-300 hover:text-white">
            <div className="w-6 h-6 grid grid-cols-3 gap-0.5">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="w-1 h-1 bg-current rounded-full"></div>
              ))}
            </div>
          </Button>
          <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
            SM
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 -mt-20">
        {/* Google Logo */}
        <div className="mb-8">
          <h1 className="text-8xl font-normal text-white tracking-tight">
            <span className="text-blue-500">G</span>
            <span className="text-red-500">o</span>
            <span className="text-yellow-500">o</span>
            <span className="text-blue-500">g</span>
            <span className="text-green-500">l</span>
            <span className="text-red-500">e</span>
          </h1>
        </div>

        {/* Search Bar */}
        <div className="w-full max-w-xl mb-8">
          <form onSubmit={handleSearch} className="relative">
            <div className="relative flex items-center bg-gray-800 rounded-full border border-gray-600 hover:border-gray-500 focus-within:border-blue-500 transition-colors">
              <Search className="absolute left-4 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Google or type a URL"
                className="bg-transparent border-0 pl-12 pr-20 py-3 text-white placeholder-gray-400 focus:ring-0 focus:outline-none rounded-full"
              />
              <div className="absolute right-3 flex items-center space-x-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={handleVoiceSearch}
                  className="w-8 h-8 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full"
                >
                  <Mic className="w-4 h-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={handleImageSearch}
                  className="w-8 h-8 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full"
                >
                  <Camera className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </form>

          {/* Search Buttons */}
          <div className="flex justify-center space-x-4 mt-6">
            <Button
              onClick={handleSearch}
              variant="secondary"
              className="bg-gray-800 hover:bg-gray-700 text-white border border-gray-600"
            >
              Google Search
            </Button>
            <Button
              onClick={handleLuckySearch}
              variant="secondary"
              className="bg-gray-800 hover:bg-gray-700 text-white border border-gray-600"
            >
              I'm Feeling Lucky
            </Button>
          </div>
        </div>

        {/* Shortcuts */}
        <div className="flex flex-wrap justify-center gap-6 max-w-2xl">
          {shortcuts.map((shortcut, index) => (
            <div
              key={index}
              onClick={() => handleShortcutClick(shortcut)}
              className="flex flex-col items-center cursor-pointer group"
            >
              <div className={`w-12 h-12 rounded-full ${shortcut.color} flex items-center justify-center text-white text-xl mb-2 group-hover:scale-110 transition-transform`}>
                {shortcut.icon}
              </div>
              <span className="text-xs text-gray-300 group-hover:text-white transition-colors">
                {shortcut.name}
              </span>
            </div>
          ))}
          <div
            onClick={handleAddShortcut}
            className="flex flex-col items-center cursor-pointer group"
          >
            <div className="w-12 h-12 rounded-full bg-gray-700 border-2 border-dashed border-gray-500 flex items-center justify-center text-gray-400 group-hover:border-gray-300 group-hover:text-white transition-colors">
              <Plus className="w-6 h-6" />
            </div>
            <span className="text-xs text-gray-300 group-hover:text-white transition-colors mt-2">
              Add shortcut
            </span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 text-center">
        <Button variant="link" className="text-gray-400 hover:text-white text-sm">
          Black
        </Button>
      </footer>
    </div>
  );
};

export default Index;
