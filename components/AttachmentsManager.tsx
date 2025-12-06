// components/AttachmentsManager.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Modal, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { X, Upload, FileText, Image as ImageIcon, Mic, Trash2, Eye, Download } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { darkTheme, lightTheme, useTheme } from '@/modules/shared/contexts/ThemeContext';

interface Attachment {
  id: string;
  name: string;
  type: 'image' | 'pdf' | 'audio' | 'other';
  uri: string;
  size: number;
  uploadDate: string;
}

interface AttachmentsManagerProps {
  patientName: string;
  patientId: string;
  onClose: () => void;
  onUpload: (attachments: Attachment[]) => void;
}

export default function AttachmentsManager({ patientName, patientId, onClose, onUpload }: AttachmentsManagerProps) {
  const { isDark } = useTheme();
  const colors = isDark ? darkTheme : lightTheme;

  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [viewingAttachment, setViewingAttachment] = useState<Attachment | null>(null);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      const newAttachment: Attachment = {
        id: Date.now().toString(),
        name: `image_${Date.now()}.jpg`,
        type: 'image',
        uri: asset.uri,
        size: asset.fileSize || 0,
        uploadDate: new Date().toISOString(),
      };
      setAttachments([...attachments, newAttachment]);
    }
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*', 'audio/*'],
        copyToCacheDirectory: true,
      });

      if (result.assets && result.assets[0]) {
        const asset = result.assets[0];
        const fileType = asset.mimeType?.includes('pdf') ? 'pdf' : 
                        asset.mimeType?.includes('image') ? 'image' :
                        asset.mimeType?.includes('audio') ? 'audio' : 'other';

        const newAttachment: Attachment = {
          id: Date.now().toString(),
          name: asset.name || `document_${Date.now()}`,
          type: fileType,
          uri: asset.uri,
          size: asset.size || 0,
          uploadDate: new Date().toISOString(),
        };
        setAttachments([...attachments, newAttachment]);
      }
    } catch (error) {
      console.error('Error picking document:', error);
    }
  };

  const removeAttachment = (id: string) => {
    setAttachments(attachments.filter(att => att.id !== id));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image': return ImageIcon;
      case 'pdf': return FileText;
      case 'audio': return Mic;
      default: return FileText;
    }
  };

  const getFileColor = (type: string) => {
    switch (type) {
      case 'image': return '#10b981';
      case 'pdf': return '#ef4444';
      case 'audio': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const handleUpload = () => {
    onUpload(attachments);
    onClose();
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? 'rgba(15, 23, 42, 0.95)' : 'rgba(0, 0, 0, 0.5)' }]}>
      <View style={[styles.content, { backgroundColor: colors.containerBg }]}>
        <View style={styles.header}>
          <View>
            <Text style={[styles.title, { color: colors.text }]}>Manage Attachments</Text>
            <Text style={[styles.subtitle, { color: colors.textTertiary }]}>{patientName}</Text>
          </View>
          <TouchableOpacity onPress={onClose} style={[styles.closeButton, { backgroundColor: colors.cardBg }]}>
            <X size={24} color={colors.text} strokeWidth={2} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Upload Options */}
          <View style={styles.uploadSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Upload Files</Text>
            <View style={styles.uploadOptions}>
              <TouchableOpacity
                onPress={pickImage}
                style={[styles.uploadOption, { backgroundColor: colors.cardBg }]}
              >
                <LinearGradient
                  colors={['#10b981', '#059669']}
                  style={styles.uploadOptionIcon}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <ImageIcon size={24} color="#ffffff" strokeWidth={2} />
                </LinearGradient>
                <Text style={[styles.uploadOptionText, { color: colors.text }]}>Images</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={pickDocument}
                style={[styles.uploadOption, { backgroundColor: colors.cardBg }]}
              >
                <LinearGradient
                  colors={['#6366F1', '#4F46E5']}
                  style={styles.uploadOptionIcon}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <FileText size={24} color="#ffffff" strokeWidth={2} />
                </LinearGradient>
                <Text style={[styles.uploadOptionText, { color: colors.text }]}>Documents</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Attachments List */}
          <View style={styles.attachmentsSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Attachments ({attachments.length})
            </Text>

            {attachments.length === 0 ? (
              <View style={styles.emptyState}>
                <Upload size={48} color={colors.textTertiary} strokeWidth={1} />
                <Text style={[styles.emptyStateText, { color: colors.textTertiary }]}>
                  No attachments yet
                </Text>
                <Text style={[styles.emptyStateSubtext, { color: colors.textTertiary }]}>
                  Upload images, documents, or other files
                </Text>
              </View>
            ) : (
              <View style={styles.attachmentsList}>
                {attachments.map((attachment) => {
                  const FileIcon = getFileIcon(attachment.type);
                  const color = getFileColor(attachment.type);
                  
                  return (
                    <View
                      key={attachment.id}
                      style={[styles.attachmentItem, { backgroundColor: colors.cardBg }]}
                    >
                      <View style={styles.attachmentInfo}>
                        <View style={[styles.attachmentIcon, { backgroundColor: `${color}20` }]}>
                          <FileIcon size={20} color={color} strokeWidth={2} />
                        </View>
                        <View style={styles.attachmentDetails}>
                          <Text
                            style={[styles.attachmentName, { color: colors.text }]}
                            numberOfLines={1}
                          >
                            {attachment.name}
                          </Text>
                          <Text style={[styles.attachmentMeta, { color: colors.textTertiary }]}>
                            {formatFileSize(attachment.size)} • {new Date(attachment.uploadDate).toLocaleDateString()}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.attachmentActions}>
                        {attachment.type === 'image' && (
                          <TouchableOpacity
                            onPress={() => setViewingAttachment(attachment)}
                            style={styles.actionButton}
                          >
                            <Eye size={18} color={colors.textSecondary} />
                          </TouchableOpacity>
                        )}
                        <TouchableOpacity
                          onPress={() => removeAttachment(attachment.id)}
                          style={styles.actionButton}
                        >
                          <Trash2 size={18} color="#ef4444" />
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            onPress={handleUpload}
            disabled={attachments.length === 0}
            style={[styles.uploadButton, attachments.length === 0 && styles.uploadButtonDisabled]}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={attachments.length > 0 ? ['#6366F1', '#4F46E5'] : ['#334155', '#1e293b']}
              style={styles.uploadButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Upload size={20} color="#ffffff" strokeWidth={2} />
              <Text style={styles.uploadButtonText}>
                Upload {attachments.length > 0 ? `(${attachments.length})` : ''}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>

      {/* Image Viewer Modal */}
      <Modal
        visible={!!viewingAttachment}
        transparent
        animationType="fade"
        onRequestClose={() => setViewingAttachment(null)}
      >
        {viewingAttachment && (
          <View style={styles.imageViewer}>
            <TouchableOpacity
              style={styles.imageViewerClose}
              onPress={() => setViewingAttachment(null)}
            >
              <X size={24} color="#ffffff" strokeWidth={2} />
            </TouchableOpacity>
            <Image
              source={{ uri: viewingAttachment.uri }}
              style={styles.imageFullscreen}
              resizeMode="contain"
            />
          </View>
        )}
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
  scrollContent: {
    padding: 20,
  },
  uploadSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 16,
  },
  uploadOptions: {
    flexDirection: 'row',
    gap: 12,
  },
  uploadOption: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    borderRadius: 16,
    gap: 12,
  },
  uploadOptionIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadOptionText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  attachmentsSection: {
    marginBottom: 24,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    gap: 12,
  },
  emptyStateText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  emptyStateSubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
  attachmentsList: {
    gap: 12,
  },
  attachmentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
  },
  attachmentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  attachmentIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  attachmentDetails: {
    flex: 1,
    gap: 2,
  },
  attachmentName: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  attachmentMeta: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  attachmentActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 6,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(99, 102, 241, 0.1)',
  },
  uploadButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  uploadButtonDisabled: {
    opacity: 0.5,
  },
  uploadButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 8,
  },
  uploadButtonText: {
    fontSize: 15,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  imageViewer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageViewerClose: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1,
    padding: 8,
  },
  imageFullscreen: {
    width: '100%',
    height: '80%',
  },
});