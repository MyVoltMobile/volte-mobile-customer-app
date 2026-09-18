import type {
  Session,
} from '@supabase/supabase-js';
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  AppState,
  type AppStateStatus,
  Platform,
} from 'react-native';

import {
  getSupabaseClient,
} from '@/lib/auth/supabase';
import {
  getCustomerSession,
  type CustomerSessionProfile,
  type CustomerSessionResult,
} from '@/lib/customer/customer-session';

export type CustomerSessionStatus =
  | 'loading'
  | 'signed-out'
  | 'authenticated'
  | 'rejected';

type CustomerSessionContextValue = {
  status: CustomerSessionStatus;
  customer: CustomerSessionProfile | null;
  verifyCustomerSession: (
    session: Session,
  ) => Promise<CustomerSessionResult>;
};

const CustomerSessionContext =
  createContext<
    CustomerSessionContextValue | null
  >(null);

export function CustomerSessionProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [status, setStatus] =
    useState<CustomerSessionStatus>(
      'loading',
    );

  const [customer, setCustomer] =
    useState<
      CustomerSessionProfile | null
    >(null);

  const mounted =
    useRef(false);

  const requestSequence =
    useRef(0);

  const markSignedOut =
    useCallback(() => {
      requestSequence.current += 1;

      if (!mounted.current) {
        return;
      }

      setCustomer(null);
      setStatus('signed-out');
    }, []);

  const verifyCustomerSession =
    useCallback(
      async (
        session: Session,
      ): Promise<CustomerSessionResult> => {
        const requestId =
          ++requestSequence.current;

        if (mounted.current) {
          setCustomer(null);
          setStatus('loading');
        }

        try {
          const result =
            await getCustomerSession(
              session.access_token,
            );

          if (
            mounted.current &&
            requestId ===
              requestSequence.current
          ) {
            setCustomer(
              result.customer,
            );

            setStatus(
              'authenticated',
            );
          }

          return result;
        } catch (error) {
          if (
            mounted.current &&
            requestId ===
              requestSequence.current
          ) {
            setCustomer(null);
            setStatus('rejected');
          }

          throw error;
        }
      },
      [],
    );

  useEffect(() => {
    mounted.current = true;

    return () => {
      mounted.current = false;
      requestSequence.current += 1;
    };
  }, []);

  useEffect(() => {
    const supabase =
      getSupabaseClient();

    let cancelled = false;

    async function bootstrap() {
      const {
        data,
        error,
      } =
        await supabase.auth
          .getSession();

      if (
        cancelled ||
        !mounted.current
      ) {
        return;
      }

      if (
        error ||
        !data.session
      ) {
        markSignedOut();
        return;
      }

      try {
        await verifyCustomerSession(
          data.session,
        );
      } catch {
        /*
         * Rejected customer authorization
         * is represented by provider state.
         */
      }
    }

    void bootstrap();

    return () => {
      cancelled = true;
    };
  }, [
    markSignedOut,
    verifyCustomerSession,
  ]);

  useEffect(() => {
    if (Platform.OS === 'web') {
      return;
    }

    const supabase =
      getSupabaseClient();

    function updateRefreshState(
      state: AppStateStatus,
    ) {
      if (state === 'active') {
        supabase.auth
          .startAutoRefresh();
      } else {
        supabase.auth
          .stopAutoRefresh();
      }
    }

    updateRefreshState(
      AppState.currentState,
    );

    const subscription =
      AppState.addEventListener(
        'change',
        updateRefreshState,
      );

    return () => {
      subscription.remove();

      supabase.auth
        .stopAutoRefresh();
    };
  }, []);

  useEffect(() => {
    const supabase =
      getSupabaseClient();

    const {
      data: {
        subscription,
      },
    } =
      supabase.auth
        .onAuthStateChange(
          (
            event,
            session,
          ) => {
            if (
              event === 'SIGNED_OUT' ||
              !session
            ) {
              markSignedOut();
              return;
            }

            if (
              event ===
              'TOKEN_REFRESHED'
            ) {
              void verifyCustomerSession(
                session,
              ).catch(() => {
                /*
                 * Rejected customer authorization
                 * is represented by provider state.
                 */
              });
            }
          },
        );

    return () => {
      subscription.unsubscribe();
    };
  }, [
    markSignedOut,
    verifyCustomerSession,
  ]);

  const value =
    useMemo<
      CustomerSessionContextValue
    >(
      () => ({
        status,
        customer,
        verifyCustomerSession,
      }),
      [
        status,
        customer,
        verifyCustomerSession,
      ],
    );

  return (
    <CustomerSessionContext.Provider
      value={value}
    >
      {children}
    </CustomerSessionContext.Provider>
  );
}

export function useCustomerSession() {
  const context =
    useContext(
      CustomerSessionContext,
    );

  if (!context) {
    throw new Error(
      'CustomerSessionProvider is missing.',
    );
  }

  return context;
}
