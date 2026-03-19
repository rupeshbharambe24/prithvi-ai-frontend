import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, TrendingUp, MapPin, Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { useDiseaseRisk } from "@/hooks/use-api";

const DiseaseRisk = () => {
  const { t } = useTranslation();
  const { data, isLoading } = useDiseaseRisk('dengue');

  const series = data?.series ?? [];
  const latest = series.at(-1);
  const maxRisk = series.length ? Math.max(...series.map(s => s.risk)) : 0;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">{t('nav.disease')}</h1>
        <p className="text-muted-foreground">Climate-sensitive disease surveillance and forecasting</p>
      </div>

      <Tabs defaultValue="dengue" className="space-y-4">
        <TabsList>
          <TabsTrigger value="dengue">Dengue</TabsTrigger>
          <TabsTrigger value="cholera">Cholera</TabsTrigger>
        </TabsList>

        <TabsContent value="dengue" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Latest Risk Score</CardTitle>
                <Activity className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{latest ? latest.risk.toFixed(2) : '—'}</div>
                <p className="text-xs text-muted-foreground mt-1">{latest && latest.risk > 0.5 ? 'Elevated transmission risk' : 'Normal levels'}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Peak Risk (window)</CardTitle>
                <TrendingUp className="h-4 w-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{maxRisk ? maxRisk.toFixed(2) : '—'}</div>
                <p className="text-xs text-muted-foreground mt-1">In forecast window</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Data Points</CardTitle>
                <MapPin className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{series.length}</div>
                <p className="text-xs text-muted-foreground mt-1">days of forecast data</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Disease Risk Trend</CardTitle>
              <CardDescription>Risk score over time with confidence bands</CardDescription>
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
                      <YAxis domain={[0, 1]} />
                      <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }} />
                      <Legend />
                      <ReferenceLine y={0.5} stroke="hsl(var(--muted-foreground))" strokeDasharray="5 5" label="Threshold" />
                      <Line type="monotone" dataKey="risk" stroke="hsl(var(--destructive))" strokeWidth={2} name="Disease Risk" />
                      <Line type="monotone" dataKey="p05" stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" name="5th %ile" dot={false} />
                      <Line type="monotone" dataKey="p95" stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" name="95th %ile" dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">Select a region to view data</div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cholera" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center text-muted-foreground">
                <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Cholera surveillance data coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default DiseaseRisk;
