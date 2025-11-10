import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// ✅ client untuk frontend (read-only / public)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ✅ client untuk backend (punya akses penuh, dipakai di /api)
export const backendSupabase = createClient(supabaseUrl, supabaseServiceRoleKey);
