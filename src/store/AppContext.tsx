import { createContext, useContext, useState, type ReactNode } from 'react';
import type { DemoUser, Agreement, Project, SupervisionReport } from '../types';
import { DEMO_USERS, AGREEMENTS, PROJECTS } from '../data/mockData';

interface AppContextValue {
  currentUser: DemoUser;
  setCurrentUser: (user: DemoUser) => void;
  demoUsers: DemoUser[];
  // Building Official
  agreements: Agreement[];
  addAgreement: (a: Agreement) => void;
  visibleAgreements: Agreement[];
  // Project Division
  projects: Project[];
  addReport: (projectId: string, report: SupervisionReport) => void;
  visibleProjects: Project[];
  canAccessBO: boolean;    // Building Official division access
  canAccessProj: boolean;  // Project division access
  isBureauHead: boolean;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<DemoUser>(DEMO_USERS[0]);
  const [agreements, setAgreements] = useState<Agreement[]>(AGREEMENTS);
  const [projects, setProjects] = useState<Project[]>(PROJECTS);

  const addAgreement = (a: Agreement) => setAgreements(prev => [a, ...prev]);

  const addReport = (projectId: string, report: SupervisionReport) => {
    setProjects(prev => prev.map(p =>
      p.id === projectId ? { ...p, reports: [report, ...p.reports] } : p,
    ));
  };

  // Which divisions this role can access
  const isBureauHead = currentUser.role === 'bureau_head';

  const canAccessBO = isBureauHead || [
    'city_building_official',
    'subcity_building_official',
    'wereda_officer',
    'customer',
  ].includes(currentUser.role);

  const canAccessProj = isBureauHead || [
    'city_project_head',
    'subcity_project_supervisor',
  ].includes(currentUser.role);

  // Filter agreements by role
  const visibleAgreements = agreements.filter(agr => {
    if (!canAccessBO) return false;
    if (isBureauHead || currentUser.role === 'city_building_official') return true;
    if (currentUser.role === 'subcity_building_official') return agr.subCityId === currentUser.subCityId;
    if (currentUser.role === 'wereda_officer') return agr.weredaId === currentUser.weredaId;
    if (currentUser.role === 'customer') return agr.applicantName === currentUser.name;
    return false;
  });

  // Filter projects by role
  const visibleProjects = projects.filter(p => {
    if (!canAccessProj) return false;
    if (isBureauHead || currentUser.role === 'city_project_head') return true;
    if (currentUser.role === 'subcity_project_supervisor') return p.subCityId === currentUser.subCityId;
    return false;
  });

  return (
    <AppContext.Provider value={{
      currentUser, setCurrentUser, demoUsers: DEMO_USERS,
      agreements, addAgreement, visibleAgreements,
      projects, addReport, visibleProjects,
      canAccessBO, canAccessProj, isBureauHead,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
