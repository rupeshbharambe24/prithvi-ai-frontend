import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Activity, 
  Cloud, 
  Heart, 
  Building2, 
  Wind, 
  AlertTriangle,
  Globe,
  BarChart3,
  Shield
} from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageToggle from "@/components/LanguageToggle";

const Landing = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const features = [
    { icon: Activity, title: "Heat Risk", description: "Real-time heat wave forecasting and vulnerability mapping" },
    { icon: Heart, title: "Disease Risk", description: "Climate-sensitive disease surveillance and prediction" },
    { icon: Building2, title: "Hospital Surge", description: "Healthcare capacity planning and resource optimization" },
    { icon: Wind, title: "Air Quality", description: "Pollution forecasting with health impact assessment" },
    { icon: BarChart3, title: "Scenario Planner", description: "Test intervention strategies before deployment" },
    { icon: AlertTriangle, title: "Smart Alerts", description: "Automated early warning system with multi-channel delivery" },
    { icon: Globe, title: "Knowledge Graph", description: "Evidence-based insights connecting climate and health" },
    { icon: Shield, title: "Fairness & QA", description: "Bias detection and model quality assurance" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">
              <span className="text-primary">PRITHVI</span>
              <span className="text-muted-foreground font-light">-AI</span>
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <ThemeToggle />
            <Button onClick={() => navigate("/auth/login")} variant="outline">
              {t('landing.cta.login')}
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
            {t('landing.hero.title')}<br />
            {t('landing.hero.subtitle')}
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            {t('landing.hero.description')}
          </p>
          <div className="flex gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={() => navigate("/auth/signup")}
              className="bg-primary hover:bg-primary/90"
            >
              {t('landing.cta.demo')}
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => navigate("/auth/login")}
            >
              {t('landing.cta.login')}
            </Button>
          </div>
        </motion.div>

        {/* Mini Map Preview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-16 max-w-5xl mx-auto"
        >
          <Card className="p-8 bg-card/50 backdrop-blur border-border/50">
            <div className="aspect-video bg-gradient-to-br from-primary/20 via-accent/20 to-destructive/20 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Globe className="h-16 w-16 text-primary mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">Live Climate-Health Risk Map</p>
                <p className="text-sm text-muted-foreground mt-2">Interactive visualization available in demo</p>
              </div>
            </div>
          </Card>
        </motion.div>
      </section>

      {/* How It Works */}
      <section className="bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h3 className="text-3xl font-bold mb-4">How It Works</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From data collection to actionable insights in three simple steps
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { step: "01", title: "Data Integration", desc: "Multi-source climate, health, and satellite data fusion" },
              { step: "02", title: "AI Forecasting", desc: "Advanced ML models predict risks 7 days ahead" },
              { step: "03", title: "Action", desc: "Automated alerts and decision support for rapid response" },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="p-6 h-full">
                  <div className="text-5xl font-bold text-primary/20 mb-4">{item.step}</div>
                  <h4 className="text-xl font-bold mb-2">{item.title}</h4>
                  <p className="text-muted-foreground">{item.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h3 className="text-3xl font-bold mb-4">Comprehensive Platform</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              All the tools you need for climate-informed health intelligence
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                viewport={{ once: true }}
              >
                <Card className="p-6 h-full hover:shadow-lg transition-shadow cursor-pointer">
                  <feature.icon className="h-10 w-10 text-primary mb-4" />
                  <h4 className="font-bold mb-2">{feature.title}</h4>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2025 PRITHVI-AI. Intelligence for the Planet. Insight for Humanity.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
