import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Share, Clipboard, Image, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { QrCode, Copy, Check, RefreshCw, Share2 } from 'lucide-react-native';
import { useTheme, lightTheme, darkTheme } from '@/modules/shared/contexts/ThemeContext';
import { qrCodeService, QRCodeData } from '../services/QRCodeService';

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
  const [qrData, setQrData] = useState<QRCodeData | null>(null);
  const [regenerating, setRegenerating] = useState(false);
  const [qrLoading, setQrLoading] = useState(true);

  useEffect(() => {
    generateNewQRCode();
  }, [patientId, patientName]);

  const generateNewQRCode = () => {
    setQrLoading(true);
    const { qrData: newQrData, qrUrl: newQrUrl, shareLink: newShareLink } = qrCodeService.regenerateQRCode(
      patientId,
      patientName
    );
    setQrData(newQrData);
    setQrUrl(newQrUrl);
    setShareLink(newShareLink);
    setTimeout(() => setQrLoading(false), 500);
  };

  const handleRegenerateQR = () => {
    setRegenerating(true);
    generateNewQRCode();
    setTimeout(() => setRegenerating(false), 600);
  };

  const handleCopyLink = async () => {
    await Clipboard.setString(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `View ${patientName}'s medical profile: ${shareLink}`,
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
        <Text style={[styles.title, { color: colors.text }]}>Share Profile</Text>
        <TouchableOpacity
          onPress={handleRegenerateQR}
          disabled={regenerating}
          style={[styles.regenerateButton, { backgroundColor: colors.accentLight }]}
        >
          <MotiView
            animate={{ rotate: regenerating ? '360deg' : '0deg' }}
            transition={{ type: 'timing', duration: 600, loop: regenerating }}
          >
            <RefreshCw size={16} color={colors.accent} strokeWidth={2} />
          </MotiView>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={[styles.qrContainer, { backgroundColor: colors.containerBg, borderColor: colors.cardBorder }]}>
          {qrLoading ? (
            <View style={styles.qrPlaceholder}>
              <ActivityIndicator size="large" color={colors.accent} />
              <Text style={[styles.qrText, { color: colors.textTertiary }]}>Generating QR...</Text>
            </View>
          ) : (
            <MotiView
              from={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', damping: 15 }}
            >
              <Image
                source={{ uri: qrUrl }}
                style={styles.qrImage}
                resizeMode="contain"
              />
            </MotiView>
          )}
        </View>

        <View style={[styles.linkContainer, { backgroundColor: colors.containerBg, borderColor: colors.cardBorder }]}>
          <Text style={[styles.linkText, { color: colors.textSecondary }]} numberOfLines={1} ellipsizeMode="middle">
            {shareLink || 'Generating link...'}
          </Text>
          <TouchableOpacity onPress={handleCopyLink} style={[styles.iconButton, { backgroundColor: colors.accentLight }]}>
            {copied ? (
              <Check size={16} color={colors.accent} strokeWidth={2} />
            ) : (
              <Copy size={16} color={colors.accent} strokeWidth={2} />
            )}
          </TouchableOpacity>
        </View>

        {qrData && (
          <Text style={[styles.expiryText, { color: colors.textTertiary }]}>
            Valid for 7 days • Generated {new Date(qrData.createdAt).toLocaleDateString()}
          </Text>
        )}
      </View>

      <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
        <LinearGradient
          colors={['#6366F1', '#818CF8']}
          style={styles.shareButtonGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Share2 size={18} color="#ffffff" strokeWidth={2} />
          <Text style={styles.shareButtonText}>Share Profile</Text>
        </LinearGradient>
      </TouchableOpacity>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
  },
  regenerateButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    gap: 12,
  },
  qrContainer: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 180,
  },
  qrPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  qrImage: {
    width: 150,
    height: 150,
  },
  qrText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  linkContainer: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  linkText: {
    flex: 1,
    fontSize: 11,
    fontFamily: 'Inter-Regular',
  },
  iconButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  expiryText: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
  shareButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 4,
  },
  shareButtonGradient: {
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  shareButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
});
