import React, { useState } from "react";
import {
  View,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  StatusBar,
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


  const parsedFromDate = fromDate ? new Date(fromDate) : null;
  const parsedToDate = toDate ? new Date(toDate) : null;

  const formattedFromDate = parsedFromDate
    ? dayjs(parsedFromDate).format("MMM D")
    : "Start Date";
  const formattedToDate = parsedToDate
    ? dayjs(parsedToDate).format("MMM D")
    : "End Date";

  
  const generateDateRange = (fromDate: Date | null, toDate: Date | null) => {
    const dateRange = [];
    if (fromDate && toDate) {
      const start = dayjs(fromDate);
      const end = dayjs(toDate);
      let current = start;
      while (current.isSame(end) || current.isBefore(end)) {
        dateRange.push(current.format("MMM D"));
        current = current.add(1, "day");
      }
    }
    return dateRange;
  };

  const dateRange = generateDateRange(fromDate, toDate);



  const goBack = () => {
    navigation.goBack();
  };

  return (
    <>
      <StatusBar barStyle={statusBarStyle} translucent backgroundColor="transparent" />
      <View style={styles.container}>
        <ImageBackground 
          source={{ uri: "https://picsum.photos/700" }} 
          style={styles.imageBackground}
        >
          <TouchableOpacity style={styles.backButton} onPress={goBack}>
            <Ionicons name="chevron-back-outline" size={25} color={theme.colors.onSurfaceVariant} />
          </TouchableOpacity>
          <LinearGradient 
            colors={["transparent", "rgba(0,0,0,0.8)"]} 
            style={styles.gradientOverlay}
          >
            <Text variant="headlineMedium" style={styles.tripTitle}>{tripName}</Text>
            <Text variant="bodyMedium" style={styles.tripDetails}>
              {formattedFromDate} - {formattedToDate} • {destination}
            </Text>
          </LinearGradient>
        </ImageBackground>

        <View style={[styles.content, { overflow: 'hidden' }]}>
          <TripDetailsTabNavigator
            screenProps={{
              dateRange,
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
    backgroundColor: "white",
  },
  imageBackground: {
    width: "100%",
    height: HEADER_IMAGE_HEIGHT,
    justifyContent: "flex-end",
  },
  content: {
    flex: 1,
  },
  gradientOverlay: {
    padding: 16,
    paddingTop: HEADER_IMAGE_HEIGHT * 0.15,
  },
  backButton: {
    position: "absolute",
    top: StatusBar.currentHeight ? StatusBar.currentHeight + 10 : 40,
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