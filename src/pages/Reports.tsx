import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid, Legend,
} from 'recharts';
import { useApp } from '../store/AppContext';
import { Card, StatCard } from '../components/ui/Card';
import { formatCurrency } from '../lib/utils';
import { SUB_CITIES, WEREDAS } from '../data/mockData';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function Reports() {
  const { visibleAgreements } = useApp();

  const totalFees = visibleAgreements.filter(a => a.feePaid).reduce((s, a) => s + a.serviceFee, 0);
  const byTier = {
    city:    visibleAgreements.filter(a => a.tier === 'city'),
    subcity: visibleAgreements.filter(a => a.tier === 'subcity'),
    wereda:  visibleAgreements.filter(a => a.tier === 'wereda'),
  };

  const feeBySubCity = SUB_CITIES.map(sc => ({
    name: sc.name,
    city:    visibleAgreements.filter(a => a.subCityId === sc.id && a.tier === 'city' && a.feePaid).reduce((s, a) => s + a.serviceFee, 0) / 1000,
    subcity: visibleAgreements.filter(a => a.subCityId === sc.id && a.tier === 'subcity' && a.feePaid).reduce((s, a) => s + a.serviceFee, 0) / 1000,
    wereda:  visibleAgreements.filter(a => a.subCityId === sc.id && a.tier === 'wereda' && a.feePaid).reduce((s, a) => s + a.serviceFee, 0) / 1000,
  }));

  // Simulated monthly trend
  const monthlyData = MONTHS.map((m, i) => ({
    month: m,
    agreements: Math.max(0, Math.floor(Math.random() * 8 + 2 + (i > 6 ? 2 : 0))),
    fees: Math.floor(Math.random() * 20000 + 5000),
  }));

  const subCityBreakdown = SUB_CITIES.map(sc => {
    const agrs = visibleAgreements.filter(a => a.subCityId === sc.id);
    const fees = agrs.filter(a => a.feePaid).reduce((s, a) => s + a.serviceFee, 0);
    const weredas = WEREDAS.filter(w => w.subCityId === sc.id);
    return { ...sc, total: agrs.length, approved: agrs.filter(a => a.status === 'approved').length, fees, weredas: weredas.length };
  });

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="City-Level Agreements" value={byTier.city.length} icon="🏛️" accent />
        <StatCard label="Sub-City Agreements" value={byTier.subcity.length} icon="🏢" />
        <StatCard label="Wereda Agreements" value={byTier.wereda.length} icon="🏠" />
        <StatCard label="Total Fees Collected" value={formatCurrency(totalFees)} icon="💰" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <h3 className="text-sm font-semibold text-gray-900 mb-5">Service Fees by Sub-City & Tier (ETB '000)</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={feeBySubCity} barSize={16}>
              <XAxis dataKey="name" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip formatter={(v) => [`${Number(v).toFixed(0)}K ETB`]} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="city" name="City" stackId="a" fill="#CC1020" radius={[0, 0, 0, 0]} />
              <Bar dataKey="subcity" name="Sub-City" stackId="a" fill="#E8192C" />
              <Bar dataKey="wereda" name="Wereda" stackId="a" fill="#FFB3B8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <h3 className="text-sm font-semibold text-gray-900 mb-5">Monthly Agreement Volume (2024)</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip />
              <Line type="monotone" dataKey="agreements" name="Agreements" stroke="#CC1020" strokeWidth={2} dot={{ fill: '#CC1020', r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Sub-city breakdown table */}
      <Card padding="none">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900">Sub-City Breakdown</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Sub-City</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Weredas</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Total Agreements</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Approved</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Fees Collected</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Approval Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {subCityBreakdown.map(sc => {
                const rate = sc.total > 0 ? Math.round((sc.approved / sc.total) * 100) : 0;
                return (
                  <tr key={sc.id} className="hover:bg-gray-50">
                    <td className="px-5 py-3 font-medium text-gray-900">{sc.name}</td>
                    <td className="px-5 py-3 text-gray-500">{sc.weredas}</td>
                    <td className="px-5 py-3 font-semibold">{sc.total}</td>
                    <td className="px-5 py-3 text-green-700 font-medium">{sc.approved}</td>
                    <td className="px-5 py-3">{formatCurrency(sc.fees)}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-100 rounded-full h-1.5">
                          <div className="h-1.5 rounded-full bg-primary" style={{ width: `${rate}%` }} />
                        </div>
                        <span className="text-xs text-gray-600">{rate}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
