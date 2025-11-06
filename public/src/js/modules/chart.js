/**
 * Chart Module
 * Handles Chart.js visualization
 */

let chartInstance = null;

/**
 * Create or update projection chart
 * @param {HTMLCanvasElement} canvas - Canvas element for chart
 * @param {Array} results - Projection results
 * @param {Object} options - Chart options
 */
export function renderChart(canvas, results, options = {}) {
  if (!canvas || !results || results.length === 0) {
    console.warn('Cannot render chart: missing canvas or results');
    return;
  }
  
  try {
    // Destroy existing chart
    if (chartInstance) {
      chartInstance.destroy();
      chartInstance = null;
    }
    
    // Sample data for better performance (show every nth point for large datasets)
    const sampleRate = results.length > 600 ? Math.ceil(results.length / 600) : 1;
    const sampledResults = results.filter((_, index) => index % sampleRate === 0);
    
    // Prepare data
    const labels = sampledResults.map(r => r.date);
    const capitalData = sampledResults.map(r => r.capital);
    const incomeData = sampledResults.map(r => r.income);
    const spendingData = sampledResults.map(r => r.spending);
    
    // Get theme colors
    const isDarkMode = document.documentElement.classList.contains('dark');
    const textColor = isDarkMode ? '#e5e7eb' : '#374151';
    const gridColor = isDarkMode ? '#374151' : '#e5e7eb';
    
    // Create chart
    const ctx = canvas.getContext('2d');
    chartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Capital (MYR)',
            data: capitalData,
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            borderWidth: 2,
            fill: true,
            tension: 0.4,
            yAxisID: 'y'
          },
          {
            label: 'Monthly Income (MYR)',
            data: incomeData,
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            borderWidth: 2,
            fill: false,
            tension: 0.4,
            yAxisID: 'y1'
          },
          {
            label: 'Monthly Spending (MYR)',
            data: spendingData,
            borderColor: '#ef4444',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            borderWidth: 2,
            fill: false,
            tension: 0.4,
            yAxisID: 'y1'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false
        },
        plugins: {
          title: {
            display: true,
            text: options.title || 'Financial Projection Over Time',
            color: textColor,
            font: {
              size: 16,
              weight: 'bold'
            }
          },
          legend: {
            display: true,
            position: 'top',
            labels: {
              color: textColor,
              usePointStyle: true,
              padding: 15
            }
          },
          tooltip: {
            backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
            titleColor: textColor,
            bodyColor: textColor,
            borderColor: gridColor,
            borderWidth: 1,
            padding: 12,
            displayColors: true,
            callbacks: {
              label: function(context) {
                let label = context.dataset.label || '';
                if (label) {
                  label += ': ';
                }
                label += 'MYR ' + context.parsed.y.toLocaleString('en-MY', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                });
                return label;
              }
            }
          }
        },
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              text: 'Date',
              color: textColor
            },
            ticks: {
              color: textColor,
              maxTicksLimit: 12,
              maxRotation: 45,
              minRotation: 45
            },
            grid: {
              color: gridColor,
              drawBorder: false
            }
          },
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            title: {
              display: true,
              text: 'Capital (MYR)',
              color: textColor
            },
            ticks: {
              color: textColor,
              callback: function(value) {
                return 'MYR ' + value.toLocaleString('en-MY');
              }
            },
            grid: {
              color: gridColor,
              drawBorder: false
            }
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            title: {
              display: true,
              text: 'Monthly Cash Flow (MYR)',
              color: textColor
            },
            ticks: {
              color: textColor,
              callback: function(value) {
                return 'MYR ' + value.toLocaleString('en-MY');
              }
            },
            grid: {
              drawOnChartArea: false,
              color: gridColor,
              drawBorder: false
            }
          }
        }
      }
    });
    
    console.log('✅ Chart rendered successfully');
    
  } catch (error) {
    console.error('❌ Chart rendering error:', error);
    throw new Error(`Failed to render chart: ${error.message}`);
  }
}

/**
 * Destroy chart instance
 */
export function destroyChart() {
  if (chartInstance) {
    chartInstance.destroy();
    chartInstance = null;
    console.log('🗑️ Chart destroyed');
  }
}

/**
 * Update chart theme
 * @param {boolean} isDarkMode - Dark mode state
 */
export function updateChartTheme(isDarkMode) {
  if (!chartInstance) return;
  
  const textColor = isDarkMode ? '#e5e7eb' : '#374151';
  const gridColor = isDarkMode ? '#374151' : '#e5e7eb';
  
  // Update colors
  chartInstance.options.plugins.title.color = textColor;
  chartInstance.options.plugins.legend.labels.color = textColor;
  chartInstance.options.plugins.tooltip.backgroundColor = isDarkMode ? '#1f2937' : '#ffffff';
  chartInstance.options.plugins.tooltip.titleColor = textColor;
  chartInstance.options.plugins.tooltip.bodyColor = textColor;
  chartInstance.options.plugins.tooltip.borderColor = gridColor;
  
  chartInstance.options.scales.x.title.color = textColor;
  chartInstance.options.scales.x.ticks.color = textColor;
  chartInstance.options.scales.x.grid.color = gridColor;
  
  chartInstance.options.scales.y.title.color = textColor;
  chartInstance.options.scales.y.ticks.color = textColor;
  chartInstance.options.scales.y.grid.color = gridColor;
  
  chartInstance.options.scales.y1.title.color = textColor;
  chartInstance.options.scales.y1.ticks.color = textColor;
  chartInstance.options.scales.y1.grid.color = gridColor;
  
  chartInstance.update();
  
  console.log('🎨 Chart theme updated');
}

/**
 * Get chart instance
 * @returns {Object|null} Chart instance
 */
export function getChartInstance() {
  return chartInstance;
}
