import React, { useState, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Tabs from '@radix-ui/react-tabs';
import * as Dialog from '@radix-ui/react-dialog';
import { Settings as SettingsIcon, X, Sun, Heart, History, Palette } from 'lucide-react';
import useStore from '../store/useStore';
import { cn } from '../utils/cn';

// Lazy load heavy components
const ThemeEditor = lazy(() => import('./ThemeEditor'));
const WatchHistory = lazy(() => import('./WatchHistory'));
const PreferenceSelector = lazy(() => import('./PreferenceSelector'));

interface SettingsProps {
  languages: { code: string; name: string }[];
  countries: { code: string; name: string }[];
  categories: { id: string; name: string }[];
}

const TabLoader = () => (
  <div className="p-8 flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

export default function Settings({ languages, countries, categories }: SettingsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('appearance');
  const { settings, updateSettings } = useStore();

  const tabs = [
    { id: 'appearance', icon: Sun, label: 'Appearance' },
    { id: 'preferences', icon: Heart, label: 'Preferences' },
    { id: 'history', icon: History, label: 'History' },
    { id: 'themes', icon: Palette, label: 'Themes' }
  ];

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <SettingsIcon className="w-6 h-6" />
        </motion.button>
      </Dialog.Trigger>

      <AnimatePresence>
        {isOpen && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              />
            </Dialog.Overlay>

            <Dialog.Content asChild>
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 flex items-center justify-center bg-white dark:bg-gray-800 rounded-2xl shadow-xl sm:max-w-2xl w-full max-h-[90vh] overflow-hidden z-50"
              >
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                    <Dialog.Title className="text-2xl font-bold">
                      Settings
                    </Dialog.Title>
                    <Dialog.Close asChild>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <X className="w-6 h-6" />
                      </motion.button>
                    </Dialog.Close>
                  </div>

                  <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
                    <Tabs.List className="flex border-b border-gray-200 dark:border-gray-700 px-6 overflow-x-auto">
                      {tabs.map(tab => (
                        <Tabs.Trigger
                          key={tab.id}
                          value={tab.id}
                          className={cn(
                            'flex items-center gap-2 px-4 py-3 border-b-2 border-transparent whitespace-nowrap',
                            'hover:text-blue-500 focus:outline-none transition-colors',
                            'data-[state=active]:border-blue-500 data-[state=active]:text-blue-500'
                          )}
                        >
                          <tab.icon className="w-4 h-4" />
                          {tab.label}
                        </Tabs.Trigger>
                      ))}
                    </Tabs.List>

                    <div className="p-6 overflow-y-auto">
                      <Tabs.Content value="appearance">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="space-y-6"
                        >
                          <div>
                            <h3 className="text-lg font-semibold mb-4">Theme</h3>
                            <div className="flex gap-4">
                              {['light', 'dark'].map((theme) => (
                                <motion.button
                                  key={theme}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => updateSettings({ theme: theme as 'light' | 'dark' })}
                                  className={cn(
                                    'px-4 py-2 rounded-lg transition-colors',
                                    settings.theme === theme
                                      ? 'bg-blue-500 text-white'
                                      : 'bg-gray-100 dark:bg-gray-700'
                                  )}
                                >
                                  {theme.charAt(0).toUpperCase() + theme.slice(1)}
                                </motion.button>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      </Tabs.Content>

                      <Tabs.Content value="preferences">
                        <Suspense fallback={<TabLoader />}>
                          <PreferenceSelector
                            languages={languages}
                            countries={countries}
                            categories={categories}
                          />
                        </Suspense>
                      </Tabs.Content>

                      <Tabs.Content value="history">
                        <Suspense fallback={<TabLoader />}>
                          <WatchHistory />
                        </Suspense>
                      </Tabs.Content>

                      <Tabs.Content value="themes">
                        <Suspense fallback={<TabLoader />}>
                          <ThemeEditor />
                        </Suspense>
                      </Tabs.Content>
                    </div>
                  </Tabs.Root>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}