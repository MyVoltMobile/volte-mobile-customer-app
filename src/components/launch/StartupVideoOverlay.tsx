import { useEventListener } from 'expo';
import {
  useVideoPlayer,
  VideoView,
} from 'expo-video';
import {
  useCallback,
  useEffect,
  useState,
} from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

const VIDEO = require('../../../assets/brand/volte-splash-reveal.mp4');

export function StartupVideoOverlay() {
  const [visible, setVisible] = useState(true);

  const dismiss = useCallback(() => {
    setVisible(false);
  }, []);

  const player = useVideoPlayer(VIDEO, (instance) => {
    instance.loop = false;
    instance.muted = true;
  });

  useEventListener(player, 'playToEnd', dismiss);

  useEventListener(player, 'statusChange', ({ status }) => {
    if (status === 'error') {
      dismiss();
    }
  });

  useEffect(() => {
    player.play();

    const fallback = setTimeout(dismiss, 6000);

    return () => {
      clearTimeout(fallback);
    };
  }, [player, dismiss]);

  if (!visible) {
    return null;
  }

  return (
    <View
      pointerEvents="auto"
      style={styles.overlay}
    >
      <VideoView
        player={player}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        nativeControls={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#F5007E',
    zIndex: 1000,
    elevation: 1000,
  },
});
