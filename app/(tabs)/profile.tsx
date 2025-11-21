import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ArrowLeft, LogOut } from 'lucide-react-native';
import { useTheme, lightTheme, darkTheme } from '../../contexts/ThemeContext';
import { ProfileCard } from '../../components/ProfileCard';
import { ShareProfile } from '../../components/ShareProfile';
import { DocumentTimeline, Document } from '../../components/DocumentTimeline';

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
    bloodGroup: 'O+',
    phone: '+1 (555) 123-4567',
    email: 'john.doe@example.com',
    address: '123 Health Street, Medical City, MC 12345',
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

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={[styles.headerButton, { backgroundColor: colors.accentLight }]}>
            <ArrowLeft size={22} color={colors.accent} strokeWidth={2} />
          </TouchableOpacity>

          <Text style={[styles.headerTitle, { color: colors.text }]}>My Profile</Text>

          <TouchableOpacity onPress={handleLogout} style={[styles.headerButton, { backgroundColor: colors.accentLight }]}>
            <LogOut size={22} color={colors.accent} strokeWidth={2} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
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
  safeArea: {
    backgroundColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40,
  },
  spacing: {
    height: 40,
  },
});
