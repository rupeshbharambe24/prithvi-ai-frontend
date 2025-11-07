import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, ComposedChart } from 'recharts';
import { Play, RotateCcw, TrendingDown, TrendingUp, Activity } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const mockBaseline = [
  { day: 1, baseline: 95, scenario: null },
  { day: 2, baseline: 95, scenario: null },
  { day: 3, baseline: 95, scenario: null },
  { day: 4, baseline: 95, scenario: null },
  { day: 5, baseline: 95, scenario: null },
  { day: 6, baseline: 95, scenario: null },
  { day: 7, baseline: 95, scenario: null },
];

const Scenario = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isRunning, setIsRunning] = useState(false);
  const [hasRun, setHasRun] = useState(false);
  const [coolingCenters, setCoolingCenters] = useState([0]);
  const [outreachCoverage, setOutreachCoverage] = useState([50]);
  const [vectorControl, setVectorControl] = useState([50]);
  const [staffingDelta, setStaffingDelta] = useState([0]);
  const [horizon, setHorizon] = useState("7");
  
  const [results, setResults] = useState({
    deltaAdmissions: -15,
    deltaMortality: -3,
    deltaRisk: -0.12,
    ci: [-20, -10] as [number, number],
    data: mockBaseline.map((d, i) => ({
      ...d,
      scenario: 95 - (i * 2.5)
    }))
  });

  const handleRun = async () => {
    setIsRunning(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const impact = (coolingCenters[0] * 0.02) + (outreachCoverage[0] * 0.1) + (vectorControl[0] * 0.08) + (staffingDelta[0] * 0.5);
    const newData = mockBaseline.map((d, i) => ({
      ...d,
      scenario: Math.max(50, 95 - (i * 2.5) - impact)
    }));
    
    setResults({
      deltaAdmissions: Math.round(-impact * 0.8),
      deltaMortality: Math.round(-impact * 0.15),
      deltaRisk: -impact * 0.01,
      ci: [Math.round(-impact * 1.2), Math.round(-impact * 0.5)] as [number, number],
      data: newData
    });
    
    setHasRun(true);
    setIsRunning(false);
    toast({
      title: "Scenario Complete",
      description: "Climate-health scenario analysis completed successfully."
    });
  };

  const handleReset = () => {
    setCoolingCenters([0]);
    setOutreachCoverage([50]);
    setVectorControl([50]);
    setStaffingDelta([0]);
    setHorizon("7");
    setHasRun(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold mb-2">{t('nav.scenario')}</h1>
        <p className="text-muted-foreground">
          Model intervention scenarios and predict health outcomes
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Scenario Controls</CardTitle>
            <CardDescription>Configure intervention parameters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Forecast Horizon</Label>
              <Select value={horizon} onValueChange={setHorizon}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">7 days</SelectItem>
                  <SelectItem value="14">14 days</SelectItem>
                  <SelectItem value="21">21 days</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Cooling Center Capacity: +{coolingCenters[0]}</Label>
              <Slider
                value={coolingCenters}
                onValueChange={setCoolingCenters}
                min={0}
                max={500}
                step={10}
              />
            </div>

            <div className="space-y-2">
              <Label>Outreach Coverage: {outreachCoverage[0]}%</Label>
              <Slider
                value={outreachCoverage}
                onValueChange={setOutreachCoverage}
                min={0}
                max={100}
                step={5}
              />
            </div>

            <div className="space-y-2">
              <Label>Vector Control Efficacy: {vectorControl[0]}%</Label>
              <Slider
                value={vectorControl}
                onValueChange={setVectorControl}
                min={0}
                max={100}
                step={5}
              />
            </div>

            <div className="space-y-2">
              <Label>Staffing Delta: {staffingDelta[0] > 0 ? '+' : ''}{staffingDelta[0]}</Label>
              <Slider
                value={staffingDelta}
                onValueChange={setStaffingDelta}
                min={-20}
                max={50}
                step={1}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={handleRun} disabled={isRunning} className="flex-1">
                <Play className="h-4 w-4 mr-2" />
                {isRunning ? "Running..." : "Run Scenario"}
              </Button>
              <Button onClick={handleReset} variant="outline">
                <RotateCcw className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="lg:col-span-2 space-y-6">
          {!hasRun ? (
            <Card className="h-full flex items-center justify-center min-h-[400px]">
              <div className="text-center space-y-3 p-8">
                <Activity className="h-12 w-12 text-muted-foreground mx-auto" />
                <h3 className="text-lg font-medium">No Scenario Run Yet</h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  Configure intervention parameters and click "Run Scenario" to see predicted outcomes
                </p>
              </div>
            </Card>
          ) : (
            <>
              {/* Impact KPIs */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Admissions Impact</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                          {results.deltaAdmissions}
                        </div>
                        <TrendingDown className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        CI: [{results.ci[0]}, {results.ci[1]}]
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Mortality Impact</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                          {results.deltaMortality}
                        </div>
                        <TrendingDown className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Estimated reduction
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Risk Reduction</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                          {results.deltaRisk.toFixed(2)}
                        </div>
                        <TrendingDown className="h-5 w-5 text-green-600 dark:text-green-400" />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Composite score
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>

              {/* Forecast Chart */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Admissions Forecast Comparison</CardTitle>
                    <CardDescription>
                      Baseline vs. intervention scenario over {horizon} days
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={results.data}>
                          <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                          <XAxis dataKey="day" label={{ value: 'Day', position: 'insideBottom', offset: -5 }} />
                          <YAxis label={{ value: 'Admissions', angle: -90, position: 'insideLeft' }} />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: 'hsl(var(--card))',
                              border: '1px solid hsl(var(--border))'
                            }}
                          />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="baseline"
                            stroke="hsl(var(--muted-foreground))"
                            strokeDasharray="5 5"
                            name="Baseline"
                            dot={false}
                          />
                          <Line
                            type="monotone"
                            dataKey="scenario"
                            stroke="hsl(var(--primary))"
                            strokeWidth={2}
                            name="Scenario"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Cost-Benefit Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Cost-Benefit Analysis</CardTitle>
                  <CardDescription>Preliminary impact estimates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                      <span className="text-sm font-medium">Lives Saved (estimated)</span>
                      <Badge variant="secondary">{Math.abs(results.deltaMortality)}</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                      <span className="text-sm font-medium">Admissions Prevented</span>
                      <Badge variant="secondary">{Math.abs(results.deltaAdmissions)}</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                      <span className="text-sm font-medium">Risk Score Improvement</span>
                      <Badge variant="secondary">{(Math.abs(results.deltaRisk) * 100).toFixed(1)}%</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Scenario;
