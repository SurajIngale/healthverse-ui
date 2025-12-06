import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { Upload, X, Layers } from 'lucide-react-native';
import { useTheme, lightTheme, darkTheme } from '@/modules/shared/contexts/ThemeContext';

export interface Document {
  id: string;
  type: 'prescription' | 'report' | 'invoice' | 'other';
  title: string;
  date: string;
  timestamp: number;
  icon?: string;
  url?: string;
  fileType?: string;
}

interface DocumentTimelineProps {
  documents: Document[];
  onUpload: () => void;
  onViewDocument: (doc: Document) => void;
}

const getDocumentIcon = (type: string) => {
  switch (type) {
    case 'prescription':
      return '💊';
    case 'report':
      return '📋';
    case 'invoice':
      return '🧾';
    default:
      return '📄';
  }
};

const getDocumentColor = (type: string, isDark: boolean) => {
  const colors = {
    prescription: isDark ? '#34D399' : '#10B981',
    report: isDark ? '#818CF8' : '#6366F1',
    invoice: isDark ? '#FBBF24' : '#F59E0B',
    other: isDark ? '#F87171' : '#EF4444',
  };
  return colors[type as keyof typeof colors] || colors.other;
};

function TimelineNode({
  doc,
  index,
  total,
  color,
  isDark,
  colors,
  onPress,
}: {
  doc: Document;
  index: number;
  total: number;
  color: string;
  isDark: boolean;
  colors: any;
  onPress: () => void;
}) {
  const scale = useSharedValue(1);
  const rotateZ = useSharedValue(0);

  const gesture = Gesture.Pan()
    .onBegin(() => {
      scale.value = withSpring(1.15);
      rotateZ.value = withSpring(360);
    })
    .onEnd(() => {
      scale.value = withSpring(1);
      rotateZ.value = withSpring(0);
    });

  const animatedNodeStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { scale: scale.value },
        { rotateZ: `${rotateZ.value}deg` },
      ] as any,
    };
  });

  const isLeft = index % 2 === 0;

  return (
    <MotiView
      from={{
        opacity: 0,
        scale: 0.5,
      }}
      animate={{
        opacity: 1,
        scale: 1,
      }}
      transition={{
        type: 'spring',
        delay: 200 + index * 150,
        damping: 15,
        stiffness: 100,
      }}
      style={[
        styles.timelineItemContainer,
        { justifyContent: isLeft ? 'flex-start' : 'flex-end' },
      ]}
    >
      <View
        style={[
          styles.timelineItemRow,
          { flexDirection: isLeft ? 'row' : 'row-reverse' },
        ]}
      >
        {/* Content Card */}
        <TouchableOpacity
          onPress={onPress}
          style={[styles.contentCard, { maxWidth: '60%' }]}
          activeOpacity={0.7}
        >
          <LinearGradient
            colors={
              isDark
                ? [`${color}15`, `${color}08`]
                : [`${color}12`, `${color}06`]
            }
            style={[
              styles.cardGradient,
              {
                borderColor: `${color}30`,
                borderLeftColor: color,
                borderLeftWidth: 4,
              },
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={[styles.cardType, { color }]}>
              {doc.type.toUpperCase()}
            </Text>
            <Text style={[styles.cardTitle, { color: colors.text }]}>
              {doc.title}
            </Text>
            <Text style={[styles.cardDate, { color: colors.textTertiary }]}>
              {doc.date}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Node */}
        <GestureDetector gesture={gesture}>
          <Animated.View style={[styles.nodeWrapper, animatedNodeStyle]}>
            <View style={[styles.nodeOuter, { borderColor: color }]}>
              <View style={[styles.nodeInner, { backgroundColor: color }]}>
                <Text style={styles.nodeIcon}>
                  {getDocumentIcon(doc.type)}
                </Text>
              </View>
            </View>
          </Animated.View>
        </GestureDetector>
      </View>
    </MotiView>
  );
}

export function DocumentTimeline({
  documents,
  onUpload,
  onViewDocument,
}: DocumentTimelineProps) {
  const { isDark } = useTheme();
  const colors = isDark ? darkTheme : lightTheme;
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);

  const sortedDocs = [...documents].sort((a, b) => b.timestamp - a.timestamp);

  if (documents.length === 0) {
    return (
      <MotiView
        from={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 300, damping: 15 } as any}
        style={[
          styles.emptyCard,
          {
            backgroundColor: colors.cardBg,
            borderColor: colors.cardBorder,
          },
        ]}
      >
        <View style={[styles.emptyContainer, { backgroundColor: colors.accentLight }]}>
          <Upload size={40} color={colors.accent} strokeWidth={1.5} />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>
            No Documents Yet
          </Text>
          <Text style={[styles.emptySubtitle, { color: colors.textTertiary }]}>
            Upload your medical documents
          </Text>
        </View>

        <TouchableOpacity onPress={onUpload} style={styles.uploadButton}>
          <LinearGradient
            colors={['#6366F1', '#818CF8']}
            style={styles.uploadButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Upload size={18} color="#ffffff" strokeWidth={2} />
            <Text style={styles.uploadButtonText}>Upload Document</Text>
          </LinearGradient>
        </TouchableOpacity>
      </MotiView>
    );
  }

  return (
    <>
      <MotiView
        from={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 300, damping: 15 } as any}
        style={[
          styles.mainCard,
          {
            backgroundColor: colors.cardBg,
            borderColor: colors.cardBorder,
          },
        ]}
      >
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={[styles.title, { color: colors.text }]}>
              Documents Timeline
            </Text>
            <View style={[styles.countBadge, { backgroundColor: colors.accentLight }]}>
              <Text style={[styles.count, { color: colors.accent }]}>
                {documents.length}
              </Text>
            </View>
          </View>
          <Layers size={20} color={colors.accent} strokeWidth={2} />
        </View>

        {/* Vertical Timeline */}
        <View style={styles.timelineContainer}>
          {/* Timeline Line */}
          <View
            style={[
              styles.timelineLine,
              {
                backgroundColor: isDark
                  ? 'rgba(255, 255, 255, 0.1)'
                  : 'rgba(0, 0, 0, 0.08)',
              },
            ]}
          />

          {/* Timeline Items */}
          {sortedDocs.map((doc, index) => {
            const color = getDocumentColor(doc.type, isDark);

            return (
              <TimelineNode
                key={doc.id}
                doc={doc}
                index={index}
                total={sortedDocs.length}
                color={color}
                isDark={isDark}
                colors={colors}
                onPress={() => setSelectedDoc(doc)}
              />
            );
          })}
        </View>

        <TouchableOpacity onPress={onUpload} style={styles.addButton}>
          <LinearGradient
            colors={['#6366F1', '#818CF8']}
            style={styles.addButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Upload size={18} color="#ffffff" strokeWidth={2} />
            <Text style={styles.addButtonText}>Add Document</Text>
          </LinearGradient>
        </TouchableOpacity>
      </MotiView>

      <Modal
        visible={!!selectedDoc}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedDoc(null)}
      >
        <View
          style={[
            styles.modalOverlay,
            {
              backgroundColor: isDark
                ? 'rgba(15, 23, 42, 0.95)'
                : 'rgba(0, 0, 0, 0.8)',
            },
          ]}
        >
          <MotiView
            from={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 20 }}
            style={[styles.modalContent, { backgroundColor: colors.containerBg }]}
          >
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                {selectedDoc?.title}
              </Text>
              <TouchableOpacity onPress={() => setSelectedDoc(null)}>
                <X size={24} color={colors.text} strokeWidth={2} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalDivider} />

            <ScrollView
              style={styles.modalBody}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.docDetails}>
                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: colors.textTertiary }]}>
                    Type
                  </Text>
                  <Text style={[styles.detailValue, { color: colors.text }]}>
                    {selectedDoc?.type.charAt(0).toUpperCase()}
                    {selectedDoc?.type.slice(1)}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: colors.textTertiary }]}>
                    Date
                  </Text>
                  <Text style={[styles.detailValue, { color: colors.text }]}>
                    {selectedDoc?.date}
                  </Text>
                </View>

                {selectedDoc?.fileType && (
                  <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, { color: colors.textTertiary }]}>
                      File Type
                    </Text>
                    <Text style={[styles.detailValue, { color: colors.text }]}>
                      {selectedDoc.fileType}
                    </Text>
                  </View>
                )}
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                onPress={() => setSelectedDoc(null)}
                style={[styles.closeButton, { backgroundColor: colors.cardBg }]}
              >
                <Text style={[styles.closeButtonText, { color: colors.text }]}>
                  Close
                </Text>
              </TouchableOpacity>
            </View>
          </MotiView>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  emptyCard: {
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    marginBottom: 16,
    alignItems: 'center',
  },
  emptyContainer: {
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginTop: 6,
    textAlign: 'center',
  },
  uploadButton: {
    borderRadius: 12,
    overflow: 'hidden',
    width: '100%',
  },
  uploadButtonGradient: {
    flexDirection: 'row',
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  uploadButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  mainCard: {
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
  },
  countBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  count: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
  },
  timelineContainer: {
    position: 'relative',
    paddingVertical: 8,
    marginBottom: 20,
  },
  timelineLine: {
    position: 'absolute',
    left: '50%',
    top: 0,
    bottom: 0,
    width: 3,
    marginLeft: -1.5,
    zIndex: 0,
  },
  timelineItemContainer: {
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  timelineItemRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  contentCard: {
    paddingHorizontal: 12,
  },
  cardGradient: {
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardType: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    letterSpacing: 0.5,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  cardTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
    lineHeight: 18,
  },
  cardDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  nodeWrapper: {
    zIndex: 10,
  },
  nodeOuter: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  nodeInner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nodeIcon: {
    fontSize: 20,
  },
  addButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  addButtonGradient: {
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  addButtonText: {
    fontSize: 15,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    borderRadius: 28,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    flex: 1,
    marginRight: 12,
  },
  modalDivider: {
    height: 1,
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
  },
  modalBody: {
    padding: 24,
  },
  docDetails: {
    gap: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  detailValue: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  modalFooter: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: 'rgba(99, 102, 241, 0.15)',
  },
  closeButton: {
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.2)',
  },
  closeButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
});
