// Terminal Feed Edge Function
// GET /terminal-feed
// Public: Returns paginated transmissions for the Terminal 7-B feed

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

  // Only allow GET requests
  if (req.method !== 'GET') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    // Parse query parameters
    const url = new URL(req.url);
    const limit = Math.min(parseInt(url.searchParams.get('limit') || '20'), 100);
    const offset = parseInt(url.searchParams.get('offset') || '0');
    const kind = url.searchParams.get('kind');
    const clearance = parseInt(url.searchParams.get('clearance') || '1');
    const source = url.searchParams.get('source');
    const since = url.searchParams.get('since'); // ISO timestamp

    // Create Supabase client with anon key (public access)
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY');
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Build query
    let query = supabase
      .from('terminal_transmissions')
      .select('*')
      .eq('is_visible', true)
      .lte('clearance_level', clearance)
      .or(`display_from.is.null,display_from.lte.${new Date().toISOString()}`)
      .or(`display_until.is.null,display_until.gte.${new Date().toISOString()}`)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Apply filters
    if (kind) {
      query = query.eq('kind', kind);
    }
    if (source) {
      query = query.eq('source', source);
    }
    if (since) {
      query = query.gt('created_at', since);
    }

    // Execute query
    const { data: transmissions, error, count } = await query;

    if (error) {
      throw error;
    }

    // Get total count for pagination
    const { count: totalCount, error: countError } = await supabase
      .from('terminal_transmissions')
      .select('*', { count: 'exact', head: true })
      .eq('is_visible', true)
      .lte('clearance_level', clearance);

    if (countError) {
      throw countError;
    }

    // Get available kinds for filtering
    const { data: kindsData } = await supabase
      .from('terminal_transmissions')
      .select('kind')
      .eq('is_visible', true);
    
    const availableKinds = [...new Set(kindsData?.map(t => t.kind) || [])];

    return new Response(
      JSON.stringify({
        transmissions: transmissions || [],
        pagination: {
          total: totalCount || 0,
          limit,
          offset,
          hasMore: (offset + limit) < (totalCount || 0)
        },
        meta: {
          available_kinds: availableKinds,
          clearance_level: clearance,
          timestamp: new Date().toISOString()
        }
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Terminal feed error:', error);
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
