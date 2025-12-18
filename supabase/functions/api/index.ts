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

    const { action, data } = await req.json()

    let result

    switch (action) {
      case 'get_menu_items':
        const { data: menuItems, error: menuError } = await supabaseClient
          .from('menu_items')
          .select('*')
          .eq('available', true)
          .order('category', { ascending: true })
        if (menuError) throw menuError
        result = menuItems
        break

      case 'get_orders':
        const { customerId } = data
        const { data: orders, error: ordersError } = await supabaseClient
          .from('orders')
          .select(`
            *,
            order_items (
              *,
              menu_items (*)
            ),
            customers (*)
          `)
          .eq('customer_id', customerId)
          .order('created_at', { ascending: false })
        if (ordersError) throw ordersError
        result = orders
        break

      case 'get_promotions':
        const { data: promotions, error: promoError } = await supabaseClient
          .from('promotions')
          .select('*')
          .eq('active', true)
          .order('created_at', { ascending: false })
        if (promoError) throw promoError
        result = promotions
        break

      case 'get_delivery_zones':
        const { data: zones, error: zonesError } = await supabaseClient
          .from('delivery_zones')
          .select('*')
          .eq('active', true)
        if (zonesError) throw zonesError
        result = zones
        break

      case 'get_restaurant_settings':
        const { data: settings, error: settingsError } = await supabaseClient
          .from('restaurant_settings')
          .select('*')
          .single()
        if (settingsError) throw settingsError
        result = settings
        break

      default:
        throw new Error('Unknown action')
    }

    return new Response(
      JSON.stringify({ success: true, data: result }),
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