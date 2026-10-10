import { createBrowserClient } from "@supabase/ssr";

// Клиент для клиентских компонентов (браузер).
// Если переменные окружения не заданы — возвращаем null, и приложение
// работает в анонимном режиме с прогрессом в localStorage.
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createBrowserClient(url, key);
}

export const isSupabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);
