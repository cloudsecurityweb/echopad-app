import { useState } from 'react';

export default function HelpEditorModal({ doc, onClose, onSave, isSaving }) {
  const [title, setTitle] = useState(doc?.title || '');
  const [category, setCategory] = useState(doc?.category || '');
  const [summary, setSummary] = useState(doc?.summary || '');
  const [content, setContent] = useState(doc?.content || '');
  const [status, setStatus] = useState(doc?.status || 'draft');

  const handleSave = () => {
    if (!title.trim() || !category.trim()) return;
    onSave({
      title: title.trim(),
      category: category.trim(),
      summary: summary.trim(),
      content: content.trim(),
      status,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-3xl rounded-2xl border-2 border-gray-200 shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-lg font-semibold text-gray-900">
            {doc ? 'Edit Article' : 'Create New Article'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-red-600">
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Article title"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
          />

          <input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Category (e.g., Getting Started)"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
          />

          <input
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Short summary"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm"
          />

          <textarea
            rows={8}
            placeholder="Write help content here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm"
          />

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving || !title.trim() || !category.trim()}
            className="px-5 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium shadow disabled:opacity-60"
          >
            {isSaving ? "Saving..." : "Save Article"}
          </button>
        </div>
      </div>
    </div>
  );
}
