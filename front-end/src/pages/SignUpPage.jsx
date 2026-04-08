import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SignUpPage.css";

function SignUpPage() {
  // State to store user input values 
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Navigation between pages
  const navigate = useNavigate(); 

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {

      if(!username || !email ||!password){
        throw new Error("All fields are required")
      }

      const response = await fetch("http://localhost:3000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name:username,
          email,
          password,
        }),
      });
      const data = await response.json()
      if (!response.ok){
        throw new Error(data.message || "Failed to register")
      }
      navigate("/");

    }catch(err){
      console.error(err);
      alert(err.message);
    }
  };

  return (
    <div className="signup-container">
      <form onSubmit={handleSubmit} className="signup-box">

        {/* Title */}
        <h2 className="signup-title">REGISTER</h2>

        {/* Email input */}
        <input
          className="signup-input"
          type="text"
          placeholder="USERNAME"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
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
