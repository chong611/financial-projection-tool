/**
 * Main Application Entry Point
 * Pure financial projection calculator without database dependencies
 */

import { runProjection } from './modules/calculator.js';
import { renderChart, destroyChart, updateChartTheme } from './modules/chart.js';
import { 
  getFormData, 
  resetForm, 
  validateForm, 
  toggleSpendingMode, 
  createDynamicRow, 
  addItemizedRow 
} from './modules/form.js';
import { 
  showLoading, 
  hideLoading, 
  showNotification, 
  displayResults, 
  downloadResultsCSV, 
  toggleDarkMode, 
  initializeDarkMode
} from './modules/ui.js';

// Global state
let currentProjectionResults = null;

/**
 * Initialize the application
 */
async function initializeApp() {
  try {
    console.log('🚀 Initializing Financial Projection Tool...');
    console.log('DEBUG: initializeApp called');
    
    // Show loading
    showLoading();
    
    // Initialize dark mode
    initializeDarkMode();
    
    // Setup event listeners
    console.log('DEBUG: About to setup event listeners');
    setupEventListeners();
    console.log('DEBUG: Event listeners setup complete');
    
    // Hide loading and show app
    hideLoading();
    
    console.log('✅ Application initialized successfully');
    
  } catch (error) {
    console.error('❌ Failed to initialize application:', error);
    hideLoading();
    showNotification('Failed to initialize application. Please refresh the page.', 'error');
  }
}

/**
 * Setup all event listeners
 */
function setupEventListeners() {
  console.log('DEBUG: setupEventListeners function called');
  // Dark mode toggle
  const darkModeToggle = document.getElementById('darkModeToggle');
  if (darkModeToggle) {
    darkModeToggle.addEventListener('click', () => {
      toggleDarkMode();
      if (currentProjectionResults) {
        updateChartTheme();
      }
    });
  }
  
  // Spending mode toggle
  const spendingModeRadios = document.querySelectorAll('input[name="spendingMode"]');
  spendingModeRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      toggleSpendingMode(e.target.value);
    });
  });
  
  // Add category button (for itemized spending)
  const addCategoryBtn = document.getElementById('addCategoryBtn');
  if (addCategoryBtn) {
    addCategoryBtn.addEventListener('click', () => {
      addItemizedRow();
    });
  }
  
  // Add dynamic spending adjustment
  const addAdjustmentBtn = document.getElementById('addAdjustmentBtn');
  if (addAdjustmentBtn) {
    addAdjustmentBtn.addEventListener('click', () => {
      createDynamicRow('dynamicSpendingContainer', 'dynamicSpending');
    });
  }
  
  // Add income change
  const addIncomeChangeBtn = document.getElementById('addIncomeChangeBtn');
  if (addIncomeChangeBtn) {
    addIncomeChangeBtn.addEventListener('click', () => {
      createDynamicRow('incomeChangesContainer', 'incomeChange');
    });
  }
  
  // Add lump sum
  const addLumpSumBtn = document.getElementById('addLumpSumBtn');
  if (addLumpSumBtn) {
    addLumpSumBtn.addEventListener('click', () => {
      createDynamicRow('lumpSumContainer', 'lumpSum');
    });
  }
  
  // Calculate button
  console.log('DEBUG: Looking for calculateBtn');
  const calculateBtn = document.getElementById('calculateBtn');
  console.log('DEBUG: calculateBtn found:', !!calculateBtn);
  if (calculateBtn) {
    calculateBtn.addEventListener('click', handleCalculate);
  }
  
  // Download CSV button
  const downloadCsvBtn = document.getElementById('downloadCsvBtn');
  if (downloadCsvBtn) {
    downloadCsvBtn.addEventListener('click', handleDownloadCSV);
  }
  
  // View toggle (monthly/yearly)
  const viewToggle = document.getElementById('viewToggle');
  if (viewToggle) {
    viewToggle.addEventListener('change', () => {
      if (currentProjectionResults) {
        displayResults(currentProjectionResults);
      }
    });
  }
}

/**
 * Handle calculate button click
 */
function handleCalculate() {
  console.log('🧮 Calculate button clicked');
  
  // Validate form
  if (!validateForm()) {
    showNotification('Please fill in all required fields correctly', 'warning');
    return;
  }
  
  // Get form data
  const formData = getFormData();
  console.log('📊 Form data collected:', formData);
  
  // Show loading
  showLoading();
  
  // Run projection (with small delay for UI feedback)
  setTimeout(() => {
    try {
      const result = runProjection(formData);
      
      if (result.success) {
        currentProjectionResults = result;
        displayResults(result);
        showNotification('Projection calculated successfully!', 'success');
      } else {
        showNotification(`Calculation error: ${result.error}`, 'error');
      }
    } catch (error) {
      console.error('❌ Calculation error:', error);
      showNotification(`Calculation error: ${error.message}`, 'error');
    } finally {
      hideLoading();
    }
  }, 300);
}

/**
 * Handle download CSV button click
 */
function handleDownloadCSV() {
  if (!currentProjectionResults || !currentProjectionResults.results) {
    showNotification('No results to export', 'warning');
    return;
  }
  
  const filename = `financial_projection_${new Date().toISOString().split('T')[0]}.csv`;
  downloadResultsCSV(currentProjectionResults.results, filename);
  showNotification('CSV file downloaded successfully!', 'success');
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}
