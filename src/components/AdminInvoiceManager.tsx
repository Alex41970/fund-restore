import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { SUPPORTED_CURRENCIES, formatCurrency } from "@/lib/currency";

const invoiceSchema = z.object({
  client_id: z.string().min(1, "Client is required"),
  case_id: z.string().min(1, "Case is required"),
  crypto_amount_usdt: z.number().min(0, "Crypto amount must be 0 or greater").optional(),
  wire_amount: z.number().min(0, "Wire amount must be 0 or greater").optional(),
  wire_currency: z.string().optional(),
  description: z.string().min(1, "Description is required"),
  due_date: z.string().min(1, "Due date is required"),
  payment_method: z.enum(["crypto", "wire", "both"]),
  // Crypto payment fields
  crypto_wallet_address: z.string().optional(),
  crypto_network: z.enum(["ethereum", "tron"]).optional(),
  // Wire transfer fields
  wire_bank_name: z.string().optional(),
  wire_account_number: z.string().optional(),
  wire_routing_number: z.string().optional(),
  wire_swift_code: z.string().optional(),
  wire_account_holder: z.string().optional(),
  wire_bank_address: z.string().optional(),
}).refine((data) => {
  if (data.payment_method === "crypto" && (!data.crypto_amount_usdt || data.crypto_amount_usdt <= 0)) {
    return false;
  }
  if (data.payment_method === "wire" && (!data.wire_amount || data.wire_amount <= 0)) {
    return false;
  }
  if (data.payment_method === "both" && ((!data.crypto_amount_usdt || data.crypto_amount_usdt <= 0) || (!data.wire_amount || data.wire_amount <= 0))) {
    return false;
  }
  return true;
}, {
  message: "At least one payment amount must be provided based on selected payment method",
});

type InvoiceFormData = z.infer<typeof invoiceSchema>;

interface PaymentConfiguration {
  id: string;
  name: string;
  payment_method: 'crypto' | 'wire_transfer';
  crypto_wallet_address?: string;
  crypto_network?: string;
  crypto_currency?: string;
  wire_bank_name?: string;
  wire_account_number?: string;
  wire_routing_number?: string;
  wire_swift_code?: string;
  wire_account_holder?: string;
  wire_bank_address?: string;
  is_active: boolean;
}

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
  case: Case;
  profile: Profile;
}

interface Case {
  id: string;
  title: string;
  user_id: string;
  preferred_currency?: string;
}

interface Profile {
  id: string;
  display_name: string;
  email: string;
}

export const AdminInvoiceManager = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [cases, setCases] = useState<Case[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [paymentConfigurations, setPaymentConfigurations] = useState<PaymentConfiguration[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      payment_method: "crypto",
      crypto_network: "ethereum",
      wire_currency: "USD",
    },
  });

  // Watch for client selection to filter cases
  const selectedClientId = form.watch("client_id");
  const paymentMethod = form.watch("payment_method");
  
  // Filter cases based on selected client
  const filteredCases = selectedClientId 
    ? cases.filter(case_ => case_.user_id === selectedClientId)
    : [];

  const generatePaymentInstructions = (data: InvoiceFormData): string => {
    const instructions: string[] = [];
    
    // Generate crypto instructions if provided
    if (data.crypto_wallet_address && data.crypto_amount_usdt) {
      const networkName = data.crypto_network === 'tron' ? 'TRON (TRC20)' : 'Ethereum (ERC20)';
      instructions.push(`CRYPTOCURRENCY PAYMENT:\nPay exactly ${data.crypto_amount_usdt} USDT on ${networkName} network\nWallet Address: ${data.crypto_wallet_address}`);
    }
    
    // Generate wire transfer instructions if provided
    if (data.wire_bank_name && data.wire_amount) {
      let wireInstructions = `WIRE TRANSFER:\nAmount: ${formatCurrency(data.wire_amount, data.wire_currency || 'USD')}\nBank: ${data.wire_bank_name}`;
      if (data.wire_account_holder) wireInstructions += `\nAccount Holder: ${data.wire_account_holder}`;
      if (data.wire_account_number) wireInstructions += `\nAccount Number: ${data.wire_account_number}`;
      if (data.wire_routing_number) wireInstructions += `\nRouting Number: ${data.wire_routing_number}`;
      if (data.wire_swift_code) wireInstructions += `\nSWIFT Code: ${data.wire_swift_code}`;
      if (data.wire_bank_address) wireInstructions += `\nBank Address: ${data.wire_bank_address}`;
      instructions.push(wireInstructions);
    }
    
    return instructions.join('\n\n');
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load invoices with related case and profile data
      const { data: invoicesData, error: invoicesError } = await supabase
        .from('client_invoices')
        .select(`
          *,
          case:cases(title),
          profile:profiles(display_name, email)
        `)
        .order('created_at', { ascending: false });

      if (invoicesError) throw invoicesError;
      setInvoices(invoicesData || []);

      // Load cases for dropdown
      const { data: casesData, error: casesError } = await supabase
        .from('cases')
        .select('id, title, user_id, preferred_currency')
        .order('created_at', { ascending: false });

      if (casesError) throw casesError;
      setCases(casesData || []);

      // Load profiles for dropdown
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, display_name, email')
        .order('display_name');

      if (profilesError) throw profilesError;
      setProfiles(profilesData || []);

      // Load active payment configurations
      const { data: paymentConfigsData, error: paymentConfigsError } = await supabase
        .from('payment_configurations')
        .select('*')
        .eq('is_active', true)
        .order('name');

      if (paymentConfigsError) throw paymentConfigsError;
      setPaymentConfigurations(paymentConfigsData || []);

    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Error",
        description: "Failed to load data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: InvoiceFormData) => {
    try {
      setIsSubmitting(true);

      // Validate payment methods
      if (data.payment_method === "crypto" || data.payment_method === "both") {
        if (!data.crypto_wallet_address) {
          toast({
            title: "Error",
            description: "Crypto wallet address is required for crypto payments",
            variant: "destructive",
          });
          return;
        }
      }

      if (data.payment_method === "wire" || data.payment_method === "both") {
        if (!data.wire_bank_name || !data.wire_account_number) {
          toast({
            title: "Error", 
            description: "Wire transfer details are required for wire payments",
            variant: "destructive",
          });
          return;
        }
      }

      const paymentInstructions = generatePaymentInstructions(data);

      const { error } = await supabase
        .from('client_invoices')
        .insert({
          user_id: data.client_id,
          case_id: data.case_id,
          amount_due: data.crypto_amount_usdt || data.wire_amount || 0, // Keep for backward compatibility
          currency: data.wire_currency || 'USD', // Keep for backward compatibility
          crypto_amount_usdt: data.crypto_amount_usdt,
          wire_amount: data.wire_amount,
          wire_currency: data.wire_currency,
          description: data.description,
          due_date: data.due_date,
          payment_instructions: paymentInstructions,
          payment_method: data.payment_method,
          crypto_currency: 'USDT',
          crypto_wallet_address: data.crypto_wallet_address,
          crypto_network: data.crypto_network,
          wire_bank_name: data.wire_bank_name,
          wire_account_number: data.wire_account_number,
          wire_routing_number: data.wire_routing_number,
          wire_swift_code: data.wire_swift_code,
          wire_account_holder: data.wire_account_holder,
          wire_bank_address: data.wire_bank_address,
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Invoice created successfully!",
      });
      setIsDialogOpen(false);
      form.reset();
      loadData();
    } catch (error) {
      console.error('Error creating invoice:', error);
      toast({
        title: "Error",
        description: "Failed to create invoice",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateInvoiceStatus = async (invoiceId: string, newStatus: string) => {
    try {
      const updateData: any = { 
        invoice_status: newStatus 
      };
      
      if (newStatus === 'paid') {
        updateData.paid_at = new Date().toISOString();
      } else {
        updateData.paid_at = null;
      }

      const { error } = await supabase
        .from('client_invoices')
        .update(updateData)
        .eq('id', invoiceId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Invoice status updated to ${newStatus}`,
      });
      loadData();
    } catch (error) {
      console.error('Error updating invoice status:', error);
      toast({
        title: "Error",
        description: "Failed to update invoice status",
        variant: "destructive",
      });
    }
  };

  const getStatusSelector = (invoice: Invoice) => (
    <Select 
      value={invoice.invoice_status} 
      onValueChange={(value) => updateInvoiceStatus(invoice.id, value)}
    >
      <SelectTrigger className="w-32">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="pending">Pending</SelectItem>
        <SelectItem value="confirming">Confirming</SelectItem>
        <SelectItem value="paid">Paid</SelectItem>
        <SelectItem value="overdue">Overdue</SelectItem>
        <SelectItem value="cancelled">Cancelled</SelectItem>
      </SelectContent>
    </Select>
  );

  if (loading) {
    return <div className="text-center py-8">Loading invoices...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Invoice Management</h2>
          <p className="text-muted-foreground">Create and manage client invoices</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Create Invoice</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Invoice</DialogTitle>
              <DialogDescription>
                Generate an invoice with separate amounts for crypto and wire payments
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="client_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Client</FormLabel>
                        <Select onValueChange={(value) => {
                          field.onChange(value);
                          form.setValue("case_id", "");
                        }} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select client" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {profiles.map((profile) => (
                              <SelectItem key={profile.id} value={profile.id}>
                                {profile.display_name || profile.email}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="case_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Case</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value} disabled={!selectedClientId}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder={!selectedClientId ? "Select client first" : "Select case"} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {filteredCases.map((case_) => (
                              <SelectItem key={case_.id} value={case_.id}>
                                {case_.title}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Invoice description" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="due_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Due Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="payment_method"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Method</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="crypto">Crypto Only</SelectItem>
                          <SelectItem value="wire">Wire Transfer Only</SelectItem>
                          <SelectItem value="both">Both Methods</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Crypto Payment Amount */}
                {(paymentMethod === "crypto" || paymentMethod === "both") && (
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-3">Crypto Payment (USDT)</h4>
                    <FormField
                      control={form.control}
                      name="crypto_amount_usdt"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Amount (USDT)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="0.00"
                              {...field}
                              onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* Wire Transfer Amount */}
                {(paymentMethod === "wire" || paymentMethod === "both") && (
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-3">Wire Transfer</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="wire_amount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Amount</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.01"
                                placeholder="0.00"
                                {...field}
                                onChange={e => field.onChange(parseFloat(e.target.value) || 0)}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="wire_currency"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Currency</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value || "USD"}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select currency" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {SUPPORTED_CURRENCIES.map((currency) => (
                                  <SelectItem key={currency.code} value={currency.code}>
                                    {currency.symbol} {currency.name} ({currency.code})
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                )}

                {/* Crypto Configuration */}
                {(paymentMethod === "crypto" || paymentMethod === "both") && (
                  <div className="space-y-4">
                    <h4 className="font-medium">Crypto Payment Configuration</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="crypto_wallet_address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Wallet Address</FormLabel>
                            <FormControl>
                              <Input placeholder="0x..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="crypto_network"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Network</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="ethereum">Ethereum (ERC20)</SelectItem>
                                <SelectItem value="tron">TRON (TRC20)</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                )}

                {/* Wire Transfer Configuration */}
                {(paymentMethod === "wire" || paymentMethod === "both") && (
                  <div className="space-y-4">
                    <h4 className="font-medium">Wire Transfer Configuration</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="wire_bank_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bank Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Bank name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="wire_account_holder"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Account Holder</FormLabel>
                            <FormControl>
                              <Input placeholder="Account holder name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="wire_account_number"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Account Number</FormLabel>
                            <FormControl>
                              <Input placeholder="Account number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="wire_routing_number"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Routing Number</FormLabel>
                            <FormControl>
                              <Input placeholder="Routing number" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="wire_swift_code"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>SWIFT Code</FormLabel>
                            <FormControl>
                              <Input placeholder="SWIFT code" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="wire_bank_address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bank Address</FormLabel>
                            <FormControl>
                              <Input placeholder="Bank address" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Creating..." : "Create Invoice"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Invoices List */}
      <div className="grid gap-4">
        {invoices.map((invoice) => (
          <Card key={invoice.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">Invoice #{invoice.id.slice(0, 8)}</CardTitle>
                  <CardDescription>{invoice.description}</CardDescription>
                </div>
                {getStatusSelector(invoice)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {invoice.crypto_amount_usdt && (
                  <p><strong>Crypto Amount:</strong> {invoice.crypto_amount_usdt} USDT</p>
                )}
                {invoice.wire_amount && (
                  <p><strong>Wire Amount:</strong> {formatCurrency(invoice.wire_amount, invoice.wire_currency || 'USD')}</p>
                )}
                {!invoice.crypto_amount_usdt && !invoice.wire_amount && (
                  <p><strong>Amount:</strong> {formatCurrency(invoice.amount_due, invoice.currency)}</p>
                )}
                <p><strong>Case:</strong> {invoice.case?.title || 'N/A'}</p>
                <p><strong>Client:</strong> {invoice.profile?.display_name || invoice.profile?.email || 'N/A'}</p>
                <p><strong>Due Date:</strong> {new Date(invoice.due_date).toLocaleDateString()}</p>
                <p><strong>Payment Method:</strong> {invoice.payment_method || 'crypto'}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};