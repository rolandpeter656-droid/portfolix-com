import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminGuard } from "@/components/AdminGuard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface InstitutionalPortfolio {
  id: string;
  portfolio_name: string;
  portfolio_type: string;
  allocation: any;
  risk_tolerance: string | null;
  expected_return: string | null;
  volatility: string | null;
  rationale: string | null;
  inspired_by: string | null;
  created_at: string;
  user_id: string;
  subscription_id: string;
  capital_size: number | null;
  investment_horizon: string | null;
  liquidity_needs: string | null;
  ai_confidence_score: number | null;
}

const AdminInstitutionalModels = () => {
  const [portfolios, setPortfolios] = useState<InstitutionalPortfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPortfolios = async () => {
      try {
        const { data, error } = await supabase
          .from('institutional_portfolios')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setPortfolios(data || []);
      } catch (error) {
        console.error('Error fetching portfolios:', error);
        toast({
          title: "Error",
          description: "Failed to load institutional portfolios.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolios();
  }, [toast]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/")}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Admin: Institutional Models</h1>
              <p className="text-muted-foreground">
                All AI-generated institutional portfolios
              </p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Portfolio Database</span>
                <Badge variant="secondary">{portfolios.length} Total</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : portfolios.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No institutional portfolios found.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Risk</TableHead>
                        <TableHead>Allocation (JSON)</TableHead>
                        <TableHead>Inspired By</TableHead>
                        <TableHead>Created At</TableHead>
                        <TableHead>ID</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {portfolios.map((portfolio) => (
                        <TableRow key={portfolio.id}>
                          <TableCell className="font-medium">
                            {portfolio.portfolio_name}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{portfolio.portfolio_type}</Badge>
                          </TableCell>
                          <TableCell>
                            {portfolio.risk_tolerance ? (
                              <Badge
                                variant={
                                  portfolio.risk_tolerance === "low"
                                    ? "secondary"
                                    : portfolio.risk_tolerance === "medium"
                                    ? "default"
                                    : "destructive"
                                }
                              >
                                {portfolio.risk_tolerance}
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell>
                            <details className="max-w-md">
                              <summary className="cursor-pointer text-primary hover:underline">
                                View JSON
                              </summary>
                              <pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto max-h-40">
                                {JSON.stringify(portfolio.allocation, null, 2)}
                              </pre>
                            </details>
                          </TableCell>
                          <TableCell>
                            {portfolio.inspired_by ? (
                              <span className="text-sm">{portfolio.inspired_by}</span>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell className="text-sm">
                            {formatDate(portfolio.created_at)}
                          </TableCell>
                          <TableCell className="font-mono text-xs text-muted-foreground">
                            {portfolio.id.substring(0, 8)}...
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Additional Data</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {portfolios.map((portfolio) => (
                  <details key={portfolio.id} className="border-b pb-4">
                    <summary className="cursor-pointer font-medium hover:text-primary">
                      {portfolio.portfolio_name} - Full Details
                    </summary>
                    <div className="mt-4 space-y-2 text-sm">
                      <div>
                        <span className="font-semibold">Expected Return:</span>{" "}
                        {portfolio.expected_return || "N/A"}
                      </div>
                      <div>
                        <span className="font-semibold">Volatility:</span>{" "}
                        {portfolio.volatility || "N/A"}
                      </div>
                      <div>
                        <span className="font-semibold">Capital Size:</span>{" "}
                        {portfolio.capital_size
                          ? `$${portfolio.capital_size.toLocaleString()}`
                          : "N/A"}
                      </div>
                      <div>
                        <span className="font-semibold">Investment Horizon:</span>{" "}
                        {portfolio.investment_horizon || "N/A"}
                      </div>
                      <div>
                        <span className="font-semibold">Liquidity Needs:</span>{" "}
                        {portfolio.liquidity_needs || "N/A"}
                      </div>
                      <div>
                        <span className="font-semibold">AI Confidence:</span>{" "}
                        {portfolio.ai_confidence_score
                          ? `${portfolio.ai_confidence_score}%`
                          : "N/A"}
                      </div>
                      <div>
                        <span className="font-semibold">Rationale:</span>
                        <p className="mt-1 text-muted-foreground">
                          {portfolio.rationale || "No rationale provided"}
                        </p>
                      </div>
                      <div>
                        <span className="font-semibold">User ID:</span>{" "}
                        <code className="text-xs bg-muted px-1 py-0.5 rounded">
                          {portfolio.user_id}
                        </code>
                      </div>
                      <div>
                        <span className="font-semibold">Subscription ID:</span>{" "}
                        <code className="text-xs bg-muted px-1 py-0.5 rounded">
                          {portfolio.subscription_id}
                        </code>
                      </div>
                    </div>
                  </details>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminGuard>
  );
};

export default AdminInstitutionalModels;
