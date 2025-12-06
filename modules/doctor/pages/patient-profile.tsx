
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  Platform,
  Dimensions,
  StatusBar
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import {
  ArrowLeft,
  MoreVertical,
  Phone,
  Mail,
  Calendar,
  MapPin,
  FileText,
  Activity,
  AlertCircle,
  Clock,
  ChevronRight,
  Stethoscope,
  Pill,
  FlaskConical,
  Paperclip,
  AlertTriangle,
  User,
  Droplet,
  Heart,
  Plus,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  Sparkles,
  History,
  Upload
} from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import FollowUpAppointment from '@/components/FollowUpAppointment';
import AttachmentsManager from '@/components/AttachmentsManager';
import ConsultationNotes from '@/components/ConsultationNotes';
import { darkTheme, lightTheme, useTheme } from '@/modules/shared/contexts/ThemeContext';
import EnhancedPrescriptionForm from '@/components/PrescriptionForm';
import EnhancedLabTestForm from '@/components/LabTestForm';


const STEPS = [
  { id: 'prescription', title: 'Prescription', icon: Pill, color: '#10b981' },
  { id: 'lab_test', title: 'Lab Test', icon: FlaskConical, color: '#f59e0b' },
  { id: 'follow_up', title: 'Follow Up', icon: Calendar, color: '#ec4899' },
];

const StepIndicator = ({ currentStep, onStepPress, completedSteps, onClose }: { currentStep: string, onStepPress: (stepId: string) => void, completedSteps: string[], onClose: () => void }) => {
  const { isDark } = useTheme();
  const colors = isDark ? darkTheme : lightTheme;

  return (
    <View style={[styles.stepIndicatorContainer, { backgroundColor: colors.containerBg, borderBottomColor: colors.cardBorder }]}>
      <View style={styles.stepHeader}>
        <TouchableOpacity onPress={onClose} style={[styles.closeWorkflowButton, { backgroundColor: colors.cardBg }]}>
          <X size={20} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.workflowTitle, { color: colors.text }]}>New Prescription Workflow</Text>
        <View style={{ width: 32 }} />
      </View>
      <View style={styles.progressBarContainer}>
        {STEPS.map((step, index) => {
          const isActive = step.id === currentStep;
          const isCompleted = completedSteps.includes(step.id);
          const isLast = index === STEPS.length - 1;

          return (
            <React.Fragment key={step.id}>
              <TouchableOpacity
                onPress={() => onStepPress(step.id)}
                style={styles.stepItem}
                activeOpacity={0.7}
              >
                <View style={[
                  styles.stepIconContainer,
                  {
                    backgroundColor: isActive ? step.color : (isCompleted ? `${step.color}20` : colors.cardBg),
                    borderColor: isActive ? step.color : (isCompleted ? step.color : colors.cardBorder),
                    borderWidth: 1
                  }
                ]}>
                  {isCompleted && !isActive ? (
                    <Check size={14} color={step.color} strokeWidth={3} />
                  ) : (
                    <step.icon size={16} color={isActive ? '#ffffff' : (isCompleted ? step.color : colors.textTertiary)} strokeWidth={2} />
                  )}
                </View>
                <Text style={[
                  styles.stepTitle,
                  {
                    color: isActive ? colors.text : (isCompleted ? colors.textSecondary : colors.textTertiary),
                    fontWeight: isActive ? '700' : '500'
                  }
                ]}>
                  {step.title}
                </Text>
              </TouchableOpacity>
              {!isLast && (
                <View style={[styles.stepConnector, { backgroundColor: isCompleted ? step.color : colors.cardBorder }]} />
              )}
            </React.Fragment>
          );
        })}
      </View>
    </View>
  );
};

const ConfirmationModal = ({ visible, title, message, onConfirm, onCancel, confirmText = "Yes", cancelText = "No" }: any) => {
  const { isDark } = useTheme();
  const colors = isDark ? darkTheme : lightTheme;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
          <Text style={[styles.modalTitle, { color: colors.text }]}>{title}</Text>
          <Text style={[styles.modalMessage, { color: colors.textSecondary }]}>{message}</Text>
          <View style={styles.modalActions}>
            <TouchableOpacity onPress={onCancel} style={[styles.modalButton, styles.modalButtonCancel, { borderColor: colors.cardBorder }]}>
              <Text style={[styles.modalButtonText, { color: colors.text }]}>{cancelText}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onConfirm} style={[styles.modalButton, styles.modalButtonConfirm, { backgroundColor: colors.accent }]}>
              <Text style={[styles.modalButtonText, { color: '#ffffff' }]}>{confirmText}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

interface MedicalRecord {
  id: string;
  type: 'prescription' | 'lab_report' | 'consultation';
  date: string;
  title: string;
  doctor: string;
  details: string;
  timestamp: number;
}

interface PatientData {
  id: string;
  name: string;
  dob: string;
  gender: string;
  bloodGroup: string;
  phone: string;
  email: string;
  address: string;
}

interface MedicalQuickInfo {
  conditions: string[];
  allergies: string[];
  medications: string[];
  lastVisit: string;
  nextAppointment?: string;
  emergencyContact?: string;
}

export default function DoctorPatientProfileScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { patientId, walkIn } = params;
  const { isDark } = useTheme();
  const colors = isDark ? darkTheme : lightTheme;

  const [showConsultationNotes, setShowConsultationNotes] = useState(false);
  const [showAttachments, setShowAttachments] = useState(false);
  const [isBasicDetailsExpanded, setIsBasicDetailsExpanded] = useState(false);
  const [showHistorySidebar, setShowHistorySidebar] = useState(false);

  // Workflow State
  const [workflowActive, setWorkflowActive] = useState(false);
  const [currentStep, setCurrentStep] = useState<string>('prescription');
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [showLabTestPrompt, setShowLabTestPrompt] = useState(false);
  const [showFollowUpPrompt, setShowFollowUpPrompt] = useState(false);

  const startWorkflow = () => {
    setWorkflowActive(true);
    setCurrentStep('prescription');
    setCompletedSteps([]);
  };

  const closeWorkflow = () => {
    setWorkflowActive(false);
  };

  const handleStepPress = (stepId: string) => {
    setCurrentStep(stepId);
  };

  const handlePrescriptionSave = (data: any) => {
    setCompletedSteps(prev => [...prev, 'prescription']);
    console.log('Prescription saved:', data);

    // Prompt for next step
    setTimeout(() => {
      setShowLabTestPrompt(true);
    }, 500);
  };

  const handleLabTestSave = (data: any) => {
    setCompletedSteps(prev => [...prev, 'lab_test']);
    console.log('Lab test saved:', data);

    // Prompt for next step
    setTimeout(() => {
      setShowFollowUpPrompt(true);
    }, 500);
  };

  const handleFollowUpSave = (data: any) => {
    setCompletedSteps(prev => [...prev, 'follow_up']);
    console.log('Follow-up scheduled:', data);
    setWorkflowActive(false);
  };

  const patientData: PatientData = {
    id: patientId as string || 'patient_123',
    name: 'John Doe',
    dob: '15/05/1990',
    gender: 'Male',
    bloodGroup: 'O+',
    phone: '+1 (555) 123-4567',
    email: 'john.doe@example.com',
    address: '123 Health Street, Medical City, MC 12345',
  };

  const medicalQuickInfo: MedicalQuickInfo = {
    conditions: ['Hypertension', 'Type 2 Diabetes', 'Hyperlipidemia'],
    allergies: ['Penicillin', 'Shellfish', 'Dust Mites'],
    medications: ['Metformin 500mg', 'Lisinopril 10mg', 'Atorvastatin 20mg'],
    lastVisit: 'Jan 15, 2025',
    nextAppointment: 'Feb 15, 2025',
    emergencyContact: '+1 (555) 987-6543 (Jane Doe)',
  };

  const [medicalHistory] = useState<MedicalRecord[]>([
    {
      id: 'rec_1',
      type: 'prescription',
      date: 'Jan 15, 2025',
      title: 'Hypertension Medication',
      doctor: 'Dr. Sarah Johnson',
      details: 'Amlodipine 5mg once daily, Metoprolol 50mg twice daily',
      timestamp: Date.now() - 86400000 * 5,
    },
    {
      id: 'rec_2',
      type: 'lab_report',
      date: 'Jan 10, 2025',
      title: 'Complete Blood Count',
      doctor: 'Dr. Michael Chen',
      details: 'All parameters within normal range',
      timestamp: Date.now() - 86400000 * 10,
    },
    {
      id: 'rec_3',
      type: 'consultation',
      date: 'Jan 5, 2025',
      title: 'Routine Check-up',
      doctor: 'Dr. Sarah Johnson',
      details: 'Patient reported mild headaches, BP 135/85',
      timestamp: Date.now() - 86400000 * 15,
    },
    {
      id: 'rec_4',
      type: 'lab_report',
      date: 'Dec 20, 2024',
      title: 'Lipid Profile',
      doctor: 'Dr. Emily Watson',
      details: 'Total Cholesterol: 190 mg/dL, LDL: 110 mg/dL',
      timestamp: Date.now() - 86400000 * 30,
    },
  ]);

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

  const getRecordIcon = (type: string) => {
    switch (type) {
      case 'prescription':
        return Pill;
      case 'lab_report':
        return FlaskConical;
      case 'consultation':
        return FileText;
      default:
        return FileText;
    }
  };

  const getRecordColor = (type: string) => {
    switch (type) {
      case 'prescription':
        return '#10b981';
      case 'lab_report':
        return '#f59e0b';
      case 'consultation':
        return '#6366F1';
      default:
        return '#6366F1';
    }
  };

  const age = calculateAge(patientData.dob);
  const isWalkIn = walkIn === 'true';

  // Removed the problematic handler functions since they referenced non-existent state setters

  const MedicalInfoChip = ({ items, title, icon: Icon, color }: { items: string[], title: string, icon: any, color: string }) => (
    <View style={[styles.medicalInfoCard, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
      <View style={styles.medicalInfoHeader}>
        <View style={[styles.medicalInfoIcon, { backgroundColor: `${color}20` }]}>
          <Icon size={18} color={color} strokeWidth={2} />
        </View>
        <Text style={[styles.medicalInfoTitle, { color: colors.text }]}>{title}</Text>
      </View>
      <View style={styles.chipsContainer}>
        {items.map((item, index) => (
          <View key={index} style={[styles.chip, { backgroundColor: `${color}15` }]}>
            <Text style={[styles.chipText, { color }]} numberOfLines={1}>{item}</Text>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.containerBg }]}>
      <LinearGradient colors={colors.background as any} style={styles.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />

      <View style={[styles.header, { paddingTop: Platform.OS === 'ios' ? 50 : (StatusBar.currentHeight || 0) + 10 }]}>
        <TouchableOpacity onPress={() => router.back()} style={[styles.headerButton, { backgroundColor: colors.accentLight }]}>
          <ArrowLeft size={22} color={colors.accent} strokeWidth={2} />
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: colors.text }]}>Patient Profile</Text>

        <TouchableOpacity
          onPress={() => setShowHistorySidebar(true)}
          style={[styles.headerButton, { backgroundColor: colors.cardBg, borderWidth: 1, borderColor: colors.cardBorder }]}
        >
          <History size={20} color={colors.text} strokeWidth={2} />
        </TouchableOpacity>
      </View>

      {isWalkIn && (
        <MotiView
          from={{ opacity: 0, translateY: -10 }}
          animate={{ opacity: 1, translateY: 0 }}
          style={[styles.walkInBanner, { backgroundColor: colors.accentLight }]}
        >
          <Text style={[styles.walkInText, { color: colors.accent }]}>Walk-in Patient</Text>
        </MotiView>
      )}

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Basic Details Card - Collapsible */}
        <MotiView
          from={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 100, damping: 15 } as any}
          style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}
        >
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setIsBasicDetailsExpanded(!isBasicDetailsExpanded)}
            style={styles.cardHeader}
          >
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
                <Text style={[styles.name, { color: colors.text }]}>{patientData.name}</Text>
                <Text style={[styles.subtitle, { color: colors.textTertiary }]}>{age} years • {patientData.gender}</Text>
              </View>
              <View style={[styles.expandIcon, { backgroundColor: colors.containerBg }]}>
                {isBasicDetailsExpanded ? (
                  <ChevronUp size={20} color={colors.textSecondary} />
                ) : (
                  <ChevronDown size={20} color={colors.textSecondary} />
                )}
              </View>
            </View>
          </TouchableOpacity>

          {isBasicDetailsExpanded && (
            <MotiView
              from={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ type: 'timing', duration: 300 } as any}
              style={styles.infoGrid}
            >
              <View style={styles.separator} />

              <View style={styles.infoRow}>
                <View style={[styles.iconBadge, { backgroundColor: colors.accentLight }]}>
                  <Calendar size={16} color={colors.accent} strokeWidth={2} />
                </View>
                <View style={styles.infoContent}>
                  <Text style={[styles.infoLabel, { color: colors.textTertiary }]}>Date of Birth</Text>
                  <Text style={[styles.infoValue, { color: colors.text }]}>{patientData.dob}</Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <View style={[styles.iconBadge, { backgroundColor: 'rgba(239, 68, 68, 0.1)' }]}>
                  <Droplet size={16} color="#EF4444" strokeWidth={2} />
                </View>
                <View style={styles.infoContent}>
                  <Text style={[styles.infoLabel, { color: colors.textTertiary }]}>Blood Group</Text>
                  <Text style={[styles.infoValue, { color: colors.text }]}>{patientData.bloodGroup}</Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <View style={[styles.iconBadge, { backgroundColor: 'rgba(16, 185, 129, 0.1)' }]}>
                  <Phone size={16} color="#10B981" strokeWidth={2} />
                </View>
                <View style={styles.infoContent}>
                  <Text style={[styles.infoLabel, { color: colors.textTertiary }]}>Phone</Text>
                  <Text style={[styles.infoValue, { color: colors.text }]}>{patientData.phone}</Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <View style={[styles.iconBadge, { backgroundColor: 'rgba(245, 158, 11, 0.1)' }]}>
                  <Mail size={16} color="#F59E0B" strokeWidth={2} />
                </View>
                <View style={styles.infoContent}>
                  <Text style={[styles.infoLabel, { color: colors.textTertiary }]}>Email</Text>
                  <Text style={[styles.infoValue, { color: colors.text }]} numberOfLines={1}>{patientData.email}</Text>
                </View>
              </View>
            </MotiView>
          )}
        </MotiView>

        {/* Medical Quick Info Section - AI Styled */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: 150, damping: 15 } as any}
          style={styles.medicalInfoSection}
        >
          <View style={styles.aiHeader}>
            <LinearGradient
              colors={['#8b5cf6', '#6366f1']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.aiBadge}
            >
              <Sparkles size={12} color="#ffffff" />
              <Text style={styles.aiBadgeText}>AI Summary</Text>
            </LinearGradient>
            <Text style={[styles.sectionTitle, { color: colors.text, marginBottom: 0 }]}>Medical Quick Info</Text>
          </View>

          <View style={[styles.aiContainer, { backgroundColor: isDark ? 'rgba(139, 92, 246, 0.1)' : 'rgba(245, 243, 255, 1)', borderColor: isDark ? 'rgba(139, 92, 246, 0.3)' : '#ddd6fe' }]}>
            {/* Conditions */}
            <MedicalInfoChip
              items={medicalQuickInfo.conditions}
              title="Known Conditions"
              icon={Activity}
              color="#EF4444"
            />

            {/* Allergies */}
            <MedicalInfoChip
              items={medicalQuickInfo.allergies}
              title="Allergies"
              icon={AlertTriangle}
              color="#F59E0B"
            />

            {/* Medications */}
            <MedicalInfoChip
              items={medicalQuickInfo.medications}
              title="Current Medications"
              icon={Pill}
              color="#10B981"
            />

            {/* Visit Info */}
            <View style={[styles.visitInfoCard, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
              <View style={styles.visitInfoRow}>
                <View style={[styles.visitIcon, { backgroundColor: 'rgba(99, 102, 241, 0.1)' }]}>
                  <Clock size={16} color="#6366F1" strokeWidth={2} />
                </View>
                <View style={styles.visitInfo}>
                  <Text style={[styles.visitLabel, { color: colors.textTertiary }]}>Last Visit</Text>
                  <Text style={[styles.visitValue, { color: colors.text }]}>{medicalQuickInfo.lastVisit}</Text>
                </View>
              </View>

              {medicalQuickInfo.nextAppointment && (
                <View style={styles.visitInfoRow}>
                  <View style={[styles.visitIcon, { backgroundColor: 'rgba(16, 185, 129, 0.1)' }]}>
                    <Calendar size={16} color="#10B981" strokeWidth={2} />
                  </View>
                  <View style={styles.visitInfo}>
                    <Text style={[styles.visitLabel, { color: colors.textTertiary }]}>Next Appointment</Text>
                    <Text style={[styles.visitValue, { color: colors.text }]}>{medicalQuickInfo.nextAppointment}</Text>
                  </View>
                </View>
              )}

              {medicalQuickInfo.emergencyContact && (
                <View style={styles.visitInfoRow}>
                  <View style={[styles.visitIcon, { backgroundColor: 'rgba(239, 68, 68, 0.1)' }]}>
                    <Heart size={16} color="#EF4444" strokeWidth={2} />
                  </View>
                  <View style={styles.visitInfo}>
                    <Text style={[styles.visitLabel, { color: colors.textTertiary }]}>Emergency Contact</Text>
                    <Text style={[styles.visitValue, { color: colors.text }]}>{medicalQuickInfo.emergencyContact}</Text>
                  </View>
                </View>
              )}
            </View>
          </View>
        </MotiView>

        {/* Quick Actions */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: 200, damping: 15 } as any}
          style={styles.actionsSection}
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
          <View style={styles.actionsGrid}>
            <TouchableOpacity
              onPress={startWorkflow}
              style={[styles.actionCard, { width: '100%' }]}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={['#10b981', '#059669']}
                style={[styles.actionGradient, { flexDirection: 'row', justifyContent: 'center', gap: 12 }]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={[styles.actionIconContainer, { marginBottom: 0, width: 40, height: 40 }]}>
                  <Plus size={24} color="#ffffff" strokeWidth={2} />
                </View>
                <Text style={[styles.actionText, { fontSize: 16 }]}>Add Prescription</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </MotiView>

        {/* Medical History Removed from here - moved to Sidebar */}
      </ScrollView>

      {/* Full Screen Workflow Modal */}
      <Modal
        visible={workflowActive}
        animationType="slide"
        onRequestClose={closeWorkflow}
        presentationStyle="fullScreen"
      >
        <View style={{ flex: 1, backgroundColor: colors.containerBg }}>
          {/* Sticky Step Indicator */}
          <View style={{ paddingTop: Platform.OS === 'ios' ? 50 : 0, backgroundColor: colors.containerBg, zIndex: 10 }}>
            <StepIndicator
              currentStep={currentStep}
              onStepPress={handleStepPress}
              completedSteps={completedSteps}
              onClose={closeWorkflow}
            />
          </View>

          {/* Content Area */}
          <View style={{ flex: 1 }}>
            {currentStep === 'prescription' && (
              <EnhancedPrescriptionForm
                patientName={patientData.name}
                patientId={patientData.id}
                onSave={handlePrescriptionSave}
                onClose={closeWorkflow}
                isFullScreen={true}
              />
            )}
            {currentStep === 'lab_test' && (
              <EnhancedLabTestForm
                patientName={patientData.name}
                patientId={patientData.id}
                onSave={handleLabTestSave}
                onClose={closeWorkflow}
                isFullScreen={true}
              />
            )}
            {currentStep === 'follow_up' && (
              <FollowUpAppointment
                patientName={patientData.name}
                patientId={patientData.id}
                onSave={handleFollowUpSave}
                onClose={closeWorkflow}
                isFullScreen={true}
              />
            )}
          </View>
        </View>
      </Modal>

      <Modal
        visible={showConsultationNotes}
        transparent
        animationType="slide"
        onRequestClose={() => setShowConsultationNotes(false)}
      >
        <ConsultationNotes
          patientName={patientData.name}
          patientId={patientData.id}
          onSave={(data) => {
            setShowConsultationNotes(false);
            // Handle consultation notes data
            console.log('Consultation notes saved:', data);
          }}
          onClose={() => setShowConsultationNotes(false)}
        />
      </Modal>

      <Modal
        visible={showAttachments}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAttachments(false)}
      >
        <AttachmentsManager
          patientName={patientData.name}
          patientId={patientData.id}
          onUpload={(attachments) => {
            // Handle uploaded attachments
            console.log('Attachments uploaded:', attachments);
          }}
          onClose={() => setShowAttachments(false)}
        />
      </Modal>

      {/* Workflow Prompts */}
      <ConfirmationModal
        visible={showLabTestPrompt}
        title="Request Lab Test?"
        message="Do you want to request a Lab Test for this patient?"
        onConfirm={() => {
          setShowLabTestPrompt(false);
          setCurrentStep('lab_test');
        }}
        onCancel={() => {
          setShowLabTestPrompt(false);
          // Skip to next step check
          setTimeout(() => setShowFollowUpPrompt(true), 300);
        }}
      />

      <ConfirmationModal
        visible={showFollowUpPrompt}
        title="Schedule Follow-Up?"
        message="Do you want to schedule a Follow-Up appointment?"
        onConfirm={() => {
          setShowFollowUpPrompt(false);
          setCurrentStep('follow_up');
        }}
        onCancel={() => {
          setShowFollowUpPrompt(false);
          setWorkflowActive(false);
        }}
      />
      {/* Medical History Sidebar */}
      <Modal
        visible={showHistorySidebar}
        transparent
        animationType="none"
        onRequestClose={() => setShowHistorySidebar(false)}
      >
        <View style={styles.sidebarOverlay}>
          <TouchableOpacity
            style={styles.sidebarBackdrop}
            activeOpacity={1}
            onPress={() => setShowHistorySidebar(false)}
          />
          <MotiView
            from={{ translateX: 300 }}
            animate={{ translateX: 0 }}
            exit={{ translateX: 300 }}
            transition={{ type: 'timing', duration: 300 } as any}
            style={[styles.sidebar, { backgroundColor: colors.containerBg }]}
          >
            <View style={[styles.sidebarHeader, { borderBottomColor: colors.cardBorder }]}>
              <Text style={[styles.sidebarTitle, { color: colors.text }]}>Medical History</Text>
              <TouchableOpacity
                onPress={() => setShowHistorySidebar(false)}
                style={[styles.closeSidebarButton, { backgroundColor: colors.cardBg }]}
              >
                <X size={20} color={colors.text} />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.sidebarContent}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.timeline}>
                {medicalHistory.map((record, index) => {
                  const Icon = getRecordIcon(record.type);
                  const color = getRecordColor(record.type);
                  const isLast = index === medicalHistory.length - 1;

                  return (
                    <View key={record.id} style={styles.timelineItem}>
                      <View style={styles.timelineLeft}>
                        <View style={[styles.timelineNode, { backgroundColor: color }]} />
                        {!isLast && <View style={[styles.timelineLine, { backgroundColor: color }]} />}
                      </View>

                      <View style={[styles.recordCard, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
                        <View style={styles.recordHeader}>
                          <View style={[styles.recordIconContainer, { backgroundColor: `${color}20` }]}>
                            <Icon size={16} color={color} strokeWidth={2} />
                          </View>
                          <View style={styles.recordInfo}>
                            <Text style={[styles.recordTitle, { color: colors.text, fontSize: 13 }]}>{record.title}</Text>
                            <Text style={[styles.recordDate, { color: colors.textTertiary, fontSize: 11 }]}>{record.date}</Text>
                          </View>
                        </View>
                        <Text style={[styles.recordDoctor, { color: colors.textSecondary, fontSize: 12 }]}>{record.doctor}</Text>
                        <Text style={[styles.recordDetails, { color: colors.textTertiary, fontSize: 12 }]}>{record.details}</Text>
                      </View>
                    </View>
                  );
                })}
              </View>
              <View style={{ height: 40 }} />
            </ScrollView>
          </MotiView>
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
  walkInBanner: {
    marginHorizontal: 20,
    marginBottom: 12,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  walkInText: {
    fontSize: 13,
    fontFamily: 'Inter-SemiBold',
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
    overflow: 'hidden',
  },
  cardHeader: {
    marginBottom: 0,
  },
  avatarSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
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
  expandIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(148, 163, 184, 0.1)',
    marginVertical: 16,
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
  // Medical Quick Info Styles
  medicalInfoSection: {
    marginBottom: 16,
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  aiBadgeText: {
    color: '#ffffff',
    fontSize: 11,
    fontFamily: 'Inter-Bold',
  },
  aiContainer: {
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
  },
  medicalInfoCard: {
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    marginBottom: 12,
  },
  medicalInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  medicalInfoIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  medicalInfoTitle: {
    fontSize: 15,
    fontFamily: 'Inter-SemiBold',
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    maxWidth: '100%',
  },
  chipText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  visitInfoCard: {
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    marginBottom: 12,
  },
  visitInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  visitIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  visitInfo: {
    flex: 1,
  },
  visitLabel: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    marginBottom: 2,
  },
  visitValue: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  actionsSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    marginBottom: 12,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    width: '48%',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 12,
  },
  actionGradient: {
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  actionIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  actionText: {
    fontSize: 13,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    textAlign: 'center',
  },
  // Step Indicator Styles
  stepIndicatorContainer: {
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    paddingTop: 10,
  },
  closeWorkflowButton: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  workflowTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepTitle: {
    fontSize: 13,
  },
  stepConnector: {
    flex: 1,
    height: 2,
    marginHorizontal: 8,
    borderRadius: 1,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    maxWidth: 340,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 20,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButtonCancel: {
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  modalButtonConfirm: {

  },
  modalButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  // Sidebar Styles
  sidebarOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  sidebarBackdrop: {
    flex: 1,
  },
  sidebar: {
    width: '85%',
    height: '100%',
    shadowColor: '#000',
    shadowOffset: { width: -2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  sidebarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    borderBottomWidth: 1,
  },
  sidebarTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
  },
  closeSidebarButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sidebarContent: {
    flex: 1,
    padding: 20,
  },
  timeline: {
    marginTop: 0,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  timelineLeft: {
    alignItems: 'center',
    marginRight: 16,
    width: 16,
  },
  timelineNode: {
    width: 12,
    height: 12,
    borderRadius: 6,
    zIndex: 1,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    marginTop: 4,
  },
  recordCard: {
    flex: 1,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
  },
  recordHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  recordIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  recordInfo: {
    flex: 1,
  },
  recordTitle: {
    fontSize: 15,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 2,
  },
  recordDate: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  recordDoctor: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    marginBottom: 4,
  },
  recordDetails: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    lineHeight: 18,
  },
});