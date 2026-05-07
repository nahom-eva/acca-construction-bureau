import { NavLink } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { useApp } from '../../store/AppContext';

interface NavItem { path: string; label: string; icon: string; }

function NavGroup({ title, items }: { title: string; items: NavItem[] }) {
  if (items.length === 0) return null;
  return (
    <div className="mb-4">
      <p className="px-3 mb-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">{title}</p>
      {items.map(item => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
              isActive
                ? 'bg-red-50 text-primary font-semibold'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
            )
          }
        >
          <span className="w-5 text-center shrink-0 text-base">{item.icon}</span>
          {item.label}
        </NavLink>
      ))}
    </div>
  );
}

export function Sidebar() {
  const { currentUser, canAccessBO, canAccessProj, isBureauHead } = useApp();

  const boNav: NavItem[] = canAccessBO ? [
    { path: '/dashboard',      label: 'Dashboard',       icon: '▦' },
    { path: '/agreements',     label: 'Agreements',      icon: '📋' },
    { path: '/agreements/new', label: 'New Application', icon: '＋' },
    { path: '/map',            label: 'Map View',        icon: '🗺️' },
    ...( (isBureauHead || currentUser.role === 'city_building_official') ? [
      { path: '/reports', label: 'Reports', icon: '📊' },
    ] : []),
  ] : [];

  const projNav: NavItem[] = canAccessProj ? [
    { path: '/projects', label: 'Projects', icon: '🏗️' },
  ] : [];

  const adminNav: NavItem[] = isBureauHead ? [
    { path: '/bureau', label: 'Bureau Overview', icon: '🏛️' },
  ] : [];

  return (
    <aside className="w-60 bg-white border-r border-gray-200 flex flex-col shrink-0">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-sm">AC</span>
          </div>
          <div>
            <p className="font-bold text-sm text-gray-900 leading-tight">ACCA</p>
            <p className="text-xs text-gray-400 leading-tight">Construction Bureau</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {isBureauHead && <NavGroup title="Bureau" items={adminNav} />}

        {canAccessBO && (
          <NavGroup
            title="Building Official Division"
            items={boNav}
          />
        )}

        {canAccessProj && (
          <>
            {canAccessBO && <div className="border-t border-gray-100 my-3" />}
            <NavGroup
              title="Project Division"
              items={projNav}
            />
          </>
        )}
      </nav>

      {/* User info */}
      <div className="px-4 py-4 border-t border-gray-100">
        <div className="flex items-center gap-2 mb-1">
          {currentUser.division && (
            <span className={cn(
              'text-[10px] font-semibold px-1.5 py-0.5 rounded',
              currentUser.division === 'building_official'
                ? 'bg-red-100 text-red-700'
                : 'bg-blue-100 text-blue-700',
            )}>
              {currentUser.division === 'building_official' ? 'Building Official' : 'Project Division'}
            </span>
          )}
          {currentUser.role === 'bureau_head' && (
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-gray-900 text-white">Bureau</span>
          )}
        </div>
        <div className="text-xs font-semibold text-gray-700 truncate">{currentUser.name}</div>
        <div className="text-xs text-gray-400 truncate leading-tight mt-0.5">{currentUser.title}</div>
      </div>
    </aside>
  );
}
