import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ||
    process.env.SUPABASE_URL?.trim();
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_KEY?.trim() ||
    process.env.SUPABASE_KEY?.trim();

  if (!url || !key) {
    throw new Error(
      "Missing Supabase credentials. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in web/.env.local.",
    );
  }

  return createBrowserClient(url, key);
}
