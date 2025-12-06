
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { MotiView } from 'moti';
import { Home, ClipboardList, QrCode, User } from 'lucide-react-native';
import { useRouter, usePathname } from 'expo-router';
import { useTheme, lightTheme, darkTheme } from '@/modules/shared/contexts/ThemeContext';

interface DoctorBottomNavProps {
    onScanPress?: () => void;
}

export default function DoctorBottomNav({ onScanPress }: DoctorBottomNavProps) {
    const router = useRouter();
    const pathname = usePathname();
    const { isDark } = useTheme();
    const theme = isDark ? darkTheme : lightTheme;

    // Normalize pathname for better matching
    const normalizedPath = pathname?.toLowerCase() || '';
    
    const navItems = [
        {
            id: 'home',
            icon: Home,
            label: 'Home',
            route: '/(tabs)/doctor-home',
            isActive: 
                normalizedPath === '/(tabs)/doctor-home' || 
                normalizedPath === '/doctor' || 
                normalizedPath === '/(doctor)' || 
                normalizedPath === '/(doctor)/' ||
                normalizedPath === '/doctor/' ||
                (normalizedPath.includes('doctor-home') || 
                 (normalizedPath.match(/\/doctor\/?$/) && !normalizedPath.includes('appointment') && !normalizedPath.includes('profile') && !normalizedPath.includes('patient'))),
        },
        {
            id: 'appointments',
            icon: ClipboardList,
            label: 'Visits',
            route: '/(tabs)/doctor-appointments',
            isActive: 
                normalizedPath === '/(tabs)/doctor-appointments' ||
                normalizedPath === '/(doctor)/appointments' ||
                (normalizedPath.includes('appointments') && 
                !normalizedPath.includes('patient')),
        },
        {
            id: 'scan',
            icon: QrCode,
            label: 'Scan',
            route: 'scan',
            isActive: false,
        },
        {
            id: 'profile',
            icon: User,
            label: 'Profile',
            route: '/(tabs)/doctor-profile',
            isActive: 
                normalizedPath === '/(tabs)/doctor-profile' ||
                normalizedPath === '/(doctor)/profile' ||
                (normalizedPath.includes('doctor-profile') || 
                 (normalizedPath.includes('profile') && 
                  normalizedPath.includes('doctor') &&
                  !normalizedPath.includes('patient'))),
        },
    ];

    const handlePress = (item: typeof navItems[0]) => {
        if (item.id === 'scan') {
            onScanPress?.();
        } else {
            router.push(item.route as any);
        }
    };

    return (
        <View style={styles.bottomNav}>
            <View
                style={[
                    styles.navContainer,
                    {
                        backgroundColor: theme.navBg,
                        borderColor: theme.iconButtonBorder,
                    },
                ]}
            >
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = item.isActive;

                    return (
                        <TouchableOpacity
                            key={item.id}
                            style={styles.navButton}
                            onPress={() => handlePress(item)}
                            activeOpacity={0.7}
                        >
                            <MotiView
                                animate={{
                                    backgroundColor: isActive ? '#10b981' : theme.navInactive,
                                    scale: isActive ? 1.05 : 1,
                                    shadowOpacity: isActive ? 0.4 : 0,
                                }}
                                transition={{
                                    type: 'spring',
                                    damping: 15,
                                    stiffness: 150,
                                    duration: 300,
                                }}
                                style={[
                                    styles.navButtonInner,
                                    isActive && {
                                        shadowColor: '#10b981',
                                        shadowOffset: { width: 0, height: 4 },
                                        shadowRadius: 8,
                                        elevation: 8,
                                    },
                                ]}
                            >
                                <MotiView
                                    animate={{
                                        opacity: 1,
                                        scale: isActive ? 1 : 1,
                                    }}
                                    transition={{
                                        type: 'timing',
                                        duration: 200,
                                    }}
                                >
                                    <Icon
                                        size={24}
                                        color={isActive ? '#ffffff' : theme.textSecondary}
                                        strokeWidth={2}
                                    />
                                </MotiView>
                            </MotiView>
                            {isActive && (
                                <MotiView
                                    from={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{
                                        type: 'spring',
                                        damping: 12,
                                        stiffness: 200,
                                    }}
                                    style={[
                                        styles.activeIndicator,
                                        { backgroundColor: '#10b981' },
                                    ]}
                                />
                            )}
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    bottomNav: {
        position: 'absolute',
        bottom: 24,
        left: 24,
        right: 24,
        alignItems: 'center',
    },
    navContainer: {
        flexDirection: 'row',
        borderRadius: 28,
        paddingHorizontal: 16,
        paddingVertical: 12,
        gap: 12,
        borderWidth: 1,
        shadowColor: '#10b981',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
        elevation: 16,
    },
    navButton: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    navButtonInner: {
        width: 52,
        height: 52,
        borderRadius: 26,
        alignItems: 'center',
        justifyContent: 'center',
    },
    activeIndicator: {
        position: 'absolute',
        bottom: -4,
        width: 6,
        height: 6,
        borderRadius: 3,
    },
});

