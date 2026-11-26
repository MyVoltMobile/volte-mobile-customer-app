import { IptvUpgrade } from '@/components/ui/iptv-upgrade';
import { IptvChannelLineup } from '@/components/ui/iptv-channel-lineup';
import * as WebBrowser from 'expo-web-browser';
import { authenticatedCustomerFetch } from '@/lib/customer/customer-api';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  ActivityIndicator,
  Alert,
  Animated,
  PanResponder,
  AppState,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  Button,
} from '@/components/ui/button';

import {
  Card,
} from '@/components/ui/card';

import {
  ShellScreen,
} from '@/components/shell/shell-screen';

import {
  getCustomerIptv,
  type CustomerIptvService,
} from '@/lib/customer/customer-iptv';

import {
  Colors,
  Radius,
  Spacing,
  Typography,
} from '@/theme/tokens';

const SHOP_URL =
  'https://voltemobile.com/shop';

type LoadState =
  | 'loading'
  | 'ready'
  | 'error';

function formatDate(
  value: string | null,
) {
  if (!value) {
    return null;
  }

  const date =
    new Date(value);

  return Number.isNaN(
    date.getTime(),
  )
    ? value
    : date.toLocaleDateString(
        'en-US',
        {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          timeZone: /^\d{4}-\d{2}-\d{2}$/.test(value) ? 'UTC' : undefined,
        },
      );
}

function RenewalSlider({ early, busy, onConfirm }: {
  early: boolean;
  busy: boolean;
  onConfirm: () => void;
}) {
  const [width, setWidth] = useState(0);
  const offset = useRef(new Animated.Value(0)).current;
  const travel = Math.max(0, width - 56);
  const label = early ? 'Slide to renew early' : 'Slide to pay renewal';
  const reset = () => Animated.spring(offset, {
    toValue: 0, useNativeDriver: true, overshootClamping: true,
  }).start();
  const gesture = PanResponder.create({
    onMoveShouldSetPanResponder: (_, { dx, dy }) =>
      !busy && travel > 0 && dx > 6 && dx > Math.abs(dy),
    onPanResponderMove: (_, { dx }) => offset.setValue(Math.min(travel, Math.max(0, dx))),
    onPanResponderRelease: (_, { dx }) => {
      reset();
      if (!busy && travel > 0 && dx >= travel * 0.9) onConfirm();
    },
    onPanResponderTerminate: reset,
  });

  return (
    <View style={[renewalStyles.track, early && renewalStyles.earlyTrack]}
      onLayout={event => setWidth(event.nativeEvent.layout.width)}
      accessible accessibilityRole="button" accessibilityLabel={label}
      accessibilityHint="Opens a confirmation before going to Scotia"
      accessibilityState={{ busy, disabled: busy }}
      accessibilityActions={[{ name: 'activate' }]}
      onAccessibilityAction={event => {
        if (busy || event.nativeEvent.actionName !== 'activate') return;
        Alert.alert(early ? 'Renew early?' : 'Pay renewal?',
          'Continue to Scotia to pay for your IPTV renewal.',
          [{ text: 'Cancel', style: 'cancel' }, { text: 'Continue', onPress: onConfirm }]);
      }}>
      <Text style={renewalStyles.trackLabel}>{busy ? 'Opening checkout…' : label}</Text>
      <Animated.View {...gesture.panHandlers}
        style={[renewalStyles.thumb, { transform: [{ translateX: offset }] }]}>
        <Text style={renewalStyles.arrow}>›</Text>
      </Animated.View>
    </View>
  );
}

const renewalStyles = StyleSheet.create({
  upcoming: { color: '#4e465a', fontWeight: '700' },
  track: { minHeight: 56, paddingVertical: 14, paddingLeft: 62, paddingRight: 14,
    justifyContent: 'center', borderRadius: 28, backgroundColor: '#fbe8f2',
    borderWidth: 1, borderColor: '#ebcede' },
  earlyTrack: { backgroundColor: '#f7f6fa', borderColor: '#e5e1ea' },
  trackLabel: { color: '#413a4c', fontWeight: '700', textAlign: 'center' },
  thumb: { position: 'absolute', left: 4, top: 4, bottom: 4, width: 46,
    alignItems: 'center', justifyContent: 'center', borderRadius: 23, backgroundColor: '#ad155d' },
  arrow: { color: '#fff', fontSize: 28, lineHeight: 30 },
});

function Detail({
  label,
  value,
}: {
  label: string;
  value: string | null;
}) {
  if (!value) {
    return null;
  }

  return (
    <View
      style={
        styles.detail
      }
    >
      <Text
        style={
          styles.label
        }
      >
        {label}
      </Text>

      <Text
        selectable
        style={
          styles.value
        }
      >
        {value}
      </Text>
    </View>
  );
}

function IptvCard({
  service,
}: {
  service: CustomerIptvService;
}) {
  return (
    <Card>
      <View
        style={
          styles.card
        }
      >
        <View
          style={
            styles.cardHeader
          }
        >
          <View
            style={
              styles.heading
            }
          >
            <Text
              style={
                styles.title
              }
            >
              {service.serviceName}
            </Text>

            <Text
              style={
                styles.helper
              }
            >
              VoLTE Mobile IPTV
            </Text>
          </View>

          <Text
            style={
              styles.status
            }
          >
            {
              service
                .subscriptionStatus ||
              service.status ||
              'Active'
            }
          </Text>
        </View>

        <View>
          <Detail
            label="Username"
            value={
              service.username
            }
          />

          <Detail
            label="Connections"
            value={
              String(
                service
                  .maxConnections,
              )
            }
          />

          <Detail
            label="Next renewal"
            value={
              formatDate(
                service
                  .nextRenewalDate,
              )
            }
          />

          <Detail
            label="Expires"
            value={
              formatDate(
                service.expiresAt,
              )
            }
          />
        </View>

        <Text
          style={
            styles.note
          }
        >
          IPTV passwords are not
          displayed in the app.
          Contact Support if you
          need help with your
          service credentials.
        </Text>
      </View>
    </Card>
  );
}

export default function IptvScreen() {
  const [
    services,
    setServices,
  ] =
    useState<
      CustomerIptvService[]
    >([]);

  const [
    state,
    setState,
  ] =
    useState<LoadState>(
      'loading',
    );

  const [renewals, setRenewals] = useState<{ subscriptionId: string; serviceName: string; amountCents: number; renewalDate: string }[]>([]);
  const [renewalError, setRenewalError] = useState('');
  const [paying, setPaying] = useState(false);
  const opening = useRef(false);

  const loadRenewals = useCallback(async () => {
    try {
      const response = await authenticatedCustomerFetch('/api/public/customer-iptv-renewals');
      const result = await response.json();
      setRenewals(response.ok && result.renewalCheckoutEnabled === true && Array.isArray(result.renewals) ? result.renewals : []);
    } catch {
      setRenewals([]);
    }
  }, []);

  async function payRenewal(subscriptionId: string) {
    if (opening.current) return;
    opening.current = true;
    setPaying(true);
    setRenewalError('');
    try {
      const response = await authenticatedCustomerFetch('/api/public/customer-iptv-renewals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscriptionId }),
      });
      const result = await response.json();
      const url = result?.checkout?.launchUrl;
      if (!response.ok || typeof url !== 'string' ||
          !/^https:\/\/pay\.voltemobile\.com\/api\/customer-installments\/launch\/VLT-IR-[a-f0-9]{32}$/.test(url)) {
        throw new Error(result?.error || 'Secure renewal checkout could not be opened.');
      }
      await WebBrowser.openBrowserAsync(url);
    } catch (error) {
      setRenewalError(error instanceof Error ? error.message : 'Secure renewal checkout could not be opened.');
    } finally {
      setPaying(false);
      opening.current = false;
    }
  }

  const load =
    useCallback(
      async () => {
        setState(
          'loading',
        );

        try {
          const result =
            await getCustomerIptv();

          setServices(
            result,
          );

          setState(
            'ready',
          );
        } catch {
          setServices([]);

          setState(
            'error',
          );
        }
      },
      [],
    );

  useEffect(() => {
    void load();
    void loadRenewals();
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        void load();
        void loadRenewals();
      }
    });
    return () => subscription.remove();
  }, [load, loadRenewals]);

  return (
    <ShellScreen
      eyebrow="Services"
      title="My IPTV"
      description="Your VoLTE Mobile entertainment service."
    >
      {renewals.map((renewal) => {
        const today = new Intl.DateTimeFormat('sv-SE', { timeZone: 'America/Jamaica',
          year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
        const early = /^\d{4}-\d{2}-\d{2}$/.test(renewal.renewalDate) && renewal.renewalDate > today;
        return (
          <Card key={renewal.subscriptionId}>
            <View style={styles.card}>
              <Text style={styles.title}>{renewal.serviceName} renewal</Text>
              {early ? <Text style={renewalStyles.upcoming}>Upcoming · No payment due yet</Text> : null}
              <Detail label="Renewal amount" value={`J$${(renewal.amountCents / 100).toFixed(2)}`} />
              <Detail label="Next renewal" value={formatDate(renewal.renewalDate)} />
              <RenewalSlider early={early} busy={paying}
                onConfirm={() => void payRenewal(renewal.subscriptionId)} />
            </View>
          </Card>
        );
      })}
      <IptvUpgrade onActivated={() => { void load(); void loadRenewals(); }} />
      <IptvChannelLineup />
      {renewalError ? <Text accessibilityLiveRegion="polite" style={styles.helper}>{renewalError}</Text> : null}
      {state ===
      'loading' ? (
        <Card>
          <View
            style={
              styles.state
            }
          >
            <ActivityIndicator />

            <Text
              style={
                styles.stateTitle
              }
            >
              Loading your IPTV
            </Text>
          </View>
        </Card>
      ) : null}

      {state ===
      'error' ? (
        <Card>
          <View
            style={
              styles.state
            }
          >
            <Text
              style={
                styles.stateTitle
              }
            >
              IPTV unavailable
            </Text>

            <Text
              style={
                styles.helper
              }
            >
              We could not load
              your IPTV service
              information.
            </Text>

            <Pressable
              accessibilityRole="button"
              onPress={() => {
                void load();
              }}
              style={
                styles.retry
              }
            >
              <Text
                style={
                  styles.retryText
                }
              >
                Try again
              </Text>
            </Pressable>
          </View>
        </Card>
      ) : null}

      {state ===
        'ready' &&
      services.length === 0 ? (
        <View
          style={
            styles.empty
          }
        >
          <Card>
            <View
              style={
                styles.state
              }
            >
              <Text
                style={
                  styles.stateTitle
                }
              >
                No IPTV subscription yet
              </Text>

              <Text
                style={
                  styles.helper
                }
              >
                Explore VoLTE Mobile
                IPTV packages and get
                connected.
              </Text>
            </View>
          </Card>

          <Button
            label="Explore IPTV"
            onPress={() => {
              void Linking.openURL(
                SHOP_URL,
              );
            }}
          />
        </View>
      ) : null}

      {state ===
        'ready' &&
      services.length > 0 ? (
        <View
          style={
            styles.list
          }
        >
          {services.map(
            (service) => (
              <IptvCard
                key={
                  service.id
                }
                service={
                  service
                }
              />
            ),
          )}
        </View>
      ) : null}
    </ShellScreen>
  );
}

const styles =
  StyleSheet.create({
    list: {
      gap:
        Spacing.md,
    },

    card: {
      gap:
        Spacing.lg,
    },

    cardHeader: {
      flexDirection:
        'row',
      justifyContent:
        'space-between',
      alignItems:
        'flex-start',
      gap:
        Spacing.md,
    },

    heading: {
      flex: 1,
      gap:
        Spacing.xs,
    },

    title: {
      color:
        Colors.text.primary,
      fontSize:
        Typography.size
          .titleSmall,
      lineHeight:
        Typography.lineHeight
          .titleSmall,
      fontWeight:
        '700',
    },

    helper: {
      color:
        Colors.text.secondary,
      fontSize:
        Typography.size
          .bodySmall,
      lineHeight:
        Typography.lineHeight
          .bodySmall,
    },

    status: {
      color:
        Colors.brand.secondary,
      fontSize:
        Typography.size.caption,
      fontWeight:
        '700',
    },

    detail: {
      flexDirection:
        'row',
      justifyContent:
        'space-between',
      gap:
        Spacing.lg,
      paddingVertical:
        Spacing.md,
      borderTopWidth: 1,
      borderTopColor:
        Colors.border.default,
    },

    label: {
      color:
        Colors.text.secondary,
      fontSize:
        Typography.size
          .bodySmall,
    },

    value: {
      flex: 1,
      color:
        Colors.text.primary,
      fontSize:
        Typography.size
          .bodySmall,
      textAlign:
        'right',
      fontWeight:
        '600',
    },

    note: {
      color:
        Colors.text.secondary,
      fontSize:
        Typography.size.caption,
      lineHeight:
        Typography.lineHeight
          .caption,
    },

    state: {
      gap:
        Spacing.sm,
    },

    stateTitle: {
      color:
        Colors.text.primary,
      fontSize:
        Typography.size.body,
      fontWeight:
        '700',
    },

    retry: {
      alignSelf:
        'flex-start',
      paddingHorizontal:
        Spacing.lg,
      paddingVertical:
        Spacing.md,
      borderRadius:
        Radius.md,
      backgroundColor:
        Colors.brand.secondary,
    },

    retryText: {
      color:
        Colors.text.inverse,
      fontWeight:
        '700',
    },

    empty: {
      gap:
        Spacing.md,
    },
  });
