import {
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  ActivityIndicator,
  Text,
  View,
} from 'react-native';

import {
  useLocalSearchParams,
} from 'expo-router';

import {
  BrandLogo,
} from '@/components/brand/brand-logo';

import {
  ShellScreen,
} from '@/components/shell/shell-screen';

import {
  parseAuthIntent,
} from '@/lib/auth/auth-intent';

import {
  getSupabaseClient,
} from '@/lib/auth/supabase';
import {
  getCustomerSession,
} from '@/lib/customer/customer-session';

type CallbackState =
  | 'verifying'
  | 'complete'
  | 'error';

type CallbackParams = {
  intent?:
    | string
    | string[];

  code?:
    | string
    | string[];

  error?:
    | string
    | string[];

  error_code?:
    | string
    | string[];

  error_description?:
    | string
    | string[];
};

function firstValue(
  value:
    | string
    | string[]
    | undefined,
) {
  if (
    Array.isArray(value)
  ) {
    return value[0] || '';
  }

  return value || '';
}

export default function AuthCallbackScreen() {
  const params =
    useLocalSearchParams<
      CallbackParams
    >();

  const started =
    useRef(false);

  const [state, setState] =
    useState<CallbackState>(
      'verifying',
    );

  const [
    message,
    setMessage,
  ] = useState(
    'Verifying your secure link...',
  );

  const intent =
    parseAuthIntent(
      params.intent,
    );

  const code =
    firstValue(
      params.code,
    );

  const authError =
    firstValue(
      params.error_description,
    ) ||
    firstValue(
      params.error,
    ) ||
    firstValue(
      params.error_code,
    );

  useEffect(() => {
    if (started.current) {
      return;
    }

    if (authError) {
      started.current = true;

      setState('error');
      setMessage(
        'This secure link could not be verified. Please request a new link and try again.',
      );

      return;
    }

    /*
     * Auth intent is navigation context only.
     * It never establishes identity or access.
     */
    if (!intent) {
      started.current = true;

      setState('error');
      setMessage(
        'This secure link is missing its account request context. Please request a new link and try again.',
      );

      return;
    }

    if (!code) {
      started.current = true;

      setState('error');
      setMessage(
        'This secure link is incomplete. Please request a new link and try again.',
      );

      return;
    }

    started.current = true;

    let active = true;

    async function completeCallback() {
      try {
        const supabase =
          getSupabaseClient();

        const {
          data,
          error,
        } =
          await supabase.auth
            .exchangeCodeForSession(
              code,
            );

        if (
          error ||
          !data.session
        ) {
          throw (
            error ||
            new Error(
              'No authenticated session was returned.',
            )
          );
        }

        try {
          await getCustomerSession(
            data.session.access_token,
          );
        } catch {
          if (!active) {
            return;
          }

          setState('error');

          setMessage(
            'Your secure sign-in was verified, but your VoLTE Mobile customer account could not be loaded. Please contact VoLTE Mobile if this continues.',
          );

          return;
        }

        if (!active) {
          return;
        }

        setState(
          'complete',
        );

        setMessage(
          'Your secure VoLTE Mobile customer account has been verified.',
        );
      } catch {
        if (!active) {
          return;
        }

        setState('error');

        setMessage(
          'This secure link could not be verified. Please request a new link and try again.',
        );
      }
    }

    void completeCallback();

    return () => {
      active = false;
    };
  }, [
    authError,
    code,
    intent,
  ]);

  const title =
    state === 'complete'
      ? 'Secure link verified'
      : state === 'error'
        ? 'Link verification failed'
        : 'Verifying your link';

  return (
    <ShellScreen
      eyebrow="Secure Access"
      title={title}
      description={message}
      headerAlign="center"
      header={
        <BrandLogo
          width={150}
        />
      }
    >
      <View
        style={{
          alignItems:
            'center',

          justifyContent:
            'center',

          minHeight: 72,
        }}
      >
        {state ===
        'verifying' ? (
          <ActivityIndicator
            size="small"
          />
        ) : (
          <Text
            style={{
              fontSize: 14,
              textAlign:
                'center',
            }}
          >
            {state ===
            'complete'
              ? 'Authentication complete.'
              : 'No account changes were made.'}
          </Text>
        )}
      </View>
    </ShellScreen>
  );
}
