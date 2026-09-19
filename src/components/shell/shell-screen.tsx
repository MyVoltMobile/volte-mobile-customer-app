import type { ReactNode } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  Colors,
  Spacing,
  Typography,
} from '@/theme/tokens';

type ShellScreenProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  header?: ReactNode;
  children?: ReactNode;
  scroll?: boolean;
  headerAlign?: 'left' | 'center';
};

export function ShellScreen({
  eyebrow,
  title,
  description,
  header,
  children,
  scroll = true,
  headerAlign = 'left',
}: ShellScreenProps) {
  const content = (
    <View style={styles.content}>
      <View
        style={[
          styles.header,
          headerAlign === 'center' &&
            styles.headerCentered,
        ]}
      >
        {header}

        {eyebrow ? (
          <Text
            style={[
              styles.eyebrow,
              headerAlign === 'center' &&
                styles.textCentered,
            ]}
          >
            {eyebrow}
          </Text>
        ) : null}

        <Text
          style={[
            styles.title,
            headerAlign === 'center' &&
              styles.textCentered,
          ]}
        >
          {title}
        </Text>

        {description ? (
          <Text
            style={[
              styles.description,
              headerAlign === 'center' &&
                styles.textCentered,
            ]}
          >
            {description}
          </Text>
        ) : null}
      </View>

      {children}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {scroll ? (
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {content}
        </ScrollView>
      ) : (
        <View style={styles.fixedContent}>
          {content}
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background.app,
  },

  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xl,
  },

  fixedContent: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xl,
  },

  content: {
    width: '100%',
    maxWidth: 560,
    alignSelf: 'center',
    gap: Spacing.md,
  },

  header: {
    width: '100%',
    gap: Spacing.md,
  },

  headerCentered: {
    alignItems: 'center',
  },

  textCentered: {
    textAlign: 'center',
  },

  eyebrow: {
    color: Colors.brand.primary,
    fontSize: Typography.size.caption,
    lineHeight: Typography.lineHeight.caption,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },

  title: {
    color: Colors.text.primary,
    fontSize: Typography.size.title,
    lineHeight: Typography.lineHeight.title,
    fontWeight: '700',
  },

  description: {
    color: Colors.text.secondary,
    fontSize: Typography.size.body,
    lineHeight: Typography.lineHeight.body,
  },
});
