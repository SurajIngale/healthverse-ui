import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { Clock, Upload, FileText, Pill, Receipt, FileHeart, Sun, Moon, Home, Search, Calendar, User, X, Eye, Download } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTheme, lightTheme, darkTheme } from '../../contexts/ThemeContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface TimelineEvent {
  id: string;
  type: 'report' | 'prescription' | 'invoice' | 'discharge' | 'consultation';
  title: string;
  date: string;
  timestamp: number;
  description: string;
  documentUrl?: string;
}

export default function TimelineScreen() {
  const router = useRouter();
  const { isDark, toggleTheme } = useTheme();
  const colors = isDark ? darkTheme : lightTheme;
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);

  const [events, setEvents] = useState<TimelineEvent[]>([
    {
      id: '1',
      type: 'report',
      title: 'Blood Work Complete',
      date: 'Jan 15, 2025',
      timestamp: Date.now() - 86400000 * 5,
      description: 'Complete Blood Count analysis results',
      documentUrl: 'https://example.com/blood-work-report.pdf',
    },
    {
      id: '2',
      type: 'prescription',
      title: 'New Medication',
      date: 'Jan 12, 2025',
      timestamp: Date.now() - 86400000 * 8,
      description: 'Diabetes medication prescribed',
      documentUrl: 'https://example.com/prescription.pdf',
    },
    {
      id: '3',
      type: 'consultation',
      title: 'Cardiology Checkup',
      date: 'Jan 8, 2025',
      timestamp: Date.now() - 86400000 * 12,
      description: 'Routine cardiac examination',
    },
    {
      id: '4',
      type: 'invoice',
      title: 'Payment Processed',
      date: 'Jan 5, 2025',
      timestamp: Date.now() - 86400000 * 15,
      description: 'Consultation fee payment',
      documentUrl: 'https://example.com/invoice.pdf',
    },
  ]);

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'report':
        return FileText;
      case 'prescription':
        return Pill;
      case 'invoice':
        return Receipt;
      case 'discharge':
        return FileHeart;
      default:
        return FileText;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'report':
        return '#6366F1';
      case 'prescription':
        return '#10B981';
      case 'invoice':
        return '#F59E0B';
      case 'discharge':
        return '#EF4444';
      case 'consultation':
        return '#3B82F6';
      default:
        return '#6366F1';
    }
  };

  const handleUploadDocument = () => {
    router.push('/(tabs)/upload-document');
  };

  const handleViewDetails = (event: TimelineEvent) => {
    setSelectedEvent(event);
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.containerBg }]}>
      <LinearGradient
        colors={colors.background as any}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: colors.textSecondary }]}>Medical History</Text>
            <Text style={[styles.username, { color: colors.text }]}>Your Timeline</Text>
          </View>
          <View style={styles.headerIcons}>
            <TouchableOpacity onPress={toggleTheme} style={[styles.iconButton, { backgroundColor: colors.iconButton, borderColor: colors.iconButtonBorder }]}>
              {isDark ? (
                <Sun size={22} color={colors.textSecondary} strokeWidth={2} />
              ) : (
                <Moon size={22} color={colors.textSecondary} strokeWidth={2} />
              )}
            </TouchableOpacity>
            <TouchableOpacity onPress={handleUploadDocument} style={[styles.iconButton, { backgroundColor: colors.accentLight, borderColor: colors.accent }]}>
              <Upload size={22} color={colors.accent} strokeWidth={2} />
            </TouchableOpacity>
          </View>
        </View>

        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: 200, type: 'spring' }}
          style={styles.statsRow}
        >
          <View style={[styles.statBox, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
            <Text style={[styles.statValue, { color: colors.text }]}>{events.length}</Text>
            <Text style={[styles.statLabel, { color: colors.textTertiary }]}>Total Events</Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
            <Text style={[styles.statValue, { color: colors.text }]}>3</Text>
            <Text style={[styles.statLabel, { color: colors.textTertiary }]}>This Month</Text>
          </View>
        </MotiView>

        <TouchableOpacity onPress={handleUploadDocument} style={styles.uploadButton}>
          <LinearGradient
            colors={['#6366F1', '#818CF8']}
            style={styles.uploadGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Upload size={20} color="#ffffff" strokeWidth={2} />
            <Text style={styles.uploadText}>Upload Medical Document</Text>
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.timelineContainer}>
          <View style={[styles.timelineLine, { backgroundColor: colors.cardBorder }]} />

          {events.map((event, index) => {
            const Icon = getEventIcon(event.type);
            const color = getEventColor(event.type);
            const isLast = index === events.length - 1;

            return (
              <MotiView
                key={event.id}
                from={{ opacity: 0, translateX: -30, scale: 0.9 }}
                animate={{ opacity: 1, translateX: 0, scale: 1 }}
                transition={{ delay: 400 + index * 100, type: 'spring', damping: 15 }}
                style={styles.timelineItem}
              >
                <MotiView
                  from={{ scale: 0, rotate: '-180deg' }}
                  animate={{ scale: 1, rotate: '0deg' }}
                  transition={{ delay: 500 + index * 100, type: 'spring', damping: 12 }}
                  style={[styles.timelineNode, { backgroundColor: color, borderColor: colors.containerBg }]}
                >
                  <Icon size={18} color="#ffffff" strokeWidth={2.5} />
                </MotiView>

                <View style={[styles.eventCard, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
                  <View style={styles.eventHeader}>
                    <View style={[styles.eventTypeBox, { backgroundColor: `${color}15` }]}>
                      <Text style={[styles.eventType, { color }]}>{event.type}</Text>
                    </View>
                    <Text style={[styles.eventDate, { color: colors.textTertiary }]}>{event.date}</Text>
                  </View>
                  <Text style={[styles.eventTitle, { color: colors.text }]}>{event.title}</Text>

                  <View style={styles.eventFooter}>
                    <TouchableOpacity
                      style={[styles.viewButton, { borderColor: color }]}
                      onPress={() => handleViewDetails(event)}
                    >
                      <Text style={[styles.viewButtonText, { color }]}>View Details</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </MotiView>
            );
          })}
        </View>

        <View style={styles.spacing} />
      </ScrollView>

      <Modal
        visible={!!selectedEvent}
        transparent
        animationType="fade"
        onRequestClose={handleCloseModal}
      >
        <View style={[styles.modalOverlay, { backgroundColor: isDark ? 'rgba(15, 23, 42, 0.9)' : 'rgba(0, 0, 0, 0.7)' }]}>
          <MotiView
            from={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', damping: 15 }}
            style={[styles.modalContent, { backgroundColor: colors.containerBg }]}
          >
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Document Details</Text>
              <TouchableOpacity onPress={handleCloseModal} style={[styles.closeButton, { backgroundColor: colors.cardBg }]}>
                <X size={20} color={colors.text} strokeWidth={2} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              {selectedEvent && (
                <>
                  <View style={[styles.detailRow, { borderBottomColor: colors.cardBorder }]}>
                    <Text style={[styles.detailLabel, { color: colors.textTertiary }]}>Type</Text>
                    <View style={[styles.typeBadge, { backgroundColor: `${getEventColor(selectedEvent.type)}15` }]}>
                      <Text style={[styles.typeBadgeText, { color: getEventColor(selectedEvent.type) }]}>
                        {selectedEvent.type.charAt(0).toUpperCase() + selectedEvent.type.slice(1)}
                      </Text>
                    </View>
                  </View>

                  <View style={[styles.detailRow, { borderBottomColor: colors.cardBorder }]}>
                    <Text style={[styles.detailLabel, { color: colors.textTertiary }]}>Title</Text>
                    <Text style={[styles.detailValue, { color: colors.text }]}>{selectedEvent.title}</Text>
                  </View>

                  <View style={[styles.detailRow, { borderBottomColor: colors.cardBorder }]}>
                    <Text style={[styles.detailLabel, { color: colors.textTertiary }]}>Date</Text>
                    <Text style={[styles.detailValue, { color: colors.text }]}>{selectedEvent.date}</Text>
                  </View>

                  <View style={[styles.detailRow, { borderBottomColor: colors.cardBorder }]}>
                    <Text style={[styles.detailLabel, { color: colors.textTertiary }]}>Description</Text>
                    <Text style={[styles.detailValue, { color: colors.text }]}>{selectedEvent.description}</Text>
                  </View>

                  {selectedEvent.documentUrl && (
                    <View style={[styles.documentSection, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
                      <View style={styles.documentHeader}>
                        <FileText size={24} color={getEventColor(selectedEvent.type)} strokeWidth={2} />
                        <Text style={[styles.documentTitle, { color: colors.text }]}>Attached Document</Text>
                      </View>

                      <TouchableOpacity
                        style={styles.viewDocButton}
                        onPress={() => {
                          console.log('Opening document:', selectedEvent.documentUrl);
                        }}
                      >
                        <LinearGradient
                          colors={['#6366F1', '#818CF8']}
                          style={styles.viewDocGradient}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 1 }}
                        >
                          <Eye size={18} color="#ffffff" strokeWidth={2} />
                          <Text style={styles.viewDocText}>View Document</Text>
                        </LinearGradient>
                      </TouchableOpacity>

                      <TouchableOpacity
                        style={[styles.downloadButton, { backgroundColor: colors.containerBg, borderColor: colors.cardBorder }]}
                        onPress={() => {
                          console.log('Downloading document:', selectedEvent.documentUrl);
                        }}
                      >
                        <Download size={18} color={colors.accent} strokeWidth={2} />
                        <Text style={[styles.downloadText, { color: colors.accent }]}>Download</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </>
              )}
            </ScrollView>
          </MotiView>
        </View>
      </Modal>

      <View style={styles.bottomNav}>
        <View style={[styles.navContainer, { backgroundColor: colors.navBg, borderColor: colors.iconButtonBorder }]}>
          <TouchableOpacity onPress={() => router.push('/(tabs)/patient-home')} style={styles.navButton} activeOpacity={0.7}>
            <View style={[styles.navButtonInner, { backgroundColor: colors.navInactive }]}>
              <Home size={24} color={colors.textSecondary} strokeWidth={2} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navButton} activeOpacity={0.7}>
            <View style={[styles.navButtonInner, { backgroundColor: colors.navInactive }]}>
              <Search size={24} color={colors.textSecondary} strokeWidth={2} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navButton} activeOpacity={0.7}>
            <View style={[styles.navButtonInner, styles.navButtonActive]}>
              <Clock size={24} color="#ffffff" strokeWidth={2} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/(tabs)/profile')} style={styles.navButton} activeOpacity={0.7}>
            <View style={[styles.navButtonInner, { backgroundColor: colors.navInactive }]}>
              <User size={24} color={colors.textSecondary} strokeWidth={2} />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 120,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  username: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    marginTop: 4,
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  statBox: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  uploadButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 32,
  },
  uploadGradient: {
    flexDirection: 'row',
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  uploadText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  timelineContainer: {
    position: 'relative',
    paddingLeft: 20,
  },
  timelineLine: {
    position: 'absolute',
    left: 18,
    top: 30,
    bottom: 0,
    width: 2,
  },
  timelineItem: {
    marginBottom: 20,
    position: 'relative',
  },
  timelineNode: {
    position: 'absolute',
    left: -20,
    top: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    zIndex: 2,
  },
  eventCard: {
    marginLeft: 36,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  eventTypeBox: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  eventType: {
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  eventDate: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
  },
  eventTitle: {
    fontSize: 15,
    fontFamily: 'Inter-Bold',
    marginBottom: 8,
  },
  eventFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  viewButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1.5,
  },
  viewButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
  spacing: {
    height: 40,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    right: 24,
    alignItems: 'center',
  },
  navContainer: {
    flexDirection: 'row',
    borderRadius: 28,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    borderWidth: 1,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 16,
  },
  navButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButtonInner: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButtonActive: {
    backgroundColor: '#6366F1',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 500,
    maxHeight: '80%',
    borderRadius: 24,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(99, 102, 241, 0.1)',
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBody: {
    padding: 20,
  },
  detailRow: {
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  detailLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  detailValue: {
    fontSize: 15,
    fontFamily: 'Inter-Regular',
    lineHeight: 22,
  },
  typeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  typeBadgeText: {
    fontSize: 13,
    fontFamily: 'Inter-SemiBold',
    textTransform: 'capitalize',
  },
  documentSection: {
    marginTop: 16,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
  },
  documentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  documentTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
  },
  viewDocButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 10,
  },
  viewDocGradient: {
    flexDirection: 'row',
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  viewDocText: {
    fontSize: 15,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  downloadButton: {
    flexDirection: 'row',
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  downloadText: {
    fontSize: 15,
    fontFamily: 'Inter-SemiBold',
  },
});
