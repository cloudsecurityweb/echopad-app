// Matches dashboardMetrics schema
export const dashboardMetrics = {
  id: "dashboard_super_admin_global_tenant_1",
  tenantId: "tenant_1",
  role: "SUPER_ADMIN",
  metricScope: "GLOBAL",
  metricName: "OVERVIEW",
  data: {
    totalClients: 247,
    activeLicenses: 1234,
    products: 2,
    monthlyUsage: 84231,
  },
};

// Matches products schema
export const products = [
  {
    productCode: "AI_SCRIBE",
    name: "AI Scribe",
    status: "ACTIVE",
    description: "Clinical documentation assistant",
  },
  {
    productCode: "BENCHMARK",
    name: "Benchmark",
    status: "ACTIVE",
    description: "Performance benchmarking platform",
  },
];

// Matches licenseAssignments schema
export const licenseSummaryByProduct = {
  AI_SCRIBE: {
    allocated: 450,
    used: 387,
  },
  BENCHMARK: {
    allocated: 300,
    used: 142,
  },
};

// Matches user schema
export const superAdminProfile = {
  tenantId: "tenant_1",
  userId: "user_1",
  email: "admin@csw.ai",
  role: "SUPER_ADMIN",
  status: "ACTIVE",
};

// Dummy feedback (Intercom-ready)
export const feedbackItems = [
  {
    id: "fb_1",
    clientName: "Acme Corp",
    status: "ESCALATED",
    subject: "Critical issue with transcription delay",
  },
  {
    id: "fb_2",
    clientName: "TechStart",
    status: "NEW",
    subject: "Feature request for exports",
  },
];

export const clients = [
  {
    id: "client_1",
    tenantId: "tenant_1",
    name: "Acme Corporation",
    status: "Active",
    subscriptionTier: "Enterprise",
  },
  {
    id: "client_2",
    tenantId: "tenant_2",
    name: "TechStart Inc",
    status: "Active",
    subscriptionTier: "Professional",
  },
];
