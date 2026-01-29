function EmptyState({
  title = "No data available",
  description = "Once data is available, it will appear here.",
  action,
}) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 px-6 border border-dashed border-gray-300 rounded-xl bg-gray-50">
      <div className="text-4xl mb-3">📭</div>

      <h3 className="text-lg font-semibold text-gray-900">
        {title}
      </h3>

      <p className="text-sm text-gray-600 mt-1 max-w-md">
        {description}
      </p>

      {action && (
        <div className="mt-4">
          {action}
        </div>
      )}
    </div>
  );
}

export default EmptyState;
