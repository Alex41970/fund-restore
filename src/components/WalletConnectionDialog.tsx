import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

interface WalletConnectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onWalletConnected?: (address: string) => void;
}

declare global {
  interface Window {
    ethereum?: any;
  }
}

export const WalletConnectionDialog = ({ open, onOpenChange, onWalletConnected }: WalletConnectionDialogProps) => {
  const [connecting, setConnecting] = useState(false);
  const [connectedAddress, setConnectedAddress] = useState<string | null>(null);
  const [connectedWalletType, setConnectedWalletType] = useState<string | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const saveWalletConnection = async (address: string, walletType: string) => {
    const { error } = await supabase
      .from('wallet_connections')
      .insert({
        user_id: user?.id,
        wallet_address: address.toLowerCase(),
        wallet_type: walletType,
        verification_status: 'verified',
        blockchain_network: 'ethereum'
      });

    if (error) {
      console.error('Error saving wallet connection:', error);
      toast({
        title: "Connection Error",
        description: "Failed to save wallet connection. Please try again.",
        variant: "destructive",
      });
      return false;
    }

    setConnectedAddress(address);
    setConnectedWalletType(walletType);
    onWalletConnected?.(address);
    
    toast({
      title: "Wallet Connected",
      description: `Successfully connected ${address.slice(0, 6)}...${address.slice(-4)}`,
    });
    
    return true;
  };

  const connectMetaMask = async () => {
    if (!window.ethereum) {
      toast({
        title: "MetaMask Not Found",
        description: "Please install MetaMask to connect your wallet.",
        variant: "destructive",
      });
      return;
    }

    try {
      setConnecting(true);
      
      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      if (accounts.length === 0) {
        throw new Error("No accounts found");
      }

      const address = accounts[0];
      
      // Verify ownership by requesting a signature
      const message = `Verify wallet ownership for Lixington Capital Recovery - ${Date.now()}`;
      const signature = await window.ethereum.request({
        method: 'personal_sign',
        params: [message, address],
      });

      await saveWalletConnection(address, 'metamask');

    } catch (error: any) {
      console.error('Error connecting wallet:', error);
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect wallet. Please try again.",
        variant: "destructive",
      });
    } finally {
      setConnecting(false);
    }
  };


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Connect MetaMask Wallet</DialogTitle>
          <DialogDescription>
            Connect your MetaMask wallet to make secure cryptocurrency payments for legal services.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {connectedAddress ? (
            <Alert>
              <AlertDescription>
                <div className="flex items-center justify-between">
                  <span>Connected: {connectedAddress.slice(0, 6)}...{connectedAddress.slice(-4)}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{connectedWalletType}</Badge>
                    <Badge variant="secondary">Verified</Badge>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-3">
              <Button
                onClick={connectMetaMask}
                disabled={connecting}
                size="lg"
                className="w-full flex items-center gap-3 h-auto py-4"
              >
                <span className="text-2xl">🦊</span>
                <span>
                  {connecting ? "Connecting..." : "Connect MetaMask Wallet"}
                </span>
              </Button>
              
              <Alert>
                <AlertDescription className="text-sm text-muted-foreground">
                  • You will be asked to sign a message to verify ownership
                  • Your wallet address will be securely stored for payments
                  • MetaMask extension is required for this connection
                </AlertDescription>
              </Alert>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};