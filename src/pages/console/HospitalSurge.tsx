import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Bed, Users, Loader2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Line, ComposedChart } from 'recharts';
import { Badge } from "@/components/ui/badge";
import { useHospitalSurge } from "@/hooks/use-api";

const HospitalSurge = () => {
  const { t } = useTranslation();
  const { data, isLoading } = useHospitalSurge();

  const forecast = data?.forecast ?? [];
  const latest = forecast[0];
  const peak = forecast.length ? Math.max(...forecast.map(f => f.ed)) : 0;
  const baseline = 95; // assumed baseline

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">{t('nav.hospital')}</h1>
        <p className="text-muted-foreground">Healthcare capacity planning and surge forecasting</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Current ED Forecast</CardTitle>
            <Activity className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{latest ? Math.round(latest.ed) : '—'}</div>
            <p className="text-xs text-muted-foreground mt-1">{latest ? `${latest.date}` : 'admissions'}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Forecast Range</CardTitle>
            <Bed className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{latest ? `${Math.round(latest.p05)}-${Math.round(latest.p95)}` : '—'}</div>
            <p className="text-xs text-muted-foreground mt-1">5th-95th percentile</p>
          </CardContent>
        </Card>
        <Card className={peak > 130 ? "bg-destructive/10 border-destructive/30" : ""}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Peak Forecast</CardTitle>
            <Users className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${peak > 130 ? 'text-destructive' : ''}`}>{peak ? Math.round(peak) : '—'}</div>
            <p className="text-xs text-muted-foreground mt-1">{peak > 130 ? 'Surge capacity needed' : 'Within capacity'}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>ED Admissions Forecast</CardTitle>
          <CardDescription>Predicted emergency department admissions with confidence bands</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            {isLoading ? (
              <div className="h-full flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
            ) : forecast.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={forecast.map(f => ({ ...f, baseline }))}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                  <Legend />
                  <Line type="monotone" dataKey="baseline" stroke="hsl(var(--muted-foreground))" strokeDasharray="5 5" name="Baseline" dot={false} />
                  <Bar dataKey="ed" fill="hsl(var(--destructive))" name="Forecast" opacity={0.7} />
                </ComposedChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">Select a region to view forecast</div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Resource Optimization Suggestions</CardTitle>
          <CardDescription>AI-powered recommendations to meet surge demand</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {peak > 130 ? (
              <>
                <div className="flex items-start gap-3 p-3 rounded-lg border">
                  <Badge variant="destructive">high</Badge>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Activate overflow capacity for peak days</p>
                    <p className="text-xs text-muted-foreground mt-1">Peak forecast of {Math.round(peak)} exceeds normal capacity</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-lg border">
                  <Badge>medium</Badge>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Extend ED physician shifts by 2 hours</p>
                    <p className="text-xs text-muted-foreground mt-1">Improves throughput during peak hours</p>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">No surge alerts - capacity sufficient</p>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default HospitalSurge;
