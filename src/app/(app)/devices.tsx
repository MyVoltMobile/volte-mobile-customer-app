import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  ShellScreen,
} from '@/components/shell/shell-screen';

import {
  Card,
} from '@/components/ui/card';

import {
  getCustomerDevices,
  type CustomerDevice,
  type CustomerDeviceOwnershipType,
} from '@/lib/customer/customer-devices';

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

const ownershipLabels:
  Record<
    CustomerDeviceOwnershipType,
    string
  > = {
    financed:
      'Financed',
    purchased:
      'Purchased',
    assigned:
      'Assigned',
  };

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
    return null;
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

function DeviceDetail({
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

function DeviceCard({
  device,
}: {
  device: CustomerDevice;
}) {
  const purchaseDate =
    formatDate(
      device.purchaseDate,
    );

  const financeStatus =
    formatStatus(
      device.financeStatus,
    );

  const modelLine = [
    device.brand,
    device.model,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Card>
      <View
        style={
          styles.deviceHeader
        }
      >
        <View
          style={
            styles.deviceTitleBlock
          }
        >
          <Text
            style={
              styles.deviceName
            }
          >
            {device.displayName}
          </Text>

          {modelLine &&
          modelLine.toLowerCase() !==
            device.displayName
              .toLowerCase() ? (
            <Text
              style={
                styles.deviceModel
              }
            >
              {modelLine}
            </Text>
          ) : null}
        </View>

        <View
          style={
            styles.ownershipBadge
          }
        >
          <Text
            style={
              styles.ownershipText
            }
          >
            {
              ownershipLabels[
                device
                  .ownershipType
              ]
            }
          </Text>
        </View>
      </View>

      <View
        style={
          styles.details
        }
      >
        <DeviceDetail
          label="Storage"
          value={
            device.storage
          }
        />

        <DeviceDetail
          label="Color"
          value={
            device.color
          }
        />

        <DeviceDetail
          label="IMEI"
          value={
            device.imei
          }
        />

        <DeviceDetail
          label="Serial number"
          value={
            device.serialNumber
          }
        />

        <DeviceDetail
          label="Receipt"
          value={
            device.receiptNumber
          }
        />

        <DeviceDetail
          label={
            device
              .ownershipType ===
            'financed'
              ? 'Added'
              : 'Purchased'
          }
          value={
            purchaseDate
          }
        />

        {device
          .ownershipType ===
        'financed' ? (
          <DeviceDetail
            label="Finance status"
            value={
              financeStatus
            }
          />
        ) : null}
      </View>
    </Card>
  );
}

export default function DevicesScreen() {
  const [
    devices,
    setDevices,
  ] =
    useState<CustomerDevice[]>(
      [],
    );

  const [
    loadState,
    setLoadState,
  ] =
    useState<LoadState>(
      'loading',
    );

  const loadDevices =
    useCallback(
      async () => {
        setLoadState(
          'loading',
        );

        try {
          const result =
            await getCustomerDevices();

          setDevices(
            result,
          );

          setLoadState(
            'ready',
          );
        } catch {
          setDevices([]);

          setLoadState(
            'error',
          );
        }
      },
      [],
    );

  useEffect(() => {
    void loadDevices();
  }, [loadDevices]);

  return (
    <ShellScreen
      eyebrow="Account"
      title="My Devices"
      description="Devices linked to your VoLTE Mobile account."
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
              Loading your devices
            </Text>

            <Text
              style={
                styles.stateText
              }
            >
              We are securely
              retrieving the
              devices linked to
              your account.
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
              Devices unavailable
            </Text>

            <Text
              style={
                styles.stateText
              }
            >
              We could not load
              your device
              information right
              now.
            </Text>

            <Pressable
              accessibilityRole="button"
              onPress={() => {
                void loadDevices();
              }}
              style={({
                pressed,
              }) => [
                styles.retryButton,
                pressed &&
                  styles
                    .retryButtonPressed,
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
      devices.length === 0 ? (
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
              No devices yet
            </Text>

            <Text
              style={
                styles.stateText
              }
            >
              No devices are
              currently linked
              to your VoLTE
              Mobile account.
            </Text>
          </View>
        </Card>
      ) : null}

      {loadState ===
        'ready' &&
      devices.length > 0 ? (
        <View
          style={
            styles.deviceList
          }
        >
          {devices.map(
            (device) => (
              <DeviceCard
                key={
                  device.id
                }
                device={
                  device
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
        Typography.size
          .body,
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

    retryButtonPressed: {
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

    deviceList: {
      gap:
        Spacing.md,
    },

    deviceHeader: {
      flexDirection:
        'row',
      alignItems:
        'flex-start',
      justifyContent:
        'space-between',
      gap:
        Spacing.md,
    },

    deviceTitleBlock: {
      flex: 1,
      gap:
        Spacing.xs,
    },

    deviceName: {
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

    deviceModel: {
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

    ownershipBadge: {
      borderRadius:
        Radius.pill,
      backgroundColor:
        Colors.background
          .subtle,
      borderColor:
        Colors.border
          .default,
      borderWidth: 1,
      paddingHorizontal:
        Spacing.md,
      paddingVertical:
        Spacing.xs,
    },

    ownershipText: {
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
      marginTop:
        Spacing.lg,
      borderTopWidth: 1,
      borderTopColor:
        Colors.border
          .default,
    },

    detailRow: {
      flexDirection:
        'row',
      alignItems:
        'flex-start',
      justifyContent:
        'space-between',
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
      flex: 1.35,
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
  });
