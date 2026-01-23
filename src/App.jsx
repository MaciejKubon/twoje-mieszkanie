import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

function App() {
  const [currentPage, setCurrentPage] = useState("login");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [snackbar, setSnackbar] = useState({
    message: "",
    type: "",
    isVisible: false,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      setCurrentPage("dashboard");
    }
  }, []);

  const showSnackbar = (message, type = "success") => {
    setSnackbar({ message, type, isVisible: true });
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setCurrentPage("dashboard");
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      const apiUrl = import.meta.env.VITE_API_URL;

      if (token) {
        await fetch(`${apiUrl}/api/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("first_name");
      localStorage.removeItem("last_name");

      setIsLoggedIn(false);
      setCurrentPage("login");
      showSnackbar("Wylogowano pomyślnie", "success");
    }
  };

  useEffect(() => {
    if (snackbar.isVisible) {
      const timer = setTimeout(() => {
        setSnackbar((prev) => ({ ...prev, isVisible: false }));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [snackbar.isVisible]);

  return (
    <>
      <div
        className={`snackbar ${snackbar.type} ${snackbar.isVisible ? "show" : ""}`}
      >
        {snackbar.message}
      </div>

      {isLoggedIn ? (
        <Dashboard onLogout={handleLogout} showSnackbar={showSnackbar} />
      ) : (
        <>
          {currentPage === "login" ? (
            <Login
              onNavigateToRegister={() => setCurrentPage("register")}
              onLoginSuccess={handleLoginSuccess}
              showSnackbar={showSnackbar}
            />
          ) : (
            <Register
              onSwitchToLogin={() => setCurrentPage("login")}
              showSnackbar={showSnackbar}
            />
          )}
        </>
      )}
    </>
  );
}

export default App;
