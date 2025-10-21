import { EditOutlined, SaveOutlined } from "@ant-design/icons";
import { Button, Input, Upload, message } from "antd";
import { useEffect, useState } from "react";
import { MdEdit } from "react-icons/md";
import {
  useProfileQuery,
  useUpdateProfileMutation,
} from "../../features/profile/profileApi";

import { baseURL } from "../../utils/BaseURL";

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [updateProfile, { isLoading: updateLoading }] =
    useUpdateProfileMutation();

  const { data: profiles, refetch } = useProfileQuery();

  // Initialize profile state
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
  });

  const [profileImageFile, setProfileImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(
    "https://i.ibb.co.com/fYrFP06M/images-1.png"
  );

  // Initialize profile state when data is fetched
  useEffect(() => {
    if (profiles?.data) {
      setProfile({
        fullName: profiles.data.fullName || "",
        email: profiles.data.email || "",
        phone: profiles.data.phone || "",
        address: profiles.data.address || "",
      });

      // Set profile image - only prepend baseURL if it's not already a full URL or data URL
      const imageUrl = profiles.data.profile
        ? profiles.data.profile.startsWith("http") ||
          profiles.data.profile.startsWith("data:image")
          ? profiles.data.profile
          : `${baseURL}${profiles.data.profile}`
        : "https://i.ibb.co.com/fYrFP06M/images-1.png";

      setPreviewImage(imageUrl);
    }
  }, [profiles]);

  const handleFileChange = ({ file }) => {
    if (!isEditing) return;
    if (!file.originFileObj) return;

    const reader = new FileReader();
    reader.readAsDataURL(file.originFileObj);
    reader.onload = () => {
      setPreviewImage(reader.result);
      setProfileImageFile(file.originFileObj);
    };
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const phonePattern = /^[0-9]{10,15}$/;

    if (!profile.phone) {
      message.error("Phone number is required");
      return;
    }

    if (!phonePattern.test(profile.phone)) {
      message.error("Please enter a valid phone number");
      return;
    }

    const formData = new FormData();

    // Add the profile data as per API requirements
    formData.append("fullName", profile.fullName);
    formData.append("phone", profile.phone);
    formData.append("address", profile.address);

    // Add image if selected
    if (profileImageFile) {
      formData.append("profile", profileImageFile);
    }

    try {
      const result = await updateProfile(formData).unwrap();

      if (result.success) {
        // Refetch the user profile data to get the updated information
        refetch();
        message.success(result.message || "Profile updated successfully");
        setIsEditing(false);
        setProfileImageFile(null); // Reset the file state after successful update
      } else {
        message.error(result.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("API Error:", error);
      message.error(
        error?.data?.message || error?.message || "Error updating profile"
      );
    }
  };

  const handleCancel = () => {
    // Reset form to original data
    if (profiles?.data) {
      setProfile({
        fullName: profiles.data.fullName || "",
        email: profiles.data.email || "",
        phone: profiles.data.phone || "",
        address: profiles.data.address || "",
      });
      const imageUrl = profiles.data.profile
        ? profiles.data.profile.startsWith("http") ||
          profiles.data.profile.startsWith("data:image")
          ? profiles.data.profile
          : `${baseURL}${profiles.data.profile}`
        : "https://i.ibb.co.com/fYrFP06M/images-1.png";

      setPreviewImage(imageUrl);
    }
    setProfileImageFile(null);
    setIsEditing(false);
  };

  if (profiles?.isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-start justify-center pt-5">
      <div className="rounded-xl w-full max-w-[800px]">
        <div className="flex items-end justify-between space-x-4">
          <div className="flex items-center gap-3">
            <div className="w-[140px] h-[140px] rounded-full border-2 border-primary mx-auto flex flex-col items-center relative">
              <div className="w-full h-full rounded-full">
                <img
                  src={previewImage}
                  alt="Profile"
                  className="object-cover w-full h-full rounded-full"
                />
              </div>

              {isEditing && (
                <div className="absolute flex items-center justify-center w-8 h-8 p-2 text-center rounded-full cursor-pointer bg-[#FF991C] bottom-1 right-5">
                  <Upload
                    showUploadList={false}
                    onChange={handleFileChange}
                    accept="image/*"
                  >
                    <MdEdit className="mt-1 text-xl text-white" />
                  </Upload>
                </div>
              )}
            </div>
            <h2 className="text-4xl font-semibold text-gray-800">
              {profile.fullName || "User"}
            </h2>
          </div>
          <Button
            type="text"
            icon={<EditOutlined />}
            className="mt-2 border border-primary w-[150px]"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? "Cancel" : "Edit Profile"}
          </Button>
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-gray-600 mb-1">Full Name</label>
            <Input
              name="fullName"
              value={profile.fullName}
              onChange={handleChange}
              disabled={!isEditing}
              className="border rounded-lg border-primary p-2 h-[44px]"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Email</label>
            <Input
              name="email"
              type="email"
              readOnly
              value={profile.email}
              disabled
              className="border rounded-lg border-primary p-2 h-[44px] bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Phone Number</label>
            <Input
              name="phone"
              value={profile.phone}
              onChange={handleChange}
              disabled={!isEditing}
              className="border rounded-lg border-primary p-2 h-[44px]"
              placeholder="Enter your phone number"
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Address</label>
            <Input
              name="address"
              value={profile.address}
              onChange={handleChange}
              disabled={!isEditing}
              className="border rounded-lg border-primary p-2 h-[44px]"
              placeholder="Enter your address"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          {isEditing && (
            <Button
              type="default"
              className="mt-6 w-[120px]"
              onClick={handleCancel}
            >
              Cancel
            </Button>
          )}
          <Button
            type="primary"
            loading={updateLoading}
            icon={<SaveOutlined />}
            className="mt-6 w-[200px] bg-primary"
            onClick={handleSave}
            disabled={!isEditing}
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
