import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useQuery } from "@tanstack/react-query";
import {
  Brain,
  TrendingUp,
  MapPin,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Info,
  Cpu,
  BarChart3,
  Layers,
} from "lucide-react";

interface ModelEntry {
  id: number;
  target: string;
  algo: string;
  params: Record<string, unknown>;
  metrics: {
    rmse?: number;
    mae?: number;
    persistence_rmse?: number;
    skill_score?: number;
    train_rows?: number;
    test_rows?: number;
  };
  regionName: string | null;
  createdAt: string;
}

const TARGET_META: Record<string, { label: string; description: string; color: string; features: string[] }> = {
  heat: {
    label: "Heat Risk",
    description: "Predicts heat stress risk index (0-1) based on meteorological variables",
    color: "text-orange-500",
    features: ["t2m_max", "t2m_mean", "rh_mean", "wind_max", "heat_index", "wbgt_approx", "prcp_sum"],
  },
  disease: {
    label: "Disease Risk",
    description: "Forecasts vector-borne disease risk using climate and epidemiological proxies",
    color: "text-red-500",
    features: ["t2m_max", "rh_mean", "prcp_sum", "heat_index", "dengue_search", "respiratory_search"],
  },
  surge: {
    label: "Hospital Surge",
    description: "Predicts emergency department visit surge from heat and environmental factors",
    color: "text-blue-500",
    features: ["t2m_max", "heat_index", "rh_mean", "wind_max", "heatstroke_search", "hospital_search"],
  },
  pm25: {
    label: "Air Quality (PM2.5)",
    description: "Forecasts particulate matter concentration from meteorological patterns",
    color: "text-yellow-500",
    features: ["t2m_max", "wind_max", "prcp_sum", "rh_mean", "boundary_layer"],
  },
};

function readCsrfToken(): string | undefined {
  const m = document.cookie.match(/(?:^|; )csrf_token=([^;]+)/);
  return m ? decodeURIComponent(m[1]) : undefined;
}

async function fetchModels(): Promise<ModelEntry[]> {
  const res = await fetch("/api/v1/models/all", { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch models");
  return res.json();
}

function SkillBadge({ score }: { score: number }) {
  if (score >= 0.5) return <Badge className="bg-green-500/15 text-green-500 border-green-500/30">Excellent</Badge>;
  if (score >= 0.2) return <Badge className="bg-blue-500/15 text-blue-500 border-blue-500/30">Good</Badge>;
  if (score > 0) return <Badge className="bg-yellow-500/15 text-yellow-500 border-yellow-500/30">Fair</Badge>;
  return <Badge className="bg-muted text-muted-foreground">Baseline</Badge>;
}

function MetricCard({ label, value, unit, tooltip, icon: Icon }: { label: string; value: string; unit?: string; tooltip: string; icon: React.ElementType }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex items-center gap-3 p-3 rounded-lg border border-border bg-muted/30">
          <div className="p-2 rounded-md bg-primary/10">
            <Icon className="h-4 w-4 text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-lg font-semibold font-mono">
              {value}
              {unit && <span className="text-xs text-muted-foreground ml-1">{unit}</span>}
            </p>
          </div>
        </div>
      </TooltipTrigger>
      <TooltipContent><p className="max-w-xs text-xs">{tooltip}</p></TooltipContent>
    </Tooltip>
  );
}

function ModelTargetCard({ target, models }: { target: string; models: ModelEntry[] }) {
  const meta = TARGET_META[target] || { label: target, description: "", color: "text-foreground", features: [] };

  // Aggregate metrics across regions
  const avgRmse = models.reduce((s, m) => s + (m.metrics.rmse || 0), 0) / models.length;
  const avgMae = models.reduce((s, m) => s + (m.metrics.mae || 0), 0) / models.length;
  const avgSkill = models.reduce((s, m) => s + (m.metrics.skill_score || 0), 0) / models.length;
  const bestSkill = Math.max(...models.map((m) => m.metrics.skill_score || 0));
  const totalTrainRows = models.reduce((s, m) => s + (m.metrics.train_rows || 0), 0);
  const algo = models[0]?.algo || "unknown";
  const params = models[0]?.params || {};
  const lastTrained = models[0]?.createdAt || "";

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className={`text-xl ${meta.color}`}>{meta.label}</CardTitle>
            <CardDescription className="mt-1">{meta.description}</CardDescription>
          </div>
          <SkillBadge score={avgSkill} />
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Key metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <MetricCard label="Avg RMSE" value={avgRmse.toFixed(4)} tooltip="Root Mean Square Error averaged across all regions. Lower is better." icon={BarChart3} />
          <MetricCard label="Avg MAE" value={avgMae.toFixed(4)} tooltip="Mean Absolute Error averaged across all regions. Lower is better." icon={TrendingUp} />
          <MetricCard label="Skill Score" value={(avgSkill * 100).toFixed(1)} unit="%" tooltip={`Improvement over naive persistence baseline. Best region: ${(bestSkill * 100).toFixed(1)}%`} icon={Brain} />
          <MetricCard label="Training Data" value={totalTrainRows.toString()} unit="rows" tooltip="Total training observations across all regions" icon={Layers} />
        </div>

        {/* Algorithm details */}
        <div className="rounded-lg border border-border p-4 space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Cpu className="h-4 w-4 text-muted-foreground" />
            Algorithm Details
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-2 text-sm">
            <div>
              <span className="text-muted-foreground">Algorithm:</span>{" "}
              <span className="font-mono font-medium">{algo}</span>
            </div>
            {params.n_estimators && (
              <div>
                <span className="text-muted-foreground">Trees:</span>{" "}
                <span className="font-mono">{String(params.n_estimators)}</span>
              </div>
            )}
            {params.max_depth && (
              <div>
                <span className="text-muted-foreground">Max Depth:</span>{" "}
                <span className="font-mono">{String(params.max_depth)}</span>
              </div>
            )}
            {params.learning_rate && (
              <div>
                <span className="text-muted-foreground">Learning Rate:</span>{" "}
                <span className="font-mono">{String(params.learning_rate)}</span>
              </div>
            )}
          </div>
          {lastTrained && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              Last trained: {new Date(lastTrained).toLocaleString()}
            </div>
          )}
        </div>

        {/* Per-region performance table */}
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-[140px]">Region</TableHead>
                <TableHead className="text-right">RMSE</TableHead>
                <TableHead className="text-right">MAE</TableHead>
                <TableHead className="text-right">Persistence RMSE</TableHead>
                <TableHead className="text-right">Skill Score</TableHead>
                <TableHead className="text-right">Train / Test</TableHead>
                <TableHead className="w-[120px]">Performance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {models.map((m) => {
                const skill = m.metrics.skill_score || 0;
                const skillPct = Math.max(0, Math.min(100, skill * 100));
                return (
                  <TableRow key={m.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                        {m.regionName || `Model #${m.id}`}
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm">{(m.metrics.rmse || 0).toFixed(4)}</TableCell>
                    <TableCell className="text-right font-mono text-sm">{(m.metrics.mae || 0).toFixed(4)}</TableCell>
                    <TableCell className="text-right font-mono text-sm text-muted-foreground">{(m.metrics.persistence_rmse || 0).toFixed(4)}</TableCell>
                    <TableCell className="text-right">
                      <span className={`font-mono text-sm ${skill > 0.2 ? "text-green-500" : skill > 0 ? "text-yellow-500" : "text-muted-foreground"}`}>
                        {(skill * 100).toFixed(1)}%
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm text-muted-foreground">
                      {m.metrics.train_rows || 0} / {m.metrics.test_rows || 0}
                    </TableCell>
                    <TableCell>
                      <Progress value={skillPct} className="h-2" />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {/* Feature inputs */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Info className="h-4 w-4" />
            Input Features
          </div>
          <div className="flex flex-wrap gap-1.5">
            {meta.features.map((f) => (
              <Badge key={f} variant="outline" className="font-mono text-xs">
                {f}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

const Models = () => {
  const { data: models, isLoading, error } = useQuery<ModelEntry[]>({ queryKey: ["models-all"], queryFn: fetchModels });

  const grouped = useMemo(() => {
    if (!models) return {};
    const g: Record<string, ModelEntry[]> = {};
    for (const m of models) {
      (g[m.target] ||= []).push(m);
    }
    return g;
  }, [models]);

  const targets = Object.keys(grouped);
  const [activeTab, setActiveTab] = useState<string>("");
  const currentTab = activeTab || targets[0] || "heat";

  // Summary stats
  const totalModels = models?.length || 0;
  const avgSkillAll = models && models.length > 0 ? models.reduce((s, m) => s + (m.metrics.skill_score || 0), 0) / models.length : 0;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-3xl font-bold mb-2">Model Registry</h1>
        <p className="text-muted-foreground">Transparency dashboard for all ML models powering PRITHVI-AI forecasts</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-md bg-primary/10"><Brain className="h-5 w-5 text-primary" /></div>
            <div>
              <p className="text-xs text-muted-foreground">Total Models</p>
              <p className="text-2xl font-bold">{isLoading ? "..." : totalModels}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-md bg-primary/10"><Layers className="h-5 w-5 text-primary" /></div>
            <div>
              <p className="text-xs text-muted-foreground">Forecast Targets</p>
              <p className="text-2xl font-bold">{targets.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-md bg-primary/10"><TrendingUp className="h-5 w-5 text-primary" /></div>
            <div>
              <p className="text-xs text-muted-foreground">Avg Skill Score</p>
              <p className="text-2xl font-bold">{isLoading ? "..." : `${(avgSkillAll * 100).toFixed(1)}%`}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-md bg-primary/10"><Cpu className="h-5 w-5 text-primary" /></div>
            <div>
              <p className="text-xs text-muted-foreground">Algorithm</p>
              <p className="text-2xl font-bold">XGBoost</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Methodology note */}
      <Card className="border-blue-500/20 bg-blue-500/5">
        <CardContent className="p-4">
          <div className="flex gap-3">
            <Info className="h-5 w-5 text-blue-500 mt-0.5 shrink-0" />
            <div className="text-sm space-y-1">
              <p className="font-medium text-blue-500">How our models work</p>
              <p className="text-muted-foreground">
                Each model is an XGBoost gradient-boosted tree trained on real climate data from Open-Meteo (ERA5 reanalysis) and WHO health indicators.
                Models are retrained weekly with the latest data. The <span className="font-mono text-foreground">skill score</span> measures improvement over
                a naive persistence baseline (yesterday's value repeated) &mdash; a score above 0% means the model adds predictive value beyond simple repetition.
                All predictions include SHAP-based explainability showing which features drove each forecast.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {isLoading && (
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          <Brain className="h-6 w-6 animate-pulse mr-2" /> Loading model registry...
        </div>
      )}

      {error && (
        <Card className="border-destructive/50 bg-destructive/5 p-6">
          <div className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            <span>Failed to load models. Make sure the backend is running.</span>
          </div>
        </Card>
      )}

      {!isLoading && !error && targets.length > 0 && (
        <Tabs value={currentTab} onValueChange={setActiveTab}>
          <TabsList className="mb-4">
            {targets.map((t) => {
              const meta = TARGET_META[t];
              return (
                <TabsTrigger key={t} value={t} className="gap-1.5">
                  {meta ? <span className={meta.color}>{meta.label}</span> : t}
                  <Badge variant="secondary" className="ml-1 text-xs">{grouped[t].length}</Badge>
                </TabsTrigger>
              );
            })}
          </TabsList>
          {targets.map((t) => (
            <TabsContent key={t} value={t}>
              <ModelTargetCard target={t} models={grouped[t]} />
            </TabsContent>
          ))}
        </Tabs>
      )}

      {!isLoading && !error && targets.length === 0 && (
        <Card className="p-8 text-center">
          <Brain className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground">No models trained yet. Run the ETL pipeline and model training first.</p>
        </Card>
      )}

      {/* Data sources */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Data Sources & Training Pipeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="space-y-2">
              <p className="font-medium flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-green-500" /> Climate Data</p>
              <p className="text-muted-foreground">Open-Meteo ERA5 reanalysis: temperature, humidity, precipitation, wind speed. Updated daily.</p>
            </div>
            <div className="space-y-2">
              <p className="font-medium flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-green-500" /> Health Data</p>
              <p className="text-muted-foreground">WHO Global Health Observatory: dengue cases, malaria, life expectancy, PM2.5. Google Trends health search volume.</p>
            </div>
            <div className="space-y-2">
              <p className="font-medium flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-green-500" /> Population Data</p>
              <p className="text-muted-foreground">Census 2011 demographics, WorldPop density estimates, vulnerability indices (IPCC AR6 framework).</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Models;
