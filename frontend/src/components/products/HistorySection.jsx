import React, { useState } from 'react';
import { transcripts } from '../../data/transcripts';

const HistorySection = ({ title }) => {
  const [expandedId, setExpandedId] = useState(null);

  const handleToggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    // Optional: show a notification that text has been copied
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderTranscript = (text) => {
    const html = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    return <div dangerouslySetInnerHTML={{ __html: html }} />;
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">{title}</h3>
      <div className="space-y-4">
        {transcripts.map((transcript, index) => (
          <div key={transcript.id} className="border border-gray-200 rounded-lg">
            <div
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
              onClick={() => handleToggleExpand(transcript.id)}
            >
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium text-gray-500">{index + 1}</span>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{transcript.title}</p>
                  <p className="text-xs text-gray-500">
                    {transcript.patientName} - {formatDate(transcript.date)}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent accordion from toggling
                    handleCopy(transcript.transcript);
                  }}
                  className="text-gray-400 hover:text-cyan-600 p-1 rounded-md"
                  title="Copy Transcript"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2.586a1 1 0 01.707 1.707l-2.586 2.586c-.195.195-.451.293-.707.293h-3.414c-.256 0-.512-.098-.707-.293L8.293 6.707A1 1 0 019 6h.586z" />
                  </svg>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent accordion from toggling
                    handleCopy(transcript.summary);
                  }}
                  className="text-gray-400 hover:text-cyan-600 p-1 rounded-md"
                  title="Copy Summary"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent accordion from toggling
                    // handleEdit(transcript.id); // Placeholder for edit functionality
                  }}
                  className="text-gray-400 hover:text-cyan-600 p-1 rounded-md"
                  title="Edit"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
                <svg
                  className={`w-5 h-5 text-gray-500 transform transition-transform cursor-pointer ${
                    expandedId === transcript.id ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  title={expandedId === transcript.id ? 'Collapse' : 'Expand'}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
            {expandedId === transcript.id && (
              <div className="p-4 border-t border-gray-200">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-800 mb-2">Summary</h4>
                    <p className="text-sm text-gray-600 whitespace-pre-wrap">{transcript.summary}</p>
                  </div>
                  <div className="pt-4 border-t border-gray-100">
                    <h4 className="text-sm font-semibold text-gray-800 mb-2">Full Transcript</h4>
                    <div className="text-sm text-gray-600 whitespace-pre-wrap bg-gray-50 p-4 rounded-md leading-relaxed">
                      {renderTranscript(transcript.transcript)}
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2 pt-4">
                    <button
                      onClick={() => handleCopy(transcript.transcript)}
                      className="text-sm text-cyan-600 hover:text-cyan-700 font-medium"
                    >
                      Copy Transcript
                    </button>
                    <button
                      onClick={() => handleCopy(transcript.summary)}
                      className="text-sm text-cyan-600 hover:text-cyan-700 font-medium"
                    >
                      Copy Summary
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistorySection;