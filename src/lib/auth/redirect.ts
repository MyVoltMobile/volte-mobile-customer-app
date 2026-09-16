import * as Linking from 'expo-linking';

import type {
  AuthIntent,
} from '@/lib/auth/auth-intent';

export const AUTH_CALLBACK_PATH =
  'auth/callback';

export const AUTH_NATIVE_SCHEME =
  'voltemobilecustomerapp';

export function createAuthRedirectUrl(
  intent: AuthIntent,
) {
  return Linking.createURL(
    AUTH_CALLBACK_PATH,
    {
      scheme:
        AUTH_NATIVE_SCHEME,

      queryParams: {
        intent,
      },
    },
  );
}
