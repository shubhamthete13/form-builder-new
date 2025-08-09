import type { ValidationRule } from '../types';

export function validateValue(
  value: any,
  validation?: ValidationRule,
  required?: boolean
) {
  if (required && (value === undefined || value === null || value === ''))
    return { valid: false, message: 'This field is required' };

  if (!validation) return { valid: true };

  if (validation.notEmpty && (value === '' || value == null))
    return { valid: false, message: 'Cannot be empty' };

  if (validation.minLength && String(value).length < validation.minLength)
    return { valid: false, message: `Minimum length ${validation.minLength}` };

  if (validation.maxLength && String(value).length > validation.maxLength)
    return { valid: false, message: `Maximum length ${validation.maxLength}` };

  if (validation.email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(String(value)))
      return { valid: false, message: 'Invalid email address' };
  }

  if (validation.passwordRule) {
    const { minLen, requireNumber } = validation.passwordRule;
    if (String(value).length < minLen)
      return { valid: false, message: `Password must be at least ${minLen} characters` };
    if (requireNumber && !/\d/.test(String(value)))
      return { valid: false, message: 'Password must include a number' };
  }

  return { valid: true };
}
