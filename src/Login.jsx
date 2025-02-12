import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "./Login.css";

const Login = () => {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
    setError(""); // Clear error on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Simulate an API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (
      storedUser &&
      storedUser.email === loginData.email &&
      storedUser.password === loginData.password
    ) {
      localStorage.setItem("currentUser", JSON.stringify(storedUser));
      const existingContacts = JSON.parse(localStorage.getItem("friendContactList")) || {};
      if (!existingContacts[storedUser.email]) {
        existingContacts[storedUser.email] = [];
        localStorage.setItem("friendContactList", JSON.stringify(existingContacts));
      }
      navigate("/contacts");
    } else {
      setError("Invalid email or password.");
    }

    setIsLoading(false);
  };

  return (
    <div className="login-page">
      <motion.div
        className="login-container"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.form
          className="login-form"
          onSubmit={handleSubmit}
          animate={error ? { x: [0, -10, 10, -10, 10, 0] } : { x: 0 }}
          transition={{ type: "spring", stiffness: 100 }}
        >
          <h2>Login</h2>
          <div className="input-container">
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={loginData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-container">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={loginData.password}
              onChange={handleChange}
              required
            />
          </div>

          <AnimatePresence>
            {error && (
              <motion.span 
                className="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {error}
              </motion.span>
            )}
          </AnimatePresence>

          <motion.button 
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Log In"}
          </motion.button>

          <div className="divider"></div>

          <p className="signup-link">
            Don't have an account?{" "}
            <a href="/signup" onClick={(e) => { e.preventDefault(); navigate("/signup"); }}>
              Sign up
            </a>
          </p>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default Login;