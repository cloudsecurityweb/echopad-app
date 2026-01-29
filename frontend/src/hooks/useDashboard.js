import { useEffect, useState } from "react";
import { fetchDashboardMetrics } from "../api/dashboard.api";

export function useDashboard({ tenantId, role }) {
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {

    fetchDashboardMetrics(tenantId, role).then(res => {
      setMetrics(res.data?.data?.dashboard);
    });
  }, [tenantId, role]);

  return { metrics };
}
