import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, StatusBar, TextInput, Modal, KeyboardAvoidingView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { ArrowLeft, Edit2, Check, X, User, Stethoscope, FileText, Award, Phone, Mail, MapPin, Calendar, Briefcase, Upload, FileCheck, LogOut } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTheme, lightTheme, darkTheme } from '../../contexts/ThemeContext';

interface DoctorData {
  id: string;
  name: string;
  specialization: string;
  registrationNumber: string;
  qualification?: string;
  experience?: string;
  phone?: string;
  email?: string;
  address?: string;
  bio?: string;
  hospital?: string;
  consultationFee?: string;
}

interface Document {
  id: string;
  type: 'certificate' | 'license' | 'degree' | 'other';
  title: string;
  date: string;
  timestamp: number;
}

export default function DoctorProfileScreen() {
  const router = useRouter();
  const { isDark } = useTheme();
  const colors = isDark ? darkTheme : lightTheme;
  const [editMode, setEditMode] = useState(false);

  const [doctorData, setDoctorData] = useState<DoctorData>({
    id: 'doctor_123',
    name: 'Dr. Sarah Johnson',
    specialization: 'Cardiologist',
    registrationNumber: 'MCI-12345-2015',
    qualification: 'MBBS, MD (Cardiology)',
    experience: '12 years',
    phone: '+1 (555) 234-5678',
    email: 'sarah.johnson@healthcarecenter.com',
    address: '123 Medical Plaza, Suite 450, Healthcare City, HC 12345',
    bio: 'Board-certified cardiologist with extensive experience in interventional cardiology and heart disease prevention.',
    hospital: 'City General Hospital',
    consultationFee: '$150',
  });

  const [editData, setEditData] = useState<DoctorData>(doctorData);

  const [documents] = useState<Document[]>([
    {
      id: 'doc_1',
      type: 'degree',
      title: 'MBBS Degree Certificate',
      date: 'June 2008',
      timestamp: Date.now() - 86400000 * 1500,
    },
    {
      id: 'doc_2',
      type: 'degree',
      title: 'MD Cardiology Certificate',
      date: 'March 2012',
      timestamp: Date.now() - 86400000 * 1200,
    },
    {
      id: 'doc_3',
      type: 'license',
      title: 'Medical Council Registration',
      date: 'January 2015',
      timestamp: Date.now() - 86400000 * 1000,
    },
    {
      id: 'doc_4',
      type: 'certificate',
      title: 'Advanced Cardiac Life Support',
      date: 'September 2023',
      timestamp: Date.now() - 86400000 * 100,
    },
  ]);

  const handleSave = () => {
    setDoctorData(editData);
    setEditMode(false);
  };

  const handleCancel = () => {
    setEditData(doctorData);
    setEditMode(false);
  };

  const handleUploadDocument = () => {
    console.log('Upload document');
  };

  const handleLogout = () => {
    router.replace('/(tabs)/login');
  };

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'certificate':
        return Award;
      case 'license':
        return FileCheck;
      case 'degree':
        return Briefcase;
      default:
        return FileText;
    }
  };

  const getDocumentColor = (type: string) => {
    switch (type) {
      case 'certificate':
        return '#10b981';
      case 'license':
        return '#f59e0b';
      case 'degree':
        return '#6366F1';
      default:
        return '#64748b';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.containerBg }]}>
      <LinearGradient
        colors={colors.background as any}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <View style={[styles.header, { paddingTop: Platform.OS === 'ios' ? 50 : (StatusBar.currentHeight || 0) + 10 }]}>
        <TouchableOpacity onPress={() => router.back()} style={[styles.headerButton, { backgroundColor: colors.accentLight }]}>
          <ArrowLeft size={22} color={colors.accent} strokeWidth={2} />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: colors.text }]}>My Profile</Text>

        <TouchableOpacity onPress={handleLogout} style={[styles.headerButton, { backgroundColor: 'rgba(239, 68, 68, 0.1)' }]}>
          <LogOut size={22} color="#EF4444" strokeWidth={2} />
        </TouchableOpacity>
      </View>

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
                colors={['#10b981', '#059669']}
                style={styles.avatar}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Stethoscope size={32} color="#ffffff" strokeWidth={2} />
              </LinearGradient>
              <View style={styles.nameSection}>
                <Text style={[styles.name, { color: colors.text }]}>{doctorData.name}</Text>
                <Text style={[styles.subtitle, { color: colors.textTertiary }]}>{doctorData.specialization}</Text>
              </View>
            </View>
            {!editMode && (
              <TouchableOpacity
                onPress={() => {
                  setEditData(doctorData);
                  setEditMode(true);
                }}
                style={[styles.editButton, { backgroundColor: colors.accentLight }]}
              >
                <Edit2 size={18} color={colors.accent} strokeWidth={2} />
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.infoGrid}>
            <View style={styles.infoRow}>
              <View style={[styles.iconBadge, { backgroundColor: colors.accentLight }]}>
                <FileText size={16} color={colors.accent} strokeWidth={2} />
              </View>
              <View style={styles.infoContent}>
                <Text style={[styles.infoLabel, { color: colors.textTertiary }]}>Registration Number</Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>{doctorData.registrationNumber}</Text>
              </View>
            </View>

            {doctorData.qualification && (
              <View style={styles.infoRow}>
                <View style={[styles.iconBadge, { backgroundColor: 'rgba(99, 102, 241, 0.1)' }]}>
                  <Award size={16} color="#6366F1" strokeWidth={2} />
                </View>
                <View style={styles.infoContent}>
                  <Text style={[styles.infoLabel, { color: colors.textTertiary }]}>Qualification</Text>
                  <Text style={[styles.infoValue, { color: colors.text }]}>{doctorData.qualification}</Text>
                </View>
              </View>
            )}

            {doctorData.experience && (
              <View style={styles.infoRow}>
                <View style={[styles.iconBadge, { backgroundColor: 'rgba(16, 185, 129, 0.1)' }]}>
                  <Briefcase size={16} color="#10B981" strokeWidth={2} />
                </View>
                <View style={styles.infoContent}>
                  <Text style={[styles.infoLabel, { color: colors.textTertiary }]}>Experience</Text>
                  <Text style={[styles.infoValue, { color: colors.text }]}>{doctorData.experience}</Text>
                </View>
              </View>
            )}

            {doctorData.hospital && (
              <View style={styles.infoRow}>
                <View style={[styles.iconBadge, { backgroundColor: 'rgba(245, 158, 11, 0.1)' }]}>
                  <Briefcase size={16} color="#F59E0B" strokeWidth={2} />
                </View>
                <View style={styles.infoContent}>
                  <Text style={[styles.infoLabel, { color: colors.textTertiary }]}>Hospital</Text>
                  <Text style={[styles.infoValue, { color: colors.text }]}>{doctorData.hospital}</Text>
                </View>
              </View>
            )}

            {doctorData.consultationFee && (
              <View style={styles.infoRow}>
                <View style={[styles.iconBadge, { backgroundColor: colors.accentLight }]}>
                  <Calendar size={16} color={colors.accent} strokeWidth={2} />
                </View>
                <View style={styles.infoContent}>
                  <Text style={[styles.infoLabel, { color: colors.textTertiary }]}>Consultation Fee</Text>
                  <Text style={[styles.infoValue, { color: colors.text }]}>{doctorData.consultationFee}</Text>
                </View>
              </View>
            )}

            {doctorData.phone && (
              <View style={styles.infoRow}>
                <View style={[styles.iconBadge, { backgroundColor: 'rgba(16, 185, 129, 0.1)' }]}>
                  <Phone size={16} color="#10B981" strokeWidth={2} />
                </View>
                <View style={styles.infoContent}>
                  <Text style={[styles.infoLabel, { color: colors.textTertiary }]}>Phone</Text>
                  <Text style={[styles.infoValue, { color: colors.text }]}>{doctorData.phone}</Text>
                </View>
              </View>
            )}

            {doctorData.email && (
              <View style={styles.infoRow}>
                <View style={[styles.iconBadge, { backgroundColor: 'rgba(245, 158, 11, 0.1)' }]}>
                  <Mail size={16} color="#F59E0B" strokeWidth={2} />
                </View>
                <View style={styles.infoContent}>
                  <Text style={[styles.infoLabel, { color: colors.textTertiary }]}>Email</Text>
                  <Text style={[styles.infoValue, { color: colors.text }]} numberOfLines={1}>{doctorData.email}</Text>
                </View>
              </View>
            )}

            {doctorData.address && (
              <View style={styles.infoRow}>
                <View style={[styles.iconBadge, { backgroundColor: colors.accentLight }]}>
                  <MapPin size={16} color={colors.accent} strokeWidth={2} />
                </View>
                <View style={styles.infoContent}>
                  <Text style={[styles.infoLabel, { color: colors.textTertiary }]}>Address</Text>
                  <Text style={[styles.infoValue, { color: colors.text }]} numberOfLines={2}>{doctorData.address}</Text>
                </View>
              </View>
            )}

            {doctorData.bio && (
              <View style={styles.bioContainer}>
                <Text style={[styles.bioLabel, { color: colors.textTertiary }]}>Professional Bio</Text>
                <Text style={[styles.bioText, { color: colors.text }]}>{doctorData.bio}</Text>
              </View>
            )}
          </View>
        </MotiView>

        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: 200, damping: 15 } as any}
          style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}
        >
          <View style={styles.documentsHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Professional Documents</Text>
            <TouchableOpacity
              onPress={handleUploadDocument}
              style={[styles.uploadButton, { backgroundColor: colors.accentLight }]}
            >
              <Upload size={16} color={colors.accent} strokeWidth={2} />
            </TouchableOpacity>
          </View>

          <View style={styles.documentsGrid}>
            {documents.map((doc, index) => {
              const Icon = getDocumentIcon(doc.type);
              const color = getDocumentColor(doc.type);

              return (
                <TouchableOpacity
                  key={doc.id}
                  style={[styles.documentCard, { backgroundColor: colors.containerBg, borderColor: colors.cardBorder }]}
                  activeOpacity={0.7}
                >
                  <View style={[styles.documentIcon, { backgroundColor: `${color}15` }]}>
                    <Icon size={20} color={color} strokeWidth={2} />
                  </View>
                  <Text style={[styles.documentTitle, { color: colors.text }]} numberOfLines={2}>
                    {doc.title}
                  </Text>
                  <Text style={[styles.documentDate, { color: colors.textTertiary }]}>
                    {doc.date}
                  </Text>
                </TouchableOpacity>
              );
            })}

            <TouchableOpacity
              onPress={handleUploadDocument}
              style={[styles.documentCard, styles.documentCardAdd, { backgroundColor: colors.containerBg, borderColor: colors.cardBorder }]}
              activeOpacity={0.7}
            >
              <View style={[styles.documentIcon, { backgroundColor: colors.accentLight }]}>
                <Upload size={20} color={colors.accent} strokeWidth={2} />
              </View>
              <Text style={[styles.documentTitle, { color: colors.text }]}>
                Upload New
              </Text>
              <Text style={[styles.documentDate, { color: colors.textTertiary }]}>
                Add document
              </Text>
            </TouchableOpacity>
          </View>
        </MotiView>

        <View style={styles.spacing} />
      </ScrollView>

      <Modal
        visible={editMode}
        transparent
        animationType="slide"
        onRequestClose={handleCancel}
      >
        <View style={[styles.modalOverlay, { backgroundColor: isDark ? 'rgba(15, 23, 42, 0.8)' : 'rgba(0, 0, 0, 0.5)' }]}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalContent}>
            <View style={[styles.modalCard, { backgroundColor: colors.containerBg }]}>
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: colors.text }]}>Edit Profile</Text>
                <TouchableOpacity onPress={handleCancel}>
                  <X size={24} color={colors.text} strokeWidth={2} />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
                <View style={styles.editField}>
                  <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Full Name</Text>
                  <TextInput
                    style={[styles.fieldInput, { color: colors.text, borderColor: colors.cardBorder, backgroundColor: colors.cardBg }]}
                    value={editData.name}
                    onChangeText={(text) => setEditData({ ...editData, name: text })}
                    placeholderTextColor={colors.textTertiary}
                  />
                </View>

                <View style={styles.editField}>
                  <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Specialization</Text>
                  <TextInput
                    style={[styles.fieldInput, { color: colors.text, borderColor: colors.cardBorder, backgroundColor: colors.cardBg }]}
                    value={editData.specialization}
                    onChangeText={(text) => setEditData({ ...editData, specialization: text })}
                    placeholderTextColor={colors.textTertiary}
                  />
                </View>

                <View style={styles.editField}>
                  <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Registration Number</Text>
                  <TextInput
                    style={[styles.fieldInput, { color: colors.text, borderColor: colors.cardBorder, backgroundColor: colors.cardBg }]}
                    value={editData.registrationNumber}
                    onChangeText={(text) => setEditData({ ...editData, registrationNumber: text })}
                    placeholderTextColor={colors.textTertiary}
                  />
                </View>

                <View style={styles.editField}>
                  <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Qualification</Text>
                  <TextInput
                    style={[styles.fieldInput, { color: colors.text, borderColor: colors.cardBorder, backgroundColor: colors.cardBg }]}
                    value={editData.qualification || ''}
                    onChangeText={(text) => setEditData({ ...editData, qualification: text })}
                    placeholder="e.g., MBBS, MD"
                    placeholderTextColor={colors.textTertiary}
                  />
                </View>

                <View style={styles.editField}>
                  <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Experience</Text>
                  <TextInput
                    style={[styles.fieldInput, { color: colors.text, borderColor: colors.cardBorder, backgroundColor: colors.cardBg }]}
                    value={editData.experience || ''}
                    onChangeText={(text) => setEditData({ ...editData, experience: text })}
                    placeholder="e.g., 10 years"
                    placeholderTextColor={colors.textTertiary}
                  />
                </View>

                <View style={styles.editField}>
                  <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Hospital</Text>
                  <TextInput
                    style={[styles.fieldInput, { color: colors.text, borderColor: colors.cardBorder, backgroundColor: colors.cardBg }]}
                    value={editData.hospital || ''}
                    onChangeText={(text) => setEditData({ ...editData, hospital: text })}
                    placeholder="Your hospital or clinic"
                    placeholderTextColor={colors.textTertiary}
                  />
                </View>

                <View style={styles.editField}>
                  <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Consultation Fee</Text>
                  <TextInput
                    style={[styles.fieldInput, { color: colors.text, borderColor: colors.cardBorder, backgroundColor: colors.cardBg }]}
                    value={editData.consultationFee || ''}
                    onChangeText={(text) => setEditData({ ...editData, consultationFee: text })}
                    placeholder="e.g., $100"
                    placeholderTextColor={colors.textTertiary}
                  />
                </View>

                <View style={styles.editField}>
                  <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Phone</Text>
                  <TextInput
                    style={[styles.fieldInput, { color: colors.text, borderColor: colors.cardBorder, backgroundColor: colors.cardBg }]}
                    value={editData.phone || ''}
                    onChangeText={(text) => setEditData({ ...editData, phone: text })}
                    placeholder="+1 (555) 000-0000"
                    placeholderTextColor={colors.textTertiary}
                  />
                </View>

                <View style={styles.editField}>
                  <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Email</Text>
                  <TextInput
                    style={[styles.fieldInput, { color: colors.text, borderColor: colors.cardBorder, backgroundColor: colors.cardBg }]}
                    value={editData.email || ''}
                    onChangeText={(text) => setEditData({ ...editData, email: text })}
                    placeholder="your.email@example.com"
                    placeholderTextColor={colors.textTertiary}
                  />
                </View>

                <View style={styles.editField}>
                  <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Address</Text>
                  <TextInput
                    style={[styles.fieldInput, { color: colors.text, borderColor: colors.cardBorder, backgroundColor: colors.cardBg }]}
                    value={editData.address || ''}
                    onChangeText={(text) => setEditData({ ...editData, address: text })}
                    placeholder="Your practice address"
                    placeholderTextColor={colors.textTertiary}
                    multiline
                    numberOfLines={3}
                  />
                </View>

                <View style={styles.editField}>
                  <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Professional Bio</Text>
                  <TextInput
                    style={[styles.fieldInput, styles.fieldInputMultiline, { color: colors.text, borderColor: colors.cardBorder, backgroundColor: colors.cardBg }]}
                    value={editData.bio || ''}
                    onChangeText={(text) => setEditData({ ...editData, bio: text })}
                    placeholder="Brief description of your expertise"
                    placeholderTextColor={colors.textTertiary}
                    multiline
                    numberOfLines={4}
                  />
                </View>
              </ScrollView>

              <View style={styles.modalFooter}>
                <TouchableOpacity
                  onPress={handleCancel}
                  style={[styles.modalButton, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}
                >
                  <Text style={[styles.modalButtonText, { color: colors.text }]}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleSave}
                  style={styles.modalButtonPrimary}
                >
                  <LinearGradient
                    colors={['#10b981', '#059669']}
                    style={styles.modalButtonGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Check size={20} color="#ffffff" strokeWidth={2} />
                    <Text style={styles.modalButtonPrimaryText}>Save Changes</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
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
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
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
  bioContainer: {
    marginTop: 6,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(99, 102, 241, 0.1)',
  },
  bioLabel: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    marginBottom: 8,
  },
  bioText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
  },
  documentsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
  },
  uploadButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  documentsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  documentCard: {
    width: '48%',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
  },
  documentCardAdd: {
    borderStyle: 'dashed',
  },
  documentIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  documentTitle: {
    fontSize: 13,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
    lineHeight: 16,
  },
  documentDate: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
  },
  spacing: {
    height: 20,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContent: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalCard: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 24,
    paddingHorizontal: 20,
    paddingBottom: 24,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
  },
  modalScroll: {
    marginBottom: 20,
  },
  editField: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 13,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  fieldInput: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    fontFamily: 'Inter-Regular',
  },
  fieldInputMultiline: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  modalButtonText: {
    fontSize: 15,
    fontFamily: 'Inter-SemiBold',
  },
  modalButtonPrimary: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  modalButtonGradient: {
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  modalButtonPrimaryText: {
    fontSize: 15,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
});
