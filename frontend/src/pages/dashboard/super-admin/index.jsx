
import ProfileSection from "./sections/ProfileSection";
import ProductsSection from "./sections/ProductsSection";
import AnalyticsSection from "./sections/AnalyticsSection";
import FeedbackSection from "./sections/FeedbackSection";
import HelpCenterSection from "./sections/HelpCenterSection";
import { useRole } from "../../../contexts/RoleContext";
import ClientsSection from "./sections/ClientsSection";
import LicensesSection from "./sections/LicensesSection";

function SuperAdminProfile() {
  const { isSuperAdmin } = useRole();

  if (!isSuperAdmin) {
    return (
      <div className="max-w-6xl mx-auto bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <p className="text-red-700">
          You don't have permission to access this page.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-12">
      <header>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
          Super Admin
        </h1>
        <p className="text-lg text-gray-600 mt-2">
          Platform-wide control and visibility
        </p>
      </header>

      <ProfileSection />
      <ProductsSection />
      <AnalyticsSection />
      <ClientsSection />
      <LicensesSection />
      <FeedbackSection />
      <HelpCenterSection />
    </div>
  );
}

export default SuperAdminProfile;
