function LicenseUsageBar({ percent }) {
  const safePercent = Math.min(Math.max(percent, 0), 100);

  return (
    <div className="w-full">
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          className="h-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 transition-all duration-500"
          style={{ width: `${safePercent}%` }}
        />
      </div>

      <div className="flex justify-end mt-1">
        <span className="text-xs text-gray-500">
          {Math.round(safePercent)}%
        </span>
      </div>
    </div>
  );
}

export default LicenseUsageBar;
