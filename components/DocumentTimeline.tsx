import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Image, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { FileText, Image as ImageIcon, Upload, X, ChevronDown } from 'lucide-react-native';
import { useTheme, lightTheme, darkTheme } from '../contexts/ThemeContext';

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

export function DocumentTimeline({ documents, onUpload, onViewDocument }: DocumentTimelineProps) {
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
        style={[styles.emptyCard, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}
      >
        <View style={[styles.emptyContainer, { backgroundColor: colors.accentLight }]}>
          <Upload size={48} color={colors.accent} strokeWidth={1.5} />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>No Documents Yet</Text>
          <Text style={[styles.emptySubtitle, { color: colors.textTertiary }]}>
            Start uploading your medical documents to build your profile
          </Text>
        </View>

        <TouchableOpacity onPress={onUpload} style={styles.uploadButton}>
          <LinearGradient
            colors={['#6366F1', '#818CF8']}
            style={styles.uploadButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Upload size={20} color="#ffffff" strokeWidth={2} />
            <Text style={styles.uploadButtonText}>Upload First Document</Text>
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
        style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Medical Timeline</Text>
          <Text style={[styles.count, { color: colors.textTertiary }]}>{documents.length} documents</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.timeline}>
          {sortedDocs.map((doc, index) => {
            const color = getDocumentColor(doc.type, isDark);
            const isLast = index === sortedDocs.length - 1;

            return (
              <View key={doc.id}>
                <View style={styles.timelineItem}>
                  <View style={styles.timelineLeft}>
                    <MotiView
                      from={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 400 + index * 100, damping: 15 } as any}
                    >
                      <View style={[styles.timelineNode, { backgroundColor: color }]} />
                    </MotiView>
                    {!isLast && <View style={[styles.timelineLine, { backgroundColor: color }]} />}
                  </View>

                  <MotiView
                    from={{ opacity: 0, translateX: 20 }}
                    animate={{ opacity: 1, translateX: 0 }}
                    transition={{ delay: 400 + index * 100 } as any}
                    style={styles.timelineContent}
                  >
                    <TouchableOpacity
                      onPress={() => setSelectedDoc(doc)}
                      style={[styles.docCard, { backgroundColor: colors.containerBg, borderColor: colors.cardBorder }]}
                      activeOpacity={0.7}
                    >
                      <View style={styles.docHeader}>
                        <View style={[styles.docIconContainer, { backgroundColor: `${color}20` }]}>
                          <Text style={styles.docIcon}>{getDocumentIcon(doc.type)}</Text>
                        </View>
                        <View style={styles.docInfo}>
                          <Text style={[styles.docType, { color: color }]}>{doc.type.charAt(0).toUpperCase() + doc.type.slice(1)}</Text>
                          <Text style={[styles.docTitle, { color: colors.text }]}>{doc.title}</Text>
                          <Text style={[styles.docDate, { color: colors.textTertiary }]}>{doc.date}</Text>
                        </View>
                        <ChevronDown size={20} color={colors.textTertiary} strokeWidth={2} style={{ marginLeft: 'auto' }} />
                      </View>
                    </TouchableOpacity>
                  </MotiView>
                </View>
              </View>
            );
          })}
        </View>

        <View style={styles.divider} />

        <TouchableOpacity onPress={onUpload} style={styles.addButton}>
          <LinearGradient
            colors={['rgba(99, 102, 241, 0.1)', 'rgba(129, 140, 248, 0.1)']}
            style={styles.addButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Upload size={18} color={colors.accent} strokeWidth={2} />
            <Text style={[styles.addButtonText, { color: colors.accent }]}>Add More Documents</Text>
          </LinearGradient>
        </TouchableOpacity>
      </MotiView>

      <Modal
        visible={!!selectedDoc}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedDoc(null)}
      >
        <View style={[styles.modalOverlay, { backgroundColor: isDark ? 'rgba(15, 23, 42, 0.9)' : 'rgba(0, 0, 0, 0.7)' }]}>
          <View style={[styles.modalContent, { backgroundColor: colors.containerBg }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>{selectedDoc?.title}</Text>
              <TouchableOpacity onPress={() => setSelectedDoc(null)}>
                <X size={24} color={colors.text} strokeWidth={2} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalDivider} />

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              <View style={styles.docDetails}>
                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: colors.textTertiary }]}>Type</Text>
                  <Text style={[styles.detailValue, { color: colors.text }]}>
                    {selectedDoc?.type.charAt(0).toUpperCase()}{selectedDoc?.type.slice(1)}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: colors.textTertiary }]}>Date</Text>
                  <Text style={[styles.detailValue, { color: colors.text }]}>{selectedDoc?.date}</Text>
                </View>

                {selectedDoc?.fileType && (
                  <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, { color: colors.textTertiary }]}>File Type</Text>
                    <Text style={[styles.detailValue, { color: colors.text }]}>{selectedDoc.fileType}</Text>
                  </View>
                )}

                {selectedDoc?.url && (
                  <View style={[styles.previewContainer, { backgroundColor: colors.cardBg }]}>
                    <View style={styles.previewPlaceholder}>
                      <ImageIcon size={48} color={colors.textTertiary} strokeWidth={1.5} />
                      <Text style={[styles.previewText, { color: colors.textTertiary }]}>Document Preview</Text>
                    </View>
                  </View>
                )}
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity onPress={() => setSelectedDoc(null)} style={[styles.closeButton, { backgroundColor: colors.cardBg }]}>
                <Text style={[styles.closeButtonText, { color: colors.text }]}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  emptyCard: {
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    marginBottom: 24,
    alignItems: 'center',
  },
  emptyContainer: {
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    marginTop: 8,
    textAlign: 'center',
  },
  uploadButton: {
    borderRadius: 12,
    overflow: 'hidden',
    width: '100%',
  },
  uploadButtonGradient: {
    flexDirection: 'row',
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  uploadButtonText: {
    fontSize: 15,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  card: {
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
  },
  count: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    marginVertical: 16,
  },
  timeline: {
    marginBottom: 0,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  timelineLeft: {
    alignItems: 'center',
    marginRight: 16,
    width: 30,
  },
  timelineNode: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  timelineLine: {
    width: 2,
    flex: 1,
    marginTop: 8,
  },
  timelineContent: {
    flex: 1,
  },
  docCard: {
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
  },
  docHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  docIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  docIcon: {
    fontSize: 24,
  },
  docInfo: {
    flex: 1,
  },
  docType: {
    fontSize: 11,
    fontFamily: 'Inter-SemiBold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  docTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 2,
  },
  docDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  addButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  addButtonGradient: {
    flexDirection: 'row',
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  addButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    borderRadius: 24,
    width: '90%',
    maxHeight: '80%',
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
  },
  modalDivider: {
    height: 1,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
  },
  modalBody: {
    padding: 20,
  },
  docDetails: {
    gap: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  detailValue: {
    fontSize: 15,
    fontFamily: 'Inter-SemiBold',
  },
  previewContainer: {
    borderRadius: 12,
    padding: 20,
    minHeight: 200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewPlaceholder: {
    alignItems: 'center',
    gap: 12,
  },
  previewText: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
  },
  modalFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(99, 102, 241, 0.1)',
  },
  closeButton: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.1)',
  },
  closeButtonText: {
    fontSize: 15,
    fontFamily: 'Inter-SemiBold',
  },
});
