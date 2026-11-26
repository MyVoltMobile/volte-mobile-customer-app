import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import * as WebBrowser from 'expo-web-browser';

import { Button } from '@/components/ui/button';
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
  const pending = useRef(false);
  const lastStatus = useRef<UpgradeStatus['status']>();

  useEffect(() => {
    let active = true;
    void request<{ options: Option[] }>(root + '-quote').then(result => {
      if (active && Array.isArray(result.options)) setOptions(result.options);
    }).catch(() => {});
    return () => { active = false; };
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
              variant="secondary" disabled={busy} onPress={() => setExpanded(!expanded)} />
            {expanded && options.map(option => (
              <Button key={option.subscriptionId + option.packageId}
                label={option.currentPlanName + ' → ' + option.planName}
                variant="secondary" disabled={busy} onPress={() => void run(() => choose(option))} />
            ))}
          </>
        ) : null}
        {review ? (
          <>
            <Text style={styles.heading}>{review.offer.packageName}</Text>
            <Text>Due today {amounts.format(review.offer.amountDueCents / 100)}</Text>
            <Text>Unused-time credit {amounts.format(review.offer.unusedCreditCents / 100)}</Text>
            <Text>New monthly price {amounts.format(review.offer.unitPrice)}</Text>
            <Text>Your new billing cycle starts when the plan activates.</Text>
            <Text accessibilityRole="header" style={styles.heading}>{review.agreement.title}</Text>
            <Text selectable>{review.agreement.text}</Text>
            <Button label="Accept and continue to payment" disabled={busy} onPress={() => void run(() => checkout(review))} />
            <Button label="Back to plans" variant="secondary" disabled={busy} onPress={() => setReview(null)} />
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
            {status?.status === 'EXPIRED' ? <Button label="Choose a plan" variant="secondary" onPress={() => {
              setTracking(null); setStatus(null);
            }} /> : null}
          </>
        ) : null}
        {error ? <Text accessibilityLiveRegion="polite">{error}</Text> : null}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  content: { gap: Spacing.md },
  heading: { fontSize: 18, fontWeight: '600' },
});
