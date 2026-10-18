"""
NEXUS Supply Chain Intelligence - In-Memory & File-Persisted Database
Provides complete CRUD, state management, and rich realistic demo seed data.
"""
import json
import os
import copy
from datetime import datetime, timezone
from typing import Dict, List, Optional, Any
from models import (
    Port, Route, Shipment, DisruptionEvent, RiskAssessment, Alert, 
    AgentJob, AgentObservation, RiskConfiguration, KPISummary
)

DATA_FILE = os.path.join(os.path.dirname(__file__), "nexus_data_store.json")

def get_utc_now_iso() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")

def get_seed_ports() -> List[Dict[str, Any]]:
    return [
        {
            "code": "CNSHA",
            "name": "Port of Shanghai",
            "country": "China",
            "lat": 31.2304,
            "lng": 121.4737,
            "risk_score": 78,
            "severity": "HIGH",
            "congestion_index": 7.8,
            "avg_berth_wait_hours": 42.5,
            "weather_score": 85,
            "active_notices": [
                "Gale force wind alert: East China Sea gusts up to 45 knots",
                "Yangshan deep-water terminal phase IV crane wind-safety throttle active"
            ],
            "affected_shipments_count": 4,
            "historical_trend": [45, 52, 60, 68, 71, 75, 78],
            "last_updated": get_utc_now_iso(),
            "data_source": "TinyFish Automated Port Notice Scraper + CMA Marine Advisory",
            "is_demo": True,
            "alternative_ports": ["CNNBO", "CNQIN"]
        },
        {
            "code": "NLRTM",
            "name": "Port of Rotterdam",
            "country": "Netherlands",
            "lat": 51.9244,
            "lng": 4.4777,
            "risk_score": 62,
            "severity": "MEDIUM",
            "congestion_index": 6.2,
            "avg_berth_wait_hours": 28.0,
            "weather_score": 35,
            "active_notices": [
                "Maasvlakte II automated terminal scheduled software patching backlog",
                "Rhine river low draft warning on upper stretches (barge volume diverted to rail)"
            ],
            "affected_shipments_count": 3,
            "historical_trend": [55, 58, 60, 64, 61, 63, 62],
            "last_updated": get_utc_now_iso(),
            "data_source": "Port of Rotterdam Portbase API + TinyFish Carrier Schedule Extractor",
            "is_demo": True,
            "alternative_ports": ["BEANR", "DEHAM"]
        },
        {
            "code": "SGSIN",
            "name": "Port of Singapore",
            "country": "Singapore",
            "lat": 1.3521,
            "lng": 103.8198,
            "risk_score": 38,
            "severity": "LOW",
            "congestion_index": 3.4,
            "avg_berth_wait_hours": 14.2,
            "weather_score": 25,
            "active_notices": [
                "Normal berth turnaround. Tuas mega-port berth allocation operating at nominal efficiency"
            ],
            "affected_shipments_count": 2,
            "historical_trend": [42, 40, 39, 37, 36, 38, 38],
            "last_updated": get_utc_now_iso(),
            "data_source": "PSA Marine Hub Feed & Weather Singapore",
            "is_demo": True,
            "alternative_ports": ["MYPKG", "MYTPP"]
        },
        {
            "code": "USLAX",
            "name": "Port of Los Angeles",
            "country": "United States",
            "lat": 33.7432,
            "lng": -118.2673,
            "risk_score": 58,
            "severity": "MEDIUM",
            "congestion_index": 5.8,
            "avg_berth_wait_hours": 24.6,
            "weather_score": 15,
            "active_notices": [
                "Intermodal rail container dwell time averaging 4.2 days on BNSF corridor",
                "Terminal Island gate appointment slots 92% booked for dry van equipment"
            ],
            "affected_shipments_count": 3,
            "historical_trend": [50, 52, 54, 56, 59, 58, 58],
            "last_updated": get_utc_now_iso(),
            "data_source": "POLA Signal Metrics + Rail Freight Bureau",
            "is_demo": True,
            "alternative_ports": ["USLGB", "USOAK"]
        },
        {
            "code": "DEHAM",
            "name": "Port of Hamburg",
            "country": "Germany",
            "lat": 53.5511,
            "lng": 9.9937,
            "risk_score": 44,
            "severity": "MEDIUM",
            "congestion_index": 4.5,
            "avg_berth_wait_hours": 18.0,
            "weather_score": 30,
            "active_notices": [
                "Elbe dredging maintenance zone restricts passing width for ultra-large container vessels (ULCV)"
            ],
            "affected_shipments_count": 1,
            "historical_trend": [40, 41, 43, 45, 46, 45, 44],
            "last_updated": get_utc_now_iso(),
            "data_source": "HPA Port Community System",
            "is_demo": True,
            "alternative_ports": ["DEWVN", "NLRTM"]
        },
        {
            "code": "AEJEA",
            "name": "Port of Jebel Ali (Dubai)",
            "country": "United Arab Emirates",
            "lat": 25.0253,
            "lng": 55.0606,
            "risk_score": 32,
            "severity": "LOW",
            "congestion_index": 2.8,
            "avg_berth_wait_hours": 11.5,
            "weather_score": 10,
            "active_notices": [
                "All 4 container terminals operating at fluid turnaround times"
            ],
            "affected_shipments_count": 1,
            "historical_trend": [35, 34, 33, 31, 30, 32, 32],
            "last_updated": get_utc_now_iso(),
            "data_source": "DP World Smart Logistics Portal",
            "is_demo": True,
            "alternative_ports": ["OMSOH", "QAHMD"]
        }
    ]

def get_seed_routes() -> List[Dict[str, Any]]:
    return [
        {
            "id": "RT-SHA-LAX",
            "name": "Trans-Pacific North (Shanghai -> Los Angeles)",
            "origin_code": "CNSHA",
            "dest_code": "USLAX",
            "waypoints": [
                [31.2304, 121.4737],
                [32.5, 130.0],
                [35.0, 150.0],
                [38.0, 180.0],
                [36.0, -150.0],
                [34.0, -130.0],
                [33.7432, -118.2673]
            ],
            "baseline_days": 14,
            "current_risk_score": 74,
            "status": "ELEVATED_RISK",
            "alternatives": [
                {
                    "name": "Trans-Pacific South via Oakland",
                    "transit_days": 16,
                    "additional_cost_usd": 1200,
                    "risk_score": 42,
                    "description": "Bypasses East China Sea wave front and LAX rail yard bottleneck."
                },
                {
                    "name": "Air-Sea Multimodal via Incheon",
                    "transit_days": 6,
                    "additional_cost_usd": 6800,
                    "risk_score": 20,
                    "description": "High priority critical components bypass sea route entirely."
                }
            ]
        },
        {
            "id": "RT-SHA-RTM",
            "name": "Asia-Europe Maritime (Shanghai -> Rotterdam via Cape)",
            "origin_code": "CNSHA",
            "dest_code": "NLRTM",
            "waypoints": [
                [31.2304, 121.4737],
                [15.0, 115.0],
                [1.3521, 103.8198],
                [5.0, 85.0],
                [-10.0, 60.0],
                [-34.5, 20.0],
                [-15.0, 5.0],
                [15.0, -20.0],
                [40.0, -10.0],
                [51.9244, 4.4777]
            ],
            "baseline_days": 32,
            "current_risk_score": 68,
            "status": "EXTENDED_TRANSIT",
            "alternatives": [
                {
                    "name": "Suez Transit (Armed Escort / Surcharge)",
                    "transit_days": 22,
                    "additional_cost_usd": 4500,
                    "risk_score": 85,
                    "description": "Shortest physical route but subject to high geopolitical insurance surcharges."
                },
                {
                    "name": "Trans-Eurasian Rail Express (Chongqing -> Duisburg)",
                    "transit_days": 18,
                    "additional_cost_usd": 3800,
                    "risk_score": 48,
                    "description": "Reliable intermodal land bridge with customs clearance at border."
                }
            ]
        },
        {
            "id": "RT-SIN-RTM",
            "name": "Malacca-Cape-Europe (Singapore -> Rotterdam)",
            "origin_code": "SGSIN",
            "dest_code": "NLRTM",
            "waypoints": [
                [1.3521, 103.8198],
                [-5.0, 80.0],
                [-34.0, 22.0],
                [0.0, -5.0],
                [36.0, -10.0],
                [51.9244, 4.4777]
            ],
            "baseline_days": 24,
            "current_risk_score": 52,
            "status": "MODERATE_RISK",
            "alternatives": []
        },
        {
            "id": "RT-RTM-LAX",
            "name": "Trans-Atlantic / Panama (Rotterdam -> Los Angeles)",
            "origin_code": "NLRTM",
            "dest_code": "USLAX",
            "waypoints": [
                [51.9244, 4.4777],
                [45.0, -15.0],
                [25.0, -55.0],
                [9.1, -79.7],
                [15.0, -100.0],
                [33.7432, -118.2673]
            ],
            "baseline_days": 22,
            "current_risk_score": 46,
            "status": "NORMAL",
            "alternatives": []
        }
    ]

def get_seed_disruptions() -> List[Dict[str, Any]]:
    return [
        {
            "id": "DIS-2026-001",
            "category": "WEATHER",
            "headline": "East China Sea Gale & Tropical Depression Alert (Force 9 Winds)",
            "location": "Shanghai Off-shore & Zhoushan Archipelago",
            "port_code": "CNSHA",
            "severity": "HIGH",
            "risk_score_impact": 82,
            "source_name": "China Maritime Safety Administration & CMA Weather Bulletin",
            "source_url": "https://www.msa.gov.cn/bulletin/east-china-sea/2026-warning",
            "publication_time": "2026-10-18T05:30:00Z",
            "retrieval_time": get_utc_now_iso(),
            "affected_shipments": ["SHP-8821", "SHP-8824", "SHP-8830"],
            "description": "Sustained north-northeast winds of 40-48 knots with swells over 4.5m have suspended pilot boarding services at Yangshan Deepwater Port. Outbound departures delayed 36 to 52 hours.",
            "confirmed": True,
            "evidence": "TinyFish automated extract matched official MSA navigational notice #2026-441-B. Pilotage halted at 04:00 UTC.",
            "verification_status": "VERIFIED"
        },
        {
            "id": "DIS-2026-002",
            "category": "PORT_CONGESTION",
            "headline": "Rotterdam Maasvlakte II Automated Stacking Crane Software Desync",
            "location": "Port of Rotterdam, Maasvlakte II",
            "port_code": "NLRTM",
            "severity": "MEDIUM",
            "risk_score_impact": 64,
            "source_name": "Portbase Terminal Dispatch Notification",
            "source_url": "https://www.portofrotterdam.com/en/portbase-status-updates",
            "publication_time": "2026-10-17T22:15:00Z",
            "retrieval_time": get_utc_now_iso(),
            "affected_shipments": ["SHP-9043", "SHP-9055"],
            "description": "Automated stacking cranes (ASCs) operating at 60% capacity following firmware rollback. Average truck turn time increased to 110 minutes, container rail transfers backlog 36 hours.",
            "confirmed": True,
            "evidence": "Portbase live API telemetry reports quay berth occupancy at 91% with 14 feeder vessels waiting at anchor.",
            "verification_status": "VERIFIED"
        },
        {
            "id": "DIS-2026-003",
            "category": "GEOPOLITICAL",
            "headline": "Southern Red Sea & Bab el-Mandeb Commercial Shipping Rerouting",
            "location": "Bab el-Mandeb Strait & Gulf of Aden",
            "port_code": None,
            "severity": "HIGH",
            "risk_score_impact": 76,
            "source_name": "UKMTO Commercial Maritime Advisory & Maersk Customer Bulletin",
            "source_url": "https://www.ukmto.org/advisories/2026-oct-redsea",
            "publication_time": "2026-10-16T18:00:00Z",
            "retrieval_time": get_utc_now_iso(),
            "affected_shipments": ["SHP-9043", "SHP-9102"],
            "description": "Major ocean carriers (Maersk, MSC, Hapag-Lloyd) extending full diversion around the Cape of Good Hope. Average voyage transit extended by 10-14 days with bunker surcharges.",
            "confirmed": True,
            "evidence": "TinyFish extraction of carrier service network updates confirmed 18 scheduled vessel rotations shifted to Cape routing.",
            "verification_status": "VERIFIED"
        },
        {
            "id": "DIS-2026-004",
            "category": "PORT_CONGESTION",
            "headline": "Los Angeles Pier 400 Intermodal Rail Chassis Imbalance",
            "location": "Port of Los Angeles / San Pedro Bay",
            "port_code": "USLAX",
            "severity": "MEDIUM",
            "risk_score_impact": 58,
            "source_name": "Pacific Merchant Shipping Association (PMSA) Bulletin",
            "source_url": "https://pmsaship.com/reports/san-pedro-bay-dwell-2026",
            "publication_time": "2026-10-17T14:00:00Z",
            "retrieval_time": get_utc_now_iso(),
            "affected_shipments": ["SHP-8821", "SHP-8835"],
            "description": "Rail dwell times for inland destinations (Chicago, Dallas) increased to 5.4 days due to acute rail-car positioning deficits at BNSF Hobart yard.",
            "confirmed": True,
            "evidence": "PMSA monthly operational report & harbor trucking chassis pool availability indicator below 15%.",
            "verification_status": "VERIFIED"
        },
        {
            "id": "DIS-2026-005",
            "category": "LABOUR_STRIKE",
            "headline": "German Seaports Union (ver.di) 24h Warning Strike Notice",
            "location": "Hamburg & Bremerhaven Terminals",
            "port_code": "DEHAM",
            "severity": "MEDIUM",
            "risk_score_impact": 52,
            "source_name": "Deutsche Verkehrs-Zeitung (DVZ) Logistics News",
            "source_url": "https://www.dvz.de/hafen-streik-ankuendigung-2026",
            "publication_time": "2026-10-18T01:30:00Z",
            "retrieval_time": get_utc_now_iso(),
            "affected_shipments": ["SHP-9080"],
            "description": "Union declared a 24-hour warning strike beginning Wednesday 06:00 CET during collective bargaining rounds. Waterside container operations will temporarily halt.",
            "confirmed": True,
            "evidence": "Official union press release confirmed by Hamburg Port Authority operating notice.",
            "verification_status": "VERIFIED"
        },
        {
            "id": "DIS-2026-006",
            "category": "CARRIER_DELAY",
            "headline": "ONE & Evergreen Trans-Pacific Service Blank Sailing Announcement",
            "location": "Pacific Trade Lane (Asia to US West Coast)",
            "port_code": None,
            "severity": "LOW",
            "risk_score_impact": 35,
            "source_name": "Ocean Network Express (ONE) Advisory",
            "source_url": "https://www.one-line.com/en/news/advisories/tp-blank-sailing-w43",
            "publication_time": "2026-10-17T09:00:00Z",
            "retrieval_time": get_utc_now_iso(),
            "affected_shipments": ["SHP-8842"],
            "description": "Blank sailing announced for Week 43 FP2 service to rebalance vessel schedules following typhoon avoidance slow-steaming.",
            "confirmed": True,
            "evidence": "Carrier operational schedule database update verified via schedule API.",
            "verification_status": "VERIFIED"
        }
    ]

def get_seed_shipments() -> List[Dict[str, Any]]:
    return [
        {
            "id": "SHP-8821",
            "tracking_ref": "MSKU9044819",
            "origin": "CNSHA",
            "destination": "USLAX",
            "origin_name": "Shanghai, China",
            "dest_name": "Los Angeles, USA",
            "carrier": "Maersk Line",
            "vessel": "Madrid Maersk (IMO 9778800)",
            "container_id": "MSKU-481920-1",
            "departure_date": "2026-10-12",
            "expected_arrival": "2026-10-26",
            "delivery_deadline": "2026-10-28",
            "predicted_delay_hours": 68,
            "delay_risk_level": "HIGH",
            "risk_score": 84,
            "status": "AT_RISK",
            "value_usd": 1450000,
            "cargo_description": "Lithium-Ion Battery Modules & EV Inverters",
            "route_id": "RT-SHA-LAX",
            "milestones": [
                {"name": "Gated In Terminal", "location": "Yangshan Phase IV", "date": "2026-10-11 14:00", "completed": True, "status_note": "Customs clear"},
                {"name": "Vessel Departed", "location": "Port of Shanghai", "date": "2026-10-13 08:30", "completed": True, "status_note": "Delayed 18h due to gale"},
                {"name": "Mid-Pacific Checkpoint", "location": "Trans-Pacific North", "date": "2026-10-19 00:00", "completed": False, "status_note": "Slow steaming at 14 knots"},
                {"name": "Berth Arrival", "location": "Pier 400 Los Angeles", "date": "2026-10-28 16:00", "completed": False, "status_note": "Estimated +68h delay vs schedule"},
                {"name": "Intermodal Rail Dispatch", "location": "LAX On-dock Rail", "date": "2026-10-31 10:00", "completed": False, "status_note": "Risk of missing critical factory deadline"}
            ],
            "related_disruptions": ["DIS-2026-001", "DIS-2026-004"],
            "mitigation_actions": [
                "Issue priority transloading authorization at Port of Long Beach off-dock yard",
                "Expedite pre-clearance with US Customs AMS to avoid secondary hold",
                "Reserve dedicated team truck drayage to Reno Gigafactory instead of rail"
            ],
            "is_demo": True
        },
        {
            "id": "SHP-8824",
            "tracking_ref": "COSU6291034",
            "origin": "CNSHA",
            "destination": "USLAX",
            "origin_name": "Shanghai, China",
            "dest_name": "Los Angeles, USA",
            "carrier": "COSCO Shipping",
            "vessel": "COSCO Shipping Universe (IMO 9795610)",
            "container_id": "CSLU-991204-7",
            "departure_date": "2026-10-14",
            "expected_arrival": "2026-10-29",
            "delivery_deadline": "2026-11-02",
            "predicted_delay_hours": 44,
            "delay_risk_level": "HIGH",
            "risk_score": 79,
            "status": "AT_RISK",
            "value_usd": 2200000,
            "cargo_description": "Server Racks & High-Density Networking Hardware",
            "route_id": "RT-SHA-LAX",
            "milestones": [
                {"name": "Gated In", "location": "Yangshan Deepwater Port", "date": "2026-10-13 18:00", "completed": True, "status_note": "Loaded onto bay 42"},
                {"name": "Pilot Boarded", "location": "Yangshan Anchorage", "date": "2026-10-15 02:00", "completed": True, "status_note": "Departed under foul weather advisory"},
                {"name": "Berth Arrival", "location": "LBCT Long Beach", "date": "2026-10-30 20:00", "completed": False, "status_note": "Predicted delay 44 hours"}
            ],
            "related_disruptions": ["DIS-2026-001"],
            "mitigation_actions": [
                "Notify Las Vegas data center staging warehouse of rescheduled receipt",
                "Verify automated terminal pre-gate QR code status"
            ],
            "is_demo": True
        },
        {
            "id": "SHP-9043",
            "tracking_ref": "MEDU7721908",
            "origin": "CNSHA",
            "destination": "NLRTM",
            "origin_name": "Shanghai, China",
            "dest_name": "Rotterdam, Netherlands",
            "carrier": "MSC Mediterranean Shipping",
            "vessel": "MSC Loreto (IMO 9934735)",
            "container_id": "MEDU-382910-4",
            "departure_date": "2026-10-02",
            "expected_arrival": "2026-11-04",
            "delivery_deadline": "2026-11-06",
            "predicted_delay_hours": 120,
            "delay_risk_level": "HIGH",
            "risk_score": 86,
            "status": "DELAYED",
            "value_usd": 3850000,
            "cargo_description": "Precision Industrial Robotics & CNC Controller Spindles",
            "route_id": "RT-SHA-RTM",
            "milestones": [
                {"name": "Port Departure", "location": "CNSHA", "date": "2026-10-02 12:00", "completed": True, "status_note": "On schedule"},
                {"name": "Singapore Bunker Call", "location": "SGSIN", "date": "2026-10-08 06:00", "completed": True, "status_note": "Bunkered 4,800t VLSFO"},
                {"name": "Cape Route Divert", "location": "South of Madagascar", "date": "2026-10-16 14:00", "completed": True, "status_note": "Diverted around Africa (+11 days)"},
                {"name": "Rotterdam Arrival", "location": "NLRTM Maasvlakte", "date": "2026-11-09 08:00", "completed": False, "status_note": "Firm delay: 5 days beyond deadline"}
            ],
            "related_disruptions": ["DIS-2026-002", "DIS-2026-003"],
            "mitigation_actions": [
                "CRITICAL: Customer penalty clause triggers at 72h delay. Dispatch emergency air freight of 4 critical replacement spindles ($24,000 cost)",
                "Book fast-track discharge slot with ECT Delta terminal to bypass Maasvlakte crane backlog"
            ],
            "is_demo": True
        },
        {
            "id": "SHP-9055",
            "tracking_ref": "HLCU4901824",
            "origin": "SGSIN",
            "destination": "NLRTM",
            "origin_name": "Singapore",
            "dest_name": "Rotterdam, Netherlands",
            "carrier": "Hapag-Lloyd",
            "vessel": "Berlin Express (IMO 9943865)",
            "container_id": "HLXU-802319-9",
            "departure_date": "2026-10-10",
            "expected_arrival": "2026-11-02",
            "delivery_deadline": "2026-11-05",
            "predicted_delay_hours": 36,
            "delay_risk_level": "MEDIUM",
            "risk_score": 58,
            "status": "AT_RISK",
            "value_usd": 890000,
            "cargo_description": "Specialty Chemical Polymers & Resin Pellets",
            "route_id": "RT-SIN-RTM",
            "milestones": [
                {"name": "Departure", "location": "Pasir Panjang Terminal", "date": "2026-10-10 18:30", "completed": True, "status_note": "Normal"},
                {"name": "Cape Good Hope", "location": "Atlantic Ocean", "date": "2026-10-24 12:00", "completed": False, "status_note": "En route at 19 knots"},
                {"name": "Rotterdam Berth", "location": "NLRTM Maasvlakte II", "date": "2026-11-03 14:00", "completed": False, "status_note": "Delay within buffer"}
            ],
            "related_disruptions": ["DIS-2026-002"],
            "mitigation_actions": [
                "Monitor Maasvlakte gate dwell index daily",
                "Ensure Antwerp barge on-carriage is pre-cleared"
            ],
            "is_demo": True
        },
        {
            "id": "SHP-8830",
            "tracking_ref": "ONEY8830112",
            "origin": "CNSHA",
            "destination": "USLAX",
            "origin_name": "Shanghai, China",
            "dest_name": "Los Angeles, USA",
            "carrier": "Ocean Network Express (ONE)",
            "vessel": "ONE Continuity (IMO 9388338)",
            "container_id": "TGHU-940112-3",
            "departure_date": "2026-10-15",
            "expected_arrival": "2026-10-30",
            "delivery_deadline": "2026-11-01",
            "predicted_delay_hours": 50,
            "delay_risk_level": "HIGH",
            "risk_score": 77,
            "status": "AT_RISK",
            "value_usd": 680000,
            "cargo_description": "Consumer Electronics & Smart Displays",
            "route_id": "RT-SHA-LAX",
            "milestones": [
                {"name": "Cargo Loading", "location": "Yangshan Phase I", "date": "2026-10-15 10:00", "completed": True, "status_note": "Loaded"},
                {"name": "Ocean Transit", "location": "Pacific Great Circle", "date": "2026-10-22 00:00", "completed": False, "status_note": "Rerouted south of storm track"}
            ],
            "related_disruptions": ["DIS-2026-001"],
            "mitigation_actions": ["Coordinate with US retail distribution center for delayed truck appointment slot"],
            "is_demo": True
        },
        {
            "id": "SHP-9080",
            "tracking_ref": "CMAU1948201",
            "origin": "SGSIN",
            "destination": "DEHAM",
            "origin_name": "Singapore",
            "dest_name": "Hamburg, Germany",
            "carrier": "CMA CGM",
            "vessel": "CMA CGM Jacques Saadé (IMO 9839179)",
            "container_id": "CMAU-554109-0",
            "departure_date": "2026-10-05",
            "expected_arrival": "2026-10-27",
            "delivery_deadline": "2026-10-30",
            "predicted_delay_hours": 28,
            "delay_risk_level": "MEDIUM",
            "risk_score": 54,
            "status": "AT_RISK",
            "value_usd": 1150000,
            "cargo_description": "Semiconductor Testing Equipment",
            "route_id": "RT-SIN-RTM",
            "milestones": [
                {"name": "Departure", "location": "SGSIN", "date": "2026-10-05 20:00", "completed": True, "status_note": "Departed"},
                {"name": "English Channel", "location": "Dover Strait", "date": "2026-10-24 08:00", "completed": False, "status_note": "Forecast on time"},
                {"name": "Hamburg Elbe Inbound", "location": "DEHAM Eurogate", "date": "2026-10-28 10:00", "completed": False, "status_note": "Subject to ver.di warning strike"}
            ],
            "related_disruptions": ["DIS-2026-005"],
            "mitigation_actions": ["Request feeder transshipment via Wilhelmshaven (JadeWeserPort) if strike extends"],
            "is_demo": True
        },
        {
            "id": "SHP-8835",
            "tracking_ref": "MSKU3309144",
            "origin": "NLRTM",
            "destination": "USLAX",
            "origin_name": "Rotterdam, Netherlands",
            "dest_name": "Los Angeles, USA",
            "carrier": "Maersk Line",
            "vessel": "Maersk Mc-Kinney Moller (IMO 9619907)",
            "container_id": "MSKU-192038-5",
            "departure_date": "2026-10-08",
            "expected_arrival": "2026-10-30",
            "delivery_deadline": "2026-11-04",
            "predicted_delay_hours": 16,
            "delay_risk_level": "LOW",
            "risk_score": 38,
            "status": "ON_TIME",
            "value_usd": 720000,
            "cargo_description": "Specialty Medical Optics & Diagnostics",
            "route_id": "RT-RTM-LAX",
            "milestones": [
                {"name": "Departed Rotterdam", "location": "NLRTM", "date": "2026-10-08 14:00", "completed": True, "status_note": "Departed"},
                {"name": "Panama Canal Transit", "location": "Miraflores Locks", "date": "2026-10-21 06:00", "completed": False, "status_note": "Reserved slot confirmed"}
            ],
            "related_disruptions": ["DIS-2026-004"],
            "mitigation_actions": ["Standard tracking protocol"],
            "is_demo": True
        },
        {
            "id": "SHP-9102",
            "tracking_ref": "COSU8819204",
            "origin": "AEJEA",
            "destination": "NLRTM",
            "origin_name": "Jebel Ali, UAE",
            "dest_name": "Rotterdam, Netherlands",
            "carrier": "COSCO Shipping",
            "vessel": "COSCO Glory (IMO 9464455)",
            "container_id": "CBHU-771923-2",
            "departure_date": "2026-10-11",
            "expected_arrival": "2026-11-01",
            "delivery_deadline": "2026-11-03",
            "predicted_delay_hours": 48,
            "delay_risk_level": "MEDIUM",
            "risk_score": 66,
            "status": "AT_RISK",
            "value_usd": 1320000,
            "cargo_description": "Aluminum Extrusions & Solar Frame Assemblies",
            "route_id": "RT-SHA-RTM",
            "milestones": [
                {"name": "Departure", "location": "AEJEA", "date": "2026-10-11 16:00", "completed": True, "status_note": "Departed"},
                {"name": "Cape Route Reroute", "location": "Indian Ocean", "date": "2026-10-17 08:00", "completed": True, "status_note": "Rerouting active"}
            ],
            "related_disruptions": ["DIS-2026-003"],
            "mitigation_actions": ["Notify receiver to adjust production run schedule"],
            "is_demo": True
        },
        {
            "id": "SHP-8842",
            "tracking_ref": "EGLV4920194",
            "origin": "CNSHA",
            "destination": "USLAX",
            "origin_name": "Shanghai, China",
            "dest_name": "Los Angeles, USA",
            "carrier": "Evergreen Line",
            "vessel": "Ever Golden (IMO 9811012)",
            "container_id": "EGLV-294810-6",
            "departure_date": "2026-10-16",
            "expected_arrival": "2026-10-31",
            "delivery_deadline": "2026-11-05",
            "predicted_delay_hours": 20,
            "delay_risk_level": "LOW",
            "risk_score": 34,
            "status": "ON_TIME",
            "value_usd": 480000,
            "cargo_description": "Apparel & Seasonal Footwear",
            "route_id": "RT-SHA-LAX",
            "milestones": [
                {"name": "Gated In", "location": "Shanghai Waigaoqiao", "date": "2026-10-16 11:00", "completed": True, "status_note": "Loaded"}
            ],
            "related_disruptions": ["DIS-2026-006"],
            "mitigation_actions": ["No action required at this time"],
            "is_demo": True
        },
        {
            "id": "SHP-7710",
            "tracking_ref": "MSKU1092837",
            "origin": "CNSHA",
            "destination": "SGSIN",
            "origin_name": "Shanghai, China",
            "dest_name": "Singapore",
            "carrier": "Maersk Line",
            "vessel": "Maersk Vallvik (IMO 9528782)",
            "container_id": "MSKU-993820-8",
            "departure_date": "2026-10-14",
            "expected_arrival": "2026-10-20",
            "delivery_deadline": "2026-10-22",
            "predicted_delay_hours": 12,
            "delay_risk_level": "LOW",
            "risk_score": 28,
            "status": "ON_TIME",
            "value_usd": 310000,
            "cargo_description": "Consumer Electronics Components",
            "route_id": None,
            "milestones": [
                {"name": "Departed Shanghai", "location": "CNSHA", "date": "2026-10-14 18:00", "completed": True, "status_note": "En route South China Sea"}
            ],
            "related_disruptions": [],
            "mitigation_actions": ["Routine monitoring"],
            "is_demo": True
        }
    ]

def get_seed_alerts() -> List[Dict[str, Any]]:
    return [
        {
            "id": "ALT-901",
            "severity": "HIGH",
            "event_category": "WEATHER",
            "title": "Severe Gale Alert: 3 Trans-Pacific shipments threatened at Shanghai",
            "description": "Force 9 storm winds in East China Sea halted pilotage at Port of Shanghai. Predicted delays 36h-52h directly threaten delivery deadlines for SHP-8821, SHP-8824, and SHP-8830.",
            "affected_location": "Port of Shanghai (CNSHA)",
            "related_shipments": ["SHP-8821", "SHP-8824", "SHP-8830"],
            "risk_score": 82,
            "source_evidence": "China MSA Navigational Warning #2026-441-B retrieved via TinyFish automation at 05:30 UTC.",
            "created_at": "2026-10-18T05:35:00Z",
            "status": "ACTIVE",
            "assigned_to": "Supply Chain Response Team"
        },
        {
            "id": "ALT-902",
            "severity": "HIGH",
            "event_category": "GEOPOLITICAL",
            "title": "Delivery Breach Imminent: SHP-9043 delayed 120h via Cape Rerouting",
            "description": "Precision robotics shipment ($3.85M) diverted around Cape of Good Hope, compounding with Rotterdam crane backlog. Expected delay exceeds contract penalty threshold by 72 hours.",
            "affected_location": "Suez Corridor & Rotterdam (NLRTM)",
            "related_shipments": ["SHP-9043"],
            "risk_score": 86,
            "source_evidence": "Carrier notice and Portbase telemetry correlation.",
            "created_at": "2026-10-17T22:30:00Z",
            "status": "ACTIVE",
            "assigned_to": "Logistics Operations Lead"
        },
        {
            "id": "ALT-903",
            "severity": "MEDIUM",
            "event_category": "PORT_CONGESTION",
            "title": "Maasvlakte II automated stacking crane desynchronization",
            "description": "Port of Rotterdam Maasvlakte terminal crane throughput depressed by 40%. Rail transfers backlogged 36 hours affecting inbound European cargo.",
            "affected_location": "Port of Rotterdam (NLRTM)",
            "related_shipments": ["SHP-9043", "SHP-9055"],
            "risk_score": 64,
            "source_evidence": "Portbase live API alert #PB-8819.",
            "created_at": "2026-10-17T22:20:00Z",
            "status": "ACKNOWLEDGED",
            "assigned_to": "European Dispatch Team"
        },
        {
            "id": "ALT-904",
            "severity": "MEDIUM",
            "event_category": "PORT_CONGESTION",
            "title": "Los Angeles Pier 400 rail chassis availability below 15%",
            "description": "Inland intermodal dwell time spiking to 5.4 days. Risk of missed rail departures for Midwest automotive components.",
            "affected_location": "Port of Los Angeles (USLAX)",
            "related_shipments": ["SHP-8821", "SHP-8835"],
            "risk_score": 58,
            "source_evidence": "PMSA Harbor Trucking indicator.",
            "created_at": "2026-10-17T14:15:00Z",
            "status": "ACTIVE",
            "assigned_to": "US Intermodal Manager"
        }
    ]

def get_seed_agent_jobs() -> List[Dict[str, Any]]:
    return [
        {
            "id": "JOB-TF-101",
            "source_name": "Shanghai Maritime Safety Administration (MSA)",
            "target_url": "https://www.msa.gov.cn/bulletin/east-china-sea",
            "auth_type": "PUBLIC",
            "status": "SUCCESS",
            "execution_time_ms": 3420,
            "started_at": "2026-10-18T05:29:40Z",
            "completed_at": "2026-10-18T05:29:43Z",
            "records_extracted": 3,
            "logs": [
                "[TinyFish] Initialized Chromium headless session (fingerprint: standard-mac-safari)",
                "[TinyFish] Navigated to https://www.msa.gov.cn/bulletin/east-china-sea",
                "[TinyFish] Rendered dynamic JS navigation table (.notice-list-container)",
                "[TinyFish] Applied semantic extractor for 'gale warnings', 'pilotage suspension'",
                "[TinyFish] Extracted 3 official notices. Discovered active Force 9 gale warning #2026-441-B",
                "[TinyFish] Normalized output schema & computed risk delta (+18 pts for CNSHA)",
                "[TinyFish] Session closed gracefully with 200 OK"
            ],
            "observations": [
                {
                    "id": "OBS-01",
                    "job_id": "JOB-TF-101",
                    "source_name": "Shanghai MSA",
                    "source_url": "https://www.msa.gov.cn/bulletin/east-china-sea/2026-warning",
                    "retrieval_timestamp": "2026-10-18T05:29:43Z",
                    "extracted_headline": "Gale Warning: Force 9 offshore Yangshan, pilotage halted",
                    "raw_snippet": "East China Sea Sector 3 gale warning active from 18/0400Z. Pilot boarding suspended until winds moderate below 25 knots.",
                    "affected_location": "Port of Shanghai",
                    "severity": "HIGH",
                    "confidence_score": 0.98,
                    "verified": True
                }
            ],
            "error_message": None
        },
        {
            "id": "JOB-TF-102",
            "source_name": "Port of Rotterdam Live Congestion & Portbase",
            "target_url": "https://www.portofrotterdam.com/en/portbase-status-updates",
            "auth_type": "PUBLIC",
            "status": "SUCCESS",
            "execution_time_ms": 2890,
            "started_at": "2026-10-17T22:14:30Z",
            "completed_at": "2026-10-17T22:14:33Z",
            "records_extracted": 2,
            "logs": [
                "[TinyFish] Launching browser agent for Port of Rotterdam portal",
                "[TinyFish] Bypassed cookie prompt and waited for DOM selector #live-terminal-telemetry",
                "[TinyFish] Extracted terminal crane status: Maasvlakte II ASC desync detected",
                "[TinyFish] Verified quay wait times: 28.0h avg (nominal: 12.0h)",
                "[TinyFish] Emitted observation to NEXUS disruption pipeline"
            ],
            "observations": [
                {
                    "id": "OBS-02",
                    "job_id": "JOB-TF-102",
                    "source_name": "Port of Rotterdam",
                    "source_url": "https://www.portofrotterdam.com/en/portbase-status-updates",
                    "retrieval_timestamp": "2026-10-17T22:14:33Z",
                    "extracted_headline": "Maasvlakte II Automated Crane Desync - 40% reduction",
                    "raw_snippet": "Software rollout rollback in progress. Average truck turn time elevated to 110m.",
                    "affected_location": "Port of Rotterdam",
                    "severity": "MEDIUM",
                    "confidence_score": 0.95,
                    "verified": True
                }
            ],
            "error_message": None
        },
        {
            "id": "JOB-TF-103",
            "source_name": "Maersk Authorized Partner Schedule Portal",
            "target_url": "https://portal.maersk.com/schedules/advisories",
            "auth_type": "API_BEARER",
            "status": "SUCCESS",
            "execution_time_ms": 1950,
            "started_at": "2026-10-18T04:10:00Z",
            "completed_at": "2026-10-18T04:10:02Z",
            "records_extracted": 4,
            "logs": [
                "[TinyFish] Authenticated with carrier gateway using token",
                "[TinyFish] Queried schedule change notices for Asia-US / Asia-EU lanes",
                "[TinyFish] 4 schedule alterations detected, matching SHP-8821 and SHP-9043",
                "[TinyFish] Delta synchronization complete"
            ],
            "observations": [],
            "error_message": None
        }
    ]

def get_seed_research_history() -> List[Dict[str, Any]]:
    return [
        {
            "research_id": "RES-2026-001",
            "query": "East China Sea Typhoon Malakas gale notice and Yangshan terminal crane throttle",
            "timestamp": "2026-10-18T05:30:00Z",
            "status": "SUCCESS",
            "message": "Public notice extracted from Shanghai Maritime Safety Administration bulletin",
            "connection_mode": "SIMULATION",
            "evidence_items": [
                {
                    "id": "EVD-001",
                    "title": "Shanghai MSA Marine Weather Broadcast #2026-881",
                    "summary": "Offshore winds exceeding 38 knots recorded near Yangshan Deep-Water Terminal. Pilot boarding suspended.",
                    "source_name": "Shanghai MSA",
                    "source_url": "https://www.msa.gov.cn/bulletin/east-china-sea",
                    "publication_time": "2026-10-18T04:00:00Z",
                    "retrieval_timestamp": "2026-10-18T05:29:43Z",
                    "location": "Port of Shanghai (CNSHA)",
                    "port_code": "CNSHA",
                    "disruption_type": "WEATHER",
                    "severity": "HIGH",
                    "evidence_excerpt": "East China Sea Sector 3 gale warning active from 18/0400Z. Pilot boarding suspended until winds moderate below 25 knots. Gantry operations throttled 35%.",
                    "verification_status": "SOURCED_FACT",
                    "confidence_score": 0.98,
                    "corroborating_data": "Corroborated by Central Meteorological Observatory maritime forecast."
                }
            ],
            "summary_findings": [
                "Sustained wind speeds of 38-45 knots active at outer anchorage.",
                "Pilot boarding halted, leading to queue growth of +18 container vessels.",
                "Direct schedule impact observed on 4 monitored trans-Pacific outbound consignments."
            ],
            "affected_locations": ["Port of Shanghai (CNSHA)"],
            "suggested_actions": [
                "Monitor MSA bulletin updates every 30 minutes",
                "Advise shippers of revised berthing windows",
                "Evaluate Ningbo-Zhoushan as alternative load port"
            ],
            "execution_time_ms": 1420
        },
        {
            "research_id": "RES-2026-002",
            "query": "Maasvlakte II automated container terminal barge dwell and rail queue",
            "timestamp": "2026-10-17T22:15:00Z",
            "status": "SUCCESS",
            "message": "Operational telemetry gathered from Port of Rotterdam Portbase advisory portal",
            "connection_mode": "SIMULATION",
            "evidence_items": [
                {
                    "id": "EVD-002",
                    "title": "Portbase Status Advisory — Maasvlakte II Intermodal Congestion",
                    "summary": "Automated stacking crane maintenance backlog causing extended dwell for inland barge and rail feeder connections.",
                    "source_name": "Port of Rotterdam Portbase",
                    "source_url": "https://www.portofrotterdam.com/en/portbase-status-updates",
                    "publication_time": "2026-10-17T20:30:00Z",
                    "retrieval_timestamp": "2026-10-17T22:14:33Z",
                    "location": "Port of Rotterdam (NLRTM)",
                    "port_code": "NLRTM",
                    "disruption_type": "PORT_CONGESTION",
                    "severity": "MEDIUM",
                    "evidence_excerpt": "Maasvlakte II ASC software rollback ongoing. Average truck turnaround time at 110 minutes; feeder barge queue at 24.5 hours.",
                    "verification_status": "SOURCED_FACT",
                    "confidence_score": 0.95,
                    "corroborating_data": "Consistent with European Intermodal Rail Operations notice."
                }
            ],
            "summary_findings": [
                "Average berth turnaround extended to 28.0h (nominal 12.0h).",
                "Inland water transport experiencing 24h+ delay; rail dwell elevated +14%."
            ],
            "affected_locations": ["Port of Rotterdam (NLRTM)"],
            "suggested_actions": [
                "Prioritize direct truck appointment slots for time-sensitive cargo",
                "Coordinate inland depot diversion via Antwerp (BEANR)"
            ],
            "execution_time_ms": 1180
        }
    ]

def get_seed_notifications() -> List[Dict[str, Any]]:
    return [
        {
            "id": "NOTIF-01",
            "title": "Web Research Completed: Shanghai Port Disruption",
            "message": "TinyFish web crawler completed research on Gale Notice #2026-881. Source evidence verified from Shanghai MSA.",
            "category": "INVESTIGATION",
            "priority": "HIGH",
            "read": False,
            "timestamp": "12m ago",
            "group": "Today",
            "link": "/research?id=RES-2026-001"
        },
        {
            "id": "NOTIF-02",
            "title": "Critical Disruption Notice: Red Sea Corridor",
            "message": "Bab el-Mandeb security corridor threat level elevated. 14 vessels diverted via Cape of Good Hope.",
            "category": "ALERT",
            "priority": "CRITICAL",
            "read": False,
            "timestamp": "45m ago",
            "group": "Today",
            "link": "/alerts/ALT-0024"
        },
        {
            "id": "NOTIF-03",
            "title": "Agent Telemetry Synced",
            "message": "Autonomous crawler #4 completed inspection of 3 port authority portals. 1 new signal dispatched.",
            "category": "AGENT",
            "priority": "LOW",
            "read": True,
            "timestamp": "2h ago",
            "group": "Today",
            "link": "/agent-center/disruption-monitor"
        }
    ]

class DataStore:
    def __init__(self):
        self.ports: Dict[str, Dict[str, Any]] = {}
        self.routes: Dict[str, Dict[str, Any]] = {}
        self.shipments: Dict[str, Dict[str, Any]] = {}
        self.disruptions: Dict[str, Dict[str, Any]] = {}
        self.alerts: Dict[str, Dict[str, Any]] = {}
        self.agent_jobs: List[Dict[str, Any]] = []
        self.research_history: List[Dict[str, Any]] = []
        self.notifications: List[Dict[str, Any]] = []
        self.config: Dict[str, Any] = {
            "weather_weight": 0.25,
            "congestion_weight": 0.30,
            "carrier_weight": 0.20,
            "labour_weight": 0.15,
            "geopolitical_weight": 0.10,
            "high_risk_threshold": 70,
            "medium_risk_threshold": 40,
            "refresh_interval_minutes": 15,
            "monitoring_mode": "DEMO_HYBRID",
            "tinyfish_api_key_configured": bool(os.getenv("TINYFISH_API_KEY")),
            "llm_api_key_configured": bool(os.getenv("OPENAI_API_KEY") or os.getenv("ANTHROPIC_API_KEY"))
        }
        self.load_or_seed()

    def reset_to_seed(self):
        self.ports = {p["code"]: p for p in get_seed_ports()}
        self.routes = {r["id"]: r for r in get_seed_routes()}
        self.shipments = {s["id"]: s for s in get_seed_shipments()}
        self.disruptions = {d["id"]: d for d in get_seed_disruptions()}
        self.alerts = {a["id"]: a for a in get_seed_alerts()}
        self.agent_jobs = get_seed_agent_jobs()
        self.research_history = get_seed_research_history()
        self.notifications = get_seed_notifications()
        self.save_to_file()

    def load_or_seed(self):
        if os.path.exists(DATA_FILE):
            try:
                with open(DATA_FILE, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    self.ports = data.get("ports", {})
                    self.routes = data.get("routes", {})
                    self.shipments = data.get("shipments", {})
                    self.disruptions = data.get("disruptions", {})
                    self.alerts = data.get("alerts", {})
                    self.agent_jobs = data.get("agent_jobs", [])
                    self.research_history = data.get("research_history", get_seed_research_history())
                    self.notifications = data.get("notifications", get_seed_notifications())
                    self.config = data.get("config", self.config)
                    return
            except Exception as e:
                print(f"[DataStore] Failed to load from file: {e}. Re-seeding.")
        self.reset_to_seed()

    def save_to_file(self):
        try:
            payload = {
                "ports": self.ports,
                "routes": self.routes,
                "shipments": self.shipments,
                "disruptions": self.disruptions,
                "alerts": self.alerts,
                "agent_jobs": self.agent_jobs,
                "research_history": self.research_history,
                "notifications": self.notifications,
                "config": self.config
            }
            with open(DATA_FILE, "w", encoding="utf-8") as f:
                json.dump(payload, f, indent=2)
        except Exception as e:
            print(f"[DataStore] Save failed: {e}")

# Global instance
db = DataStore()
