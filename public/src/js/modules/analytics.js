/**
 * Advanced Analytics Module
 * GOD MODE: Advanced financial analysis and insights
 */

/**
 * Calculate advanced analytics from projection results
 * @param {Array} results - Projection results
 * @param {Object} inputData - Input parameters
 * @returns {Object} Advanced analytics
 */
export function calculateAdvancedAnalytics(results, inputData) {
  if (!results || results.length === 0) {
    return null;
  }
  
  const analytics = {
    breakEvenAnalysis: calculateBreakEvenPoint(results, inputData),
    retirementReadiness: calculateRetirementReadiness(results, inputData),
    riskAnalysis: calculateRiskMetrics(results, inputData),
    cashFlowAnalysis: analyzeCashFlow(results),
    milestones: identifyMilestones(results, inputData),
    recommendations: generateRecommendations(results, inputData)
  };
  
  return analytics;
}

/**
 * Calculate break-even point
 * @param {Array} results - Projection results
 * @param {Object} inputData - Input parameters
 * @returns {Object} Break-even analysis
 */
function calculateBreakEvenPoint(results, inputData) {
  const initialCapital = inputData.initialCapital;
  
  // Find when capital returns to initial amount after spending
  const breakEvenMonth = results.findIndex(r => 
    r.month > 0 && r.capital >= initialCapital && results[r.month - 1]?.capital < initialCapital
  );
  
  if (breakEvenMonth === -1) {
    return {
      achieved: false,
      message: 'Break-even not achieved within projection period'
    };
  }
  
  const breakEvenResult = results[breakEvenMonth];
  
  return {
    achieved: true,
    month: breakEvenMonth,
    year: breakEvenResult.year,
    age: breakEvenResult.age,
    date: breakEvenResult.date,
    message: `Break-even achieved at age ${breakEvenResult.age} (${breakEvenResult.date})`
  };
}

/**
 * Calculate retirement readiness score
 * @param {Array} results - Projection results
 * @param {Object} inputData - Input parameters
 * @returns {Object} Retirement readiness analysis
 */
function calculateRetirementReadiness(results, inputData) {
  const currentAge = inputData.currentAge;
  const retirementAge = 65; // Standard retirement age
  const lifeExpectancy = 85; // Average life expectancy
  
  const yearsToRetirement = Math.max(0, retirementAge - currentAge);
  const yearsInRetirement = lifeExpectancy - retirementAge;
  
  // Find capital at retirement age
  const retirementMonth = yearsToRetirement * 12;
  const retirementResult = results.find(r => r.month === retirementMonth);
  
  if (!retirementResult) {
    return {
      ready: false,
      score: 0,
      message: 'Insufficient data to calculate retirement readiness'
    };
  }
  
  const retirementCapital = retirementResult.capital;
  const avgMonthlySpending = results.slice(0, Math.min(120, results.length))
    .reduce((sum, r) => sum + r.spending, 0) / Math.min(120, results.length);
  
  const requiredRetirementCapital = avgMonthlySpending * 12 * yearsInRetirement;
  const readinessRatio = retirementCapital / requiredRetirementCapital;
  
  // Calculate score (0-100)
  const score = Math.min(100, Math.round(readinessRatio * 100));
  
  let rating = 'Poor';
  let color = 'red';
  if (score >= 80) {
    rating = 'Excellent';
    color = 'green';
  } else if (score >= 60) {
    rating = 'Good';
    color = 'blue';
  } else if (score >= 40) {
    rating = 'Fair';
    color = 'yellow';
  }
  
  return {
    ready: score >= 60,
    score: score,
    rating: rating,
    color: color,
    retirementAge: retirementAge,
    retirementCapital: retirementCapital,
    requiredCapital: requiredRetirementCapital,
    surplus: retirementCapital - requiredRetirementCapital,
    yearsToRetirement: yearsToRetirement,
    message: `Retirement readiness: ${rating} (${score}/100)`
  };
}

/**
 * Calculate risk metrics
 * @param {Array} results - Projection results
 * @param {Object} inputData - Input parameters
 * @returns {Object} Risk analysis
 */
function calculateRiskMetrics(results, inputData) {
  // Calculate volatility of capital
  const capitalValues = results.map(r => r.capital);
  const avgCapital = capitalValues.reduce((a, b) => a + b, 0) / capitalValues.length;
  const variance = capitalValues.reduce((sum, val) => sum + Math.pow(val - avgCapital, 2), 0) / capitalValues.length;
  const volatility = Math.sqrt(variance);
  const volatilityPercent = (volatility / avgCapital) * 100;
  
  // Calculate months with negative cash flow
  const negativeMonths = results.filter(r => r.netCashFlow < 0).length;
  const negativeMonthsPercent = (negativeMonths / results.length) * 100;
  
  // Calculate capital depletion risk
  const minCapital = Math.min(...capitalValues);
  const depletionRisk = minCapital <= 0 ? 100 : Math.max(0, 100 - (minCapital / inputData.initialCapital * 100));
  
  // Overall risk score (0-100, higher is riskier)
  const riskScore = Math.min(100, Math.round(
    (volatilityPercent * 0.3) + 
    (negativeMonthsPercent * 0.3) + 
    (depletionRisk * 0.4)
  ));
  
  let riskLevel = 'Low';
  let color = 'green';
  if (riskScore >= 70) {
    riskLevel = 'High';
    color = 'red';
  } else if (riskScore >= 40) {
    riskLevel = 'Medium';
    color = 'yellow';
  }
  
  return {
    riskScore: riskScore,
    riskLevel: riskLevel,
    color: color,
    volatility: volatility,
    volatilityPercent: volatilityPercent,
    negativeMonths: negativeMonths,
    negativeMonthsPercent: negativeMonthsPercent,
    minCapital: minCapital,
    depletionRisk: depletionRisk,
    message: `Risk level: ${riskLevel} (${riskScore}/100)`
  };
}

/**
 * Analyze cash flow patterns
 * @param {Array} results - Projection results
 * @returns {Object} Cash flow analysis
 */
function analyzeCashFlow(results) {
  const totalIncome = results.reduce((sum, r) => sum + r.income, 0);
  const totalSpending = results.reduce((sum, r) => sum + r.spending, 0);
  const totalLumpSums = results.reduce((sum, r) => sum + r.lumpSum, 0);
  const totalReturns = results.reduce((sum, r) => sum + r.investmentReturns, 0);
  
  const avgMonthlyIncome = totalIncome / results.length;
  const avgMonthlySpending = totalSpending / results.length;
  const avgMonthlyReturns = totalReturns / results.length;
  
  const savingsRate = ((avgMonthlyIncome - avgMonthlySpending) / avgMonthlyIncome) * 100;
  
  // Find longest streak of positive/negative cash flow
  let currentStreak = 0;
  let maxPositiveStreak = 0;
  let maxNegativeStreak = 0;
  let isPositive = results[0]?.netCashFlow >= 0;
  
  results.forEach(r => {
    if ((r.netCashFlow >= 0) === isPositive) {
      currentStreak++;
    } else {
      if (isPositive) {
        maxPositiveStreak = Math.max(maxPositiveStreak, currentStreak);
      } else {
        maxNegativeStreak = Math.max(maxNegativeStreak, currentStreak);
      }
      currentStreak = 1;
      isPositive = !isPositive;
    }
  });
  
  return {
    totalIncome,
    totalSpending,
    totalLumpSums,
    totalReturns,
    avgMonthlyIncome,
    avgMonthlySpending,
    avgMonthlyReturns,
    savingsRate,
    maxPositiveStreak,
    maxNegativeStreak,
    netCashFlow: totalIncome + totalLumpSums - totalSpending
  };
}

/**
 * Identify financial milestones
 * @param {Array} results - Projection results
 * @param {Object} inputData - Input parameters
 * @returns {Array} Milestones
 */
function identifyMilestones(results, inputData) {
  const milestones = [];
  
  // First million milestone
  const firstMillionMonth = results.findIndex(r => r.capital >= 1000000);
  if (firstMillionMonth !== -1) {
    const result = results[firstMillionMonth];
    milestones.push({
      type: 'First Million',
      month: firstMillionMonth,
      age: result.age,
      date: result.date,
      value: result.capital,
      icon: '🎯'
    });
  }
  
  // Double initial capital
  const doubleCapitalMonth = results.findIndex(r => r.capital >= inputData.initialCapital * 2);
  if (doubleCapitalMonth !== -1) {
    const result = results[doubleCapitalMonth];
    milestones.push({
      type: 'Double Initial Capital',
      month: doubleCapitalMonth,
      age: result.age,
      date: result.date,
      value: result.capital,
      icon: '💰'
    });
  }
  
  // Peak capital
  const peakCapital = Math.max(...results.map(r => r.capital));
  const peakMonth = results.findIndex(r => r.capital === peakCapital);
  if (peakMonth !== -1) {
    const result = results[peakMonth];
    milestones.push({
      type: 'Peak Capital',
      month: peakMonth,
      age: result.age,
      date: result.date,
      value: result.capital,
      icon: '📈'
    });
  }
  
  // Retirement age (65)
  const retirementMonth = results.findIndex(r => r.age >= 65);
  if (retirementMonth !== -1) {
    const result = results[retirementMonth];
    milestones.push({
      type: 'Retirement Age (65)',
      month: retirementMonth,
      age: result.age,
      date: result.date,
      value: result.capital,
      icon: '🏖️'
    });
  }
  
  return milestones.sort((a, b) => a.month - b.month);
}

/**
 * Generate personalized recommendations
 * @param {Array} results - Projection results
 * @param {Object} inputData - Input parameters
 * @returns {Array} Recommendations
 */
function generateRecommendations(results, inputData) {
  const recommendations = [];
  const lastResult = results[results.length - 1];
  const riskMetrics = calculateRiskMetrics(results, inputData);
  const cashFlow = analyzeCashFlow(results);
  
  // Check if capital depletes
  if (lastResult.capital <= 0) {
    recommendations.push({
      priority: 'high',
      category: 'Capital Depletion',
      message: 'Your capital is projected to deplete. Consider reducing spending or increasing income.',
      action: 'Reduce monthly spending by 10-20% or find additional income sources.',
      icon: '⚠️'
    });
  }
  
  // Check savings rate
  if (cashFlow.savingsRate < 10) {
    recommendations.push({
      priority: 'medium',
      category: 'Low Savings Rate',
      message: `Your savings rate is ${cashFlow.savingsRate.toFixed(1)}%, which is below recommended 10-20%.`,
      action: 'Try to increase your savings rate by reducing discretionary spending.',
      icon: '💡'
    });
  }
  
  // Check investment returns
  if (inputData.avgYearlyInvestmentReturn < 5) {
    recommendations.push({
      priority: 'medium',
      category: 'Investment Returns',
      message: 'Your expected investment return is conservative. Consider diversifying your portfolio.',
      action: 'Review your investment strategy with a financial advisor.',
      icon: '📊'
    });
  }
  
  // Check inflation protection
  if (inputData.annualInflationRate > inputData.avgYearlyInvestmentReturn) {
    recommendations.push({
      priority: 'high',
      category: 'Inflation Risk',
      message: 'Your investment returns are not keeping pace with inflation.',
      action: 'Seek investments with returns above inflation rate to preserve purchasing power.',
      icon: '📉'
    });
  }
  
  // Positive feedback
  if (lastResult.capital > inputData.initialCapital * 2 && riskMetrics.riskLevel === 'Low') {
    recommendations.push({
      priority: 'low',
      category: 'Great Progress',
      message: 'Your financial projection looks excellent! You\'re on track to more than double your capital.',
      action: 'Continue with your current strategy and review periodically.',
      icon: '✅'
    });
  }
  
  return recommendations;
}

/**
 * Calculate scenario comparison
 * @param {Array} scenarios - Array of projection results
 * @returns {Object} Comparison analysis
 */
export function compareScenarios(scenarios) {
  if (!scenarios || scenarios.length < 2) {
    return null;
  }
  
  const comparison = {
    scenarios: scenarios.map((scenario, index) => {
      const lastResult = scenario.results[scenario.results.length - 1];
      const analytics = calculateAdvancedAnalytics(scenario.results, scenario.inputData);
      
      return {
        name: scenario.name || `Scenario ${index + 1}`,
        finalCapital: lastResult.capital,
        finalAge: lastResult.age,
        totalMonths: scenario.results.length,
        retirementReadiness: analytics.retirementReadiness.score,
        riskScore: analytics.riskAnalysis.riskScore,
        savingsRate: analytics.cashFlowAnalysis.savingsRate
      };
    })
  };
  
  // Find best scenario
  const bestByCapital = comparison.scenarios.reduce((best, current) => 
    current.finalCapital > best.finalCapital ? current : best
  );
  
  const bestByRetirement = comparison.scenarios.reduce((best, current) => 
    current.retirementReadiness > best.retirementReadiness ? current : best
  );
  
  const bestByRisk = comparison.scenarios.reduce((best, current) => 
    current.riskScore < best.riskScore ? current : best
  );
  
  comparison.recommendations = {
    bestByCapital: bestByCapital.name,
    bestByRetirement: bestByRetirement.name,
    bestByRisk: bestByRisk.name
  };
  
  return comparison;
}
