import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Activity, Wind, TrendingUp } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const mockData = [
  { day: 'Mon', risk: 0.4, alerts: 2 },
  { day: 'Tue', risk: 0.6, alerts: 4 },
  { day: 'Wed', risk: 0.8, alerts: 7 },
  { day: 'Thu', risk: 0.9, alerts: 8 },
  { day: 'Fri', risk: 0.7, alerts: 5 },
  { day: 'Sat', risk: 0.5, alerts: 3 },
  { day: 'Sun', risk: 0.4, alerts: 2 },
];

const Overview = () => {
  const { t } = useTranslation();

  const kpiCards = [
    {
      title: "Active Alerts",
      value: "8",
      change: "+3",
      icon: AlertTriangle,
      trend: "up",
      color: "text-destructive"
    },
    {
      title: "3-Day ED Forecast",
      value: "145",
      change: "+22%",
      icon: Activity,
      trend: "up",
      color: "text-primary"
    },
    {
      title: "AQI (24h avg)",
      value: "156",
      change: "Moderate",
      icon: Wind,
      trend: "stable",
      color: "text-accent"
    },
    {
      title: "Composite Risk",
      value: "0.78",
      change: "High",
      icon: TrendingUp,
      trend: "up",
      color: "text-destructive"
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold mb-2">{t('nav.overview')}</h1>
        <p className="text-muted-foreground">
          Real-time climate-health intelligence dashboard
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((kpi, index) => (
          <motion.div
            key={kpi.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  {kpi.title}
                </CardTitle>
                <kpi.icon className={`h-4 w-4 ${kpi.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpi.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {kpi.change} from baseline
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Composite Risk Chart */}
      <Card>
        <CardHeader>
          <CardTitle>7-Day Risk Forecast</CardTitle>
          <CardDescription>
            Composite climate-health risk score (0-1 scale)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="day" className="text-xs" />
                <YAxis domain={[0, 1]} className="text-xs" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))' 
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="risk" 
                  stroke="hsl(var(--primary))" 
                  fill="hsl(var(--primary))" 
                  fillOpacity={0.2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Recent Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Alerts</CardTitle>
          <CardDescription>
            Latest climate-health warnings and notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { severity: 'high', message: 'Extreme heat warning for next 48 hours', time: '2 hours ago' },
              { severity: 'medium', message: 'Dengue cases increasing in Central District', time: '5 hours ago' },
              { severity: 'low', message: 'Hospital capacity at 82% - monitor closely', time: '8 hours ago' },
            ].map((alert, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                <AlertTriangle className={`h-5 w-5 mt-0.5 ${
                  alert.severity === 'high' ? 'text-destructive' :
                  alert.severity === 'medium' ? 'text-accent' : 'text-muted-foreground'
                }`} />
                <div className="flex-1">
                  <p className="text-sm font-medium">{alert.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">{alert.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Overview;
