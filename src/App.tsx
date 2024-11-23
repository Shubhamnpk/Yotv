import { useState, useEffect, useMemo, Suspense } from 'react';
import { Tv, Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchChannels, fetchStreams, fetchCategories, fetchLanguages } from './api';
import type { Channel, Stream, Category, Language } from './types';
import { isValidStreamUrl } from './utils/streamUtils';
import LoadingScreen from './components/LoadingScreen';
import VideoPlayer from './components/VideoPlayer';
import ChannelGrid from './components/ChannelGrid';
import QuickFilters from './components/QuickFilters';
import Settings from './components/Settings';
import { ErrorBoundary } from './components/ErrorBoundary';
import useStore from './store/useStore';
import youtubeSourcesData from './data/youtube-sources.json';

function App() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [streams, setStreams] = useState<Stream[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<Channel | null>(null);
  const [selectedStream, setSelectedStream] = useState<Stream | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  
  const { settings, addToWatchHistory } = useStore();

  useEffect(() => {
    const abortController = new AbortController();

    const fetchData = async () => {
      try {
        const [channelsData, streamsData, categoriesData, languagesData] = await Promise.all([
          fetchChannels(),
          fetchStreams(),
          fetchCategories(),
          fetchLanguages(),
        ].map(promise => 
          promise.catch(error => {
            console.error('Error fetching data:', error);
            return [];
          })
        ));

        if (abortController.signal.aborted) return;

        const youtubeChannels = youtubeSourcesData.sources.map(source => ({
          id: source.id,
          name: source.name,
          country: source.country,
          languages: [source.lang],
          categories: source.categories,
          logo: source.img
        }));

        const youtubeStreams = youtubeSourcesData.sources.map(source => ({
          channel: source.id,
          url: source.url
        }));

        setChannels([...channelsData, ...youtubeChannels]);
        setStreams([
          ...streamsData.filter(stream => isValidStreamUrl(stream.url)),
          ...youtubeStreams
        ]);
        setCategories(categoriesData);
        setLanguages(languagesData);
      } finally {
        if (!abortController.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => abortController.abort();
  }, []);

  const validChannels = useMemo(() => {
    return channels.filter(channel => 
      streams.some(stream => stream.channel === channel.id)
    );
  }, [channels, streams]);

  const filteredChannels = useMemo(() => {
    return validChannels.filter(channel => {
      const matchesSearch = channel.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !selectedCategory || channel.categories.includes(selectedCategory);
      const matchesLanguage = !selectedLanguage || channel.languages.includes(selectedLanguage);
      const matchesPreferences = 
        settings.preferredCategories.length === 0 || 
        channel.categories.some(cat => settings.preferredCategories.includes(cat));
      return matchesSearch && matchesCategory && matchesLanguage && matchesPreferences;
    });
  }, [validChannels, searchQuery, selectedCategory, selectedLanguage, settings.preferredCategories]);

  const handleChannelSelect = (channel: Channel) => {
    const stream = streams.find(s => s.channel === channel.id);
    setSelectedChannel(channel);
    setSelectedStream(stream || null);
    addToWatchHistory(channel.id);
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <ErrorBoundary>
      <div className={`min-h-screen ${settings.theme === 'dark' ? 'dark' : ''}`}>
        <div className="bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen">
          <header className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <motion.div 
                  className="flex items-center gap-2"
                  whileHover={{ scale: 1.05 }}
                >
                  <Tv className="h-8 w-8 text-blue-500" />
                  <h1 className="text-xl font-bold">Modern IPTV</h1>
                </motion.div>
                
                <div className="flex items-center gap-4">
                  <motion.div 
                    className="relative"
                    initial={false}
                    animate={{ width: searchQuery ? 300 : 240 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="text"
                      placeholder="Search channels..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700
                        focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                    <AnimatePresence>
                      {searchQuery && (
                        <motion.button
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          onClick={() => setSearchQuery('')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          <X size={20} />
                        </motion.button>
                      )}
                    </AnimatePresence>
                  </motion.div>
                  
                  <Settings
                    languages={languages}
                    countries={[]}
                    categories={categories}
                  />
                </div>
              </div>
            </div>
          </header>

          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <AnimatePresence mode="wait">
              {selectedChannel && selectedStream ? (
                <motion.div
                  key="player"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="max-w-4xl mx-auto"
                >
                  <motion.button
                    whileHover={{ x: -5 }}
                    onClick={() => {
                      setSelectedChannel(null);
                      setSelectedStream(null);
                    }}
                    className="text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 mb-4"
                  >
                    ← Back to channels
                  </motion.button>
                  
                  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
                    <Suspense fallback={<div className="aspect-video bg-gray-900 animate-pulse" />}>
                      <VideoPlayer src={selectedStream.url} poster={selectedChannel.logo} />
                    </Suspense>
                    <div className="p-4">
                      <h2 className="text-xl font-semibold">{selectedChannel.name}</h2>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {selectedChannel.categories.map(category => (
                          <span key={category} className="text-sm px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full">
                            {category}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="grid"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <QuickFilters
                    categories={categories}
                    languages={languages}
                    countries={[]}
                    onCategoryChange={setSelectedCategory}
                    onLanguageChange={setSelectedLanguage}
                  />
                  <ChannelGrid
                    channels={filteredChannels}
                    onChannelSelect={handleChannelSelect}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>
    </ErrorBoundary>
  );
}

export default App;