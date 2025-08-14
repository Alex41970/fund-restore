import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { WalletConnectionDialog } from "./WalletConnectionDialog";
import { format } from "date-fns";
import { formatCurrency } from "@/lib/currency";

interface Invoice {
  id: string;
  amount_due: number;
  currency: string;
  crypto_amount_usdt?: number;
  wire_amount?: number;
  wire_currency?: string;
  description: string;
  due_date: string;
  invoice_status: string;
  created_at: string;
  paid_at?: string;
  payment_instructions?: string;
  payment_method?: string;
  crypto_currency?: string;
  crypto_wallet_address?: string;
  crypto_network?: string;
  wire_bank_name?: string;
  wire_account_number?: string;
  wire_routing_number?: string;
  wire_swift_code?: string;
  wire_account_holder?: string;
  wire_bank_address?: string;
  case?: {
    id: string;
    title: string;
  };
}

interface WalletConnection {
  id: string;
  wallet_address: string;
  wallet_type: string;
  verification_status: string;
}

interface InvoiceViewerProps {
  caseId?: string;
}

export const InvoiceViewer = ({ caseId }: InvoiceViewerProps) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [walletConnections, setWalletConnections] = useState<WalletConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [showWalletDialog, setShowWalletDialog] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      loadInvoices();
      loadWalletConnections();
    }
  }, [user, caseId]);

  const loadInvoices = async () => {
    try {
      let query = supabase
        .from('client_invoices')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (caseId) {
        query = query.eq('case_id', caseId);
      }

      const { data, error } = await query;
      if (error) throw error;
      setInvoices(data || []);
    } catch (error) {
      console.error('Error loading invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadWalletConnections = async () => {
    try {
      const { data, error } = await supabase
        .from('wallet_connections')
        .select('*')
        .eq('user_id', user?.id)
        .eq('verification_status', 'verified');

      if (error) throw error;
      setWalletConnections(data || []);
    } catch (error) {
      console.error('Error loading wallet connections:', error);
    }
  };

  const handlePayInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    if (walletConnections.length === 0) {
      setShowWalletDialog(true);
    } else {
      processPayment(invoice);
    }
  };

  const processPayment = async (invoice: Invoice) => {
    try {
      setIsProcessingPayment(true);
      
      toast({
        title: "Manual Payment Required",
        description: "Please send the payment using the instructions below and contact support to confirm.",
        variant: "default",
      });

    } catch (error: any) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Failed",
        description: error.message || "Transaction failed. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Paid</Badge>;
      case 'overdue':
        return <Badge variant="destructive">Overdue</Badge>;
      case 'confirming':
        return <Badge variant="outline" className="border-blue-500 text-blue-700">Confirming</Badge>;
      case 'pending':
        return <Badge variant="outline">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading invoices...</div>;
  }

  if (invoices.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          No invoices found.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {invoices.map((invoice) => (
        <Card key={invoice.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">
                  {invoice.crypto_amount_usdt && invoice.wire_amount ? (
                    <div className="space-y-1">
                      <div>Crypto: {invoice.crypto_amount_usdt} USDT</div>
                      <div>Wire: {formatCurrency(invoice.wire_amount, invoice.wire_currency || 'USD')}</div>
                    </div>
                  ) : invoice.crypto_amount_usdt ? (
                    `${invoice.crypto_amount_usdt} USDT`
                  ) : invoice.wire_amount ? (
                    formatCurrency(invoice.wire_amount, invoice.wire_currency || 'USD')
                  ) : (
                    formatCurrency(invoice.amount_due, invoice.currency)
                  )}
                </CardTitle>
                <CardDescription>
                  Due: {new Date(invoice.due_date).toLocaleDateString()}
                  {invoice.case && ` • Case: ${invoice.case.title}`}
                </CardDescription>
              </div>
              {getStatusBadge(invoice.invoice_status)}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">{invoice.description}</p>

              {/* Payment Methods */}
              <div className="space-y-4">
                {(invoice.payment_method === 'crypto' || invoice.payment_method === 'both' || !invoice.payment_method) && invoice.crypto_wallet_address && (
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <span>💰</span>
                      Crypto Payment (USDT)
                    </h4>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p><strong>Amount:</strong> {invoice.crypto_amount_usdt || invoice.amount_due} USDT</p>
                      <p><strong>Network:</strong> {invoice.crypto_network === 'tron' ? 'TRON (TRC20)' : 'Ethereum (ERC20)'}</p>
                      <p><strong>Wallet Address:</strong></p>
                      <code className="block p-2 bg-muted rounded text-xs break-all">
                        {invoice.crypto_wallet_address}
                      </code>
                      <p className="text-xs text-muted-foreground">
                        Send exactly {invoice.crypto_amount_usdt || invoice.amount_due} USDT to the above address
                      </p>
                    </div>
                    {walletConnections.length > 0 && (
                      <Button 
                        onClick={() => handlePayInvoice(invoice)} 
                        className="w-full mt-3"
                        disabled={isProcessingPayment}
                      >
                        {isProcessingPayment ? 'Processing...' : 'Connect Wallet'}
                      </Button>
                    )}
                  </div>
                )}

                {(invoice.payment_method === 'wire' || invoice.payment_method === 'both') && invoice.wire_bank_name && (
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2 flex items-center gap-2">
                      <span>🏦</span>
                      Wire Transfer
                    </h4>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <p><strong>Amount:</strong> {invoice.wire_amount ? formatCurrency(invoice.wire_amount, invoice.wire_currency || 'USD') : formatCurrency(invoice.amount_due, invoice.currency)}</p>
                      <p><strong>Bank Name:</strong> {invoice.wire_bank_name}</p>
                      <p><strong>Account Holder:</strong> {invoice.wire_account_holder}</p>
                      <p><strong>Account Number:</strong> {invoice.wire_account_number}</p>
                      {invoice.wire_routing_number && (
                        <p><strong>Routing Number:</strong> {invoice.wire_routing_number}</p>
                      )}
                      {invoice.wire_swift_code && (
                        <p><strong>SWIFT Code:</strong> {invoice.wire_swift_code}</p>
                      )}
                      {invoice.wire_bank_address && (
                        <p><strong>Bank Address:</strong> {invoice.wire_bank_address}</p>
                      )}
                    </div>
                  </div>
                )}

                {!invoice.crypto_wallet_address && !invoice.wire_bank_name && (
                  <Alert>
                    <AlertDescription>
                      No payment options available. Please contact support for payment instructions.
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              {invoice.payment_instructions && (
                <div className="p-3 bg-muted rounded-lg">
                  <span className="text-sm font-medium text-muted-foreground">Payment Instructions:</span>
                  <pre className="text-sm whitespace-pre-wrap mt-1">{invoice.payment_instructions}</pre>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}

      <WalletConnectionDialog
        open={showWalletDialog}
        onOpenChange={setShowWalletDialog}
        onWalletConnected={(address) => {
          setShowWalletDialog(false);
          loadWalletConnections();
          if (selectedInvoice) {
            processPayment(selectedInvoice);
          }
        }}
      />
    </div>
  );
};