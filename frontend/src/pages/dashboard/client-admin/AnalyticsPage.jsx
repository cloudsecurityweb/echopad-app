import { useRole } from '../../../contexts/RoleContext';
import { useOrganization } from '../../../hooks/useOrganization';
import { useAnalyticsClientAdmin } from '../../../hooks/useAnalyticsClientAdmin';
import AnalyticsOverview from '../../../components/analytics/AnalyticsOverview';


function AnalyticsPage() {
  const { isClientAdmin } = useRole();
  const { organization, orgId } = useOrganization();
  const { summary, loading, error } = useAnalyticsClientAdmin(isClientAdmin ? orgId : null);


  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Analytics
        </h1>
        <p className="text-xl text-gray-600">
           Usage and license insights for {organization?.name || 'your organization'}
        </p>
      </div>

        <AnalyticsOverview summary={summary} loading={loading} error={error} />
    </div>
  );
}

export default AnalyticsPage;
