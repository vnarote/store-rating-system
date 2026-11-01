import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-3 p-4 text-center">
      <p className="text-5xl font-bold text-indigo-600">404</p>
      <p className="text-slate-600">The page you are looking for does not exist.</p>
      <Link to="/" className="font-medium text-indigo-600 hover:underline">
        Go to home
      </Link>
    </main>
  );
}
