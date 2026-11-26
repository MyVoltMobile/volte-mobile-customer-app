import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, AppState, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import * as WebBrowser from 'expo-web-browser';

import { Button } from '@/components/ui/button';
import { SlideToConfirm } from '@/components/ui/slide-to-confirm';
import { Card } from '@/components/ui/card';
import { authenticatedCustomerFetch } from '@/lib/customer/customer-api';
import { Spacing } from '@/theme/tokens';

const root = '/api/public/customer-iptv-upgrade';
const launchPattern = /^https:\/\/pay\.voltemobile\.com\/api\/customer-installments\/launch\/VLT-IU-[a-f0-9]{32}$/;

type Option = { subscriptionId: string; currentPlanName: string; packageId: string; planName: string };
type Review = {
  quoteId: string;
  expiresAt: string;
  offer: { packageName: string; unitPrice: number; amountDueCents: number; unusedCreditCents: number };
  agreement: { title: string; text: string; termsSha256: string };
};
type UpgradeStatus = {
  quoteId?: string;
  status: 'ACTIVE' | 'ACTIVATING' | 'AWAITING_PAYMENT' | 'REVIEW_REQUIRED' | 'EXPIRED' | 'NOT_STARTED';
  service?: { package_name: string; username?: string; password?: string };
};

const amounts = new Intl.NumberFormat('en-JM', { style: 'currency', currency: 'JMD' });
const statusText: Record<UpgradeStatus['status'], string> = {
  ACTIVE: 'Your upgraded plan is active.',
  ACTIVATING: 'Payment confirmed. Your new plan is being activated.',
  AWAITING_PAYMENT: 'Waiting for Scotia to confirm payment.',
  REVIEW_REQUIRED: 'Your upgrade needs review. Contact VoLTE Mobile before paying again.',
  EXPIRED: 'This checkout expired. Choose your plan again for a new quote.',
  NOT_STARTED: 'Checkout has not started.',
};

async function request<T>(path: string, body?: object): Promise<T> {
  const response = await authenticatedCustomerFetch(path, body ? {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
  } : undefined);
  const result = await response.json();
  if (!response.ok || result?.ok !== true) {
    const messages: Record<string, string> = {
      PAID_TERM_UNVERIFIED: 'We could not verify the unused time on this plan. Contact VoLTE Mobile for help.',
      QUOTE_MISSING_OR_EXPIRED: 'This quote expired. Choose your plan again for a new quote.',
      QUOTE_EXPIRED_OR_CHECKOUT_PENDING: 'This quote expired or a checkout is already open. Check your upgrade status before trying again.',
    };
    throw new Error(messages[result?.reason] || 'The upgrade could not be loaded. Try again shortly.');
  }
  return result as T;
}

export function IptvUpgrade({ onActivated }: { onActivated: () => void }) {
  const [options, setOptions] = useState<Option[]>([]);
  const [expanded, setExpanded] = useState(false);
  const [review, setReview] = useState<Review | null>(null);
  const [tracking, setTracking] = useState<string | null>(null);
  const [status, setStatus] = useState<UpgradeStatus | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const pending = useRef(false);
  const lastStatus = useRef<UpgradeStatus['status'] | null>(null);

  useEffect(() => {
    let active = true;
    void request<{ options: Option[] }>(root + '-quote').then(result => {
      if (active && Array.isArray(result.options)) setOptions(result.options);
    }).catch(() => {});
    void request<UpgradeStatus>(root + '-status').then(result => {
      if (active && !pending.current && result.quoteId && result.status !== 'NOT_STARTED') {
        setTracking(result.quoteId);
        setStatus(result);
        lastStatus.current = result.status;
      }
    }).catch(() => {});
    const listener = AppState.addEventListener('change', state => {
      if (state !== 'active') {
        setStatus(previous => previous?.service?.password ? { status: previous.status } : previous);
      }
    });
    return () => { active = false; listener.remove(); };
  }, []);

  async function run(action: () => Promise<void>) {
    if (pending.current) return;
    pending.current = true;
    setBusy(true);
    setError('');
    try {
      await action();
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : 'Your upgrade could not be loaded.');
    } finally {
      setBusy(false);
      pending.current = false;
    }
  }

  async function checkStatus(id: string, reveal = false) {
    const result = await request<UpgradeStatus>(root + '-status?quoteId=' + encodeURIComponent(id) +
      (reveal ? '&credentials=1' : ''));
    setStatus(result);
    if (result.status === 'ACTIVE' && lastStatus.current !== 'ACTIVE') {
      setOptions([]);
      void request<{ options: Option[] }>(root + '-quote').then(result => {
        if (Array.isArray(result.options)) setOptions(result.options);
      }).catch(() => {});
      onActivated();
    }
    lastStatus.current = result.status;
  }

  async function choose(option: Option) {
    const { quoteId } = await request<{ quoteId: string }>(root + '-quote', {
      subscriptionId: option.subscriptionId, packageId: option.packageId,
    });
    setReview(await request<Review>(root + '-agreement?quoteId=' + encodeURIComponent(quoteId)));
  }

  async function checkout(offer: Review) {
    if (Date.parse(offer.expiresAt) <= Date.now()) {
      setReview(null);
      throw new Error('This quote expired. Choose your plan again for a new quote.');
    }
    const { acceptanceId } = await request<{ acceptanceId: string }>(root + '-agreement', {
      quoteId: offer.quoteId, accepted: true, termsSha256: offer.agreement.termsSha256,
    });
    const result = await request<{ checkout: { launchUrl: string } }>(root + '-checkout', {
      quoteId: offer.quoteId, acceptanceId,
    });
    const url = result.checkout?.launchUrl;
    if (typeof url !== 'string' || !launchPattern.test(url)) throw new Error('The payment link is invalid.');
    setTracking(offer.quoteId);
    setReview(null);
    await WebBrowser.openBrowserAsync(url);
    await checkStatus(offer.quoteId);
  }

  if (!options.length && !tracking) return null;
  return (
    <Card>
      <View style={styles.content}>
        <Text accessibilityRole="header" style={styles.heading}>Upgrade package</Text>
        {!tracking && !review ? (
          <>
            <Button label={expanded ? 'Hide plans' : 'See upgrade options'}
              variant="secondary" disabled={busy && !selectedPlan} onPress={() => { if (!pending.current) setExpanded(!expanded); }} />
            {expanded && options.map(option => {
              const key = option.subscriptionId + ':' + option.packageId;
              const selected = selectedPlan === key;
              return (
                <Pressable key={key} accessibilityRole="button"
                  accessibilityState={{ selected, disabled: busy, busy: selected && busy }}
                  disabled={busy} style={[styles.plan, selected && styles.selectedPlan]}
                  onPress={() => void run(async () => {
                    setSelectedPlan(key);
                    await choose(option);
                  })}>
                  <View style={styles.planCopy}>
                    <Text style={styles.planName}>{option.planName}</Text>
                    <Text style={styles.planDetail}>From {option.currentPlanName}</Text>
                  </View>
                  {selected && busy ? <ActivityIndicator color="#ad155d" /> :
                    <Text style={styles.chevron} importantForAccessibility="no">›</Text>}
                </Pressable>
              );
            })}
          </>
        ) : null}
        {review ? (
          <>
            <View style={styles.summary}>
              <Text style={styles.heading}>{review.offer.packageName}</Text>
              {[
                ['Due today', review.offer.amountDueCents / 100],
                ['Unused-time credit', review.offer.unusedCreditCents / 100],
                ['New monthly price', review.offer.unitPrice],
              ].map(([label, amount]) => (
                <View key={label} style={styles.amountRow}>
                  <Text style={styles.amountLabel}>{label}</Text>
                  <Text style={label === 'Due today' ? styles.dueAmount : styles.amountValue}>
                    {amounts.format(Number(amount))}
                  </Text>
                </View>
              ))}
              <Text style={styles.planDetail}>Your new billing cycle starts when the plan activates.</Text>
            </View>
            <Text accessibilityRole="header" style={styles.heading}>{review.agreement.title}</Text>
            <Text style={styles.planDetail}>Scroll inside the panel to review the full terms.</Text>
            <View style={styles.agreement}>
              <ScrollView nestedScrollEnabled persistentScrollbar style={styles.agreementScroll}
                contentContainerStyle={styles.agreementContent}>
                {review.agreement.text.split(/(^(?:SECTION\s+\d+[^\n]*)$)/gim).map((part, index) =>
                  part ? <Text key={index} selectable
                    style={index % 2 ? styles.sectionTitle : styles.agreementText}>{part}</Text> : null)}
              </ScrollView>
            </View>
            <Text style={styles.planDetail}>Sliding accepts the agreement and continues to Scotia for payment.</Text>
            <SlideToConfirm label="Slide to accept" busy={busy}
              confirmationTitle="Accept the IPTV agreement?"
              confirmationMessage="Accept the agreement and continue to Scotia for payment."
              onConfirm={() => void run(() => checkout(review))} />
            <Button label="Back to plans" variant="secondary" disabled={busy} onPress={() => { setReview(null); setSelectedPlan(null); }} />
          </>
        ) : null}
        {tracking ? (
          <>
            <Text accessibilityLiveRegion="polite">{status ? statusText[status.status] : 'Check your upgrade status after checkout.'}</Text>
            {status?.service?.username && status.service.password ? (
              <View style={styles.content}>
                <Text selectable>Future TV username {status.service.username}</Text>
                <Text selectable>Future TV password {status.service.password}</Text>
                <Button label="Hide sign-in details" variant="secondary" onPress={() => setStatus({ status: 'ACTIVE' })} />
              </View>
            ) : (
              <Button label={status?.status === 'ACTIVE' ? 'Show Future TV sign-in details' : 'Check upgrade status'}
                variant="secondary" disabled={busy}
                onPress={() => void run(() => checkStatus(tracking, status?.status === 'ACTIVE'))} />
            )}
            {(status?.status === 'EXPIRED' || (status?.status === 'ACTIVE' && options.length > 0)) ? <Button label="Choose a plan" variant="secondary" disabled={busy} onPress={() => {
              setTracking(null); setStatus(null); lastStatus.current = null; setExpanded(true);
            }} /> : null}
          </>
        ) : null}
        {error ? <Text style={styles.notice} accessibilityLiveRegion="polite">{error}</Text> : null}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  content: { gap: Spacing.md },
  plan: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 16,
    padding: 14, backgroundColor: '#f7f6fa', borderWidth: 1, borderColor: '#e5e1ea' },
  selectedPlan: { borderColor: '#ad155d', backgroundColor: '#fbf0f6' },
  planCopy: { flex: 1, gap: 4 },
  planName: { color: '#19151e', fontWeight: '700', fontSize: 16 },
  planDetail: { color: '#60596c', fontSize: 13 },
  chevron: { color: '#ad155d', fontSize: 24 },
  notice: { backgroundColor: '#f7f6fa', color: '#413a4c', padding: 12, borderRadius: 12 },
  summary: { gap: 12, padding: 14, borderRadius: 16, backgroundColor: '#f7f6fa' },
  amountRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 8 },
  amountLabel: { color: '#60596c', flexShrink: 1 },
  amountValue: { color: '#19151e', fontWeight: '600' },
  dueAmount: { color: '#9c1558', fontWeight: '700' },
  agreement: { borderWidth: 1, borderColor: '#e5e1ea', borderRadius: 16, backgroundColor: '#faf9fc' },
  agreementScroll: { maxHeight: 220 },
  agreementContent: { padding: 14 },
  agreementText: { color: '#413a4c', fontSize: 14, lineHeight: 22 },
  sectionTitle: { color: '#19151e', fontSize: 14, lineHeight: 22, fontWeight: '700' },
  heading: { fontSize: 18, fontWeight: '600' },
});
