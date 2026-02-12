import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';
import { listOrganizationsDetails } from '../../../api/organizations.api';
import DashboardSectionLayout from '../../../components/layout/DashboardSectionLayout';
// Removed: ManageOrgModal

const ITEMS_PER_PAGE = 10; // Number of items per page for pagination

function SuperAdminClients() {
  const navigate = useNavigate();
  const { getAccessToken } = useAuth();
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  // Removed: isModalOpen, selectedClient state variables as we navigate to a new page now

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const token = await getAccessToken();
        const response = await listOrganizationsDetails(token);
        console.log('Fetched clients:', response.data?.data);
        setClients(response.data?.data || []);
      } catch (err) {
        setError('Failed to fetch clients.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchClients();
  }, [getAccessToken]);

  const filteredClients = clients.filter(client => {
    const clientName = client.name || '';
    const matchesSearch = clientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || (client.status && client.status.toLowerCase()) === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredClients.length / ITEMS_PER_PAGE);
  const paginatedClients = filteredClients.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <DashboardSectionLayout
      title="Clients"
      description="Manage and monitor all platform clients"
    >
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search clients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
            />
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Clients
        </h1>
        <p className="text-xl text-gray-600">
          Manage and monitor all platform clients
        </p>
      </div>

      {isLoading ? (
        <div className="animate-pulse">
          {/* Filter Bar Skeleton */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 h-10 bg-gray-200 rounded-lg"></div>
              <div className="h-10 w-48 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
          {/* Table Skeleton */}
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 mb-8">
            <div className="h-6 w-32 bg-gray-200 rounded mb-6"></div>
            <div className="space-y-4">
              {/* Header Row */}
              <div className="flex gap-4 pb-3 border-b border-gray-200">
                {[120, 80, 140, 60, 50, 50, 100].map((w, i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded" style={{ width: w }}></div>
                ))}
              </div>
              {/* Data Rows */}
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex gap-4 py-3">
                  {[120, 80, 140, 60, 50, 50, 100].map((w, j) => (
                    <div key={j} className="h-4 bg-gray-200 rounded" style={{ width: w }}></div>
                  ))}
                </div>
              ))}
            </div>
            {/* Pagination Skeleton */}
            <div className="flex justify-between items-center mt-6">
              <div className="h-10 w-24 bg-gray-200 rounded-lg"></div>
              <div className="h-4 w-28 bg-gray-200 rounded"></div>
              <div className="h-10 w-24 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search clients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                />
              </div>
              <div className="md:w-48">
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="trial">Trial</option>
                  <option value="expired">Expired</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </div>

      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">All Clients</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Client Org Name</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Organizer</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Email</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Products</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Licenses</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedClients.map((client) => (
                <tr key={client.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4 text-sm font-medium text-gray-900">{client.name}</td>
                  <td className="py-4 px-4 text-sm text-gray-700">{client.organizer || '-'}</td>
                  <td className="py-4 px-4 text-sm text-gray-700">
                    {client.email ? (
                      <a href={`mailto:${client.email}`} className="text-blue-600 hover:underline">
                        {client.email}
                      </a>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${client.status === 'Active'
                      ? 'bg-green-100 text-green-800'
                      : client.status === 'Trial'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                      }`}>
                      {client.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-700">{client.productsCount || 0}</td>
                  <td className="py-4 px-4 text-sm text-gray-700">{client.licensesCount || 0}</td>
                  <td className="py-4 px-4">
                    <button
                      onClick={() => navigate(`/dashboard/clients/client/${client.tenantId}/${client.id}`)}
                      className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium text-sm shadow hover:from-cyan-400 hover:to-blue-500 transition-all cursor-pointer"
                    >
                      Manage Client Org
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="flex justify-between items-center mt-6">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50"
          >
            Previous
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
      </>
      )}
    </div>
    </DashboardSectionLayout>
  );
}

export default SuperAdminClients;
