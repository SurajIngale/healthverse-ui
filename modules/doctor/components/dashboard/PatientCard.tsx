
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Clock, ChevronRight, Calendar } from 'lucide-react-native';
import { useTheme, lightTheme, darkTheme } from '@/modules/shared/contexts/ThemeContext';

export interface Patient {
    id: string;
    name: string;
    time: string;
    type: string;
    reason: string;
    status: 'waiting' | 'in-consultation' | 'completed' | 'upcoming';
    isFirstVisit?: boolean;
    tokenNumber?: string;
}

interface PatientCardProps {
    patient: Patient;
    onPress: (patientId: string) => void;
}

export default function PatientCard({ patient, onPress }: PatientCardProps) {
    const { isDark } = useTheme();
    const theme = isDark ? darkTheme : lightTheme;

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'in-consultation':
                return '#10b981';
            case 'waiting':
                return '#f59e0b';
            case 'completed':
                return '#6b7280';
            default:
                return '#6366F1';
        }
    };

    const statusColor = getStatusColor(patient.status);

    return (
        <TouchableOpacity
            style={[
                styles.container,
                {
                    backgroundColor: theme.cardBg,
                    borderColor: theme.cardBorder,
                    shadowColor: theme.text,
                }
            ]}
            onPress={() => onPress(patient.id)}
            activeOpacity={0.7}
        >
            <View style={styles.leftSection}>
                <View style={styles.timeContainer}>
                    <Text style={[styles.timeText, { color: theme.text }]}>{patient.time}</Text>
                    {patient.tokenNumber && (
                        <View style={[styles.tokenBadge, { backgroundColor: theme.background[1] }]}>
                            <Text style={[styles.tokenText, { color: theme.textSecondary }]}>
                                #{patient.tokenNumber}
                            </Text>
                        </View>
                    )}
                </View>

                <View style={styles.divider} />

                <View style={styles.infoContainer}>
                    <View style={styles.headerRow}>
                        <Text style={[styles.name, { color: theme.text }]}>{patient.name}</Text>
                        {patient.isFirstVisit && (
                            <View style={styles.newBadge}>
                                <Text style={styles.newBadgeText}>New</Text>
                            </View>
                        )}
                    </View>

                    <Text style={[styles.reason, { color: theme.textSecondary }]}>
                        {patient.reason}
                    </Text>

                    <View style={styles.metaRow}>
                        <Text style={[styles.type, { color: theme.textTertiary }]}>
                            {patient.type}
                        </Text>
                        {patient.status === 'in-consultation' && (
                            <View style={styles.activeStatus}>
                                <View style={styles.pulsingDot} />
                                <Text style={styles.activeStatusText}>In Consultation</Text>
                            </View>
                        )}
                    </View>
                </View>
            </View>

            <View style={styles.rightSection}>
                <View style={[styles.iconButton, { backgroundColor: theme.iconButton }]}>
                    <ChevronRight size={20} color={theme.textTertiary} />
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 20,
        borderWidth: 1,
        marginBottom: 12,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 8,
        elevation: 2,
    },
    leftSection: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    timeContainer: {
        alignItems: 'center',
        width: 60,
    },
    timeText: {
        fontSize: 15,
        fontFamily: 'Inter-Bold',
        marginBottom: 6,
    },
    tokenBadge: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 8,
    },
    tokenText: {
        fontSize: 11,
        fontFamily: 'Inter-SemiBold',
    },
    divider: {
        width: 1,
        height: 44,
        backgroundColor: '#e5e7eb',
        marginHorizontal: 16,
    },
    infoContainer: {
        flex: 1,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 4,
    },
    name: {
        fontSize: 16,
        fontFamily: 'Inter-SemiBold',
        letterSpacing: -0.3,
    },
    newBadge: {
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: 'rgba(37, 99, 235, 0.2)',
    },
    newBadgeText: {
        fontSize: 10,
        fontFamily: 'Inter-Bold',
        color: '#2563eb',
    },
    reason: {
        fontSize: 13,
        fontFamily: 'Inter-Medium',
        marginBottom: 4,
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    type: {
        fontSize: 12,
        fontFamily: 'Inter-Regular',
    },
    activeStatus: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
    },
    pulsingDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#10b981',
    },
    activeStatusText: {
        fontSize: 11,
        fontFamily: 'Inter-Bold',
        color: '#10b981',
    },
    rightSection: {
        paddingLeft: 12,
    },
    iconButton: {
        width: 32,
        height: 32,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
});
