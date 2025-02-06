import React, { useState } from "react";
import { View, StyleSheet } from "react-native";
import { Calendar, DateData } from "react-native-calendars";

interface DateRangePickerProps {
    onSelectRange: (from: string | null, to: string | null) => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({ onSelectRange }) => {
    const [selectedRange, setSelectedRange] = useState<{ from: string | null; to: string | null }>({
        from: null,
        to: null,
    });

    const onDayPress = (day: DateData) => {
        if (!selectedRange.from || (selectedRange.from && selectedRange.to)) {
            setSelectedRange({ from: day.dateString, to: null });
        } else {
            setSelectedRange({ ...selectedRange, to: day.dateString });
            onSelectRange(selectedRange.from, day.dateString);
        }
    };

    const getMarkedDates = () => {
        let markedDates: any = {};
        if (selectedRange.from) {
            markedDates[selectedRange.from] = { startingDay: true, color: "#02302e", textColor: "white" };

            if (selectedRange.to) {
                let currentDate = new Date(selectedRange.from);
                const endDate = new Date(selectedRange.to);

                while (currentDate <= endDate) {
                    let dateString = currentDate.toISOString().split("T")[0];
                    markedDates[dateString] = {
                        color: "#b3b3b3",
                        textColor: "black",
                    };
                    currentDate.setDate(currentDate.getDate() + 1);
                }

                markedDates[selectedRange.to] = { endingDay: true, color: "#02302e", textColor: "white" };
            }
        }
        return markedDates;
    };

    return (
        <View style={styles.container}>
            <Calendar
                markingType="period"
                markedDates={getMarkedDates()}
                onDayPress={onDayPress}
                theme={{
                    backgroundColor: "white",
                    calendarBackground: "white",
                    selectedDayBackgroundColor: "#02302e",
                    selectedDayTextColor: "white",
                    todayTextColor: "#02302e",
                    arrowColor: "#02302e",
                }}
            />
        </View>
    );
};

export default DateRangePicker;

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
        borderWidth: 1,
        borderColor: "gray",
        borderRadius: 10,
        padding: 5,
    },
});
