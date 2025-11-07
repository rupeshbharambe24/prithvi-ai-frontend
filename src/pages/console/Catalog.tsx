import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Download, FileText, Clock, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { useState } from "react";

const mockDatasets = [
  {
    id: 'ds1',
    name: 'ERA5 Temperature & Humidity',
    source: 'ECMWF Copernicus',
    license: 'CC-BY-4.0',
    spatial: 'Global 0.25°',
    temporal: '1979-Present',
    freshness: 'Daily',
    freshnessStatus: 'current'
  },
  {
    id: 'ds2',
    name: 'Sentinel-5P Air Quality',
    source: 'ESA',
    license: 'Open',
    spatial: 'Global 7km',
    temporal: '2018-Present',
    freshness: '6 hours',
    freshnessStatus: 'current'
  },
  {
    id: 'ds3',
    name: 'National ED Admissions',
    source: 'Ministry of Health',
    license: 'Restricted',
    spatial: 'National',
    temporal: '2015-Present',
    freshness: 'Weekly',
    freshnessStatus: 'delayed'
  },
  {
    id: 'ds4',
    name: 'Disease Surveillance (Dengue)',
    source: 'NVBDCP',
    license: 'Government Use',
    spatial: 'State-level',
    temporal: '2010-Present',
    freshness: 'Weekly',
    freshnessStatus: 'current'
  },
  {
    id: 'ds5',
    name: 'Population Demographics',
    source: 'Census Bureau',
    license: 'Public Domain',
    spatial: 'District-level',
    temporal: '2011, 2021',
    freshness: 'Decennial',
    freshnessStatus: 'static'
  },
];

const mockLineage = {
  versions: [
    { id: 'v3', version: '3.0.0', coverageStart: '1979-01-01', coverageEnd: '2024-01-31', createdAt: '2024-02-01' },
    { id: 'v2', version: '2.1.0', coverageStart: '1979-01-01', coverageEnd: '2023-12-31', createdAt: '2024-01-01' },
    { id: 'v1', version: '2.0.0', coverageStart: '1979-01-01', coverageEnd: '2023-11-30', createdAt: '2023-12-01' },
  ],
  ingestRuns: [
    { id: 'run1', startedAt: '2024-01-31T23:00:00Z', endedAt: '2024-02-01T01:23:00Z', status: 'success', rows: 8760 },
    { id: 'run2', startedAt: '2024-01-30T23:00:00Z', endedAt: '2024-01-31T01:18:00Z', status: 'success', rows: 8736 },
    { id: 'run3', startedAt: '2024-01-29T23:00:00Z', endedAt: '2024-01-30T01:45:00Z', status: 'partial', rows: 7320 },
  ]
};

const Catalog = () => {
  const { t } = useTranslation();
  const [selectedDataset, setSelectedDataset] = useState<any>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleRowClick = (dataset: any) => {
    setSelectedDataset(dataset);
    setDrawerOpen(true);
  };

  const getFreshnessColor = (status: string) => {
    switch (status) {
      case 'current': return 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20';
      case 'delayed': return 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20';
      case 'stale': return 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />;
      case 'partial': return <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />;
      case 'failed': return <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />;
      default: return <Clock className="h-4 w-4 text-muted-foreground" />;
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
        <h1 className="text-3xl font-bold mb-2">{t('nav.catalog')}</h1>
        <p className="text-muted-foreground">
          Data sources, metadata, and lineage tracking
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Datasets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockDatasets.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Current</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {mockDatasets.filter(d => d.freshnessStatus === 'current').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Delayed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
              {mockDatasets.filter(d => d.freshnessStatus === 'delayed').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Static</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockDatasets.filter(d => d.freshnessStatus === 'static').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Datasets Table */}
      <Card>
        <CardHeader>
          <CardTitle>Datasets</CardTitle>
          <CardDescription>
            Click a row to view lineage and ingestion history
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead>License</TableHead>
                  <TableHead>Spatial</TableHead>
                  <TableHead>Temporal</TableHead>
                  <TableHead>Freshness</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockDatasets.map((dataset) => (
                  <TableRow 
                    key={dataset.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleRowClick(dataset)}
                  >
                    <TableCell className="font-medium">{dataset.name}</TableCell>
                    <TableCell>{dataset.source}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{dataset.license}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{dataset.spatial}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{dataset.temporal}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getFreshnessColor(dataset.freshnessStatus)}>
                        {dataset.freshness}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Lineage Drawer */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{selectedDataset?.name}</SheetTitle>
            <SheetDescription>
              Data lineage and ingestion history
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-6">
            {/* Metadata */}
            <div>
              <h4 className="text-sm font-medium mb-3">Metadata</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Source:</span>
                  <span className="font-medium">{selectedDataset?.source}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">License:</span>
                  <Badge variant="outline">{selectedDataset?.license}</Badge>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Spatial Coverage:</span>
                  <span className="font-medium">{selectedDataset?.spatial}</span>
                </div>
                <div className="flex justify-between py-2 border-b">
                  <span className="text-muted-foreground">Temporal Coverage:</span>
                  <span className="font-medium">{selectedDataset?.temporal}</span>
                </div>
              </div>
            </div>

            {/* Versions */}
            <div>
              <h4 className="text-sm font-medium mb-3">Versions</h4>
              <div className="space-y-2">
                {mockLineage.versions.map((version) => (
                  <div key={version.id} className="p-3 rounded-lg border bg-muted/30">
                    <div className="flex items-center justify-between mb-2">
                      <Badge>{version.version}</Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(version.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Coverage: {version.coverageStart} to {version.coverageEnd}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Ingestion Runs */}
            <div>
              <h4 className="text-sm font-medium mb-3">Recent Ingestion Runs</h4>
              <div className="space-y-2">
                {mockLineage.ingestRuns.map((run) => (
                  <div key={run.id} className="p-3 rounded-lg border bg-muted/30">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(run.status)}
                        <span className="text-sm font-medium capitalize">{run.status}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(run.startedAt).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Duration: {Math.round((new Date(run.endedAt).getTime() - new Date(run.startedAt).getTime()) / 60000)}m</span>
                      <span>Rows: {run.rows.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t">
              <Button disabled className="w-full" variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download Dataset (Coming Soon)
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </motion.div>
  );
};

export default Catalog;
