import { useRole } from '../../contexts/RoleContext';
import StorePage from './client-admin/StorePage';
import SuperAdminProducts from './super-admin/SuperAdminProducts';
import UserAdminProducts from './user-admin/UserAdminProducts';

function Products() {
  const { isSuperAdmin, isClientAdmin, isUserAdmin } = useRole();

  if (isSuperAdmin) {
    return <SuperAdminProducts />;
  }

  if (isClientAdmin) {
    return <StorePage />;
  }

  if (isUserAdmin) {
    return <UserAdminProducts />;
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Additional Info */}
      <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl p-6 border border-cyan-200">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Need assistance with products?</h2>
        <p className="text-gray-700 mb-4">
          Contact our support team if you have questions about our products or need assistance.
        </p>
        <a
          href="#"
          className="inline-flex items-center gap-2 text-cyan-600 hover:text-cyan-700 font-medium"
        >
          Contact Support
          <i className="bi bi-arrow-right"></i>
        </a>
      </div>
    </div>
  );
}

export default Products;

