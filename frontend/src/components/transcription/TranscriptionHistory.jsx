import { useState, useMemo } from 'react';
import TranscriptionDetailModal from './TranscriptionDetailModal';
import {
  formatDate,
  formatDuration,
  formatRelativeTime,
  downloadTranscription,
  truncateText,
  filterBySearch,
  filterByDateRange,
  filterByStatus,
} from '../../utils/transcription-utils';

// Mock data - will be replaced with API calls later
const mockTranscriptions = [
  {
    id: '1',
    text: 'Hello, this is a sample transcription from the Electron app. This demonstrates how transcriptions will appear in the history. The text can be quite long and will be truncated in the preview.',
    duration: 45,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    status: 'completed',
    source: 'electron-app',
    metadata: {
      language: 'en',
      confidence: 0.95,
    },
  },
  {
    id: '2',
    text: 'Patient visit notes: The patient presented with symptoms of headache and fatigue. Blood pressure was measured at 120/80. Recommended follow-up in two weeks.',
    duration: 120,
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
    status: 'completed',
    source: 'electron-app',
    metadata: {
      language: 'en',
      confidence: 0.92,
    },
  },
  {
    id: '3',
    text: 'Meeting notes from the quarterly review. Discussed Q4 performance metrics, upcoming product launches, and team expansion plans.',
    duration: 1800,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    status: 'completed',
    source: 'electron-app',
    metadata: {
      language: 'en',
      confidence: 0.88,
    },
  },
  {
    id: '4',
    text: 'Voice memo: Remember to call the client about the project proposal. Also need to schedule a meeting with the design team.',
    duration: 30,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    status: 'completed',
    source: 'electron-app',
    metadata: {
      language: 'en',
      confidence: 0.97,
    },
  },
  {
    id: '5',
    text: 'This transcription is currently being processed. Please wait for it to complete.',
    duration: 60,
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
    status: 'processing',
    source: 'electron-app',
  },
  {
    id: '6',
    text: 'Failed transcription due to audio quality issues. Please try recording again with better audio quality.',
    duration: 15,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    status: 'failed',
    source: 'electron-app',
  },
  {
    id: '7',
    text: 'Client consultation notes: Discussed treatment options for chronic pain management. Patient prefers non-invasive approaches. Scheduled next appointment for evaluation.',
    duration: 600,
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
    status: 'completed',
    source: 'electron-app',
    metadata: {
      language: 'en',
      confidence: 0.91,
    },
  },
  {
    id: '8',
    text: 'Quick reminder: Don\'t forget to submit the expense report by Friday. Also need to update the project timeline document.',
    duration: 25,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    status: 'completed',
    source: 'electron-app',
    metadata: {
      language: 'en',
      confidence: 0.94,
    },
  },
  {
    id: '9',
    text: 'Team standup meeting: Reviewed sprint progress, identified blockers, and assigned new tasks. Next standup scheduled for tomorrow morning.',
    duration: 900,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
    status: 'completed',
    source: 'electron-app',
    metadata: {
      language: 'en',
      confidence: 0.89,
    },
  },
  {
    id: '10',
    text: 'Interview notes: Candidate demonstrated strong technical skills and good communication. Recommended for next round of interviews.',
    duration: 2400,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
    status: 'completed',
    source: 'electron-app',
    metadata: {
      language: 'en',
      confidence: 0.93,
    },
  },
  {
    id: '11',
    text: 'Daily journal entry: Today was productive. Completed three major tasks and made progress on the ongoing project. Feeling motivated for tomorrow.',
    duration: 90,
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(), // 12 days ago
    status: 'completed',
    source: 'electron-app',
    metadata: {
      language: 'en',
      confidence: 0.96,
    },
  },
  {
    id: '12',
    text: 'Presentation rehearsal: Practiced the quarterly review presentation. Made notes on areas that need improvement. Will review slides one more time before the meeting.',
    duration: 1800,
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 2 weeks ago
    status: 'completed',
    source: 'electron-app',
    metadata: {
      language: 'en',
      confidence: 0.87,
    },
  },
];

function TranscriptionHistory() {
  const [transcriptions, setTranscriptions] = useState(mockTranscriptions);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedTranscription, setSelectedTranscription] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Filter transcriptions based on search, date, and status
  const filteredTranscriptions = useMemo(() => {
    let filtered = [...transcriptions];
    
    // Apply search filter
    filtered = filterBySearch(filtered, searchQuery);
    
    // Apply date filter
    filtered = filterByDateRange(filtered, dateFilter);
    
    // Apply status filter
    filtered = filterByStatus(filtered, statusFilter);
    
    // Sort by date (newest first)
    filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    return filtered;
  }, [transcriptions, searchQuery, dateFilter, statusFilter]);

  const handleViewDetails = (transcription) => {
    setSelectedTranscription(transcription);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTranscription(null);
  };

  const handleDownload = (transcription) => {
    const dateStr = new Date(transcription.createdAt).toISOString().slice(0, 19).replace(/:/g, '-');
    downloadTranscription(transcription.text, `transcription-${dateStr}`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this transcription? This action cannot be undone.')) {
      return;
    }

    setDeletingId(id);
    
    // Simulate API call delay
    setTimeout(() => {
      setTranscriptions(prev => prev.filter(t => t.id !== id));
      setDeletingId(null);
      // In a real implementation, you would show a toast notification here
    }, 500);
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setDateFilter('all');
    setStatusFilter('all');
  };

  const hasActiveFilters = searchQuery !== '' || dateFilter !== 'all' || statusFilter !== 'all';

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Transcription History</h2>
        <p className="text-gray-600 text-sm">
          View and manage your transcriptions from the Electron app
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search transcriptions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-sm"
          />
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Date Filter */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Date:</label>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Status:</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="processing">Processing</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:underline"
            >
              Clear Filters
            </button>
          )}

          {/* Results Count */}
          <div className="ml-auto text-sm text-gray-600">
            {filteredTranscriptions.length} {filteredTranscriptions.length === 1 ? 'result' : 'results'}
          </div>
        </div>
      </div>

      {/* Transcription List */}
      {filteredTranscriptions.length === 0 ? (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No transcriptions found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {hasActiveFilters
              ? 'Try adjusting your filters to see more results.'
              : 'Start transcribing from the Electron app to see your history here.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTranscriptions.map((transcription) => (
            <div
              key={transcription.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
            >
              <div className="flex items-start justify-between gap-4">
                {/* Main Content */}
                <div className="flex-1 min-w-0">
                  {/* Metadata Row */}
                  <div className="flex items-center gap-4 mb-2 flex-wrap">
                    <span className="text-sm text-gray-600">{formatRelativeTime(transcription.createdAt)}</span>
                    {transcription.duration && (
                      <>
                        <span className="text-gray-400">•</span>
                        <span className="text-sm text-gray-600">{formatDuration(transcription.duration)}</span>
                      </>
                    )}
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      transcription.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : transcription.status === 'processing'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {transcription.status}
                    </span>
                  </div>

                  {/* Text Preview */}
                  <p className="text-gray-800 mb-3 line-clamp-2">
                    {truncateText(transcription.text, 200)}
                  </p>

                  {/* Full Date */}
                  <p className="text-xs text-gray-500">{formatDate(transcription.createdAt)}</p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => handleViewDetails(transcription)}
                    className="px-3 py-2 text-sm font-medium text-cyan-600 hover:text-cyan-700 hover:bg-cyan-50 rounded-lg transition-colors"
                    title="View Details"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleDownload(transcription)}
                    className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Download"
                    disabled={transcription.status !== 'completed'}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(transcription.id)}
                    className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete"
                    disabled={deletingId === transcription.id}
                  >
                    {deletingId === transcription.id ? (
                      <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      <TranscriptionDetailModal
        transcription={selectedTranscription}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
}

export default TranscriptionHistory;

