import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Modal, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { Edit2, X, Check, User, Calendar, Droplet, Phone, Mail, MapPin } from 'lucide-react-native';
import { useTheme, lightTheme, darkTheme } from '@/modules/shared/contexts/ThemeContext';

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
              <Text style={[styles.name, { color: colors.text }]}>{data.name}</Text>
              <Text style={[styles.subtitle, { color: colors.textTertiary }]}>{age} years • {data.gender}</Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => {
              setEditData(data);
              setEditMode(true);
            }}
            style={[styles.editButton, { backgroundColor: colors.accentLight }]}
          >
            <Edit2 size={18} color={colors.accent} strokeWidth={2} />
          </TouchableOpacity>
        </View>

        <View style={styles.infoGrid}>
          <View style={styles.infoRow}>
            <View style={[styles.iconBadge, { backgroundColor: colors.accentLight }]}>
              <Calendar size={16} color={colors.accent} strokeWidth={2} />
            </View>
            <View style={styles.infoContent}>
              <Text style={[styles.infoLabel, { color: colors.textTertiary }]}>Date of Birth</Text>
              <Text style={[styles.infoValue, { color: colors.text }]}>{data.dob}</Text>
            </View>
          </View>

          {data.bloodGroup && (
            <View style={styles.infoRow}>
              <View style={[styles.iconBadge, { backgroundColor: 'rgba(239, 68, 68, 0.1)' }]}>
                <Droplet size={16} color="#EF4444" strokeWidth={2} />
              </View>
              <View style={styles.infoContent}>
                <Text style={[styles.infoLabel, { color: colors.textTertiary }]}>Blood Group</Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>{data.bloodGroup}</Text>
              </View>
            </View>
          )}

          {data.phone && (
            <View style={styles.infoRow}>
              <View style={[styles.iconBadge, { backgroundColor: 'rgba(16, 185, 129, 0.1)' }]}>
                <Phone size={16} color="#10B981" strokeWidth={2} />
              </View>
              <View style={styles.infoContent}>
                <Text style={[styles.infoLabel, { color: colors.textTertiary }]}>Phone</Text>
                <Text style={[styles.infoValue, { color: colors.text }]}>{data.phone}</Text>
              </View>
            </View>
          )}

          {data.email && (
            <View style={styles.infoRow}>
              <View style={[styles.iconBadge, { backgroundColor: 'rgba(245, 158, 11, 0.1)' }]}>
                <Mail size={16} color="#F59E0B" strokeWidth={2} />
              </View>
              <View style={styles.infoContent}>
                <Text style={[styles.infoLabel, { color: colors.textTertiary }]}>Email</Text>
                <Text style={[styles.infoValue, { color: colors.text }]} numberOfLines={1}>{data.email}</Text>
              </View>
            </View>
          )}

          {data.address && (
            <View style={styles.infoRow}>
              <View style={[styles.iconBadge, { backgroundColor: colors.accentLight }]}>
                <MapPin size={16} color={colors.accent} strokeWidth={2} />
              </View>
              <View style={styles.infoContent}>
                <Text style={[styles.infoLabel, { color: colors.textTertiary }]}>Address</Text>
                <Text style={[styles.infoValue, { color: colors.text }]} numberOfLines={2}>{data.address}</Text>
              </View>
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
