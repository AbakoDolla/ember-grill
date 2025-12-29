import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    const { orderId, paymentMethod, paymentDetails } = await req.json()

    // Get order details
    const { data: order, error: orderError } = await supabaseClient
      .from('orders')
      .select('*, customers(*)')
      .eq('id', orderId)
      .single()

    if (orderError || !order) {
      throw new Error('Order not found')
    }

    // Process payment (simplified - in production, integrate with Stripe/PayPal)
    const paymentSuccess = true // Simulate payment success
    const transactionId = `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Update order with payment info
    const { error: updateError } = await supabaseClient
      .from('orders')
      .update({
        status: paymentSuccess ? 'confirmed' : 'cancelled',
        payment_status: paymentSuccess ? 'paid' : 'failed',
        payment_method: paymentMethod,
        payment_transaction_id: transactionId,
        paid_at: paymentSuccess ? new Date().toISOString() : null
      })
      .eq('id', orderId)

    if (updateError) throw updateError

    // Create notification
    await supabaseClient
      .from('notifications')
      .insert({
        customer_id: order.customer_id,
        type: 'order_status',
        title: paymentSuccess ? 'Payment Successful' : 'Payment Failed',
        message: paymentSuccess
          ? `Payment for order #${orderId.slice(0, 8)} has been processed successfully.`
          : `Payment for order #${orderId.slice(0, 8)} failed. Please try again.`,
        data: { order_id: orderId, status: paymentSuccess ? 'paid' : 'payment_failed' }
      })

    return new Response(
      JSON.stringify({
        success: paymentSuccess,
        transactionId,
        orderId
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})