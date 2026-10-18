"""
NEXUS — Supply Chain Intelligence Platform Backend
FastAPI server providing RESTful APIs, data validation, TinyFish agent orchestration,
risk scoring engine, and AI Analyst intelligence reasoning.
"""
import csv
import io
from datetime import datetime, timezone
from typing import Dict, List, Optional, Any
from fastapi import FastAPI, HTTPException, UploadFile, File, Query, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import ValidationError

from models import (
    Shipment, Port, Route, DisruptionEvent, Alert, RiskConfiguration,
    AnalystQueryRequest, AnalystResponse, KPISummary,
    ResearchRequest, ResearchResponse, ResearchEvidenceItem
)
from database import db, get_utc_now_iso
from risk_engine import RiskEngine
from tinyfish_service import TinyFishClient, TinyFishResearchService
from ai_analyst import AIAnalyst

app = FastAPI(
    title="NEXUS Supply Chain Intelligence API",
    description="Real-time predictive disruption platform powered by TinyFish and multi-factor risk engine.",
    version="1.0.0"
)

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------------------------------------------
# 1. Health & Summary
# -------------------------------------------------------------
@app.get("/api/health")
def get_health():
    return {
        "status": "healthy",
        "service": "NEXUS Supply Chain Intelligence",
        "version": "1.0.0",
        "server_time": get_utc_now_iso(),
        "database_records": {
            "ports": len(db.ports),
            "shipments": len(db.shipments),
            "disruptions": len(db.disruptions),
            "alerts": len(db.alerts),
            "agent_jobs": len(db.agent_jobs)
        }
    }

@app.get("/api/dashboard/summary")
def get_dashboard_summary():
    shipments_list = list(db.shipments.values())
    disruptions_list = list(db.disruptions.values())
    ports_list = list(db.ports.values())

    high_threshold = db.config.get("high_risk_threshold", 70)
    medium_threshold = db.config.get("medium_risk_threshold", 40)

    at_risk = [s for s in shipments_list if s.get("risk_score", 0) >= high_threshold or s.get("status") in ("AT_RISK", "DELAYED")]
    predicted_delays = [s for s in shipments_list if s.get("predicted_delay_hours", 0) > 0]
    high_risk_ports = [p for p in ports_list if p.get("risk_score", 0) >= high_threshold]
    total_exposure = sum(s.get("value_usd", 0) for s in at_risk)

    kpi = {
        "monitored_shipments": len(shipments_list),
        "at_risk_shipments": len(at_risk),
        "active_disruptions": len([d for d in disruptions_list if d.get("severity") in ("HIGH", "CRITICAL", "MEDIUM")]),
        "high_risk_ports": len(high_risk_ports),
        "predicted_delays_count": len(predicted_delays),
        "potential_financial_exposure": total_exposure,
        "last_refresh_time": get_utc_now_iso(),
        "monitoring_status": "ACTIVE_MONITORING"
    }

    # Risk distribution
    high_count = len([s for s in shipments_list if s.get("risk_score", 0) >= high_threshold])
    med_count = len([s for s in shipments_list if medium_threshold <= s.get("risk_score", 0) < high_threshold])
    low_count = len([s for s in shipments_list if s.get("risk_score", 0) < medium_threshold])

    # Recent disruptions sorted descending
    sorted_disruptions = sorted(disruptions_list, key=lambda x: x.get("retrieval_time", ""), reverse=True)

    # 7-day risk trend points (simulated aggregate index)
    trend_history = [
        {"day": "Day -6", "risk_index": 48, "active_events": 3},
        {"day": "Day -5", "risk_index": 52, "active_events": 3},
        {"day": "Day -4", "risk_index": 50, "active_events": 4},
        {"day": "Day -3", "risk_index": 58, "active_events": 4},
        {"day": "Day -2", "risk_index": 64, "active_events": 5},
        {"day": "Yesterday", "risk_index": 71, "active_events": 6},
        {"day": "Today", "risk_index": 74, "active_events": len(disruptions_list)},
    ]

    return {
        "kpis": kpi,
        "ports": ports_list,
        "routes": list(db.routes.values()),
        "top_disruptions": sorted_disruptions[:6],
        "recent_shipments": shipments_list[:6],
        "risk_distribution": {
            "high": high_count,
            "medium": med_count,
            "low": low_count
        },
        "trend_history": trend_history
    }

# -------------------------------------------------------------
# 2. Shipments CRUD, Search, Filter, CSV Import/Export
# -------------------------------------------------------------
@app.get("/api/shipments")
def get_shipments(
    search: Optional[str] = None,
    carrier: Optional[str] = None,
    status: Optional[str] = None,
    risk_level: Optional[str] = None,
    origin: Optional[str] = None,
    destination: Optional[str] = None,
    sort_by: str = "risk_score",
    sort_order: str = "desc"
):
    items = list(db.shipments.values())

    if search:
        s_low = search.lower()
        items = [
            i for i in items 
            if s_low in i["id"].lower() 
            or s_low in i["tracking_ref"].lower()
            or s_low in i.get("cargo_description", "").lower()
            or s_low in i.get("carrier", "").lower()
        ]

    if carrier:
        items = [i for i in items if i.get("carrier") == carrier]
    if status:
        items = [i for i in items if i.get("status") == status]
    if risk_level:
        items = [i for i in items if i.get("delay_risk_level") == risk_level]
    if origin:
        items = [i for i in items if i.get("origin") == origin]
    if destination:
        items = [i for i in items if i.get("destination") == destination]

    # Sorting
    reverse = (sort_order.lower() == "desc")
    if sort_by in ["risk_score", "predicted_delay_hours", "value_usd"]:
        items.sort(key=lambda x: x.get(sort_by, 0), reverse=reverse)
    elif sort_by in ["id", "carrier", "status", "expected_arrival", "departure_date"]:
        items.sort(key=lambda x: str(x.get(sort_by, "")), reverse=reverse)

    return {"total": len(items), "shipments": items}

@app.get("/api/shipments/{shipment_id}")
def get_shipment_detail(shipment_id: str):
    shp = db.shipments.get(shipment_id)
    if not shp:
        raise HTTPException(status_code=404, detail=f"Shipment {shipment_id} not found")

    # Fetch related disruption objects
    related_disruptions = [
        db.disruptions[d_id] for d_id in shp.get("related_disruptions", [])
        if d_id in db.disruptions
    ]

    # Fetch route if available
    route = db.routes.get(shp.get("route_id", ""))

    return {
        "shipment": shp,
        "disruptions": related_disruptions,
        "route": route,
        "origin_port": db.ports.get(shp.get("origin")),
        "dest_port": db.ports.get(shp.get("destination"))
    }

@app.post("/api/shipments")
def create_shipment(payload: Dict[str, Any]):
    # Validate with Pydantic
    try:
        # Generate ID if missing
        if "id" not in payload or not payload["id"]:
            next_num = len(db.shipments) + 8840
            payload["id"] = f"SHP-{next_num}"

        if "tracking_ref" not in payload or not payload["tracking_ref"]:
            payload["tracking_ref"] = f"TRK-{payload['id']}"

        # Resolve port names if missing
        origin_port = db.ports.get(payload.get("origin", ""))
        dest_port = db.ports.get(payload.get("destination", ""))
        payload["origin_name"] = origin_port["name"] if origin_port else payload.get("origin", "")
        payload["dest_name"] = dest_port["name"] if dest_port else payload.get("destination", "")

        # Compute initial risk
        score, severity, delay, status = RiskEngine.calculate_shipment_risk(payload, db.config)
        payload["risk_score"] = score
        payload["delay_risk_level"] = severity
        payload["predicted_delay_hours"] = delay
        payload["status"] = status
        payload["is_demo"] = True

        shp = Shipment(**payload)
        db.shipments[shp.id] = shp.model_dump()
        db.save_to_file()
        return db.shipments[shp.id]
    except ValidationError as ve:
        raise HTTPException(status_code=422, detail=ve.errors())
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.put("/api/shipments/{shipment_id}")
def update_shipment(shipment_id: str, payload: Dict[str, Any]):
    if shipment_id not in db.shipments:
        raise HTTPException(status_code=404, detail="Shipment not found")

    existing = db.shipments[shipment_id]
    existing.update(payload)
    existing["id"] = shipment_id  # preserve ID

    # Recalculate risk on update
    score, severity, delay, status = RiskEngine.calculate_shipment_risk(existing, db.config)
    existing["risk_score"] = score
    existing["delay_risk_level"] = severity
    existing["predicted_delay_hours"] = delay
    existing["status"] = status

    db.shipments[shipment_id] = existing
    db.save_to_file()
    return existing

@app.delete("/api/shipments/{shipment_id}")
def delete_shipment(shipment_id: str):
    if shipment_id not in db.shipments:
        raise HTTPException(status_code=404, detail="Shipment not found")
    del db.shipments[shipment_id]
    db.save_to_file()
    return {"deleted": shipment_id}

@app.post("/api/shipments/import-csv")
async def import_shipments_csv(file: UploadFile = File(...)):
    content = await file.read()
    try:
        decoded = content.decode("utf-8")
    except UnicodeDecodeError:
        decoded = content.decode("latin-1")

    reader = csv.DictReader(io.StringIO(decoded))
    imported = []
    errors = []
    row_num = 1

    for row in reader:
        row_num += 1
        try:
            tracking_ref = row.get("tracking_ref") or row.get("TrackingRef") or f"CSV-{row_num}"
            origin = row.get("origin") or row.get("Origin") or "CNSHA"
            dest = row.get("destination") or row.get("Destination") or "USLAX"
            carrier = row.get("carrier") or row.get("Carrier") or "Ocean Express"
            val = int(row.get("value_usd") or row.get("ValueUSD") or 100000)

            shp_id = f"SHP-CSV-{row_num:03d}"
            origin_p = db.ports.get(origin)
            dest_p = db.ports.get(dest)

            new_shp = {
                "id": shp_id,
                "tracking_ref": tracking_ref,
                "origin": origin,
                "destination": dest,
                "origin_name": origin_p["name"] if origin_p else origin,
                "dest_name": dest_p["name"] if dest_p else dest,
                "carrier": carrier,
                "departure_date": row.get("departure_date") or get_utc_now_iso()[:10],
                "expected_arrival": row.get("expected_arrival") or "2026-11-15",
                "delivery_deadline": row.get("delivery_deadline") or "2026-11-18",
                "value_usd": val,
                "cargo_description": row.get("cargo_description") or "Commercial General Cargo",
                "milestones": [
                    {"name": "Origin Loading", "location": origin, "date": get_utc_now_iso(), "completed": True}
                ],
                "related_disruptions": [],
                "mitigation_actions": ["Monitor automated schedule feed"],
                "is_demo": True
            }

            score, severity, delay, status = RiskEngine.calculate_shipment_risk(new_shp, db.config)
            new_shp["risk_score"] = score
            new_shp["delay_risk_level"] = severity
            new_shp["predicted_delay_hours"] = delay
            new_shp["status"] = status

            db.shipments[shp_id] = new_shp
            imported.append(shp_id)
        except Exception as e:
            errors.append(f"Row {row_num}: {str(e)}")

    db.save_to_file()
    return {
        "success": True,
        "imported_count": len(imported),
        "imported_ids": imported,
        "errors": errors
    }

@app.get("/api/shipments/export-csv")
def export_shipments_csv():
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow([
        "id", "tracking_ref", "origin", "origin_name", "destination", "dest_name",
        "carrier", "departure_date", "expected_arrival", "delivery_deadline",
        "risk_score", "delay_risk_level", "predicted_delay_hours", "status", "value_usd", "cargo_description"
    ])
    for s in db.shipments.values():
        writer.writerow([
            s["id"], s["tracking_ref"], s["origin"], s.get("origin_name", ""),
            s["destination"], s.get("dest_name", ""), s["carrier"],
            s["departure_date"], s["expected_arrival"], s["delivery_deadline"],
            s.get("risk_score", 0), s.get("delay_risk_level", "LOW"),
            s.get("predicted_delay_hours", 0), s.get("status", "ON_TIME"),
            s.get("value_usd", 0), s.get("cargo_description", "")
        ])

    return Response(
        content=output.getvalue(),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=nexus_shipments_export.csv"}
    )

# -------------------------------------------------------------
# 3. Ports & Routes
# -------------------------------------------------------------
@app.get("/api/ports")
def get_ports():
    return list(db.ports.values())

@app.get("/api/ports/{port_code}")
def get_port_detail(port_code: str):
    port = db.ports.get(port_code)
    if not port:
        raise HTTPException(status_code=404, detail="Port not found")

    # Assessment details with explainability
    assessment = RiskEngine.calculate_port_risk(port, db.config)

    # Correlated disruptions
    related_disruptions = [
        d for d in db.disruptions.values()
        if d.get("port_code") == port_code or (port_code in d.get("location", ""))
    ]

    # Affected shipments
    affected_shipments = [
        s for s in db.shipments.values()
        if s.get("origin") == port_code or s.get("destination") == port_code
    ]

    return {
        "port": port,
        "assessment": assessment,
        "disruptions": related_disruptions,
        "affected_shipments": affected_shipments,
        "alternative_ports": [db.ports[c] for c in port.get("alternative_ports", []) if c in db.ports]
    }

@app.get("/api/routes")
def get_routes():
    return list(db.routes.values())

# -------------------------------------------------------------
# 4. Disruptions & Refresh
# -------------------------------------------------------------
@app.get("/api/disruptions")
def get_disruptions(
    category: Optional[str] = None,
    severity: Optional[str] = None,
    search: Optional[str] = None
):
    items = list(db.disruptions.values())
    if category:
        items = [i for i in items if i.get("category") == category]
    if severity:
        items = [i for i in items if i.get("severity") == severity]
    if search:
        s_low = search.lower()
        items = [
            i for i in items
            if s_low in i.get("headline", "").lower()
            or s_low in i.get("location", "").lower()
            or s_low in i.get("source_name", "").lower()
        ]
    return sorted(items, key=lambda x: x.get("retrieval_time", ""), reverse=True)

@app.get("/api/disruptions/{disruption_id}")
def get_disruption_detail(disruption_id: str):
    d = db.disruptions.get(disruption_id)
    if not d:
        raise HTTPException(status_code=404, detail="Disruption not found")
    affected_shps = [
        db.shipments[sid] for sid in d.get("affected_shipments", [])
        if sid in db.shipments
    ]
    return {"disruption": d, "affected_shipments": affected_shps}

@app.post("/api/disruptions/refresh")
def refresh_intelligence():
    """
    Triggers simulated/external data fetch and recalculates all risk scores.
    """
    result = RiskEngine.recalculate_all()
    return {
        "status": "success",
        "message": "Intelligence refresh cycle completed across all monitored sources.",
        "details": result
    }

# -------------------------------------------------------------
# 5. Risk Intelligence & Scoring
# -------------------------------------------------------------
@app.get("/api/risks")
def get_risks():
    config = db.config
    assessments = []
    for port in db.ports.values():
        eval_res = RiskEngine.calculate_port_risk(port, config)
        assessments.append({
            "id": f"RSK-{port['code']}",
            "category": "Port Operational Risk",
            "location": f"{port['name']} ({port['country']})",
            "port_code": port["code"],
            "risk_score": eval_res["score"],
            "severity": eval_res["severity"],
            "forecast_24h": eval_res["forecast_24h"],
            "forecast_72h": eval_res["forecast_72h"],
            "forecast_7d": eval_res["forecast_7d"],
            "confidence": 0.92,
            "data_freshness": "Updated within 15 minutes",
            "contributing_factors": eval_res["factors"],
            "supporting_evidence": [
                f"Berth wait time: {port.get('avg_berth_wait_hours', 12)}h",
                f"Congestion index: {port.get('congestion_index', 3.0)}/10",
                f"Active navigational notices: {len(port.get('active_notices', []))}"
            ],
            "recommended_next_steps": [
                "Establish real-time EDI carrier handshake",
                "Alert downstream consignees of revised discharge schedules"
            ],
            "why_this_risk": eval_res["why_this_risk"]
        })

    return {
        "weights": {
            "weather": config.get("weather_weight", 0.25),
            "congestion": config.get("congestion_weight", 0.30),
            "carrier": config.get("carrier_weight", 0.20),
            "labour": config.get("labour_weight", 0.15),
            "geopolitical": config.get("geopolitical_weight", 0.10)
        },
        "thresholds": {
            "high": config.get("high_risk_threshold", 70),
            "medium": config.get("medium_risk_threshold", 40)
        },
        "assessments": assessments
    }

@app.post("/api/risks/recalculate")
def recalculate_risks():
    return RiskEngine.recalculate_all()

# -------------------------------------------------------------
# 6. Alerts Center
# -------------------------------------------------------------
@app.get("/api/alerts")
def get_alerts(
    status: Optional[str] = None,
    severity: Optional[str] = None,
    category: Optional[str] = None,
    search: Optional[str] = None
):
    items = list(db.alerts.values())
    if status:
        items = [i for i in items if i.get("status") == status]
    if severity:
        items = [i for i in items if i.get("severity") == severity]
    if category:
        items = [i for i in items if i.get("event_category") == category]
    if search:
        s_low = search.lower()
        items = [
            i for i in items
            if s_low in i.get("title", "").lower()
            or s_low in i.get("description", "").lower()
            or s_low in i.get("affected_location", "").lower()
        ]
    return sorted(items, key=lambda x: x.get("created_at", ""), reverse=True)

@app.post("/api/alerts/{alert_id}/acknowledge")
def acknowledge_alert(alert_id: str):
    if alert_id not in db.alerts:
        raise HTTPException(status_code=404, detail="Alert not found")
    db.alerts[alert_id]["status"] = "ACKNOWLEDGED"
    db.save_to_file()
    return db.alerts[alert_id]

@app.post("/api/alerts/{alert_id}/dismiss")
def dismiss_alert(alert_id: str):
    if alert_id not in db.alerts:
        raise HTTPException(status_code=404, detail="Alert not found")
    db.alerts[alert_id]["status"] = "DISMISSED"
    db.save_to_file()
    return db.alerts[alert_id]

@app.post("/api/alerts/{alert_id}/resolve")
def resolve_alert(alert_id: str):
    if alert_id not in db.alerts:
        raise HTTPException(status_code=404, detail="Alert not found")
    db.alerts[alert_id]["status"] = "RESOLVED"
    db.save_to_file()
    return db.alerts[alert_id]

# -------------------------------------------------------------
# 7. TinyFish Agent Center
# -------------------------------------------------------------
@app.get("/api/agent/sources")
def get_agent_sources():
    return TinyFishClient.get_sources()

@app.get("/api/agent/jobs")
def get_agent_jobs():
    return db.agent_jobs

@app.post("/api/agent/trigger")
async def trigger_agent(payload: Dict[str, Any]):
    source_id = payload.get("source_id", "SRC-SHA-MSA")
    custom_url = payload.get("custom_url")
    job = await TinyFishClient.run_agent_job(source_id, custom_url)
    return job

# -------------------------------------------------------------
# 7.5 TinyFish Web Research & Notifications
# -------------------------------------------------------------
@app.get("/api/research/status")
def get_research_status():
    """
    Returns connection status of TinyFish integration, configuration health,
    and supported features. Never exposes API secrets.
    """
    return TinyFishResearchService.get_status()

@app.post("/api/research/test-connection")
def test_research_connection():
    """
    Tests live communication with TinyFish Search endpoint.
    """
    return TinyFishResearchService.test_connection()

@app.post("/api/research/execute", response_model=ResearchResponse)
def execute_research(payload: ResearchRequest):
    """
    Executes public web research for port bulletins, weather, route risks, and carrier notices.
    Normalizes results into structured, sourced evidence.
    """
    return TinyFishResearchService.execute_research(payload)

@app.get("/api/research/history")
def get_research_history(limit: int = 20):
    """
    Retrieves persisted research history from local database store.
    """
    history = getattr(db, "research_history", [])
    return history[:limit]

@app.get("/api/research/{research_id}")
def get_research_detail(research_id: str):
    """
    Retrieves a specific research record by ID.
    """
    history = getattr(db, "research_history", [])
    item = next((r for r in history if r.get("research_id") == research_id), None)
    if not item:
        raise HTTPException(status_code=404, detail="Research session not found")
    return item

@app.get("/api/notifications")
def get_notifications():
    """
    Retrieves notification center items, including web research-generated disruption alerts.
    """
    return getattr(db, "notifications", [])

@app.post("/api/notifications/{notification_id}/read")
def mark_notification_read(notification_id: str):
    """
    Marks a notification item as read.
    """
    notifications = getattr(db, "notifications", [])
    item = next((n for n in notifications if n.get("id") == notification_id), None)
    if item:
        item["read"] = True
        db.save_to_file()
        return {"status": "success", "notification": item}
    raise HTTPException(status_code=404, detail="Notification not found")

@app.post("/api/notifications/clear")
def clear_notifications():
    """
    Clears or marks all notifications as read.
    """
    notifications = getattr(db, "notifications", [])
    for n in notifications:
        n["read"] = True
    db.save_to_file()
    return {"status": "success", "count": len(notifications)}


# -------------------------------------------------------------
# 8. AI Analyst Interface
# -------------------------------------------------------------
@app.post("/api/ai/analyst", response_model=AnalystResponse)
def query_ai_analyst(payload: AnalystQueryRequest):
    return AIAnalyst.query(
        question=payload.question,
        context_shipment_id=payload.context_shipment_id,
        context_port_code=payload.context_port_code
    )

# -------------------------------------------------------------
# 9. Analytics Data
# -------------------------------------------------------------
@app.get("/api/analytics")
def get_analytics():
    shipments = list(db.shipments.values())
    disruptions = list(db.disruptions.values())
    ports = list(db.ports.values())

    # Category counts
    cat_counts = {}
    for d in disruptions:
        cat = d.get("category", "OTHER")
        cat_counts[cat] = cat_counts.get(cat, 0) + 1
    category_chart = [{"category": k, "count": v} for k, v in cat_counts.items()]

    # Risk distribution
    high = len([s for s in shipments if s.get("risk_score", 0) >= 70])
    med = len([s for s in shipments if 40 <= s.get("risk_score", 0) < 70])
    low = len([s for s in shipments if s.get("risk_score", 0) < 40])
    risk_distribution = [
        {"name": "High Risk (70-100)", "value": high, "color": "#FF5252"},
        {"name": "Medium Risk (40-69)", "value": med, "color": "#FFB547"},
        {"name": "Low Risk (0-39)", "value": low, "color": "#38D996"}
    ]

    # Port comparison
    port_chart = [
        {
            "port": p["code"],
            "name": p["name"],
            "risk_score": p["risk_score"],
            "congestion": p["congestion_index"] * 10,
            "wait_hours": p["avg_berth_wait_hours"]
        }
        for p in ports
    ]

    # Predicted vs actual performance
    performance = [
        {"lane": "CNSHA-USLAX", "scheduled_days": 14, "predicted_days": 17, "variance_days": 3},
        {"lane": "CNSHA-NLRTM", "scheduled_days": 32, "predicted_days": 43, "variance_days": 11},
        {"lane": "SGSIN-NLRTM", "scheduled_days": 24, "predicted_days": 26, "variance_days": 2},
        {"lane": "NLRTM-USLAX", "scheduled_days": 22, "predicted_days": 23, "variance_days": 1},
        {"lane": "SGSIN-DEHAM", "scheduled_days": 28, "predicted_days": 29, "variance_days": 1}
    ]

    # Agent success rate
    agent_stats = {
        "total_runs": len(db.agent_jobs),
        "successful_runs": len([j for j in db.agent_jobs if j.get("status") == "SUCCESS"]),
        "avg_latency_ms": int(sum(j.get("execution_time_ms", 2000) for j in db.agent_jobs) / max(1, len(db.agent_jobs))),
        "observations_extracted": sum(j.get("records_extracted", 0) for j in db.agent_jobs)
    }

    return {
        "disruptions_by_category": category_chart,
        "shipments_by_risk": risk_distribution,
        "ports_comparison": port_chart,
        "delivery_performance": performance,
        "agent_metrics": agent_stats
    }

# -------------------------------------------------------------
# 10. Settings & Reset
# -------------------------------------------------------------
@app.get("/api/settings")
def get_settings():
    return db.config

@app.put("/api/settings")
def update_settings(payload: Dict[str, Any]):
    db.config.update(payload)
    db.save_to_file()
    # Recalculate with new weights/thresholds
    RiskEngine.recalculate_all()
    return db.config

@app.post("/api/reset-demo")
def reset_demo_data():
    db.reset_to_seed()
    RiskEngine.recalculate_all()
    return {"status": "success", "message": "Demo data reset to pristine baseline."}
