import { showIntercom } from '../../utils/intercom';
import { useAuth } from '../../contexts/AuthContext';
import { useRole } from '../../contexts/RoleContext';
import SettingsPage from './client-admin/SettingsPage';

function Settings() {
  const { logout } = useAuth();
  const { isSuperAdmin, isClientAdmin, isUserAdmin } = useRole();


  const handleLogout = async () => {
    try {
      await logout('popup');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const settingsSections = [
    {
      id: 1,
      title: 'Notifications',
      description: 'Manage your email notification preferences',
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
      ),
      settings: [
        { label: 'Email Notifications', description: 'Receive email updates about your account', enabled: true },
        { label: 'Product Updates', description: 'Get notified about new features and updates', enabled: true },
        { label: 'Marketing Communications', description: 'Receive marketing emails and promotional content', enabled: false },
      ],
    },
    {
      id: 2,
      title: 'Privacy & Security',
      description: 'Control your account security and privacy settings',
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      actions: [
        { label: 'Change Password', description: 'Update your account password', buttonText: 'Change Password' },
        { label: 'Two-Factor Authentication', description: 'Add an extra layer of security', buttonText: 'Enable 2FA' },
      ],
    },
    {
      id: 3,
      title: 'Support',
      description: 'Get help from our support team',
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      actions: [
        { label: 'Contact Support', description: 'Submit a support request or get help with your account', buttonText: 'Contact Support', action: () => showIntercom(), variant: 'primary' },
      ],
    },
    {
      id: 4,
      title: 'Quick Actions',
      description: 'Common account actions and navigation',
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      actions: [
        { label: 'Sign Out', description: 'Sign out of your account', buttonText: 'Sign Out', action: handleLogout, variant: 'danger' },
        { label: 'Go to Home', description: 'Return to the homepage', buttonText: 'Go to Home', link: '/', variant: 'primary' },
      ],
    },
  ];

  if (isClientAdmin) {
    return <SettingsPage />;
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Settings
        </h1>
        <p className="text-xl text-gray-600">
          {isSuperAdmin && 'Platform-wide settings and configurations'}
          {isClientAdmin && 'Organization settings and preferences'}
          {isUserAdmin && 'Manage your account settings and preferences'}
        </p>
      </div>

      {/* Settings Sections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {settingsSections.map((section) => (
          <div
            key={section.id}
            className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                  {section.icon}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{section.title}</h3>
                </div>
              </div>
            </div>

            <p className="text-gray-600 mb-4">
              {section.description}
            </p>

            <div className="space-y-4 pt-4 border-t border-gray-200">
              {section.settings && section.settings.map((setting, index) => (
                <div key={index} className="flex items-center justify-between py-2">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">{setting.label}</p>
                    <p className="text-xs text-gray-600">{setting.description}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer ml-4">
                    <input type="checkbox" className="sr-only peer" defaultChecked={setting.enabled} />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-cyan-500 peer-checked:to-blue-600"></div>
                  </label>
                </div>
              ))}

              {section.actions && section.actions.map((action, index) => (
                <div key={index} className="py-2">
                  <p className="font-medium text-gray-900 text-sm mb-1">{action.label}</p>
                  <p className="text-xs text-gray-600 mb-3">{action.description}</p>
                  {action.link ? (
                    <a
                      href={action.link}
                      className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        action.variant === 'danger'
                          ? 'border-2 border-red-300 text-red-700 hover:border-red-400 hover:bg-red-50'
                          : 'border-2 border-cyan-300 text-cyan-700 hover:border-cyan-400 hover:bg-cyan-50'
                      }`}
                    >
                      {action.buttonText}
                    </a>
                  ) : (
                    <button
                      onClick={action.action}
                      className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        action.variant === 'danger'
                          ? 'border-2 border-red-300 text-red-700 hover:border-red-400 hover:bg-red-50'
                          : action.variant === 'primary'
                          ? 'border-2 border-cyan-300 text-cyan-700 hover:border-cyan-400 hover:bg-cyan-50'
                          : 'border-2 border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {action.buttonText}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Additional Info */}
      <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl p-6 border border-cyan-200">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Need Help?</h2>
        <p className="text-gray-700 mb-4">
          Contact our support team if you have questions about your settings or need assistance with your account preferences.
        </p>
        <button
          onClick={() => showIntercom()}
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-400 hover:to-blue-500 transition-all font-medium text-sm"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
          Contact Support
        </button>
      </div>
    </div>
  );
}

export default Settings;


