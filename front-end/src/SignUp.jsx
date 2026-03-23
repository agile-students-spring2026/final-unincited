import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // reuse styles

const SignUp = () => {
  // State to store user input values
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

 // Used to navigate between the pages
  const navigate = useNavigate(); 

  // Handles the form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Sign up:", email, password);
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-box">

        <h2 style={{ textAlign: "center" }}>REGISTER</h2>

        {/* Email */}
        <input
          className="login-input"
          type="email"
          placeholder="E-MAIL"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {/* Password */}
        <input
          className="login-input"
          type="password"
          placeholder="PASSWORD"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Submit */}
        <input
          className="login-button"
          type="submit"
          value="REGISTER"
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

export default SignUp;