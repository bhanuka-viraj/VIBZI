import React, { useRef } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { theme } from "../constants/theme";
import { Icon } from "react-native-paper";
import TripCard from "../components/cards/TripCard";
import LinearGradient from "react-native-linear-gradient";
import Search from "../components/Search";
import ActionSheet, { ActionSheetRef } from "react-native-actions-sheet";
import CreateTripActionSheet from "../components/actionsheets/trip/CreateTripActionSheet";
import { useSearchTripPlansQuery } from "../redux/slices/tripPlanSlice";

const MyTripsScreen: React.FC = () => {
  const actionSheetRef = useRef<ActionSheetRef>(null);
  const { data: trips, isLoading, error } = useSearchTripPlansQuery({});

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
        <Text style={styles.emptyText}>Error loading trips</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <View style={styles.container}>
        <Search style={{ marginHorizontal: 12 }} placeholder={"Search your trip"} />
        <View style={styles.btnContainer}>
          <TouchableOpacity 
            style={styles.btn} 
            onPress={() => actionSheetRef.current?.show()}
          >
            <Icon source={"plus-circle"} size={23} color={theme.colors.primary} />
            <Text style={[theme.fonts.bodyLarge, styles.btnText]}>
              Create a new trip
            </Text>
          </TouchableOpacity>
        </View>

        <LinearGradient
          colors={[
            "rgba(255, 255, 255, 1)",
            "rgba(255, 255, 255, 0)",
          ]}
          style={styles.gradientOverlay}
        />

        <View style={{ flex: 1, marginTop: 100 }}>
          <FlatList
            data={trips}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => (
              <View style={[styles.cardContainer, index === 0 && styles.firstCard]}>
                <TripCard
                  trip={{
                    title: item.title,
                    description: item.description,
                    image: "https://picsum.photos/700", // You might want to add image handling
                  }}
                />
              </View>
            )}
            ListEmptyComponent={() => (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No trips found</Text>
                <Text style={styles.emptySubText}>Create your first trip!</Text>
              </View>
            )}
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
    backgroundColor: "white",
    padding: 10,
    alignItems: "center",
  },
  btnContainer: {
    alignItems: "center",
    position: "absolute",
    width: "100%",
    zIndex: 2,
    top: 110,
    paddingHorizontal: 8,
  },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    borderWidth: 2,
    borderColor: theme.colors.primary,
    borderRadius: 20,
    justifyContent: "center",
    height: 70,
    backgroundColor: "white",
  },
  btnText: {
    marginLeft: 10,
    fontSize: 16,
  },
  gradientOverlay: {
    position: "absolute",
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
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
  },
  emptySubText: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
});
