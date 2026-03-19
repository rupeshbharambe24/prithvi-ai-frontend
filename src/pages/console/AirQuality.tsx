import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wind, AlertTriangle, TrendingUp, Loader2 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAirPm25 } from "@/hooks/use-api";

function getAqiCategory(pm25: number) {
  if (pm25 <= 12) return { label: 'Good', color: 'text-green-600' };
  if (pm25 <= 35) return { label: 'Moderate', color: 'text-yellow-600' };
  if (pm25 <= 55) return { label: 'Unhealthy for Sensitive Groups', color: 'text-orange-600' };
  if (pm25 <= 150) return { label: 'Unhealthy', color: 'text-red-600' };
  return { label: 'Very Unhealthy', color: 'text-purple-600' };
}

const AirQuality = () => {
  const { t } = useTranslation();
  const { data, isLoading } = useAirPm25();

  const series = data?.series ?? [];
  const latest = series.at(-1);
  const peak = series.length ? Math.max(...series.map(s => s.pm25)) : 0;
  const category = latest ? getAqiCategory(latest.pm25) : null;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">{t('nav.air')}</h1>
        <p className="text-muted-foreground">Air quality forecasting with health impact assessment</p>
      </div>

      {latest && latest.pm25 > 55 && (
        <Alert className="border-destructive/50 bg-destructive/10">
          <AlertTriangle className="h-4 w-4 text-destructive" />
          <AlertTitle className="text-destructive">{category?.label}</AlertTitle>
          <AlertDescription>
            Current PM2.5: {latest.pm25.toFixed(1)} µg/m³. Sensitive groups should limit outdoor activities.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">PM2.5 (latest)</CardTitle>
            <Wind className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{latest ? latest.pm25.toFixed(1) : '—'}</div>
            <p className={`text-xs mt-1 ${category?.color ?? 'text-muted-foreground'}`}>{category?.label ?? 'µg/m³'}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Forecast Range</CardTitle>
            <TrendingUp className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{latest ? `${latest.p05.toFixed(0)}-${latest.p95.toFixed(0)}` : '—'}</div>
            <p className="text-xs text-muted-foreground mt-1">5th-95th percentile µg/m³</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">72h Peak Forecast</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{peak ? peak.toFixed(1) : '—'}</div>
            <p className="text-xs text-muted-foreground mt-1">µg/m³</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>PM2.5 Forecast</CardTitle>
          <CardDescription>Air quality trend with WHO guideline reference</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            {isLoading ? (
              <div className="h-full flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
            ) : series.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={series}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 'auto']} />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                  <ReferenceLine y={15} stroke="hsl(142, 70%, 45%)" strokeDasharray="3 3" label="WHO" />
                  <ReferenceLine y={35} stroke="hsl(var(--accent))" strokeDasharray="3 3" label="Moderate" />
                  <ReferenceLine y={55} stroke="hsl(var(--destructive))" strokeDasharray="3 3" label="Unhealthy" />
                  <Line type="monotone" dataKey="pm25" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ fill: 'hsl(var(--primary))' }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">Select a region to view data</div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Health Recommendations</CardTitle>
          <CardDescription>Population-specific guidance based on current levels</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-muted/30">
              <h4 className="font-medium mb-2">General Population</h4>
              <p className="text-sm text-muted-foreground">
                {latest && latest.pm25 > 35 ? 'Air quality is degraded. Consider reducing prolonged outdoor exertion.' : 'Air quality is acceptable for normal activities.'}
              </p>
            </div>
            {latest && latest.pm25 > 35 && (
              <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/30">
                <h4 className="font-medium mb-2 text-destructive">Sensitive Groups</h4>
                <p className="text-sm text-muted-foreground">Children, elderly, and those with respiratory conditions should limit outdoor exertion.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AirQuality;
