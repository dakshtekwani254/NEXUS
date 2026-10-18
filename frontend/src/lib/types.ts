export type RiskSeverity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type ShipmentStatus = "ON_TIME" | "AT_RISK" | "DELAYED" | "DELIVERED" | "IN_TRANSIT" | "CUSTOMS_HOLD";

export type AlertStatus = "ACTIVE" | "ACKNOWLEDGED" | "DISMISSED" | "RESOLVED";

export type EventCategory = 
  | "WEATHER" 
  | "PORT_CONGESTION" 
  | "CARRIER_DELAY" 
  | "LABOUR_STRIKE" 
  | "GEOPOLITICAL" 
  | "TRADE_RESTRICTION";

export interface Milestone {
  name: string;
  location: string;
  date: string;
  completed: boolean;
  status_note?: string;
}

export interface DisruptionEvent {
  id: string;
  category: EventCategory;
  headline: string;
  title?: string;
  location: string;
  port_code?: string | null;
  severity: RiskSeverity;
  risk_score_impact: number;
  source_name: string;
  source_url?: string | null;
  publication_time: string;
  retrieval_time: string;
  affected_shipments: string[];
  affectedShipmentsCount?: number;
  description: string;
  confirmed: boolean;
  evidence: string;
  verification_status: "VERIFIED" | "INFERRED" | "SIMULATED";
}

export interface Port {
  code: string;
  id?: string;
  name: string;
  country: string;
  lat: number;
  lng: number;
  risk_score: number;
  severity: RiskSeverity;
  congestion_index: number;
  avg_berth_wait_hours: number;
  waitingTime?: string;
  status?: string;
  weather_score: number;
  active_notices: string[];
  affected_shipments_count: number;
  affectedShipmentsCount?: number;
  historical_trend: number[];
  last_updated: string;
  data_source: string;
  is_demo: boolean;
  alternative_ports: string[];
}

export interface RouteAlternative {
  name: string;
  transit_days: number;
  additional_cost_usd: number;
  risk_score: number;
  description: string;
}

export interface Route {
  id: string;
  name: string;
  origin_code: string;
  dest_code: string;
  origin?: string;
  destination?: string;
  waypoints: [number, number][];
  baseline_days: number;
  current_risk_score: number;
  status: string;
  riskLevel?: RiskSeverity;
  transitEstimate?: string;
  affectedShipments?: number;
  alternatives: RouteAlternative[];
}

export interface Shipment {
  id: string;
  tracking_ref: string;
  origin: string;
  destination: string;
  origin_name: string;
  dest_name: string;
  carrier: string;
  vessel?: string;
  container_id?: string;
  departure_date: string;
  expected_arrival: string;
  delivery_deadline: string;
  predicted_delay_hours: number;
  delay_risk_level: RiskSeverity;
  risk_level?: RiskSeverity;
  riskLevel?: RiskSeverity;
  risk_score: number;
  riskScore?: number;
  status: ShipmentStatus;
  value_usd: number;
  cargo_description: string;
  milestones: Milestone[];
  related_disruptions: string[];
  mitigation_actions: string[];
  route?: string;
  route_id?: string;
  eta?: string;
  is_demo: boolean;
}

export interface Alert {
  id: string;
  severity: RiskSeverity;
  event_category: EventCategory;
  title: string;
  description: string;
  affected_location: string;
  related_shipments: string[];
  risk_score: number;
  source_evidence: string;
  created_at: string;
  status: AlertStatus;
  assigned_to?: string;
  timestamp?: string;
  category?: string;
}

export interface AgentObservation {
  id: string;
  job_id: string;
  source_name: string;
  source_url: string;
  retrieval_timestamp: string;
  extracted_headline: string;
  raw_snippet: string;
  affected_location: string;
  severity: RiskSeverity;
  confidence_score: number;
  verified: boolean;
}

export interface AgentJob {
  id: string;
  source_name: string;
  target_url: string;
  auth_type: string;
  status: "SUCCESS" | "RUNNING" | "FAILED" | "AUTHENTICATION_REQUIRED";
  execution_time_ms: number;
  started_at: string;
  completed_at?: string;
  records_extracted: number;
  logs: string[];
  observations: AgentObservation[];
  error_message?: string | null;
}

export interface RiskConfiguration {
  weather_weight: number;
  congestion_weight: number;
  carrier_weight: number;
  labour_weight: number;
  geopolitical_weight: number;
  high_risk_threshold: number;
  medium_risk_threshold: number;
  refresh_interval_minutes: number;
  monitoring_mode: string;
  tinyfish_api_key_configured: boolean;
  llm_api_key_configured: boolean;
}

export interface KPISummary {
  monitored_shipments: number;
  at_risk_shipments: number;
  active_disruptions: number;
  high_risk_ports: number;
  predicted_delays_count: number;
  potential_financial_exposure: number;
  last_refresh_time: string;
  monitoring_status: string;
}

export interface DashboardSummaryResponse {
  kpis: KPISummary;
  ports: Port[];
  routes: Route[];
  top_disruptions: DisruptionEvent[];
  recent_shipments: Shipment[];
  risk_distribution: {
    high: number;
    medium: number;
    low: number;
  };
  trend_history: {
    day: string;
    risk_index: number;
    active_events: number;
  }[];
}

export interface AnalystResponse {
  answer: string;
  structured_findings: string[];
  affected_shipments?: any[];
  related_disruptions?: any[];
  recommended_mitigations?: string[];
  suggested_followups?: string[];
  data_grounded?: boolean;
  mode?: "LIVE_LLM" | "DETERMINISTIC_ENGINE";
}

export interface Investigation {
  id: string;
  title: string;
  entity: string;
  primaryEntity?: string;
  type?: string;
  scope?: string;
  risk_severity: RiskSeverity;
  riskLevel?: RiskSeverity;
  risk_score: number;
  status: "COMPLETED" | "IN_PROGRESS" | "ARCHIVED" | "Completed" | "In Progress" | "Archived";
  owner: string;
  created_at: string;
  createdAt?: string;
  last_updated: string;
  updatedAt?: string;
  summary: string;
  findings: string[];
  evidence: string[];
  affected_shipments: string[];
  affectedShipmentsCount?: number;
  recommended_steps: string[];
  timeline: { time: string; event: string }[];
}

export interface AgentConfig {
  id: string;
  name: string;
  description: string;
  category: string;
  status: "ACTIVE" | "PAUSED" | "PENDING_REVIEW";
  frequency: string;
  last_run: string;
  lastActive?: string;
  currentTask?: string;
  scope?: string;
  mode?: string;
  completedTasksCount?: number;
  success_rate: number;
  signals_detected: number;
  target_urls: string[];
  logs: string[];
  pending_signals?: {
    id: string;
    headline: string;
    source: string;
    severity: RiskSeverity;
    location: string;
    timestamp: string;
  }[];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  category: "ALERT" | "INVESTIGATION" | "SYSTEM" | "AGENT";
  priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  read: boolean;
  timestamp: string;
  group: "Today" | "Yesterday" | "Earlier";
  link?: string;
}

export interface PromptTemplate {
  id: string;
  title: string;
  description: string;
  category: string;
  promptText?: string;
  prompt?: string;
  tags?: string[];
  type?: "template" | "saved_prompt";
  usageCount: number;
  lastUsed: string;
}

export interface DataSource {
  id: string;
  name: string;
  type: string;
  status: "ONLINE" | "CONNECTED" | "CONFIGURED" | "DISCONNECTED" | "Connected" | "Degraded" | "Offline";
  syncFrequency?: string;
  lastSync: string;
  recordsCount: number | string;
  description?: string;
  confidenceScore?: number;
  latency?: string;
}

export interface ResearchRequest {
  query: string;
  context?: string;
  port_code?: string;
  route_id?: string;
  carrier?: string;
  disruption_type?: string;
  include_demo_fallback?: boolean;
}

export interface ResearchEvidenceItem {
  id: string;
  title: string;
  summary: string;
  source_name: string;
  source_url: string;
  publication_time?: string;
  retrieval_timestamp: string;
  location?: string;
  port_code?: string;
  route_id?: string;
  carrier?: string;
  disruption_type?: string;
  severity: RiskSeverity | "UNKNOWN";
  evidence_excerpt: string;
  verification_status: "SOURCED_FACT" | "ANALYTICAL_INFERENCE" | "UNVERIFIED_CLAIM" | "SIMULATED";
  confidence_score: number;
  corroborating_data?: string;
}

export interface ResearchResponse {
  research_id: string;
  query: string;
  timestamp: string;
  status: "SUCCESS" | "NOT_CONFIGURED" | "ERROR" | "RATE_LIMITED" | "TIMEOUT" | "NO_RESULTS";
  message: string;
  connection_mode: "LIVE_TINYFISH" | "NOT_CONFIGURED" | "SIMULATION";
  evidence_items: ResearchEvidenceItem[];
  summary_findings: string[];
  affected_locations: string[];
  suggested_actions: string[];
  execution_time_ms: number;
}

export interface ResearchStatus {
  status: "CONNECTED" | "NOT_CONFIGURED" | "ERROR";
  api_key_configured: boolean;
  sdk_installed: boolean;
  api_base_url: string;
  supported_features: string[];
  message: string;
}

