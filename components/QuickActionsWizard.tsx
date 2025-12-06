// components/QuickActionsWizard.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, Dimensions, StatusBar, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { X, ChevronLeft, ChevronRight, Check, FileText, Pill, FlaskConical, Calendar, Upload } from 'lucide-react-native';
import { darkTheme, lightTheme, useTheme } from '@/modules/shared/contexts/ThemeContext';
import EnhancedPrescriptionForm from './PrescriptionForm';
import EnhancedLabTestForm from './LabTestForm';
import FollowUpAppointment from './FollowUpAppointment';
import AttachmentsManager from './AttachmentsManager';

interface QuickActionsWizardProps {
  patientName: string;
  patientId: string;
  onClose: () => void;
  onComplete: (data: any) => void;
}

interface WizardStep {
  id: number;
  title: string;
  icon: any;
  color: string;
  component: React.ComponentType<any>;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function QuickActionsWizard({ patientName, patientId, onClose, onComplete }: QuickActionsWizardProps) {
  const { isDark } = useTheme();
  const colors = isDark ? darkTheme : lightTheme;

  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [showAttachments, setShowAttachments] = useState(false);

  // Step data
  const steps: WizardStep[] = [
    {
      id: 1,
      title: 'Prescription',
      icon: Pill,
      color: '#10b981',
      component: EnhancedPrescriptionForm
    },
    {
      id: 2,
      title: 'Lab Tests',
      icon: FlaskConical,
      color: '#f59e0b',
      component: EnhancedLabTestForm
    },
    {
      id: 3,
      title: 'Follow-up',
      icon: Calendar,
      color: '#ec4899',
      component: FollowUpAppointment
    }
  ];

  const [formData, setFormData] = useState({
    prescription: null,
    labTests: null,
    followUp: null,
    attachments: []
  });

  const currentStepData = steps.find(step => step.id === currentStep);
  const CurrentComponent = currentStepData?.component;

  const handleStepComplete = (stepId: number, data: any) => {
    setFormData(prev => ({
      ...prev,
      [getStepDataKey(stepId)]: data
    }));

    if (!completedSteps.includes(stepId)) {
      setCompletedSteps([...completedSteps, stepId]);
    }
  };

  const getStepDataKey = (stepId: number): string => {
    switch (stepId) {
      case 1: return 'prescription';
      case 2: return 'labTests';
      case 3: return 'followUp';
      default: return '';
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    onComplete(formData);
    onClose();
  };

  const handleComponentSave = (data: any) => {
    handleStepComplete(currentStep, data);
    if (currentStep === steps.length) {
      handleComplete();
    } else {
      handleNext();
    }
  };

  const isStepCompleted = (stepId: number) => completedSteps.includes(stepId);

  const getProgressPercentage = () => {
    return ((currentStep - 1) / (steps.length - 1)) * 100;
  };

  const handleSkipStep = () => {
    if (currentStep < steps.length) {
      handleNext();
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.containerBg }]}>
      <StatusBar backgroundColor={colors.containerBg} barStyle={isDark ? 'light-content' : 'dark-content'} />
      
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.cardBorder }]}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={onClose} style={[styles.closeButton, { backgroundColor: colors.cardBg }]}>
            <X size={22} color={colors.text} strokeWidth={2} />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={[styles.headerTitle, { color: colors.text }]}>Complete Patient Workflow</Text>
            <Text style={[styles.headerSubtitle, { color: colors.textTertiary }]}>{patientName}</Text>
          </View>
          <View style={{ width: 40 }} />
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={[styles.progressBackground, { backgroundColor: colors.cardBorder }]}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  backgroundColor: colors.accent,
                  width: `${getProgressPercentage()}%`
                }
              ]} 
            />
          </View>
        </View>

        {/* Step Indicators */}
        <View style={styles.stepsContainer}>
          {steps.map((step, index) => {
            const StepIcon = step.icon;
            const isActive = currentStep === step.id;
            const isCompleted = isStepCompleted(step.id);
            const isLast = index === steps.length - 1;

            return (
              <React.Fragment key={step.id}>
                <View style={styles.stepItem}>
                  <TouchableOpacity
                    onPress={() => setCurrentStep(step.id)}
                    style={[
                      styles.stepCircle,
                      { borderColor: colors.cardBorder },
                      isActive && { borderColor: step.color },
                      isCompleted && { backgroundColor: step.color, borderColor: step.color },
                    ]}
                  >
                    {isCompleted ? (
                      <Check size={16} color="#ffffff" strokeWidth={3} />
                    ) : (
                      <StepIcon size={16} color={isActive ? step.color : colors.textTertiary} strokeWidth={2} />
                    )}
                  </TouchableOpacity>
                  
                  <Text style={[
                    styles.stepTitle,
                    { color: colors.textTertiary },
                    (isActive || isCompleted) && { color: colors.text }
                  ]}>
                    {step.title}
                  </Text>
                </View>

                {!isLast && (
                  <View 
                    style={[
                      styles.stepConnector,
                      { backgroundColor: colors.cardBorder },
                      (index < currentStep - 1) && { backgroundColor: steps[index].color }
                    ]} 
                  />
                )}
              </React.Fragment>
            );
          })}
        </View>
      </View>

      {/* Current Step Content */}
      <View style={styles.stepContentContainer}>
        {CurrentComponent && (
          <CurrentComponent
            patientName={patientName}
            patientId={patientId}
            onSave={handleComponentSave}
            onClose={onClose}
            wizardMode={true}
            onSkip={handleSkipStep}
            showSkip={currentStep < steps.length}
          />
        )}
      </View>

      {/* Navigation Footer */}
      <View style={[styles.footer, { borderTopColor: colors.cardBorder }]}>
        <View style={styles.footerActions}>
          <TouchableOpacity
            onPress={handlePrevious}
            disabled={currentStep === 1}
            style={[
              styles.navButton,
              styles.secondaryButton,
              { backgroundColor: colors.cardBg, borderColor: colors.cardBorder },
              currentStep === 1 && styles.navButtonDisabled
            ]}
          >
            <ChevronLeft size={18} color={currentStep === 1 ? colors.textTertiary : colors.text} />
            <Text style={[
              styles.navButtonText,
              { color: colors.text },
              currentStep === 1 && { color: colors.textTertiary }
            ]}>
              Previous
            </Text>
          </TouchableOpacity>

          {/* Attachments Button */}
          <TouchableOpacity
            onPress={() => setShowAttachments(true)}
            style={[styles.attachmentsButton, { backgroundColor: colors.accentLight }]}
          >
            <Upload size={16} color={colors.accent} />
            <Text style={[styles.attachmentsButtonText, { color: colors.accent }]}>
              Attachments {formData.attachments.length > 0 ? `(${formData.attachments.length})` : ''}
            </Text>
          </TouchableOpacity>

          <View style={styles.primaryActions}>
            {currentStep < steps.length && (
              <TouchableOpacity
                onPress={handleSkipStep}
                style={[styles.skipButton, { borderColor: colors.cardBorder }]}
              >
                <Text style={[styles.skipButtonText, { color: colors.textTertiary }]}>Skip</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity
              onPress={handleNext}
              style={[
                styles.navButton,
                styles.primaryButton,
                { backgroundColor: colors.accent }
              ]}
            >
              <Text style={styles.primaryButtonText}>
                {currentStep === steps.length ? 'Complete' : 'Next'}
              </Text>
              <ChevronRight size={18} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Step Navigation Dots */}
        <View style={styles.stepDots}>
          {steps.map((step, index) => (
            <TouchableOpacity
              key={step.id}
              onPress={() => setCurrentStep(step.id)}
              style={[
                styles.stepDot,
                { backgroundColor: colors.cardBorder },
                currentStep === step.id && [styles.stepDotActive, { backgroundColor: step.color }],
                isStepCompleted(step.id) && { backgroundColor: step.color }
              ]}
            />
          ))}
        </View>
      </View>

      {/* Attachments Modal */}
      <Modal
        visible={showAttachments}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAttachments(false)}
      >
        <AttachmentsManager
          patientName={patientName}
          patientId={patientId}
          onUpload={(attachments) => {
            setFormData(prev => ({ ...prev, attachments }));
            setShowAttachments(false);
          }}
          onClose={() => setShowAttachments(false)}
        />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: screenWidth,
    height: screenHeight,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 50 : (StatusBar.currentHeight || 0) + 10,
    paddingBottom: 20,
    borderBottomWidth: 1,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleContainer: {
    alignItems: 'center',
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  progressContainer: {
    marginBottom: 24,
  },
  progressBackground: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  stepsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepItem: {
    alignItems: 'center',
    flex: 1,
  },
  stepCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  stepTitle: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    textAlign: 'center',
  },
  stepConnector: {
    flex: 1,
    height: 2,
    marginHorizontal: 4,
    marginBottom: 18,
  },
  stepContentContainer: {
    flex: 1,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    backgroundColor: 'transparent',
  },
  footerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
    minWidth: 100,
  },
  secondaryButton: {
    borderWidth: 1,
  },
  primaryButton: {
    minWidth: 100,
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  navButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  primaryButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  attachmentsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
  },
  attachmentsButtonText: {
    fontSize: 13,
    fontFamily: 'Inter-SemiBold',
  },
  primaryActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  skipButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  skipButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  stepDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  stepDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  stepDotActive: {
    width: 20,
  },
});