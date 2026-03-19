import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Search, Loader2, ExternalLink } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import cytoscape from "cytoscape";
import { useKgGraph, useKgSearch } from "@/hooks/use-api";

const typeColors: Record<string, string> = {
  Driver: 'hsl(var(--primary))',
  Outcome: 'hsl(var(--destructive))',
  Disease: 'hsl(var(--accent))',
  Mechanism: 'hsl(220, 70%, 60%)',
  Intervention: 'hsl(142, 70%, 45%)',
  Evidence: 'hsl(280, 65%, 60%)',
};

const KnowledgeGraph = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const cyRef = useRef<HTMLDivElement>(null);
  const cyInstance = useRef<any>(null);

  const { data: graphData, isLoading } = useKgGraph();
  const { data: searchData } = useKgSearch(searchTerm);

  const nodes = graphData?.nodes ?? [];
  const edges = graphData?.edges ?? [];

  useEffect(() => {
    if (!cyRef.current || nodes.length === 0) return;

    if (cyInstance.current) cyInstance.current.destroy();

    cyInstance.current = cytoscape({
      container: cyRef.current,
      elements: [
        ...nodes.map(n => ({
          data: { id: String(n.id), label: n.label, type: n.type, props: n.props }
        })),
        ...edges.map(e => ({
          data: { id: `e${e.id}`, source: String(e.src), target: String(e.dst), label: e.rel }
        }))
      ],
      style: [
        {
          selector: 'node',
          style: {
            'background-color': ((ele: any) => typeColors[ele.data('type')] || '#888') as any,
            'label': 'data(label)',
            'text-valign': 'center',
            'text-halign': 'center',
            'font-size': '10px',
            'color': '#fff',
            'text-outline-color': '#000',
            'text-outline-width': '1px',
            'width': 40,
            'height': 40,
          }
        },
        {
          selector: 'edge',
          style: {
            'width': 2,
            'line-color': '#888',
            'target-arrow-color': '#888',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            'label': 'data(label)',
            'font-size': '8px',
            'text-rotation': 'autorotate',
            'color': '#aaa',
          }
        }
      ],
      layout: { name: 'cose', animate: true, animationDuration: 500, nodeRepulsion: () => 8000, idealEdgeLength: () => 100 },
    });

    cyInstance.current.on('tap', 'node', (evt: any) => {
      const node = evt.target;
      setSelectedNode({ id: node.id(), label: node.data('label'), type: node.data('type'), props: node.data('props') });
      setDrawerOpen(true);
    });

    return () => { cyInstance.current?.destroy(); };
  }, [nodes, edges]);

  // Highlight search results
  useEffect(() => {
    if (!cyInstance.current) return;
    const matchIds = new Set((searchData?.nodes ?? []).map(n => String(n.id)));
    cyInstance.current.nodes().forEach((node: any) => {
      if (matchIds.size > 0 && matchIds.has(node.id())) {
        node.style('border-width', '3px');
        node.style('border-color', '#FFD700');
      } else {
        node.style('border-width', '0px');
      }
    });
  }, [searchData]);

  const handleSearch = () => setSearchTerm(searchQuery.trim());

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">{t('nav.kg')}</h1>
        <p className="text-muted-foreground">Explore climate-health causal relationships and evidence</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-2">
            <Input placeholder="Search for drivers, outcomes, interventions..." value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSearch()} />
            <Button onClick={handleSearch}><Search className="h-4 w-4" /></Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-sm">Node Types</CardTitle></CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {Object.entries(typeColors).map(([type, color]) => (
              <Badge key={type} variant="outline" className="gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />{type}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Knowledge Graph</CardTitle>
          <CardDescription>Click nodes to explore relationships and evidence ({nodes.length} nodes, {edges.length} edges)</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="w-full h-[600px] flex items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-muted-foreground" /></div>
          ) : nodes.length === 0 ? (
            <div className="w-full h-[600px] flex items-center justify-center text-muted-foreground">No graph data available</div>
          ) : (
            <div ref={cyRef} className="w-full h-[600px] rounded-lg border bg-muted/20" />
          )}
        </CardContent>
      </Card>

      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{selectedNode?.label}</SheetTitle>
            <SheetDescription><Badge variant="outline">{selectedNode?.type}</Badge></SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Properties</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">ID:</span><span className="font-mono">{selectedNode?.id}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Type:</span><span>{selectedNode?.type}</span></div>
                {selectedNode?.props && typeof selectedNode.props === 'object' && Object.entries(selectedNode.props).map(([k, v]) => (
                  <div key={k} className="flex justify-between"><span className="text-muted-foreground">{k}:</span><span>{String(v)}</span></div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium mb-2">Connected Nodes</h4>
              <div className="space-y-1 text-sm">
                {edges.filter(e => String(e.src) === selectedNode?.id || String(e.dst) === selectedNode?.id).map(e => {
                  const otherId = String(e.src) === selectedNode?.id ? String(e.dst) : String(e.src);
                  const otherNode = nodes.find(n => String(n.id) === otherId);
                  return (
                    <div key={e.id} className="flex items-center gap-2 p-2 rounded hover:bg-muted/50">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: typeColors[otherNode?.type ?? ''] || '#888' }} />
                      <span className="text-xs">{e.rel}</span>
                      <span className="text-xs font-medium">{otherNode?.label ?? otherId}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </motion.div>
  );
};

export default KnowledgeGraph;
