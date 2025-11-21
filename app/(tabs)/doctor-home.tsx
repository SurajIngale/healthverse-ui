import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Users, Calendar, Clock, Bell, Settings, Home, QrCode, Sun, Moon, ClipboardList, User } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTheme, lightTheme, darkTheme } from '../../contexts/ThemeContext';
import QRScanner from '../../components/QRScanner';

interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  time: string;
  type: string;
  status: 'pending' | 'confirmed' | 'completed';
  date: string;
}

export default function DoctorHomeScreen() {
  const router = useRouter();
  const { isDark, toggleTheme } = useTheme();
  const colors = isDark ? darkTheme : lightTheme;
  const [showQRScanner, setShowQRScanner] = useState(false);

  const [allAppointments] = useState<Appointment[]>([
    {
      id: 'apt_req_1',
      patientId: 'patient_123',
      patientName: 'Emma Wilson',
      time: '10:00 AM',
      type: 'Check-up',
      status: 'pending',
      date: 'Jan 25, 2025',
    },
    {
      id: 'apt_req_2',
      patientId: 'patient_456',
      patientName: 'Michael Chen',
      time: '2:30 PM',
      type: 'Follow-up',
      status: 'pending',
      date: 'Jan 26, 2025',
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

  const pendingCount = allAppointments.filter(a => a.status === 'pending').length;
  const completedToday = todaysAppointments.filter(a => a.status === 'completed').length;
  const totalThisWeek = todaysAppointments.length + upcomingAppointments.length;

  const stats = [
    {
      label: "Today's Patients",
      value: todaysAppointments.length.toString(),
      subtitle: `${completedToday} completed`,
      icon: Users,
      color: '#10b981',
      bgColor: 'rgba(16, 185, 129, 0.1)'
    },
    {
      label: 'Pending Requests',
      value: pendingCount.toString(),
      subtitle: 'Need approval',
      icon: Bell,
      color: '#f59e0b',
      bgColor: 'rgba(245, 158, 11, 0.1)'
    },
    {
      label: 'This Week',
      value: totalThisWeek.toString(),
      subtitle: `${upcomingAppointments.length} upcoming`,
      icon: Calendar,
      color: '#6366F1',
      bgColor: 'rgba(99, 102, 241, 0.1)'
    },
  ];

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

        <View style={styles.statsContainer}>
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <View
                key={stat.label}
                style={[styles.statCard, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}
              >
                <View style={[styles.statIconWrapper, { backgroundColor: stat.bgColor }]}>
                  <Icon size={18} color={stat.color} strokeWidth={2} />
                </View>
                <Text style={[styles.statValue, { color: colors.text }]}>{stat.value}</Text>
                <Text style={[styles.statLabel, { color: colors.text }]}>{stat.label}</Text>
                <Text style={[styles.statSubtitle, { color: colors.textTertiary }]}>{stat.subtitle}</Text>
              </View>
            );
          })}
        </View>

        <View style={styles.section}>
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
              style={[styles.appointmentCard, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}
            >
              <View style={styles.timeIndicator}>
                <Clock size={16} color="#10b981" strokeWidth={2} />
                <Text style={styles.timeText}>{appointment.time}</Text>
              </View>

              <View style={styles.appointmentContent}>
                <View style={styles.appointmentLeft}>
                  <View style={[styles.patientAvatar, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
                    <Text style={[styles.avatarText, { color: '#10b981' }]}>{appointment.patientName.charAt(0)}</Text>
                  </View>
                  <View style={styles.appointmentInfo}>
                    <Text style={[styles.patientName, { color: colors.text }]}>{appointment.patientName}</Text>
                    <Text style={[styles.appointmentType, { color: colors.textTertiary }]}>{appointment.type}</Text>
                  </View>
                </View>
                <View style={[styles.statusBadge, styles.statusBadgeConfirmed]}>
                  <View style={styles.statusDot} />
                  <Text style={styles.statusText}>Confirmed</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Upcoming</Text>
            <TouchableOpacity>
              <Text style={styles.sectionLink}>View All</Text>
            </TouchableOpacity>
          </View>

          {upcomingAppointments.map((appointment) => (
            <TouchableOpacity
              key={appointment.id}
              onPress={() => handleViewPatient(appointment.patientId)}
              activeOpacity={0.7}
              style={[styles.upcomingCard, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}
            >
              <View style={styles.upcomingLeft}>
                <View style={styles.dateBox}>
                  <Text style={styles.dateDay}>{appointment.date.split(' ')[1]}</Text>
                  <Text style={styles.dateMonth}>{appointment.date.split(' ')[0]}</Text>
                </View>
                <View>
                  <Text style={[styles.patientName, { color: colors.text }]}>{appointment.patientName}</Text>
                  <Text style={[styles.upcomingTime, { color: colors.textTertiary }]}>{appointment.time} • {appointment.type}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View style={styles.bottomNav}>
        <View style={[styles.navContainer, { backgroundColor: colors.navBg, borderColor: colors.iconButtonBorder }]}>
          <TouchableOpacity style={styles.navButton} activeOpacity={0.7}>
            <View style={[styles.navButtonInner, styles.navButtonActive]}>
              <Home size={24} color="#ffffff" strokeWidth={2} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/(tabs)/doctor-appointments')}
            style={styles.navButton}
            activeOpacity={0.7}
          >
            <View style={[styles.navButtonInner, { backgroundColor: colors.navInactive }]}>
              <ClipboardList size={24} color={colors.textSecondary} strokeWidth={2} />
            </View>
            {pendingCount > 0 && (
              <View style={styles.navBadge}>
                <Text style={styles.navBadgeText}>{pendingCount}</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setShowQRScanner(true)}
            style={styles.navButton}
            activeOpacity={0.7}
          >
            <View style={[styles.navButtonInner, { backgroundColor: colors.navInactive }]}>
              <QrCode size={24} color={colors.textSecondary} strokeWidth={2} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push('/(tabs)/doctor-profile')}
            style={styles.navButton}
            activeOpacity={0.7}
          >
            <View style={[styles.navButtonInner, { backgroundColor: colors.navInactive }]}>
              <User size={24} color={colors.textSecondary} strokeWidth={2} />
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
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    gap: 6,
    minHeight: 110,
  },
  statIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  statValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 11,
    fontFamily: 'Inter-SemiBold',
    textAlign: 'center',
    lineHeight: 14,
  },
  statSubtitle: {
    fontSize: 9,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
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
  appointmentCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  timeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  timeText: {
    fontSize: 13,
    fontFamily: 'Inter-SemiBold',
    color: '#10b981',
  },
  appointmentContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  appointmentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
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
  appointmentInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 2,
  },
  appointmentType: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  statusBadgeConfirmed: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10b981',
  },
  statusText: {
    fontSize: 11,
    fontFamily: 'Inter-SemiBold',
    color: '#10b981',
  },
  upcomingCard: {
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
  },
  upcomingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dateBox: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateDay: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#6366F1',
  },
  dateMonth: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: '#6366F1',
  },
  upcomingTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginTop: 2,
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
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#f59e0b',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  navBadgeText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
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
