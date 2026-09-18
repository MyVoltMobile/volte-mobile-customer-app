import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  ActivityIndicator,
  Linking,
  Platform,
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
  getCustomerEsims,
  type CustomerEsim,
} from '@/lib/customer/customer-esims';

import {
  Colors,
  Radius,
  Spacing,
  Typography,
} from '@/theme/tokens';

type LoadState =
  | 'loading'
  | 'ready'
  | 'error';

const SHOP_URL =
  'https://voltemobile.com/shop';

function formatDate(
  value: string | null,
) {
  if (!value) {
    return null;
  }

  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime(),
    )
  ) {
    return value;
  }

  return date.toLocaleDateString(
    undefined,
    {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    },
  );
}

function formatStatus(
  value: string | null,
) {
  if (!value) {
    return 'Available';
  }

  return value
    .replace(
      /[_-]+/g,
      ' ',
    )
    .toLowerCase()
    .replace(
      /\b\w/g,
      (letter) =>
        letter.toUpperCase(),
    );
}

function DetailRow({
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
        styles.detailRow
      }
    >
      <Text
        style={
          styles.detailLabel
        }
      >
        {label}
      </Text>

      <Text
        selectable
        style={
          styles.detailValue
        }
      >
        {value}
      </Text>
    </View>
  );
}

function EsimCard({
  esim,
}: {
  esim: CustomerEsim;
}) {
  const installUrl =
    Platform.OS === 'ios'
      ? esim.iosInstallUrl
      : esim.androidInstallUrl;

  const expiry =
    formatDate(
      esim.expiresAt,
    );

  const activated =
    formatDate(
      esim.activatedAt,
    );

  const validity =
    esim.validityDays
      ? `${esim.validityDays} days`
      : null;

  return (
    <Card>
      <View
        style={
          styles.cardContent
        }
      >
        <View
          style={
            styles.cardHeader
          }
        >
          <View
            style={
              styles.cardTitleBlock
            }
          >
            <Text
              style={
                styles.planName
              }
            >
              {esim.planName}
            </Text>

            {esim.description ? (
              <Text
                style={
                  styles.planDescription
                }
              >
                {esim.description}
              </Text>
            ) : null}
          </View>

          <View
            style={
              styles.statusBadge
            }
          >
            <Text
              style={
                styles.statusText
              }
            >
              {
                formatStatus(
                  esim.status,
                )
              }
            </Text>
          </View>
        </View>

        <View
          style={
            styles.details
          }
        >
          <DetailRow
            label="Data"
            value={
              esim.dataAllowance
            }
          />

          <DetailRow
            label="Validity"
            value={
              validity
            }
          />

          <DetailRow
            label="Region"
            value={
              esim.region
            }
          />

          <DetailRow
            label="Mobile number"
            value={
              esim.msisdn
            }
          />

          <DetailRow
            label="Activated"
            value={
              activated
            }
          />

          <DetailRow
            label="Expires"
            value={
              expiry
            }
          />
        </View>

        {installUrl ? (
          <Button
            label="Install eSIM"
            onPress={() => {
              void Linking
                .openURL(
                  installUrl,
                )
                .catch(() => {
                  /*
                   * Installation-link failure
                   * leaves the customer safely
                   * inside the app.
                   */
                });
            }}
          />
        ) : null}
      </View>
    </Card>
  );
}

export default function EsimScreen() {
  const [
    esims,
    setEsims,
  ] =
    useState<CustomerEsim[]>(
      [],
    );

  const [
    loadState,
    setLoadState,
  ] =
    useState<LoadState>(
      'loading',
    );

  const loadEsims =
    useCallback(
      async () => {
        setLoadState(
          'loading',
        );

        try {
          const result =
            await getCustomerEsims();

          setEsims(
            result,
          );

          setLoadState(
            'ready',
          );
        } catch {
          setEsims([]);

          setLoadState(
            'error',
          );
        }
      },
      [],
    );

  useEffect(() => {
    void loadEsims();
  }, [loadEsims]);

  return (
    <ShellScreen
      eyebrow="Services"
      title="My eSIM"
      description="Your VoLTE Mobile eSIM plans and installation details."
    >
      {loadState ===
      'loading' ? (
        <Card>
          <View
            style={
              styles.stateContent
            }
          >
            <ActivityIndicator
              size="small"
              color={
                Colors.brand
                  .primary
              }
            />

            <Text
              style={
                styles.stateTitle
              }
            >
              Loading your eSIMs
            </Text>

            <Text
              style={
                styles.stateText
              }
            >
              We are securely
              retrieving eSIMs
              linked to your
              account.
            </Text>
          </View>
        </Card>
      ) : null}

      {loadState ===
      'error' ? (
        <Card>
          <View
            style={
              styles.stateContent
            }
          >
            <Text
              style={
                styles.stateTitle
              }
            >
              eSIM unavailable
            </Text>

            <Text
              style={
                styles.stateText
              }
            >
              We could not load
              your eSIM
              information right
              now.
            </Text>

            <Pressable
              accessibilityRole="button"
              onPress={() => {
                void loadEsims();
              }}
              style={({
                pressed,
              }) => [
                styles.retryButton,
                pressed &&
                  styles
                    .retryPressed,
              ]}
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

      {loadState ===
        'ready' &&
      esims.length === 0 ? (
        <View
          style={
            styles.emptyState
          }
        >
          <Card>
            <View
              style={
                styles.stateContent
              }
            >
              <Text
                style={
                  styles.stateTitle
                }
              >
                No eSIM yet
              </Text>

              <Text
                style={
                  styles.stateText
                }
              >
                Get connected
                with a VoLTE
                Mobile eSIM.
              </Text>
            </View>
          </Card>

          <Button
            label="Shop eSIM"
            onPress={() => {
              void Linking
                .openURL(
                  SHOP_URL,
                )
                .catch(() => {
                  /*
                   * Browser launch failure
                   * leaves the customer
                   * safely in the app.
                   */
                });
            }}
          />
        </View>
      ) : null}

      {loadState ===
        'ready' &&
      esims.length > 0 ? (
        <View
          style={
            styles.esimList
          }
        >
          {esims.map(
            (esim) => (
              <EsimCard
                key={
                  esim.id
                }
                esim={
                  esim
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
    cardContent: {
      gap:
        Spacing.lg,
    },

    cardHeader: {
      flexDirection:
        'row',
      alignItems:
        'flex-start',
      justifyContent:
        'space-between',
      gap:
        Spacing.md,
    },

    cardTitleBlock: {
      flex: 1,
      gap:
        Spacing.xs,
    },

    planName: {
      color:
        Colors.text.primary,
      fontSize:
        Typography.size
          .titleSmall,
      lineHeight:
        Typography.lineHeight
          .titleSmall,
      fontWeight:
        '800',
    },

    planDescription: {
      color:
        Colors.text
          .secondary,
      fontSize:
        Typography.size
          .bodySmall,
      lineHeight:
        Typography.lineHeight
          .bodySmall,
    },

    statusBadge: {
      borderRadius:
        Radius.pill,
      borderWidth: 1,
      borderColor:
        Colors.border
          .default,
      backgroundColor:
        Colors.background
          .subtle,
      paddingHorizontal:
        Spacing.md,
      paddingVertical:
        Spacing.xs,
    },

    statusText: {
      color:
        Colors.brand.primary,
      fontSize:
        Typography.size
          .caption,
      lineHeight:
        Typography.lineHeight
          .caption,
      fontWeight:
        '700',
    },

    details: {
      borderTopWidth: 1,
      borderTopColor:
        Colors.border
          .default,
    },

    detailRow: {
      flexDirection:
        'row',
      justifyContent:
        'space-between',
      alignItems:
        'flex-start',
      gap:
        Spacing.lg,
      paddingVertical:
        Spacing.md,
      borderBottomWidth: 1,
      borderBottomColor:
        Colors.border
          .default,
    },

    detailLabel: {
      flex: 1,
      color:
        Colors.text
          .secondary,
      fontSize:
        Typography.size
          .bodySmall,
      lineHeight:
        Typography.lineHeight
          .bodySmall,
    },

    detailValue: {
      flex: 1.4,
      color:
        Colors.text.primary,
      fontSize:
        Typography.size
          .bodySmall,
      lineHeight:
        Typography.lineHeight
          .bodySmall,
      fontWeight:
        '600',
      textAlign:
        'right',
    },

    stateContent: {
      alignItems:
        'flex-start',
      gap:
        Spacing.sm,
    },

    stateTitle: {
      color:
        Colors.text.primary,
      fontSize:
        Typography.size.body,
      lineHeight:
        Typography.lineHeight
          .body,
      fontWeight:
        '700',
    },

    stateText: {
      color:
        Colors.text
          .secondary,
      fontSize:
        Typography.size
          .bodySmall,
      lineHeight:
        Typography.lineHeight
          .bodySmall,
    },

    retryButton: {
      minHeight: 44,
      marginTop:
        Spacing.sm,
      paddingHorizontal:
        Spacing.lg,
      paddingVertical:
        Spacing.sm,
      borderRadius:
        Radius.md,
      alignItems:
        'center',
      justifyContent:
        'center',
      backgroundColor:
        Colors.brand
          .secondary,
    },

    retryPressed: {
      backgroundColor:
        Colors.brand
          .secondaryPressed,
    },

    retryText: {
      color:
        Colors.text.inverse,
      fontSize:
        Typography.size
          .bodySmall,
      lineHeight:
        Typography.lineHeight
          .bodySmall,
      fontWeight:
        '700',
    },

    emptyState: {
      gap:
        Spacing.md,
    },

    esimList: {
      gap:
        Spacing.md,
    },
  });
