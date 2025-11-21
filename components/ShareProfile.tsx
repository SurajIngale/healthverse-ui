import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Share, Clipboard } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { QrCode, Link2, Copy, Check } from 'lucide-react-native';
import { useTheme, lightTheme, darkTheme } from '../contexts/ThemeContext';

interface ShareProfileProps {
  patientId: string;
  patientName: string;
}

export function ShareProfile({ patientId, patientName }: ShareProfileProps) {
  const { isDark } = useTheme();
  const colors = isDark ? darkTheme : lightTheme;
  const [shareLink, setShareLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [qrUrl, setQrUrl] = useState('');

  useEffect(() => {
    const link = `https://medicalrecords.app/profile/${patientId}?token=${generateToken()}`;
    setShareLink(link);

    const qr = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(link)}`;
    setQrUrl(qr);
  }, [patientId]);

  const generateToken = () => {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  };

  const handleCopyLink = async () => {
    await Clipboard.setString(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out ${patientName}'s medical profile: ${shareLink}`,
        title: 'Share Medical Profile',
        url: shareLink,
      });
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  return (
    <MotiView
      from={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 200, damping: 15 } as any}
      style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}
    >
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: colors.accentLight }]}>
          <Link2 size={24} color={colors.accent} strokeWidth={2} />
        </View>
        <Text style={[styles.title, { color: colors.text }]}>Share Profile</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>QR Code</Text>
        <View style={[styles.qrContainer, { backgroundColor: colors.containerBg, borderColor: colors.cardBorder }]}>
          {qrUrl ? (
            <View style={styles.qrPlaceholder}>
              <QrCode size={60} color={colors.accent} strokeWidth={1.5} />
              <Text style={[styles.qrText, { color: colors.textTertiary }]}>QR Code Generated</Text>
            </View>
          ) : (
            <View style={styles.qrPlaceholder}>
              <Text style={[styles.qrText, { color: colors.textTertiary }]}>Generating...</Text>
            </View>
          )}
        </View>
        <Text style={[styles.hint, { color: colors.textTertiary }]}>Share this QR code to let others access your profile</Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>Share Link</Text>
        <View style={[styles.linkContainer, { backgroundColor: colors.containerBg, borderColor: colors.cardBorder }]}>
          <Text style={[styles.linkText, { color: colors.text }]} numberOfLines={1} ellipsizeMode="middle">
            {shareLink}
          </Text>
          <TouchableOpacity onPress={handleCopyLink} style={[styles.copyButton, { backgroundColor: colors.accentLight }]}>
            {copied ? (
              <Check size={18} color={colors.accent} strokeWidth={2} />
            ) : (
              <Copy size={18} color={colors.accent} strokeWidth={2} />
            )}
          </TouchableOpacity>
        </View>
        <Text style={[styles.hint, { color: colors.textTertiary }]}>
          {copied ? 'Link copied to clipboard!' : 'Tap copy to share the link'}
        </Text>
      </View>

      <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
        <LinearGradient
          colors={['#6366F1', '#818CF8']}
          style={styles.shareButtonGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={styles.shareButtonText}>Share with Others</Text>
        </LinearGradient>
      </TouchableOpacity>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    marginVertical: 16,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  qrContainer: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    minHeight: 180,
  },
  qrPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  qrText: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
  },
  linkContainer: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  linkText: {
    flex: 1,
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginRight: 8,
  },
  copyButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hint: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  shareButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 4,
  },
  shareButtonGradient: {
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareButtonText: {
    fontSize: 15,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
});
