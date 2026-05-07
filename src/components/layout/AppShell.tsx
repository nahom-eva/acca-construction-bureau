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
  '/reports':        'Reports & Analytics',
};

export function AppShell() {
  const { pathname } = useLocation();
  const title = PAGE_TITLES[pathname] ?? PAGE_TITLES[Object.keys(PAGE_TITLES).find(k => pathname.startsWith(k) && k !== '/') ?? ''];

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopBar title={title} />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
