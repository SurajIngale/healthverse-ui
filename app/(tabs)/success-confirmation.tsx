import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { CheckCircle2, User, Stethoscope, FileText, Clock, Send, CheckCheck } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme, lightTheme, darkTheme } from '../../contexts/ThemeContext';
import { useLabRequests } from '../../contexts/LabRequestContext';

export default function SuccessConfirmationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { isDark } = useTheme();
  const colors = isDark ? darkTheme : lightTheme;
  const { getRequestById } = useLabRequests();

  const requestId = params.requestId ? parseInt(params.requestId as string) : null;
  const request = requestId ? getRequestById(requestId) : null;

  if (!request) {
    return (
      <View style={[styles.container, { backgroundColor: colors.containerBg }]}>
        <Text style={[styles.errorText, { color: colors.text }]}>Request not found</Text>
      </View>
    );
  }

  const handleGoBack = () => {
    router.replace('/lab-home');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.containerBg }]}>
      <LinearGradient colors={colors.background} style={styles.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <MotiView
          from={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', damping: 15 }}
          style={styles.successIconContainer}
        >
          <LinearGradient
            colors={['#10b981', '#059669']}
            style={styles.successIconGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <CheckCircle2 size={56} color="#ffffff" strokeWidth={2} />
          </LinearGradient>
        </MotiView>

        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: 200, type: 'spring' }}
          style={styles.titleContainer}
        >
          <Text style={[styles.title, { color: colors.text }]}>Reports Uploaded Successfully!</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            The patient has been notified and reports are now available
          </Text>
        </MotiView>

        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: 300, type: 'spring' }}
          style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}
        >
          <View style={styles.cardHeader}>
            <View style={[styles.iconBadge, { backgroundColor: `${colors.accent}15` }]}>
              <User size={20} color={colors.accent} strokeWidth={2} />
            </View>
            <Text style={[styles.cardTitle, { color: colors.text }]}>Patient Details</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.textTertiary }]}>Name:</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>{request.patient}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.textTertiary }]}>Patient ID:</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>{request.patientId}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.textTertiary }]}>Doctor:</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>{request.doctor}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.textTertiary }]}>Hospital:</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>{request.hospital}</Text>
          </View>
        </MotiView>

        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: 400, type: 'spring' }}
          style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}
        >
          <View style={styles.cardHeader}>
            <View style={[styles.iconBadge, { backgroundColor: 'rgba(59, 130, 246, 0.15)' }]}>
              <FileText size={20} color="#3b82f6" strokeWidth={2} />
            </View>
            <Text style={[styles.cardTitle, { color: colors.text }]}>Uploaded Reports</Text>
          </View>
          {request.uploadedFiles.map((file, index) => (
            <View key={file.id} style={styles.reportItem}>
              <View style={styles.reportLeft}>
                <View style={[styles.reportIcon, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
                  <CheckCheck size={16} color="#10b981" strokeWidth={2} />
                </View>
                <View style={styles.reportInfo}>
                  <Text style={[styles.reportTest, { color: colors.text }]}>
                    {request.tests[index] || 'Test Report'}
                  </Text>
                  <Text style={[styles.reportFile, { color: colors.textTertiary }]}>{file.name}</Text>
                </View>
              </View>
            </View>
          ))}
        </MotiView>

        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: 500, type: 'spring' }}
          style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}
        >
          <View style={styles.cardHeader}>
            <View style={[styles.iconBadge, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
              <CheckCircle2 size={20} color="#10b981" strokeWidth={2} />
            </View>
            <Text style={[styles.cardTitle, { color: colors.text }]}>Status</Text>
          </View>
          <View style={styles.statusItem}>
            <View style={[styles.statusIcon, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
              <CheckCheck size={18} color="#10b981" strokeWidth={2} />
            </View>
            <Text style={[styles.statusText, { color: colors.text }]}>All Tests Completed</Text>
          </View>
          <View style={styles.statusItem}>
            <View style={[styles.statusIcon, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
              <Send size={18} color="#10b981" strokeWidth={2} />
            </View>
            <Text style={[styles.statusText, { color: colors.text }]}>Reports Sent to Patient</Text>
          </View>
          <View style={styles.statusItem}>
            <View style={[styles.statusIcon, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
              <Clock size={18} color="#10b981" strokeWidth={2} />
            </View>
            <Text style={[styles.statusText, { color: colors.text }]}>Timeline Updated for Patient</Text>
          </View>
        </MotiView>

        <MotiView
          from={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 600, type: 'spring' }}
          style={styles.buttonContainer}
        >
          <TouchableOpacity onPress={handleGoBack} style={styles.backToDashboardButton} activeOpacity={0.8}>
            <LinearGradient
              colors={['#f59e0b', '#d97706']}
              style={styles.backToDashboardGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text style={styles.backToDashboardText}>Go Back to Dashboard</Text>
            </LinearGradient>
          </TouchableOpacity>
        </MotiView>
      </ScrollView>
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
    paddingHorizontal: 20,
    paddingTop: 80,
    paddingBottom: 40,
  },
  successIconContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  successIconGradient: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  card: {
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  iconBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
    gap: 8,
  },
  infoLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    width: 90,
  },
  infoValue: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    flex: 1,
  },
  reportItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  reportLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  reportIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reportInfo: {
    flex: 1,
  },
  reportTest: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 2,
  },
  reportFile: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  statusIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    flex: 1,
  },
  buttonContainer: {
    marginTop: 16,
  },
  backToDashboardButton: {
    width: '70%',
    alignSelf: 'center',
    borderRadius: 16,
    overflow: 'hidden',
  },
  backToDashboardGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backToDashboardText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  errorText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    marginTop: 100,
  },
});
