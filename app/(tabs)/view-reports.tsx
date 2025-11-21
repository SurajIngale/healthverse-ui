import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { ArrowLeft, User, Stethoscope, Building2, FileText, Image as ImageIcon, Download, Eye } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTheme, lightTheme, darkTheme } from '../../contexts/ThemeContext';
import { useLabRequests } from '../../contexts/LabRequestContext';

export default function ViewReportsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { isDark } = useTheme();
  const colors = isDark ? darkTheme : lightTheme;
  const { getRequestById } = useLabRequests();

  const requestId = params.requestId ? parseInt(params.requestId as string) : null;
  const request = requestId ? getRequestById(requestId) : null;

  if (!request) {
    return (
      <View style={[styles.container, { backgroundColor: colors.containerBg }]}>
        <Text style={[styles.errorText, { color: colors.text }]}>Request not found</Text>
      </View>
    );
  }

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

        <Text style={[styles.headerTitle, { color: colors.text }]}>View Reports</Text>

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
            <View style={[styles.iconBadge, { backgroundColor: 'rgba(59, 130, 246, 0.15)' }]}>
              <FileText size={20} color="#3b82f6" strokeWidth={2} />
            </View>
            <Text style={[styles.cardTitle, { color: colors.text }]}>Uploaded Reports</Text>
          </View>

          {request.uploadedFiles.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={[styles.emptyText, { color: colors.textTertiary }]}>No reports uploaded yet</Text>
            </View>
          ) : (
            request.uploadedFiles.map((file, index) => (
              <MotiView
                key={file.id}
                from={{ opacity: 0, translateX: -20 }}
                animate={{ opacity: 1, translateX: 0 }}
                transition={{ delay: 400 + index * 100, type: 'spring' }}
                style={[styles.fileCard, { backgroundColor: colors.containerBg, borderColor: colors.cardBorder }]}
              >
                <View style={styles.fileLeft}>
                  <View style={[styles.fileIcon, { backgroundColor: file.type === 'pdf' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(139, 92, 246, 0.15)' }]}>
                    {file.type === 'pdf' ? (
                      <FileText size={20} color="#ef4444" strokeWidth={2} />
                    ) : (
                      <ImageIcon size={20} color="#8b5cf6" strokeWidth={2} />
                    )}
                  </View>
                  <View style={styles.fileInfo}>
                    <Text style={[styles.fileName, { color: colors.text }]}>{file.name}</Text>
                    <Text style={[styles.fileSize, { color: colors.textTertiary }]}>
                      {formatFileSize(file.size)} • {file.type.toUpperCase()}
                    </Text>
                  </View>
                </View>

                <View style={styles.fileActions}>
                  <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.accentLight }]}>
                    <Eye size={18} color={colors.accent} strokeWidth={2} />
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.actionButton, { backgroundColor: 'rgba(16, 185, 129, 0.1)' }]}>
                    <Download size={18} color="#10b981" strokeWidth={2} />
                  </TouchableOpacity>
                </View>
              </MotiView>
            ))
          )}
        </MotiView>
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
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
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
  emptyState: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  fileCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
  },
  fileLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  fileIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
  },
  fileSize: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  fileActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    marginTop: 100,
  },
});
