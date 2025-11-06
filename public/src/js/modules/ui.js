/**
 * UI Module
 * Handles UI interactions, modals, notifications, and theme
 */

import { formatCurrency, formatNumber, downloadFile, arrayToCSV } from '../utils/helpers.js';

let modalResolve = null;

/**
 * Show loading state
 */
export function showLoading() {
  const loader = document.getElementById('loader');
  const appContent = document.getElementById('appContent');
  
  if (loader) loader.classList.remove('hidden');
  if (appContent) appContent.classList.add('opacity-50', 'pointer-events-none');
}

/**
 * Hide loading state
 */
export function hideLoading() {
  const loader = document.getElementById('loader');
  const appContent = document.getElementById('appContent');
  
  if (loader) {
    loader.classList.add('hidden');
    loader.style.display = 'none';
  }
  if (appContent) {
    appContent.classList.remove('opacity-50', 'pointer-events-none', 'hidden');
    appContent.style.display = 'block';
  }
  // Ensure body is scrollable
  document.body.style.overflow = 'auto';
}

/**
 * Show modal dialog
 * @param {string} title - Modal title
 * @param {string} message - Modal message
 * @param {Object} options - Modal options
 * @returns {Promise<boolean>} User confirmation
 */
export function showModal(title, message, options = {}) {
  const {
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    showCancel = true,
    type = 'info' // 'info', 'warning', 'error', 'success'
  } = options;
  
  return new Promise((resolve) => {
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modalTitle');
    const modalMessage = document.getElementById('modalMessage');
    const modalConfirmBtn = document.getElementById('modalConfirmBtn');
    const modalCancelBtn = document.getElementById('modalCancelBtn');
    
    if (!modal) {
      console.warn('Modal element not found');
      resolve(false);
      return;
    }
    
    modalTitle.textContent = title;
    modalMessage.textContent = message;
    modalConfirmBtn.textContent = confirmText;
    modalCancelBtn.textContent = cancelText;
    
    // Show/hide cancel button
    if (showCancel) {
      modalCancelBtn.classList.remove('hidden');
    } else {
      modalCancelBtn.classList.add('hidden');
    }
    
    // Set button colors based on type
    modalConfirmBtn.className = 'px-4 py-2 rounded-md font-medium transition-colors';
    if (type === 'error' || type === 'warning') {
      modalConfirmBtn.classList.add('bg-red-500', 'hover:bg-red-600', 'text-white');
    } else {
      modalConfirmBtn.classList.add('bg-blue-500', 'hover:bg-blue-600', 'text-white');
    }
    
    // Show modal
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    
    // Store resolve function
    modalResolve = resolve;
  });
}

/**
 * Hide modal dialog
 * @param {boolean} confirmed - Whether user confirmed
 */
export function hideModal(confirmed = false) {
  const modal = document.getElementById('modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
  
  if (modalResolve) {
    modalResolve(confirmed);
    modalResolve = null;
  }
}

/**
 * Show toast notification
 * @param {string} message - Notification message
 * @param {string} type - Notification type ('success', 'error', 'info', 'warning')
 * @param {number} duration - Duration in milliseconds
 */
export function showNotification(message, type = 'info', duration = 3000) {
  const container = document.getElementById('notificationContainer') || createNotificationContainer();
  
  const notification = document.createElement('div');
  notification.className = `notification px-4 py-3 rounded-lg shadow-lg text-white mb-2 transform transition-all duration-300 translate-x-full`;
  
  // Set background color based on type
  const colors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500'
  };
  notification.classList.add(colors[type] || colors.info);
  
  // Add icon based on type
  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  };
  
  notification.innerHTML = `
    <div class="flex items-center gap-2">
      <span class="text-lg font-bold">${icons[type] || icons.info}</span>
      <span>${message}</span>
    </div>
  `;
  
  container.appendChild(notification);
  
  // Animate in
  setTimeout(() => {
    notification.classList.remove('translate-x-full');
  }, 10);
  
  // Auto remove
  setTimeout(() => {
    notification.classList.add('translate-x-full', 'opacity-0');
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, duration);
}

/**
 * Create notification container if it doesn't exist
 * @returns {HTMLElement} Notification container
 */
function createNotificationContainer() {
  const container = document.createElement('div');
  container.id = 'notificationContainer';
  container.className = 'fixed top-4 right-4 z-50 flex flex-col items-end';
  document.body.appendChild(container);
  return container;
}

/**
 * Display projection results
 * @param {Object} projectionResult - Projection calculation result
 */
export function displayResults(projectionResult) {
  const resultsSection = document.getElementById('resultsSection');
  const resultsMessage = document.getElementById('resultsMessage');
  const resultsTableBody = document.getElementById('resultsTableBody');
  const metricsContainer = document.getElementById('metricsContainer');
  
  if (!resultsSection) return;
  
  if (!projectionResult.success) {
    showNotification(`Calculation error: ${projectionResult.error}`, 'error');
    return;
  }
  
  const { results, summary } = projectionResult;
  
  // Show results section
  resultsSection.classList.remove('hidden');
  
  // Display summary message
  if (resultsMessage && summary) {
    let message = `Projection calculated for ${summary.totalYears} years (${summary.totalMonths} months). `;
    
    if (summary.isPerpetualWealth) {
      message += `🎉 Your wealth is perpetual! With your current capital of ${formatCurrency(summary.finalCapital)} and consistent positive cash flow, your wealth will last forever.`;
      resultsMessage.className = 'text-lg font-semibold text-emerald-600 dark:text-emerald-400 mb-4';
    } else if (summary.capitalDepleted) {
      message += `⚠️ Capital depleted at age ${summary.depletionAge}.`;
      resultsMessage.className = 'text-lg font-semibold text-red-600 dark:text-red-400 mb-4';
    } else {
      message += `✓ Final capital: ${formatCurrency(summary.finalCapital)} at age ${summary.finalAge}.`;
      resultsMessage.className = 'text-lg font-semibold text-green-600 dark:text-green-400 mb-4';
    }
    
    resultsMessage.textContent = message;
  }
  
  // Display metrics
  if (metricsContainer && summary) {
    metricsContainer.innerHTML = `
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div class="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
          <div class="text-sm text-blue-600 dark:text-blue-400 font-medium mb-1">Final Capital</div>
          <div class="text-2xl font-bold text-blue-900 dark:text-blue-100">${formatCurrency(summary.finalCapital)}</div>
        </div>
        <div class="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
          <div class="text-sm text-green-600 dark:text-green-400 font-medium mb-1">Total Income</div>
          <div class="text-2xl font-bold text-green-900 dark:text-green-100">${formatCurrency(summary.totalIncome)}</div>
        </div>
        <div class="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
          <div class="text-sm text-red-600 dark:text-red-400 font-medium mb-1">Total Spending</div>
          <div class="text-2xl font-bold text-red-900 dark:text-red-100">${formatCurrency(summary.totalSpending)}</div>
        </div>
        <div class="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
          <div class="text-sm text-purple-600 dark:text-purple-400 font-medium mb-1">Investment Returns</div>
          <div class="text-2xl font-bold text-purple-900 dark:text-purple-100">${formatCurrency(summary.totalInvestmentReturns)}</div>
        </div>
      </div>
    `;
  }
  
  // Display table with view toggle
  if (resultsTableBody) {
    resultsTableBody.innerHTML = '';
    
    // Check if monthly view toggle exists, default to yearly for long projections
    const viewToggle = document.getElementById('viewToggle');
    const isMonthlyView = viewToggle ? viewToggle.value === 'monthly' : results.length <= 120;
    const sampleRate = isMonthlyView ? 1 : 12; // 1 = monthly, 12 = yearly
    const sampledResults = results.filter((_, index) => index % sampleRate === 0);
    
    sampledResults.forEach(result => {
      const row = document.createElement('tr');
      row.className = 'border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700';
      row.innerHTML = `
        <td class="px-4 py-2">${result.date}</td>
        <td class="px-4 py-2 text-center">${result.age}</td>
        <td class="px-4 py-2 text-right">${formatCurrency(result.income)}</td>
        <td class="px-4 py-2 text-right">${formatCurrency(result.spending)}</td>
        <td class="px-4 py-2 text-right ${result.netCashFlow >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}">${formatCurrency(result.netCashFlow)}</td>
        <td class="px-4 py-2 text-right">${formatCurrency(result.investmentReturns)}</td>
        <td class="px-4 py-2 text-right font-semibold">${formatCurrency(result.capital)}</td>
      `;
      resultsTableBody.appendChild(row);
    });
  }
  
  // Scroll to results
  resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/**
 * Download results as CSV
 * @param {Array} results - Projection results
 * @param {string} filename - File name
 */
export function downloadResultsCSV(results, filename = 'financial_projection.csv') {
  if (!results || results.length === 0) {
    showNotification('No results to export', 'warning');
    return;
  }
  
  const csvData = arrayToCSV(results, [
    'date',
    'age',
    'income',
    'spending',
    'lumpSum',
    'netCashFlow',
    'investmentReturns',
    'capital'
  ]);
  
  downloadFile(csvData, filename, 'text/csv');
  showNotification('CSV file downloaded successfully', 'success');
}

/**
 * Toggle dark mode
 */
export function toggleDarkMode() {
  const html = document.documentElement;
  const isDark = html.classList.toggle('dark');
  
  // Save preference
  localStorage.setItem('darkMode', isDark ? 'true' : 'false');
  
  // Update theme toggle button
  updateThemeToggleButton(isDark);
  
  return isDark;
}

/**
 * Initialize dark mode from saved preference
 */
export function initializeDarkMode() {
  const savedTheme = localStorage.getItem('darkMode');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = savedTheme === 'true' || (savedTheme === null && prefersDark);
  
  if (isDark) {
    document.documentElement.classList.add('dark');
  }
  
  updateThemeToggleButton(isDark);
  
  return isDark;
}

/**
 * Update theme toggle button icon
 * @param {boolean} isDark - Dark mode state
 */
function updateThemeToggleButton(isDark) {
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.innerHTML = isDark 
      ? '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"/></svg>'
      : '<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/></svg>';
    themeToggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
  }
}

/**
 * Populate projection dropdown
 * @param {Array} projections - List of projections
 */
export function populateProjectionDropdown(projections) {
  const select = document.getElementById('loadProjectionSelect');
  if (!select) return;
  
  // Clear existing options except the first one
  select.innerHTML = '<option value="">Load a saved projection...</option>';
  
  // Add projection options
  projections.forEach(proj => {
    const option = document.createElement('option');
    option.value = proj.id;
    option.textContent = proj.name || 'Untitled Projection';
    select.appendChild(option);
  });
  
  console.log(`📋 Loaded ${projections.length} projections into dropdown`);
}
