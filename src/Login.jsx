import React, { useState } from "react";
import "./App.css";
import "./Login.css";

const Login = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(
        "http://localhost:8080/little-trips/api/v1/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username }),
        },
      );

      if (!response.ok) {
        if (response.status === 401 || response.status === 404) {
          throw new Error("Invalid login. User not recognized.");
        }
        throw new Error("Server error. Please try again later.");
      }

      const data = await response.json();
      localStorage.setItem("token", data.token); //stores jwt token to localstorage

      // CRITICAL: Call the success prop to update the main App state
      if (onLoginSuccess) {
        onLoginSuccess(data.user || username);
      }
    } catch (err) {
      if (err.name === "TypeError" || err.message.includes("fetch")) {
        setError("Connection failed. Unable to connect to server.");
      } else {
        setError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2 style={{ color: "var(--lp-jungle-green)" }}>LittleTrips Portal</h2>

        {error && <div className="login-error-msg">{error}</div>}

        {/* CHANGED handleLogin to handleSubmit */}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter Username or ID"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isLoading}
            required
          />
          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? "Connecting..." : "Access Dashboard"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
