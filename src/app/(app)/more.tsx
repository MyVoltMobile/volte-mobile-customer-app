import { BiometricSettings } from '@/lib/auth/biometric-unlock';
import { useCustomerSession } from '@/lib/customer/customer-session-provider';

import {
  useRouter,
} from 'expo-router';

import {
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
  Card,
} from '@/components/ui/card';

import {
  LegalPolicyModal,
} from '@/components/legal/legal-policy-modal';

import {
  ShellScreen,
} from '@/components/shell/shell-screen';

import {
  getSupabaseClient,
} from '@/lib/auth/supabase';

import {
  LEGAL_POLICIES,
  type LegalPolicyId,
} from '@/lib/legal/legal-policies';

import {
  Colors,
  Radius,
  Spacing,
  Typography,
} from '@/theme/tokens';

const SITE_URL =
  'https://voltemobile.com';

const CONTACT = {
  address:
    '5 Fort George Road, Main Street, Stony Hill, Kingston 9, St. Andrew, Jamaica',
  phone:
    '+1 876 310 5423',
  phoneHref:
    'tel:+18763105423',
  email:
    'support@voltemobile.com',
  emailHref:
    'mailto:support@voltemobile.com',
} as const;

const LEGAL_LINKS = [
  {
    label:
      'Privacy Policy',

    policyId:
      'privacy',
  },
  {
    label:
      'Terms of Use',

    policyId:
      'terms',
  },
  {
    label:
      'Sales & Returns',

    policyId:
      'sales-returns',
  },
  {
    label:
      'Delivery Policy',

    policyId:
      'delivery-policy',
  },
  {
    label:
      'Data Protection',

    policyId:
      'data-protection',
  },
] as const satisfies ReadonlyArray<{
  label: string;
  policyId: LegalPolicyId;
}>;

function openExternal(
  url: string,
) {
  void Linking
    .openURL(url)
    .catch(() => {
      /*
       * External-link failure leaves
       * the customer safely inside
       * the app.
       */
    });
}

function MenuRow({
  title,
  description,
  onPress,
  disabled = false,
  trailing,
}: {
  title: string;
  description: string;
  onPress?: () => void;
  disabled?: boolean;
  trailing?: string;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{
        disabled,
      }}
      disabled={
        disabled ||
        !onPress
      }
      onPress={onPress}
      style={({
        pressed,
      }) => [
        styles.menuRow,
        pressed &&
          !disabled &&
          styles.menuRowPressed,
      ]}
    >
      <View
        style={
          styles.menuText
        }
      >
        <Text
          style={
            styles.menuTitle
          }
        >
          {title}
        </Text>

        <Text
          style={
            styles.menuDescription
          }
        >
          {description}
        </Text>
      </View>

      <Text
        style={
          disabled
            ? styles
                .menuTrailingMuted
            : styles
                .menuTrailing
        }
      >
        {trailing ||
          (disabled
            ? 'Soon'
            : '›')}
      </Text>
    </Pressable>
  );
}

function TrustRow({
  marker,
  title,
}: {
  marker: string;
  title: string;
}) {
  return (
    <View
      style={
        styles.trustRow
      }
    >
      <View
        style={
          styles.trustIcon
        }
      >
        <Text
          style={
            styles.trustIconText
          }
        >
          {marker}
        </Text>
      </View>

      <Text
        style={
          styles.trustTitle
        }
      >
        {title}
      </Text>
    </View>
  );
}

function FooterLink({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({
        pressed,
      }) => [
        styles.footerLink,
        pressed &&
          styles.footerPressed,
      ]}
    >
      <Text
        style={
          styles.footerLinkText
        }
      >
        {label}
      </Text>

      <Text
        style={
          styles.footerChevron
        }
      >
        ›
      </Text>
    </Pressable>
  );
}

function ContactLink({
  label,
  value,
  url,
}: {
  label: string;
  value: string;
  url: string;
}) {
  return (
    <Pressable
      accessibilityRole="link"
      onPress={() =>
        openExternal(url)
      }
      style={({
        pressed,
      }) => [
        styles.contactLink,
        pressed &&
          styles.footerPressed,
      ]}
    >
      <Text
        style={
          styles.contactLabel
        }
      >
        {label}
      </Text>

      <Text
        style={
          styles.contactValue
        }
      >
        {value}
      </Text>
    </Pressable>
  );
}

export default function MoreScreen() {
  const { customer } = useCustomerSession();
  const router =
    useRouter();

  const [
    signingOut,
    setSigningOut,
  ] =
    useState(false);

  const [
    signOutError,
    setSignOutError,
  ] =
    useState('');

  const [
    activeLegalPolicyId,
    setActiveLegalPolicyId,
  ] =
    useState<
      LegalPolicyId | null
    >(null);

  const activeLegalPolicy =
    activeLegalPolicyId
      ? LEGAL_POLICIES[
          activeLegalPolicyId
        ]
      : null;

  async function handleSignOut() {
    if (signingOut) {
      return;
    }

    setSigningOut(true);
    setSignOutError('');

    try {
      const supabase =
        getSupabaseClient();

      const {
        error,
      } =
        await supabase.auth
          .signOut();

      if (error) {
        throw error;
      }
    } catch {
      setSignOutError(
        'We could not sign you out. Please try again.',
      );

      setSigningOut(false);
    }
  }

  return (
    <ShellScreen
      eyebrow="Account"
      title="More"
      description="Account tools, support and more from VoLTE Mobile."
    >
      <View
        style={
          styles.content
        }
      >
        <Card>
          <View
            style={
              styles.menu
            }
          >
            <MenuRow
              title="Profile"
              description="View your customer account details."
              onPress={() =>
                router.navigate(
                  '/profile',
                )
              }
            />

            <MenuRow
              title="Order history"
              description="View purchases and order activity."
              onPress={() =>
                router.navigate(
                  '/order-history',
                )
              }
            />

            <MenuRow
              title="Your Offers"
              description="Personalized offers from VoLTE Mobile."
              onPress={() =>
                router.navigate(
                  '/offers',
                )
              }
            />

            <MenuRow
              title="Notifications"
              description="Updates about your account and services."
              disabled
            />
          </View>
        </Card>

        <Card>
          <View
            style={
              styles.menu
            }
          >
            <MenuRow
              title="Support"
              description="Get help with your VoLTE Mobile account."
              onPress={() =>
                router.navigate(
                  '/support',
                )
              }
            />

            <MenuRow
              title="Privacy"
              description="Privacy information and account protection."
              onPress={() =>
                setActiveLegalPolicyId(
                  'privacy',
                )
              }
            />

            <MenuRow
              title="About VoLTE Mobile"
              description="Visit VoLTE Mobile online."
              onPress={() =>
                openExternal(
                  SITE_URL,
                )
              }
            />
          </View>
        </Card>

        <Card>
          <View
            style={
              styles.signOutBlock
            }
          >
            <Text
              style={
                styles.sectionLabel
              }
            >
              ACCOUNT ACCESS
            </Text>

            {customer && <BiometricSettings key={customer.id} customerId={customer.id} />}

            {signOutError ? (
              <Text
                accessibilityRole="alert"
                style={
                  styles.error
                }
              >
                {signOutError}
              </Text>
            ) : null}

            {signingOut ? (
              <View
                style={
                  styles.signingOut
                }
              >
                <ActivityIndicator
                  size="small"
                />

                <Text
                  style={
                    styles.helper
                  }
                >
                  Signing out…
                </Text>
              </View>
            ) : (
              <Pressable
                accessibilityRole="button"
                onPress={
                  handleSignOut
                }
                style={({
                  pressed,
                }) => [
                  styles.signOutButton,
                  pressed &&
                    styles
                      .signOutPressed,
                ]}
              >
                <Text
                  style={
                    styles.signOutText
                  }
                >
                  Sign out
                </Text>
              </Pressable>
            )}
          </View>
        </Card>

        <View
          style={
            styles.footer
          }
        >
          <View
            style={
              styles.footerSection
            }
          >
            <Text
              style={
                styles.footerEyebrow
              }
            >
              SECURE & TRUSTED
            </Text>

            <View
              style={
                styles.trustList
              }
            >
              <TrustRow
                marker="✓"
                title="Secure SSL"
              />

              <TrustRow
                marker="S"
                title="Secure Checkout"
              />

              <TrustRow
                marker="B"
                title="Scotiabank Business Banking"
              />
            </View>
          </View>

          <View
            style={
              styles.footerDivider
            }
          />

          <View
            style={
              styles.footerSection
            }
          >
            <Text
              style={
                styles.footerEyebrow
              }
            >
              CARDS ACCEPTED
            </Text>

            <View
              style={
                styles.cards
              }
            >
              <View
                style={
                  styles.cardMark
                }
              >
                <Text
                  style={
                    styles.visaText
                  }
                >
                  VISA
                </Text>
              </View>

              <View
                style={
                  styles.cardMark
                }
              >
                <Text
                  style={
                    styles.mastercardText
                  }
                >
                  Mastercard
                </Text>
              </View>

              {['American Express', 'Diners Club International', 'Discover'].map((network) => (
                <View key={network} style={styles.cardMark}>
                  <Text style={styles.mastercardText}>{network}</Text>
                </View>
              ))}
            </View>
          </View>

          <View
            style={
              styles.footerDivider
            }
          />

          <View
            style={
              styles.footerSection
            }
          >
            <Text
              style={
                styles.footerEyebrow
              }
            >
              CONTACT
            </Text>

            <Text
              style={
                styles.address
              }
            >
              {CONTACT.address}
            </Text>

            <ContactLink
              label="Telephone"
              value={
                CONTACT.phone
              }
              url={
                CONTACT.phoneHref
              }
            />

            <ContactLink
              label="Email"
              value={
                CONTACT.email
              }
              url={
                CONTACT.emailHref
              }
            />
          </View>

          <View
            style={
              styles.footerDivider
            }
          />

          <View
            style={
              styles.footerSection
            }
          >
            <Text
              style={
                styles.footerEyebrow
              }
            >
              LEGAL
            </Text>

            <View
              style={
                styles.legalLinks
              }
            >
              {LEGAL_LINKS.map(
                (item) => (
                  <FooterLink
                    key={
                      item.label
                    }
                    label={
                      item.label
                    }
                    onPress={() =>
                      setActiveLegalPolicyId(
                        item.policyId,
                      )
                    }
                  />
                ),
              )}
            </View>
          </View>

          <View
            style={
              styles.footerDivider
            }
          />

          <View
            style={
              styles.copyright
            }
          >
            <Text
              style={
                styles.copyrightText
              }
            >
              © 2026 VoLTE Mobile.
              {' '}
              All rights reserved.
            </Text>

            <Text
              style={
                styles.country
              }
            >
              🇯🇲 Jamaica
            </Text>
          </View>
        </View>
      </View>

      <LegalPolicyModal
        policy={
          activeLegalPolicy
        }
        visible={
          activeLegalPolicy !==
          null
        }
        onClose={() =>
          setActiveLegalPolicyId(
            null,
          )
        }
      />
    </ShellScreen>
  );
}

const styles =
  StyleSheet.create({
    content: {
      gap:
        Spacing.lg,
    },

    menu: {
      marginVertical:
        -Spacing.sm,
    },

    menuRow: {
      minHeight: 74,
      flexDirection:
        'row',
      alignItems:
        'center',
      justifyContent:
        'space-between',
      gap:
        Spacing.lg,
      paddingVertical:
        Spacing.md,
      borderBottomWidth: 1,
      borderBottomColor:
        Colors.border.default,
    },

    menuRowPressed: {
      opacity: 0.64,
    },

    menuText: {
      flex: 1,
      gap:
        Spacing.xs,
    },

    menuTitle: {
      color:
        Colors.text.primary,
      fontSize:
        Typography.size.body,
      lineHeight:
        Typography.lineHeight.body,
      fontWeight:
        '700',
    },

    menuDescription: {
      color:
        Colors.text.secondary,
      fontSize:
        Typography.size.bodySmall,
      lineHeight:
        Typography.lineHeight
          .bodySmall,
    },

    menuTrailing: {
      color:
        Colors.brand.primary,
      fontSize: 24,
      lineHeight: 28,
      fontWeight:
        '500',
    },

    menuTrailingMuted: {
      color:
        Colors.text.secondary,
      fontSize:
        Typography.size.caption,
      lineHeight:
        Typography.lineHeight.caption,
      fontWeight:
        '700',
    },

    signOutBlock: {
      gap:
        Spacing.md,
    },

    sectionLabel: {
      color:
        Colors.brand.secondary,
      fontSize:
        Typography.size.caption,
      lineHeight:
        Typography.lineHeight.caption,
      fontWeight:
        '700',
      letterSpacing: 0.8,
    },

    helper: {
      color:
        Colors.text.secondary,
      fontSize:
        Typography.size.bodySmall,
      lineHeight:
        Typography.lineHeight
          .bodySmall,
    },

    error: {
      color:
        Colors.status.danger,
      fontSize:
        Typography.size.bodySmall,
      lineHeight:
        Typography.lineHeight
          .bodySmall,
      fontWeight:
        '600',
    },

    signingOut: {
      minHeight: 48,
      flexDirection:
        'row',
      alignItems:
        'center',
      justifyContent:
        'center',
      gap:
        Spacing.md,
    },

    signOutButton: {
      minHeight: 48,
      borderRadius:
        Radius.md,
      borderWidth: 1,
      borderColor:
        Colors.border.strong,
      alignItems:
        'center',
      justifyContent:
        'center',
      backgroundColor:
        Colors.background.surface,
    },

    signOutPressed: {
      backgroundColor:
        Colors.background.subtle,
    },

    signOutText: {
      color:
        Colors.text.primary,
      fontSize:
        Typography.size.body,
      fontWeight:
        '700',
    },

    footer: {
      overflow:
        'hidden',
      borderRadius:
        Radius.xl,
      padding:
        Spacing.xl,
      gap:
        Spacing.xl,
      backgroundColor:
        '#05070C',
    },

    footerSection: {
      gap:
        Spacing.md,
    },

    footerEyebrow: {
      color:
        '#B7BDCA',
      fontSize:
        Typography.size.caption,
      lineHeight:
        Typography.lineHeight.caption,
      fontWeight:
        '700',
      letterSpacing: 1.3,
    },

    trustList: {
      gap:
        Spacing.md,
    },

    trustRow: {
      flexDirection:
        'row',
      alignItems:
        'center',
      gap:
        Spacing.md,
    },

    trustIcon: {
      width: 40,
      height: 40,
      borderRadius:
        Radius.sm,
      borderWidth: 1,
      borderColor:
        '#303541',
      alignItems:
        'center',
      justifyContent:
        'center',
    },

    trustIconText: {
      color:
        '#F5F6F8',
      fontSize:
        Typography.size.body,
      fontWeight:
        '700',
    },

    trustTitle: {
      flex: 1,
      color:
        '#D5D8E1',
      fontSize:
        Typography.size.bodySmall,
      lineHeight:
        Typography.lineHeight
          .bodySmall,
      fontWeight:
        '600',
    },

    footerDivider: {
      height: 1,
      backgroundColor:
        '#252A33',
    },

    cards: {
      flexDirection:
        'row',
      flexWrap:
        'wrap',
      gap:
        Spacing.md,
    },

    cardMark: {
      minWidth: 112,
      minHeight: 54,
      paddingHorizontal:
        Spacing.lg,
      borderRadius:
        Radius.md,
      backgroundColor:
        '#FFFFFF',
      alignItems:
        'center',
      justifyContent:
        'center',
    },

    visaText: {
      color:
        '#1A1F71',
      fontSize:
        Typography.size.body,
      fontWeight:
        '700',
      fontStyle:
        'italic',
    },

    mastercardText: {
      color:
        '#171922',
      fontSize:
        Typography.size.bodySmall,
      fontWeight:
        '700',
    },

    address: {
      color:
        '#C5CAD5',
      fontSize:
        Typography.size.bodySmall,
      lineHeight:
        Typography.lineHeight
          .bodySmall,
    },

    contactLink: {
      paddingVertical:
        Spacing.xs,
      gap: 2,
    },

    contactLabel: {
      color:
        '#838B9D',
      fontSize:
        Typography.size.caption,
      lineHeight:
        Typography.lineHeight.caption,
    },

    contactValue: {
      color:
        '#E5E7EC',
      fontSize:
        Typography.size.bodySmall,
      lineHeight:
        Typography.lineHeight
          .bodySmall,
      fontWeight:
        '600',
    },

    legalLinks: {
      gap:
        Spacing.xs,
    },

    footerLink: {
      minHeight: 44,
      flexDirection:
        'row',
      alignItems:
        'center',
      justifyContent:
        'space-between',
      gap:
        Spacing.md,
    },

    footerLinkText: {
      color:
        '#C5CAD5',
      fontSize:
        Typography.size.bodySmall,
      lineHeight:
        Typography.lineHeight
          .bodySmall,
    },

    footerChevron: {
      color:
        '#A695F3',
      fontSize: 22,
      lineHeight: 24,
    },

    footerPressed: {
      opacity: 0.64,
    },

    copyright: {
      gap:
        Spacing.sm,
    },

    copyrightText: {
      color:
        '#8B92A3',
      fontSize:
        Typography.size.caption,
      lineHeight:
        Typography.lineHeight.caption,
    },

    country: {
      color:
        '#C5CAD5',
      fontSize:
        Typography.size.bodySmall,
      lineHeight:
        Typography.lineHeight
          .bodySmall,
    },
  });
