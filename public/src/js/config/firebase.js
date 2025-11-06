/**
 * Firebase Configuration Module
 * Handles Firebase initialization and configuration loading
 */

import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js';

let firebaseApp = null;
let auth = null;
let db = null;
let appId = 'financial-projection-tool';

/**
 * Initialize Firebase with configuration
 * @param {Object} config - Firebase configuration object
 * @returns {Object} Firebase services (app, auth, db)
 */
export async function initializeFirebase(config) {
  try {
    if (!config || Object.keys(config).length === 0) {
      console.warn('⚠️ Firebase configuration missing - running in offline mode');
      return { app: null, auth: null, db: null };
    }

    firebaseApp = initializeApp(config);
    auth = getAuth(firebaseApp);
    db = getFirestore(firebaseApp);

    console.log('✅ Firebase initialized successfully');
    
    return { app: firebaseApp, auth, db };
  } catch (error) {
    console.error('❌ Firebase initialization error:', error);
    console.warn('⚠️ Continuing in offline mode - save/load features disabled');
    return { app: null, auth: null, db: null };
  }
}

/**
 * Load configuration from server
 * @returns {Promise<Object>} Configuration object
 */
export async function loadConfig() {
  try {
    // Try to load from server API first
    const response = await fetch('/api/config');
    if (response.ok) {
      const config = await response.json();
      if (config.appId) {
        appId = config.appId;
      }
      return config;
    }
  } catch (error) {
    console.warn('Could not load config from server, using fallback');
  }

  // Fallback to global variables (for backward compatibility)
  return {
    firebaseConfig: typeof __firebase_config !== 'undefined' 
      ? JSON.parse(__firebase_config) 
      : {},
    appId: typeof __app_id !== 'undefined' ? __app_id : appId,
    initialAuthToken: typeof __initial_auth_token !== 'undefined' 
      ? __initial_auth_token 
      : null
  };
}

/**
 * Get Firebase Auth instance
 * @returns {Object} Firebase Auth instance
 */
export function getAuthInstance() {
  if (!auth) {
    throw new Error('Firebase not initialized. Call initializeFirebase first.');
  }
  return auth;
}

/**
 * Get Firestore instance
 * @returns {Object} Firestore instance
 */
export function getDbInstance() {
  if (!db) {
    throw new Error('Firebase not initialized. Call initializeFirebase first.');
  }
  return db;
}

/**
 * Get App ID
 * @returns {string} Application ID
 */
export function getAppId() {
  return appId;
}
