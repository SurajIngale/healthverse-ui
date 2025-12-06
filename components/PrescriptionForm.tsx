// components/EnhancedPrescriptionForm.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Modal,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { X, Plus, Minus, Save, Search, Clock, Utensils } from 'lucide-react-native';
import { darkTheme, lightTheme, useTheme } from '@/modules/shared/contexts/ThemeContext';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  timing: 'before_food' | 'after_food' | 'with_food' | 'anytime';
  notes: string;
}

interface MedicineSuggestion {
  id: string;
  name: string;
  commonDosages: string[];
  commonFrequencies: string[];
}

interface PrescriptionFormProps {
  patientName: string;
  patientId: string;
  onSave: (data: any) => void;
  onClose: () => void;
  isFullScreen?: boolean;
}

const medicineDatabase: MedicineSuggestion[] = [
  { id: '1', name: 'Metformin', commonDosages: ['500mg', '850mg', '1000mg'], commonFrequencies: ['Once daily', 'Twice daily'] },
  { id: '2', name: 'Lisinopril', commonDosages: ['5mg', '10mg', '20mg'], commonFrequencies: ['Once daily'] },
  { id: '3', name: 'Atorvastatin', commonDosages: ['10mg', '20mg', '40mg'], commonFrequencies: ['Once daily at bedtime'] },
  { id: '4', name: 'Amlodipine', commonDosages: ['5mg', '10mg'], commonFrequencies: ['Once daily'] },
  { id: '5', name: 'Aspirin', commonDosages: ['75mg', '100mg', '325mg'], commonFrequencies: ['Once daily'] },
  { id: '6', name: 'Ibuprofen', commonDosages: ['200mg', '400mg', '600mg'], commonFrequencies: ['Every 6 hours', 'Every 8 hours'] },
  { id: '7', name: 'Amoxicillin', commonDosages: ['250mg', '500mg'], commonFrequencies: ['Three times daily', 'Twice daily'] },
  { id: '8', name: 'Omeprazole', commonDosages: ['20mg', '40mg'], commonFrequencies: ['Once daily before food'] },
];

const frequencyOptions = [
  'Once daily',
  'Twice daily',
  'Three times daily',
  'Four times daily',
  'Every 6 hours',
  'Every 8 hours',
  'Every 12 hours',
  'Once daily at bedtime',
  'As needed',
];

const durationOptions = [
  '3 days',
  '5 days',
  '7 days',
  '10 days',
  '14 days',
  '21 days',
  '28 days',
  '30 days',
  'Until finished',
  'As directed',
];

const timingOptions = [
  { value: 'before_food', label: 'Before Food', icon: Utensils },
  { value: 'after_food', label: 'After Food', icon: Utensils },
  { value: 'with_food', label: 'With Food', icon: Utensils },
  { value: 'anytime', label: 'Anytime', icon: Clock },
];

export default function EnhancedPrescriptionForm({
  patientName,
  patientId,
  onSave,
  onClose,
  isFullScreen = false,
}: PrescriptionFormProps) {
  const { isDark } = useTheme();
  const colors = isDark ? darkTheme : lightTheme;

  const [tab, setTab] = useState<'diagnosis' | 'medicines' | 'notes'>('diagnosis');

  const [medications, setMedications] = useState<Medication[]>([
    {
      id: '1',
      name: '',
      dosage: '',
      frequency: '',
      duration: '',
      timing: 'anytime',
      notes: '',
    },
  ]);

  const [notes, setNotes] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [showMedicineSearch, setShowMedicineSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<MedicineSuggestion[]>([]);
  const [editingMedId, setEditingMedId] = useState<string | null>(null);


  useEffect(() => {
    if (searchQuery.trim()) {
      setSearchResults(
        medicineDatabase.filter((m) =>
          m.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const addMedication = () => {
    setMedications([
      ...medications,
      {
        id: Date.now().toString(),
        name: '',
        dosage: '',
        frequency: '',
        duration: '',
        timing: 'anytime',
        notes: '',
      },
    ]);
  };

  const removeMedication = (id: string) => {
    if (medications.length > 1) {
      setMedications(medications.filter((m) => m.id !== id));
    }
  };

  const updateMedication = (id: string, field: keyof Medication, value: string) => {
    setMedications((prev) =>
      prev.map((med) => (med.id === id ? { ...med, [field]: value } : med))
    );
  };

  const selectMedicine = (medicine: MedicineSuggestion) => {
    if (editingMedId) {
      updateMedication(editingMedId, 'name', medicine.name);
    }
    setEditingMedId(null);
    setSearchQuery('');
    setShowMedicineSearch(false);
  };

  const handleSave = () => {
    const prescriptionData = {
      patientId,
      patientName,
      diagnosis,
      medications: medications.filter((m) => m.name.trim()),
      notes,
      date: new Date().toISOString(),
    };
    onSave(prescriptionData);
  };

  const isValid = diagnosis.trim() && medications.some((m) => m.name.trim());

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDark ? 'rgba(15, 23, 42, 0.95)' : 'rgba(0,0,0,0.4)' },
      ]}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={[
          styles.sheet,
          { backgroundColor: colors.containerBg },
          isFullScreen && styles.fullScreenSheet
        ]}>
          {/* HEADER */}
          <View style={styles.header}>
            <View>
              <Text style={[styles.title, { color: colors.text }]}>
                Add Prescription
              </Text>
              <Text style={[styles.subtitle, { color: colors.textTertiary }]}>
                {patientName}
              </Text>
            </View>

            <TouchableOpacity
              onPress={onClose}
              style={[styles.closeButton, { backgroundColor: colors.cardBg }]}
            >
              <X size={22} color={colors.text} />
            </TouchableOpacity>
          </View>

          {/* FULL FORM (No tabs) */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ padding: 20 }}
          >
            {/* DIAGNOSIS */}
            <View>
              <Text style={[styles.label, { color: colors.textSecondary }]}>
                Diagnosis
              </Text>
              <TextInput
                style={[
                  styles.textInput,
                  {
                    backgroundColor: colors.cardBg,
                    borderColor: colors.cardBorder,
                    color: colors.text,
                  },
                ]}
                multiline
                value={diagnosis}
                onChangeText={setDiagnosis}
                placeholder="Enter diagnosis..."
                placeholderTextColor={colors.textTertiary}
              />
            </View>

            {/* MEDICATIONS */}
            <View style={{ marginTop: 20 }}>
              <View style={styles.medHeader}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>
                  Medications
                </Text>

                <TouchableOpacity
                  onPress={addMedication}
                  style={[styles.addButton, { backgroundColor: colors.accentLight }]}
                >
                  <Plus size={16} color={colors.accent} />
                  <Text style={[styles.addBtnText, { color: colors.accent }]}>
                    Add
                  </Text>
                </TouchableOpacity>
              </View>

              {medications.map((med, index) => (
                <View
                  key={med.id}
                  style={[
                    styles.compactMedCard,
                    {
                      backgroundColor: colors.cardBg,
                      borderColor: colors.cardBorder,
                    },
                  ]}
                >
                  {/* title row */}
                  <View style={styles.medCardHeader}>
                    <Text
                      style={[styles.medTitle, { color: colors.textSecondary }]}
                    >
                      Medicine {index + 1}
                    </Text>

                    {medications.length > 1 && (
                      <TouchableOpacity
                        style={styles.removeBtn}
                        onPress={() => removeMedication(med.id)}
                      >
                        <Minus size={14} color="#ef4444" />
                      </TouchableOpacity>
                    )}
                  </View>

                  {/* SEARCH MED */}
                  <TouchableOpacity
                    onPress={() => {
                      setEditingMedId(med.id);
                      setShowMedicineSearch(true);
                    }}
                    style={[
                      styles.searchField,
                      {
                        backgroundColor: colors.containerBg,
                        borderColor: colors.cardBorder,
                      },
                    ]}
                  >
                    <Text
                      style={{
                        color: med.name ? colors.text : colors.textTertiary,
                        fontSize: 14,
                      }}
                    >
                      {med.name || 'Search medicine'}
                    </Text>
                    <Search size={18} color={colors.textSecondary} />
                  </TouchableOpacity>

                  {/* DOSAGE */}
                  <Text style={[styles.smallLabel, { color: colors.textTertiary }]}>
                    Dosage
                  </Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {(medicineDatabase.find((m) => m.name === med.name)
                      ?.commonDosages || []
                    ).map((d) => (
                      <TouchableOpacity
                        key={d}
                        style={[
                          styles.chip,
                          {
                            borderColor:
                              med.dosage === d ? colors.accent : colors.cardBorder,
                            backgroundColor:
                              med.dosage === d
                                ? colors.accentLight
                                : colors.containerBg,
                          },
                        ]}
                        onPress={() => updateMedication(med.id, 'dosage', d)}
                      >
                        <Text
                          style={{
                            color: med.dosage === d ? colors.accent : colors.text,
                          }}
                        >
                          {d}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>

                  <TextInput
                    style={[
                      styles.smallInput,
                      {
                        borderColor: colors.cardBorder,
                        backgroundColor: colors.containerBg,
                        color: colors.text,
                      },
                    ]}
                    placeholder="Enter dosage"
                    placeholderTextColor={colors.textTertiary}
                    value={med.dosage}
                    onChangeText={(t) => updateMedication(med.id, 'dosage', t)}
                  />

                  {/* FREQUENCY */}
                  <Text style={[styles.smallLabel, { color: colors.textTertiary }]}>
                    Frequency
                  </Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {frequencyOptions.map((f) => (
                      <TouchableOpacity
                        key={f}
                        style={[
                          styles.chip,
                          {
                            borderColor:
                              med.frequency === f
                                ? colors.accent
                                : colors.cardBorder,
                            backgroundColor:
                              med.frequency === f
                                ? colors.accentLight
                                : colors.containerBg,
                          },
                        ]}
                        onPress={() => updateMedication(med.id, 'frequency', f)}
                      >
                        <Text
                          style={{
                            color:
                              med.frequency === f ? colors.accent : colors.text,
                          }}
                        >
                          {f}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>

                  <TextInput
                    style={[
                      styles.smallInput,
                      {
                        borderColor: colors.cardBorder,
                        backgroundColor: colors.containerBg,
                        color: colors.text,
                      },
                    ]}
                    placeholder="Enter frequency"
                    placeholderTextColor={colors.textTertiary}
                    value={med.frequency}
                    onChangeText={(t) =>
                      updateMedication(med.id, 'frequency', t)
                    }
                  />

                  {/* DURATION */}
                  <Text style={[styles.smallLabel, { color: colors.textTertiary }]}>
                    Duration
                  </Text>

                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {durationOptions.map((d) => (
                      <TouchableOpacity
                        key={d}
                        style={[
                          styles.chip,
                          {
                            borderColor:
                              med.duration === d ? colors.accent : colors.cardBorder,
                            backgroundColor:
                              med.duration === d
                                ? colors.accentLight
                                : colors.containerBg,
                          },
                        ]}
                        onPress={() => updateMedication(med.id, 'duration', d)}
                      >
                        <Text
                          style={{
                            color:
                              med.duration === d ? colors.accent : colors.text,
                          }}
                        >
                          {d}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>

                  <TextInput
                    style={[
                      styles.smallInput,
                      {
                        borderColor: colors.cardBorder,
                        backgroundColor: colors.containerBg,
                        color: colors.text,
                      },
                    ]}
                    placeholder="Enter duration"
                    placeholderTextColor={colors.textTertiary}
                    value={med.duration}
                    onChangeText={(t) =>
                      updateMedication(med.id, 'duration', t)
                    }
                  />

                  {/* TIMING */}
                  <Text style={[styles.smallLabel, { color: colors.textTertiary }]}>
                    Timing
                  </Text>
                  <View style={styles.timingRow}>
                    {timingOptions.map((t) => {
                      const Icon = t.icon;
                      const selected = med.timing === t.value;
                      return (
                        <TouchableOpacity
                          key={t.value}
                          style={[
                            styles.timingChip,
                            {
                              backgroundColor: selected
                                ? colors.accent
                                : colors.containerBg,
                              borderColor: selected
                                ? colors.accent
                                : colors.cardBorder,
                            },
                          ]}
                          onPress={() => updateMedication(med.id, 'timing', t.value)}
                        >
                          <Icon size={14} color={selected ? '#fff' : colors.text} />
                          <Text
                            style={{
                              color: selected ? '#fff' : colors.text,
                              fontSize: 11,
                            }}
                          >
                            {t.label}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>

                  {/* NOTES */}
                  <TextInput
                    style={[
                      styles.smallInput,
                      {
                        height: 60,
                        borderColor: colors.cardBorder,
                        backgroundColor: colors.containerBg,
                        color: colors.text,
                      },
                    ]}
                    placeholder="Notes"
                    placeholderTextColor={colors.textTertiary}
                    value={med.notes}
                    multiline
                    onChangeText={(t) => updateMedication(med.id, 'notes', t)}
                  />
                </View>
              ))}
            </View>

            {/* ADDITIONAL NOTES */}
            <View style={{ marginTop: 20 }}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>
                Additional Notes
              </Text>
              <TextInput
                style={[
                  styles.textInput,
                  {
                    backgroundColor: colors.cardBg,
                    borderColor: colors.cardBorder,
                    minHeight: 120,
                    color: colors.text,
                  },
                ]}
                multiline
                value={notes}
                onChangeText={setNotes}
                placeholder="Any extra instructions"
                placeholderTextColor={colors.textTertiary}
              />
            </View>

            <View style={{ height: 100 }} />
          </ScrollView>

          {/* FOOTER */}
          <View style={styles.footer}>
            <TouchableOpacity
              disabled={!isValid}
              onPress={handleSave}
              style={styles.saveButton}
            >
              <LinearGradient
                colors={isValid ? ['#10b981', '#059669'] : ['#64748b', '#475569']}
                style={styles.saveButtonInner}
              >
                <Save size={18} color="#fff" />
                <Text style={styles.saveBtnText}>Save Prescription</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>

      {/* SEARCH MODAL */}
      <Modal
        visible={showMedicineSearch}
        transparent
        animationType="fade"
        onRequestClose={() => setShowMedicineSearch(false)}
      >
        <View
          style={[
            styles.modalOverlay,
            {
              backgroundColor: isDark
                ? 'rgba(15,23,42,0.9)'
                : 'rgba(0,0,0,0.4)',
            },
          ]}
        >
          <View
            style={[
              styles.searchModal,
              { backgroundColor: colors.containerBg },
            ]}
          >
            <View style={styles.searchHeader}>
              <Text
                style={[
                  styles.searchTitle,
                  { color: colors.text },
                ]}
              >
                Search Medicine
              </Text>

              <TouchableOpacity onPress={() => setShowMedicineSearch(false)}>
                <X size={22} color={colors.text} />
              </TouchableOpacity>
            </View>

            <View
              style={[
                styles.searchBar,
                {
                  backgroundColor: colors.cardBg,
                  borderColor: colors.cardBorder,
                },
              ]}
            >
              <Search size={18} color={colors.textSecondary} />
              <TextInput
                style={[styles.searchInput, { color: colors.text }]}
                placeholder="Search medicine..."
                placeholderTextColor={colors.textTertiary}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>

            <FlatList
              data={searchResults}
              keyExtractor={(item) => item.id}
              ListEmptyComponent={
                <Text
                  style={{
                    textAlign: 'center',
                    padding: 20,
                    color: colors.textTertiary,
                  }}
                >
                  {searchQuery
                    ? 'No results found'
                    : 'Type to search'}
                </Text>
              }
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.searchItem,
                    { borderColor: colors.cardBorder },
                  ]}
                  onPress={() => selectMedicine(item)}
                >
                  <Text
                    style={{
                      fontSize: 15,
                      color: colors.text,
                      marginBottom: 4,
                    }}
                  >
                    {item.name}
                  </Text>

                  <Text
                    style={{
                      fontSize: 12,
                      color: colors.textTertiary,
                    }}
                  >
                    {item.commonDosages.join(', ')}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },

  sheet: {
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    maxHeight: '92%',
    overflow: 'hidden',
  },
  fullScreenSheet: {
    maxHeight: '100%',
    flex: 1,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },

  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(100,116,139,0.2)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  title: { fontSize: 20, fontFamily: 'Inter-Bold' },
  subtitle: { fontSize: 13, marginTop: 2 },

  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* TABS */
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 14,
    gap: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 13,
    fontFamily: 'Inter-SemiBold',
  },

  /* FORM FIELDS */
  label: { fontSize: 14, marginBottom: 8, fontFamily: 'Inter-SemiBold' },
  smallLabel: { fontSize: 12, marginBottom: 6, fontFamily: 'Inter-Medium' },
  textInput: {
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 15,
    fontFamily: 'Inter-Regular',
  },

  /* MED CARD */
  medHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 4,
  },
  addBtnText: {
    fontSize: 13,
    fontFamily: 'Inter-SemiBold',
  },

  medCard: {
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 14,
  },

  medCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },

  medTitle: { fontSize: 14, fontFamily: 'Inter-SemiBold' },

  removeBtn: {
    backgroundColor: 'rgba(239,68,68,0.12)',
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  searchField: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  smallInput: {
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 12,
    fontSize: 13,
    fontFamily: 'Inter-Regular',
  },

  compactMedCard: {
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    marginBottom: 14,
  },

  chip: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    marginRight: 6,
  },

  timingRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },

  timingChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
  },

  /* FOOTER */
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(100,116,139,0.2)',
  },
  saveButton: { borderRadius: 12, overflow: 'hidden' },
  saveButtonInner: {
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 15,
    fontFamily: 'Inter-SemiBold',
  },

  /* MODAL */
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    padding: 18,
  },
  searchModal: {
    width: '100%',
    maxHeight: '80%',
    borderRadius: 18,
    overflow: 'hidden',
  },
  searchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(100,116,139,0.15)',
  },
  searchTitle: { fontSize: 17, fontFamily: 'Inter-Bold' },

  searchBar: {
    margin: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  searchInput: { flex: 1, fontSize: 15 },

  searchItem: {
    padding: 16,
    borderBottomWidth: 1,
  },
});
