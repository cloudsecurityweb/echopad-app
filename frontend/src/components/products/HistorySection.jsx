import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranscriptionHistory } from '../../hooks/useTranscriptionHistory';
import { deleteTranscription as deleteTranscriptionApi } from '../../api/transcriptionHistory.api';

const HistorySection = ({ title }) => {
  const {
    items: transcriptions,
    loading,
    error,
    continuationToken,
    loadMore,
    refresh
  } = useTranscriptionHistory({ limit: 20 });

  const [expandedId, setExpandedId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const handleToggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleCopy = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // ignore
    }
  };

  const handleDelete = async (transcription) => {
    if (!window.confirm('Delete this transcription? This cannot be undone.')) return;
    setDeletingId(transcription.id);
    try {
      await deleteTranscriptionApi(transcription.id);
      await refresh();
    } catch {
      // keep deletingId so user sees error state
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return dateString;
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Generate a title from the first line or chunk of the transcription text
  const generateTitle = (text, index) => {
    if (!text) return `Transcription #${index + 1}`;
    const firstLine = text.split('\n')[0].trim();
    if (firstLine.length <= 50) return firstLine || `Transcription #${index + 1}`;
    return firstLine.substring(0, 47) + '...';
  };

  // Generate a preview (first ~100 chars) for collapsed view
  const generatePreview = (text) => {
    if (!text) return '';
    const cleaned = text.replace(/\n/g, ' ').trim();
    if (cleaned.length <= 100) return cleaned;
    return cleaned.substring(0, 97) + '...';
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        {transcriptions.length > 0 && (
          <button
            onClick={refresh}
            disabled={loading}
            className="text-sm text-cyan-600 hover:text-cyan-700 font-medium disabled:opacity-50"
          >
            Refresh
          </button>
        )}
      </div>

      {/* Loading State */}
      {loading && transcriptions.length === 0 && (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center space-x-3">
            <svg className="animate-spin h-5 w-5 text-cyan-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-gray-600">Loading transcription history...</span>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && transcriptions.length === 0 && (
        <div className="text-center py-12 px-4">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="mt-4 text-lg font-semibold text-gray-900">No transcriptions yet</p>
          <p className="mt-2 text-gray-600">Start using AI Scribe to save your transcriptions here.</p>
          <Link
            to="/ai-scribe"
            className="mt-4 inline-flex items-center px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium hover:from-cyan-400 hover:to-blue-500 transition-all"
          >
            Go to AI Scribe
          </Link>
        </div>
      )}

      {/* Transcription List */}
      {!error && transcriptions.length > 0 && (
        <div className="space-y-3">
          {transcriptions.map((transcription, index) => (
            <div key={transcription.id} className="border border-gray-200 rounded-lg overflow-hidden hover:border-gray-300 transition-colors">
              {/* Collapsed Header */}
              <div
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => handleToggleExpand(transcription.id)}
              >
                <div className="flex items-center space-x-4 min-w-0 flex-1">
                  <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-gradient-to-br from-cyan-100 to-blue-100 text-cyan-700 rounded-full text-sm font-medium">
                    {index + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {generateTitle(transcription.text, index)}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {formatDate(transcription.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 flex-shrink-0 ml-4">
                  {/* Copy Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopy(transcription.text, transcription.id);
                    }}
                    className="text-gray-400 hover:text-cyan-600 p-1.5 rounded-md hover:bg-gray-100 transition-colors cursor-pointer"
                    title="Copy Transcript"
                  >
                    {copiedId === transcription.id ? (
                      <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    )}
                  </button>
                  {/* Delete Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(transcription);
                    }}
                    disabled={deletingId === transcription.id}
                    className="text-gray-400 hover:text-red-600 p-1.5 rounded-md hover:bg-red-50 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Delete Transcript"
                  >
                    {deletingId === transcription.id ? (
                      <svg className="animate-spin w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    )}
                  </button>
                  {/* Expand/Collapse Chevron */}
                  <svg
                    className={`w-5 h-5 text-gray-400 transform transition-transform ${expandedId === transcription.id ? 'rotate-180' : ''
                      }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Expanded Content */}
              {expandedId === transcription.id && (
                <div className="p-4 border-t border-gray-200 bg-gray-50">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-semibold text-gray-800 mb-2">Full Transcript</h4>
                      <div className="text-sm text-gray-700 whitespace-pre-wrap bg-white p-4 rounded-lg border border-gray-200 leading-relaxed max-h-96 overflow-y-auto">
                        {transcription.text || 'No content'}
                      </div>
                    </div>
                    <div className="flex justify-end space-x-3 pt-2">
                      <button
                        onClick={() => handleCopy(transcription.text, transcription.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-cyan-700 bg-cyan-50 hover:bg-cyan-100 rounded-lg border border-cyan-200 transition-colors cursor-pointer"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        {copiedId === transcription.id ? 'Copied!' : 'Copy Transcript'}
                      </button>
                      <button
                        onClick={() => handleDelete(transcription)}
                        disabled={deletingId === transcription.id}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-lg border border-red-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        {deletingId === transcription.id ? 'Deleting...' : 'Delete'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Load More Button */}
          {continuationToken && (
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={loadMore}
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-cyan-600 hover:text-cyan-700 bg-cyan-50 hover:bg-cyan-100 rounded-lg border border-cyan-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading...
                  </span>
                ) : (
                  'Load more'
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HistorySection;