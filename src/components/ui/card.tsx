import type { ReactNode } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

import {
  Colors,
  Radius,
  Spacing,
} from '@/theme/tokens';

type CardProps = {
  children: ReactNode;
};

export function Card({
  children,
}: CardProps) {
  return (
    <View style={styles.card}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.background.surface,
    borderColor: Colors.border.default,
    borderWidth: 1,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
  },
});
