import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
export const supabaseReady = Boolean(url && key && !key.includes("PASTE_"));
export const supabase = supabaseReady ? createClient(url, key) : null;
export const ADMIN_EMAIL = (import.meta.env.VITE_ADMIN_EMAIL || "").toLowerCase();
export const STORE_WHATSAPP = (import.meta.env.VITE_STORE_WHATSAPP || "").replace(/\D/g, "");
