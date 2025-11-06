/**
 * Form Module
 * Handles form interactions and dynamic field management
 */

import { generateId } from '../utils/helpers.js';
import { validateProjectionForm } from '../utils/validation.js';

/**
 * Toggle spending mode visibility
 * @param {string} mode - 'single' or 'itemized'
 */
export function toggleSpendingMode(mode) {
  const singleCard = document.getElementById('singleSpendingCard');
  const itemizedCard = document.getElementById('itemizedSpendingCard');
  
  if (mode === 'single') {
    singleCard?.classList.remove('hidden');
    itemizedCard?.classList.add('hidden');
  } else {
    singleCard?.classList.add('hidden');
    itemizedCard?.classList.remove('hidden');
  }
}

/**
 * Create dynamic row for various input types
 * @param {string} type - Row type ('itemizedSpending', 'spending', 'income', 'lumpSum')
 * @returns {HTMLElement} Created row element
 */
export function createDynamicRow(type) {
  const id = generateId();
  const div = document.createElement('div');
  div.id = `row-${id}`;
  div.className = 'dynamic-row mb-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600';
  
  let html = '';
  
  if (type === 'itemizedSpending') {
    html = `
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        <div class="md:col-span-1">
          <label class="block text-sm font-medium mb-1">Category Name</label>
          <input type="text" class="form-input itemized-spending-name w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white" placeholder="e.g., Housing, Food">
        </div>
        <div class="md:col-span-1">
          <label class="block text-sm font-medium mb-1">Monthly Amount (MYR)</label>
          <input type="number" step="100" class="form-input itemized-spending-amount w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white" placeholder="e.g., 3000">
        </div>
        <div class="md:col-span-1 flex items-end">
          <button type="button" class="remove-row-btn w-full md:w-auto px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors" aria-label="Remove category">
            Remove
          </button>
        </div>
      </div>
    `;
  } else if (type === 'spending') {
    html = `
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div>
          <label class="block text-sm font-medium mb-1">Percentage Change (%)</label>
          <input type="number" step="0.1" class="form-input dynamic-spending-percentage w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white" placeholder="e.g., -10 or 25">
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Effective Year</label>
          <input type="number" min="0" class="form-input dynamic-spending-year w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white" placeholder="e.g., 5">
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Effective Month (1-12)</label>
          <input type="number" min="1" max="12" class="form-input dynamic-spending-month w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white" placeholder="e.g., 1">
        </div>
        <div>
          <button type="button" class="remove-row-btn w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors" aria-label="Remove adjustment">
            Remove
          </button>
        </div>
      </div>
    `;
  } else if (type === 'income') {
    html = `
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div>
          <label class="block text-sm font-medium mb-1">New Income (MYR)</label>
          <input type="number" step="100" class="form-input income-change-amount w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white" placeholder="e.g., 6000">
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Start Year</label>
          <input type="number" min="0" class="form-input income-change-year w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white" placeholder="e.g., 10">
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Start Month (1-12)</label>
          <input type="number" min="1" max="12" class="form-input income-change-month w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white" placeholder="e.g., 1">
        </div>
        <div>
          <button type="button" class="remove-row-btn w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors" aria-label="Remove income change">
            Remove
          </button>
        </div>
      </div>
    `;
  } else if (type === 'lumpSum') {
    html = `
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div>
          <label class="block text-sm font-medium mb-1">Amount (MYR)</label>
          <input type="number" step="1000" class="form-input lump-sum-amount w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white" placeholder="e.g., 50000">
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Year</label>
          <input type="number" min="0" class="form-input lump-sum-year w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white" placeholder="e.g., 15">
        </div>
        <div>
          <label class="block text-sm font-medium mb-1">Month (1-12)</label>
          <input type="number" min="1" max="12" class="form-input lump-sum-month w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white" placeholder="e.g., 6">
        </div>
        <div>
          <button type="button" class="remove-row-btn w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors" aria-label="Remove lump sum">
            Remove
          </button>
        </div>
      </div>
    `;
  }
  
  div.innerHTML = html;
  
  // Add remove button event listener
  const removeBtn = div.querySelector('.remove-row-btn');
  if (removeBtn) {
    removeBtn.addEventListener('click', () => {
      div.remove();
    });
  }
  
  return div;
}

/**
 * Add itemized spending row with optional pre-filled data
 * @param {string} name - Category name
 * @param {number} amount - Amount
 * @returns {HTMLElement} Created row
 */
export function addItemizedRow(name = '', amount = '') {
  const row = createDynamicRow('itemizedSpending');
  if (name) row.querySelector('.itemized-spending-name').value = name;
  if (amount) row.querySelector('.itemized-spending-amount').value = amount;
  
  const container = document.getElementById('itemizedSpendingContainer');
  if (container) {
    container.appendChild(row);
  }
  
  return row;
}

/**
 * Get form data from all inputs
 * @returns {Object} Form data
 */
export function getFormData() {
  const formData = {
    initialCapital: parseFloat(document.getElementById('initialCapital')?.value) || 0,
    avgYearlyInvestmentReturn: parseFloat(document.getElementById('avgYearlyInvestmentReturn')?.value) || 0,
    currentAge: parseInt(document.getElementById('currentAge')?.value) || 0,
    annualInflationRate: parseFloat(document.getElementById('annualInflationRate')?.value) || 0,
    projectionStartDate: document.getElementById('projectionStartDate')?.value || new Date().toISOString().split('T')[0],
    initialMonthlyIncome: parseFloat(document.getElementById('initialMonthlyIncome')?.value) || 0,
    spendingMode: document.querySelector('input[name="spendingMode"]:checked')?.value || 'single',
    totalMonthlySpending: parseFloat(document.getElementById('totalMonthlySpending')?.value) || 0,
    itemizedSpending: [],
    dynamicSpending: [],
    incomeChanges: [],
    lumpSums: []
  };
  
  // Get itemized spending
  document.querySelectorAll('#itemizedSpendingContainer .dynamic-row').forEach(row => {
    const name = row.querySelector('.itemized-spending-name')?.value;
    const amount = parseFloat(row.querySelector('.itemized-spending-amount')?.value);
    if (name && amount) {
      formData.itemizedSpending.push({ name, amount });
    }
  });
  
  // Get dynamic spending adjustments
  document.querySelectorAll('#dynamicSpendingContainer .dynamic-row').forEach(row => {
    const percentage = parseFloat(row.querySelector('.dynamic-spending-percentage')?.value);
    const year = parseInt(row.querySelector('.dynamic-spending-year')?.value);
    const month = parseInt(row.querySelector('.dynamic-spending-month')?.value);
    if (!isNaN(percentage) && !isNaN(year) && !isNaN(month)) {
      formData.dynamicSpending.push({ percentage, year, month });
    }
  });
  
  // Get income changes
  document.querySelectorAll('#incomeChangesContainer .dynamic-row').forEach(row => {
    const amount = parseFloat(row.querySelector('.income-change-amount')?.value);
    const year = parseInt(row.querySelector('.income-change-year')?.value);
    const month = parseInt(row.querySelector('.income-change-month')?.value);
    if (!isNaN(amount) && !isNaN(year) && !isNaN(month)) {
      formData.incomeChanges.push({ amount, year, month });
    }
  });
  
  // Get lump sums
  document.querySelectorAll('#lumpSumContainer .dynamic-row').forEach(row => {
    const amount = parseFloat(row.querySelector('.lump-sum-amount')?.value);
    const year = parseInt(row.querySelector('.lump-sum-year')?.value);
    const month = parseInt(row.querySelector('.lump-sum-month')?.value);
    if (!isNaN(amount) && !isNaN(year) && !isNaN(month)) {
      formData.lumpSums.push({ amount, year, month });
    }
  });
  
  return formData;
}

/**
 * Set form data to all inputs
 * @param {Object} data - Form data
 */
export function setFormData(data) {
  if (!data) return;
  
  // Set basic fields
  const currentProjectionId = document.getElementById('currentProjectionId');
  const projectionName = document.getElementById('projectionName');
  const initialCapital = document.getElementById('initialCapital');
  const avgYearlyInvestmentReturn = document.getElementById('avgYearlyInvestmentReturn');
  const currentAge = document.getElementById('currentAge');
  const annualInflationRate = document.getElementById('annualInflationRate');
  const projectionStartDate = document.getElementById('projectionStartDate');
  const initialMonthlyIncome = document.getElementById('initialMonthlyIncome');
  const totalMonthlySpending = document.getElementById('totalMonthlySpending');
  
  if (currentProjectionId) currentProjectionId.value = data.id || '';
  if (projectionName) projectionName.value = data.name || 'Untitled Projection';
  if (initialCapital) initialCapital.value = data.initialCapital || 0;
  if (avgYearlyInvestmentReturn) avgYearlyInvestmentReturn.value = data.avgYearlyInvestmentReturn || 0;
  if (currentAge) currentAge.value = data.currentAge || 0;
  if (annualInflationRate) annualInflationRate.value = data.annualInflationRate || 0;
  if (projectionStartDate) projectionStartDate.value = data.projectionStartDate || new Date().toISOString().split('T')[0];
  if (initialMonthlyIncome) initialMonthlyIncome.value = data.initialMonthlyIncome || 0;
  if (totalMonthlySpending) totalMonthlySpending.value = data.totalMonthlySpending || 0;
  
  // Set spending mode
  const spendingMode = data.spendingMode || 'single';
  const spendingModeRadio = document.getElementById(spendingMode === 'itemized' ? 'spendingModeItemized' : 'spendingModeSingle');
  if (spendingModeRadio) {
    spendingModeRadio.checked = true;
    toggleSpendingMode(spendingMode);
  }
  
  // Clear and populate dynamic fields
  const itemizedContainer = document.getElementById('itemizedSpendingContainer');
  if (itemizedContainer) {
    itemizedContainer.innerHTML = '';
    (data.itemizedSpending || []).forEach(item => {
      addItemizedRow(item.name, item.amount);
    });
  }
  
  const dynamicSpendingContainer = document.getElementById('dynamicSpendingContainer');
  if (dynamicSpendingContainer) {
    dynamicSpendingContainer.innerHTML = '';
    (data.dynamicSpending || []).forEach(item => {
      const row = createDynamicRow('spending');
      row.querySelector('.dynamic-spending-percentage').value = item.percentage;
      row.querySelector('.dynamic-spending-year').value = item.year;
      row.querySelector('.dynamic-spending-month').value = item.month;
      dynamicSpendingContainer.appendChild(row);
    });
  }
  
  const incomeChangesContainer = document.getElementById('incomeChangesContainer');
  if (incomeChangesContainer) {
    incomeChangesContainer.innerHTML = '';
    (data.incomeChanges || []).forEach(item => {
      const row = createDynamicRow('income');
      row.querySelector('.income-change-amount').value = item.amount;
      row.querySelector('.income-change-year').value = item.year;
      row.querySelector('.income-change-month').value = item.month;
      incomeChangesContainer.appendChild(row);
    });
  }
  
  const lumpSumContainer = document.getElementById('lumpSumContainer');
  if (lumpSumContainer) {
    lumpSumContainer.innerHTML = '';
    (data.lumpSums || []).forEach(item => {
      const row = createDynamicRow('lumpSum');
      row.querySelector('.lump-sum-amount').value = item.amount;
      row.querySelector('.lump-sum-year').value = item.year;
      row.querySelector('.lump-sum-month').value = item.month;
      lumpSumContainer.appendChild(row);
    });
  }
  
  // Show/hide delete button
  const deleteBtn = document.getElementById('deleteProjectionBtn');
  if (deleteBtn) {
    deleteBtn.classList.toggle('hidden', !data.id);
  }
}

/**
 * Validate form data
 * @param {Object} formData - Form data to validate
 * @returns {Object} Validation result
 */
export function validateForm(formData) {
  return validateProjectionForm(formData);
}

/**
 * Reset form to defaults
 */
export function resetForm() {
  setFormData({
    id: '',
    name: 'My Financial Projection',
    initialCapital: 2000000,
    avgYearlyInvestmentReturn: 5.0,
    currentAge: 30,
    annualInflationRate: 3.0,
    projectionStartDate: new Date().toISOString().split('T')[0],
    initialMonthlyIncome: 5000,
    spendingMode: 'single',
    totalMonthlySpending: 5000,
    itemizedSpending: [],
    dynamicSpending: [],
    incomeChanges: [],
    lumpSums: []
  });
}
