import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, StatusBar, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { ArrowLeft, FlaskConical, User, Stethoscope, CheckSquare, Upload, X, Eye } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme, lightTheme, darkTheme } from '../../contexts/ThemeContext';
import { useLabRequests, UploadedFile } from '../../contexts/LabRequestContext';
import * as DocumentPicker from 'expo-document-picker';

export default function ProcessRequestScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { isDark } = useTheme();
  const colors = isDark ? darkTheme : lightTheme;
  const { getRequestById, updateRequestStatus } = useLabRequests();

  const requestId = params.requestId ? parseInt(params.requestId as string) : null;
  const request = requestId ? getRequestById(requestId) : null;

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setUploadedFiles([]);
    setUploading(false);
  }, [requestId]);

  if (!request) {
    return (
      <View style={[styles.container, { backgroundColor: colors.containerBg }]}>
        <Text style={[styles.errorText, { color: colors.text }]}>Request not found</Text>
      </View>
    );
  }

  const handleFileUpload = async () => {
    try {
      setUploading(true);
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        multiple: true,
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        setUploading(false);
        return;
      }

      const newFiles: UploadedFile[] = result.assets.map((asset) => {
        const fileType = asset.mimeType?.startsWith('image/') ? 'image' : 'pdf';
        return {
          id: Date.now().toString() + Math.random().toString(36),
          name: asset.name,
          type: fileType as 'pdf' | 'image',
          uri: asset.uri,
          size: asset.size || 0,
        };
      });

      setUploadedFiles((prev) => [...prev, ...newFiles]);
      setUploading(false);
    } catch (error) {
      setUploading(false);
      Alert.alert('Error', 'Failed to upload file. Please try again.');
    }
  };

  const handleRemoveFile = (id: string) => {
    setUploadedFiles((prev) => prev.filter(file => file.id !== id));
  };

  const handlePreviewFile = (file: UploadedFile) => {
    Alert.alert('File Preview', `Preview for ${file.name}\n\nThis would open a full preview in a production app.`);
  };

  const handleSubmit = () => {
    if (uploadedFiles.length === 0 || !requestId) return;

    updateRequestStatus(requestId, uploadedFiles);

    router.push({
      pathname: '/success-confirmation',
      params: {
        requestId: requestId.toString(),
      },
    });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.containerBg }]}>
      <LinearGradient colors={colors.background} style={styles.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} />

      <View style={[styles.header, { paddingTop: Platform.OS === 'ios' ? 50 : (StatusBar.currentHeight || 0) + 10 }]}>
        <TouchableOpacity onPress={() => router.back()} style={[styles.backButton, { backgroundColor: colors.accentLight }]}>
          <ArrowLeft size={22} color={colors.accent} strokeWidth={2} />
        </TouchableOpacity>

        <View style={styles.headerTitleContainer}>
          <FlaskConical size={24} color={colors.accent} strokeWidth={2} />
          <Text style={[styles.headerTitle, { color: colors.text }]}>Process Request</Text>
        </View>

        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: 100, type: 'spring' }}
          style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}
        >
          <View style={styles.cardHeader}>
            <View style={[styles.iconBadge, { backgroundColor: `${colors.accent}15` }]}>
              <User size={20} color={colors.accent} strokeWidth={2} />
            </View>
            <Text style={[styles.cardTitle, { color: colors.text }]}>Patient Info</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.textTertiary }]}>Name:</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>{request.patient}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.textTertiary }]}>Patient ID:</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>{request.patientId}</Text>
          </View>
        </MotiView>

        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: 200, type: 'spring' }}
          style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}
        >
          <View style={styles.cardHeader}>
            <View style={[styles.iconBadge, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
              <Stethoscope size={20} color="#10b981" strokeWidth={2} />
            </View>
            <Text style={[styles.cardTitle, { color: colors.text }]}>Doctor & Hospital</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.textTertiary }]}>Doctor:</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>{request.doctor}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: colors.textTertiary }]}>Hospital:</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>{request.hospital}</Text>
          </View>
        </MotiView>

        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: 300, type: 'spring' }}
          style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}
        >
          <View style={styles.cardHeader}>
            <View style={[styles.iconBadge, { backgroundColor: 'rgba(245, 158, 11, 0.15)' }]}>
              <CheckSquare size={20} color="#f59e0b" strokeWidth={2} />
            </View>
            <Text style={[styles.cardTitle, { color: colors.text }]}>Requested Tests</Text>
          </View>
          {request.tests.map((test: string, index: number) => (
            <View key={index} style={styles.testItem}>
              <View style={[styles.testCheckbox, { backgroundColor: `${colors.accent}15`, borderColor: colors.accent }]}>
                <Text style={[styles.checkmark, { color: colors.accent }]}>✓</Text>
              </View>
              <Text style={[styles.testName, { color: colors.text }]}>{test}</Text>
            </View>
          ))}
        </MotiView>

        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: 400, type: 'spring' }}
          style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}
        >
          <View style={styles.cardHeader}>
            <View style={[styles.iconBadge, { backgroundColor: 'rgba(59, 130, 246, 0.15)' }]}>
              <Upload size={20} color="#3b82f6" strokeWidth={2} />
            </View>
            <Text style={[styles.cardTitle, { color: colors.text }]}>Upload Files</Text>
          </View>

          <Text style={[styles.uploadSubtitle, { color: colors.textTertiary }]}>
            Select and upload the files of your choice
          </Text>

          <View style={[styles.uploadZoneContainer, { borderColor: colors.cardBorder }]}>
            <TouchableOpacity
              onPress={handleFileUpload}
              disabled={uploading}
              style={[styles.uploadZone, { borderColor: colors.accent }]}
              activeOpacity={0.7}
            >
              <Upload size={32} color={colors.textTertiary} strokeWidth={1.5} />
              <Text style={[styles.uploadZoneTitle, { color: colors.text }]}>
                Choose a file or drag & drop it here
              </Text>
              <Text style={[styles.uploadZoneSubtitle, { color: colors.textTertiary }]}>
                JPEG, PNG, PDF formats, up to 50MB
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleFileUpload}
              disabled={uploading}
              style={styles.browseButton}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={uploading ? ['#94a3b8', '#64748b'] : ['#3b82f6', '#2563eb']}
                style={styles.browseGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.browseButtonText}>
                  {uploading ? 'Uploading...' : 'Browse File'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {uploadedFiles.length > 0 && (
            <View style={styles.uploadedFilesContainer}>
              <View style={[styles.divider, { backgroundColor: colors.cardBorder }]} />
              {uploadedFiles.map((file) => (
                <MotiView
                  key={file.id}
                  from={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring' }}
                  style={[styles.fileItem, { backgroundColor: colors.containerBg, borderColor: colors.cardBorder }]}
                >
                  <View style={styles.fileLeft}>
                    <View style={[styles.fileIcon, { backgroundColor: file.type === 'pdf' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(139, 92, 246, 0.15)' }]}>
                      <Text style={styles.fileIconText}>{file.type === 'pdf' ? '📄' : '🖼️'}</Text>
                    </View>
                    <View style={styles.fileInfo}>
                      <Text style={[styles.fileName, { color: colors.text }]} numberOfLines={1}>{file.name}</Text>
                      <Text style={[styles.fileType, { color: colors.textTertiary }]}>
                        {formatFileSize(file.size)}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.fileActions}>
                    <TouchableOpacity
                      onPress={() => handlePreviewFile(file)}
                      style={[styles.actionButton, { backgroundColor: colors.accentLight }]}
                    >
                      <Eye size={16} color={colors.accent} strokeWidth={2} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleRemoveFile(file.id)}
                      style={[styles.actionButton, { backgroundColor: 'rgba(239, 68, 68, 0.1)' }]}
                    >
                      <X size={16} color="#ef4444" strokeWidth={2} />
                    </TouchableOpacity>
                  </View>
                </MotiView>
              ))}
            </View>
          )}
        </MotiView>
      </ScrollView>

      <View style={[styles.footer, { backgroundColor: colors.containerBg, borderTopColor: colors.cardBorder }]}>
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={uploadedFiles.length === 0}
          style={[styles.submitButton, uploadedFiles.length === 0 && styles.submitButtonDisabled]}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={uploadedFiles.length === 0 ? ['#94a3b8', '#64748b'] : ['#10b981', '#059669']}
            style={styles.submitGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Upload size={20} color="#ffffff" strokeWidth={2} />
            <Text style={styles.submitButtonText}>Submit Report</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
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
    backgroundColor: 'transparent',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 120,
  },
  card: {
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  iconBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
    gap: 8,
  },
  infoLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    width: 90,
  },
  infoValue: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    flex: 1,
  },
  testItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  testCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
  },
  testName: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    flex: 1,
  },
  uploadSubtitle: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    marginBottom: 16,
    marginTop: -8,
  },
  uploadZoneContainer: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  uploadZone: {
    width: '100%',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 12,
    paddingVertical: 32,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  uploadZoneTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginTop: 12,
    marginBottom: 6,
    textAlign: 'center',
  },
  uploadZoneSubtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
  browseButton: {
    borderRadius: 10,
    overflow: 'hidden',
    minWidth: 140,
  },
  browseGradient: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  browseButtonText: {
    fontSize: 13,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  uploadedFilesContainer: {
    marginTop: 0,
  },
  divider: {
    height: 1,
    marginBottom: 16,
  },
  fileItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  fileLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  fileIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fileIconText: {
    fontSize: 18,
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: 13,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 2,
  },
  fileType: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
  },
  fileActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    borderTopWidth: 1,
  },
  submitButton: {
    width: '70%',
    alignSelf: 'center',
    borderRadius: 16,
    overflow: 'hidden',
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
  },
  submitButtonText: {
    fontSize: 15,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  errorText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    marginTop: 100,
  },
});
