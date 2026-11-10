import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status, headers: { ...corsHeaders, "Content-Type": "application/json" },
});
function makeTemporaryPassword() {
  const groups = ["ABCDEFGHJKLMNPQRSTUVWXYZ", "abcdefghijkmnopqrstuvwxyz", "23456789", "!@#$%"];
  const alphabet = groups.join("");
  const random = (max: number) => crypto.getRandomValues(new Uint32Array(1))[0] % max;
  const chars = groups.map(group => group[random(group.length)]);
  while (chars.length < 10) chars.push(alphabet[random(alphabet.length)]);
  for (let i = chars.length - 1; i > 0; i--) {
    const j = random(i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars.join("");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    const token = (req.headers.get("Authorization") || "").replace(/^Bearer\s+/i, "");
    if (!token) return json({ error: "Not authorised." }, 401);

    const url = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const adminEmail = (Deno.env.get("BALAJI_ADMIN_EMAIL") || "").toLowerCase();
    if (!adminEmail) return json({ error: "Store admin email secret is not configured." }, 500);

    const authClient = createClient(url, anonKey, { auth: { persistSession: false, autoRefreshToken: false } });
    const { data: authData, error: authError } = await authClient.auth.getUser(token);
    if (authError || authData.user?.email?.toLowerCase() !== adminEmail) {
      return json({ error: "Only the authorised store admin can manage customer accounts." }, 403);
    }

    const adminClient = createClient(url, serviceKey, { auth: { persistSession: false, autoRefreshToken: false } });
    const body = await req.json();
    if (body.action === "list") {
      const { data, error } = await adminClient.from("customer_profiles")
        .select("id,username,full_name,phone,updated_at,must_change_password")
        .order("updated_at", { ascending: false });
      if (error) return json({ error: "Could not load customer accounts." }, 500);
      return json({ customers: data || [] });
    }

    const customerId = String(body.customer_id || "");
    if (body.action !== "reset" || !/^[0-9a-f-]{36}$/i.test(customerId)) {
      return json({ error: "Invalid customer account request." }, 400);
    }
    const { data: profile, error: profileError } = await adminClient.from("customer_profiles")
      .select("id,full_name,username").eq("id", customerId).maybeSingle();
    if (profileError || !profile) return json({ error: "Customer account not found." }, 404);

    const temporaryPassword = makeTemporaryPassword();
    const { error: passwordError } = await adminClient.auth.admin.updateUserById(customerId, { password: temporaryPassword });
    if (passwordError) return json({ error: "Could not reset this customer's password." }, 500);
    const { error: flagError } = await adminClient.from("customer_profiles")
      .update({ must_change_password: true, updated_at: new Date().toISOString() }).eq("id", customerId);
    if (flagError) return json({ error: "Password reset, but the temporary-password flag could not be saved. Contact technical support." }, 500);

    return json({ temporary_password: temporaryPassword, customer: { id: profile.id, full_name: profile.full_name, username: profile.username } });
  } catch (_error) {
    return json({ error: "Customer account request could not be completed." }, 500);
  }
});
