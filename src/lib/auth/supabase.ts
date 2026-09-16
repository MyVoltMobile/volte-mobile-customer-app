import 'react-native-url-polyfill/auto';

import {
  createClient,
  type SupabaseClient,
} from '@supabase/supabase-js';

import {
  authSessionStorage,
} from '@/lib/auth/session-storage';

let client:
  SupabaseClient | null = null;

function publicConfiguration() {
  const url =
    process.env
      .EXPO_PUBLIC_SUPABASE_URL
      ?.trim() || '';

  const anonKey =
    process.env
      .EXPO_PUBLIC_SUPABASE_ANON_KEY
      ?.trim() || '';

  if (!url || !anonKey) {
    throw new Error(
      'VoLTE Mobile public authentication configuration is missing.',
    );
  }

  return {
    url,
    anonKey,
  };
}

export function getSupabaseClient() {
  if (client) {
    return client;
  }

  const {
    url,
    anonKey,
  } = publicConfiguration();

  client = createClient(
    url,
    anonKey,
    {
      auth: {
        storage:
          authSessionStorage,

        autoRefreshToken:
          true,

        persistSession:
          true,

        detectSessionInUrl:
          false,

        flowType:
          'pkce',
      },
    },
  );

  return client;
}
