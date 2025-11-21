import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Clock, CheckCircle, XCircle, Eye, Filter } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTheme, lightTheme, darkTheme } from '../../contexts/ThemeContext';

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

export default function DoctorAppointmentsScreen() {
  const router = useRouter();
  const { isDark } = useTheme();
  const colors = isDark ? darkTheme : lightTheme;
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'completed'>('all');

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

  const filteredAppointments = appointments.filter(apt =>
    filter === 'all' ? true : apt.status === filter
  );

  const handleApprove = (id: string) => {
    setAppointments(prev =>
      prev.map(apt => apt.id === id ? { ...apt, status: 'confirmed' as const } : apt)
    );
  };

  const handleReject = (id: string) => {
    setAppointments(prev => prev.filter(apt => apt.id !== id));
  };

  const handleViewPatient = (patientId: string, status: string) => {
    router.push({
      pathname: '/(tabs)/doctor-patient-profile',
      params: { patientId, appointmentStatus: status },
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return '#f59e0b';
      case 'confirmed':
        return '#10b981';
      case 'completed':
        return '#6366F1';
      default:
        return '#94a3b8';
    }
  };

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const filterOptions = [
    { value: 'all', label: 'All' },
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'completed', label: 'Completed' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.containerBg }]}>
      <LinearGradient
        colors={colors.background}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <View style={[styles.header, { paddingTop: Platform.OS === 'ios' ? 50 : (StatusBar.currentHeight || 0) + 10 }]}>
        <TouchableOpacity onPress={() => router.back()} style={[styles.headerButton, { backgroundColor: colors.accentLight }]}>
          <ArrowLeft size={22} color={colors.accent} strokeWidth={2} />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: colors.text }]}>Appointments</Text>

        <View style={{ width: 40 }} />
      </View>

      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {filterOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              onPress={() => setFilter(option.value as any)}
              style={[
                styles.filterChip,
                { backgroundColor: colors.cardBg, borderColor: colors.cardBorder },
                filter === option.value && styles.filterChipActive,
              ]}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.filterChipText,
                { color: colors.text },
                filter === option.value && styles.filterChipTextActive,
              ]}>
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredAppointments.length === 0 ? (
          <View style={[styles.emptyState, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
            <Filter size={48} color={colors.textTertiary} strokeWidth={1.5} />
            <Text style={[styles.emptyText, { color: colors.text }]}>No appointments found</Text>
            <Text style={[styles.emptySubtext, { color: colors.textTertiary }]}>
              Try changing the filter
            </Text>
          </View>
        ) : (
          filteredAppointments.map((appointment, index) => {
            const statusColor = getStatusColor(appointment.status);
            const isPending = appointment.status === 'pending';
            const isConfirmed = appointment.status === 'confirmed';

            return (
              <View key={appointment.id} style={[styles.appointmentCard, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
                <View style={styles.cardHeader}>
                  <View style={styles.patientInfo}>
                    <View style={[styles.patientAvatar, { backgroundColor: `${statusColor}15` }]}>
                      <Text style={[styles.avatarText, { color: statusColor }]}>
                        {appointment.patientName.charAt(0)}
                      </Text>
                    </View>
                    <View style={styles.patientDetails}>
                      <Text style={[styles.patientName, { color: colors.text }]}>
                        {appointment.patientName}
                      </Text>
                      <Text style={[styles.appointmentReason, { color: colors.textTertiary }]} numberOfLines={1}>
                        {appointment.reason}
                      </Text>
                    </View>
                  </View>

                  <View style={[styles.statusBadge, { backgroundColor: `${statusColor}15` }]}>
                    <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
                    <Text style={[styles.statusText, { color: statusColor }]}>
                      {getStatusLabel(appointment.status)}
                    </Text>
                  </View>
                </View>

                <View style={styles.appointmentMeta}>
                  <View style={styles.metaItem}>
                    <Clock size={14} color={colors.textTertiary} strokeWidth={2} />
                    <Text style={[styles.metaText, { color: colors.textTertiary }]}>
                      {appointment.date} at {appointment.time}
                    </Text>
                  </View>
                  <View style={[styles.metaDivider, { backgroundColor: colors.textTertiary }]} />
                  <Text style={[styles.metaText, { color: colors.textTertiary }]}>
                    {appointment.type}
                  </Text>
                </View>

                <View style={styles.cardActions}>
                  <TouchableOpacity
                    onPress={() => handleViewPatient(appointment.patientId, appointment.status)}
                    style={[styles.actionButton, { backgroundColor: colors.accentLight }]}
                  >
                    <Eye size={16} color={colors.accent} strokeWidth={2} />
                    <Text style={[styles.actionButtonText, { color: colors.accent }]}>
                      View Patient
                    </Text>
                  </TouchableOpacity>

                  {isPending && (
                    <>
                      <TouchableOpacity
                        onPress={() => handleApprove(appointment.id)}
                        style={[styles.actionButton, styles.actionButtonApprove]}
                      >
                        <CheckCircle size={16} color="#10b981" strokeWidth={2} />
                        <Text style={[styles.actionButtonText, { color: '#10b981' }]}>
                          Approve
                        </Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => handleReject(appointment.id)}
                        style={[styles.actionButton, styles.actionButtonReject]}
                      >
                        <XCircle size={16} color="#ef4444" strokeWidth={2} />
                        <Text style={[styles.actionButtonText, { color: '#ef4444' }]}>
                          Reject
                        </Text>
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              </View>
            );
          })
        )}
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
  filterContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  filterScroll: {
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
  },
  filterChipActive: {
    backgroundColor: '#6366F1',
    borderColor: '#6366F1',
  },
  filterChipText: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
  },
  filterChipTextActive: {
    color: '#ffffff',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
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
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
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
});
