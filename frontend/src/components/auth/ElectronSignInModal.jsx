import { useState } from 'react';

function ElectronSignInModal({ user, onConfirm, onCancel }) {
  const [rememberChoice, setRememberChoice] = useState(false);
  
  const userName = user?.name || user?.displayName || user?.given_name || 'User';
  const userEmail = user?.email || user?.username || user?.mail || '';
  const userAvatar = user?.picture || user?.photo || null;
  
  const handleConfirm = () => {
    if (rememberChoice) {
      // Store preference (optional)
      localStorage.setItem('electron_auto_signin', 'true');
    }
    onConfirm();
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        <div className="flex items-center mb-4">
          <div className="flex-shrink-0">
            {userAvatar ? (
              <img
                src={userAvatar}
                alt={userName}
                className="h-12 w-12 rounded-full"
              />
            ) : (
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-lg font-semibold">
                {userName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-gray-900">{userName}</h3>
            <p className="text-sm text-gray-500">{userEmail}</p>
          </div>
        </div>
        
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Sign into Electron App?
          </h2>
          <p className="text-gray-600">
            Do you want to sign into the EchoPad desktop app with this account?
          </p>
        </div>
        
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
            Yes, Sign In
          </button>
        </div>
      </div>
    </div>
  );
}

export default ElectronSignInModal;

