import { useState } from 'react';
import { FlatList, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { iptvLineups } from '@/lib/customer/iptv-lineups';
import { Card } from './card';
import { Button } from './button';

type Plan = keyof typeof iptvLineups;
const plans = Object.keys(iptvLineups) as Plan[];

export function IptvChannelLineup() {
  const [plan, setPlan] = useState<Plan | null>(null);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const channels = plan ? iptvLineups[plan] : [];
  const categories = ['All', ...new Set(channels.map(([, group]) => group))];
  const filtered = channels.filter(([name, group]) =>
    (category === 'All' || group === category) && name.toLowerCase().includes(query.trim().toLowerCase()));

  function open(next: Plan) {
    setQuery('');
    setCategory('All');
    setPlan(next);
  }

  return (
    <Card>
      <View style={styles.content}>
        <Text accessibilityRole="header" style={styles.title}>Channel lineups</Text>
        {plans.map((name) => (
          <Button key={name} variant="secondary"
            label={`${name} · ${iptvLineups[name].length} channels`}
            onPress={() => open(name)} />
        ))}
      </View>
      <Modal visible={plan !== null} animationType="slide" onRequestClose={() => setPlan(null)}>
        <SafeAreaView style={styles.sheet}>
          <Text style={styles.plan}>VoLTE Mobile {plan}</Text>
          <Text accessibilityRole="header" style={styles.heading}>Channel lineup</Text>
          <Text style={styles.description}>{channels.length} channels</Text>
          <TextInput style={styles.input} value={query} onChangeText={setQuery}
            accessibilityLabel="Search channels" placeholder="Search channels"
            placeholderTextColor="#62636D" autoCorrect={false} />
          <View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}
              keyboardShouldPersistTaps="handled" contentContainerStyle={styles.filters}>
              {categories.map((name) => (
                <Pressable key={name} accessibilityRole="button"
                  accessibilityState={{ selected: category === name }} onPress={() => setCategory(name)}
                  style={[styles.filter, category === name && styles.selected]}>
                  <Text style={[styles.filterText, category === name && styles.selectedText]}>{name}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
          <FlatList data={filtered} keyboardShouldPersistTaps="handled"
            keyExtractor={([name], index) => name + index}
            renderItem={({ item: [name, group] }) => (
              <View style={styles.channel}>
                <Text style={styles.channelName}>{name}</Text>
                <Text style={styles.description}>{group}</Text>
              </View>
            )}
            ListEmptyComponent={<Text style={styles.description}>No channels match your search.</Text>} />
          <Button label="Done" onPress={() => setPlan(null)} />
        </SafeAreaView>
      </Modal>
    </Card>
  );
}

const styles = StyleSheet.create({
  content: { gap: 12 },
  title: { fontSize: 20, fontWeight: '700', color: '#15161A' },
  sheet: { flex: 1, backgroundColor: '#F3F4F7', paddingHorizontal: 20, paddingVertical: 12, gap: 12 },
  plan: { color: '#A21861', fontSize: 14, fontWeight: '700' },
  heading: { color: '#15161A', fontSize: 30, fontWeight: '800' },
  description: { color: '#585C69', fontSize: 14 },
  input: { minHeight: 48, paddingHorizontal: 14, borderRadius: 14, borderWidth: 1,
    borderColor: '#D5D7DF', backgroundColor: '#FFFFFF', color: '#15161A' },
  filters: { gap: 8 },
  filter: { minHeight: 44, paddingHorizontal: 15, borderRadius: 22, justifyContent: 'center',
    backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#D5D7DF' },
  selected: { backgroundColor: '#A21861', borderColor: '#A21861' },
  filterText: { color: '#15161A', fontWeight: '600' },
  selectedText: { color: '#FFFFFF' },
  channel: { padding: 14, marginBottom: 8, gap: 4, backgroundColor: '#FFFFFF', borderRadius: 14 },
  channelName: { fontSize: 16, fontWeight: '700', color: '#15161A' },
});
