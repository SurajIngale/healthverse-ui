import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Bell, Sun, Moon } from 'lucide-react-native';
import { useTheme, lightTheme, darkTheme } from '@/modules/shared/contexts/ThemeContext';

interface DashboardHeaderProps {
    doctorName: string;
    clinicName: string;
    profileImage?: string;
    onAddWalkIn: () => void;
    onNotificationPress: () => void;
}

const getGreeting = (): string => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
};

export default function DashboardHeader({
    doctorName,
    clinicName,
    profileImage,
    onAddWalkIn,
    onNotificationPress,
}: DashboardHeaderProps) {
    const { isDark, toggleTheme } = useTheme();
    const theme = isDark ? darkTheme : lightTheme;
    const greeting = getGreeting();

    return (
        <View style={styles.container}>
            <View style={styles.profileSection}>
                {profileImage ? (
                    <Image source={{ uri: profileImage }} style={styles.avatar} />
                ) : (
                    <View style={[styles.avatar, { backgroundColor: '#10b981' + '20' }]}>
                        <Text style={[styles.avatarText, { color: '#10b981' }]}>
                            {doctorName.charAt(doctorName.indexOf('.') + 2) || doctorName.charAt(0)}
                        </Text>
                    </View>
                )}

                <View style={styles.infoContainer}>
                    <Text style={[styles.greeting, { color: theme.textSecondary }]}>{greeting},</Text>
                    <Text style={[styles.doctorName, { color: theme.text }]}>{doctorName}</Text>
                </View>
            </View>

            <View style={styles.actionsContainer}>
                <TouchableOpacity
                    style={[
                        styles.iconButton,
                        {
                            backgroundColor: theme.cardBg,
                            borderColor: theme.cardBorder,
                        }
                    ]}
                    onPress={toggleTheme}
                >
                    {isDark ? (
                        <Sun size={20} color={theme.textSecondary} />
                    ) : (
                        <Moon size={20} color={theme.textSecondary} />
                    )}
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.iconButton,
                        {
                            backgroundColor: theme.cardBg,
                            borderColor: theme.cardBorder,
                            position: 'relative',
                        }
                    ]}
                    onPress={onNotificationPress}
                >
                    <Bell size={20} color={theme.textSecondary} />
                    <View style={styles.notificationBadge} />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 16,
    },
    profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        flex: 1,
    },
    avatar: {
        width: 56,
        height: 56,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
    },
    avatarText: {
        fontSize: 24,
        fontFamily: 'Inter-Bold',
    },
    infoContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    greeting: {
        fontSize: 14,
        fontFamily: 'Inter-Medium',
        marginBottom: 4,
    },
    doctorName: {
        fontSize: 20,
        fontFamily: 'Inter-Bold',
        letterSpacing: -0.5,
    },
    actionsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    iconButton: {
        width: 44,
        height: 44,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 3,
    },
    notificationBadge: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#ef4444',
        borderWidth: 1.5,
        borderColor: '#ffffff',
    },
});
