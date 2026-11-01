import { useState } from 'react';
import Button from './Button';
import FormField from './FormField';

// Generic filter bar. fields: [{ name, label, type?: 'text' | 'select', options?: [{ value, label }] }]
export default function SearchBar({ fields, onSearch }) {
  const [values, setValues] = useState({});

  const handleChange = (event) =>
    setValues((current) => ({ ...current, [event.target.name]: event.target.value }));

  const handleSubmit = (event) => {
    event.preventDefault();
    onSearch(values);
  };

  const handleReset = () => {
    setValues({});
    onSearch({});
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 rounded-lg border border-slate-200 bg-white p-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {fields.map((field) =>
          field.type === 'select' ? (
            <FormField key={field.name} as="select" label={field.label} name={field.name} value={values[field.name] || ''} onChange={handleChange}>
              <option value="">All</option>
              {field.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </FormField>
          ) : (
            <FormField key={field.name} label={field.label} name={field.name} value={values[field.name] || ''} onChange={handleChange} placeholder={`Search by ${field.label.toLowerCase()}`} />
          ),
        )}
      </div>
      <div className="mt-3 flex gap-2">
        <Button type="submit">Search</Button>
        <Button variant="secondary" onClick={handleReset}>
          Reset
        </Button>
      </div>
    </form>
  );
}
