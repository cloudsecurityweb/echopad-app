function Tabs({ tabs = [], active, onChange }) {
  return (
    <div className="flex gap-2 flex-wrap">
      {tabs.map(tab => {
        const isActive = tab.value === active;

        return (
          <button
            key={tab.value}
            onClick={() => onChange(tab.value)}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium transition-all
              ${
                isActive
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md"
                  : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
              }
            `}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}

export default Tabs;
