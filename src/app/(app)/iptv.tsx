import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  ActivityIndicator,
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
        },
      );
}

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
  }, [load]);

  return (
    <ShellScreen
      eyebrow="Services"
      title="My IPTV"
      description="Your VoLTE Mobile entertainment service."
    >
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
