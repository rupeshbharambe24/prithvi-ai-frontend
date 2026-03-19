import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Download, Clock, CheckCircle2, XCircle, AlertCircle, Loader2 } from "lucide-react";
import { useState } from "react";
import { useDatasets, useDatasetLineage } from "@/hooks/use-api";

const Catalog = () => {
  const { t } = useTranslation();
  const { data: datasets, isLoading } = useDatasets();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { data: lineage } = useDatasetLineage(selectedId);

  const datasetList = datasets ?? [];
  const selectedDataset = datasetList.find(d => d.id === selectedId);

  const handleRowClick = (ds: any) => {
    setSelectedId(ds.id);
    setDrawerOpen(true);
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
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">{t('nav.catalog')}</h1>
        <p className="text-muted-foreground">Data sources, metadata, and lineage tracking</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Total Datasets</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{datasetList.length}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Sources</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{new Set(datasetList.map(d => d.source)).size}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">License Types</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{new Set(datasetList.map(d => d.license)).size}</div></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Datasets</CardTitle>
          <CardDescription>Click a row to view lineage and ingestion history</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>License</TableHead>
                    <TableHead>Spatial</TableHead>
                    <TableHead>Temporal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {datasetList.map((dataset) => (
                    <TableRow key={dataset.id} className="cursor-pointer hover:bg-muted/50" onClick={() => handleRowClick(dataset)}>
                      <TableCell className="font-medium">{dataset.name}</TableCell>
                      <TableCell>{dataset.source}</TableCell>
                      <TableCell><Badge variant="outline">{dataset.license}</Badge></TableCell>
                      <TableCell className="text-sm text-muted-foreground">{dataset.spatial}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{dataset.temporal}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{selectedDataset?.name}</SheetTitle>
            <SheetDescription>Data lineage and ingestion history</SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-6">
            <div>
              <h4 className="text-sm font-medium mb-3">Metadata</h4>
              <div className="space-y-2 text-sm">
                {[
                  ['Source', selectedDataset?.source],
                  ['License', selectedDataset?.license],
                  ['Spatial', selectedDataset?.spatial],
                  ['Temporal', selectedDataset?.temporal],
                ].map(([label, value]) => (
                  <div key={String(label)} className="flex justify-between py-2 border-b">
                    <span className="text-muted-foreground">{String(label)}:</span>
                    <span className="font-medium">{String(value ?? '—')}</span>
                  </div>
                ))}
              </div>
            </div>

            {lineage && (
              <>
                <div>
                  <h4 className="text-sm font-medium mb-3">Versions</h4>
                  <div className="space-y-2">
                    {(lineage.versions as any[] ?? []).map((v: any) => (
                      <div key={v.id} className="p-3 rounded-lg border bg-muted/30">
                        <div className="flex items-center justify-between mb-2">
                          <Badge>{v.version}</Badge>
                          <span className="text-xs text-muted-foreground">{v.createdAt ? new Date(v.createdAt).toLocaleDateString() : ''}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Coverage: {v.coverageStart ?? '?'} to {v.coverageEnd ?? '?'}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-3">Ingestion Runs</h4>
                  <div className="space-y-2">
                    {(lineage.ingest_runs as any[] ?? []).map((run: any) => (
                      <div key={run.id} className="p-3 rounded-lg border bg-muted/30">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            {getStatusIcon(run.status)}
                            <span className="text-sm font-medium capitalize">{run.status}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">{run.startedAt ? new Date(run.startedAt).toLocaleString() : ''}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>Rows: {(run.rows ?? 0).toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </motion.div>
  );
};

export default Catalog;
