import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Thermometer, Droplets, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Area, AreaChart } from 'recharts';

const forecastData = [
  { day: 'Mon', temp: 35, humidity: 65, risk: 0.5, p05: 33, p95: 37 },
  { day: 'Tue', temp: 38, humidity: 70, risk: 0.7, p05: 36, p95: 40 },
  { day: 'Wed', temp: 41, humidity: 68, risk: 0.9, p05: 39, p95: 43 },
  { day: 'Thu', temp: 40, humidity: 72, risk: 0.85, p05: 38, p95: 42 },
  { day: 'Fri', temp: 38, humidity: 70, risk: 0.7, p05: 36, p95: 40 },
  { day: 'Sat', temp: 36, humidity: 65, risk: 0.6, p05: 34, p95: 38 },
  { day: 'Sun', temp: 34, humidity: 60, risk: 0.4, p05: 32, p95: 36 },
];

const riskZones = [
  { name: 'North District', risk: 0.85, population: '50,000', vulnerable: '12,000' },
  { name: 'Central District', risk: 0.72, population: '120,000', vulnerable: '28,000' },
  { name: 'South District', risk: 0.63, population: '80,000', vulnerable: '18,000' },
  { name: 'East District', risk: 0.58, population: '65,000', vulnerable: '14,000' },
];

const HeatRisk = () => {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">{t('nav.heat')}</h1>
          <p className="text-muted-foreground">
            Heat wave forecasting and vulnerability assessment
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export Data
        </Button>
      </div>

      {/* Current Conditions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Temperature</CardTitle>
            <Thermometer className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">38.5°C</div>
            <p className="text-xs text-muted-foreground mt-1">+3.2°C above normal</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Humidity</CardTitle>
            <Droplets className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68%</div>
            <p className="text-xs text-muted-foreground mt-1">Moderate discomfort</p>
          </CardContent>
        </Card>

        <Card className="bg-destructive/10 border-destructive/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Risk Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">HIGH</div>
            <p className="text-xs text-muted-foreground mt-1">Heat advisory in effect</p>
          </CardContent>
        </Card>
      </div>

      {/* Temperature Forecast */}
      <Card>
        <CardHeader>
          <CardTitle>7-Day Temperature Forecast</CardTitle>
          <CardDescription>
            With 5th and 95th percentile confidence bands
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={forecastData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="day" />
                <YAxis domain={[30, 45]} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))' 
                  }}
                />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="p95" 
                  stroke="none" 
                  fill="hsl(var(--destructive))" 
                  fillOpacity={0.1}
                />
                <Area 
                  type="monotone" 
                  dataKey="p05" 
                  stroke="none" 
                  fill="hsl(var(--background))" 
                  fillOpacity={1}
                />
                <Line 
                  type="monotone" 
                  dataKey="temp" 
                  stroke="hsl(var(--destructive))" 
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--destructive))' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Risk Zones Table */}
      <Card>
        <CardHeader>
          <CardTitle>High-Risk Zones</CardTitle>
          <CardDescription>
            Districts with elevated heat vulnerability
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b">
                <tr className="text-left text-sm text-muted-foreground">
                  <th className="pb-2">District</th>
                  <th className="pb-2">Risk Score</th>
                  <th className="pb-2">Population</th>
                  <th className="pb-2">Vulnerable</th>
                  <th className="pb-2">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {riskZones.map((zone, i) => (
                  <tr key={i} className="border-b last:border-0">
                    <td className="py-3 font-medium">{zone.name}</td>
                    <td className="py-3">
                      <span className={`font-semibold ${
                        zone.risk >= 0.8 ? 'text-destructive' :
                        zone.risk >= 0.6 ? 'text-accent' : 'text-muted-foreground'
                      }`}>
                        {(zone.risk * 100).toFixed(0)}%
                      </span>
                    </td>
                    <td className="py-3 text-muted-foreground">{zone.population}</td>
                    <td className="py-3 text-muted-foreground">{zone.vulnerable}</td>
                    <td className="py-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        zone.risk >= 0.8 ? 'bg-destructive/20 text-destructive' :
                        zone.risk >= 0.6 ? 'bg-accent/20 text-accent' : 'bg-muted text-muted-foreground'
                      }`}>
                        {zone.risk >= 0.8 ? 'Critical' : zone.risk >= 0.6 ? 'Warning' : 'Watch'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default HeatRisk;
