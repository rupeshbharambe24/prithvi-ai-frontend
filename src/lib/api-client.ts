// API Client for backend communication
// In production, replace with actual backend endpoints

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

interface ApiOptions extends RequestInit {
  params?: Record<string, string>;
}

async function apiFetch<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
  const { params, ...fetchOptions } = options;
  
  // Build URL with query params
  let url = `${API_BASE_URL}${endpoint}`;
  if (params) {
    const searchParams = new URLSearchParams(params);
    url += `?${searchParams.toString()}`;
  }

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers: {
        'Content-Type': 'application/json',
        ...fetchOptions.headers,
      },
      credentials: 'include', // Include cookies for auth
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Fetch Error:', error);
    throw error;
  }
}

// Mock data generators for development
export const mockApi = {
  getCompositeRisk: async () => ({
    riskLevel: 'high',
    score: 0.78,
    drivers: ['temperature', 'humidity', 'rainfall'],
    timestamp: new Date().toISOString(),
  }),

  getHeatRisk: async () => ({
    temperature: {
      current: 38.5,
      forecast: [39, 40, 41, 39, 38, 37, 36],
      p05: [37, 38, 39, 37, 36, 35, 34],
      p95: [41, 42, 43, 41, 40, 39, 38],
    },
    riskZones: [
      { id: 1, name: 'North District', risk: 0.85, population: 50000 },
      { id: 2, name: 'Central District', risk: 0.72, population: 120000 },
      { id: 3, name: 'South District', risk: 0.63, population: 80000 },
    ],
  }),

  getDiseaseRisk: async (type: 'dengue' | 'cholera') => ({
    type,
    r_t: 1.3,
    suitability: 0.68,
    clusters: [
      { id: 1, location: 'Area A', cases: 45, trend: 'up' },
      { id: 2, location: 'Area B', cases: 23, trend: 'stable' },
    ],
  }),

  getHospitalSurge: async () => ({
    edAdmissions: {
      forecast: [120, 135, 150, 145, 130, 125, 118],
      baseline: [100, 100, 100, 100, 100, 100, 100],
    },
    bedOccupancy: 0.82,
    staffingSuggestions: ['Add 10 paramedics', 'Extend shift hours'],
  }),

  getAirQuality: async () => ({
    aqi: 156,
    pm25: 78.5,
    forecast: [160, 165, 158, 145, 140, 135, 130],
    advisory: 'Sensitive groups should avoid outdoor activities',
  }),

  getAlerts: async () => [
    {
      id: '1',
      type: 'heat',
      severity: 'high',
      message: 'Extreme heat warning for next 48 hours',
      timestamp: new Date().toISOString(),
      acknowledged: false,
    },
    {
      id: '2',
      type: 'disease',
      severity: 'medium',
      message: 'Dengue cases increasing in Central District',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      acknowledged: false,
    },
  ],

  getKnowledgeGraph: async () => ({
    nodes: [
      { id: '1', label: 'High Temperature', type: 'driver' },
      { id: '2', label: 'Heat Stroke', type: 'outcome' },
      { id: '3', label: 'Cooling Centers', type: 'intervention' },
      { id: '4', label: 'Study: Lancet 2023', type: 'evidence' },
    ],
    edges: [
      { source: '1', target: '2', label: 'causes' },
      { source: '3', target: '2', label: 'prevents' },
      { source: '4', target: '1', label: 'documents' },
    ],
  }),
};

export const api = {
  // In production, these would call real endpoints
  getRisk: apiFetch,
  getAlerts: mockApi.getAlerts,
  getHeatRisk: mockApi.getHeatRisk,
  getDiseaseRisk: mockApi.getDiseaseRisk,
  getHospitalSurge: mockApi.getHospitalSurge,
  getAirQuality: mockApi.getAirQuality,
  getKnowledgeGraph: mockApi.getKnowledgeGraph,
};
