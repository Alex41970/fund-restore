import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PaymentVerificationRequest {
  transactionHash: string;
  invoiceId: string;
}

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { transactionHash, invoiceId }: PaymentVerificationRequest = await req.json();

    console.log('Verifying payment:', { transactionHash, invoiceId });

    // In a real implementation, you would verify the transaction on the blockchain
    // For this example, we'll simulate verification after a delay
    
    // Get the payment record
    const { data: payment, error: paymentError } = await supabase
      .from('crypto_payments')
      .select('*')
      .eq('transaction_hash', transactionHash)
      .eq('invoice_id', invoiceId)
      .single();

    if (paymentError || !payment) {
      console.error('Payment not found:', paymentError);
      return new Response(
        JSON.stringify({ error: 'Payment not found' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Simulate blockchain verification (in production, call actual blockchain RPC)
    const isValid = true; // In reality, verify transaction on blockchain
    const confirmationCount = 12; // Simulate 12 confirmations

    if (isValid && confirmationCount >= 6) {
      // Update payment status to confirmed
      const { error: updatePaymentError } = await supabase
        .from('crypto_payments')
        .update({
          confirmation_status: 'confirmed',
          confirmed_at: new Date().toISOString()
        })
        .eq('id', payment.id);

      if (updatePaymentError) {
        console.error('Error updating payment:', updatePaymentError);
        throw updatePaymentError;
      }

      // Update invoice status to paid
      const { error: updateInvoiceError } = await supabase
        .from('client_invoices')
        .update({
          invoice_status: 'paid',
          paid_at: new Date().toISOString()
        })
        .eq('id', invoiceId);

      if (updateInvoiceError) {
        console.error('Error updating invoice:', updateInvoiceError);
        throw updateInvoiceError;
      }

      // Update case status if needed
      const { data: invoice } = await supabase
        .from('client_invoices')
        .select('case_id')
        .eq('id', invoiceId)
        .single();

      if (invoice?.case_id) {
        await supabase
          .from('cases')
          .update({ status: 'in_progress' })
          .eq('id', invoice.case_id);
      }

      console.log('Payment confirmed and processed successfully');

      return new Response(
        JSON.stringify({
          success: true,
          message: 'Payment confirmed successfully',
          confirmations: confirmationCount
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    } else {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Payment not yet confirmed',
          confirmations: confirmationCount
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

  } catch (error) {
    console.error('Error in verify-payment function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});