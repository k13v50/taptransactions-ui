import { useState, useEffect } from "react";
import "./App.css";
import Login from "./Login";
import TripList from "./Trips";

function App() {
  const [user, setUser] = useState(localStorage.getItem("currentUsername")); //used to identify currentuser

  // 1. ADD THE SCREEN SIZE STATE
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // 2. ADD THE EFFECT TO LISTEN FOR RESIZE
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLoginSuccess = (username) => {
    //stores current user in local storage
    setUser(username);
    localStorage.setItem("currentUsername", username);
  };

  const handleLogout = () => {
    //remnoves current user from local storage
    setUser(null);
    localStorage.removeItem("currentUsername");
  };

  // HELPER FUNCTION FOR THE WELCOME MESSAGE
  const getWelcomeMessage = () => {
    if (!user) return "";
    // If it's mobile and the name is long, truncate it
    if (isMobile && user.length > 10) {
      return `Welcome, ${user.substring(0, 10)}...`;
    }
    return `Welcome, ${user}`;
  };

  return (
    <div className="App">
      {!user ? (
        <Login onLoginSuccess={handleLoginSuccess} />
      ) : (
        <>
          <nav className="navbar">
            <div className="nav-left">
              <h2 style={{ color: "white", margin: 0 }}>LittleTrips Portal</h2>
            </div>

            <div className="nav-right">
              <span className="welcome-text" title={user}>
                Welcome, {user}
              </span>
              <a
                href="#"
                className="logout-link"
                onClick={(e) => {
                  e.preventDefault();
                  handleLogout();
                }}
              >
                Logout
              </a>
            </div>
          </nav>
          <main className="main-content">
            <TripList isMobile={isMobile} />
          </main>
        </>
      )}
    </div>
  );
}

//encountered this: Uncaught SyntaxError: The requested module 'http://localhost:5173/src/App.jsx?t=1777716684336' doesn't provide an export named: 'default'
export default App; // <--- Make sure this line exists!
