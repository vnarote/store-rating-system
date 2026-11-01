import { useEffect, useState } from 'react';
import * as storeApi from '../../api/store.api';
import * as ratingApi from '../../api/rating.api';
import { useToast } from '../../context/ToastContext';
import { getErrorMessage } from '../../utils/errors';
import Alert from '../common/Alert';
import Button from '../common/Button';
import Loader from '../common/Loader';
import Modal from '../common/Modal';
import RatingStars from '../common/RatingStars';

// Shows store details and lets the user submit a new rating or modify an existing one.
export default function RateStoreModal({ storeId, onClose, onSaved }) {
  const toast = useToast();
  const [store, setStore] = useState(null);
  const [value, setValue] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    storeApi
      .getStore(storeId)
      .then(({ store: loaded }) => {
        if (!active) return;
        setStore(loaded);
        setValue(loaded.myRating || 0);
      })
      .catch((err) => active && setError(getErrorMessage(err)));
    return () => {
      active = false;
    };
  }, [storeId]);

  const handleSubmit = async () => {
    if (!value) {
      setError('Please select a rating between 1 and 5');
      return;
    }
    setSaving(true);
    setError('');
    try {
      if (store.myRatingId) {
        await ratingApi.updateRating(store.myRatingId, value);
        toast.success('Your rating was updated');
      } else {
        await ratingApi.submitRating(storeId, value);
        toast.success('Your rating was submitted');
      }
      onSaved();
      onClose();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal title={store?.myRatingId ? 'Modify your rating' : 'Rate this store'} onClose={onClose}>
      {!store && !error && <Loader />}
      {store && (
        <div className="space-y-4">
          <div>
            <p className="font-semibold">{store.name}</p>
            <p className="text-sm text-slate-500">{store.address}</p>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-500">Overall rating:</span>
            <RatingStars value={store.averageRating} showValue />
            <span className="text-slate-400">({store.ratingCount})</span>
          </div>
          <div>
            <p className="mb-1 text-sm font-medium text-slate-700">Your rating</p>
            <RatingStars value={value} onChange={setValue} />
          </div>
          <Alert>{error}</Alert>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} loading={saving}>
              {store.myRatingId ? 'Update rating' : 'Submit rating'}
            </Button>
          </div>
        </div>
      )}
      {!store && error && <Alert>{error}</Alert>}
    </Modal>
  );
}
