
import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Search, ScanLine } from 'lucide-react-native';
import { useTheme, lightTheme, darkTheme } from '@/modules/shared/contexts/ThemeContext';

interface PatientSearchProps {
    onSearch: (query: string) => void;
    onScanPress: () => void;
}

export default function PatientSearch({ onSearch, onScanPress }: PatientSearchProps) {
    const { isDark } = useTheme();
    const theme = isDark ? darkTheme : lightTheme;

    return (
        <View style={styles.container}>
            <View
                style={[
                    styles.searchBar,
                    { backgroundColor: theme.cardBg, borderColor: theme.cardBorder },
                ]}
            >
                <Search size={20} color={theme.textTertiary} />
                <TextInput
                    style={[styles.input, { color: theme.text }]}
                    placeholder="Search patients...."
                    placeholderTextColor={theme.textTertiary}
                    onChangeText={onSearch}
                />
                <TouchableOpacity onPress={onScanPress} style={styles.scanButton}>
                    <ScanLine size={20} color={theme.accent} />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        marginBottom: 24,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        height: 52,
        borderRadius: 14,
        borderWidth: 1,
        gap: 12,
    },
    input: {
        flex: 1,
        fontSize: 15,
        fontFamily: 'Inter-Regular',
        height: '100%',
    },
    scanButton: {
        padding: 4,
    },
});
