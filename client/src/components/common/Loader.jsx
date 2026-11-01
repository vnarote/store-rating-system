export default function Loader({ fullScreen = false }) {
  const spinner = (
    <div
      className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-600"
      role="progressbar"
      aria-label="Loading"
    />
  );
  return (
    <div className={`flex items-center justify-center ${fullScreen ? 'min-h-screen' : 'py-12'}`}>
      {spinner}
    </div>
  );
}
