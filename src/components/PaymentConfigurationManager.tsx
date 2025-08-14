import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit, Plus, Wallet, Building } from 'lucide-react';
import { toast } from 'sonner';

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
  created_at: string;
}

const PaymentConfigurationManager: React.FC = () => {
  const { user } = useAuth();
  const [configurations, setConfigurations] = useState<PaymentConfiguration[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingConfig, setEditingConfig] = useState<PaymentConfiguration | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    payment_method: 'crypto' as 'crypto' | 'wire_transfer',
    crypto_wallet_address: '',
    crypto_network: 'ethereum',
    crypto_currency: 'USDT',
    wire_bank_name: '',
    wire_account_number: '',
    wire_routing_number: '',
    wire_swift_code: '',
    wire_account_holder: '',
    wire_bank_address: '',
    is_active: true,
  });

  useEffect(() => {
    loadConfigurations();
  }, []);

  const loadConfigurations = async () => {
    try {
      const { data, error } = await supabase
        .from('payment_configurations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setConfigurations(data || []);
    } catch (error) {
      console.error('Error loading payment configurations:', error);
      toast.error('Failed to load payment configurations');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      payment_method: 'crypto',
      crypto_wallet_address: '',
      crypto_network: 'ethereum',
      crypto_currency: 'USDT',
      wire_bank_name: '',
      wire_account_number: '',
      wire_routing_number: '',
      wire_swift_code: '',
      wire_account_holder: '',
      wire_bank_address: '',
      is_active: true,
    });
    setEditingConfig(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const configData = {
        name: formData.name,
        payment_method: formData.payment_method,
        is_active: formData.is_active,
        created_by: user.id,
        ...(formData.payment_method === 'crypto' ? {
          crypto_wallet_address: formData.crypto_wallet_address,
          crypto_network: formData.crypto_network,
          crypto_currency: formData.crypto_currency,
        } : {
          wire_bank_name: formData.wire_bank_name,
          wire_account_number: formData.wire_account_number,
          wire_routing_number: formData.wire_routing_number,
          wire_swift_code: formData.wire_swift_code,
          wire_account_holder: formData.wire_account_holder,
          wire_bank_address: formData.wire_bank_address,
        }),
      };

      let error;
      if (editingConfig) {
        const { error: updateError } = await supabase
          .from('payment_configurations')
          .update(configData)
          .eq('id', editingConfig.id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from('payment_configurations')
          .insert([configData]);
        error = insertError;
      }

      if (error) throw error;

      toast.success(editingConfig ? 'Configuration updated successfully' : 'Configuration created successfully');
      setDialogOpen(false);
      resetForm();
      loadConfigurations();
    } catch (error) {
      console.error('Error saving payment configuration:', error);
      toast.error('Failed to save payment configuration');
    }
  };

  const handleEdit = (config: PaymentConfiguration) => {
    setFormData({
      name: config.name,
      payment_method: config.payment_method,
      crypto_wallet_address: config.crypto_wallet_address || '',
      crypto_network: config.crypto_network || 'ethereum',
      crypto_currency: config.crypto_currency || 'USDT',
      wire_bank_name: config.wire_bank_name || '',
      wire_account_number: config.wire_account_number || '',
      wire_routing_number: config.wire_routing_number || '',
      wire_swift_code: config.wire_swift_code || '',
      wire_account_holder: config.wire_account_holder || '',
      wire_bank_address: config.wire_bank_address || '',
      is_active: config.is_active,
    });
    setEditingConfig(config);
    setDialogOpen(true);
  };

  const handleDelete = async (configId: string) => {
    if (!confirm('Are you sure you want to delete this payment configuration?')) return;

    try {
      const { error } = await supabase
        .from('payment_configurations')
        .delete()
        .eq('id', configId);

      if (error) throw error;
      toast.success('Configuration deleted successfully');
      loadConfigurations();
    } catch (error) {
      console.error('Error deleting payment configuration:', error);
      toast.error('Failed to delete payment configuration');
    }
  };

  const toggleActive = async (configId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('payment_configurations')
        .update({ is_active: !isActive })
        .eq('id', configId);

      if (error) throw error;
      toast.success('Configuration status updated');
      loadConfigurations();
    } catch (error) {
      console.error('Error updating configuration status:', error);
      toast.error('Failed to update configuration status');
    }
  };

  if (loading) {
    return <div>Loading payment configurations...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Payment Configurations</h2>
          <p className="text-muted-foreground">Manage payment methods for invoices</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Add Configuration
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingConfig ? 'Edit Payment Configuration' : 'Add Payment Configuration'}
              </DialogTitle>
              <DialogDescription>
                Set up payment methods for receiving invoice payments
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Configuration Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="e.g. Main USDT ERC20 Wallet"
                      required
                    />
                </div>
                <div>
                  <Label htmlFor="payment_method">Payment Method</Label>
                  <Select
                    value={formData.payment_method}
                    onValueChange={(value: 'crypto' | 'wire_transfer') => 
                      setFormData({...formData, payment_method: value})
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="crypto">Cryptocurrency</SelectItem>
                      <SelectItem value="wire_transfer">Wire Transfer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {formData.payment_method === 'crypto' && (
                <div className="space-y-4 p-4 border rounded-lg">
                  <h4 className="font-medium flex items-center">
                    <Wallet className="w-4 h-4 mr-2" />
                    Cryptocurrency Details
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="crypto_network">USDT Network</Label>
                      <Select
                        value={formData.crypto_network}
                        onValueChange={(value) => {
                          setFormData({
                            ...formData, 
                            crypto_network: value,
                            crypto_currency: 'USDT'
                          });
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ethereum">Ethereum (ERC20)</SelectItem>
                          <SelectItem value="tron">TRON (TRC20)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="crypto_currency">Currency</Label>
                      <Input
                        id="crypto_currency"
                        value="USDT"
                        disabled
                        className="bg-muted"
                      />
                      <p className="text-xs text-muted-foreground mt-1">Only USDT is supported for crypto payments</p>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="crypto_wallet_address">Wallet Address</Label>
                    <Input
                      id="crypto_wallet_address"
                      value={formData.crypto_wallet_address}
                      onChange={(e) => setFormData({...formData, crypto_wallet_address: e.target.value})}
                      placeholder="0x..."
                      required={formData.payment_method === 'crypto'}
                    />
                  </div>
                </div>
              )}

              {formData.payment_method === 'wire_transfer' && (
                <div className="space-y-4 p-4 border rounded-lg">
                  <h4 className="font-medium flex items-center">
                    <Building className="w-4 h-4 mr-2" />
                    Wire Transfer Details
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="wire_bank_name">Bank Name</Label>
                      <Input
                        id="wire_bank_name"
                        value={formData.wire_bank_name}
                        onChange={(e) => setFormData({...formData, wire_bank_name: e.target.value})}
                        required={formData.payment_method === 'wire_transfer'}
                      />
                    </div>
                    <div>
                      <Label htmlFor="wire_account_holder">Account Holder</Label>
                      <Input
                        id="wire_account_holder"
                        value={formData.wire_account_holder}
                        onChange={(e) => setFormData({...formData, wire_account_holder: e.target.value})}
                        required={formData.payment_method === 'wire_transfer'}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="wire_account_number">Account Number</Label>
                      <Input
                        id="wire_account_number"
                        value={formData.wire_account_number}
                        onChange={(e) => setFormData({...formData, wire_account_number: e.target.value})}
                        required={formData.payment_method === 'wire_transfer'}
                      />
                    </div>
                    <div>
                      <Label htmlFor="wire_routing_number">Routing Number</Label>
                      <Input
                        id="wire_routing_number"
                        value={formData.wire_routing_number}
                        onChange={(e) => setFormData({...formData, wire_routing_number: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="wire_swift_code">SWIFT Code</Label>
                      <Input
                        id="wire_swift_code"
                        value={formData.wire_swift_code}
                        onChange={(e) => setFormData({...formData, wire_swift_code: e.target.value})}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="wire_bank_address">Bank Address</Label>
                    <Textarea
                      id="wire_bank_address"
                      value={formData.wire_bank_address}
                      onChange={(e) => setFormData({...formData, wire_bank_address: e.target.value})}
                      rows={3}
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({...formData, is_active: checked})}
                />
                <Label htmlFor="is_active">Active</Label>
              </div>

              <div className="flex gap-2">
                <Button type="submit">
                  {editingConfig ? 'Update Configuration' : 'Create Configuration'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {configurations.map((config) => (
          <Card key={config.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {config.payment_method === 'crypto' ? (
                      <Wallet className="w-5 h-5" />
                    ) : (
                      <Building className="w-5 h-5" />
                    )}
                    {config.name}
                    <Badge variant={config.is_active ? 'default' : 'secondary'}>
                      {config.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </CardTitle>
                  <CardDescription>
                    {config.payment_method === 'crypto' ? 'Cryptocurrency Payment' : 'Wire Transfer Payment'}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Switch
                    checked={config.is_active}
                    onCheckedChange={() => toggleActive(config.id, config.is_active)}
                  />
                  <Button variant="outline" size="sm" onClick={() => handleEdit(config)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(config.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {config.payment_method === 'crypto' ? (
                <div className="space-y-2">
                  <div><strong>Network:</strong> {config.crypto_network}</div>
                  <div><strong>Currency:</strong> {config.crypto_currency}</div>
                  <div><strong>Wallet Address:</strong> <code className="text-sm">{config.crypto_wallet_address}</code></div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div><strong>Bank:</strong> {config.wire_bank_name}</div>
                  <div><strong>Account Holder:</strong> {config.wire_account_holder}</div>
                  <div><strong>Account Number:</strong> {config.wire_account_number}</div>
                  {config.wire_routing_number && <div><strong>Routing Number:</strong> {config.wire_routing_number}</div>}
                  {config.wire_swift_code && <div><strong>SWIFT Code:</strong> {config.wire_swift_code}</div>}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {configurations.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">No payment configurations found. Create your first one to start receiving payments.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PaymentConfigurationManager;