import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { X, Plus, Minus, Save } from 'lucide-react-native';
import { useTheme, lightTheme, darkTheme } from '../contexts/ThemeContext';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

interface PrescriptionFormProps {
  patientName: string;
  patientId: string;
  onSave: (data: any) => void;
  onClose: () => void;
}

export default function PrescriptionForm({ patientName, patientId, onSave, onClose }: PrescriptionFormProps) {
  const { isDark } = useTheme();
  const colors = isDark ? darkTheme : lightTheme;

  const [medications, setMedications] = useState<Medication[]>([
    { id: '1', name: '', dosage: '', frequency: '', duration: '' },
  ]);
  const [notes, setNotes] = useState('');
  const [diagnosis, setDiagnosis] = useState('');

  const addMedication = () => {
    const newMed: Medication = {
      id: Date.now().toString(),
      name: '',
      dosage: '',
      frequency: '',
      duration: '',
    };
    setMedications([...medications, newMed]);
  };

  const removeMedication = (id: string) => {
    if (medications.length > 1) {
      setMedications(medications.filter(med => med.id !== id));
    }
  };

  const updateMedication = (id: string, field: keyof Medication, value: string) => {
    setMedications(medications.map(med =>
      med.id === id ? { ...med, [field]: value } : med
    ));
  };

  const handleSave = () => {
    const prescriptionData = {
      patientId,
      patientName,
      diagnosis,
      medications: medications.filter(med => med.name.trim()),
      notes,
      date: new Date().toISOString(),
    };
    onSave(prescriptionData);
  };

  const isValid = diagnosis.trim() && medications.some(med => med.name.trim());

  return (
    <View style={[styles.container, { backgroundColor: isDark ? 'rgba(15, 23, 42, 0.95)' : 'rgba(0, 0, 0, 0.5)' }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={[styles.content, { backgroundColor: colors.containerBg }]}>
          <View style={styles.header}>
            <View>
              <Text style={[styles.title, { color: colors.text }]}>Add Prescription</Text>
              <Text style={[styles.subtitle, { color: colors.textTertiary }]}>{patientName}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={[styles.closeButton, { backgroundColor: colors.cardBg }]}>
              <X size={24} color={colors.text} strokeWidth={2} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
            <View style={styles.field}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>Diagnosis</Text>
              <TextInput
                style={[styles.input, { color: colors.text, backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}
                value={diagnosis}
                onChangeText={setDiagnosis}
                placeholder="e.g., Hypertension"
                placeholderTextColor={colors.textTertiary}
                multiline
              />
            </View>

            <View style={styles.medicationsSection}>
              <View style={styles.medicationsHeader}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>Medications</Text>
                <TouchableOpacity onPress={addMedication} style={[styles.addButton, { backgroundColor: colors.accentLight }]}>
                  <Plus size={18} color={colors.accent} strokeWidth={2} />
                  <Text style={[styles.addButtonText, { color: colors.accent }]}>Add</Text>
                </TouchableOpacity>
              </View>

              {medications.map((med, index) => (
                <View
                  key={med.id}
                  style={[styles.medicationCard, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}
                >
                  <View style={styles.medicationHeader}>
                    <Text style={[styles.medicationNumber, { color: colors.text }]}>Medicine {index + 1}</Text>
                    {medications.length > 1 && (
                      <TouchableOpacity onPress={() => removeMedication(med.id)} style={styles.removeButton}>
                        <Minus size={18} color="#ef4444" strokeWidth={2} />
                      </TouchableOpacity>
                    )}
                  </View>

                  <TextInput
                    style={[styles.medInput, { color: colors.text, backgroundColor: colors.containerBg, borderColor: colors.cardBorder }]}
                    value={med.name}
                    onChangeText={(text) => updateMedication(med.id, 'name', text)}
                    placeholder="Medicine name"
                    placeholderTextColor={colors.textTertiary}
                  />

                  <View style={styles.medRow}>
                    <View style={styles.medCol}>
                      <Text style={[styles.medLabel, { color: colors.textTertiary }]}>Dosage</Text>
                      <TextInput
                        style={[styles.medInput, { color: colors.text, backgroundColor: colors.containerBg, borderColor: colors.cardBorder }]}
                        value={med.dosage}
                        onChangeText={(text) => updateMedication(med.id, 'dosage', text)}
                        placeholder="5mg"
                        placeholderTextColor={colors.textTertiary}
                      />
                    </View>

                    <View style={styles.medCol}>
                      <Text style={[styles.medLabel, { color: colors.textTertiary }]}>Frequency</Text>
                      <TextInput
                        style={[styles.medInput, { color: colors.text, backgroundColor: colors.containerBg, borderColor: colors.cardBorder }]}
                        value={med.frequency}
                        onChangeText={(text) => updateMedication(med.id, 'frequency', text)}
                        placeholder="Twice daily"
                        placeholderTextColor={colors.textTertiary}
                      />
                    </View>
                  </View>

                  <Text style={[styles.medLabel, { color: colors.textTertiary }]}>Duration</Text>
                  <TextInput
                    style={[styles.medInput, { color: colors.text, backgroundColor: colors.containerBg, borderColor: colors.cardBorder }]}
                    value={med.duration}
                    onChangeText={(text) => updateMedication(med.id, 'duration', text)}
                    placeholder="7 days"
                    placeholderTextColor={colors.textTertiary}
                  />
                </View>
              ))}
            </View>

            <View style={styles.field}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>Additional Notes</Text>
              <TextInput
                style={[styles.input, styles.textArea, { color: colors.text, backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}
                value={notes}
                onChangeText={setNotes}
                placeholder="Any additional instructions for the patient"
                placeholderTextColor={colors.textTertiary}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              onPress={handleSave}
              disabled={!isValid}
              style={[styles.saveButton, !isValid && styles.saveButtonDisabled]}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={isValid ? ['#10b981', '#059669'] : ['#334155', '#1e293b']}
                style={styles.saveButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Save size={20} color="#ffffff" strokeWidth={2} />
                <Text style={styles.saveButtonText}>Save Prescription</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  keyboardView: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  content: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(99, 102, 241, 0.1)',
  },
  title: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
  },
  subtitle: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    marginTop: 2,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  form: {
    padding: 20,
  },
  field: {
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 8,
  },
  input: {
    fontSize: 15,
    fontFamily: 'Inter-Regular',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  textArea: {
    minHeight: 100,
  },
  medicationsSection: {
    marginBottom: 20,
  },
  medicationsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  addButtonText: {
    fontSize: 13,
    fontFamily: 'Inter-SemiBold',
  },
  medicationCard: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
  },
  medicationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  medicationNumber: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  removeButton: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  medInput: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 8,
  },
  medRow: {
    flexDirection: 'row',
    gap: 8,
  },
  medCol: {
    flex: 1,
  },
  medLabel: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    marginBottom: 6,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(99, 102, 241, 0.1)',
  },
  saveButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 8,
  },
  saveButtonText: {
    fontSize: 15,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
});
