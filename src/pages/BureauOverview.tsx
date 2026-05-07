import { useNavigate } from 'react-router-dom';
import { useApp } from '../store/AppContext';
import { StatCard } from '../components/ui/Card';
import { formatCurrency, isExpiringSoon } from '../lib/utils';
import { PROJECTS } from '../data/mockData';

export default function BureauOverview() {
  const { visibleAgreements } = useApp();
  const navigate = useNavigate();

  const totalFees = visibleAgreements.filter(a => a.feePaid).reduce((s, a) => s + a.serviceFee, 0);
  const expiringSoon = visibleAgreements.filter(a => isExpiringSoon(a.expiryDate) && a.status === 'approved').length;
  const activeProjects = PROJECTS.filter(p => p.status === 'construction' || p.status === 'design').length;
  const totalBudget = PROJECTS.reduce((s, p) => s + p.budget, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Bureau Overview</h2>
        <p className="text-sm text-gray-500 mt-1">Consolidated view across both divisions</p>
      </div>

      {/* Division cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Building Official */}
        <div className="bg-white rounded-xl border-2 border-red-200 p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center text-xl">📋</div>
            <div>
              <h3 className="font-bold text-gray-900">Building Official Division</h3>
              <p className="text-xs text-gray-500">Permits, agreements & plan approvals</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-5">
            <StatCard label="Total Agreements" value={visibleAgreements.length} accent />
            <StatCard label="Approved" value={visibleAgreements.filter(a => a.status === 'approved').length} />
            <StatCard label="Pending Review" value={visibleAgreements.filter(a => a.status === 'pending' || a.status === 'under_review').length} />
            <StatCard label="Fees Collected" value={formatCurrency(totalFees)} sub="paid only" />
          </div>
          {expiringSoon > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-xs text-amber-800 font-medium mb-4">
              ⚠ {expiringSoon} agreement{expiringSoon > 1 ? 's' : ''} expiring within 30 days
            </div>
          )}
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full text-sm font-semibold text-primary border border-primary rounded-lg py-2 hover:bg-red-50 transition-colors"
          >
            Go to Building Official Dashboard →
          </button>
        </div>

        {/* Project Division */}
        <div className="bg-white rounded-xl border-2 border-blue-200 p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-xl">🏗️</div>
            <div>
              <h3 className="font-bold text-gray-900">Project Division</h3>
              <p className="text-xs text-gray-500">Government construction projects</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-5">
            <StatCard label="Total Projects" value={PROJECTS.length} />
            <StatCard label="Active" value={activeProjects} />
            <StatCard label="Total Budget" value={formatCurrency(totalBudget)} sub="all projects" />
            <StatCard label="Reports This Month" value={PROJECTS.reduce((s, p) => s + p.reports.filter(r => r.type === 'monthly').length, 0)} />
          </div>
          <button
            onClick={() => navigate('/projects')}
            className="w-full text-sm font-semibold text-blue-600 border border-blue-400 rounded-lg py-2 hover:bg-blue-50 transition-colors"
          >
            Go to Project Division →
          </button>
        </div>
      </div>

      {/* Quick links */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Agreements List', icon: '📋', path: '/agreements' },
            { label: 'Map View', icon: '🗺️', path: '/map' },
            { label: 'Projects', icon: '🏗️', path: '/projects' },
            { label: 'Reports', icon: '📊', path: '/reports' },
          ].map(a => (
            <button
              key={a.path}
              onClick={() => navigate(a.path)}
              className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-lg hover:bg-red-50 hover:border-primary border border-transparent transition-colors text-center"
            >
              <span className="text-2xl">{a.icon}</span>
              <span className="text-xs font-medium text-gray-700">{a.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
