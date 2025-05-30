
import { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, RotateCcw, Home, Bookmark, Globe, Plus, X, Search, Settings } from "lucide-react";
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
    { id: "1", title: "Islamic Web Browser", url: "https://islamqa.info", isActive: true }
  ]);
  const [currentUrl, setCurrentUrl] = useState("https://islamqa.info");
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([
    { id: "1", title: "IslamQA", url: "https://islamqa.info", category: "Islamic Knowledge" },
    { id: "2", title: "Quran.com", url: "https://quran.com", category: "Quran" },
    { id: "3", title: "Sunnah.com", url: "https://sunnah.com", category: "Hadith" },
    { id: "4", title: "IslamicFinder", url: "https://islamicfinder.org", category: "Prayer Times" },
    { id: "5", title: "Bayyinah TV", url: "https://bayyinah.tv", category: "Education" }
  ]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [canGoBack, setCanGoBack] = useState(false);
  const [canGoForward, setCanGoForward] = useState(false);
  const { toast } = useToast();

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
      setCurrentUrl(newTabs[nextActiveIndex].url);
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
      // Add to history
      const historyItem: HistoryItem = {
        id: Date.now().toString(),
        title: url,
        url: url,
        timestamp: new Date()
      };
      setHistory(prev => [historyItem, ...prev.slice(0, 99)]);
      
      // Update current tab
      setTabs(prev => prev.map(tab => 
        tab.isActive ? { ...tab, url: url, title: getDomainFromUrl(url) } : tab
      ));
      setCurrentUrl(url);
      setCanGoBack(true);
      
      // Simulate navigation
      window.open(url, '_blank');
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
    toast({
      title: "Going Back",
      description: "Navigating to previous page",
    });
    setCanGoForward(true);
  };

  const goForward = () => {
    toast({
      title: "Going Forward",
      description: "Navigating to next page",
    });
  };

  const refresh = () => {
    toast({
      title: "Refreshing",
      description: "Reloading current page",
    });
  };

  const goHome = () => {
    navigateToUrl("https://islamqa.info");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex flex-col">
      {/* Browser Header */}
      <div className="bg-white border-b shadow-sm">
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
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={goForward}
              disabled={!canGoForward}
              className="w-8 h-8 p-0"
            >
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={refresh}
              className="w-8 h-8 p-0"
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={goHome}
              className="w-8 h-8 p-0"
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
            >
              <Bookmark className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowBookmarks(!showBookmarks)}
              className="w-8 h-8 p-0"
            >
              <Settings className="w-4 h-4" />
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
          // Web Content Simulation
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-4 text-green-800">
              Website Content: {getDomainFromUrl(currentUrl)}
            </h2>
            <p className="text-gray-600 mb-4">
              This is a simulation of browsing to: <strong>{currentUrl}</strong>
            </p>
            <p className="text-gray-600">
              In a real browser, this would display the actual website content. 
              The Islamic Web Browser provides a safe, curated browsing experience 
              with built-in Islamic features and content filtering.
            </p>
            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <p className="text-green-800">
                <strong>Islamic Features:</strong> Built-in prayer time reminders, 
                Qibla direction, Islamic calendar, and curated halal content.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IslamicBrowser;
