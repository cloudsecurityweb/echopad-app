import { useState } from 'react';

function ElectronSignInModal({ user, onConfirm, onCancel, onUseDifferentAccount }) {
  const [rememberChoice, setRememberChoice] = useState(false);

  const userName = user?.name || user?.displayName || user?.given_name || 'User';
  const userEmail = user?.email || user?.username || user?.mail || '';
  const userAvatar = user?.picture || user?.photo || null;

  const handleConfirm = () => {
    if (rememberChoice) {
      localStorage.setItem('electron_auto_signin', 'true');
    }
    onConfirm();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-3">
          Log in to EchoPad desktop?
        </h2>
        <p className="text-sm font-medium text-gray-700 mb-2">
          You&apos;re currently logged in as:
        </p>
        <div className="mb-4">
          <div className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="flex-shrink-0">
              {userAvatar ? (
                <img
                  src={userAvatar}
                  alt={userName}
                  className="h-10 w-10 rounded-full"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-semibold">
                  {userName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-900 truncate">{userName}</p>
              <p className="text-sm text-gray-600 truncate">{userEmail || '—'}</p>
            </div>
          </div>
        </div>
        <p className="text-sm text-gray-500 mb-4">
          Please only log in if you just came from the EchoPad app.
        </p>

        <div className="mb-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={rememberChoice}
              onChange={(e) => setRememberChoice(e.target.checked)}
              className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
            />
            <span className="ml-2 text-sm text-gray-600">
              Remember this choice for future sign-ins
            </span>
          </label>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-md hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors font-medium"
            >
              Yes, Log In
            </button>
          </div>
          {onUseDifferentAccount && (
            <button
              type="button"
              onClick={onUseDifferentAccount}
              className="w-full px-4 py-2 text-sm text-gray-600 hover:text-gray-900 underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 rounded-md"
            >
              Use different account
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ElectronSignInModal;

