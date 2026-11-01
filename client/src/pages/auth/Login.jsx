import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import useForm from '../../hooks/useForm';
import { ROLE_HOME } from '../../utils/constants';
import { getErrorMessage } from '../../utils/errors';
import { rules, validateForm } from '../../utils/validators';
import Alert from '../../components/common/Alert';
import Button from '../../components/common/Button';
import FormField from '../../components/common/FormField';

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { values, errors, setErrors, handleChange } = useForm({ email: '', password: '' });
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  if (user) return <Navigate to={ROLE_HOME[user.role]} replace />;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setServerError('');
    const validation = validateForm(values, { email: rules.email, password: rules.required('Password') });
    if (Object.keys(validation).length) return setErrors(validation);

    setSubmitting(true);
    try {
      const loggedIn = await login({ email: values.email.trim(), password: values.password });
      navigate(location.state?.from?.pathname || ROLE_HOME[loggedIn.role], { replace: true });
    } catch (error) {
      setServerError(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <form onSubmit={handleSubmit} noValidate className="w-full max-w-md space-y-4 rounded-lg bg-white p-8 shadow">
        <div>
          <h1 className="text-2xl font-semibold">Welcome back</h1>
          <p className="text-sm text-slate-500">Log in to the Store Rating System</p>
        </div>
        <Alert>{serverError}</Alert>
        <FormField label="Email" name="email" type="email" autoComplete="email" value={values.email} onChange={handleChange} error={errors.email} />
        <FormField label="Password" name="password" type="password" autoComplete="current-password" value={values.password} onChange={handleChange} error={errors.password} />
        <Button type="submit" loading={submitting} className="w-full">
          Log in
        </Button>
        <p className="text-center text-sm text-slate-500">
          New here?{' '}
          <Link to="/register" className="font-medium text-indigo-600 hover:underline">
            Create an account
          </Link>
        </p>
      </form>
    </main>
  );
}
