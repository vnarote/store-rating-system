// Mirrors the server-side rules so users get instant feedback. The API remains the authority.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const rules = {
  name: (value) => {
    const length = value.trim().length;
    if (!length) return 'Name is required';
    if (length < 20 || length > 60) return 'Name must be between 20 and 60 characters';
    return '';
  },
  email: (value) => {
    if (!value.trim()) return 'Email is required';
    return EMAIL_PATTERN.test(value.trim()) ? '' : 'Enter a valid email address';
  },
  password: (value) => {
    if (!value) return 'Password is required';
    if (value.length < 8 || value.length > 16) return 'Password must be between 8 and 16 characters';
    if (!/[A-Z]/.test(value)) return 'Password must contain at least one uppercase letter';
    if (!/[^A-Za-z0-9]/.test(value)) return 'Password must contain at least one special character';
    return '';
  },
  address: (value) => (value.length > 400 ? 'Address must be at most 400 characters' : ''),
  requiredAddress: (value) => {
    if (!value.trim()) return 'Address is required';
    return value.length > 400 ? 'Address must be at most 400 characters' : '';
  },
  required: (label) => (value) => (value ? '' : `${label} is required`),
};

// schema: { field: (value, allValues) => errorMessage }
export const validateForm = (values, schema) =>
  Object.entries(schema).reduce((errors, [field, check]) => {
    const message = check(values[field] ?? '', values);
    if (message) errors[field] = message;
    return errors;
  }, {});
