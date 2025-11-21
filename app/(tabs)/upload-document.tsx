import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { ArrowLeft, Upload, FileText, Pill, Receipt, FileHeart, FileCheck, CheckCircle2, Image as ImageIcon } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useTheme, lightTheme, darkTheme } from '../../contexts/ThemeContext';

type DocumentType = 'report' | 'prescription' | 'invoice' | 'discharge' | 'consultation' | 'imaging';

interface SelectedFile {
  id: string;
  name: string;
  size: number;
  uri: string;
}

export default function UploadDocumentScreen() {
  const router = useRouter();
  const { isDark } = useTheme();
  const colors = isDark ? darkTheme : lightTheme;

  const [selectedType, setSelectedType] = useState<DocumentType | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const documentTypes: { id: DocumentType; label: string; icon: any; color: string; description: string }[] = [
    { id: 'report', label: 'Lab Report', icon: FileText, color: '#6366F1', description: 'Blood work, test results' },
    { id: 'prescription', label: 'Prescription', icon: Pill, color: '#10B981', description: 'Medicine prescriptions' },
    { id: 'invoice', label: 'Invoice', icon: Receipt, color: '#F59E0B', description: 'Payment receipts' },
    { id: 'discharge', label: 'Discharge Summary', icon: FileHeart, color: '#EF4444', description: 'Hospital discharge docs' },
    { id: 'consultation', label: 'Consultation Notes', icon: FileCheck, color: '#3B82F6', description: 'Doctor consultation notes' },
    { id: 'imaging', label: 'Medical Imaging', icon: ImageIcon, color: '#8B5CF6', description: 'X-rays, MRI, CT scans' },
  ];

  const handlePickDocuments = () => {
    if (Platform.OS === 'web') {
      const input = document.createElement('input');
      input.type = 'file';
      input.multiple = true;
      input.accept = 'application/pdf,image/*';
      input.onchange = (e: any) => {
        const files = Array.from(e.target.files || []) as File[];
        const newFiles: SelectedFile[] = files.map((file: File, index) => ({
          id: `file_${Date.now()}_${index}`,
          name: file.name,
          size: file.size,
          uri: URL.createObjectURL(file),
        }));
        setSelectedFiles([...selectedFiles, ...newFiles]);
      };
      input.click();
    } else {
      const mockFiles: SelectedFile[] = [
        {
          id: `file_${Date.now()}_0`,
          name: 'medical_report.pdf',
          size: 245678,
          uri: 'mock://file1',
        },
      ];
      setSelectedFiles([...selectedFiles, ...mockFiles]);
    }
  };

  const removeFile = (fileId: string) => {
    setSelectedFiles(selectedFiles.filter(f => f.id !== fileId));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleUpload = async () => {
    if (!selectedType || selectedFiles.length === 0) return;

    setUploading(true);

    await new Promise(resolve => setTimeout(resolve, 2500));

    console.log('Simulated API call:', {
      documentType: selectedType,
      files: selectedFiles.map(f => ({ name: f.name, size: f.size })),
      uploadedAt: new Date().toISOString(),
    });

    setUploading(false);
    setUploadSuccess(true);

    setTimeout(() => {
      router.replace('/(tabs)/timeline');
    }, 1800);
  };

  if (uploadSuccess) {
    return (
      <View style={[styles.container, { backgroundColor: colors.containerBg }]}>
        <LinearGradient
          colors={colors.background as any}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />

        <View style={styles.successContainer}>
          <MotiView
            from={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', damping: 15, delay: 100 }}
            style={styles.successIconWrapper}
          >
            <LinearGradient
              colors={['#10B981', '#059669']}
              style={styles.successGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <CheckCircle2 size={64} color="#ffffff" strokeWidth={2} />
            </LinearGradient>
          </MotiView>

          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ delay: 400 }}
          >
            <Text style={[styles.successTitle, { color: colors.text }]}>Upload Successful</Text>
            <Text style={[styles.successSubtitle, { color: colors.textSecondary }]}>
              Syncing your timeline...
            </Text>
          </MotiView>

          <MotiView
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 600, loop: true, duration: 1000, repeatReverse: true }}
            style={styles.syncIndicator}
          >
            <View style={styles.syncDots}>
              {[0, 1, 2].map(i => (
                <View key={i} style={[styles.syncDot, { backgroundColor: colors.accent }]} />
              ))}
            </View>
          </MotiView>
        </View>
      </View>
    );
  }

  if (uploading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.containerBg }]}>
        <LinearGradient
          colors={colors.background as any}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />

        <View style={styles.uploadingContainer}>
          <MotiView
            from={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', damping: 15 }}
            style={styles.uploadingBox}
          >
            <MotiView
              animate={{ rotate: '360deg' }}
              transition={{ type: 'timing', duration: 2000, loop: true }}
            >
              <Upload size={48} color={colors.accent} strokeWidth={2} />
            </MotiView>

            <Text style={[styles.uploadingTitle, { color: colors.text }]}>Uploading Documents</Text>
            <Text style={[styles.uploadingSubtitle, { color: colors.textSecondary }]}>
              {selectedFiles.length} file{selectedFiles.length !== 1 ? 's' : ''} • {selectedType}
            </Text>

            <View style={styles.progressBar}>
              <MotiView
                from={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ type: 'timing', duration: 2000 }}
                style={[styles.progressFill, { backgroundColor: colors.accent }]}
              />
            </View>

            <Text style={[styles.uploadingStatus, { color: colors.textTertiary }]}>
              Updating... Syncing your timeline
            </Text>
          </MotiView>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.containerBg }]}>
      <LinearGradient
        colors={colors.background as any}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={[styles.backButton, { backgroundColor: colors.iconButton, borderColor: colors.iconButtonBorder }]}>
          <ArrowLeft size={22} color={colors.text} strokeWidth={2} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Upload Document</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: 100 }}
          style={styles.section}
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Select Document Type</Text>
          <View style={styles.typesGrid}>
            {documentTypes.map((type, index) => {
              const Icon = type.icon;
              const isSelected = selectedType === type.id;

              return (
                <MotiView
                  key={type.id}
                  from={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 200 + index * 50 }}
                  style={styles.typeWrapper}
                >
                  <TouchableOpacity
                    onPress={() => setSelectedType(type.id)}
                    style={[
                      styles.typeCard,
                      { backgroundColor: colors.cardBg, borderColor: isSelected ? type.color : colors.cardBorder },
                      isSelected && styles.typeCardSelected,
                    ]}
                    activeOpacity={0.7}
                  >
                    <View style={[styles.typeIcon, { backgroundColor: `${type.color}15` }]}>
                      <Icon size={24} color={type.color} strokeWidth={2} />
                    </View>
                    <Text style={[styles.typeLabel, { color: colors.text }]}>{type.label}</Text>
                    <Text style={[styles.typeDescription, { color: colors.textTertiary }]} numberOfLines={2}>{type.description}</Text>
                  </TouchableOpacity>
                </MotiView>
              );
            })}
          </View>
        </MotiView>

        {selectedType && (
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            style={styles.section}
          >
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Select Files</Text>

            <TouchableOpacity onPress={handlePickDocuments} style={styles.pickButton}>
              <LinearGradient
                colors={['rgba(99, 102, 241, 0.1)', 'rgba(129, 140, 248, 0.1)']}
                style={styles.pickGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Upload size={20} color={colors.accent} strokeWidth={2} />
                <Text style={[styles.pickText, { color: colors.accent }]}>Choose Files</Text>
              </LinearGradient>
            </TouchableOpacity>

            {selectedFiles.length > 0 && (
              <View style={styles.filesList}>
                {selectedFiles.map((file, index) => (
                  <MotiView
                    key={file.id}
                    from={{ opacity: 0, translateX: -20 }}
                    animate={{ opacity: 1, translateX: 0 }}
                    transition={{ delay: index * 50 }}
                    style={[styles.fileItem, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}
                  >
                    <View style={styles.fileInfo}>
                      <FileText size={20} color={colors.accent} strokeWidth={2} />
                      <View style={styles.fileDetails}>
                        <Text style={[styles.fileName, { color: colors.text }]} numberOfLines={1}>{file.name}</Text>
                        <Text style={[styles.fileSize, { color: colors.textTertiary }]}>{formatFileSize(file.size)}</Text>
                      </View>
                    </View>
                    <TouchableOpacity onPress={() => removeFile(file.id)} style={styles.removeButton}>
                      <Text style={[styles.removeText, { color: colors.error }]}>Remove</Text>
                    </TouchableOpacity>
                  </MotiView>
                ))}
              </View>
            )}

            {selectedFiles.length > 0 && (
              <TouchableOpacity onPress={handleUpload} style={styles.uploadFinalButton}>
                <LinearGradient
                  colors={['#6366F1', '#818CF8']}
                  style={styles.uploadFinalGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Upload size={20} color="#ffffff" strokeWidth={2} />
                  <Text style={styles.uploadFinalText}>
                    Upload {selectedFiles.length} File{selectedFiles.length !== 1 ? 's' : ''}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
          </MotiView>
        )}
      </ScrollView>
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
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 16,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    marginBottom: 16,
  },
  typesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  typeWrapper: {
    width: '48%',
  },
  typeCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    minHeight: 140,
  },
  typeCardSelected: {
    borderWidth: 2,
  },
  typeIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  typeLabel: {
    fontSize: 15,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
  },
  typeDescription: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    lineHeight: 16,
  },
  pickButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  pickGradient: {
    flexDirection: 'row',
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  pickText: {
    fontSize: 15,
    fontFamily: 'Inter-SemiBold',
  },
  filesList: {
    gap: 10,
    marginBottom: 16,
  },
  fileItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
  },
  fileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  fileDetails: {
    flex: 1,
  },
  fileName: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 2,
  },
  fileSize: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  removeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  removeText: {
    fontSize: 13,
    fontFamily: 'Inter-SemiBold',
  },
  uploadFinalButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  uploadFinalGradient: {
    flexDirection: 'row',
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  uploadFinalText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  uploadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  uploadingBox: {
    alignItems: 'center',
  },
  uploadingTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginTop: 24,
    marginBottom: 8,
  },
  uploadingSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginBottom: 32,
  },
  progressBar: {
    width: 240,
    height: 6,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 16,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  uploadingStatus: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
  },
  successContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  successIconWrapper: {
    marginBottom: 32,
  },
  successGradient: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successTitle: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  successSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    marginBottom: 32,
  },
  syncIndicator: {
    marginTop: 24,
  },
  syncDots: {
    flexDirection: 'row',
    gap: 8,
  },
  syncDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
