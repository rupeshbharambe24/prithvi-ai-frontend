import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Activity, Wind, TrendingUp, Loader2 } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useHeatRisk, useAlerts, useHospitalSurge, useAirPm25 } from "@/hooks/use-api";

const Overview = () => {
  const { t } = useTranslation();
  const { data: heatData, isLoading: heatLoading } = useHeatRisk();
  const { data: alerts } = useAlerts();
  const { data: surgeData } = useHospitalSurge();
  const { data: airData } = useAirPm25();

  const latestHeat = heatData?.series?.at(-1)?.risk ?? '—';
  const alertCount = alerts?.length ?? 0;
  const surgePeak = surgeData?.forecast ? Math.max(...surgeData.forecast.map(f => f.ed)) : '—';
  const latestPm25 = airData?.series?.at(-1)?.pm25 ?? '—';

  const kpiCards = [
    { title: "Active Alerts", value: String(alertCount), change: `${alertCount} total`, icon: AlertTriangle, color: "text-destructive" },
    { title: "3-Day ED Peak", value: String(typeof surgePeak === 'number' ? Math.round(surgePeak) : surgePeak), change: "forecast", icon: Activity, color: "text-primary" },
    { title: "PM2.5 (latest)", value: typeof latestPm25 === 'number' ? latestPm25.toFixed(1) : String(latestPm25), change: "µg/m³", icon: Wind, color: "text-accent" },
    { title: "Heat Risk", value: typeof latestHeat === 'number' ? latestHeat.toFixed(2) : String(latestHeat), change: "composite score", icon: TrendingUp, color: "text-destructive" },
  ];

  const chartData = (heatData?.series ?? []).map(s => ({ date: s.date, risk: s.risk }));

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">{t('nav.overview')}</h1>
        <p className="text-muted-foreground">Real-time climate-health intelligence dashboard</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((kpi, index) => (
          <motion.div key={kpi.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: index * 0.05 }}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
                <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpi.value}</div>
                <p className="text-xs text-muted-foreground mt-1">{kpi.change}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Heat Risk Forecast</CardTitle>
          <CardDescription>Composite climate-health risk score (0-1 scale)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            {heatLoading ? (
              <div className="h-full flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
            ) : chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="date" className="text-xs" />
                  <YAxis domain={[0, 1]} className="text-xs" />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                  <Area type="monotone" dataKey="risk" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.2} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">Select a region to view data</div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Alerts</CardTitle>
          <CardDescription>Latest climate-health warnings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {(alerts ?? []).slice(0, 5).map((alert) => (
              <div key={alert.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                <AlertTriangle className={`h-5 w-5 mt-0.5 ${
                  alert.severity === 'critical' ? 'text-destructive' :
                  alert.severity === 'warn' ? 'text-accent' : 'text-muted-foreground'
                }`} />
                <div className="flex-1">
                  <p className="text-sm font-medium">{alert.payload?.metric ?? 'Alert'}: {typeof alert.payload?.value === 'number' ? Number(alert.payload.value).toFixed(2) : ''} (threshold: {String(alert.payload?.threshold ?? '')})</p>
                  <p className="text-xs text-muted-foreground mt-1">{new Date(alert.startedAt).toLocaleString()}</p>
                </div>
              </div>
            ))}
            {(!alerts || alerts.length === 0) && (
              <p className="text-sm text-muted-foreground text-center py-4">No alerts yet</p>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Overview;
