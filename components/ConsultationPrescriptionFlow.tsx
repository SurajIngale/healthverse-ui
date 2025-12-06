import React, { useState } from 'react';
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
  Alert,
  Dimensions
} from 'react-native';
import { 
  X, 
  Save, 
  ChevronRight, 
  ChevronLeft,
  Check,
  FileText,
  FlaskConical,
  Calendar,
  Search,
  Plus,
  Minus,
  Stethoscope,
  Clock,
  Bell,
  Trash2,
  Upload,
  ChevronDown
} from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

interface UnifiedPatientFormProps {
  patientName: string;
  patientId: string;
  onComplete: (data: any) => void;
  onClose: () => void;
}

// Mock data
const symptomsList = [
  'Fever', 'Headache', 'Cough', 'Fatigue', 'Nausea', 'Dizziness',
  'Chest Pain', 'Shortness of Breath', 'Abdominal Pain', 'Joint Pain'
];

const diagnosisSuggestions = [
  'Hypertension', 'Type 2 Diabetes', 'Upper Respiratory Infection',
  'Migraine', 'Gastroenteritis', 'Bronchitis'
];

const medicineDatabase = [
  { id: '1', name: 'Metformin', commonDosages: ['500mg', '850mg', '1000mg'] },
  { id: '2', name: 'Lisinopril', commonDosages: ['5mg', '10mg', '20mg'] },
  { id: '3', name: 'Atorvastatin', commonDosages: ['10mg', '20mg', '40mg'] },
  { id: '4', name: 'Amoxicillin', commonDosages: ['250mg', '500mg'] },
  { id: '5', name: 'Omeprazole', commonDosages: ['20mg', '40mg'] },
];

const frequencyOptions = ['Once daily', 'Twice daily', 'Three times daily', 'As needed'];
const durationOptions = ['3 days', '5 days', '7 days', '14 days', '30 days'];

const timingOptions = [
  { value: 'before_food', label: 'Before Food' },
  { value: 'after_food', label: 'After Food' },
  { value: 'with_food', label: 'With Food' },
  { value: 'anytime', label: 'Anytime' },
];

const allTests = [
  { id: 'test_1', name: 'Complete Blood Count (CBC)', category: 'Hematology' },
  { id: 'test_2', name: 'Blood Glucose', category: 'Biochemistry' },
  { id: 'test_3', name: 'Lipid Profile', category: 'Biochemistry' },
  { id: 'test_4', name: 'Liver Function Test', category: 'Biochemistry' },
  { id: 'test_5', name: 'Kidney Function Test', category: 'Biochemistry' },
  { id: 'test_6', name: 'Thyroid Function Test', category: 'Biochemistry' },
];

const availableLabs = [
  { id: 'lab_1', name: 'HealthCare Diagnostics', location: 'Medical Center, Building A' },
  { id: 'lab_2', name: 'City Lab Services', location: 'Downtown Plaza, 2nd Floor' },
  { id: 'lab_3', name: 'Advanced Testing Lab', location: 'Hospital Complex, Wing C' },
];

const followUpReasons = [
  'Routine Check-up',
  'Test Results Review',
  'Medication Review',
  'Symptom Monitoring',
  'Treatment Progress',
  'Other'
];

const timeSlots = [
  '08:00 AM', '09:00 AM', '10:00 AM', '11:00 AM',
  '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM',
  '04:00 PM', '05:00 PM', '06:00 PM'
];

export default function UnifiedPatientForm({ 
  patientName, 
  patientId, 
  onComplete, 
  onClose 
}: UnifiedPatientFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  
  // Step 1: Consultation + Prescription
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [examinationFindings, setExaminationFindings] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [vitals, setVitals] = useState({
    bp: '', pulse: '', temp: '', spo2: ''
  });
  const [medications, setMedications] = useState([
    { id: '1', name: '', dosage: '', frequency: '', duration: '', timing: 'anytime', notes: '' }
  ]);
  const [prescriptionNotes, setPrescriptionNotes] = useState('');
  const [showMedicineSearch, setShowMedicineSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingMedId, setEditingMedId] = useState(null);
  
  // Step 2: Lab Tests
  const [selectedTests, setSelectedTests] = useState([]);
  const [selectedLab, setSelectedLab] = useState(null);
  const [labNotes, setLabNotes] = useState('');
  const [urgency, setUrgency] = useState('routine');
  const [showLabDropdown, setShowLabDropdown] = useState(false);
  const [showTestSearch, setShowTestSearch] = useState(false);
  
  // Step 3: Follow-up & Attachments
  const [followUpDate, setFollowUpDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('09:00 AM');
  const [followUpReason, setFollowUpReason] = useState('');
  const [followUpNotes, setFollowUpNotes] = useState('');
  const [sendReminder, setSendReminder] = useState(true);
  const [attachments, setAttachments] = useState([]);

  const totalSteps = 3;

  const toggleSymptom = (symptom) => {
    if (selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms(selectedSymptoms.filter(s => s !== symptom));
    } else {
      setSelectedSymptoms([...selectedSymptoms, symptom]);
    }
  };

  const addMedication = () => {
    const newMed = {
      id: Date.now().toString(),
      name: '',
      dosage: '',
      frequency: '',
      duration: '',
      timing: 'anytime',
      notes: ''
    };
    setMedications([...medications, newMed]);
  };

  const removeMedication = (id) => {
    if (medications.length > 1) {
      setMedications(medications.filter(med => med.id !== id));
    }
  };

  const updateMedication = (id, field, value) => {
    setMedications(medications.map(med =>
      med.id === id ? { ...med, [field]: value } : med
    ));
  };

  const selectMedicine = (medicine) => {
    if (editingMedId) {
      setMedications(medications.map(med =>
        med.id === editingMedId ? { ...med, name: medicine.name } : med
      ));
    }
    setShowMedicineSearch(false);
    setSearchQuery('');
    setEditingMedId(null);
  };

  const toggleTest = (test) => {
    if (selectedTests.find(t => t.id === test.id)) {
      setSelectedTests(selectedTests.filter(t => t.id !== test.id));
    } else {
      setSelectedTests([...selectedTests, test]);
    }
  };

  const removeTest = (testId) => {
    setSelectedTests(selectedTests.filter(t => t.id !== testId));
  };

  const addAttachment = () => {
    const newAttachment = {
      id: Date.now().toString(),
      name: `document_${Date.now()}.pdf`,
      type: 'pdf',
      size: Math.floor(Math.random() * 1000000),
      uploadDate: new Date().toISOString()
    };
    setAttachments([...attachments, newAttachment]);
  };

  const removeAttachment = (id) => {
    setAttachments(attachments.filter(att => att.id !== id));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const isStep1Valid = () => {
    return chiefComplaint.trim() && diagnosis.trim() && medications.some(med => med.name.trim());
  };

  const isStep2Valid = () => {
    return true; // Lab tests are optional
  };

  const isStep3Valid = () => {
    return followUpReason.trim();
  };

  const handleNext = () => {
    if (currentStep === 1 && !isStep1Valid()) {
      Alert.alert('Required Fields', 'Please fill in Chief Complaint, Diagnosis, and at least one Medication');
      return;
    }
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    if (!isStep3Valid()) {
      Alert.alert('Required Fields', 'Please select a follow-up reason');
      return;
    }
    
    const formData = {
      patientId,
      patientName,
      consultation: {
        chiefComplaint,
        symptoms: selectedSymptoms,
        examinationFindings,
        diagnosis,
        vitals
      },
      prescription: {
        medications: medications.filter(m => m.name.trim()),
        notes: prescriptionNotes
      },
      labTests: {
        tests: selectedTests,
        lab: selectedLab,
        notes: labNotes,
        urgency
      },
      followUp: {
        date: followUpDate,
        time: selectedTime,
        reason: followUpReason,
        notes: followUpNotes,
        sendReminder
      },
      attachments
    };
    
    onComplete(formData);
  };

  const renderProgressBar = () => (
    <View style={styles.progressContainer}>
      {[1, 2, 3].map((step) => (
        <View key={step} style={styles.progressStep}>
          <View style={[
            styles.progressDot,
            currentStep >= step && styles.progressDotActive,
            currentStep > step && styles.progressDotCompleted
          ]}>
            {currentStep > step ? (
              <Check size={16} color="#ffffff" strokeWidth={3} />
            ) : (
              <Text style={[
                styles.progressNumber,
                currentStep >= step && styles.progressNumberActive
              ]}>{step}</Text>
            )}
          </View>
          {step < 3 && (
            <View style={[
              styles.progressLine,
              currentStep > step && styles.progressLineActive
            ]} />
          )}
        </View>
      ))}
    </View>
  );

  const renderStepIndicator = () => {
    const steps = [
      { number: 1, title: 'Consultation & Rx', icon: Stethoscope },
      { number: 2, title: 'Lab Tests', icon: FlaskConical },
      { number: 3, title: 'Follow-up', icon: Calendar }
    ];

    return (
      <View style={styles.stepIndicator}>
        {steps.map((step) => {
          const Icon = step.icon;
          const isActive = currentStep === step.number;
          const isCompleted = currentStep > step.number;
          
          return (
            <View key={step.number} style={styles.stepItem}>
              <View style={[
                styles.stepIconContainer,
                isActive && styles.stepIconActive,
                isCompleted && styles.stepIconCompleted
              ]}>
                <Icon 
                  size={20} 
                  color={isActive || isCompleted ? '#ffffff' : '#94a3b8'} 
                  strokeWidth={2}
                />
              </View>
              <Text style={[
                styles.stepTitle,
                isActive && styles.stepTitleActive
              ]}>{step.title}</Text>
            </View>
          );
        })}
      </View>
    );
  };

  const renderStep1 = () => (
    <ScrollView style={styles.stepContent} showsVerticalScrollIndicator={false}>
      <Text style={styles.stepHeader}>Consultation Notes</Text>
      
      {/* Chief Complaint */}
      <View style={styles.section}>
        <Text style={styles.label}>
          Chief Complaint <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={chiefComplaint}
          onChangeText={setChiefComplaint}
          placeholder="Describe the main reason for visit..."
          placeholderTextColor="#94a3b8"
          multiline
          numberOfLines={3}
        />
      </View>

      {/* Symptoms */}
      <View style={styles.section}>
        <Text style={styles.label}>Symptoms</Text>
        <View style={styles.chipsContainer}>
          {symptomsList.map((symptom, index) => {
            const isSelected = selectedSymptoms.includes(symptom);
            return (
              <TouchableOpacity
                key={index}
                onPress={() => toggleSymptom(symptom)}
                style={[
                  styles.chip,
                  isSelected && styles.chipSelected
                ]}
              >
                <Text style={[
                  styles.chipText,
                  isSelected && styles.chipTextSelected
                ]}>{symptom}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Vitals */}
      <View style={styles.section}>
        <Text style={styles.label}>Vital Signs</Text>
        <View style={styles.vitalsGrid}>
          <View style={styles.vitalInput}>
            <Text style={styles.vitalLabel}>BP (mmHg)</Text>
            <TextInput
              style={styles.vitalField}
              value={vitals.bp}
              onChangeText={(text) => setVitals({...vitals, bp: text})}
              placeholder="120/80"
              placeholderTextColor="#94a3b8"
            />
          </View>
          <View style={styles.vitalInput}>
            <Text style={styles.vitalLabel}>Pulse (bpm)</Text>
            <TextInput
              style={styles.vitalField}
              value={vitals.pulse}
              onChangeText={(text) => setVitals({...vitals, pulse: text})}
              placeholder="72"
              placeholderTextColor="#94a3b8"
              keyboardType="numeric"
            />
          </View>
          <View style={styles.vitalInput}>
            <Text style={styles.vitalLabel}>Temp (°C)</Text>
            <TextInput
              style={styles.vitalField}
              value={vitals.temp}
              onChangeText={(text) => setVitals({...vitals, temp: text})}
              placeholder="37.0"
              placeholderTextColor="#94a3b8"
              keyboardType="numeric"
            />
          </View>
          <View style={styles.vitalInput}>
            <Text style={styles.vitalLabel}>SpO2 (%)</Text>
            <TextInput
              style={styles.vitalField}
              value={vitals.spo2}
              onChangeText={(text) => setVitals({...vitals, spo2: text})}
              placeholder="98"
              placeholderTextColor="#94a3b8"
              keyboardType="numeric"
            />
          </View>
        </View>
      </View>

      {/* Examination Findings */}
      <View style={styles.section}>
        <Text style={styles.label}>Examination Findings</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={examinationFindings}
          onChangeText={setExaminationFindings}
          placeholder="Physical examination findings..."
          placeholderTextColor="#94a3b8"
          multiline
          numberOfLines={4}
        />
      </View>

      {/* Diagnosis */}
      <View style={styles.section}>
        <Text style={styles.label}>
          Diagnosis <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          value={diagnosis}
          onChangeText={setDiagnosis}
          placeholder="Enter diagnosis..."
          placeholderTextColor="#94a3b8"
        />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.suggestionsScroll}>
          {diagnosisSuggestions.map((diag, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setDiagnosis(diag)}
              style={styles.suggestionChip}
            >
              <Text style={styles.suggestionChipText}>{diag}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.divider} />
      <Text style={styles.stepHeader}>Prescription</Text>

      {/* Medications */}
      <View style={styles.section}>
        <View style={styles.medicationsHeader}>
          <Text style={styles.label}>
            Medications <Text style={styles.required}>*</Text>
          </Text>
          <TouchableOpacity onPress={addMedication} style={styles.addButton}>
            <Plus size={18} color="#6366F1" strokeWidth={2} />
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>

        {medications.map((med, index) => (
          <View key={med.id} style={styles.medicationCard}>
            <View style={styles.medicationHeader}>
              <Text style={styles.medicationNumber}>Medicine {index + 1}</Text>
              {medications.length > 1 && (
                <TouchableOpacity 
                  onPress={() => removeMedication(med.id)} 
                  style={styles.removeButton}
                >
                  <Minus size={18} color="#ef4444" strokeWidth={2} />
                </TouchableOpacity>
              )}
            </View>

            <TouchableOpacity
              onPress={() => {
                setEditingMedId(med.id);
                setShowMedicineSearch(true);
              }}
              style={styles.medicineSearchTrigger}
            >
              <Text style={[
                styles.medicineName,
                !med.name && styles.medicinePlaceholder
              ]}>
                {med.name || 'Search for medicine...'}
              </Text>
              <Search size={18} color="#94a3b8" />
            </TouchableOpacity>

            <View style={styles.medRow}>
              <View style={styles.medCol}>
                <Text style={styles.medLabel}>Dosage</Text>
                <TextInput
                  style={styles.medInput}
                  value={med.dosage}
                  onChangeText={(text) => updateMedication(med.id, 'dosage', text)}
                  placeholder="e.g., 500mg"
                  placeholderTextColor="#94a3b8"
                />
              </View>
              <View style={styles.medCol}>
                <Text style={styles.medLabel}>Frequency</Text>
                <TextInput
                  style={styles.medInput}
                  value={med.frequency}
                  onChangeText={(text) => updateMedication(med.id, 'frequency', text)}
                  placeholder="e.g., Twice daily"
                  placeholderTextColor="#94a3b8"
                />
              </View>
            </View>

            <View style={styles.medRow}>
              <View style={styles.medCol}>
                <Text style={styles.medLabel}>Duration</Text>
                <TextInput
                  style={styles.medInput}
                  value={med.duration}
                  onChangeText={(text) => updateMedication(med.id, 'duration', text)}
                  placeholder="e.g., 7 days"
                  placeholderTextColor="#94a3b8"
                />
              </View>
              <View style={styles.medCol}>
                <Text style={styles.medLabel}>Timing</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {timingOptions.slice(0, 2).map((timing) => {
                    const isSelected = med.timing === timing.value;
                    return (
                      <TouchableOpacity
                        key={timing.value}
                        onPress={() => updateMedication(med.id, 'timing', timing.value)}
                        style={[
                          styles.timingChip,
                          isSelected && styles.timingChipSelected
                        ]}
                      >
                        <Text style={[
                          styles.timingChipText,
                          isSelected && styles.timingChipTextSelected
                        ]}>{timing.label.replace(' Food', '')}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Prescription Notes</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={prescriptionNotes}
          onChangeText={setPrescriptionNotes}
          placeholder="Any additional instructions..."
          placeholderTextColor="#94a3b8"
          multiline
          numberOfLines={3}
        />
      </View>
    </ScrollView>
  );

  const renderStep2 = () => (
    <ScrollView style={styles.stepContent} showsVerticalScrollIndicator={false}>
      <Text style={styles.stepHeader}>Laboratory Tests</Text>

      <View style={styles.section}>
        <Text style={styles.label}>Select Laboratory</Text>
        <TouchableOpacity
          onPress={() => setShowLabDropdown(true)}
          style={styles.labSelector}
        >
          {selectedLab ? (
            <View style={styles.selectedLabContent}>
              <Text style={styles.selectedLabName}>{selectedLab.name}</Text>
              <Text style={styles.selectedLabLocation}>{selectedLab.location}</Text>
            </View>
          ) : (
            <Text style={styles.labPlaceholder}>Choose a laboratory</Text>
          )}
          <ChevronDown size={20} color="#94a3b8" strokeWidth={2} />
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <View style={styles.testsHeader}>
          <Text style={styles.label}>Select Tests</Text>
          <TouchableOpacity
            onPress={() => setShowTestSearch(true)}
            style={styles.searchTestsButton}
          >
            <Search size={16} color="#6366F1" strokeWidth={2} />
            <Text style={styles.searchTestsText}>Browse</Text>
          </TouchableOpacity>
        </View>

        {selectedTests.length > 0 && (
          <View style={styles.selectedTestsList}>
            {selectedTests.map((test) => (
              <View key={test.id} style={styles.selectedTestItem}>
                <View style={styles.selectedTestInfo}>
                  <Text style={styles.selectedTestName}>{test.name}</Text>
                  <Text style={styles.selectedTestCategory}>{test.category}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => removeTest(test.id)}
                  style={styles.removeTestButton}
                >
                  <X size={16} color="#ef4444" strokeWidth={2} />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {selectedTests.length === 0 && (
          <View style={styles.emptyState}>
            <FlaskConical size={40} color="#64748b" strokeWidth={1.5} />
            <Text style={styles.emptyStateText}>No tests selected</Text>
            <Text style={styles.emptyStateSubtext}>Lab tests are optional</Text>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Urgency</Text>
        <View style={styles.urgencyContainer}>
          <TouchableOpacity
            onPress={() => setUrgency('routine')}
            style={[
              styles.urgencyButton,
              urgency === 'routine' && styles.urgencyButtonSelected
            ]}
          >
            <Text style={[
              styles.urgencyButtonText,
              urgency === 'routine' && styles.urgencyButtonTextSelected
            ]}>Routine</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setUrgency('urgent')}
            style={[
              styles.urgencyButton,
              urgency === 'urgent' && styles.urgencyButtonUrgent
            ]}
          >
            <Text style={[
              styles.urgencyButtonText,
              urgency === 'urgent' && styles.urgencyButtonTextUrgent
            ]}>Urgent</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Lab Instructions</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={labNotes}
          onChangeText={setLabNotes}
          placeholder="Any special instructions for the lab..."
          placeholderTextColor="#94a3b8"
          multiline
          numberOfLines={4}
        />
      </View>
    </ScrollView>
  );

  const renderStep3 = () => (
    <ScrollView style={styles.stepContent} showsVerticalScrollIndicator={false}>
      <Text style={styles.stepHeader}>Follow-up Appointment</Text>

      {/* Date and Time */}
      <View style={styles.section}>
        <Text style={styles.label}>Date & Time</Text>
        <View style={styles.dateTimeRow}>
          <View style={styles.dateContainer}>
            <Calendar size={18} color="#6366F1" />
            <Text style={styles.dateText}>{formatDate(followUpDate)}</Text>
          </View>
          <View style={styles.timeContainer}>
            <Clock size={18} color="#6366F1" />
            <Text style={styles.timeText}>{selectedTime}</Text>
          </View>
        </View>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.timeSlotsScroll}
        >
          {timeSlots.map((time) => (
            <TouchableOpacity
              key={time}
              onPress={() => setSelectedTime(time)}
              style={[
                styles.timeSlot,
                selectedTime === time && styles.timeSlotSelected
              ]}
            >
              <Text style={[
                styles.timeSlotText,
                selectedTime === time && styles.timeSlotTextSelected
              ]}>{time}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Reason */}
      <View style={styles.section}>
        <Text style={styles.label}>
          Reason for Follow-up <Text style={styles.required}>*</Text>
        </Text>
        <View style={styles.reasonsGrid}>
          {followUpReasons.map((reason) => (
            <TouchableOpacity
              key={reason}
              onPress={() => setFollowUpReason(reason)}
              style={[
                styles.chip,
                followUpReason === reason && styles.chipSelected
              ]}
            >
              <Text style={[
                styles.chipText,
                followUpReason === reason && styles.chipTextSelected
              ]}>{reason}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Notes */}
      <View style={styles.section}>
        <Text style={styles.label}>Follow-up Notes</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={followUpNotes}
          onChangeText={setFollowUpNotes}
          placeholder="Any specific instructions..."
          placeholderTextColor="#94a3b8"
          multiline
          numberOfLines={4}
        />
      </View>

      {/* Reminder */}
      <View style={styles.section}>
        <TouchableOpacity
          onPress={() => setSendReminder(!sendReminder)}
          style={styles.reminderOption}
        >
          <View style={[
            styles.checkbox,
            sendReminder && styles.checkboxSelected
          ]}>
            {sendReminder && <Check size={14} color="#ffffff" strokeWidth={3} />}
          </View>
          <View style={styles.reminderTextContainer}>
            <Text style={styles.reminderTitle}>Send Reminder to Patient</Text>
            <Text style={styles.reminderSubtitle}>
              24 hours before appointment
            </Text>
          </View>
          <Bell size={20} color={sendReminder ? '#10b981' : '#94a3b8'} />
        </TouchableOpacity>
      </View>

      {/* Attachments */}
      <View style={styles.section}>
        <View style={styles.attachmentsHeader}>
          <Text style={styles.label}>Attachments ({attachments.length})</Text>
          <TouchableOpacity onPress={addAttachment} style={styles.uploadButton}>
            <Upload size={16} color="#6366F1" strokeWidth={2} />
            <Text style={styles.uploadButtonText}>Upload</Text>
          </TouchableOpacity>
        </View>
        
        {attachments.length > 0 && (
          <View style={styles.attachmentsList}>
            {attachments.map((att) => (
              <View key={att.id} style={styles.attachmentItem}>
                <View style={styles.attachmentIcon}>
                  <FileText size={20} color="#ef4444" strokeWidth={2} />
                </View>
                <View style={styles.attachmentInfo}>
                  <Text style={styles.attachmentName}>{att.name}</Text>
                  <Text style={styles.attachmentSize}>{formatFileSize(att.size)}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => removeAttachment(att.id)}
                  style={styles.deleteButton}
                >
                  <Trash2 size={16} color="#ef4444" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Patient Care Form</Text>
            <Text style={styles.subtitle}>{patientName}</Text>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color="#ffffff" strokeWidth={2} />
          </TouchableOpacity>
          {renderProgressBar()}
        </View>

        {/* Step Indicator */}
        {renderStepIndicator()}

        {/* Content */}
        <View style={styles.content}>
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
        </View>

        {/* Footer Navigation */}
        <View style={styles.footer}>
          {currentStep > 1 && (
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <ChevronLeft size={20} color="#6366F1" strokeWidth={2} />
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
          )}
          
          {currentStep < totalSteps ? (
            <TouchableOpacity 
              onPress={handleNext} 
              style={[styles.nextButton, currentStep === 1 && styles.nextButtonFull]}
            >
              <Text style={styles.nextButtonText}>Next</Text>
              <ChevronRight size={20} color="#ffffff" strokeWidth={2} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
              <Save size={20} color="#ffffff" strokeWidth={2} />
              <Text style={styles.submitButtonText}>Save & Complete</Text>
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>

      {/* Medicine Search Modal */}
      <Modal
        visible={showMedicineSearch}
        transparent
        animationType="slide"
        onRequestClose={() => setShowMedicineSearch(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Search Medicine</Text>
              <TouchableOpacity onPress={() => setShowMedicineSearch(false)}>
                <X size={24} color="#1e293b" strokeWidth={2} />
              </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
              <Search size={20} color="#94a3b8" />
              <TextInput
                style={styles.searchInput}
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search for medicine..."
                placeholderTextColor="#94a3b8"
                autoFocus
              />
            </View>

            <ScrollView>
              {medicineDatabase
                .filter(med => med.name.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((medicine) => (
                  <TouchableOpacity
                    key={medicine.id}
                    onPress={() => selectMedicine(medicine)}
                    style={styles.medicineItem}
                  >
                    <Text style={styles.medicineItemName}>{medicine.name}</Text>
                    <Text style={styles.medicineItemDosages}>
                      {medicine.commonDosages.join(', ')}
                    </Text>
                  </TouchableOpacity>
                ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Lab Selection Modal */}
      <Modal
        visible={showLabDropdown}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLabDropdown(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Laboratory</Text>
              <TouchableOpacity onPress={() => setShowLabDropdown(false)}>
                <X size={24} color="#1e293b" strokeWidth={2} />
              </TouchableOpacity>
            </View>

            <ScrollView>
              {availableLabs.map((lab) => (
                <TouchableOpacity
                  key={lab.id}
                  onPress={() => {
                    setSelectedLab(lab);
                    setShowLabDropdown(false);
                  }}
                  style={[
                    styles.labOption,
                    selectedLab?.id === lab.id && styles.labOptionSelected
                  ]}
                >
                  <View style={styles.labOptionContent}>
                    <Text style={styles.labOptionName}>{lab.name}</Text>
                    <Text style={styles.labOptionLocation}>{lab.location}</Text>
                  </View>
                  {selectedLab?.id === lab.id && (
                    <Check size={18} color="#f59e0b" strokeWidth={3} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Test Search Modal */}
      <Modal
        visible={showTestSearch}
        transparent
        animationType="slide"
        onRequestClose={() => setShowTestSearch(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Browse Tests</Text>
              <TouchableOpacity onPress={() => setShowTestSearch(false)}>
                <X size={24} color="#1e293b" strokeWidth={2} />
              </TouchableOpacity>
            </View>

            <View style={styles.searchContainer}>
              <Search size={20} color="#94a3b8" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search tests..."
                placeholderTextColor="#94a3b8"
              />
            </View>

            <ScrollView>
              {allTests.map((test) => {
                const isSelected = selectedTests.find(t => t.id === test.id);
                return (
                  <TouchableOpacity
                    key={test.id}
                    onPress={() => toggleTest(test)}
                    style={[
                      styles.testItem,
                      isSelected && styles.testItemSelected
                    ]}
                  >
                    {isSelected && (
                      <View style={styles.checkIcon}>
                        <Check size={14} color="#ffffff" strokeWidth={3} />
                      </View>
                    )}
                    <View style={styles.testInfo}>
                      <Text style={styles.testName}>{test.name}</Text>
                      <Text style={styles.testCategory}>{test.category}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                onPress={() => setShowTestSearch(false)}
                style={styles.doneButton}
              >
                <Text style={styles.doneButtonText}>Done ({selectedTests.length})</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#1e293b',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(99, 102, 241, 0.2)',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    position: 'absolute',
    top: 60,
    right: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 20,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressStep: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#475569',
  },
  progressDotActive: {
    backgroundColor: '#6366F1',
    borderColor: '#6366F1',
  },
  progressDotCompleted: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  progressNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94a3b8',
  },
  progressNumberActive: {
    color: '#ffffff',
  },
  progressLine: {
    width: 40,
    height: 2,
    backgroundColor: '#334155',
    marginHorizontal: 8,
  },
  progressLineActive: {
    backgroundColor: '#10b981',
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: '#1e293b',
  },
  stepItem: {
    alignItems: 'center',
    gap: 8,
  },
  stepIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepIconActive: {
    backgroundColor: '#6366F1',
  },
  stepIconCompleted: {
    backgroundColor: '#10b981',
  },
  stepTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94a3b8',
  },
  stepTitleActive: {
    color: '#6366F1',
  },
  content: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  stepContent: {
    flex: 1,
    padding: 20,
  },
  stepHeader: {
    fontSize: 18,
    fontWeight: '700',
    color: '#e2e8f0',
    marginBottom: 20,
  },
  divider: {
    height: 1,
    backgroundColor: '#334155',
    marginVertical: 24,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#e2e8f0',
    marginBottom: 12,
  },
  required: {
    color: '#ef4444',
  },
  input: {
    fontSize: 15,
    color: '#ffffff',
    backgroundColor: '#1e293b',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
  },
  chipSelected: {
    backgroundColor: '#6366F1',
    borderColor: '#6366F1',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#e2e8f0',
  },
  chipTextSelected: {
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
    fontWeight: '500',
    color: '#94a3b8',
    marginBottom: 6,
  },
  vitalField: {
    fontSize: 14,
    color: '#ffffff',
    backgroundColor: '#1e293b',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  suggestionsScroll: {
    marginTop: 8,
  },
  suggestionChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    marginRight: 8,
  },
  suggestionChipText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6366F1',
  },
  medicationsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    gap: 4,
  },
  addButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6366F1',
  },
  medicationCard: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  medicationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  medicationNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#e2e8f0',
  },
  removeButton: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  medicineSearchTrigger: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 12,
  },
  medicineName: {
    fontSize: 14,
    color: '#ffffff',
  },
  medicinePlaceholder: {
    color: '#94a3b8',
  },
  medRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  medCol: {
    flex: 1,
  },
  medLabel: {
    fontSize: 11,
    fontWeight: '500',
    color: '#94a3b8',
    marginBottom: 6,
  },
  medInput: {
    fontSize: 14,
    color: '#ffffff',
    backgroundColor: '#0f172a',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  timingChip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#334155',
    marginRight: 6,
  },
  timingChipSelected: {
    backgroundColor: '#6366F1',
    borderColor: '#6366F1',
  },
  timingChipText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#e2e8f0',
  },
  timingChipTextSelected: {
    color: '#ffffff',
  },
  labSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
  },
  selectedLabContent: {
    flex: 1,
    marginRight: 12,
  },
  selectedLabName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#e2e8f0',
    marginBottom: 2,
  },
  selectedLabLocation: {
    fontSize: 12,
    color: '#94a3b8',
  },
  labPlaceholder: {
    fontSize: 14,
    color: '#94a3b8',
  },
  testsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  searchTestsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    gap: 4,
  },
  searchTestsText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6366F1',
  },
  selectedTestsList: {
    gap: 8,
  },
  selectedTestItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#1e293b',
    borderRadius: 12,
  },
  selectedTestInfo: {
    flex: 1,
  },
  selectedTestName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#e2e8f0',
    marginBottom: 2,
  },
  selectedTestCategory: {
    fontSize: 12,
    color: '#94a3b8',
  },
  removeTestButton: {
    padding: 6,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    gap: 12,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#94a3b8',
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#64748b',
  },
  urgencyContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  urgencyButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    alignItems: 'center',
  },
  urgencyButtonSelected: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  urgencyButtonUrgent: {
    backgroundColor: '#ef4444',
    borderColor: '#ef4444',
  },
  urgencyButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#e2e8f0',
  },
  urgencyButtonTextSelected: {
    color: '#ffffff',
  },
  urgencyButtonTextUrgent: {
    color: '#ffffff',
  },
  dateTimeRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  dateContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  dateText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#e2e8f0',
  },
  timeContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  timeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#e2e8f0',
  },
  timeSlotsScroll: {
    marginTop: 8,
  },
  timeSlot: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    marginRight: 8,
  },
  timeSlotSelected: {
    backgroundColor: '#6366F1',
    borderColor: '#6366F1',
  },
  timeSlotText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#e2e8f0',
  },
  timeSlotTextSelected: {
    color: '#ffffff',
  },
  reasonsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  reminderOption: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(99, 102, 241, 0.05)',
    gap: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#334155',
    backgroundColor: '#1e293b',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxSelected: {
    backgroundColor: '#6366F1',
    borderColor: '#6366F1',
  },
  reminderTextContainer: {
    flex: 1,
    gap: 4,
  },
  reminderTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#e2e8f0',
  },
  reminderSubtitle: {
    fontSize: 12,
    color: '#94a3b8',
    lineHeight: 16,
  },
  attachmentsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    gap: 4,
  },
  uploadButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6366F1',
  },
  attachmentsList: {
    gap: 8,
  },
  attachmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#1e293b',
    borderRadius: 12,
    gap: 12,
  },
  attachmentIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  attachmentInfo: {
    flex: 1,
  },
  attachmentName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#e2e8f0',
    marginBottom: 2,
  },
  attachmentSize: {
    fontSize: 12,
    color: '#94a3b8',
  },
  deleteButton: {
    padding: 6,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#1e293b',
    borderTopWidth: 1,
    borderTopColor: 'rgba(99, 102, 241, 0.2)',
    gap: 12,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    gap: 8,
  },
  backButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6366F1',
  },
  nextButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#6366F1',
    gap: 8,
  },
  nextButtonFull: {
    flex: 1,
  },
  nextButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#ffffff',
  },
  submitButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#10b981',
    gap: 8,
  },
  submitButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#ffffff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    margin: 16,
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1e293b',
  },
  medicineItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  medicineItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  medicineItemDosages: {
    fontSize: 12,
    color: '#64748b',
  },
  labOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  labOptionSelected: {
    backgroundColor: 'rgba(245, 158, 11, 0.08)',
  },
  labOptionContent: {
    flex: 1,
    gap: 4,
  },
  labOptionName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1e293b',
  },
  labOptionLocation: {
    fontSize: 12,
    color: '#64748b',
  },
  testItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 8,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  testItemSelected: {
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    borderColor: '#6366F1',
  },
  checkIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  testInfo: {
    flex: 1,
  },
  testName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 2,
  },
  testCategory: {
    fontSize: 12,
    color: '#64748b',
  },
  modalFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  doneButton: {
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#6366F1',
    alignItems: 'center',
  },
  doneButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});