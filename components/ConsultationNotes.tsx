// components/ConsultationNotes.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { X, Save, Stethoscope, AlertCircle, FileText, MessageCircle } from 'lucide-react-native';
import { darkTheme, lightTheme, useTheme } from '@/modules/shared/contexts/ThemeContext';

interface ConsultationNotesProps {
  patientName: string;
  patientId: string;
  onSave: (data: any) => void;
  onClose: () => void;
}

interface Vitals {
  bp: string;
  pulse: string;
  temp: string;
  spo2: string;
  weight: string;
  height: string;
}

const symptomsList = [
  'Fever', 'Headache', 'Cough', 'Fatigue', 'Nausea', 'Dizziness',
  'Chest Pain', 'Shortness of Breath', 'Abdominal Pain', 'Joint Pain',
  'Rash', 'Sore Throat', 'Runny Nose', 'Muscle Aches', 'Vomiting'
];

const diagnosisSuggestions = [
  'Hypertension', 'Type 2 Diabetes', 'Upper Respiratory Infection',
  'Migraine', 'Gastroenteritis', 'Bronchitis', 'Pneumonia',
  'Urinary Tract Infection', 'COVID-19', 'Influenza'
];

export default function ConsultationNotes({ patientName, patientId, onSave, onClose }: ConsultationNotesProps) {
  const { isDark } = useTheme();
  const colors = isDark ? darkTheme : lightTheme;

  const [chiefComplaint, setChiefComplaint] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [examinationFindings, setExaminationFindings] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [advice, setAdvice] = useState('');
  const [vitals, setVitals] = useState<Vitals>({
    bp: '',
    pulse: '',
    temp: '',
    spo2: '',
    weight: '',
    height: ''
  });

  const toggleSymptom = (symptom: string) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  const handleSave = () => {
    const consultationData = {
      patientId,
      patientName,
      chiefComplaint,
      symptoms: selectedSymptoms,
      examinationFindings,
      diagnosis,
      advice,
      vitals,
      date: new Date().toISOString(),
    };
    onSave(consultationData);
  };

  const isValid = chiefComplaint.trim() && diagnosis.trim();

  return (
    <View style={[styles.container, { backgroundColor: isDark ? 'rgba(15, 23, 42, 0.95)' : 'rgba(0, 0, 0, 0.5)' }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={[styles.content, { backgroundColor: colors.containerBg }]}>
          <View style={styles.header}>
            <View>
              <Text style={[styles.title, { color: colors.text }]}>Consultation Notes</Text>
              <Text style={[styles.subtitle, { color: colors.textTertiary }]}>{patientName}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={[styles.closeButton, { backgroundColor: colors.cardBg }]}>
              <X size={24} color={colors.text} strokeWidth={2} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
            {/* Chief Complaint */}
            <View style={styles.section}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>
                Chief Complaint <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, styles.textArea, { color: colors.text, backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}
                value={chiefComplaint}
                onChangeText={setChiefComplaint}
                placeholder="Describe the main reason for visit..."
                placeholderTextColor={colors.textTertiary}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>

            {/* Symptoms */}
            <View style={styles.section}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>Symptoms</Text>
              <View style={styles.chipsContainer}>
                {symptomsList.map((symptom, index) => {
                  const isSelected = selectedSymptoms.includes(symptom);
                  return (
                    <TouchableOpacity
                      key={index}
                      onPress={() => toggleSymptom(symptom)}
                      style={[
                        styles.symptomChip,
                        { backgroundColor: colors.cardBg, borderColor: colors.cardBorder },
                        isSelected && styles.symptomChipSelected,
                      ]}
                      activeOpacity={0.7}
                    >
                      <Text style={[
                        styles.symptomChipText,
                        { color: colors.text },
                        isSelected && styles.symptomChipTextSelected,
                      ]}>
                        {symptom}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Vitals */}
            <View style={styles.section}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>Vital Signs</Text>
              <View style={styles.vitalsGrid}>
                <View style={styles.vitalInput}>
                  <Text style={[styles.vitalLabel, { color: colors.textTertiary }]}>BP (mmHg)</Text>
                  <TextInput
                    style={[styles.vitalInputField, { color: colors.text, backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}
                    value={vitals.bp}
                    onChangeText={(text) => setVitals({...vitals, bp: text})}
                    placeholder="120/80"
                    placeholderTextColor={colors.textTertiary}
                  />
                </View>
                <View style={styles.vitalInput}>
                  <Text style={[styles.vitalLabel, { color: colors.textTertiary }]}>Pulse (bpm)</Text>
                  <TextInput
                    style={[styles.vitalInputField, { color: colors.text, backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}
                    value={vitals.pulse}
                    onChangeText={(text) => setVitals({...vitals, pulse: text})}
                    placeholder="72"
                    placeholderTextColor={colors.textTertiary}
                    keyboardType="numeric"
                  />
                </View>
                <View style={styles.vitalInput}>
                  <Text style={[styles.vitalLabel, { color: colors.textTertiary }]}>Temp (°C)</Text>
                  <TextInput
                    style={[styles.vitalInputField, { color: colors.text, backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}
                    value={vitals.temp}
                    onChangeText={(text) => setVitals({...vitals, temp: text})}
                    placeholder="37.0"
                    placeholderTextColor={colors.textTertiary}
                    keyboardType="numeric"
                  />
                </View>
                <View style={styles.vitalInput}>
                  <Text style={[styles.vitalLabel, { color: colors.textTertiary }]}>SpO2 (%)</Text>
                  <TextInput
                    style={[styles.vitalInputField, { color: colors.text, backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}
                    value={vitals.spo2}
                    onChangeText={(text) => setVitals({...vitals, spo2: text})}
                    placeholder="98"
                    placeholderTextColor={colors.textTertiary}
                    keyboardType="numeric"
                  />
                </View>
                <View style={styles.vitalInput}>
                  <Text style={[styles.vitalLabel, { color: colors.textTertiary }]}>Weight (kg)</Text>
                  <TextInput
                    style={[styles.vitalInputField, { color: colors.text, backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}
                    value={vitals.weight}
                    onChangeText={(text) => setVitals({...vitals, weight: text})}
                    placeholder="70"
                    placeholderTextColor={colors.textTertiary}
                    keyboardType="numeric"
                  />
                </View>
                <View style={styles.vitalInput}>
                  <Text style={[styles.vitalLabel, { color: colors.textTertiary }]}>Height (cm)</Text>
                  <TextInput
                    style={[styles.vitalInputField, { color: colors.text, backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}
                    value={vitals.height}
                    onChangeText={(text) => setVitals({...vitals, height: text})}
                    placeholder="175"
                    placeholderTextColor={colors.textTertiary}
                    keyboardType="numeric"
                  />
                </View>
              </View>
            </View>

            {/* Examination Findings */}
            <View style={styles.section}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>Examination Findings</Text>
              <TextInput
                style={[styles.input, styles.textArea, { color: colors.text, backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}
                value={examinationFindings}
                onChangeText={setExaminationFindings}
                placeholder="Physical examination findings..."
                placeholderTextColor={colors.textTertiary}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            {/* Diagnosis */}
            <View style={styles.section}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>
                Diagnosis <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, { color: colors.text, backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}
                value={diagnosis}
                onChangeText={setDiagnosis}
                placeholder="Enter diagnosis..."
                placeholderTextColor={colors.textTertiary}
              />
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.diagnosisSuggestions}>
                {diagnosisSuggestions.map((diag, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => setDiagnosis(diag)}
                    style={[styles.diagnosisChip, { backgroundColor: colors.accentLight }]}
                  >
                    <Text style={[styles.diagnosisChipText, { color: colors.accent }]}>{diag}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Advice */}
            <View style={styles.section}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>Advice & Instructions</Text>
              <TextInput
                style={[styles.input, styles.textArea, { color: colors.text, backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}
                value={advice}
                onChangeText={setAdvice}
                placeholder="Patient advice and follow-up instructions..."
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
                colors={isValid ? ['#6366F1', '#4F46E5'] : ['#334155', '#1e293b']}
                style={styles.saveButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Save size={20} color="#ffffff" strokeWidth={2} />
                <Text style={styles.saveButtonText}>Save Consultation Notes</Text>
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
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 13,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 12,
  },
  required: {
    color: '#EF4444',
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
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  symptomChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  symptomChipSelected: {
    backgroundColor: '#6366F1',
    borderColor: '#6366F1',
  },
  symptomChipText: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
  },
  symptomChipTextSelected: {
    color: '#ffffff',
  },
  vitalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  vitalInput: {
    width: '48%',
  },
  vitalLabel: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    marginBottom: 6,
  },
  vitalInputField: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  diagnosisSuggestions: {
    marginTop: 8,
  },
  diagnosisChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  diagnosisChipText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
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