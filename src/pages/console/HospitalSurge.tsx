import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Bed, Users } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Line, ComposedChart } from 'recharts';
import { Badge } from "@/components/ui/badge";

const admissionData = [
  { day: 'Mon', actual: 100, forecast: 102, baseline: 95 },
  { day: 'Tue', actual: 110, forecast: 115, baseline: 95 },
  { day: 'Wed', actual: null, forecast: 135, baseline: 95 },
  { day: 'Thu', actual: null, forecast: 150, baseline: 95 },
  { day: 'Fri', actual: null, forecast: 145, baseline: 95 },
  { day: 'Sat', actual: null, forecast: 130, baseline: 95 },
  { day: 'Sun', actual: null, forecast: 118, baseline: 95 },
];

const HospitalSurge = () => {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold mb-2">{t('nav.hospital')}</h1>
        <p className="text-muted-foreground">
          Healthcare capacity planning and surge forecasting
        </p>
      </div>

      {/* Current Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">ED Admissions Today</CardTitle>
            <Activity className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">110</div>
            <p className="text-xs text-muted-foreground mt-1">+16% vs baseline</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Bed Occupancy</CardTitle>
            <Bed className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">82%</div>
            <p className="text-xs text-muted-foreground mt-1">320 / 390 beds</p>
          </CardContent>
        </Card>

        <Card className="bg-destructive/10 border-destructive/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">3-Day Peak Forecast</CardTitle>
            <Users className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">150</div>
            <p className="text-xs text-muted-foreground mt-1">+58% surge expected</p>
          </CardContent>
        </Card>
      </div>

      {/* Admissions Forecast */}
      <Card>
        <CardHeader>
          <CardTitle>7-Day ED Admissions Forecast</CardTitle>
          <CardDescription>
            Predicted emergency department admissions based on climate and disease models
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={admissionData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="day" />
                <YAxis domain={[80, 160]} />
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
                <Bar 
                  dataKey="actual" 
                  fill="hsl(var(--primary))" 
                  name="Actual"
                  opacity={0.8}
                />
                <Bar 
                  dataKey="forecast" 
                  fill="hsl(var(--destructive))" 
                  name="Forecast"
                  opacity={0.6}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Staffing Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle>Resource Optimization Suggestions</CardTitle>
          <CardDescription>
            AI-powered recommendations to meet surge demand
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { priority: 'high', action: 'Add 10 paramedics for Thu-Fri surge', impact: 'Reduces wait time by 25%' },
              { priority: 'high', action: 'Activate overflow ward (30 beds)', impact: 'Prevents capacity breach' },
              { priority: 'medium', action: 'Extend ED physician shifts by 2 hours', impact: 'Improves throughput by 15%' },
              { priority: 'low', action: 'Pre-position cooling supplies', impact: 'Heat-related care optimization' },
            ].map((suggestion, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg border">
                <Badge variant={suggestion.priority === 'high' ? 'destructive' : suggestion.priority === 'medium' ? 'default' : 'secondary'}>
                  {suggestion.priority}
                </Badge>
                <div className="flex-1">
                  <p className="text-sm font-medium">{suggestion.action}</p>
                  <p className="text-xs text-muted-foreground mt-1">{suggestion.impact}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default HospitalSurge;
