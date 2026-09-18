import {
  getSupabaseClient,
} from '@/lib/auth/supabase';

function customerApiBaseUrl() {
  const configured =
    process.env
      .EXPO_PUBLIC_API_BASE_URL
      ?.trim() || '';

  if (!configured) {
    throw new Error(
      'VoLTE Mobile customer API configuration is missing.',
    );
  }

  const normalized =
    configured.replace(/\/+$/, '');

  if (!normalized.startsWith('https://')) {
    throw new Error(
      'VoLTE Mobile customer API configuration is invalid.',
    );
  }

  return normalized;
}

export async function authenticatedCustomerFetch(
  path: string,
  init: RequestInit = {},
) {
  if (
    !path.startsWith(
      '/api/public/',
    )
  ) {
    throw new Error(
      'Customer API path is not permitted.',
    );
  }

  const supabase =
    getSupabaseClient();

  const {
    data,
    error,
  } =
    await supabase.auth
      .getSession();

  if (
    error ||
    !data.session
  ) {
    throw new Error(
      'Authenticated customer session is missing.',
    );
  }

  const headers =
    new Headers(init.headers);

  headers.set(
    'Accept',
    'application/json',
  );

  headers.set(
    'Authorization',
    `Bearer ${data.session.access_token}`,
  );

  return fetch(
    `${customerApiBaseUrl()}${path}`,
    {
      ...init,
      headers,
    },
  );
}
