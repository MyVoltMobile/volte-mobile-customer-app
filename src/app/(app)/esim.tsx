import { EsimPurchase } from '@/components/ui/esim-purchase';
import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import { Image } from 'expo-image';
import { customerApiBaseUrl } from '@/lib/customer/customer-api';

import {
  ActivityIndicator,
  Linking,
  Platform,
  Pressable,
  ScrollView,
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
  const [setup, setSetup] = useState<'qr' | 'manual' | null>(null);
  const [, address, code] = esim.lpaString?.split('$') ?? [];
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

        {esim.qrSvg ? (
          <Button label={setup === 'qr' ? 'Hide QR code' : 'Show QR code'}
            onPress={() => setSetup(setup === 'qr' ? null : 'qr')} />
        ) : null}
        {esim.lpaString ? (
          <Button label={setup === 'manual' ? 'Hide manual setup' : 'Manual setup'}
            onPress={() => setSetup(setup === 'manual' ? null : 'manual')} />
        ) : null}
        {setup === 'qr' && esim.qrSvg ? (
          <View>
            <Text>Open Add eSIM on your phone and scan this code from another screen.</Text>
            <Image
              accessibilityLabel="eSIM installation QR code"
              source={{ uri: `data:image/svg+xml;base64,${btoa(esim.qrSvg)}` }}
              style={{ width: 240, maxWidth: '100%', aspectRatio: 1, alignSelf: 'center' }}
              contentFit="contain"
              cachePolicy="none"
            />
          </View>
        ) : null}
        {setup === 'manual' && esim.lpaString ? (
          <View>
            <Text>Open Add eSIM in Settings and choose manual entry if available.</Text>
            <DetailRow label="SM-DP+ address" value={address ?? null} />
            <DetailRow label="Activation code" value={code ?? null} />
            <DetailRow label="Full activation string" value={esim.lpaString} />
          </View>
        ) : null}
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

const sections = [
  { id: 'owned', title: 'My eSIMs', subtitle: 'Your plans and installation details' },
  { id: 'purchase', title: 'Purchase eSIM', subtitle: 'Find a plan for your destination' },
  { id: 'compatibility', title: 'Does your phone support eSIM?', subtitle: 'Check your device before you buy' },
] as const;

const destinations = [
  { code: 'US', name: 'United States', image: 'north-america' },
  { code: 'JP', name: 'Japan', image: 'japan' },
  { code: 'CN', name: 'China', image: 'china' },
  { code: 'HK', name: 'Hong Kong', image: 'hong-kong-macau' },
  { code: 'FR', name: 'France', image: 'europe' },
];

export default function EsimScreen() {
  const [section, setSection] = useState<(typeof sections)[number]['id'] | null>(null);
  const [heroUrl, setHeroUrl] = useState<string | null>(null);
  const [slideWidth, setSlideWidth] = useState(0);
  const [featured, setFeatured] = useState<(typeof destinations)[number] | null>(null);
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
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    void fetch(customerApiBaseUrl() + '/api/public/app-esim-hero-image', {
      signal: controller.signal,
    }).then(async response => {
      if (!response.ok) return;
      const { imageUrl } = await response.json();
      if (!controller.signal.aborted && typeof imageUrl === 'string' && imageUrl.startsWith('https://')) {
        setHeroUrl(imageUrl);
      }
    }).catch(() => {
      // Keep the bundled hero when branding is unavailable.
    }).finally(() => clearTimeout(timeout));
    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, []);

  useEffect(() => {
    void loadEsims();
  }, [loadEsims]);

  return (
    <ShellScreen header={
      <View style={styles.hero}>
        <Image source={heroUrl ? { uri: heroUrl } : require('../../../assets/images/esim-travel-hero.jpg')}
          onError={() => setHeroUrl(null)}
          style={styles.heroImage} contentFit="cover" contentPosition="top" accessible={false} />
        <View style={styles.heroCaption}>
          <Text style={styles.heroEyebrow}>Services</Text>
          <Text accessibilityRole="header" style={styles.heroTitle}>Global eSIM</Text>
          <Text style={styles.heroTagline}>Stay connected. Wherever you go.</Text>
        </View>
      </View>
    }>
      {sections.map(({ id: item, title, subtitle }) => (
        <View key={item} style={styles.section}>
          <Card>
            <Pressable accessibilityRole="button" accessibilityState={{ expanded: section === item }}
              onPress={() => { setFeatured(null); setSection(current => current === item ? null : item); }}
              style={styles.sectionHeader}>
              <View style={styles.sectionCopy}>
                <Text style={styles.stateTitle}>{title}</Text>
                <Text style={styles.stateText}>{subtitle}</Text>
              </View>
              <Text importantForAccessibility="no" style={styles.sectionChevron}>{section === item ? '−' : '+'}</Text>
            </Pressable>
          </Card>
          {item === 'purchase' && section === item ? <EsimPurchase key={featured?.code ?? 'search'} initialDestination={featured ?? undefined} onReturn={() => void loadEsims()} /> : null}
          {item === 'compatibility' && section === item ? (
            <Card><View style={styles.sectionCopy}>
              <Text style={styles.stateTitle}>Before you buy</Text>
              <Text style={styles.stateText}>Your phone needs to be carrier unlocked and support eSIM for its exact model and region.</Text>
              <Text style={styles.stateTitle}>Quick device check</Text>
              <Text style={styles.stateText}>Dial *#06# and look for an EID. If you see one, the phone generally supports eSIM. Check carrier unlock status separately.</Text>
            </View></Card>
          ) : null}
          {item === 'owned' && section === item ? <>
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

          <Button label="Purchase eSIM" onPress={() => setSection('purchase')} />
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
          </> : null}
        </View>
      ))}
      <View style={styles.section}>
        <Text accessibilityRole="header" style={styles.stateTitle}>You may also like</Text>
        <View onLayout={({ nativeEvent }) => setSlideWidth(nativeEvent.layout.width)}>
        {slideWidth > 0 ? (
          <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}
            accessibilityLabel="Destination suggestions">

          {destinations.map(item => (
            <Pressable key={item.code} accessibilityRole="button" accessibilityLabel={'Explore ' + item.name}
              onPress={() => { setFeatured(item); setSection('purchase'); }} style={[styles.destination, { width: slideWidth }]}>
              <Image source={{ uri: 'https://voltemobile.com/images/esim/destinations/' + item.image + '.webp' }}
                style={styles.destinationImage} contentFit="cover" accessible={false} />
              <View style={styles.destinationCaption}>
                <Text style={styles.destinationName}>{item.name}</Text>
                <Text style={styles.destinationArrow} importantForAccessibility="no">→</Text>
              </View>
            </Pressable>
          ))}
          </ScrollView>
        ) : null}
        </View>
      </View>
      <Card><View style={styles.sectionCopy}>
        <Text style={styles.stateTitle}>Digital activation</Text>
        <Text style={styles.stateText}>After successful payment, your eSIM is provisioned and its installation details are linked securely to your VoLTE Mobile account.</Text>
      </View></Card>
    </ShellScreen>
  );
}

const styles =
  StyleSheet.create({
  hero: { borderRadius: 26, overflow: 'hidden', backgroundColor: '#e5eef0' },
  heroImage: { width: '100%', aspectRatio: 1.06 },
  heroCaption: { backgroundColor: '#fff', paddingHorizontal: 20, paddingVertical: 17, gap: 4 },
  heroEyebrow: { color: '#a51661', fontWeight: '700', fontSize: 11, letterSpacing: 2, textTransform: 'uppercase' },
  heroTitle: { color: Colors.text.primary, fontSize: 36, fontWeight: '800', letterSpacing: -1.4 },
  heroTagline: { color: Colors.text.secondary, fontSize: 16, fontWeight: '600' },
  destination: { backgroundColor: '#fff', borderRadius: 22, overflow: 'hidden' },
  destinationImage: { width: '100%', aspectRatio: 1.55, backgroundColor: '#e5e0ed' },
  destinationCaption: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  destinationName: { color: Colors.text.primary, fontSize: 20, fontWeight: '700', flexShrink: 1 },
  destinationArrow: { color: '#a51661', fontSize: 22, marginLeft: 12 },
  section: { gap: Spacing.md },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, minHeight: 64 },
  sectionCopy: { flex: 1, gap: 4 },
  sectionChevron: { color: Colors.brand.primary, fontSize: 24 },
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
        '700',
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
