interface TimeValidationResult {
  isValid: boolean;
  error?: string;
}

interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export const validateTimeRange = (
  startTime: Date | null,
  endTime: Date | null,
): TimeValidationResult => {
  if (!startTime || !endTime) {
    return {isValid: true};
  }

  if (startTime > endTime) {
    return {
      isValid: false,
      error: 'Start time cannot be after end time',
    };
  }

  return {isValid: true};
};

export const validateRequiredFields = (
  fields: Record<string, any>,
  requiredFields: string[],
): ValidationResult => {
  const errors: Record<string, string> = {};

  requiredFields.forEach(field => {
    if (
      !fields[field] ||
      (typeof fields[field] === 'string' && !fields[field].trim())
    ) {
      errors[field] = `${
        field.charAt(0).toUpperCase() + field.slice(1)
      } is required`;
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
