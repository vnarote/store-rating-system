import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUser } from '../../api/user.api';
import { useToast } from '../../context/ToastContext';
import useForm from '../../hooks/useForm';
import { ROLES, ROLE_LABELS } from '../../utils/constants';
import { getErrorMessage, getFieldErrors } from '../../utils/errors';
import { rules, validateForm } from '../../utils/validators';
import Alert from '../../components/common/Alert';
import Button from '../../components/common/Button';
import FormField from '../../components/common/FormField';
import PageHeader from '../../components/common/PageHeader';

export default function AddUser() {
  const toast = useToast();
  const navigate = useNavigate();
  const { values, errors, setErrors, handleChange } = useForm({
    name: '',
    email: '',
    password: '',
    address: '',
    role: ROLES.NORMAL_USER,
  });
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setServerError('');
    const validation = validateForm(values, {
      name: rules.name,
      email: rules.email,
      password: rules.password,
      address: rules.address,
    });
    if (Object.keys(validation).length) return setErrors(validation);

    setSubmitting(true);
    try {
      await createUser({ ...values, name: values.name.trim(), email: values.email.trim(), address: values.address.trim() });
      toast.success('User created successfully');
      navigate('/admin/users');
    } catch (error) {
      setErrors(getFieldErrors(error));
      setServerError(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl">
      <PageHeader title="Add user" subtitle="Create a normal user, store owner or administrator" />
      <form onSubmit={handleSubmit} noValidate className="space-y-4 rounded-lg border border-slate-200 bg-white p-6">
        <Alert>{serverError}</Alert>
        <FormField label="Full name (20–60 characters)" name="name" value={values.name} onChange={handleChange} error={errors.name} />
        <FormField label="Email" name="email" type="email" value={values.email} onChange={handleChange} error={errors.email} />
        <FormField label="Password (8–16 chars, 1 uppercase, 1 special)" name="password" type="password" autoComplete="new-password" value={values.password} onChange={handleChange} error={errors.password} />
        <FormField as="textarea" rows={3} label="Address" name="address" value={values.address} onChange={handleChange} error={errors.address} />
        <FormField as="select" label="Role" name="role" value={values.role} onChange={handleChange} error={errors.role}>
          {Object.values(ROLES).map((role) => (
            <option key={role} value={role}>
              {ROLE_LABELS[role]}
            </option>
          ))}
        </FormField>
        <Button type="submit" loading={submitting}>
          Create user
        </Button>
      </form>
    </div>
  );
}
