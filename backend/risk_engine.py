"""
NEXUS Supply Chain Intelligence - Rules-Based Predictive Risk Scoring Engine
Transparent, weighted multi-factor risk assessment model with explainability.
"""
from typing import Dict, List, Any, Tuple
import datetime
from database import db, get_utc_now_iso
from models import RiskSeverity, Alert

class RiskEngine:
    """
    Transparent rules-based scoring engine for supply chain ports, routes, and shipments.
    Combines normalized domain indicators (0-100) using configurable weights:
    - Severe Weather Exposure (w_weather)
    - Port Congestion & Dwell (w_congestion)
    - Carrier Schedule Variance (w_carrier)
    - Labour Disruption Reports (w_labour)
    - Geopolitical & Trade Restrictions (w_geopolitical)
    """

    @staticmethod
    def get_severity(score: int, high_threshold: int = 70, medium_threshold: int = 40) -> RiskSeverity:
        if score >= high_threshold:
            return "HIGH"
        elif score >= medium_threshold:
            return "MEDIUM"
        else:
            return "LOW"

    @classmethod
    def calculate_port_risk(cls, port_data: Dict[str, Any], config: Dict[str, Any]) -> Dict[str, Any]:
        w_weather = config.get("weather_weight", 0.25)
        w_congestion = config.get("congestion_weight", 0.30)
        w_carrier = config.get("carrier_weight", 0.20)
        w_labour = config.get("labour_weight", 0.15)
        w_geopolitical = config.get("geopolitical_weight", 0.10)

        total_weight = w_weather + w_congestion + w_carrier + w_labour + w_geopolitical
        if total_weight <= 0:
            total_weight = 1.0

        # Extract or compute normalized component scores (0-100)
        weather_score = port_data.get("weather_score", 20)
        # Congestion index is roughly 0-10, scale to 0-100
        raw_cong = port_data.get("congestion_index", 3.0)
        congestion_score = min(100, int(raw_cong * 10))

        # Check disruptions associated with this port
        port_code = port_data.get("code")
        related_disruptions = [
            d for d in db.disruptions.values() 
            if d.get("port_code") == port_code or (port_code and port_code in d.get("location", ""))
        ]

        carrier_score = 15
        labour_score = 10
        geopolitical_score = 10

        signals = []
        for d in related_disruptions:
            cat = d.get("category")
            impact = d.get("risk_score_impact", 50)
            signals.append({
                "category": cat,
                "headline": d.get("headline"),
                "impact": impact,
                "source": d.get("source_name"),
                "time": d.get("retrieval_time"),
                "confirmed": d.get("confirmed", True)
            })
            if cat == "CARRIER_DELAY":
                carrier_score = max(carrier_score, impact)
            elif cat == "LABOUR_STRIKE":
                labour_score = max(labour_score, impact)
            elif cat in ("GEOPOLITICAL", "TRADE_RESTRICTION"):
                geopolitical_score = max(geopolitical_score, impact)
            elif cat == "WEATHER":
                weather_score = max(weather_score, impact)
            elif cat == "PORT_CONGESTION":
                congestion_score = max(congestion_score, impact)

        # Composite weighted score
        composite = (
            (w_weather * weather_score) +
            (w_congestion * congestion_score) +
            (w_carrier * carrier_score) +
            (w_labour * labour_score) +
            (w_geopolitical * geopolitical_score)
        ) / total_weight

        score = min(100, max(0, int(round(composite))))
        severity = cls.get_severity(score, config.get("high_risk_threshold", 70), config.get("medium_risk_threshold", 40))

        # Forecast modeling (rule-based forecast horizons)
        # Weather typically decays over 72h-7d; congestion persists longer
        forecast_24h = min(100, max(0, int(score * 1.05 if weather_score > 60 else score * 0.98)))
        forecast_72h = min(100, max(0, int(score * 0.92 if weather_score > 60 else score * 0.95)))
        forecast_7d = min(100, max(0, int(score * 0.75 if weather_score > 60 else score * 0.90)))

        # Explainability package
        why_this_risk = {
            "model_type": "Deterministic Multi-Criteria Rules-Based Weighting (Non-ML)",
            "weights_used": {
                "weather": round(w_weather, 2),
                "congestion": round(w_congestion, 2),
                "carrier": round(w_carrier, 2),
                "labour": round(w_labour, 2),
                "geopolitical": round(w_geopolitical, 2)
            },
            "signals_contributed": signals,
            "confirmed_signals": [s for s in signals if s["confirmed"]],
            "inferred_signals": [s for s in signals if not s["confirmed"]],
            "additional_evidence_needed": [
                "Real-time AIS vessel queue telemetry inside 12nm roadstead",
                "Automated terminal gate OCR turn-around latency verification"
            ]
        }

        return {
            "score": score,
            "severity": severity,
            "factors": {
                "weather": weather_score,
                "port_congestion": congestion_score,
                "carrier_delays": carrier_score,
                "labour": labour_score,
                "geopolitical": geopolitical_score
            },
            "forecast_24h": forecast_24h,
            "forecast_72h": forecast_72h,
            "forecast_7d": forecast_7d,
            "why_this_risk": why_this_risk
        }

    @classmethod
    def calculate_shipment_risk(cls, shipment: Dict[str, Any], config: Dict[str, Any]) -> Tuple[int, RiskSeverity, int, str]:
        """
        Calculates shipment risk score, severity, predicted delay hours, and status.
        Factors:
        - Origin port risk
        - Destination port risk
        - En route disruptions directly linked to shipment
        """
        origin_code = shipment.get("origin")
        dest_code = shipment.get("destination")
        origin_port = db.ports.get(origin_code, {})
        dest_port = db.ports.get(dest_code, {})

        origin_risk = origin_port.get("risk_score", 30)
        dest_risk = dest_port.get("risk_score", 30)

        # Baseline route risk
        base_risk = (origin_risk * 0.45) + (dest_risk * 0.45)

        # Disruption impacts
        disruption_boost = 0
        predicted_delay = 0
        related_ids = shipment.get("related_disruptions", [])
        for d_id in related_ids:
            if d_id in db.disruptions:
                d = db.disruptions[d_id]
                impact = d.get("risk_score_impact", 40)
                disruption_boost += (impact * 0.15)
                # Estimate delay hours
                if d.get("category") == "WEATHER":
                    predicted_delay += 24
                elif d.get("category") == "PORT_CONGESTION":
                    predicted_delay += 36
                elif d.get("category") == "GEOPOLITICAL":
                    predicted_delay += 96
                elif d.get("category") == "LABOUR_STRIKE":
                    predicted_delay += 24

        final_score = min(100, max(10, int(round(base_risk + disruption_boost))))
        severity = cls.get_severity(final_score, config.get("high_risk_threshold", 70), config.get("medium_risk_threshold", 40))

        # Status derivation
        if final_score >= 70 or predicted_delay >= 48:
            status = "AT_RISK" if predicted_delay < 72 else "DELAYED"
        elif final_score >= 40:
            status = "AT_RISK"
        else:
            status = "ON_TIME"

        return final_score, severity, predicted_delay, status

    @classmethod
    def recalculate_all(cls) -> Dict[str, Any]:
        """
        Full system recalculation: updates all ports, shipments, routes,
        and generates alerts if thresholds are exceeded.
        """
        config = db.config
        high_thresh = config.get("high_risk_threshold", 70)

        # 1. Update ports
        for p_code, port in list(db.ports.items()):
            assessment = cls.calculate_port_risk(port, config)
            port["risk_score"] = assessment["score"]
            port["severity"] = assessment["severity"]
            port["last_updated"] = get_utc_now_iso()
            # update historical trend (keep 7 days)
            trend = port.get("historical_trend", [40]*7)
            trend.append(assessment["score"])
            port["historical_trend"] = trend[-7:]

        # 2. Update shipments
        high_risk_shipments = []
        for s_id, shp in list(db.shipments.items()):
            score, severity, delay_hrs, status = cls.calculate_shipment_risk(shp, config)
            shp["risk_score"] = score
            shp["delay_risk_level"] = severity
            shp["predicted_delay_hours"] = max(shp.get("predicted_delay_hours", 0), delay_hrs)
            shp["status"] = status
            if severity == "HIGH":
                high_risk_shipments.append(shp)

        # 3. Check for automatic alert generation
        new_alerts = []
        for shp in high_risk_shipments:
            # Check if active alert already exists for this shipment
            existing = [
                a for a in db.alerts.values() 
                if a.get("status") in ("ACTIVE", "ACKNOWLEDGED") and shp["id"] in a.get("related_shipments", [])
            ]
            if not existing:
                alert_id = f"ALT-AUTO-{shp['id']}"
                new_alert = {
                    "id": alert_id,
                    "severity": "HIGH",
                    "event_category": "CARRIER_DELAY",
                    "title": f"Threshold Exceeded: Shipment {shp['id']} elevated risk ({shp['risk_score']}/100)",
                    "description": f"Shipment {shp['id']} ({shp['cargo_description']}) has crossed high risk threshold. Predicted delay {shp['predicted_delay_hours']}h threatens deadline {shp['delivery_deadline']}.",
                    "affected_location": f"{shp['origin_name']} -> {shp['dest_name']}",
                    "related_shipments": [shp["id"]],
                    "risk_score": shp["risk_score"],
                    "source_evidence": "Automated recalculation by NEXUS Risk Engine after multi-factor threshold breach.",
                    "created_at": get_utc_now_iso(),
                    "status": "ACTIVE",
                    "assigned_to": "Supply Chain Response Team"
                }
                db.alerts[alert_id] = new_alert
                new_alerts.append(new_alert)

        db.save_to_file()
        return {
            "recalculated_at": get_utc_now_iso(),
            "ports_count": len(db.ports),
            "shipments_count": len(db.shipments),
            "high_risk_shipments_count": len(high_risk_shipments),
            "new_alerts_generated": len(new_alerts)
        }
