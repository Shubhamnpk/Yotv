import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import useStore from '../store/useStore';

export default function ThemeEditor() {
  const { settings, addCustomTheme, removeCustomTheme, updateSettings } =
    useStore();
  const [newTheme, setNewTheme] = useState({
    name: '',
    primary: '#3b82f6',
    secondary: '#60a5fa',
    background: '#ffffff',
    text: '#111827',
  });

  const handleAddTheme = () => {
    if (!newTheme.name) return;

    // Check if theme name is unique
    if (settings.customThemes.some((theme) => theme.name === newTheme.name)) {
      alert('Theme name must be unique');
      return;
    }

    addCustomTheme({
      id: `theme-${Date.now()}`,
      ...newTheme,
    });

    setNewTheme({
      name: '',
      primary: '#3b82f6',
      secondary: '#60a5fa',
      background: '#ffffff',
      text: '#111827',
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Custom Themes</h3>
        <div className="grid gap-4">
          {settings.customThemes.map((theme) => (
            <div
              key={theme.id}
              className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center gap-4">
                <div className="flex gap-2">
                  {['primary', 'secondary', 'background', 'text'].map((key) => (
                    <div
                      key={key}
                      className="w-6 h-6 rounded-full border border-gray-200 dark:border-gray-700"
                      style={{ backgroundColor: theme[key] }}
                    />
                  ))}
                </div>
                <span className="font-medium">{theme.name}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    updateSettings({
                      theme: 'custom',
                      activeCustomTheme: theme.id,
                    })
                  }
                  className="px-3 py-1 text-sm rounded-md bg-blue-500 text-white hover:bg-blue-600"
                  aria-label={`Apply ${theme.name} theme`}
                >
                  Apply
                </button>
                <button
                  onClick={() => removeCustomTheme(theme.id)}
                  className="p-2 text-red-500 hover:text-red-600"
                  aria-label={`Remove ${theme.name} theme`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Create New Theme</h3>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Theme name"
            value={newTheme.name}
            onChange={(e) =>
              setNewTheme((prev) => ({ ...prev, name: e.target.value }))
            }
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600
              bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <div className="grid grid-cols-2 gap-4">
            {Object.entries(newTheme).map(([key, value]) => {
              if (key === 'name') return null;
              return (
                <div key={key} className="space-y-2">
                  <label className="block text-sm font-medium capitalize">
                    {key} Color
                  </label>
                  <input
                    type="color"
                    value={value}
                    onChange={(e) =>
                      setNewTheme((prev) => ({
                        ...prev,
                        [key]: e.target.value,
                      }))
                    }
                    className="w-full h-10 rounded-lg cursor-pointer"
                  />
                </div>
              );
            })}
          </div>

          <button
            onClick={handleAddTheme}
            disabled={!newTheme.name}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500 text-white
              hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" />
            Add Theme
          </button>
        </div>
      </div>
    </div>
  );
}
