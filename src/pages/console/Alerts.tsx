import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, AlertTriangle, Check, Clock, Loader2, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAlerts, useAlertRules, useAckAlert, useRunAlertEvaluation, useCreateAlertRule } from "@/hooks/use-api";
import { useToast } from "@/hooks/use-toast";

const Alerts = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { data: alerts, isLoading } = useAlerts();
  const { data: rules } = useAlertRules();
  const ackMutation = useAckAlert();
  const evalMutation = useRunAlertEvaluation();
  const createRuleMutation = useCreateAlertRule();

  const [ruleForm, setRuleForm] = useState({ name: '', metric: 'heat', condition: '>=', threshold: '0.7', severity: 'warn' });
  const [dialogOpen, setDialogOpen] = useState(false);

  const alertList = alerts ?? [];
  const ruleList = rules ?? [];

  const openAlerts = alertList.filter(a => a.status === 'open');
  const criticalAlerts = alertList.filter(a => a.severity === 'critical');
  const ackedAlerts = alertList.filter(a => a.status === 'ack');

  const getSeverityVariant = (s: string) => s === 'critical' ? 'destructive' as const : s === 'warn' ? 'default' as const : 'secondary' as const;

  const getMetricIcon = (metric: string) => {
    const m = (typeof metric === 'string' ? metric : '').toLowerCase();
    if (m.includes('heat')) return '🌡️';
    if (m.includes('disease') || m.includes('dengue')) return '🦟';
    if (m.includes('surge') || m.includes('hospital')) return '🏥';
    if (m.includes('pm25') || m.includes('air')) return '💨';
    return '⚠️';
  };

  const handleCreateRule = async () => {
    try {
      await createRuleMutation.mutateAsync({
        name: ruleForm.name,
        metric: ruleForm.metric,
        condition: ruleForm.condition,
        threshold: parseFloat(ruleForm.threshold),
        severity: ruleForm.severity,
        horizonDays: 3,
        channels: ['email'],
        cooldownMinutes: 120,
      });
      toast({ title: "Rule Created", description: `Alert rule "${ruleForm.name}" created successfully.` });
      setDialogOpen(false);
      setRuleForm({ name: '', metric: 'heat', condition: '>=', threshold: '0.7', severity: 'warn' });
    } catch {
      toast({ title: "Error", description: "Failed to create rule", variant: "destructive" });
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">{t('nav.alerts')}</h1>
          <p className="text-muted-foreground">Climate-health early warning system</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => evalMutation.mutate()} disabled={evalMutation.isPending}>
            <Play className="h-4 w-4 mr-2" />{evalMutation.isPending ? 'Evaluating...' : 'Evaluate Rules'}
          </Button>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2"><Bell className="h-4 w-4" />Create Rule</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Create Alert Rule</DialogTitle></DialogHeader>
              <div className="space-y-4">
                <div><Label>Name</Label><Input value={ruleForm.name} onChange={e => setRuleForm(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Heat Warning" /></div>
                <div><Label>Metric</Label>
                  <Select value={ruleForm.metric} onValueChange={v => setRuleForm(p => ({ ...p, metric: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="heat">Heat</SelectItem>
                      <SelectItem value="disease">Disease</SelectItem>
                      <SelectItem value="surge">Hospital Surge</SelectItem>
                      <SelectItem value="pm25">PM2.5</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Condition</Label>
                    <Select value={ruleForm.condition} onValueChange={v => setRuleForm(p => ({ ...p, condition: v }))}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value=">=">≥</SelectItem>
                        <SelectItem value=">">{'>'}</SelectItem>
                        <SelectItem value="<=">≤</SelectItem>
                        <SelectItem value="<">{'<'}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div><Label>Threshold</Label><Input type="number" step="0.1" value={ruleForm.threshold} onChange={e => setRuleForm(p => ({ ...p, threshold: e.target.value }))} /></div>
                </div>
                <div><Label>Severity</Label>
                  <Select value={ruleForm.severity} onValueChange={v => setRuleForm(p => ({ ...p, severity: v }))}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="warn">Warning</SelectItem>
                      <SelectItem value="info">Info</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleCreateRule} disabled={!ruleForm.name || createRuleMutation.isPending} className="w-full">
                  {createRuleMutation.isPending ? 'Creating...' : 'Create Rule'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Alerts</CardTitle>
            <Bell className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{alertList.length}</div>
          </CardContent>
        </Card>
        <Card className={criticalAlerts.length > 0 ? "bg-destructive/10 border-destructive/30" : ""}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Critical</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{criticalAlerts.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Acknowledged</CardTitle>
            <Check className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{ackedAlerts.length}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Open</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{openAlerts.length}</div></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Alerts</CardTitle>
          <CardDescription>All climate-health warnings</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
          ) : alertList.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">No alerts triggered yet. Click "Evaluate Rules" to check.</p>
          ) : (
            <div className="space-y-3">
              {alertList.map((alert) => (
                <div key={alert.id} className={`flex items-start gap-4 p-4 rounded-lg border ${alert.status === 'ack' ? 'bg-muted/30 opacity-75' : 'bg-card'}`}>
                  <div className="text-2xl">{getMetricIcon(alert.payload?.metric as string ?? '')}</div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-medium">{String(alert.payload?.metric ?? 'Alert')} Alert</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          Value: {typeof alert.payload?.value === 'number' ? Number(alert.payload.value).toFixed(2) : String(alert.payload?.value ?? '')} (threshold: {String(alert.payload?.threshold ?? '')})
                        </p>
                      </div>
                      <Badge variant={getSeverityVariant(alert.severity)}>{alert.severity}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{new Date(alert.startedAt).toLocaleString()}</span>
                      {alert.status === 'open' ? (
                        <Button size="sm" onClick={() => ackMutation.mutate(alert.id)} disabled={ackMutation.isPending}>Acknowledge</Button>
                      ) : (
                        <div className="flex items-center gap-1 text-xs text-accent">
                          <Check className="h-3 w-3" /><span>Acknowledged</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Alert Rules</CardTitle>
          <CardDescription>Configured automatic alert triggers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {ruleList.map((rule) => (
              <div key={rule.id} className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <p className="text-sm font-medium">{rule.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">{rule.metric} {rule.condition} {rule.threshold} | Horizon: {rule.horizonDays}d</p>
                </div>
                <Badge variant={getSeverityVariant(rule.severity)}>{rule.severity}</Badge>
              </div>
            ))}
            {ruleList.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No rules configured</p>}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default Alerts;
