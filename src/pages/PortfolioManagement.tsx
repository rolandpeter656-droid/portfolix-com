import { useState, useEffect, useCallback } from "react";
import { AdminGuard } from "@/components/AdminGuard";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { ArrowLeft, Plus, Trash2, Pencil, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Allocation {
  ticker: string;
  name: string;
  percentage: number;
  rationale: string;
}

interface Archetype {
  id: string;
  archetype_code: string;
  goal: string;
  timeline: string;
  risk_tolerance: string;
  allocations: Allocation[];
  target_return_min: number | null;
  target_return_max: number | null;
  max_drawdown: number | null;
  risk_flag: boolean;
  risk_flag_message: string | null;
  version: number;
  last_reviewed_at: string | null;
  is_active: boolean;
}

interface HistoryEntry {
  id: string;
  archetype_code: string;
  previous_allocations: any;
  new_allocations: any;
  change_reason: string | null;
  changed_at: string;
  changed_by: string;
}

const CHECKLIST_ITEMS = [
  "Check macro news (Fed, inflation, major events)",
  "Review ETF performance vs benchmark (4-week trailing)",
  "Check for lower-cost ETF alternatives",
  "Review correlation between holdings",
  "Check user feedback / support tickets",
  "Update any archetypes that need changes",
  "Mark all archetypes as reviewed",
];

function daysSince(dateStr: string | null): number | null {
  if (!dateStr) return null;
  const diff = Date.now() - new Date(dateStr).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

const PortfolioManagementContent = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [archetypes, setArchetypes] = useState<Archetype[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [editArchetype, setEditArchetype] = useState<Archetype | null>(null);
  const [editAllocations, setEditAllocations] = useState<Allocation[]>([]);
  const [editReturnMin, setEditReturnMin] = useState("");
  const [editReturnMax, setEditReturnMax] = useState("");
  const [editDrawdown, setEditDrawdown] = useState("");
  const [editRiskFlag, setEditRiskFlag] = useState(false);
  const [editRiskMessage, setEditRiskMessage] = useState("");
  const [changeReason, setChangeReason] = useState("");
  const [saving, setSaving] = useState(false);
  const [checkedItems, setCheckedItems] = useState<boolean[]>(
    new Array(CHECKLIST_ITEMS.length).fill(false)
  );

  const fetchArchetypes = useCallback(async () => {
    const { data, error } = await supabase
      .from("portfolio_archetypes")
      .select("*")
      .order("archetype_code");
    if (error) {
      console.error(error);
      return;
    }
    setArchetypes(
      (data as any[]).map((d) => ({
        ...d,
        allocations: Array.isArray(d.allocations) ? d.allocations : [],
      }))
    );
    setLoading(false);
  }, []);

  const fetchHistory = useCallback(async () => {
    const { data, error } = await supabase
      .from("portfolio_archetype_history")
      .select("*")
      .order("changed_at", { ascending: false })
      .limit(100);
    if (error) {
      console.error(error);
      return;
    }
    setHistory(data as any[]);
  }, []);

  useEffect(() => {
    fetchArchetypes();
    fetchHistory();
  }, [fetchArchetypes, fetchHistory]);

  const openEdit = (a: Archetype) => {
    setEditArchetype(a);
    setEditAllocations(a.allocations.map((al) => ({ ...al })));
    setEditReturnMin(a.target_return_min?.toString() ?? "");
    setEditReturnMax(a.target_return_max?.toString() ?? "");
    setEditDrawdown(a.max_drawdown?.toString() ?? "");
    setEditRiskFlag(a.risk_flag);
    setEditRiskMessage(a.risk_flag_message ?? "");
    setChangeReason("");
  };

  const allocSum = editAllocations.reduce((s, a) => s + (Number(a.percentage) || 0), 0);

  const handleSave = async () => {
    if (!editArchetype) return;
    if (!changeReason.trim()) {
      toast({ title: "Change reason required", variant: "destructive" });
      return;
    }
    if (Math.abs(allocSum - 100) > 0.01) {
      toast({ title: "Allocations must sum to 100%", description: `Current sum: ${allocSum}%`, variant: "destructive" });
      return;
    }

    setSaving(true);
    const { error } = await supabase
      .from("portfolio_archetypes")
      .update({
        allocations: editAllocations as any,
        target_return_min: editReturnMin ? Number(editReturnMin) : null,
        target_return_max: editReturnMax ? Number(editReturnMax) : null,
        max_drawdown: editDrawdown ? Number(editDrawdown) : null,
        risk_flag: editRiskFlag,
        risk_flag_message: editRiskFlag ? editRiskMessage : null,
        last_reviewed_at: new Date().toISOString(),
        updated_by: changeReason.trim(),
      } as any)
      .eq("id", editArchetype.id);

    if (error) {
      toast({ title: "Error saving", description: error.message, variant: "destructive" });
      setSaving(false);
      return;
    }

    // Refetch to get updated version from trigger
    await fetchArchetypes();
    await fetchHistory();
    const updated = archetypes.find((a) => a.id === editArchetype.id);
    toast({
      title: `Archetype ${editArchetype.archetype_code} updated to v${(editArchetype.version || 1) + 1}`,
    });
    setEditArchetype(null);
    setSaving(false);
  };

  const markAllReviewed = async () => {
    const { error } = await supabase
      .from("portfolio_archetypes")
      .update({ last_reviewed_at: new Date().toISOString() } as any)
      .eq("is_active", true);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "All archetypes marked as reviewed" });
    fetchArchetypes();
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-[1400px] mx-auto p-4 md:p-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Portfolio Management</h1>
            <p className="text-sm text-muted-foreground">Weekly archetype optimization & review</p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main content */}
          <div className="flex-1 min-w-0">
            <Tabs defaultValue="overview">
              <TabsList className="mb-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <Card>
                  <CardContent className="p-0 overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Code</TableHead>
                          <TableHead>Goal</TableHead>
                          <TableHead>Timeline</TableHead>
                          <TableHead>Risk</TableHead>
                          <TableHead className="text-center"># Holdings</TableHead>
                          <TableHead>Target Return</TableHead>
                          <TableHead>Last Reviewed</TableHead>
                          <TableHead className="text-center">Ver</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {loading ? (
                          <TableRow>
                            <TableCell colSpan={9} className="text-center py-12 text-muted-foreground">Loading…</TableCell>
                          </TableRow>
                        ) : archetypes.map((a) => {
                          const days = daysSince(a.last_reviewed_at);
                          const needsReview = days === null || days > 7;
                          return (
                            <TableRow key={a.id}>
                              <TableCell className="font-mono font-bold">{a.archetype_code}</TableCell>
                              <TableCell className="capitalize">{a.goal.replace("_", " ")}</TableCell>
                              <TableCell className="capitalize">{a.timeline}</TableCell>
                              <TableCell className="capitalize">{a.risk_tolerance}</TableCell>
                              <TableCell className="text-center">{a.allocations.length}</TableCell>
                              <TableCell>
                                {a.target_return_min != null && a.target_return_max != null
                                  ? `${a.target_return_min}–${a.target_return_max}%`
                                  : "—"}
                              </TableCell>
                              <TableCell>
                                {a.last_reviewed_at ? (
                                  <span className={needsReview ? "text-destructive font-medium" : "text-muted-foreground"}>
                                    {days}d ago {needsReview && "⚠️"}
                                  </span>
                                ) : (
                                  <span className="text-destructive font-medium">Never ⚠️</span>
                                )}
                              </TableCell>
                              <TableCell className="text-center">
                                <Badge variant="secondary">v{a.version}</Badge>
                              </TableCell>
                              <TableCell>
                                <Button size="sm" variant="ghost" onClick={() => openEdit(a)}>
                                  <Pencil className="h-4 w-4 mr-1" /> Edit
                                </Button>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="history">
                <Card>
                  <CardContent className="p-0 overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Archetype</TableHead>
                          <TableHead>Reason</TableHead>
                          <TableHead>Changed By</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {history.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center py-12 text-muted-foreground">No changes logged yet</TableCell>
                          </TableRow>
                        ) : history.map((h) => (
                          <TableRow key={h.id}>
                            <TableCell className="text-muted-foreground whitespace-nowrap">
                              {new Date(h.changed_at).toLocaleDateString()} {new Date(h.changed_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </TableCell>
                            <TableCell className="font-mono font-bold">{h.archetype_code}</TableCell>
                            <TableCell>{h.change_reason || "—"}</TableCell>
                            <TableCell className="text-muted-foreground">{h.changed_by}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar checklist */}
          <div className="lg:w-80 shrink-0">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Weekly Review Checklist</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {CHECKLIST_ITEMS.map((item, i) => (
                  <label key={i} className="flex items-start gap-3 cursor-pointer group">
                    <Checkbox
                      checked={checkedItems[i]}
                      onCheckedChange={(v) => {
                        const next = [...checkedItems];
                        next[i] = !!v;
                        setCheckedItems(next);
                      }}
                    />
                    <span className={`text-sm leading-tight ${checkedItems[i] ? "line-through text-muted-foreground" : "text-foreground"}`}>
                      {item}
                    </span>
                  </label>
                ))}
                <div className="pt-3 border-t border-border">
                  <Button
                    onClick={markAllReviewed}
                    className="w-full"
                    size="sm"
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                    Mark All Reviewed
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <Dialog open={!!editArchetype} onOpenChange={(open) => !open && setEditArchetype(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Edit Archetype {editArchetype?.archetype_code} — {editArchetype?.goal.replace("_", " ")} / {editArchetype?.timeline} / {editArchetype?.risk_tolerance}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Allocations */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium">Allocations</h4>
                <span className={`text-sm font-mono ${Math.abs(allocSum - 100) > 0.01 ? "text-destructive" : "text-primary"}`}>
                  {allocSum.toFixed(1)}%
                </span>
              </div>
              <div className="space-y-2">
                {editAllocations.map((alloc, i) => (
                  <div key={i} className="grid grid-cols-[80px_1fr_70px_1fr_32px] gap-2 items-center">
                    <Input
                      value={alloc.ticker}
                      onChange={(e) => {
                        const next = [...editAllocations];
                        next[i] = { ...next[i], ticker: e.target.value };
                        setEditAllocations(next);
                      }}
                      placeholder="Ticker"
                      className="font-mono text-xs"
                    />
                    <Input
                      value={alloc.name}
                      onChange={(e) => {
                        const next = [...editAllocations];
                        next[i] = { ...next[i], name: e.target.value };
                        setEditAllocations(next);
                      }}
                      placeholder="ETF Name"
                      className="text-xs"
                    />
                    <Input
                      type="number"
                      value={alloc.percentage}
                      onChange={(e) => {
                        const next = [...editAllocations];
                        next[i] = { ...next[i], percentage: Number(e.target.value) };
                        setEditAllocations(next);
                      }}
                      className="text-xs"
                    />
                    <Input
                      value={alloc.rationale}
                      onChange={(e) => {
                        const next = [...editAllocations];
                        next[i] = { ...next[i], rationale: e.target.value };
                        setEditAllocations(next);
                      }}
                      placeholder="Rationale"
                      className="text-xs"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => setEditAllocations(editAllocations.filter((_, j) => j !== i))}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() =>
                  setEditAllocations([...editAllocations, { ticker: "", name: "", percentage: 0, rationale: "" }])
                }
              >
                <Plus className="h-4 w-4 mr-1" /> Add Holding
              </Button>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs text-muted-foreground">Return Min %</label>
                <Input type="number" value={editReturnMin} onChange={(e) => setEditReturnMin(e.target.value)} />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Return Max %</label>
                <Input type="number" value={editReturnMax} onChange={(e) => setEditReturnMax(e.target.value)} />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Max Drawdown %</label>
                <Input type="number" value={editDrawdown} onChange={(e) => setEditDrawdown(e.target.value)} />
              </div>
            </div>

            {/* Risk flag */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Switch checked={editRiskFlag} onCheckedChange={setEditRiskFlag} />
                <span className="text-sm">Risk Flag</span>
              </div>
              {editRiskFlag && (
                <Input
                  value={editRiskMessage}
                  onChange={(e) => setEditRiskMessage(e.target.value)}
                  placeholder="Risk flag message shown to users"
                />
              )}
            </div>

            {/* Change reason */}
            <div>
              <label className="text-xs text-muted-foreground">Change Reason (required)</label>
              <Input
                value={changeReason}
                onChange={(e) => setChangeReason(e.target.value)}
                placeholder="Why are you making this change?"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditArchetype(null)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving || !changeReason.trim() || Math.abs(allocSum - 100) > 0.01}>
              {saving ? "Saving…" : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const PortfolioManagement = () => (
  <AdminGuard>
    <PortfolioManagementContent />
  </AdminGuard>
);

export default PortfolioManagement;
