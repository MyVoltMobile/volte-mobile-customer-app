import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";
import { Alert, Linking, StyleSheet, Text, View } from "react-native";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShellScreen } from "@/components/shell/shell-screen";
import { authenticatedCustomerFetch } from "@/lib/customer/customer-api";
import { Colors, Spacing, Typography } from "@/theme/tokens";

type Offer = {
  id: string;
  deviceName?: string;
  subjectToAvailability: boolean;
  currentMonthlyCents: number;
  selectedOptionId?: string | null;
  options: { id: string; termMonths: number; monthlyPaymentCents: number; dueTodayCents: number; totalPayableCents: number }[];
};

function jmd(cents: number) {
  return "J$" + (cents / 100).toLocaleString("en-JM", {
    minimumFractionDigits: 2, maximumFractionDigits: 2,
  });
}

export default function OffersScreen() {
  const [offers, setOffers] = useState<Offer[] | null>(null);
  const [failed, setFailed] = useState(false);

  const [saving, setSaving] = useState<string | null>(null);

  async function select(offerId: string, optionId: string) {
    if (saving) return;
    setSaving(offerId);
    try {
      const response = await authenticatedCustomerFetch("/api/public/customer-trade-up-offers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ offerId, optionId }),
      });
      const result = await response.json();
      if (!response.ok || result.selectedOptionId !== optionId) {
        throw new Error(result.error || "Your option could not be saved.");
      }
      setOffers((current) => current?.map((offer) =>
        offer.id === offerId ? { ...offer, selectedOptionId: optionId } : offer
      ) ?? null);
    } catch (error) {
      Alert.alert("Trade-up", error instanceof Error ? error.message : "Your option could not be saved.");
    } finally {
      setSaving(null);
    }
  }

  useFocusEffect(useCallback(() => {
    let active = true;
    setOffers(null);
    setFailed(false);
    void (async () => {
      try {
        const response = await authenticatedCustomerFetch("/api/public/customer-trade-up-offers", { method: "GET" });
        if (response.status === 404) {
          if (active) setOffers([]);
          return;
        }
        const result = await response.json();
        if (!response.ok || !Array.isArray(result.offers)) throw new Error("Offers could not be loaded.");
        if (active) setOffers(result.offers);
      } catch {
        if (active) setFailed(true);
      }
    })();
    return () => { active = false; };
  }, []));

  return (
    <ShellScreen eyebrow="Discover" title="Your Offers" description="Personalized opportunities from VoLTE Mobile.">
      <View style={styles.stack}>
        {failed && <Text style={styles.body}>Offers could not be loaded. Reopen this tab to try again.</Text>}
        {!offers && !failed && <Text style={styles.body}>Loading your offers…</Text>}
        {offers?.length === 0 && <Card><Text style={styles.title}>No offers available yet</Text></Card>}
        {offers?.map((offer) => (
          <Card key={offer.id}>
            <View style={styles.stack}>
              <Text style={styles.title}>{offer.deviceName || "Device Trade-up"}</Text>
              {offer.subjectToAvailability && <Text style={styles.body}>Subject to availability</Text>}
              <Text style={styles.body}>Current monthly payment · {jmd(offer.currentMonthlyCents)}</Text>
              {offer.options.map((option) => (
                <View key={option.id}>
                  <Text style={styles.title}>{jmd(option.monthlyPaymentCents)} / month · {option.termMonths} months</Text>
                  <Text style={styles.body}>{jmd(option.dueTodayCents)} upfront · {jmd(option.totalPayableCents)} total</Text>
                  {offer.selectedOptionId === option.id && <Text style={styles.body}>Selected for finance review</Text>}
                  {!offer.selectedOptionId && <Button label={saving === offer.id ? "Saving…" : "Choose this term"}
                    onPress={() => {
                      if (saving) return;
                      Alert.alert("Choose this term?", "Your selection will be saved for finance review.", [
                        { text: "Cancel", style: "cancel" },
                        { text: "Confirm", onPress: () => void select(offer.id, option.id) },
                      ]);
                    }} />}
                </View>
              ))}
            </View>
          </Card>
        ))}
        <Button label="Explore VoLTE Mobile" onPress={() => {
          void Linking.openURL("https://voltemobile.com/shop").catch(() => {});
        }} />
      </View>
    </ShellScreen>
  );
}

const styles = StyleSheet.create({
  stack: { gap: Spacing.md },
  title: { color: Colors.text.primary, fontSize: Typography.size.titleSmall, fontWeight: "700" },
  body: { color: Colors.text.secondary, fontSize: Typography.size.bodySmall },
});
