import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { X, QrCode, CheckCircle } from 'lucide-react-native';
import {
  useTheme,
  lightTheme,
  darkTheme,
} from '@/modules/shared/contexts/ThemeContext';

interface QRScannerProps {
  onScan: (data: string) => void;
  onClose: () => void;
}

export default function QRScanner({ onScan, onClose }: QRScannerProps) {
  const { isDark } = useTheme();
  const colors = isDark ? darkTheme : lightTheme;
  const [scanning, setScanning] = useState(false);

  const handleSimulateScan = () => {
    setScanning(true);
    setTimeout(() => {
      const mockQRData = `https://medicalrecords.app/profile?patient_id=patient_123&token=mock_token_abc123`;
      onScan(mockQRData);
    }, 1500);
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDark
            ? 'rgba(15, 23, 42, 0.95)'
            : 'rgba(0, 0, 0, 0.85)',
        },
      ]}
    >
      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 300 } as any}
        style={[styles.content, { backgroundColor: colors.containerBg }]}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            Scan Patient QR Code
          </Text>
          <TouchableOpacity
            onPress={onClose}
            style={[styles.closeButton, { backgroundColor: colors.cardBg }]}
          >
            <X size={22} color={colors.text} strokeWidth={2} />
          </TouchableOpacity>
        </View>

        <View
          style={[
            styles.scanArea,
            { backgroundColor: colors.cardBg, borderColor: colors.cardBorder },
          ]}
        >
          {scanning ? (
            <MotiView
              from={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ type: 'timing', duration: 300 } as any}
              style={styles.successContainer}
            >
              <CheckCircle size={64} color="#10b981" strokeWidth={2} />
              <Text style={[styles.successText, { color: colors.text }]}>
                QR Code Scanned!
              </Text>
            </MotiView>
          ) : (
            <>
              <View style={styles.scanFrame}>
                <QrCode size={100} color={colors.accent} strokeWidth={1.5} />
              </View>
              <Text style={[styles.scanText, { color: colors.textTertiary }]}>
                Position QR code within frame
              </Text>
              <Text style={[styles.scanHint, { color: colors.textTertiary }]}>
                Ensure the code is clear and well-lit
              </Text>
            </>
          )}
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            onPress={handleSimulateScan}
            disabled={scanning}
            style={styles.simulateButton}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#10b981', '#059669']}
              style={styles.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <QrCode size={20} color="#ffffff" strokeWidth={2} />
              <Text style={styles.buttonText}>
                {scanning ? 'Scanning...' : 'Scan QR Code'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </MotiView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  content: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    letterSpacing: -0.3,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.2)',
  },
  scanArea: {
    borderRadius: 20,
    padding: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
    minHeight: 300,
    marginBottom: 24,
  },
  scanFrame: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanText: {
    fontSize: 15,
    fontFamily: 'Inter-Medium',
    marginTop: 24,
    textAlign: 'center',
  },
  scanHint: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginTop: 8,
    textAlign: 'center',
  },
  successContainer: {
    alignItems: 'center',
    gap: 16,
  },
  successText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  actions: {
    gap: 12,
  },
  simulateButton: {
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 10,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
});
