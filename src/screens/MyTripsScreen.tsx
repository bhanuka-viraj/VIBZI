import React, {useEffect, useRef, useState} from 'react';
import {
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import {theme} from '../constants/theme';
import {Icon} from 'react-native-paper';
import TripCard from '../components/cards/TripCard';
import LinearGradient from 'react-native-linear-gradient';
import Search from '../components/Search';
import {ActionSheetRef} from 'react-native-actions-sheet';
import CreateTripActionSheet from '../components/actionsheets/trip/CreateTripActionSheet';
import {useSearchTripPlansQuery} from '../redux/slices/tripplan/tripPlanSlice';
import {Text} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from '../redux/store';
import {parseTrips} from '../utils/tripUtils/tripDataUtil';
import {setTrip_Id, setTripId} from '../redux/slices/metaSlice';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {RootStackParamList} from '../navigation/AppNavigator';

const MyTripsScreen: React.FC = () => {
  const actionSheetRef = useRef<ActionSheetRef>(null);
  const {user} = useSelector((state: RootState) => state.auth);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dispatch = useDispatch();

  const {
    data: trips,
    isLoading,
    error,
  } = useSearchTripPlansQuery(
    user?.userId
      ? {
          userId: user?.userId,
          title: '',
          destinationName: '',
          page: 0,
          size: 10,
        }
      : {},
  );

  console.log('Trips:', JSON.stringify(trips, null, 2));

  const tripData = parseTrips(trips);

  console.log('trips data : ', tripData);

  useEffect(() => {
    if (tripData && tripData.length > 0) {
      console.log('Setting trip IDs:', tripData[0].id, tripData[0].tripId);
      dispatch(setTripId(tripData[0].id));
      dispatch(setTrip_Id(tripData[0].tripId));
    }
  }, [tripData, dispatch]);

  const handleOnPress = (id: string, trip_id: string) => {
    console.log('Handling press with IDs:', id, trip_id);
    dispatch(setTripId(id));
    dispatch(setTrip_Id(trip_id));

    navigation.push('TripDetails', {
      tripId: id,
      trip_id: trip_id,
    });
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.emptyContainer}>
        <Icon source="alert-circle" size={50} color={theme.colors.error} />
        <Text variant="headlineSmall" style={styles.emptyText}>
          Error loading trips
        </Text>
        <Text variant="bodyLarge" style={styles.emptySubText}>
          Please try again later
        </Text>
      </View>
    );
  }

  const EmptyTripsView = () => (
    <View style={styles.emptyContainer}>
      <Icon source="bag-suitcase" size={80} color={theme.colors.primary} />
      <Text variant="headlineSmall" style={[styles.emptyText]}>
        No Trip Plans Yet
      </Text>
      <Text variant="bodyLarge" style={[styles.emptySubText]}>
        Start planning your next adventure!
      </Text>
    </View>
  );

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <View style={styles.container}>
        <Search
          style={{marginHorizontal: 12}}
          placeholder={'Search your trip'}
        />
        <View style={styles.btnContainer}>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => actionSheetRef.current?.show()}>
            <Icon
              source={'plus-circle'}
              size={23}
              color={theme.colors.primary}
            />
            <Text variant="bodyLarge" style={styles.btnText}>
              Create a new trip
            </Text>
          </TouchableOpacity>
        </View>

        <LinearGradient
          colors={['rgba(255, 255, 255, 1)', 'rgba(255, 255, 255, 0)']}
          style={styles.gradientOverlay}
        />

        <View style={{flex: 1, marginTop: 100}}>
          <FlatList
            data={tripData}
            showsVerticalScrollIndicator={false}
            renderItem={({item, index}) => (
              <View
                style={[styles.cardContainer, index === 0 && styles.firstCard]}>
                <TripCard
                  trip={{
                    id: item.id,
                    tripId: item.tripId,
                    title: item.title,
                    description: item.description,
                    image: item.image,
                  }}
                  onPress={(id, tripId) => handleOnPress(id, tripId)}
                />
              </View>
            )}
            ListEmptyComponent={EmptyTripsView}
          />
        </View>
        <CreateTripActionSheet actionSheetRef={actionSheetRef} />
      </View>
    </View>
  );
};

export default MyTripsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 10,
    alignItems: 'center',
  },
  btnContainer: {
    alignItems: 'center',
    position: 'absolute',
    width: '100%',
    zIndex: 2,
    top: 110,
    paddingHorizontal: 8,
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderWidth: 2,
    borderColor: theme.colors.primary,
    borderRadius: 20,
    justifyContent: 'center',
    height: 70,
    backgroundColor: 'white',
  },
  btnText: {
    marginLeft: 10,
    color: theme.colors.primary,
  },
  gradientOverlay: {
    position: 'absolute',
    top: 200,
    left: 0,
    right: 0,
    height: 10,
    zIndex: 1,
  },
  cardContainer: {
    marginBottom: 10,
  },
  firstCard: {
    marginTop: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
    paddingHorizontal: 20,
  },
  emptyText: {
    color: theme.colors.primary,
    marginTop: 20,
  },
  emptySubText: {
    color: theme.colors.secondary,
    marginTop: 8,
    textAlign: 'center',
    marginBottom: 30,
  },
  emptyStateButton: {
    width: '80%',
    marginTop: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});
