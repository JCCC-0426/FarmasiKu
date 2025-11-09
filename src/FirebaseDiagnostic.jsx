import React, { useState, useEffect } from 'react';
import { db } from './firebase/config';
import { collection, addDoc, getDocs, serverTimestamp } from 'firebase/firestore';

/**
 * Firebase Connection Diagnostic Component
 * Add this to your App.jsx temporarily to test Firebase connection
 * 
 * Usage:
 * import FirebaseDiagnostic from './FirebaseDiagnostic';
 * 
 * In your App component:
 * <FirebaseDiagnostic />
 */

function FirebaseDiagnostic() {
  const [status, setStatus] = useState('Checking...');
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState(null);

  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, { timestamp, message, type }]);
    console.log(`[${timestamp}] ${message}`);
  };

  useEffect(() => {
    checkFirebaseConnection();
  }, []);

  const checkFirebaseConnection = async () => {
    try {
      addLog('🔥 Checking Firebase configuration...', 'info');
      
      // Check if Firebase is initialized
      if (!db) {
        throw new Error('Firestore is not initialized');
      }
      addLog('✅ Firestore instance exists', 'success');

      // Check environment variables
      const config = {
        apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
        projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
        authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN
      };

      addLog(`📝 Project ID: ${config.projectId}`, 'info');
      addLog(`📝 Auth Domain: ${config.authDomain}`, 'info');

      if (!config.apiKey || !config.projectId) {
        throw new Error('Firebase environment variables are missing! Check your .env file');
      }
      addLog('✅ Environment variables loaded', 'success');

      setStatus('✅ Firebase Connected');
      addLog('🎉 Firebase is ready to use!', 'success');
      
    } catch (err) {
      console.error('Firebase connection error:', err);
      setError(err.message);
      setStatus('❌ Connection Failed');
      addLog(`❌ Error: ${err.message}`, 'error');
    }
  };

  const testWrite = async () => {
    try {
      addLog('📝 Testing write operation...', 'info');
      
      const testData = {
        test: true,
        message: 'Diagnostic test from FarmasiKu',
        timestamp: new Date().toISOString(),
        createdAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'diagnostic_test'), testData);
      addLog(`✅ Write successful! Document ID: ${docRef.id}`, 'success');
      setStatus('✅ Write Test Passed');
      
    } catch (err) {
      console.error('Write test error:', err);
      addLog(`❌ Write failed: ${err.message}`, 'error');
      
      if (err.code === 'permission-denied') {
        addLog('⚠️ Permission denied! You need to:', 'error');
        addLog('1. Go to Firebase Console → Firestore Database', 'error');
        addLog('2. Click "Rules" tab', 'error');
        addLog('3. Set rules to test mode (allow read, write: if true)', 'error');
        addLog('4. Click "Publish"', 'error');
      }
      
      setError(err.message);
      setStatus('❌ Write Test Failed');
    }
  };

  const testRead = async () => {
    try {
      addLog('📖 Testing read operation...', 'info');
      
      const querySnapshot = await getDocs(collection(db, 'diagnostic_test'));
      addLog(`✅ Read successful! Found ${querySnapshot.size} document(s)`, 'success');
      
      querySnapshot.forEach((doc) => {
        addLog(`  → Document ID: ${doc.id}`, 'info');
      });
      
      setStatus('✅ Read Test Passed');
      
    } catch (err) {
      console.error('Read test error:', err);
      addLog(`❌ Read failed: ${err.message}`, 'error');
      setError(err.message);
      setStatus('❌ Read Test Failed');
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      width: '400px',
      maxHeight: '600px',
      background: 'white',
      border: '2px solid #667eea',
      borderRadius: '10px',
      padding: '15px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
      zIndex: 9999,
      fontFamily: 'monospace',
      fontSize: '12px'
    }}>
      <div style={{ 
        background: error ? '#f8d7da' : '#d4edda',
        padding: '10px',
        borderRadius: '5px',
        marginBottom: '10px',
        fontWeight: 'bold',
        color: error ? '#721c24' : '#155724'
      }}>
        {status}
      </div>

      <div style={{ marginBottom: '10px' }}>
        <button 
          onClick={checkFirebaseConnection}
          style={{
            background: '#667eea',
            color: 'white',
            border: 'none',
            padding: '8px 12px',
            borderRadius: '5px',
            cursor: 'pointer',
            marginRight: '5px',
            fontSize: '11px'
          }}
        >
          Recheck
        </button>
        <button 
          onClick={testWrite}
          style={{
            background: '#28a745',
            color: 'white',
            border: 'none',
            padding: '8px 12px',
            borderRadius: '5px',
            cursor: 'pointer',
            marginRight: '5px',
            fontSize: '11px'
          }}
        >
          Test Write
        </button>
        <button 
          onClick={testRead}
          style={{
            background: '#17a2b8',
            color: 'white',
            border: 'none',
            padding: '8px 12px',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '11px'
          }}
        >
          Test Read
        </button>
      </div>

      <div style={{
        maxHeight: '400px',
        overflowY: 'auto',
        background: '#f8f9fa',
        padding: '10px',
        borderRadius: '5px',
        border: '1px solid #dee2e6'
      }}>
        {logs.map((log, index) => (
          <div 
            key={index}
            style={{
              marginBottom: '5px',
              color: log.type === 'error' ? '#721c24' : 
                     log.type === 'success' ? '#155724' : '#0c5460'
            }}
          >
            [{log.timestamp}] {log.message}
          </div>
        ))}
      </div>

      {error && (
        <div style={{
          marginTop: '10px',
          padding: '10px',
          background: '#fff3cd',
          border: '1px solid #ffeaa7',
          borderRadius: '5px',
          color: '#856404',
          fontSize: '11px'
        }}>
          <strong>⚠️ Error Details:</strong><br/>
          {error}
        </div>
      )}
    </div>
  );
}

export default FirebaseDiagnostic;
