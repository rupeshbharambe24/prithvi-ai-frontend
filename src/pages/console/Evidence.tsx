import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ExternalLink, Search, Loader2 } from "lucide-react";
import { useState } from "react";
import { useEvidenceList } from "@/hooks/use-api";

const Evidence = () => {
  const { t } = useTranslation();
  const { data, isLoading } = useEvidenceList();
  const [searchQuery, setSearchQuery] = useState("");
  const [strengthFilter, setStrengthFilter] = useState<string>("all");
  const [qualityFilter, setQualityFilter] = useState<string>("all");

  const allEvidence = data?.items ?? [];

  const filteredEvidence = allEvidence.filter(item => {
    const matchesSearch = searchQuery === "" ||
      (item.title ?? '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.tags ?? []).some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const strengthStr = typeof item.strength === 'number'
      ? (item.strength >= 0.8 ? 'high' : item.strength >= 0.5 ? 'moderate' : 'low')
      : 'unknown';
    const matchesStrength = strengthFilter === "all" || strengthStr === strengthFilter;
    const matchesQuality = qualityFilter === "all" || item.quality === qualityFilter;

    return matchesSearch && matchesStrength && matchesQuality;
  });

  const getStrengthLabel = (s: number | null) => {
    if (s === null) return 'unknown';
    return s >= 0.8 ? 'high' : s >= 0.5 ? 'moderate' : 'low';
  };

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'high': return 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20';
      case 'moderate': return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20';
      case 'low': return 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">{t('nav.evidence')}</h1>
        <p className="text-muted-foreground">Scientific evidence base for climate-health relationships</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <Input placeholder="Search evidence..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full" />
            </div>
            <Select value={strengthFilter} onValueChange={setStrengthFilter}>
              <SelectTrigger><SelectValue placeholder="Evidence Strength" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Strengths</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="moderate">Moderate</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Select value={qualityFilter} onValueChange={setQualityFilter}>
              <SelectTrigger><SelectValue placeholder="Study Quality" /></SelectTrigger>
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

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredEvidence.length} of {allEvidence.length} evidence items
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredEvidence.map((item, index) => (
            <motion.div key={item.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <CardTitle className="text-base leading-tight">{item.title}</CardTitle>
                    {(item.doi || item.url) && (
                      <a href={item.doi ? `https://doi.org/${item.doi}` : item.url!} target="_blank" rel="noopener noreferrer" className="shrink-0">
                        <ExternalLink className="h-4 w-4 text-muted-foreground hover:text-primary" />
                      </a>
                    )}
                  </div>
                  <CardDescription>Published {item.year ?? 'N/A'}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.summaryMd}</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className={getStrengthColor(getStrengthLabel(item.strength))}>
                      {getStrengthLabel(item.strength)} strength
                    </Badge>
                    <Badge variant="outline" className={getStrengthColor(item.quality ?? 'unknown')}>
                      {item.quality ?? 'unknown'} quality
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {(item.tags ?? []).map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {!isLoading && filteredEvidence.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Evidence Found</h3>
            <p className="text-sm text-muted-foreground text-center max-w-sm">Try adjusting your filters or search query</p>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
};

export default Evidence;
