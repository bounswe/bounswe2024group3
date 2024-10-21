import React, { useState } from "react";
import { req } from "../utils/client"; // Assumed API request helper
import FormInput from "../components/FormInput";

const ResetRequestPage = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await req('forget-password', "post",  {email:email} );
      setMessage("Password reset link has been sent to your email.");
      
      setError("");
    } catch (error: any) {
      console.error("Reset request failed:", error);
      setError("Failed to send password reset link. Please try again.");
      setMessage("");
    }
  };

  return (
    <form className="flex flex-col gap-4 p-4" onSubmit={handleResetRequest}>
      <h2>Reset Password</h2>
      <FormInput
        icon="email"
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e: any) => setEmail(e.target.value)}
      />
      <button type="submit" className="btn btn-primary mt-4">
        Send Reset Link
      </button>
      {message && <p className="text-green-500">{message}</p>}
      {error && <p className="text-red-500">{error}</p>}
    </form>
  );
};

export default ResetRequestPage;
