import { useEffect, useState } from 'react';

function ThemeSettings() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('dashboard-theme') || 'light';
  });

  useEffect(() => {
    localStorage.setItem('dashboard-theme', theme);
  }, [theme]);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
      <div>
        <h3 className="text-xl font-semibold text-gray-900">Website Settings</h3>
        <p className="text-sm text-gray-600">Store UI preferences for your team.</p>
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => setTheme('light')}
          className={`px-4 py-2 rounded-lg text-sm font-medium border ${
            theme === 'light'
              ? 'border-cyan-500 text-cyan-700 bg-cyan-50'
              : 'border-gray-300 text-gray-600'
          }`}
        >
          Light
        </button>
        <button
          type="button"
          onClick={() => setTheme('dark')}
          className={`px-4 py-2 rounded-lg text-sm font-medium border ${
            theme === 'dark'
              ? 'border-cyan-500 text-cyan-700 bg-cyan-50'
              : 'border-gray-300 text-gray-600'
          }`}
        >
          Dark
        </button>
      </div>
    </div>
  );
}

export default ThemeSettings;
