# ACCA — Adama City Construction Authority
### Construction Bureau Management System — Prototype Demo

---

## What This Is

A frontend-only prototype built to pitch the ACCA digital management system. No backend or database — all data is seeded in-memory, so it resets on refresh. The goal is to show ACCA officials exactly how their hierarchy, workflows, and documents would look in a real system.

---

## How to Run Locally

```bash
npm install
npm run dev
```

Then open **http://localhost:5175** in your browser.

---

## The Three-Tier Hierarchy

Everything in this system revolves around three administrative levels, each with its own scope of visibility and authority:

```
City (Adama)
  └── Sub-City (×6: Boku, Dembela, Dabe, Lugo, Bole, Aba-geda)
        └── Wereda (×2–3 per Sub-City, 14 total)
```

**Building height determines which level handles a permit:**

| Floors | Handled By | Example |
|--------|-----------|---------|
| 0 – 2  | Wereda Office | Family home, small shop |
| 3 – 5  | Sub-City Office | Mid-rise commercial |
| 6 – 20 | City Bureau | Tower, hotel, mixed-use |

---

## Demo Users (Role Switcher)

At the top-right of every page there is a **"View as"** dropdown. Switching roles instantly changes what data is visible, what actions are available, and which navigation items appear. This is the main demo mechanic — use it live during the pitch.

| Name | Role | Sees |
|------|------|------|
| Ato Bekele Tadesse | City Admin | All 10 agreements, all 6 sub-cities, all 4 projects |
| W/ro Tigist Alemu | Sub-City Officer — Boku | Only Boku sub-city agreements |
| Ato Girma Haile | Sub-City Officer — Dembela | Only Dembela sub-city agreements |
| Ato Samuel Tesfaye | Wereda Officer — Boku 01 | Only Boku 01 wereda agreements |
| W/rt Meron Kebede | Wereda Officer — Dembela 01 | Only Dembela 01 wereda agreements |
| Ato Dawit Mulugeta | Customer | Only their own submitted agreements |

---

## Features & Expected Outcomes

---

### 1. Role Selector — Landing Page (`/`)

**What it does:**
The entry point of the system. Shows all six demo users as cards with their role, title, and a description of what they can access. Below the cards, a visual explanation of the height-based service routing is shown.

**How to demo it:**
- Open the app — this is the first thing ACCA officials see
- Point out the three routing tiers at the bottom
- Click any role card to enter the system as that user

**Expected outcome:**
Clicking a role card takes you directly to the Dashboard (or Agreements list for Customers). The top bar shows who you are logged in as.

---

### 2. Dashboard (`/dashboard`)

**What it does:**
The command center for each level. Shows live KPIs, charts, recent agreements, and an expiry warning banner — all filtered to only what the current role is allowed to see.

**Key elements:**

- **5 KPI cards** — Total agreements, Approved, Pending/Under Review, Expired, Total fees collected
- **Red accent card** — Total agreements count, always highlighted to draw the eye
- **Fee by Sub-City bar chart** — Only visible to City Admin; shows how much each sub-city has contributed in service fees (in ETB thousands)
- **Status donut chart** — Breakdown of all agreements by status (approved, pending, under review, rejected, expired)
- **Expiring soon banner** — Amber alert at the top if any approved agreements expire within 30 days; includes a direct link to filter the list
- **Recent agreements panel** — Last 5 submissions, clickable, with tier badge and status badge
- **Expiring soon sidebar** — Cards showing agreements that need attention, with days remaining

**How to demo it:**
1. Enter as **City Admin** — see all KPIs, the full fee chart, and all 10 agreements in the recent list
2. Switch to **Sub-City Officer (Boku)** — notice the numbers drop to only Boku's data; the fee chart disappears
3. Switch to **Wereda Officer (Boku 01)** — data narrows to just that wereda's agreements
4. Point out the expiring-soon amber alert if visible

**Expected outcome:**
Each role sees a completely different slice of data. City Admin has the widest view. Wereda officers see only their own. The hierarchy is self-evident.

---

### 3. Agreements List (`/agreements`)

**What it does:**
A searchable, filterable table of all building agreements visible to the current user.

**Key elements:**

- **Search bar** — searches agreement number, applicant name, building name, or address in real time
- **Status filter dropdown** — All / Pending / Under Review / Approved / Rejected / Expired / Expiring Soon
- **Tier filter** — City Admin only; filters by City / Sub-City / Wereda level
- **Expiring soon rows** — highlighted in amber
- **Each row** — agreement number, applicant name + building, location (sub-city / wereda), tier badge, status badge, service fee (red if unpaid), expiry date

**How to demo it:**
1. As City Admin, filter by **"Expiring Soon"** — see highlighted rows
2. Search for **"Haile"** — narrows to that applicant
3. Filter by **"City"** tier — shows only the large-building agreements
4. Click any row to open its full detail

**Expected outcome:**
Instant filtering with no page reload. The table adapts to the search in real time. Unpaid fees show in red with a warning symbol. Expiring rows glow amber.

---

### 4. Agreement Detail (`/agreements/:id`)

**What it does:**
The full record of a single building agreement — everything in one place.

**Key elements:**

- **Approval progress stepper** — shows the three stages: Submitted → Under Review → Approved, with the current stage highlighted in red
- **Applicant information** — name, phone, email, address, building name, type, floor count
- **Agreement details** — which tier handled it, sub-city, wereda, submission date, start date, expiry date, reviewer name
- **Service fee block** — amount in ETB, paid/unpaid status in green/red
- **Live map** — OpenStreetMap pin at the exact (lat, lng) coordinates of the building; scroll to zoom, click to see a popup with the agreement number and building name
- **"Open in Google Maps" link** — one click opens the location in Google Maps in a new tab
- **Coordinates display** — exact latitude and longitude shown below the map
- **Documents section** — list of all uploaded files (CAD, Revit, PDF) with file size and upload date; download button per file
- **Notes/Remarks** — reviewer notes shown in a blue highlight box if present
- **Approve/Reject buttons** — visible to officers when an agreement is "Under Review"

**How to demo it:**
1. Click **ACCA-2024-0003** (Haile Tower, 14 floors, Under Review) — show the progress stepper stopped at step 2
2. Point out the map pin in central Adama
3. Click "Open in Google Maps" — show it opens the exact location
4. Click **ACCA-2024-0001** (approved, 2 floors) — show the completed stepper, documents list, and paid fee

**Expected outcome:**
A complete, paper-free record of the agreement. The map makes the location immediately tangible for officials. The stepper shows exactly where in the approval process things stand.

---

### 5. New Application Form (`/agreements/new`)

**What it does:**
The form a customer (or an officer on their behalf) fills in to submit a new building agreement application. The system automatically routes it to the right tier based on the floor count entered.

**Key elements:**

- **Live tier indicator banner** — updates instantly as you change the floor count; shows which office will handle it (Wereda / Sub-City / City) and the estimated service fee
- **Applicant information section** — name, phone, email; pre-filled if logged in as Customer role
- **Building details** — name, type (dropdown), floor count, full address
- **Location section** — sub-city and wereda dropdowns (locked to their assigned area if logged in as an officer); latitude and longitude fields for GPS pin
- **File upload area** — drag-and-drop zone for CAD (.dwg), Revit (.rvt), PDF, or image files; selected filenames appear below
- **Submit button** — on success, shows a green confirmation screen and redirects to the new agreement's detail page

**How to demo it:**
1. Enter as **Customer** — name is pre-filled
2. Type **"14"** in the floor count — watch the banner switch to "City Bureau" and the fee jump to ~53,200 ETB
3. Type **"2"** — watch it switch back to "Wereda Office" with 1,500 ETB fee
4. Fill in a building name and address, click Submit
5. Show the confirmation screen and the new agreement appearing in the list

**Expected outcome:**
The auto-routing is the "wow" moment. Officials and customers immediately understand that the system enforces the height rule automatically — no manual routing decisions. The submitted agreement appears at the top of the agreements list instantly.

---

### 6. Map View (`/map`)

**What it does:**
A full-page interactive map showing every agreement as a colored pin. Each pin color represents the agreement's status.

**Key elements:**

- **Color-coded pins** — Green = Approved, Amber = Pending, Blue = Under Review, Red = Rejected, Gray = Expired
- **Amber halo ring** — agreements expiring within 30 days get a glowing circle around their pin so they stand out immediately
- **Floor count inside pin** — each pin shows the building's floor count, so you can instantly see where the tall buildings are
- **Tier filter buttons** — toggle between All / City / Sub-City / Wereda tiers
- **Status filter buttons** — toggle between All / Approved / Pending / Under Review / Expired
- **Popup on click** — shows building name, agreement number, applicant, sub-city/wereda, floor count, expiry date, and a "View Agreement →" button that goes to the full detail
- **Agreement count** — shows how many pins are currently displayed based on active filters

**How to demo it:**
1. Open the map as City Admin — all 10 pins appear around Adama
2. Click a green pin — see the popup; click "View Agreement →"
3. Go back, switch filter to **"Pending"** — only amber pins remain
4. Switch filter to **"City"** tier — only the large-building agreements remain

**Expected outcome:**
ACCA officials immediately see the spatial distribution of all building activity across Adama. The expiry halos make it obvious which agreements need follow-up without any searching. This is typically the most visually impressive page of the demo.

---

### 7. Projects — Project Division (`/projects`)

**What it does:**
The Project Division's document and project management area. Separate from the Building Official (agreements) side — this tracks ACCA's own construction projects: roads, community centers, schools.

**Key elements (list view):**

- **Project cards** — title, project number, tier badge, status badge, contractor, sub-city location
- **Budget progress bar** — shows % of budget spent; color changes from green → amber → red as it approaches 100%
- **Document count** per project

**Key elements (project detail):**

- **Overview panel** — description, contractor, start/end dates, location
- **Budget panel** — total budget, amount spent, remaining; color-coded progress bar
- **Document vault** — all project files listed with name, category (design / permit / contract / inspection / report), version number, file size, upload date, and who uploaded it
- **Upload Document button** — placeholder for the real upload flow

**Seeded projects:**

| Project | Tier | Status | Budget |
|---------|------|--------|--------|
| Adama Inner Ring Road Expansion | City | Under Construction | 85M ETB |
| Boku Community Center | Sub-City | Design Phase | 12M ETB |
| Dembela 01 School Renovation | Wereda | Completed | 4.5M ETB |
| Dabe Market Infrastructure | Sub-City | Planning | 22M ETB |

**How to demo it:**
1. Enter as City Admin — see all 4 projects
2. Click **Adama Inner Ring Road** — show the 61% budget bar, 4 documents
3. Switch to **Wereda Officer (Dembela 01)** — only the school renovation project is visible
4. Click it — show Completed status and the Final Inspection Report + Completion Certificate

**Expected outcome:**
Demonstrates the exact pain point they mentioned: paperwork and documentation. Every project has a versioned document trail, visible at the right level of the hierarchy.

---

### 8. Reports & Analytics (`/reports`)

**What it does:**
City-level analytics and rollup reporting. Shows aggregated data across the entire city hierarchy.

**Key elements:**

- **4 KPI cards** — City-level agreement count, Sub-City count, Wereda count, Total fees collected
- **Stacked bar chart** — fees by sub-city, stacked by tier (City / Sub-City / Wereda contributions); shows which sub-cities are most active
- **Monthly line chart** — simulated agreement volume trend over 2024; shows growth pattern
- **Sub-City breakdown table** — for each of the 6 sub-cities: number of weredas, total agreements, approved count, fees collected, and approval rate with a mini progress bar

**How to demo it:**
1. Enter as City Admin — this is the only role that sees Reports
2. Walk through each chart
3. Point out the Sub-City table and find which sub-city has the highest fees collected

**Expected outcome:**
Gives ACCA leadership a single page that replaces all their manual monthly Excel rollup reports. The sub-city breakdown table is the key slide for budget allocation and performance review meetings.

---

## Seeded Agreement Data Summary

| # | Applicant | Building | Floors | Tier | Status | Fee |
|---|-----------|----------|--------|------|--------|-----|
| ACCA-2024-0001 | Ato Dawit Mulugeta | Mulugeta Residence | 2 | Wereda | Approved | 1,500 ETB |
| ACCA-2024-0002 | W/ro Hiwot Girma | Girma Commercial Center | 5 | Sub-City | Approved | 8,500 ETB |
| ACCA-2024-0003 | Ato Biruk Haile | Haile Tower | 14 | City | Under Review | 42,000 ETB |
| ACCA-2024-0004 | Ato Yonas Bekele | Bekele Apartments | 1 | Wereda | Expired | 1,200 ETB |
| ACCA-2024-0005 | W/ro Rahel Tesfaye | Tesfaye Hotel | 8 | City | Approved | 28,000 ETB |
| ACCA-2024-0006 | Ato Mikiyas Solomon | Solomon Family Home | 2 | Wereda | Pending | 1,500 ETB |
| ACCA-2024-0007 | Ato Abreham Lemma | Lemma Business Park | 4 | Sub-City | Approved | 12,000 ETB |
| ACCA-2024-0008 | Ato Liya Kebede | Kebede Mall | 3 | Sub-City | Rejected | 6,500 ETB |
| ACCA-2024-0009 | Ato Dagmawi Alemu | Alemu Towers | 18 | City | Approved | 55,000 ETB |
| ACCA-2024-0010 | W/ro Selam Desta | Desta Guesthouse | 2 | Wereda | Approved | 1,500 ETB |

---

## Suggested Demo Flow (15 minutes)

1. **(2 min)** Open `/` — explain the three-tier routing diagram at the bottom. Pick City Admin.
2. **(3 min)** Dashboard — walk through KPIs, point out the expiry alert, show the fee chart. Then switch to Wereda Officer and show how the data narrows.
3. **(2 min)** Agreements list — search, filter by "Expiring Soon", click through to Haile Tower detail.
4. **(3 min)** Agreement Detail — stepper, map pin, Google Maps link, documents.
5. **(2 min)** Map View — show all pins, click one, filter by tier.
6. **(2 min)** Switch to Customer role, submit a new application (change floors and show the auto-routing), show the confirmation.
7. **(1 min)** Briefly show Projects and Reports.

---

## What Is Not Yet Built (Potential Next Features)

These were discussed but not built in this prototype version:

- [ ] Amharic / English language toggle
- [ ] Actual file storage (currently files are listed but not stored)
- [ ] Approve / Reject actions that persist the status change
- [ ] SMS or email notification on approval or expiry
- [ ] Customer portal with real login
- [ ] Upward report PDF export (Wereda → Sub-City → City weekly summary)
- [ ] Audit trail (who approved what, timestamp log)
- [ ] Real backend + database (PostgreSQL + Node/Django)

---

## Deployment

The app is ready for Vercel. Push to GitHub, connect the repo on vercel.com, and it deploys automatically. The `vercel.json` handles client-side routing.

```bash
npm run build   # produces /dist — ready to deploy
```
