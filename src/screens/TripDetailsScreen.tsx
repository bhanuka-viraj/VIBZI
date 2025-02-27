import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  StatusBar,
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

const HEADER_IMAGE_HEIGHT = 250;

const TripDetailsScreen = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'TripDetails'>>();
  const {tripId, trip_id} = route.params;

  const {data: tripPlan} = useGetTripPlanByIdQuery(tripId);

  const theme = useTheme();
  const navigation = useNavigation();

  const [statusBarStyle, setStatusBarStyle] = useState<
    'light-content' | 'dark-content'
  >('light-content');

  const parsedFromDate = tripPlan?.startDate
    ? new Date(tripPlan.startDate)
    : null;
  const parsedToDate = tripPlan?.endDate ? new Date(tripPlan.endDate) : null;

  const formattedFromDate = parsedFromDate
    ? dayjs(parsedFromDate).format('MMM D')
    : 'Start Date';
  const formattedToDate = parsedToDate
    ? dayjs(parsedToDate).format('MMM D')
    : 'End Date';


  const goBack = () => {
    navigation.goBack();
  };

  return (
    <>
      <StatusBar
        barStyle={statusBarStyle}
        translucent
        backgroundColor="transparent"
      />
      <View style={{flex: 1, backgroundColor: 'white'}}>
        <ImageBackground
          source={getImageSource(tripPlan?.imageUrl as any)}
          style={styles.imageBackground}>
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
              {tripPlan?.title}
            </Text>
            <Text variant="bodyMedium" style={styles.tripDetails}>
              {formattedFromDate} - {formattedToDate} •{' '}
              {tripPlan?.destinationName} {''}
              <MaterialIcons
                name="location-on"
                size={13}
                color={theme.colors.surface}
              />
            </Text>
          </LinearGradient>
        </ImageBackground>

        <View style={[styles.content, {overflow: 'hidden'}]}>
          <TripDetailsTabNavigator
            screenProps={{
              tripId,
              trip_id,
            }}
          />
        </View>
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
  content: {
    flex: 1,
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
