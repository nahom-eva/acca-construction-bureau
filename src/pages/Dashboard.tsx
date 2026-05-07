import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import { useApp } from '../store/AppContext';
import { StatCard } from '../components/ui/Card';
import { StatusBadge, TierBadge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { formatCurrency, formatDate, isExpiringSoon } from '../lib/utils';
import { SUB_CITIES, getWereda, getSubCity } from '../data/mockData';

const STATUS_COLORS: Record<string, string> = {
  approved: '#16A34A',
  pending: '#D97706',
  under_review: '#2563EB',
  rejected: '#DC2626',
  expired: '#9CA3AF',
};

export default function Dashboard() {
  const { visibleAgreements, currentUser } = useApp();
  const navigate = useNavigate();

  const total = visibleAgreements.length;
  const approved = visibleAgreements.filter(a => a.status === 'approved').length;
  const pending = visibleAgreements.filter(a => a.status === 'pending' || a.status === 'under_review').length;
  const expired = visibleAgreements.filter(a => a.status === 'expired').length;
  const expiringSoon = visibleAgreements.filter(a => isExpiringSoon(a.expiryDate)).length;
  const totalFees = visibleAgreements.reduce((s, a) => s + (a.feePaid ? a.serviceFee : 0), 0);

  const statusData = ['approved', 'pending', 'under_review', 'rejected', 'expired'].map(s => ({
    name: s === 'under_review' ? 'Under Review' : s.charAt(0).toUpperCase() + s.slice(1),
    value: visibleAgreements.filter(a => a.status === s).length,
    color: STATUS_COLORS[s],
  })).filter(d => d.value > 0);

  // Fee by sub-city (city admin only)
  const feeBySubCity = SUB_CITIES.map(sc => ({
    name: sc.name,
    fees: visibleAgreements
      .filter(a => a.subCityId === sc.id && a.feePaid)
      .reduce((s, a) => s + a.serviceFee, 0) / 1000,
  }));

  const recent = [...visibleAgreements]
    .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
    .slice(0, 5);

  const expiringList = visibleAgreements
    .filter(a => isExpiringSoon(a.expiryDate) && a.status === 'approved')
    .slice(0, 4);

  return (
    <div className="space-y-6">
      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard label="Total Agreements" value={total} icon="📋" accent />
        <StatCard label="Approved" value={approved} icon="✅" trend={{ value: 12, label: 'vs last month' }} />
        <StatCard label="Pending / Review" value={pending} icon="⏳" />
        <StatCard label="Expired" value={expired} icon="⌛" />
        <StatCard label="Service Fees Collected" value={formatCurrency(totalFees)} icon="💰" sub="paid agreements only" />
      </div>

      {/* Expiring soon alert */}
      {expiringSoon > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-amber-600 text-lg">⚠️</span>
            <div>
              <p className="text-sm font-semibold text-amber-800">{expiringSoon} agreement{expiringSoon > 1 ? 's' : ''} expiring within 30 days</p>
              <p className="text-xs text-amber-600">Review and notify applicants before expiry</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => navigate('/agreements?filter=expiring')}>
            View →
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Fee by sub-city chart (city admin) */}
        {(currentUser.role === 'bureau_head' || currentUser.role === 'city_building_official') && (
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Service Fees by Sub-City (ETB '000)</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={feeBySubCity} barSize={28}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(v) => [`${Number(v).toFixed(0)}K ETB`, 'Fees']} />
                <Bar dataKey="fees" fill="#CC1020" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Status donut */}
        <div className={`bg-white rounded-xl border border-gray-200 p-5 ${!['bureau_head','city_building_official'].includes(currentUser.role) ? 'lg:col-span-2' : ''}`}>
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Agreements by Status</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={statusData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" paddingAngle={2}>
                {statusData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Legend iconSize={10} wrapperStyle={{ fontSize: 11 }} />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent agreements */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900">Recent Agreements</h3>
            <Button variant="ghost" size="sm" onClick={() => navigate('/agreements')}>View all →</Button>
          </div>
          <div className="divide-y divide-gray-50">
            {recent.map(agr => (
              <button
                key={agr.id}
                onClick={() => navigate(`/agreements/${agr.id}`)}
                className="w-full text-left px-5 py-3 hover:bg-gray-50 transition-colors flex items-center gap-4"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{agr.agreementNumber}</p>
                  <p className="text-xs text-gray-500 truncate">{agr.applicantName} · {agr.buildingName}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <TierBadge tier={agr.tier} />
                  <StatusBadge status={agr.status} />
                  <span className="text-xs text-gray-400 hidden sm:block">{formatDate(agr.submittedAt)}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Expiring soon panel */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="px-5 py-4 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-900">Expiring Soon</h3>
          </div>
          <div className="p-4 space-y-3">
            {expiringList.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-4">No agreements expiring in 30 days</p>
            ) : expiringList.map(agr => {
              const days = Math.ceil((new Date(agr.expiryDate!).getTime() - Date.now()) / 86400000);
              const sc = getSubCity(agr.subCityId);
              const wr = getWereda(agr.weredaId);
              return (
                <button
                  key={agr.id}
                  onClick={() => navigate(`/agreements/${agr.id}`)}
                  className="w-full text-left bg-amber-50 border border-amber-100 rounded-lg p-3 hover:border-amber-300 transition-colors"
                >
                  <p className="text-xs font-semibold text-gray-800 truncate">{agr.agreementNumber}</p>
                  <p className="text-xs text-gray-500 truncate">{sc?.name} · {wr?.name}</p>
                  <p className="text-xs font-bold text-amber-700 mt-1">Expires in {days} day{days !== 1 ? 's' : ''}</p>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
