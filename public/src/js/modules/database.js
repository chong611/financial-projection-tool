/**
 * Database Module
 * Handles all Firestore database operations
 */

import { 
  doc, 
  setDoc, 
  getDoc, 
  addDoc,
  deleteDoc,
  collection, 
  query, 
  where, 
  getDocs,
  onSnapshot,
  serverTimestamp
} from 'https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js';

/**
 * Save projection to Firestore
 * @param {Object} db - Firestore instance
 * @param {string} userId - User ID
 * @param {string} appId - Application ID
 * @param {Object} projectionData - Projection data to save
 * @returns {Promise<string>} Document ID
 */
export async function saveProjection(db, userId, appId, projectionData) {
  try {
    const data = {
      ...projectionData,
      userId,
      appId,
      updatedAt: serverTimestamp()
    };

    let docId;
    
    if (projectionData.id) {
      // Update existing projection
      docId = projectionData.id;
      const docRef = doc(db, 'projections', docId);
      await setDoc(docRef, data, { merge: true });
      console.log('✅ Projection updated:', docId);
    } else {
      // Create new projection
      data.createdAt = serverTimestamp();
      const colRef = collection(db, 'projections');
      const docRef = await addDoc(colRef, data);
      docId = docRef.id;
      console.log('✅ Projection created:', docId);
    }

    return docId;
  } catch (error) {
    console.error('❌ Error saving projection:', error);
    throw new Error(`Failed to save projection: ${error.message}`);
  }
}

/**
 * Load projection from Firestore
 * @param {Object} db - Firestore instance
 * @param {string} projectionId - Projection document ID
 * @returns {Promise<Object>} Projection data
 */
export async function loadProjection(db, projectionId) {
  try {
    const docRef = doc(db, 'projections', projectionId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log('✅ Projection loaded:', projectionId);
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error('Projection not found');
    }
  } catch (error) {
    console.error('❌ Error loading projection:', error);
    throw new Error(`Failed to load projection: ${error.message}`);
  }
}

/**
 * Delete projection from Firestore
 * @param {Object} db - Firestore instance
 * @param {string} projectionId - Projection document ID
 * @returns {Promise<void>}
 */
export async function deleteProjection(db, projectionId) {
  try {
    const docRef = doc(db, 'projections', projectionId);
    await deleteDoc(docRef);
    console.log('✅ Projection deleted:', projectionId);
  } catch (error) {
    console.error('❌ Error deleting projection:', error);
    throw new Error(`Failed to delete projection: ${error.message}`);
  }
}

/**
 * Get all projections for a user
 * @param {Object} db - Firestore instance
 * @param {string} userId - User ID
 * @param {string} appId - Application ID
 * @returns {Promise<Array>} Array of projections
 */
export async function getUserProjections(db, userId, appId) {
  try {
    const q = query(
      collection(db, 'projections'),
      where('userId', '==', userId),
      where('appId', '==', appId)
    );
    
    const querySnapshot = await getDocs(q);
    const projections = [];
    
    querySnapshot.forEach((doc) => {
      projections.push({ id: doc.id, ...doc.data() });
    });
    
    console.log(`✅ Loaded ${projections.length} projections for user`);
    return projections;
  } catch (error) {
    console.error('❌ Error getting user projections:', error);
    throw new Error(`Failed to get projections: ${error.message}`);
  }
}

/**
 * Set up real-time listener for user projections
 * @param {Object} db - Firestore instance
 * @param {string} userId - User ID
 * @param {string} appId - Application ID
 * @param {Function} callback - Callback function to execute on data change
 * @returns {Function} Unsubscribe function
 */
export function setupProjectionListener(db, userId, appId, callback) {
  try {
    const q = query(
      collection(db, 'projections'),
      where('userId', '==', userId),
      where('appId', '==', appId)
    );
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const projections = [];
      querySnapshot.forEach((doc) => {
        projections.push({ id: doc.id, ...doc.data() });
      });
      
      console.log(`🔄 Projections updated: ${projections.length} items`);
      callback(projections);
    }, (error) => {
      console.error('❌ Listener error:', error);
    });
    
    return unsubscribe;
  } catch (error) {
    console.error('❌ Error setting up listener:', error);
    throw new Error(`Failed to set up listener: ${error.message}`);
  }
}
