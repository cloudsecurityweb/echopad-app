import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useRole } from '../../../contexts/RoleContext';
import { useOrganization } from '../../../hooks/useOrganization';
import { useAnalyticsClientAdmin } from '../../../hooks/useAnalyticsClientAdmin';
import { useTranscriptionHistory } from '../../../hooks/useTranscriptionHistory';
import { deleteTranscription as deleteTranscriptionApi } from '../../../api/transcriptionHistory.api';
import AnalyticsOverview from '../../../components/analytics/AnalyticsOverview';

function formatDate(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}

function AnalyticsPage() {
  const { isClientAdmin, isUserAdmin } = useRole();
  const { organization, orgId } = useOrganization();
  const { summary, loading, error } = useAnalyticsClientAdmin(isClientAdmin ? orgId : null);
  const { items: transcriptions, loading: historyLoading, error: historyError, continuationToken, loadMore, refresh } = useTranscriptionHistory({ limit: 20, enabled: isUserAdmin && !isClientAdmin });
  const [copiedId, setCopiedId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const handleCopy = async (t) => {
    try {
      await navigator.clipboard.writeText(t.text);
      setCopiedId(t.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // ignore
    }
  };

  const handleDelete = async (t) => {
    if (!window.confirm('Delete this transcription? This cannot be undone.')) return;
    setDeletingId(t.id);
    try {
      await deleteTranscriptionApi(t.id);
      await refresh();
    } catch {
      // keep deletingId so user sees error state; could show toast
    } finally {
      setDeletingId(null);
    }
  };

  if (!isClientAdmin && !isUserAdmin) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-700">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  const isUserAdminOnly = isUserAdmin && !isClientAdmin;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          {isUserAdminOnly ? 'Transcription History' : 'Analytics'}
        </h1>
        <p className="text-xl text-gray-600">
          {isUserAdminOnly
            ? 'Your saved transcriptions from AI Scribe.'
            : `Usage and license insights for ${organization?.name || 'your organization'}.`}
        </p>
      </div>

      {!isUserAdminOnly && (
        <AnalyticsOverview summary={summary} loading={loading} error={error} />
      )}

      {isUserAdminOnly && (
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Transcription History</h2>
          {historyLoading && transcriptions.length === 0 ? (
            <div className="text-gray-600 py-6">Loading transcription history...</div>
          ) : historyError ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">{historyError}</div>
          ) : transcriptions.length === 0 ? (
            <div className="text-center py-10 px-4">
              <p className="text-lg font-semibold text-gray-900 mb-2">Start using AI scribe</p>
              <p className="text-gray-600 mb-4">Your transcriptions will appear here.</p>
              <Link
                to="/ai-scribe"
                className="inline-flex items-center px-4 py-2 rounded-lg bg-cyan-600 text-white font-medium hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
              >
                Go to AI Scribe
              </Link>
            </div>
          ) : (
            <>
              <ul className="divide-y divide-gray-200">
                {transcriptions.map((t) => (
                  <li
                    key={t.id}
                    className="py-4 first:pt-0 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-gray-500 mb-1">{formatDate(t.createdAt)}</p>
                      <p className="text-gray-900 break-words whitespace-pre-wrap">{t.text || ''}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleCopy(t)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg border border-gray-300 transition-colors"
                      >
                        {copiedId === t.id ? (
                          'Copied!'
                        ) : (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h2m8 0h2a2 2 0 012 2v2m2 4v6a2 2 0 01-2 2h-8a2 2 0 01-2-2v-8z" />
                            </svg>
                            Copy
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(t)}
                        disabled={deletingId === t.id}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-lg border border-red-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {deletingId === t.id ? (
                          'Deleting...'
                        ) : (
                          <>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                          </>
                        )}
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
              {continuationToken && (
                <div className="mt-6 flex justify-center">
                  <button
                    type="button"
                    onClick={loadMore}
                    disabled={historyLoading}
                    className="px-4 py-2 text-sm font-medium text-cyan-600 hover:text-cyan-700 bg-cyan-50 hover:bg-cyan-100 rounded-lg border border-cyan-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {historyLoading ? 'Loading...' : 'Load more'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default AnalyticsPage;
