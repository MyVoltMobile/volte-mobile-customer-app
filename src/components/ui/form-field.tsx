import type {
  TextInputProps,
} from 'react-native';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import {
  Colors,
  Radius,
  Spacing,
  Typography,
} from '@/theme/tokens';

type FormFieldProps = TextInputProps & {
  label: string;
  helperText?: string;
};

export function FormField({
  label,
  helperText,
  style,
  ...inputProps
}: FormFieldProps) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>
        {label}
      </Text>

      <TextInput
        {...inputProps}
        placeholderTextColor={
          Colors.text.secondary
        }
        selectionColor={
          Colors.brand.secondary
        }
        style={[
          styles.input,
          style,
        ]}
      />

      {helperText ? (
        <Text style={styles.helper}>
          {helperText}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    width: '100%',
    gap: Spacing.sm,
  },

  label: {
    color: Colors.text.primary,
    fontSize: Typography.size.bodySmall,
    lineHeight:
      Typography.lineHeight.bodySmall,
    fontWeight: '700',
  },

  input: {
    minHeight: 54,
    width: '100%',
    backgroundColor:
      Colors.background.surface,
    borderWidth: 1,
    borderColor:
      Colors.border.default,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    color: Colors.text.primary,
    fontSize: Typography.size.body,
    lineHeight:
      Typography.lineHeight.body,
  },

  helper: {
    color: Colors.text.secondary,
    fontSize: Typography.size.caption,
    lineHeight:
      Typography.lineHeight.caption,
  },
});
