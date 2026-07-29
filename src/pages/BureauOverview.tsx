import { useNavigate } from 'react-router-dom';
import { useApp } from '../store/AppContext';
import { StatCard } from '../components/ui/Card';
import { formatCompactCurrency, isExpiringSoon } from '../lib/utils';
import { PROJECTS } from '../data/mockData';

export default function BureauOverview() {
  const { visibleAgreements, visibleProfessionals } = useApp();
  const navigate = useNavigate();

  const totalFees = visibleAgreements.filter(a => a.feePaid).reduce((s, a) => s + a.serviceFee, 0);
  const expiringSoon = visibleAgreements.filter(a => isExpiringSoon(a.expiryDate) && a.status === 'approved').length;
  const activeProjects = PROJECTS.filter(p => p.status === 'construction' || p.status === 'design').length;
  const totalBudget = PROJECTS.reduce((s, p) => s + p.budget, 0);
  const activeCertificates = visibleProfessionals.filter(p => p.status === 'active').length;
  const pendingRenewal = visibleProfessionals.filter(p => p.status === 'pending_renewal').length;
  const suspendedProfessionals = visibleProfessionals.filter(p => p.status === 'suspended').length;
  const gradeOneCertified = visibleProfessionals.filter(p => p.grade === 'grade_1').length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900">Bureau Overview</h2>
        <p className="text-sm text-gray-500 mt-1">Consolidated view across all three divisions</p>
      </div>

      {/* Division cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {/* Building Official */}
        <div className="bg-white rounded-xl border-2 border-red-200 p-6">
          <div className="flex items-center gap-3 mb-5 min-h-14">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center text-xl">📋</div>
            <div>
              <h3 className="font-bold text-gray-900">Building Official Division</h3>
              <p className="text-xs text-gray-500">Permits, agreements & plan approvals</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mb-4">
            <StatCard dense label="Total Agreements" value={visibleAgreements.length} accent />
            <StatCard dense label="Approved" value={visibleAgreements.filter(a => a.status === 'approved').length} />
            <StatCard dense label="Pending Review" value={visibleAgreements.filter(a => a.status === 'pending' || a.status === 'under_review').length} />
            <StatCard dense label="Fees Collected" value={formatCompactCurrency(totalFees)} sub="paid only" />
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
          <div className="flex items-center gap-3 mb-5 min-h-14">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-xl">🏗️</div>
            <div>
              <h3 className="font-bold text-gray-900">Project Division</h3>
              <p className="text-xs text-gray-500">Government construction projects</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-5">
            <StatCard dense label="Total Projects" value={PROJECTS.length} />
            <StatCard dense label="Active" value={activeProjects} />
            <StatCard dense label="Total Budget" value={formatCompactCurrency(totalBudget)} sub="all projects" />
            <StatCard dense label="Reports This Month" value={PROJECTS.reduce((s, p) => s + p.reports.filter(r => r.type === 'monthly').length, 0)} />
          </div>
          <button
            onClick={() => navigate('/projects')}
            className="w-full text-sm font-semibold text-blue-600 border border-blue-400 rounded-lg py-2 hover:bg-blue-50 transition-colors"
          >
            Go to Project Division →
          </button>
        </div>

        {/* Professional Competency Division */}
        <div className="bg-white rounded-xl border-2 border-purple-200 p-6">
          <div className="flex items-center gap-3 mb-5 min-h-14">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-xl">🎓</div>
            <div>
              <h3 className="font-bold text-gray-900">Professional Competency Division</h3>
              <p className="text-xs text-gray-500">Certification & grading of professionals</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mb-4">
            <StatCard dense label="Registered Professionals" value={visibleProfessionals.length} />
            <StatCard dense label="Active Certificates" value={activeCertificates} />
            <StatCard dense label="Pending Renewal" value={pendingRenewal} />
            <StatCard dense label="Grade I Certified" value={gradeOneCertified} sub="cleared for high-rise" />
          </div>
          {(pendingRenewal > 0 || suspendedProfessionals > 0) && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg px-4 py-3 text-xs text-purple-800 font-medium mb-4">
              ⚠ {pendingRenewal} awaiting renewal · {suspendedProfessionals} suspended
            </div>
          )}
          <button
            onClick={() => navigate('/professionals')}
            className="w-full text-sm font-semibold text-purple-600 border border-purple-400 rounded-lg py-2 hover:bg-purple-50 transition-colors"
          >
            Go to Professional Competency →
          </button>
        </div>
      </div>

      {/* Quick links */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {[
            { label: 'Agreements List', icon: '📋', path: '/agreements' },
            { label: 'Map View', icon: '🗺️', path: '/map' },
            { label: 'Projects', icon: '🏗️', path: '/projects' },
            { label: 'Professionals', icon: '🎓', path: '/professionals' },
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
