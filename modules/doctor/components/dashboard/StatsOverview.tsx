import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Users, XCircle, Clock } from 'lucide-react-native';
import { useTheme, lightTheme, darkTheme } from '@/modules/shared/contexts/ThemeContext';

interface StatsOverviewProps {
    totalAppointments: number;
    completedVisits: number;
    noShows: number;
    pendingVisits: number;
    newPatientsThisWeek: number;
}

export default function StatsOverview({
    totalAppointments,
    completedVisits,
    noShows,
    pendingVisits,
    newPatientsThisWeek,
}: StatsOverviewProps) {
    const { isDark } = useTheme();
    const theme = isDark ? darkTheme : lightTheme;

    const stats = [
        {
            label: 'Total',
            value: totalAppointments,
            icon: Users,
            color: '#6366F1',
            bgColor: 'rgba(99, 102, 241, 0.08)',
        },
        {
            label: 'Pending',
            value: pendingVisits,
            icon: Clock,
            color: '#f59e0b',
            bgColor: 'rgba(245, 158, 11, 0.08)',
        },
        {
            label: 'No-Show',
            value: noShows,
            icon: XCircle,
            color: '#ef4444',
            bgColor: 'rgba(239, 68, 68, 0.08)',
        },
    ];

    return (
        <View style={styles.container}>
            <View style={styles.grid}>
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <View
                            key={index}
                            style={[
                                styles.card,
                                {
                                    backgroundColor: theme.cardBg,
                                    borderColor: theme.cardBorder,
                                }
                            ]}
                        >
                            <View style={styles.topRow}>
                                <View style={[styles.iconWrapper, { backgroundColor: stat.bgColor }]}>
                                    <Icon size={18} color={stat.color} strokeWidth={2.5} />
                                </View>
                                <Text style={[styles.value, { color: theme.text }]}>{stat.value}</Text>
                            </View>
                            <Text style={[styles.label, { color: theme.textSecondary }]}>{stat.label}</Text>
                        </View>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 24,
        marginBottom: 20,
    },
    grid: {
        flexDirection: 'row',
        gap: 10,
    },
    card: {
        flex: 1,
        padding: 14,
        borderRadius: 16,
        borderWidth: 1,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
        elevation: 1,
    },
    topRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginBottom: 8,
    },
    iconWrapper: {
        width: 32,
        height: 32,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    value: {
        fontSize: 20,
        fontFamily: 'Inter-Bold',
        lineHeight: 24,
        letterSpacing: -0.4,
        flex: 1,
    },
    label: {
        fontSize: 12,
        fontFamily: 'Inter-Medium',
        marginTop: 2,
    },
    insightCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 16,
        borderWidth: 1,
        gap: 12,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 2,
    },
    insightIcon: {
        width: 28,
        height: 28,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    insightText: {
        fontSize: 13,
        fontFamily: 'Inter-Medium',
    },
});
