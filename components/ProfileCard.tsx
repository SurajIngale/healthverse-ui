import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { Edit2, X, Check } from 'lucide-react-native';
import { useTheme, lightTheme, darkTheme } from '../contexts/ThemeContext';

interface PatientData {
  name: string;
  dob: string;
  gender: string;
  bloodGroup?: string;
  phone?: string;
  email?: string;
  address?: string;
}

interface ProfileCardProps {
  data: PatientData;
  onUpdate: (data: PatientData) => void;
}

export function ProfileCard({ data, onUpdate }: ProfileCardProps) {
  const { isDark } = useTheme();
  const colors = isDark ? darkTheme : lightTheme;
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState<PatientData>(data);

  const handleSave = () => {
    onUpdate(editData);
    setEditMode(false);
  };

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

  const age = data.dob ? calculateAge(data.dob) : 'N/A';

  return (
    <>
      <MotiView
        from={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 100, damping: 15 } as any}
        style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}
      >
        <View style={styles.cardHeader}>
          <View>
            <Text style={[styles.name, { color: colors.text }]}>{data.name}</Text>
            <Text style={[styles.info, { color: colors.textTertiary }]}>{age} years • {data.gender}</Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              setEditData(data);
              setEditMode(true);
            }}
            style={[styles.editButton, { backgroundColor: colors.accentLight, borderColor: colors.accent }]}
          >
            <Edit2 size={18} color={colors.accent} strokeWidth={2} />
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoGrid}>
          <View style={styles.infoItem}>
            <Text style={[styles.infoLabel, { color: colors.textTertiary }]}>DOB</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>{data.dob}</Text>
          </View>
          {data.bloodGroup && (
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, { color: colors.textTertiary }]}>Blood Group</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>{data.bloodGroup}</Text>
            </View>
          )}
          {data.phone && (
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, { color: colors.textTertiary }]}>Phone</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>{data.phone}</Text>
            </View>
          )}
          {data.email && (
            <View style={styles.infoItem}>
              <Text style={[styles.infoLabel, { color: colors.textTertiary }]}>Email</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>{data.email}</Text>
            </View>
          )}
        </View>
      </MotiView>

      <Modal
        visible={editMode}
        transparent
        animationType="slide"
        onRequestClose={() => setEditMode(false)}
      >
        <View style={[styles.modalOverlay, { backgroundColor: isDark ? 'rgba(15, 23, 42, 0.8)' : 'rgba(0, 0, 0, 0.5)' }]}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalContent}>
            <View style={[styles.modalCard, { backgroundColor: colors.containerBg }]}>
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: colors.text }]}>Edit Profile</Text>
                <TouchableOpacity onPress={() => setEditMode(false)}>
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
                  <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Date of Birth</Text>
                  <TextInput
                    style={[styles.fieldInput, { color: colors.text, borderColor: colors.cardBorder, backgroundColor: colors.cardBg }]}
                    value={editData.dob}
                    onChangeText={(text) => setEditData({ ...editData, dob: text })}
                    placeholder="DD/MM/YYYY"
                    placeholderTextColor={colors.textTertiary}
                  />
                </View>

                <View style={styles.editField}>
                  <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Gender</Text>
                  <TextInput
                    style={[styles.fieldInput, { color: colors.text, borderColor: colors.cardBorder, backgroundColor: colors.cardBg }]}
                    value={editData.gender}
                    onChangeText={(text) => setEditData({ ...editData, gender: text })}
                    placeholderTextColor={colors.textTertiary}
                  />
                </View>

                <View style={styles.editField}>
                  <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>Blood Group</Text>
                  <TextInput
                    style={[styles.fieldInput, { color: colors.text, borderColor: colors.cardBorder, backgroundColor: colors.cardBg }]}
                    value={editData.bloodGroup || ''}
                    onChangeText={(text) => setEditData({ ...editData, bloodGroup: text })}
                    placeholder="e.g., O+, B-"
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
                    placeholder="Your address"
                    placeholderTextColor={colors.textTertiary}
                    multiline
                    numberOfLines={3}
                  />
                </View>
              </ScrollView>

              <View style={styles.modalFooter}>
                <TouchableOpacity
                  onPress={() => setEditMode(false)}
                  style={[styles.modalButton, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}
                >
                  <Text style={[styles.modalButtonText, { color: colors.text }]}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleSave}
                  style={styles.modalButtonPrimary}
                >
                  <LinearGradient
                    colors={['#6366F1', '#818CF8']}
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
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    marginBottom: 24,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  name: {
    fontSize: 22,
    fontFamily: 'Inter-Bold',
    marginBottom: 6,
  },
  info: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    marginVertical: 16,
  },
  infoGrid: {
    gap: 12,
  },
  infoItem: {
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 15,
    fontFamily: 'Inter-SemiBold',
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
