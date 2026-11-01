import { useState } from 'react';
import { changePassword } from '../../api/auth.api';
import { useToast } from '../../context/ToastContext';
import useForm from '../../hooks/useForm';
import { getErrorMessage, getFieldErrors } from '../../utils/errors';
import { rules, validateForm } from '../../utils/validators';
import Alert from '../../components/common/Alert';
import Button from '../../components/common/Button';
import FormField from '../../components/common/FormField';
import PageHeader from '../../components/common/PageHeader';

const INITIAL = { currentPassword: '', newPassword: '', confirmPassword: '' };

export default function ChangePassword() {
  const toast = useToast();
  const { values, errors, setErrors, handleChange, reset } = useForm(INITIAL);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setServerError('');
    const validation = validateForm(values, {
      currentPassword: rules.required('Current password'),
      newPassword: rules.password,
      confirmPassword: (value, all) => (value === all.newPassword ? '' : 'Passwords do not match'),
    });
    if (Object.keys(validation).length) return setErrors(validation);

    setSubmitting(true);
    try {
      await changePassword({ currentPassword: values.currentPassword, newPassword: values.newPassword });
      toast.success('Password updated successfully');
      reset();
    } catch (error) {
      setErrors(getFieldErrors(error));
      setServerError(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md">
      <PageHeader title="Change password" subtitle="Choose a strong password you don't use elsewhere" />
      <form onSubmit={handleSubmit} noValidate className="space-y-4 rounded-lg border border-slate-200 bg-white p-6">
        <Alert>{serverError}</Alert>
        <FormField label="Current password" name="currentPassword" type="password" autoComplete="current-password" value={values.currentPassword} onChange={handleChange} error={errors.currentPassword} />
        <FormField label="New password" name="newPassword" type="password" autoComplete="new-password" value={values.newPassword} onChange={handleChange} error={errors.newPassword} />
        <FormField label="Confirm new password" name="confirmPassword" type="password" autoComplete="new-password" value={values.confirmPassword} onChange={handleChange} error={errors.confirmPassword} />
        <Button type="submit" loading={submitting}>
          Update password
        </Button>
      </form>
    </div>
  );
}
