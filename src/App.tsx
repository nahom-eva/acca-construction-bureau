import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './store/AppContext';
import { AppShell } from './components/layout/AppShell';
import RoleSelect from './pages/RoleSelect';
import BureauOverview from './pages/BureauOverview';
import Dashboard from './pages/Dashboard';
import Agreements from './pages/Agreements';
import AgreementDetail from './pages/AgreementDetail';
import NewAgreement from './pages/NewAgreement';
import MapView from './pages/MapView';
import Projects from './pages/Projects';
import ProfessionalCompetency from './pages/ProfessionalCompetency';
import Reports from './pages/Reports';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<RoleSelect />} />
          <Route element={<AppShell />}>
            <Route path="/bureau"          element={<BureauOverview />} />
            <Route path="/dashboard"       element={<Dashboard />} />
            <Route path="/agreements"      element={<Agreements />} />
            <Route path="/agreements/new"  element={<NewAgreement />} />
            <Route path="/agreements/:id"  element={<AgreementDetail />} />
            <Route path="/map"             element={<MapView />} />
            <Route path="/projects"        element={<Projects />} />
            <Route path="/professionals"   element={<ProfessionalCompetency />} />
            <Route path="/reports"         element={<Reports />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
