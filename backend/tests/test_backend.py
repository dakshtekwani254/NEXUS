"""
NEXUS Backend Test Suite
Tests for Risk Scoring Engine, Data Validation, TinyFish Integration, and AI Analyst.
"""
import pytest
from database import db
from models import Shipment, DisruptionEvent, Port, Alert
from risk_engine import RiskEngine
from tinyfish import TinyFishClient
from ai_analyst import AIAnalyst

def setup_module():
    db.reset_to_seed()

def test_pydantic_shipment_validation():
    valid_data = {
        "id": "SHP-TEST-01",
        "tracking_ref": "TRK-TEST-01",
        "origin": "CNSHA",
        "destination": "USLAX",
        "origin_name": "Shanghai",
        "dest_name": "Los Angeles",
        "carrier": "Test Carrier",
        "departure_date": "2026-10-18",
        "expected_arrival": "2026-11-01",
        "delivery_deadline": "2026-11-03",
        "value_usd": 500000
    }
    shp = Shipment(**valid_data)
    assert shp.id == "SHP-TEST-01"
    assert shp.risk_score == 0
    assert shp.status == "IN_TRANSIT"

def test_risk_engine_port_scoring():
    port = db.ports.get("CNSHA")
    assert port is not None
    res = RiskEngine.calculate_port_risk(port, db.config)
    assert 0 <= res["score"] <= 100
    assert res["severity"] in ["LOW", "MEDIUM", "HIGH", "CRITICAL"]
    assert "why_this_risk" in res
    assert "weather" in res["factors"]
    assert "forecast_24h" in res

def test_risk_engine_shipment_scoring():
    shp = db.shipments.get("SHP-8821")
    assert shp is not None
    score, severity, delay, status = RiskEngine.calculate_shipment_risk(shp, db.config)
    assert score >= 50
    assert severity in ["MEDIUM", "HIGH"]
    assert delay > 0

def test_recalculate_all_and_alert_generation():
    result = RiskEngine.recalculate_all()
    assert result["shipments_count"] > 0
    assert result["ports_count"] > 0
    assert "recalculated_at" in result

def test_tinyfish_agent_simulation_and_pipeline():
    import anyio
    job = anyio.run(TinyFishClient.run_agent_job, "SRC-SHA-MSA")
    assert job["status"] == "SUCCESS"
    assert len(job["logs"]) > 0
    assert len(job["observations"]) > 0
    assert job["observations"][0]["severity"] in ["MEDIUM", "HIGH"]

def test_ai_analyst_grounded_queries():
    resp1 = AIAnalyst.query("Which shipments are most at risk this week?")
    assert len(resp1.structured_findings) > 0
    assert "Executive Analysis" in resp1.answer
    assert resp1.data_grounded is True

    resp2 = AIAnalyst.query("Why is Shanghai showing elevated risk?")
    assert "Shanghai" in resp2.answer
    assert resp2.data_grounded is True

    resp3 = AIAnalyst.query("What alternatives should I investigate for this route?")
    assert "Alternative" in resp3.answer
