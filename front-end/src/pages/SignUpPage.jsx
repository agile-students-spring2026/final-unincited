import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SignUpPage.css";

function SignUpPage() {
  // State to store user input values
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Navigation between pages
  const navigate = useNavigate(); 

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Sign up:", email, password);
  };

  return (
    <div className="signup-container">
      <form onSubmit={handleSubmit} className="signup-box">

        {/* Title */}
        <h2 className="signup-title">REGISTER</h2>

        {/* Email input */}
        <input
          className="signup-input"
          type="email"
          placeholder="E-MAIL"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password input */}
        <input
          className="signup-input"
          type="password"
          placeholder="PASSWORD"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Submit button */}
        <input
          className="signup-button"
          type="submit"
          value="REGISTER"
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

export default SignUpPage;
