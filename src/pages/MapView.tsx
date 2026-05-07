import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import { useApp } from '../store/AppContext';
import { StatusBadge, TierBadge } from '../components/ui/Badge';
import { formatDate, isExpiringSoon } from '../lib/utils';
import { getSubCity, getWereda } from '../data/mockData';

const STATUS_COLORS: Record<string, string> = {
  approved: '#16A34A',
  pending: '#D97706',
  under_review: '#2563EB',
  rejected: '#DC2626',
  expired: '#9CA3AF',
};

function makeIcon(color: string, label: string) {
  return L.divIcon({
    className: '',
    html: `<div style="background:${color};color:white;width:32px;height:32px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);display:flex;align-items:center;justify-content:center;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.3)">
      <span style="transform:rotate(45deg);font-size:12px;font-weight:bold">${label}</span>
    </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -34],
  });
}

const TIER_FILTERS = ['all', 'city', 'subcity', 'wereda'] as const;
const STATUS_FILTERS = ['all', 'approved', 'pending', 'under_review', 'expired'] as const;

export default function MapView() {
  const { visibleAgreements } = useApp();
  const navigate = useNavigate();
  const [tierFilter, setTierFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filtered = visibleAgreements.filter(a => {
    const matchTier = tierFilter === 'all' || a.tier === tierFilter;
    const matchStatus = statusFilter === 'all' || a.status === statusFilter;
    return matchTier && matchStatus;
  });

  const center: [number, number] = [8.5420, 39.2700];

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex gap-1 bg-white border border-gray-200 rounded-lg p-1">
          {TIER_FILTERS.map(t => (
            <button
              key={t}
              onClick={() => setTierFilter(t)}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${tierFilter === t ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              {t === 'all' ? 'All Tiers' : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
        <div className="flex gap-1 bg-white border border-gray-200 rounded-lg p-1">
          {STATUS_FILTERS.map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${statusFilter === s ? 'bg-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              {s === 'all' ? 'All Statuses' : s === 'under_review' ? 'Under Review' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
        <span className="text-xs text-gray-400 ml-auto">{filtered.length} agreements shown</span>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-xs">
        {Object.entries(STATUS_COLORS).map(([status, color]) => (
          <div key={status} className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
            <span className="text-gray-600 capitalize">{status.replace('_', ' ')}</span>
          </div>
        ))}
        <div className="flex items-center gap-1.5 ml-2 border-l border-gray-200 pl-4">
          <div className="w-3 h-3 rounded-full border border-amber-400 bg-amber-100" />
          <span className="text-amber-600 font-medium">Expiring soon</span>
        </div>
      </div>

      {/* Map */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden" style={{ height: '60vh', minHeight: 440 }}>
        <MapContainer center={center} zoom={13} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />
          {filtered.map(agr => {
            const expiring = isExpiringSoon(agr.expiryDate) && agr.status === 'approved';
            const sc = getSubCity(agr.subCityId);
            const wr = getWereda(agr.weredaId);
            return (
              <div key={agr.id}>
                {expiring && (
                  <Circle
                    center={[agr.coordinates.lat, agr.coordinates.lng]}
                    radius={60}
                    pathOptions={{ color: '#D97706', fillColor: '#FEF3C7', fillOpacity: 0.5, weight: 1.5 }}
                  />
                )}
                <Marker
                  position={[agr.coordinates.lat, agr.coordinates.lng]}
                  icon={makeIcon(STATUS_COLORS[agr.status] ?? '#999', agr.buildingFloors.toString())}
                >
                  <Popup maxWidth={240}>
                    <div className="text-xs space-y-1.5 py-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <TierBadge tier={agr.tier} />
                        <StatusBadge status={agr.status} />
                        {expiring && <span className="text-amber-600 font-semibold">⚠ Expiring</span>}
                      </div>
                      <p className="font-bold text-sm text-gray-900">{agr.buildingName}</p>
                      <p className="text-gray-600">{agr.agreementNumber}</p>
                      <p className="text-gray-500">{agr.applicantName}</p>
                      <p className="text-gray-400">{sc?.name} / {wr?.name}</p>
                      <p className="text-gray-400">{agr.buildingFloors} floor · {agr.buildingType}</p>
                      {agr.expiryDate && <p className="text-gray-500">Expires: {formatDate(agr.expiryDate)}</p>}
                      <button
                        onClick={() => navigate(`/agreements/${agr.id}`)}
                        className="mt-2 w-full text-center text-xs font-semibold text-white bg-primary hover:bg-primary-dark px-3 py-1.5 rounded-lg transition-colors block"
                      >
                        View Agreement →
                      </button>
                    </div>
                  </Popup>
                </Marker>
              </div>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}
