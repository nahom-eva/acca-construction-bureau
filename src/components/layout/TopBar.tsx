import { useNavigate } from 'react-router-dom';
import { useApp } from '../../store/AppContext';
import { cn, landingPathForRole } from '../../lib/utils';

const ROLE_LABELS: Record<string, string> = {
  bureau_head:                              '🏛️ Bureau Head',
  city_building_official:                   '🏢 City · BO',
  city_project_head:                        '🏗️ City · Project',
  city_professional_competency_head:        '🎓 City · Prof. Comp.',
  subcity_building_official:                '🏢 Sub-City · BO',
  subcity_project_supervisor:               '🔍 Sub-City · Proj.',
  subcity_professional_competency_officer:  '🎓 Sub-City · Prof. Comp.',
  wereda_officer:                           '🏠 Wereda · BO',
  customer:                                 '👤 Customer',
};

interface TopBarProps {
  title?: string;
  onMenuClick: () => void;
}

export function TopBar({ title, onMenuClick }: TopBarProps) {
  const { currentUser, setCurrentUser, demoUsers } = useApp();
  const navigate = useNavigate();

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center gap-3 px-4 shrink-0">
      {/* Hamburger — mobile only */}
      <button
        onClick={onMenuClick}
        className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors shrink-0"
        aria-label="Open menu"
      >
        <span className="block w-5 h-0.5 bg-current mb-1" />
        <span className="block w-5 h-0.5 bg-current mb-1" />
        <span className="block w-5 h-0.5 bg-current" />
      </button>

      {/* Page title */}
      <div className="flex-1 min-w-0">
        {title && (
          <h1 className="text-sm font-semibold text-gray-900 truncate">{title}</h1>
        )}
      </div>

      {/* Role switcher + avatar */}
      <div className="flex items-center gap-2 shrink-0">
        <div className="relative">
          <select
            value={currentUser.id}
            onChange={e => {
              const user = demoUsers.find(u => u.id === e.target.value);
              if (!user) return;
              setCurrentUser(user);
              navigate(landingPathForRole(user.role));
            }}
            className="text-xs border border-gray-200 rounded-lg pl-2 pr-6 py-1.5 bg-white text-gray-700 font-medium appearance-none cursor-pointer hover:border-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 max-w-[140px] sm:max-w-none"
          >
            {demoUsers.map(u => (
              <option key={u.id} value={u.id}>{ROLE_LABELS[u.role]} — {u.name}</option>
            ))}
          </select>
          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xs">▾</span>
        </div>

        <div className={cn(
          'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0',
          currentUser.role === 'bureau_head' ? 'bg-gray-900' :
          currentUser.division === 'project' ? 'bg-blue-600' :
          currentUser.division === 'professional_competency' ? 'bg-purple-600' : 'bg-primary',
        )}>
          {currentUser.initials}
        </div>
      </div>
    </header>
  );
}
