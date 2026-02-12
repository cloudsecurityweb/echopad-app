import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HelpDocCard from '../../components/help/HelpDocCard';
import HelpEditorModal from '../../components/help/HelpEditorModal';
import DashboardSectionLayout from '../../components/layout/DashboardSectionLayout';
import { useHelpCenterDocs } from '../../hooks/useHelpCenterDocs';
import { createHelpDoc, updateHelpDoc } from '../../api/helpCenter.api';
import { useRole } from '../../contexts/RoleContext';

const SYSTEM_TENANT_ID = "system";

export default function HelpCenter() {
  const navigate = useNavigate();
  const { isClientAdmin, isUserAdmin, isSuperAdmin } = useRole();

  const [editorOpen, setEditorOpen] = useState(false);
  const [activeDoc, setActiveDoc] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState((isClientAdmin || isUserAdmin) ? "published" : "all");
  const [isSaving, setIsSaving] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const { docs, loading, error } = useHelpCenterDocs({
    tenantId: SYSTEM_TENANT_ID,
    refreshKey,
    status: isClientAdmin ? 'published' : undefined,
  });

  const categories = useMemo(() => {
    const unique = new Set(docs.map(doc => doc.category).filter(Boolean));
    return Array.from(unique).sort();
  }, [docs]);

  const filteredDocs = useMemo(() => {
    return docs.filter(doc => {
      const matchesSearch = !searchTerm.trim()
        ? true
        : doc.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.content?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === "all" || doc.category === categoryFilter;
      const matchesStatus = isClientAdmin || statusFilter === "all" || doc.status === statusFilter;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [docs, searchTerm, categoryFilter, statusFilter, isClientAdmin]);

  const openCreate = () => {
    setActiveDoc(null);
    setEditorOpen(true);
  };

  const openEdit = (doc) => {
    setActiveDoc(doc);
    setEditorOpen(true);
  };

  const handleSave = async (payload) => {
    try {
      setIsSaving(true);
      if (activeDoc) {
        await updateHelpDoc(activeDoc.id, {
          tenantId: activeDoc.tenantId || SYSTEM_TENANT_ID,
          ...payload,
        });
      } else {
        await createHelpDoc({
          tenantId: SYSTEM_TENANT_ID,
          ...payload,
        });
      }
      setRefreshKey((prev) => prev + 1);
      setActiveDoc(null);
      setEditorOpen(false);
    } catch (err) {
      console.error("Failed to save help doc:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const description = (isClientAdmin || isUserAdmin)
    ? "Find answers and guides to help you get the most out of Echopad."
    : "Manage documentation and support content for Echopad users";

  return (
    <DashboardSectionLayout
      title="Help Center"
      description={description}
      actions={isSuperAdmin && (
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-medium shadow hover:from-cyan-400 hover:to-blue-500 transition"
        >
          <i className="bi bi-plus-circle-fill"></i>
          New Article
        </button>
      )}
    >
      {/* Search + Filters */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-4 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Search articles..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <select
          className="border border-gray-300 rounded-lg px-4 py-2 text-sm"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="all">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>

        {isSuperAdmin && (
          <select
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        )}
      </div>

      {/* Docs Grid */}
      {loading && (
        <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
                <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
              </div>
              <div className="h-5 w-48 bg-gray-200 rounded"></div>
              <div className="h-4 w-full bg-gray-200 rounded"></div>
              <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <div className="h-3 w-24 bg-gray-200 rounded"></div>
                <div className="h-8 w-20 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredDocs.length === 0 ? (
            <div className="col-span-full bg-white border border-gray-200 rounded-xl p-6 text-gray-600">
              No documentation found.
            </div>
          ) : (
            filteredDocs.map((doc) => (
              <HelpDocCard
                key={doc.id}
                doc={doc}
                onEdit={isSuperAdmin ? openEdit : undefined}
                onClick={(isClientAdmin || isUserAdmin) ? () => navigate(`/dashboard/help/${doc.id}`) : undefined}
              />
            ))
          )}
        </div>
      )}

      {/* Editor Modal */}
      {isSuperAdmin && editorOpen && (
        <HelpEditorModal
          doc={activeDoc}
          onClose={() => setEditorOpen(false)}
          onSave={handleSave}
          isSaving={isSaving}
        />
      )}
    </DashboardSectionLayout>
  );
}
