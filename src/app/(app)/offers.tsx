import { useCallback, useRef, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { ActivityIndicator, Alert, Linking, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ShellScreen } from '@/components/shell/shell-screen';
import { authenticatedCustomerFetch } from '@/lib/customer/customer-api';
import { Colors, Spacing, Typography } from '@/theme/tokens';

const endpoint = '/api/public/customer-trade-up-offers';

type Quote = {
  id: string;
  termMonths: number;
  monthlyPaymentCents: number;
  dueTodayCents: number;
  totalPayableCents: number;
};

type Offer = {
  id: string;
  deviceName?: string;
  currentMonthlyCents: number;
  options: Quote[];
  subjectToAvailability: boolean;
  selectedOptionId: string | null;
  reconfirmation: { updatesNeeded: boolean } | null;
  updateRequest: { notes: string } | null;
};

const questions = [
  ['addressCurrent', 'Is your address still current?'],
  ['employmentCurrent', 'Is your employment still current?'],
  ['incomeSameOrHigher', 'Is your income the same or higher?'],
  ['documentsCurrent', 'Are your documents on file still valid?'],
] as const;

type Answers = Partial<Record<(typeof questions)[number][0], boolean>>;

function money(cents: number) {
  return 'J$' + (cents / 100).toLocaleString('en-JM', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

async function request(suffix = '', body?: object) {
  const response = await authenticatedCustomerFetch(endpoint + suffix, body ? {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  } : { method: 'GET' });
  const result = await response.json().catch(() => null);
  if (!response.ok || !result) {
    throw new Error(result?.error ?? 'Your offers are temporarily unavailable.');
  }
  return result;
}

function OfferCard({ offer, busy, submit }: {
  offer: Offer;
  busy: boolean;
  submit: (suffix: string, body: object) => void;
}) {
  const [answers, setAnswers] = useState<Answers>({});
  const selected = offer.options.find((option) => option.id === offer.selectedOptionId);

  return (
    <Card>
      <View style={styles.content}>
        <Text style={styles.title}>{offer.deviceName || 'Device trade-up'}</Text>
        <Text style={styles.detail}>Current monthly payment · {money(offer.currentMonthlyCents)}</Text>
        {offer.subjectToAvailability && <Text style={styles.detail}>Subject to stock availability</Text>}

        {(offer.selectedOptionId ? (selected ? [selected] : []) : offer.options).map((option) => (
          <View key={option.id} style={styles.option}>
            <Text style={styles.title}>{money(option.monthlyPaymentCents)} / month</Text>
            <Text style={styles.detail}>{option.termMonths} months · {money(option.dueTodayCents)} upfront</Text>
            <Text style={styles.detail}>Total payable · {money(option.totalPayableCents)}</Text>
            {offer.selectedOptionId ? <Text style={styles.detail}>Selected option</Text> : (
              <Button label="Choose this option" variant="secondary" disabled={busy} onPress={() => {
                Alert.alert('Choose this payment option?', 'Your selection will be saved before you confirm your finance details.', [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Confirm selection', onPress: () => submit('', { offerId: offer.id, optionId: option.id }) },
                ]);
              }} />
            )}
          </View>
        ))}

        {offer.selectedOptionId && !offer.reconfirmation && (
          <View style={styles.content}>
            <Text style={styles.title}>Confirm your finance details</Text>
            {questions.map(([key, label]) => (
              <View key={key} style={styles.option}>
                <Text style={styles.detail}>{label}</Text>
                <View style={styles.answers}>
                  <Button label="Yes" variant={answers[key] === true ? 'primary' : 'secondary'} disabled={busy}
                    onPress={() => setAnswers((current) => ({ ...current, [key]: true }))} />
                  <Button label="No" variant={answers[key] === false ? 'primary' : 'secondary'} disabled={busy}
                    onPress={() => setAnswers((current) => ({ ...current, [key]: false }))} />
                </View>
              </View>
            ))}
            <Button label="Submit details" disabled={busy || questions.some(([key]) => answers[key] === undefined)}
              onPress={() => submit('/reconfirm', { offerId: offer.id, ...answers })} />
          </View>
        )}

        {offer.reconfirmation && <Text style={styles.detail}>
          {offer.reconfirmation.updatesNeeded ? 'Details submitted. VoLTE Mobile will review the updates needed.' : 'Details confirmed. VoLTE Mobile will review your trade-up.'}
        </Text>}
        {!!offer.updateRequest?.notes && <Text style={styles.detail}>{offer.updateRequest.notes}</Text>}
      </View>
    </Card>
  );
}

export default function OffersScreen() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [actionError, setActionError] = useState('');
  const [busy, setBusy] = useState(false);
  const saving = useRef(false);
  const loadVersion = useRef(0);

  const load = useCallback(async () => {
    const version = ++loadVersion.current;
    setLoading(true);
    setLoadError('');
    try {
      const result = await request();
      if (!Array.isArray(result.offers)) throw new Error('Your offers could not be loaded.');
      if (version === loadVersion.current) setOffers(result.offers);
    } catch (error) {
      if (version === loadVersion.current) {
        setOffers([]);
        setLoadError(error instanceof Error ? error.message : 'Your offers could not be loaded.');
      }
    } finally {
      if (version === loadVersion.current) setLoading(false);
    }
  }, []);

  useFocusEffect(useCallback(() => {
    void load();
    return () => { loadVersion.current += 1; };
  }, [load]));

  async function submit(suffix: string, body: object) {
    if (saving.current) return;
    saving.current = true;
    setBusy(true);
    setActionError('');
    try {
      await request(suffix, body);
      await load();
    } catch (error) {
      setActionError(error instanceof Error ? error.message : 'Your changes could not be saved.');
      await load();
    } finally {
      saving.current = false;
      setBusy(false);
    }
  }

  return (
    <ShellScreen eyebrow="Discover" title="Your Offers" description="Personalized opportunities from VoLTE Mobile.">
      <View style={styles.content}>
        {loading && <ActivityIndicator accessibilityLabel="Loading your offers" />}
        {!loading && !!loadError && <Card>
          <View style={styles.content}>
            <Text style={styles.detail}>{loadError}</Text>
            <Button label="Try again" variant="secondary" onPress={() => void load()} />
          </View>
        </Card>}
        {!!actionError && <Text accessibilityLiveRegion="polite" style={styles.detail}>{actionError}</Text>}
        {!loading && !loadError && (offers.length ? offers.map((offer) => (
          <OfferCard key={offer.id} offer={offer} busy={busy} submit={(suffix, body) => void submit(suffix, body)} />
        )) : <Card><Text style={styles.title}>No offers available yet</Text></Card>)}
        <Button label="Explore VoLTE Mobile" onPress={() => void Linking.openURL('https://voltemobile.com/shop').catch(() => {})} />
      </View>
    </ShellScreen>
  );
}

const styles = StyleSheet.create({
  content: { gap: Spacing.md },
  option: { gap: Spacing.sm },
  answers: { flexDirection: 'row', gap: Spacing.sm },
  title: { color: Colors.text.primary, fontSize: Typography.size.titleSmall, fontWeight: '700' },
  detail: { color: Colors.text.secondary, fontSize: Typography.size.body, lineHeight: Typography.lineHeight.body },
});
