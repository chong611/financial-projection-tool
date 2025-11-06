/**
 * Authentication Module
 * Handles user authentication with Firebase
 */

import { 
  signInAnonymously, 
  signInWithCustomToken,
  onAuthStateChanged 
} from 'https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js';

let currentUserId = null;
let authStateCallbacks = [];

/**
 * Sign in user (anonymous or with custom token)
 * @param {Object} auth - Firebase Auth instance
 * @param {string|null} customToken - Optional custom authentication token
 * @returns {Promise<Object>} User object
 */
export async function signIn(auth, customToken = null) {
  try {
    let userCredential;
    
    if (customToken) {
      console.log('🔐 Signing in with custom token...');
      userCredential = await signInWithCustomToken(auth, customToken);
    } else {
      console.log('🔐 Signing in anonymously...');
      userCredential = await signInAnonymously(auth);
    }
    
    currentUserId = userCredential.user.uid;
    console.log('✅ User signed in successfully:', currentUserId);
    
    return userCredential.user;
  } catch (error) {
    console.error('❌ Authentication error:', error);
    throw new Error(`Authentication failed: ${error.message}`);
  }
}

/**
 * Set up authentication state listener
 * @param {Object} auth - Firebase Auth instance
 * @param {Function} callback - Callback function to execute on auth state change
 */
export function setupAuthListener(auth, callback) {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      currentUserId = user.uid;
      console.log('👤 User authenticated:', currentUserId);
      callback(user);
      
      // Execute registered callbacks
      authStateCallbacks.forEach(cb => cb(user));
    } else {
      console.log('👤 No user authenticated');
      currentUserId = null;
      callback(null);
    }
  });
}

/**
 * Register a callback for auth state changes
 * @param {Function} callback - Callback function
 */
export function onAuthStateChange(callback) {
  authStateCallbacks.push(callback);
}

/**
 * Get current user ID
 * @returns {string|null} Current user ID
 */
export function getCurrentUserId() {
  return currentUserId;
}

/**
 * Check if user is authenticated
 * @returns {boolean} Authentication status
 */
export function isAuthenticated() {
  return currentUserId !== null;
}
