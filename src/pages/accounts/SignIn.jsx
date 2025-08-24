import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "../../styles/Auth.css";
import "../../styles/SignIn.css";
import logo from "../../assets/logo.png";
import Lady from "../../assets/Lady.png";
import Google from "../../assets/Google.png";
import appleLogo from "../../assets/Apple.png";
import Microsoft from "../../assets/Microsoft.png";
import PageWrapper from '../../components/PageWrapper';
import backIcon from "../../assets/back-icon.png";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate(); // Initialize navigate

  // Check if user is authenticated
  useEffect(() => {
    // Check localStorage or context for authentication state
    const token = localStorage.getItem('token'); // Adjust based on your auth implementation
    if (token) {
      navigate('/dashboard'); // Redirect to dashboard if token exists
    }
  }, [navigate]);

  
  

  const getCookie = (name) => {
    const cookieValue = document.cookie.split('; ').find(row => row.startsWith(`${name}=`));
    return cookieValue ? cookieValue.split('=')[1] : null;
  };
  
  // axios.defaults.headers.common['X-CSRFToken'] = getCookie('csrftoken');
  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/signin/`, {
        email,
        password,
      });
     

      localStorage.setItem('token', response.data.token); // Adjust based on the response structure
      localStorage.setItem('role', response.data.role); // Store user role if available
      setMessage('Signin successful!');
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 3000);
    } catch (err) {
      if (err.response && err.response.data) {
        // Check if it's a plain string error
        if (typeof err.response.data === 'string') {
          setError(err.response.data);
        } 
        // Check for DRF-style "detail" error
        else if (err.response.data.detail) {
          setError(err.response.data.detail);
        } 
        // Handle field-specific errors
        else {
          const errorMessages = Object.entries(err.response.data)
            .map(([field, messages]) => {
              if (Array.isArray(messages)) {
                return `${field}: ${messages.join(', ')}`;
              } else {
                return `${field}: ${messages}`;
              }
            })
            .join('\n');
          
          setError(errorMessages); // ✅ This was missing
        }
      } else {
        setError(err.message || "Registration failed");
      }
    } finally {
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
                  <a href="/" className="back-btn">
                    <img src={backIcon} alt="Back" />
                    Back to Home
                  </a>
                  <h2 className="signin-title">Sign In</h2>
                  <p className="signin-subtitle">
                    Welcome! Please enter your details.
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