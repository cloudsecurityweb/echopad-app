import Section from "../components/Section";
import MetricCard from "../components/MetricCard";
import { useDashboard } from "../../../../hooks/useDashboard";

/**
 * Converts metric keys to readable labels
 * invitesSent        → Invites Sent
 * availableLicenses  → Available Licenses
 * licensesInUse      → Licenses In Use
 */
function formatMetricLabel(key) {
  return key
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, char => char.toUpperCase());
}

function AnalyticsSection() {
  const { metrics } = useDashboard({
    tenantId: "tenant_test",
    role: "CLIENT_ADMIN",
  });

  if (!metrics || !metrics.data) return null;

  // 🔑 This matches your API response exactly
  const dashboardMetrics = metrics.data;

  return (
    <Section title="Analytics">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Object.entries(dashboardMetrics).map(([key, value]) => (
          <MetricCard
            key={key}
            label={formatMetricLabel(key)}
            value={value}
          />
        ))}
      </div>
    </Section>
  );
}

export default AnalyticsSection;
