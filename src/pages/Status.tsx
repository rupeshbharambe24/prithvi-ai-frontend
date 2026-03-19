import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { api } from '@/lib/api-client';

type Health = {
  status: string;
  db: boolean;
  redis: boolean;
  objectStore: boolean;
  version: string;
  uptimeSeconds: number;
};

const Status = () => {
  const [health, setHealth] = useState<Health | null>(null);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);

  useEffect(() => {
    const run = async () => {
      const start = performance.now();
      const h = await api.getRisk<Health>(`/health/`);
      setLatencyMs(Math.round(performance.now() - start));
      setHealth(h);
    };
    run().catch(console.error);
  }, []);

  return (
    <div className="p-6">
      <Card className="max-w-3xl">
        <CardHeader>
          <CardTitle>System Status</CardTitle>
        </CardHeader>
        <CardContent>
          {health ? (
            <div className="grid grid-cols-2 gap-4">
              <div><strong>Status:</strong> {health.status}</div>
              <div><strong>Version:</strong> {health.version}</div>
              <div><strong>DB:</strong> {health.db ? 'OK' : 'Down'}</div>
              <div><strong>Redis:</strong> {health.redis ? 'OK' : 'Down'}</div>
              <div><strong>Object Store:</strong> {health.objectStore ? 'OK' : 'Down'}</div>
              <div><strong>Uptime (s):</strong> {Math.round(health.uptimeSeconds)}</div>
              <div><strong>Latency (ms):</strong> {latencyMs ?? '—'}</div>
            </div>
          ) : (
            <div>Loading health…</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Status;

