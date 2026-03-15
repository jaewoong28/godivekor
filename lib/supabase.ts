import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

let supabase: SupabaseClient;

if (supabaseUrl.startsWith("http")) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
  // Supabase가 설정되지 않은 경우 더미 클라이언트
  supabase = null as unknown as SupabaseClient;
}

export { supabase };

export function isSupabaseConfigured(): boolean {
  return supabaseUrl.startsWith("http") && supabaseAnonKey.length > 0;
}
