import {
  Image,
  StyleSheet,
  View,
} from 'react-native';

type BrandLogoProps = {
  width?: number;
};

const aspectRatio = 600 / 335;

export function BrandLogo({
  width = 190,
}: BrandLogoProps) {
  return (
    <View style={styles.container}>
      <Image
        source={require('../../../assets/images/volte-mobile-logo-stacked.png')}
        resizeMode="contain"
        style={{
          width,
          height: width / aspectRatio,
        }}
        accessibilityLabel="VoLTE Mobile"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },
});
