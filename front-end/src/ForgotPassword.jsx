import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";              
import "./ForgotPassword.css";     

const ForgotPassword = () => {
  // State to store user input values
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  // Handles the form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Recovery email sent (demo)");
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-box">

        {/* Title */}
        <h2 className="forgot-title">RESET PASSWORD</h2>

        {/* Subtitle */}
        <p className="forgot-subtext">
          Enter your email and we will send you a recovery link
        </p>

        {/* Email */}
        <input
          className="login-input"
          type="email"
          placeholder="ENTER YOUR E-MAIL"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Submit */}
        <input
          className="login-button"
          type="submit"
          value="SEND RECOVERY EMAIL"
        />

        {/* Link to naviagte back to login */}
        <p 
          className="back-to-login"
          onClick={() => navigate("/")}
        >
          BACK TO LOGIN
        </p>

      </form>
    </div>
  );
};

export default ForgotPassword;