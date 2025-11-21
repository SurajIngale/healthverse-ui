import React, { useState, useRef, Suspense } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text3D, Center, useTexture } from '@react-three/drei';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import Animated, { useAnimatedScrollHandler, useSharedValue, interpolate, Extrapolate } from 'react-native-reanimated';
import { Upload, X, Layers } from 'lucide-react-native';
import { useTheme, lightTheme, darkTheme } from '../contexts/ThemeContext';
import * as THREE from 'three';

export interface Document {
  id: string;
  type: 'prescription' | 'report' | 'invoice' | 'other';
  title: string;
  date: string;
  timestamp: number;
  icon?: string;
  url?: string;
  fileType?: string;
}

interface DocumentTimeline3DProps {
  documents: Document[];
  onUpload: () => void;
  onViewDocument: (doc: Document) => void;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const getDocumentColor = (type: string): THREE.Color => {
  switch (type) {
    case 'prescription':
      return new THREE.Color('#10B981');
    case 'report':
      return new THREE.Color('#6366F1');
    case 'invoice':
      return new THREE.Color('#F59E0B');
    default:
      return new THREE.Color('#EF4444');
  }
};

const getDocumentEmoji = (type: string) => {
  switch (type) {
    case 'prescription':
      return '💊';
    case 'report':
      return '📋';
    case 'invoice':
      return '🧾';
    default:
      return '📄';
  }
};

interface TimelineNodeProps {
  doc: Document;
  index: number;
  total: number;
  scrollY: number;
  onPress: () => void;
}

function TimelineNode({ doc, index, total, scrollY, onPress }: TimelineNodeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  const color = getDocumentColor(doc.type);

  const getCurvedPosition = (idx: number, totalDocs: number, scroll: number) => {
    const t = idx / Math.max(totalDocs - 1, 1);
    const yBase = (totalDocs - 1 - idx) * 2.5;

    const normalizedScroll = scroll / (totalDocs * 120);
    const yOffset = normalizedScroll * (totalDocs * 2.5);

    const y = yBase - yOffset;
    const x = Math.sin(t * Math.PI * 1.5) * 1.5;
    const z = Math.cos(t * Math.PI * 1.5) * 0.8;

    return { x, y, z };
  };

  useFrame((state) => {
    if (!meshRef.current || !groupRef.current) return;

    const targetPos = getCurvedPosition(index, total, scrollY);

    groupRef.current.position.x = THREE.MathUtils.lerp(
      groupRef.current.position.x,
      targetPos.x,
      0.1
    );
    groupRef.current.position.y = THREE.MathUtils.lerp(
      groupRef.current.position.y,
      targetPos.y,
      0.1
    );
    groupRef.current.position.z = THREE.MathUtils.lerp(
      groupRef.current.position.z,
      targetPos.z,
      0.1
    );

    const distanceFromCenter = Math.abs(groupRef.current.position.y);
    const scale = THREE.MathUtils.lerp(1, 0.5, Math.min(distanceFromCenter / 5, 1));
    const opacity = THREE.MathUtils.lerp(1, 0.2, Math.min(distanceFromCenter / 8, 1));

    meshRef.current.scale.setScalar(hovered ? scale * 1.2 : scale);

    if (meshRef.current.material instanceof THREE.MeshStandardMaterial) {
      meshRef.current.material.opacity = opacity;
    }

    meshRef.current.rotation.y += 0.005;
    meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.5 + index) * 0.1;
  });

  const initialPos = getCurvedPosition(index, total, scrollY);

  return (
    <group ref={groupRef} position={[initialPos.x, initialPos.y, initialPos.z]}>
      <mesh
        ref={meshRef}
        onClick={onPress}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <dodecahedronGeometry args={[0.4, 0]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 0.6 : 0.3}
          metalness={0.8}
          roughness={0.2}
          transparent
          opacity={1}
        />
      </mesh>

      <mesh position={[0, 0, 0]}>
        <torusGeometry args={[0.6, 0.04, 16, 100]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.4}
          transparent
          opacity={0.6}
        />
      </mesh>

      <pointLight
        position={[0, 0, 0]}
        intensity={hovered ? 2 : 1}
        distance={3}
        color={color}
      />
    </group>
  );
}

function TimelineSpine({ total, scrollY }: { total: number; scrollY: number }) {
  const curveRef = useRef<THREE.Line>(null);

  const getCurvedPosition = (idx: number, totalDocs: number) => {
    const t = idx / Math.max(totalDocs - 1, 1);
    const y = (totalDocs - 1 - idx) * 2.5;
    const x = Math.sin(t * Math.PI * 1.5) * 1.5;
    const z = Math.cos(t * Math.PI * 1.5) * 0.8;
    return new THREE.Vector3(x, y, z);
  };

  const points = React.useMemo(() => {
    const pts = [];
    const segments = Math.max(total * 10, 50);

    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const idx = t * (total - 1);
      const y = (total - 1 - idx) * 2.5;
      const x = Math.sin(t * Math.PI * 1.5) * 1.5;
      const z = Math.cos(t * Math.PI * 1.5) * 0.8;
      pts.push(new THREE.Vector3(x, y, z - 0.3));
    }

    return pts;
  }, [total]);

  useFrame(() => {
    if (!curveRef.current) return;
    const normalizedScroll = scrollY / (total * 120);
    curveRef.current.position.y = -normalizedScroll * (total * 2.5);
  });

  return (
    <group>
      <line ref={curveRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={points.length}
            array={new Float32Array(points.flatMap(p => [p.x, p.y, p.z]))}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color="#6366F1"
          linewidth={2}
          transparent
          opacity={0.5}
        />
      </line>
    </group>
  );
}

function Scene({ documents, scrollY, onDocumentPress }: {
  documents: Document[];
  scrollY: number;
  onDocumentPress: (doc: Document) => void;
}) {
  const { camera } = useThree();

  React.useEffect(() => {
    camera.position.set(2, 0, 8);
  }, [camera]);

  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <directionalLight position={[-10, -10, -5]} intensity={0.5} />

      <TimelineSpine total={documents.length} scrollY={scrollY} />

      {documents.map((doc, index) => (
        <TimelineNode
          key={doc.id}
          doc={doc}
          index={index}
          total={documents.length}
          scrollY={scrollY}
          onPress={() => onDocumentPress(doc)}
        />
      ))}

      <fog attach="fog" args={['#0F172A', 5, 20]} />
    </>
  );
}

export function DocumentTimeline3D({ documents, onUpload, onViewDocument }: DocumentTimeline3DProps) {
  const { isDark } = useTheme();
  const colors = isDark ? darkTheme : lightTheme;
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const scrollY = useSharedValue(0);

  const sortedDocs = [...documents].sort((a, b) => b.timestamp - a.timestamp);

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const handleDocumentPress = (doc: Document) => {
    setSelectedDoc(doc);
    onViewDocument(doc);
  };

  if (documents.length === 0) {
    return (
      <MotiView
        from={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 300, damping: 15 } as any}
        style={[
          styles.emptyCard,
          {
            backgroundColor: colors.cardBg,
            borderColor: colors.cardBorder,
          },
        ]}
      >
        <View style={[styles.emptyContainer, { backgroundColor: colors.accentLight }]}>
          <Upload size={40} color={colors.accent} strokeWidth={1.5} />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>
            No Documents Yet
          </Text>
          <Text style={[styles.emptySubtitle, { color: colors.textTertiary }]}>
            Upload your medical documents
          </Text>
        </View>

        <TouchableOpacity onPress={onUpload} style={styles.uploadButton}>
          <LinearGradient
            colors={['#6366F1', '#818CF8']}
            style={styles.uploadButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Upload size={18} color="#ffffff" strokeWidth={2} />
            <Text style={styles.uploadButtonText}>Upload Document</Text>
          </LinearGradient>
        </TouchableOpacity>
      </MotiView>
    );
  }

  return (
    <>
      <MotiView
        from={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 300, damping: 15 } as any}
        style={[
          styles.mainCard,
          {
            backgroundColor: colors.cardBg,
            borderColor: colors.cardBorder,
          },
        ]}
      >
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={[styles.title, { color: colors.text }]}>
              Documents Timeline
            </Text>
            <View style={[styles.countBadge, { backgroundColor: colors.accentLight }]}>
              <Text style={[styles.count, { color: colors.accent }]}>
                {documents.length}
              </Text>
            </View>
          </View>
          <Layers size={20} color={colors.accent} strokeWidth={2} />
        </View>

        <View style={styles.canvasContainer}>
          <Canvas
            style={[styles.canvas, { backgroundColor: isDark ? '#0F172A' : '#F8F9FF' }]}
            camera={{ position: [0, 0, 8], fov: 50 }}
          >
            <Suspense fallback={null}>
              <Scene
                documents={sortedDocs}
                scrollY={scrollY.value}
                onDocumentPress={handleDocumentPress}
              />
            </Suspense>
          </Canvas>

          <Animated.ScrollView
            style={styles.scrollOverlay}
            contentContainerStyle={styles.scrollContent}
            onScroll={scrollHandler}
            scrollEventThrottle={16}
            showsVerticalScrollIndicator={true}
          >
            {sortedDocs.map((doc, index) => (
              <TouchableOpacity
                key={doc.id}
                onPress={() => handleDocumentPress(doc)}
                style={styles.docItem}
                activeOpacity={0.7}
              >
                <View style={styles.docItemContent}>
                  <Text style={[styles.docEmoji, { color: colors.text }]}>
                    {getDocumentEmoji(doc.type)}
                  </Text>
                  <View style={styles.docInfo}>
                    <Text style={[styles.docTitle, { color: colors.text }]} numberOfLines={1}>
                      {doc.title}
                    </Text>
                    <Text style={[styles.docDate, { color: colors.textTertiary }]}>
                      {doc.date}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
            <View style={styles.scrollSpacer} />
          </Animated.ScrollView>
        </View>

        <TouchableOpacity onPress={onUpload} style={styles.addButton}>
          <LinearGradient
            colors={['#6366F1', '#818CF8']}
            style={styles.addButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Upload size={18} color="#ffffff" strokeWidth={2} />
            <Text style={styles.addButtonText}>Add Document</Text>
          </LinearGradient>
        </TouchableOpacity>
      </MotiView>

      <Modal
        visible={!!selectedDoc}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedDoc(null)}
      >
        <View
          style={[
            styles.modalOverlay,
            {
              backgroundColor: isDark
                ? 'rgba(15, 23, 42, 0.95)'
                : 'rgba(0, 0, 0, 0.8)',
            },
          ]}
        >
          <MotiView
            from={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 20 }}
            style={[styles.modalContent, { backgroundColor: colors.containerBg }]}
          >
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                {selectedDoc?.title}
              </Text>
              <TouchableOpacity onPress={() => setSelectedDoc(null)}>
                <X size={24} color={colors.text} strokeWidth={2} />
              </TouchableOpacity>
            </View>

            <View style={styles.modalDivider} />

            <ScrollView
              style={styles.modalBody}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.docDetails}>
                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: colors.textTertiary }]}>
                    Type
                  </Text>
                  <Text style={[styles.detailValue, { color: colors.text }]}>
                    {selectedDoc?.type.charAt(0).toUpperCase()}
                    {selectedDoc?.type.slice(1)}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={[styles.detailLabel, { color: colors.textTertiary }]}>
                    Date
                  </Text>
                  <Text style={[styles.detailValue, { color: colors.text }]}>
                    {selectedDoc?.date}
                  </Text>
                </View>

                {selectedDoc?.fileType && (
                  <View style={styles.detailRow}>
                    <Text style={[styles.detailLabel, { color: colors.textTertiary }]}>
                      File Type
                    </Text>
                    <Text style={[styles.detailValue, { color: colors.text }]}>
                      {selectedDoc.fileType}
                    </Text>
                  </View>
                )}
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                onPress={() => setSelectedDoc(null)}
                style={[styles.closeButton, { backgroundColor: colors.cardBg }]}
              >
                <Text style={[styles.closeButtonText, { color: colors.text }]}>
                  Close
                </Text>
              </TouchableOpacity>
            </View>
          </MotiView>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  emptyCard: {
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    marginBottom: 16,
    alignItems: 'center',
  },
  emptyContainer: {
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginTop: 6,
    textAlign: 'center',
  },
  uploadButton: {
    borderRadius: 12,
    overflow: 'hidden',
    width: '100%',
  },
  uploadButtonGradient: {
    flexDirection: 'row',
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  uploadButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
  mainCard: {
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
  },
  countBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  count: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
  },
  canvasContainer: {
    height: 400,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    position: 'relative',
  },
  canvas: {
    flex: 1,
  },
  scrollOverlay: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 160,
  },
  scrollContent: {
    paddingVertical: 20,
    paddingHorizontal: 12,
  },
  scrollSpacer: {
    height: 100,
  },
  docItem: {
    marginBottom: 12,
    backgroundColor: 'rgba(99, 102, 241, 0.08)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.2)',
  },
  docItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  docEmoji: {
    fontSize: 24,
  },
  docInfo: {
    flex: 1,
  },
  docTitle: {
    fontSize: 13,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 2,
  },
  docDate: {
    fontSize: 11,
    fontFamily: 'Inter-Regular',
  },
  addButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  addButtonGradient: {
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  addButtonText: {
    fontSize: 15,
    fontFamily: 'Inter-Bold',
    color: '#ffffff',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    borderRadius: 28,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    flex: 1,
    marginRight: 12,
  },
  modalDivider: {
    height: 1,
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
  },
  modalBody: {
    padding: 24,
  },
  docDetails: {
    gap: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  detailValue: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  modalFooter: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: 'rgba(99, 102, 241, 0.15)',
  },
  closeButton: {
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.2)',
  },
  closeButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
});
