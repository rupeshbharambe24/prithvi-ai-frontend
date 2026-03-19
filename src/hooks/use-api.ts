import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAppStore } from '@/store/appStore';

// ---------------------------------------------------------------------------
// Fetch helper – uses the same apiFetch logic from api-client but lighter
// ---------------------------------------------------------------------------

function readCsrfToken(): string | undefined {
  const m = document.cookie.match(/(?:^|; )csrf_token=([^;]+)/);
  return m ? decodeURIComponent(m[1]) : undefined;
}

async function api<T>(endpoint: string, opts: { params?: Record<string, string>; method?: string; body?: unknown } = {}): Promise<T> {
  const { params, method = 'GET', body } = opts;
  let url = `/api/v1${endpoint}`;
  if (params) {
    const sp = new URLSearchParams(params);
    url += `?${sp.toString()}`;
  }
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (method !== 'GET') {
    const csrf = readCsrfToken();
    if (csrf) headers['X-CSRF-Token'] = csrf;
  }
  const res = await fetch(url, {
    method,
    headers,
    credentials: 'include',
    body: body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401) {
    // Try refresh
    const refreshRes = await fetch('/api/v1/auth/refresh', { method: 'POST', credentials: 'include' });
    if (refreshRes.ok) {
      const retry = await fetch(url, { method, headers, credentials: 'include', body: body ? JSON.stringify(body) : undefined });
      if (retry.ok) return retry.json();
    }
  }

  if (!res.ok) {
    const detail = await res.text().catch(() => res.statusText);
    throw new Error(`API ${res.status}: ${detail}`);
  }
  return res.json();
}

// ---------------------------------------------------------------------------
// Hook helpers
// ---------------------------------------------------------------------------

function useSelectedRegionId(): number | null {
  const region = useAppStore((s) => s.selectedRegion);
  return region?.numericId ?? null;
}

// ---------------------------------------------------------------------------
// Region hooks
// ---------------------------------------------------------------------------

export function useRegions() {
  return useQuery({
    queryKey: ['regions'],
    queryFn: () => api<Array<{ id: number; code: string; name: string; center: { lat: number; lng: number } | null; bounds: unknown; parentId: number | null }>>('/regions'),
  });
}

// ---------------------------------------------------------------------------
// Risk / Forecast hooks
// ---------------------------------------------------------------------------

export function useHeatRisk(horizon = '7d') {
  const regionId = useSelectedRegionId();
  return useQuery({
    queryKey: ['heat-risk', regionId, horizon],
    queryFn: () => api<{ series: Array<{ date: string; risk: number; p05: number; p95: number }>; drivers: Array<{ feature: string; shap: number }>; map: unknown }>('/risk/heat', { params: { regionId: String(regionId), horizon } }),
    enabled: !!regionId,
  });
}

export function useDiseaseRisk(type = 'dengue', horizon = '28d') {
  const regionId = useSelectedRegionId();
  return useQuery({
    queryKey: ['disease-risk', regionId, type, horizon],
    queryFn: () => api<{ series: Array<{ date: string; risk: number; p05: number; p95: number }>; drivers: Array<{ feature: string; shap: number }> }>('/risk/disease', { params: { regionId: String(regionId), type, horizon } }),
    enabled: !!regionId,
  });
}

export function useHospitalSurge(horizon = '7d') {
  const regionId = useSelectedRegionId();
  return useQuery({
    queryKey: ['hospital-surge', regionId, horizon],
    queryFn: () => api<{ forecast: Array<{ date: string; ed: number; p05: number; p95: number }>; drivers: Array<{ feature: string; shap: number }> }>('/hospital/surge', { params: { regionId: String(regionId), horizon } }),
    enabled: !!regionId,
  });
}

export function useAirPm25(horizon = '72h') {
  const regionId = useSelectedRegionId();
  return useQuery({
    queryKey: ['air-pm25', regionId, horizon],
    queryFn: () => api<{ series: Array<{ date: string; pm25: number; p05: number; p95: number }> }>('/air/pm25', { params: { regionId: String(regionId), horizon } }),
    enabled: !!regionId,
  });
}

// ---------------------------------------------------------------------------
// Alerts
// ---------------------------------------------------------------------------

export function useAlerts(status?: string) {
  const params: Record<string, string> = {};
  if (status) params.status = status;
  return useQuery({
    queryKey: ['alerts', status],
    queryFn: () => api<Array<{ id: number; ruleId: number; regionId: number; severity: string; startedAt: string; endedAt: string | null; status: string; payload: Record<string, unknown> }>>('/alerts', { params }),
  });
}

export function useAlertRules() {
  return useQuery({
    queryKey: ['alert-rules'],
    queryFn: () => api<Array<{ id: number; name: string; metric: string; condition: string; threshold: number; horizonDays: number; severity: string; channels: string[] }>>('/alerts/rules'),
  });
}

export function useAckAlert() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (alertId: number) => api<{ ok: boolean }>(`/alerts/${alertId}`, { method: 'PATCH', body: { status: 'ack' } }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['alerts'] }); },
  });
}

export function useRunAlertEvaluation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api<{ evaluated: number; created: number }>('/alerts/run', { method: 'POST' }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['alerts'] }); },
  });
}

export function useCreateAlertRule() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Record<string, unknown>) => api<{ id: number }>('/alerts/rules', { method: 'POST', body: payload }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['alert-rules'] }); },
  });
}

// ---------------------------------------------------------------------------
// Scenario
// ---------------------------------------------------------------------------

export function useRunScenario() {
  return useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      api<{ delta: Record<string, number>; ci: number[]; assumptions: Record<string, number>; costEstimate: number; effectivenessScore: number }>('/scenario/run', { method: 'POST', body: payload }),
  });
}

// ---------------------------------------------------------------------------
// Knowledge Graph
// ---------------------------------------------------------------------------

export function useKgGraph() {
  return useQuery({
    queryKey: ['kg-graph'],
    queryFn: () => api<{ nodes: Array<{ id: number; type: string; label: string; props: unknown }>; edges: Array<{ id: number; src: number; dst: number; rel: string; weight: number }> }>('/kg/graph'),
  });
}

export function useKgSearch(q: string) {
  return useQuery({
    queryKey: ['kg-search', q],
    queryFn: () => api<{ nodes: Array<{ id: number; type: string; label: string; props: unknown; score: number }>; edges: Array<{ id: number; src: number; dst: number; rel: string; weight: number }> }>('/kg/search', { params: { q } }),
    enabled: q.length > 0,
  });
}

// ---------------------------------------------------------------------------
// Evidence
// ---------------------------------------------------------------------------

export function useEvidenceList() {
  return useQuery({
    queryKey: ['evidence-list'],
    queryFn: () => api<{ items: Array<{ id: number; doi: string | null; url: string | null; title: string; year: number | null; strength: number | null; quality: string | null; summaryMd: string | null; tags: string[] }> }>('/evidence/list'),
  });
}

// ---------------------------------------------------------------------------
// Fairness & Drift
// ---------------------------------------------------------------------------

export function useFairnessLatest() {
  return useQuery({
    queryKey: ['fairness-latest'],
    queryFn: () => api<{ reportId?: number; metrics?: Record<string, unknown>; groups?: Array<Record<string, unknown>> }>('/fairness/latest'),
  });
}

export function useRunFairness() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => api<Record<string, unknown>>('/fairness/evaluate', { method: 'POST', params: { target: 'heat' } }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['fairness-latest'] }); },
  });
}

export function useDriftLatest(featureKey = 't2m_max') {
  return useQuery({
    queryKey: ['drift-latest', featureKey],
    queryFn: () => api<{ reportId?: number; psi?: number; referenceWindow?: string; currentWindow?: string }>('/qa/drift/latest', { params: { featureKey } }),
  });
}

export function useRunDrift() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (featureKey: string) => api<Record<string, unknown>>('/qa/drift', { method: 'POST', params: { featureKey } }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['drift-latest'] }); },
  });
}

// ---------------------------------------------------------------------------
// Datasets / Catalog
// ---------------------------------------------------------------------------

export function useDatasets() {
  return useQuery({
    queryKey: ['datasets'],
    queryFn: () => api<Array<{ id: number; name: string; source: string | null; license: string | null; spatial: string | null; temporal: string | null; freshness: string | null; metaJson: unknown }>>('/datasets'),
  });
}

export function useDatasetLineage(datasetId: number | null) {
  return useQuery({
    queryKey: ['dataset-lineage', datasetId],
    queryFn: () => api<{ dataset: unknown; versions: unknown[]; ingest_runs: unknown[] }>(`/datasets/${datasetId}/lineage`),
    enabled: !!datasetId,
  });
}
