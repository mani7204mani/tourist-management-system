import React, { useState } from 'react';

function LoginForm({ checkLoginStatus }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [message, setMessage] = useState('');
  const [showAdminModal, setShowAdminModal] = useState(false);
  
  // Registration fields
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  
  // Admin login states
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminMessage, setAdminMessage] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    
    fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    })
    .then(res => res.json().then(data => ({ status: res.status, body: data })))
    .then(({ status, body }) => {
      if (status === 200) {
        setMessage(body.message || 'Login successful!');
        setTimeout(() => {
          checkLoginStatus();
        }, 500);
      } else if (status === 401) {
        setMessage('Invalid credentials.');
      } else {
        setMessage(`An error occurred: Status ${status}`);
      }
    })
    .catch(err => {
      setMessage('Network error or server unreachable.');
      console.error('Fetch error:', err);
    });
  };

  const handleSendOTP = (e) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      setMessage('Please enter a valid email address.');
      return;
    }
    
    if (!phone || phone.length !== 10) {
      setMessage('Please enter a valid 10-digit phone number.');
      return;
    }
    
    if (!username || username.length < 3) {
      setMessage('Username must be at least 3 characters.');
      return;
    }
    
    setMessage('Sending OTP...');
    
    fetch('/api/send_otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, username, phone }),
    })
    .then(res => res.json().then(data => ({ status: res.status, body: data })))
    .then(({ status, body }) => {
      if (status === 200) {
        setMessage('OTP sent to your email! Please check and enter it below.');
        setOtpSent(true);
      } else if (status === 409) {
        setMessage(body.message);
      } else {
        setMessage(body.message || 'Failed to send OTP.');
      }
    })
    .catch(err => {
      setMessage('Network error. Please try again.');
      console.error('OTP error:', err);
    });
  };

  const handleVerifyAndRegister = (e) => {
    e.preventDefault();
    
    if (!otp || otp.length !== 6) {
      setMessage('Please enter a valid 6-digit OTP.');
      return;
    }
    
    if (!password || password.length < 6) {
      setMessage('Password must be at least 6 characters.');
      return;
    }
    
    setMessage('Verifying OTP and creating account...');
    
    fetch('/api/verify_register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, otp, password }),
    })
    .then(res => res.json().then(data => ({ status: res.status, body: data })))
    .then(({ status, body }) => {
      if (status === 201) {
        setMessage('Registration successful! Please login with your credentials.');
        setOtpVerified(true);
        setTimeout(() => {
          setIsRegistering(false);
          resetRegistrationForm();
        }, 2000);
      } else {
        setMessage(body.message || 'Verification failed.');
      }
    })
    .catch(err => {
      setMessage('Network error. Please try again.');
      console.error('Verification error:', err);
    });
  };

  const resetRegistrationForm = () => {
    setUsername('');
    setEmail('');
    setPhone('');
    setPassword('');
    setOtp('');
    setOtpSent(false);
    setOtpVerified(false);
    setMessage('');
  };

  const handleAdminLogin = (e) => {
    e.preventDefault();
    setAdminMessage('Verifying admin credentials...');
    
    fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: adminUsername, password: adminPassword }),
    })
    .then(res => res.json().then(data => ({ status: res.status, body: data })))
    .then(({ status, body }) => {
      if (status === 200 && body.isAdmin) {
        setAdminMessage('Admin access granted! 🔑');
        setTimeout(() => {
          checkLoginStatus();
        }, 800);
      } else if (status === 200 && !body.isAdmin) {
        setAdminMessage('Error: This account does not have admin privileges.');
      } else {
        setAdminMessage('Invalid admin credentials.');
      }
    })
    .catch(err => {
      setAdminMessage('Network error or server unreachable.');
      console.error('Admin login error:', err);
    });
  };

  return (
    <>
      <div className="split-login-container">
        
        <div
          className="split-login-image"
          style={{ backgroundImage: `url(/Tour.jpg)` }}
        >
          <div className="image-overlay"></div>
        </div>

        <div className="split-login-form-area">
          <h1 className="form-area-title">Tourist Management System</h1>
          <div className="login-form-box">
            <h2>{isRegistering ? 'Create Account' : 'User Login'}</h2>
            {message && <p className="message">{message}</p>}
            
            {!isRegistering ? (
              // Login Form
              <form onSubmit={handleLogin}>
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button type="submit" className="login-button">
                  Login
                </button>
              </form>
            ) : !otpSent ? (
              // Registration Form - Step 1: Send OTP
              <form onSubmit={handleSendOTP}>
                <input
                  type="text"
                  placeholder="Choose Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <input
                  type="tel"
                  placeholder="Phone Number (10 digits)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  maxLength="10"
                  required
                />
                <button type="submit" className="login-button">
                  Send OTP
                </button>
              </form>
            ) : (
              // Registration Form - Step 2: Verify OTP
              <form onSubmit={handleVerifyAndRegister}>
                <input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength="6"
                  required
                />
                <input
                  type="password"
                  placeholder="Create Password (min 6 characters)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button type="submit" className="login-button">
                  Verify & Register
                </button>
                <button 
                  type="button" 
                  onClick={() => {
                    setOtpSent(false);
                    setOtp('');
                    setMessage('');
                  }}
                  className="register-toggle"
                >
                  Resend OTP
                </button>
              </form>
            )}

            {/* Admin Login Button */}
            {!isRegistering && (
              <button 
                type="button" 
                onClick={() => setShowAdminModal(true)}
                className="login-button admin-login-trigger-btn"
              >
                🔐 Administrator Access
              </button>
            )}

            <button
              onClick={() => {
                setIsRegistering(!isRegistering);
                resetRegistrationForm();
              }}
              className="register-toggle"
            >
              {isRegistering ? 'Already a user? Login' : 'Not a user? Register'}
            </button>
          </div>
        </div>
      </div>

      {/* Admin Login Modal */}
      {showAdminModal && (
        <div className="admin-login-modal-backdrop" onClick={() => setShowAdminModal(false)}>
          <div className="admin-login-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h2>🔐 Administrator Login</h2>
              <button 
                onClick={() => setShowAdminModal(false)} 
                className="admin-modal-close-btn"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleAdminLogin} className="admin-login-form">
              {adminMessage && (
                <p className={`admin-message ${adminMessage.includes('granted') ? 'success' : 'error'}`}>
                  {adminMessage}
                </p>
              )}
              
              <div className="admin-input-group">
                <label>Admin Username</label>
                <input
                  type="text"
                  placeholder="Enter admin username"
                  value={adminUsername}
                  onChange={(e) => setAdminUsername(e.target.value)}
                  required
                  autoFocus
                />
              </div>
              
              <div className="admin-input-group">
                <label>Admin Password</label>
                <input
                  type="password"
                  placeholder="Enter admin password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  required
                />
              </div>
              
              <button type="submit" className="admin-login-submit-btn">
                Verify & Login
              </button>
              
              <div className="admin-credentials-hint">
                <small>Default: admin / admin123</small>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default LoginForm;