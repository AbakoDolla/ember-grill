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

    const { customerId, type, title, message, data } = await req.json()

    // Create notification in database
    const { data: notification, error: notificationError } = await supabaseClient
      .from('notifications')
      .insert({
        customer_id: customerId,
        type,
        title,
        message,
        data
      })
      .select()
      .single()

    if (notificationError) throw notificationError

    // In a real implementation, you would integrate with email/SMS services here
    // For now, we'll just log the notification
    console.log('Notification sent:', {
      customerId,
      type,
      title,
      message,
      data
    })

    return new Response(
      JSON.stringify({
        success: true,
        notificationId: notification.id
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