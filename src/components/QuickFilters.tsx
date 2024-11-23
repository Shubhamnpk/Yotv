import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import useStore from '../store/useStore';
import { cn } from '../utils/cn';

interface QuickFiltersProps {
  languages: { code: string; name: string }[];
  countries: { code: string; name: string }[];
  categories: { id: string; name: string }[];
  onLanguageChange: (lang: string | null) => void;
  onCategoryChange: (cat: string | null) => void;
}

export default function QuickFilters({
  languages,
  countries,
  categories,
  onLanguageChange,
  onCategoryChange
}: QuickFiltersProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const { settings } = useStore();

  const sections = [
    {
      id: 'languages',
      title: 'Popular Languages',
      items: languages.slice(0, 5),
      allItems: languages,
      selected: settings.preferredLanguages,
      onChange: onLanguageChange,
      getLabel: (item: any) => item.name,
      getValue: (item: any) => item.code
    },
    {
      id: 'categories',
      title: 'Top Categories',
      items: categories.slice(0, 5),
      allItems: categories,
      selected: settings.preferredCategories,
      onChange: onCategoryChange,
      getLabel: (item: any) => item.name,
      getValue: (item: any) => item.id
    }
  ];

  return (
    <div className="space-y-6 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
      <div className="grid gap-6 md:grid-cols-2">
        {sections.map(section => (
          <div key={section.id} className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {section.title}
              </h3>
              <button
                onClick={() => setExpandedSection(
                  expandedSection === section.id ? null : section.id
                )}
                className="text-sm text-blue-500 hover:text-blue-600 flex items-center gap-1"
              >
                More
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {section.items.map(item => (
                <button
                  key={section.getValue(item)}
                  onClick={() => section.onChange(section.getValue(item))}
                  className={cn(
                    'px-3 py-1.5 text-sm rounded-full transition-all',
                    'hover:ring-2 hover:ring-blue-500/20 active:scale-95',
                    section.selected.includes(section.getValue(item))
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  )}
                >
                  {section.getLabel(item)}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {expandedSection && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="space-y-4">
                {sections.find(s => s.id === expandedSection)?.allItems.map(item => {
                  const section = sections.find(s => s.id === expandedSection)!;
                  return (
                    <button
                      key={section.getValue(item)}
                      onClick={() => section.onChange(section.getValue(item))}
                      className={cn(
                        'w-full text-left px-4 py-2 rounded-lg transition-colors',
                        section.selected.includes(section.getValue(item))
                          ? 'bg-blue-500 text-white'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                      )}
                    >
                      {section.getLabel(item)}
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}