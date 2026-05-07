import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../store/AppContext';
import { StatusBadge, TierBadge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { formatCurrency, formatDate, isExpiringSoon, isExpired } from '../lib/utils';
import { getSubCity, getWereda } from '../data/mockData';

type FilterStatus = 'all' | 'pending' | 'under_review' | 'approved' | 'rejected' | 'expired' | 'expiring';
type FilterTier = 'all' | 'city' | 'subcity' | 'wereda';

export default function Agreements() {
  const { visibleAgreements, currentUser } = useApp();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [filterTier, setFilterTier] = useState<FilterTier>('all');

  const filtered = visibleAgreements.filter(a => {
    const q = search.toLowerCase();
    const matchSearch = !q ||
      a.agreementNumber.toLowerCase().includes(q) ||
      a.applicantName.toLowerCase().includes(q) ||
      a.buildingName.toLowerCase().includes(q) ||
      a.address.toLowerCase().includes(q);

    const matchStatus = filterStatus === 'all'
      ? true
      : filterStatus === 'expiring'
        ? isExpiringSoon(a.expiryDate) && a.status === 'approved'
        : a.status === filterStatus;

    const matchTier = filterTier === 'all' || a.tier === filterTier;

    return matchSearch && matchStatus && matchTier;
  });

  const canCreate = ['bureau_head', 'city_building_official', 'subcity_building_official', 'wereda_officer', 'customer'].includes(currentUser.role);
  const showTierFilter = currentUser.role === 'bureau_head' || currentUser.role === 'city_building_official';

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-3">
        <div className="flex gap-2">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search agreements…"
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
          {canCreate && (
            <Button onClick={() => navigate('/agreements/new')} size="sm" icon="➕">
              <span className="hidden sm:inline">New Application</span>
            </Button>
          )}
        </div>
        <div className="flex gap-2 flex-wrap">
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value as FilterStatus)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 flex-1 min-w-0"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="under_review">Under Review</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="expired">Expired</option>
            <option value="expiring">Expiring Soon</option>
          </select>
          {showTierFilter && (
            <select
              value={filterTier}
              onChange={e => setFilterTier(e.target.value as FilterTier)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 flex-1 min-w-0"
            >
              <option value="all">All Tiers</option>
              <option value="city">City</option>
              <option value="subcity">Sub-City</option>
              <option value="wereda">Wereda</option>
            </select>
          )}
        </div>
      </div>

      <p className="text-xs text-gray-400">{filtered.length} of {visibleAgreements.length} agreements</p>

      {/* Mobile: card list */}
      <div className="md:hidden space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 px-5 py-10 text-center text-gray-400 text-sm">
            No agreements match your filters.
          </div>
        ) : filtered.map(agr => {
          const sc = getSubCity(agr.subCityId);
          const expiring = isExpiringSoon(agr.expiryDate) && agr.status === 'approved';
          return (
            <button
              key={agr.id}
              onClick={() => navigate(`/agreements/${agr.id}`)}
              className={`w-full text-left bg-white rounded-xl border p-4 hover:shadow-sm transition-all ${expiring ? 'border-amber-300 bg-amber-50' : 'border-gray-200'}`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="min-w-0">
                  <p className="font-mono text-xs text-gray-500">{agr.agreementNumber}</p>
                  <p className="font-semibold text-gray-900 truncate">{agr.applicantName}</p>
                  <p className="text-xs text-gray-500 truncate">{agr.buildingName} · {agr.buildingFloors}F · {sc?.name}</p>
                </div>
                <StatusBadge status={agr.status} />
              </div>
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2">
                  <TierBadge tier={agr.tier} />
                  {expiring && <span className="text-xs text-amber-600 font-medium">⚠ Expiring</span>}
                  {isExpired(agr.expiryDate) && agr.status === 'approved' && (
                    <span className="text-xs text-red-500">Overdue</span>
                  )}
                </div>
                <span className={`text-xs font-medium ${agr.feePaid ? 'text-green-700' : 'text-red-500'}`}>
                  {formatCurrency(agr.serviceFee)}{!agr.feePaid && ' ⚠'}
                </span>
              </div>
              {agr.expiryDate && (
                <p className="text-xs text-gray-400 mt-1.5">Expires {formatDate(agr.expiryDate)}</p>
              )}
            </button>
          );
        })}
      </div>

      {/* Desktop: table */}
      <div className="hidden md:block bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Agreement #</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Applicant / Building</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Location</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tier</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Fee</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Expiry</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-10 text-center text-gray-400 text-sm">
                    No agreements match your filters.
                  </td>
                </tr>
              ) : filtered.map(agr => {
                const sc = getSubCity(agr.subCityId);
                const wr = getWereda(agr.weredaId);
                const expiring = isExpiringSoon(agr.expiryDate) && agr.status === 'approved';
                return (
                  <tr
                    key={agr.id}
                    className={`hover:bg-gray-50 cursor-pointer transition-colors ${expiring ? 'bg-amber-50/50' : ''}`}
                    onClick={() => navigate(`/agreements/${agr.id}`)}
                  >
                    <td className="px-4 py-3 font-mono text-xs text-gray-900">{agr.agreementNumber}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900">{agr.applicantName}</p>
                      <p className="text-xs text-gray-500">{agr.buildingName} · {agr.buildingFloors}F</p>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-xs text-gray-500">{sc?.name} / {wr?.name}</td>
                    <td className="px-4 py-3"><TierBadge tier={agr.tier} /></td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        <StatusBadge status={agr.status} />
                        {expiring && <span className="text-xs text-amber-600 font-medium">⚠ Expiring soon</span>}
                        {isExpired(agr.expiryDate) && agr.status === 'approved' && <span className="text-xs text-red-500">Overdue renewal</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span className={agr.feePaid ? 'text-green-700 font-medium' : 'text-red-500'}>
                        {formatCurrency(agr.serviceFee)}{!agr.feePaid && ' ⚠'}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-xs text-gray-500">
                      {agr.expiryDate ? formatDate(agr.expiryDate) : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-primary text-sm">View →</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
