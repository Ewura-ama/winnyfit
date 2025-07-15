import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../styles/Auth.css";
import "../../styles/SignIn.css";
import logo from "../../assets/logo.png";
import Lady from "../../assets/Lady.png";
import Google from "../../assets/Google.png";
import appleLogo from "../../assets/Apple.png";
import Microsoft from "../../assets/Microsoft.png";
import PageWrapper from '../../components/PageWrapper';

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // const { login } = useAuth();
  const { login } = {email: "ameyeduwaa@gmail.com", role: "instructor"}
  const navigate = useNavigate();
  const location = useLocation();

  // Check if we were redirected from another page
  const from = location.state?.from || "/";
  const message = location.state?.message || null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!email || !password) {
      setError("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (error) {
      console.error("Sign in error:", error);
      setError(error.message || "Failed to sign in. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <PageWrapper>
      <div className="auth-container">
        <div className="auth-page-container">
          <div className="auth-content">
            <div className="min-h-screen pt-16 bg-white">
              <div className="signin-container">
                <div className="left-section">
                  <div className="signin-left">
                    <div className="signin-logo">
                      <img src={logo} alt="CapFit" />
                    </div>
                    <div className="signin-image">
                      <img src={Lady} alt="Lady" />
                    </div>
                  </div>
                </div>
                
                <div className="signin-right">
                  <h2 className="signin-title">Sign In</h2>
                  <p className="signin-subtitle">
                    Welcome back! Please enter your details.
                  </p>

                  {error && (
                    <div className="signin-error">
                      {error}
                    </div>
                  )}

                  {message && (
                    <div className="signin-message">
                      {message}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="signin-form">
                    <div className="form-group">
                      <label htmlFor="email">Email</label>
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="form-input"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="password">Password</label>
                      <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="form-input"
                        required
                      />
                    </div>

                    <div className="form-options">
                      <div className="remember-me">
                        <input type="checkbox" id="remember" />
                        <label htmlFor="remember">Remember me</label>
                      </div>
                      <Link to="/forgot-password" className="forgot-password">
                        Forgot password?
                      </Link>
                    </div>

                    <button
                      type="submit"
                      className="signin-button"
                      disabled={isLoading}
                    >
                      {isLoading ? "Signing in..." : "Sign In"}
                    </button>

                    <p className="signup-text">
                      Don't have an account?{" "}
                      <Link to="/signup" className="signup-link">
                        Sign up
                      </Link>
                    </p>

                    <div className="signin-divider">
                      <span>Or continue with</span>
                    </div>

                    <div className="social-logos">
                      <div className="social-icon">
                        <img src={Google} alt="Google" />
                      </div>
                      <div className="social-icon">
                        <img src={appleLogo} alt="Apple" />
                      </div>
                      <div className="social-icon">
                        <img src={Microsoft} alt="Microsoft" />
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default SignIn;