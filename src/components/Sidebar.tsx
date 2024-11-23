import { Filter } from 'lucide-react';
import type { Category, Language } from '../types';

interface SidebarProps {
  categories: Category[];
  languages: Language[];
  selectedCategory: string | null;
  selectedLanguage: string | null;
  onCategoryChange: (category: string | null) => void;
  onLanguageChange: (language: string | null) => void;
}

export default function Sidebar({
  categories,
  languages,
  selectedCategory,
  selectedLanguage,
  onCategoryChange,
  onLanguageChange,
}: SidebarProps) {
  return (
    <div className="w-64 bg-white border-r border-gray-200 p-4 space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Filter size={20} />
          <h2 className="text-lg font-semibold">Filters</h2>
        </div>
        
        <div className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Categories</h3>
            <div className="space-y-2">
              <button
                className={`w-full text-left px-3 py-2 rounded-lg ${
                  selectedCategory === null ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
                }`}
                onClick={() => onCategoryChange(null)}
              >
                All Categories
              </button>
              {categories.map(category => (
                <button
                  key={category.id}
                  className={`w-full text-left px-3 py-2 rounded-lg ${
                    selectedCategory === category.id ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => onCategoryChange(category.id)}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Languages</h3>
            <div className="space-y-2">
              <button
                className={`w-full text-left px-3 py-2 rounded-lg ${
                  selectedLanguage === null ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
                }`}
                onClick={() => onLanguageChange(null)}
              >
                All Languages
              </button>
              {languages.map(language => (
                <button
                  key={language.code}
                  className={`w-full text-left px-3 py-2 rounded-lg ${
                    selectedLanguage === language.code ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => onLanguageChange(language.code)}
                >
                  {language.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}