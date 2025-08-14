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
import { convertToUSDT, formatCurrencyConversion } from "@/lib/currency-converter";

interface Invoice {
  id: string;
  case_id: string;
  amount_due: number;
  currency: string;
  invoice_status: string;
  due_date: string;
  description: string;
  created_at: string;
  paid_at?: string;
  payment_instructions?: string;
  // Direct crypto fields
  crypto_wallet_address?: string;
  crypto_currency?: string;
  crypto_network?: string;
  // Direct wire transfer fields
  wire_bank_name?: string;
  wire_account_holder?: string;
  wire_account_number?: string;
  wire_routing_number?: string;
  wire_swift_code?: string;
  wire_bank_address?: string;
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
  const [processing, setProcessing] = useState(false);
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

      if (error) {
        console.error('Error loading invoices:', error);
        return;
      }

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

      if (error) {
        console.error('Error loading wallet connections:', error);
        return;
      }

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
      processPayment(invoice, walletConnections[0]);
    }
  };

  const processPayment = async (invoice: Invoice, wallet: WalletConnection) => {
    if (!window.ethereum) {
      toast({
        title: "MetaMask Required",
        description: "Please install MetaMask to make payments.",
        variant: "destructive",
      });
      return;
    }

    try {
      setProcessing(true);
      
      // Convert invoice amount to USDT (1:1 with USD after currency conversion)
      const usdtAmount = convertToUSDT(invoice.amount_due, invoice.currency);
      
      // For ERC20 tokens like USDT, we need proper contract interaction
      // For now, we'll guide users to make manual payments
      toast({
        title: "Manual Payment Required",
        description: `Please send exactly ${usdtAmount.toFixed(2)} USDT to the wallet address shown below and contact support to confirm payment.`,
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
      setProcessing(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Paid</Badge>;
      case 'overdue':
        return <Badge variant="destructive">Overdue</Badge>;
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
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Invoice #{invoice.id.slice(0, 8)}</CardTitle>
                <CardDescription>{invoice.description}</CardDescription>
              </div>
              {getStatusBadge(invoice.invoice_status)}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Amount Due:</span>
                  <div className="font-semibold">${invoice.amount_due} {invoice.currency}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Due Date:</span>
                  <div>{format(new Date(invoice.due_date), 'MMM dd, yyyy')}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Created:</span>
                  <div>{format(new Date(invoice.created_at), 'MMM dd, yyyy')}</div>
                </div>
                {invoice.paid_at && (
                  <div>
                    <span className="text-muted-foreground">Paid:</span>
                    <div>{format(new Date(invoice.paid_at), 'MMM dd, yyyy')}</div>
                  </div>
                )}
              </div>

              {invoice.payment_instructions && (
                <div className="p-3 bg-muted rounded-lg">
                  <span className="text-sm font-medium text-muted-foreground">Payment Instructions:</span>
                  <pre className="text-sm whitespace-pre-wrap mt-1">{invoice.payment_instructions}</pre>
                </div>
              )}

              {invoice.invoice_status === 'pending' && (
                <>
                  <Separator />
                  <div className="space-y-4">
                    <h4 className="font-medium">Payment Options</h4>
                    
                    {/* Crypto Payment Option */}
                    {invoice.crypto_wallet_address && (
                      <div className="border rounded-lg p-4 space-y-4">
                        <h5 className="font-medium text-blue-700 flex items-center gap-2">
                          <span className="text-lg">₿</span>
                          Cryptocurrency Payment
                        </h5>
                        
                        <div className="space-y-3">
                          <div className="text-sm space-y-2">
                            <div><span className="text-muted-foreground">Currency:</span> USDT</div>
                            <div><span className="text-muted-foreground">Network:</span> {invoice.crypto_network === 'tron' ? 'TRON (TRC20)' : 'Ethereum (ERC20)'}</div>
                            <div><span className="text-muted-foreground">Amount to Send:</span> {convertToUSDT(invoice.amount_due, invoice.currency).toFixed(2)} USDT</div>
                            {invoice.currency !== 'USD' && (
                              <div className="text-xs text-muted-foreground">
                                {formatCurrencyConversion(invoice.amount_due, invoice.currency, convertToUSDT(invoice.amount_due, invoice.currency))}
                              </div>
                            )}
                          </div>
                          
                          <div className="bg-muted/50 rounded p-3 space-y-2">
                            <div className="text-sm font-medium">Wallet Address:</div>
                            <div className="flex items-center gap-2">
                              <code className="text-xs bg-background px-2 py-1 rounded flex-1 break-all">
                                {invoice.crypto_wallet_address}
                              </code>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => {
                                  navigator.clipboard.writeText(invoice.crypto_wallet_address!);
                                  toast({ title: "Copied!", description: "Wallet address copied to clipboard" });
                                }}
                              >
                                Copy
                              </Button>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Button 
                            onClick={() => handlePayInvoice(invoice)}
                            disabled={processing}
                            className="w-full"
                            variant="outline"
                          >
                            <span className="mr-2">💳</span>
                            {processing ? "Processing Payment..." : `Connect Wallet`}
                          </Button>
                          
                          <Alert>
                            <AlertDescription className="text-xs">
                              <strong>Manual Payment:</strong> Copy the wallet address above and send exactly {convertToUSDT(invoice.amount_due, invoice.currency).toFixed(2)} USDT from your crypto wallet. 
                              Contact support after sending to confirm payment.
                            </AlertDescription>
                          </Alert>
                        </div>
                      </div>
                    )}
                    
                    {/* Wire Transfer Option */}
                    {invoice.wire_bank_name && (
                      <div className="border rounded-lg p-4 space-y-3">
                        <h5 className="font-medium text-green-700">Wire Transfer</h5>
                        <div className="text-sm space-y-1">
                          <div><span className="text-muted-foreground">Bank:</span> {invoice.wire_bank_name}</div>
                          {invoice.wire_account_holder && <div><span className="text-muted-foreground">Account Holder:</span> {invoice.wire_account_holder}</div>}
                          {invoice.wire_account_number && <div><span className="text-muted-foreground">Account Number:</span> {invoice.wire_account_number}</div>}
                          {invoice.wire_routing_number && <div><span className="text-muted-foreground">Routing Number:</span> {invoice.wire_routing_number}</div>}
                          {invoice.wire_swift_code && <div><span className="text-muted-foreground">SWIFT Code:</span> {invoice.wire_swift_code}</div>}
                        </div>
                        <Alert>
                          <AlertDescription>
                            Use the bank details above for wire transfer. Contact support once payment is sent.
                          </AlertDescription>
                        </Alert>
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
                </>
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
            processPayment(selectedInvoice, {
              id: '',
              wallet_address: address,
              wallet_type: 'metamask',
              verification_status: 'verified'
            });
          }
        }}
      />
    </div>
  );
};