import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import { AlertTriangle, RefreshCw, Info, Loader2 } from "lucide-react";
import { Tooltip as UITooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useFairnessLatest, useRunFairness, useDriftLatest, useRunDrift } from "@/hooks/use-api";

// fallback mock data if no report exists
const mockFairnessData = [
  { group: 'Decile 1 (Low Vuln.)', mae: 8.2, coverage: 0.95 },
  { group: 'Decile 2', mae: 8.5, coverage: 0.94 },
  { group: 'Decile 3', mae: 9.1, coverage: 0.92 },
  { group: 'Decile 4', mae: 9.8, coverage: 0.90 },
  { group: 'Decile 5', mae: 10.2, coverage: 0.88 },
  { group: 'Decile 6', mae: 11.1, coverage: 0.85 },
  { group: 'Decile 7', mae: 12.3, coverage: 0.82 },
  { group: 'Decile 8', mae: 13.5, coverage: 0.78 },
  { group: 'Decile 9', mae: 15.2, coverage: 0.72 },
  { group: 'Decile 10 (High Vuln.)', mae: 17.8, coverage: 0.65 },
];

const mockDriftRef = [
  { bin: '0-10', refFreq: 0.08, curFreq: 0.07 },
  { bin: '10-20', refFreq: 0.12, curFreq: 0.11 },
  { bin: '20-30', refFreq: 0.18, curFreq: 0.16 },
  { bin: '30-40', refFreq: 0.22, curFreq: 0.24 },
  { bin: '40-50', refFreq: 0.20, curFreq: 0.23 },
  { bin: '50-60', refFreq: 0.12, curFreq: 0.13 },
  { bin: '60-70', refFreq: 0.06, curFreq: 0.04 },
  { bin: '70-80', refFreq: 0.02, curFreq: 0.02 },
];

const Fairness = () => {
  const { t } = useTranslation();
  const { data: fairnessData, isLoading: fairnessLoading } = useFairnessLatest();
  const { data: driftData, isLoading: driftLoading } = useDriftLatest('t2m_max');
  const runFairness = useRunFairness();
  const runDrift = useRunDrift();

  const hasReport = !!fairnessData?.reportId;
  const metrics = fairnessData?.metrics ?? {};
  const groups = (fairnessData?.groups ?? []) as Array<Record<string, unknown>>;

  const overallMAE = (metrics as any)?.mae ?? 11.5;
  const maeGap = (metrics as any)?.maeGap ?? 9.6;
  const coverageRate = (metrics as any)?.coverageRate ?? 0.84;
  const coverageGap = (metrics as any)?.coverageGap ?? 0.30;

  const fairnessChartData = groups.length > 0
    ? groups.map((g: any) => ({ group: g.group ?? '', mae: g.mae ?? 0, coverage: g.coverage ?? 0 }))
    : mockFairnessData;

  const psi = driftData?.psi ?? 0.08;
  const getPSIStatus = (p: number) => {
    if (p < 0.1) return { label: 'Good', color: 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20' };
    if (p < 0.25) return { label: 'Warning', color: 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20' };
    return { label: 'Alert', color: 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20' };
  };
  const psiStatus = getPSIStatus(psi);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">{t('nav.fairness')}</h1>
        <p className="text-muted-foreground">Model fairness, bias detection, and quality assurance</p>
      </div>

      <Tabs defaultValue="fairness" className="space-y-6">
        <TabsList>
          <TabsTrigger value="fairness">Fairness Analysis</TabsTrigger>
          <TabsTrigger value="drift">Feature Drift</TabsTrigger>
        </TabsList>

        <TabsContent value="fairness" className="space-y-6">
          {!hasReport && (
            <Card className="border-primary/30 bg-primary/5">
              <CardContent className="flex items-center justify-between py-6">
                <p className="text-sm">No fairness report exists yet. Run an evaluation to generate metrics.</p>
                <Button onClick={() => runFairness.mutate()} disabled={runFairness.isPending}>
                  {runFairness.isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Run Evaluation
                </Button>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { label: 'Overall MAE', value: overallMAE?.toFixed?.(1) ?? '—', sub: 'admissions/day', tooltip: 'Mean Absolute Error across all predictions' },
              { label: 'MAE Gap', value: maeGap?.toFixed?.(1) ?? '—', sub: 'needs improvement', tooltip: 'Difference between highest and lowest vulnerability groups', warn: true },
              { label: 'Coverage Rate', value: typeof coverageRate === 'number' ? `${(coverageRate * 100).toFixed(0)}%` : '—', sub: 'within bounds', tooltip: 'Proportion of predictions within confidence bounds' },
              { label: 'Coverage Gap', value: typeof coverageGap === 'number' ? `${(coverageGap * 100).toFixed(0)}%` : '—', sub: 'gap detected', tooltip: 'Coverage difference across vulnerability groups', warn: true },
            ].map((kpi) => (
              <Card key={kpi.label}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">{kpi.label}</CardTitle>
                    <TooltipProvider><UITooltip><TooltipTrigger asChild><Info className="h-4 w-4 text-muted-foreground cursor-help" /></TooltipTrigger>
                      <TooltipContent><p className="max-w-xs text-xs">{kpi.tooltip}</p></TooltipContent></UITooltip></TooltipProvider>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className={`text-2xl font-bold ${kpi.warn ? 'text-yellow-600 dark:text-yellow-400' : ''}`}>{kpi.value}</div>
                  <p className="text-xs text-muted-foreground mt-1">{kpi.sub}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader><CardTitle>Prediction Error by Vulnerability Group</CardTitle><CardDescription>Mean Absolute Error across vulnerability deciles</CardDescription></CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={fairnessChartData} layout="vertical" margin={{ left: 120 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis type="number" domain={[0, 20]} />
                    <YAxis type="category" dataKey="group" width={110} style={{ fontSize: '11px' }} />
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                    <Bar dataKey="mae" fill="hsl(var(--primary))" name="MAE" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {hasReport && (
            <Button variant="outline" onClick={() => runFairness.mutate()} disabled={runFairness.isPending}>
              <RefreshCw className="h-4 w-4 mr-2" />Re-run Evaluation
            </Button>
          )}
        </TabsContent>

        <TabsContent value="drift" className="space-y-6">
          <Card>
            <CardHeader><CardTitle>Population Stability Index (PSI)</CardTitle><CardDescription>Measures feature distribution drift from reference period</CardDescription></CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-4xl font-bold">{psi.toFixed(3)}</div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {driftData?.referenceWindow ?? 'Reference'} | {driftData?.currentWindow ?? 'Current'}
                  </p>
                </div>
                <Badge variant="outline" className={psiStatus.color}>{psiStatus.label}</Badge>
              </div>
              <div className="mt-4 p-3 rounded-lg bg-muted/30 text-xs text-muted-foreground">
                <p>PSI {'<'} 0.1: No significant change</p>
                <p>PSI 0.1 - 0.25: Moderate change, monitor closely</p>
                <p>PSI {'>'} 0.25: Significant drift, consider retraining</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Feature Distribution: Temperature (°C)</CardTitle><CardDescription>Reference period vs. current period</CardDescription></CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mockDriftRef}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="bin" />
                    <YAxis domain={[0, 0.3]} tickFormatter={(v) => `${(v * 100).toFixed(0)}%`} />
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} formatter={(value: any) => `${(value * 100).toFixed(1)}%`} />
                    <Legend />
                    <Line type="monotone" dataKey="refFreq" stroke="hsl(var(--muted-foreground))" strokeDasharray="5 5" name="Reference" dot={false} />
                    <Line type="monotone" dataKey="curFreq" stroke="hsl(var(--primary))" strokeWidth={2} name="Current" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Drift Monitoring Actions</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full" onClick={() => runDrift.mutate('t2m_max')} disabled={runDrift.isPending}>
                <RefreshCw className="h-4 w-4 mr-2" />{runDrift.isPending ? 'Computing...' : 'Recompute PSI'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default Fairness;
