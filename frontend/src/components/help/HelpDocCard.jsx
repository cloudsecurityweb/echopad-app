function formatDate(value) {
  if (!value) return "Unknown";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString();
}

export default function HelpDocCard({ doc, onEdit }) {
  const statusStyles =
    doc.status === 'published'
      ? 'bg-green-50 text-green-700 border-green-200'
      : doc.status === 'archived'
      ? 'bg-gray-100 text-gray-600 border-gray-200'
      : 'bg-yellow-50 text-yellow-700 border-yellow-200';

  return (
    <div className="bg-white border-2 border-gray-200 rounded-2xl p-6 shadow-sm hover:border-blue-300 transition">
      <div className="flex items-start justify-between mb-4">
        <span
          className={`text-xs font-semibold px-3 py-1 rounded-full border ${statusStyles}`}
        >
          {doc.status.toUpperCase()}
        </span>

        <button
          onClick={() => onEdit(doc)}
          className="text-gray-500 hover:text-blue-600"
          title="Edit"
        >
          <i className="bi bi-pencil-square text-lg"></i>
        </button>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {doc.title}
      </h3>

      <p className="text-sm text-gray-600 mb-4">
        Category: <span className="font-medium">{doc.category}</span>
      </p>

      <div className="text-xs text-gray-500">
        Last updated {formatDate(doc.updatedAt)}
      </div>
    </div>
  );
}
