import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { FlaskConical, FileText, Clock, CheckCircle2, Bell, Settings, Home, Search, Calendar, User, Sun, Moon } from 'lucide-react-native';
import { useTheme, lightTheme, darkTheme } from '../../contexts/ThemeContext';

export default function LabHomeScreen() {
  const { isDark, toggleTheme } = useTheme();
  const colors = isDark ? darkTheme : lightTheme;

  const stats = [
    { label: 'Pending Tests', value: '8', icon: Clock, color: '#f59e0b' },
    { label: 'Completed', value: '24', icon: CheckCircle2, color: '#10b981' },
    { label: 'Total Today', value: '32', icon: FlaskConical, color: '#3b82f6' },
  ];

  const pendingTests = [
    { patient: 'Robert Johnson', test: 'Complete Blood Count', priority: 'high', time: '2 hours ago' },
    { patient: 'Linda Martinez', test: 'Lipid Profile', priority: 'normal', time: '4 hours ago' },
    { patient: 'David Wilson', test: 'Thyroid Function Test', priority: 'normal', time: '5 hours ago' },
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
            <Text style={[styles.greeting, { color: colors.textSecondary }]}>Welcome</Text>
            <Text style={[styles.username, { color: colors.text }]}>HealthCare Diagnostics</Text>
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
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Pending Test Reports</Text>
            <TouchableOpacity>
              <Text style={styles.sectionLink}>View All</Text>
            </TouchableOpacity>
          </View>

          {pendingTests.map((test, index) => (
            <MotiView
              key={index}
              from={{ opacity: 0, translateX: -20 }}
              animate={{ opacity: 1, translateX: 0 }}
              transition={{ delay: 700 + index * 100, type: 'spring' }}
              style={[styles.testCard, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}
            >
              <View style={styles.testLeft}>
                <View style={[
                  styles.priorityIndicator,
                  test.priority === 'high' ? styles.priorityHigh : styles.priorityNormal
                ]} />
                <View style={styles.testInfo}>
                  <Text style={[styles.patientName, { color: colors.text }]}>{test.patient}</Text>
                  <Text style={[styles.testName, { color: colors.textTertiary }]}>{test.test}</Text>
                  <Text style={[styles.testTime, { color: colors.textSecondary }]}>{test.time}</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.processButton}>
                <LinearGradient
                  colors={['#f59e0b', '#d97706']}
                  style={styles.processGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Text style={styles.processText}>Process</Text>
                </LinearGradient>
              </TouchableOpacity>
            </MotiView>
          ))}
        </MotiView>

        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: 1000, type: 'spring' }}
          style={styles.quickActions}
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity style={styles.actionButton}>
              <LinearGradient
                colors={['#3b82f6', '#2563eb']}
                style={styles.actionGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <FlaskConical size={24} color="#ffffff" strokeWidth={2} />
                <Text style={styles.actionText}>New Test</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionButton}>
              <LinearGradient
                colors={['#10b981', '#059669']}
                style={styles.actionGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <FileText size={24} color="#ffffff" strokeWidth={2} />
                <Text style={styles.actionText}>Reports</Text>
              </LinearGradient>
            </TouchableOpacity>
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
    color: '#f59e0b',
  },
  testCard: {
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
  testLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    flex: 1,
  },
  priorityIndicator: {
    width: 4,
    height: 60,
    borderRadius: 2,
    marginTop: 4,
  },
  priorityHigh: {
    backgroundColor: '#ef4444',
  },
  priorityNormal: {
    backgroundColor: '#3b82f6',
  },
  testInfo: {
    flex: 1,
  },
  patientName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1e293b',
    marginBottom: 4,
  },
  testName: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#94a3b8',
    marginBottom: 4,
  },
  testTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
  },
  processButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  processGradient: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  processText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  quickActions: {
    marginBottom: 32,
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  actionButton: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
  },
  actionGradient: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
    gap: 8,
  },
  actionText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
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
    shadowColor: '#f59e0b',
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
    backgroundColor: '#f59e0b',
    shadowColor: '#f59e0b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
});
