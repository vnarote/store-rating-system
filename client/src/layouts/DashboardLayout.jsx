import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';

export default function DashboardLayout({ links }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen">
      <Navbar onMenuClick={() => setMenuOpen((open) => !open)} />
      <div className="flex flex-col md:flex-row">
        <Sidebar links={links} open={menuOpen} onNavigate={() => setMenuOpen(false)} />
        <main className="min-w-0 flex-1 p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
