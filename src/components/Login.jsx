import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Usercontext } from "../contexts/Usercontext";

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
        localStorage.setItem("nutrify-user", JSON.stringify(data));
        loggedData.setLoggedUser(data);
        navigate("/track");
      }

    } catch (err) {
      console.log("Network error:", err);
      setMessage({ type: "error", text: "Network error. Try again." });
      setTimeout(() => setMessage({ type: "invisible-msg", text: "" }), 5000);
    }
  }

  return (
    <section className="container">
      <form className="form" onSubmit={handleLogin}>
        <h1>Login to be Fit</h1>

        <input
          className="inp"
          required
          type="text"
          placeholder="Enter Email"
          name="email"
          value={userCred.email}
          onChange={handleInput}
        />

        <input
          className="inp"
          required
          type="password"
          placeholder="Enter Password"
          name="password"
          value={userCred.password}
          onChange={handleInput}
        />

        <button className="btn">Login</button>

        <p>
          Don't have an account? <Link to="/register">Register Now</Link>
        </p>

        <p className={message.type}>{message.text}</p>
      </form>
    </section>
  );
}
