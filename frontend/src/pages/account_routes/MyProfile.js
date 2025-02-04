import React, { useState, useEffect } from "react";
import axios from "axios";
import "../Account.css";

const MyProfile = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    currentPassword: "",
    newPassword: "",
  });

  const [successMessage, setSuccessMessage] = useState(""); // Novo stanje za poruku

  // Fetch user profile data when component mounts
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get("/api/users/getUserProfile");
        const { user, userInfo } = response.data;

        // Set the form data if available
        setFormData({
          firstName: userInfo.firstName || "",
          lastName: userInfo.lastName || "",
          phoneNumber: userInfo.phoneNumber || "",
          email: user.email || "",
          currentPassword: "",  // default empty
          newPassword: "",      // default empty
        });
      } catch (error) {
        console.error("Error fetching profile:", error.response?.data?.message || error.message || "An unknown error occurred.");
        alert(error.response?.data?.message || "Error fetching profile");
      }
    };

    fetchUserProfile();
  }, []); // Empty dependency array ensures this runs once when the component mounts

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.patch("/api/users/myprofile", formData);

      setSuccessMessage("Profile updated successfully!"); // Set success message
    } catch (error) {
      console.error("Error updating profile:", error.response?.data?.message || error.message || "An unknown error occurred.");
      alert(error.response?.data?.message || "Error updating profile");
    }
  };

  return (
    <div className="my-profile">
      <h2>My Profile</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="phoneNumber">Phone Number</label>
          <input
            type="text"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <h3>Change Password</h3>
        <div className="form-group">
          <label htmlFor="currentPassword">Current Password</label>
          <input
            type="password"
            id="currentPassword"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="newPassword">New Password</label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
          />
        </div>
        <div className="form-actions">
          <button type="submit" className="save-button">Save Changes</button>
          {successMessage && <span className="success-message">{successMessage}</span>} {/* Display success message */}
        </div>
      </form>
    </div>
  );
};

export default MyProfile;
