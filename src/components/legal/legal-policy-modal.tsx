import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import type {
  LegalPolicy,
} from '@/lib/legal/legal-policies';

type LegalPolicyModalProps = {
  policy:
    | LegalPolicy
    | null;

  visible: boolean;

  onClose: () => void;
};

const MAGENTA =
  '#F5007E';

export function LegalPolicyModal({
  policy,
  visible,
  onClose,
}: LegalPolicyModalProps) {
  if (!policy) {
    return null;
  }

  return (
    <Modal
      animationType="fade"
      transparent
      visible={visible}
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close legal policy"
          onPress={onClose}
          style={styles.dismissLayer}
        />

        <View
          accessibilityViewIsModal
          onAccessibilityEscape={
            onClose
          }
          style={styles.card}
        >
          <View style={styles.handle} />

          <View style={styles.header}>
            <View
              style={
                styles.headerCopy
              }
            >
              <Text style={styles.eyebrow}>
                LEGAL
              </Text>

              <Text style={styles.title}>
                {policy.title}
              </Text>
            </View>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close"
              onPress={onClose}
              hitSlop={8}
              style={({ pressed }) => [
                styles.closeButton,

                pressed &&
                  styles.closeButtonPressed,
              ]}
            >
              <Text
                style={
                  styles.closeText
                }
              >
                Close
              </Text>
            </Pressable>
          </View>

          <View style={styles.divider} />

          <ScrollView
            key={policy.id}
            style={styles.scroll}
            contentContainerStyle={
              styles.scrollContent
            }
            showsVerticalScrollIndicator
          >
            <Text style={styles.intro}>
              {policy.intro}
            </Text>

            {policy.lastUpdated ? (
              <Text
                style={
                  styles.updated
                }
              >
                Last updated:{' '}
                {policy.lastUpdated}
              </Text>
            ) : null}

            <View
              style={
                styles.policyDivider
              }
            />

            {policy.sections.map(
              (
                section,
                sectionIndex,
              ) => (
                <View
                  key={
                    `${policy.id}-${sectionIndex}`
                  }
                  style={styles.section}
                >
                  <Text
                    style={
                      styles.sectionTitle
                    }
                  >
                    {section.title}
                  </Text>

                  <View
                    style={
                      styles.blocks
                    }
                  >
                    {section.blocks.map(
                      (
                        block,
                        blockIndex,
                      ) =>
                        block.type ===
                        'bullet' ? (
                          <View
                            key={
                              `${sectionIndex}-${blockIndex}`
                            }
                            style={
                              styles.bulletRow
                            }
                          >
                            <Text
                              style={
                                styles.bullet
                              }
                            >
                              •
                            </Text>

                            <Text
                              style={
                                styles.body
                              }
                            >
                              {block.text}
                            </Text>
                          </View>
                        ) : (
                          <Text
                            key={
                              `${sectionIndex}-${blockIndex}`
                            }
                            style={
                              styles.body
                            }
                          >
                            {block.text}
                          </Text>
                        ),
                    )}
                  </View>
                </View>
              ),
            )}

            <View style={styles.endRule} />

            <Text style={styles.endNote}>
              VoLTE Mobile · Jamaica
            </Text>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles =
  StyleSheet.create({
    backdrop: {
      flex: 1,
      justifyContent: 'flex-end',
      paddingTop: 52,
      paddingHorizontal: 12,
      paddingBottom: 12,
      backgroundColor:
        'rgba(4, 5, 8, 0.72)',
    },

    dismissLayer: {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },

    card: {
      width: '100%',
      height: '88%',
      maxWidth: 680,
      alignSelf: 'center',
      overflow: 'hidden',
      borderRadius: 28,
      backgroundColor: '#FFFFFF',
    },

    handle: {
      width: 38,
      height: 4,
      marginTop: 10,
      marginBottom: 2,
      alignSelf: 'center',
      borderRadius: 999,
      backgroundColor: '#D8DBE2',
    },

    header: {
      minHeight: 86,
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent:
        'space-between',
      gap: 14,
      paddingHorizontal: 20,
      paddingTop: 14,
      paddingBottom: 16,
    },

    headerCopy: {
      flex: 1,
      gap: 5,
    },

    eyebrow: {
      color: MAGENTA,
      fontSize: 11,
      lineHeight: 15,
      fontWeight: '800',
      letterSpacing: 1.2,
    },

    title: {
      color: '#11131A',
      fontSize: 24,
      lineHeight: 29,
      fontWeight: '800',
      letterSpacing: -0.4,
    },

    closeButton: {
      minHeight: 38,
      minWidth: 66,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 14,
      borderRadius: 20,
      backgroundColor: '#F1F2F5',
    },

    closeButtonPressed: {
      opacity: 0.68,
    },

    closeText: {
      color: '#11131A',
      fontSize: 13,
      lineHeight: 17,
      fontWeight: '700',
    },

    divider: {
      height: 1,
      backgroundColor: '#E7E9EE',
    },

    scroll: {
      flex: 1,
    },

    scrollContent: {
      paddingHorizontal: 22,
      paddingTop: 22,
      paddingBottom: 42,
    },

    intro: {
      color: '#3B414D',
      fontSize: 16,
      lineHeight: 24,
      fontWeight: '500',
    },

    updated: {
      marginTop: 12,
      color: '#777E8C',
      fontSize: 12,
      lineHeight: 17,
      fontWeight: '600',
    },

    policyDivider: {
      height: 1,
      marginTop: 22,
      marginBottom: 4,
      backgroundColor: '#ECEEF2',
    },

    section: {
      paddingTop: 22,
      gap: 12,
    },

    sectionTitle: {
      color: '#11131A',
      fontSize: 18,
      lineHeight: 24,
      fontWeight: '800',
    },

    blocks: {
      gap: 12,
    },

    body: {
      flex: 1,
      color: '#4D5563',
      fontSize: 15,
      lineHeight: 23,
      fontWeight: '400',
    },

    bulletRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 10,
    },

    bullet: {
      marginTop: 1,
      color: MAGENTA,
      fontSize: 17,
      lineHeight: 23,
      fontWeight: '800',
    },

    endRule: {
      height: 1,
      marginTop: 30,
      backgroundColor: '#ECEEF2',
    },

    endNote: {
      marginTop: 18,
      color: '#8A91A0',
      fontSize: 12,
      lineHeight: 17,
      fontWeight: '600',
      textAlign: 'center',
    },
  });
