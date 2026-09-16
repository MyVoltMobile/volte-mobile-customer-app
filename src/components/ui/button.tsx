import type { ReactNode } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  Colors,
  Radius,
  Spacing,
  Typography,
} from '@/theme/tokens';

type ButtonVariant =
  | 'primary'
  | 'secondary';

type ButtonProps = {
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  icon?: ReactNode;
  disabled?: boolean;
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  icon,
  disabled = false,
}: ButtonProps) {
  const isDisabled =
    disabled || !onPress;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{
        disabled: isDisabled,
      }}
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        variant === 'primary'
          ? styles.primary
          : styles.secondary,

        pressed &&
          variant === 'primary' &&
          styles.primaryPressed,

        pressed &&
          variant === 'secondary' &&
          styles.secondaryPressed,

        isDisabled &&
          styles.disabled,
      ]}
    >
      {icon ? (
        <View style={styles.icon}>
          {icon}
        </View>
      ) : null}

      <Text
        style={[
          styles.label,

          variant === 'primary'
            ? styles.primaryLabel
            : styles.secondaryLabel,

          isDisabled &&
            styles.disabledLabel,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 52,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: Spacing.sm,
    borderWidth: 1,
  },

  primary: {
    backgroundColor: Colors.brand.secondary,
    borderColor: Colors.brand.secondary,
  },

  primaryPressed: {
    backgroundColor: Colors.brand.secondaryPressed,
    borderColor: Colors.brand.secondaryPressed,
  },

  secondary: {
    backgroundColor: Colors.background.surface,
    borderColor: Colors.border.default,
  },

  secondaryPressed: {
    backgroundColor: Colors.background.subtle,
  },

  disabled: {
    backgroundColor: Colors.background.subtle,
    borderColor: Colors.border.default,
    opacity: 1,
  },

  disabledLabel: {
    color: Colors.text.secondary,
  },

  icon: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  label: {
    fontSize: Typography.size.body,
    lineHeight: Typography.lineHeight.body,
    fontWeight: '700',
  },

  primaryLabel: {
    color: Colors.text.inverse,
  },

  secondaryLabel: {
    color: Colors.text.primary,
  },
});
