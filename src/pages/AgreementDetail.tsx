import { useParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useApp } from '../store/AppContext';
import { StatusBadge, TierBadge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { formatCurrency, formatDate, isExpiringSoon, fileIcon } from '../lib/utils';
import { getSubCity, getWereda, getTierLabel } from '../data/mockData';
import type { AgreementStatus } from '../types';

const STATUS_FLOW: AgreementStatus[] = ['pending', 'under_review', 'approved'];

export default function AgreementDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { agreements, currentUser } = useApp();

  const agr = agreements.find(a => a.id === id);
  if (!agr) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 mb-4">Agreement not found.</p>
        <Button onClick={() => navigate('/agreements')} variant="secondary">← Back</Button>
      </div>
    );
  }

  const sc = getSubCity(agr.subCityId);
  const wr = getWereda(agr.weredaId);
  const expiring = isExpiringSoon(agr.expiryDate) && agr.status === 'approved';
  const canReview = ['city_admin', 'subcity_officer', 'wereda_officer'].includes(currentUser.role);
  const stepIdx = STATUS_FLOW.indexOf(agr.status as AgreementStatus);

  return (
    <div className="space-y-5">
      {/* Back + header */}
      <div className="flex items-start justify-between">
        <div>
          <button onClick={() => navigate('/agreements')} className="text-sm text-gray-400 hover:text-gray-700 mb-2 flex items-center gap-1">
            ← Back to Agreements
          </button>
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-xl font-bold text-gray-900">{agr.agreementNumber}</h2>
            <TierBadge tier={agr.tier} />
            <StatusBadge status={agr.status} />
            {expiring && <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">⚠ Expiring soon</span>}
          </div>
          <p className="text-sm text-gray-500 mt-1">{agr.buildingName} · {agr.buildingType} · {agr.buildingFloors} floor{agr.buildingFloors !== 1 ? 's' : ''}</p>
        </div>
        {canReview && agr.status === 'under_review' && (
          <div className="flex gap-2">
            <Button variant="secondary" size="sm">Reject</Button>
            <Button size="sm">Approve ✓</Button>
          </div>
        )}
      </div>

      {/* Approval progress */}
      {['pending', 'under_review', 'approved'].includes(agr.status) && (
        <Card padding="sm">
          <div className="flex items-center gap-0">
            {['Submitted', 'Under Review', 'Approved'].map((label, i) => (
              <div key={label} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors ${
                    i <= stepIdx ? 'bg-primary border-primary text-white' : 'bg-white border-gray-200 text-gray-400'
                  }`}>
                    {i < stepIdx ? '✓' : i + 1}
                  </div>
                  <span className={`text-xs mt-1.5 font-medium ${i <= stepIdx ? 'text-primary' : 'text-gray-400'}`}>{label}</span>
                </div>
                {i < 2 && (
                  <div className={`h-0.5 flex-1 mx-1 mb-4 ${i < stepIdx ? 'bg-primary' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Applicant info */}
        <Card>
          <h3 className="text-sm font-semibold text-gray-900 mb-4 border-b border-gray-100 pb-3">Applicant Information</h3>
          <dl className="space-y-3">
            {[
              { label: 'Full Name', value: agr.applicantName },
              { label: 'Phone', value: agr.applicantPhone },
              { label: 'Email', value: agr.applicantEmail },
              { label: 'Address', value: agr.address },
              { label: 'Building Name', value: agr.buildingName },
              { label: 'Building Type', value: agr.buildingType },
              { label: 'Floors', value: `${agr.buildingFloors} floor${agr.buildingFloors !== 1 ? 's' : ''}` },
            ].map(({ label, value }) => (
              <div key={label} className="flex gap-4">
                <dt className="text-xs text-gray-400 w-24 shrink-0 pt-0.5">{label}</dt>
                <dd className="text-sm text-gray-900 flex-1">{value}</dd>
              </div>
            ))}
          </dl>
        </Card>

        {/* Agreement details */}
        <Card>
          <h3 className="text-sm font-semibold text-gray-900 mb-4 border-b border-gray-100 pb-3">Agreement Details</h3>
          <dl className="space-y-3">
            {[
              { label: 'Service Level', value: getTierLabel(agr.tier) },
              { label: 'Sub-City', value: sc?.name ?? '—' },
              { label: 'Wereda', value: wr?.name ?? '—' },
              { label: 'Submitted', value: formatDate(agr.submittedAt) },
              { label: 'Start Date', value: formatDate(agr.startDate) },
              { label: 'Expiry Date', value: agr.expiryDate ? formatDate(agr.expiryDate) : '—' },
              { label: 'Reviewed By', value: agr.reviewedBy ?? '—' },
            ].map(({ label, value }) => (
              <div key={label} className="flex gap-4">
                <dt className="text-xs text-gray-400 w-24 shrink-0 pt-0.5">{label}</dt>
                <dd className="text-sm text-gray-900 flex-1">{value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Service Fee</span>
              <div className="text-right">
                <p className="text-lg font-bold text-gray-900">{formatCurrency(agr.serviceFee)}</p>
                <p className={`text-xs font-medium ${agr.feePaid ? 'text-green-600' : 'text-red-500'}`}>
                  {agr.feePaid ? '✓ Paid' : '✗ Unpaid'}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Map */}
        <Card padding="none" className="overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">Site Location</h3>
            <a
              href={`https://maps.google.com/?q=${agr.coordinates.lat},${agr.coordinates.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary hover:underline"
            >
              Open in Google Maps →
            </a>
          </div>
          <div style={{ height: 280 }}>
            <MapContainer
              center={[agr.coordinates.lat, agr.coordinates.lng]}
              zoom={15}
              style={{ height: '100%', width: '100%' }}
              scrollWheelZoom={false}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={[agr.coordinates.lat, agr.coordinates.lng]}>
                <Popup>
                  <div className="text-xs">
                    <p className="font-bold">{agr.buildingName}</p>
                    <p>{agr.agreementNumber}</p>
                    <p>{agr.address}</p>
                    <p className="text-gray-500 mt-1">{agr.coordinates.lat.toFixed(4)}°N, {agr.coordinates.lng.toFixed(4)}°E</p>
                  </div>
                </Popup>
              </Marker>
            </MapContainer>
          </div>
          <div className="px-5 py-2 bg-gray-50 border-t border-gray-100 text-xs text-gray-400">
            📍 {agr.coordinates.lat.toFixed(5)}°N, {agr.coordinates.lng.toFixed(5)}°E
          </div>
        </Card>

        {/* Files */}
        <Card>
          <h3 className="text-sm font-semibold text-gray-900 mb-4 border-b border-gray-100 pb-3">
            Submitted Documents ({agr.files.length})
          </h3>
          <div className="space-y-2">
            {agr.files.map(file => (
              <div key={file.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <span className="text-xl shrink-0">{fileIcon(file.type)}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{file.name}</p>
                  <p className="text-xs text-gray-400">{file.size} · Uploaded {formatDate(file.uploadedAt)}</p>
                </div>
                <button className="text-xs text-primary hover:underline shrink-0">Download</button>
              </div>
            ))}
            {agr.files.length === 0 && (
              <p className="text-xs text-gray-400 text-center py-4">No files uploaded.</p>
            )}
          </div>
          {agr.notes && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-lg">
              <p className="text-xs font-semibold text-blue-700 mb-1">Notes / Remarks</p>
              <p className="text-xs text-blue-800">{agr.notes}</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
