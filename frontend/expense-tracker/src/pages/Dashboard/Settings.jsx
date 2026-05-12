import { useContext, useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { useUserAuth } from "../../hooks/useUserAuth";
import { UserContext } from "../../context/UserContext";
import Input from "../../components/inputs/input";
import ProfilePhotoSelector from "../../components/inputs/ProfilePhotoSelector";
import axiosInstance from "../../utils/axiosinstance";
import { API_PATHS } from "../../utils/apiPaths";
import uploadImage from "../../utils/uploadImage";
import toast from "react-hot-toast";
import { validateEmail } from "../../utils/helper";

const Settings = () => {
  useUserAuth();
  const { user, updateUser } = useContext(UserContext);

  // Profile form
  const [profilePic, setProfilePic] = useState(null);
  const [profilePreview, setProfilePreview] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState("");

  // Password form
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || "");
      setEmail(user.email || "");
      setProfilePreview(user.profileImageUrl || "");
    }
  }, [user]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setProfileError("Name is required.");
      return;
    }
    if (!validateEmail(email)) {
      setProfileError("Please enter a valid email address.");
      return;
    }
    setProfileError("");
    setProfileLoading(true);

    try {
      let profileImageUrl = user?.profileImageUrl || "";

      if (profilePic) {
        const imgRes = await uploadImage(profilePic);
        profileImageUrl = imgRes.imageUrl || profileImageUrl;
      }

      const response = await axiosInstance.put(API_PATHS.AUTH.UPDATE_USER, {
        fullName,
        email,
        profileImageUrl,
      });

      updateUser(response.data);
      setProfilePic(null);
      toast.success("Profile updated successfully");
    } catch (err) {
      setProfileError(
        err.response?.data?.message || "Failed to update profile.",
      );
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("All fields are required.");
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }
    setPasswordError("");
    setPasswordLoading(true);

    try {
      await axiosInstance.put(API_PATHS.AUTH.CHANGE_PASSWORD, {
        currentPassword,
        newPassword,
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      toast.success("Password changed successfully");
    } catch (err) {
      setPasswordError(
        err.response?.data?.message || "Failed to change password.",
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <DashboardLayout activeMenu="Settings">
      <div className="my-5 mx-auto max-w-2xl">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Settings</h2>

        {/* Profile Section */}
        <div className="card mb-6">
          <h3 className="text-base font-medium text-gray-800 mb-4">
            Profile Information
          </h3>
          <form onSubmit={handleProfileUpdate}>
            <ProfilePhotoSelector
              image={profilePic}
              setImage={setProfilePic}
              existingImageUrl={profilePreview}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                value={fullName}
                onChange={({ target }) => setFullName(target.value)}
                placeholder="John Doe"
                type="text"
              />
              <Input
                label="Email Address"
                value={email}
                onChange={({ target }) => setEmail(target.value)}
                placeholder="john@example.com"
                type="text"
              />
            </div>
            {profileError && (
              <p className="text-red-500 text-xs mt-2">{profileError}</p>
            )}
            <div className="flex justify-end mt-4">
              <button
                type="submit"
                className="add-btn add-btn-fill"
                disabled={profileLoading}
              >
                {profileLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>

        {/* Password Section */}
        <div className="card">
          <h3 className="text-base font-medium text-gray-800 mb-4">
            Change Password
          </h3>
          <form onSubmit={handlePasswordChange}>
            <Input
              label="Current Password"
              value={currentPassword}
              onChange={({ target }) => setCurrentPassword(target.value)}
              placeholder="Enter current password"
              type="password"
            />
            <Input
              label="New Password"
              value={newPassword}
              onChange={({ target }) => setNewPassword(target.value)}
              placeholder="Min 8 characters"
              type="password"
            />
            <Input
              label="Confirm New Password"
              value={confirmPassword}
              onChange={({ target }) => setConfirmPassword(target.value)}
              placeholder="Repeat new password"
              type="password"
            />
            {passwordError && (
              <p className="text-red-500 text-xs mt-2">{passwordError}</p>
            )}
            <div className="flex justify-end mt-4">
              <button
                type="submit"
                className="add-btn add-btn-fill"
                disabled={passwordLoading}
              >
                {passwordLoading ? "Updating..." : "Update Password"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Settings;
