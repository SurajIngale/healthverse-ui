import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MotiView } from 'moti';
import { useTheme, lightTheme, darkTheme } from '@/modules/shared/contexts/ThemeContext';
import PatientCard, { Patient } from './PatientCard';

interface ScheduleSectionProps {
    waitingPatients: Patient[];
    upcomingPatients: Patient[];
    completedPatients: Patient[];
    onPatientPress: (patientId: string) => void;
}

type TabType = 'waiting' | 'upcoming' | 'completed';

export default function ScheduleSection({
    waitingPatients,
    upcomingPatients,
    completedPatients,
    onPatientPress,
}: ScheduleSectionProps) {
    const { isDark } = useTheme();
    const theme = isDark ? darkTheme : lightTheme;
    const [activeTab, setActiveTab] = useState<TabType>('waiting');

    const tabs = [
        {
            id: 'waiting' as TabType,
            label: 'Waiting',
            count: waitingPatients.filter(p => p.status === 'waiting' || p.status === 'in-consultation').length,
            color: '#f59e0b',
            bgColor: 'rgba(245, 158, 11, 0.1)',
            activeBgColor: '#f59e0b',
        },
        {
            id: 'upcoming' as TabType,
            label: 'Upcoming',
            count: upcomingPatients.length,
            color: '#6366F1',
            bgColor: 'rgba(99, 102, 241, 0.1)',
            activeBgColor: '#6366F1',
        },
        {
            id: 'completed' as TabType,
            label: 'Completed',
            count: completedPatients.length,
            color: '#10b981',
            bgColor: 'rgba(16, 185, 129, 0.1)',
            activeBgColor: '#10b981',
        },
    ];

    const getActivePatients = (): Patient[] => {
        switch (activeTab) {
            case 'waiting':
                return waitingPatients.filter(p => p.status === 'waiting' || p.status === 'in-consultation');
            case 'upcoming':
                return upcomingPatients;
            case 'completed':
                return completedPatients;
            default:
                return [];
        }
    };

    const activePatients = getActivePatients();
    const activeTabData = tabs.find(tab => tab.id === activeTab) || tabs[0];

    return (
        <View style={styles.container}>
            <Text style={[styles.mainTitle, { color: theme.text }]}>Today's Schedule</Text>

            {/* Modern Tabs */}
            <View style={styles.tabsContainer}>
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.id;
                    return (
                        <TouchableOpacity
                            key={tab.id}
                            onPress={() => setActiveTab(tab.id)}
                            activeOpacity={0.7}
                            style={styles.tabButton}
                        >
                            <View style={styles.tabContent}>
                                <Text
                                    style={[
                                        styles.tabLabel,
                                        {
                                            color: isActive ? tab.color : theme.textSecondary,
                                            fontWeight: isActive ? '700' : '500',
                                        },
                                    ]}
                                >
                                    {tab.label}
                                </Text>
                                <View
                                    style={[
                                        styles.tabBadge,
                                        {
                                            backgroundColor: isActive ? tab.bgColor : 'transparent',
                                        },
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.tabBadgeText,
                                            {
                                                color: isActive ? tab.color : theme.textTertiary,
                                            },
                                        ]}
                                    >
                                        {tab.count}
                                    </Text>
                                </View>
                            </View>
                            {isActive && (
                                <MotiView
                                    from={{ scaleX: 0 }}
                                    animate={{ scaleX: 1 }}
                                    transition={{
                                        type: 'spring',
                                        damping: 15,
                                        stiffness: 200,
                                    }}
                                    style={[
                                        styles.activeIndicator,
                                        { backgroundColor: tab.color },
                                    ]}
                                />
                            )}
                        </TouchableOpacity>
                    );
                })}
            </View>

            {/* Patient List */}
            <MotiView
                key={activeTab}
                from={{ opacity: 0, translateY: 10 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: 'timing', duration: 300 }}
                style={styles.listContainer}
            >
                {activePatients.length > 0 ? (
                    activePatients.map((patient) => (
                        <PatientCard
                            key={patient.id}
                            patient={patient}
                            onPress={onPatientPress}
                        />
                    ))
                ) : (
                    <View style={[styles.emptyState, { backgroundColor: theme.cardBg, borderColor: theme.cardBorder }]}>
                        <Text style={[styles.emptyText, { color: theme.textTertiary }]}>
                            No patients in {activeTabData.label.toLowerCase()}
                        </Text>
                    </View>
                )}
            </MotiView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 24,
        marginBottom: 100,
    },
    mainTitle: {
        fontSize: 22,
        fontFamily: 'Inter-Bold',
        letterSpacing: -0.5,
        marginBottom: 20,
    },
    tabsContainer: {
        flexDirection: 'row',
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(148, 163, 184, 0.15)',
    },
    tabButton: {
        flex: 1,
        position: 'relative',
        paddingBottom: 12,
    },
    tabContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
    },
    tabLabel: {
        fontSize: 13,
        fontFamily: 'Inter-SemiBold',
    },
    tabBadge: {
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 8,
        minWidth: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabBadgeText: {
        fontSize: 10,
        fontFamily: 'Inter-Bold',
    },
    activeIndicator: {
        position: 'absolute',
        bottom: -1,
        left: '15%',
        right: '15%',
        height: 3,
        borderRadius: 2,
    },
    listContainer: {
        gap: 10,
    },
    emptyState: {
        padding: 32,
        borderRadius: 16,
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
    emptyText: {
        fontSize: 14,
        fontFamily: 'Inter-Medium',
    },
});
