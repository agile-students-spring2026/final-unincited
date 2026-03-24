import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ForgotPasswordPage.css";

function ForgotPasswordPage() {
  // State to store user input
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Recovery email sent (demo)");
  };

  return (
    <div className="forgot-container">
      <form onSubmit={handleSubmit} className="forgot-box">

        {/* Title */}
        <h2 className="forgot-title">RESET PASSWORD</h2>

        {/* Subtitle */}
        <p className="forgot-subtext">
          Enter your email and we will send you a recovery link
        </p>

        {/* Email input */}
        <input
          className="forgot-input"
          type="email"
          placeholder="ENTER YOUR E-MAIL"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Submit button */}
        <input
          className="forgot-button"
          type="submit"
          value="SEND RECOVERY EMAIL"
        />

        {/* Back to login */}
        <p 
          className="back-to-login"
          onClick={() => navigate("/")}
        >
          BACK TO LOGIN
        </p>

      </form>
    </div>
  );
}

export default ForgotPasswordPage;
