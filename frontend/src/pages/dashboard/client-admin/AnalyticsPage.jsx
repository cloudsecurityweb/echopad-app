import { useRole } from '../../../contexts/RoleContext';
import { useOrganization } from '../../../hooks/useOrganization';
import { useAnalyticsClientAdmin } from '../../../hooks/useAnalyticsClientAdmin';
import AnalyticsOverview from '../../../components/analytics/AnalyticsOverview';

function AnalyticsPage() {
  const { isClientAdmin } = useRole();
  const { organization, orgId } = useOrganization();
  const { summary, loading, error } = useAnalyticsClientAdmin(orgId);

  if (!isClientAdmin) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-700">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Analytics</h1>
        <p className="text-xl text-gray-600">
          Usage and license insights for {organization?.name || 'your organization'}.
        </p>
      </div>

      <AnalyticsOverview summary={summary} loading={loading} error={error} />
    </div>
  );
}

export default AnalyticsPage;
