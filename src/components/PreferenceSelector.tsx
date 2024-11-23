import { useState } from 'react';
import { Search, Check, X } from 'lucide-react';
import useStore from '../store/useStore';
import { cn } from '../utils/cn';

interface PreferenceSelectorProps {
  languages: { code: string; name: string }[];
  countries: { code: string; name: string }[];
  categories: { id: string; name: string }[];
}

export default function PreferenceSelector({
  languages,
  countries,
  categories
}: PreferenceSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const { settings, updateSettings } = useStore();

  const sections = [
    {
      title: 'Languages',
      items: languages,
      selected: settings.preferredLanguages,
      idKey: 'code',
      nameKey: 'name',
      updateKey: 'preferredLanguages'
    },
    {
      title: 'Countries',
      items: countries,
      selected: settings.preferredCountries,
      idKey: 'code',
      nameKey: 'name',
      updateKey: 'preferredCountries'
    },
    {
      title: 'Categories',
      items: categories,
      selected: settings.preferredCategories,
      idKey: 'id',
      nameKey: 'name',
      updateKey: 'preferredCategories'
    }
  ];

  const handleToggleAll = (section: typeof sections[0], select: boolean) => {
    const ids = select ? section.items.map(item => item[section.idKey]) : [];
    updateSettings({ [section.updateKey]: ids });
  };

  const handleToggleItem = (section: typeof sections[0], itemId: string) => {
    const newSelection = section.selected.includes(itemId)
      ? section.selected.filter(id => id !== itemId)
      : [...section.selected, itemId];
    updateSettings({ [section.updateKey]: newSelection });
  };

  return (
    <div className="space-y-8">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search preferences..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg
            bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {sections.map(section => {
        const filteredItems = section.items.filter(item =>
          item[section.nameKey].toLowerCase().includes(searchQuery)
        );

        return (
          <div key={section.title} className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">{section.title}</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => handleToggleAll(section, true)}
                  className="text-sm text-blue-500 hover:text-blue-600"
                >
                  Select All
                </button>
                <button
                  onClick={() => handleToggleAll(section, false)}
                  className="text-sm text-blue-500 hover:text-blue-600"
                >
                  Clear
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {filteredItems.map(item => (
                <button
                  key={item[section.idKey]}
                  onClick={() => handleToggleItem(section, item[section.idKey])}
                  className={cn(
                    'flex items-center gap-2 p-2 rounded-lg text-left transition-colors',
                    section.selected.includes(item[section.idKey])
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                  )}
                >
                  {section.selected.includes(item[section.idKey]) ? (
                    <Check className="w-4 h-4 flex-shrink-0" />
                  ) : (
                    <div className="w-4 h-4" />
                  )}
                  <span className="truncate">{item[section.nameKey]}</span>
                </button>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}