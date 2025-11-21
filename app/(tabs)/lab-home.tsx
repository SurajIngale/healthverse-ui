import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { FlaskConical, Clock, CheckCircle2, Bell, Settings, Home, Search, Calendar, User, Sun, Moon, ChevronRight, Eye, FileText } from 'lucide-react-native';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';
import { useRouter } from 'expo-router';
import { useTheme, lightTheme, darkTheme } from '../../contexts/ThemeContext';
import { useLabRequests } from '../../contexts/LabRequestContext';

type FilterType = 'pending' | 'completed' | 'all';

interface SwipeableCardProps {
  request: any;
  index: number;
  statusBadge: any;
  colors: any;
  onCardPress: (request: any) => void;
  swipedCardId: number | null;
  setSwipedCardId: (id: number | null) => void;
}

function SwipeableCard({
  request,
  index,
  statusBadge,
  colors,
  onCardPress,
  swipedCardId,
  setSwipedCardId,
}: SwipeableCardProps) {
  const router = useRouter();
  const translateX = new Animated.Value(0);
  const isSwiped = swipedCardId === request.id;

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationX < 0) {
        translateX.setValue(Math.max(event.translationX, -150));
      }
    })
    .onEnd((event) => {
      if (event.translationX < -50) {
        Animated.spring(translateX, {
          toValue: -150,
          useNativeDriver: true,
          speed: 20,
          bounciness: 0,
        }).start();
        setSwipedCardId(request.id);
      } else {
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
          speed: 20,
          bounciness: 8,
        }).start();
        setSwipedCardId(null);
      }
    });

  React.useEffect(() => {
    if (!isSwiped && swipedCardId !== null && swipedCardId !== request.id) {
      Animated.spring(translateX, {
        toValue: 0,
        useNativeDriver: true,
        speed: 20,
        bounciness: 8,
      }).start();
    }
  }, [swipedCardId]);

  const handleQuickAction = (action: 'process' | 'view' | 'details') => {
    setSwipedCardId(null);
    Animated.spring(translateX, {
      toValue: 0,
      useNativeDriver: true,
      speed: 20,
      bounciness: 8,
    }).start();

    if (action === 'process') {
      router.push({
        pathname: '/process-request',
        params: { requestId: request.id.toString() },
      });
    } else if (action === 'view') {
      router.push({
        pathname: '/view-reports',
        params: { requestId: request.id.toString() },
      });
    }
  };

  return (
    <MotiView
      from={{ opacity: 0, translateX: -20 }}
      animate={{ opacity: 1, translateX: 0 }}
      transition={{ delay: 700 + index * 100, type: 'spring' }}
      style={styles.cardWrapper}
    >
      <View style={styles.swipeActionsContainer}>
        {request.status === 'pending' ? (
          <>
            <TouchableOpacity
              style={[styles.swipeAction, styles.swipeActionProcess]}
              onPress={() => handleQuickAction('process')}
              activeOpacity={0.8}
            >
              <FileText size={20} color="#ffffff" strokeWidth={2} />
              <Text style={styles.swipeActionText}>Process</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.swipeAction, styles.swipeActionDetails]}
              onPress={() => handleQuickAction('details')}
              activeOpacity={0.8}
            >
              <Eye size={20} color="#ffffff" strokeWidth={2} />
              <Text style={styles.swipeActionText}>Details</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TouchableOpacity
              style={[styles.swipeAction, styles.swipeActionView]}
              onPress={() => handleQuickAction('view')}
              activeOpacity={0.8}
            >
              <Eye size={20} color="#ffffff" strokeWidth={2} />
              <Text style={styles.swipeActionText}>View</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.swipeAction, styles.swipeActionDetails]}
              onPress={() => handleQuickAction('details')}
              activeOpacity={0.8}
            >
              <FileText size={20} color="#ffffff" strokeWidth={2} />
              <Text style={styles.swipeActionText}>Details</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <GestureDetector gesture={panGesture}>
        <Animated.View style={[{ transform: [{ translateX }] }]}>
          <TouchableOpacity
            onPress={() => onCardPress(request)}
            style={[styles.testCard, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}
            activeOpacity={0.7}
          >
            <View style={styles.cardContent}>
              <View style={[
                styles.priorityIndicator,
                request.priority === 'high' ? styles.priorityHigh : styles.priorityNormal
              ]} />

              <View style={styles.cardMain}>
                <View style={styles.cardTop}>
                  <Text style={[styles.patientName, { color: colors.text }]} numberOfLines={1}>
                    {request.patient}
                  </Text>
                  <ChevronRight size={20} color={colors.textTertiary} strokeWidth={2} />
                </View>

                <Text style={[styles.testName, { color: colors.textTertiary }]} numberOfLines={1}>
                  {request.tests.join(', ')}
                </Text>

                <View style={styles.cardBottom}>
                  <Text style={[styles.testTime, { color: colors.textSecondary }]}>
                    {request.timestamp}
                  </Text>
                  <View style={[styles.statusBadge, { backgroundColor: `${statusBadge.color}20` }]}>
                    <Text style={[styles.statusText, { color: statusBadge.color }]}>
                      {statusBadge.label}
                    </Text>
                  </View>
                </View>

                <Text style={[styles.doctorInfo, { color: colors.textSecondary }]} numberOfLines={1}>
                  {request.doctor} - {request.hospital}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </Animated.View>
      </GestureDetector>
    </MotiView>
  );
}

export default function LabHomeScreen() {
  const router = useRouter();
  const { isDark, toggleTheme } = useTheme();
  const colors = isDark ? darkTheme : lightTheme;
  const { testRequests } = useLabRequests();
  const [activeFilter, setActiveFilter] = useState<FilterType>('pending');
  const [swipedCardId, setSwipedCardId] = useState<number | null>(null);

  const pendingCount = testRequests.filter(r => r.status === 'pending').length;
  const completedCount = testRequests.filter(r => r.status === 'completed').length;
  const totalCount = testRequests.length;

  const stats = [
    { label: 'Pending Tests', value: pendingCount.toString(), icon: Clock, color: '#f59e0b', filter: 'pending' as FilterType },
    { label: 'Completed', value: completedCount.toString(), icon: CheckCircle2, color: '#10b981', filter: 'completed' as FilterType },
    { label: 'Total Today', value: totalCount.toString(), icon: FlaskConical, color: '#3b82f6', filter: 'all' as FilterType },
  ];

  const filteredRequests = testRequests.filter(request => {
    if (activeFilter === 'all') return true;
    return request.status === activeFilter;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'Pending', color: '#FFA500', emoji: '🟡' },
      processing: { label: 'Processing', color: '#007BFF', emoji: '🔵' },
      completed: { label: 'Completed', color: '#28A745', emoji: '🟢' },
    };
    return statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
  };

  const handleCardPress = (request: any) => {
    if (swipedCardId === request.id) {
      setSwipedCardId(null);
      return;
    }

    if (request.status === 'pending') {
      router.push({
        pathname: '/process-request',
        params: {
          requestId: request.id.toString(),
        },
      });
    } else {
      router.push({
        pathname: '/view-reports',
        params: {
          requestId: request.id.toString(),
        },
      });
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.containerBg }]}>
      <LinearGradient
        colors={colors.background}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: colors.textSecondary }]}>Welcome</Text>
            <Text style={[styles.username, { color: colors.text }]}>HealthCare Diagnostics</Text>
          </View>
          <View style={styles.headerIcons}>
            <TouchableOpacity onPress={toggleTheme} style={[styles.iconButton, { backgroundColor: colors.iconButton, borderColor: colors.iconButtonBorder }]}>
              {isDark ? (
                <Sun size={22} color={colors.textSecondary} strokeWidth={2} />
              ) : (
                <Moon size={22} color={colors.textSecondary} strokeWidth={2} />
              )}
            </TouchableOpacity>
            <TouchableOpacity style={[styles.iconButton, { backgroundColor: colors.iconButton, borderColor: colors.iconButtonBorder }]}>
              <Bell size={22} color={colors.textSecondary} strokeWidth={2} />
            </TouchableOpacity>
            <TouchableOpacity style={[styles.iconButton, { backgroundColor: colors.iconButton, borderColor: colors.iconButtonBorder }]}>
              <Settings size={22} color={colors.textSecondary} strokeWidth={2} />
            </TouchableOpacity>
          </View>
        </View>

        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: 200, type: 'spring' }}
          style={styles.statsContainer}
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const isActive = activeFilter === stat.filter;
            return (
              <TouchableOpacity
                key={stat.label}
                onPress={() => setActiveFilter(stat.filter)}
                activeOpacity={0.7}
                style={{ flex: 1 }}
              >
                <MotiView
                  from={{ opacity: 0, scale: 0.9 }}
                  animate={{
                    opacity: 1,
                    scale: isActive ? 1.05 : 1,
                  }}
                  transition={{ delay: 300 + index * 100, type: 'spring' }}
                  style={[
                    styles.statCard,
                    {
                      backgroundColor: colors.cardBg,
                      borderColor: isActive ? stat.color : colors.cardBorder,
                      borderWidth: isActive ? 2 : 1,
                    }
                  ]}
                >
                  <View style={[styles.statIcon, { backgroundColor: `${stat.color}15` }]}>
                    <Icon size={24} color={stat.color} strokeWidth={2} />
                  </View>
                  <Text style={[styles.statValue, { color: colors.text }]}>{stat.value}</Text>
                  <Text style={[styles.statLabel, { color: colors.textTertiary }]}>{stat.label}</Text>
                </MotiView>
              </TouchableOpacity>
            );
          })}
        </MotiView>

        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: 600, type: 'spring' }}
          style={styles.section}
        >
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {activeFilter === 'pending' ? 'Pending Test Reports' :
               activeFilter === 'completed' ? 'Completed Reports' :
               'All Test Reports'}
            </Text>
            <Text style={[styles.sectionCount, { color: colors.textSecondary }]}>
              {filteredRequests.length}
            </Text>
          </View>

          {filteredRequests.map((request, index) => {
            const statusBadge = getStatusBadge(request.status);

            return (
              <SwipeableCard
                key={request.id}
                request={request}
                index={index}
                statusBadge={statusBadge}
                colors={colors}
                onCardPress={handleCardPress}
                swipedCardId={swipedCardId}
                setSwipedCardId={setSwipedCardId}
              />
            );
          })}

          {filteredRequests.length === 0 && (
            <View style={[styles.emptyState, { backgroundColor: colors.cardBg, borderColor: colors.cardBorder }]}>
              <Text style={[styles.emptyText, { color: colors.textTertiary }]}>
                No {activeFilter === 'all' ? '' : activeFilter} requests found
              </Text>
            </View>
          )}
        </MotiView>
      </ScrollView>

      <View style={styles.bottomNav}>
        <View style={[styles.navContainer, { backgroundColor: colors.navBg, borderColor: colors.iconButtonBorder }]}>
          <TouchableOpacity style={styles.navButton} activeOpacity={0.7}>
            <View style={[styles.navButtonInner, styles.navButtonActive]}>
              <Home size={24} color="#ffffff" strokeWidth={2} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navButton} activeOpacity={0.7}>
            <View style={[styles.navButtonInner, { backgroundColor: colors.navInactive }]}>
              <Search size={24} color={colors.textSecondary} strokeWidth={2} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navButton} activeOpacity={0.7}>
            <View style={[styles.navButtonInner, { backgroundColor: colors.navInactive }]}>
              <Calendar size={24} color={colors.textSecondary} strokeWidth={2} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navButton} activeOpacity={0.7}>
            <View style={[styles.navButtonInner, { backgroundColor: colors.navInactive }]}>
              <User size={24} color={colors.textSecondary} strokeWidth={2} />
            </View>
          </TouchableOpacity>
        </View>
      </View>
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
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 120,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  greeting: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
  },
  username: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#1e293b',
    marginTop: 4,
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.1)',
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1e293b',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#94a3b8',
    textAlign: 'center',
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#1e293b',
  },
  sectionCount: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#64748b',
  },
  cardWrapper: {
    marginBottom: 12,
    position: 'relative',
  },
  swipeActionsContainer: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingRight: 12,
  },
  swipeAction: {
    width: 70,
    height: '90%',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  swipeActionProcess: {
    backgroundColor: '#f59e0b',
  },
  swipeActionView: {
    backgroundColor: '#10b981',
  },
  swipeActionDetails: {
    backgroundColor: '#3b82f6',
  },
  swipeActionText: {
    fontSize: 11,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  testCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.1)',
  },
  cardContent: {
    flexDirection: 'row',
    gap: 12,
  },
  cardMain: {
    flex: 1,
    gap: 6,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priorityIndicator: {
    width: 4,
    height: 60,
    borderRadius: 2,
    marginTop: 4,
  },
  priorityHigh: {
    backgroundColor: '#ef4444',
  },
  priorityNormal: {
    backgroundColor: '#3b82f6',
  },
  patientName: {
    fontSize: 17,
    fontFamily: 'Inter-Bold',
    color: '#1e293b',
    flex: 1,
  },
  testName: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#94a3b8',
  },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  testTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  doctorInfo: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#64748b',
  },
  emptyState: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.1)',
  },
  emptyText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#94a3b8',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 24,
    left: 24,
    right: 24,
    alignItems: 'center',
  },
  navContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 28,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
    shadowColor: '#f59e0b',
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
    backgroundColor: 'rgba(241, 245, 249, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButtonActive: {
    backgroundColor: '#f59e0b',
    shadowColor: '#f59e0b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
});
