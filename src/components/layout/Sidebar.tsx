import { NavLink } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { useApp } from '../../store/AppContext';

interface NavItem { path: string; label: string; icon: string; }

interface SidebarProps {
  collapsed: boolean;
  onCollapse: () => void;
  onClose: () => void;
}

function NavGroup({ title, items, collapsed }: { title: string; items: NavItem[]; collapsed: boolean }) {
  if (items.length === 0) return null;
  return (
    <div className="mb-4">
      {!collapsed && (
        <p className="px-3 mb-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">{title}</p>
      )}
      {collapsed && <div className="border-t border-gray-100 mx-3 mb-3" />}
      {items.map(item => (
        <NavLink
          key={item.path}
          to={item.path}
          title={collapsed ? item.label : undefined}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group relative',
              collapsed ? 'justify-center' : '',
              isActive
                ? 'bg-red-50 text-primary font-semibold'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
            )
          }
        >
          <span className="text-base shrink-0">{item.icon}</span>
          {!collapsed && <span>{item.label}</span>}
          {/* Tooltip for collapsed state */}
          {collapsed && (
            <span className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
              {item.label}
            </span>
          )}
        </NavLink>
      ))}
    </div>
  );
}

export function Sidebar({ collapsed, onCollapse, onClose }: SidebarProps) {
  const { currentUser, canAccessBO, canAccessProj, isBureauHead } = useApp();

  const boNav: NavItem[] = canAccessBO ? [
    { path: '/dashboard',      label: 'Dashboard',       icon: '▦' },
    { path: '/agreements',     label: 'Agreements',      icon: '📋' },
    { path: '/agreements/new', label: 'New Application', icon: '➕' },
    { path: '/map',            label: 'Map View',        icon: '🗺️' },
    ...((isBureauHead || currentUser.role === 'city_building_official')
      ? [{ path: '/reports', label: 'Reports', icon: '📊' }]
      : []),
  ] : [];

  const projNav: NavItem[] = canAccessProj ? [
    { path: '/projects', label: 'Projects', icon: '🏗️' },
  ] : [];

  const adminNav: NavItem[] = isBureauHead ? [
    { path: '/bureau', label: 'Bureau Overview', icon: '🏛️' },
  ] : [];

  return (
    <aside className={cn(
      'h-full bg-white border-r border-gray-200 flex flex-col shrink-0 transition-all duration-250',
      collapsed ? 'w-16' : 'w-64',
    )}>
      {/* Logo + close button */}
      <div className={cn(
        'flex items-center border-b border-gray-100 shrink-0',
        collapsed ? 'justify-center py-4 px-2' : 'px-4 py-4 gap-3',
      )}>
        {!collapsed && (
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
            <span className="text-white font-bold text-xs">AC</span>
          </div>
        )}
        {!collapsed && (
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm text-gray-900 leading-tight">ACCA</p>
            <p className="text-xs text-gray-400 leading-tight truncate">Construction Bureau</p>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-white font-bold text-xs">AC</span>
          </div>
        )}

        {/* Mobile close button */}
        {!collapsed && (
          <button
            onClick={onClose}
            className="md:hidden p-1 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 shrink-0"
            aria-label="Close menu"
          >
            ✕
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-3">
        {isBureauHead && (
          <NavGroup title="Bureau" items={adminNav} collapsed={collapsed} />
        )}

        {canAccessBO && (
          <NavGroup
            title="Building Official Division"
            items={boNav}
            collapsed={collapsed}
          />
        )}

        {canAccessProj && (
          <>
            {canAccessBO && !collapsed && <div className="border-t border-gray-100 my-2 mx-1" />}
            <NavGroup
              title="Project Division"
              items={projNav}
              collapsed={collapsed}
            />
          </>
        )}
      </nav>

      {/* User info + collapse toggle */}
      <div className="border-t border-gray-100 shrink-0">
        {!collapsed && (
          <div className="px-4 py-3">
            {currentUser.division && (
              <span className={cn(
                'text-[10px] font-semibold px-1.5 py-0.5 rounded mb-1 inline-block',
                currentUser.division === 'building_official'
                  ? 'bg-red-100 text-red-700'
                  : 'bg-blue-100 text-blue-700',
              )}>
                {currentUser.division === 'building_official' ? 'Building Official' : 'Project Division'}
              </span>
            )}
            {currentUser.role === 'bureau_head' && (
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-gray-900 text-white mb-1 inline-block">Bureau</span>
            )}
            <div className="text-xs font-semibold text-gray-700 truncate">{currentUser.name}</div>
            <div className="text-xs text-gray-400 truncate leading-tight mt-0.5">{currentUser.title}</div>
          </div>
        )}

        {/* Desktop collapse button */}
        <button
          onClick={onCollapse}
          className={cn(
            'hidden md:flex w-full items-center gap-2 px-4 py-3 text-xs text-gray-400 hover:bg-gray-50 hover:text-gray-600 transition-colors border-t border-gray-100',
            collapsed ? 'justify-center' : '',
          )}
        >
          <span className={cn('transition-transform', collapsed ? 'rotate-180' : '')}>◀</span>
          {!collapsed && <span>Collapse sidebar</span>}
        </button>
      </div>
    </aside>
  );
}
