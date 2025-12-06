import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Upload, Layers } from 'lucide-react-native';
import { useTheme, lightTheme, darkTheme } from '@/modules/shared/contexts/ThemeContext';

export interface Document {
  id: string;
  type: 'prescription' | 'report' | 'invoice' | 'other';
  title: string;
  date: string;
  timestamp: number;
  icon?: string;
  url?: string;
  fileType?: string;
}

interface DocumentTimeline3DProps {
  documents: Document[];
  onUpload: () => void;
  onViewDocument: (doc: Document) => void;
}

// Lightweight web-only fallback: simple list and upload CTA.
export function DocumentTimeline3D({ documents, onUpload, onViewDocument }: DocumentTimeline3DProps) {
  const { isDark } = useTheme();
  const colors = isDark ? darkTheme : lightTheme;

  if (!documents || documents.length === 0) {
    return (
      <View style={[styles.emptyCard, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
        <View style={[styles.emptyContainer, { backgroundColor: colors.accentLight }]}>
          <Upload size={40} color={colors.accent} strokeWidth={1.5} />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>No Documents Yet</Text>
          <Text style={[styles.emptySubtitle, { color: colors.textTertiary }]}>Upload your medical documents</Text>
        </View>

        <TouchableOpacity onPress={onUpload} style={styles.uploadButton}>
          <LinearGradient colors={["#6366F1", "#818CF8"]} style={styles.uploadButtonGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
            <Upload size={18} color="#ffffff" strokeWidth={2} />
            <Text style={styles.uploadButtonText}>Upload Document</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.mainCard, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Documents</Text>
        <Layers size={20} color={colors.accent} />
      </View>

      <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
        {documents.map((doc) => (
          <TouchableOpacity key={doc.id} onPress={() => onViewDocument(doc)} style={[styles.listItem, { borderColor: colors.cardBorder }]}>
            <Text style={[styles.listTitle, { color: colors.text }]} numberOfLines={1}>{doc.title}</Text>
            <Text style={[styles.listDate, { color: colors.textTertiary }]}>{doc.date}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <TouchableOpacity onPress={onUpload} style={styles.addButton}>
        <LinearGradient colors={["#6366F1", "#818CF8"]} style={styles.addButtonGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
          <Upload size={18} color="#ffffff" strokeWidth={2} />
          <Text style={styles.addButtonText}>Add Document</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  emptyCard: {
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    marginBottom: 16,
    alignItems: 'center',
  },
  emptyContainer: {
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginTop: 6,
    textAlign: 'center',
  },
  uploadButton: {
    borderRadius: 12,
    overflow: 'hidden',
    width: '100%',
  },
  uploadButtonGradient: {
    flexDirection: 'row',
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  uploadButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  mainCard: {
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
  },
  list: {
    maxHeight: 260,
    marginBottom: 12,
  },
  listContent: {
    paddingVertical: 8,
  },
  listItem: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 8,
  },
  listTitle: { fontSize: 14, fontFamily: 'Inter-SemiBold' },
  listDate: { fontSize: 12, fontFamily: 'Inter-Regular', marginTop: 4 },
  addButton: { borderRadius: 16, overflow: 'hidden' },
  addButtonGradient: { paddingVertical: 12, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 },
  addButtonText: { fontSize: 14, fontFamily: 'Inter-Bold', color: '#fff' },
});
