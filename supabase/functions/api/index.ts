import { serve } from "https://deno.land/std@0.208.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
}

serve(async (req: Request) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY")

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error("Missing Supabase environment variables")
    }

    const supabaseClient = createClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        global: {
          headers: {
            Authorization: req.headers.get("Authorization") ?? "",
          },
        },
      }
    )

    const { action, data } = await req.json()

    let result: unknown

    switch (action) {
      case "get_menu_items": {
        const { data: menuItems, error } = await supabaseClient
          .from("menu_items")
          .select("*")
          .eq("available", true)
          .order("category", { ascending: true })

        if (error) throw error
        result = menuItems
        break
      }

      case "get_orders": {
        const { customerId } = data

        const { data: orders, error } = await supabaseClient
          .from("orders")
          .select(`
            *,
            order_items (
              *,
              menu_items (*)
            ),
            customers (*)
          `)
          .eq("customer_id", customerId)
          .order("created_at", { ascending: false })

        if (error) throw error
        result = orders
        break
      }

      case "get_promotions": {
        const { data: promotions, error } = await supabaseClient
          .from("promotions")
          .select("*")
          .eq("active", true)
          .order("created_at", { ascending: false })

        if (error) throw error
        result = promotions
        break
      }

      case "get_delivery_zones": {
        const { data: zones, error } = await supabaseClient
          .from("delivery_zones")
          .select("*")
          .eq("active", true)

        if (error) throw error
        result = zones
        break
      }

      case "get_restaurant_settings": {
        const { data: settings, error } = await supabaseClient
          .from("restaurant_settings")
          .select("*")
          .single()

        if (error) throw error
        result = settings
        break
      }

      default:
        throw new Error("Unknown action")
    }

    return new Response(
      JSON.stringify({ success: true, data: result }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    )
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Unexpected error"

    return new Response(
      JSON.stringify({ success: false, error: message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    )
  }
})
