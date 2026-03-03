import BillingSection from './BillingSection';
import InvitesSection from './InvitesSection';
import UsageSection from './UsageSection';

function ProductTab({
  product,
  productLicenses,
  users,
  licenses,
  userLicenses,
  getAccessToken,
  onRevokeLicense,
  onAssignLicense,
  usageData,
  usageLoading,
  usageError,
  onRequestLicense,
}) {
  const productCode = product.productCode || product.productId;

  return (
    <div className="space-y-6">
      <BillingSection licenses={productLicenses} product={product} onRequestLicense={onRequestLicense} />

      <InvitesSection
        users={users}
        licenses={licenses}
        userLicenses={userLicenses}
        productCode={productCode}
        onRevokeLicense={onRevokeLicense}
        onAssignLicense={onAssignLicense}
        getAccessToken={getAccessToken}
      />

      <UsageSection users={users} product={product} usage={usageData} loading={usageLoading} error={usageError} />
    </div>
  );
}

export default ProductTab;
