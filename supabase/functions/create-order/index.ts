import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
}

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

    const { customerData, cartItems, deliveryAddress, specialInstructions, promotionCode, requestedDeliveryDate, estimatedDeliveryTime } = await req.json()

    // Calculate totals
    const subtotal = cartItems.reduce((sum: number, item: CartItem) => sum + (item.price * item.quantity), 0)
    const deliveryFee = subtotal > 50 ? 0 : 4.99
    let discount = 0

    // Apply promotion if provided
    if (promotionCode) {
      const { data: promotion } = await supabaseClient
        .from('promotions')
        .select('*')
        .eq('code', promotionCode)
        .eq('active', true)
        .single()

      if (promotion) {
        if (promotion.discount_type === 'percentage') {
          discount = subtotal * (promotion.discount_value / 100)
        } else {
          discount = promotion.discount_value
        }
        discount = Math.min(discount, subtotal)
      }
    }

    const totalAmount = subtotal + deliveryFee - discount

    // Create or get customer
    let customerId
    const { data: existingCustomer } = await supabaseClient
      .from('customers')
      .select('id')
      .eq('email', customerData.email)
      .single()

    if (existingCustomer) {
      customerId = existingCustomer.id
    } else {
      const { data: newCustomer, error: customerError } = await supabaseClient
        .from('customers')
        .insert({
          email: customerData.email,
          first_name: customerData.firstName,
          last_name: customerData.lastName,
          phone: customerData.phone
        })
        .select('id')
        .single()

      if (customerError) throw customerError
      customerId = newCustomer.id
    }

    // Create order
    const { data: order, error: orderError } = await supabaseClient
      .from('orders')
      .insert({
        customer_id: customerId,
        total_amount: totalAmount,
        delivery_address: deliveryAddress,
        delivery_fee: deliveryFee,
        special_instructions: specialInstructions,
        requested_delivery_date: requestedDeliveryDate,
        estimated_delivery_time: estimatedDeliveryTime,
        payment_status: 'pending' // Payment will be collected immediately after order confirmation
      })
      .select('id')
      .single()

    if (orderError) throw orderError

    // Create order items
    const orderItems = cartItems.map((item: CartItem) => ({
      order_id: order.id,
      menu_item_id: item.id,
      quantity: item.quantity,
      unit_price: item.price,
      special_requests: null
    }))

    const { error: itemsError } = await supabaseClient
      .from('order_items')
      .insert(orderItems)

    if (itemsError) throw itemsError

    // Create promotion usage if applied
    if (promotionCode && discount > 0) {
      const { data: promotion } = await supabaseClient
        .from('promotions')
        .select('id')
        .eq('code', promotionCode)
        .single()

      if (promotion) {
        await supabaseClient
          .from('order_promotions')
          .insert({
            order_id: order.id,
            promotion_id: promotion.id,
            discount_amount: discount
          })
      }
    }

    // Create notification
    await supabaseClient
      .from('notifications')
      .insert({
        customer_id: customerId,
        type: 'order_status',
        title: 'Order Confirmed',
        message: `Your order #${order.id.slice(0, 8)} has been confirmed and is being prepared.`,
        data: { order_id: order.id, status: 'confirmed' }
      })

    return new Response(
      JSON.stringify({
        success: true,
        orderId: order.id,
        totalAmount,
        estimatedDelivery: new Date(Date.now() + 45 * 60 * 1000).toISOString()
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