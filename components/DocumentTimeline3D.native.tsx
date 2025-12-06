import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Upload } from 'lucide-react-native';
import { MotiView } from 'moti';
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

interface Props {
  documents: Document[];
  onUpload: () => void;
  onViewDocument: (doc: Document) => void;
}

const getDocumentEmoji = (type: string) => {
  switch (type) {
    case 'prescription':
      return '💊';
    case 'report':
      return '📋';
    case 'invoice':
      return '🧾';
    default:
      return '📄';
  }
};

export function DocumentTimeline3D({
  documents,
  onUpload,
  onViewDocument,
}: Props) {
  const { isDark } = useTheme();
  const colors = isDark ? darkTheme : lightTheme;

  if (!documents || documents.length === 0) {
    return (
      <MotiView
        from={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 200 } as any}
        style={[
          styles.emptyCard,
          { backgroundColor: colors.cardBg, borderColor: colors.cardBorder },
        ]}
      >
        <View
          style={[
            styles.emptyContainer,
            { backgroundColor: colors.accentLight },
          ]}
        >
          <Upload size={36} color={colors.accent} strokeWidth={1.5} />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>
            No Documents Yet
          </Text>
          <Text style={[styles.emptySubtitle, { color: colors.textTertiary }]}>
            Upload your medical documents
          </Text>
        </View>

        <TouchableOpacity
          onPress={onUpload}
          style={styles.uploadButton}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={['#6366F1', '#818CF8']}
            style={styles.uploadButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Upload size={16} color="#fff" strokeWidth={2} />
            <Text style={styles.uploadButtonText}>Upload Document</Text>
          </LinearGradient>
        </TouchableOpacity>
      </MotiView>
    );
  }

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.cardBg, borderColor: colors.cardBorder },
      ]}
    >
      <FlatList
        data={[...documents].sort((a, b) => b.timestamp - a.timestamp)}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => onViewDocument(item)}
            activeOpacity={0.8}
          >
            <Text style={[styles.emoji, { color: colors.text }]}>
              {getDocumentEmoji(item.type)}
            </Text>
            <View style={styles.info}>
              <Text
                style={[styles.title, { color: colors.text }]}
                numberOfLines={1}
              >
                {item.title}
              </Text>
              <Text style={[styles.date, { color: colors.textTertiary }]}>
                {item.date}
              </Text>
            </View>
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={styles.sep} />}
        contentContainerStyle={{ padding: 12 }}
        // Make FlatList more tolerant when used inside other scrollable parents.
        // `nestedScrollEnabled` helps on Android when nested in another scrollable view.
        nestedScrollEnabled={true}
        // Tune virtualization to be predictable when nested; these are conservative defaults.
        initialNumToRender={8}
        maxToRenderPerBatch={12}
        windowSize={7}
        // Avoid clipping issues when nested inside other views.
        removeClippedSubviews={false}
      />

      <TouchableOpacity
        onPress={onUpload}
        style={styles.addButton}
        activeOpacity={0.9}
      >
        <LinearGradient
          colors={['#6366F1', '#818CF8']}
          style={styles.addButtonGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Upload size={14} color="#fff" strokeWidth={2} />
          <Text style={styles.addButtonText}>Add Document</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  emptyCard: {
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    marginBottom: 12,
    alignItems: 'center',
  },
  emptyContainer: {
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 15,
    fontFamily: 'Inter-Bold',
    marginTop: 10,
  },
  emptySubtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginTop: 6,
    textAlign: 'center',
  },
  uploadButton: {
    borderRadius: 10,
    overflow: 'hidden',
    width: '100%',
  },
  uploadButtonGradient: {
    flexDirection: 'row',
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  uploadButtonText: {
    fontSize: 13,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    marginLeft: 8,
  },
  container: {
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 12,
    overflow: 'hidden',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 6,
  },
  emoji: {
    fontSize: 22,
    width: 36,
    textAlign: 'center',
  },
  info: {
    flex: 1,
    paddingLeft: 8,
  },
  title: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
  },
  date: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginTop: 2,
  },
  sep: {
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.04)',
  },
  addButton: {
    borderRadius: 12,
    overflow: 'hidden',
    margin: 12,
  },
  addButtonGradient: {
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  addButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
    marginLeft: 8,
  },
});

export default DocumentTimeline3D;
