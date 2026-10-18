import { 
  DashboardSummaryResponse, Shipment, Port, Route, DisruptionEvent, 
  Alert, AgentJob, RiskConfiguration, AnalystResponse,
  ResearchRequest, ResearchResponse, ResearchStatus
} from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";

async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers || {})
      }
    });
    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      throw new Error(errBody.detail || `HTTP Error ${res.status}`);
    }
    return await res.json();
  } catch (err: any) {
    console.warn(`[API] Call to ${endpoint} failed:`, err.message);
    throw err;
  }
}

export const api = {
  // Dashboard
  getDashboardSummary: () => apiFetch<DashboardSummaryResponse>("/dashboard/summary"),

  // Shipments
  getShipments: (params?: Record<string, string>) => {
    const q = params ? `?${new URLSearchParams(params).toString()}` : "";
    return apiFetch<{ total: number; shipments: Shipment[] }>(`/shipments${q}`);
  },
  getShipmentDetail: (id: string) => apiFetch<{
    shipment: Shipment;
    disruptions: DisruptionEvent[];
    route?: Route;
    origin_port?: Port;
    dest_port?: Port;
  }>(`/shipments/${id}`),
  createShipment: (data: Partial<Shipment>) => apiFetch<Shipment>("/shipments", {
    method: "POST",
    body: JSON.stringify(data)
  }),
  updateShipment: (id: string, data: Partial<Shipment>) => apiFetch<Shipment>(`/shipments/${id}`, {
    method: "PUT",
    body: JSON.stringify(data)
  }),
  deleteShipment: (id: string) => apiFetch<{ deleted: string }>(`/shipments/${id}`, {
    method: "DELETE"
  }),
  importCSV: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch(`${API_BASE}/shipments/import-csv`, {
      method: "POST",
      body: formData
    });
    if (!res.ok) throw new Error("CSV Upload failed");
    return await res.json();
  },

  // Ports & Routes
  getPorts: () => apiFetch<Port[]>("/ports"),
  getPortDetail: (code: string) => apiFetch<{
    port: Port;
    assessment: any;
    disruptions: DisruptionEvent[];
    affected_shipments: Shipment[];
    alternative_ports: Port[];
  }>(`/ports/${code}`),
  getRoutes: () => apiFetch<Route[]>("/routes"),

  // Disruptions
  getDisruptions: (params?: Record<string, string>) => {
    const q = params ? `?${new URLSearchParams(params).toString()}` : "";
    return apiFetch<DisruptionEvent[]>(`/disruptions${q}`);
  },
  getDisruptionDetail: (id: string) => apiFetch<{
    disruption: DisruptionEvent;
    affected_shipments: Shipment[];
  }>(`/disruptions/${id}`),
  refreshIntelligence: () => apiFetch<any>("/disruptions/refresh", { method: "POST" }),

  // Risk Intelligence
  getRisks: () => apiFetch<{
    weights: any;
    thresholds: any;
    assessments: any[];
  }>("/risks"),
  recalculateRisks: () => apiFetch<any>("/risks/recalculate", { method: "POST" }),

  // Alerts
  getAlerts: (params?: Record<string, string>) => {
    const q = params ? `?${new URLSearchParams(params).toString()}` : "";
    return apiFetch<Alert[]>(`/alerts${q}`);
  },
  acknowledgeAlert: (id: string) => apiFetch<Alert>(`/alerts/${id}/acknowledge`, { method: "POST" }),
  dismissAlert: (id: string) => apiFetch<Alert>(`/alerts/${id}/dismiss`, { method: "POST" }),
  resolveAlert: (id: string) => apiFetch<Alert>(`/alerts/${id}/resolve`, { method: "POST" }),

  // Agent Center (TinyFish)
  getAgentSources: () => apiFetch<any[]>("/agent/sources"),
  getAgentJobs: () => apiFetch<AgentJob[]>("/agent/jobs"),
  triggerAgent: (source_id: string, custom_url?: string) => apiFetch<AgentJob>("/agent/trigger", {
    method: "POST",
    body: JSON.stringify({ source_id, custom_url })
  }),

  // AI Analyst
  queryAIAnalyst: (question: string, context_shipment_id?: string, context_port_code?: string) => 
    apiFetch<AnalystResponse>("/ai/analyst", {
      method: "POST",
      body: JSON.stringify({ question, context_shipment_id, context_port_code })
    }),

  // Analytics
  getAnalytics: () => apiFetch<any>("/analytics"),

  // Settings
  getSettings: () => apiFetch<RiskConfiguration>("/settings"),
  updateSettings: (data: Partial<RiskConfiguration>) => apiFetch<RiskConfiguration>("/settings", {
    method: "PUT",
    body: JSON.stringify(data)
  }),
  resetDemoData: () => apiFetch<any>("/reset-demo", { method: "POST" }),

  // TinyFish Web Research Service
  getResearchStatus: () => apiFetch<ResearchStatus>("/research/status"),
  testResearchConnection: () => apiFetch<{ success: boolean; status: string; message: string; latency_ms: number }>("/research/test-connection", { method: "POST" }),
  executeResearch: (payload: ResearchRequest) => apiFetch<ResearchResponse>("/research/execute", { method: "POST", body: JSON.stringify(payload) }),
  getResearchHistory: (limit = 20) => apiFetch<ResearchResponse[]>(`/research/history?limit=${limit}`),
  getResearchDetail: (id: string) => apiFetch<ResearchResponse>(`/research/${id}`),

  // Extended Entities (Centralized Demo Data & API helpers)
  getInvestigations: async () => {
    const { DEMO_INVESTIGATIONS } = await import("./demoData");
    return DEMO_INVESTIGATIONS;
  },
  getInvestigationDetail: async (id: string) => {
    const { DEMO_INVESTIGATIONS } = await import("./demoData");
    return DEMO_INVESTIGATIONS.find(inv => inv.id === id) || null;
  },
  getAgentConfigs: async () => {
    const { DEMO_AGENTS } = await import("./demoData");
    return DEMO_AGENTS;
  },
  getAgentConfigDetail: async (id: string) => {
    const { DEMO_AGENTS } = await import("./demoData");
    return DEMO_AGENTS.find(a => a.id === id) || null;
  },
  getNotifications: async () => {
    try {
      const res = await apiFetch<any[]>("/notifications");
      if (Array.isArray(res) && res.length > 0) return res;
    } catch {
      // fallback
    }
    const { DEMO_NOTIFICATIONS } = await import("./demoData");
    return DEMO_NOTIFICATIONS;
  },
  markNotificationRead: (id: string) => apiFetch<{ status: string }>(`/notifications/${id}/read`, { method: "POST" }),
  clearNotifications: () => apiFetch<{ status: string; count: number }>("/notifications/clear", { method: "POST" }),
  getPromptTemplates: async () => {
    const { DEMO_TEMPLATES } = await import("./demoData");
    return DEMO_TEMPLATES;
  },
  getDataSources: async () => {
    const { DEMO_DATA_SOURCES } = await import("./demoData");
    return DEMO_DATA_SOURCES;
  }
};
