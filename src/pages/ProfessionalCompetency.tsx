import { useState } from 'react';
import { useApp } from '../store/AppContext';
import { Card, StatCard } from '../components/ui/Card';
import { StatusBadge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { formatDate } from '../lib/utils';
import { getSubCity, getCategoryLabel, getCategoryIcon, getGradeLabel } from '../data/mockData';
import type { Professional } from '../types';

type FilterStatus = 'all' | 'active' | 'pending_renewal' | 'suspended' | 'expired';
type FilterCategory = 'all' | 'architect' | 'engineer' | 'contractor' | 'consultant';

const GRADE_STYLES: Record<string, string> = {
  grade_1: 'bg-purple-600 text-white',
  grade_2: 'bg-purple-200 text-purple-900',
  grade_3: 'bg-purple-50 text-purple-700 border border-purple-200',
};

function GradeBadge({ grade }: { grade: string }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${GRADE_STYLES[grade] ?? 'bg-gray-100 text-gray-700'}`}>
      {getGradeLabel(grade)}
    </span>
  );
}

// ── Sub-component: Professional detail ─────────────────────────────────────
function ProfessionalDetail({ professional, onBack }: { professional: Professional; onBack: () => void }) {
  const { currentUser, setProfessionalStatus, renewProfessional } = useApp();
  const [flash, setFlash] = useState<string | null>(null);

  const isDivisionHead = currentUser.role === 'city_professional_competency_head' || currentUser.role === 'bureau_head';
  const isSubCityOfficer = currentUser.role === 'subcity_professional_competency_officer';
  const sc = getSubCity(professional.subCityId);

  function announce(message: string) {
    setFlash(message);
    setTimeout(() => setFlash(null), 3000);
  }

  function act(status: Professional['status'], note: string, message: string) {
    setProfessionalStatus(professional.id, status, note);
    announce(message);
  }

  return (
    <div className="space-y-5">
      <div>
        <button onClick={onBack} className="text-sm text-gray-400 hover:text-gray-700 mb-2 flex items-center gap-1">
          ← Back to Professionals
        </button>
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-3 flex-wrap mb-1">
              <h2 className="text-xl font-bold text-gray-900">{professional.fullName}</h2>
              <StatusBadge status={professional.status} />
              <GradeBadge grade={professional.grade} />
            </div>
            <p className="text-sm text-gray-500">
              {professional.registrationNumber} · {getCategoryLabel(professional.category)} · {professional.firmName}
            </p>
          </div>
        </div>
      </div>

      {flash && (
        <div className="bg-green-50 border border-green-200 rounded-xl px-5 py-3 flex items-center gap-3">
          <span className="text-green-600 text-lg">✅</span>
          <p className="text-sm font-semibold text-green-800">{flash}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Registration details */}
        <Card className="lg:col-span-2">
          <h3 className="text-sm font-semibold text-gray-900 mb-3 border-b border-gray-100 pb-3">Registration Details</h3>
          <p className="text-sm text-gray-600 mb-5">{professional.specialization}</p>
          <dl className="grid grid-cols-2 gap-4">
            {[
              { label: 'Category', value: `${getCategoryIcon(professional.category)} ${getCategoryLabel(professional.category)}` },
              { label: 'Competency Grade', value: getGradeLabel(professional.grade) },
              { label: 'Firm / Practice', value: professional.firmName },
              { label: 'Overseeing Sub-City', value: sc?.name ?? '—' },
              { label: 'Years of Experience', value: `${professional.yearsExperience} years` },
              { label: 'Last Reviewed By', value: professional.reviewedBy ?? 'Not yet reviewed' },
              { label: 'Phone', value: professional.phone },
              { label: 'Email', value: professional.email },
            ].map(({ label, value }) => (
              <div key={label}>
                <dt className="text-xs text-gray-400">{label}</dt>
                <dd className="text-sm font-medium text-gray-900 mt-0.5 break-words">{value}</dd>
              </div>
            ))}
          </dl>
          {professional.notes && (
            <div className="mt-5 pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-400 mb-1">Division Notes</p>
              <p className="text-sm text-gray-600 leading-relaxed">{professional.notes}</p>
            </div>
          )}
        </Card>

        {/* Certificate validity */}
        <Card>
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Certificate Validity</h3>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-gray-400">Issued</p>
              <p className="text-sm font-bold text-gray-900">{formatDate(professional.issuedDate)}</p>
            </div>
            <div>
              <p className="text-xs text-gray-400">Valid Until</p>
              <p className="text-sm font-bold text-gray-900">{formatDate(professional.expiryDate)}</p>
            </div>
            <div className="pt-3 border-t border-gray-100">
              <p className="text-xs text-gray-400 mb-1">Current Standing</p>
              <StatusBadge status={professional.status} />
            </div>
          </div>

          {/* Role-appropriate actions */}
          {isDivisionHead && (
            <div className="mt-5 pt-4 border-t border-gray-100 space-y-2">
              <p className="text-xs font-semibold text-gray-500 mb-2">Division Head Actions</p>
              {professional.status !== 'active' && (
                <Button
                  className="w-full justify-center"
                  icon="✅"
                  onClick={() => {
                    renewProfessional(professional.id, 'Certificate renewed for a further term by the City Professional Competency Division.');
                    announce('Certificate renewed — active standing restored and validity extended by 3 years.');
                  }}
                >
                  Approve / Renew Certificate
                </Button>
              )}
              {professional.status !== 'suspended' && (
                <Button
                  variant="danger"
                  className="w-full justify-center"
                  icon="⛔"
                  onClick={() => act('suspended', 'Certificate suspended pending disciplinary review by the City Professional Competency Division.', 'Certificate suspended pending disciplinary review.')}
                >
                  Suspend Certificate
                </Button>
              )}
            </div>
          )}

          {isSubCityOfficer && professional.status === 'active' && (
            <div className="mt-5 pt-4 border-t border-gray-100">
              <p className="text-xs font-semibold text-gray-500 mb-2">Sub-City Officer Actions</p>
              <Button
                variant="outline"
                className="w-full justify-center"
                icon="⚠"
                onClick={() => act('pending_renewal', `Flagged for competency review by ${currentUser.name} following sub-city field inspection.`, 'Flagged for review — escalated to the City Professional Competency Division.')}
              >
                Flag for Competency Review
              </Button>
              <p className="text-xs text-gray-400 mt-2 leading-relaxed">
                Flagging escalates this professional to the City division for a renewal or disciplinary decision.
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

// ── Main Professional Competency page ──────────────────────────────────────
export default function ProfessionalCompetency() {
  const { visibleProfessionals, currentUser } = useApp();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [filterCategory, setFilterCategory] = useState<FilterCategory>('all');

  const isDivisionHead = currentUser.role === 'city_professional_competency_head' || currentUser.role === 'bureau_head';
  const isSubCityOfficer = currentUser.role === 'subcity_professional_competency_officer';

  // Derived from the visible set, so edits show through and a record that leaves
  // the current role's scope (e.g. after a role switch) falls back to the list.
  const selected = selectedId ? visibleProfessionals.find(p => p.id === selectedId) : undefined;

  if (selected) {
    return <ProfessionalDetail professional={selected} onBack={() => setSelectedId(null)} />;
  }

  const filtered = visibleProfessionals.filter(p => {
    const q = search.toLowerCase();
    const matchSearch = !q ||
      p.fullName.toLowerCase().includes(q) ||
      p.registrationNumber.toLowerCase().includes(q) ||
      p.firmName.toLowerCase().includes(q) ||
      p.specialization.toLowerCase().includes(q);
    const matchStatus = filterStatus === 'all' || p.status === filterStatus;
    const matchCategory = filterCategory === 'all' || p.category === filterCategory;
    return matchSearch && matchStatus && matchCategory;
  });

  const active = visibleProfessionals.filter(p => p.status === 'active').length;
  const pendingRenewal = visibleProfessionals.filter(p => p.status === 'pending_renewal').length;
  const suspended = visibleProfessionals.filter(p => p.status === 'suspended').length;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Professional Competency Division</h2>
          <p className="text-sm text-gray-500">
            {isDivisionHead
              ? 'Registered construction professionals — certify competency, renew and enforce standing'
              : 'Professionals practising in your sub-city — verify conduct and flag competency concerns'}
          </p>
        </div>
        {isDivisionHead && <Button icon="＋">Register Professional</Button>}
      </div>

      {isSubCityOfficer && (
        <div className="bg-purple-50 border border-purple-200 rounded-xl px-5 py-3 flex items-center gap-3">
          <span className="text-purple-600 text-lg">🎓</span>
          <div>
            <p className="text-sm font-semibold text-purple-800">
              Your oversight area: {getSubCity(currentUser.subCityId ?? '')?.name} Sub-City
            </p>
            <p className="text-xs text-purple-600">
              Open a professional to review their certificate, or flag competency concerns to the City division.
            </p>
          </div>
        </div>
      )}

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Registered Professionals" value={visibleProfessionals.length} icon="🎓" accent />
        <StatCard label="Active Certificates" value={active} icon="✅" />
        <StatCard label="Pending Renewal" value={pendingRenewal} icon="⏳" />
        <StatCard label="Suspended" value={suspended} icon="⛔" />
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name, registration number or firm…"
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
        />
        <div className="flex gap-2 flex-wrap">
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value as FilterStatus)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 flex-1 min-w-0"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="pending_renewal">Pending Renewal</option>
            <option value="suspended">Suspended</option>
            <option value="expired">Expired</option>
          </select>
          <select
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value as FilterCategory)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 flex-1 min-w-0"
          >
            <option value="all">All Categories</option>
            <option value="architect">Architects</option>
            <option value="engineer">Engineers</option>
            <option value="contractor">Contractors</option>
            <option value="consultant">Consultants</option>
          </select>
        </div>
      </div>

      <p className="text-xs text-gray-400">{filtered.length} of {visibleProfessionals.length} professionals</p>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 px-5 py-16 text-center text-gray-400">
          {visibleProfessionals.length === 0
            ? 'No professionals registered in your area.'
            : 'No professionals match your filters.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(p => {
            const sc = getSubCity(p.subCityId);
            return (
              <button
                key={p.id}
                onClick={() => setSelectedId(p.id)}
                className="text-left bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md hover:border-primary/30 transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <StatusBadge status={p.status} />
                    <GradeBadge grade={p.grade} />
                  </div>
                  <span className="text-primary text-sm group-hover:translate-x-1 transition-transform">→</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-2xl mt-0.5 shrink-0">{getCategoryIcon(p.category)}</span>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-gray-900 truncate">{p.fullName}</h3>
                    <p className="text-xs text-gray-500 truncate">{getCategoryLabel(p.category)} · {p.firmName}</p>
                    <p className="font-mono text-xs text-gray-400 mt-0.5">{p.registrationNumber}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-3 line-clamp-2">{p.specialization}</p>
                <div className="flex items-center justify-between text-xs mt-4 pt-3 border-t border-gray-50">
                  <span className="text-gray-400">{sc?.name} Sub-City · {p.yearsExperience} yrs exp.</span>
                  <span className="text-gray-400">Valid to {formatDate(p.expiryDate)}</span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
