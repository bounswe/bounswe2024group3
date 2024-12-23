// ResetPasswordPage.tsx
import React, { useState } from "react";
import { req } from "../utils/client"; // Assumed API request helper
import { useNavigate, useSearchParams } from "react-router-dom";
import FormInput from "../components/FormInput";

const ResetPasswordPage = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await req("reset-password", "post", {
        token: token,
        new_password: newPassword,
        confirm_password: confirmPassword,
      });
      setMessage("Password reset successful!");
      setError("");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error: any) {
      console.error("Password reset failed:", error);
      setError("Failed to reset password. Please try again.");
      setMessage("");
    }
  };

  return (
    <form className="flex flex-col gap-4 p-4" onSubmit={handlePasswordReset}>
      <h2>Set New Password</h2>
      <FormInput
        icon="password"
        type="password"
        placeholder="New Password"
        value={newPassword}
        onChange={(e: any) => setNewPassword(e.target.value)}
      />
      <FormInput
        icon="password"
        type="password"
        placeholder="Confirm New Password"
        value={confirmPassword}
        onChange={(e: any) => setConfirmPassword(e.target.value)}
      />
      <button type="submit" className="btn btn-primary mt-4">
        Reset Password
      </button>
      {message && <p className="text-green-500">{message}</p>}
      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
};

export default ResetPasswordPage;
