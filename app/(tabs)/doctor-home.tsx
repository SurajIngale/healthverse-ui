import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { Users, Calendar, Clock, TrendingUp, Bell, Settings, Home, Search, User, Sun, Moon } from 'lucide-react-native';
import { useTheme, lightTheme, darkTheme } from '../../contexts/ThemeContext';

export default function DoctorHomeScreen() {
  const { isDark, toggleTheme } = useTheme();
  const colors = isDark ? darkTheme : lightTheme;

  const stats = [
    { label: "Today's Patients", value: '12', icon: Users, color: '#10b981' },
    { label: 'Appointments', value: '18', icon: Calendar, color: '#3b82f6' },
    { label: 'Avg. Time', value: '25m', icon: Clock, color: '#f59e0b' },
  ];

  const todaysAppointments = [
    { patient: 'Emma Wilson', time: '10:00 AM', type: 'Follow-up', status: 'confirmed' },
    { patient: 'James Brown', time: '11:30 AM', type: 'Consultation', status: 'confirmed' },
    { patient: 'Olivia Davis', time: '2:00 PM', type: 'Check-up', status: 'pending' },
  ];

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
          transition={{ delay: 600, type: 'spring' }}
          style={styles.section}
        >
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Today's Schedule</Text>
            <TouchableOpacity>
              <Text style={styles.sectionLink}>View All</Text>
            </TouchableOpacity>
          </View>

          {todaysAppointments.map((appointment, index) => (
            <MotiView
              key={index}
              from={{ opacity: 0, translateX: -20 }}
              animate={{ opacity: 1, translateX: 0 }}
              transition={{ delay: 700 + index * 100, type: 'spring' }}
              style={[styles.appointmentCard, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}
            >
              <View style={styles.appointmentLeft}>
                <View style={styles.patientAvatar}>
                  <Text style={styles.avatarText}>{appointment.patient.charAt(0)}</Text>
                </View>
                <View style={styles.appointmentInfo}>
                  <Text style={[styles.patientName, { color: colors.text }]}>{appointment.patient}</Text>
                  <View style={styles.appointmentMeta}>
                    <Clock size={14} color="#94a3b8" strokeWidth={2} />
                    <Text style={[styles.appointmentTime, { color: colors.textTertiary }]}>{appointment.time}</Text>
                    <View style={[styles.separator, { backgroundColor: colors.textSecondary }]} />
                    <Text style={[styles.appointmentType, { color: colors.textTertiary }]}>{appointment.type}</Text>
                  </View>
                </View>
              </View>
              <View style={[
                styles.statusBadge,
                appointment.status === 'confirmed' ? styles.statusConfirmed : styles.statusPending
              ]}>
                <Text style={styles.statusText}>
                  {appointment.status === 'confirmed' ? 'Confirmed' : 'Pending'}
                </Text>
              </View>
            </MotiView>
          ))}
        </MotiView>

        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: 1000, type: 'spring' }}
          style={[styles.performanceCard, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}
        >
          <View style={styles.performanceHeader}>
            <Text style={[styles.performanceTitle, { color: colors.text }]}>This Week's Performance</Text>
            <TrendingUp size={20} color="#10b981" strokeWidth={2} />
          </View>
          <View style={styles.performanceStats}>
            <View style={styles.performanceStat}>
              <Text style={styles.performanceValue}>48</Text>
              <Text style={[styles.performanceLabel, { color: colors.textTertiary }]}>Patients Treated</Text>
            </View>
            <View style={styles.performanceDivider} />
            <View style={styles.performanceStat}>
              <Text style={styles.performanceValue}>4.8</Text>
              <Text style={[styles.performanceLabel, { color: colors.textTertiary }]}>Avg. Rating</Text>
            </View>
            <View style={styles.performanceDivider} />
            <View style={styles.performanceStat}>
              <Text style={styles.performanceValue}>92%</Text>
              <Text style={[styles.performanceLabel, { color: colors.textTertiary }]}>On-Time Rate</Text>
            </View>
          </View>
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
              <Search size={24} color={colors.textSecondary} strokeWidth={2} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navButton} activeOpacity={0.7}>
            <View style={[styles.navButtonInner, { backgroundColor: colors.navInactive }]}>
              <Calendar size={24} color={colors.textSecondary} strokeWidth={2} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navButton} activeOpacity={0.7}>
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
    backgroundColor: '#E0F2FF',
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
    color: '#64748b',
  },
  username: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#1e293b',
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
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.1)',
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
    color: '#1e293b',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#94a3b8',
    textAlign: 'center',
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
    color: '#1e293b',
  },
  sectionLink: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#10b981',
  },
  appointmentCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.1)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  appointmentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  patientAvatar: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#10b981',
  },
  appointmentInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1e293b',
    marginBottom: 4,
  },
  appointmentMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  appointmentTime: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#94a3b8',
  },
  separator: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#475569',
  },
  appointmentType: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#94a3b8',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusConfirmed: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
  },
  statusPending: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#10b981',
  },
  performanceCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.1)',
  },
  performanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  performanceTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#1e293b',
  },
  performanceStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  performanceStat: {
    flex: 1,
    alignItems: 'center',
  },
  performanceValue: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#10b981',
    marginBottom: 4,
  },
  performanceLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#94a3b8',
    textAlign: 'center',
  },
  performanceDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(148, 163, 184, 0.2)',
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
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 28,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
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
    backgroundColor: 'rgba(241, 245, 249, 0.8)',
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
