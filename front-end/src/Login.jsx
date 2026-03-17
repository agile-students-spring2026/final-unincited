import { useState } from "react";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
e.preventDefault();
    console.log("Login:", email, password);
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-box">

        <div className="input-container">
          <input
            className="login-input"
            type="email"
            placeholder="E-MAIL"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </div>

        <div className="input-container">
          <input
            className="login-input"
            type="password"            
            placeholder="PASSWORD"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>


        <p className="forgot-password">FORGOT PASSWORD?</p>

        
        <input
          className="login-button"
          type="submit"
          value="LOGIN"
        />

        <p className="signup-text">
          NEW TO NEWS BIAS? <span className="signup-link">  REGISTER</span>
        </p> 


        <div className="social-section">

            <button className="social-button">
              <span>LOGIN WITH</span>
              <img src="/apple-logo.png" alt="apple" className="social-icon" />
            </button>

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