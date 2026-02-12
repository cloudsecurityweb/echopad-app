import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useRole } from '../../contexts/RoleContext';
import ChangePasswordModal from '../../components/ui/ChangePasswordModal';
import DashboardSectionLayout from '../../components/layout/DashboardSectionLayout';
import { showIntercom } from '../../utils/intercom';

function Profile() {
  const { account, googleUser, authProvider, userProfile, getAccessToken, googleToken } = useAuth();
  const { isSuperAdmin, isClientAdmin, isUserAdmin } = useRole();

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [profileData, setProfileData] = useState({
    displayName: '',
    email: '',
    organizationName: '',
  });

  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  // Fetch user profile from backend
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://echopad-app-service-bwd0bqd7g7ehb5c7.westus2-01.azurewebsites.net';
        let token;
        
        try {
          token = await getAccessToken();
        } catch (err) {
          // If getAccessToken fails (e.g., for Google), try to get token from context
          if (authProvider === 'google' && googleUser) {
            // For Google, we need to use the stored token
            const storedToken = sessionStorage.getItem('google_id_token');
            if (storedToken) {
              token = storedToken;
            } else {
              throw new Error('No authentication token available');
            }
          } else {
            throw err;
          }
        }
        
        const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data) {
            setProfileData({
              displayName: data.data.user?.displayName || '',
              email: data.data.user?.email || '',
              organizationName: data.data.organization?.name || '',
            });
          }
        }
      } catch (err) {
        console.error('Failed to fetch profile:', err);
        // Fallback to userProfile from context
        if (userProfile) {
          setProfileData({
            displayName: userProfile.user?.displayName || '',
            email: userProfile.user?.email || '',
            organizationName: userProfile.organization?.name || '',
          });
        }
      } finally {
        setIsProfileLoading(false);
      }
    };
    
    fetchProfile();
  }, [userProfile, getAccessToken, authProvider, googleUser]);

  // Get user info based on provider (for display)
  const userInfo = authProvider === 'google' 
    ? { 
        name: profileData.displayName || googleUser?.name, 
        email: profileData.email || googleUser?.email, 
        picture: googleUser?.picture
      }
    : { 
        name: profileData.displayName || account?.name, 
        email: profileData.email || account?.username
      };
  
  // Check if organization is missing
  const isOrganizationMissing = !profileData.organizationName && isClientAdmin;
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(null);
    setSuccess(null);
  };
  
  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    setSuccess(null);
    
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://echopad-app-service-bwd0bqd7g7ehb5c7.westus2-01.azurewebsites.net';
      let token;
      
      try {
        token = await getAccessToken();
      } catch (err) {
        // If getAccessToken fails (e.g., for Google), try to get token from context
        if (authProvider === 'google' && googleToken) {
          token = googleToken;
        } else if (authProvider === 'google') {
          const storedToken = sessionStorage.getItem('google_id_token');
          if (storedToken) {
            token = storedToken;
          } else {
            throw new Error('No authentication token available');
          }
        } else {
          throw err;
        }
      }
      
      const userId = userProfile?.user?.id || account?.id || account?.localAccountId || googleUser?.sub;
      
      if (!userId) {
        throw new Error('User ID not found');
      }
      
      const response = await fetch(`${API_BASE_URL}/api/users/${userId}/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          displayName: profileData.displayName,
          organizationName: isClientAdmin ? profileData.organizationName : undefined,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to update profile' }));
        throw new Error(errorData.message || 'Failed to update profile');
      }
      
      const data = await response.json();
      if (data.success) {
        setSuccess('Profile updated successfully!');
        setIsEditing(false);
        // Update local state with response data
        if (data.data) {
          setProfileData(prev => ({
            ...prev,
            displayName: data.data.user?.displayName || prev.displayName,
            email: data.data.user?.email || prev.email,
            organizationName: data.data.organization?.name || prev.organizationName,
          }));
        }
      }
    } catch (err) {
      console.error('Failed to update profile:', err);
      setError(err.message || 'Failed to update profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleCancel = () => {
    setIsEditing(false);
    setError(null);
    setSuccess(null);
    // Reset to original values
    if (userProfile) {
      setProfileData({
        displayName: userProfile.user?.displayName || '',
        email: userProfile.user?.email || '',
        organizationName: userProfile.organization?.name || '',
      });
    }
  };

  const profileSections = [
    {
      id: 1,
      title: 'Personal Information',
      description: 'Your basic account details and profile information',
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      details: [
        { label: 'Name', value: userInfo.name || 'Not set' },
        { label: 'Email', value: userInfo.email || 'Not set' },
      ],
    },
    {
      id: 2,
      title: 'Account Security',
      description: 'Manage your authentication and security settings',
      icon: (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      details: [
        { label: 'Sign-in Provider', value: authProvider ? authProvider.charAt(0).toUpperCase() + authProvider.slice(1) : 'Not set' },
        { label: 'Account Status', value: 'Active' },
      ],
    },
  ];

  const description =
    (isSuperAdmin && 'Super Admin account information and system access') ||
    (isClientAdmin && 'Client Admin account and organization settings') ||
    'Manage your personal account information';

  return (
    <DashboardSectionLayout
      title="Profile"
      description={description}
    >
      <div className="max-w-6xl mx-auto space-y-10">
      {/* PROFILE OVERVIEW */}
      {isProfileLoading ? (
        <div className="animate-pulse space-y-10">
          {/* Profile Overview Skeleton */}
          <section className="bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="w-24 h-24 bg-gray-200 rounded-full"></div>
              <div className="flex-1 space-y-3">
                <div className="h-6 w-48 bg-gray-200 rounded"></div>
                <div className="h-4 w-64 bg-gray-200 rounded"></div>
                <div className="flex gap-2 mt-2">
                  <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
                  <div className="h-6 w-24 bg-gray-200 rounded-full"></div>
                  <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
                </div>
              </div>
              <div className="h-10 w-28 bg-gray-200 rounded-lg"></div>
            </div>
          </section>

          {/* Info Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                  <div className="h-5 w-36 bg-gray-200 rounded"></div>
                </div>
                <div className="space-y-3 pt-4 border-t border-gray-100">
                  {[...Array(2)].map((_, j) => (
                    <div key={j} className="flex justify-between py-2">
                      <div className="h-4 w-20 bg-gray-200 rounded"></div>
                      <div className="h-4 w-40 bg-gray-200 rounded"></div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Editable Profile Skeleton */}
          <section className="bg-white rounded-2xl border border-gray-200 p-6 space-y-5">
            <div className="flex justify-between">
              <div className="h-6 w-48 bg-gray-200 rounded"></div>
              <div className="h-10 w-28 bg-gray-200 rounded-lg"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 w-24 bg-gray-200 rounded"></div>
                  <div className="h-10 w-full bg-gray-200 rounded-lg"></div>
                </div>
              ))}
            </div>
          </section>

          {/* Security Section Skeleton */}
          <section className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
            <div className="h-6 w-52 bg-gray-200 rounded"></div>
            <div className="h-4 w-80 bg-gray-200 rounded"></div>
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex justify-between items-center py-4">
                <div className="space-y-2">
                  <div className="h-4 w-36 bg-gray-200 rounded"></div>
                  <div className="h-3 w-56 bg-gray-200 rounded"></div>
                </div>
                <div className="h-10 w-32 bg-gray-200 rounded-lg"></div>
              </div>
            ))}
          </section>

          {/* Support Skeleton */}
          <section className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-2xl p-6 border border-cyan-200">
            <div className="h-6 w-32 bg-cyan-200/60 rounded mb-3"></div>
            <div className="h-4 w-80 bg-cyan-200/60 rounded mb-4"></div>
            <div className="h-10 w-36 bg-cyan-200/60 rounded-lg"></div>
          </section>
        </div>
      ) : (
        <>
          <section className="bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              {userInfo.picture ? (
                <img
                  src={userInfo.picture}
                  alt={userInfo.name || 'User'}
                  className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
                />
              ) : (
                <div className="w-24 h-24 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                  {(userInfo.name || userInfo.email || 'U')
                    .charAt(0)
                    .toUpperCase()}
                </div>
              )}

              <div className="flex-1">
                <h2 className="text-2xl font-semibold text-gray-900">
                  {userInfo.name || 'User'}
                </h2>
                <p className="text-gray-600">{userInfo.email}</p>

            <div className="flex flex-wrap items-center gap-2 mt-3">
              <Badge color="green">Active</Badge>
              <Badge
                color={
                  isSuperAdmin
                    ? 'purple'
                    : isClientAdmin
                    ? 'blue'
                    : 'cyan'
                }
              >
                {isSuperAdmin
                  ? 'Super Admin'
                  : isClientAdmin
                  ? 'Client Admin'
                  : 'User Admin'}
              </Badge>
            </div>
          </div>

          {/* <button
            onClick={() => setIsEditing(true)}
            className="self-start md:self-center px-5 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium shadow hover:from-cyan-400 hover:to-blue-500 transition"
          >
            Edit Profile
          </button> */}
        </div>
      </section>

      {/* PROFILE EDITING */}
      <section className="bg-white rounded-2xl border-2 border-gray-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">Edit Profile</h2>
            <p className="text-gray-600 mt-1">
              {isOrganizationMissing
                ? 'Complete your profile by adding organization details'
                : 'Update your profile information'}
            </p>
          </div>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-400 hover:to-blue-500 transition-all font-medium"
            >
              Edit Profile
            </button>
          )}
        </div>

        {isOrganizationMissing && !isEditing && (
          <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Action Required:</strong> Please complete your profile by adding your organization name.
            </p>
          </div>
        )}

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800">{success}</p>
          </div>
        )}

        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 mb-1">
                Display Name (Organizer Name) *
              </label>
              <input
                type="text"
                id="displayName"
                name="displayName"
                value={profileData.displayName}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 ${!profileData.displayName.trim() ? 'border-red-300' : 'border-gray-300'
                  }`}
                placeholder="Enter your display name"
                required
              />
              {!profileData.displayName.trim() && (
                <p className="mt-1 text-xs text-red-600">Display name is required</p>
              )}
            </div>

            {/* Email is read-only */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={profileData.email}
                disabled
                className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
              />
              <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
            </div>

            {isClientAdmin && (
              <div>
                <label htmlFor="organizationName" className="block text-sm font-medium text-gray-700 mb-1">
                  Organization Name *
                </label>
                <input
                  type="text"
                  id="organizationName"
                  name="organizationName"
                  value={profileData.organizationName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  placeholder="Enter your organization name"
                  required
                />
                {isOrganizationMissing && (
                  <p className="mt-1 text-xs text-yellow-600">
                    Organization name is required for Client Admins
                  </p>
                )}
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <button
                onClick={handleSave}
                disabled={isSaving || !profileData.displayName.trim()}
                className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-400 hover:to-blue-500 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                onClick={handleCancel}
                disabled={isSaving}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3 pt-4 border-t border-gray-200">
            <div>
              <p className="text-sm text-gray-500">Display Name</p>
              <p className="text-sm font-medium text-gray-900">{profileData.displayName || 'Not set'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <p className="text-sm font-medium text-gray-900">{profileData.email || 'Not set'}</p>
            </div>
            {isClientAdmin && (
              <div>
                <p className="text-sm text-gray-500">Organization Name</p>
                <p className="text-sm font-medium text-gray-900">
                  {profileData.organizationName || 'Not set'}
                </p>
              </div>
            )}
          </div>
        )}
      </section>

      {/* PERSONAL INFORMATION */}
      <Section title="Personal Information" subtitle="Your basic account details">
        <InfoRow label="Full Name" value={userInfo.name || 'Not set'} />
        <InfoRow label="Email Address" value={userInfo.email || 'Not set'} />
        <InfoRow
          label="Sign-in Provider"
          value={
            authProvider
              ? authProvider.charAt(0).toUpperCase() + authProvider.slice(1)
              : 'Not set'
          }
        />
      </Section>

      {/* SECURITY */}
      <Section
        title="Security & Authentication"
        subtitle="Manage how you sign in and protect your account"
      >
        <ActionRow
          title="Password"
          description={authProvider === 'email' ? "Change your account password" : "Password change is not available for social login accounts"}
          action="Change Password"
          onClick={() => setIsChangePasswordOpen(true)}
          disabled={authProvider !== 'email'}
        />
        <ActionRow
          title="Multi-Factor Authentication"
          description="Coming soon — Add an extra layer of security to your account"
          action="Enable MFA"
          disabled
        />
        <ActionRow
          title="Active Sessions"
          description="Coming soon — View and manage logged-in devices"
          action="Manage Sessions"
          disabled
        />
      </Section>

      {/* PREFERENCES */}
      <Section
        title="Preferences"
        subtitle="Control how you receive updates and notifications"
      >
        <ToggleRow
          title="Email Notifications"
          description="Coming soon — Receive important system and account updates"
          disabled
        />
        <ToggleRow
          title="Product Announcements"
          description="Coming soon — Be notified about new Echopad features"
          disabled
        />
      </Section>

      {/* ACCESS (ROLE-AWARE) */}
      {(isSuperAdmin || isClientAdmin) && (
        <Section
          title="Access & Permissions"
          subtitle="Manage who can access this account"
        >
          <ActionRow
            title="User Access"
            description="Coming soon — Invite, remove, or update user permissions"
            action="Manage Access"
            disabled
          />
        </Section>
      )}

      {/* SUPPORT */}
      <section className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-2xl p-6 border border-cyan-200">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">
          Need Help?
        </h2>
        <p className="text-gray-700 mb-4">
          If you have questions about your account or need assistance, our
          support team is here to help.
        </p>
        <button
          onClick={() => showIntercom()}
          className="px-5 py-2 rounded-lg bg-white border border-gray-300 text-gray-800 font-medium hover:bg-gray-50 cursor-pointer transition-colors"
        >          Contact Support
        </button>
      </section>

      {/* Change Password Modal */}
      <ChangePasswordModal
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
      />
      </div>
    </DashboardSectionLayout>
  );
}

/* ------------------ UI HELPERS ------------------ */

function Section({ title, subtitle, children }) {
  return (
    <section className="bg-white rounded-2xl border-2 border-gray-200 p-6 space-y-4">
      <div>
        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
        <p className="text-gray-600">{subtitle}</p>
      </div>
      <div className="divide-y divide-gray-200">{children}</div>
    </section>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-medium text-gray-900">{value}</span>
    </div>
  );
}

function ActionRow({ title, description, action, onClick, disabled }) {
  return (
    <div className="py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <p className="font-medium text-gray-900">{title}</p>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      <button
        className={`px-4 py-2 rounded-lg border font-medium transition-colors ${disabled
          ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed opacity-60'
          : 'bg-white border-gray-300 text-gray-800 hover:bg-gray-50 cursor-pointer'
          }`}
        onClick={onClick}
        disabled={disabled}
      >
        {action}
      </button>
    </div>
  );
}

function ToggleRow({ title, description, disabled }) {
  return (
    <div className={`py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}>
      <div>
        <p className="font-medium text-gray-900">{title}</p>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      <input type="checkbox" className={`w-5 h-5 accent-cyan-600 ${disabled ? 'cursor-not-allowed' : ''}`} disabled={disabled} />
    </div>
  );
}

function Badge({ color, children }) {
  const colors = {
    green: 'bg-green-100 text-green-800',
    blue: 'bg-blue-100 text-blue-800',
    cyan: 'bg-cyan-100 text-cyan-800',
    purple: 'bg-purple-100 text-purple-800',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[color]}`}
    >
      {children}
    </span>
  );
}

export default Profile;
