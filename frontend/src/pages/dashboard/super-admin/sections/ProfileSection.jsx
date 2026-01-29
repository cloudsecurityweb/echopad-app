import { useState } from "react";
import Section from "../components/Section";
import Card from "../components/Card";
import { useUserProfile } from "../../../../hooks/useUserProfile";
import ProfileEditModal from "../components/ProfileEditModal";

function ProfileSection() {
    const [isEditing, setIsEditing] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const { profile, updateProfile } = useUserProfile({
        tenantId: "tenant_1",
        userId: "user_1",
    });

    if (!profile) return null;

    const handleSaveProfile = async (updates) => {
        setIsSaving(true);
        try {
            await updateProfile(updates);
        } finally {
            setIsSaving(false);
            setIsEditing(false);
        }
    };

    return (
        <Section
            title="Profile & Access"
            action={
                <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 text-sm font-medium rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white"
                >
                    Edit Profile
                </button>
            }
        >
            <div className="grid md:grid-cols-2 gap-6">
                <Card>
                    <h3 className="font-semibold text-gray-900 mb-2">
                        Account Owner
                    </h3>

                    <p className="text-sm text-gray-700">{profile.email}</p>

                    <div className="flex items-center gap-3 mt-3">
                        <span className="px-2 py-1 text-xs rounded bg-cyan-100 text-cyan-800">
                            {profile.role}
                        </span>

                        <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-700">
                            {profile.status}
                        </span>
                    </div>
                </Card>

                <Card>
                    <h3 className="font-semibold text-gray-900 mb-2">
                        Access Management
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                        Control permissions for other account handlers.
                    </p>
                    <button className="text-cyan-600 font-medium text-sm">
                        Manage Access (Coming Soon)
                    </button>
                </Card>
            </div>

            {isEditing && (
                <ProfileEditModal
                    profile={profile}
                    onClose={() => setIsEditing(false)}
                    onSave={handleSaveProfile}
                    isSaving={isSaving}
                />
            )}
        </Section>
    );
}

export default ProfileSection;
