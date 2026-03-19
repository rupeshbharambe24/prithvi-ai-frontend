import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Thermometer, Droplets, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { useHeatRisk } from "@/hooks/use-api";
import { useAppStore } from "@/store/appStore";

const HeatRisk = () => {
  const { t } = useTranslation();
  const leadTime = useAppStore(s => s.leadTime);
  const { data, isLoading, error } = useHeatRisk(`${leadTime}d`);

  const series = data?.series ?? [];
  const drivers = data?.drivers ?? [];
  const latest = series.at(-1);
  const riskLevel = latest ? (latest.risk >= 0.8 ? 'CRITICAL' : latest.risk >= 0.6 ? 'HIGH' : latest.risk >= 0.4 ? 'MODERATE' : 'LOW') : '—';

  const handleExport = () => {
    if (!series.length) return;
    const csv = ['date,risk,p05,p95', ...series.map(s => `${s.date},${s.risk},${s.p05},${s.p95}`)].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'heat_risk_forecast.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">{t('nav.heat')}</h1>
          <p className="text-muted-foreground">Heat wave forecasting and vulnerability assessment</p>
        </div>
        <Button variant="outline" className="gap-2" onClick={handleExport} disabled={!series.length}>
          <Download className="h-4 w-4" />Export Data
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Latest Risk Score</CardTitle>
            <Thermometer className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{latest ? latest.risk.toFixed(2) : '—'}</div>
            <p className="text-xs text-muted-foreground mt-1">{latest?.date ?? ''}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Top Driver</CardTitle>
            <Droplets className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{drivers[0]?.feature ?? '—'}</div>
            <p className="text-xs text-muted-foreground mt-1">SHAP: {drivers[0]?.shap?.toFixed(3) ?? ''}</p>
          </CardContent>
        </Card>
        <Card className={latest && latest.risk >= 0.7 ? "bg-destructive/10 border-destructive/30" : ""}>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Risk Level</CardTitle></CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${latest && latest.risk >= 0.7 ? 'text-destructive' : ''}`}>{riskLevel}</div>
            <p className="text-xs text-muted-foreground mt-1">{latest && latest.risk >= 0.7 ? 'Heat advisory in effect' : 'Monitor conditions'}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Heat Risk Forecast</CardTitle>
          <CardDescription>With 5th and 95th percentile confidence bands</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            {isLoading ? (
              <div className="h-full flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
            ) : series.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={series}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 1]} />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                  <Legend />
                  <Area type="monotone" dataKey="p95" stroke="none" fill="hsl(var(--destructive))" fillOpacity={0.1} name="95th %ile" />
                  <Area type="monotone" dataKey="p05" stroke="none" fill="hsl(var(--background))" fillOpacity={1} name="5th %ile" />
                  <Line type="monotone" dataKey="risk" stroke="hsl(var(--destructive))" strokeWidth={2} dot={{ fill: 'hsl(var(--destructive))' }} name="Risk" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">Select a region to view forecast</div>
            )}
          </div>
        </CardContent>
      </Card>

      {drivers.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Risk Drivers</CardTitle>
            <CardDescription>SHAP-based feature attribution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {drivers.map((d, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg border">
                  <span className="text-sm font-medium">{d.feature}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${Math.min(Math.abs(d.shap) * 300, 100)}%` }} />
                    </div>
                    <span className="text-xs text-muted-foreground w-12 text-right">{d.shap.toFixed(3)}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
};

export default HeatRisk;
