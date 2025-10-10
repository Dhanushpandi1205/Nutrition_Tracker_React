import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Usercontext } from "../contexts/Usercontext";
import './Auth.css';

const BASE_URL = "https://api-backend-ool6.onrender.com";

export default function Login() {
  const loggedData = useContext(Usercontext);
  const navigate = useNavigate();

  const [userCred, setUserCred] = useState({
    email: "",
    password: ""
  });

  const [message, setMessage] = useState({
    type: "invisible-msg",
    text: ""
  });

  // Handle input change
  function handleInput(event) {
    setUserCred((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value
    }));
  }

  // Handle login submit
  async function handleLogin(event) {
    event.preventDefault();

    try {
      const res = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        body: JSON.stringify(userCred),
        headers: { "Content-Type": "application/json" }
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        // Show backend error message
        const errMsg = data.message || "Login failed";
        setMessage({ type: "error", text: errMsg });
        setTimeout(() => setMessage({ type: "invisible-msg", text: "" }), 5000);
        return;
      }

      // Login successful
      if (data.token) {
        console.log('Login response data:', data);
        
        // Make sure we have all user data
        const userData = {
          ...data,
          name: data.name || data.username,
          email: data.email,
          age: data.age,
          userid: data.userid || data._id,
          token: data.token
        };

        localStorage.setItem("nutrify-user", JSON.stringify(userData));
        loggedData.setLoggedUser(userData);
        navigate("/track");
      }

    } catch (err) {
      console.log("Network error:", err);
      setMessage({ type: "error", text: "Network error. Try again." });
      setTimeout(() => setMessage({ type: "invisible-msg", text: "" }), 5000);
    }
  }

  return (
    <section className="auth-container">
      <form className="auth-form" onSubmit={handleLogin}>
        <h1>Welcome Back!</h1>
        <p>Login to continue your fitness journey</p>

        <input
          className="auth-input"
          required
          type="email"
          placeholder="Enter Email"
          name="email"
          value={userCred.email}
          onChange={handleInput}
        />

        <input
          className="auth-input"
          required
          type="password"
          placeholder="Enter Password"
          name="password"
          value={userCred.password}
          onChange={handleInput}
        />

        <button className="auth-button">
          Login
        </button>

        <p>
          Don't have an account? <Link to="/register" className="auth-link">Register Now</Link>
        </p>

        {message.type !== "invisible-msg" && (
          <p className={message.type === "error" ? "error-message" : "success-message"}>
            {message.text}
          </p>
        )}
      </form>
    </section>
  );
}
