import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

const PAGE_TITLES: Record<string, string> = {
  '/bureau':         'Bureau Overview',
  '/dashboard':      'Building Official — Dashboard',
  '/agreements':     'Building Agreements',
  '/agreements/new': 'New Application',
  '/map':            'Map View',
  '/projects':       'Project Division',
  '/professionals':  'Professional Competency Division',
  '/reports':        'Reports & Analytics',
};

export function AppShell() {
  const { pathname } = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const title = PAGE_TITLES[pathname]
    ?? PAGE_TITLES[Object.keys(PAGE_TITLES).find(k => pathname.startsWith(k) && k !== '/') ?? ''];

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">

      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar — drawer on mobile, inline on desktop */}
      <div className={`
        fixed inset-y-0 left-0 z-40 md:relative md:z-auto
        transition-transform duration-250 ease-in-out
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <Sidebar
          collapsed={collapsed}
          onCollapse={() => setCollapsed(c => !c)}
          onClose={() => setMobileOpen(false)}
        />
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopBar
          title={title}
          onMenuClick={() => setMobileOpen(o => !o)}
        />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
