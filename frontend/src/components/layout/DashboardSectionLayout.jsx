/**
 * Standard layout for dashboard sections (matches Help Center).
 * Use for Profile, Subscriptions, Analytics, Settings, Users, etc.
 */
function DashboardSectionLayout({ title, description, actions, children }) {
  return (
    <div className="space-y-8">
      {/* Header - same as Help Center */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <p className="text-gray-600">{description}</p>
        </div>
        {actions && <div className="flex-shrink-0">{actions}</div>}
      </div>
      {children}
    </div>
  );
}

export default DashboardSectionLayout;
