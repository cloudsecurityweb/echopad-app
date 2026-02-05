import { useRole } from '../../contexts/RoleContext';

function ClientFeedback() {
  const { isClientAdmin, isUserAdmin } = useRole();

  if (isClientAdmin || isUserAdmin) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Feedback
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Have a question or feedback? Contact our support team.
          </p>
          <button
            onClick={() => window.Intercom && window.Intercom('show')}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-400 hover:to-blue-500 transition-all font-medium hover:cursor-pointer"
          >
            Contact Support
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <p className="text-red-700">You don't have permission to access this page.</p>
      </div>
    </div>
  );
}

export default ClientFeedback;
