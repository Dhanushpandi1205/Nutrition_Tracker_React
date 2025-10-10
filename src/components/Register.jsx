import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Usercontext } from "../contexts/Usercontext";
import './Auth.css';

const BASE_URL = 'https://api-backend-ool6.onrender.com';


export default function Register() {
    const navigate = useNavigate();
    const loggedData = useContext(Usercontext);

    const [userDetails, setUserDetails] = useState({
        name: "",
        email: "",
        password: "",
        age: ""
    })

  const [message,setMsg]= useState({
     type:"invisible-msg",
     text:""
  })



  function handleInput(event){
    
    setUserDetails((prevState)=>{

        return{...prevState,[event.target.name]:event.target.value}
    })

  }

  async function handleSubmit(event) {
    event.preventDefault();
    
    try {
      // First register the user
      const registerRes = await fetch(`${BASE_URL}/register`, {
        method: "POST",
        body: JSON.stringify(userDetails),
        headers: {
          "Content-Type": "application/json"
        }
      });

      const registerData = await registerRes.json();

      if (!registerRes.ok) {
        setMsg({ type: "error", text: registerData.message || "Registration failed" });
        setTimeout(() => setMsg({ type: "invisible-msg", text: "" }), 5000);
        return;
      }

      // If registration successful, automatically log in
      const loginRes = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        body: JSON.stringify({
          email: userDetails.email,
          password: userDetails.password
        }),
        headers: {
          "Content-Type": "application/json"
        }
      });

      const loginData = await loginRes.json();

      if (!loginRes.ok) {
        setMsg({ type: "error", text: "Registration successful but login failed. Please try logging in." });
        setTimeout(() => navigate("/login"), 2000);
        return;
      }

      // Store user data with registration details
      const userData = {
        ...loginData,
        name: userDetails.name,
        email: userDetails.email,
        age: userDetails.age
      };

      // Save to localStorage and context
      localStorage.setItem("nutrify-user", JSON.stringify(userData));
      loggedData.setLoggedUser(userData);

      setMsg({ type: "success", text: "Registration successful! Redirecting..." });
      setTimeout(() => navigate("/track"), 1000);

    } catch (err) {
      console.error("Registration error:", err);
      setMsg({ type: "error", text: "Network error. Please try again." });
    }
  }



    return (
      <section className="auth-container">
        <form className="auth-form" onSubmit={handleSubmit}>
          <h1>Start Your Fitness Journey</h1>
          <p>Create an account to track your nutrition</p>

          <input
            className="auth-input"
            type="text"
            required
            onChange={handleInput}
            placeholder="Enter Your Name"
            name="name"
            value={userDetails.name}
          />

          <input
            className="auth-input"
            type="email"
            required
            onChange={handleInput}
            placeholder="Enter Email Address"
            name="email"
            value={userDetails.email}
          />

          <input
            className="auth-input"
            type="password"
            required
            maxLength={8}
            onChange={handleInput}
            placeholder="Create Password"
            name="password"
            value={userDetails.password}
          />

          <input
            className="auth-input"
            type="number"
            required
            max={100}
            min={12}
            onChange={handleInput}
            placeholder="Enter Your Age"
            name="age"
            value={userDetails.age}
          />

          <button className="auth-button">Create Account</button>

          <p>
            Already have an account? <Link to="/login" className="auth-link">Login</Link>
          </p>

          {message.type !== "invisible-msg" && (
            <p className={message.type === "success" ? "success-message" : "error-message"}>
              {message.text}
            </p>
          )}
        </form>
      </section>
    );
}