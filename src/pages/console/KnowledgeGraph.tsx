import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Search, Network, ExternalLink } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import cytoscape from "cytoscape";

const mockNodes = [
  { id: 'heat', label: 'Heat Exposure', type: 'Driver' },
  { id: 'humidity', label: 'High Humidity', type: 'Driver' },
  { id: 'air_quality', label: 'Poor Air Quality', type: 'Driver' },
  { id: 'dehydration', label: 'Dehydration', type: 'Mechanism' },
  { id: 'heat_stroke', label: 'Heat Stroke', type: 'Outcome' },
  { id: 'respiratory', label: 'Respiratory Distress', type: 'Outcome' },
  { id: 'dengue', label: 'Dengue', type: 'Disease' },
  { id: 'malaria', label: 'Malaria', type: 'Disease' },
  { id: 'cooling_centers', label: 'Cooling Centers', type: 'Intervention' },
  { id: 'vector_control', label: 'Vector Control', type: 'Intervention' },
  { id: 'ev1', label: 'WHO Study 2021', type: 'Evidence' },
  { id: 'ev2', label: 'Lancet 2022', type: 'Evidence' },
];

const mockEdges = [
  { id: 'e1', source: 'heat', target: 'dehydration', label: 'causes' },
  { id: 'e2', source: 'dehydration', target: 'heat_stroke', label: 'leads to' },
  { id: 'e3', source: 'heat', target: 'heat_stroke', label: 'increases risk' },
  { id: 'e4', source: 'air_quality', target: 'respiratory', label: 'exacerbates' },
  { id: 'e5', source: 'humidity', target: 'dengue', label: 'promotes' },
  { id: 'e6', source: 'cooling_centers', target: 'heat_stroke', label: 'prevents' },
  { id: 'e7', source: 'vector_control', target: 'dengue', label: 'reduces' },
  { id: 'e8', source: 'ev1', target: 'heat', label: 'supports' },
  { id: 'e9', source: 'ev2', target: 'respiratory', label: 'documents' },
];

const typeColors = {
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
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const cyRef = useRef<HTMLDivElement>(null);
  const cyInstance = useRef<any>(null);

  useEffect(() => {
    if (!cyRef.current) return;

    cyInstance.current = cytoscape({
      container: cyRef.current,
      elements: [
        ...mockNodes.map(n => ({
          data: { id: n.id, label: n.label, type: n.type }
        })),
        ...mockEdges.map(e => ({
          data: { id: e.id, source: e.source, target: e.target, label: e.label }
        }))
      ],
      style: [
        {
          selector: 'node',
          style: {
            'background-color': (ele: any) => typeColors[ele.data('type') as keyof typeof typeColors],
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
            'line-color': 'hsl(var(--border))',
            'target-arrow-color': 'hsl(var(--border))',
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            'label': 'data(label)',
            'font-size': '8px',
            'text-rotation': 'autorotate',
            'color': 'hsl(var(--muted-foreground))',
          }
        }
      ],
      layout: {
        name: 'cose',
        animate: true,
        animationDuration: 500,
        nodeRepulsion: 8000,
        idealEdgeLength: 100,
      }
    });

    cyInstance.current.on('tap', 'node', (evt: any) => {
      const node = evt.target;
      setSelectedNode({
        id: node.id(),
        label: node.data('label'),
        type: node.data('type'),
      });
      setDrawerOpen(true);
    });

    return () => {
      cyInstance.current?.destroy();
    };
  }, []);

  const handleSearch = () => {
    if (!cyInstance.current) return;
    
    if (searchQuery.trim()) {
      cyInstance.current.nodes().forEach((node: any) => {
        if (node.data('label').toLowerCase().includes(searchQuery.toLowerCase())) {
          node.style('border-width', '3px');
          node.style('border-color', '#FFD700');
        } else {
          node.style('border-width', '0px');
        }
      });
    } else {
      cyInstance.current.nodes().style('border-width', '0px');
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
        <h1 className="text-3xl font-bold mb-2">{t('nav.kg')}</h1>
        <p className="text-muted-foreground">
          Explore climate-health causal relationships and evidence
        </p>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-2">
            <Input
              placeholder="Search for drivers, outcomes, interventions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button onClick={handleSearch}>
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Node Types</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {Object.entries(typeColors).map(([type, color]) => (
              <Badge key={type} variant="outline" className="gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                {type}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Graph */}
      <Card>
        <CardHeader>
          <CardTitle>Knowledge Graph</CardTitle>
          <CardDescription>
            Click nodes to explore relationships and evidence
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div 
            ref={cyRef} 
            className="w-full h-[600px] rounded-lg border bg-muted/20"
          />
        </CardContent>
      </Card>

      {/* Node Details Drawer */}
      <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>{selectedNode?.label}</SheetTitle>
            <SheetDescription>
              <Badge variant="outline">{selectedNode?.type}</Badge>
            </SheetDescription>
          </SheetHeader>
          
          <div className="mt-6 space-y-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Properties</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ID:</span>
                  <span className="font-mono">{selectedNode?.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type:</span>
                  <span>{selectedNode?.type}</span>
                </div>
              </div>
            </div>

            {selectedNode?.type === 'Evidence' && (
              <div>
                <h4 className="text-sm font-medium mb-2">Related Evidence</h4>
                <div className="space-y-2">
                  <div className="p-3 rounded-lg border">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-medium">Climate change and heat-related mortality</p>
                        <p className="text-xs text-muted-foreground mt-1">WHO, 2021</p>
                        <Badge variant="secondary" className="mt-2">High Quality</Badge>
                      </div>
                      <ExternalLink className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div>
              <h4 className="text-sm font-medium mb-2">Connected Nodes</h4>
              <div className="space-y-1 text-sm">
                {mockEdges
                  .filter(e => e.source === selectedNode?.id || e.target === selectedNode?.id)
                  .map(e => {
                    const connectedId = e.source === selectedNode?.id ? e.target : e.source;
                    const connectedNode = mockNodes.find(n => n.id === connectedId);
                    return (
                      <div key={e.id} className="flex items-center gap-2 p-2 rounded hover:bg-muted/50">
                        <div 
                          className="w-2 h-2 rounded-full" 
                          style={{ backgroundColor: typeColors[connectedNode?.type as keyof typeof typeColors] }}
                        />
                        <span className="text-xs">{connectedNode?.label}</span>
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
