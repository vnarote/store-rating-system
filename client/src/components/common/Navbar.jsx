import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROLE_LABELS } from '../../utils/constants';
import Button from './Button';
import ConfirmDialog from './ConfirmDialog';

export default function Navbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [confirming, setConfirming] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3">
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} aria-label="Toggle menu" className="rounded p-1 text-2xl leading-none text-slate-600 md:hidden">
          ☰
        </button>
        <span className="text-lg font-semibold text-indigo-600">StoreRating</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden text-right text-sm sm:block">
          <p className="font-medium">{user?.name}</p>
          <p className="text-xs text-slate-500">{ROLE_LABELS[user?.role]}</p>
        </div>
        <Button variant="secondary" onClick={() => setConfirming(true)}>
          Log out
        </Button>
      </div>
      {confirming && (
        <ConfirmDialog
          title="Log out"
          message="Are you sure you want to log out?"
          confirmLabel="Log out"
          onConfirm={handleLogout}
          onCancel={() => setConfirming(false)}
        />
      )}
    </header>
  );
}
