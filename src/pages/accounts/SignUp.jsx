import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/Auth.css";
import "../../styles/SignUp.css";
import logo from "../../assets/logo.png";
import Man from "../../assets/Man.png";
import googleLogo from "../../assets/Google.png";
import appleLogo from "../../assets/Apple.png";
import microsoftLogo from "../../assets/Microsoft.png";
import PageWrapper from '../../components/PageWrapper';
import backIcon from "../../assets/back-icon.png"; // Assuming you have a back icon
const SignUp = () => {
  const navigate = useNavigate();
  // const { register } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    password2: "",
    first_name: "",
    last_name: "",
    
    phone_number: "",
    agreeToTerms: false
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    if (formData.password !== formData.password2) {
      setError("Passwords do not match");
      return;
    }

    if (!formData.agreeToTerms) {
      setError("Please agree to the Terms & Conditions");
      return;
    }

    setLoading(true);
    const finalData = {
      user: {
          email: formData.email,
          password: formData.password,
          firstname: formData.first_name,
          lastname: formData.last_name
        },
        contact_number: formData.phone_number
    }
    console.log(finalData)
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/customers/register/`, 
        finalData, {
        headers: {
          'Content-Type': 'application/json',
        },
  });

      setSuccessMessage("User created successfully! Redirecting to login...");
      
      setTimeout(() => {
        navigate("/signin");
      }, 3000);

    } catch (err) {
    if (err.response && err.response.data) {
      // Check if the response data has a detail or field-specific error
      if (typeof err.response.data === 'string') {
        setError(err.response.data);
      } else if (err.response.data.detail) {
        setError(err.response.data.detail);
      } else {
        // Format field-specific errors into a readable string
        const errorMessages = Object.entries(err.response.data)
          .map(([field, messages]) => `${messages.join(', ')}`)
          .join('\n');
        setError(errorMessages);
      }
    } else {
      setError(err.message || "Registration failed");
    }
    } finally {
      setLoading(false);
    }
};



  return (
    <PageWrapper>
      <div className="auth-page-container">
        <div className="auth-content">
          <div className="min-h-screen pt-16 bg-white">
            <div className="signup-container">
              {/* Left Section */}
              <div className="left-section">
                <div className="signup-left">
                  <div className="signup-logo">
                    <img src={logo} alt="CapFit Logo" />
                  </div>
                  <div className="signup-image">
                    <img src={Man} alt="Fitness Man" />
                  </div>
                </div>
              </div>

              {/* Right Section */}
              <div className="signup-right">
                <a href="/" className="back-btn">
                    <img src={backIcon} alt="Back" />
                    Back to Home
                </a>
                <h2 className="signup-title">Sign-up</h2>
                {successMessage && <div className="success-message">{successMessage}</div>}
                {error && <div className="error-message">{error}</div>}

                <form className="signup-form" onSubmit={handleSubmit}>
                  <div className="form-row">
                    <div className="form-group">
                      <label>First Name*</label>
                      <input 
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        placeholder="First name"
                        className="form-input"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Last Name*</label>
                      <input 
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        placeholder="Last name"
                        className="form-input"
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Email*</label>
                    <input 
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      className="form-input"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input 
                      type="tel"
                      name="phone_number"
                      value={formData.phone_number}
                      onChange={handleChange}
                      placeholder="Enter your phone number"
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label>Password*</label>
                    <input 
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Re-type Password*</label>
                    <input 
                      type="password"
                      name="password2"
                      value={formData.password2}
                      onChange={handleChange}
                      placeholder="Re-enter your password"
                      className="form-input"
                      required
                    />
                  </div>
                  <div className="form-options">
                    <label className="remember-me">
                      <input 
                        type="checkbox"
                        name="agreeToTerms"
                        checked={formData.agreeToTerms}
                        onChange={handleChange}
                      /> I agree to the Terms & Conditions
                    </label>
                  </div>
                  <button 
                    type="submit" 
                    className="signup-button"
                    disabled={loading}
                  >
                    {loading ? "Creating Account..." : "Sign Up"}
                  </button>
                </form>
                <p className="signin-text">
                  Already have an account? <Link to="/signin" className="signin-link">Sign In</Link>
                </p>
                <p className="or-text">or</p>
                <div className="social-logos">
                  <div className="social-icon">
                    <img src={googleLogo} alt="Google" />
                  </div>
                  <div className="social-icon">
                    <img src={appleLogo} alt="Apple" />
                  </div>
                  <div className="social-icon">
                    <img src={microsoftLogo} alt="Microsoft" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default SignUp; 