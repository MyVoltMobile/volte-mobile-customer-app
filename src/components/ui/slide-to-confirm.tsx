import { useRef, useState } from 'react';
import { Alert, Animated, PanResponder, StyleSheet, Text, View } from 'react-native';

export function SlideToConfirm({ label, confirmationTitle, confirmationMessage, muted, busy, onConfirm }: {
  label: string;
  confirmationTitle: string;
  confirmationMessage: string;
  muted?: boolean;
  busy: boolean;
  onConfirm: () => void;
}) {
  const [width, setWidth] = useState(0);
  const offset = useRef(new Animated.Value(0)).current;
  const travel = Math.max(0, width - 56);
  const reset = () => Animated.spring(offset, {
    toValue: 0, useNativeDriver: true, overshootClamping: true,
  }).start();
  const gesture = PanResponder.create({
    onMoveShouldSetPanResponder: (_, { dx, dy }) =>
      !busy && travel > 0 && dx > 6 && dx > Math.abs(dy),
    onPanResponderMove: (_, { dx }) => offset.setValue(Math.min(travel, Math.max(0, dx))),
    onPanResponderRelease: (_, { dx }) => {
      reset();
      if (!busy && travel > 0 && dx >= travel * 0.9) onConfirm();
    },
    onPanResponderTerminate: reset,
  });

  return (
    <View style={[styles.track, muted && styles.mutedTrack]}
      onLayout={event => setWidth(event.nativeEvent.layout.width)}
      accessible accessibilityRole="button" accessibilityLabel={label}
      accessibilityHint="Opens a confirmation before going to Scotia"
      accessibilityState={{ busy, disabled: busy }}
      accessibilityActions={[{ name: 'activate' }]}
      onAccessibilityAction={event => {
        if (busy || event.nativeEvent.actionName !== 'activate') return;
        Alert.alert(confirmationTitle, confirmationMessage,
          [{ text: 'Cancel', style: 'cancel' }, { text: 'Continue', onPress: onConfirm }]);
      }}>
      <Text style={styles.trackLabel}>{busy ? 'Opening checkout…' : label}</Text>
      <Animated.View {...gesture.panHandlers}
        style={[styles.thumb, { transform: [{ translateX: offset }] }]}>
        <Text style={styles.arrow}>›</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  track: { minHeight: 56, paddingVertical: 14, paddingLeft: 62, paddingRight: 14,
    justifyContent: 'center', borderRadius: 28, backgroundColor: '#fbe8f2',
    borderWidth: 1, borderColor: '#ebcede' },
  mutedTrack: { backgroundColor: '#f7f6fa', borderColor: '#e5e1ea' },
  trackLabel: { color: '#413a4c', fontWeight: '700', textAlign: 'center' },
  thumb: { position: 'absolute', left: 4, top: 4, bottom: 4, width: 46,
    alignItems: 'center', justifyContent: 'center', borderRadius: 23, backgroundColor: '#ad155d' },
  arrow: { color: '#fff', fontSize: 28, lineHeight: 30 },
});
