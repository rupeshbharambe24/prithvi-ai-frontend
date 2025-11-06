import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, TrendingUp, MapPin } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const rtData = [
  { week: 'W1', dengue: 0.9, cholera: 0.6 },
  { week: 'W2', dengue: 1.1, cholera: 0.7 },
  { week: 'W3', dengue: 1.3, cholera: 0.8 },
  { week: 'W4', dengue: 1.5, cholera: 1.2 },
];

const clusters = [
  { location: 'Central Ward A', cases: 45, trend: 'up', lat: 19.0760, lng: 72.8777 },
  { location: 'North District B', cases: 32, trend: 'up', lat: 19.1197, lng: 72.8464 },
  { location: 'East Zone C', cases: 23, trend: 'stable', lat: 19.0176, lng: 72.8562 },
  { location: 'South Area D', cases: 18, trend: 'down', lat: 18.9388, lng: 72.8354 },
];

const DiseaseRisk = () => {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold mb-2">{t('nav.disease')}</h1>
        <p className="text-muted-foreground">
          Climate-sensitive disease surveillance and forecasting
        </p>
      </div>

      <Tabs defaultValue="dengue" className="space-y-4">
        <TabsList>
          <TabsTrigger value="dengue">Dengue</TabsTrigger>
          <TabsTrigger value="cholera">Cholera</TabsTrigger>
        </TabsList>

        <TabsContent value="dengue" className="space-y-4">
          {/* Dengue KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">R(t) - Transmission Rate</CardTitle>
                <Activity className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1.5</div>
                <p className="text-xs text-destructive mt-1">Growing epidemic</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Suitability Score</CardTitle>
                <TrendingUp className="h-4 w-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0.72</div>
                <p className="text-xs text-muted-foreground mt-1">High transmission potential</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Active Clusters</CardTitle>
                <MapPin className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4</div>
                <p className="text-xs text-muted-foreground mt-1">Requires intervention</p>
              </CardContent>
            </Card>
          </div>

          {/* R(t) Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Reproduction Number (R_t) Trend</CardTitle>
              <CardDescription>
                R(t) {'>'}  1 indicates growing epidemic
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={rtData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="week" />
                    <YAxis domain={[0, 2]} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))' 
                      }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="dengue" 
                      stroke="hsl(var(--destructive))" 
                      strokeWidth={2}
                      name="Dengue R(t)"
                    />
                    <Line 
                      type="monotone" 
                      dataKey={1} 
                      stroke="hsl(var(--muted-foreground))" 
                      strokeDasharray="5 5"
                      name="Threshold"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Clusters Table */}
          <Card>
            <CardHeader>
              <CardTitle>Active Disease Clusters</CardTitle>
              <CardDescription>
                Geographic hotspots requiring attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b">
                    <tr className="text-left text-sm text-muted-foreground">
                      <th className="pb-2">Location</th>
                      <th className="pb-2">Cases</th>
                      <th className="pb-2">Trend</th>
                      <th className="pb-2">Coordinates</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm">
                    {clusters.map((cluster, i) => (
                      <tr key={i} className="border-b last:border-0">
                        <td className="py-3 font-medium">{cluster.location}</td>
                        <td className="py-3 font-semibold">{cluster.cases}</td>
                        <td className="py-3">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            cluster.trend === 'up' ? 'bg-destructive/20 text-destructive' :
                            cluster.trend === 'stable' ? 'bg-accent/20 text-accent' : 'bg-muted text-muted-foreground'
                          }`}>
                            {cluster.trend === 'up' ? '↑ Rising' : cluster.trend === 'stable' ? '→ Stable' : '↓ Declining'}
                          </span>
                        </td>
                        <td className="py-3 text-muted-foreground text-xs">
                          {cluster.lat.toFixed(4)}, {cluster.lng.toFixed(4)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
