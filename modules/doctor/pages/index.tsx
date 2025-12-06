import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Modal, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { useRouter } from 'expo-router';
import { useTheme, lightTheme, darkTheme } from '@/modules/shared/contexts/ThemeContext';
import QRScanner from '@/modules/shared/components/QRScanner';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import StatsOverview from '../components/dashboard/StatsOverview';
import PatientSearch from '../components/dashboard/PatientSearch';
import ScheduleSection from '../components/dashboard/ScheduleSection';
import DoctorBottomNav from '../components/dashboard/DoctorBottomNav';
import { Patient } from '../components/dashboard/PatientCard';

export default function DoctorHomeScreen() {
  const router = useRouter();
  const { isDark } = useTheme();
  const colors = isDark ? darkTheme : lightTheme;
  const [showQRScanner, setShowQRScanner] = useState(false);

  // Mock Data
  const waitingPatients: Patient[] = [
    {
      id: 'p1',
      name: 'James Brown',
      time: '09:00 AM',
      type: 'Follow-up',
      reason: 'Post-surgery checkup',
      status: 'in-consultation',
      tokenNumber: '12',
    },
    {
      id: 'p2',
      name: 'Olivia Davis',
      time: '09:30 AM',
      type: 'Consultation',
      reason: 'Severe migraine',
      status: 'waiting',
      tokenNumber: '13',
      isFirstVisit: true,
    },
    {
      id: 'p3',
      name: 'Robert Johnson',
      time: '10:00 AM',
      type: 'Check-up',
      reason: 'Annual physical',
      status: 'waiting',
      tokenNumber: '14',
    },
    {
      id: 'p6',
      name: 'Sophia Anderson',
      time: '10:30 AM',
      type: 'Consultation',
      reason: 'Chest pain',
      status: 'waiting',
      tokenNumber: '15',
    },
    {
      id: 'p7',
      name: 'Michael Taylor',
      time: '11:00 AM',
      type: 'Follow-up',
      reason: 'Diabetes review',
      status: 'waiting',
      tokenNumber: '16',
    },
  ];

  const upcomingPatients: Patient[] = [
    {
      id: 'p4',
      name: 'Linda Martinez',
      time: '11:30 AM',
      type: 'Follow-up',
      reason: 'Blood pressure check',
      status: 'upcoming',
    },
    {
      id: 'p5',
      name: 'David Wilson',
      time: '12:00 PM',
      type: 'Consultation',
      reason: 'Skin rash',
      status: 'upcoming',
      isFirstVisit: true,
    },
    {
      id: 'p8',
      name: 'Emily Thompson',
      time: '02:00 PM',
      type: 'Check-up',
      reason: 'Routine examination',
      status: 'upcoming',
    },
    {
      id: 'p9',
      name: 'Christopher Lee',
      time: '02:30 PM',
      type: 'Consultation',
      reason: 'Allergy symptoms',
      status: 'upcoming',
      isFirstVisit: true,
    },
    {
      id: 'p10',
      name: 'Jennifer White',
      time: '03:00 PM',
      type: 'Follow-up',
      reason: 'Medication review',
      status: 'upcoming',
    },
  ];

  const completedPatients: Patient[] = [
    {
      id: 'p0',
      name: 'Emma Wilson',
      time: '08:30 AM',
      type: 'Check-up',
      reason: 'Routine checkup',
      status: 'completed',
    },
    {
      id: 'p11',
      name: 'Daniel Garcia',
      time: '08:00 AM',
      type: 'Consultation',
      reason: 'Flu symptoms',
      status: 'completed',
    },
    {
      id: 'p12',
      name: 'Sarah Miller',
      time: '07:30 AM',
      type: 'Follow-up',
      reason: 'Post-treatment review',
      status: 'completed',
    },
  ];

  const handlePatientPress = (patientId: string) => {
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

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <MotiView
          from={{ opacity: 0, translateY: -20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 400 }}
        >
          <DashboardHeader
            doctorName="Dr. Sarah Johnson"
            clinicName="City General Hospital"
            onAddWalkIn={() => setShowQRScanner(true)}
            onNotificationPress={() => { }}
          />
        </MotiView>

        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 400, delay: 100 }}
        >
          <StatsOverview
            totalAppointments={12}
            completedVisits={1}
            pendingVisits={2}
            noShows={0}
            newPatientsThisWeek={5}
          />
        </MotiView>

        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 400, delay: 200 }}
        >
          <PatientSearch
            onSearch={(query) => console.log('Search:', query)}
            onScanPress={() => setShowQRScanner(true)}
          />
        </MotiView>

        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 400, delay: 300 }}
        >
          <ScheduleSection
            waitingPatients={waitingPatients}
            upcomingPatients={upcomingPatients}
            completedPatients={completedPatients}
            onPatientPress={handlePatientPress}
          />
        </MotiView>
      </ScrollView>

      <DoctorBottomNav onScanPress={() => setShowQRScanner(true)} />

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
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 140,
  },
});
