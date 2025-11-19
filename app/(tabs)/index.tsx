import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import { useRouter } from 'expo-router';
import OnboardingSlide1 from '../../components/OnboardingSlide1';
import OnboardingSlide2 from '../../components/OnboardingSlide2';
import OnboardingSlide3 from '../../components/OnboardingSlide3';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const router = useRouter();

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / SCREEN_WIDTH);
    setCurrentIndex(index);
  };

  const scrollToNext = () => {
    if (currentIndex < 2) {
      scrollViewRef.current?.scrollTo({
        x: (currentIndex + 1) * SCREEN_WIDTH,
        animated: true,
      });
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = () => {
    router.push('/entry');
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0A0E27', '#1a1f3a', '#0A0E27']}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        bounces={false}
        style={styles.scrollView}
      >
        <View style={styles.slide}>
          <OnboardingSlide1 />
        </View>
        <View style={styles.slide}>
          <OnboardingSlide2 />
        </View>
        <View style={styles.slide}>
          <OnboardingSlide3 />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.dotsContainer}>
          {[0, 1, 2].map((index) => (
            <MotiView
              key={index}
              animate={{
                width: currentIndex === index ? 32 : 8,
                opacity: currentIndex === index ? 1 : 0.3,
              }}
              transition={{
                type: 'spring',
                damping: 15,
                stiffness: 150,
              }}
              style={[
                styles.dot,
                currentIndex === index && styles.dotActive,
              ]}
            />
          ))}
        </View>

        <TouchableOpacity
          style={styles.nextButton}
          onPress={scrollToNext}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#00F5FF', '#00B8D4']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.buttonGradient}
          >
            <MotiView
              from={{ opacity: 0.6, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                type: 'timing',
                duration: 1000,
                loop: true,
                repeatReverse: true,
              }}
              style={styles.buttonGlow}
            />
            <Text style={styles.nextButtonText}>
              {currentIndex === 2 ? 'Get Started' : 'Next'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0E27',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  skipButton: {
    position: 'absolute',
    top: 60,
    right: 24,
    zIndex: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  skipText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  scrollView: {
    flex: 1,
  },
  slide: {
    width: SCREEN_WIDTH,
    flex: 1,
  },
  footer: {
    paddingHorizontal: 32,
    paddingBottom: 48,
    paddingTop: 24,
    alignItems: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 32,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00F5FF',
  },
  dotActive: {
    backgroundColor: '#00F5FF',
  },
  nextButton: {
    width: '100%',
    maxWidth: 320,
    height: 60,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#00F5FF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  buttonGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  buttonGlow: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0A0E27',
    letterSpacing: 0.5,
  },
});
