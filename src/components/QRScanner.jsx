// // QRScanner.jsx
// import React, { useState } from 'react';
// import { mockPrescriptions } from '../utils/mockData';

// const QRScanner = () => {
//     const [selectedQR, setSelectedQR] = useState(null);

//     // Handle QR code selection
//     const handleQRSelection = (qrCode) => {
//         setSelectedQR(qrCode);
//     };

//     // Reset scanner
//     const resetScanner = () => {
//         setSelectedQR(null);
//     };
//     const qrCodeImages = {
//         'QR001': '../src/assets/final_vending_machine_qr.png',
//         'QR002': '../src/assets/vending_machine_1_qr.png',
//         'QR003': '../src/assets/vending_machine_2_qr.png'
//     };
//     return (
//         <div className="qr-scanner-container">
//             <div className="qr-scanner-header">
//                 <h3>📱 QR Code Prescription Scanner</h3>
//                 <p>Scan or select a prescription QR code to dispense medicine</p>
//             </div>

//             {/* QR Code Display */}
//             <div className="scanner-interface">
//                 {!selectedQR ? (
//                     <div className="qr-options">
//                         <h4>Select a QR Code:</h4>
//                         <div className="qr-code-grid">
//                             {Object.keys(mockPrescriptions).map((qrCode) => (
//                                 <div key={qrCode} className="qr-code-option" onClick={() => handleQRSelection(qrCode)}>
//                                     <div className="qr-code-image">
//                                         <img
//                                             src={qrCodeImages[qrCode]}
//                                             alt={`QR Code for ${mockPrescriptions[qrCode].medicines[0].name}`}
//                                             className="qr-code-img"
//                                         />
//                                         <div className="qr-code-id">{qrCode}</div>
//                                     </div>
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 ) : (
//                     <div className="scan-results">
//                         <div className="prescription-header">
//                             <div className="success-indicator">✅ Prescription QR Code Scanned Successfully</div>
//                             <div className="prescription-info">
//                                 <p><strong>Medicine:</strong> {mockPrescriptions[selectedQR].medicines[0].name}</p>
//                             </div>
//                         </div>

//                         <div className="prescription-summary">
//                             <div className="action-buttons">
//                                 <button className="dispense-button">
//                                     🏥 Dispense Medicine
//                                 </button>
//                                 <button
//                                     onClick={resetScanner}
//                                     className="scan-again-button"
//                                 >
//                                     🔄 Scan Another
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 )}
//             </div>

//             {/* Scanner Information */}
//             <div className="scanner-info">
//                 <h4>📋 How to Use:</h4>
//                 <ul>
//                     <li>🎯 Select one of the QR codes above</li>
//                     <li>🏥 Click "Dispense Medicine" to purchase</li>
//                 </ul>
//             </div>
//         </div>
//     );
// };

// export default QRScanner;






// import React, { useState, useRef, useCallback, useEffect } from 'react';
// import Webcam from 'react-webcam';
// import jsQR from 'jsqr';

// const QRScanner = () => {
//   const webcamRef = useRef(null);
//   const [hasPermission, setHasPermission] = useState(null);
//   const [qrData, setQrData] = useState('No QR code detected');
//   const [scanning, setScanning] = useState(true);
//   const [cameraError, setCameraError] = useState(null);
  
//   // Request camera permission
//   useEffect(() => {
//     const checkCameraPermission = async () => {
//       try {
//         const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//         setHasPermission(true);
//         stream.getTracks().forEach(track => track.stop());
//       } catch (err) {
//         console.error("Camera permission error:", err);
//         setHasPermission(false);
//         setCameraError(err.message);
//       }
//     };
    
//     checkCameraPermission();
//   }, []);
  
//   // Function to scan for QR codes in video frames
//   const scanQRCode = useCallback(() => {
//     if (webcamRef.current && scanning) {
//       const imageSrc = webcamRef.current.getScreenshot();
      
//       if (imageSrc) {
//         const image = new Image();
//         image.src = imageSrc;
        
//         image.onload = () => {
//           const canvas = document.createElement('canvas');
//           const context = canvas.getContext('2d');
          
//           canvas.width = image.width;
//           canvas.height = image.height;
//           context.drawImage(image, 0, 0, canvas.width, canvas.height);
          
//           const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
//           const code = jsQR(imageData.data, imageData.width, imageData.height, {
//             inversionAttempts: "dontInvert",
//           });
          
//           if (code) {
//             console.log("QR Code detected:", code.data);
//             setQrData(code.data);
//             setScanning(false);
//           }
//         };
//       }
//     }
//   }, [webcamRef, scanning]);
  
//   // Run the QR code scanner at intervals
//   useEffect(() => {
//     let scanInterval;
    
//     if (scanning && hasPermission === true) {
//       // Check for QR codes every 500ms
//       scanInterval = setInterval(scanQRCode, 500);
//     }
    
//     return () => {
//       if (scanInterval) clearInterval(scanInterval);
//     };
//   }, [scanning, scanQRCode, hasPermission]);
  
//   const handleUserMedia = () => {
//     console.log("Camera is now accessible and streaming");
//   };
  
//   const handleError = (error) => {
//     console.error("Webcam error:", error);
//     setCameraError(error.message || "Could not access camera");
//     setHasPermission(false);
//   };
  
//   const startScanAgain = () => {
//     setScanning(true);
//     setQrData('No QR code detected');
//   };

//   // Permission troubleshooting screen
//   if (hasPermission === false) {
//     return (
//       <div className="camera-permission-error" style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
//         <h2>Camera Access Required</h2>
//         <p>The QR scanner needs access to your camera.</p>
//         <p className="error-message" style={{ color: 'red', fontWeight: 'bold' }}>Error: {cameraError}</p>
        
//         <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', margin: '20px 0', backgroundColor: '#f9f9f9', textAlign: 'left' }}>
//           <h3>Troubleshooting Steps:</h3>
//           <ol style={{ paddingLeft: '20px' }}>
//             <li>Check if you're using HTTPS (required for camera access)</li>
//             <li>Check your browser's permission settings</li>
//             <li>Close other applications that might be using your camera</li>
//             <li>Try using a different browser</li>
//             <li>Make sure your device has a working camera</li>
//           </ol>
//         </div>
        
//         <button 
//           onClick={() => window.location.reload()}
//           style={{ padding: '10px 20px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '10px' }}
//         >
//           Try Again
//         </button>
//       </div>
//     );
//   }

//   // Loading state
//   if (hasPermission === null) {
//     return (
//       <div className="loading" style={{ textAlign: 'center', padding: '20px' }}>
//         <h2>Requesting camera permission...</h2>
//         <p>Please allow access when prompted by your browser</p>
//         <div style={{ width: '50px', height: '50px', border: '5px solid #f3f3f3', borderTop: '5px solid #3498db', borderRadius: '50%', margin: '20px auto', animation: 'spin 2s linear infinite' }}></div>
//         <style>{`
//           @keyframes spin {
//             0% { transform: rotate(0deg); }
//             100% { transform: rotate(360deg); }
//           }
//         `}</style>
//       </div>
//     );
//   }
  
//   // Main scanner UI
//   return (
//     <div className="qr-scanner-container">
//       <h2>QR Code Scanner</h2>
      
//       {scanning ? (
//         <div className="scanner-area">
//           <div className="camera-container" style={{ border: '3px solid #3498db', borderRadius: '8px', overflow: 'hidden', width: '100%', maxWidth: '500px', height: '300px', margin: '0 auto', position: 'relative' }}>
//             <Webcam
//               ref={webcamRef}
//               audio={false}
//               screenshotFormat="image/jpeg"
//               videoConstraints={{
//                 width: 500,
//                 height: 300,
//                 facingMode: 'environment'
//               }}
//               onUserMedia={handleUserMedia}
//               onUserMediaError={handleError}
//               style={{
//                 width: '100%',
//                 height: '100%',
//                 objectFit: 'cover'
//               }}
//             />
//             {/* Scanner overlay */}
//             <div style={{
//               position: 'absolute',
//               top: '0',
//               left: '0',
//               right: '0',
//               bottom: '0',
//               boxShadow: 'inset 0 0 0 5px rgba(52, 152, 219, 0.5)',
//               zIndex: 10,
//               pointerEvents: 'none',
//               display: 'flex',
//               justifyContent: 'center',
//               alignItems: 'center'
//             }}>
//               <div style={{
//                 width: '200px',
//                 height: '200px',
//                 border: '2px solid #2ecc71',
//                 borderRadius: '20px',
//                 boxShadow: '0 0 0 4000px rgba(0, 0, 0, 0.3)'
//               }}></div>
//             </div>
//           </div>
          
//           <p style={{ marginTop: '15px' }}>Position the QR code in the green square to scan</p>
//           <div style={{ backgroundColor: '#f8f9fa', padding: '10px', borderRadius: '5px', marginTop: '10px' }}>
//             <strong>Scanning status:</strong> Actively scanning for QR codes...
//           </div>
//         </div>
//       ) : (
//         <div className="result-area">
//           <h3>Scan Result:</h3>
//           <div className="result-box" style={{ padding: '15px', border: '2px solid #3498db', borderRadius: '8px', backgroundColor: '#f8f9fa', marginBottom: '15px' }}>
//             <p><strong>QR Code Content:</strong></p>
//             <p style={{ wordBreak: 'break-all' }}>{qrData}</p>
//           </div>
//           <button 
//             className="scan-again-button" 
//             onClick={startScanAgain}
//             style={{ padding: '8px 16px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
//           >
//             Scan Another QR Code
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default QRScanner;


// import React, { useState, useRef, useCallback, useEffect } from 'react';
// import Webcam from 'react-webcam';
// import jsQR from 'jsqr';

// const QRScanner = () => {
//   const webcamRef = useRef(null);
//   const [hasPermission, setHasPermission] = useState(null);
//   const [qrData, setQrData] = useState('No QR code detected');
//   const [urlContent, setUrlContent] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [scanning, setScanning] = useState(true);
//   const [cameraError, setCameraError] = useState(null);
  
//   // Request camera permission
//   useEffect(() => {
//     const checkCameraPermission = async () => {
//       try {
//         const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//         setHasPermission(true);
//         stream.getTracks().forEach(track => track.stop());
//       } catch (err) {
//         console.error("Camera permission error:", err);
//         setHasPermission(false);
//         setCameraError(err.message);
//       }
//     };
    
//     checkCameraPermission();
//   }, []);
  
//   // Function to check if a string is a URL
//   const isValidURL = (str) => {
//     try {
//       new URL(str);
//       return true;
//     } catch (e) {
//       return false;
//     }
//   };
  
//   // Function to fetch content from a URL
//   const fetchUrlContent = async (url) => {
//     setIsLoading(true);
//     try {
//       const response = await fetch(url, {
//         method: 'GET',
//         headers: {
//           'Accept': 'text/html,application/json,text/plain,*/*',
//           'Access-Control-Allow-Origin': '*',
//         },
//         mode: 'cors', // This may need to be 'no-cors' depending on the URL
//       });
      
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
      
//       // Try to parse as JSON first
//       let content;
//       const contentType = response.headers.get('content-type');
      
//       if (contentType && contentType.includes('application/json')) {
//         content = await response.json();
//         setUrlContent({
//           type: 'json',
//           data: JSON.stringify(content, null, 2)
//         });
//       } else {
//         // If not JSON, get as text
//         content = await response.text();
        
//         // Try to extract meaningful content (basic HTML parsing)
//         const parser = new DOMParser();
//         const doc = parser.parseFromString(content, 'text/html');
        
//         // Get title
//         const title = doc.querySelector('title')?.textContent || 'Webpage Content';
        
//         // Try to get main content (this is a simple approach)
//         const mainContent = doc.querySelector('main')?.textContent || 
//                            doc.querySelector('article')?.textContent || 
//                            doc.querySelector('body')?.textContent || 
//                            'Content could not be extracted';
        
//         setUrlContent({
//           type: 'html',
//           title: title,
//           data: mainContent.substring(0, 1000) + (mainContent.length > 1000 ? '...' : '')
//         });
//       }
//     } catch (error) {
//       console.error('Error fetching URL content:', error);
//       setUrlContent({
//         type: 'error',
//         data: `Error fetching content: ${error.message}`
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };
  
//   // Function to handle QR code detection
//   const handleQrCode = (qrCodeData) => {
//     setQrData(qrCodeData);
//     setScanning(false);
    
//     // If it's a URL, fetch its content
//     if (isValidURL(qrCodeData)) {
//       fetchUrlContent(qrCodeData);
//     } else {
//       // Reset URL content if not a URL
//       setUrlContent(null);
//     }
//   };
  
//   // Function to scan for QR codes in video frames
//   const scanQRCode = useCallback(() => {
//     if (webcamRef.current && scanning) {
//       const imageSrc = webcamRef.current.getScreenshot();
      
//       if (imageSrc) {
//         const image = new Image();
//         image.src = imageSrc;
        
//         image.onload = () => {
//           const canvas = document.createElement('canvas');
//           const context = canvas.getContext('2d');
          
//           canvas.width = image.width;
//           canvas.height = image.height;
//           context.drawImage(image, 0, 0, canvas.width, canvas.height);
          
//           const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
//           const code = jsQR(imageData.data, imageData.width, imageData.height, {
//             inversionAttempts: "dontInvert",
//           });
          
//           if (code) {
//             console.log("QR Code detected:", code.data);
//             handleQrCode(code.data);
//           }
//         };
//       }
//     }
//   }, [webcamRef, scanning]);
  
//   // Run the QR code scanner at intervals
//   useEffect(() => {
//     let scanInterval;
    
//     if (scanning && hasPermission === true) {
//       // Check for QR codes every 500ms
//       scanInterval = setInterval(scanQRCode, 500);
//     }
    
//     return () => {
//       if (scanInterval) clearInterval(scanInterval);
//     };
//   }, [scanning, scanQRCode, hasPermission]);
  
//   const handleUserMedia = () => {
//     console.log("Camera is now accessible and streaming");
//   };
  
//   const handleError = (error) => {
//     console.error("Webcam error:", error);
//     setCameraError(error.message || "Could not access camera");
//     setHasPermission(false);
//   };
  
//   const startScanAgain = () => {
//     setScanning(true);
//     setQrData('No QR code detected');
//     setUrlContent(null);
//   };

//   // Permission troubleshooting screen
//   if (hasPermission === false) {
//     return (
//       <div className="camera-permission-error" style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
//         <h2>Camera Access Required</h2>
//         <p>The QR scanner needs access to your camera.</p>
//         <p className="error-message" style={{ color: 'red', fontWeight: 'bold' }}>Error: {cameraError}</p>
        
//         <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', margin: '20px 0', backgroundColor: '#f9f9f9', textAlign: 'left' }}>
//           <h3>Troubleshooting Steps:</h3>
//           <ol style={{ paddingLeft: '20px' }}>
//             <li>Check if you're using HTTPS (required for camera access)</li>
//             <li>Check your browser's permission settings</li>
//             <li>Close other applications that might be using your camera</li>
//             <li>Try using a different browser</li>
//             <li>Make sure your device has a working camera</li>
//           </ol>
//         </div>
        
//         <button 
//           onClick={() => window.location.reload()}
//           style={{ padding: '10px 20px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '10px' }}
//         >
//           Try Again
//         </button>
//       </div>
//     );
//   }

//   // Loading state
//   if (hasPermission === null) {
//     return (
//       <div className="loading" style={{ textAlign: 'center', padding: '20px' }}>
//         <h2>Requesting camera permission...</h2>
//         <p>Please allow access when prompted by your browser</p>
//         <div style={{ width: '50px', height: '50px', border: '5px solid #f3f3f3', borderTop: '5px solid #3498db', borderRadius: '50%', margin: '20px auto', animation: 'spin 2s linear infinite' }}></div>
//         <style>{`
//           @keyframes spin {
//             0% { transform: rotate(0deg); }
//             100% { transform: rotate(360deg); }
//           }
//         `}</style>
//       </div>
//     );
//   }
  
//   // Main scanner UI
//   return (
//     <div className="qr-scanner-container">
//       <h2>QR Code Scanner</h2>
      
//       {scanning ? (
//         <div className="scanner-area">
//           <div className="camera-container" style={{ border: '3px solid #3498db', borderRadius: '8px', overflow: 'hidden', width: '100%', maxWidth: '500px', height: '300px', margin: '0 auto', position: 'relative' }}>
//             <Webcam
//               ref={webcamRef}
//               audio={false}
//               screenshotFormat="image/jpeg"
//               videoConstraints={{
//                 width: 500,
//                 height: 300,
//                 facingMode: 'environment'
//               }}
//               onUserMedia={handleUserMedia}
//               onUserMediaError={handleError}
//               style={{
//                 width: '100%',
//                 height: '100%',
//                 objectFit: 'cover'
//               }}
//             />
//             {/* Scanner overlay */}
//             <div style={{
//               position: 'absolute',
//               top: '0',
//               left: '0',
//               right: '0',
//               bottom: '0',
//               boxShadow: 'inset 0 0 0 5px rgba(52, 152, 219, 0.5)',
//               zIndex: 10,
//               pointerEvents: 'none',
//               display: 'flex',
//               justifyContent: 'center',
//               alignItems: 'center'
//             }}>
//               <div style={{
//                 width: '200px',
//                 height: '200px',
//                 border: '2px solid #2ecc71',
//                 borderRadius: '20px',
//                 boxShadow: '0 0 0 4000px rgba(0, 0, 0, 0.3)'
//               }}></div>
//             </div>
//           </div>
          
//           <p style={{ marginTop: '15px' }}>Position the QR code in the green square to scan</p>
//           <div style={{ backgroundColor: '#f8f9fa', padding: '10px', borderRadius: '5px', marginTop: '10px' }}>
//             <strong>Scanning status:</strong> Actively scanning for QR codes...
//           </div>
//         </div>
//       ) : (
//         <div className="result-area">
//           <h3>Scan Result:</h3>
          
//           {/* URL detected */}
//           {isValidURL(qrData) && (
//             <div style={{ marginBottom: '15px' }}>
//               <div style={{ padding: '15px', border: '2px solid #3498db', borderRadius: '8px', backgroundColor: '#f8f9fa' }}>
//                 <p><strong>URL Detected:</strong></p>
//                 <a href={qrData} target="_blank" rel="noopener noreferrer" style={{ wordBreak: 'break-all' }}>{qrData}</a>
//               </div>
              
//               {isLoading ? (
//                 <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '8px', marginTop: '15px' }}>
//                   <p>Loading content from URL...</p>
//                   <div style={{ width: '30px', height: '30px', border: '3px solid #f3f3f3', borderTop: '3px solid #3498db', borderRadius: '50%', margin: '10px auto', animation: 'spin 2s linear infinite' }}></div>
//                 </div>
//               ) : urlContent ? (
//                 <div style={{ padding: '15px', border: '2px solid #2ecc71', borderRadius: '8px', backgroundColor: '#f9f9f9', marginTop: '15px', maxHeight: '400px', overflow: 'auto' }}>
//                   <h4 style={{ borderBottom: '1px solid #ddd', paddingBottom: '8px' }}>
//                     {urlContent.type === 'html' ? urlContent.title : 'Content from URL'}
//                   </h4>
                  
//                   {urlContent.type === 'error' ? (
//                     <p style={{ color: 'red' }}>{urlContent.data}</p>
//                   ) : (
//                     <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{urlContent.data}</pre>
//                   )}
//                 </div>
//               ) : (
//                 <div style={{ textAlign: 'center', padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '8px', marginTop: '15px' }}>
//                   <p>Content could not be loaded.</p>
//                   <button 
//                     onClick={() => fetchUrlContent(qrData)}
//                     style={{ padding: '5px 10px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginTop: '10px' }}
//                   >
//                     Try Again
//                   </button>
//                 </div>
//               )}
//             </div>
//           )}
          
//           {/* Non-URL data */}
//           {!isValidURL(qrData) && (
//             <div className="result-box" style={{ padding: '15px', border: '2px solid #3498db', borderRadius: '8px', backgroundColor: '#f8f9fa', marginBottom: '15px' }}>
//               <p><strong>QR Code Content:</strong></p>
//               <p style={{ wordBreak: 'break-all' }}>{qrData}</p>
//             </div>
//           )}
          
//           <button 
//             className="scan-again-button" 
//             onClick={startScanAgain}
//             style={{ padding: '8px 16px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
//           >
//             Scan Another QR Code
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default QRScanner;

import React, { useState, useRef, useCallback, useEffect } from 'react';
import Webcam from 'react-webcam';
import jsQR from 'jsqr';

const QRScanner = () => {
  const webcamRef = useRef(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [qrData, setQrData] = useState('No QR code detected');
  const [scanning, setScanning] = useState(true);
  const [cameraError, setCameraError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  
  // Request camera permission
  useEffect(() => {
    const checkCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setHasPermission(true);
        stream.getTracks().forEach(track => track.stop());
      } catch (err) {
        console.error("Camera permission error:", err);
        setHasPermission(false);
        setCameraError(err.message);
      }
    };
    
    checkCameraPermission();
    
    // Handle escape key to close modal
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        setShowModal(false);
      }
    };
    
    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, []);
  
  // Function to check if a string is a URL
  const isValidURL = (str) => {
    try {
      new URL(str);
      return true;
    } catch (e) {
      return false;
    }
  };
  
  // Function to handle QR code detection
  const handleQrCode = (qrCodeData) => {
    setQrData(qrCodeData);
    setScanning(false);
    
    // If URL is detected, automatically open modal
    if (isValidURL(qrCodeData)) {
      setShowModal(true);
    }
  };
  
  // Function to scan for QR codes in video frames
  const scanQRCode = useCallback(() => {
    if (webcamRef.current && scanning) {
      const imageSrc = webcamRef.current.getScreenshot();
      
      if (imageSrc) {
        const image = new Image();
        image.src = imageSrc;
        
        image.onload = () => {
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          
          canvas.width = image.width;
          canvas.height = image.height;
          context.drawImage(image, 0, 0, canvas.width, canvas.height);
          
          const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: "dontInvert",
          });
          
          if (code) {
            console.log("QR Code detected:", code.data);
            handleQrCode(code.data);
          }
        };
      }
    }
  }, [webcamRef, scanning]);
  
  // Run the QR code scanner at intervals
  useEffect(() => {
    let scanInterval;
    
    if (scanning && hasPermission === true) {
      // Check for QR codes every 500ms
      scanInterval = setInterval(scanQRCode, 500);
    }
    
    return () => {
      if (scanInterval) clearInterval(scanInterval);
    };
  }, [scanning, scanQRCode, hasPermission]);
  
  const handleUserMedia = () => {
    console.log("Camera is now accessible and streaming");
  };
  
  const handleError = (error) => {
    console.error("Webcam error:", error);
    setCameraError(error.message || "Could not access camera");
    setHasPermission(false);
  };
  
  const startScanAgain = () => {
    setScanning(true);
    setQrData('No QR code detected');
    setShowModal(false);
  };

  // Modal component
  const Modal = ({ url, isOpen, onClose }) => {
    if (!isOpen) return null;
    
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        backdropFilter: 'blur(5px)',
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          width: '90%',
          maxWidth: '900px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
          animation: 'modalFadeIn 0.3s ease-out forwards',
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '15px 20px',
            borderBottom: '1px solid #eee',
          }}>
            <h3 style={{ margin: 0, fontWeight: 500 }}>QR Code Content</h3>
            <button 
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: '#555',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                transition: 'background-color 0.2s',
              }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              ×
            </button>
          </div>
          
          <div style={{
            padding: '0',
            flexGrow: 1,
            overflow: 'hidden',
            position: 'relative',
            minHeight: '400px',
          }}>
            <iframe 
              src={url} 
              title="QR Code Content"
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
              }}
              sandbox="allow-same-origin allow-scripts allow-forms"
              referrerPolicy="no-referrer"
            />
          </div>
          
          <div style={{
            padding: '15px 20px',
            borderTop: '1px solid #eee',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <div style={{ fontSize: '14px', color: '#666', wordBreak: 'break-all', maxWidth: '70%' }}>
              {url}
            </div>
            <button
              onClick={() => window.open(url, '_blank')}
              style={{
                padding: '8px 15px',
                backgroundColor: '#3498db',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Open in Browser
            </button>
          </div>
        </div>
        
        <style>{`
          @keyframes modalFadeIn {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </div>
    );
  };

  // Permission troubleshooting screen
  if (hasPermission === false) {
    return (
      <div className="camera-permission-error" style={{ padding: '20px', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        <h2>Camera Access Required</h2>
        <p>The QR scanner needs access to your camera.</p>
        <p className="error-message" style={{ color: 'red', fontWeight: 'bold' }}>Error: {cameraError}</p>
        
        <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', margin: '20px 0', backgroundColor: '#f9f9f9', textAlign: 'left' }}>
          <h3>Troubleshooting Steps:</h3>
          <ol style={{ paddingLeft: '20px' }}>
            <li>Check if you're using HTTPS (required for camera access)</li>
            <li>Check your browser's permission settings</li>
            <li>Close other applications that might be using your camera</li>
            <li>Try using a different browser</li>
            <li>Make sure your device has a working camera</li>
          </ol>
        </div>
        
        <button 
          onClick={() => window.location.reload()}
          style={{ padding: '10px 20px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '10px' }}
        >
          Try Again
        </button>
      </div>
    );
  }

  // Loading state
  if (hasPermission === null) {
    return (
      <div className="loading" style={{ textAlign: 'center', padding: '20px' }}>
        <h2>Requesting camera permission...</h2>
        <p>Please allow access when prompted by your browser</p>
        <div style={{ width: '50px', height: '50px', border: '5px solid #f3f3f3', borderTop: '5px solid #3498db', borderRadius: '50%', margin: '20px auto', animation: 'spin 2s linear infinite' }}></div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }
  
  // Main scanner UI
  return (
    <div className="qr-scanner-container">
      {/* Modal popup */}
      <Modal 
        url={isValidURL(qrData) ? qrData : ''} 
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      />
      
      <h2>QR Code Scanner</h2>
      
      {scanning ? (
        <div className="scanner-area">
          <div className="camera-container" style={{ border: '3px solid #3498db', borderRadius: '8px', overflow: 'hidden', width: '100%', maxWidth: '500px', height: '300px', margin: '0 auto', position: 'relative' }}>
            <Webcam
              ref={webcamRef}
              audio={false}
              screenshotFormat="image/jpeg"
              videoConstraints={{
                width: 500,
                height: 300,
                facingMode: 'environment'
              }}
              onUserMedia={handleUserMedia}
              onUserMediaError={handleError}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
            {/* Scanner overlay */}
            <div style={{
              position: 'absolute',
              top: '0',
              left: '0',
              right: '0',
              bottom: '0',
              boxShadow: 'inset 0 0 0 5px rgba(52, 152, 219, 0.5)',
              zIndex: 10,
              pointerEvents: 'none',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <div style={{
                width: '200px',
                height: '200px',
                border: '2px solid #2ecc71',
                borderRadius: '20px',
                boxShadow: '0 0 0 4000px rgba(0, 0, 0, 0.3)'
              }}></div>
            </div>
          </div>
          
          <p style={{ marginTop: '15px' }}>Position the QR code in the green square to scan</p>
          <div style={{ backgroundColor: '#f8f9fa', padding: '10px', borderRadius: '5px', marginTop: '10px' }}>
            <strong>Scanning status:</strong> Actively scanning for QR codes...
          </div>
        </div>
      ) : (
        <div className="result-area">
          <h3>Scan Result:</h3>
          
          {/* URL detected */}
          {isValidURL(qrData) ? (
            <div>
              <div style={{ padding: '15px', border: '2px solid #3498db', borderRadius: '8px', backgroundColor: '#f8f9fa', marginBottom: '15px' }}>
                <p><strong>URL Detected:</strong></p>
                <p style={{ wordBreak: 'break-all', marginBottom: '15px' }}>{qrData}</p>
                
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
                  <button 
                    onClick={() => setShowModal(true)}
                    style={{ 
                      padding: '10px 15px', 
                      backgroundColor: '#2ecc71', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '4px', 
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <span style={{ marginRight: '8px' }}>👁️</span> View Content
                  </button>
                  
                  <button 
                    onClick={() => window.open(qrData, '_blank')}
                    style={{ 
                      padding: '10px 15px', 
                      backgroundColor: '#3498db', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '4px', 
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <span style={{ marginRight: '8px' }}>🔗</span> Open in Browser
                  </button>
                </div>
              </div>
            </div>
          ) : (
            // Non-URL data
            <div className="result-box" style={{ padding: '15px', border: '2px solid #3498db', borderRadius: '8px', backgroundColor: '#f8f9fa', marginBottom: '15px' }}>
              <p><strong>QR Code Content:</strong></p>
              <p style={{ wordBreak: 'break-all' }}>{qrData}</p>
            </div>
          )}
          
          <button 
            className="scan-again-button" 
            onClick={startScanAgain}
            style={{ 
              padding: '12px 20px', 
              backgroundColor: '#3498db', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px', 
              cursor: 'pointer',
              width: '100%',
              maxWidth: '300px',
              margin: '0 auto',
              display: 'block',
              fontSize: '16px'
            }}
          >
            Scan Another QR Code
          </button>
        </div>
      )}
    </div>
  );
};

export default QRScanner;