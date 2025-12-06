import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  StatusBar,
  Modal,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import {
  ArrowLeft,
  Clock,
  CheckCircle,
  XCircle,
  ChevronRight,
  Filter,
  Calendar as CalendarIcon,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import {
  useTheme,
  lightTheme,
  darkTheme,
} from '@/modules/shared/contexts/ThemeContext';
import DoctorBottomNav from '../components/dashboard/DoctorBottomNav';
import QRScanner from '@/modules/shared/components/QRScanner';

interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  reason: string;
  time: string;
  date: string;
  type: string;
  status: 'pending' | 'confirmed' | 'completed';
}

type TabType = 'waiting' | 'upcoming' | 'completed';

export default function DoctorAppointmentsScreen() {
  const router = useRouter();
  const { isDark } = useTheme();
  const colors = isDark ? darkTheme : lightTheme;
  const [activeTab, setActiveTab] = useState<TabType>('waiting');
  const [showQRScanner, setShowQRScanner] = useState(false);

  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: 'apt_1',
      patientId: 'patient_123',
      patientName: 'Emma Wilson',
      reason: 'Regular check-up and blood pressure monitoring',
      time: '10:00 AM',
      date: 'Jan 25, 2025',
      type: 'Check-up',
      status: 'pending',
    },
    {
      id: 'apt_2',
      patientId: 'patient_456',
      patientName: 'Michael Chen',
      reason: 'Follow-up for diabetes management',
      time: '2:30 PM',
      date: 'Jan 26, 2025',
      type: 'Follow-up',
      status: 'pending',
    },
    {
      id: 'apt_3',
      patientId: 'patient_789',
      patientName: 'Sarah Martinez',
      reason: 'Consultation for persistent headaches',
      time: '11:00 AM',
      date: 'Jan 27, 2025',
      type: 'Consultation',
      status: 'pending',
    },
    {
      id: 'apt_4',
      patientId: 'patient_111',
      patientName: 'James Brown',
      reason: 'Regular follow-up',
      time: '9:00 AM',
      date: 'Today',
      type: 'Follow-up',
      status: 'confirmed',
    },
    {
      id: 'apt_5',
      patientId: 'patient_222',
      patientName: 'Olivia Davis',
      reason: 'General consultation',
      time: '11:30 AM',
      date: 'Today',
      type: 'Consultation',
      status: 'confirmed',
    },
    {
      id: 'apt_6',
      patientId: 'patient_333',
      patientName: 'Robert Johnson',
      reason: 'Annual check-up',
      time: '2:00 PM',
      date: 'Yesterday',
      type: 'Check-up',
      status: 'completed',
    },
  ]);

  // Map appointment statuses to tabs
  const getAppointmentsByTab = (tab: TabType): Appointment[] => {
    switch (tab) {
      case 'waiting':
        return appointments.filter(apt => apt.status === 'pending');
      case 'upcoming':
        return appointments.filter(apt => apt.status === 'confirmed');
      case 'completed':
        return appointments.filter(apt => apt.status === 'completed');
      default:
        return [];
    }
  };

  const filteredAppointments = getAppointmentsByTab(activeTab);

  const tabs = [
    {
      id: 'waiting' as TabType,
      label: 'Waiting',
      count: appointments.filter(apt => apt.status === 'pending').length,
      color: '#f59e0b',
      bgColor: 'rgba(245, 158, 11, 0.1)',
    },
    {
      id: 'upcoming' as TabType,
      label: 'Upcoming',
      count: appointments.filter(apt => apt.status === 'confirmed').length,
      color: '#6366F1',
      bgColor: 'rgba(99, 102, 241, 0.1)',
    },
    {
      id: 'completed' as TabType,
      label: 'Completed',
      count: appointments.filter(apt => apt.status === 'completed').length,
      color: '#10b981',
      bgColor: 'rgba(16, 185, 129, 0.1)',
    },
  ];

  const handleApprove = (id: string) => {
    setAppointments((prev) =>
      prev.map((apt) =>
        apt.id === id ? { ...apt, status: 'confirmed' as const } : apt
      )
    );
  };

  const handleReject = (id: string) => {
    setAppointments((prev) => prev.filter((apt) => apt.id !== id));
  };

  const [rescheduleModal, setRescheduleModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');

  const handleViewPatient = (patientId: string, status: string) => {
    router.push({
      pathname: '/(tabs)/doctor-patient-profile',
      params: { patientId, appointmentStatus: status },
    });
  };

  const handleQRScan = (data: string) => {
    setShowQRScanner(false);
    const patientId = data.split('patient_id=')[1]?.split('&')[0] || 'patient_123';
    router.push({
      pathname: '/(tabs)/doctor-patient-profile',
      params: { patientId, walkIn: 'true' },
    });
  };

  const handleReschedule = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setNewDate(appointment.date);
    setNewTime(appointment.time);
    setRescheduleModal(true);
  };

  const handleConfirmReschedule = () => {
    if (selectedAppointment && newDate && newTime) {
      setAppointments((prev) =>
        prev.map((apt) =>
          apt.id === selectedAppointment.id
            ? { ...apt, date: newDate, time: newTime }
            : apt
        )
      );
      setRescheduleModal(false);
      setSelectedAppointment(null);
      setNewDate('');
      setNewTime('');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return '#f59e0b'; // Orange for Waiting
      case 'confirmed':
        return '#6366F1'; // Purple for Upcoming
      case 'completed':
        return '#10b981'; // Green for Completed
      default:
        return '#94a3b8';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'confirmed':
        return 'Confirmed';
      case 'completed':
        return 'Completed';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.containerBg }]}>
      <LinearGradient
        colors={colors.background}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <View
        style={[
          styles.header,
          {
            paddingTop:
              Platform.OS === 'ios' ? 50 : (StatusBar.currentHeight || 0) + 10,
          },
        ]}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={[styles.headerButton, { backgroundColor: colors.accentLight }]}
        >
          <ArrowLeft size={22} color={colors.accent} strokeWidth={2} />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: colors.text }]}>
          Appointments
        </Text>

        <View style={{ width: 40 }} />
      </View>

      {/* Modern Tabs */}
      <View style={[styles.tabsContainer, { paddingTop: Platform.OS === 'ios' ? 8 : 8 }]}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              onPress={() => setActiveTab(tab.id)}
              activeOpacity={0.7}
              style={styles.tabButton}
            >
              <View style={styles.tabContent}>
                <Text
                  style={[
                    styles.tabLabel,
                    {
                      color: isActive ? tab.color : colors.textSecondary,
                      fontWeight: isActive ? '700' : '500',
                    },
                  ]}
                >
                  {tab.label}
                </Text>
                <View
                  style={[
                    styles.tabBadge,
                    {
                      backgroundColor: isActive ? tab.bgColor : 'transparent',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.tabBadgeText,
                      {
                        color: isActive ? tab.color : colors.textTertiary,
                      },
                    ]}
                  >
                    {tab.count}
                  </Text>
                </View>
              </View>
              {isActive && (
                <MotiView
                  from={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{
                    type: 'spring',
                    damping: 15,
                    stiffness: 200,
                  }}
                  style={[
                    styles.activeIndicator,
                    { backgroundColor: tab.color },
                  ]}
                />
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        style={{ flex: 1 }}
      >
        <MotiView
          key={activeTab}
          from={{ opacity: 0, translateY: 10 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 300 }}
        >
          {filteredAppointments.length === 0 ? (
            <View
              style={[
                styles.emptyState,
                {
                  backgroundColor: colors.cardBg,
                  borderColor: colors.cardBorder,
                },
              ]}
            >
              <Filter size={48} color={colors.textTertiary} strokeWidth={1.5} />
              <Text style={[styles.emptyText, { color: colors.text }]}>
                No appointments found
              </Text>
              <Text style={[styles.emptySubtext, { color: colors.textTertiary }]}>
                Try selecting a different tab
              </Text>
            </View>
          ) : (
            filteredAppointments.map((appointment, index) => {
            const statusColor = getStatusColor(appointment.status);
            const isPending = appointment.status === 'pending';
            const isConfirmed = appointment.status === 'confirmed';

            return (
              <TouchableOpacity
                key={appointment.id}
                onPress={() =>
                  handleViewPatient(
                    appointment.patientId,
                    appointment.status
                  )
                }
                activeOpacity={0.7}
                style={[
                  styles.appointmentCard,
                  {
                    backgroundColor: colors.cardBg,
                    borderColor: colors.cardBorder,
                  },
                ]}
              >
                <View style={styles.cardHeader}>
                  <View style={styles.patientInfo}>
                    <View
                      style={[
                        styles.patientAvatar,
                        { backgroundColor: `${statusColor}15` },
                      ]}
                    >
                      <Text style={[styles.avatarText, { color: statusColor }]}>
                        {appointment.patientName.charAt(0)}
                      </Text>
                    </View>
                    <View style={styles.patientDetails}>
                      <Text
                        style={[styles.patientName, { color: colors.text }]}
                      >
                        {appointment.patientName}
                      </Text>
                      <Text
                        style={[
                          styles.appointmentReason,
                          { color: colors.textTertiary },
                        ]}
                        numberOfLines={1}
                      >
                        {appointment.reason}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.headerRight}>
                    <View
                      style={[
                        styles.statusBadge,
                        { backgroundColor: `${statusColor}15` },
                      ]}
                    >
                      <View
                        style={[
                          styles.statusDot,
                          { backgroundColor: statusColor },
                        ]}
                      />
                      <Text style={[styles.statusText, { color: statusColor }]}>
                        {getStatusLabel(appointment.status)}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() =>
                        handleViewPatient(
                          appointment.patientId,
                          appointment.status
                        )
                      }
                      style={styles.arrowButton}
                      activeOpacity={0.7}
                    >
                      <ChevronRight
                        size={20}
                        color={colors.textTertiary}
                        strokeWidth={2}
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.appointmentMeta}>
                  <View style={styles.metaItem}>
                    <Clock
                      size={14}
                      color={colors.textTertiary}
                      strokeWidth={2}
                    />
                    <Text
                      style={[styles.metaText, { color: colors.textTertiary }]}
                    >
                      {appointment.date} at {appointment.time}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.metaDivider,
                      { backgroundColor: colors.textTertiary },
                    ]}
                  />
                  <Text
                    style={[styles.metaText, { color: colors.textTertiary }]}
                  >
                    {appointment.type}
                  </Text>
                </View>

                <View style={styles.cardActions}>

                  {isPending && (
                    <>
                      <TouchableOpacity
                        onPress={() => handleApprove(appointment.id)}
                        style={[
                          styles.actionButton,
                          styles.actionButtonApprove,
                        ]}
                      >
                        <CheckCircle
                          size={16}
                          color="#10b981"
                          strokeWidth={2}
                        />
                        <Text
                          style={[
                            styles.actionButtonText,
                            { color: '#10b981' },
                          ]}
                        >
                          Approve
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => handleReject(appointment.id)}
                        style={[styles.actionButton, styles.actionButtonReject]}
                      >
                        <XCircle size={16} color="#ef4444" strokeWidth={2} />
                        <Text
                          style={[
                            styles.actionButtonText,
                            { color: '#ef4444' },
                          ]}
                        >
                          Reject
                        </Text>
                      </TouchableOpacity>
                    </>
                  )}

                  {(isConfirmed || isPending) && (
                    <TouchableOpacity
                      onPress={() => handleReschedule(appointment)}
                      style={[
                        styles.actionButton,
                        { backgroundColor: 'rgba(99, 102, 241, 0.1)' },
                      ]}
                    >
                      <CalendarIcon size={16} color="#6366F1" strokeWidth={2} />
                      <Text
                        style={[styles.actionButtonText, { color: '#6366F1' }]}
                      >
                        Reschedule
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </TouchableOpacity>
            );
          })
          )}
        </MotiView>
      </ScrollView>

      <DoctorBottomNav onScanPress={() => setShowQRScanner(true)} />

      <Modal
        visible={rescheduleModal}
        transparent
        animationType="slide"
        onRequestClose={() => setRescheduleModal(false)}
      >
        <View
          style={[
            styles.modalOverlay,
            {
              backgroundColor: isDark
                ? 'rgba(15, 23, 42, 0.9)'
                : 'rgba(0, 0, 0, 0.6)',
            },
          ]}
        >
          <MotiView
            from={{ opacity: 0, translateY: 50 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'spring', damping: 15 }}
            style={[
              styles.rescheduleModal,
              { backgroundColor: colors.containerBg },
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                Reschedule Appointment
              </Text>
              <TouchableOpacity onPress={() => setRescheduleModal(false)}>
                <XCircle
                  size={24}
                  color={colors.textSecondary}
                  strokeWidth={2}
                />
              </TouchableOpacity>
            </View>

            {selectedAppointment && (
              <View
                style={[
                  styles.modalPatientInfo,
                  {
                    backgroundColor: colors.cardBg,
                    borderColor: colors.cardBorder,
                  },
                ]}
              >
                <View
                  style={[
                    styles.modalPatientAvatar,
                    {
                      backgroundColor: `${getStatusColor(
                        selectedAppointment.status
                      )}15`,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.modalAvatarText,
                      { color: getStatusColor(selectedAppointment.status) },
                    ]}
                  >
                    {selectedAppointment.patientName.charAt(0)}
                  </Text>
                </View>
                <View style={styles.modalPatientDetails}>
                  <Text
                    style={[styles.modalPatientName, { color: colors.text }]}
                  >
                    {selectedAppointment.patientName}
                  </Text>
                  <Text
                    style={[
                      styles.modalPatientReason,
                      { color: colors.textTertiary },
                    ]}
                  >
                    {selectedAppointment.reason}
                  </Text>
                </View>
              </View>
            )}

            <View style={styles.modalInputSection}>
              <View style={styles.inputGroup}>
                <Text
                  style={[styles.inputLabel, { color: colors.textSecondary }]}
                >
                  New Date
                </Text>
                <View
                  style={[
                    styles.inputContainer,
                    {
                      backgroundColor: colors.cardBg,
                      borderColor: colors.cardBorder,
                    },
                  ]}
                >
                  <CalendarIcon
                    size={18}
                    color={colors.textSecondary}
                    strokeWidth={2}
                  />
                  <TextInput
                    style={[styles.textInput, { color: colors.text }]}
                    value={newDate}
                    onChangeText={setNewDate}
                    placeholder="e.g., Jan 28, 2025"
                    placeholderTextColor={colors.textTertiary}
                  />
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text
                  style={[styles.inputLabel, { color: colors.textSecondary }]}
                >
                  New Time
                </Text>
                <View
                  style={[
                    styles.inputContainer,
                    {
                      backgroundColor: colors.cardBg,
                      borderColor: colors.cardBorder,
                    },
                  ]}
                >
                  <Clock
                    size={18}
                    color={colors.textSecondary}
                    strokeWidth={2}
                  />
                  <TextInput
                    style={[styles.textInput, { color: colors.text }]}
                    value={newTime}
                    onChangeText={setNewTime}
                    placeholder="e.g., 3:00 PM"
                    placeholderTextColor={colors.textTertiary}
                  />
                </View>
              </View>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                onPress={() => setRescheduleModal(false)}
                style={[
                  styles.modalButton,
                  {
                    backgroundColor: colors.cardBg,
                    borderColor: colors.cardBorder,
                  },
                ]}
              >
                <Text style={[styles.modalButtonText, { color: colors.text }]}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleConfirmReschedule}
                disabled={!newDate || !newTime}
                style={[
                  styles.modalButtonPrimary,
                  (!newDate || !newTime) && styles.modalButtonDisabled,
                ]}
              >
                <LinearGradient
                  colors={['#6366F1', '#818CF8']}
                  style={styles.modalButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <CheckCircle size={18} color="#ffffff" strokeWidth={2} />
                  <Text style={styles.modalButtonPrimaryText}>Confirm</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </MotiView>
        </View>
      </Modal>

      <Modal
        visible={showQRScanner}
        transparent
        animationType="slide"
        onRequestClose={() => setShowQRScanner(false)}
      >
        <QRScanner
          onScan={handleQRScan}
          onClose={() => setShowQRScanner(false)}
        />
      </Modal>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
  },
  tabsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(148, 163, 184, 0.15)',
  },
  tabButton: {
    flex: 1,
    position: 'relative',
    paddingBottom: 12,
  },
  tabContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  tabLabel: {
    fontSize: 13,
    fontFamily: 'Inter-SemiBold',
  },
  tabBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    minWidth: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBadgeText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: -1,
    left: '15%',
    right: '15%',
    height: 3,
    borderRadius: 2,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 140,
  },
  emptyState: {
    borderRadius: 20,
    padding: 40,
    alignItems: 'center',
    borderWidth: 1,
    marginTop: 40,
  },
  emptyText: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginTop: 6,
  },
  appointmentCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  headerRight: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: 8,
  },
  arrowButton: {
    padding: 4,
  },
  patientInfo: {
    flexDirection: 'row',
    flex: 1,
    marginRight: 12,
  },
  patientAvatar: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
  },
  patientDetails: {
    flex: 1,
  },
  patientName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
  },
  appointmentReason: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    lineHeight: 18,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    gap: 5,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 11,
    fontFamily: 'Inter-SemiBold',
  },
  appointmentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaDivider: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
  },
  metaText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  cardActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    gap: 6,
  },
  actionButtonApprove: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  actionButtonReject: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  actionButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  rescheduleModal: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 24,
    padding: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
  },
  modalPatientInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 24,
  },
  modalPatientAvatar: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  modalAvatarText: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
  },
  modalPatientDetails: {
    flex: 1,
  },
  modalPatientName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 2,
  },
  modalPatientReason: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  modalInputSection: {
    gap: 16,
    marginBottom: 24,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 13,
    fontFamily: 'Inter-SemiBold',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 10,
  },
  textInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: 'Inter-Regular',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  modalButtonText: {
    fontSize: 15,
    fontFamily: 'Inter-SemiBold',
  },
  modalButtonPrimary: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  modalButtonDisabled: {
    opacity: 0.5,
  },
  modalButtonGradient: {
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  modalButtonPrimaryText: {
    fontSize: 15,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
});
