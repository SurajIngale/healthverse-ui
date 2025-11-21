import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { X, QrCode, CheckCircle } from 'lucide-react-native';
import { useTheme, lightTheme, darkTheme } from '../contexts/ThemeContext';

interface QRScannerProps {
  onScan: (data: string) => void;
  onClose: () => void;
}

export default function QRScanner({ onScan, onClose }: QRScannerProps) {
  const { isDark } = useTheme();
  const colors = isDark ? darkTheme : lightTheme;
  const [manualCode, setManualCode] = useState('');
  const [scanning, setScanning] = useState(false);

  const handleManualSubmit = () => {
    if (manualCode.trim()) {
      const qrData = `https://medicalrecords.app/profile?patient_id=${manualCode.trim()}&token=mock_token`;
      onScan(qrData);
    }
  };

  const handleSimulateScan = () => {
    setScanning(true);
    setTimeout(() => {
      const mockQRData = `https://medicalrecords.app/profile?patient_id=patient_123&token=mock_token_abc123`;
      onScan(mockQRData);
    }, 1500);
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? 'rgba(15, 23, 42, 0.95)' : 'rgba(0, 0, 0, 0.85)' }]}>
      <MotiView
        from={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', damping: 15 }}
        style={[styles.content, { backgroundColor: colors.containerBg }]}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>Scan Patient QR Code</Text>
          <TouchableOpacity onPress={onClose} style={[styles.closeButton, { backgroundColor: colors.cardBg }]}>
            <X size={24} color={colors.text} strokeWidth={2} />
          </TouchableOpacity>
        </View>

        <View style={[styles.scanArea, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
          {scanning ? (
            <MotiView
              from={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', damping: 12 }}
              style={styles.successContainer}
            >
              <CheckCircle size={64} color="#10b981" strokeWidth={2} />
              <Text style={[styles.successText, { color: colors.text }]}>QR Code Scanned!</Text>
            </MotiView>
          ) : (
            <>
              <MotiView
                animate={{
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  type: 'timing',
                  duration: 2000,
                  loop: true,
                }}
                style={styles.scanFrame}
              >
                <QrCode size={120} color={colors.accent} strokeWidth={1.5} />
              </MotiView>
              <Text style={[styles.scanText, { color: colors.textTertiary }]}>
                Position QR code within frame
              </Text>
            </>
          )}
        </View>

        <View style={styles.divider}>
          <View style={[styles.dividerLine, { backgroundColor: colors.cardBorder }]} />
          <Text style={[styles.dividerText, { color: colors.textTertiary }]}>OR</Text>
          <View style={[styles.dividerLine, { backgroundColor: colors.cardBorder }]} />
        </View>

        <View style={styles.manualSection}>
          <Text style={[styles.manualLabel, { color: colors.textSecondary }]}>Enter Patient ID</Text>
          <View style={[styles.inputContainer, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
            <TextInput
              style={[styles.input, { color: colors.text }]}
              value={manualCode}
              onChangeText={setManualCode}
              placeholder="e.g., patient_123"
              placeholderTextColor={colors.textTertiary}
              returnKeyType="done"
              onSubmitEditing={handleManualSubmit}
            />
          </View>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            onPress={handleSimulateScan}
            style={styles.simulateButton}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#6366F1', '#818CF8']}
              style={styles.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <QrCode size={20} color="#ffffff" strokeWidth={2} />
              <Text style={styles.buttonText}>Simulate Scan</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleManualSubmit}
            disabled={!manualCode.trim()}
            style={[styles.manualButton, !manualCode.trim() && styles.buttonDisabled]}
            activeOpacity={0.8}
          >
            <Text style={[styles.manualButtonText, { color: colors.accent }]}>
              Submit Manually
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.hint, { color: colors.textTertiary }]}>
          For testing: Click "Simulate Scan" or enter "patient_123"
        </Text>
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
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanArea: {
    borderRadius: 16,
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
    minHeight: 280,
  },
  scanFrame: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanText: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    marginTop: 20,
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
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  manualSection: {
    marginBottom: 20,
  },
  manualLabel: {
    fontSize: 13,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 8,
  },
  inputContainer: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 16,
  },
  input: {
    fontSize: 15,
    fontFamily: 'Inter-Regular',
    paddingVertical: 14,
  },
  actions: {
    gap: 12,
  },
  simulateButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    gap: 8,
  },
  buttonText: {
    fontSize: 15,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  manualButton: {
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  manualButtonText: {
    fontSize: 15,
    fontFamily: 'Inter-SemiBold',
  },
  hint: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 16,
  },
});
