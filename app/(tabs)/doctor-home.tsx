import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { Users, Calendar, Clock, Bell, Settings, Home, QrCode, CheckCircle, XCircle, Eye, Sun, Moon } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTheme, lightTheme, darkTheme } from '../../contexts/ThemeContext';
import QRScanner from '../../components/QRScanner';

interface AppointmentRequest {
  id: string;
  patientId: string;
  patientName: string;
  reason: string;
  preferredDate: string;
  preferredTime: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  time: string;
  type: string;
  status: 'confirmed' | 'completed';
  date: string;
}

export default function DoctorHomeScreen() {
  const router = useRouter();
  const { isDark, toggleTheme } = useTheme();
  const colors = isDark ? darkTheme : lightTheme;
  const [showQRScanner, setShowQRScanner] = useState(false);

  const [appointmentRequests, setAppointmentRequests] = useState<AppointmentRequest[]>([
    {
      id: 'req_1',
      patientId: 'patient_123',
      patientName: 'Emma Wilson',
      reason: 'Regular check-up and blood pressure monitoring',
      preferredDate: 'Jan 25, 2025',
      preferredTime: '10:00 AM',
      status: 'pending',
    },
    {
      id: 'req_2',
      patientId: 'patient_456',
      patientName: 'Michael Chen',
      reason: 'Follow-up for diabetes management',
      preferredDate: 'Jan 26, 2025',
      preferredTime: '2:30 PM',
      status: 'pending',
    },
    {
      id: 'req_3',
      patientId: 'patient_789',
      patientName: 'Sarah Martinez',
      reason: 'Consultation for persistent headaches',
      preferredDate: 'Jan 27, 2025',
      preferredTime: '11:00 AM',
      status: 'pending',
    },
  ]);

  const [todaysAppointments] = useState<Appointment[]>([
    {
      id: 'apt_1',
      patientId: 'patient_111',
      patientName: 'James Brown',
      time: '9:00 AM',
      type: 'Follow-up',
      status: 'confirmed',
      date: 'Today',
    },
    {
      id: 'apt_2',
      patientId: 'patient_222',
      patientName: 'Olivia Davis',
      time: '11:30 AM',
      type: 'Consultation',
      status: 'confirmed',
      date: 'Today',
    },
    {
      id: 'apt_3',
      patientId: 'patient_333',
      patientName: 'Robert Johnson',
      time: '2:00 PM',
      type: 'Check-up',
      status: 'confirmed',
      date: 'Today',
    },
  ]);

  const [upcomingAppointments] = useState<Appointment[]>([
    {
      id: 'apt_4',
      patientId: 'patient_444',
      patientName: 'Linda Martinez',
      time: '10:00 AM',
      type: 'Follow-up',
      status: 'confirmed',
      date: 'Jan 25, 2025',
    },
    {
      id: 'apt_5',
      patientId: 'patient_555',
      patientName: 'David Wilson',
      time: '3:30 PM',
      type: 'Consultation',
      status: 'confirmed',
      date: 'Jan 26, 2025',
    },
  ]);

  const stats = [
    { label: "Today's Patients", value: todaysAppointments.length.toString(), icon: Users, color: '#10b981' },
    { label: 'Pending Requests', value: appointmentRequests.filter(r => r.status === 'pending').length.toString(), icon: Bell, color: '#f59e0b' },
    { label: 'This Week', value: (todaysAppointments.length + upcomingAppointments.length).toString(), icon: Calendar, color: '#3b82f6' },
  ];

  const handleApproveRequest = (requestId: string) => {
    setAppointmentRequests(prev =>
      prev.map(req => req.id === requestId ? { ...req, status: 'approved' } : req)
    );
  };

  const handleRejectRequest = (requestId: string) => {
    setAppointmentRequests(prev =>
      prev.map(req => req.id === requestId ? { ...req, status: 'rejected' } : req)
    );
  };

  const handleViewPatient = (patientId: string) => {
    router.push({
      pathname: '/(tabs)/doctor-patient-profile',
      params: { patientId },
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

  const pendingRequests = appointmentRequests.filter(r => r.status === 'pending');

  return (
    <View style={[styles.container, { backgroundColor: colors.containerBg }]}>
      <LinearGradient
        colors={colors.background}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: colors.textSecondary }]}>Good Morning</Text>
            <Text style={[styles.username, { color: colors.text }]}>Dr. Sarah Johnson</Text>
          </View>
          <View style={styles.headerIcons}>
            <TouchableOpacity onPress={toggleTheme} style={[styles.iconButton, { backgroundColor: colors.iconButton, borderColor: colors.iconButtonBorder }]}>
              {isDark ? (
                <Sun size={22} color={colors.textSecondary} strokeWidth={2} />
              ) : (
                <Moon size={22} color={colors.textSecondary} strokeWidth={2} />
              )}
            </TouchableOpacity>
            <TouchableOpacity style={[styles.iconButton, { backgroundColor: colors.iconButton, borderColor: colors.iconButtonBorder }]}>
              <Bell size={22} color={colors.textSecondary} strokeWidth={2} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.iconButton, { backgroundColor: colors.iconButton, borderColor: colors.iconButtonBorder }]}>
              <Settings size={22} color={colors.textSecondary} strokeWidth={2} />
            </TouchableOpacity>
          </View>
        </View>

        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: 200, type: 'spring' }}
          style={styles.statsContainer}
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <MotiView
                key={stat.label}
                from={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 300 + index * 100, type: 'spring' }}
                style={[styles.statCard, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}
              >
                <View style={[styles.statIcon, { backgroundColor: `${stat.color}15` }]}>
                  <Icon size={24} color={stat.color} strokeWidth={2} />
                </View>
                <Text style={[styles.statValue, { color: colors.text }]}>{stat.value}</Text>
                <Text style={[styles.statLabel, { color: colors.textTertiary }]}>{stat.label}</Text>
              </MotiView>
            );
          })}
        </MotiView>

        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: 400, type: 'spring' }}
          style={styles.qrScanSection}
        >
          <TouchableOpacity
            onPress={() => setShowQRScanner(true)}
            style={styles.qrButton}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#6366F1', '#818CF8']}
              style={styles.qrButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <QrCode size={24} color="#ffffff" strokeWidth={2} />
              <Text style={styles.qrButtonText}>Scan Patient QR</Text>
            </LinearGradient>
          </TouchableOpacity>
        </MotiView>

        {pendingRequests.length > 0 && (
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: 500, type: 'spring' }}
            style={styles.section}
          >
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Appointment Requests</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{pendingRequests.length}</Text>
              </View>
            </View>

            {pendingRequests.map((request, index) => (
              <MotiView
                key={request.id}
                from={{ opacity: 0, translateX: -20 }}
                animate={{ opacity: 1, translateX: 0 }}
                transition={{ delay: 600 + index * 100, type: 'spring' }}
                style={[styles.requestCard, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}
              >
                <View style={styles.requestHeader}>
                  <View style={styles.patientAvatar}>
                    <Text style={styles.avatarText}>{request.patientName.charAt(0)}</Text>
                  </View>
                  <View style={styles.requestInfo}>
                    <Text style={[styles.patientName, { color: colors.text }]}>{request.patientName}</Text>
                    <Text style={[styles.requestReason, { color: colors.textTertiary }]}>{request.reason}</Text>
                    <View style={styles.requestMeta}>
                      <Clock size={14} color={colors.textTertiary} strokeWidth={2} />
                      <Text style={[styles.requestTime, { color: colors.textTertiary }]}>
                        {request.preferredDate} at {request.preferredTime}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.requestActions}>
                  <TouchableOpacity
                    onPress={() => handleViewPatient(request.patientId)}
                    style={[styles.actionButton, styles.actionButtonView, { backgroundColor: colors.accentLight }]}
                  >
                    <Eye size={18} color={colors.accent} strokeWidth={2} />
                    <Text style={[styles.actionButtonText, { color: colors.accent }]}>View</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => handleApproveRequest(request.id)}
                    style={[styles.actionButton, styles.actionButtonApprove]}
                  >
                    <CheckCircle size={18} color="#10b981" strokeWidth={2} />
                    <Text style={[styles.actionButtonText, { color: '#10b981' }]}>Approve</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => handleRejectRequest(request.id)}
                    style={[styles.actionButton, styles.actionButtonReject]}
                  >
                    <XCircle size={18} color="#ef4444" strokeWidth={2} />
                    <Text style={[styles.actionButtonText, { color: '#ef4444' }]}>Reject</Text>
                  </TouchableOpacity>
                </View>
              </MotiView>
            ))}
          </MotiView>
        )}

        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: 700, type: 'spring' }}
          style={styles.section}
        >
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Today's Schedule</Text>
            <Text style={[styles.sectionSubtitle, { color: colors.textTertiary }]}>
              {todaysAppointments.length} appointments
            </Text>
          </View>

          {todaysAppointments.map((appointment, index) => (
            <TouchableOpacity
              key={appointment.id}
              onPress={() => handleViewPatient(appointment.patientId)}
              activeOpacity={0.7}
            >
              <MotiView
                from={{ opacity: 0, translateX: -20 }}
                animate={{ opacity: 1, translateX: 0 }}
                transition={{ delay: 800 + index * 100, type: 'spring' }}
                style={[styles.appointmentCard, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}
              >
                <View style={styles.appointmentLeft}>
                  <View style={styles.patientAvatar}>
                    <Text style={styles.avatarText}>{appointment.patientName.charAt(0)}</Text>
                  </View>
                  <View style={styles.appointmentInfo}>
                    <Text style={[styles.patientName, { color: colors.text }]}>{appointment.patientName}</Text>
                    <View style={styles.appointmentMeta}>
                      <Clock size={14} color={colors.textTertiary} strokeWidth={2} />
                      <Text style={[styles.appointmentTime, { color: colors.textTertiary }]}>{appointment.time}</Text>
                      <View style={[styles.separator, { backgroundColor: colors.textSecondary }]} />
                      <Text style={[styles.appointmentType, { color: colors.textTertiary }]}>{appointment.type}</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>Tap to view</Text>
                </View>
              </MotiView>
            </TouchableOpacity>
          ))}
        </MotiView>

        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: 900, type: 'spring' }}
          style={styles.section}
        >
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Upcoming Appointments</Text>
            <TouchableOpacity>
              <Text style={styles.sectionLink}>View All</Text>
            </TouchableOpacity>
          </View>

          {upcomingAppointments.map((appointment, index) => (
            <TouchableOpacity
              key={appointment.id}
              onPress={() => handleViewPatient(appointment.patientId)}
              activeOpacity={0.7}
            >
              <MotiView
                from={{ opacity: 0, translateX: -20 }}
                animate={{ opacity: 1, translateX: 0 }}
                transition={{ delay: 1000 + index * 100, type: 'spring' }}
                style={[styles.appointmentCard, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}
              >
                <View style={styles.appointmentLeft}>
                  <View style={styles.patientAvatar}>
                    <Text style={styles.avatarText}>{appointment.patientName.charAt(0)}</Text>
                  </View>
                  <View style={styles.appointmentInfo}>
                    <Text style={[styles.patientName, { color: colors.text }]}>{appointment.patientName}</Text>
                    <View style={styles.appointmentMeta}>
                      <Clock size={14} color={colors.textTertiary} strokeWidth={2} />
                      <Text style={[styles.appointmentTime, { color: colors.textTertiary }]}>
                        {appointment.date} at {appointment.time}
                      </Text>
                      <View style={[styles.separator, { backgroundColor: colors.textSecondary }]} />
                      <Text style={[styles.appointmentType, { color: colors.textTertiary }]}>{appointment.type}</Text>
                    </View>
                  </View>
                </View>
              </MotiView>
            </TouchableOpacity>
          ))}
        </MotiView>
      </ScrollView>

      <View style={styles.bottomNav}>
        <View style={[styles.navContainer, { backgroundColor: colors.navBg, borderColor: colors.iconButtonBorder }]}>
          <TouchableOpacity style={styles.navButton} activeOpacity={0.7}>
            <View style={[styles.navButtonInner, styles.navButtonActive]}>
              <Home size={24} color="#ffffff" strokeWidth={2} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navButton} activeOpacity={0.7}>
            <View style={[styles.navButtonInner, { backgroundColor: colors.navInactive }]}>
              <Calendar size={24} color={colors.textSecondary} strokeWidth={2} />
            </View>
          </TouchableOpacity>
        </View>
      </View>

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
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 120,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
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
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
  },
  qrScanSection: {
    marginBottom: 24,
  },
  qrButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  qrButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 12,
  },
  qrButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  sectionLink: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#10b981',
  },
  badge: {
    backgroundColor: '#f59e0b',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
  },
  requestCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  requestHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  patientAvatar: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#10b981',
  },
  requestInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 6,
  },
  requestReason: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    marginBottom: 8,
    lineHeight: 18,
  },
  requestMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  requestTime: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  requestActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
  },
  actionButtonView: {
  },
  actionButtonApprove: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  actionButtonReject: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  actionButtonText: {
    fontSize: 13,
    fontFamily: 'Inter-SemiBold',
  },
  appointmentCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  appointmentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  appointmentInfo: {
    flex: 1,
  },
  appointmentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  appointmentTime: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
  },
  separator: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
  },
  appointmentType: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#6366F1',
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
    shadowColor: '#10b981',
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
    backgroundColor: '#10b981',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
});
