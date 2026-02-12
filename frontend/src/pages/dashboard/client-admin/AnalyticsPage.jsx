import { useRole } from '../../../contexts/RoleContext';
import { useOrganization } from '../../../hooks/useOrganization';
import { useAnalyticsClientAdmin } from '../../../hooks/useAnalyticsClientAdmin';
import AnalyticsOverview from '../../../components/analytics/AnalyticsOverview';
import DashboardSectionLayout from '../../../components/layout/DashboardSectionLayout';

function AnalyticsPage() {
  const { isClientAdmin } = useRole();
  const { organization, orgId } = useOrganization();
  const { summary, loading, error } = useAnalyticsClientAdmin(isClientAdmin ? orgId : null);

  return (
    <DashboardSectionLayout
      title="Analytics"
      description={`Usage and license insights for ${organization?.name || 'your organization'}`}
    >
      <div className="max-w-7xl mx-auto space-y-8">
        <AnalyticsOverview summary={summary} loading={loading} error={error} />
      </div>
    </DashboardSectionLayout>
  );
}

export default AnalyticsPage;
