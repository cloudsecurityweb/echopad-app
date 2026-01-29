import { useState } from "react";
import Section from "../components/Section";
import LicensesTable from "../components/LicensesTable";
import ActivateLicenseModal from "../components/ActivateLicenseModal";
import { useLicenses } from "../../../../hooks/useLicenses";

function LicensesSection() {
  const tenantId = "tenant_test"; // later from auth / context
  const {
    assignments,
    revokeLicense,
    activateLicense,
  } = useLicenses(tenantId);

  const [selectedLicense, setSelectedLicense] = useState(null);

  return (
    <Section title="Licenses">
      <LicensesTable
        licenses={assignments}
        onActivate={lic => {
          console.log("Open activate modal for:", lic.id);
          setSelectedLicense(lic);
        }}
        onRevoke={lic => {
          console.log("Revoke license:", lic.id);
          revokeLicense({ licenceId: lic.id });
        }}
      />

      {selectedLicense && (
        <ActivateLicenseModal
          license={selectedLicense}
          onClose={() => setSelectedLicense(null)}
          onActivate={(userId) => {
            console.log("Activate license:", {
              licenceId: selectedLicense.id,
              userId,
            });

            activateLicense({
              tenantId,
              licenceId: selectedLicense.id,
              userId,
              email: selectedLicense.userEmail,
            });

            setSelectedLicense(null);
          }}
        />
      )}
    </Section>
  );
}

export default LicensesSection;
