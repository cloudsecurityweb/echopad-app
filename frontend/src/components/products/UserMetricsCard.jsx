import React from 'react';

const UserMetricsCard = ({ activeProduct }) => {
  if (!activeProduct) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Product Usage Metrics</h3>
        <p className="text-gray-500">Select a product to view its usage metrics.</p>
      </div>
    );
  }

  // Dummy data for demonstration. In a real app, this would come from an API.
  const metrics = [
    {
      id: 1,
      label: 'Minutes Used',
      value: '1,245',
      change: '+15%',
      trend: [100, 120, 150, 130, 160, 180, 200, 220, 250, 230, 260, 280],
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      id: 2,
      label: 'Documents Processed',
      value: '235',
      change: '+8%',
      trend: [50, 60, 70, 65, 80, 90, 100, 95, 110, 105, 120, 130],
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      id: 3,
      label: 'Features Accessed',
      value: '12',
      change: '+20%',
      trend: [200, 210, 230, 220, 250, 270, 290, 280, 310, 300, 330, 350],
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.094 2.094A1.002 1.002 0 0113.293 4H15a2 2 0 012 2v2a2 2 0 01-2 2H9.5a2 2 0 01-2-2V6a2 2 0 012-2h1.707a1 1 0 01.707.293zM13 17h6M17 14v6" />
        </svg>
      ),
    },
    {
      id: 4,
      label: 'Storage Used',
      value: '450 MB',
      change: '+5%',
      trend: [200, 210, 220, 230, 240, 250, 260, 270, 280, 290, 300, 310],
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10l-2 1V6l2-1h16l2 1v12l-2-1V7M4 7h16" />
        </svg>
      ),
    },
  ];

  // const valueFormatter = (number) => `${Intl.NumberFormat('us').format(number).toString()}`; // Not used without Tremor

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">Usage Metrics for {activeProduct.name}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => (
          <div key={metric.id} className="p-4 bg-gray-50 rounded-lg border border-gray-100">
            <div className="flex items-center justify-between mb-3">
              {metric.icon}
              <span className={`text-sm font-semibold ${metric.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                {metric.change}
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-1">{metric.label}</p>
            <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
            <div className="mt-3 h-10 flex items-end justify-center overflow-hidden relative">
              <div className="relative z-10 flex items-end justify-between w-full h-full">
                <div className="w-2 h-4 bg-cyan-400 rounded-t-full shadow-md"></div>
                <div className="w-2 h-7 bg-blue-500 rounded-t-full shadow-md"></div>
                <div className="w-2 h-5 bg-cyan-500 rounded-t-full shadow-md"></div>
                <div className="w-2 h-8 bg-blue-600 rounded-t-full shadow-md"></div>
                <div className="w-2 h-6 bg-cyan-600 rounded-t-full shadow-md"></div>
                <div className="w-2 h-9 bg-blue-700 rounded-t-full shadow-md"></div>
                <div className="w-2 h-7 bg-cyan-500 rounded-t-full shadow-md"></div>
                <div className="w-2 h-10 bg-blue-600 rounded-t-full shadow-md"></div>
                <div className="w-2 h-8 bg-cyan-600 rounded-t-full shadow-md"></div>
                <div className="w-2 h-11 bg-blue-700 rounded-t-full shadow-md"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserMetricsCard;
