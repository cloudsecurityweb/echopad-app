import BillingSection from './BillingSection';
import InvitesSection from './InvitesSection';
import UsageSection from './UsageSection';

function ProductTab({
  product,
  license,
  users,
  licenses,
  userLicenses,
  getAccessToken,
  onAssignLicense,
  onRevokeLicense,
  usageData,
  usageLoading,
  usageError,
}) {
  const productCode = product.productCode || product.productId;

  return (
    <div className="space-y-6">
      <BillingSection license={license} product={product} />

      <InvitesSection
        users={users}
        licenses={licenses}
        userLicenses={userLicenses}
        productCode={productCode}
        onAssignLicense={onAssignLicense}
        onRevokeLicense={onRevokeLicense}
        getAccessToken={getAccessToken}
      />

      <UsageSection usage={usageData} loading={usageLoading} error={usageError} />
    </div>
  );
}

export default ProductTab;
