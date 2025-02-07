import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  FlatList,
  StatusBar,
  SafeAreaView,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { Text, useTheme, Card } from "react-native-paper";
import LinearGradient from "react-native-linear-gradient";
import dayjs from "dayjs";
import Ionicons from "react-native-vector-icons/Ionicons";
import TripDetailsTabNavigator from "../navigation/TripDetailsTabNavigator";
import { useNavigation } from "@react-navigation/native";

const HEADER_IMAGE_HEIGHT = 250;

interface TripDetailsScreenProps {
  route: {
    params: {
      tripName: string;
      destination: string;
      fromDate: Date | null;
      toDate: Date | null;
    };
  };
}

const TripDetailsScreen = ({ route }: TripDetailsScreenProps) => {
  const theme = useTheme();
  const { tripName, destination, fromDate, toDate } = route.params;
  const navigation = useNavigation();

  const [statusBarStyle, setStatusBarStyle] = useState<"light-content" | "dark-content">("dark-content");

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    // Handle scroll logic here
  };

  const parsedFromDate = fromDate ? new Date(fromDate) : null;
  const parsedToDate = toDate ? new Date(toDate) : null;

  const formattedFromDate = parsedFromDate
    ? dayjs(parsedFromDate).format("MMM D")
    : "Start Date";
  const formattedToDate = parsedToDate
    ? dayjs(parsedToDate).format("MMM D")
    : "End Date";

  const generateDateRange = (start: Date | null, end: Date | null) => {
    if (!start || !end) return [];
    const dates = [];
    let currentDate = dayjs(start);
    while (currentDate.isBefore(dayjs(end))) {
      dates.push(currentDate.format("MMM D"));
      currentDate = currentDate.add(1, "day");
    }
    dates.push(dayjs(end).format("MMM D")); 
    return dates;
  };

  const dateRange = generateDateRange(fromDate, toDate);

  const activities = [
    {
      time: "9:00 AM",
      title: "Beach Visit",
      location: "Maya Bay, Thailand",
      image: "https://picsum.photos/705",
      date: "Feb 7",
    },
    {
      time: "12:30 PM",
      title: "Lunch at Seaview",
      location: "Phi Phi Islands, Thailand",
      date: "Feb 7",
    },
    {
      time: "7:00 PM",
      title: "Dinner by the Bay",
      location: "Patong Beach, Thailand",
      duration: "June 13 - June 15",
      date: "June 12",
    },
  ];

  const goBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.safeArea}>
      <StatusBar barStyle={statusBarStyle} translucent backgroundColor="transparent" />
      <View
        style={styles.container}
      // onScroll={handleScroll}
      // scrollEventThrottle={16}
      >
        <ImageBackground source={{ uri: "https://picsum.photos/700" }} style={styles.imageBackground}>
          <TouchableOpacity style={styles.backButton} onPress={goBack}>
            <Ionicons name="chevron-back-outline" size={25} color={theme.colors.onSurfaceVariant} />
          </TouchableOpacity>
          <LinearGradient colors={["transparent", "rgba(0,0,0,0.8)"]} style={styles.gradientOverlay}>
            <Text variant="headlineMedium" style={styles.tripTitle}>{tripName}</Text>
            <Text variant="bodyMedium" style={styles.tripDetails}>
              {formattedFromDate} - {formattedToDate} • {destination}
            </Text>
          </LinearGradient>
        </ImageBackground>

        <View style={{ flex: 1 }}>
          <TripDetailsTabNavigator
            screenProps={{
              dateRange,
              activities,
            }}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  imageBackground: {
    width: "100%",
    height: HEADER_IMAGE_HEIGHT,
    justifyContent: "flex-end",
  },
  gradientOverlay: {
    padding: 16,
    paddingTop: HEADER_IMAGE_HEIGHT * 0.15,
  },
  backButton: {
    position: "absolute",
    top: '15%',
    left: 16,
    zIndex: 10,
  },
  tripTitle: {
    color: "#fff",
  },
  tripDetails: {
    color: "#ddd",
  },
});

export default TripDetailsScreen;