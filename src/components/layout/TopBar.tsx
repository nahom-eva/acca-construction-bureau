import { useNavigate } from 'react-router-dom';
import { useApp } from '../../store/AppContext';
import { cn } from '../../lib/utils';

const ROLE_LABELS: Record<string, string> = {
  bureau_head:                '🏛️ Bureau Head',
  city_building_official:     '🏢 City · Building Official',
  city_project_head:          '🏗️ City · Project Division',
  subcity_building_official:  '🏢 Sub-City · Building Official',
  subcity_project_supervisor: '🔍 Sub-City · Project Supervisor',
  wereda_officer:             '🏠 Wereda · Building Official',
  customer:                   '👤 Customer',
};

export function TopBar({ title }: { title?: string }) {
  const { currentUser, setCurrentUser, demoUsers } = useApp();
  const navigate = useNavigate();

  return (
    <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
      <div>
        {title && <h1 className="text-base font-semibold text-gray-900">{title}</h1>}
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 hidden sm:block">Demo — viewing as:</span>
          <div className="relative">
            <select
              value={currentUser.id}
              onChange={e => {
                const user = demoUsers.find(u => u.id === e.target.value);
                if (!user) return;
                setCurrentUser(user);
                // Route to sensible default for the new role
                if (user.role === 'customer') navigate('/agreements');
                else if (['city_project_head', 'subcity_project_supervisor'].includes(user.role)) navigate('/projects');
                else navigate('/dashboard');
              }}
              className="text-xs border border-gray-200 rounded-lg px-3 py-1.5 bg-white text-gray-700 font-medium appearance-none pr-7 cursor-pointer hover:border-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              {demoUsers.map(u => (
                <option key={u.id} value={u.id}>{ROLE_LABELS[u.role]} — {u.name}</option>
              ))}
            </select>
            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xs">▾</span>
          </div>
        </div>

        <div className={cn(
          'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0',
          currentUser.role === 'bureau_head' ? 'bg-gray-900' :
          currentUser.division === 'project' ? 'bg-blue-600' : 'bg-primary',
        )}>
          {currentUser.initials}
        </div>
      </div>
    </header>
  );
}
