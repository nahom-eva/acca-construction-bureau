import type {
  SubCity, Wereda, DemoUser, Agreement, Project, SupervisionReport,
} from '../types';

export const SUB_CITIES: SubCity[] = [
  { id: 'sc_boku',        name: 'Boku' },
  { id: 'sc_dembela',     name: 'Dembela' },
  { id: 'sc_alagae',      name: 'Alagae' },
  { id: 'sc_dirre',       name: 'Dirre' },
  { id: 'sc_ageremariam', name: 'Ageremariam' },
  { id: 'sc_hawas',       name: 'Hawas' },
];

export const WEREDAS: Wereda[] = [
  { id: 'wr_boku_01', name: 'Boku 01',        subCityId: 'sc_boku' },
  { id: 'wr_boku_02', name: 'Boku 02',        subCityId: 'sc_boku' },
  { id: 'wr_boku_03', name: 'Boku 03',        subCityId: 'sc_boku' },
  { id: 'wr_dem_01',  name: 'Dembela 01',     subCityId: 'sc_dembela' },
  { id: 'wr_dem_02',  name: 'Dembela 02',     subCityId: 'sc_dembela' },
  { id: 'wr_dem_03',  name: 'Dembela 03',     subCityId: 'sc_dembela' },
  { id: 'wr_ala_01',  name: 'Alagae 01',      subCityId: 'sc_alagae' },
  { id: 'wr_ala_02',  name: 'Alagae 02',      subCityId: 'sc_alagae' },
  { id: 'wr_dir_01',  name: 'Dirre 01',       subCityId: 'sc_dirre' },
  { id: 'wr_dir_02',  name: 'Dirre 02',       subCityId: 'sc_dirre' },
  { id: 'wr_age_01',  name: 'Ageremariam 01', subCityId: 'sc_ageremariam' },
  { id: 'wr_age_02',  name: 'Ageremariam 02', subCityId: 'sc_ageremariam' },
  { id: 'wr_haw_01',  name: 'Hawas 01',       subCityId: 'sc_hawas' },
  { id: 'wr_haw_02',  name: 'Hawas 02',       subCityId: 'sc_hawas' },
];

export const DEMO_USERS: DemoUser[] = [
  // ── City level ──────────────────────────────────────────────
  {
    id: 'u_bureau',
    name: 'Ato Bekele Tadesse',
    role: 'bureau_head',
    title: 'Bureau Head — Adama City Construction Bureau',
    initials: 'BT',
  },
  {
    id: 'u_city_bo',
    name: 'W/ro Tigist Alemu',
    role: 'city_building_official',
    division: 'building_official',
    title: 'Head, Building Official Division — City',
    initials: 'TA',
  },
  {
    id: 'u_city_proj',
    name: 'Ato Girma Haile',
    role: 'city_project_head',
    division: 'project',
    title: 'Head, Project Division — City',
    initials: 'GH',
  },
  // ── Sub-City level ───────────────────────────────────────────
  {
    id: 'u_sc_bo_boku',
    name: 'Ato Samuel Tesfaye',
    role: 'subcity_building_official',
    division: 'building_official',
    title: 'Building Official Officer — Boku Sub-City',
    subCityId: 'sc_boku',
    initials: 'ST',
  },
  {
    id: 'u_sc_proj_boku',
    name: 'W/ro Rahel Tesfaye',
    role: 'subcity_project_supervisor',
    division: 'project',
    title: 'Project Supervisor — Boku Sub-City',
    subCityId: 'sc_boku',
    initials: 'RT',
  },
  {
    id: 'u_sc_bo_dem',
    name: 'Ato Abreham Lemma',
    role: 'subcity_building_official',
    division: 'building_official',
    title: 'Building Official Officer — Dembela Sub-City',
    subCityId: 'sc_dembela',
    initials: 'AL',
  },
  // ── Wereda level ─────────────────────────────────────────────
  {
    id: 'u_wr_boku_01',
    name: 'W/rt Meron Kebede',
    role: 'wereda_officer',
    division: 'building_official',
    title: 'Building Official Officer — Boku 01 Wereda',
    subCityId: 'sc_boku',
    weredaId: 'wr_boku_01',
    initials: 'MK',
  },
  // ── Customer ─────────────────────────────────────────────────
  {
    id: 'u_customer',
    name: 'Ato Dawit Mulugeta',
    role: 'customer',
    title: 'Applicant / Customer',
    initials: 'DM',
  },
];

export const AGREEMENTS: Agreement[] = [
  {
    id: 'agr_001', agreementNumber: 'ACCA-2024-0001',
    applicantName: 'Ato Dawit Mulugeta', applicantPhone: '+251 911 234 567', applicantEmail: 'dawit.m@email.com',
    buildingName: 'Mulugeta Residence', address: 'Boku 01, Near Adama Market',
    buildingFloors: 2, buildingType: 'Residential', tier: 'wereda',
    weredaId: 'wr_boku_01', subCityId: 'sc_boku',
    status: 'approved', submittedAt: '2024-01-15', startDate: '2024-02-01', expiryDate: '2025-02-01',
    coordinates: { lat: 8.5410, lng: 39.2680 }, serviceFee: 1500, feePaid: true,
    files: [
      { id: 'f1', name: 'Site_Plan_v2.dwg', type: 'cad', size: '2.4 MB', uploadedAt: '2024-01-15' },
      { id: 'f2', name: 'Structural_Design.pdf', type: 'pdf', size: '1.1 MB', uploadedAt: '2024-01-15' },
    ],
    reviewedBy: 'W/rt Meron Kebede',
  },
  {
    id: 'agr_002', agreementNumber: 'ACCA-2024-0002',
    applicantName: 'W/ro Hiwot Girma', applicantPhone: '+251 922 345 678', applicantEmail: 'hiwot.g@business.com',
    buildingName: 'Girma Commercial Center', address: 'Dembela 02, Adama-Mojo Road',
    buildingFloors: 5, buildingType: 'Commercial', tier: 'subcity',
    weredaId: 'wr_dem_02', subCityId: 'sc_dembela',
    status: 'approved', submittedAt: '2024-02-10', startDate: '2024-03-01', expiryDate: '2025-09-01',
    coordinates: { lat: 8.5380, lng: 39.2720 }, serviceFee: 8500, feePaid: true,
    files: [
      { id: 'f3', name: 'Architectural_Drawings.rvt', type: 'revit', size: '18.2 MB', uploadedAt: '2024-02-10' },
      { id: 'f4', name: 'Structural_Analysis.pdf', type: 'pdf', size: '3.3 MB', uploadedAt: '2024-02-12' },
    ],
    reviewedBy: 'Ato Abreham Lemma',
    notes: 'Approved after structural review. Fire safety clearance obtained.',
  },
  {
    id: 'agr_003', agreementNumber: 'ACCA-2024-0003',
    applicantName: 'Ato Biruk Haile', applicantPhone: '+251 933 456 789', applicantEmail: 'biruk.h@gmail.com',
    buildingName: 'Haile Tower', address: 'City Center, Adama Main Boulevard',
    buildingFloors: 14, buildingType: 'Mixed-Use', tier: 'city',
    weredaId: 'wr_ala_01', subCityId: 'sc_alagae',
    status: 'under_review', submittedAt: '2024-11-20',
    coordinates: { lat: 8.5455, lng: 39.2710 }, serviceFee: 42000, feePaid: true,
    files: [
      { id: 'f5', name: 'Full_BIM_Model.rvt', type: 'revit', size: '84.7 MB', uploadedAt: '2024-11-20' },
      { id: 'f6', name: 'EIA_Report.pdf', type: 'pdf', size: '5.8 MB', uploadedAt: '2024-11-21' },
      { id: 'f7', name: 'Foundation_Plan.dwg', type: 'cad', size: '4.1 MB', uploadedAt: '2024-11-20' },
    ],
    notes: 'EIA under environmental desk review.',
  },
  {
    id: 'agr_004', agreementNumber: 'ACCA-2024-0004',
    applicantName: 'Ato Yonas Bekele', applicantPhone: '+251 944 567 890', applicantEmail: 'yonas.b@construct.et',
    buildingName: 'Bekele Apartments', address: 'Boku 02, Block 7',
    buildingFloors: 1, buildingType: 'Residential', tier: 'wereda',
    weredaId: 'wr_boku_02', subCityId: 'sc_boku',
    status: 'expired', submittedAt: '2023-03-10', startDate: '2023-04-01', expiryDate: '2024-04-01',
    coordinates: { lat: 8.5430, lng: 39.2650 }, serviceFee: 1200, feePaid: true,
    files: [{ id: 'f8', name: 'Site_Plan.dwg', type: 'cad', size: '1.2 MB', uploadedAt: '2023-03-10' }],
    reviewedBy: 'W/rt Meron Kebede',
  },
  {
    id: 'agr_005', agreementNumber: 'ACCA-2024-0005',
    applicantName: 'W/ro Tigist Wolde', applicantPhone: '+251 955 678 901', applicantEmail: 'tigist.w@adama.com',
    buildingName: 'Wolde Hotel & Suites', address: 'Dirre 01, Tourism Zone',
    buildingFloors: 8, buildingType: 'Hospitality', tier: 'city',
    weredaId: 'wr_dir_01', subCityId: 'sc_dirre',
    status: 'approved', submittedAt: '2024-05-05', startDate: '2024-06-01', expiryDate: '2025-06-01',
    coordinates: { lat: 8.5360, lng: 39.2740 }, serviceFee: 28000, feePaid: true,
    files: [{ id: 'f9', name: 'Hotel_Design.rvt', type: 'revit', size: '62.3 MB', uploadedAt: '2024-05-05' }],
    reviewedBy: 'W/ro Tigist Alemu',
  },
  {
    id: 'agr_006', agreementNumber: 'ACCA-2024-0006',
    applicantName: 'Ato Mikiyas Solomon', applicantPhone: '+251 966 789 012', applicantEmail: 'mikiyas.s@email.com',
    buildingName: 'Solomon Family Home', address: 'Alagae 02, Residential Estate',
    buildingFloors: 2, buildingType: 'Residential', tier: 'wereda',
    weredaId: 'wr_ala_02', subCityId: 'sc_alagae',
    status: 'pending', submittedAt: '2024-12-01',
    coordinates: { lat: 8.5395, lng: 39.2760 }, serviceFee: 1500, feePaid: false,
    files: [{ id: 'f10', name: 'Site_Plan_Draft.pdf', type: 'pdf', size: '0.9 MB', uploadedAt: '2024-12-01' }],
  },
  {
    id: 'agr_007', agreementNumber: 'ACCA-2024-0007',
    applicantName: 'Ato Liya Kebede', applicantPhone: '+251 977 890 123', applicantEmail: 'liya.k@company.com',
    buildingName: 'Kebede Business Park', address: 'Hawas 01, Industrial Area',
    buildingFloors: 4, buildingType: 'Industrial', tier: 'subcity',
    weredaId: 'wr_haw_01', subCityId: 'sc_hawas',
    status: 'approved', submittedAt: '2024-07-18', startDate: '2024-08-01', expiryDate: '2025-01-15',
    coordinates: { lat: 8.5325, lng: 39.2695 }, serviceFee: 12000, feePaid: true,
    files: [{ id: 'f11', name: 'Industrial_Plan.dwg', type: 'cad', size: '5.6 MB', uploadedAt: '2024-07-18' }],
    reviewedBy: 'Ato Samuel Tesfaye',
  },
  {
    id: 'agr_008', agreementNumber: 'ACCA-2024-0008',
    applicantName: 'Ato Dagmawi Alemu', applicantPhone: '+251 988 901 234', applicantEmail: 'dagmawi.a@email.com',
    buildingName: 'Alemu Mall', address: 'Ageremariam 01, Commercial Hub',
    buildingFloors: 3, buildingType: 'Commercial', tier: 'subcity',
    weredaId: 'wr_age_01', subCityId: 'sc_ageremariam',
    status: 'rejected', submittedAt: '2024-09-12',
    coordinates: { lat: 8.5475, lng: 39.2620 }, serviceFee: 6500, feePaid: false,
    files: [{ id: 'f12', name: 'Mall_Design.pdf', type: 'pdf', size: '2.2 MB', uploadedAt: '2024-09-12' }],
    notes: 'Rejected: setback requirements not met. Resubmission invited after design revision.',
  },
  {
    id: 'agr_009', agreementNumber: 'ACCA-2024-0009',
    applicantName: 'Ato Dagmawi Wolde', applicantPhone: '+251 900 012 345', applicantEmail: 'dagmawi.w@business.et',
    buildingName: 'Wolde Towers', address: 'Boku 03, Near University',
    buildingFloors: 18, buildingType: 'Mixed-Use', tier: 'city',
    weredaId: 'wr_boku_03', subCityId: 'sc_boku',
    status: 'approved', submittedAt: '2024-08-01', startDate: '2024-09-01', expiryDate: '2025-03-10',
    coordinates: { lat: 8.5448, lng: 39.2735 }, serviceFee: 55000, feePaid: true,
    files: [
      { id: 'f13', name: 'Tower_BIM.rvt', type: 'revit', size: '132.4 MB', uploadedAt: '2024-08-01' },
      { id: 'f14', name: 'Geotechnical_Study.pdf', type: 'pdf', size: '7.2 MB', uploadedAt: '2024-08-02' },
    ],
    reviewedBy: 'W/ro Tigist Alemu',
  },
  {
    id: 'agr_010', agreementNumber: 'ACCA-2024-0010',
    applicantName: 'W/ro Selam Desta', applicantPhone: '+251 911 123 456', applicantEmail: 'selam.d@email.com',
    buildingName: 'Desta Guesthouse', address: 'Dembela 01, Kebele 03',
    buildingFloors: 2, buildingType: 'Residential', tier: 'wereda',
    weredaId: 'wr_dem_01', subCityId: 'sc_dembela',
    status: 'approved', submittedAt: '2024-10-05', startDate: '2024-10-20', expiryDate: '2025-10-20',
    coordinates: { lat: 8.5415, lng: 39.2698 }, serviceFee: 1500, feePaid: true,
    files: [{ id: 'f15', name: 'House_Plan.dwg', type: 'cad', size: '1.8 MB', uploadedAt: '2024-10-05' }],
    reviewedBy: 'W/rt Meron Kebede',
  },
];

const BOKU_REPORTS: SupervisionReport[] = [
  {
    id: 'rpt_001', projectId: 'prj_001', subCityId: 'sc_boku',
    type: 'monthly', period: 'October 2024',
    submittedBy: 'W/ro Rahel Tesfaye', submittedAt: '2024-11-02',
    progressPercent: 58,
    observations: 'Road base layer completed along northern corridor. Drainage installation ongoing at Boku junction. Sub-contractor mobilization for southern section is underway.',
    issues: 'Delayed delivery of bitumen material from supplier. Weather conditions caused 3-day stoppage in week 2.',
    nextSteps: 'Complete drainage works by end of November. Begin asphalt laying on northern corridor.',
  },
  {
    id: 'rpt_002', projectId: 'prj_001', subCityId: 'sc_boku',
    type: 'quarterly', period: 'Q3 2024',
    submittedBy: 'W/ro Rahel Tesfaye', submittedAt: '2024-10-05',
    progressPercent: 52,
    observations: 'Q3 work focused on foundation preparation and drainage channel construction across Boku sub-city segment. All quality checks passed by bureau engineers.',
    issues: 'Budget pressure due to material price increases. Requested supplementary allocation of 2.4M ETB.',
    nextSteps: 'Q4 target: complete 80% of Boku segment. Begin coordination with Dembela sub-city supervisor for junction works.',
  },
];

const DEMBELA_REPORTS: SupervisionReport[] = [
  {
    id: 'rpt_003', projectId: 'prj_001', subCityId: 'sc_dembela',
    type: 'monthly', period: 'October 2024',
    submittedBy: 'Ato Girma Wolde', submittedAt: '2024-11-03',
    progressPercent: 61,
    observations: 'Dembela segment progressing ahead of schedule. Road widening completed at main market junction.',
    issues: 'Minor utility conflict with EEPCO lines — rerouting approved by city bureau.',
    nextSteps: 'Asphalt laying scheduled for November 15–30.',
  },
];

export const PROJECTS: Project[] = [
  {
    id: 'prj_001',
    projectNumber: 'ACCA-PRJ-2024-001',
    title: 'Adama Inner Ring Road Expansion',
    subCityId: 'sc_boku',
    status: 'construction',
    startDate: '2024-01-10',
    endDate: '2025-06-30',
    contractor: 'Ethio Construction PLC',
    budget: 85000000,
    spent: 52000000,
    description: 'Expansion and modernization of the inner ring road connecting all 6 sub-cities of Adama. Includes drainage, lighting, and pedestrian walkways.',
    supervisionPlan: {
      subCityId: 'sc_boku',
      supervisorName: 'W/ro Rahel Tesfaye',
      startDate: '2024-01-15',
      frequency: 'monthly',
      objectives: [
        { id: 'obj1', text: 'Inspect road base preparation every two weeks', done: true },
        { id: 'obj2', text: 'Verify drainage installation meets design specs', done: true },
        { id: 'obj3', text: 'Submit photographic evidence of progress', done: true },
        { id: 'obj4', text: 'Coordinate with adjacent sub-city supervisors at junctions', done: false },
        { id: 'obj5', text: 'Confirm asphalt quality testing before laying', done: false },
      ],
    },
    reports: [...BOKU_REPORTS, ...DEMBELA_REPORTS],
    documents: [
      { id: 'pd1', name: 'Design_Specification_v3.pdf', category: 'design', version: '3.0', uploadedAt: '2024-01-10', uploadedBy: 'Ato Girma Haile', size: '12.4 MB' },
      { id: 'pd2', name: 'Construction_Contract.pdf', category: 'contract', version: '1.0', uploadedAt: '2024-01-15', uploadedBy: 'Ato Girma Haile', size: '3.2 MB' },
      { id: 'pd3', name: 'Q3_Progress_Report.pdf', category: 'report', version: '1.0', uploadedAt: '2024-10-01', uploadedBy: 'Ato Girma Haile', size: '2.8 MB' },
      { id: 'pd4', name: 'Site_Inspection_Oct.pdf', category: 'inspection', version: '1.0', uploadedAt: '2024-10-15', uploadedBy: 'W/ro Rahel Tesfaye', size: '1.5 MB' },
    ],
  },
  {
    id: 'prj_002',
    projectNumber: 'ACCA-PRJ-2024-002',
    title: 'Boku Sub-City Community Center',
    subCityId: 'sc_boku',
    status: 'design',
    startDate: '2024-06-01',
    endDate: '2025-12-31',
    contractor: 'Adama Design & Build',
    budget: 12000000,
    spent: 1800000,
    description: 'Multi-purpose community center with administrative offices, public halls, and library facilities for Boku sub-city residents.',
    supervisionPlan: {
      subCityId: 'sc_boku',
      supervisorName: 'W/ro Rahel Tesfaye',
      startDate: '2024-07-01',
      frequency: 'monthly',
      objectives: [
        { id: 'obj1', text: 'Review architectural drawings with design team', done: true },
        { id: 'obj2', text: 'Confirm site clearance and boundary marking', done: true },
        { id: 'obj3', text: 'Monitor procurement of structural materials', done: false },
        { id: 'obj4', text: 'Verify structural engineer sign-offs', done: false },
      ],
    },
    reports: [
      {
        id: 'rpt_004', projectId: 'prj_002', subCityId: 'sc_boku',
        type: 'monthly', period: 'October 2024',
        submittedBy: 'W/ro Rahel Tesfaye', submittedAt: '2024-11-01',
        progressPercent: 15,
        observations: 'Design phase ongoing. Final architectural drawings submitted for bureau review. Site boundary marked.',
        issues: 'No major issues. Awaiting city bureau approval on revised floor plan.',
        nextSteps: 'Obtain design approval. Begin procurement process for structural steel.',
      },
    ],
    documents: [
      { id: 'pd5', name: 'Concept_Design.rvt', category: 'design', version: '2.0', uploadedAt: '2024-06-15', uploadedBy: 'Ato Girma Haile', size: '28.5 MB' },
      { id: 'pd6', name: 'Building_Permit.pdf', category: 'permit', version: '1.0', uploadedAt: '2024-07-01', uploadedBy: 'Ato Girma Haile', size: '0.8 MB' },
    ],
  },
  {
    id: 'prj_003',
    projectNumber: 'ACCA-PRJ-2024-003',
    title: 'Dembela Primary School Renovation',
    subCityId: 'sc_dembela',
    status: 'completed',
    startDate: '2024-03-01',
    endDate: '2024-09-30',
    contractor: 'Kebede Construction',
    budget: 4500000,
    spent: 4320000,
    description: 'Full renovation of Dembela 01 primary school including roof replacement, electrical system upgrade, and new sanitation facilities.',
    supervisionPlan: {
      subCityId: 'sc_dembela',
      supervisorName: 'Ato Girma Wolde',
      startDate: '2024-03-05',
      frequency: 'biweekly',
      objectives: [
        { id: 'obj1', text: 'Inspect roof structure removal and replacement', done: true },
        { id: 'obj2', text: 'Verify electrical wiring meets safety standards', done: true },
        { id: 'obj3', text: 'Inspect sanitation block construction', done: true },
        { id: 'obj4', text: 'Final quality inspection before handover', done: true },
      ],
    },
    reports: [
      {
        id: 'rpt_005', projectId: 'prj_003', subCityId: 'sc_dembela',
        type: 'quarterly', period: 'Q2 2024',
        submittedBy: 'Ato Girma Wolde', submittedAt: '2024-07-03',
        progressPercent: 70,
        observations: 'Roof replacement 100% complete. Electrical wiring 80% done. Sanitation block foundation laid.',
        issues: 'Shortage of PVC pipes delayed sanitation work by one week.',
        nextSteps: 'Complete electrical and sanitation works. Begin interior painting.',
      },
    ],
    documents: [
      { id: 'pd7', name: 'Renovation_Plan.dwg', category: 'design', version: '1.0', uploadedAt: '2024-03-01', uploadedBy: 'Ato Girma Haile', size: '3.2 MB' },
      { id: 'pd8', name: 'Final_Inspection_Report.pdf', category: 'inspection', version: '1.0', uploadedAt: '2024-10-02', uploadedBy: 'Ato Girma Haile', size: '2.1 MB' },
      { id: 'pd9', name: 'Completion_Certificate.pdf', category: 'permit', version: '1.0', uploadedAt: '2024-10-05', uploadedBy: 'Ato Bekele Tadesse', size: '0.5 MB' },
    ],
  },
  {
    id: 'prj_004',
    projectNumber: 'ACCA-PRJ-2024-004',
    title: 'Alagae Sub-City Market Infrastructure',
    subCityId: 'sc_alagae',
    status: 'planning',
    startDate: '2025-01-01',
    contractor: 'TBD',
    budget: 22000000,
    spent: 0,
    description: 'New modern market facility to replace the aging structure in Alagae sub-city. Will include 200+ vendor stalls, cold storage, and parking.',
    reports: [],
    documents: [
      { id: 'pd10', name: 'Feasibility_Study.pdf', category: 'report', version: '1.0', uploadedAt: '2024-11-20', uploadedBy: 'Ato Girma Haile', size: '6.7 MB' },
    ],
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

export function getSubCity(id: string) { return SUB_CITIES.find(s => s.id === id); }
export function getWereda(id: string)   { return WEREDAS.find(w => w.id === id); }
export function getWeredasForSubCity(subCityId: string) { return WEREDAS.filter(w => w.subCityId === subCityId); }

export function getTierLabel(tier: string) {
  if (tier === 'city') return 'City Level';
  if (tier === 'subcity') return 'Sub-City Level';
  return 'Wereda Level';
}

export function getFloorTier(floors: number): 'wereda' | 'subcity' | 'city' {
  if (floors <= 2) return 'wereda';
  if (floors <= 5) return 'subcity';
  return 'city';
}

export function calculateServiceFee(floors: number): number {
  if (floors <= 2) return 1500;
  if (floors <= 5) return floors * 1800;
  if (floors <= 10) return floors * 3200;
  return floors * 3800;
}
