import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

function LoginPage() {
  // State to store user input values
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const navigate = useNavigate();

  // Handles the form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login:", email, password);
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-box">

        {/* Email input field */}
        <div className="input-container"> 
          <input
            className="login-input"
            type="email"
            placeholder="E-MAIL"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>

        {/* Password input field */}
        <div className="input-container">
          <input
            className="login-input"
            type="password"            
            placeholder="PASSWORD"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>

        {/* Forgot password link */}
        <p 
          className="forgot-password" 
          onClick={() => navigate("/forgot-password")}
        >
          FORGOT PASSWORD?
        </p>

        {/* Submit login button */}
        <input
          className="login-button"
          type="submit"
          value="LOGIN"
        />

        {/* Sign up prompt */}
        <p className="signup-text">
          NEW TO NEWS BIAS? 
          <span 
            className="signup-link" 
            onClick={() => navigate("/signup")}
          >
            REGISTER
          </span>
        </p> 

        {/* Social login section */}
        <div className="social-section">

          <button className="social-button">
            <span>LOGIN WITH</span>
            <img src="/apple-logo.png" alt="apple" />
          </button>

          <button className="social-button">
            <span>LOGIN WITH</span>
            <img src="/google-logo.png" alt="google" />
          </button>

        </div>

      </form>
    </div>
  );
}

export default LoginPage;