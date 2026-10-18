"""
NEXUS Supply Chain Intelligence - Data Models
Typed Pydantic schemas for the entire platform.
"""
from typing import List, Optional, Dict, Any, Literal
from pydantic import BaseModel, Field
from datetime import datetime

# Risk Severity Levels
RiskSeverity = Literal["LOW", "MEDIUM", "HIGH", "CRITICAL"]

# Shipment Statuses
ShipmentStatus = Literal["ON_TIME", "AT_RISK", "DELAYED", "DELIVERED", "IN_TRANSIT", "CUSTOMS_HOLD"]

# Alert Statuses
AlertStatus = Literal["ACTIVE", "ACKNOWLEDGED", "DISMISSED", "RESOLVED"]

# Event Categories
EventCategory = Literal[
    "WEATHER", 
    "PORT_CONGESTION", 
    "CARRIER_DELAY", 
    "LABOUR_STRIKE", 
    "GEOPOLITICAL", 
    "TRADE_RESTRICTION"
]

class Milestone(BaseModel):
    name: str
    location: str
    date: str
    completed: bool
    status_note: Optional[str] = None

class DisruptionEvent(BaseModel):
    id: str
    category: EventCategory
    headline: str
    location: str
    port_code: Optional[str] = None
    severity: RiskSeverity
    risk_score_impact: int = Field(ge=0, le=100)
    source_name: str
    source_url: Optional[str] = None
    publication_time: str
    retrieval_time: str
    affected_shipments: List[str] = []
    description: str
    confirmed: bool = True
    evidence: str
    verification_status: Literal["VERIFIED", "INFERRED", "SIMULATED"] = "VERIFIED"

class Port(BaseModel):
    code: str
    name: str
    country: str
    lat: float
    lng: float
    risk_score: int = Field(ge=0, le=100)
    severity: RiskSeverity
    congestion_index: float  # e.g. 0.0 to 10.0 or wait days
    avg_berth_wait_hours: float
    weather_score: int
    active_notices: List[str] = []
    affected_shipments_count: int = 0
    historical_trend: List[int] = [] # last 7 days scores
    last_updated: str
    data_source: str
    is_demo: bool = True
    alternative_ports: List[str] = []

class RouteAlternative(BaseModel):
    name: str
    transit_days: int
    additional_cost_usd: int
    risk_score: int
    description: str

class Route(BaseModel):
    id: str
    name: str
    origin_code: str
    dest_code: str
    waypoints: List[List[float]] # [lat, lng] pairs
    baseline_days: int
    current_risk_score: int
    status: str
    alternatives: List[RouteAlternative] = []

class Shipment(BaseModel):
    id: str
    tracking_ref: str
    origin: str          # Port code, e.g. "CNSHA"
    destination: str     # Port code, e.g. "USLAX"
    origin_name: str
    dest_name: str
    carrier: str
    vessel: Optional[str] = None
    container_id: Optional[str] = None
    departure_date: str
    expected_arrival: str
    delivery_deadline: str
    predicted_delay_hours: int = 0
    delay_risk_level: RiskSeverity = "LOW"
    risk_score: int = Field(default=0, ge=0, le=100)
    status: ShipmentStatus = "IN_TRANSIT"
    value_usd: int = 0
    cargo_description: str = "Standard Freight"
    milestones: List[Milestone] = []
    related_disruptions: List[str] = [] # Disruption IDs
    mitigation_actions: List[str] = []
    route_id: Optional[str] = None
    is_demo: bool = True

class RiskFactors(BaseModel):
    weather: int = Field(ge=0, le=100)
    port_congestion: int = Field(ge=0, le=100)
    carrier_delays: int = Field(ge=0, le=100)
    labour: int = Field(ge=0, le=100)
    geopolitical: int = Field(ge=0, le=100)

class RiskAssessment(BaseModel):
    id: str
    category: str
    location: str
    port_code: Optional[str] = None
    risk_score: int = Field(ge=0, le=100)
    severity: RiskSeverity
    forecast_24h: int
    forecast_72h: int
    forecast_7d: int
    confidence: float # 0.0 - 1.0
    data_freshness: str
    contributing_factors: RiskFactors
    supporting_evidence: List[str]
    recommended_next_steps: List[str]
    why_this_risk: Dict[str, Any]

class Alert(BaseModel):
    id: str
    severity: RiskSeverity
    event_category: EventCategory
    title: str
    description: str
    affected_location: str
    related_shipments: List[str] = []
    risk_score: int
    source_evidence: str
    created_at: str
    status: AlertStatus = "ACTIVE"
    assigned_to: Optional[str] = "Supply Chain Response Team"

class AgentObservation(BaseModel):
    id: str
    job_id: str
    source_name: str
    source_url: str
    retrieval_timestamp: str
    extracted_headline: str
    raw_snippet: str
    affected_location: str
    severity: RiskSeverity
    confidence_score: float
    verified: bool = True

class AgentJob(BaseModel):
    id: str
    source_name: str
    target_url: str
    auth_type: Literal["PUBLIC", "BASIC_AUTH", "API_BEARER", "SESSION_COOKIES"] = "PUBLIC"
    status: Literal["SUCCESS", "RUNNING", "FAILED", "AUTHENTICATION_REQUIRED"] = "SUCCESS"
    execution_time_ms: int
    started_at: str
    completed_at: Optional[str] = None
    records_extracted: int = 0
    logs: List[str] = []
    observations: List[AgentObservation] = []
    error_message: Optional[str] = None

class RiskConfiguration(BaseModel):
    weather_weight: float = 0.25
    congestion_weight: float = 0.30
    carrier_weight: float = 0.20
    labour_weight: float = 0.15
    geopolitical_weight: float = 0.10
    high_risk_threshold: int = 70
    medium_risk_threshold: int = 40
    refresh_interval_minutes: int = 15
    monitoring_mode: Literal["LIVE", "DEMO_HYBRID", "SIMULATION"] = "DEMO_HYBRID"
    tinyfish_api_key_configured: bool = False
    llm_api_key_configured: bool = False

class KPISummary(BaseModel):
    monitored_shipments: int
    at_risk_shipments: int
    active_disruptions: int
    high_risk_ports: int
    predicted_delays_count: int
    potential_financial_exposure: int
    last_refresh_time: str
    monitoring_status: str

class AnalystQueryRequest(BaseModel):
    question: str
    context_shipment_id: Optional[str] = None
    context_port_code: Optional[str] = None

class AnalystResponse(BaseModel):
    answer: str
    structured_findings: List[str] = []
    affected_shipments: List[Dict[str, Any]] = []
    related_disruptions: List[Dict[str, Any]] = []
    recommended_mitigations: List[str] = []
    suggested_followups: List[str] = []
    data_grounded: bool = True
    mode: Literal["LIVE_LLM", "DETERMINISTIC_ENGINE"] = "DETERMINISTIC_ENGINE"

class CSVImportRow(BaseModel):
    tracking_ref: str
    origin: str
    destination: str
    carrier: str
    departure_date: str
    expected_arrival: str
    delivery_deadline: str
    value_usd: int
    cargo_description: Optional[str] = "General Freight"

class ResearchRequest(BaseModel):
    query: str
    context: Optional[str] = None
    port_code: Optional[str] = None
    route_id: Optional[str] = None
    carrier: Optional[str] = None
    disruption_type: Optional[str] = None
    include_demo_fallback: bool = True

class ResearchEvidenceItem(BaseModel):
    id: str
    title: str
    summary: str
    source_name: str
    source_url: str
    publication_time: Optional[str] = None
    retrieval_timestamp: str
    location: Optional[str] = None
    port_code: Optional[str] = None
    route_id: Optional[str] = None
    carrier: Optional[str] = None
    disruption_type: Optional[str] = None
    severity: Optional[str] = "MEDIUM"  # LOW, MEDIUM, HIGH, CRITICAL, UNKNOWN
    evidence_excerpt: str
    verification_status: Literal["SOURCED_FACT", "ANALYTICAL_INFERENCE", "UNVERIFIED_CLAIM", "SIMULATED"] = "SOURCED_FACT"
    confidence_score: float = 0.95
    corroborating_data: Optional[str] = None

class ResearchResponse(BaseModel):
    research_id: str
    query: str
    timestamp: str
    status: Literal["SUCCESS", "NOT_CONFIGURED", "ERROR", "RATE_LIMITED", "TIMEOUT", "NO_RESULTS"]
    message: str
    connection_mode: Literal["LIVE_TINYFISH", "NOT_CONFIGURED", "SIMULATION"]
    evidence_items: List[ResearchEvidenceItem] = []
    summary_findings: List[str] = []
    affected_locations: List[str] = []
    suggested_actions: List[str] = []
    execution_time_ms: int = 0

