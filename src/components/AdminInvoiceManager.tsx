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

const invoiceSchema = z.object({
  case_id: z.string().min(1, "Case is required"),
  user_id: z.string().min(1, "Client is required"),
  amount_due: z.number().min(0.01, "Amount must be greater than 0"),
  currency: z.string().default("USD"),
  description: z.string().min(1, "Description is required"),
  due_date: z.string().min(1, "Due date is required"),
  payment_method: z.string().default("crypto"),
  blockchain_network: z.string().default("ethereum"),
});

type InvoiceFormData = z.infer<typeof invoiceSchema>;

interface Invoice {
  id: string;
  case_id: string;
  user_id: string;
  amount_due: number;
  currency: string;
  invoice_status: string;
  due_date: string;
  description: string;
  created_at: string;
  updated_at: string;
  paid_at?: string;
  cases?: { title: string };
  profiles?: { display_name: string; email: string };
}

interface Case {
  id: string;
  title: string;
  user_id: string;
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
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const { toast } = useToast();

  const form = useForm<InvoiceFormData>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      currency: "USD",
      payment_method: "crypto",
      blockchain_network: "ethereum",
    },
  });

  // Watch for client selection to filter cases
  const selectedClientId = form.watch("user_id");
  
  // Filter cases based on selected client
  const filteredCases = selectedClientId 
    ? cases.filter(case_ => case_.user_id === selectedClientId)
    : [];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load invoices first
      const { data: invoicesData, error: invoicesError } = await supabase
        .from('client_invoices')
        .select('*')
        .order('created_at', { ascending: false });

      if (invoicesError) {
        console.error('Error loading invoices:', invoicesError);
        setInvoices([]);
      } else {
        // Load related cases and profiles
        const caseIds = [...new Set(invoicesData?.map(invoice => invoice.case_id) || [])];
        const userIds = [...new Set(invoicesData?.map(invoice => invoice.user_id) || [])];

        // Fetch cases
        const { data: casesData } = await supabase
          .from('cases')
          .select('id, title')
          .in('id', caseIds);

        // Fetch profiles  
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('id, display_name, email')
          .in('id', userIds);

        // Manually join the data
        const enrichedInvoices = invoicesData?.map(invoice => ({
          ...invoice,
          cases: casesData?.find(c => c.id === invoice.case_id),
          profiles: profilesData?.find(p => p.id === invoice.user_id)
        })) || [];

        setInvoices(enrichedInvoices);
      }

      // Load cases for dropdown
      const { data: casesData, error: casesError } = await supabase
        .from('cases')
        .select('id, title, user_id')
        .order('created_at', { ascending: false });

      if (casesError) {
        console.error('Error loading cases:', casesError);
      } else {
        setCases(casesData || []);
      }

      // Load profiles for dropdown
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, display_name, email')
        .order('display_name');

      if (profilesError) {
        console.error('Error loading profiles:', profilesError);
      } else {
        setProfiles(profilesData || []);
      }

    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: InvoiceFormData) => {
    try {
      const { error } = await supabase
        .from('client_invoices')
        .insert({
          ...data,
          due_date: new Date(data.due_date).toISOString(),
        });

      if (error) {
        console.error('Error creating invoice:', error);
        toast({
          title: "Error",
          description: "Failed to create invoice. Please try again.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Invoice Created",
        description: "Invoice has been successfully created and sent to client.",
      });

      setShowCreateDialog(false);
      form.reset();
      loadData();

    } catch (error) {
      console.error('Error creating invoice:', error);
      toast({
        title: "Error",
        description: "Failed to create invoice. Please try again.",
        variant: "destructive",
      });
    }
  };

  const updateInvoiceStatus = async (invoiceId: string, newStatus: string) => {
    if (updatingStatus === invoiceId) return;
    
    setUpdatingStatus(invoiceId);
    
    try {
      const updateData: any = { 
        invoice_status: newStatus 
      };
      
      // Handle paid_at timestamp
      if (newStatus === 'paid') {
        updateData.paid_at = new Date().toISOString();
      } else if (newStatus !== 'paid') {
        updateData.paid_at = null;
      }

      const { error } = await supabase
        .from('client_invoices')
        .update(updateData)
        .eq('id', invoiceId);

      if (error) {
        console.error('Error updating invoice status:', error);
        toast({
          title: "Error",
          description: "Failed to update invoice status. Please try again.",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Status Updated",
        description: `Invoice status changed to ${newStatus}.`,
      });

      loadData();
    } catch (error) {
      console.error('Error updating invoice status:', error);
      toast({
        title: "Error", 
        description: "Failed to update invoice status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUpdatingStatus(null);
    }
  };

  const getStatusSelector = (invoice: Invoice) => {
    const isUpdating = updatingStatus === invoice.id;
    
    return (
      <Select 
        value={invoice.invoice_status} 
        onValueChange={(value) => updateInvoiceStatus(invoice.id, value)}
        disabled={isUpdating}
      >
        <SelectTrigger className={`w-32 ${getStatusColor(invoice.invoice_status)} ${isUpdating ? 'opacity-50' : ''}`}>
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
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'text-green-700 border-green-300 bg-green-50';
      case 'overdue':
        return 'text-red-700 border-red-300 bg-red-50';
      case 'confirming':
        return 'text-blue-700 border-blue-300 bg-blue-50';
      case 'cancelled':
        return 'text-gray-700 border-gray-300 bg-gray-50';
      default:
        return 'text-yellow-700 border-yellow-300 bg-yellow-50';
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading invoices...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Invoice Management</h2>
          <p className="text-muted-foreground">Create and manage client invoices for case fees</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button>Create Invoice</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Invoice</DialogTitle>
              <DialogDescription>
                Generate a professional invoice for client payment
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="user_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Client</FormLabel>
                      <Select 
                        onValueChange={(value) => {
                          field.onChange(value);
                          // Clear case selection when client changes
                          form.setValue("case_id", "");
                        }} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a client first" />
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
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={
                              !selectedClientId 
                                ? "Select a client first" 
                                : filteredCases.length === 0 
                                  ? "No cases found for this client"
                                  : "Select a case"
                            } />
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

                <FormField
                  control={form.control}
                  name="amount_due"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount Due</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01" 
                          placeholder="0.00"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Legal consultation and case review fees"
                          {...field}
                        />
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

                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">Create Invoice</Button>
                  <Button type="button" variant="outline" onClick={() => setShowCreateDialog(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {invoices.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No invoices found. Create your first invoice to get started.
            </CardContent>
          </Card>
        ) : (
          invoices.map((invoice) => (
            <Card key={invoice.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Invoice #{invoice.id.slice(0, 8)}</CardTitle>
                    <CardDescription>
                      {invoice.cases?.title} - {invoice.profiles?.display_name || invoice.profiles?.email}
                    </CardDescription>
                  </div>
                  {getStatusSelector(invoice)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Amount:</span>
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
                <div className="mt-3">
                  <span className="text-muted-foreground">Description:</span>
                  <div className="text-sm">{invoice.description}</div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};