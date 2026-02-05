import { useParams, useNavigate } from 'react-router-dom';
import { useHelpCenterDoc } from '../../hooks/useHelpCenterDoc';

function formatDate(isoString) {
  if (!isoString) return '';
  return new Date(isoString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function HelpDocDetail() {
  const { docId } = useParams();
  const navigate = useNavigate();
  const { doc, loading, error } = useHelpCenterDoc(docId);

  const handleGoBack = () => {
    navigate('/dashboard/help');
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl border-2 border-gray-200 p-8 lg:p-12">
          <div className="animate-pulse">
            <div className="h-10 bg-gray-200 rounded w-3/4 mb-6"></div>
            <div className="flex gap-6 mb-4">
              <div className="h-5 bg-gray-200 rounded w-1/4"></div>
              <div className="h-5 bg-gray-200 rounded w-1/4"></div>
            </div>
            <div className="h-px bg-gray-200 mb-8"></div>
            <div className="h-6 bg-gray-200 rounded w-full mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-5/6 mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700 max-w-4xl mx-auto">
        <h3 className="font-bold">Error</h3>
        <p>{error}</p>
        <button
          onClick={handleGoBack}
          className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition"
        >
          <i className="bi bi-arrow-left-circle"></i>
          Back to Help Center
        </button>
      </div>
    );
  }

  if (!doc) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-semibold text-gray-700">Document Not Found</h2>
        <p className="text-gray-500 mt-2">The help document you are looking for does not exist.</p>
        <button
          onClick={handleGoBack}
          className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800 transition"
        >
          <i className="bi bi-arrow-left-circle"></i>
          Back to Help Center
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <button
        onClick={handleGoBack}
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600 transition"
      >
        <i className="bi bi-arrow-left-circle"></i>
        Back to Help Center
      </button>

      <div className="bg-white border-2 border-gray-200 rounded-xl max-w-4xl mx-auto">
        <div className="p-8 lg:p-12">
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight mb-4">{doc.title}</h1>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <i className="bi bi-folder text-gray-400"></i>
                <span className="font-medium">{doc.category}</span>
              </div>
              <div className="flex items-center gap-2">
                <i className="bi bi-clock-history text-gray-400"></i>
                <span>Last updated on {formatDate(doc.updatedAt)}</span>
              </div>
            </div>
            {doc.tags && doc.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {doc.tags.map(tag => (
                  <span key={tag} className="bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </header>
          
          <hr className="mb-8" />

          <article className="prose lg:prose-lg max-w-none">
            <div dangerouslySetInnerHTML={{ __html: doc.content }} />
          </article>
        </div>
      </div>
    </div>
  );
}
