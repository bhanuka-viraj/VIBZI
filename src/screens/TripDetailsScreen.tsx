import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  StatusBar,
  StatusBarStyle,
  Animated,
  Easing,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Text, useTheme, Portal } from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import dayjs from 'dayjs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ImagePicker from 'react-native-image-crop-picker';
import TripDetailsTabNavigator from '../navigation/TripDetailsTabNavigator';
import { useNavigation, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useGetTripPlanByIdQuery, useUpdateTripPlanMutation, useUploadTripPlanCoverImageMutation } from '../redux/slices/tripplan/tripPlanSlice';
import { getTripImageSource } from '../utils/tripUtils/tripDataUtil';
import { useDispatch } from 'react-redux';
import { setTripId } from '../redux/slices/metaSlice';
import { getStatusBarGradient } from '../utils/statusBarUtils';
import { theme } from '@/constants/theme';
import TripDescriptionModal from '../components/modals/TripDescriptionModal';
import ActionSheet, { ActionSheetRef } from 'react-native-actions-sheet';

const HEADER_IMAGE_HEIGHT = 200;
const MAX_DESCRIPTION_LENGTH = 50;

type TripDetailsScreenRouteProp = RouteProp<RootStackParamList, 'TripDetails'>;

interface TripDetailsScreenProps {
  route: TripDetailsScreenRouteProp;
}

const TripDetailsScreen: React.FC<TripDetailsScreenProps> = ({ route }) => {
  const { tripId, trip_id } = route.params;
  const dispatch = useDispatch();
  const { data: tripData } = useGetTripPlanByIdQuery(tripId);
  const [updateTripPlan] = useUpdateTripPlanMutation();
  const [uploadTripPlanCoverImage] = useUploadTripPlanCoverImageMutation();
  const theme = useTheme();
  const navigation = useNavigation();

  console.log('====================================');
  console.log('tripData', tripData);
  console.log('====================================');
  const [statusBarStyle] = useState<StatusBarStyle>('light-content');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);

  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(50)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.9)).current;

  const actionSheetRef = React.useRef<ActionSheetRef>(null);

  const parsedFromDate = tripData?.startDate
    ? new Date(tripData.startDate)
    : null;
  const parsedToDate = tripData?.endDate ? new Date(tripData.endDate) : null;

  const formattedFromDate = parsedFromDate
    ? dayjs(parsedFromDate).format('MMM D')
    : 'Start Date';
  const formattedToDate = parsedToDate
    ? dayjs(parsedToDate).format('MMM D')
    : 'End Date';

  const truncatedDescription = tripData?.description
    ? tripData.description.length > MAX_DESCRIPTION_LENGTH
      ? `${tripData.description.substring(0, MAX_DESCRIPTION_LENGTH)}...`
      : tripData.description
    : '';

  useEffect(() => {
    if (tripData) {
      dispatch(setTripId(tripData?.tripId));
    }
  }, [tripData, dispatch]);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        easing: Easing.elastic(1),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const goBack = () => {
    navigation.goBack();
  };

  const handleSaveDescription = async (newDescription: string) => {
    if (!tripData) return;

    try {
      await updateTripPlan({
        id: tripData.id,
        data: {
          ...tripData,
          description: newDescription,
        },
      }).unwrap();
      setIsModalVisible(false);
    } catch (error) {
      console.error('Failed to update description:', error);
    }
  };

  const pickAndCropImage = async () => {
    try {
      const image = await ImagePicker.openPicker({
        width: 1600,
        height: 700,
        cropping: true,
        cropperCircleOverlay: false,
        freeStyleCropEnabled: true,
        cropperToolbarTitle: 'Crop Image',
        mediaType: 'photo',
      });
      setIsUploading(true);
      if (tripData?.id) {
        const formData = new FormData();
        formData.append('file', {
          uri: Platform.OS === 'android' ? image.path : image.path.replace('file://', ''),
          type: 'image/jpeg',
          name: image.filename || 'cover.jpg',
        } as any);

        try {
          const uploadResponse: any = await uploadTripPlanCoverImage({
            id: tripData.id,
            file: formData
          }).unwrap();

          if (uploadResponse?.imageUrl) {
            setUploadedImageUrl(uploadResponse.imageUrl);
          }
        } catch (uploadError) {
          throw uploadError;
        }
      }
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error: any) {
      if (error?.code !== 'E_PICKER_CANCELLED') {
        console.error('Error picking image:', error);
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleUploadButtonPress = () => {
    pickAndCropImage();
  };

  const handleImageAreaPress = () => {
    actionSheetRef.current?.show();
  };

  const handleActionSheetOption = async (option: 'upload' | 'edit') => {
    actionSheetRef.current?.hide();
    if (option === 'upload') {
      pickAndCropImage();
    } else if (option === 'edit') {
      setTimeout(() => setIsModalVisible(true), 500);
    }
  };

  return (
    <>
      <StatusBar
        barStyle={statusBarStyle}
        translucent
        backgroundColor="transparent"
      />
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <Animated.View style={{ opacity: fadeAnim }}>
          <TouchableOpacity activeOpacity={0.85} onPress={handleImageAreaPress}>
            <ImageBackground
              source={getTripImageSource(uploadedImageUrl || tripData?.imageUrl)}
              style={styles.imageBackground}>
              <LinearGradient
                colors={getStatusBarGradient()}
                style={styles.statusBarGradient}
                pointerEvents="none"
              />
              <TouchableOpacity style={styles.backButton} onPress={goBack}>
                <View style={styles.backButtonCircle}>
                  <Ionicons
                    name="chevron-back-outline"
                    size={16}
                    color={theme.colors.surface}
                  />
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={handleUploadButtonPress}
                disabled={isUploading}
              >
                {isUploading ? (
                  <ActivityIndicator color={theme.colors.primary} />
                ) : (
                  <MaterialIcons
                    name="camera-alt"
                    size={18}
                    color={'white'}
                  />
                )}
              </TouchableOpacity>
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.8)']}
                style={styles.gradientOverlay}>
                <Text variant="headlineMedium" style={styles.tripTitle}>
                  {tripData?.title}
                </Text>
                <Text variant="bodyMedium" style={styles.tripDetails}>
                  {formattedFromDate} - {formattedToDate} •{' '}
                  {tripData?.destinationName} {''}
                  <MaterialIcons
                    name="location-on"
                    size={13}
                    color={theme.colors.surface}
                  />
                </Text>
                {tripData?.description && (
                  <View style={styles.descriptionContainer}>
                    <MaterialIcons
                      name="unfold-more"
                      size={14}
                      color={theme.colors.surface}
                    />
                    <View style={styles.descriptionWrapper}>
                      <Text variant="bodySmall" style={styles.description}>
                        {truncatedDescription}
                      </Text>
                    </View>
                  </View>
                )}
              </LinearGradient>
            </ImageBackground>
          </TouchableOpacity>
        </Animated.View>
        <Animated.View
          style={[
            styles.content,
            {
              transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
            },
          ]}>
          <TripDetailsTabNavigator
            screenProps={{
              tripId,
              trip_id,
            }}
          />
        </Animated.View>
        <Portal>
          <TripDescriptionModal
            key={`trip-description-modal-${tripData?.id || 'default'}-${isModalVisible ? 'visible' : 'hidden'}`}
            visible={isModalVisible}
            onDismiss={() => setIsModalVisible(false)}
            description={tripData?.description || ''}
            onSave={handleSaveDescription}
            tripId={tripData?.id}
          />
        </Portal>
        <ActionSheet ref={actionSheetRef} gestureEnabled>
          <View style={{ paddingVertical: 16 }}>
            <TouchableOpacity
              style={{ flexDirection: 'row', alignItems: 'center', padding: 16 }}
              onPress={() => handleActionSheetOption('upload')}
            >
              <MaterialIcons name="upload" size={22} color={theme.colors.primary} />
              <Text style={{ marginLeft: 12, fontSize: 16 }}>Upload Photo</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ flexDirection: 'row', alignItems: 'center', padding: 16 }}
              onPress={() => handleActionSheetOption('edit')}
            >
              <MaterialIcons name="edit" size={22} color={theme.colors.primary} />
              <Text style={{ marginLeft: 12, fontSize: 16 }}>Description</Text>
            </TouchableOpacity>
          </View>
        </ActionSheet>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  imageBackground: {
    width: '100%',
    height: HEADER_IMAGE_HEIGHT,
    justifyContent: 'flex-end',
  },
  statusBarGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: StatusBar.currentHeight ? StatusBar.currentHeight + 20 : 60,
  },
  content: {
    flex: 1,
    overflow: 'hidden',
  },
  gradientOverlay: {
    padding: 16,
    paddingTop: HEADER_IMAGE_HEIGHT * 0.15,
  },
  backButton: {
    position: 'absolute',
    top: StatusBar.currentHeight ? StatusBar.currentHeight + 2 : 40,
    left: 16,
    zIndex: 10,
  },
  backButtonCircle: {
    backgroundColor: 'rgba(52, 52, 52, 0.5)',
    borderRadius: 14,
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tripTitle: {
    color: '#fff',
  },
  tripDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    color: '#ddd',
    marginTop: 4,
  },
  descriptionContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 1,
    paddingVertical: 4,
  },
  descriptionWrapper: {
    flex: 1,
    marginLeft: 4,
  },
  description: {
    color: '#ddd',
    fontSize: 11,
    lineHeight: 16,
  },
  modalContainer: {
    paddingHorizontal: 20,
  },
  modalContent: {
    marginHorizontal: 20,
  },
  modalInner: {
    backgroundColor: 'white',
    borderRadius: 15,
    paddingBottom: 20,
    maxHeight: '80%',
    width: '100%',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalTitle: {
    color: '#333',
    marginLeft: 8,
  },
  modalActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginHorizontal: 20,
  },
  modalBody: {
    padding: 20,
  },
  descriptionIcon: {
    marginTop: 1,
  },
  modalDescription: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    letterSpacing: 0.3,
  },
  descriptionInput: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    letterSpacing: 0.3,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    padding: 16,
    minHeight: 200,
    backgroundColor: '#f8f8f8',
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
    marginHorizontal: 20,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  uploadButton: {
    position: 'absolute',
    top: StatusBar.currentHeight ? StatusBar.currentHeight + 2 : 40,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default TripDetailsScreen;
