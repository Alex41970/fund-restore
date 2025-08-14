import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import EthereumProvider from "@walletconnect/ethereum-provider";

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
  const [connectingWallet, setConnectingWallet] = useState<string | null>(null);
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
      setConnectingWallet('metamask');
      
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
      setConnectingWallet(null);
    }
  };

  const connectWalletConnect = async () => {
    try {
      setConnecting(true);
      setConnectingWallet('walletconnect');

      // Get WalletConnect project ID from Supabase edge function
      const { data: projectConfig } = await supabase.functions.invoke('get-walletconnect-config');
      
      if (!projectConfig?.projectId) {
        throw new Error('WalletConnect configuration not found. Please contact support.');
      }

      // Initialize WalletConnect provider
      const provider = await EthereumProvider.init({
        projectId: projectConfig.projectId,
        chains: [1], // Ethereum mainnet
        showQrModal: true,
        metadata: {
          name: 'Lixington Capital Recovery',
          description: 'Legal services payment platform',
          url: window.location.origin,
          icons: [`${window.location.origin}/favicon-professional.png`]
        }
      });

      // Enable session (triggers QR Code modal)
      const accounts = await provider.enable();

      if (accounts.length === 0) {
        throw new Error("No accounts found");
      }

      const address = accounts[0];
      
      // Verify ownership by requesting a signature
      const message = `Verify wallet ownership for Lixington Capital Recovery - ${Date.now()}`;
      const signature = await provider.request({
        method: 'personal_sign',
        params: [message, address],
      });

      await saveWalletConnection(address, 'walletconnect');

    } catch (error: any) {
      console.error('Error connecting WalletConnect:', error);
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect wallet. Please try again.",
        variant: "destructive",
      });
    } finally {
      setConnecting(false);
      setConnectingWallet(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Connect Wallet for Payment</DialogTitle>
          <DialogDescription>
            Connect your cryptocurrency wallet to make secure payments for legal services.
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
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={connectMetaMask}
                  disabled={connecting}
                  variant={connectingWallet === 'metamask' ? 'default' : 'outline'}
                  size="lg"
                  className="flex flex-col gap-1 h-auto py-4"
                >
                  <span className="text-2xl">🦊</span>
                  <span className="text-sm">
                    {connectingWallet === 'metamask' ? "Connecting..." : "MetaMask"}
                  </span>
                </Button>
                
                <Button
                  onClick={connectWalletConnect}
                  disabled={connecting}
                  variant={connectingWallet === 'walletconnect' ? 'default' : 'outline'}
                  size="lg"
                  className="flex flex-col gap-1 h-auto py-4"
                >
                  <span className="text-2xl">🔗</span>
                  <span className="text-sm">
                    {connectingWallet === 'walletconnect' ? "Connecting..." : "WalletConnect"}
                  </span>
                </Button>
              </div>
              
              <Alert>
                <AlertDescription className="text-sm text-muted-foreground">
                  • Choose your preferred wallet connection method
                  • You will be asked to sign a message to verify ownership
                  • Your wallet address will be securely stored for payments
                </AlertDescription>
              </Alert>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};