import { useNavigate } from 'react-router-dom';
import { useApp } from '../store/AppContext';
import type { DemoUser } from '../types';

const ROLE_CONFIG: Record<string, { color: string; light: string; icon: string; desc: string; division?: string }> = {
  bureau_head: {
    color: 'bg-gray-900', light: 'bg-gray-50 border-gray-300',
    icon: '🏛️', desc: 'Overall head of both divisions. Sees the full picture: all agreements, all projects, all reports from both Building Official and Project Division.',
  },
  city_building_official: {
    color: 'bg-red-600', light: 'bg-red-50 border-red-200',
    icon: '📋', desc: 'Heads the Building Official Division at city level. Approves 6–20 floor buildings, reviews fees, and receives reports from sub-city officers.',
    division: 'Building Official Division',
  },
  city_project_head: {
    color: 'bg-blue-700', light: 'bg-blue-50 border-blue-200',
    icon: '🏗️', desc: 'Heads the Project Division at city level. Creates and owns government construction projects. Receives monthly and quarterly supervision reports from sub-city supervisors.',
    division: 'Project Division',
  },
  subcity_building_official: {
    color: 'bg-red-400', light: 'bg-orange-50 border-orange-200',
    icon: '🏢', desc: 'Handles building permit applications for 3–5 floor buildings within their sub-city. Reports upward to the City Building Official Division.',
    division: 'Building Official Division',
  },
  subcity_project_supervisor: {
    color: 'bg-blue-500', light: 'bg-sky-50 border-sky-200',
    icon: '🔍', desc: 'Supervises government construction projects in their sub-city. Follows the supervision plan and submits monthly and quarterly reports to the City Project Division.',
    division: 'Project Division',
  },
  wereda_officer: {
    color: 'bg-red-300', light: 'bg-amber-50 border-amber-200',
    icon: '🏠', desc: 'Handles building permit applications for 0–2 floor buildings at Wereda level. Reports to their Sub-City Building Official.',
    division: 'Building Official Division',
  },
  customer: {
    color: 'bg-gray-500', light: 'bg-gray-50 border-gray-200',
    icon: '👤', desc: 'Submit a building permit application and track its progress through the approval workflow.',
  },
};

export default function RoleSelect() {
  const navigate = useNavigate();
  const { demoUsers, setCurrentUser } = useApp();

  function select(user: DemoUser) {
    setCurrentUser(user);
    if (user.role === 'bureau_head') navigate('/bureau');
    else if (user.role === 'customer') navigate('/agreements');
    else if (['city_project_head', 'subcity_project_supervisor'].includes(user.role)) navigate('/projects');
    else navigate('/dashboard');
  }

  const groups = [
    { label: 'City Level', roles: ['bureau_head', 'city_building_official', 'city_project_head'] },
    { label: 'Sub-City Level', roles: ['subcity_building_official', 'subcity_project_supervisor'] },
    { label: 'Wereda Level', roles: ['wereda_officer'] },
    { label: 'Customer / Applicant', roles: ['customer'] },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-primary text-white px-8 py-5 flex items-center gap-4 shadow-md">
        <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center font-bold text-lg">AC</div>
        <div>
          <h1 className="text-lg font-bold leading-tight">Adama City Construction Authority</h1>
          <p className="text-red-200 text-xs">Construction Bureau Management System</p>
        </div>
        <div className="ml-auto text-right hidden sm:block">
          <p className="text-xs text-red-200">Prototype Demo</p>
          <p className="text-xs text-red-300">v1.0 — 2024</p>
        </div>
      </header>

      {/* Two divisions banner */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2 text-center">Welcome to ACCA Bureau System</h2>
        <p className="text-gray-500 text-sm max-w-2xl mx-auto text-center mb-6">
          Two separate divisions, one integrated system. Select any role to explore the prototype.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto px-4 sm:px-0">
          <div className="flex-1 border-2 border-red-200 rounded-xl p-4 bg-red-50 flex items-center gap-3">
            <span className="text-3xl">📋</span>
            <div>
              <p className="font-bold text-red-900 text-sm">Building Official Division</p>
              <p className="text-xs text-red-700">Customer permits, plan agreements, floor-based routing. Available at City, Sub-City & Wereda level.</p>
            </div>
          </div>
          <div className="flex-1 border-2 border-blue-200 rounded-xl p-4 bg-blue-50 flex items-center gap-3">
            <span className="text-3xl">🏗️</span>
            <div>
              <p className="font-bold text-blue-900 text-sm">Project Division</p>
              <p className="text-xs text-blue-700">Government construction projects. City creates & manages; Sub-City supervises & reports. City & Sub-City level only.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Role groups */}
      <div className="flex-1 px-4 sm:px-8 py-6 sm:py-8 max-w-5xl mx-auto w-full space-y-6 sm:space-y-8">
        {groups.map(group => {
          const users = demoUsers.filter(u => group.roles.includes(u.role));
          if (users.length === 0) return null;
          return (
            <div key={group.label}>
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">{group.label}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {users.map(user => {
                  const cfg = ROLE_CONFIG[user.role];
                  return (
                    <button
                      key={user.id}
                      onClick={() => select(user)}
                      className={`text-left border-2 rounded-xl p-4 transition-all hover:shadow-md hover:border-primary group ${cfg.light}`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-9 h-9 rounded-full ${cfg.color} flex items-center justify-center text-white font-bold text-xs shrink-0`}>
                          {user.initials}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-900 text-sm truncate">{user.name}</p>
                          {cfg.division && (
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                              cfg.division === 'Building Official Division'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-blue-100 text-blue-700'
                            }`}>
                              {cfg.division}
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mb-1 font-medium">{user.title}</p>
                      <p className="text-xs text-gray-500 leading-relaxed">{cfg.desc}</p>
                      <p className="text-xs font-semibold text-primary mt-3 group-hover:gap-2">Enter as this role →</p>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Height routing */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Building Official — Height Routing</h3>
          <div className="flex flex-col sm:flex-row gap-4">
            {[
              { tier: 'Wereda', floors: '0 – 2 Floors', color: 'border-l-4 border-red-200', badge: 'bg-red-100 text-red-700' },
              { tier: 'Sub-City', floors: '3 – 5 Floors', color: 'border-l-4 border-red-400', badge: 'bg-red-300 text-red-800' },
              { tier: 'City', floors: '6 – 20 Floors', color: 'border-l-4 border-red-600', badge: 'bg-red-600 text-white' },
            ].map(r => (
              <div key={r.tier} className={`flex-1 bg-gray-50 rounded-lg p-4 ${r.color}`}>
                <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded mb-2 ${r.badge}`}>{r.tier} Level</span>
                <p className="text-sm font-medium text-gray-900">{r.floors}</p>
                <p className="text-xs text-gray-500 mt-0.5">Customer goes to this level to apply</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
