import { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, RotateCcw, Home, Bookmark, Globe, Plus, X, Search, User, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Tab {
  id: string;
  title: string;
  url: string;
  isActive: boolean;
}

interface Bookmark {
  id: string;
  title: string;
  url: string;
  category: string;
}

interface HistoryItem {
  id: string;
  title: string;
  url: string;
  timestamp: Date;
}

const IslamicBrowser = () => {
  const [tabs, setTabs] = useState<Tab[]>([
    { id: "1", title: "Islamic Web Browser", url: "about:blank", isActive: true }
  ]);
  const [currentUrl, setCurrentUrl] = useState("about:blank");
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([
    { id: "1", title: "IslamQA", url: "https://islamqa.info", category: "Islamic Knowledge" },
    { id: "2", title: "Quran.com", url: "https://quran.com", category: "Quran" },
    { id: "3", title: "Sunnah.com", url: "https://sunnah.com", category: "Hadith" },
    { id: "4", title: "IslamicFinder", url: "https://islamicfinder.org", category: "Prayer Times" },
    { id: "5", title: "Bayyinah TV", url: "https://bayyinah.tv", category: "Education" }
  ]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [navigationHistory, setNavigationHistory] = useState<string[]>([]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(-1);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const { toast } = useToast();

  // Initialize with search query if coming from main page
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('search');
    if (searchQuery) {
      const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
      navigateToUrl(searchUrl);
    }
  }, []);

  const islamicSites = [
    { name: "Quran.com", url: "https://quran.com", description: "Read and listen to the Holy Quran", icon: "📖" },
    { name: "IslamQA", url: "https://islamqa.info", description: "Islamic Q&A and Fatawa", icon: "❓" },
    { name: "Sunnah.com", url: "https://sunnah.com", description: "Hadith collections", icon: "📚" },
    { name: "IslamicFinder", url: "https://islamicfinder.org", description: "Prayer times and Qibla", icon: "🕌" },
    { name: "Bayyinah Institute", url: "https://bayyinah.com", description: "Arabic and Quran learning", icon: "🎓" },
    { name: "SeekersGuidance", url: "https://seekersguidance.org", description: "Islamic courses and knowledge", icon: "📖" },
    { name: "Islamic Relief", url: "https://islamic-relief.org", description: "Charity and humanitarian work", icon: "🤝" },
    { name: "Islamway", url: "https://en.islamway.net", description: "Islamic content and lectures", icon: "🎤" }
  ];

  const addTab = () => {
    const newTab: Tab = {
      id: Date.now().toString(),
      title: "New Tab",
      url: "about:blank",
      isActive: true
    };
    setTabs(prev => prev.map(tab => ({ ...tab, isActive: false })).concat(newTab));
    setCurrentUrl("about:blank");
  };

  const closeTab = (tabId: string) => {
    if (tabs.length === 1) return;
    
    const tabIndex = tabs.findIndex(tab => tab.id === tabId);
    const newTabs = tabs.filter(tab => tab.id !== tabId);
    
    if (tabs[tabIndex].isActive && newTabs.length > 0) {
      const nextActiveIndex = Math.min(tabIndex, newTabs.length - 1);
      newTabs[nextActiveIndex].isActive = true;
      setCurrentUrl(newTabs[nextActiveActiveIndex].url);
    }
    
    setTabs(newTabs);
  };

  const switchTab = (tabId: string) => {
    setTabs(prev => prev.map(tab => ({ 
      ...tab, 
      isActive: tab.id === tabId 
    })));
    const selectedTab = tabs.find(tab => tab.id === tabId);
    if (selectedTab) {
      setCurrentUrl(selectedTab.url);
    }
  };

  const navigateToUrl = (url: string) => {
    if (url && url !== "about:blank") {
      // Add to browsing history
      const historyItem: HistoryItem = {
        id: Date.now().toString(),
        title: getDomainFromUrl(url),
        url: url,
        timestamp: new Date()
      };
      setHistory(prev => [historyItem, ...prev.slice(0, 99)]);
      
      // Update navigation history for back/forward functionality
      const newNavigationHistory = navigationHistory.slice(0, currentHistoryIndex + 1);
      newNavigationHistory.push(url);
      setNavigationHistory(newNavigationHistory);
      setCurrentHistoryIndex(newNavigationHistory.length - 1);
      
      // Update current tab
      setTabs(prev => prev.map(tab => 
        tab.isActive ? { ...tab, url: url, title: getDomainFromUrl(url) } : tab
      ));
      setCurrentUrl(url);
      
      // Update navigation buttons
      setCanGoBack(newNavigationHistory.length > 1);
      setCanGoForward(false);
      
      toast({
        title: "Navigating",
        description: `Loading ${getDomainFromUrl(url)}`,
      });
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let url = currentUrl;
    
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      if (url.includes('.')) {
        url = 'https://' + url;
      } else {
        url = `https://www.google.com/search?q=${encodeURIComponent(url)}`;
      }
    }
    
    navigateToUrl(url);
  };

  const addBookmark = () => {
    const activeTab = tabs.find(tab => tab.isActive);
    if (activeTab && activeTab.url !== "about:blank") {
      const newBookmark: Bookmark = {
        id: Date.now().toString(),
        title: activeTab.title,
        url: activeTab.url,
        category: "General"
      };
      setBookmarks(prev => [newBookmark, ...prev]);
      toast({
        title: "Bookmark Added",
        description: `${activeTab.title} has been bookmarked`,
      });
    }
  };

  const getDomainFromUrl = (url: string) => {
    try {
      return new URL(url).hostname.replace('www.', '');
    } catch {
      return url;
    }
  };

  const goBack = () => {
    if (canGoBack && currentHistoryIndex > 0) {
      const newIndex = currentHistoryIndex - 1;
      const previousUrl = navigationHistory[newIndex];
      setCurrentHistoryIndex(newIndex);
      setCurrentUrl(previousUrl);
      
      // Update current tab
      setTabs(prev => prev.map(tab => 
        tab.isActive ? { ...tab, url: previousUrl, title: getDomainFromUrl(previousUrl) } : tab
      ));
      
      setCanGoBack(newIndex > 0);
      setCanGoForward(true);
      
      toast({
        title: "Going Back",
        description: `Navigated to ${getDomainFromUrl(previousUrl)}`,
      });
    }
  };

  const goForward = () => {
    if (canGoForward && currentHistoryIndex < navigationHistory.length - 1) {
      const newIndex = currentHistoryIndex + 1;
      const nextUrl = navigationHistory[newIndex];
      setCurrentHistoryIndex(newIndex);
      setCurrentUrl(nextUrl);
      
      // Update current tab
      setTabs(prev => prev.map(tab => 
        tab.isActive ? { ...tab, url: nextUrl, title: getDomainFromUrl(nextUrl) } : tab
      ));
      
      setCanGoForward(newIndex < navigationHistory.length - 1);
      setCanGoBack(true);
      
      toast({
        title: "Going Forward",
        description: `Navigated to ${getDomainFromUrl(nextUrl)}`,
      });
    }
  };

  const refresh = () => {
    toast({
      title: "Refreshing",
      description: "Reloading current page",
    });
  };

  const goHome = () => {
    setCurrentUrl("about:blank");
    setTabs(prev => prev.map(tab => 
      tab.isActive ? { ...tab, url: "about:blank", title: "Islamic Web Browser" } : tab
    ));
  };

  const handleSignIn = () => {
    toast({
      title: "Sign In",
      description: "Sign in to save your browsing history and bookmarks",
    });
  };

  const handleSignUp = () => {
    toast({
      title: "Sign Up",
      description: "Create an account to sync your data across devices",
    });
  };

  const renderWebContent = (url: string) => {
    const domain = getDomainFromUrl(url);
    
    // Simulate different website contents based on domain
    if (url.includes('quran.com')) {
      return (
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-green-800 mb-2">📖 Quran.com</h1>
            <p className="text-gray-600">The Noble Quran</p>
          </div>
          <div className="bg-green-50 p-6 rounded-lg mb-6">
            <h2 className="text-xl font-semibold text-green-800 mb-4">Surah Al-Fatiha (The Opening)</h2>
            <div className="space-y-4 text-right">
              <p className="text-2xl text-green-900">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
              <p className="text-lg text-gray-700">In the name of Allah, the Entirely Merciful, the Especially Merciful.</p>
              <p className="text-2xl text-green-900">الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ</p>
              <p className="text-lg text-gray-700">[All] praise is [due] to Allah, Lord of the worlds -</p>
            </div>
          </div>
          <div className="text-center">
            <p className="text-green-700">Experience the complete Quran with audio recitations, translations, and tafsir.</p>
          </div>
        </div>
      );
    }
    
    if (url.includes('islamqa.info')) {
      return (
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-green-800 mb-2">❓ IslamQA</h1>
            <p className="text-gray-600">Authentic Islamic Knowledge</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-green-800 mb-3">Recent Questions</h3>
              <ul className="space-y-2">
                <li className="text-gray-700">• What are the conditions for valid prayer?</li>
                <li className="text-gray-700">• Rulings on Islamic finance</li>
                <li className="text-gray-700">• Proper etiquette for mosque visits</li>
              </ul>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-800 mb-3">Categories</h3>
              <ul className="space-y-2">
                <li className="text-gray-700">• Worship & Prayer</li>
                <li className="text-gray-700">• Family & Marriage</li>
                <li className="text-gray-700">• Business & Finance</li>
              </ul>
            </div>
          </div>
        </div>
      );
    }
    
    if (url.includes('sunnah.com')) {
      return (
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-green-800 mb-2">📚 Sunnah.com</h1>
            <p className="text-gray-600">Hadith Collections</p>
          </div>
          <div className="bg-amber-50 p-6 rounded-lg mb-6">
            <h3 className="text-lg font-semibold text-amber-800 mb-3">Hadith of the Day</h3>
            <blockquote className="text-gray-700 italic border-l-4 border-amber-400 pl-4">
              "The best of people are those who benefit others."
            </blockquote>
            <p className="text-sm text-gray-600 mt-2">- Prophet Muhammad (ﷺ)</p>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded">
              <h4 className="font-semibold">Sahih Bukhari</h4>
              <p className="text-sm text-gray-600">7,563 Hadiths</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded">
              <h4 className="font-semibold">Sahih Muslim</h4>
              <p className="text-sm text-gray-600">7,190 Hadiths</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded">
              <h4 className="font-semibold">Sunan Abu Dawud</h4>
              <p className="text-sm text-gray-600">5,274 Hadiths</p>
            </div>
          </div>
        </div>
      );
    }
    
    if (url.includes('google.com/search')) {
      const searchQuery = new URLSearchParams(url.split('?')[1]).get('q') || '';
      return (
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-blue-600 mb-2">🔍 Islamic Search Results</h1>
            <p className="text-gray-600">Searching for: "{searchQuery}"</p>
          </div>
          <div className="space-y-4">
            <div className="border-l-4 border-green-400 pl-4">
              <h3 className="text-lg font-semibold text-green-800">IslamQA - {searchQuery}</h3>
              <p className="text-gray-600">Authentic Islamic answers about {searchQuery} from scholars...</p>
              <span className="text-sm text-green-600">islamqa.info</span>
            </div>
            <div className="border-l-4 border-blue-400 pl-4">
              <h3 className="text-lg font-semibold text-blue-800">Quran.com - {searchQuery}</h3>
              <p className="text-gray-600">Verses and references about {searchQuery} in the Holy Quran...</p>
              <span className="text-sm text-blue-600">quran.com</span>
            </div>
            <div className="border-l-4 border-amber-400 pl-4">
              <h3 className="text-lg font-semibold text-amber-800">Sunnah.com - {searchQuery}</h3>
              <p className="text-gray-600">Hadith collections related to {searchQuery}...</p>
              <span className="text-sm text-amber-600">sunnah.com</span>
            </div>
          </div>
        </div>
      );
    }
    
    // Default content for other websites
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-green-800 mb-2">🌐 {domain}</h1>
          <p className="text-gray-600">Islamic Web Browser Content</p>
        </div>
        <div className="bg-green-50 p-6 rounded-lg mb-6">
          <h3 className="text-lg font-semibold text-green-800 mb-3">Website Content</h3>
          <p className="text-gray-700 mb-4">
            You are now viewing content from: <strong>{url}</strong>
          </p>
          <p className="text-gray-600">
            The Islamic Web Browser provides a safe, curated browsing experience with built-in Islamic features. 
            All content is filtered to ensure it aligns with Islamic values and principles.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">Islamic Features</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Prayer time reminders</li>
              <li>• Qibla direction indicator</li>
              <li>• Islamic calendar integration</li>
              <li>• Halal content filtering</li>
            </ul>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h4 className="font-semibold text-purple-800 mb-2">Safety Features</h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Content screening</li>
              <li>• Family-safe browsing</li>
              <li>• Islamic compliance check</li>
              <li>• Secure connection</li>
            </ul>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex flex-col">
      {/* Browser Header */}
      <div className="bg-white border-b shadow-sm">
        {/* Top Bar with Auth */}
        <div className="flex justify-between items-center px-4 py-2 bg-gray-50 border-b">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Islamic Web Browser</span>
          </div>
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-600 hover:text-green-800 flex items-center gap-1"
              onClick={handleSignIn}
            >
              <User className="w-3 h-3" />
              Sign In
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-600 hover:text-green-800 flex items-center gap-1"
              onClick={handleSignUp}
            >
              <UserPlus className="w-3 h-3" />
              Sign Up
            </Button>
          </div>
        </div>

        {/* Tab Bar */}
        <div className="flex items-center bg-gray-100 px-2 py-1">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={`flex items-center px-4 py-2 mr-1 rounded-t-lg cursor-pointer max-w-48 ${
                tab.isActive 
                  ? 'bg-white border-t border-l border-r' 
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
              onClick={() => switchTab(tab.id)}
            >
              <span className="text-sm truncate flex-1">{tab.title}</span>
              {tabs.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-4 h-4 p-0 ml-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    closeTab(tab.id);
                  }}
                >
                  <X className="w-3 h-3" />
                </Button>
              )}
            </div>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={addTab}
            className="w-8 h-8 p-0 ml-1"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {/* Navigation Bar */}
        <div className="flex items-center gap-2 p-3">
          {/* Navigation Buttons */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={goBack}
              disabled={!canGoBack}
              className="w-8 h-8 p-0"
              title="Go Back"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={goForward}
              disabled={!canGoForward}
              className="w-8 h-8 p-0"
              title="Go Forward"
            >
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={refresh}
              className="w-8 h-8 p-0"
              title="Refresh"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={goHome}
              className="w-8 h-8 p-0"
              title="Home"
            >
              <Home className="w-4 h-4" />
            </Button>
          </div>

          {/* Address Bar */}
          <form onSubmit={handleUrlSubmit} className="flex-1 flex items-center gap-2">
            <div className="flex-1 relative">
              <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                value={currentUrl}
                onChange={(e) => setCurrentUrl(e.target.value)}
                placeholder="Enter URL or search Islamic content..."
                className="pl-10 pr-10"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
          </form>

          {/* Action Buttons */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={addBookmark}
              className="w-8 h-8 p-0"
              title="Bookmark this page"
            >
              <Bookmark className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6">
        {currentUrl === "about:blank" ? (
          // New Tab Page
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-green-800 mb-2">
                🕌 Islamic Web Browser
              </h1>
              <p className="text-green-600">
                Bismillah - Start your Islamic journey with blessed browsing
              </p>
            </div>

            <Tabs defaultValue="sites" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="sites">Islamic Sites</TabsTrigger>
                <TabsTrigger value="bookmarks">Bookmarks</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>

              <TabsContent value="sites" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {islamicSites.map((site, index) => (
                    <Card
                      key={index}
                      className="p-4 cursor-pointer hover:shadow-lg transition-shadow bg-white border-green-200"
                      onClick={() => navigateToUrl(site.url)}
                    >
                      <div className="text-center">
                        <div className="text-3xl mb-2">{site.icon}</div>
                        <h3 className="font-semibold text-green-800 mb-1">{site.name}</h3>
                        <p className="text-sm text-gray-600">{site.description}</p>
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="bookmarks" className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {bookmarks.map((bookmark) => (
                    <Card
                      key={bookmark.id}
                      className="p-4 cursor-pointer hover:shadow-lg transition-shadow"
                      onClick={() => navigateToUrl(bookmark.url)}
                    >
                      <h3 className="font-semibold text-green-800">{bookmark.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{bookmark.url}</p>
                      <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded mt-2">
                        {bookmark.category}
                      </span>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="history" className="mt-6">
                <div className="space-y-2">
                  {history.map((item) => (
                    <Card
                      key={item.id}
                      className="p-3 cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => navigateToUrl(item.url)}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium text-green-800">{item.title}</h4>
                          <p className="text-sm text-gray-600">{item.url}</p>
                        </div>
                        <span className="text-xs text-gray-500">
                          {item.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                    </Card>
                  ))}
                  {history.length === 0 && (
                    <div className="text-center text-gray-500 py-8">
                      No browsing history yet
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>

            {/* Islamic Quote */}
            <div className="mt-8 text-center bg-white p-6 rounded-lg shadow-sm border border-green-200">
              <p className="text-green-700 italic mb-2">
                "And whoever relies upon Allah - then He is sufficient for him. Indeed, Allah will accomplish His purpose."
              </p>
              <p className="text-sm text-green-600">- Quran 65:3</p>
            </div>
          </div>
        ) : (
          // Web Content Display
          renderWebContent(currentUrl)
        )}
      </div>
    </div>
  );
};

export default IslamicBrowser;
