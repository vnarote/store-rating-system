import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createStore } from '../../api/store.api';
import { listUsers } from '../../api/user.api';
import { useToast } from '../../context/ToastContext';
import useForm from '../../hooks/useForm';
import { ROLES } from '../../utils/constants';
import { getErrorMessage, getFieldErrors } from '../../utils/errors';
import { rules, validateForm } from '../../utils/validators';
import Alert from '../../components/common/Alert';
import Button from '../../components/common/Button';
import FormField from '../../components/common/FormField';
import Loader from '../../components/common/Loader';
import PageHeader from '../../components/common/PageHeader';

export default function AddStore() {
  const toast = useToast();
  const navigate = useNavigate();
  const { values, errors, setErrors, handleChange } = useForm({ name: '', email: '', address: '', ownerId: '' });
  const [owners, setOwners] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    listUsers({ role: ROLES.STORE_OWNER, limit: 100, sortBy: 'name', sortOrder: 'asc' })
      .then((data) => setOwners(data.items))
      .catch((error) => {
        setOwners([]);
        setServerError(getErrorMessage(error));
      });
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setServerError('');
    const validation = validateForm(values, {
      name: rules.name,
      email: rules.email,
      address: rules.requiredAddress,
      ownerId: rules.required('Store owner'),
    });
    if (Object.keys(validation).length) return setErrors(validation);

    setSubmitting(true);
    try {
      await createStore({ ...values, name: values.name.trim(), email: values.email.trim(), address: values.address.trim() });
      toast.success('Store created successfully');
      navigate('/admin/stores');
    } catch (error) {
      setErrors(getFieldErrors(error));
      setServerError(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  if (!owners) return <Loader />;

  return (
    <div className="max-w-xl">
      <PageHeader title="Add store" subtitle="Register a store and assign it to a store owner" />
      {owners.length === 0 ? (
        <Alert type="info">
          There are no store owners yet. <Link to="/admin/users/new" className="font-medium underline">Create a store owner</Link> first.
        </Alert>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-4 rounded-lg border border-slate-200 bg-white p-6">
          <Alert>{serverError}</Alert>
          <FormField label="Store name (20–60 characters)" name="name" value={values.name} onChange={handleChange} error={errors.name} />
          <FormField label="Store email" name="email" type="email" value={values.email} onChange={handleChange} error={errors.email} />
          <FormField as="textarea" rows={3} label="Address" name="address" value={values.address} onChange={handleChange} error={errors.address} />
          <FormField as="select" label="Store owner" name="ownerId" value={values.ownerId} onChange={handleChange} error={errors.ownerId}>
            <option value="">Select an owner</option>
            {owners.map((owner) => (
              <option key={owner.id} value={owner.id}>
                {owner.name} ({owner.email})
              </option>
            ))}
          </FormField>
          <Button type="submit" loading={submitting}>
            Create store
          </Button>
        </form>
      )}
    </div>
  );
}
