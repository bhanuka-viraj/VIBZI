import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Text, useTheme, FAB, ActivityIndicator } from 'react-native-paper';
import DraggableFlatList, {
  ScaleDecorator,
  RenderItemParams,
} from 'react-native-draggable-flatlist';
import ItineraryCard from '../../components/cards/ItineraryCard';
import { useGetTripPlanItineraryByIdQuery, useUpdateTripPlanItineraryMutation } from '../../redux/slices/tripplan/itinerary/itinerarySlice';
import {
  parseTripDate,
  parseItineraryData,
  ItineraryItem,
  formatDateDisplay,
} from '../../utils/tripUtils/tripDataUtil';
import { setitinerary, setTripDate } from '../../redux/slices/metaSlice';
import { useDispatch, useSelector } from 'react-redux';
import { THINGSTODO, PLACESTOSTAY, FOODANDDRINK, TRANSPORTATION, NOTE } from '@/constants/ItineraryTypes';
import ConfirmationDialog from '../../components/ConfirmationDialog';
import EmptyState from '../../components/EmptyState';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/AppNavigator';
import { ItineraryStackParamList } from '../../navigation/ItineraryStackNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;
type ItineraryNavigationProp = NativeStackNavigationProp<ItineraryStackParamList>;

interface ItineraryScreenProps {
  tripId: string;
  trip_id: string;
}

const ItineraryScreen: React.FC<ItineraryScreenProps> = ({ tripId, trip_id }) => {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const itineraryNavigation = useNavigation<ItineraryNavigationProp>();
  const [isFabOpen, setIsFabOpen] = useState<boolean>(false);
  const dispatch = useDispatch();
  const [selectedItem, setSelectedItem] = useState<ItineraryItem | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isViewOnly, setIsViewOnly] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<ItineraryItem | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [shouldAnimate, setShouldAnimate] = useState(true);

  const selectedDate = useSelector((state: any) => state.meta.trip.select_date);
  const tripData = useSelector((state: any) => state.meta.trip);
  const itinerary = tripData?.itinerary || null;
  const it_id = itinerary?.id || '';

  const [updateItinerary] = useUpdateTripPlanItineraryMutation();


  const { data, isLoading } = useGetTripPlanItineraryByIdQuery(trip_id as any);
  console.log('data : ', data);
  const { dates, itineraryByDate } = parseItineraryData(data);
  const selectedDateItineraries = itineraryByDate[selectedDate] || [];

  // console.log('====================================');
  // console.log('selectedDateItineraries : ', selectedDateItineraries);
  // console.log('====================================');

  const renderKey = JSON.stringify(selectedDateItineraries);

  const handleCardPress = (item: any) => {
    if (item.type === 'FOODANDDRINK') {
      navigation.navigate('ItineraryStack', {
        screen: 'FoodAndDrink',
        params: {
          isViewOnly: true,
          isUpdating: false,
          initialData: item
        }
      });
    } else if (item.type === 'PLACESTOSTAY') {
      navigation.navigate('ItineraryStack', {
        screen: 'PlaceToStay',
        params: {
          isViewOnly: true,
          isUpdating: false,
          initialData: item
        }
      });
    } else if (item.type === 'TRANSPORTATION') {
      navigation.navigate('ItineraryStack', {
        screen: 'Transportation',
        params: {
          isViewOnly: true,
          isUpdating: false,
          initialData: item
        }
      });
    } else if (item.type === 'NOTE') {
      navigation.navigate('ItineraryStack', {
        screen: 'Note',
        params: {
          isViewOnly: true,
          isUpdating: false,
          initialData: item
        }
      });
    } else {
      navigation.navigate('ItineraryStack', {
        screen: 'ItineraryDetails',
        params: { item }
      });
    }
  };

  const handleUpdate = (item: any) => {
    setSelectedItem(item);
    setIsUpdating(true);
    setIsViewOnly(false);

    switch (item.type) {
      case THINGSTODO:
        navigation.navigate('ItineraryStack', {
          screen: 'ThingsToDo',
          params: {
            isViewOnly: false,
            isUpdating: true,
            initialData: item
          }
        });
        break;
      case PLACESTOSTAY:
        navigation.navigate('ItineraryStack', {
          screen: 'PlaceToStay',
          params: {
            isViewOnly: false,
            isUpdating: true,
            initialData: item
          }
        });
        break;
      case FOODANDDRINK:
        navigation.navigate('ItineraryStack', {
          screen: 'FoodAndDrink',
          params: {
            isViewOnly: false,
            isUpdating: true,
            initialData: item
          }
        });
        break;
      case TRANSPORTATION:
        navigation.navigate('ItineraryStack', {
          screen: 'Transportation',
          params: {
            isViewOnly: false,
            isUpdating: true,
            initialData: item
          }
        });
        break;
      case NOTE:
        navigation.navigate('ItineraryStack', {
          screen: 'Note',
          params: {
            isViewOnly: false,
            isUpdating: true,
            initialData: item
          }
        });
        break;
    }
  };

  const handleDelete = async (item: ItineraryItem) => {
    if (!selectedDate || !itinerary) return;

    try {
      const updatedItinerary = {
        ...itinerary,
        itinerary: {
          ...itinerary.itinerary,
          [selectedDate]: itinerary.itinerary[selectedDate].filter(
            (i: ItineraryItem) => i.position !== item.position
          ),
        },
      };
      await updateItinerary({ id: it_id, data: updatedItinerary }).unwrap();
      setIsUpdating(false);
      setSelectedItem(null);
      Toast.show({
        type: 'delete',
        text1: 'Item Deleted',
        text2: `${item.details.title} has been removed from your itinerary`,
        position: 'bottom',
        visibilityTime: 3000,
      });
    } catch (error) {
      console.log('Error deleting item:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to delete item',
        position: 'bottom',
        visibilityTime: 3000,
      });
    }
  };

  const handleAddNewItem = (type?: string) => {
    switch (type) {
      case THINGSTODO:
        navigation.navigate('ItineraryStack', {
          screen: 'ThingsToDo',
          params: {
            isViewOnly: false,
            isUpdating: false,
            initialData: null
          }
        });
        break;
      case FOODANDDRINK:
        navigation.navigate('ItineraryStack', {
          screen: 'FoodAndDrink',
          params: {
            isViewOnly: false,
            isUpdating: false,
            initialData: null
          }
        });
        break;
      case PLACESTOSTAY:
        navigation.navigate('ItineraryStack', {
          screen: 'PlaceToStay',
          params: {
            isViewOnly: false,
            isUpdating: false,
            initialData: null
          }
        });
        break;
      case TRANSPORTATION:
        navigation.navigate('ItineraryStack', {
          screen: 'Transportation',
          params: {
            isViewOnly: false,
            isUpdating: false,
            initialData: null
          }
        });
        break;
      case NOTE:
        navigation.navigate('ItineraryStack', {
          screen: 'Note',
          params: {
            isViewOnly: false,
            isUpdating: false,
            initialData: null
          }
        });
        break;
    }
    setIsFabOpen(false);
  };

  const handleDeletePress = (item: ItineraryItem) => {
    setItemToDelete(item);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;
    await handleDelete(itemToDelete);
    setItemToDelete(null);
  };

  const handleDragEnd = async ({ data }: { data: ItineraryItem[] }) => {
    setShouldAnimate(false);
    try {
      const updatedItinerary = {
        ...itinerary,
        itinerary: {
          ...itinerary.itinerary,
          [selectedDate]: data,
        },
      };
      await updateItinerary({ id: it_id, data: updatedItinerary }).unwrap();
      Toast.show({
        type: 'success',
        text1: 'Itinerary Updated',
        text2: 'Items have been reordered successfully',
        position: 'bottom',
        visibilityTime: 3000,
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to update itinerary order',
        position: 'bottom',
        visibilityTime: 3000,
      });
    }
  };

  useEffect(() => {
    if (dates.length > 0 && isInitialLoad) {
      dispatch(setTripDate(dates[0]));
      setIsInitialLoad(false);
    }
    if (data) {
      dispatch(setitinerary(data));
    }
  }, [data, dates, dispatch, isInitialLoad]);

  const renderItem = ({ item, drag, isActive }: RenderItemParams<ItineraryItem>) => {
    return (
      <ScaleDecorator activeScale={1.05}>
        <ItineraryCard
          key={`${selectedDate}-${item.position}`}
          item={item}
          onUpdate={handleUpdate}
          onDelete={() => handleDeletePress(item)}
          onPress={handleCardPress}
          onLongPress={drag}
          isActive={isActive}
          shouldAnimate={shouldAnimate}
        />
      </ScaleDecorator>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container]} key={renderKey}>
      <View style={styles.datesWrapper}>
        <FlatList
          horizontal
          data={dates}
          keyExtractor={item => item}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.datePill,
                item === selectedDate && {
                  backgroundColor: theme.colors.primary,
                },
              ]}
              onPress={() => {
                setShouldAnimate(true);
                dispatch(setTripDate(item));
              }}>
              <Text
                style={[
                  styles.dateText,
                  item === selectedDate && { color: theme.colors.onPrimary },
                ]}>
                {parseTripDate(item)}
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.datesContainer}
        />
      </View>

      <View style={{ paddingHorizontal: 10 }}>
        <Text variant="titleMedium" style={styles.dayHeader}>
          {formatDateDisplay(selectedDate)}
        </Text>
      </View>

      <View style={styles.itineraryContainer}>
        {selectedDateItineraries.length === 0 ? (
          <EmptyState
            icon="calendar-plus"
            title="No Plans Yet"
            date={formatDateDisplay(selectedDate)}
            description="Tap the + button below to add your first activity"
          />
        ) : (
          <DraggableFlatList
            data={selectedDateItineraries}
            onDragEnd={handleDragEnd}
            keyExtractor={(item) => `${selectedDate}-${item.position}`}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 80, paddingHorizontal: 10 }}
          />
        )}
      </View>

      <FAB.Group
        visible={true}
        open={isFabOpen}
        icon={isFabOpen ? 'close' : 'plus'}
        color="white"
        fabStyle={{
          backgroundColor: theme.colors.primary,
          bottom: 20,
          elevation: 0,
          shadowColor: 'transparent',
        }}
        actions={[
          {
            icon: 'format-list-bulleted',
            label: 'Add Things To Do',
            onPress: () => handleAddNewItem(THINGSTODO),
            style: {
              elevation: 0,
              shadowColor: 'transparent',
              backgroundColor: theme.colors.surface,
            },
          },
          {
            icon: 'home',
            label: 'Add a Place to Stay',
            onPress: () => handleAddNewItem(PLACESTOSTAY),
            style: {
              elevation: 0,
              shadowColor: 'transparent',
              backgroundColor: theme.colors.surface,
            },
          },
          {
            icon: 'silverware-fork-knife',
            label: 'Add Food & Drink',
            onPress: () => handleAddNewItem(FOODANDDRINK),
            style: {
              elevation: 0,
              shadowColor: 'transparent',
              backgroundColor: theme.colors.surface,
            },
          },
          {
            icon: 'car',
            label: 'Add Transportation',
            onPress: () => handleAddNewItem(TRANSPORTATION),
            style: {
              elevation: 0,
              shadowColor: 'transparent',
              backgroundColor: theme.colors.surface,
            },
          },
          {
            icon: 'note-plus',
            label: 'Add a Note',
            onPress: () => handleAddNewItem(NOTE),
            style: {
              elevation: 0,
              shadowColor: 'transparent',
              backgroundColor: theme.colors.surface,
            },
          },
        ]}
        onStateChange={({ open }) => setIsFabOpen(open)}
      />

      <ConfirmationDialog
        visible={!!itemToDelete}
        onDismiss={() => setItemToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Item"
        message="Are you sure you want to delete this item?"
        confirmText="Delete"
        cancelText="Cancel"
        confirmButtonStyle="danger"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 10,
  },
  scrollContainer: {
    flex: 1,
  },
  datesWrapper: {
    paddingVertical: 10,
  },
  datesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 8,
    paddingTop: 10,
  },
  datePill: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
  },
  dateText: {
    color: '#666',
    fontSize: 14,
    fontWeight: 'bold',
  },
  dayHeader: {
    marginBottom: 12,
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
  },
  itineraryContainer: {
    flex: 1,
    marginBottom: 28,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

export default ItineraryScreen;
