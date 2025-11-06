/**
 * Auto-Save Module
 * GOD MODE: Automatic draft saving to prevent data loss
 */

import { debounce } from '../utils/helpers.js';

const AUTOSAVE_KEY = 'financial_projection_autosave';
const AUTOSAVE_DELAY = 2000; // 2 seconds

let autosaveEnabled = true;
let lastSaveTime = null;

/**
 * Save form data to local storage
 * @param {Object} formData - Form data to save
 */
export function saveDraft(formData) {
  if (!autosaveEnabled) return;
  
  try {
    const draft = {
      data: formData,
      timestamp: new Date().toISOString(),
      version: '1.0'
    };
    
    localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(draft));
    lastSaveTime = Date.now();
    
    console.log('💾 Draft auto-saved');
    
    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('autosave', { 
      detail: { timestamp: draft.timestamp } 
    }));
    
  } catch (error) {
    console.error('❌ Auto-save error:', error);
  }
}

/**
 * Load draft from local storage
 * @returns {Object|null} Saved draft or null
 */
export function loadDraft() {
  try {
    const saved = localStorage.getItem(AUTOSAVE_KEY);
    if (!saved) return null;
    
    const draft = JSON.parse(saved);
    
    // Check if draft is recent (within 7 days)
    const draftAge = Date.now() - new Date(draft.timestamp).getTime();
    const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days
    
    if (draftAge > maxAge) {
      clearDraft();
      return null;
    }
    
    console.log('📂 Draft loaded from', draft.timestamp);
    return draft;
    
  } catch (error) {
    console.error('❌ Load draft error:', error);
    return null;
  }
}

/**
 * Clear saved draft
 */
export function clearDraft() {
  try {
    localStorage.removeItem(AUTOSAVE_KEY);
    console.log('🗑️ Draft cleared');
  } catch (error) {
    console.error('❌ Clear draft error:', error);
  }
}

/**
 * Check if draft exists
 * @returns {boolean} True if draft exists
 */
export function hasDraft() {
  return localStorage.getItem(AUTOSAVE_KEY) !== null;
}

/**
 * Get last save time
 * @returns {number|null} Timestamp of last save
 */
export function getLastSaveTime() {
  return lastSaveTime;
}

/**
 * Enable auto-save
 */
export function enableAutosave() {
  autosaveEnabled = true;
  console.log('✅ Auto-save enabled');
}

/**
 * Disable auto-save
 */
export function disableAutosave() {
  autosaveEnabled = false;
  console.log('⏸️ Auto-save disabled');
}

/**
 * Create debounced auto-save function
 * @param {Function} getFormDataFn - Function to get current form data
 * @returns {Function} Debounced save function
 */
export function createDebouncedAutosave(getFormDataFn) {
  return debounce(() => {
    const formData = getFormDataFn();
    saveDraft(formData);
  }, AUTOSAVE_DELAY);
}

/**
 * Setup auto-save listeners on form inputs
 * @param {string} formSelector - Form selector
 * @param {Function} getFormDataFn - Function to get form data
 */
export function setupAutosaveListeners(formSelector, getFormDataFn) {
  const form = document.querySelector(formSelector);
  if (!form) {
    console.warn('Form not found for auto-save setup');
    return;
  }
  
  const debouncedSave = createDebouncedAutosave(getFormDataFn);
  
  // Listen to all input changes
  form.addEventListener('input', debouncedSave);
  form.addEventListener('change', debouncedSave);
  
  console.log('👂 Auto-save listeners attached');
}

/**
 * Show auto-save indicator
 * @param {string} status - Status ('saving', 'saved', 'error')
 */
export function showAutosaveIndicator(status) {
  let indicator = document.getElementById('autosaveIndicator');
  
  if (!indicator) {
    indicator = document.createElement('div');
    indicator.id = 'autosaveIndicator';
    indicator.className = 'fixed bottom-4 right-4 px-4 py-2 rounded-lg shadow-lg text-sm font-medium transition-all duration-300 z-40';
    document.body.appendChild(indicator);
  }
  
  indicator.classList.remove('opacity-0', 'translate-y-2');
  
  switch (status) {
    case 'saving':
      indicator.className = indicator.className.replace(/bg-\w+-\d+/g, '');
      indicator.classList.add('bg-blue-500', 'text-white');
      indicator.textContent = '💾 Saving draft...';
      break;
    case 'saved':
      indicator.className = indicator.className.replace(/bg-\w+-\d+/g, '');
      indicator.classList.add('bg-green-500', 'text-white');
      indicator.textContent = '✓ Draft saved';
      setTimeout(() => {
        indicator.classList.add('opacity-0', 'translate-y-2');
      }, 2000);
      break;
    case 'error':
      indicator.className = indicator.className.replace(/bg-\w+-\d+/g, '');
      indicator.classList.add('bg-red-500', 'text-white');
      indicator.textContent = '✕ Save failed';
      setTimeout(() => {
        indicator.classList.add('opacity-0', 'translate-y-2');
      }, 3000);
      break;
  }
}

// Listen to auto-save events
if (typeof window !== 'undefined') {
  window.addEventListener('autosave', () => {
    showAutosaveIndicator('saved');
  });
}
