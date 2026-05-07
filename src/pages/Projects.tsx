import { useState } from 'react';
import { useApp } from '../store/AppContext';
import { Card } from '../components/ui/Card';
import { StatusBadge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { formatCurrency, formatDate, fileIcon } from '../lib/utils';
import { getSubCity } from '../data/mockData';
import type { Project, SupervisionReport } from '../types';

// ── Sub-component: Report submission form ──────────────────────────────────
function ReportForm({ project, onSubmit, onCancel }: {
  project: Project;
  onSubmit: (r: SupervisionReport) => void;
  onCancel: () => void;
}) {
  const { currentUser } = useApp();
  const [type, setType] = useState<'monthly' | 'quarterly'>('monthly');
  const [period, setPeriod] = useState('November 2024');
  const [progress, setProgress] = useState(project.reports[0]?.progressPercent ?? 50);
  const [observations, setObservations] = useState('');
  const [issues, setIssues] = useState('');
  const [nextSteps, setNextSteps] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({
      id: `rpt_new_${Date.now()}`,
      projectId: project.id,
      subCityId: currentUser.subCityId ?? '',
      type,
      period,
      submittedBy: currentUser.name,
      submittedAt: new Date().toISOString().split('T')[0],
      progressPercent: progress,
      observations,
      issues,
      nextSteps,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-3">
        <div className="flex-1">
          <label className="block text-xs font-medium text-gray-600 mb-1">Report Type</label>
          <select
            value={type}
            onChange={e => setType(e.target.value as 'monthly' | 'quarterly')}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <option value="monthly">Monthly Report</option>
            <option value="quarterly">Quarterly Report</option>
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-xs font-medium text-gray-600 mb-1">Period</label>
          <input
            value={period}
            onChange={e => setPeriod(e.target.value)}
            placeholder="e.g. November 2024 or Q4 2024"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Overall Progress: <span className="text-primary font-bold">{progress}%</span>
        </label>
        <input
          type="range" min={0} max={100} value={progress}
          onChange={e => setProgress(Number(e.target.value))}
          className="w-full accent-primary"
        />
        <div className="w-full bg-gray-100 rounded-full h-2 mt-1">
          <div className="h-2 rounded-full bg-primary transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Observations & Progress Notes *</label>
        <textarea
          required
          rows={3}
          value={observations}
          onChange={e => setObservations(e.target.value)}
          placeholder="Describe the work completed this period, current site conditions, and overall progress..."
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Issues & Challenges</label>
        <textarea
          rows={2}
          value={issues}
          onChange={e => setIssues(e.target.value)}
          placeholder="Any delays, material shortages, site conflicts, or escalations required..."
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Next Steps *</label>
        <textarea
          required
          rows={2}
          value={nextSteps}
          onChange={e => setNextSteps(e.target.value)}
          placeholder="Planned activities for the next reporting period..."
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none"
        />
      </div>

      <div className="flex gap-3 pt-2 justify-end">
        <Button type="button" variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button type="submit" icon="📤">Submit Report</Button>
      </div>
    </form>
  );
}

// ── Sub-component: Project detail ──────────────────────────────────────────
function ProjectDetail({ project, onBack }: { project: Project; onBack: () => void }) {
  const { currentUser, addReport } = useApp();
  const [showReportForm, setShowReportForm] = useState(false);
  const [reportSubmitted, setReportSubmitted] = useState(false);

  const isProjectHead = currentUser.role === 'city_project_head' || currentUser.role === 'bureau_head';
  const isSupervisor = currentUser.role === 'subcity_project_supervisor';
  const sc = getSubCity(project.subCityId);
  const pct = project.budget > 0 ? Math.round((project.spent / project.budget) * 100) : 0;
  const plan = project.supervisionPlan;

  function handleReportSubmit(report: SupervisionReport) {
    addReport(project.id, report);
    setShowReportForm(false);
    setReportSubmitted(true);
    setTimeout(() => setReportSubmitted(false), 3000);
  }

  return (
    <div className="space-y-5">
      <div>
        <button onClick={onBack} className="text-sm text-gray-400 hover:text-gray-700 mb-2 flex items-center gap-1">
          ← Back to Projects
        </button>
        <div className="flex items-start justify-between flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-3 flex-wrap mb-1">
              <h2 className="text-xl font-bold text-gray-900">{project.title}</h2>
              <StatusBadge status={project.status} />
            </div>
            <p className="text-sm text-gray-500">{project.projectNumber} · {sc?.name} Sub-City · {project.contractor}</p>
          </div>
          {isSupervisor && !showReportForm && (
            <Button onClick={() => setShowReportForm(true)} icon="📤">Submit Report</Button>
          )}
        </div>
      </div>

      {reportSubmitted && (
        <div className="bg-green-50 border border-green-200 rounded-xl px-5 py-3 flex items-center gap-3">
          <span className="text-green-600 text-lg">✅</span>
          <p className="text-sm font-semibold text-green-800">Report submitted successfully and sent to City Project Division.</p>
        </div>
      )}

      {/* Report submission form */}
      {showReportForm && (
        <Card>
          <h3 className="text-sm font-semibold text-gray-900 mb-4 border-b border-gray-100 pb-3">
            📤 Submit Supervision Report — {project.title}
          </h3>
          <ReportForm
            project={project}
            onSubmit={handleReportSubmit}
            onCancel={() => setShowReportForm(false)}
          />
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Overview */}
        <Card className="lg:col-span-2">
          <h3 className="text-sm font-semibold text-gray-900 mb-3 border-b border-gray-100 pb-3">Project Overview</h3>
          <p className="text-sm text-gray-600 mb-5">{project.description}</p>
          <dl className="grid grid-cols-2 gap-4">
            {[
              { label: 'Contractor', value: project.contractor },
              { label: 'Supervising Sub-City', value: sc?.name ?? '—' },
              { label: 'Start Date', value: formatDate(project.startDate) },
              { label: 'Expected End', value: formatDate(project.endDate) },
            ].map(({ label, value }) => (
              <div key={label}>
                <dt className="text-xs text-gray-400">{label}</dt>
                <dd className="text-sm font-medium text-gray-900 mt-0.5">{value}</dd>
              </div>
            ))}
          </dl>
        </Card>

        {/* Budget */}
        <Card>
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Budget Status</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Spent</span><span>{pct}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5">
                <div
                  className="h-2.5 rounded-full"
                  style={{ width: `${pct}%`, backgroundColor: pct > 90 ? '#DC2626' : pct > 70 ? '#D97706' : '#16A34A' }}
                />
              </div>
            </div>
            <div className="flex justify-between">
              <div>
                <p className="text-xs text-gray-400">Total Budget</p>
                <p className="text-sm font-bold text-gray-900">{formatCurrency(project.budget)}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">Spent</p>
                <p className="text-sm font-bold text-gray-900">{formatCurrency(project.spent)}</p>
              </div>
            </div>
            <div className="pt-2 border-t border-gray-100">
              <p className="text-xs text-gray-400">Remaining</p>
              <p className="text-lg font-bold text-green-700">{formatCurrency(project.budget - project.spent)}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Supervision Plan */}
      {plan && (
        <Card>
          <h3 className="text-sm font-semibold text-gray-900 mb-4 border-b border-gray-100 pb-3">
            Supervision Plan
            <span className="ml-2 text-xs font-normal text-gray-400">— {plan.supervisorName} · {plan.frequency === 'monthly' ? 'Monthly' : 'Bi-weekly'} reporting</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {plan.objectives.map(obj => (
              <div key={obj.id} className={`flex items-start gap-3 p-3 rounded-lg ${obj.done ? 'bg-green-50' : 'bg-gray-50'}`}>
                <span className={`mt-0.5 text-sm shrink-0 ${obj.done ? 'text-green-600' : 'text-gray-300'}`}>
                  {obj.done ? '✓' : '○'}
                </span>
                <span className={`text-sm ${obj.done ? 'text-green-800' : 'text-gray-600'}`}>{obj.text}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Supervision Reports — received (City view) or submitted (Supervisor view) */}
      <Card padding="none">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900">
            {isProjectHead ? 'Received Supervision Reports' : 'My Submitted Reports'}
            <span className="ml-2 text-xs font-normal text-gray-400">({project.reports.length})</span>
          </h3>
          {isProjectHead && project.reports.length > 0 && (
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
              {project.reports.filter(r => r.type === 'monthly').length} monthly · {project.reports.filter(r => r.type === 'quarterly').length} quarterly
            </span>
          )}
        </div>
        <div className="divide-y divide-gray-50">
          {project.reports.length === 0 ? (
            <div className="px-5 py-8 text-center text-gray-400 text-sm">
              No reports submitted yet.
              {isSupervisor && <p className="mt-1 text-xs">Use "Submit Report" above to send your first report.</p>}
            </div>
          ) : project.reports.map(r => {
            const pctColor = r.progressPercent >= 80 ? 'text-green-700' : r.progressPercent >= 50 ? 'text-amber-700' : 'text-red-600';
            return (
              <div key={r.id} className="px-5 py-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${r.type === 'quarterly' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                        {r.type === 'quarterly' ? 'Quarterly' : 'Monthly'}
                      </span>
                      <span className="text-sm font-semibold text-gray-900">{r.period}</span>
                    </div>
                    <p className="text-xs text-gray-400">Submitted by {r.submittedBy} · {formatDate(r.submittedAt)}</p>
                    {isProjectHead && <p className="text-xs text-gray-400">From: {getSubCity(r.subCityId)?.name} Sub-City</p>}
                  </div>
                  <div className="text-right">
                    <p className={`text-xl font-bold ${pctColor}`}>{r.progressPercent}%</p>
                    <p className="text-xs text-gray-400">Progress</p>
                  </div>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5 mb-4">
                  <div className="h-1.5 rounded-full bg-primary" style={{ width: `${r.progressPercent}%` }} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <p className="font-semibold text-gray-700 mb-1">Observations</p>
                    <p className="text-gray-600 leading-relaxed">{r.observations}</p>
                  </div>
                  {r.issues && (
                    <div>
                      <p className="font-semibold text-gray-700 mb-1">Issues</p>
                      <p className="text-gray-600 leading-relaxed">{r.issues}</p>
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-gray-700 mb-1">Next Steps</p>
                    <p className="text-gray-600 leading-relaxed">{r.nextSteps}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Documents (City Project Head only) */}
      {isProjectHead && (
        <Card>
          <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3">
            <h3 className="text-sm font-semibold text-gray-900">Project Documents ({project.documents.length})</h3>
            <Button size="sm" icon="＋">Upload Document</Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {project.documents.map(doc => (
              <div key={doc.id} className="flex items-start gap-3 p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                <span className="text-2xl mt-0.5">{fileIcon('pdf')}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{doc.name}</p>
                  <p className="text-xs text-gray-400">v{doc.version} · {doc.size} · {formatDate(doc.uploadedAt)}</p>
                  <p className="text-xs text-gray-400">by {doc.uploadedBy}</p>
                </div>
                <div className="flex flex-col gap-1 items-end">
                  <span className="text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded capitalize">{doc.category}</span>
                  <button className="text-xs text-primary hover:underline">Download</button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

// ── Main Projects page ─────────────────────────────────────────────────────
export default function Projects() {
  const { visibleProjects, currentUser } = useApp();
  const [selected, setSelected] = useState<Project | null>(null);

  const isProjectHead = currentUser.role === 'city_project_head' || currentUser.role === 'bureau_head';
  const isSupervisor = currentUser.role === 'subcity_project_supervisor';

  if (selected) {
    return <ProjectDetail project={selected} onBack={() => setSelected(null)} />;
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Project Division</h2>
          <p className="text-sm text-gray-500">
            {isProjectHead
              ? 'Government construction projects — manage details, review supervision reports'
              : 'Projects assigned to your sub-city — supervise and submit monthly/quarterly reports'}
          </p>
        </div>
        {isProjectHead && <Button icon="＋">New Project</Button>}
      </div>

      {isSupervisor && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl px-5 py-3 flex items-center gap-3">
          <span className="text-blue-600 text-lg">📋</span>
          <div>
            <p className="text-sm font-semibold text-blue-800">Your supervision area: {getSubCity(currentUser.subCityId ?? '')?.name} Sub-City</p>
            <p className="text-xs text-blue-600">Click a project to view your supervision plan or submit a monthly/quarterly report to the City Project Division.</p>
          </div>
        </div>
      )}

      {visibleProjects.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 px-5 py-16 text-center text-gray-400">
          No projects assigned to your area.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {visibleProjects.map(p => {
            const sc = getSubCity(p.subCityId);
            const pct = p.budget > 0 ? Math.round((p.spent / p.budget) * 100) : 0;
            const latestReport = p.reports[0];
            const pendingReports = isSupervisor && p.reports.filter(r => r.subCityId === currentUser.subCityId).length === 0;

            return (
              <button
                key={p.id}
                onClick={() => setSelected(p)}
                className="text-left bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md hover:border-primary/30 transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <StatusBadge status={p.status} />
                  <span className="text-primary text-sm group-hover:translate-x-1 transition-transform">→</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{p.title}</h3>
                <p className="text-xs text-gray-500 mb-1">{p.projectNumber}</p>
                <p className="text-xs text-gray-400 mb-4">
                  {sc?.name} Sub-City · {p.contractor !== 'TBD' ? p.contractor : 'Contractor TBD'}
                </p>

                <div className="mb-3">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Budget utilization</span><span>{pct}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div
                      className="h-1.5 rounded-full"
                      style={{ width: `${pct}%`, backgroundColor: pct > 90 ? '#DC2626' : pct > 70 ? '#D97706' : '#16A34A' }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-400">{p.documents.length} doc{p.documents.length !== 1 ? 's' : ''} · {p.reports.length} report{p.reports.length !== 1 ? 's' : ''}</span>
                  {isSupervisor && pendingReports && (
                    <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-semibold">Report due</span>
                  )}
                  {latestReport && !isSupervisor && (
                    <span className="text-gray-400">Last report: {latestReport.period}</span>
                  )}
                  {formatCurrency(p.budget)}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
