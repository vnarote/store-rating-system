export const getErrorMessage = (error) =>
  error.response?.data?.message || error.message || 'Something went wrong';

// Maps the API's [{ field, message }] validation errors to { field: message }.
export const getFieldErrors = (error) => {
  const list = error.response?.data?.errors;
  if (!Array.isArray(list)) return {};
  return list.reduce((acc, item) => {
    if (item.field) acc[item.field] = item.message;
    return acc;
  }, {});
};
