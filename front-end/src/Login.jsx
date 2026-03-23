import { useState } from "react";
<<<<<<< HEAD
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

=======
import { useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  // State to store user input values
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const navigate = useNavigate();

  // Handles the form submission
>>>>>>> 0f1031e (add forgot password and recovery email page with navigation)
  const handleSubmit = (e) => {
e.preventDefault();
    console.log("Login:", email, password);
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-box">

<<<<<<< HEAD
        <div className="input-container">
=======
        {/* Email input field */}
        <div className="input-container"> 
>>>>>>> 0f1031e (add forgot password and recovery email page with navigation)
          <input
            className="login-input"
            type="email"
            placeholder="E-MAIL"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>

<<<<<<< HEAD
=======
        {/* Password input field */}
>>>>>>> 0f1031e (add forgot password and recovery email page with navigation)
        <div className="input-container">
          <input
            className="login-input"
            type="password"            
            placeholder="PASSWORD"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>

<<<<<<< HEAD

        <p className="forgot-password">FORGOT PASSWORD?</p>

        
=======
        {/* Forgot password link */}
        <p className="forgot-password" onClick={() => navigate("/forgot-password")}>
            FORGOT PASSWORD?
        </p>

        {/* Submit login button */}
>>>>>>> 0f1031e (add forgot password and recovery email page with navigation)
        <input
          className="login-button"
          type="submit"
          value="LOGIN"
        />

<<<<<<< HEAD
        <p className="signup-text">
          NEW TO NEWS BIAS? <span className="signup-link">  REGISTER</span>
        </p> 


        <div className="social-section">

=======
        {/* Sign up prompt */}
        <p className="signup-text">
          NEW TO NEWS BIAS? 
          <span className="signup-link" onClick={() => navigate("/signup")}>
            REGISTER
          </span>
        </p> 

        {/* Social login section */}
        <div className="social-section">

            {/* Apple social login button */}
>>>>>>> 0f1031e (add forgot password and recovery email page with navigation)
            <button className="social-button">
              <span>LOGIN WITH</span>
              <img src="/apple-logo.png" alt="apple" className="social-icon" />
            </button>

<<<<<<< HEAD
=======
            {/* Google social login button */}
>>>>>>> 0f1031e (add forgot password and recovery email page with navigation)
            <button className="social-button">
              <span>LOGIN WITH</span>
              <img src="/google-logo.png" alt="google" className="social-icon" />
            </button>

        </div>

      </form>
    </div>
  );
};

export default Login;