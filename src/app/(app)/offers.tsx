import { useCallback, useRef, useState } from 'react';
import * as DocumentPicker from 'expo-document-picker';
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

const documentTypes = [
  ['GOVERNMENT_ID', 'Government ID'],
  ['TRN', 'TRN'],
  ['JOB_LETTER', 'Job letter'],
  ['PROOF_OF_ADDRESS', 'Proof of address'],
  ['PAYSLIP', 'Payslip'],
  ['OTHER', 'Other document'],
] as const;

const documentMimeTypes = ['application/pdf', 'image/jpeg', 'image/png'];

function ReplacementDocuments({ offerId }: { offerId: string }) {
  const [documentType, setDocumentType] = useState('');
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState('');
  const uploading = useRef(false);

  async function upload() {
    if (uploading.current || !documentType) return;
    uploading.current = true;
    setBusy(true);
    setStatus('');
    try {
      const picked = await DocumentPicker.getDocumentAsync({
        type: documentMimeTypes,
        copyToCacheDirectory: true,
        multiple: false,
      });
      if (picked.canceled) return;
      const asset = picked.assets[0];
      const name = asset.name.toLowerCase();
      const mime = asset.mimeType && documentMimeTypes.includes(asset.mimeType)
        ? asset.mimeType
        : name.endsWith('.pdf') ? 'application/pdf'
        : /\.jpe?g$/.test(name) ? 'image/jpeg'
        : name.endsWith('.png') ? 'image/png' : '';
      if (!mime) throw new Error('Choose a PDF, JPEG, or PNG.');
      if (asset.size !== undefined && (asset.size < 1 || asset.size > 3 * 1024 * 1024)) {
        throw new Error('Choose a file no larger than 3 MB.');
      }

      const form = new FormData();
      form.append('documentType', documentType);
      // React Native serializes a local file descriptor as a multipart file.
      form.append('file', (asset.file ?? { uri: asset.uri, name: asset.name, type: mime }) as Blob);
      const response = await authenticatedCustomerFetch(
        endpoint + '/' + encodeURIComponent(offerId) + '/documents',
        { method: 'POST', body: form },
      );
      const result = await response.json().catch(() => null);
      if (!response.ok || !result?.document?.id) {
        throw new Error(result?.error ?? 'Your document could not be saved.');
      }
      setStatus('Document uploaded for staff review.');
      setDocumentType('');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Your document could not be uploaded.');
    } finally {
      uploading.current = false;
      setBusy(false);
    }
  }

  return (
    <View style={styles.content}>
      <Text style={styles.title}>Upload a replacement document</Text>
      <Text style={styles.detail}>Choose a document type, then select a PDF, JPEG, or PNG up to 3 MB.</Text>
      <View style={styles.documentTypes}>
        {documentTypes.map(([value, label]) => (
          <Button key={value} label={label} variant={value === documentType ? 'primary' : 'secondary'}
            disabled={busy} onPress={() => setDocumentType(value)} />
        ))}
      </View>
      <Button label={busy ? 'Uploading…' : 'Choose file and upload'} disabled={busy || !documentType}
        onPress={() => void upload()} />
      {!!status && <Text accessibilityLiveRegion="polite" style={styles.detail}>{status}</Text>}
    </View>
  );
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
        {offer.updateRequest && <ReplacementDocuments offerId={offer.id} />}
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
  documentTypes: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  answers: { flexDirection: 'row', gap: Spacing.sm },
  title: { color: Colors.text.primary, fontSize: Typography.size.titleSmall, fontWeight: '700' },
  detail: { color: Colors.text.secondary, fontSize: Typography.size.body, lineHeight: Typography.lineHeight.body },
});
