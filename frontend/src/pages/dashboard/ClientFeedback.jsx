import { useMemo, useState } from 'react';
import { useRole } from '../../contexts/RoleContext';
import { useClientFeedback } from '../../hooks/useClientFeedback';
import { updateClientFeedback } from '../../api/clientFeedback.api';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

function formatDate(value) {
  if (!value) return 'N/A';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString();
}

function ClientFeedback() {
  const { isSuperAdmin } = useRole();
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [productFilter, setProductFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);
  const [statusUpdate, setStatusUpdate] = useState('reviewed');
  const [responseText, setResponseText] = useState('');

  const { feedback, loading, error } = useClientFeedback({
    limit: 200,
    refreshKey,
  });

  if (!isSuperAdmin) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-700">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  const feedbackData = feedback || [];

  const openFeedback = (item) => {
    setSelectedFeedback(item);
    setStatusUpdate(item.status || 'reviewed');
    setResponseText(item.response || '');
  };

  const handleUpdateFeedback = async () => {
    if (!selectedFeedback) return;
    if (!selectedFeedback.tenantId) {
      setSelectedFeedback(null);
      return;
    }
    setIsUpdating(true);
    try {
      await updateClientFeedback(selectedFeedback.id, {
        tenantId: selectedFeedback.tenantId,
        status: statusUpdate,
        response: responseText.trim() || null,
        respondedBy: 'Super Admin',
      });
      setRefreshKey((prev) => prev + 1);
      setSelectedFeedback(null);
    } catch (err) {
      console.error('Failed to update feedback:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  const totalFeedback = feedbackData.length;
  const averageRating = totalFeedback > 0
    ? (feedbackData.reduce((sum, f) => sum + (f.rating || 0), 0) / totalFeedback).toFixed(1)
    : '0.0';
  const recentFeedbackCount = feedbackData.filter(f => {
    const feedbackDate = new Date(f.createdAt || f.date);
    if (Number.isNaN(feedbackDate.getTime())) return false;
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return feedbackDate >= weekAgo;
  }).length;

  const newFeedbackCount = feedbackData.filter(f => f.status === 'new').length;
  const resolvedFeedbackCount = feedbackData.filter(f => f.status === 'resolved').length;

  const ratingDistribution = [
    { name: '5 Stars', value: feedbackData.filter(f => f.rating === 5).length, color: '#10b981' },
    { name: '4 Stars', value: feedbackData.filter(f => f.rating === 4).length, color: '#3b82f6' },
    { name: '3 Stars', value: feedbackData.filter(f => f.rating === 3).length, color: '#f59e0b' },
    { name: '2 Stars', value: feedbackData.filter(f => f.rating === 2).length, color: '#ef4444' },
    { name: '1 Star', value: feedbackData.filter(f => f.rating === 1).length, color: '#dc2626' },
  ].filter(item => item.value > 0);

  const categoryData = feedbackData.reduce((acc, f) => {
    const key = f.category || 'Other';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
  const categoryChartData = Object.entries(categoryData).map(([name, value]) => ({ name, value }));

  const statusDistribution = [
    { name: 'New', value: feedbackData.filter(f => f.status === 'new').length, color: '#3b82f6' },
    { name: 'Reviewed', value: feedbackData.filter(f => f.status === 'reviewed').length, color: '#f59e0b' },
    { name: 'Resolved', value: feedbackData.filter(f => f.status === 'resolved').length, color: '#10b981' },
    { name: 'Archived', value: feedbackData.filter(f => f.status === 'archived').length, color: '#6b7280' },
  ].filter(item => item.value > 0);

  const uniqueProducts = [...new Set(feedbackData.map(f => f.productName).filter(Boolean))].sort();

  const filteredFeedback = useMemo(() => {
    return feedbackData.filter(f => {
      const searchText = searchTerm.toLowerCase();
      const matchesSearch = !searchTerm.trim()
        ? true
        : (f.clientName || '').toLowerCase().includes(searchText) ||
          (f.subject || '').toLowerCase().includes(searchText) ||
          (f.message || '').toLowerCase().includes(searchText) ||
          (f.productName || '').toLowerCase().includes(searchText);
      const matchesStatus = statusFilter === 'all' || f.status === statusFilter;
      const matchesProduct = productFilter === 'all' || f.productName === productFilter;
      return matchesSearch && matchesStatus && matchesProduct;
    });
  }, [feedbackData, searchTerm, statusFilter, productFilter]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'reviewed':
        return 'bg-yellow-100 text-yellow-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'archived':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRatingStars = (rating) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <i
            key={i}
            className={`bi ${i < rating ? 'bi-star-fill text-yellow-400' : 'bi-star text-gray-300'}`}
          ></i>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Client Feedback
        </h1>
        <p className="text-xl text-gray-600">
          View and manage all client feedback submissions
        </p>
      </div>

      {loading && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 text-gray-600 mb-8">
          Loading client feedback...
        </div>
      )}

      {!loading && error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700 mb-8">
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="text-3xl text-cyan-600">
                  <i className="bi bi-chat-dots-fill"></i>
                </div>
                <span className="text-sm font-semibold text-green-600">+{recentFeedbackCount}</span>
              </div>
              <p className="text-sm text-gray-600 mb-1">Total Feedback</p>
              <p className="text-3xl font-bold text-gray-900">{totalFeedback}</p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="text-3xl text-yellow-500">
                  <i className="bi bi-star-fill"></i>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-1">Average Rating</p>
              <p className="text-3xl font-bold text-gray-900">{averageRating}</p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="text-3xl text-blue-600">
                  <i className="bi bi-bell-fill"></i>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-1">New Feedback</p>
              <p className="text-3xl font-bold text-gray-900">{newFeedbackCount}</p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="text-3xl text-green-600">
                  <i className="bi bi-check-circle-fill"></i>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-1">Resolved</p>
              <p className="text-3xl font-bold text-gray-900">{resolvedFeedbackCount}</p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="text-3xl text-purple-600">
                  <i className="bi bi-calendar-week-fill"></i>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-1">This Week</p>
              <p className="text-3xl font-bold text-gray-900">{recentFeedbackCount}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Rating Distribution</h2>
              {ratingDistribution.length === 0 ? (
                <div className="text-gray-600">No rating data available.</div>
              ) : (
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={ratingDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {ratingDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Feedback by Category</h2>
              {categoryChartData.length === 0 ? (
                <div className="text-gray-600">No category data available.</div>
              ) : (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={categoryChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#06b6d4" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Status Distribution</h2>
              {statusDistribution.length === 0 ? (
                <div className="text-gray-600">No status data available.</div>
              ) : (
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={statusDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search feedback by client, product, subject, or message..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                />
              </div>
              <div className="md:w-48">
                <select
                  value={productFilter}
                  onChange={(e) => setProductFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                >
                  <option value="all">All Products</option>
                  {uniqueProducts.map((product) => (
                    <option key={product} value={product}>{product}</option>
                  ))}
                </select>
              </div>
              <div className="md:w-48">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                >
                  <option value="all">All Status</option>
                  <option value="new">New</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="resolved">Resolved</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">All Feedback</h2>
            {filteredFeedback.length === 0 ? (
              <div className="text-gray-600">No feedback found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Client</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Product</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Rating</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Category</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Subject</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredFeedback.map((item) => (
                      <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-4 text-sm font-medium text-gray-900">{item.clientName}</td>
                        <td className="py-4 px-4 text-sm text-gray-700">{item.productName || 'N/A'}</td>
                        <td className="py-4 px-4 text-sm text-gray-700">
                          {formatDate(item.createdAt || item.date)}
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-700">
                          {getRatingStars(item.rating)}
                        </td>
                        <td className="py-4 px-4 text-sm text-gray-700">{item.category}</td>
                        <td className="py-4 px-4 text-sm text-gray-700 max-w-xs truncate">{item.subject}</td>
                        <td className="py-4 px-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                            {item.status?.charAt(0).toUpperCase() + item.status?.slice(1)}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <button
                            onClick={() => openFeedback(item)}
                            className="text-cyan-600 hover:text-cyan-700 font-medium text-sm"
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {selectedFeedback && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold text-gray-900">Feedback Details</h2>
                <button
                  onClick={() => setSelectedFeedback(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Client</p>
                  <p className="text-lg font-semibold text-gray-900">{selectedFeedback.clientName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">AI Agent</p>
                  <p className="text-lg font-semibold text-gray-900">{selectedFeedback.productName || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Date</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatDate(selectedFeedback.createdAt || selectedFeedback.date)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Rating</p>
                  <div className="text-lg font-semibold text-gray-900">
                    {getRatingStars(selectedFeedback.rating)}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Category</p>
                  <p className="text-lg font-semibold text-gray-900">{selectedFeedback.category}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Status</p>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedFeedback.status)}`}>
                    {selectedFeedback.status?.charAt(0).toUpperCase() + selectedFeedback.status?.slice(1)}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">Subject</p>
                <p className="text-lg font-semibold text-gray-900">{selectedFeedback.subject}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">Message</p>
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <p className="text-gray-900 whitespace-pre-wrap">{selectedFeedback.message}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">Update Status</p>
                <select
                  value={statusUpdate}
                  onChange={(e) => setStatusUpdate(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
                >
                  <option value="new">New</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="resolved">Resolved</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">Response</p>
                <textarea
                  rows={4}
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm"
                  placeholder="Write a response or leave blank..."
                />
              </div>
              {selectedFeedback.response && (
                <div>
                  <p className="text-sm text-gray-600 mb-2">Latest Response</p>
                  <div className="bg-cyan-50 rounded-lg p-4 border border-cyan-200">
                    <p className="text-gray-900 whitespace-pre-wrap mb-2">{selectedFeedback.response}</p>
                    {selectedFeedback.respondedBy && (
                      <p className="text-xs text-gray-500">
                        Responded by {selectedFeedback.respondedBy} on {formatDate(selectedFeedback.respondedAt)}
                      </p>
                    )}
                  </div>
                </div>
              )}
              <div className="flex gap-4 pt-4 border-t border-gray-200">
                <button
                  onClick={handleUpdateFeedback}
                  disabled={isUpdating}
                  className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-400 hover:to-blue-500 transition-all font-medium disabled:opacity-60"
                >
                  {isUpdating ? 'Saving...' : 'Save Updates'}
                </button>
                <button
                  onClick={() => setSelectedFeedback(null)}
                  className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ClientFeedback;
