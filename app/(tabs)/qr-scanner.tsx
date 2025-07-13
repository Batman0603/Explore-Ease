import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Modal,
  TextInput,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { QrCode, Camera, FlashlightOff as FlashOff, Slash as FlashOn, X, Store, MapPin, Image as ImageIcon } from 'lucide-react-native';
import { useColors } from '@/hooks/useColors';
import { authService } from '@/utils/auth';
import { User } from '@/types';

export default function QRScanner() {
  const colors = useColors();
  const [user, setUser] = useState<User | null>(null);
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [torch, setTorch] = useState(false);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [shopData, setShopData] = useState({
    name: '',
    category: '',
    description: '',
    address: '',
  });

  useEffect(() => {
    checkUserAccess();
  }, []);

  const checkUserAccess = async () => {
    const currentUser = await authService.getCurrentUser();
    if (!currentUser || currentUser.type !== 'shop_owner') {
      Alert.alert(
        'Access Denied',
        'QR Scanner is only available for shop owners.',
        [{ text: 'OK', onPress: () => router.replace('/(tabs)') }]
      );
      return;
    }
    setUser(currentUser);
  };

  const handleQRCodeScanned = (data: string) => {
    // Simulate QR code authentication
    Alert.alert(
      'QR Code Scanned',
      'Shop registration QR code detected. Would you like to register your shop?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Register Shop',
          onPress: () => setShowRegistrationModal(true),
        },
      ]
    );
  };

  const handleShopRegistration = () => {
    if (!shopData.name || !shopData.category || !shopData.description || !shopData.address) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    // Simulate shop registration
    Alert.alert(
      'Success',
      'Your shop has been registered successfully! It will appear on the map for customers to discover.',
      [
        {
          text: 'OK',
          onPress: () => {
            setShowRegistrationModal(false);
            setShopData({ name: '', category: '', description: '', address: '' });
          },
        },
      ]
    );
  };

  if (!permission) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <Text>Loading camera...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.permissionContainer}>
          <QrCode size={64} color={colors.textTertiary} />
          <Text style={[styles.permissionTitle, { color: colors.text }]}>Camera Permission Required</Text>
          <Text style={[styles.permissionText, { color: colors.textSecondary }]}>
            We need camera access to scan QR codes for shop registration
          </Text>
          <TouchableOpacity style={[styles.permissionButton, { backgroundColor: colors.primary }]} onPress={requestPermission}>
            <Text style={[styles.permissionButtonText, { color: colors.white }]}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.surface }]}>
        <Text style={[styles.title, { color: colors.text }]}>QR Scanner</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>Scan QR code to register your shop</Text>
      </View>

      <View style={styles.cameraContainer}>
        <CameraView
          style={styles.camera}
          facing={facing}
          enableTorch={torch}
          onBarcodeScanned={({ data }) => handleQRCodeScanned(data)}
        >
          <View style={styles.overlay}>
            <View style={styles.scanArea}>
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
            </View>
          </View>
        </CameraView>

        <View style={styles.controls}>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={() => setTorch(!torch)}
          >
            {torch ? (
              <FlashOn size={24} color={colors.white} />
            ) : (
              <FlashOff size={24} color={colors.white} />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.controlButton}
            onPress={() => setFacing(current => (current === 'back' ? 'front' : 'back'))}
          >
            <Camera size={24} color={colors.white} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.instructions, { backgroundColor: colors.surface }]}>
        <Text style={[styles.instructionTitle, { color: colors.text }]}>How to register your shop:</Text>
        <Text style={[styles.instructionText, { color: colors.textSecondary }]}>
          1. Point your camera at the QR code provided by ExploreEase
        </Text>
        <Text style={[styles.instructionText, { color: colors.textSecondary }]}>
          2. Wait for the code to be scanned automatically
        </Text>
        <Text style={[styles.instructionText, { color: colors.textSecondary }]}>
          3. Fill in your shop details to complete registration
        </Text>
      </View>

      {/* Shop Registration Modal */}
      <Modal
        visible={showRegistrationModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <View style={[styles.modalHeader, { backgroundColor: colors.surface }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Register Your Shop</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowRegistrationModal(false)}
            >
              <X size={24} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Shop Name *</Text>
              <TextInput
                style={[styles.input, { 
                  borderColor: colors.border,
                  backgroundColor: colors.surface,
                  color: colors.text 
                }]}
                placeholder="Enter your shop name"
                placeholderTextColor={colors.textTertiary}
                value={shopData.name}
                onChangeText={(text) => setShopData({ ...shopData, name: text })}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Category *</Text>
              <TextInput
                style={[styles.input, { 
                  borderColor: colors.border,
                  backgroundColor: colors.surface,
                  color: colors.text 
                }]}
                placeholder="e.g., Coffee & Tea, Food & Grocery"
                placeholderTextColor={colors.textTertiary}
                value={shopData.category}
                onChangeText={(text) => setShopData({ ...shopData, category: text })}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Description *</Text>
              <TextInput
                style={[styles.input, styles.textArea, { 
                  borderColor: colors.border,
                  backgroundColor: colors.surface,
                  color: colors.text 
                }]}
                placeholder="Describe your shop and what you offer"
                placeholderTextColor={colors.textTertiary}
                value={shopData.description}
                onChangeText={(text) => setShopData({ ...shopData, description: text })}
                multiline
                numberOfLines={4}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: colors.text }]}>Address *</Text>
              <TextInput
                style={[styles.input, { 
                  borderColor: colors.border,
                  backgroundColor: colors.surface,
                  color: colors.text 
                }]}
                placeholder="Enter your shop address"
                placeholderTextColor={colors.textTertiary}
                value={shopData.address}
                onChangeText={(text) => setShopData({ ...shopData, address: text })}
              />
            </View>

            <TouchableOpacity style={[styles.imageUpload, { borderColor: colors.border }]}>
              <ImageIcon size={24} color={colors.textTertiary} />
              <Text style={[styles.imageUploadText, { color: colors.textSecondary }]}>Add Shop Photo</Text>
            </TouchableOpacity>
          </ScrollView>

          <View style={[styles.modalFooter, { backgroundColor: colors.surface }]}>
            <TouchableOpacity
              style={[styles.cancelButton, { borderColor: colors.border }]}
              onPress={() => setShowRegistrationModal(false)}
            >
              <Text style={[styles.cancelButtonText, { color: colors.text }]}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.registerButton, { backgroundColor: colors.primary }]}
              onPress={handleShopRegistration}
            >
              <Text style={[styles.registerButtonText, { color: colors.white }]}>Register Shop</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 12,
    textAlign: 'center',
  },
  permissionText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  permissionButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  permissionButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
  },
  cameraContainer: {
    flex: 1,
    position: 'relative',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanArea: {
    width: 250,
    height: 250,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#FFFFFF',
    borderWidth: 3,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  controls: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 40,
  },
  controlButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#00000080',
    justifyContent: 'center',
    alignItems: 'center',
  },
  instructions: {
    padding: 20,
  },
  instructionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  instructionText: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  imageUpload: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 12,
    paddingVertical: 40,
    alignItems: 'center',
    marginBottom: 20,
  },
  imageUploadText: {
    fontSize: 14,
    marginTop: 8,
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  registerButton: {
    flex: 2,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  registerButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});