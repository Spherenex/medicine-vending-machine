// import React, { useState } from 'react';
// import { mockUsers } from '../utils/mockData';
// import '../styles/App.css';
// const LoginComponent = ({ onLogin }) => {
//   const [credentials, setCredentials] = useState({ phoneNumber: '', password: '' });
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');

//   const handleLogin = async () => {
//     setLoading(true);
//     setError('');
    
//     // Simulate API call
//     await new Promise(resolve => setTimeout(resolve, 1000));
    
//     const phoneRegex = /^\d{10}$/;
//     if (!phoneRegex.test(credentials.phoneNumber)) {
//       setError('Please enter a valid 10-digit phone number');
//       setLoading(false);
//       return;
//     }

//     const userFound = mockUsers[credentials.phoneNumber];
//     if (userFound && userFound.password === credentials.password) {
//       const userData = {
//         phone: credentials.phoneNumber,
//         role: userFound.role,
//         name: userFound.name
//       };
//       onLogin(userData);
//     } else {
//       setError('Invalid phone number or password');
//     }
//     setLoading(false);
//   };

//   return (
//     <div className="login-container">
//       <div className="login-card">
//         <div className="login-header">
//           <div className="logo-section">
//             <div className="medical-cross">⚕</div>
//             <h1>MedVend Pro</h1>
//             <p> Medicine Dispensing System</p>
//           </div>
//         </div>

//         <div className="login-content">
//           <h2>Multi-User Access</h2>
//           <p>Enter your credentials to access the system</p>
          
//           <div className="form-group">
//             <label>Phone Number</label>
//             <input
//               type="tel"
//               value={credentials.phoneNumber}
//               onChange={(e) => setCredentials({
//                 ...credentials, 
//                 phoneNumber: e.target.value.replace(/\D/g, '').slice(0, 10)
//               })}
//               placeholder="Enter 10-digit phone number"
//               maxLength="10"
//               className="input"
//               disabled={loading}
//             />
//           </div>
          
//           <div className="form-group">
//             <label>Password</label>
//             <input
//               type="password"
//               value={credentials.password}
//               onChange={(e) => setCredentials({...credentials, password: e.target.value})}
//               placeholder="Enter password"
//               className="input"
//               disabled={loading}
//               onKeyPress={(e) => {
//                 if (e.key === 'Enter' && credentials.phoneNumber && credentials.password) {
//                   handleLogin();
//                 }
//               }}
//             />
//           </div>

//           {error && <div className="error-message">{error}</div>}

//           <button 
//             onClick={handleLogin}
//             disabled={loading || !credentials.phoneNumber || !credentials.password}
//             className="login-button"
//           >
//             {loading ? 'Authenticating...' : 'Login'}
//           </button>

//           <div className="demo-credentials">
//             <h4>Demo Credentials:</h4>
//             {/* <p><strong>Admin:</strong> 1234567890 / admin123</p>
//             <p><strong>Operator:</strong> 9876543210 / operator123</p> */}
//             <p><strong>Customer:</strong> 9886581294 / customer123</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LoginComponent;


import React, { useState, useEffect } from 'react';
import { mockUsers } from '../utils/mockData';
import '../styles/App.css';

const LoginSignupComponent = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [credentials, setCredentials] = useState({ phoneNumber: '', password: '' });
  const [signupData, setSignupData] = useState({ 
    phoneNumber: '', 
    password: '', 
    confirmPassword: '',
    name: '',
    role: 'customer' // Default role
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Local storage for registered users
  const [registeredUsers, setRegisteredUsers] = useState({});
  
  // Load registered users from localStorage on component mount
  useEffect(() => {
    const storedUsers = localStorage.getItem('registeredUsers');
    if (storedUsers) {
      setRegisteredUsers(JSON.parse(storedUsers));
    }
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(credentials.phoneNumber)) {
      setError('Please enter a valid 10-digit phone number');
      setLoading(false);
      return;
    }

    // Check both mock users and registered users
    const mockUserFound = mockUsers[credentials.phoneNumber];
    const registeredUserFound = registeredUsers[credentials.phoneNumber];
    
    if (mockUserFound && mockUserFound.password === credentials.password) {
      const userData = {
        phone: credentials.phoneNumber,
        role: mockUserFound.role,
        name: mockUserFound.name
      };
      onLogin(userData);
    } else if (registeredUserFound && registeredUserFound.password === credentials.password) {
      const userData = {
        phone: credentials.phoneNumber,
        role: registeredUserFound.role,
        name: registeredUserFound.name
      };
      onLogin(userData);
    } else {
      setError('Invalid phone number or password');
    }
    setLoading(false);
  };
  
  const handleSignup = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Validate phone number
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(signupData.phoneNumber)) {
      setError('Please enter a valid 10-digit phone number');
      setLoading(false);
      return;
    }
    
    // Validate password length
    if (signupData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }
    
    // Validate password match
    if (signupData.password !== signupData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
    
    // Validate name
    if (signupData.name.trim() === '') {
      setError('Please enter your name');
      setLoading(false);
      return;
    }
    
    // Check if phone number already exists
    if (mockUsers[signupData.phoneNumber] || registeredUsers[signupData.phoneNumber]) {
      setError('This phone number is already registered');
      setLoading(false);
      return;
    }
    
    // Create new user
    const newUser = {
      phoneNumber: signupData.phoneNumber,
      password: signupData.password,
      name: signupData.name,
      role: signupData.role
    };
    
    // Save to local state and localStorage
    const updatedUsers = { ...registeredUsers, [signupData.phoneNumber]: newUser };
    setRegisteredUsers(updatedUsers);
    localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
    
    setSuccess('Account created successfully! You can now login.');
    setLoading(false);
    
    // Reset form and switch to login view after a delay
    setTimeout(() => {
      setSignupData({ 
        phoneNumber: '', 
        password: '', 
        confirmPassword: '',
        name: '',
        role: 'customer'
      });
      setIsLogin(true);
      setSuccess('');
    }, 2000);
  };

  const renderLoginForm = () => (
    <>
      <h2>Login</h2>
      <p>Enter your credentials to access the system</p>
      
      <div className="form-group">
        <label>Phone Number</label>
        <input
          type="tel"
          value={credentials.phoneNumber}
          onChange={(e) => setCredentials({
            ...credentials, 
            phoneNumber: e.target.value.replace(/\D/g, '').slice(0, 10)
          })}
          placeholder="Enter 10-digit phone number"
          maxLength="10"
          className="input"
          disabled={loading}
        />
      </div>
      
      <div className="form-group">
        <label>Password</label>
        <input
          type="password"
          value={credentials.password}
          onChange={(e) => setCredentials({...credentials, password: e.target.value})}
          placeholder="Enter password"
          className="input"
          disabled={loading}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && credentials.phoneNumber && credentials.password) {
              handleLogin();
            }
          }}
        />
      </div>

      {error && <div className="error-message">{error}</div>}

      <button 
        onClick={handleLogin}
        disabled={loading || !credentials.phoneNumber || !credentials.password}
        className="login-button"
      >
        {loading ? 'Authenticating...' : 'Login'}
      </button>
      
      <div className="switch-form">
        Don't have an account? <button onClick={() => {setIsLogin(false); setError('')}} className="link-button">Sign up</button>
      </div>

      {/* <div className="demo-credentials">
        <h4>Demo Credentials:</h4>
        <p><strong>Customer:</strong> 9886581294 / customer123</p>
      </div> */}
    </>
  );

  const renderSignupForm = () => (
    <>
      <h2>Create Account</h2>
      <p>Sign up to access the medicine dispensing system</p>
      
      <div className="form-group">
        <label>Full Name</label>
        <input
          type="text"
          value={signupData.name}
          onChange={(e) => setSignupData({...signupData, name: e.target.value})}
          placeholder="Enter your full name"
          className="input"
          disabled={loading}
        />
      </div>
      
      <div className="form-group">
        <label>Phone Number</label>
        <input
          type="tel"
          value={signupData.phoneNumber}
          onChange={(e) => setSignupData({
            ...signupData, 
            phoneNumber: e.target.value.replace(/\D/g, '').slice(0, 10)
          })}
          placeholder="Enter 10-digit phone number"
          maxLength="10"
          className="input"
          disabled={loading}
        />
      </div>
      
      <div className="form-group">
        <label>Password</label>
        <input
          type="password"
          value={signupData.password}
          onChange={(e) => setSignupData({...signupData, password: e.target.value})}
          placeholder="Create password (min. 6 characters)"
          className="input"
          disabled={loading}
        />
      </div>
      
      <div className="form-group">
        <label>Confirm Password</label>
        <input
          type="password"
          value={signupData.confirmPassword}
          onChange={(e) => setSignupData({...signupData, confirmPassword: e.target.value})}
          placeholder="Confirm your password"
          className="input"
          disabled={loading}
        />
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}

      <button 
        onClick={handleSignup}
        disabled={loading || 
          !signupData.phoneNumber || 
          !signupData.password || 
          !signupData.confirmPassword || 
          !signupData.name}
        className="signup-button"
      >
        {loading ? 'Creating Account...' : 'Sign Up'}
      </button>
      
      <div className="switch-form">
        Already have an account? <button onClick={() => {setIsLogin(true); setError('')}} className="link-button">Login</button>
      </div>
    </>
  );

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="logo-section">
            <div className="medical-cross">⚕</div>
            <h1>MedVend Pro</h1>
            <p>Medicine Dispensing System</p>
          </div>
        </div>

        <div className="login-content">
          {isLogin ? renderLoginForm() : renderSignupForm()}
        </div>
      </div>
    </div>
  );
};

export default LoginSignupComponent;