/**
 * Export Module
 * GOD MODE: Multiple export formats (CSV, PDF, Excel, JSON)
 */

import { formatCurrency, formatDate, downloadFile, arrayToCSV } from '../utils/helpers.js';

/**
 * Export results to CSV
 * @param {Array} results - Projection results
 * @param {string} filename - File name
 */
export function exportToCSV(results, filename = 'projection.csv') {
  if (!results || results.length === 0) {
    throw new Error('No results to export');
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
  
  downloadFile(csvContent, filename, 'text/csv');
  console.log('📥 CSV exported:', filename);
}

/**
 * Export results to JSON
 * @param {Object} data - Complete projection data
 * @param {string} filename - File name
 */
export function exportToJSON(data, filename = 'projection.json') {
  if (!data) {
    throw new Error('No data to export');
  }
  
  const jsonContent = JSON.stringify(data, null, 2);
  downloadFile(jsonContent, filename, 'application/json');
  console.log('📥 JSON exported:', filename);
}

/**
 * Export results to Excel-compatible format
 * @param {Array} results - Projection results
 * @param {Object} summary - Summary data
 * @param {string} filename - File name
 */
export function exportToExcel(results, summary, filename = 'projection.xlsx') {
  // Create Excel-compatible HTML table
  let html = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel">
    <head>
      <meta charset="UTF-8">
      <style>
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #4CAF50; color: white; font-weight: bold; }
        .summary { background-color: #f2f2f2; font-weight: bold; }
        .number { text-align: right; }
      </style>
    </head>
    <body>
      <h1>Financial Projection Report</h1>
      <p>Generated: ${new Date().toLocaleString()}</p>
      
      <h2>Summary</h2>
      <table>
        <tr><td class="summary">Total Months</td><td class="number">${summary.totalMonths}</td></tr>
        <tr><td class="summary">Total Years</td><td class="number">${summary.totalYears}</td></tr>
        <tr><td class="summary">Final Capital</td><td class="number">${formatCurrency(summary.finalCapital)}</td></tr>
        <tr><td class="summary">Final Age</td><td class="number">${summary.finalAge}</td></tr>
        <tr><td class="summary">Total Income</td><td class="number">${formatCurrency(summary.totalIncome)}</td></tr>
        <tr><td class="summary">Total Spending</td><td class="number">${formatCurrency(summary.totalSpending)}</td></tr>
        <tr><td class="summary">Total Investment Returns</td><td class="number">${formatCurrency(summary.totalInvestmentReturns)}</td></tr>
      </table>
      
      <h2>Monthly Breakdown</h2>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Age</th>
            <th>Income</th>
            <th>Spending</th>
            <th>Lump Sum</th>
            <th>Net Cash Flow</th>
            <th>Investment Returns</th>
            <th>Capital</th>
          </tr>
        </thead>
        <tbody>
  `;
  
  results.forEach(r => {
    html += `
      <tr>
        <td>${r.date}</td>
        <td class="number">${r.age}</td>
        <td class="number">${r.income.toFixed(2)}</td>
        <td class="number">${r.spending.toFixed(2)}</td>
        <td class="number">${r.lumpSum.toFixed(2)}</td>
        <td class="number">${r.netCashFlow.toFixed(2)}</td>
        <td class="number">${r.investmentReturns.toFixed(2)}</td>
        <td class="number">${r.capital.toFixed(2)}</td>
      </tr>
    `;
  });
  
  html += `
        </tbody>
      </table>
    </body>
    </html>
  `;
  
  // Convert to Excel format
  const blob = new Blob([html], { type: 'application/vnd.ms-excel' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  
  console.log('📥 Excel exported:', filename);
}

/**
 * Generate PDF report (using browser print)
 * @param {Object} data - Complete projection data
 */
export function exportToPDF(data) {
  // Create a print-friendly view
  const printWindow = window.open('', '_blank');
  
  if (!printWindow) {
    throw new Error('Popup blocked. Please allow popups for PDF export.');
  }
  
  const { results, summary, inputData, analytics } = data;
  
  let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Financial Projection Report</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 20px;
          color: #333;
        }
        h1 { color: #2563eb; border-bottom: 3px solid #2563eb; padding-bottom: 10px; }
        h2 { color: #1e40af; margin-top: 30px; }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 20px 0;
        }
        th, td {
          border: 1px solid #ddd;
          padding: 8px;
          text-align: left;
        }
        th {
          background-color: #2563eb;
          color: white;
        }
        .summary-box {
          background: #eff6ff;
          border-left: 4px solid #2563eb;
          padding: 15px;
          margin: 20px 0;
        }
        .metric {
          display: inline-block;
          margin: 10px 20px 10px 0;
        }
        .metric-label {
          font-weight: bold;
          color: #1e40af;
        }
        .number { text-align: right; }
        .positive { color: #059669; }
        .negative { color: #dc2626; }
        @media print {
          body { margin: 0; }
          .page-break { page-break-after: always; }
        }
      </style>
    </head>
    <body>
      <h1>💰 Financial Projection Report</h1>
      <p><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
      <p><strong>Projection Name:</strong> ${inputData.name}</p>
      
      <div class="summary-box">
        <h2>Executive Summary</h2>
        <div class="metric">
          <span class="metric-label">Final Capital:</span> ${formatCurrency(summary.finalCapital)}
        </div>
        <div class="metric">
          <span class="metric-label">Final Age:</span> ${summary.finalAge}
        </div>
        <div class="metric">
          <span class="metric-label">Projection Period:</span> ${summary.totalYears} years (${summary.totalMonths} months)
        </div>
        <div class="metric">
          <span class="metric-label">Net Gain:</span> ${formatCurrency(summary.netGain)}
        </div>
      </div>
      
      <h2>Input Parameters</h2>
      <table>
        <tr><td><strong>Initial Capital</strong></td><td class="number">${formatCurrency(inputData.initialCapital)}</td></tr>
        <tr><td><strong>Current Age</strong></td><td class="number">${inputData.currentAge}</td></tr>
        <tr><td><strong>Investment Return</strong></td><td class="number">${inputData.avgYearlyInvestmentReturn}%</td></tr>
        <tr><td><strong>Inflation Rate</strong></td><td class="number">${inputData.annualInflationRate}%</td></tr>
        <tr><td><strong>Initial Monthly Income</strong></td><td class="number">${formatCurrency(inputData.initialMonthlyIncome)}</td></tr>
        <tr><td><strong>Monthly Spending</strong></td><td class="number">${formatCurrency(inputData.totalMonthlySpending || 0)}</td></tr>
      </table>
  `;
  
  if (analytics) {
    html += `
      <div class="page-break"></div>
      <h2>Advanced Analytics</h2>
      
      <h3>Retirement Readiness</h3>
      <div class="summary-box">
        <p><strong>Score:</strong> ${analytics.retirementReadiness.score}/100 (${analytics.retirementReadiness.rating})</p>
        <p><strong>Retirement Capital:</strong> ${formatCurrency(analytics.retirementReadiness.retirementCapital)}</p>
        <p><strong>Required Capital:</strong> ${formatCurrency(analytics.retirementReadiness.requiredCapital)}</p>
        <p><strong>Surplus/Deficit:</strong> ${formatCurrency(analytics.retirementReadiness.surplus)}</p>
      </div>
      
      <h3>Risk Analysis</h3>
      <div class="summary-box">
        <p><strong>Risk Level:</strong> ${analytics.riskAnalysis.riskLevel} (${analytics.riskAnalysis.riskScore}/100)</p>
        <p><strong>Volatility:</strong> ${analytics.riskAnalysis.volatilityPercent.toFixed(2)}%</p>
        <p><strong>Negative Cash Flow Months:</strong> ${analytics.riskAnalysis.negativeMonths} (${analytics.riskAnalysis.negativeMonthsPercent.toFixed(1)}%)</p>
      </div>
    `;
    
    if (analytics.recommendations && analytics.recommendations.length > 0) {
      html += `
        <h3>Recommendations</h3>
        <ul>
      `;
      analytics.recommendations.forEach(rec => {
        html += `<li><strong>${rec.category}:</strong> ${rec.message} <em>${rec.action}</em></li>`;
      });
      html += `</ul>`;
    }
  }
  
  html += `
      <div class="page-break"></div>
      <h2>Financial Summary</h2>
      <table>
        <tr><td><strong>Total Income</strong></td><td class="number positive">${formatCurrency(summary.totalIncome)}</td></tr>
        <tr><td><strong>Total Spending</strong></td><td class="number negative">${formatCurrency(summary.totalSpending)}</td></tr>
        <tr><td><strong>Total Lump Sums</strong></td><td class="number positive">${formatCurrency(summary.totalLumpSums)}</td></tr>
        <tr><td><strong>Total Investment Returns</strong></td><td class="number positive">${formatCurrency(summary.totalInvestmentReturns)}</td></tr>
        <tr><td><strong>Peak Capital</strong></td><td class="number">${formatCurrency(summary.peakCapital)}</td></tr>
        <tr><td><strong>Peak Capital Age</strong></td><td class="number">${summary.peakCapitalAge}</td></tr>
      </table>
      
      <div class="page-break"></div>
      <h2>Monthly Projection (Sample)</h2>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Age</th>
            <th class="number">Income</th>
            <th class="number">Spending</th>
            <th class="number">Net Cash Flow</th>
            <th class="number">Capital</th>
          </tr>
        </thead>
        <tbody>
  `;
  
  // Sample every 12 months for PDF
  const sampledResults = results.filter((_, index) => index % 12 === 0);
  sampledResults.forEach(r => {
    html += `
      <tr>
        <td>${r.date}</td>
        <td class="number">${r.age}</td>
        <td class="number">${formatCurrency(r.income)}</td>
        <td class="number">${formatCurrency(r.spending)}</td>
        <td class="number ${r.netCashFlow >= 0 ? 'positive' : 'negative'}">${formatCurrency(r.netCashFlow)}</td>
        <td class="number">${formatCurrency(r.capital)}</td>
      </tr>
    `;
  });
  
  html += `
        </tbody>
      </table>
      
      <p style="margin-top: 50px; text-align: center; color: #666; font-size: 12px;">
        Generated by Financial Projection Tool | ${new Date().toLocaleDateString()}
      </p>
    </body>
    </html>
  `;
  
  printWindow.document.write(html);
  printWindow.document.close();
  
  // Trigger print dialog
  printWindow.onload = function() {
    printWindow.print();
  };
  
  console.log('📄 PDF export initiated');
}

/**
 * Export chart as image
 * @param {HTMLCanvasElement} canvas - Chart canvas
 * @param {string} filename - File name
 */
export function exportChartAsImage(canvas, filename = 'chart.png') {
  if (!canvas) {
    throw new Error('Canvas not found');
  }
  
  canvas.toBlob((blob) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    console.log('🖼️ Chart image exported:', filename);
  });
}
