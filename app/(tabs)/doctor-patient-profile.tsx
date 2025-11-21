import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, StatusBar, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { ArrowLeft, User, Calendar, Droplet, Phone, Mail, Plus, FileText, FlaskConical, Pill } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme, lightTheme, darkTheme } from '../../contexts/ThemeContext';
import PrescriptionForm from '../../components/PrescriptionForm';
import LabTestForm from '../../components/LabTestForm';

interface MedicalRecord {
  id: string;
  type: 'prescription' | 'lab_report' | 'consultation';
  date: string;
  title: string;
  doctor: string;
  details: string;
  timestamp: number;
}

interface PatientData {
  id: string;
  name: string;
  dob: string;
  gender: string;
  bloodGroup: string;
  phone: string;
  email: string;
  address: string;
}

export default function DoctorPatientProfileScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { patientId, walkIn } = params;
  const { isDark } = useTheme();
  const colors = isDark ? darkTheme : lightTheme;

  const [showPrescriptionForm, setShowPrescriptionForm] = useState(false);
  const [showLabTestForm, setShowLabTestForm] = useState(false);

  const patientData: PatientData = {
    id: patientId as string || 'patient_123',
    name: 'John Doe',
    dob: '15/05/1990',
    gender: 'Male',
    bloodGroup: 'O+',
    phone: '+1 (555) 123-4567',
    email: 'john.doe@example.com',
    address: '123 Health Street, Medical City, MC 12345',
  };

  const [medicalHistory] = useState<MedicalRecord[]>([
    {
      id: 'rec_1',
      type: 'prescription',
      date: 'Jan 15, 2025',
      title: 'Hypertension Medication',
      doctor: 'Dr. Sarah Johnson',
      details: 'Amlodipine 5mg once daily, Metoprolol 50mg twice daily',
      timestamp: Date.now() - 86400000 * 5,
    },
    {
      id: 'rec_2',
      type: 'lab_report',
      date: 'Jan 10, 2025',
      title: 'Complete Blood Count',
      doctor: 'Dr. Michael Chen',
      details: 'All parameters within normal range',
      timestamp: Date.now() - 86400000 * 10,
    },
    {
      id: 'rec_3',
      type: 'consultation',
      date: 'Jan 5, 2025',
      title: 'Routine Check-up',
      doctor: 'Dr. Sarah Johnson',
      details: 'Patient reported mild headaches, BP 135/85',
      timestamp: Date.now() - 86400000 * 15,
    },
    {
      id: 'rec_4',
      type: 'lab_report',
      date: 'Dec 20, 2024',
      title: 'Lipid Profile',
      doctor: 'Dr. Emily Watson',
      details: 'Total Cholesterol: 190 mg/dL, LDL: 110 mg/dL',
      timestamp: Date.now() - 86400000 * 30,
    },
  ]);

  const calculateAge = (dob: string) => {
    const [day, month, year] = dob.split('/').map(Number);
    const birthDate = new Date(year, month - 1, day);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const getRecordIcon = (type: string) => {
    switch (type) {
      case 'prescription':
        return Pill;
      case 'lab_report':
        return FlaskConical;
      case 'consultation':
        return FileText;
      default:
        return FileText;
    }
  };

  const getRecordColor = (type: string) => {
    switch (type) {
      case 'prescription':
        return '#10b981';
      case 'lab_report':
        return '#f59e0b';
      case 'consultation':
        return '#6366F1';
      default:
        return '#6366F1';
    }
  };

  const age = calculateAge(patientData.dob);
  const isWalkIn = walkIn === 'true';

  const handleSavePrescription = (data: any) => {
    setShowPrescriptionForm(false);
  };

  const handleSaveLabTest = (data: any) => {
    setShowLabTestForm(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.containerBg }]}>
      <LinearGradient colors={colors.background as any} style={styles.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />

      <View style={[styles.header, { paddingTop: Platform.OS === 'ios' ? 50 : (StatusBar.currentHeight || 0) + 10 }]}>
        <TouchableOpacity onPress={() => router.back()} style={[styles.headerButton, { backgroundColor: colors.accentLight }]}>
          <ArrowLeft size={22} color={colors.accent} strokeWidth={2} />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: colors.text }]}>Patient Profile</Text>

        <View style={{ width: 40 }} />
      </View>

      {isWalkIn && (
        <MotiView
          from={{ opacity: 0, translateY: -10 }}
          animate={{ opacity: 1, translateY: 0 }}
          style={[styles.walkInBanner, { backgroundColor: colors.accentLight }]}
        >
          <Text style={[styles.walkInText, { color: colors.accent }]}>Walk-in Patient</Text>
        </MotiView>
      )}

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <MotiView
          from={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 100, damping: 15 } as any}
          style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}
        >
          <View style={styles.cardHeader}>
            <View style={styles.avatarSection}>
              <LinearGradient
                colors={['#6366F1', '#818CF8']}
                style={styles.avatar}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <User size={32} color="#ffffff" strokeWidth={2} />
              </LinearGradient>
              <View style={styles.nameSection}>
                <Text style={[styles.name, { color: colors.text }]}>{patientData.name}</Text>
                <Text style={[styles.subtitle, { color: colors.textTertiary }]}>{age} years • {patientData.gender}</Text>
              </View>
            </View>
          </View>

          <View style={styles.infoGrid}>
            <View style={styles.infoRow}>
              <View style={[styles.iconBadge, { backgroundColor: colors.accentLight }]}>
                <Calendar size={16} color={colors.accent} strokeWidth={2} />
              </View>
              <View style={styles.infoContent}>
                <Text style={[styles.infoLabel, { color: colors.textTertiary }]}>Date of Birth</Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>{patientData.dob}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={[styles.iconBadge, { backgroundColor: 'rgba(239, 68, 68, 0.1)' }]}>
                <Droplet size={16} color="#EF4444" strokeWidth={2} />
              </View>
              <View style={styles.infoContent}>
                <Text style={[styles.infoLabel, { color: colors.textTertiary }]}>Blood Group</Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>{patientData.bloodGroup}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={[styles.iconBadge, { backgroundColor: 'rgba(16, 185, 129, 0.1)' }]}>
                <Phone size={16} color="#10B981" strokeWidth={2} />
              </View>
              <View style={styles.infoContent}>
                <Text style={[styles.infoLabel, { color: colors.textTertiary }]}>Phone</Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>{patientData.phone}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={[styles.iconBadge, { backgroundColor: 'rgba(245, 158, 11, 0.1)' }]}>
                <Mail size={16} color="#F59E0B" strokeWidth={2} />
              </View>
              <View style={styles.infoContent}>
                <Text style={[styles.infoLabel, { color: colors.textTertiary }]}>Email</Text>
                <Text style={[styles.infoValue, { color: colors.text }]} numberOfLines={1}>{patientData.email}</Text>
              </View>
            </View>
          </View>
        </MotiView>

        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: 200, damping: 15 } as any}
          style={styles.actionsSection}
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity
              onPress={() => setShowPrescriptionForm(true)}
              style={styles.actionCard}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={['#10b981', '#059669']}
                style={styles.actionGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.actionIconContainer}>
                  <Pill size={28} color="#ffffff" strokeWidth={2} />
                </View>
                <Text style={styles.actionText}>Add Prescription</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setShowLabTestForm(true)}
              style={styles.actionCard}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={['#f59e0b', '#d97706']}
                style={styles.actionGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.actionIconContainer}>
                  <FlaskConical size={28} color="#ffffff" strokeWidth={2} />
                </View>
                <Text style={styles.actionText}>Request Lab Test</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </MotiView>

        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: 300, damping: 15 } as any}
          style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Medical History</Text>

          <View style={styles.timeline}>
            {medicalHistory.map((record, index) => {
              const Icon = getRecordIcon(record.type);
              const color = getRecordColor(record.type);
              const isLast = index === medicalHistory.length - 1;

              return (
                <View key={record.id} style={styles.timelineItem}>
                  <View style={styles.timelineLeft}>
                    <View style={[styles.timelineNode, { backgroundColor: color }]} />
                    {!isLast && <View style={[styles.timelineLine, { backgroundColor: color }]} />}
                  </View>

                  <View style={[styles.recordCard, { backgroundColor: colors.containerBg, borderColor: colors.cardBorder }]}>
                    <View style={styles.recordHeader}>
                      <View style={[styles.recordIconContainer, { backgroundColor: `${color}20` }]}>
                        <Icon size={20} color={color} strokeWidth={2} />
                      </View>
                      <View style={styles.recordInfo}>
                        <Text style={[styles.recordTitle, { color: colors.text }]}>{record.title}</Text>
                        <Text style={[styles.recordDate, { color: colors.textTertiary }]}>{record.date}</Text>
                      </View>
                    </View>
                    <Text style={[styles.recordDoctor, { color: colors.textSecondary }]}>{record.doctor}</Text>
                    <Text style={[styles.recordDetails, { color: colors.textTertiary }]}>{record.details}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </MotiView>
      </ScrollView>

      <Modal
        visible={showPrescriptionForm}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPrescriptionForm(false)}
      >
        <PrescriptionForm
          patientName={patientData.name}
          patientId={patientData.id}
          onSave={handleSavePrescription}
          onClose={() => setShowPrescriptionForm(false)}
        />
      </Modal>

      <Modal
        visible={showLabTestForm}
        transparent
        animationType="slide"
        onRequestClose={() => setShowLabTestForm(false)}
      >
        <LabTestForm
          patientName={patientData.name}
          patientId={patientData.id}
          onSave={handleSaveLabTest}
          onClose={() => setShowLabTestForm(false)}
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
  walkInBanner: {
    marginHorizontal: 20,
    marginBottom: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  walkInText: {
    fontSize: 13,
    fontFamily: 'Inter-SemiBold',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 40,
  },
  card: {
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  cardHeader: {
    marginBottom: 16,
  },
  avatarSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameSection: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
  },
  infoGrid: {
    gap: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  actionsSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    marginBottom: 12,
  },
  actionsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  actionCard: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  actionGradient: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  actionIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  actionText: {
    fontSize: 13,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    textAlign: 'center',
  },
  timeline: {
    marginTop: 16,
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
  recordCard: {
    flex: 1,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
  },
  recordHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  recordIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  recordInfo: {
    flex: 1,
  },
  recordTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 2,
  },
  recordDate: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
  },
  recordDoctor: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    marginBottom: 6,
  },
  recordDetails: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    lineHeight: 18,
  },
});
