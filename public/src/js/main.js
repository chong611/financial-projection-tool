/**
 * Main Application Entry Point
 * Coordinates all modules and handles application lifecycle
 */

import { initializeFirebase, loadConfig, getAuthInstance, getDbInstance, getAppId } from './config/firebase.js';
import { signIn, setupAuthListener, getCurrentUserId } from './modules/auth.js';
import { saveProjection, loadProjection, deleteProjection, getUserProjections, setupProjectionListener } from './modules/database.js';
import { runProjection, exportToCSV } from './modules/calculator.js';
import { renderChart, destroyChart, updateChartTheme } from './modules/chart.js';
import { 
  getFormData, 
  setFormData, 
  resetForm, 
  validateForm, 
  toggleSpendingMode, 
  createDynamicRow, 
  addItemizedRow 
} from './modules/form.js';
import { 
  showLoading, 
  hideLoading, 
  showModal, 
  hideModal, 
  showNotification, 
  displayResults, 
  downloadResultsCSV, 
  toggleDarkMode, 
  initializeDarkMode,
  populateProjectionDropdown 
} from './modules/ui.js';

// Global state
let currentProjectionResults = null;
let unsubscribeProjectionListener = null;

/**
 * Initialize the application
 */
async function initializeApp() {
  try {
    console.log('🚀 Initializing Financial Projection Tool...');
    
    // Show loading
    showLoading();
    
    // Load configuration
    const config = await loadConfig();
    console.log('📦 Configuration loaded');
    
    // Initialize Firebase
    await initializeFirebase(config.firebaseConfig);
    
    const authInstance = getAuthInstance();
    
    if (authInstance) {
      // Setup authentication if Firebase is available
      setupAuthListener(authInstance, async (user) => {
        if (user) {
          console.log('👤 User authenticated:', user.uid);
          await onUserAuthenticated();
        } else {
          console.log('🔐 Attempting sign in...');
          await signIn(authInstance, config.initialAuthToken);
        }
      });
    } else {
      // Run in offline mode
      console.log('💻 Running in offline mode - Firebase features disabled');
      await onOfflineMode();
    }
    
  } catch (error) {
    console.error('❌ Application initialization error:', error);
    hideLoading();
    showNotification('Failed to initialize application. Please refresh the page.', 'error', 5000);
  }
}

/**
 * Handle user authentication success
 */
async function onUserAuthenticated() {
  try {
    // Setup projection listener
    unsubscribeProjectionListener = setupProjectionListener(
      getDbInstance(),
      getCurrentUserId(),
      getAppId(),
      (projections) => {
        console.log(`📊 Projections updated: ${projections.length} items`);
        populateProjectionDropdown(projections);
      }
    );
    
    // Initialize UI
    initializeUI();
    
    // Set default values
    resetForm();
    
    // Initialize dark mode
    const isDark = initializeDarkMode();
    
    // Hide loading
    hideLoading();
    
    console.log('✅ Application ready');
    
  } catch (error) {
    console.error('❌ User authentication handler error:', error);
    hideLoading();
    showNotification('Failed to setup user session', 'error');
  }
}

/**
 * Handle offline mode (no Firebase)
 */
async function onOfflineMode() {
  try {
    console.log('⚠️ Offline mode: Save/Load features disabled');
    
    // Initialize UI
    initializeUI();
    
    // Set default values
    resetForm();
    
    // Initialize dark mode
    const isDark = initializeDarkMode();
    
    // Hide save/load/delete buttons
    const saveBtn = document.getElementById('saveProjectionBtn');
    const deleteBtn = document.getElementById('deleteProjectionBtn');
    const loadSelect = document.getElementById('loadProjectionSelect');
    
    if (saveBtn) saveBtn.style.display = 'none';
    if (deleteBtn) deleteBtn.style.display = 'none';
    if (loadSelect) loadSelect.parentElement.style.display = 'none';
    
    // Hide loading
    hideLoading();
    
    showNotification('Running in offline mode - calculations and exports available, save/load disabled', 'info', 5000);
    
    console.log('✅ Application ready (offline mode)');
    
  } catch (error) {
    console.error('❌ Offline mode setup error:', error);
    hideLoading();
    showNotification('Failed to initialize application', 'error');
  }
}

/**
 * Initialize UI event listeners
 */
function initializeUI() {
  // Theme toggle
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isDark = toggleDarkMode();
      updateChartTheme(isDark);
    });
  }
  
  // Spending mode toggle
  const spendingModeRadios = document.getElementsByName('spendingMode');
  spendingModeRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      toggleSpendingMode(e.target.value);
    });
  });
  
  // Add dynamic row buttons
  const addItemizedSpendingBtn = document.getElementById('addItemizedSpendingBtn');
  if (addItemizedSpendingBtn) {
    addItemizedSpendingBtn.addEventListener('click', () => {
      addItemizedRow();
    });
  }
  
  const addDynamicSpendingBtn = document.getElementById('addDynamicSpendingBtn');
  if (addDynamicSpendingBtn) {
    addDynamicSpendingBtn.addEventListener('click', () => {
      const row = createDynamicRow('spending');
      document.getElementById('dynamicSpendingContainer').appendChild(row);
    });
  }
  
  const addIncomeChangeBtn = document.getElementById('addIncomeChangeBtn');
  if (addIncomeChangeBtn) {
    addIncomeChangeBtn.addEventListener('click', () => {
      const row = createDynamicRow('income');
      document.getElementById('incomeChangesContainer').appendChild(row);
    });
  }
  
  const addLumpSumBtn = document.getElementById('addLumpSumBtn');
  if (addLumpSumBtn) {
    addLumpSumBtn.addEventListener('click', () => {
      const row = createDynamicRow('lumpSum');
      document.getElementById('lumpSumContainer').appendChild(row);
    });
  }
  
  // Calculate button
  const calculateBtn = document.getElementById('calculateBtn');
  if (calculateBtn) {
    calculateBtn.addEventListener('click', handleCalculate);
  }
  
  // Save projection button
  const saveProjectionBtn = document.getElementById('saveProjectionBtn');
  if (saveProjectionBtn) {
    saveProjectionBtn.addEventListener('click', handleSaveProjection);
  }
  
  // New projection button
  const newProjectionBtn = document.getElementById('newProjectionBtn');
  if (newProjectionBtn) {
    newProjectionBtn.addEventListener('click', handleNewProjection);
  }
  
  // Load projection dropdown
  const loadProjectionSelect = document.getElementById('loadProjectionSelect');
  if (loadProjectionSelect) {
    loadProjectionSelect.addEventListener('change', handleLoadProjection);
  }
  
  // Delete projection button
  const deleteProjectionBtn = document.getElementById('deleteProjectionBtn');
  if (deleteProjectionBtn) {
    deleteProjectionBtn.addEventListener('click', handleDeleteProjection);
  }
  
  // Download CSV button
  const downloadCsvBtn = document.getElementById('downloadCsvBtn');
  if (downloadCsvBtn) {
    downloadCsvBtn.addEventListener('click', handleDownloadCSV);
  }
  
  // View toggle
  const viewToggle = document.getElementById('viewToggle');
  if (viewToggle) {
    viewToggle.addEventListener('change', () => {
      if (currentProjectionResults && currentProjectionResults.success) {
        displayResults(currentProjectionResults);
      }
    });
  }
  
  // Modal buttons
  const modalConfirmBtn = document.getElementById('modalConfirmBtn');
  if (modalConfirmBtn) {
    modalConfirmBtn.addEventListener('click', () => hideModal(true));
  }
  
  const modalCancelBtn = document.getElementById('modalCancelBtn');
  if (modalCancelBtn) {
    modalCancelBtn.addEventListener('click', () => hideModal(false));
  }
  
  console.log('🎛️ UI event listeners initialized');
}

/**
 * Handle calculate projection
 */
async function handleCalculate() {
  try {
    showLoading();
    
    // Get form data
    const formData = getFormData();
    
    // Validate form
    const validation = validateForm(formData);
    if (!validation.valid) {
      hideLoading();
      showNotification(`Validation error: ${validation.errors[0]}`, 'error');
      return;
    }
    
    // Run calculation
    console.log('🧮 Starting calculation...');
    const result = runProjection(formData);
    
    if (!result.success) {
      hideLoading();
      showNotification(`Calculation failed: ${result.error}`, 'error');
      return;
    }
    
    // Store full results object
    currentProjectionResults = result;
    
    // Display results
    displayResults(result);
    
    // Render chart
    const chartCanvas = document.getElementById('projectionChart');
    if (chartCanvas) {
      renderChart(chartCanvas, result.results, {
        title: `${formData.name} - Financial Projection`
      });
    }
    
    hideLoading();
    showNotification('Projection calculated successfully', 'success');
    
  } catch (error) {
    console.error('❌ Calculation error:', error);
    hideLoading();
    showNotification(`Error: ${error.message}`, 'error');
  }
}

/**
 * Handle save projection
 */
async function handleSaveProjection() {
  try {
    showLoading();
    
    // Get form data
    const formData = getFormData();
    
    // Validate form
    const validation = validateForm(formData);
    if (!validation.valid) {
      hideLoading();
      showNotification(`Validation error: ${validation.errors[0]}`, 'error');
      return;
    }
    
    // Save to Firestore
    const docId = await saveProjection(
      getDbInstance(),
      getCurrentUserId(),
      getAppId(),
      formData
    );
    
    // Update form with new ID
    document.getElementById('currentProjectionId').value = docId;
    
    // Show delete button
    document.getElementById('deleteProjectionBtn').classList.remove('hidden');
    
    hideLoading();
    showNotification('Projection saved successfully', 'success');
    
  } catch (error) {
    console.error('❌ Save error:', error);
    hideLoading();
    showNotification(`Failed to save: ${error.message}`, 'error');
  }
}

/**
 * Handle new projection
 */
async function handleNewProjection() {
  const confirmed = await showModal(
    'Create New Projection',
    'This will clear the current form. Any unsaved changes will be lost. Continue?',
    { confirmText: 'Create New', cancelText: 'Cancel', type: 'warning' }
  );
  
  if (confirmed) {
    resetForm();
    currentProjectionResults = null;
    destroyChart();
    document.getElementById('resultsSection').classList.add('hidden');
    document.getElementById('loadProjectionSelect').value = '';
    showNotification('New projection created', 'info');
  }
}

/**
 * Handle load projection
 */
async function handleLoadProjection(event) {
  const projectionId = event.target.value;
  
  if (!projectionId) return;
  
  try {
    showLoading();
    
    // Load from Firestore
    const data = await loadProjection(getDbInstance(), projectionId);
    
    // Set form data
    setFormData(data);
    
    // Clear results
    currentProjectionResults = null;
    destroyChart();
    document.getElementById('resultsSection').classList.add('hidden');
    
    hideLoading();
    showNotification('Projection loaded successfully', 'success');
    
  } catch (error) {
    console.error('❌ Load error:', error);
    hideLoading();
    showNotification(`Failed to load: ${error.message}`, 'error');
    event.target.value = '';
  }
}

/**
 * Handle delete projection
 */
async function handleDeleteProjection() {
  const projectionId = document.getElementById('currentProjectionId').value;
  
  if (!projectionId) {
    showNotification('No projection to delete', 'warning');
    return;
  }
  
  const confirmed = await showModal(
    'Delete Projection',
    'Are you sure you want to delete this projection? This action cannot be undone.',
    { confirmText: 'Delete', cancelText: 'Cancel', type: 'error' }
  );
  
  if (!confirmed) return;
  
  try {
    showLoading();
    
    // Delete from Firestore
    await deleteProjection(getDbInstance(), projectionId);
    
    // Reset form
    resetForm();
    currentProjectionResults = null;
    destroyChart();
    document.getElementById('resultsSection').classList.add('hidden');
    document.getElementById('loadProjectionSelect').value = '';
    
    hideLoading();
    showNotification('Projection deleted successfully', 'success');
    
  } catch (error) {
    console.error('❌ Delete error:', error);
    hideLoading();
    showNotification(`Failed to delete: ${error.message}`, 'error');
  }
}

/**
 * Handle download CSV
 */
function handleDownloadCSV() {
  if (!currentProjectionResults || !currentProjectionResults.results || currentProjectionResults.results.length === 0) {
    showNotification('No results to export. Please calculate a projection first.', 'warning');
    return;
  }
  
  const projectionName = document.getElementById('projectionName').value || 'projection';
  const filename = `${projectionName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${new Date().toISOString().split('T')[0]}.csv`;
  
  downloadResultsCSV(currentProjectionResults.results, filename);
}

/**
 * Cleanup on page unload
 */
window.addEventListener('beforeunload', () => {
  if (unsubscribeProjectionListener) {
    unsubscribeProjectionListener();
  }
  destroyChart();
});

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}

// Export for debugging
window.FinancialProjectionTool = {
  getFormData,
  runProjection,
  getCurrentResults: () => currentProjectionResults
};
