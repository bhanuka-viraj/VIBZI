import React, { useRef } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native";
import { theme } from "../constants/theme";
import { Icon } from "react-native-paper";
import { tripCards } from "../constants/data";
import TripCard, { TripCardType } from "../components/cards/TripCard";
import LinearGradient from "react-native-linear-gradient";
import Search from "../components/Search";
import ActionSheet, { ActionSheetRef } from "react-native-actions-sheet";
import CreateTripActionSheet from "../components/actionsheets/CreateTripActionSheet";
import Header from "../components/Header";

const { height } = Dimensions.get("window");

const MyTripsScreen: React.FC = () => {
  const actionSheetRef = useRef<ActionSheetRef>(null);

  return (
    <>
      <Header/>
    <View style={styles.container}>
      <Search style={{ marginHorizontal: 12 }} placeholder={"Search your trip"} />
      <View style={styles.btnContainer}>
        <TouchableOpacity style={styles.btn} onPress={() => actionSheetRef.current?.show()}>
          <Icon source={"plus-circle"} size={23} color={theme.colors.primary} />
          <Text style={[theme.fonts.bodyLarge, styles.btnText]}>Create a new trip</Text>
        </TouchableOpacity>
      </View>

      <LinearGradient
        colors={[
          "rgba(255, 255, 255, 1)",
          "rgba(255, 255, 255, 0.9)",
          "rgba(255, 255, 255, 0.7)",
          "rgba(255, 255, 255, 0.5)",
          "rgba(255, 255, 255, 0.3)",
          "rgba(255, 255, 255, 0)",
        ]}
        locations={[0, 0.1, 0.3, 0.5, 0.8, 1]}
        style={styles.gradientOverlay}
      />

      <View style={{ flex: 1, marginTop: 120 }}>
        <FlatList
          data={tripCards}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }) => (
            <View style={[styles.cardContainer, index === 0 && styles.firstCard]}>
              <TripCard trip={item as TripCardType} />
            </View>
          )}
        />
      </View>
      <CreateTripActionSheet actionSheetRef={actionSheetRef} />
    </View>
    </>
  );
};

export default MyTripsScreen;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 25,
    alignItems: "center",
  },
  btnContainer: {
    alignItems: "center",
    position: "absolute",
    width: "100%",
    zIndex: 2,
    top: 130,
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
    top: 235,
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
});
