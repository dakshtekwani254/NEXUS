import { 
  Shipment, Port, Route, DisruptionEvent, Alert, 
  Investigation, AgentConfig, NotificationItem, PromptTemplate, DataSource 
} from "./types";

export const DEMO_PORTS: Port[] = [
  {
    code: "CNSHA",
    name: "Port of Shanghai",
    country: "China",
    lat: 31.23,
    lng: 121.47,
    risk_score: 78,
    severity: "HIGH",
    congestion_index: 88,
    avg_berth_wait_hours: 52,
    weather_score: 74,
    active_notices: [
      "Typhoon Malakas Outer Gale Warnings: Pilotage operations suspended at Yangshan Deepwater Terminal Berth 4 & 5",
      "Vessel anchorage queue exceeding 42 container ships due to heavy sea fog"
    ],
    affected_shipments_count: 32,
    historical_trend: [42, 48, 55, 64, 71, 78],
    last_updated: "12m ago",
    data_source: "TinyFish Crawler + Shanghai Maritime Safety Administration (MSA)",
    is_demo: true,
    alternative_ports: ["CNNBO", "KRPUS"]
  },
  {
    code: "NLRTM",
    name: "Port of Rotterdam",
    country: "Netherlands",
    lat: 51.92,
    lng: 4.47,
    risk_score: 45,
    severity: "MEDIUM",
    congestion_index: 54,
    avg_berth_wait_hours: 18,
    weather_score: 22,
    active_notices: [
      "Maasvlakte rail terminal scheduled signal upgrade causing +8h inland container dwell",
      "Draft depth restriction on Botlek fairway normal"
    ],
    affected_shipments_count: 14,
    historical_trend: [38, 40, 42, 44, 45, 45],
    last_updated: "24m ago",
    data_source: "Rotterdam Harbour Master Feed + AIS Telemetry",
    is_demo: true,
    alternative_ports: ["BEANR", "DEHAM"]
  },
  {
    code: "SGSIN",
    name: "Port of Singapore",
    country: "Singapore",
    lat: 1.29,
    lng: 103.85,
    risk_score: 36,
    severity: "LOW",
    congestion_index: 42,
    avg_berth_wait_hours: 12,
    weather_score: 15,
    active_notices: [
      "Normal operations across Pasir Panjang & Tuas Megaport terminals",
      "Bunkering slots operating at standard turnaround speed"
    ],
    affected_shipments_count: 8,
    historical_trend: [30, 32, 35, 34, 36, 36],
    last_updated: "18m ago",
    data_source: "MPA Singapore AIS + PortNet Telemetry",
    is_demo: true,
    alternative_ports: ["MYPKG", "MYTPP"]
  },
  {
    code: "USLAX",
    name: "Port of Los Angeles",
    country: "United States",
    lat: 33.74,
    lng: -118.27,
    risk_score: 52,
    severity: "MEDIUM",
    congestion_index: 62,
    avg_berth_wait_hours: 26,
    weather_score: 10,
    active_notices: [
      "Intermodal rail chassis staging constraint at Pier 400",
      "Peak import volume surge; off-dock container yards operating at 89% capacity"
    ],
    affected_shipments_count: 19,
    historical_trend: [48, 50, 52, 51, 52, 52],
    last_updated: "35m ago",
    data_source: "Port of LA Signal System + Marine Exchange",
    is_demo: true,
    alternative_ports: ["USLGB", "USOAK"]
  },
  {
    code: "DEHAM",
    name: "Port of Hamburg",
    country: "Germany",
    lat: 53.55,
    lng: 9.99,
    risk_score: 38,
    severity: "LOW",
    congestion_index: 46,
    avg_berth_wait_hours: 14,
    weather_score: 18,
    active_notices: [
      "Elbe navigation fairway operating at regular low-water draft clearance"
    ],
    affected_shipments_count: 6,
    historical_trend: [34, 35, 36, 38, 38, 38],
    last_updated: "42m ago",
    data_source: "Hamburg Port Authority (HPA)",
    is_demo: true,
    alternative_ports: ["NLRTM", "DEBRE"]
  },
  {
    code: "AEJEA",
    name: "Port of Jebel Ali",
    country: "United Arab Emirates",
    lat: 25.01,
    lng: 55.06,
    risk_score: 48,
    severity: "MEDIUM",
    congestion_index: 58,
    avg_berth_wait_hours: 22,
    weather_score: 12,
    active_notices: [
      "Transshipment volume influx from carriers avoiding Red Sea transit",
      "Container dwell time +14% due to feeder vessel repositioning"
    ],
    affected_shipments_count: 11,
    historical_trend: [40, 42, 45, 47, 48, 48],
    last_updated: "50m ago",
    data_source: "DP World Marine Terminal Intelligence",
    is_demo: true,
    alternative_ports: ["OMSLH", "SAKAP"]
  }
];

export const DEMO_ROUTES: Route[] = [
  {
    id: "RTE-01",
    name: "Asia–Europe Corridor",
    origin_code: "CNSHA",
    dest_code: "NLRTM",
    waypoints: [
      [31.23, 121.47],
      [1.29, 103.85],
      [12.6, 43.3],
      [27.8, 34.2],
      [36.0, -5.3],
      [51.92, 4.47]
    ],
    baseline_days: 28,
    current_risk_score: 84,
    status: "Critical Disruption — Red Sea Threat",
    alternatives: [
      {
        name: "Cape of Good Hope Diversion",
        transit_days: 38,
        additional_cost_usd: 142000,
        risk_score: 24,
        description: "Bypasses Bab el-Mandeb completely. Zero missile/drone hazard, +10 days transit."
      },
      {
        name: "Trans-Siberian / Central Corridor Rail",
        transit_days: 18,
        additional_cost_usd: 280000,
        risk_score: 42,
        description: "Intermodal rail link via Kazakhstan for critical priority electronics."
      }
    ]
  },
  {
    id: "RTE-02",
    name: "Trans-Pacific Eastbound",
    origin_code: "CNSHA",
    dest_code: "USLAX",
    waypoints: [
      [31.23, 121.47],
      [35.0, 160.0],
      [33.74, -118.27]
    ],
    baseline_days: 14,
    current_risk_score: 42,
    status: "Normal Flow with Typhoon Advisory",
    alternatives: [
      {
        name: "Great Circle Northern Arc",
        transit_days: 13,
        additional_cost_usd: 15000,
        risk_score: 55,
        description: "Shorter distance but higher North Pacific winter sea state risk."
      }
    ]
  },
  {
    id: "RTE-03",
    name: "Trans-Atlantic Westbound",
    origin_code: "NLRTM",
    dest_code: "USNYC",
    waypoints: [
      [51.92, 4.47],
      [50.0, -20.0],
      [40.71, -74.0]
    ],
    baseline_days: 9,
    current_risk_score: 28,
    status: "Optimal Navigation Flow",
    alternatives: [
      {
        name: "Azores Southern Fairway",
        transit_days: 11,
        additional_cost_usd: 35000,
        risk_score: 16,
        description: "Calm water weather evasion routing around seasonal low-pressure systems."
      }
    ]
  }
];

export const DEMO_SHIPMENTS: Shipment[] = [
  {
    id: "SHP-10482",
    tracking_ref: "MSK-9920148",
    origin: "CNSHA",
    destination: "NLRTM",
    origin_name: "Port of Shanghai",
    dest_name: "Port of Rotterdam",
    carrier: "Maersk Line",
    vessel: "Madrid Maersk",
    container_id: "MSKU-829104-2",
    departure_date: "2026-10-12",
    expected_arrival: "2026-11-04",
    delivery_deadline: "2026-11-06",
    predicted_delay_hours: 34,
    delay_risk_level: "HIGH",
    risk_score: 82,
    status: "AT_RISK",
    value_usd: 4200000,
    cargo_description: "EV Battery Modules & Energy Storage Packs",
    milestones: [
      { name: "Origin Gate-In & Customs Cleared", location: "Shanghai Yangshan", date: "Oct 11, 2026", completed: true, status_note: "Export scan validated" },
      { name: "Vessel Departure", location: "Port of Shanghai", date: "Oct 12, 2026", completed: true, status_note: "Departed Berth 3" },
      { name: "Strait of Malacca Transit", location: "Singapore Approaches", date: "Oct 18, 2026", completed: true, status_note: "On schedule, speed 17.8 kn" },
      { name: "Red Sea / Bab el-Mandeb Entry", location: "Gulf of Aden", date: "Oct 24, 2026", completed: false, status_note: "Reroute evaluation active: Cape diversion recommended" },
      { name: "Suez Canal Transit", location: "Port Said", date: "Oct 27, 2026", completed: false, status_note: "Subject to convoy scheduling" },
      { name: "Discharge & Final Inbound", location: "Port of Rotterdam", date: "Nov 04, 2026", completed: false, status_note: "Revised ETA: +34h variance" }
    ],
    related_disruptions: ["DIS-001", "DIS-002"],
    mitigation_actions: [
      "Notify Antwerp battery integration gigafactory of +34h delivery window adjustment",
      "Authorize Cape of Good Hope bunker adjustment if naval convoy slot delayed > 18h",
      "Initiate secondary customs pre-clearance with Dutch Customs"
    ],
    route_id: "RTE-01",
    is_demo: true
  },
  {
    id: "SHP-10517",
    tracking_ref: "MSC-7719203",
    origin: "CNSHA",
    destination: "DEHAM",
    origin_name: "Port of Shanghai",
    dest_name: "Port of Hamburg",
    carrier: "MSC",
    vessel: "MSC Loreto",
    container_id: "MSCU-190342-9",
    departure_date: "2026-10-10",
    expected_arrival: "2026-11-08",
    delivery_deadline: "2026-11-10",
    predicted_delay_hours: 48,
    delay_risk_level: "HIGH",
    risk_score: 76,
    status: "AT_RISK",
    value_usd: 6800000,
    cargo_description: "Automotive ECU Microcontrollers",
    milestones: [
      { name: "Loaded on Vessel", location: "Shanghai", date: "Oct 10, 2026", completed: true },
      { name: "East China Sea Gale Warning", location: "East China Sea", date: "Oct 12, 2026", completed: true },
      { name: "Cape of Good Hope Diversion", location: "South Atlantic", date: "Oct 29, 2026", completed: false },
      { name: "Hamburg Arrival", location: "Hamburg", date: "Nov 08, 2026", completed: false }
    ],
    related_disruptions: ["DIS-001", "DIS-002"],
    mitigation_actions: [
      "Air-freight 20% critical inventory buffer from Munich hub",
      "Trigger supplier force majeure notice review"
    ],
    route_id: "RTE-01",
    is_demo: true
  },
  {
    id: "SHP-10563",
    tracking_ref: "CMA-4481023",
    origin: "SGSIN",
    destination: "NLRTM",
    origin_name: "Port of Singapore",
    dest_name: "Port of Rotterdam",
    carrier: "CMA CGM",
    vessel: "CMA CGM Jacques Saadé",
    container_id: "CMAU-504932-1",
    departure_date: "2026-10-14",
    expected_arrival: "2026-11-05",
    delivery_deadline: "2026-11-07",
    predicted_delay_hours: 28,
    delay_risk_level: "HIGH",
    risk_score: 71,
    status: "AT_RISK",
    value_usd: 3100000,
    cargo_description: "High-Precision Robotics & Optical Sensors",
    milestones: [
      { name: "Departure", location: "Singapore", date: "Oct 14, 2026", completed: true },
      { name: "Indian Ocean Transit", location: "Indian Ocean", date: "Oct 19, 2026", completed: false },
      { name: "Rotterdam Dwell", location: "Rotterdam", date: "Nov 05, 2026", completed: false }
    ],
    related_disruptions: ["DIS-002"],
    mitigation_actions: [
      "Coordinate with Rotterdam Maasvlakte terminal for priority berth crane allocation"
    ],
    route_id: "RTE-01",
    is_demo: true
  },
  {
    id: "SHP-10619",
    tracking_ref: "COS-3382910",
    origin: "CNSHA",
    destination: "USLAX",
    origin_name: "Port of Shanghai",
    dest_name: "Port of Los Angeles",
    carrier: "COSCO Shipping",
    vessel: "COSCO Shipping Universe",
    container_id: "COSU-992014-0",
    departure_date: "2026-10-15",
    expected_arrival: "2026-10-29",
    delivery_deadline: "2026-11-02",
    predicted_delay_hours: 12,
    delay_risk_level: "MEDIUM",
    risk_score: 44,
    status: "IN_TRANSIT",
    value_usd: 2450000,
    cargo_description: "Commercial Solar Inverters & Grid Switchgear",
    milestones: [
      { name: "Departure", location: "Shanghai", date: "Oct 15, 2026", completed: true },
      { name: "Mid-Pacific Transit", location: "Pacific Ocean", date: "Oct 22, 2026", completed: false },
      { name: "LA Port Berth", location: "Los Angeles", date: "Oct 29, 2026", completed: false }
    ],
    related_disruptions: ["DIS-001"],
    mitigation_actions: [
      "Pre-assign off-dock drayage carrier in Long Beach basin"
    ],
    route_id: "RTE-02",
    is_demo: true
  },
  {
    id: "SHP-10702",
    tracking_ref: "HLAG-881920",
    origin: "AEJEA",
    destination: "DEHAM",
    origin_name: "Port of Jebel Ali",
    dest_name: "Port of Hamburg",
    carrier: "Hapag-Lloyd",
    vessel: "Berlin Express",
    container_id: "HLXU-332910-4",
    departure_date: "2026-10-16",
    expected_arrival: "2026-11-06",
    delivery_deadline: "2026-11-12",
    predicted_delay_hours: 4,
    delay_risk_level: "LOW",
    risk_score: 32,
    status: "IN_TRANSIT",
    value_usd: 1900000,
    cargo_description: "Industrial Specialty Chemicals",
    milestones: [
      { name: "Departure", location: "Jebel Ali", date: "Oct 16, 2026", completed: true },
      { name: "Arabian Sea Transit", location: "Arabian Sea", date: "Oct 20, 2026", completed: false },
      { name: "Hamburg Arrival", location: "Hamburg", date: "Nov 06, 2026", completed: false }
    ],
    related_disruptions: [],
    mitigation_actions: [],
    route_id: "RTE-01",
    is_demo: true
  },
  {
    id: "SHP-10844",
    tracking_ref: "ONE-5510293",
    origin: "USLAX",
    destination: "CNSHA",
    origin_name: "Port of Los Angeles",
    dest_name: "Port of Shanghai",
    carrier: "ONE",
    vessel: "ONE Continuity",
    container_id: "ONEY-884012-3",
    departure_date: "2026-10-14",
    expected_arrival: "2026-10-28",
    delivery_deadline: "2026-10-30",
    predicted_delay_hours: 0,
    delay_risk_level: "LOW",
    risk_score: 18,
    status: "ON_TIME",
    value_usd: 1250000,
    cargo_description: "Aerospace Spares & Titanium Billets",
    milestones: [
      { name: "Departed LA", location: "Los Angeles", date: "Oct 14, 2026", completed: true },
      { name: "Deep Pacific Transit", location: "Pacific Ocean", date: "Oct 21, 2026", completed: false },
      { name: "Shanghai Yangshan Inbound", location: "Shanghai", date: "Oct 28, 2026", completed: false }
    ],
    related_disruptions: [],
    mitigation_actions: [],
    route_id: "RTE-02",
    is_demo: true
  }
];

export const DEMO_DISRUPTIONS: DisruptionEvent[] = [
  {
    id: "DIS-001",
    category: "WEATHER",
    headline: "Typhoon Malakas Coastal Gale Warnings: Shanghai Approaches",
    location: "Shanghai Approaches, East China Sea",
    port_code: "CNSHA",
    severity: "HIGH",
    risk_score_impact: 28,
    source_name: "TinyFish Crawler + Shanghai Maritime Safety Administration (MSA)",
    source_url: "https://www.sh.msa.gov.cn/bulletins/2026-10-18-typhoon-warning",
    publication_time: "Today, 08:30 UTC",
    retrieval_time: "14m ago",
    affected_shipments: ["SHP-10482", "SHP-10517", "SHP-10619"],
    description: "Sustained Force 9–10 gale winds (45–55 knots) with wave heights exceeding 6.2 meters across Outer Yangshan approaches. Pilotage suspended for container vessels with draft > 12m.",
    confirmed: true,
    evidence: "Verified via Shanghai MSA official notice #2026-881 and live NOAA wave buoy #21004 telemetry.",
    verification_status: "VERIFIED"
  },
  {
    id: "DIS-002",
    category: "GEOPOLITICAL",
    headline: "Bab el-Mandeb Transit Advisory & Security Threat Escalation",
    location: "Southern Red Sea / Bab el-Mandeb Chokepoint",
    port_code: null,
    severity: "CRITICAL",
    risk_score_impact: 38,
    source_name: "UKMTO Maritime Advisory + Carrier Operational Notices",
    source_url: "https://www.ukmto.org/advisories/2026-redsea",
    publication_time: "Today, 06:15 UTC",
    retrieval_time: "2h ago",
    affected_shipments: ["SHP-10482", "SHP-10517", "SHP-10563"],
    description: "Carriers diverting Asia–Europe sailings via Cape of Good Hope (+10–12 days) following elevated security risk in the southern Red Sea transit corridor.",
    confirmed: true,
    evidence: "Lloyd's List Intelligence vessel AIS tracking confirms 22 container carriers executing 180-degree turnarounds.",
    verification_status: "VERIFIED"
  },
  {
    id: "DIS-003",
    category: "PORT_CONGESTION",
    headline: "Rotterdam Maasvlakte Intermodal Rail Terminal Dwell Spike",
    location: "Port of Rotterdam (NLRTM)",
    port_code: "NLRTM",
    severity: "MEDIUM",
    risk_score_impact: 16,
    source_name: "Port of Rotterdam Operations Bulletin",
    source_url: "https://portofrotterdam.com/notices",
    publication_time: "Yesterday, 18:00 UTC",
    retrieval_time: "4h ago",
    affected_shipments: ["SHP-10482", "SHP-10563"],
    description: "Signal maintenance on Betuweroute freight corridor causing temporary inland container staging congestion (+8–12h turnaround).",
    confirmed: true,
    evidence: "Automated terminal operational telemetry logs confirmed dwell time increase.",
    verification_status: "VERIFIED"
  },
  {
    id: "DIS-004",
    category: "PORT_CONGESTION",
    headline: "Los Angeles Pier 400 Intermodal Rail Chassis Constraint",
    location: "Port of Los Angeles (USLAX)",
    port_code: "USLAX",
    severity: "MEDIUM",
    risk_score_impact: 14,
    source_name: "Port of LA Signal Intelligence",
    source_url: "https://portoflosangeles.org/signal",
    publication_time: "Oct 17, 2026",
    retrieval_time: "1d ago",
    affected_shipments: ["SHP-10619", "SHP-10844"],
    description: "Rail-mounted gantry crane scheduling constraints creating intermodal handoff queues.",
    confirmed: true,
    evidence: "Port of LA public throughput data and drayage queue metrics.",
    verification_status: "VERIFIED"
  }
];

export const DEMO_ALERTS: Alert[] = [
  {
    id: "ALT-0024",
    severity: "HIGH",
    event_category: "WEATHER",
    title: "Typhoon Malakas Coastal Gale Warnings — Shanghai Approaches",
    description: "Outer gale bands have reached Yangshan terminal fairway. 32 active shipments bound for Rotterdam, Antwerp, and Los Angeles impacted by pilotage stoppage.",
    affected_location: "Port of Shanghai (CNSHA)",
    related_shipments: ["SHP-10482", "SHP-10517", "SHP-10619"],
    risk_score: 84,
    source_evidence: "Shanghai MSA Bulletin #2026-881 & NOAA Marine Buoy #21004",
    created_at: "45m ago",
    status: "ACTIVE",
    assigned_to: "Elena Rostova"
  },
  {
    id: "ALT-0025",
    severity: "CRITICAL",
    event_category: "GEOPOLITICAL",
    title: "Bab el-Mandeb Transit Advisory & Security Corridor Escalation",
    description: "High-level risk advisory prompting major alliances (Ocean Alliance, 2M) to reroute container traffic via Cape of Good Hope.",
    affected_location: "Southern Red Sea Chokepoint",
    related_shipments: ["SHP-10482", "SHP-10517", "SHP-10563"],
    risk_score: 89,
    source_evidence: "UKMTO Advisory notice & Carrier AIS track divergences",
    created_at: "2h ago",
    status: "ACTIVE",
    assigned_to: "Marcus Vance"
  },
  {
    id: "ALT-0026",
    severity: "MEDIUM",
    event_category: "PORT_CONGESTION",
    title: "Rotterdam Maasvlakte Intermodal Rail Maintenance Queue",
    description: "Signaling overhaul on Betuwe freight railway causing temporary rail container stacking bottleneck (+8h dwell).",
    affected_location: "Port of Rotterdam (NLRTM)",
    related_shipments: ["SHP-10482", "SHP-10563"],
    risk_score: 48,
    source_evidence: "Port of Rotterdam Operations Portal Bulletin",
    created_at: "4h ago",
    status: "ACKNOWLEDGED",
    assigned_to: "Elena Rostova"
  },
  {
    id: "ALT-0027",
    severity: "MEDIUM",
    event_category: "CARRIER_DELAY",
    title: "Panama Canal Neo-Panamax Daily Transit Slots Reduced to 24",
    description: "Gatun Lake water conservation measures maintaining draft restriction at 44.0 feet.",
    affected_location: "Panama Canal (CWP)",
    related_shipments: ["SHP-10619"],
    risk_score: 56,
    source_evidence: "Panama Canal Authority Advisory A-38-2026",
    created_at: "1d ago",
    status: "ACTIVE"
  },
  {
    id: "ALT-0028",
    severity: "LOW",
    event_category: "PORT_CONGESTION",
    title: "Los Angeles Pier 400 Intermodal Rail Chassis Constraint Cleared",
    description: "Inland intermodal chassis redistribution restored terminal gate turn times to 42 minutes.",
    affected_location: "Port of Los Angeles (USLAX)",
    related_shipments: ["SHP-10844"],
    risk_score: 34,
    source_evidence: "Port of Los Angeles Drayage Dashboard",
    created_at: "1d ago",
    status: "RESOLVED"
  }
];

export const DEMO_INVESTIGATIONS: Investigation[] = [
  {
    id: "INV-0018",
    title: "Suez Canal Transit Feasibility & Rerouting Assessment",
    entity: "Asia–Europe Corridor (RTE-01)",
    risk_severity: "HIGH",
    risk_score: 84,
    status: "COMPLETED",
    owner: "Elena Rostova",
    created_at: "Oct 17, 2026",
    last_updated: "2h ago",
    summary: "Comprehensive assessment evaluating naval escort convoy feasibility versus Cape of Good Hope diversion for 3 ultra-large container vessels transporting $14.1M in high-priority cargo.",
    findings: [
      "Cape diversion adds +9.8 days transit time and ~$142k additional bunker fuel per vessel.",
      "Red Sea security insurance premium surcharge exceeds $85k per transit, offsetting 60% of fuel penalty.",
      "Automotive semiconductors on SHP-10517 will miss factory delivery deadline unless partial air-freight is dispatched."
    ],
    evidence: [
      "UKMTO Incident Report #2026-114",
      "Carrier Notice: Maersk Asia-Europe Reroute Advisory",
      "AIS Speed telemetry from MV Madrid Maersk showing 14.2 kn cruising adjustment"
    ],
    affected_shipments: ["SHP-10482", "SHP-10517", "SHP-10563"],
    recommended_steps: [
      "Approve Cape of Good Hope routing for SHP-10482 and SHP-10563 immediately",
      "Initiate air-cargo charter quote for 15 tons of automotive microcontrollers on SHP-10517",
      "Notify European assembly plants of revised production cadence"
    ],
    timeline: [
      { time: "Oct 17, 09:00 UTC", event: "Investigation initialized following UKMTO advisory bulletin." },
      { time: "Oct 17, 11:30 UTC", event: "TinyFish crawler extracted updated bunker rate indices for Las Palmas refueling." },
      { time: "Oct 17, 14:15 UTC", event: "Deterministic delay synthesis calculated +9.8 days variance." },
      { time: "Oct 18, 08:00 UTC", event: "Final recommendations approved by Lead Maritime Analyst." }
    ]
  },
  {
    id: "INV-0014",
    title: "Panama Canal Neo-Panamax Draft Restrictions & Delay Forecast",
    entity: "Trans-Pacific Route (RTE-02)",
    risk_severity: "MEDIUM",
    risk_score: 58,
    status: "COMPLETED",
    owner: "David Chen",
    created_at: "Oct 14, 2026",
    last_updated: "2d ago",
    summary: "Investigation into Gatun Lake reservoir water levels and booking auction pricing for eastbound consumer goods.",
    findings: [
      "Daily booking slots capped at 24 until November seasonal precipitation replenishes Gatun basin.",
      "Auction surcharge for unreserved transit slots reached $340k."
    ],
    evidence: [
      "Panama Canal Authority Advisory A-38-2026",
      "Lake Gatun water gauge sensor telemetry"
    ],
    affected_shipments: ["SHP-10619"],
    recommended_steps: [
      "Book slot 21 days in advance for upcoming Trans-Pacific voyages",
      "Route heavy solar equipment through US West Coast rail hubs"
    ],
    timeline: [
      { time: "Oct 14, 10:00 UTC", event: "ACP advisory flagged by TinyFish agent." },
      { time: "Oct 14, 16:00 UTC", event: "Cost-benefit model generated." }
    ]
  },
  {
    id: "INV-0021",
    title: "East China Sea Typhoon Malakas Impact on Q4 Electronics Supply",
    entity: "Port of Shanghai (CNSHA)",
    risk_severity: "HIGH",
    risk_score: 79,
    status: "IN_PROGRESS",
    owner: "Elena Rostova",
    created_at: "Oct 18, 2026",
    last_updated: "20m ago",
    summary: "Active real-time tracking of Typhoon Malakas barometric pressure drop and Yangshan pilotage moratorium.",
    findings: [
      "Berth 4 & 5 pilotage suspended until tomorrow 18:00 UTC.",
      "Anchorage container vessel queue increased from 24 to 42 ships in 18 hours."
    ],
    evidence: [
      "Shanghai MSA Notice #2026-881",
      "NOAA Marine Weather Buoy #21004"
    ],
    affected_shipments: ["SHP-10482", "SHP-10517"],
    recommended_steps: [
      "Advise shippers to divert non-loaded containers to Ningbo-Zhoushan terminal",
      "Monitor Shanghai weather radar at 30m intervals"
    ],
    timeline: [
      { time: "Oct 18, 08:30 UTC", event: "Typhoon Malakas alert received from MSA." },
      { time: "Oct 18, 09:10 UTC", event: "Autonomous crawler confirmed pilotage suspension." }
    ]
  },
  {
    id: "INV-0012",
    title: "North Sea Autumn Storms & Rotterdam Berth Dwell Variance",
    entity: "Port of Rotterdam (NLRTM)",
    risk_severity: "LOW",
    risk_score: 35,
    status: "ARCHIVED",
    owner: "Marcus Vance",
    created_at: "Oct 08, 2026",
    last_updated: "1w ago",
    summary: "Seasonal low-pressure systems impact on Maasvlakte container handling.",
    findings: [
      "Minimal operational disruption; crane wind threshold not breached."
    ],
    evidence: [
      "Rotterdam Harbour Master wind logs"
    ],
    affected_shipments: ["SHP-10563"],
    recommended_steps: [
      "Archive file; routine seasonal buffer adequate."
    ],
    timeline: [
      { time: "Oct 08, 12:00 UTC", event: "Routine review concluded." }
    ]
  }
];

export const DEMO_AGENTS: AgentConfig[] = [
  {
    id: "disruption-monitor",
    name: "Disruption Monitor Agent",
    description: "Autonomous TinyFish browser crawler inspecting port authority notices, strike announcements, and maritime circulars.",
    category: "Web Telemetry Crawler",
    status: "ACTIVE",
    frequency: "Every 15 minutes",
    last_run: "4m ago",
    success_rate: 99.4,
    signals_detected: 89,
    target_urls: [
      "https://portshanghai.com.cn/bulletins",
      "https://portofrotterdam.com/operational-notices",
      "https://suezcanal.gov.eg/circulars"
    ],
    logs: [
      "[08:45:02 UTC] TinyFish Crawler instance #4 initialized in sandboxed container.",
      "[08:45:06 UTC] Loaded Shanghai MSA public bulletin page (2.1s).",
      "[08:45:08 UTC] Extracted bulletin #2026-881: 'Typhoon Malakas Gale Warning'.",
      "[08:45:10 UTC] Delta scoring confirmed +28 risk impact on CNSHA.",
      "[08:45:12 UTC] Disruption event record DIS-001 created and correlated to 3 active shipments.",
      "[08:45:15 UTC] Task completed successfully. 1 signal dispatched."
    ],
    pending_signals: [
      {
        id: "SIG-881",
        headline: "Shanghai MSA Gale Warning for Outer Anchorage",
        source: "Shanghai MSA",
        severity: "HIGH",
        location: "Shanghai (CNSHA)",
        timestamp: "12m ago"
      },
      {
        id: "SIG-882",
        headline: "Antwerp Dockworkers Union 24h Warning Strike Vote",
        source: "Belgian Transport Workers Bulletin",
        severity: "MEDIUM",
        location: "Port of Antwerp (BEANR)",
        timestamp: "45m ago"
      }
    ]
  },
  {
    id: "port-congestion-watcher",
    name: "Port Congestion Watcher",
    description: "Evaluates vessel dwell times, berth queues, and pilotage waiting hours across 28 key maritime gateway hubs.",
    category: "Berth Telemetry",
    status: "ACTIVE",
    frequency: "Hourly",
    last_run: "18m ago",
    success_rate: 98.9,
    signals_detected: 42,
    target_urls: [
      "https://ais.marinetraffic.com/shanghai-anchorage",
      "https://vesselfinder.com/ports/rotterdam",
      "https://portoflosangeles.org/signal"
    ],
    logs: [
      "[08:30:00 UTC] Scraped anchorage queue depths for 6 tier-1 gateway ports.",
      "[08:30:14 UTC] Shanghai anchorage count increased to 42 (+18 vessels).",
      "[08:30:19 UTC] Port of LA Pier 400 rail dwell steady at 26h."
    ]
  },
  {
    id: "weather-hazard-scout",
    name: "Weather Hazard Scout",
    description: "Ingests NOAA and JMA cyclone advisories, wave heights, and marine storm tracks along international freight lanes.",
    category: "Meteorological AI",
    status: "ACTIVE",
    frequency: "Every 30 minutes",
    last_run: "12m ago",
    success_rate: 100.0,
    signals_detected: 31,
    target_urls: [
      "https://ocean.weather.gov/marine_bulletins",
      "https://jma.go.jp/cyclones"
    ],
    logs: [
      "[08:35:10 UTC] NOAA Pacific basin wave radar processed.",
      "[08:35:18 UTC] Typhoon Malakas central pressure registered at 965 hPa.",
      "[08:35:22 UTC] Wave height model verified 6.2m waves on approach fairway."
    ]
  },
  {
    id: "carrier-schedule-auditor",
    name: "Carrier Schedule Auditor",
    description: "Audits blank sailings, vessel substitutions, and ETA variances via carrier EDI and schedule updates.",
    category: "Carrier EDI Feed",
    status: "PAUSED",
    frequency: "Every 6 hours",
    last_run: "5h ago",
    success_rate: 96.5,
    signals_detected: 14,
    target_urls: [
      "https://api.maersk.com/schedules/v2",
      "https://api.msc.com/tracking"
    ],
    logs: [
      "[03:00:00 UTC] Pulled 240 active booking schedule updates across 2M alliance.",
      "[03:00:22 UTC] Identified 3 blank sailing adjustments for week 44."
    ]
  }
];

export const DEMO_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "NOTIF-01",
    title: "High Risk Alert: Typhoon Malakas Gale Warnings",
    message: "Shanghai Maritime Safety Administration suspended pilotage. 32 shipments bound for Europe and US impacted.",
    category: "ALERT",
    priority: "CRITICAL",
    read: false,
    timestamp: "12m ago",
    group: "Today",
    link: "/alerts/ALT-0024"
  },
  {
    id: "NOTIF-02",
    title: "Investigation Completed: INV-0018",
    message: "Elena Rostova concluded assessment on Suez transit feasibility. Cape diversion recommended for SHP-10482.",
    category: "INVESTIGATION",
    priority: "HIGH",
    read: false,
    timestamp: "2h ago",
    group: "Today",
    link: "/ai-analyst/investigations/INV-0018"
  },
  {
    id: "NOTIF-03",
    title: "TinyFish Agent Signal: Port of Antwerp Strike Notice",
    message: "Disruption Monitor detected union 24h warning strike ballot scheduled for Oct 22.",
    category: "AGENT",
    priority: "MEDIUM",
    read: false,
    timestamp: "4h ago",
    group: "Today",
    link: "/agent-center/disruption-monitor"
  },
  {
    id: "NOTIF-04",
    title: "Shipment ETA Update: SHP-10482",
    message: "Revised ETA variance calculated at +34 hours due to chokepoint congestion.",
    category: "SYSTEM",
    priority: "HIGH",
    read: true,
    timestamp: "6h ago",
    group: "Today",
    link: "/shipments/SHP-10482"
  },
  {
    id: "NOTIF-05",
    title: "Critical Alert: Bab el-Mandeb Security Advisory",
    message: "UKMTO notice issued for Southern Red Sea transit corridor.",
    category: "ALERT",
    priority: "CRITICAL",
    read: true,
    timestamp: "Yesterday, 14:20",
    group: "Yesterday",
    link: "/alerts/ALT-0025"
  },
  {
    id: "NOTIF-06",
    title: "Port Congestion Warning: Rotterdam Rail Maintenance",
    message: "Maasvlakte rail corridor reporting +8h container dwell variance.",
    category: "ALERT",
    priority: "MEDIUM",
    read: true,
    timestamp: "Yesterday, 18:00",
    group: "Yesterday",
    link: "/alerts/ALT-0026"
  },
  {
    id: "NOTIF-07",
    title: "System Update: Platform Telemetry v2.8.4",
    message: "Integrated new NOAA marine radar feed and automated corridor recalculation models.",
    category: "SYSTEM",
    priority: "LOW",
    read: true,
    timestamp: "3 days ago",
    group: "Earlier"
  },
  {
    id: "NOTIF-08",
    title: "New Investigation Opened: INV-0014",
    message: "David Chen opened investigation into Panama Canal Neo-Panamax draft limits.",
    category: "INVESTIGATION",
    priority: "MEDIUM",
    read: true,
    timestamp: "4 days ago",
    group: "Earlier",
    link: "/ai-analyst/investigations/INV-0014"
  }
];

export const DEMO_TEMPLATES: PromptTemplate[] = [
  {
    id: "TPL-01",
    title: "Port Congestion Deep Dive",
    description: "Evaluates anchorage queue length, berth dwell trends, and alternative diversion hubs for a specific gateway.",
    category: "Port Operations",
    promptText: "Analyze port congestion at {Port_Code}. What is the current berth waiting queue, which active shipments are bound for this port, and what are the top 2 alternative diversion terminals?",
    tags: ["Port", "Congestion", "Diversion"],
    type: "template",
    usageCount: 42,
    lastUsed: "2h ago"
  },
  {
    id: "TPL-02",
    title: "Chokepoint Reroute Scenario Assessment",
    description: "Calculates cost, fuel, and transit day tradeoffs between primary canal corridors and cape diversions.",
    category: "Route Optimization",
    promptText: "Compare continuing transit through {Chokepoint_Name} versus rerouting around {Alternative_Cape}. Include fuel cost delta, additional transit days, and cargo risk reduction.",
    tags: ["Route", "Chokepoint", "Suez", "Cape"],
    type: "template",
    usageCount: 38,
    lastUsed: "Yesterday"
  },
  {
    id: "TPL-03",
    title: "Supplier High-Value Cargo Exposure Audit",
    description: "Scans active shipments for temperature-sensitive, high-value, or contractually penalizing cargo at risk.",
    category: "Risk Management",
    promptText: "Identify all active shipments with cargo value > $2,000,000 that currently have risk scores > 70. Summarize their origin, destination, carrier, and SLA deadlines.",
    tags: ["High Value", "SLA", "Exposure"],
    type: "template",
    usageCount: 29,
    lastUsed: "3 days ago"
  },
  {
    id: "TPL-04",
    title: "Weather Incident Briefing & Fleet Alert",
    description: "Generates an executive operational summary for maritime weather events (typhoons, hurricanes, gales).",
    category: "Meteorology",
    promptText: "Provide an executive briefing on weather disturbance {Weather_Event_Name}. Which shipping lanes are within the gale force radius and what vessels should alter course?",
    tags: ["Weather", "Typhoon", "Executive"],
    type: "template",
    usageCount: 19,
    lastUsed: "Oct 15"
  },
  {
    id: "PRM-01",
    title: "Shanghai Port gale impact on electronics",
    description: "Quick inquiry on Shanghai Yangshan berth closure impact.",
    category: "Quick Inquiries",
    promptText: "What is the impact of Typhoon Malakas on container shipments departing Shanghai this week?",
    tags: ["Shanghai", "Electronics"],
    type: "saved_prompt",
    usageCount: 14,
    lastUsed: "Today"
  },
  {
    id: "PRM-02",
    title: "Suez Canal vs Cape of Good Hope delay",
    description: "Transit days comparison for Asia–Europe.",
    category: "Quick Inquiries",
    promptText: "How many additional days does routing around the Cape of Good Hope add to Rotterdam delivery?",
    tags: ["Suez", "Delay"],
    type: "saved_prompt",
    usageCount: 22,
    lastUsed: "Yesterday"
  },
  {
    id: "PRM-03",
    title: "At-risk automotive semiconductor inventory",
    description: "List all auto microcontrollers with delivery variance > 24h.",
    category: "Quick Inquiries",
    promptText: "List all automotive semiconductor containers with delay variance greater than 24 hours.",
    tags: ["Automotive", "Semiconductors"],
    type: "saved_prompt",
    usageCount: 17,
    lastUsed: "Oct 16"
  },
  {
    id: "PRM-04",
    title: "Port of LA truck gate turnaround times",
    description: "Check drayage chassis availability at Pier 400.",
    category: "Quick Inquiries",
    promptText: "What are the latest drayage gate turn times at Port of Los Angeles Pier 400?",
    tags: ["Los Angeles", "Drayage"],
    type: "saved_prompt",
    usageCount: 9,
    lastUsed: "Oct 12"
  }
];

export const DEMO_DATA_SOURCES: DataSource[] = [
  {
    id: "DS-01",
    name: "TinyFish Web Telemetry Crawler",
    type: "Autonomous Browser Agent",
    status: "ONLINE",
    syncFrequency: "Every 15 minutes",
    lastSync: "4m ago",
    recordsCount: 14820,
    description: "Autonomous Chromium crawler scraping public port authority bulletins, maritime circulars, and union strike votes across 180 global nodes.",
    confidenceScore: 99.4
  },
  {
    id: "DS-02",
    name: "NOAA Global Marine Meteorological Feed",
    type: "Meteorological REST API",
    status: "CONNECTED",
    syncFrequency: "Every 30 minutes",
    lastSync: "12m ago",
    recordsCount: 42100,
    description: "National Oceanic and Atmospheric Administration real-time wave buoy data, tropical cyclone tracking, and high-seas gale warnings.",
    confidenceScore: 99.8
  },
  {
    id: "DS-03",
    name: "MarineTraffic AIS Satellite Telemetry",
    type: "Vessel Positioning Stream",
    status: "CONNECTED",
    syncFrequency: "Real-time streaming",
    lastSync: "Just now",
    recordsCount: 215000,
    description: "Automatic Identification System satellite tracking providing real-time vessel coordinates, speeds, headings, and course deviations.",
    confidenceScore: 99.1
  },
  {
    id: "DS-04",
    name: "Carrier EDI-315 Status Integrations",
    type: "Direct EDI Feed",
    status: "CONFIGURED",
    syncFrequency: "Hourly batch",
    lastSync: "48m ago",
    recordsCount: 8840,
    description: "Standard Electronic Data Interchange container milestone status messages (gate-in, loaded, vessel departed, transshipment, discharged).",
    confidenceScore: 98.5
  },
  {
    id: "DS-05",
    name: "Lloyd's List Intelligence Maritime Circulars",
    type: "RSS & Structured Intelligence",
    status: "CONNECTED",
    syncFrequency: "Every 2 hours",
    lastSync: "1h ago",
    recordsCount: 3410,
    description: "Global maritime security incidents, canal authority surcharge announcements, and commercial freight rate adjustments.",
    confidenceScore: 97.6
  }
];
