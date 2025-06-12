// import React, { useState } from 'react';
// import QRScanner from './QRScanner';
// import AIChatbot from './AIChatbot';
// import '../styles/App.css';

// const Dashboard = ({ user, onLogout }) => {
//   const [selectedOption, setSelectedOption] = useState(null);

//   // Function to handle option selection
//   const handleOptionSelect = (option) => {
//     setSelectedOption(option);
//   };

//   // Function to go back to options
//   const handleBack = () => {
//     setSelectedOption(null);
//   };

//   return (
//     <div className="dashboard-container">
//       {/* Header */}
//       <div className="header">
//         <div className="header-left">
//           <h1>🏥 MedVend Pro Dashboard</h1>
//           <span className="user-info">
//             Welcome, {user.name} ({user.role.toUpperCase()})
//           </span>
//         </div>
//         <button onClick={onLogout} className="logout-button">
//           Logout
//         </button>
//       </div>

//       <div className="main-content">
//         {/* Main Dashboard Content */}
//         <div className="dashboard-content">
//           {!selectedOption ? (
//             // Option Selection Screen
//             <div className="option-selection">
//               <h2>Select an Option</h2>
//               <div className="option-buttons">
//                 <button 
//                   className="option-select-button"
//                   onClick={() => handleOptionSelect('qr')}
//                 >
//                   📱 QR Code Scanner
//                 </button>
//                 <button 
//                   className="option-select-button"
//                   onClick={() => handleOptionSelect('chatbot')}
//                 >
//                   🤖 AI Symptom Assistant
//                 </button>
//               </div>
//             </div>
//           ) : (
//             // Selected Component with Back Button
//             <div className="selected-component">
//               <button className="back-button" onClick={handleBack}>
//                 ← Back to Options
//               </button>
              
//               {selectedOption === 'qr' ? <QRScanner /> : <AIChatbot />}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

import React, { useState } from 'react';
import QRScanner from './QRScanner';
import AIChatbot from './AIChatbot';
import Inventory from './InventoryComponent';
import '../styles/App.css';

const Dashboard = ({ user, onLogout }) => {
  const [selectedOption, setSelectedOption] = useState(null);

  // Function to handle option selection
  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  // Function to go back to options
  const handleBack = () => {
    setSelectedOption(null);
  };

  return (
    <div className="dashboard-container">
      {/* Header */}
      <div className="header">
        <div className="header-left">
          <h1>🏥 MedVend Pro Dashboard</h1>
          <span className="user-info">
            Welcome, {user.name} ({user.role ? user.role.toUpperCase() : 'USER'})
          </span>
        </div>
        <button onClick={onLogout} className="logout-button">
          Logout
        </button>
      </div>

      <div className="main-content">
        {/* Main Dashboard Content */}
        <div className="dashboard-content">
          {!selectedOption ? (
            // Option Selection Screen
            <div className="option-selection">
              <h2>Select an Option</h2>
              <div className="option-buttons">
                <button 
                  className="option-select-button"
                  onClick={() => handleOptionSelect('qr')}
                >
                  📱 QR Code Scanner
                </button>
                <button 
                  className="option-select-button"
                  onClick={() => handleOptionSelect('chatbot')}
                >
                  🤖 AI Symptom Assistant
                </button>
                <button 
                  className="option-select-button"
                  onClick={() => handleOptionSelect('inventory')}
                >
                  📦 Medicine Inventory
                </button>
              </div>
            </div>
          ) : (
            // Selected Component with Back Button
            <div className="selected-component">
              <button className="back-button" onClick={handleBack}>
                ← Back to Options
              </button>
              
              {selectedOption === 'qr' && <QRScanner />}
              {selectedOption === 'chatbot' && <AIChatbot />}
              {selectedOption === 'inventory' && <Inventory />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;