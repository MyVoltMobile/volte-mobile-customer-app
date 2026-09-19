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
  TextInput,
  View,
} from 'react-native';

import {
  Card,
} from '@/components/ui/card';

import {
  ShellScreen,
} from '@/components/shell/shell-screen';

import {
  createCustomerSupportRequest,
  getCustomerSupportRequests,
  type CustomerSupportRequest,
} from '@/lib/customer/customer-support';

import {
  Colors,
  Radius,
  Spacing,
  Typography,
} from '@/theme/tokens';

function formatDate(
  value: string | null,
) {
  if (!value) {
    return '';
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
          month:
            'short',
          day:
            'numeric',
          year:
            'numeric',
        },
      );
}

function RequestCard({
  request,
}: {
  request:
    CustomerSupportRequest;
}) {
  return (
    <Card>
      <View
        style={
          styles.request
        }
      >
        <View
          style={
            styles.requestHeader
          }
        >
          <Text
            style={
              styles.requestTitle
            }
          >
            {request.topic}
          </Text>

          <Text
            style={
              styles.status
            }
          >
            {request.status}
          </Text>
        </View>

        {request.message ? (
          <Text
            style={
              styles.body
            }
          >
            {request.message}
          </Text>
        ) : null}

        <Text
          style={
            styles.date
          }
        >
          {
            formatDate(
              request.createdAt,
            )
          }
        </Text>
      </View>
    </Card>
  );
}

export default function SupportScreen() {
  const [
    topic,
    setTopic,
  ] =
    useState('');

  const [
    message,
    setMessage,
  ] =
    useState('');

  const [
    requests,
    setRequests,
  ] =
    useState<
      CustomerSupportRequest[]
    >([]);

  const [
    loading,
    setLoading,
  ] =
    useState(true);

  const [
    submitting,
    setSubmitting,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState('');

  const [
    confirmation,
    setConfirmation,
  ] =
    useState('');

  const load =
    useCallback(
      async () => {
        setLoading(
          true,
        );

        try {
          const result =
            await getCustomerSupportRequests();

          setRequests(
            result,
          );

          setError('');
        } catch {
          setError(
            'Your support history could not be loaded right now.',
          );
        } finally {
          setLoading(
            false,
          );
        }
      },
      [],
    );

  useEffect(() => {
    void load();
  }, [load]);

  async function submit() {
    const cleanMessage =
      message.trim();

    if (
      submitting ||
      !cleanMessage
    ) {
      if (!cleanMessage) {
        setError(
          'Please enter a message before sending your request.',
        );
      }

      return;
    }

    setSubmitting(
      true,
    );

    setError('');
    setConfirmation('');

    try {
      const created =
        await createCustomerSupportRequest(
          {
            topic:
              topic.trim() ||
              'General enquiry',

            message:
              cleanMessage,
          },
        );

      setRequests(
        (
          current,
        ) => [
          created,
          ...current,
        ],
      );

      setTopic('');
      setMessage('');

      setConfirmation(
        'Your support request has been received.',
      );
    } catch (
      submitError
    ) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'Your support request could not be sent.',
      );
    } finally {
      setSubmitting(
        false,
      );
    }
  }

  return (
    <ShellScreen
      eyebrow="Customer"
      title="Support"
      description="Get help with your VoLTE Mobile account and services."
    >
      <Card>
        <View
          style={
            styles.form
          }
        >
          <Text
            style={
              styles.cardTitle
            }
          >
            New support request
          </Text>

          <View
            style={
              styles.field
            }
          >
            <Text
              style={
                styles.label
              }
            >
              Topic
            </Text>

            <TextInput
              value={topic}
              onChangeText={
                setTopic
              }
              placeholder="General enquiry"
              placeholderTextColor={
                Colors.text.secondary
              }
              maxLength={120}
              style={
                styles.input
              }
            />
          </View>

          <View
            style={
              styles.field
            }
          >
            <Text
              style={
                styles.label
              }
            >
              How can we help?
            </Text>

            <TextInput
              value={message}
              onChangeText={
                setMessage
              }
              placeholder="Tell us what you need help with."
              placeholderTextColor={
                Colors.text.secondary
              }
              multiline
              maxLength={5000}
              textAlignVertical="top"
              style={[
                styles.input,
                styles.message,
              ]}
            />
          </View>

          {error ? (
            <Text
              style={
                styles.error
              }
            >
              {error}
            </Text>
          ) : null}

          {confirmation ? (
            <Text
              style={
                styles.success
              }
            >
              {confirmation}
            </Text>
          ) : null}

          <Pressable
            accessibilityRole="button"
            disabled={
              submitting
            }
            onPress={() => {
              void submit();
            }}
            style={[
              styles.button,
              submitting &&
                styles.disabled,
            ]}
          >
            {submitting ? (
              <ActivityIndicator
                size="small"
                color={
                  Colors.text.inverse
                }
              />
            ) : (
              <Text
                style={
                  styles.buttonText
                }
              >
                Send Request
              </Text>
            )}
          </Pressable>
        </View>
      </Card>

      <View
        style={
          styles.history
        }
      >
        <Text
          style={
            styles.sectionLabel
          }
        >
          YOUR REQUESTS
        </Text>

        {loading ? (
          <Card>
            <View
              style={
                styles.loading
              }
            >
              <ActivityIndicator />

              <Text
                style={
                  styles.body
                }
              >
                Loading support history…
              </Text>
            </View>
          </Card>
        ) : null}

        {!loading &&
        requests.length ===
          0 ? (
          <Card>
            <Text
              style={
                styles.body
              }
            >
              You do not have any
              support requests yet.
            </Text>
          </Card>
        ) : null}

        {!loading
          ? requests.map(
              (request) => (
                <RequestCard
                  key={
                    request.id
                  }
                  request={
                    request
                  }
                />
              ),
            )
          : null}
      </View>
    </ShellScreen>
  );
}

const styles =
  StyleSheet.create({
    form: {
      gap:
        Spacing.lg,
    },

    cardTitle: {
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

    field: {
      gap:
        Spacing.sm,
    },

    label: {
      color:
        Colors.text.primary,
      fontSize:
        Typography.size
          .bodySmall,
      fontWeight:
        '600',
    },

    input: {
      minHeight: 48,
      borderWidth: 1,
      borderColor:
        Colors.border.default,
      borderRadius:
        Radius.md,
      backgroundColor:
        Colors.background.surface,
      color:
        Colors.text.primary,
      paddingHorizontal:
        Spacing.md,
      paddingVertical:
        Spacing.md,
      fontSize:
        Typography.size.body,
    },

    message: {
      minHeight: 132,
    },

    button: {
      minHeight: 50,
      borderRadius:
        Radius.md,
      alignItems:
        'center',
      justifyContent:
        'center',
      backgroundColor:
        Colors.brand.secondary,
    },

    disabled: {
      opacity: 0.7,
    },

    buttonText: {
      color:
        Colors.text.inverse,
      fontSize:
        Typography.size.body,
      fontWeight:
        '700',
    },

    error: {
      color:
        Colors.status.danger,
      fontSize:
        Typography.size
          .bodySmall,
    },

    success: {
      color:
        Colors.status.success,
      fontSize:
        Typography.size
          .bodySmall,
    },

    history: {
      gap:
        Spacing.md,
    },

    sectionLabel: {
      color:
        Colors.brand.secondary,
      fontSize:
        Typography.size.caption,
      fontWeight:
        '700',
      letterSpacing: 0.8,
    },

    loading: {
      flexDirection:
        'row',
      alignItems:
        'center',
      gap:
        Spacing.md,
    },

    request: {
      gap:
        Spacing.sm,
    },

    requestHeader: {
      flexDirection:
        'row',
      justifyContent:
        'space-between',
      alignItems:
        'flex-start',
      gap:
        Spacing.md,
    },

    requestTitle: {
      flex: 1,
      color:
        Colors.text.primary,
      fontSize:
        Typography.size.body,
      fontWeight:
        '700',
    },

    status: {
      color:
        Colors.brand.secondary,
      fontSize:
        Typography.size.caption,
      fontWeight:
        '700',
    },

    body: {
      color:
        Colors.text.secondary,
      fontSize:
        Typography.size
          .bodySmall,
      lineHeight:
        Typography.lineHeight
          .bodySmall,
    },

    date: {
      color:
        Colors.text.secondary,
      fontSize:
        Typography.size.caption,
    },
  });
