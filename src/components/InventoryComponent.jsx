import React, { useState, useEffect, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get, set, update, onValue } from 'firebase/database';
import '../styles/Inventory.css';

// Initialize Firebase if not already initialized
const firebaseConfig = {
  apiKey: "AIzaSyB9ererNsNonAzH0zQo_GS79XPOyCoMxr4",
      authDomain: "waterdtection.firebaseapp.com",
      databaseURL: "https://waterdtection-default-rtdb.firebaseio.com",
      projectId: "waterdtection",
      storageBucket: "waterdtection.firebasestorage.app",
      messagingSenderId: "690886375729",
      appId: "1:690886375729:web:172c3a47dda6585e4e1810",
      measurementId: "G-TXF33Y6XY0"
};

// Check if Firebase is already initialized
if (!window.firebaseInitialized) {
  initializeApp(firebaseConfig);
  window.firebaseInitialized = true;
}

const Inventory = () => {
  const [inventory, setInventory] = useState({
    dolo: 0,
    paracetamol: 0,
    brufen: 0,
    status: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updateMessage, setUpdateMessage] = useState('');
  
  // Use a ref to track previous status value
  const prevStatusRef = useRef(0);
  // Flag to prevent duplicate dispensing
  const isProcessingRef = useRef(false);

  useEffect(() => {
    console.log("Setting up Firebase listener");
    const db = getDatabase();
    const vendingRef = ref(db, 'Vending_Machine');

    // Set up real-time listener for inventory changes
    const unsubscribe = onValue(vendingRef, (snapshot) => {
      if (!snapshot.exists()) {
        setError("No inventory data found!");
        setLoading(false);
        return;
      }

      const data = snapshot.val();
      console.log("Firebase data updated:", data);
      
      const currentStatus = parseInt(data.Status) || 0;
      const previousStatus = prevStatusRef.current;
      
      // Update our inventory state
      const newInventory = {
        dolo: parseInt(data.dolo) || 0,
        paracetamol: parseInt(data.paracetamol) || 0,
        brufen: parseInt(data.brufen) || 0,
        status: currentStatus
      };
      setInventory(newInventory);
      setLoading(false);
      
      // Check if status changed and needs to trigger a dispensing action
      if (!isProcessingRef.current && 
          (currentStatus === 1 || currentStatus === 2 || currentStatus === 3) && 
          currentStatus !== previousStatus) {
        
        console.log(`Status changed from ${previousStatus} to ${currentStatus}`);
        handleStatusChange(currentStatus, data);
      }
      
      // Update previous status reference
      prevStatusRef.current = currentStatus;
    }, (error) => {
      console.error("Firebase error:", error);
      setError(`Error fetching inventory: ${error.message}`);
      setLoading(false);
    });

    // Clean up listener on component unmount
    return () => {
      console.log("Cleaning up Firebase listener");
      unsubscribe();
    };
  }, []);

  // Handle status change and dispense medicine
  const handleStatusChange = async (status, data) => {
    if (isProcessingRef.current) return;
    
    isProcessingRef.current = true;
    console.log(`Processing status change to ${status}`);
    
    try {
      const db = getDatabase();
      const vendingRef = ref(db, 'Vending_Machine');
      
      // Get fresh data to avoid any race conditions
      const snapshot = await get(vendingRef);
      if (!snapshot.exists()) {
        setError("Cannot update: Data doesn't exist");
        isProcessingRef.current = false;
        return;
      }
      
      const freshData = snapshot.val();
      let medicineName = "";
      let medicineKey = "";
      let currentStock = 0;
      
      // Determine which medicine to dispense based on Status
      if (status === 1) {
        medicineKey = "dolo";
        medicineName = "Dolo";
        currentStock = parseInt(freshData.dolo) || 0;
      } else if (status === 2) {
        medicineKey = "paracetamol";
        medicineName = "Paracetamol";
        currentStock = parseInt(freshData.paracetamol) || 0;
      } else if (status === 3) {
        medicineKey = "brufen";
        medicineName = "Brufen";
        currentStock = parseInt(freshData.brufen) || 0;
      } else {
        console.log("Invalid status:", status);
        setUpdateMessage("Invalid status");
        isProcessingRef.current = false;
        return;
      }
      
      // Check if we have stock
      if (currentStock <= 0) {
        console.log(`${medicineName} is out of stock`);
        setUpdateMessage(`${medicineName} is out of stock`);
        isProcessingRef.current = false;
        return;
      }
      
      // Calculate new stock
      const newStock = currentStock - 1;
      console.log(`Reducing ${medicineName} from ${currentStock} to ${newStock}`);
      
      // Update the database with new stock value
      const updates = {};
      updates[medicineKey] = newStock.toString();
      
      await update(vendingRef, updates);
      console.log(`Updated ${medicineName} stock to ${newStock}`);
      
      setUpdateMessage(`Dispensed 1 ${medicineName}`);
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setUpdateMessage('');
      }, 3000);
    } catch (error) {
      console.error("Error dispensing medicine:", error);
      setError(`Failed to dispense medicine: ${error.message}`);
    } finally {
      isProcessingRef.current = false;
    }
  };

  // Manual dispense button handler
  const handleDispenseMedicine = async () => {
    if (isProcessingRef.current) return;
    
    try {
      const db = getDatabase();
      const vendingRef = ref(db, 'Vending_Machine');
      
      // Get current data
      const snapshot = await get(vendingRef);
      if (!snapshot.exists()) {
        setError("Cannot update: Data doesn't exist");
        return;
      }
      
      const data = snapshot.val();
      const status = parseInt(data.Status);
      
      // Process the dispensing
      await handleStatusChange(status, data);
      
    } catch (error) {
      console.error("Error in manual dispense:", error);
      setError(`Failed to dispense medicine: ${error.message}`);
    }
  };

  const restock = async (medicine) => {
    try {
      const db = getDatabase();
      const vendingRef = ref(db, 'Vending_Machine');
      
      // Get current data
      const snapshot = await get(vendingRef);
      if (!snapshot.exists()) {
        setError("Cannot update: Data doesn't exist");
        return;
      }
      
      const data = snapshot.val();
      const currentStock = parseInt(data[medicine]) || 0;
      
      // Update with +5 to current stock
      const updates = {};
      updates[medicine] = (currentStock + 5).toString();
      
      // Update database
      await update(vendingRef, updates);
      setUpdateMessage(`Restocked ${medicine} (+5)`);
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setUpdateMessage('');
      }, 3000);
      
    } catch (error) {
      console.error("Error restocking:", error);
      setError(`Failed to restock ${medicine}: ${error.message}`);
    }
  };

  if (loading) {
    return <div className="inventory-loading">Loading inventory data...</div>;
  }

  if (error) {
    return <div className="inventory-error">Error: {error}</div>;
  }

  return (
    <div className="inventory-container">
      <h2>Medicine Inventory</h2>
      
      {updateMessage && (
        <div className="update-message">{updateMessage}</div>
      )}
      
      <div className="inventory-cards">
        <div className="inventory-card">
          <h3>Dolo</h3>
          <div className="medicine-icon">💊</div>
          <p className="stock-count">Stock: {inventory.dolo}</p>
          <p className="status-indicator">
            {inventory.status === 1 ? "✅ Selected for dispensing" : ""}
          </p>
          <button onClick={() => restock('dolo')} className="restock-button">
            Restock (+5)
          </button>
        </div>
        
        <div className="inventory-card">
          <h3>Paracetamol</h3>
          <div className="medicine-icon">💊</div>
          <p className="stock-count">Stock: {inventory.paracetamol}</p>
          <p className="status-indicator">
            {inventory.status === 2 ? "✅ Selected for dispensing" : ""}
          </p>
          <button onClick={() => restock('paracetamol')} className="restock-button">
            Restock (+5)
          </button>
        </div>
        
        <div className="inventory-card">
          <h3>Brufen</h3>
          <div className="medicine-icon">💊</div>
          <p className="stock-count">Stock: {inventory.brufen}</p>
          <p className="status-indicator">
            {inventory.status === 3 ? "✅ Selected for dispensing" : ""}
          </p>
          <button onClick={() => restock('brufen')} className="restock-button">
            Restock (+5)
          </button>
        </div>
      </div>
      
      <div className="dispense-controls">
        <p className="current-status">Current Status: {inventory.status}</p>
        <p className="status-description">
          {inventory.status === 1 ? "Status 1: Dispense Dolo" : 
           inventory.status === 2 ? "Status 2: Dispense Paracetamol" : 
           inventory.status === 3 ? "Status 3: Dispense Brufen" : 
           "Status 0: No medicine selected"}
        </p>
        <div className="dispense-buttons">
          <button 
            onClick={handleDispenseMedicine} 
            className="dispense-button"
            disabled={inventory.status < 1 || inventory.status > 3}
          >
            Dispense Medicine Manually
          </button>
          <button 
            onClick={() => {
              const db = getDatabase();
              const vendingRef = ref(db, 'Vending_Machine');
              update(vendingRef, { Status: "0" });
              setUpdateMessage("Reset status to 0");
              setTimeout(() => setUpdateMessage(''), 3000);
            }} 
            className="reset-button"
          >
            Reset Status to 0
          </button>
        </div>
      </div>
    </div>
  );
};

export default Inventory;