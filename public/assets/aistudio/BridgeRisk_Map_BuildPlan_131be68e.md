# BridgeRisk Map – Detailed Build Plan

---

## 1. Problem Statement

Bridges in many regions are monitored mainly through **periodic expert inspections** and closed, inward-facing IT systems. This creates several gaps during dynamic, high-risk periods (e.g., monsoon season):

- **No real-time visibility**: Authorities lack a live, granular picture of which bridges are deteriorating or facing immediate environmental threats (e.g., flash floods).
- **Citizen signals are wasted**: Everyday road users and professional drivers see cracks, waterlogging, or visible damage, but there is **no simple, official, trackable channel** to report these observations.
- **No AI-based triage**: Even when photo/location data could be collected, agencies do not have tools to automatically triage and prioritize reports at scale.
- **Route safety is unclear**: Professional drivers and emergency services cannot easily plan routes that account for **bridge-specific risk**, especially during floods.

As a result, potentially critical early warning signals from citizens and environmental alerts are not fused into actionable insights, leaving disaster managers and drivers exposed to preventable risk.

---

## 2. Solution Overview

**BridgeRisk Map** is a web-based, **interactive geospatial dashboard** that provides a **crowd-informed bridge risk heatmap**. It fuses:

- **Citizen Report Submission** (thumbs up/down, photos, auto-location)
- **Real-time Environmental Alerts Integration** (e.g., flood warnings)
- **Basic Bridge Open Data** (age, traffic volume, type)

into a **simple, live risk score per bridge**, visualized on a **Bridge Risk Heatmap** and exposed via:

- A map and **Route Planning for Drivers** to avoid risky bridges
- An **Authority Dashboard** for municipal engineers and disaster managers to prioritize inspections and emergency routes.

The core engine is a **Risk Score Algorithm** implemented in Python that dynamically updates scores as new reports and alerts arrive. The system is designed to be technically rigorous, cloud-deployable, and ready for municipal pilot testing.

---

## 3. Target Users

### 3.1 District Disaster Management Teams
- **Needs:**
  - Rapid overview of bridge risk during adverse events (e.g., floods, heavy rain).
  - Prioritized list of potentially unsafe bridges to plan monitoring and response.
  - Visual tools to support **emergency route planning** and decision-making.
- **Value from BridgeRisk Map:**
  - Heatmap of risk and a ranked list of bridges by risk score.
  - Time-series trends in risk to identify emerging hotspots.

### 3.2 Local Authorities (PWD/NHAI/Municipal Engineers)
- **Needs:**
  - Early warning signals for which bridges may need urgent inspection.
  - Citizen-verified photographic evidence supporting inspection requests.
  - Simple dashboard to track changes in bridge condition over time.
- **Value from BridgeRisk Map:**
  - **Authority Dashboard** with per-bridge analytics, photo gallery, and report history.
  - Ability to filter by risk level, age, and traffic volume to prioritize limited inspection resources.

### 3.3 Professional Drivers (Truck, Bus, Logistics)
- **Needs:**
  - Simple way to know which routes and bridges are currently safer, especially during monsoon/high-risk periods.
  - Quick, low-friction method to report unsafe conditions they encounter.
- **Value from BridgeRisk Map:**
  - **Route Planning for Drivers** that avoids high-risk bridges.
  - **Citizen Report Submission** flow optimized for mobile (few taps, optional photo, auto-location).

### 3.4 General Citizens / Commuters
- **Needs:**
  - Quick, intuitive interface to report problems they see on bridges.
  - Feel that their reports are seen and contribute to public safety.
- **Value from BridgeRisk Map:**
  - Lightweight thumbs up/down + photo reporting; no complex forms.
  - Public map view of nearby bridges and basic risk color coding.

---

## 4. Key Features

All of the following must be implemented in the prototype:

1. **Citizen Report Submission**
   - Simple, mobile-friendly form with:
     - Thumbs up / thumbs down condition assessment
     - Optional photo upload
     - Auto-captured geolocation and timestamp
   - Automatic association to nearest known bridge (within configurable radius).

2. **Bridge Risk Heatmap**
   - Interactive web map showing:
     - Bridges as markers or small circles.
     - Color-coded by current risk score (e.g., green/yellow/orange/red).
   - Heatmap layer emphasizing clusters of higher risk bridges.

3. **Environmental Alerts Integration**
   - Poll open data APIs for:
     - Flood warnings / rainfall intensity per region or river basin.
   - Link alerts to nearby bridges and feed into risk scoring.

4. **Risk Score Algorithm**
   - Backend algorithm combining:
     - Citizen reports (volume, recency, thumbs ratio, photo presence).
     - Environmental alerts (e.g., flood severity).
     - Bridge characteristics (age, traffic volume, structural type).
   - Outputs a normalized risk score ([0, 100] or 0–1) for each bridge.

5. **Route Planning for Drivers**
   - Map-based route planner:
     - Start and end points input.
     - Routing engine that penalizes or avoids high-risk bridges.
   - Visual indication of bridges along the route with their risk color.

6. **Authority Dashboard**
   - Restricted view (simple credential-based login).
   - Features:
     - List of bridges sorted by risk score.
     - Time-series charts of risk and reports per bridge.
     - Filter by area, risk level, age, or alert status.
     - Photo gallery from citizen reports per bridge.

---

## 5. User Flow

### 5.1 Citizen / Driver Reporting Flow

1. **Open Web App (Mobile/Browser)**
   - Lands on a home screen with map centered on user’s location (if permission granted) and a prominent “Report Bridge Condition” button.

2. **Grant Location Permission**
   - Browser asks for location access.
   - If denied, user can select location on map manually.

3. **Select Bridge (Auto or Manual)**
   - System auto-selects nearest bridge within X meters.
   - User can confirm or choose another bridge marker on the map.

4. **Submit Report**
   - User taps thumbs up (looks fine) or thumbs down (problem observed).
   - Optional:
     - Upload or capture photo (mobile camera).
     - Short text comment (optional; can be omitted in first prototype).
   - Submit.

5. **Backend Processing**
   - Report stored and linked to bridge.
   - **Risk Score Algorithm** recalculates risk for that bridge.
   - Bridge icon color updates on the **Bridge Risk Heatmap**.

6. **Feedback to User**
   - User sees updated bridge color and a brief “Thanks, your report helps authorities prioritize inspections” message.

### 5.2 Professional Driver Route Planning Flow

1. **Open Web App (Driver Mode)**
   - Toggle or landing option: “Plan Safe Route”.

2. **Input Route**
   - Enter origin and destination (address, place name, or pin on map).

3. **View Route with Bridge Overlays**
   - Route is calculated via routing engine.
   - All bridges on route are displayed with risk color.
   - High-risk bridges are highlighted with warning icons.

4. **Avoid High-Risk Bridges**
   - Option: “Avoid red-risk bridges” (high penalty) and “Minimize orange-risk bridges”.
   - Route is recalculated to avoid or reduce exposure to high-risk bridges.

5. **Start Navigation (Optional)**
   - For prototype: simply show static route polyline and list of bridges with risk.
   - Future: integrate turn-by-turn navigation via existing map SDKs.

### 5.3 Authority / Disaster Manager Flow

1. **Log In to Authority Dashboard**
   - Simple username/password (or token) for hackathon prototype.

2. **View District/Region Overview**
   - Default view: **Bridge Risk Heatmap** for their jurisdiction.
   - Side panel with:
     - Summary: # of bridges by risk category (low/med/high).
     - Latest flood alerts / environmental alerts affecting bridges.

3. **Inspect High-Risk Bridges**
   - Click a bridge in “High Risk” list or on map.
   - See:
     - Current risk score and contributing factors breakdown (citizen reports, alerts, age, traffic).
     - Recent citizen reports with thumbnails of photos.
     - Mini time-series of risk over last 7–30 days.

4. **Plan Inspections / Responses**
   - Filter bridges by:
     - Risk level (e.g., only red and orange).
     - Environmental alert (e.g., only under flood warning).
     - Age/traffic volume to identify critical infrastructure.
   - Export list of target bridges as CSV (future enhancement; optional for MVP).

5. **Monitor Over Time**
   - View trend charts at district level:
     - Number of reports per day.
     - Risk distribution changes before/after heavy rainfall.

---

## 6. Technical Approach

### 6.1 High-Level Architecture

- **Frontend**: Single Page Application (SPA) using React (or Next.js) with:
  - Map rendering via Mapbox GL JS / Leaflet.
  - Components for:
    - Citizen report form
    - Route planner
    - Authority dashboard views
- **Backend**: Python-based REST API using FastAPI or Flask.
- **Database**: PostgreSQL with PostGIS extension for geospatial queries.
- **Hosting / Infrastructure**:
  - Backend + DB on a cloud provider (e.g., AWS/GCP/Azure, or Render/Fly.io for hackathon speed).
  - Static frontend hosting on Vercel/Netlify or same provider.
- **Integration Layer**:
  - Scheduled jobs (cron) for **Environmental Alerts Integration**.
  - Basic ETL scripts for bridge open data ingestion.

### 6.2 Data Model (Simplified)

#### Tables

1. **bridges**
   - `id` (PK, UUID or int)
   - `name` (string)
   - `location` (geometry(POINT, SRID))
   - `district` / `state` (string)
   - `year_built` (int, nullable)
   - `traffic_volume` (int or categorical; e.g., low/med/high)
   - `bridge_type` (string; e.g., “road bridge”, “rail-cum-road”)
   - `last_risk_score` (float)
   - `last_risk_updated_at` (timestamp)

2. **reports**
   - `id` (PK)
   - `bridge_id` (FK to bridges)
   - `user_id` or `session_id` (nullable; anonymous OK)
   - `thumbs` (enum: “up”, “down”)
   - `photo_url` (string, nullable)
   - `comment` (text, nullable)
   - `reported_at` (timestamp)
   - `location` (geometry(POINT, SRID))
   - `ip_hash` (string; optional anti-abuse)

3. **environmental_alerts**
   - `id` (PK)
   - `source` (string; e.g., “IMD”, “CWC”)
   - `alert_type` (string; e.g., “flood_warning”, “heavy_rain”)
   - `severity` (int or enum; e.g., 1–5)
   - `region_geom` (geometry(POLYGON/MULTIPOLYGON))
   - `valid_from` (timestamp)
   - `valid_to` (timestamp)
   - `raw_payload` (JSONB)

4. **bridge_alert_links** (optional or materialized view)
   - `bridge_id`
   - `alert_id`
   - `distance_to_alert_center` (float, optional)
   - `is_currently_affected` (bool)

5. **users (for authority dashboard)**
   - `id` (PK)
   - `email` / `username`
   - `password_hash`
   - `role` (enum: “admin”, “authority”)

### 6.3 API Endpoints (REST, JSON)

#### Citizen Report Submission

- `POST /api/reports`
  - Body:
    - `thumbs`: "up" | "down"
    - `bridge_id` (optional if not auto-resolved on client)
    - `location`: { lat, lng }
    - `photo` (multipart file) or `photo_url`
    - `comment` (optional)
  - Steps:
    1. If `bridge_id` missing, query nearest bridge using PostGIS `ST_Distance`.
    2. Store photo in cloud storage (e.g., S3, Firebase Storage) and save URL.
    3. Insert into `reports`.
    4. Trigger risk recalculation for that bridge (sync or via queue).
    5. Return updated bridge object with `last_risk_score`.

#### Bridge and Heatmap Data

- `GET /api/bridges`
  - Query params: `bbox`, `district`, etc.
  - Returns: list of bridges with `id`, `name`, `location`, `last_risk_score`, key attributes.
- `GET /api/bridges/:id`
  - Returns: full details + recent reports + risk history (optional).

#### Environmental Alerts Integration

- Internal scripts (not necessarily exposed via API for MVP):
  - `scripts/fetch_alerts.py`:
    - Polls public APIs (e.g., meteorological departments, flood alerts).
    - Normalizes data into `environmental_alerts`.
    - Computes affected bridges by spatial intersection (`ST_Intersects`).
  - `GET /api/alerts/current`
    - For dashboard to show all current alerts and affected bridge counts.

#### Risk Score Algorithm Endpoint

- `POST /api/bridges/:id/recalculate-risk`
  - For internal use or admin tools.
  - Recomputes risk using last N days of data and current alerts.

### 6.4 Risk Score Algorithm (MVP Design)

Implement as a Python module used by the backend.

**Inputs per bridge:**
- `reports_last_7d`: number of thumbs up/down, with timestamps.
- `down_ratio`: `down_reports / total_reports` in last 7 days.
- `recent_down_weight`: extra weight for last 24–48 hours.
- `has_photos`: proportion of reports with photos (higher trust).
- `environmental_severity`: max severity of overlapping alerts (0–1 normalized).
- `age_factor`: normalized age (older = higher risk weight).
- `traffic_factor`: normalized traffic volume (higher = higher risk weight).

**Score Idea** (0–100):

```pseudo
base_from_reports = (
  60 * down_ratio * time_decay_factor
  + 10 * photo_confidence_bonus
)

env_component = 25 * environmental_severity
infra_component = 15 * (0.5 * age_factor + 0.5 * traffic_factor)

raw_score = base_from_reports + env_component + infra_component
risk_score = min(100, max(0, raw_score))
```

- **Time Decay**: Recent reports carry more weight:
  - e.g., `time_decay_factor` = weighted average of exponential decay by report age.
- **Normalization**:
  - Age: `(current_year - year_built) / max_age` (capped).
  - Traffic: `traffic_volume / max_volume` (or categorical mapping).

For a hackathon, implement a clear, documented, deterministic formula with tunable constants.

### 6.5 Bridge Risk Heatmap Implementation

- Use Mapbox/Leaflet with:
  - **Point layer** for each bridge; style via `risk_score`:
    - 0–25: green
    - 26–50: yellow
    - 51–75: orange
    - 76–100: red
  - Optional **heatmap layer**:
    - Intensity based on risk_score and/or number of recent down-reports.

- Frontend:
  - Periodic polling or WebSocket (optional) to refresh bridge data.

### 6.6 Route Planning for Drivers

- Use a routing API:
  - OpenRouteService / OSRM / Mapbox Directions API.
- Workflow:
  1. Frontend sends origin/destination to backend.
  2. Backend calls routing API to get candidate route(s).
  3. For each segment that crosses water or known bridge coordinates:
     - Match with `bridges` table via spatial join:
       - Buffer bridge points slightly and intersect with route line.
  4. Annotate route geometry with list of bridges encountered and their risk scores.
  5. If user chooses “avoid high-risk bridges”:
     - Implement simple heuristic:
       - Penalize cost of edges that contain red/orange bridges (e.g., by length * factor).
       - Re-run routing with custom weights (if router supports) or try alternate routes by:
         - Calling routing API with intermediate waypoints that avoid bounding boxes around high-risk bridges (hackathon-level solution).
  6. Return final route + annotated bridges to frontend.

### 6.7 Authority Dashboard Implementation

- **Authentication**:
  - FastAPI/JWT auth or simple session cookies for prototype.
- **Views**:
  - Dashboard overview page:
    - API: `GET /api/authority/summary`
      - Returns counts by risk bucket, # of alerts, # of new reports.
  - Bridge list page:
    - API: `GET /api/authority/bridges?sort=risk_score&filter=...`
  - Bridge detail page:
    - API: `GET /api/bridges/:id` with additional analytics fields:
      - `risk_history` (daily scores).
      - `reports_recent` (last 20 reports with photos).
- **Charts**:
  - Use lightweight charting lib (e.g., Chart.js, Recharts) for:
    - Risk over time.
    - Reports per day.

### 6.8 Environmental Alerts Integration Details

- Choose one or two example public data sources for prototype:
  - E.g., a mock flood alert API or open government dataset with:
    - Alert polygons (river basins/districts).
    - Severity levels and validity windows.
- Implementation steps:
  1. Cron job every 15–60 minutes.
  2. Fetch latest alerts, parse, and upsert into `environmental_alerts`.
  3. For each alert:
     - Find bridges within alert polygon using `ST_Intersects`.
     - Mark `bridge_alert_links`.
  4. When computing risk, use current alerts only:
     - `NOW()` between `valid_from` and `valid_to`.

---

## 7. Success Metrics

### 7.1 Usage Metrics

- **Citizen Report Submission**:
  - # of reports submitted per day.
  - % of reports with geolocation and valid bridge association.
  - % of reports with photos (quality of data).
- **Bridge Coverage**:
  - # and % of bridges that have received at least one report in the last 30 days.

### 7.2 Risk Signal Quality

- **Correlation with Environmental Events**:
  - During known flood/heavy rain periods, % of affected bridges that show increased risk scores.
- **Stability of Scores**:
  - Avoid extreme oscillations: measure variance of scores over short windows to ensure algorithm tuning is reasonable.

### 7.3 Authority Engagement

- Authority Dashboard:
  - # of authority logins.
  - # of bridges viewed/inspected in dashboard.
  - Filters used most often (e.g., “high risk + flood-alert”).

- **Operational Actions (qualitative for hackathon)**:
  - Feedback from municipal/disaster teams on whether high-risk bridges identified by the system align with their field observations or priorities.

### 7.4 Driver Utility

- Route Planning:
  - # of routes computed.
  - % of routes where drivers chose “avoid high-risk bridges”.
  - Reduction in exposure:
    - Average number of red/orange bridges per planned route vs. naive shortest route (simulated).

### 7.5 System Performance & Reliability

- **Latency**:
  - Time from report submission to updated risk score visible on map (target: < 5–10 seconds for prototype).
- **Availability**:
  - Uptime of core APIs during testing period.

---

This build plan is designed so that an AI prototyping tool (e.g., Lovable, Bolt) can scaffold:

- A Python backend (FastAPI/Flask) with specified endpoints and risk algorithm module.
- A React-based frontend with:
  - Citizen report UI with auto-location.
  - Interactive **Bridge Risk Heatmap**.
  - **Route Planning for Drivers** interface.
  - **Authority Dashboard** views and charts.
- A Postgres/PostGIS schema for bridges, reports, and environmental alerts.

All six confirmed features—Citizen Report Submission, Bridge Risk Heatmap, Environmental Alerts Integration, Risk Score Algorithm, Route Planning for Drivers, and Authority Dashboard—are central to the architecture and referenced across flows, APIs, and UI components.