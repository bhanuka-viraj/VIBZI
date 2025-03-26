import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  StatusBar,
  StatusBarStyle,
  Animated,
  Easing,
  TextInput,
} from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import dayjs from 'dayjs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ActionSheet, { ActionSheetRef } from 'react-native-actions-sheet';
import TripDetailsTabNavigator from '../navigation/TripDetailsTabNavigator';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useGetTripPlanByIdQuery, useUpdateTripPlanMutation } from '../redux/slices/tripplan/tripPlanSlice';
import { getImageSource } from '../utils/tripUtils/tripDataUtil';
import LoadingScreen from '../components/LoadingScreen';
import { useDispatch } from 'react-redux';
import { setTripId } from '../redux/slices/metaSlice';
import { StatusBarStyles, getStatusBarGradient } from '../utils/statusBarUtils';
import { theme } from '@/constants/theme';

const HEADER_IMAGE_HEIGHT = 200;
const MAX_DESCRIPTION_LENGTH = 50;

type TripDetailsScreenRouteProp = RouteProp<RootStackParamList, 'TripDetails'>;

interface TripDetailsScreenProps {
  route: TripDetailsScreenRouteProp;
}

const TripDetailsScreen: React.FC<TripDetailsScreenProps> = ({ route }) => {
  const { tripId, trip_id } = route.params;
  const dispatch = useDispatch();
  const { data: tripData, isLoading } = useGetTripPlanByIdQuery(tripId);
  const [updateTripPlan] = useUpdateTripPlanMutation();
  const theme = useTheme();
  const navigation = useNavigation();
  const descriptionActionSheetRef = useRef<ActionSheetRef>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedDescription, setEditedDescription] = useState('');

  const [statusBarStyle, setStatusBarStyle] =
    useState<StatusBarStyle>('light-content');

  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(50)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.9)).current;

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
    if (tripData?.description) {
      setEditedDescription(tripData.description);
    }
  }, [tripData?.description]);

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

  const handleSaveDescription = async () => {
    if (!tripData) return;

    try {
      await updateTripPlan({
        id: tripData.id,
        data: {
          ...tripData,
          description: editedDescription,
        },
      }).unwrap();
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update description:', error);
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
          <ImageBackground
            source={getImageSource(tripData?.imageUrl as any)}
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
                <TouchableOpacity
                  onPress={() => descriptionActionSheetRef.current?.show()}
                  style={styles.descriptionContainer}>
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
                </TouchableOpacity>
              )}
            </LinearGradient>
          </ImageBackground>
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

        <ActionSheet ref={descriptionActionSheetRef} gestureEnabled>
          <View style={styles.actionSheetContainer}>
            <View style={styles.actionSheetHeader}>
              <View style={styles.titleContainer}>
                <MaterialIcons
                  name="description"
                  size={24}
                  color={theme.colors.primary}
                  style={styles.descriptionIcon}
                />
                <Text style={styles.actionSheetTitle}>Trip Description</Text>
              </View>
              <TouchableOpacity
                onPress={() => setIsEditing(!isEditing)}
                style={styles.editButton}>
                <MaterialIcons
                  name={isEditing ? "check" : "edit"}
                  size={24}
                  color={theme.colors.primary}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.divider} />
            <View style={styles.actionSheetBody}>
              {isEditing ? (
                <TextInput
                  style={styles.descriptionInput}
                  value={editedDescription}
                  onChangeText={setEditedDescription}
                  multiline
                  numberOfLines={8}
                  placeholder="Enter trip description"
                  textAlignVertical="top"
                />
              ) : (
                <Text style={styles.actionSheetDescription}>
                  {tripData?.description}
                </Text>
              )}
            </View>
            {isEditing && (
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveDescription}>
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
            )}
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
  actionSheetContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
  },
  actionSheetHeader: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionSheetTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginHorizontal: 20,
  },
  actionSheetBody: {
    padding: 20,
  },
  descriptionIcon: {
    marginTop: 1,
  },
  actionSheetDescription: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    letterSpacing: 0.3,
  },
  editButton: {
    padding: 4,
  },
  descriptionInput: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    letterSpacing: 0.3,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    minHeight: 200,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
    margin: 20,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default TripDetailsScreen;
