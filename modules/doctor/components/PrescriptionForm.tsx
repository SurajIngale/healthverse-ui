// // components/EnhancedPrescriptionForm.tsx
// import React, { useState, useEffect } from 'react';
// import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Modal, FlatList } from 'react-native';
// import { LinearGradient } from 'expo-linear-gradient';
// import { X, Plus, Minus, Save, Search, Clock, Utensils } from 'lucide-react-native';
// import { darkTheme, lightTheme, useTheme } from '@/modules/shared/contexts/ThemeContext';

// interface Medication {
//   id: string;
//   name: string;
//   dosage: string;
//   frequency: string;
//   duration: string;
//   timing: 'before_food' | 'after_food' | 'with_food' | 'anytime';
//   notes: string;
// }

// interface MedicineSuggestion {
//   id: string;
//   name: string;
//   commonDosages: string[];
//   commonFrequencies: string[];
// }

// interface PrescriptionFormProps {
//   patientName: string;
//   patientId: string;
//   onSave: (data: any) => void;
//   onClose: () => void;
// }

// const medicineDatabase: MedicineSuggestion[] = [
//   { id: '1', name: 'Metformin', commonDosages: ['500mg', '850mg', '1000mg'], commonFrequencies: ['Once daily', 'Twice daily'] },
//   { id: '2', name: 'Lisinopril', commonDosages: ['5mg', '10mg', '20mg'], commonFrequencies: ['Once daily'] },
//   { id: '3', name: 'Atorvastatin', commonDosages: ['10mg', '20mg', '40mg'], commonFrequencies: ['Once daily at bedtime'] },
//   { id: '4', name: 'Amlodipine', commonDosages: ['5mg', '10mg'], commonFrequencies: ['Once daily'] },
//   { id: '5', name: 'Aspirin', commonDosages: ['75mg', '100mg', '325mg'], commonFrequencies: ['Once daily'] },
//   { id: '6', name: 'Ibuprofen', commonDosages: ['200mg', '400mg', '600mg'], commonFrequencies: ['Every 6 hours', 'Every 8 hours'] },
//   { id: '7', name: 'Amoxicillin', commonDosages: ['250mg', '500mg'], commonFrequencies: ['Three times daily', 'Twice daily'] },
//   { id: '8', name: 'Omeprazole', commonDosages: ['20mg', '40mg'], commonFrequencies: ['Once daily before food'] },
// ];

// const frequencyOptions = [
//   'Once daily', 'Twice daily', 'Three times daily', 'Four times daily',
//   'Every 6 hours', 'Every 8 hours', 'Every 12 hours', 'Once daily at bedtime',
//   'As needed'
// ];

// const durationOptions = [
//   '3 days', '5 days', '7 days', '10 days', '14 days', '21 days', '28 days',
//   '30 days', 'Until finished', 'As directed'
// ];

// const timingOptions = [
//   { value: 'before_food', label: 'Before Food', icon: Utensils },
//   { value: 'after_food', label: 'After Food', icon: Utensils },
//   { value: 'with_food', label: 'With Food', icon: Utensils },
//   { value: 'anytime', label: 'Anytime', icon: Clock },
// ];

// export default function EnhancedPrescriptionForm({ patientName, patientId, onSave, onClose }: PrescriptionFormProps) {
//   const { isDark } = useTheme();
//   const colors = isDark ? darkTheme : lightTheme;

//   const [medications, setMedications] = useState<Medication[]>([
//     { id: '1', name: '', dosage: '', frequency: '', duration: '', timing: 'anytime', notes: '' },
//   ]);
//   const [notes, setNotes] = useState('');
//   const [diagnosis, setDiagnosis] = useState('');
//   const [showMedicineSearch, setShowMedicineSearch] = useState(false);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [searchResults, setSearchResults] = useState<MedicineSuggestion[]>([]);
//   const [editingMedId, setEditingMedId] = useState<string | null>(null);

//   useEffect(() => {
//     if (searchQuery.trim()) {
//       const results = medicineDatabase.filter(med =>
//         med.name.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//       setSearchResults(results);
//     } else {
//       setSearchResults([]);
//     }
//   }, [searchQuery]);

//   const addMedication = () => {
//     const newMed: Medication = {
//       id: Date.now().toString(),
//       name: '',
//       dosage: '',
//       frequency: '',
//       duration: '',
//       timing: 'anytime',
//       notes: '',
//     };
//     setMedications([...medications, newMed]);
//   };

//   const removeMedication = (id: string) => {
//     if (medications.length > 1) {
//       setMedications(medications.filter(med => med.id !== id));
//     }
//   };

//   const updateMedication = (id: string, field: keyof Medication, value: string) => {
//     setMedications(medications.map(med =>
//       med.id === id ? { ...med, [field]: value } : med
//     ));
//   };

//   const selectMedicine = (medicine: MedicineSuggestion) => {
//     if (editingMedId) {
//       setMedications(medications.map(med =>
//         med.id === editingMedId ? { ...med, name: medicine.name } : med
//       ));
//     }
//     setShowMedicineSearch(false);
//     setSearchQuery('');
//     setEditingMedId(null);
//   };

//   const handleSave = () => {
//     const prescriptionData = {
//       patientId,
//       patientName,
//       diagnosis,
//       medications: medications.filter(med => med.name.trim()),
//       notes,
//       date: new Date().toISOString(),
//     };
//     onSave(prescriptionData);
//   };

//   const isValid = diagnosis.trim() && medications.some(med => med.name.trim());

//   return (
//     <View style={[styles.container, { backgroundColor: isDark ? 'rgba(15, 23, 42, 0.95)' : 'rgba(0, 0, 0, 0.5)' }]}>
//       <KeyboardAvoidingView
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         style={styles.keyboardView}
//       >
//         <View style={[styles.content, { backgroundColor: colors.containerBg }]}>
//           <View style={styles.header}>
//             <View>
//               <Text style={[styles.title, { color: colors.text }]}>Add Prescription</Text>
//               <Text style={[styles.subtitle, { color: colors.textTertiary }]}>{patientName}</Text>
//             </View>
//             <TouchableOpacity onPress={onClose} style={[styles.closeButton, { backgroundColor: colors.cardBg }]}>
//               <X size={24} color={colors.text} strokeWidth={2} />
//             </TouchableOpacity>
//           </View>

//           <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
//             <View style={styles.field}>
//               <Text style={[styles.label, { color: colors.textSecondary }]}>Diagnosis</Text>
//               <TextInput
//                 style={[styles.input, { color: colors.text, backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}
//                 value={diagnosis}
//                 onChangeText={setDiagnosis}
//                 placeholder="e.g., Hypertension"
//                 placeholderTextColor={colors.textTertiary}
//                 multiline
//               />
//             </View>

//             <View style={styles.medicationsSection}>
//               <View style={styles.medicationsHeader}>
//                 <Text style={[styles.label, { color: colors.textSecondary }]}>Medications</Text>
//                 <TouchableOpacity onPress={addMedication} style={[styles.addButton, { backgroundColor: colors.accentLight }]}>
//                   <Plus size={18} color={colors.accent} strokeWidth={2} />
//                   <Text style={[styles.addButtonText, { color: colors.accent }]}>Add</Text>
//                 </TouchableOpacity>
//               </View>

//               {medications.map((med, index) => (
//                 <View
//                   key={med.id}
//                   style={[styles.medicationCard, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}
//                 >
//                   <View style={styles.medicationHeader}>
//                     <Text style={[styles.medicationNumber, { color: colors.text }]}>Medicine {index + 1}</Text>
//                     {medications.length > 1 && (
//                       <TouchableOpacity onPress={() => removeMedication(med.id)} style={styles.removeButton}>
//                         <Minus size={18} color="#ef4444" strokeWidth={2} />
//                       </TouchableOpacity>
//                     )}
//                   </View>

//                   {/* Medicine Search */}
//                   <TouchableOpacity
//                     onPress={() => {
//                       setEditingMedId(med.id);
//                       setShowMedicineSearch(true);
//                     }}
//                     style={[styles.medicineSearchTrigger, { backgroundColor: colors.containerBg, borderColor: colors.cardBorder }]}
//                   >
//                     <Text style={[styles.medicineName, { color: med.name ? colors.text : colors.textTertiary }]}>
//                       {med.name || 'Search for medicine...'}
//                     </Text>
//                     <Search size={18} color={colors.textSecondary} />
//                   </TouchableOpacity>

//                   <View style={styles.medRow}>
//                     <View style={styles.medCol}>
//                       <Text style={[styles.medLabel, { color: colors.textTertiary }]}>Dosage</Text>
//                       <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dosageOptions}>
//                         {medicineDatabase.find(m => m.name === med.name)?.commonDosages.map((dosage, idx) => (
//                           <TouchableOpacity
//                             key={idx}
//                             onPress={() => updateMedication(med.id, 'dosage', dosage)}
//                             style={[styles.optionChip, { backgroundColor: colors.containerBg }]}
//                           >
//                             <Text style={[styles.optionChipText, { color: colors.text }]}>{dosage}</Text>
//                           </TouchableOpacity>
//                         ))}
//                       </ScrollView>
//                       <TextInput
//                         style={[styles.medInput, { color: colors.text, backgroundColor: colors.containerBg, borderColor: colors.cardBorder }]}
//                         value={med.dosage}
//                         onChangeText={(text) => updateMedication(med.id, 'dosage', text)}
//                         placeholder="Enter dosage"
//                         placeholderTextColor={colors.textTertiary}
//                       />
//                     </View>

//                     <View style={styles.medCol}>
//                       <Text style={[styles.medLabel, { color: colors.textTertiary }]}>Frequency</Text>
//                       <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.frequencyOptions}>
//                         {frequencyOptions.map((freq, idx) => (
//                           <TouchableOpacity
//                             key={idx}
//                             onPress={() => updateMedication(med.id, 'frequency', freq)}
//                             style={[styles.optionChip, { backgroundColor: colors.containerBg }]}
//                           >
//                             <Text style={[styles.optionChipText, { color: colors.text }]}>{freq}</Text>
//                           </TouchableOpacity>
//                         ))}
//                       </ScrollView>
//                       <TextInput
//                         style={[styles.medInput, { color: colors.text, backgroundColor: colors.containerBg, borderColor: colors.cardBorder }]}
//                         value={med.frequency}
//                         onChangeText={(text) => updateMedication(med.id, 'frequency', text)}
//                         placeholder="Enter frequency"
//                         placeholderTextColor={colors.textTertiary}
//                       />
//                     </View>
//                   </View>

//                   <View style={styles.medRow}>
//                     <View style={styles.medCol}>
//                       <Text style={[styles.medLabel, { color: colors.textTertiary }]}>Duration</Text>
//                       <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.durationOptions}>
//                         {durationOptions.map((dur, idx) => (
//                           <TouchableOpacity
//                             key={idx}
//                             onPress={() => updateMedication(med.id, 'duration', dur)}
//                             style={[styles.optionChip, { backgroundColor: colors.containerBg }]}
//                           >
//                             <Text style={[styles.optionChipText, { color: colors.text }]}>{dur}</Text>
//                           </TouchableOpacity>
//                         ))}
//                       </ScrollView>
//                       <TextInput
//                         style={[styles.medInput, { color: colors.text, backgroundColor: colors.containerBg, borderColor: colors.cardBorder }]}
//                         value={med.duration}
//                         onChangeText={(text) => updateMedication(med.id, 'duration', text)}
//                         placeholder="Enter duration"
//                         placeholderTextColor={colors.textTertiary}
//                       />
//                     </View>

//                     <View style={styles.medCol}>
//                       <Text style={[styles.medLabel, { color: colors.textTertiary }]}>Timing</Text>
//                       <View style={styles.timingOptions}>
//                         {timingOptions.map((timing, idx) => {
//                           const Icon = timing.icon;
//                           const isSelected = med.timing === timing.value;
//                           return (
//                             <TouchableOpacity
//                               key={idx}
//                               onPress={() => updateMedication(med.id, 'timing', timing.value)}
//                               style={[
//                                 styles.timingOption,
//                                 { backgroundColor: colors.containerBg, borderColor: colors.cardBorder },
//                                 isSelected && styles.timingOptionSelected,
//                               ]}
//                             >
//                               <Icon size={14} color={isSelected ? '#ffffff' : colors.text} />
//                               <Text style={[
//                                 styles.timingOptionText,
//                                 { color: isSelected ? '#ffffff' : colors.text },
//                               ]}>
//                                 {timing.label}
//                               </Text>
//                             </TouchableOpacity>
//                           );
//                         })}
//                       </View>
//                     </View>
//                   </View>

//                   <Text style={[styles.medLabel, { color: colors.textTertiary }]}>Notes</Text>
//                   <TextInput
//                     style={[styles.medInput, styles.medNotes, { color: colors.text, backgroundColor: colors.containerBg, borderColor: colors.cardBorder }]}
//                     value={med.notes}
//                     onChangeText={(text) => updateMedication(med.id, 'notes', text)}
//                     placeholder="Additional instructions..."
//                     placeholderTextColor={colors.textTertiary}
//                     multiline
//                   />
//                 </View>
//               ))}
//             </View>

//             {/* Medication Preview */}
//             {medications.some(med => med.name.trim()) && (
//               <View style={[styles.previewSection, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
//                 <Text style={[styles.previewTitle, { color: colors.text }]}>Prescription Preview</Text>
//                 {medications.filter(med => med.name.trim()).map((med, index) => (
//                   <View key={med.id} style={styles.previewItem}>
//                     <Text style={[styles.previewMedName, { color: colors.text }]}>{med.name}</Text>
//                     <View style={styles.previewDetails}>
//                       <Text style={[styles.previewDetail, { color: colors.textSecondary }]}>
//                         {med.dosage} • {med.frequency} • {med.duration}
//                       </Text>
//                       {med.notes && (
//                         <Text style={[styles.previewNotes, { color: colors.textTertiary }]}>{med.notes}</Text>
//                       )}
//                     </View>
//                   </View>
//                 ))}
//               </View>
//             )}

//             <View style={styles.field}>
//               <Text style={[styles.label, { color: colors.textSecondary }]}>Additional Notes</Text>
//               <TextInput
//                 style={[styles.input, styles.textArea, { color: colors.text, backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}
//                 value={notes}
//                 onChangeText={setNotes}
//                 placeholder="Any additional instructions for the patient"
//                 placeholderTextColor={colors.textTertiary}
//                 multiline
//                 numberOfLines={4}
//                 textAlignVertical="top"
//               />
//             </View>
//           </ScrollView>

//           <View style={styles.footer}>
//             <TouchableOpacity
//               onPress={handleSave}
//               disabled={!isValid}
//               style={[styles.saveButton, !isValid && styles.saveButtonDisabled]}
//               activeOpacity={0.8}
//             >
//               <LinearGradient
//                 colors={isValid ? ['#10b981', '#059669'] : ['#334155', '#1e293b']}
//                 style={styles.saveButtonGradient}
//                 start={{ x: 0, y: 0 }}
//                 end={{ x: 1, y: 1 }}
//               >
//                 <Save size={20} color="#ffffff" strokeWidth={2} />
//                 <Text style={styles.saveButtonText}>Save Prescription</Text>
//               </LinearGradient>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </KeyboardAvoidingView>

//       {/* Medicine Search Modal */}
//       <Modal
//         visible={showMedicineSearch}
//         transparent
//         animationType="slide"
//         onRequestClose={() => setShowMedicineSearch(false)}
//       >
//         <View style={[styles.searchModal, { backgroundColor: isDark ? 'rgba(15, 23, 42, 0.95)' : 'rgba(0, 0, 0, 0.5)' }]}>
//           <View style={[styles.searchContent, { backgroundColor: colors.containerBg }]}>
//             <View style={styles.searchHeader}>
//               <Text style={[styles.searchTitle, { color: colors.text }]}>Search Medicine</Text>
//               <TouchableOpacity onPress={() => setShowMedicineSearch(false)}>
//                 <X size={24} color={colors.text} strokeWidth={2} />
//               </TouchableOpacity>
//             </View>

//             <View style={[styles.searchInputContainer, { backgroundColor: colors.cardBg }]}>
//               <Search size={20} color={colors.textSecondary} />
//               <TextInput
//                 style={[styles.searchInput, { color: colors.text }]}
//                 value={searchQuery}
//                 onChangeText={setSearchQuery}
//                 placeholder="Search for medicine..."
//                 placeholderTextColor={colors.textTertiary}
//                 autoFocus
//               />
//             </View>

//             <FlatList
//               data={searchResults}
//               keyExtractor={(item) => item.id}
//               renderItem={({ item }) => (
//                 <TouchableOpacity
//                   style={[styles.medicineItem, { backgroundColor: colors.cardBg }]}
//                   onPress={() => selectMedicine(item)}
//                 >
//                   <Text style={[styles.medicineItemName, { color: colors.text }]}>{item.name}</Text>
//                   <View style={styles.medicineDetails}>
//                     <Text style={[styles.medicineDetail, { color: colors.textTertiary }]}>
//                       Common dosages: {item.commonDosages.join(', ')}
//                     </Text>
//                   </View>
//                 </TouchableOpacity>
//               )}
//               ListEmptyComponent={
//                 <Text style={[styles.noResults, { color: colors.textTertiary }]}>
//                   {searchQuery ? 'No medicines found' : 'Start typing to search medicines'}
//                 </Text>
//               }
//             />
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'flex-end',
//   },
//   keyboardView: {
//     flex: 1,
//     justifyContent: 'flex-end',
//   },
//   content: {
//     borderTopLeftRadius: 28,
//     borderTopRightRadius: 28,
//     maxHeight: '90%',
//   },
//   header: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 20,
//     borderBottomWidth: 1,
//     borderBottomColor: 'rgba(99, 102, 241, 0.1)',
//   },
//   title: {
//     fontSize: 20,
//     fontFamily: 'Inter-Bold',
//   },
//   subtitle: {
//     fontSize: 13,
//     fontFamily: 'Inter-Regular',
//     marginTop: 2,
//   },
//   closeButton: {
//     width: 40,
//     height: 40,
//     borderRadius: 12,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   form: {
//     padding: 20,
//   },
//   field: {
//     marginBottom: 20,
//   },
//   label: {
//     fontSize: 13,
//     fontFamily: 'Inter-SemiBold',
//     marginBottom: 8,
//   },
//   input: {
//     fontSize: 15,
//     fontFamily: 'Inter-Regular',
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     borderRadius: 12,
//     borderWidth: 1,
//   },
//   textArea: {
//     minHeight: 100,
//   },
//   medicationsSection: {
//     marginBottom: 20,
//   },
//   medicationsHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 12,
//   },
//   addButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 12,
//     paddingVertical: 6,
//     borderRadius: 8,
//     gap: 4,
//   },
//   addButtonText: {
//     fontSize: 13,
//     fontFamily: 'Inter-SemiBold',
//   },
//   medicationCard: {
//     borderRadius: 12,
//     padding: 12,
//     marginBottom: 12,
//     borderWidth: 1,
//   },
//   medicationHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 10,
//   },
//   medicationNumber: {
//     fontSize: 14,
//     fontFamily: 'Inter-SemiBold',
//   },
//   removeButton: {
//     width: 28,
//     height: 28,
//     borderRadius: 8,
//     backgroundColor: 'rgba(239, 68, 68, 0.1)',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   medicineSearchTrigger: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//     borderRadius: 10,
//     borderWidth: 1,
//     marginBottom: 8,
//   },
//   medicineName: {
//     fontSize: 14,
//     fontFamily: 'Inter-Regular',
//   },
//   medInput: {
//     fontSize: 14,
//     fontFamily: 'Inter-Regular',
//     paddingHorizontal: 12,
//     paddingVertical: 10,
//     borderRadius: 10,
//     borderWidth: 1,
//     marginBottom: 8,
//   },
//   medNotes: {
//     minHeight: 60,
//     textAlignVertical: 'top',
//   },
//   medRow: {
//     flexDirection: 'row',
//     gap: 8,
//     marginBottom: 8,
//   },
//   medCol: {
//     flex: 1,
//   },
//   medLabel: {
//     fontSize: 11,
//     fontFamily: 'Inter-Medium',
//     marginBottom: 6,
//   },
//   dosageOptions: {
//     marginBottom: 4,
//   },
//   frequencyOptions: {
//     marginBottom: 4,
//   },
//   durationOptions: {
//     marginBottom: 4,
//   },
//   optionChip: {
//     paddingHorizontal: 10,
//     paddingVertical: 6,
//     borderRadius: 8,
//     marginRight: 6,
//     borderWidth: 1,
//     borderColor: 'rgba(99, 102, 241, 0.2)',
//   },
//   optionChipText: {
//     fontSize: 12,
//     fontFamily: 'Inter-Medium',
//   },
//   timingOptions: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: 6,
//   },
//   timingOption: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 10,
//     paddingVertical: 6,
//     borderRadius: 8,
//     borderWidth: 1,
//     gap: 4,
//   },
//   timingOptionSelected: {
//     backgroundColor: '#6366F1',
//     borderColor: '#6366F1',
//   },
//   timingOptionText: {
//     fontSize: 11,
//     fontFamily: 'Inter-Medium',
//   },
//   previewSection: {
//     borderRadius: 12,
//     padding: 16,
//     borderWidth: 1,
//     marginBottom: 20,
//   },
//   previewTitle: {
//     fontSize: 14,
//     fontFamily: 'Inter-SemiBold',
//     marginBottom: 12,
//   },
//   previewItem: {
//     marginBottom: 12,
//     paddingBottom: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: 'rgba(99, 102, 241, 0.1)',
//   },
//   previewMedName: {
//     fontSize: 14,
//     fontFamily: 'Inter-SemiBold',
//     marginBottom: 4,
//   },
//   previewDetails: {
//     gap: 2,
//   },
//   previewDetail: {
//     fontSize: 12,
//     fontFamily: 'Inter-Regular',
//   },
//   previewNotes: {
//     fontSize: 11,
//     fontFamily: 'Inter-Regular',
//     fontStyle: 'italic',
//   },
//   footer: {
//     padding: 20,
//     borderTopWidth: 1,
//     borderTopColor: 'rgba(99, 102, 241, 0.1)',
//   },
//   saveButton: {
//     borderRadius: 12,
//     overflow: 'hidden',
//   },
//   saveButtonDisabled: {
//     opacity: 0.5,
//   },
//   saveButtonGradient: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 14,
//     gap: 8,
//   },
//   saveButtonText: {
//     fontSize: 15,
//     fontFamily: 'Inter-SemiBold',
//     color: '#ffffff',
//   },
//   searchModal: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   searchContent: {
//     width: '100%',
//     maxWidth: 400,
//     borderRadius: 20,
//     maxHeight: '80%',
//     overflow: 'hidden',
//   },
//   searchHeader: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     padding: 20,
//     borderBottomWidth: 1,
//     borderBottomColor: 'rgba(99, 102, 241, 0.1)',
//   },
//   searchTitle: {
//     fontSize: 18,
//     fontFamily: 'Inter-Bold',
//   },
//   searchInputContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 16,
//     paddingVertical: 12,
//     margin: 16,
//     borderRadius: 12,
//     gap: 12,
//   },
//   searchInput: {
//     flex: 1,
//     fontSize: 16,
//     fontFamily: 'Inter-Regular',
//   },
//   medicineItem: {
//     padding: 16,
//     borderBottomWidth: 1,
//     borderBottomColor: 'rgba(99, 102, 241, 0.1)',
//   },
//   medicineItemName: {
//     fontSize: 16,
//     fontFamily: 'Inter-SemiBold',
//     marginBottom: 4,
//   },
//   medicineDetails: {
//     gap: 2,
//   },
//   medicineDetail: {
//     fontSize: 12,
//     fontFamily: 'Inter-Regular',
//   },
//   noResults: {
//     textAlign: 'center',
//     padding: 20,
//     fontSize: 14,
//     fontFamily: 'Inter-Regular',
//   },
// });