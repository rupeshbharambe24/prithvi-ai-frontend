import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Wind, AlertTriangle, TrendingUp } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const aqiData = [
  { hour: '00:00', aqi: 145, pm25: 65 },
  { hour: '03:00', aqi: 152, pm25: 70 },
  { hour: '06:00', aqi: 160, pm25: 75 },
  { hour: '09:00', aqi: 168, pm25: 80 },
  { hour: '12:00', aqi: 156, pm25: 72 },
  { hour: '15:00', aqi: 150, pm25: 68 },
  { hour: '18:00', aqi: 145, pm25: 65 },
  { hour: '21:00', aqi: 140, pm25: 62 },
];

const AirQuality = () => {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold mb-2">{t('nav.air')}</h1>
        <p className="text-muted-foreground">
          Air quality forecasting with health impact assessment
        </p>
      </div>

      {/* Health Advisory */}
      <Alert className="border-destructive/50 bg-destructive/10">
        <AlertTriangle className="h-4 w-4 text-destructive" />
        <AlertTitle className="text-destructive">Unhealthy for Sensitive Groups</AlertTitle>
        <AlertDescription>
          Current AQI: 156 (Moderate). Children, elderly, and those with respiratory conditions should limit prolonged outdoor activities.
        </AlertDescription>
      </Alert>

      {/* Current Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Air Quality Index</CardTitle>
            <Wind className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground mt-1">Moderate (101-150)</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">PM2.5 Concentration</CardTitle>
            <TrendingUp className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78.5 µg/m³</div>
            <p className="text-xs text-muted-foreground mt-1">Above WHO guidelines</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">72h Peak Forecast</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">165</div>
            <p className="text-xs text-muted-foreground mt-1">Tomorrow 9am</p>
          </CardContent>
        </Card>
      </div>

      {/* AQI Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle>24-Hour AQI Trend & Forecast</CardTitle>
          <CardDescription>
            Real-time air quality index with health category thresholds
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={aqiData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="hour" />
                <YAxis domain={[0, 200]} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))' 
                  }}
                />
                <ReferenceLine y={50} stroke="hsl(var(--secondary))" strokeDasharray="3 3" label="Good" />
                <ReferenceLine y={100} stroke="hsl(var(--accent))" strokeDasharray="3 3" label="Moderate" />
                <ReferenceLine y={150} stroke="hsl(var(--destructive))" strokeDasharray="3 3" label="Unhealthy" />
                <Line 
                  type="monotone" 
                  dataKey="aqi" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--primary))' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Health Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Health Recommendations by Group</CardTitle>
          <CardDescription>
            Population-specific guidance based on current AQI levels
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-muted/30">
              <h4 className="font-medium mb-2">General Population</h4>
              <p className="text-sm text-muted-foreground">
                Air quality is acceptable. Unusually sensitive people should consider limiting prolonged outdoor exertion.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/30">
              <h4 className="font-medium mb-2 text-destructive">Sensitive Groups</h4>
              <p className="text-sm text-muted-foreground">
                Children, elderly, pregnant women, and individuals with heart or lung disease should reduce prolonged or heavy outdoor exertion.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-muted/30">
              <h4 className="font-medium mb-2">Outdoor Workers</h4>
              <p className="text-sm text-muted-foreground">
                Take frequent breaks, stay hydrated, and consider rescheduling strenuous activities to early morning or evening hours.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Co-Risk Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Heat × Air Quality Co-Risk</CardTitle>
          <CardDescription>
            Combined health impact assessment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 p-4 rounded-lg bg-destructive/10 border border-destructive/30">
            <AlertTriangle className="h-8 w-8 text-destructive flex-shrink-0" />
            <div>
              <p className="font-medium text-destructive">Elevated Combined Risk</p>
              <p className="text-sm text-muted-foreground mt-1">
                High temperature (38°C) + Poor air quality (AQI 156) significantly increases respiratory and cardiovascular strain.
                Hospital admissions may increase by 30-40% over next 48 hours.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AirQuality;
