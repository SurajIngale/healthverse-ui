import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { useRouter } from 'expo-router';
import { User, Stethoscope, FlaskConical, Heart, Activity, Microscope } from 'lucide-react-native';
import { authFlowService, Role } from '../../services/AuthFlowService';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function LoginScreen() {
  const [selectedRole, setSelectedRole] = useState<Role>('patient');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const roles: {
    id: Role;
    label: string;
    icon: typeof User;
    gradient: string[];
    description: string;
    decorIcon: typeof Heart;
  }[] = [
    {
      id: 'patient',
      label: 'Patient',
      icon: User,
      gradient: ['#3b82f6', '#2563eb'],
      description: 'Access your health records',
      decorIcon: Heart,
    },
    {
      id: 'doctor',
      label: 'Doctor',
      icon: Stethoscope,
      gradient: ['#10b981', '#059669'],
      description: 'Manage your patients',
      decorIcon: Activity,
    },
    {
      id: 'lab',
      label: 'Lab',
      icon: FlaskConical,
      gradient: ['#f59e0b', '#d97706'],
      description: 'Process test reports',
      decorIcon: Microscope,
    },
  ];

  const isPhoneValid = phone.length === 10 && /^\d+$/.test(phone);

  const handleContinue = async () => {
    if (!isPhoneValid || loading) return;

    setLoading(true);
    setError('');

    try {
      const response = await authFlowService.requestOtp(phone, selectedRole);

      if (response.success && response.requestId) {
        router.push({
          pathname: '/verify-otp',
          params: {
            requestId: response.requestId,
            phone,
            role: selectedRole,
            expiresIn: response.expiresIn?.toString() || '60',
          },
        });
      } else {
        setError(response.message || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setError('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = () => {
    const routes = {
      patient: '/(tabs)/patient-home',
      doctor: '/(tabs)/doctor-home',
      lab: '/(tabs)/lab-home',
    };
    router.push(routes[selectedRole] as any);
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#E0F2FF', '#F0F9FF', '#FFFFFF']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <MotiView
            from={{ opacity: 0, translateY: -30 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 600 }}
            style={styles.header}
          >
            <View style={styles.logoContainer}>
              <LinearGradient
                colors={['#3b82f6', '#2563eb']}
                style={styles.logoGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.logoText}>H</Text>
              </LinearGradient>
            </View>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>Sign in to continue</Text>
          </MotiView>

          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', delay: 200, duration: 500 }}
            style={styles.card}
          >
            <View style={styles.rolesContainer}>
              {roles.map((role, index) => {
                const Icon = role.icon;
                const isSelected = selectedRole === role.id;

                return (
                  <MotiView
                    key={role.id}
                    from={{ opacity: 0, translateY: 30 }}
                    animate={{
                      opacity: 1,
                      translateY: 0,
                      scale: isSelected ? 1 : 1,
                    }}
                    transition={{
                      delay: 300 + index * 80,
                      type: 'timing',
                      duration: 400,
                    }}
                    style={styles.roleWrapper}
                  >
                    <TouchableOpacity
                      onPress={() => setSelectedRole(role.id)}
                      activeOpacity={0.85}
                      style={styles.roleButton}
                    >
                      <LinearGradient
                        colors={
                          isSelected
                            ? role.gradient
                            : ['rgba(255, 255, 255, 0.9)', 'rgba(241, 245, 249, 0.9)']
                        }
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={[styles.roleGradient, isSelected && styles.roleGradientSelected]}
                      >
                        <View style={styles.roleContent}>
                          <View style={styles.iconCircle}>
                            <Icon
                              size={20}
                              color={isSelected ? '#ffffff' : '#94a3b8'}
                              strokeWidth={2.5}
                            />
                          </View>
                          <Text
                            style={[
                              styles.roleText,
                              isSelected && styles.roleTextSelected,
                            ]}
                            numberOfLines={1}
                          >
                            {role.label}
                          </Text>
                        </View>

                        {isSelected && (
                          <MotiView
                            from={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{
                              type: 'timing',
                              duration: 300,
                              delay: 100,
                            }}
                            style={styles.checkmark}
                          >
                            <View style={styles.checkmarkDot} />
                          </MotiView>
                        )}
                      </LinearGradient>
                    </TouchableOpacity>
                  </MotiView>
                );
              })}
            </View>

            <View style={styles.divider} />

            <Text style={styles.label}>Mobile Number</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.countryCode}>+91</Text>
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={(text) => {
                  setPhone(text);
                  setError('');
                  if (text.length === 10 && /^\d+$/.test(text)) {
                    setTimeout(() => handleContinue(), 300);
                  }
                }}
                keyboardType="phone-pad"
                maxLength={10}
                placeholder="Enter 10-digit number"
                placeholderTextColor="#94a3b8"
                returnKeyType="done"
              />
            </View>

            {error && (
              <MotiView
                from={{ opacity: 0, translateY: -10 }}
                animate={{ opacity: 1, translateY: 0 }}
                style={styles.errorContainer}
              >
                <Text style={styles.errorText}>{error}</Text>
              </MotiView>
            )}

            <TouchableOpacity
              onPress={handleContinue}
              disabled={!isPhoneValid || loading}
              activeOpacity={0.85}
              style={[styles.button, (!isPhoneValid || loading) && styles.buttonDisabled]}
            >
              <LinearGradient
                colors={!isPhoneValid || loading ? ['#334155', '#1e293b'] : ['#3b82f6', '#2563eb']}
                style={styles.buttonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <Text style={styles.buttonText}>Continue</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            <MotiView
              from={{ opacity: 0, translateY: 10 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', delay: 500, duration: 400 }}
              style={styles.guestContainer}
            >
              <TouchableOpacity
                onPress={handleGuestLogin}
                activeOpacity={0.7}
                style={styles.guestButton}
              >
                <Text style={styles.guestText}>Continue as Guest</Text>
              </TouchableOpacity>
            </MotiView>
          </MotiView>

          <MotiView
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 900, type: 'timing', duration: 500 }}
            style={styles.footer}
          >
            <Text style={styles.footerText}>
              By continuing, you agree to our Terms & Privacy Policy
            </Text>
          </MotiView>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E0F2FF',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoContainer: {
    marginBottom: 24,
  },
  logoGradient: {
    width: 72,
    height: 72,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  logoText: {
    fontSize: 36,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
  },
  title: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#1e293b',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.1)',
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1e293b',
    marginBottom: 20,
    letterSpacing: 0.3,
  },
  rolesContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 28,
  },
  roleWrapper: {
    flex: 1,
  },
  roleButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  roleGradient: {
    paddingVertical: 14,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: 'rgba(59, 130, 246, 0.2)',
    minHeight: 100,
    position: 'relative',
    overflow: 'hidden',
  },
  roleGradientSelected: {
    borderColor: 'rgba(59, 130, 246, 0.5)',
  },
  roleContent: {
    alignItems: 'center',
    gap: 8,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleText: {
    fontSize: 13,
    fontFamily: 'Inter-SemiBold',
    color: '#64748b',
  },
  roleTextSelected: {
    color: '#ffffff',
  },
  checkmark: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 3,
  },
  checkmarkDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ffffff',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    marginBottom: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
    marginBottom: 16,
  },
  countryCode: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#475569',
    marginRight: 12,
    paddingRight: 12,
    borderRightWidth: 1,
    borderRightColor: 'rgba(59, 130, 246, 0.2)',
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#1e293b',
    paddingVertical: 16,
  },
  errorContainer: {
    marginBottom: 16,
  },
  errorText: {
    fontSize: 13,
    fontFamily: 'Inter-Medium',
    color: '#ef4444',
  },
  button: {
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 12,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 15,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    letterSpacing: 0.3,
  },
  guestContainer: {
    marginTop: 12,
    alignItems: 'center',
  },
  guestButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  guestText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#3b82f6',
    letterSpacing: 0.2,
  },
  footer: {
    alignItems: 'center',
    marginTop: 'auto',
    paddingTop: 24,
  },
  footerText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 18,
  },
});
