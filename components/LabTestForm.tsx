// components/EnhancedLabTestForm.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { X, Save, Check, ChevronDown, Search, FileText, Clock, CheckCircle, AlertCircle } from 'lucide-react-native';
import { darkTheme, lightTheme, useTheme } from '@/modules/shared/contexts/ThemeContext';

interface LabTestFormProps {
  patientName: string;
  patientId: string;
  onSave: (data: any) => void;
  onClose: () => void;
  isFullScreen?: boolean;
}

interface LabTest {
  id: string;
  name: string;
  category: string;
}

interface LabTestOrder {
  id: string;
  testId: string;
  testName: string;
  status: 'pending' | 'completed' | 'cancelled';
  orderedDate: string;
  completedDate?: string;
  result?: string;
  reportUrl?: string;
}

const testCategories = [
  'Hematology',
  'Biochemistry',
  'Immunology',
  'Microbiology',
  'Endocrinology',
  'Toxicology',
  'Molecular Diagnostics'
];

const allTests: LabTest[] = [
  // Hematology
  { id: 'test_1', name: 'Complete Blood Count (CBC)', category: 'Hematology' },
  { id: 'test_2', name: 'Hemoglobin (Hb)', category: 'Hematology' },
  { id: 'test_3', name: 'Platelet Count', category: 'Hematology' },
  { id: 'test_4', name: 'ESR', category: 'Hematology' },

  // Biochemistry
  { id: 'test_5', name: 'Blood Glucose', category: 'Biochemistry' },
  { id: 'test_6', name: 'Lipid Profile', category: 'Biochemistry' },
  { id: 'test_7', name: 'Liver Function Test', category: 'Biochemistry' },
  { id: 'test_8', name: 'Kidney Function Test', category: 'Biochemistry' },
  { id: 'test_9', name: 'Thyroid Function Test', category: 'Biochemistry' },
  { id: 'test_10', name: 'HbA1c', category: 'Biochemistry' },

  // Immunology
  { id: 'test_11', name: 'HIV Test', category: 'Immunology' },
  { id: 'test_12', name: 'Hepatitis B Surface Antigen', category: 'Immunology' },
  { id: 'test_13', name: 'Hepatitis C Antibody', category: 'Immunology' },
  { id: 'test_14', name: 'RA Factor', category: 'Immunology' },

  // Microbiology
  { id: 'test_15', name: 'Urine Culture', category: 'Microbiology' },
  { id: 'test_16', name: 'Blood Culture', category: 'Microbiology' },
  { id: 'test_17', name: 'Stool Examination', category: 'Microbiology' },

  // Endocrinology
  { id: 'test_18', name: 'Testosterone', category: 'Endocrinology' },
  { id: 'test_19', name: 'Cortisol', category: 'Endocrinology' },
  { id: 'test_20', name: 'Vitamin D', category: 'Endocrinology' },
  { id: 'test_21', name: 'Vitamin B12', category: 'Endocrinology' },
];

const availableLabs = [
  { id: 'lab_1', name: 'HealthCare Diagnostics', location: 'Medical Center, Building A' },
  { id: 'lab_2', name: 'City Lab Services', location: 'Downtown Plaza, 2nd Floor' },
  { id: 'lab_3', name: 'Advanced Testing Lab', location: 'Hospital Complex, Wing C' },
  { id: 'lab_4', name: 'QuickTest Laboratory', location: 'Medical District, Suite 101' },
  { id: 'lab_5', name: 'Premium Diagnostics', location: 'Central Hospital, Block B' },
];

export default function EnhancedLabTestForm({ patientName, patientId, onSave, onClose, isFullScreen = false }: LabTestFormProps) {
  const { isDark } = useTheme();
  const colors = isDark ? darkTheme : lightTheme;

  const [selectedTests, setSelectedTests] = useState<LabTest[]>([]);
  const [customTest, setCustomTest] = useState('');
  const [notes, setNotes] = useState('');
  const [urgency, setUrgency] = useState<'routine' | 'urgent'>('routine');
  const [selectedLab, setSelectedLab] = useState<typeof availableLabs[0] | null>(null);
  const [showLabDropdown, setShowLabDropdown] = useState(false);
  const [showTestSearch, setShowTestSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [testOrders, setTestOrders] = useState<LabTestOrder[]>([]);

  const filteredTests = allTests.filter(test => {
    const matchesSearch = test.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || test.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleTest = (test: LabTest) => {
    if (selectedTests.find(t => t.id === test.id)) {
      setSelectedTests(selectedTests.filter(t => t.id !== test.id));
    } else {
      setSelectedTests([...selectedTests, test]);
    }
  };

  const addCustomTest = () => {
    if (customTest.trim()) {
      const newTest: LabTest = {
        id: `custom_${Date.now()}`,
        name: customTest.trim(),
        category: 'Custom'
      };
      setSelectedTests([...selectedTests, newTest]);
      setCustomTest('');
    }
  };

  const removeTest = (testId: string) => {
    setSelectedTests(selectedTests.filter(t => t.id !== testId));
  };

  const handleSave = () => {
    const labTestData = {
      patientId,
      patientName,
      tests: selectedTests,
      notes,
      urgency,
      lab: selectedLab,
      date: new Date().toISOString(),
      status: 'pending' as const,
    };

    // Create test orders
    const newOrders: LabTestOrder[] = selectedTests.map(test => ({
      id: `order_${Date.now()}_${test.id}`,
      testId: test.id,
      testName: test.name,
      status: 'pending',
      orderedDate: new Date().toISOString(),
    }));

    setTestOrders([...testOrders, ...newOrders]);
    onSave(labTestData);
  };

  const updateTestStatus = (orderId: string, status: LabTestOrder['status']) => {
    setTestOrders(testOrders.map(order =>
      order.id === orderId ? {
        ...order,
        status,
        completedDate: status === 'completed' ? new Date().toISOString() : order.completedDate
      } : order
    ));
  };

  const isValid = selectedTests.length > 0 && selectedLab !== null;

  const getStatusColor = (status: LabTestOrder['status']) => {
    switch (status) {
      case 'pending': return '#f59e0b';
      case 'completed': return '#10b981';
      case 'cancelled': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status: LabTestOrder['status']) => {
    switch (status) {
      case 'pending': return Clock;
      case 'completed': return CheckCircle;
      case 'cancelled': return AlertCircle;
      default: return Clock;
    }
  };

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
              <Text style={[styles.title, { color: colors.text }]}>Request Lab Tests</Text>
              <Text style={[styles.subtitle, { color: colors.textTertiary }]}>{patientName}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={[styles.closeButton, { backgroundColor: colors.cardBg }]}>
              <X size={24} color={colors.text} strokeWidth={2} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.form} showsVerticalScrollIndicator={false}>
            <View style={styles.section}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>Select Laboratory</Text>
              <TouchableOpacity
                onPress={() => setShowLabDropdown(true)}
                style={[styles.labSelector, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}
                activeOpacity={0.7}
              >
                {selectedLab ? (
                  <View style={styles.selectedLabContent}>
                    <View style={styles.selectedLabInfo}>
                      <Text style={[styles.selectedLabName, { color: colors.text }]}>{selectedLab.name}</Text>
                      <Text style={[styles.selectedLabLocation, { color: colors.textTertiary }]}>{selectedLab.location}</Text>
                    </View>
                  </View>
                ) : (
                  <Text style={[styles.labPlaceholder, { color: colors.textTertiary }]}>Choose a laboratory</Text>
                )}
                <ChevronDown size={20} color={colors.textSecondary} strokeWidth={2} />
              </TouchableOpacity>
            </View>

            <View style={styles.section}>
              <View style={styles.testsHeader}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>Select Tests</Text>
                <TouchableOpacity
                  onPress={() => setShowTestSearch(true)}
                  style={[styles.searchTestsButton, { backgroundColor: colors.accentLight }]}
                >
                  <Search size={16} color={colors.accent} strokeWidth={2} />
                  <Text style={[styles.searchTestsText, { color: colors.accent }]}>Browse Tests</Text>
                </TouchableOpacity>
              </View>

              {selectedTests.length > 0 && (
                <View style={styles.selectedTestsList}>
                  {selectedTests.map((test) => (
                    <View key={test.id} style={[styles.selectedTestItem, { backgroundColor: colors.cardBg }]}>
                      <View style={styles.selectedTestInfo}>
                        <Text style={[styles.selectedTestName, { color: colors.text }]}>{test.name}</Text>
                        <Text style={[styles.selectedTestCategory, { color: colors.textTertiary }]}>{test.category}</Text>
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
            </View>

            <View style={styles.section}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>Custom Test</Text>
              <View style={styles.customTestContainer}>
                <TextInput
                  style={[styles.customTestInput, { color: colors.text, backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}
                  value={customTest}
                  onChangeText={setCustomTest}
                  placeholder="Enter custom test name"
                  placeholderTextColor={colors.textTertiary}
                  returnKeyType="done"
                  onSubmitEditing={addCustomTest}
                />
                <TouchableOpacity
                  onPress={addCustomTest}
                  disabled={!customTest.trim()}
                  style={[styles.addCustomButton, !customTest.trim() && styles.buttonDisabled]}
                >
                  <Text style={[styles.addCustomButtonText, { color: colors.accent }]}>Add</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>Urgency</Text>
              <View style={styles.urgencyContainer}>
                <TouchableOpacity
                  onPress={() => setUrgency('routine')}
                  style={[
                    styles.urgencyButton,
                    { backgroundColor: colors.cardBg, borderColor: colors.cardBorder },
                    urgency === 'routine' && styles.urgencyButtonSelected,
                  ]}
                >
                  <Text style={[
                    styles.urgencyButtonText,
                    { color: colors.text },
                    urgency === 'routine' && styles.urgencyButtonTextSelected,
                  ]}>
                    Routine
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => setUrgency('urgent')}
                  style={[
                    styles.urgencyButton,
                    { backgroundColor: colors.cardBg, borderColor: colors.cardBorder },
                    urgency === 'urgent' && styles.urgencyButtonUrgent,
                  ]}
                >
                  <Text style={[
                    styles.urgencyButtonText,
                    { color: colors.text },
                    urgency === 'urgent' && styles.urgencyButtonTextUrgent,
                  ]}>
                    Urgent
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={[styles.label, { color: colors.textSecondary }]}>Additional Notes</Text>
              <TextInput
                style={[styles.input, styles.textArea, { color: colors.text, backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}
                value={notes}
                onChangeText={setNotes}
                placeholder="Any special instructions for the lab"
                placeholderTextColor={colors.textTertiary}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            {/* Test Orders Tracking */}
            {testOrders.length > 0 && (
              <View style={styles.section}>
                <Text style={[styles.label, { color: colors.textSecondary }]}>Test Orders</Text>
                <View style={styles.ordersList}>
                  {testOrders.map((order) => {
                    const StatusIcon = getStatusIcon(order.status);
                    return (
                      <View key={order.id} style={[styles.orderItem, { backgroundColor: colors.cardBg }]}>
                        <View style={styles.orderHeader}>
                          <Text style={[styles.orderTestName, { color: colors.text }]}>{order.testName}</Text>
                          <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(order.status)}20` }]}>
                            <StatusIcon size={12} color={getStatusColor(order.status)} />
                            <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </Text>
                          </View>
                        </View>
                        <Text style={[styles.orderDate, { color: colors.textTertiary }]}>
                          Ordered: {new Date(order.orderedDate).toLocaleDateString()}
                        </Text>
                        {order.status === 'pending' && (
                          <View style={styles.orderActions}>
                            <TouchableOpacity
                              onPress={() => updateTestStatus(order.id, 'completed')}
                              style={[styles.statusButton, { backgroundColor: '#10b981' }]}
                            >
                              <Text style={styles.statusButtonText}>Mark Complete</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              onPress={() => updateTestStatus(order.id, 'cancelled')}
                              style={[styles.statusButton, { backgroundColor: '#ef4444' }]}
                            >
                              <Text style={styles.statusButtonText}>Cancel</Text>
                            </TouchableOpacity>
                          </View>
                        )}
                        {order.status === 'completed' && order.reportUrl && (
                          <TouchableOpacity style={styles.viewReportButton}>
                            <FileText size={14} color="#6366F1" />
                            <Text style={[styles.viewReportText, { color: '#6366F1' }]}>View Report</Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    );
                  })}
                </View>
              </View>
            )}
          </ScrollView>

          <View style={styles.footer}>
            <TouchableOpacity
              onPress={handleSave}
              disabled={!isValid}
              style={[styles.saveButton, !isValid && styles.saveButtonDisabled]}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={isValid ? ['#f59e0b', '#d97706'] : ['#334155', '#1e293b']}
                style={styles.saveButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Save size={20} color="#ffffff" strokeWidth={2} />
                <Text style={styles.saveButtonText}>Send to Lab</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>

      {/* Lab Selection Modal */}
      <Modal
        visible={showLabDropdown}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLabDropdown(false)}
      >
        <View style={[styles.dropdownOverlay, { backgroundColor: isDark ? 'rgba(15, 23, 42, 0.8)' : 'rgba(0, 0, 0, 0.5)' }]}>
          <View style={[styles.dropdownContent, { backgroundColor: colors.containerBg }]}>
            <View style={styles.dropdownHeader}>
              <Text style={[styles.dropdownTitle, { color: colors.text }]}>Select Laboratory</Text>
              <TouchableOpacity onPress={() => setShowLabDropdown(false)}>
                <X size={24} color={colors.text} strokeWidth={2} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.labList} showsVerticalScrollIndicator={false}>
              {availableLabs.map((lab) => (
                <TouchableOpacity
                  key={lab.id}
                  onPress={() => {
                    setSelectedLab(lab);
                    setShowLabDropdown(false);
                  }}
                  style={[
                    styles.labOption,
                    { backgroundColor: colors.cardBg, borderColor: colors.cardBorder },
                    selectedLab?.id === lab.id && styles.labOptionSelected,
                  ]}
                  activeOpacity={0.7}
                >
                  <View style={styles.labOptionContent}>
                    <Text style={[styles.labOptionName, { color: colors.text }]}>{lab.name}</Text>
                    <Text style={[styles.labOptionLocation, { color: colors.textTertiary }]}>{lab.location}</Text>
                  </View>
                  {selectedLab?.id === lab.id && (
                    <View style={styles.selectedCheckmark}>
                      <Check size={18} color="#f59e0b" strokeWidth={3} />
                    </View>
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
        <View style={[styles.searchModal, { backgroundColor: isDark ? 'rgba(15, 23, 42, 0.95)' : 'rgba(0, 0, 0, 0.5)' }]}>
          <View style={[styles.searchContent, { backgroundColor: colors.containerBg }]}>
            <View style={styles.searchHeader}>
              <Text style={[styles.searchTitle, { color: colors.text }]}>Browse Tests</Text>
              <TouchableOpacity onPress={() => setShowTestSearch(false)}>
                <X size={24} color={colors.text} strokeWidth={2} />
              </TouchableOpacity>
            </View>

            <View style={[styles.searchInputContainer, { backgroundColor: colors.cardBg }]}>
              <Search size={20} color={colors.textSecondary} />
              <TextInput
                style={[styles.searchInput, { color: colors.text }]}
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Search tests..."
                placeholderTextColor={colors.textTertiary}
                autoFocus
              />
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
              {['All', ...testCategories].map((category) => (
                <TouchableOpacity
                  key={category}
                  onPress={() => setSelectedCategory(category)}
                  style={[
                    styles.categoryChip,
                    { backgroundColor: colors.cardBg },
                    selectedCategory === category && styles.categoryChipSelected,
                  ]}
                >
                  <Text style={[
                    styles.categoryChipText,
                    { color: colors.text },
                    selectedCategory === category && styles.categoryChipTextSelected,
                  ]}>
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <ScrollView style={styles.testsList} showsVerticalScrollIndicator={false}>
              {filteredTests.map((test) => {
                const isSelected = selectedTests.find(t => t.id === test.id);
                return (
                  <TouchableOpacity
                    key={test.id}
                    onPress={() => toggleTest(test)}
                    style={[
                      styles.testItem,
                      { backgroundColor: colors.cardBg },
                      isSelected && styles.testItemSelected,
                    ]}
                  >
                    {isSelected && (
                      <View style={styles.checkIcon}>
                        <Check size={14} color="#ffffff" strokeWidth={3} />
                      </View>
                    )}
                    <View style={styles.testInfo}>
                      <Text style={[styles.testName, { color: colors.text }]}>{test.name}</Text>
                      <Text style={[styles.testCategory, { color: colors.textTertiary }]}>{test.category}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <View style={styles.searchFooter}>
              <TouchableOpacity
                onPress={() => setShowTestSearch(false)}
                style={[styles.doneButton, { backgroundColor: colors.accent }]}
              >
                <Text style={styles.doneButtonText}>Done</Text>
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
    gap: 4,
  },
  searchTestsText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
  selectedTestsList: {
    gap: 8,
  },
  selectedTestItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
  },
  selectedTestInfo: {
    flex: 1,
  },
  selectedTestName: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 2,
  },
  selectedTestCategory: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  removeTestButton: {
    padding: 4,
  },
  customTestContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  customTestInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  addCustomButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  addCustomButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  urgencyContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  urgencyButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
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
    fontFamily: 'Inter-SemiBold',
  },
  urgencyButtonTextSelected: {
    color: '#ffffff',
  },
  urgencyButtonTextUrgent: {
    color: '#ffffff',
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
  ordersList: {
    gap: 12,
  },
  orderItem: {
    borderRadius: 12,
    padding: 12,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  orderTestName: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    flex: 1,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  statusText: {
    fontSize: 11,
    fontFamily: 'Inter-SemiBold',
  },
  orderDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginBottom: 8,
  },
  orderActions: {
    flexDirection: 'row',
    gap: 8,
  },
  statusButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  viewReportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
  },
  viewReportText: {
    fontSize: 12,
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
  labSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  selectedLabContent: {
    flex: 1,
    marginRight: 12,
  },
  selectedLabInfo: {
    gap: 2,
  },
  selectedLabName: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  selectedLabLocation: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  labPlaceholder: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  dropdownOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  dropdownContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 20,
    maxHeight: '70%',
    overflow: 'hidden',
  },
  dropdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(99, 102, 241, 0.1)',
  },
  dropdownTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
  },
  labList: {
    padding: 16,
  },
  labOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
  },
  labOptionSelected: {
    borderColor: '#f59e0b',
    backgroundColor: 'rgba(245, 158, 11, 0.08)',
  },
  labOptionContent: {
    flex: 1,
    gap: 4,
  },
  labOptionName: {
    fontSize: 15,
    fontFamily: 'Inter-SemiBold',
  },
  labOptionLocation: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  selectedCheckmark: {
    marginLeft: 12,
  },
  searchModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  searchContent: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 20,
    maxHeight: '80%',
    overflow: 'hidden',
  },
  searchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(99, 102, 241, 0.1)',
  },
  searchTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    margin: 16,
    borderRadius: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  categoriesScroll: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.2)',
  },
  categoryChipSelected: {
    backgroundColor: '#6366F1',
    borderColor: '#6366F1',
  },
  categoryChipText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  categoryChipTextSelected: {
    color: '#ffffff',
  },
  testsList: {
    padding: 16,
  },
  testItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
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
    fontFamily: 'Inter-SemiBold',
    marginBottom: 2,
  },
  testCategory: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  searchFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(99, 102, 241, 0.1)',
  },
  doneButton: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  doneButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
});