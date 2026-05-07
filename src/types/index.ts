export type Role =
  | 'bureau_head'             // City: boss of both divisions
  | 'city_building_official'  // City: Building Official Division head
  | 'city_project_head'       // City: Project Division head
  | 'subcity_building_official' // Sub-City: Building Official officer
  | 'subcity_project_supervisor' // Sub-City: Project Division supervisor
  | 'wereda_officer'          // Wereda: Building Official (0-2 floors)
  | 'customer';

export type Division = 'building_official' | 'project';
export type Tier = 'city' | 'subcity' | 'wereda';
export type AgreementStatus = 'pending' | 'under_review' | 'approved' | 'rejected' | 'expired';
export type DocumentCategory = 'design' | 'permit' | 'contract' | 'inspection' | 'report';
export type ProjectStatus = 'planning' | 'design' | 'construction' | 'completed' | 'on_hold';
export type FileType = 'cad' | 'revit' | 'pdf' | 'image';
export type ReportType = 'monthly' | 'quarterly';

export interface SubCity {
  id: string;
  name: string;
}

export interface Wereda {
  id: string;
  name: string;
  subCityId: string;
}

export interface DemoUser {
  id: string;
  name: string;
  role: Role;
  title: string;
  division?: Division;
  subCityId?: string;
  weredaId?: string;
  initials: string;
}

export interface AgreementFile {
  id: string;
  name: string;
  type: FileType;
  size: string;
  uploadedAt: string;
}

export interface Agreement {
  id: string;
  agreementNumber: string;
  applicantName: string;
  applicantPhone: string;
  applicantEmail: string;
  buildingName: string;
  address: string;
  buildingFloors: number;
  buildingType: string;
  tier: Tier;
  weredaId: string;
  subCityId: string;
  status: AgreementStatus;
  submittedAt: string;
  startDate?: string;
  expiryDate?: string;
  coordinates: { lat: number; lng: number };
  serviceFee: number;
  feePaid: boolean;
  files: AgreementFile[];
  notes?: string;
  reviewedBy?: string;
}

export interface ProjectDocument {
  id: string;
  name: string;
  category: DocumentCategory;
  version: string;
  uploadedAt: string;
  uploadedBy: string;
  size: string;
}

export interface SupervisionObjective {
  id: string;
  text: string;
  done: boolean;
}

export interface SupervisionPlan {
  subCityId: string;
  supervisorName: string;
  startDate: string;
  frequency: 'monthly' | 'biweekly';
  objectives: SupervisionObjective[];
}

export interface SupervisionReport {
  id: string;
  projectId: string;
  subCityId: string;
  type: ReportType;
  period: string;
  submittedBy: string;
  submittedAt: string;
  progressPercent: number;
  observations: string;
  issues: string;
  nextSteps: string;
}

export interface Project {
  id: string;
  projectNumber: string;
  title: string;
  subCityId: string; // which sub-city supervises this
  status: ProjectStatus;
  startDate: string;
  endDate?: string;
  contractor: string;
  budget: number;
  spent: number;
  documents: ProjectDocument[];
  description: string;
  supervisionPlan?: SupervisionPlan;
  reports: SupervisionReport[];
}
