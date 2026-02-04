// Terminal Transmit Edge Function
// POST /terminal-transmit
// Service-role only: Creates new transmissions (Kermit thoughts, system events, etc.)

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Validate service role key
    const authHeader = req.headers.get('authorization');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!authHeader || !serviceRoleKey || !authHeader.includes(serviceRoleKey.slice(-20))) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized - service role required' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse request body
    const body = await req.json();
    const {
      kind,
      content,
      title,
      source,
      source_id,
      priority = 'normal',
      clearance_level = 1,
      display_from,
      display_until,
      canon_refs,
      generation_prompt,
      generated_at
    } = body;

    // Validate required fields
    if (!kind || !content) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: kind, content' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate kind
    const validKinds = ['kermit_thought', 'system_event', 'curated_comm', 'archive_fragment', 'transmission'];
    if (!validKinds.includes(kind)) {
      return new Response(
        JSON.stringify({ error: `Invalid kind. Must be one of: ${validKinds.join(', ')}` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Supabase client with service role
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabase = createClient(supabaseUrl, serviceRoleKey);

    // Insert transmission
    const { data, error } = await supabase
      .from('terminal_transmissions')
      .insert({
        kind,
        content,
        title,
        source,
        source_id,
        priority,
        clearance_level,
        display_from,
        display_until,
        canon_refs,
        generation_prompt,
        generated_at,
        is_visible: true
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        transmission: data 
      }),
      { 
        status: 201, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Terminal transmit error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
