import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ExternalLink, Search, Filter } from "lucide-react";
import { useState } from "react";

const mockEvidence = [
  {
    id: 'ev1',
    title: 'Climate change and heat-related mortality: A systematic review',
    year: 2021,
    strength: 'high',
    quality: 'high',
    summaryMd: 'Comprehensive review of 87 studies showing strong correlation between extreme heat events and increased mortality rates, particularly among elderly populations.',
    doi: '10.1016/j.envres.2021.110923',
    tags: ['Heat', 'Mortality', 'Systematic Review']
  },
  {
    id: 'ev2',
    title: 'Vector-borne disease transmission under climate change scenarios',
    year: 2022,
    strength: 'high',
    quality: 'moderate',
    summaryMd: 'Modeling study predicting 30-50% increase in dengue transmission in tropical regions under RCP 4.5 scenario by 2050.',
    doi: '10.1038/s41558-022-01234-x',
    tags: ['Dengue', 'Climate Models', 'Vectors']
  },
  {
    id: 'ev3',
    title: 'Air quality and respiratory hospitalizations',
    year: 2023,
    strength: 'moderate',
    quality: 'high',
    summaryMd: 'Time-series analysis showing 15% increase in respiratory ED visits during high PM2.5 episodes in urban centers.',
    doi: '10.1289/EHP8765',
    tags: ['Air Quality', 'Respiratory', 'Urban Health']
  },
  {
    id: 'ev4',
    title: 'Cooling center effectiveness in heat wave mitigation',
    year: 2020,
    strength: 'moderate',
    quality: 'moderate',
    summaryMd: 'Observational study from Phoenix showing cooling centers associated with 22% reduction in heat-related illness during extreme events.',
    url: 'https://www.example.com/study',
    tags: ['Heat', 'Intervention', 'Public Health']
  },
  {
    id: 'ev5',
    title: 'Cholera outbreaks and rainfall patterns in South Asia',
    year: 2022,
    strength: 'high',
    quality: 'high',
    summaryMd: 'Multi-country analysis demonstrating strong association between monsoon intensity and cholera case surges with 2-4 week lag.',
    doi: '10.1371/journal.pmed.1003890',
    tags: ['Cholera', 'Rainfall', 'Epidemiology']
  },
  {
    id: 'ev6',
    title: 'Hospital surge capacity during climate disasters',
    year: 2021,
    strength: 'moderate',
    quality: 'moderate',
    summaryMd: 'Case studies from Hurricane events showing critical need for 40-60% surge capacity planning for climate-related emergencies.',
    doi: '10.1097/PHH.0000000000001234',
    tags: ['Hospital Surge', 'Disaster', 'Capacity']
  },
];

const Evidence = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [strengthFilter, setStrengthFilter] = useState<string>("all");
  const [qualityFilter, setQualityFilter] = useState<string>("all");

  const filteredEvidence = mockEvidence.filter(item => {
    const matchesSearch = searchQuery === "" || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStrength = strengthFilter === "all" || item.strength === strengthFilter;
    const matchesQuality = qualityFilter === "all" || item.quality === qualityFilter;

    return matchesSearch && matchesStrength && matchesQuality;
  });

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'high': return 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20';
      case 'moderate': return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20';
      case 'low': return 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold mb-2">{t('nav.evidence')}</h1>
        <p className="text-muted-foreground">
          Scientific evidence base for climate-health relationships
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <Input
                placeholder="Search evidence..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={strengthFilter} onValueChange={setStrengthFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Evidence Strength" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Strengths</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="moderate">Moderate</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Select value={qualityFilter} onValueChange={setQualityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Study Quality" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Quality</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="moderate">Moderate</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredEvidence.length} of {mockEvidence.length} evidence items
        </p>
      </div>

      {/* Evidence Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredEvidence.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="h-full hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <CardTitle className="text-base leading-tight">{item.title}</CardTitle>
                  {(item.doi || item.url) && (
                    <a 
                      href={item.doi ? `https://doi.org/${item.doi}` : item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0"
                    >
                      <ExternalLink className="h-4 w-4 text-muted-foreground hover:text-primary" />
                    </a>
                  )}
                </div>
                <CardDescription>Published {item.year}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.summaryMd}
                </p>

                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className={getStrengthColor(item.strength)}>
                    {item.strength} strength
                  </Badge>
                  <Badge variant="outline" className={getStrengthColor(item.quality)}>
                    {item.quality} quality
                  </Badge>
                </div>

                <div className="flex flex-wrap gap-1">
                  {item.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {filteredEvidence.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Evidence Found</h3>
            <p className="text-sm text-muted-foreground text-center max-w-sm">
              Try adjusting your filters or search query
            </p>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
};

export default Evidence;
