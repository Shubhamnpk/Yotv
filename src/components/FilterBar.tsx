import { motion } from 'framer-motion';
import { Filter as FilterIcon } from 'lucide-react';

interface FilterBarProps {
  categories: { id: string; name: string }[];
  languages: { code: string; name: string }[];
  selectedCategory: string | null;
  selectedLanguage: string | null;
  onCategoryChange: (category: string | null) => void;
  onLanguageChange: (language: string | null) => void;
}

export default function FilterBar({
  categories,
  languages,
  selectedCategory,
  selectedLanguage,
  onCategoryChange,
  onLanguageChange,
}: FilterBarProps) {
  return (
    <div className="flex flex-col gap-4 p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-2">
        <FilterIcon className="w-5 h-5" />
        <h2 className="font-semibold">Filters</h2>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium mb-2">Categories</h3>
          <div className="flex flex-wrap gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onCategoryChange(null)}
              className={`px-3 py-1 rounded-full text-sm ${
                selectedCategory === null
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              All
            </motion.button>
            {categories.map((category) => (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onCategoryChange(category.id)}
                className={`px-3 py-1 rounded-full text-sm ${
                  selectedCategory === category.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {category.name}
              </motion.button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-2">Languages</h3>
          <div className="flex flex-wrap gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onLanguageChange(null)}
              className={`px-3 py-1 rounded-full text-sm ${
                selectedLanguage === null
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              All
            </motion.button>
            {languages.map((language) => (
              <motion.button
                key={language.code}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onLanguageChange(language.code)}
                className={`px-3 py-1 rounded-full text-sm ${
                  selectedLanguage === language.code
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {language.name}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}