import * as ethers from 'ethers';

// USDT Contract addresses
const USDT_CONTRACTS = {
  ethereum: '0xdAC17F958D2ee523a2206206994597C13D831ec7', // Ethereum USDT
  tron: 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t' // TRON USDT (TRC20)
};

// ERC20 ABI for USDT transfers
const ERC20_ABI = [
  'function transfer(address to, uint256 amount) returns (bool)',
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'function approve(address spender, uint256 amount) returns (bool)'
];

export interface PaymentParams {
  amount: number;
  recipientAddress: string;
  network: 'ethereum' | 'tron';
  invoiceId: string;
}

export interface PaymentResult {
  success: boolean;
  transactionHash?: string;
  error?: string;
}

export const processMetaMaskPayment = async (params: PaymentParams): Promise<PaymentResult> => {
  const { amount, recipientAddress, network, invoiceId } = params;

  try {
    if (!window.ethereum) {
      throw new Error('MetaMask is not installed');
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const userAddress = await signer.getAddress();

    // Handle TRON network differently (would need TronWeb)
    if (network === 'tron') {
      throw new Error('TRON payments through MetaMask are not supported. Please use manual transfer.');
    }

    // For Ethereum network
    const usdtContract = new ethers.Contract(USDT_CONTRACTS.ethereum, ERC20_ABI, signer);
    
    // Convert amount to USDT decimals (6 decimals for USDT)
    const amountInWei = ethers.parseUnits(amount.toString(), 6);

    // Check user's USDT balance
    const balance = await usdtContract.balanceOf(userAddress);
    if (balance < amountInWei) {
      throw new Error(`Insufficient USDT balance. You have ${ethers.formatUnits(balance, 6)} USDT`);
    }

    // Execute the transfer
    const transaction = await usdtContract.transfer(recipientAddress, amountInWei);
    
    return {
      success: true,
      transactionHash: transaction.hash
    };

  } catch (error: any) {
    console.error('Payment error:', error);
    return {
      success: false,
      error: error.message || 'Transaction failed'
    };
  }
};

export const waitForTransaction = async (transactionHash: string): Promise<boolean> => {
  try {
    if (!window.ethereum) return false;
    
    const provider = new ethers.BrowserProvider(window.ethereum);
    const receipt = await provider.waitForTransaction(transactionHash);
    
    return receipt?.status === 1;
  } catch (error) {
    console.error('Error waiting for transaction:', error);
    return false;
  }
};

export const checkNetworkAndSwitch = async (targetNetwork: 'ethereum' | 'tron'): Promise<boolean> => {
  try {
    if (!window.ethereum) return false;

    const chainId = targetNetwork === 'ethereum' ? '0x1' : '0x2b6653dc'; // Ethereum mainnet or TRON

    if (targetNetwork === 'tron') {
      throw new Error('Please switch to TRON network manually in your wallet for TRC20 transfers');
    }

    // Request network switch for Ethereum
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId }],
      });
      return true;
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        // Network not added to MetaMask
        throw new Error('Please add Ethereum mainnet to your MetaMask');
      }
      throw switchError;
    }
  } catch (error) {
    console.error('Network switch error:', error);
    return false;
  }
};