import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Colors, Spacing } from '@/theme/tokens';

const catalogue = 'https://portal.voltemobile.com/api/public';
const storefront = 'https://voltemobile.com';
const usageLevels = ['Light', 'Regular', 'Heavy'] as const;
const activities = [
  { label: 'Social media', rates: [0.15, 0.45, 0.9] },
  { label: 'Video streaming', rates: [0.25, 1, 2.5] },
  { label: 'Music streaming', rates: [0.05, 0.15, 0.3] },
  { label: 'Maps & navigation', rates: [0.03, 0.08, 0.15] },
  { label: 'Video calls', rates: [0.15, 0.45, 1] },
];

type Destination = { code: string; name: string };
type Plan = {
  id: string;
  name: string;
  dataAllowance: string;
  validityDays: number;
  price: number;
  currency: string;
  purchasable: boolean;
  networkInfo?: string;
  continuedData?: { available: boolean | null; speedKbps: number | null };
};

export function EsimPurchase({ initialDestination, onReturn }: {
  initialDestination?: Destination;
  onReturn: () => void;
}) {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [catalogueAttempt, setCatalogueAttempt] = useState(0);
  const [catalogueError, setCatalogueError] = useState(false);
  const [query, setQuery] = useState(initialDestination?.name ?? '');
  const [destination, setDestination] = useState<Destination | null>(initialDestination ?? null);
  const [days, setDays] = useState(7);
  const [levels, setLevels] = useState(() => activities.map(() => 1));
  const [planning, setPlanning] = useState(false);
  const [plans, setPlans] = useState<Plan[] | null>(null);
  const [error, setError] = useState('');
  const [opening, setOpening] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    setCatalogueError(false);
    void fetch(catalogue + '/esim-destinations', { signal: controller.signal })
      .then(async response => {
        const result = await response.json();
        if (!response.ok || !result.ok || !Array.isArray(result.destinations) || !result.destinations.length) throw new Error();
        if (!controller.signal.aborted) setDestinations(result.destinations);
      })
      .catch(() => { if (!controller.signal.aborted) setCatalogueError(true); });
    return () => controller.abort();
  }, [catalogueAttempt]);

  const daily = activities.reduce((sum, activity, index) => sum + activity.rates[levels[index]], 0);
  const matches = query.trim() ? destinations.filter(item =>
    item.name.toLowerCase().includes(query.trim().toLowerCase()) ||
    item.code.toLowerCase() === query.trim().toLowerCase(),
  ).slice(0, 8) : destinations.slice(0, 5);

  function clearQuote() {
    setPlans(null);
    setSelectedPlan(null);
    setError('');
  }

  async function findPlans() {
    if (!destination || planning) return;
    clearQuote();
    setPlanning(true);
    try {
      const params = new URLSearchParams({
        country: destination.code, tripDays: String(days), dailyUsageGb: daily.toFixed(2),
      });
      const response = await fetch(catalogue + '/esim-plan-search?' + params);
      const result = await response.json();
      if (!response.ok || !result.ok) throw new Error();
      const offers = result.recommendations;
      const candidates: (Plan | null | undefined)[] = offers ? [
        offers.bestPurchasable, offers.bestMatch, offers.bestValue, offers.dailyOption,
        offers.unlimitedOption, ...(offers.alternatives ?? []),
      ] : [];
      setPlans([...new Map(candidates.filter((plan): plan is Plan =>
        Boolean(plan?.purchasable && Number.isFinite(plan.price) && /^[A-Z]{3}$/.test(plan.currency)),
      ).map(plan => [plan.id, plan])).values()].slice(0, 5));
    } catch {
      setError('Plans could not be loaded. Try again or browse the website.');
    } finally {
      setPlanning(false);
    }
  }

  async function openStore() {
    if (opening) return;
    setOpening(true);
    setError('');
    const path = destination ? '?destination=' + encodeURIComponent(destination.code) + '#esim-plans' : '';
    try {
      await WebBrowser.openBrowserAsync(storefront + '/esim' + path);
      onReturn();
    } catch {
      setError('The eSIM website could not be opened. Try again.');
    } finally {
      setOpening(false);
    }
  }

  return (
    <Card>
      <View style={styles.content}>
        <Text accessibilityRole="header" style={styles.heading}>Plan your trip</Text>
        <Text style={styles.label}>Destination</Text>
        <TextInput style={styles.input} accessibilityLabel="Search destinations"
          placeholder="Search by country" placeholderTextColor={Colors.text.secondary}
          editable={!planning} value={query} onChangeText={value => {
            setQuery(value); setDestination(null); clearQuote();
          }} />
        {destination ? <Text style={styles.label}>{destination.name}</Text> : matches.map(item => (
          <Pressable key={item.code} accessibilityRole="button" disabled={planning}
            style={styles.option} onPress={() => { setDestination(item); setQuery(item.name); clearQuote(); }}>
            <Text style={styles.label}>{item.name}</Text>
          </Pressable>
        ))}
        {!destinations.length && !catalogueError ? <ActivityIndicator color={Colors.brand.primary} /> : null}
        {catalogueError ? <Button label="Retry destinations" variant="secondary"
          onPress={() => setCatalogueAttempt(value => value + 1)} /> : null}
        {!destination && query.trim() && destinations.length > 0 && !matches.length ?
          <Text style={styles.caption}>No destinations match your search.</Text> : null}
        <View style={styles.row}>
          <Text style={styles.label}>Trip length</Text>
          <View style={styles.stepper}>
            <Pressable accessibilityRole="button" accessibilityLabel="Remove a day" disabled={planning || days <= 1}
              style={styles.option} onPress={() => { setDays(value => value - 1); clearQuote(); }}>
              <Text style={styles.label}>−</Text>
            </Pressable>
            <Text style={styles.label}>{days} {days === 1 ? 'day' : 'days'}</Text>
            <Pressable accessibilityRole="button" accessibilityLabel="Add a day" disabled={planning || days >= 60}
              style={styles.option} onPress={() => { setDays(value => value + 1); clearQuote(); }}>
              <Text style={styles.label}>+</Text>
            </Pressable>
          </View>
        </View>
        {activities.map((activity, index) => (
          <View key={activity.label} style={styles.activity}>
            <Text style={styles.label}>{activity.label}</Text>
            <View style={styles.choices}>
              {usageLevels.map((label, level) => (
                <Pressable key={label} accessibilityRole="button"
                  accessibilityLabel={activity.label + ', ' + label}
                  accessibilityState={{ selected: levels[index] === level, disabled: planning }}
                  disabled={planning} style={[styles.choice, levels[index] === level && styles.selected]}
                  onPress={() => {
                    setLevels(previous => previous.map((value, position) => position === index ? level : value));
                    clearQuote();
                  }}>
                  <Text style={styles.label}>{label}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        ))}
        <View style={styles.estimate}>
          <Text style={styles.caption}>Estimated trip data · includes 20% buffer</Text>
          <Text style={styles.heading}>{(daily * days * 1.2).toFixed(1)} GB</Text>
        </View>
        <Button label={planning ? 'Finding plans…' : 'Find matching plans'} disabled={planning || !destination}
          onPress={() => void findPlans()} />
        {plans?.map(plan => {
          const selected = selectedPlan === plan.id;
          const allowance = plan.dataAllowance
            .replace(/^Total\s*(\d+(?:\.\d+)?)\s*GB$/i, '$1 GB total')
            .replace(/^Daily\s*(\d+(?:\.\d+)?)\s*GB$/i, '$1 GB per day')
            .replace(/^unlimited$/i, 'Unlimited data');
          const networks = plan.networkInfo?.replace(/\[[^\]]*\]/g, '')
            .replace(/(?:^|\|)[A-Z]{2}:/g, ' ').replace(/\|/g, ' · ').trim();
          return (
            <Pressable key={plan.id} accessibilityRole="radio" accessibilityState={{ checked: selected }}
              onPress={() => setSelectedPlan(plan.id)} style={[styles.plan, selected && styles.selected]}>
              <View style={styles.row}>
                <Text style={styles.label}>{allowance}</Text>
                <Text style={styles.caption}>{selected ? 'Selected' : 'Select'}</Text>
              </View>
              <Text style={styles.caption}>{plan.validityDays} days{networks ? ' · ' + networks : ''}</Text>
              {plan.continuedData?.available && plan.continuedData.speedKbps ?
                <Text style={styles.caption}>After high-speed data: up to {plan.continuedData.speedKbps} kbps</Text> : null}
              <Text style={styles.label}>{new Intl.NumberFormat('en-JM', {
                style: 'currency', currency: plan.currency, currencyDisplay: 'code',
              }).format(plan.price)}</Text>
            </Pressable>
          );
        })}
        {selectedPlan ? <Text style={styles.caption}>Choose this plan on the storefront to complete your purchase.</Text> : null}
        {plans?.length === 0 ? <Text style={styles.caption}>No purchasable recommendations for this trip.</Text> : null}
        <Button label="Shop on VoLTE Mobile" variant="secondary" disabled={opening}
          onPress={() => void openStore()} />
        {error ? <Text accessibilityLiveRegion="polite" style={styles.caption}>{error}</Text> : null}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  content: { gap: Spacing.md },
  heading: { color: Colors.text.primary, fontSize: 22, fontWeight: '700' },
  label: { color: Colors.text.primary, fontSize: 15, fontWeight: '600' },
  caption: { color: Colors.text.secondary, lineHeight: 20 },
  input: { borderWidth: 1, borderColor: '#dedce5', borderRadius: 14, padding: 12, color: Colors.text.primary },
  option: { minHeight: 44, justifyContent: 'center', paddingHorizontal: 12, backgroundColor: '#f4f2f7', borderRadius: 12 },
  row: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  activity: { gap: 8 },
  choices: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  choice: { minHeight: 44, paddingHorizontal: 12, justifyContent: 'center', borderRadius: 14, borderWidth: 1, borderColor: '#dedce5' },
  selected: { borderColor: Colors.brand.primary, backgroundColor: '#fbf0f6' },
  estimate: { borderRadius: 14, backgroundColor: '#fbf0f6', padding: 14, gap: 4 },
  plan: { borderRadius: 14, borderWidth: 1, borderColor: '#dedce5', padding: 14, gap: 6 },
});
