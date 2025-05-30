
import { useState } from "react";
import { Search, Mic, Camera, User, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to Islamic browser with search
      window.location.href = `/islamic-browser?search=${encodeURIComponent(searchQuery)}`;
    } else {
      toast({
        title: "Please enter a search query",
        description: "Type something to search for",
      });
    }
  };

  const handleLuckySearch = () => {
    if (searchQuery.trim()) {
      window.location.href = `/islamic-browser?search=${encodeURIComponent(searchQuery)}&lucky=true`;
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

  const handleSignIn = () => {
    toast({
      title: "Sign In",
      description: "Sign in functionality would be implemented here",
    });
  };

  const handleSignUp = () => {
    toast({
      title: "Sign Up",
      description: "Sign up functionality would be implemented here",
    });
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center p-4">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
            Islamic Sites
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
            Images
          </Button>
        </div>
        <div className="flex items-center space-x-3">
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-gray-300 hover:text-white flex items-center gap-2"
            onClick={handleSignIn}
          >
            <User className="w-4 h-4" />
            Sign In
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-gray-300 hover:text-white flex items-center gap-2"
            onClick={handleSignUp}
          >
            <UserPlus className="w-4 h-4" />
            Sign Up
          </Button>
          <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
            IW
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 -mt-20">
        {/* Islamic Web Logo */}
        <div className="mb-8">
          <h1 className="text-8xl font-normal text-white tracking-tight">
            <span className="text-green-500">I</span>
            <span className="text-emerald-400">S</span>
            <span className="text-teal-400">L</span>
            <span className="text-green-500">A</span>
            <span className="text-emerald-400">M</span>
            <span className="text-teal-400">I</span>
            <span className="text-green-500">C</span>
            <span className="mx-4 text-white">W</span>
            <span className="text-green-500">E</span>
            <span className="text-emerald-400">B</span>
          </h1>
        </div>

        {/* Search Bar */}
        <div className="w-full max-w-xl mb-8">
          <form onSubmit={handleSearch} className="relative">
            <div className="relative flex items-center bg-gray-800 rounded-full border border-gray-600 hover:border-gray-500 focus-within:border-green-500 transition-colors">
              <Search className="absolute left-4 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Islamic content or type a URL"
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
              Islamic Search
            </Button>
            <Button
              onClick={handleLuckySearch}
              variant="secondary"
              className="bg-gray-800 hover:bg-gray-700 text-white border border-gray-600"
            >
              I'm Feeling Blessed
            </Button>
          </div>
        </div>

        {/* Islamic Quote */}
        <div className="text-center bg-gray-900 p-6 rounded-lg border border-gray-700 max-w-2xl">
          <p className="text-green-400 italic mb-2">
            "And whoever relies upon Allah - then He is sufficient for him. Indeed, Allah will accomplish His purpose."
          </p>
          <p className="text-sm text-green-300">- Quran 65:3</p>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-4 text-center">
        <Button variant="link" className="text-gray-400 hover:text-white text-sm">
          Islamic Theme
        </Button>
      </footer>
    </div>
  );
};

export default Index;
