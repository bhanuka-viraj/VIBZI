import React, {useState, useEffect} from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  StatusBar,
  StatusBarStyle,
  Animated,
  Easing,
} from 'react-native';
import {Text, useTheme} from 'react-native-paper';
import LinearGradient from 'react-native-linear-gradient';
import dayjs from 'dayjs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import TripDetailsTabNavigator from '../navigation/TripDetailsTabNavigator';
import {useNavigation, useRoute, RouteProp} from '@react-navigation/native';
import {RootStackParamList} from '../navigation/AppNavigator';
import {useGetTripPlanByIdQuery} from '../redux/slices/tripplan/tripPlanSlice';
import {getImageSource} from '../utils/tripUtils/tripDataUtil';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import LoadingScreen from '../components/LoadingScreen';
import {useDispatch} from 'react-redux';
import {setTripId} from '../redux/slices/metaSlice';
import {StatusBarStyles, getStatusBarGradient} from '../utils/statusBarUtils';

const HEADER_IMAGE_HEIGHT = 200;

type TripDetailsScreenRouteProp = RouteProp<RootStackParamList, 'TripDetails'>;

interface TripDetailsScreenProps {
  route: TripDetailsScreenRouteProp;
}

const TripDetailsScreen: React.FC<TripDetailsScreenProps> = ({route}) => {
  const {tripId, trip_id} = route.params;
  const dispatch = useDispatch();
  const {data: tripData, isLoading} = useGetTripPlanByIdQuery(tripId);
  const theme = useTheme();
  const navigation = useNavigation();

  const [statusBarStyle, setStatusBarStyle] =
    useState<StatusBarStyle>('light-content');

  // Animation values
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

  useEffect(() => {
    if (tripData) {
      dispatch(setTripId(tripData?.tripId));
    }
  }, [tripData, dispatch]);

  // Start animations when component mounts
  useEffect(() => {
    Animated.parallel([
      // Fade in header image
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      // Slide up content
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      // Scale up buttons
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

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <StatusBar
        barStyle={statusBarStyle}
        translucent
        backgroundColor="transparent"
      />
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <Animated.View style={{opacity: fadeAnim}}>
          <ImageBackground
            source={getImageSource(tripData?.imageUrl as any)}
            style={styles.imageBackground}>
            {/* Add a top gradient for better status bar visibility */}
            <LinearGradient
              colors={getStatusBarGradient()}
              style={styles.statusBarGradient}
              pointerEvents="none"
            />
            <TouchableOpacity style={styles.backButton} onPress={goBack}>
              <Ionicons
                name="chevron-back-outline"
                size={25}
                color={theme.colors.surface}
              />
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
            </LinearGradient>
          </ImageBackground>
        </Animated.View>

        <Animated.View
          style={[
            styles.content,
            {
              transform: [{translateY: slideAnim}, {scale: scaleAnim}],
            },
          ]}>
          <TripDetailsTabNavigator
            screenProps={{
              tripId,
              trip_id,
            }}
          />
        </Animated.View>
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
    top: StatusBar.currentHeight ? StatusBar.currentHeight + 10 : 40,
    left: 16,
    zIndex: 10,
  },
  tripTitle: {
    color: '#fff',
  },
  tripDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    color: '#ddd',
  },
});

export default TripDetailsScreen;
