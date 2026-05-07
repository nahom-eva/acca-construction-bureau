import { useState, useId } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../store/AppContext';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { SUB_CITIES, WEREDAS, getFloorTier, calculateServiceFee } from '../data/mockData';
import { formatCurrency } from '../lib/utils';
import type { Agreement } from '../types';

const BUILDING_TYPES = ['Residential', 'Commercial', 'Industrial', 'Hospitality', 'Educational', 'Healthcare', 'Mixed-Use', 'Government'];

export default function NewAgreement() {
  const { addAgreement, currentUser } = useApp();
  const navigate = useNavigate();
  const uid = useId();

  const [form, setForm] = useState({
    applicantName: currentUser.role === 'customer' ? currentUser.name : '',
    applicantPhone: currentUser.role === 'customer' ? '+251 911 234 567' : '',
    applicantEmail: currentUser.role === 'customer' ? 'dawit.m@email.com' : '',
    buildingName: '',
    address: '',
    buildingFloors: 1,
    buildingType: 'Residential',
    subCityId: currentUser.subCityId ?? SUB_CITIES[0].id,
    weredaId: currentUser.weredaId ?? '',
    lat: '8.5410',
    lng: '39.2680',
  });
  const [submitted, setSubmitted] = useState(false);
  const [fileNames, setFileNames] = useState<string[]>([]);

  const tier = getFloorTier(form.buildingFloors);
  const fee = calculateServiceFee(form.buildingFloors);
  const availableWeredas = WEREDAS.filter(w => w.subCityId === form.subCityId);

  const tierInfo = {
    wereda:  { label: 'Wereda Office',   color: 'border-red-200 bg-red-50 text-red-800',  desc: '0–2 floors processed at Wereda level.' },
    subcity: { label: 'Sub-City Office', color: 'border-orange-200 bg-orange-50 text-orange-800', desc: '3–5 floors processed at Sub-City level.' },
    city:    { label: 'City Bureau',     color: 'border-red-600 bg-red-50 text-red-900',  desc: '6–20 floors processed at City level.' },
  }[tier];

  function set(k: keyof typeof form, v: string | number) {
    setForm(f => ({ ...f, [k]: v }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const id = `agr_new_${Date.now()}`;
    const weredaId = form.weredaId || availableWeredas[0]?.id || '';
    const newAgr: Agreement = {
      id,
      agreementNumber: `ACCA-2024-${String(Math.floor(Math.random() * 900) + 100)}`,
      applicantName: form.applicantName,
      applicantPhone: form.applicantPhone,
      applicantEmail: form.applicantEmail,
      buildingName: form.buildingName,
      address: form.address,
      buildingFloors: form.buildingFloors,
      buildingType: form.buildingType,
      tier,
      weredaId,
      subCityId: form.subCityId,
      status: 'pending',
      submittedAt: new Date().toISOString().split('T')[0],
      coordinates: { lat: parseFloat(form.lat) || 8.541, lng: parseFloat(form.lng) || 39.268 },
      serviceFee: fee,
      feePaid: false,
      files: fileNames.map((name, i) => ({
        id: `f_new_${i}`,
        name,
        type: name.endsWith('.rvt') ? 'revit' : name.endsWith('.dwg') ? 'cad' : 'pdf',
        size: `${(Math.random() * 5 + 0.5).toFixed(1)} MB`,
        uploadedAt: new Date().toISOString().split('T')[0],
      })),
    };
    addAgreement(newAgr);
    setSubmitted(true);
    setTimeout(() => navigate(`/agreements/${id}`), 1800);
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-3xl mb-4">✅</div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Application Submitted!</h2>
        <p className="text-gray-500 text-sm">Redirecting to your agreement…</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <div>
        <button onClick={() => navigate('/agreements')} className="text-sm text-gray-400 hover:text-gray-700 mb-2 flex items-center gap-1">
          ← Back
        </button>
        <h2 className="text-xl font-bold text-gray-900">New Building Agreement Application</h2>
        <p className="text-sm text-gray-500 mt-1">Fill in the details below. The service tier is automatically determined by building height.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Tier indicator */}
        <div className={`border-2 rounded-xl p-4 ${tierInfo.color}`}>
          <div className="flex items-center gap-3">
            <span className="text-2xl">🏢</span>
            <div>
              <p className="text-sm font-bold">This application goes to: {tierInfo.label}</p>
              <p className="text-xs mt-0.5 opacity-80">{tierInfo.desc}</p>
            </div>
            <div className="ml-auto text-right">
              <p className="text-xs opacity-70">Estimated Service Fee</p>
              <p className="text-lg font-bold">{formatCurrency(fee)}</p>
            </div>
          </div>
        </div>

        <Card>
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Applicant Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: 'Full Name *', key: 'applicantName', type: 'text', required: true },
              { label: 'Phone *', key: 'applicantPhone', type: 'tel', required: true },
              { label: 'Email', key: 'applicantEmail', type: 'email', required: false },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-xs font-medium text-gray-600 mb-1">{f.label}</label>
                <input
                  type={f.type}
                  required={f.required}
                  value={(form as Record<string, string | number>)[f.key] as string}
                  onChange={e => set(f.key as keyof typeof form, e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Building Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Building Name *</label>
              <input
                required
                value={form.buildingName}
                onChange={e => set('buildingName', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Building Type *</label>
              <select
                value={form.buildingType}
                onChange={e => set('buildingType', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                {BUILDING_TYPES.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Number of Floors *</label>
              <input
                type="number"
                min={1}
                max={20}
                required
                value={form.buildingFloors}
                onChange={e => set('buildingFloors', parseInt(e.target.value) || 1)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              <p className="text-xs text-gray-400 mt-1">1–2: Wereda · 3–5: Sub-City · 6–20: City</p>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Full Address *</label>
              <input
                required
                value={form.address}
                onChange={e => set('address', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Location (Administrative)</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Sub-City *</label>
              <select
                value={form.subCityId}
                onChange={e => set('subCityId', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                disabled={!!currentUser.subCityId}
              >
                {SUB_CITIES.map(sc => <option key={sc.id} value={sc.id}>{sc.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Wereda *</label>
              <select
                value={form.weredaId || availableWeredas[0]?.id}
                onChange={e => set('weredaId', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
                disabled={!!currentUser.weredaId}
              >
                {availableWeredas.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Latitude (X)</label>
              <input
                type="number"
                step="0.0001"
                value={form.lat}
                onChange={e => set('lat', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Longitude (Y)</label>
              <input
                type="number"
                step="0.0001"
                value={form.lng}
                onChange={e => set('lng', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-sm font-semibold text-gray-900 mb-1">Documents & Design Files</h3>
          <p className="text-xs text-gray-400 mb-4">Upload CAD (.dwg), Revit (.rvt), or PDF files</p>
          <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl p-8 cursor-pointer hover:border-primary hover:bg-red-50/50 transition-colors">
            <span className="text-3xl mb-2">📁</span>
            <span className="text-sm font-medium text-gray-700">Click to select files</span>
            <span className="text-xs text-gray-400 mt-1">Supports .dwg, .rvt, .pdf, .png, .jpg</span>
            <input
              id={uid}
              type="file"
              multiple
              accept=".dwg,.rvt,.pdf,.png,.jpg,.jpeg"
              className="sr-only"
              onChange={e => setFileNames(Array.from(e.target.files ?? []).map(f => f.name))}
            />
          </label>
          {fileNames.length > 0 && (
            <div className="mt-3 space-y-1">
              {fileNames.map((name, i) => (
                <div key={i} className="text-xs text-gray-600 bg-gray-50 rounded px-3 py-1.5">{name}</div>
              ))}
            </div>
          )}
        </Card>

        <div className="flex gap-3 justify-end pt-2">
          <Button type="button" variant="secondary" onClick={() => navigate('/agreements')}>Cancel</Button>
          <Button type="submit" icon="📋">Submit Application</Button>
        </div>
      </form>
    </div>
  );
}
