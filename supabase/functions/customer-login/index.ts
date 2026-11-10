import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status, headers: { ...corsHeaders, "Content-Type": "application/json" },
});

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    const body = await req.json();
    const url = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const adminClient = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });

    if (body.action === "check-username") {
      const username = String(body.username || "").trim().toLowerCase();
      if (!/^[a-z0-9_]{3,20}$/.test(username)) return json({ available: false, error: "Use 3–20 letters, numbers or underscores." }, 400);
      const { data: existing, error } = await adminClient.from("customer_profiles").select("id").eq("username", username).maybeSingle();
      if (error) return json({ error: "Could not check username availability." }, 500);
      return json({ available: !existing });
    }

    const value = String(body.identifier || "").trim();
    const secret = String(body.password || "");
    if (!value || !secret || secret.length > 128) return json({ error: "Invalid username or password." }, 400);
    const publicClient = createClient(url, anonKey, { auth: { persistSession: false, autoRefreshToken: false } });

    let email = value.toLowerCase();
    if (!value.includes("@")) {
      const { data: profile, error: profileError } = await adminClient
        .from("customer_profiles").select("id").eq("username", value.toLowerCase()).maybeSingle();
      if (profileError || !profile?.id) return json({ error: "Invalid username or password." }, 401);
      const { data: userData, error: userError } = await adminClient.auth.admin.getUserById(profile.id);
      if (userError || !userData.user?.email) return json({ error: "Invalid username or password." }, 401);
      email = userData.user.email;
    }

    const { data, error } = await publicClient.auth.signInWithPassword({ email, password: secret });
    if (error || !data.session) return json({ error: "Invalid username or password." }, 401);
    return json({ session: data.session });
  } catch (_error) {
    return json({ error: "Unable to sign in right now. Please try again or contact the store." }, 500);
  }
});
