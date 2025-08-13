import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const authHeader = req.headers.get('Authorization')!;
    const token = authHeader.replace('Bearer ', '');
    
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: userRoles, error: roleError } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id);

    if (roleError || !userRoles?.some(r => r.role === 'admin')) {
      return new Response(JSON.stringify({ error: 'Admin access required' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { userId } = await req.json();

    if (!userId) {
      return new Response(JSON.stringify({ error: 'User ID is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(userId);

    if (userError) {
      console.error('Error fetching user details:', userError);
      return new Response(JSON.stringify({ error: userError.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const authDetails = {
      id: userData.user.id,
      email: userData.user.email,
      emailConfirmed: userData.user.email_confirmed_at !== null,
      emailConfirmedAt: userData.user.email_confirmed_at,
      createdAt: userData.user.created_at,
      lastSignIn: userData.user.last_sign_in_at,
      phoneNumber: userData.user.phone,
      phoneConfirmed: userData.user.phone_confirmed_at !== null,
      phoneConfirmedAt: userData.user.phone_confirmed_at,
      identities: userData.user.identities,
      userMetadata: userData.user.user_metadata,
      appMetadata: userData.user.app_metadata,
      providers: userData.user.identities?.map(i => i.provider) || []
    };

    return new Response(JSON.stringify({ success: true, authDetails }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in get-user-auth-details function:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});