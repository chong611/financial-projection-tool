/**
 * Calculator Module
 * Financial projection calculation engine
 */

import { deepClone } from '../utils/helpers.js';

/**
 * Run financial projection calculation
 * @param {Object} data - Projection input data
 * @returns {Object} Calculation results with monthly breakdown
 */
export function runProjection(data) {
  console.log('🧮 Running projection with data:', data);
  
  try {
    const results = [];
    let capital = data.initialCapital;
    
    // Initialize spending
    let currentSpendingItems = [];
    let currentTotalMonthlySpending = 0;
    
    if (data.spendingMode === 'itemized') {
      currentSpendingItems = deepClone(data.itemizedSpending || []);
    } else {
      currentTotalMonthlySpending = data.totalMonthlySpending || 0;
    }
    
    let currentMonthlyIncome = data.initialMonthlyIncome || 0;
    
    // Calculate rates
    const monthlyInvestmentRate = (data.avgYearlyInvestmentReturn / 100) / 12;
    const annualInflationRatePercent = data.annualInflationRate / 100;
    
    const startDate = new Date(data.projectionStartDate);
    const startYear = startDate.getFullYear();
    const startMonth = startDate.getMonth() + 1; // 1-12
    
    let projectionMonth = 0;
    const maxMonths = 600; // 50 years maximum
    
    // Sort dynamic changes by effective date
    const sortedDynamicSpending = (data.dynamicSpending || [])
      .map(item => ({
        ...item,
        effectiveMonth: (item.year * 12) + (item.month - 1)
      }))
      .sort((a, b) => a.effectiveMonth - b.effectiveMonth);
    
    const sortedIncomeChanges = (data.incomeChanges || [])
      .map(item => ({
        ...item,
        effectiveMonth: (item.year * 12) + (item.month - 1)
      }))
      .sort((a, b) => a.effectiveMonth - b.effectiveMonth);
    
    const sortedLumpSums = (data.lumpSums || [])
      .map(item => ({
        ...item,
        effectiveMonth: (item.year * 12) + (item.month - 1)
      }))
      .sort((a, b) => a.effectiveMonth - b.effectiveMonth);
    
    // Track which adjustments have been applied
    let nextDynamicSpendingIndex = 0;
    let nextIncomeChangeIndex = 0;
    let nextLumpSumIndex = 0;
    
    // Calculate for each month
    while (projectionMonth < maxMonths && capital >= 0) {
      const currentYear = Math.floor(projectionMonth / 12);
      const currentMonthInYear = (projectionMonth % 12) + 1;
      const currentAge = data.currentAge + currentYear;
      
      // Calculate actual date
      const actualMonth = (startMonth + projectionMonth - 1) % 12 + 1;
      const actualYear = startYear + Math.floor((startMonth + projectionMonth - 1) / 12);
      const dateString = `${actualYear}-${String(actualMonth).padStart(2, '0')}`;
      
      // Apply dynamic spending adjustments
      while (
        nextDynamicSpendingIndex < sortedDynamicSpending.length &&
        sortedDynamicSpending[nextDynamicSpendingIndex].effectiveMonth === projectionMonth
      ) {
        const adjustment = sortedDynamicSpending[nextDynamicSpendingIndex];
        const percentageChange = adjustment.percentage / 100;
        
        if (data.spendingMode === 'itemized') {
          currentSpendingItems = currentSpendingItems.map(item => ({
            ...item,
            amount: item.amount * (1 + percentageChange)
          }));
        } else {
          currentTotalMonthlySpending *= (1 + percentageChange);
        }
        
        nextDynamicSpendingIndex++;
      }
      
      // Apply income changes
      while (
        nextIncomeChangeIndex < sortedIncomeChanges.length &&
        sortedIncomeChanges[nextIncomeChangeIndex].effectiveMonth === projectionMonth
      ) {
        const change = sortedIncomeChanges[nextIncomeChangeIndex];
        currentMonthlyIncome = change.amount;
        nextIncomeChangeIndex++;
      }
      
      // Apply lump sums
      let lumpSumThisMonth = 0;
      while (
        nextLumpSumIndex < sortedLumpSums.length &&
        sortedLumpSums[nextLumpSumIndex].effectiveMonth === projectionMonth
      ) {
        const lumpSum = sortedLumpSums[nextLumpSumIndex];
        lumpSumThisMonth += lumpSum.amount;
        nextLumpSumIndex++;
      }
      
      // Calculate total spending for this month
      let totalSpending = 0;
      if (data.spendingMode === 'itemized') {
        totalSpending = currentSpendingItems.reduce((sum, item) => sum + item.amount, 0);
      } else {
        totalSpending = currentTotalMonthlySpending;
      }
      
      // Apply annual inflation at the start of each year (except year 0)
      if (currentMonthInYear === 1 && currentYear > 0) {
        if (data.spendingMode === 'itemized') {
          currentSpendingItems = currentSpendingItems.map(item => ({
            ...item,
            amount: item.amount * (1 + annualInflationRatePercent)
          }));
        } else {
          currentTotalMonthlySpending *= (1 + annualInflationRatePercent);
        }
        
        // Recalculate total spending after inflation
        if (data.spendingMode === 'itemized') {
          totalSpending = currentSpendingItems.reduce((sum, item) => sum + item.amount, 0);
        } else {
          totalSpending = currentTotalMonthlySpending;
        }
      }
      
      // Calculate investment returns on current capital
      const investmentReturns = capital * monthlyInvestmentRate;
      
      // Calculate net cash flow
      const netCashFlow = currentMonthlyIncome - totalSpending + lumpSumThisMonth;
      
      // Update capital
      const capitalBeforeReturns = capital + netCashFlow;
      capital = capitalBeforeReturns + investmentReturns;
      
      // Store monthly result
      results.push({
        month: projectionMonth,
        year: currentYear,
        monthInYear: currentMonthInYear,
        date: dateString,
        age: currentAge,
        income: currentMonthlyIncome,
        spending: totalSpending,
        lumpSum: lumpSumThisMonth,
        netCashFlow: netCashFlow,
        investmentReturns: investmentReturns,
        capitalBeforeReturns: capitalBeforeReturns,
        capital: capital
      });
      
      projectionMonth++;
      
      // Stop if capital becomes negative
      if (capital < 0) {
        break;
      }
    }
    
    console.log(`✅ Projection complete: ${results.length} months calculated`);
    
    return {
      success: true,
      results: results,
      summary: calculateSummary(results, data)
    };
    
  } catch (error) {
    console.error('❌ Projection calculation error:', error);
    return {
      success: false,
      error: error.message,
      results: [],
      summary: null
    };
  }
}

/**
 * Calculate summary statistics
 * @param {Array} results - Monthly results
 * @param {Object} data - Input data
 * @returns {Object} Summary statistics
 */
function calculateSummary(results, data) {
  if (!results || results.length === 0) {
    return null;
  }
  
  const lastResult = results[results.length - 1];
  const totalMonths = results.length;
  const totalYears = Math.floor(totalMonths / 12);
  
  const totalIncome = results.reduce((sum, r) => sum + r.income, 0);
  const totalSpending = results.reduce((sum, r) => sum + r.spending, 0);
  const totalLumpSums = results.reduce((sum, r) => sum + r.lumpSum, 0);
  const totalInvestmentReturns = results.reduce((sum, r) => sum + r.investmentReturns, 0);
  
  const finalCapital = lastResult.capital;
  const finalAge = lastResult.age;
  
  // Find peak capital
  const peakCapital = Math.max(...results.map(r => r.capital));
  const peakCapitalMonth = results.find(r => r.capital === peakCapital);
  
  // Check if capital depleted
  const capitalDepleted = finalCapital <= 0;
  const depletionAge = capitalDepleted ? finalAge : null;
  
  // Calculate average monthly values
  const avgMonthlyIncome = totalIncome / totalMonths;
  const avgMonthlySpending = totalSpending / totalMonths;
  const avgMonthlyReturns = totalInvestmentReturns / totalMonths;
  
  return {
    totalMonths,
    totalYears,
    totalIncome,
    totalSpending,
    totalLumpSums,
    totalInvestmentReturns,
    finalCapital,
    finalAge,
    peakCapital,
    peakCapitalAge: peakCapitalMonth.age,
    peakCapitalDate: peakCapitalMonth.date,
    capitalDepleted,
    depletionAge,
    avgMonthlyIncome,
    avgMonthlySpending,
    avgMonthlyReturns,
    netGain: finalCapital - data.initialCapital,
    totalNetCashFlow: totalIncome + totalLumpSums - totalSpending
  };
}

/**
 * Export results to CSV format
 * @param {Array} results - Monthly results
 * @returns {string} CSV string
 */
export function exportToCSV(results) {
  if (!results || results.length === 0) {
    return '';
  }
  
  const headers = [
    'Month',
    'Year',
    'Date',
    'Age',
    'Income (MYR)',
    'Spending (MYR)',
    'Lump Sum (MYR)',
    'Net Cash Flow (MYR)',
    'Investment Returns (MYR)',
    'Capital (MYR)'
  ];
  
  const rows = results.map(r => [
    r.month,
    r.year,
    r.date,
    r.age,
    r.income.toFixed(2),
    r.spending.toFixed(2),
    r.lumpSum.toFixed(2),
    r.netCashFlow.toFixed(2),
    r.investmentReturns.toFixed(2),
    r.capital.toFixed(2)
  ]);
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');
  
  return csvContent;
}
