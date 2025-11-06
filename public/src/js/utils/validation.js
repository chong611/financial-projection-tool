/**
 * Validation Utilities
 * Input validation and sanitization functions
 */

/**
 * Validate number input
 * @param {*} value - Value to validate
 * @param {Object} options - Validation options
 * @returns {Object} Validation result
 */
export function validateNumber(value, options = {}) {
  const {
    min = -Infinity,
    max = Infinity,
    required = false,
    allowZero = true,
    fieldName = 'Value'
  } = options;

  // Check if required
  if (required && (value === null || value === undefined || value === '')) {
    return { valid: false, error: `${fieldName} is required` };
  }

  // Allow empty if not required
  if (!required && (value === null || value === undefined || value === '')) {
    return { valid: true, value: null };
  }

  // Convert to number
  const numValue = Number(value);

  // Check if valid number
  if (isNaN(numValue)) {
    return { valid: false, error: `${fieldName} must be a valid number` };
  }

  // Check if zero is allowed
  if (!allowZero && numValue === 0) {
    return { valid: false, error: `${fieldName} cannot be zero` };
  }

  // Check min/max
  if (numValue < min) {
    return { valid: false, error: `${fieldName} must be at least ${min}` };
  }

  if (numValue > max) {
    return { valid: false, error: `${fieldName} must be at most ${max}` };
  }

  return { valid: true, value: numValue };
}

/**
 * Validate string input
 * @param {*} value - Value to validate
 * @param {Object} options - Validation options
 * @returns {Object} Validation result
 */
export function validateString(value, options = {}) {
  const {
    minLength = 0,
    maxLength = Infinity,
    required = false,
    pattern = null,
    fieldName = 'Value'
  } = options;

  // Check if required
  if (required && (!value || value.trim() === '')) {
    return { valid: false, error: `${fieldName} is required` };
  }

  // Allow empty if not required
  if (!required && (!value || value.trim() === '')) {
    return { valid: true, value: '' };
  }

  const strValue = String(value).trim();

  // Check length
  if (strValue.length < minLength) {
    return { valid: false, error: `${fieldName} must be at least ${minLength} characters` };
  }

  if (strValue.length > maxLength) {
    return { valid: false, error: `${fieldName} must be at most ${maxLength} characters` };
  }

  // Check pattern
  if (pattern && !pattern.test(strValue)) {
    return { valid: false, error: `${fieldName} format is invalid` };
  }

  return { valid: true, value: strValue };
}

/**
 * Validate date input
 * @param {*} value - Value to validate
 * @param {Object} options - Validation options
 * @returns {Object} Validation result
 */
export function validateDate(value, options = {}) {
  const {
    required = false,
    minDate = null,
    maxDate = null,
    fieldName = 'Date'
  } = options;

  // Check if required
  if (required && (!value || value === '')) {
    return { valid: false, error: `${fieldName} is required` };
  }

  // Allow empty if not required
  if (!required && (!value || value === '')) {
    return { valid: true, value: null };
  }

  // Parse date
  const dateValue = new Date(value);

  // Check if valid date
  if (isNaN(dateValue.getTime())) {
    return { valid: false, error: `${fieldName} is not a valid date` };
  }

  // Check min date
  if (minDate && dateValue < new Date(minDate)) {
    return { valid: false, error: `${fieldName} must be after ${minDate}` };
  }

  // Check max date
  if (maxDate && dateValue > new Date(maxDate)) {
    return { valid: false, error: `${fieldName} must be before ${maxDate}` };
  }

  return { valid: true, value: dateValue };
}

/**
 * Validate projection form data
 * @param {Object} formData - Form data to validate
 * @returns {Object} Validation result with errors array
 */
export function validateProjectionForm(formData) {
  const errors = [];

  // Validate projection name
  const nameValidation = validateString(formData.name, {
    required: true,
    minLength: 1,
    maxLength: 100,
    fieldName: 'Projection name'
  });
  if (!nameValidation.valid) errors.push(nameValidation.error);

  // Validate initial capital
  const capitalValidation = validateNumber(formData.initialCapital, {
    required: true,
    min: 0,
    fieldName: 'Initial capital'
  });
  if (!capitalValidation.valid) errors.push(capitalValidation.error);

  // Validate investment return
  const returnValidation = validateNumber(formData.avgYearlyInvestmentReturn, {
    required: true,
    min: -100,
    max: 1000,
    fieldName: 'Average yearly investment return'
  });
  if (!returnValidation.valid) errors.push(returnValidation.error);

  // Validate current age
  const ageValidation = validateNumber(formData.currentAge, {
    required: true,
    min: 0,
    max: 150,
    fieldName: 'Current age'
  });
  if (!ageValidation.valid) errors.push(ageValidation.error);

  // Validate inflation rate
  const inflationValidation = validateNumber(formData.annualInflationRate, {
    required: true,
    min: -100,
    max: 1000,
    fieldName: 'Annual inflation rate'
  });
  if (!inflationValidation.valid) errors.push(inflationValidation.error);

  // Validate start date
  const dateValidation = validateDate(formData.projectionStartDate, {
    required: true,
    fieldName: 'Projection start date'
  });
  if (!dateValidation.valid) errors.push(dateValidation.error);

  // Validate monthly income
  const incomeValidation = validateNumber(formData.initialMonthlyIncome, {
    required: true,
    min: 0,
    fieldName: 'Initial monthly income'
  });
  if (!incomeValidation.valid) errors.push(incomeValidation.error);

  // Validate spending based on mode
  if (formData.spendingMode === 'single') {
    const spendingValidation = validateNumber(formData.totalMonthlySpending, {
      required: true,
      min: 0,
      fieldName: 'Total monthly spending'
    });
    if (!spendingValidation.valid) errors.push(spendingValidation.error);
  } else if (formData.spendingMode === 'itemized') {
    if (!formData.itemizedSpending || formData.itemizedSpending.length === 0) {
      errors.push('At least one itemized spending category is required');
    } else {
      formData.itemizedSpending.forEach((item, index) => {
        if (!item.name || item.name.trim() === '') {
          errors.push(`Itemized spending category ${index + 1}: Name is required`);
        }
        const amountValidation = validateNumber(item.amount, {
          required: true,
          min: 0,
          fieldName: `Itemized spending category ${index + 1} amount`
        });
        if (!amountValidation.valid) errors.push(amountValidation.error);
      });
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
