import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ArrowLeft, LogOut } from 'lucide-react-native';
import { useTheme, lightTheme, darkTheme } from '../../contexts/ThemeContext';
import { ProfileCard } from '../../components/ProfileCard';
import { ShareProfile } from '../../components/ShareProfile';
import { DocumentTimeline3D as DocumentTimeline, Document } from '../../components/DocumentTimeline3D';

interface PatientData {
  id: string;
  name: string;
  dob: string;
  gender: string;
  bloodGroup?: string;
  phone?: string;
  email?: string;
  address?: string;
}

export default function ProfileScreen() {
  const { isDark } = useTheme();
  const colors = isDark ? darkTheme : lightTheme;
  const router = useRouter();

  const [patientData, setPatientData] = useState<PatientData>({
    id: 'patient_123',
    name: 'John Doe',
    dob: '15/05/1990',
    gender: 'Male',
    phone: '+91-8208709752',
     });

  const [documents, setDocuments] = useState<Document[]>([
    {
      id: '1',
      type: 'report',
      title: 'Blood Work Report',
      date: 'Jan 15, 2025',
      timestamp: Date.now() - 86400000 * 5,
    },
    {
      id: '2',
      type: 'prescription',
      title: 'Diabetes Medication',
      date: 'Jan 12, 2025',
      timestamp: Date.now() - 86400000 * 8,
    },
    {
      id: '3',
      type: 'invoice',
      title: 'Consultation Invoice',
      date: 'Jan 10, 2025',
      timestamp: Date.now() - 86400000 * 10,
    },
    {
      id: '4',
      type: 'report',
      title: 'X-Ray Chest Report',
      date: 'Jan 5, 2025',
      timestamp: Date.now() - 86400000 * 15,
    },
    {
      id: '5',
      type: 'prescription',
      title: 'Cardiac Medication',
      date: 'Dec 28, 2024',
      timestamp: Date.now() - 86400000 * 23,
    },
    {
      id: '6',
      type: 'report',
      title: 'MRI Scan Results',
      date: 'Dec 20, 2024',
      timestamp: Date.now() - 86400000 * 31,
    },
    {
      id: '7',
      type: 'invoice',
      title: 'Lab Test Payment',
      date: 'Dec 15, 2024',
      timestamp: Date.now() - 86400000 * 36,
    },
  ]);

  const handleUpdatePatient = (updatedData: Omit<PatientData, 'id'> & { id?: string }) => {
    setPatientData({ ...patientData, ...updatedData });
  };

  const handleUploadDocument = () => {
    router.push('/(tabs)/upload-document');
  };

  const handleViewDocument = (doc: Document) => {
  };

  const handleLogout = () => {
    router.replace('/(tabs)/login');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.containerBg }]}>
      <LinearGradient colors={colors.background as any} style={styles.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />

      <View style={[styles.header, { paddingTop: Platform.OS === 'ios' ? 50 : (StatusBar.currentHeight || 0) + 10 }]}>
        <TouchableOpacity onPress={() => router.back()} style={[styles.headerButton, { backgroundColor: colors.accentLight }]}>
          <ArrowLeft size={22} color={colors.accent} strokeWidth={2} />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: colors.text }]}>My Profile</Text>

        <TouchableOpacity onPress={handleLogout} style={[styles.headerButton, { backgroundColor: colors.accentLight }]}>
          <LogOut size={22} color={colors.accent} strokeWidth={2} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <ProfileCard data={patientData} onUpdate={handleUpdatePatient} />

        <ShareProfile patientId={patientData.id} patientName={patientData.name} />

        <DocumentTimeline documents={documents} onUpload={handleUploadDocument} onViewDocument={handleViewDocument} />

        <View style={styles.spacing} />
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
    backgroundColor: 'transparent',
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
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 40,
  },
  spacing: {
    height: 20,
  },
});
