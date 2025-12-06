// components/FollowUpAppointment.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { X, Save, Calendar, Clock, Bell, Check, ChevronDown, ChevronUp } from 'lucide-react-native';
import { darkTheme, lightTheme, useTheme } from '@/modules/shared/contexts/ThemeContext';

interface FollowUpAppointmentProps {
  patientName: string;
  patientId: string;
  onSave: (data: any) => void;
  onClose: () => void;
  isFullScreen?: boolean;
}

const followUpReasons = [
  'Routine Check-up',
  'Test Results Review',
  'Medication Review',
  'Symptom Monitoring',
  'Treatment Progress',
  'Post-operative Check',
  'Vaccination',
  'Other'
];

const timeSlots = [
  '08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM',
  '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM',
  '05:00 PM', '05:30 PM', '06:00 PM'
];

export default function FollowUpAppointment({ patientName, patientId, onSave, onClose, isFullScreen = false }: FollowUpAppointmentProps) {
  const { isDark } = useTheme();
  const colors = isDark ? darkTheme : lightTheme;

  const [date, setDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('09:00 AM');
  const [reason, setReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const [notes, setNotes] = useState('');
  const [sendReminder, setSendReminder] = useState(true);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleSave = () => {
    const appointmentData = {
      patientId,
      patientName,
      date: date.toISOString(),
      time: selectedTime,
      reason: reason === 'Other' ? customReason : reason,
      notes,
      sendReminder,
      created: new Date().toISOString(),
    };
    onSave(appointmentData);
  };

  const isValid = reason.trim() && date > new Date();

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getNextWeekday = () => {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    return nextWeek;
  };

  const getNextMonth = () => {
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    return nextMonth;
  };

  const QuickDateButton = ({ label, date: targetDate, onPress }: { label: string, date: Date, onPress: (date: Date) => void }) => (
    <TouchableOpacity
      onPress={() => onPress(targetDate)}
      style={[styles.quickDateButton, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}
    >
      <Text style={[styles.quickDateText, { color: colors.text }]}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: isDark ? 'rgba(15, 23, 42, 0.95)' : 'rgba(0, 0, 0, 0.5)' }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={[
          styles.content,
          { backgroundColor: colors.containerBg },
          isFullScreen && styles.fullScreenContent
        ]}>
          <View style={styles.header}>
            <View>
              <Text style={[styles.title, { color: colors.text }]}>Schedule Follow-up</Text>
              <Text style={[styles.subtitle, { color: colors.textTertiary }]}>{patientName}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={[styles.closeButton, { backgroundColor: colors.cardBg }]}>
              <X size={24} color={colors.text} strokeWidth={2} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
            {/* Date and Time Selection */}
            <View style={styles.section}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>Date & Time</Text>

              {/* Quick Date Selection */}
              <View style={styles.quickDatesContainer}>
                <Text style={[styles.quickDatesLabel, { color: colors.textTertiary }]}>Quick Select:</Text>
                <View style={styles.quickDatesRow}>
                  <QuickDateButton label="Tomorrow" date={new Date(Date.now() + 86400000)} onPress={setDate} />
                  <QuickDateButton label="Next Week" date={getNextWeekday()} onPress={setDate} />
                  <QuickDateButton label="Next Month" date={getNextMonth()} onPress={setDate} />
                </View>
              </View>

              <View style={styles.datetimeContainer}>
                <TouchableOpacity
                  onPress={() => setShowDatePicker(!showDatePicker)}
                  style={[styles.datetimeButton, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}
                >
                  <Calendar size={18} color={colors.textSecondary} />
                  <Text style={[styles.datetimeText, { color: colors.text }]}>
                    {formatDate(date)}
                  </Text>
                  {showDatePicker ? <ChevronUp size={16} color={colors.textSecondary} /> : <ChevronDown size={16} color={colors.textSecondary} />}
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setShowTimePicker(!showTimePicker)}
                  style={[styles.datetimeButton, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}
                >
                  <Clock size={18} color={colors.textSecondary} />
                  <Text style={[styles.datetimeText, { color: colors.text }]}>
                    {selectedTime}
                  </Text>
                  {showTimePicker ? <ChevronUp size={16} color={colors.textSecondary} /> : <ChevronDown size={16} color={colors.textSecondary} />}
                </TouchableOpacity>
              </View>

              {/* Custom Date Input */}
              {showDatePicker && (
                <View style={[styles.pickerContainer, { backgroundColor: colors.cardBg }]}>
                  <View style={styles.dateInputsContainer}>
                    <View style={styles.dateInput}>
                      <Text style={[styles.dateInputLabel, { color: colors.textTertiary }]}>Month</Text>
                      <TextInput
                        style={[styles.dateInputField, { color: colors.text, backgroundColor: colors.containerBg }]}
                        value={(date.getMonth() + 1).toString()}
                        onChangeText={(text) => {
                          const month = parseInt(text) - 1;
                          if (month >= 0 && month <= 11) {
                            const newDate = new Date(date);
                            newDate.setMonth(month);
                            setDate(newDate);
                          }
                        }}
                        placeholder="MM"
                        placeholderTextColor={colors.textTertiary}
                        keyboardType="numeric"
                        maxLength={2}
                      />
                    </View>
                    <View style={styles.dateInput}>
                      <Text style={[styles.dateInputLabel, { color: colors.textTertiary }]}>Day</Text>
                      <TextInput
                        style={[styles.dateInputField, { color: colors.text, backgroundColor: colors.containerBg }]}
                        value={date.getDate().toString()}
                        onChangeText={(text) => {
                          const day = parseInt(text);
                          if (day >= 1 && day <= 31) {
                            const newDate = new Date(date);
                            newDate.setDate(day);
                            setDate(newDate);
                          }
                        }}
                        placeholder="DD"
                        placeholderTextColor={colors.textTertiary}
                        keyboardType="numeric"
                        maxLength={2}
                      />
                    </View>
                    <View style={styles.dateInput}>
                      <Text style={[styles.dateInputLabel, { color: colors.textTertiary }]}>Year</Text>
                      <TextInput
                        style={[styles.dateInputField, { color: colors.text, backgroundColor: colors.containerBg }]}
                        value={date.getFullYear().toString()}
                        onChangeText={(text) => {
                          const year = parseInt(text);
                          if (year >= 2024 && year <= 2030) {
                            const newDate = new Date(date);
                            newDate.setFullYear(year);
                            setDate(newDate);
                          }
                        }}
                        placeholder="YYYY"
                        placeholderTextColor={colors.textTertiary}
                        keyboardType="numeric"
                        maxLength={4}
                      />
                    </View>
                  </View>
                </View>
              )}

              {/* Time Slots */}
              {showTimePicker && (
                <View style={[styles.pickerContainer, { backgroundColor: colors.cardBg }]}>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.timeSlotsContainer}>
                    {timeSlots.map((timeSlot, index) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => setSelectedTime(timeSlot)}
                        style={[
                          styles.timeSlot,
                          { backgroundColor: colors.containerBg, borderColor: colors.cardBorder },
                          selectedTime === timeSlot && styles.timeSlotSelected,
                        ]}
                      >
                        <Text style={[
                          styles.timeSlotText,
                          { color: colors.text },
                          selectedTime === timeSlot && styles.timeSlotTextSelected,
                        ]}>
                          {timeSlot}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              )}
            </View>

            {/* Reason for Follow-up */}
            <View style={styles.section}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>Reason for Follow-up</Text>
              <View style={styles.reasonsGrid}>
                {followUpReasons.map((followUpReason, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => setReason(followUpReason)}
                    style={[
                      styles.reasonChip,
                      { backgroundColor: colors.cardBg, borderColor: colors.cardBorder },
                      reason === followUpReason && styles.reasonChipSelected,
                    ]}
                  >
                    <Text style={[
                      styles.reasonChipText,
                      { color: colors.text },
                      reason === followUpReason && styles.reasonChipTextSelected,
                    ]}>
                      {followUpReason}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {reason === 'Other' && (
                <TextInput
                  style={[styles.input, { color: colors.text, backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}
                  value={customReason}
                  onChangeText={setCustomReason}
                  placeholder="Specify reason..."
                  placeholderTextColor={colors.textTertiary}
                />
              )}
            </View>

            {/* Additional Notes */}
            <View style={styles.section}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>Additional Notes</Text>
              <TextInput
                style={[styles.input, styles.textArea, { color: colors.text, backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}
                value={notes}
                onChangeText={setNotes}
                placeholder="Any specific instructions or notes for the follow-up..."
                placeholderTextColor={colors.textTertiary}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            {/* Reminder Option */}
            <View style={styles.section}>
              <TouchableOpacity
                onPress={() => setSendReminder(!sendReminder)}
                style={styles.reminderOption}
                activeOpacity={0.7}
              >
                <View style={[
                  styles.checkbox,
                  { backgroundColor: colors.cardBg, borderColor: colors.cardBorder },
                  sendReminder && styles.checkboxSelected,
                ]}>
                  {sendReminder && <Check size={14} color="#ffffff" strokeWidth={3} />}
                </View>
                <View style={styles.reminderTextContainer}>
                  <Text style={[styles.reminderTitle, { color: colors.text }]}>Send Reminder to Patient</Text>
                  <Text style={[styles.reminderSubtitle, { color: colors.textTertiary }]}>
                    Patient will receive SMS/email reminder 24 hours before appointment
                  </Text>
                </View>
                <Bell size={20} color={sendReminder ? '#10b981' : colors.textTertiary} />
              </TouchableOpacity>
            </View>

            {/* Appointment Summary */}
            <View style={[styles.summaryCard, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
              <Text style={[styles.summaryTitle, { color: colors.text }]}>Appointment Summary</Text>
              <View style={styles.summaryItem}>
                <Text style={[styles.summaryLabel, { color: colors.textTertiary }]}>Date:</Text>
                <Text style={[styles.summaryValue, { color: colors.text }]}>{formatDate(date)}</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={[styles.summaryLabel, { color: colors.textTertiary }]}>Time:</Text>
                <Text style={[styles.summaryValue, { color: colors.text }]}>{selectedTime}</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={[styles.summaryLabel, { color: colors.textTertiary }]}>Reason:</Text>
                <Text style={[styles.summaryValue, { color: colors.text }]}>{reason || 'Not specified'}</Text>
              </View>
              <View style={styles.summaryItem}>
                <Text style={[styles.summaryLabel, { color: colors.textTertiary }]}>Reminder:</Text>
                <Text style={[styles.summaryValue, { color: colors.text }]}>
                  {sendReminder ? 'Yes' : 'No'}
                </Text>
              </View>
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
                <Text style={styles.saveButtonText}>Schedule Follow-up</Text>
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
  fullScreenContent: {
    maxHeight: '100%',
    flex: 1,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
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
  quickDatesContainer: {
    marginBottom: 12,
  },
  quickDatesLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    marginBottom: 8,
  },
  quickDatesRow: {
    flexDirection: 'row',
    gap: 8,
  },
  quickDateButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
  },
  quickDateText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  datetimeContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  datetimeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  datetimeText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    flex: 1,
    marginLeft: 8,
  },
  pickerContainer: {
    marginTop: 12,
    padding: 16,
    borderRadius: 12,
  },
  dateInputsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  dateInput: {
    flex: 1,
  },
  dateInputLabel: {
    fontSize: 11,
    fontFamily: 'Inter-Medium',
    marginBottom: 6,
  },
  dateInputField: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    textAlign: 'center',
  },
  timeSlotsContainer: {
    flexDirection: 'row',
  },
  timeSlot: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    marginRight: 8,
  },
  timeSlotSelected: {
    backgroundColor: '#6366F1',
    borderColor: '#6366F1',
  },
  timeSlotText: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
  },
  timeSlotTextSelected: {
    color: '#ffffff',
  },
  reasonsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  reasonChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  reasonChipSelected: {
    backgroundColor: '#6366F1',
    borderColor: '#6366F1',
  },
  reasonChipText: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
  },
  reasonChipTextSelected: {
    color: '#ffffff',
  },
  input: {
    fontSize: 15,
    fontFamily: 'Inter-Regular',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 8,
  },
  textArea: {
    minHeight: 100,
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
    fontFamily: 'Inter-SemiBold',
  },
  reminderSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    lineHeight: 16,
  },
  summaryCard: {
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
  },
  summaryTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 12,
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  summaryLabel: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
  },
  summaryValue: {
    fontSize: 13,
    fontFamily: 'Inter-SemiBold',
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