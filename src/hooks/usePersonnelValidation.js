import { useState, useCallback } from "react";
import {
  validateField,
  validatePersonnelForm,
  hasFormErrors,
  VALIDATION_PATTERNS,
} from "../utils/validation/personnelValidation";

/**
 * Custom hook for personnel form validation
 * @returns {Object} Validation state and methods
 */
export const usePersonnelValidation = () => {
  const [errors, setErrors] = useState({});

  /**
   * Validate a single field and update errors
   */
  const validateSingleField = useCallback((fieldName, value) => {
    const error = validateField(fieldName, value);
    setErrors((prev) => ({ ...prev, [fieldName]: error }));
    return error;
  }, []);

  /**
   * Validate all fields in the form
   */
  const validateAllFields = useCallback((formData) => {
    const newErrors = validatePersonnelForm(formData);
    setErrors(newErrors);
    return !hasFormErrors(newErrors);
  }, []);

  /**
   * Clear all errors
   */
  const clearErrors = useCallback(() => {
    setErrors({});
  }, []);

  /**
   * Clear error for a specific field
   */
  const clearFieldError = useCallback((fieldName) => {
    setErrors((prev) => ({ ...prev, [fieldName]: "" }));
  }, []);

  /**
   * Check if input should be allowed (for numeric fields)
   */
  const shouldAllowInput = useCallback((fieldName, value) => {
    if (fieldName === "teacherId" || fieldName === "phoneNumber") {
      return !value || VALIDATION_PATTERNS.digitsOnly.test(value);
    }
    return true;
  }, []);

  /**
   * Handle input change with validation
   */
  const handleInputChange = useCallback((fieldName, value, callback) => {
    // Check if input is allowed
    if (!shouldAllowInput(fieldName, value)) {
      return false;
    }

    // Update form data via callback
    if (callback) {
      callback(fieldName, value);
    }

    // Validate field
    validateSingleField(fieldName, value);
    return true;
  }, [shouldAllowInput, validateSingleField]);

  return {
    errors,
    validateSingleField,
    validateAllFields,
    clearErrors,
    clearFieldError,
    shouldAllowInput,
    handleInputChange,
    hasErrors: hasFormErrors(errors),
  };
};

export default usePersonnelValidation;
