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
    <div className="fixed inset-0 bg-gradient-to-br from-slate-50/98 via-blue-50/98 to-purple-50/98 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl border-2 border-blue-100 max-w-md w-full mx-4 p-4 md:p-6">
        {/* Branding */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center justify-center gap-2 mb-2">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
              <i className="bi bi-lightning-charge-fill text-white text-lg" aria-hidden="true" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              Echopad AI
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mt-2">
            Log in to EchoPad desktop?
          </h2>
        </div>

        <p className="text-sm font-medium text-gray-700 mb-2">
          You&apos;re currently logged in as:
        </p>
        <div className="mb-4">
          <div className="flex items-center gap-3 p-3 bg-slate-50 border-2 border-blue-100 rounded-xl">
            <div className="flex-shrink-0">
              {userAvatar ? (
                <img
                  src={userAvatar}
                  alt={userName}
                  className="h-10 w-10 rounded-full"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-sm font-semibold">
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
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={rememberChoice}
              onChange={(e) => setRememberChoice(e.target.checked)}
              className="rounded border-2 border-gray-300 text-cyan-600 focus:ring-cyan-500 focus:ring-offset-0"
            />
            <span className="ml-2 text-sm text-gray-600">
              Remember this choice for future sign-ins
            </span>
          </label>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2.5 border-2 border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-400 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-colors font-medium shadow-lg"
            >
              Yes, Log In
            </button>
          </div>
          {onUseDifferentAccount && (
            <button
              type="button"
              onClick={onUseDifferentAccount}
              className="w-full px-4 py-2 text-sm text-cyan-600 hover:text-cyan-700 font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 rounded-lg"
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

