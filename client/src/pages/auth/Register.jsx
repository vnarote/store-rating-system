import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import useForm from '../../hooks/useForm';
import { ROLE_HOME } from '../../utils/constants';
import { getErrorMessage, getFieldErrors } from '../../utils/errors';
import { rules, validateForm } from '../../utils/validators';
import Alert from '../../components/common/Alert';
import Button from '../../components/common/Button';
import FormField from '../../components/common/FormField';

export default function Register() {
  const { user, register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const { values, errors, setErrors, handleChange } = useForm({ name: '', email: '', address: '', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  if (user) return <Navigate to={ROLE_HOME[user.role]} replace />;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setServerError('');
    const validation = validateForm(values, {
      name: rules.name,
      email: rules.email,
      address: rules.address,
      password: rules.password,
    });
    if (Object.keys(validation).length) return setErrors(validation);

    setSubmitting(true);
    try {
      const registered = await register({
        name: values.name.trim(),
        email: values.email.trim(),
        address: values.address.trim(),
        password: values.password,
      });
      toast.success('Account created successfully');
      navigate(ROLE_HOME[registered.role], { replace: true });
    } catch (error) {
      setErrors(getFieldErrors(error));
      setServerError(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <form onSubmit={handleSubmit} noValidate className="w-full max-w-md space-y-4 rounded-lg bg-white p-8 shadow">
        <div>
          <h1 className="text-2xl font-semibold">Create your account</h1>
          <p className="text-sm text-slate-500">Sign up to rate your favourite stores</p>
        </div>
        <Alert>{serverError}</Alert>
        <FormField label="Full name (20–60 characters)" name="name" value={values.name} onChange={handleChange} error={errors.name} />
        <FormField label="Email" name="email" type="email" autoComplete="email" value={values.email} onChange={handleChange} error={errors.email} />
        <FormField as="textarea" rows={3} label="Address" name="address" value={values.address} onChange={handleChange} error={errors.address} />
        <FormField label="Password (8–16 chars, 1 uppercase, 1 special)" name="password" type="password" autoComplete="new-password" value={values.password} onChange={handleChange} error={errors.password} />
        <Button type="submit" loading={submitting} className="w-full">
          Sign up
        </Button>
        <p className="text-center text-sm text-slate-500">
          Already registered?{' '}
          <Link to="/login" className="font-medium text-indigo-600 hover:underline">
            Log in
          </Link>
        </p>
      </form>
    </main>
  );
}
