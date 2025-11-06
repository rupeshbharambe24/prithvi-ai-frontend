import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, AlertTriangle, Check, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const alerts = [
  {
    id: '1',
    type: 'heat',
    severity: 'high',
    title: 'Extreme Heat Warning',
    message: 'Temperature expected to reach 41°C in next 48 hours. High vulnerability in North District.',
    timestamp: '2 hours ago',
    acknowledged: false,
  },
  {
    id: '2',
    type: 'disease',
    severity: 'high',
    title: 'Dengue Outbreak Alert',
    message: 'R(t) = 1.5 in Central District. Active transmission ongoing with 45 new cases reported.',
    timestamp: '5 hours ago',
    acknowledged: false,
  },
  {
    id: '3',
    type: 'hospital',
    severity: 'medium',
    title: 'Hospital Capacity Warning',
    message: 'ED occupancy at 82%. Surge forecast suggests 150 admissions by Thursday.',
    timestamp: '8 hours ago',
    acknowledged: true,
  },
  {
    id: '4',
    type: 'air',
    severity: 'medium',
    title: 'Air Quality Alert',
    message: 'AQI forecast to reach 165 (Unhealthy). Combined heat-air risk elevated.',
    timestamp: '12 hours ago',
    acknowledged: true,
  },
  {
    id: '5',
    type: 'heat',
    severity: 'low',
    title: 'Heat Advisory',
    message: 'Above-normal temperatures expected. Monitor vulnerable populations.',
    timestamp: '1 day ago',
    acknowledged: true,
  },
];

const Alerts = () => {
  const { t } = useTranslation();

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'heat': return '🌡️';
      case 'disease': return '🦟';
      case 'hospital': return '🏥';
      case 'air': return '💨';
      default: return '⚠️';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">{t('nav.alerts')}</h1>
          <p className="text-muted-foreground">
            Climate-health early warning system
          </p>
        </div>
        <Button className="gap-2">
          <Bell className="h-4 w-4" />
          Create Alert Rule
        </Button>
      </div>

      {/* Alert Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Alerts</CardTitle>
            <Bell className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground mt-1">Last 24 hours</p>
          </CardContent>
        </Card>

        <Card className="bg-destructive/10 border-destructive/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">High Severity</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">2</div>
            <p className="text-xs text-muted-foreground mt-1">Requires immediate action</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Acknowledged</CardTitle>
            <Check className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground mt-1">60% response rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1.5h</div>
            <p className="text-xs text-muted-foreground mt-1">Target: {'<'} 2h</p>
          </CardContent>
        </Card>
      </div>

      {/* Active Alerts List */}
      <Card>
        <CardHeader>
          <CardTitle>Active Alerts</CardTitle>
          <CardDescription>
            All climate-health warnings and notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {alerts.map((alert) => (
              <div 
                key={alert.id} 
                className={`flex items-start gap-4 p-4 rounded-lg border ${
                  alert.acknowledged ? 'bg-muted/30 opacity-75' : 'bg-card'
                }`}
              >
                <div className="text-2xl">{getTypeIcon(alert.type)}</div>
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-medium">{alert.title}</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        {alert.message}
                      </p>
                    </div>
                    <Badge variant={getSeverityColor(alert.severity)}>
                      {alert.severity}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {alert.timestamp}
                    </span>
                    {!alert.acknowledged ? (
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                        <Button size="sm">
                          Acknowledge
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-xs text-accent">
                        <Check className="h-3 w-3" />
                        <span>Acknowledged</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Alert Rules */}
      <Card>
        <CardHeader>
          <CardTitle>Alert Rules</CardTitle>
          <CardDescription>
            Configured automatic alert triggers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[
              { condition: 'Temperature > 40°C', action: 'Send SMS to field officers', status: 'active' },
              { condition: 'Dengue R(t) > 1.2', action: 'Email to epidemiology team', status: 'active' },
              { condition: 'Hospital occupancy > 85%', action: 'Alert hospital admin', status: 'active' },
              { condition: 'AQI > 200', action: 'Public health advisory', status: 'inactive' },
            ].map((rule, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <p className="text-sm font-medium">{rule.condition}</p>
                  <p className="text-xs text-muted-foreground mt-1">{rule.action}</p>
                </div>
                <Badge variant={rule.status === 'active' ? 'default' : 'secondary'}>
                  {rule.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Alerts;
